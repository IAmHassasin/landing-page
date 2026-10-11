"""Build the hero avatar images from the source selfies.

One photo per theme (both are real photos, no recoloring):
  - light theme: input/avatar-light-source.png (black coat and turtleneck)
  - dark theme:  input/avatar-dark-source.png  (grey coat, white turtleneck)

For each source (runs fully locally, no uploads):
  1. crop to head + shoulders (drops most of the phone)
  2. remove the background
  3. mirror horizontally (the sources are mirror selfies)
  4. trim to the subject and place it bottom-aligned on a shared canvas, so both
     variants have the same size and can be stacked for the theme crossfade
  5. align every variant's head onto the first one (feature matching on glasses, eyes and
     hair), so the face does not jump when the theme switches
  6. export WebP variants plus a side-by-side review preview

Usage:
  tools/avatar/.venv/Scripts/python tools/avatar/process_avatar.py
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageOps
from rembg import new_session, remove

TOOL_DIR = Path(__file__).resolve().parent
REPO_ROOT = TOOL_DIR.parent.parent
INPUT_DIR = TOOL_DIR / "input"
DEFAULT_PREVIEW_DIR = TOOL_DIR / "output"
DEFAULT_SITE_DIR = REPO_ROOT / "src" / "assets" / "avatar"

DEFAULT_WIDTH = 960
SUBJECT_PADDING = 0.02

# Head alignment: features are matched only in the top part of the image (the head),
# where the two photos show the same thing; the bodies differ (different coats).
HEAD_FRACTION = 0.55
ALIGN_MIN_INLIERS = 40
ALIGN_REPROJECTION_PX = 6.0
MATCH_RATIO = 0.75

LIGHT_PREVIEW_BG = (255, 255, 255)
DARK_PREVIEW_BG = (13, 17, 20)


@dataclass(frozen=True)
class Variant:
    name: str
    source: Path
    # Crop box as fractions of the source (left, top, right, bottom).
    crop: tuple[float, float, float, float]
    preview_bg: tuple[int, int, int]


VARIANTS = (
    Variant("light", INPUT_DIR / "avatar-light-source.png", (0.33, 0.0, 1.0, 1.0), LIGHT_PREVIEW_BG),
    Variant("dark", INPUT_DIR / "avatar-dark-source.png", (0.30, 0.0, 1.0, 1.0), DARK_PREVIEW_BG),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--site-dir", type=Path, default=DEFAULT_SITE_DIR)
    parser.add_argument("--preview-dir", type=Path, default=DEFAULT_PREVIEW_DIR)
    parser.add_argument("--width", type=int, default=DEFAULT_WIDTH)
    parser.add_argument("--bg-model", default="isnet-general-use", help="rembg model used for background removal")
    parser.add_argument("--no-flip", action="store_true", help="keep the mirror-selfie orientation")
    return parser.parse_args()


def crop_fraction(image: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    width, height = image.size
    left, top, right, bottom = box
    if not (0 <= left < right <= 1 and 0 <= top < bottom <= 1):
        raise ValueError(f"Invalid crop fractions: {box}")
    return image.crop((round(left * width), round(top * height), round(right * width), round(bottom * height)))


def cut_out(variant: Variant, session: object, flip: bool, width: int) -> Image.Image:
    if not variant.source.exists():
        raise FileNotFoundError(f"Missing source photo for the {variant.name} theme: {variant.source}")
    source = ImageOps.exif_transpose(Image.open(variant.source)).convert("RGB")
    cutout = remove(crop_fraction(source, variant.crop), session=session, post_process_mask=True)
    if flip:
        cutout = ImageOps.mirror(cutout)

    # Trim empty space above and beside the subject; the bottom edge stays (the body is cut there).
    left, top, right, _ = cutout.getchannel("A").getbbox() or (0, 0, *cutout.size)
    pad = round(SUBJECT_PADDING * cutout.width)
    trimmed = cutout.crop((max(left - pad, 0), max(top - pad, 0), min(right + pad, cutout.width), cutout.height))
    height = round(trimmed.height * width / trimmed.width)
    return trimmed.resize((width, height), Image.Resampling.LANCZOS)


def on_shared_canvas(images: list[Image.Image]) -> list[Image.Image]:
    """Bottom-align every image on a transparent canvas of the tallest height."""
    height = max(image.height for image in images)
    canvases = []
    for image in images:
        canvas = Image.new("RGBA", (image.width, height), (0, 0, 0, 0))
        canvas.paste(image, (0, height - image.height))
        canvases.append(canvas)
    return canvases


def to_gray(image: Image.Image) -> np.ndarray:
    """Flatten an RGBA cut-out onto mid grey so the transparent area carries no features."""
    flat = Image.new("RGB", image.size, (128, 128, 128))
    flat.paste(image, mask=image.getchannel("A"))
    return cv2.cvtColor(np.asarray(flat), cv2.COLOR_RGB2GRAY)


def align_head(reference: Image.Image, moving: Image.Image) -> Image.Image:
    """Scale/shift `moving` so its head lands on the head in `reference` (same canvas size)."""
    head_rows = round(reference.height * HEAD_FRACTION)
    sift = cv2.SIFT_create()
    ref_points, ref_desc = sift.detectAndCompute(to_gray(reference)[:head_rows], None)
    mov_points, mov_desc = sift.detectAndCompute(to_gray(moving)[:head_rows], None)
    if ref_desc is None or mov_desc is None:
        print("warning: no head features found; variants left unaligned")
        return moving

    pairs = cv2.BFMatcher(cv2.NORM_L2).knnMatch(mov_desc, ref_desc, k=2)
    good = [pair[0] for pair in pairs if len(pair) == 2 and pair[0].distance < MATCH_RATIO * pair[1].distance]
    source = np.float32([mov_points[match.queryIdx].pt for match in good])
    target = np.float32([ref_points[match.trainIdx].pt for match in good])
    if len(good) < ALIGN_MIN_INLIERS:
        print(f"warning: only {len(good)} head matches; variants left unaligned")
        return moving

    # Similarity transform (scale + rotation + shift); RANSAC drops matches on the differing clothes.
    matrix, inliers = cv2.estimateAffinePartial2D(
        source, target, method=cv2.RANSAC, ransacReprojThreshold=ALIGN_REPROJECTION_PX
    )
    if matrix is None or int(inliers.sum()) < ALIGN_MIN_INLIERS:
        print("warning: head alignment not reliable; variants left unaligned")
        return moving

    scale = float(np.hypot(matrix[0, 0], matrix[1, 0]))
    print(
        f"aligned head: {int(inliers.sum())} inliers, scale {scale:.3f}, "
        f"shift ({matrix[0, 2]:.1f}, {matrix[1, 2]:.1f}) px"
    )
    # Resample in premultiplied alpha so transparent pixels cannot bleed into the silhouette edge.
    rgba = np.asarray(moving, dtype=np.float32) / 255.0
    rgba[..., :3] *= rgba[..., 3:4]
    warped = cv2.warpAffine(
        rgba,
        matrix,
        reference.size,
        flags=cv2.INTER_LANCZOS4,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(0, 0, 0, 0),
    )
    warped = np.clip(warped, 0.0, 1.0)
    alpha = warped[..., 3:4]
    warped[..., :3] = np.where(alpha > 1e-4, warped[..., :3] / np.maximum(alpha, 1e-4), 0.0)
    return Image.fromarray((np.clip(warped, 0.0, 1.0) * 255).round().astype(np.uint8), "RGBA")


def save_preview(images: list[Image.Image], backgrounds: list[tuple[int, int, int]], path: Path) -> None:
    preview = Image.new("RGB", (sum(image.width for image in images), images[0].height))
    offset = 0
    for image, background in zip(images, backgrounds):
        tile = Image.new("RGB", image.size, background)
        tile.paste(image, mask=image.getchannel("A"))
        preview.paste(tile, (offset, 0))
        offset += image.width
    preview.save(path)


def main() -> None:
    args = parse_args()
    session = new_session(args.bg_model)
    images = on_shared_canvas([cut_out(variant, session, not args.no_flip, args.width) for variant in VARIANTS])
    images = [images[0], *(align_head(images[0], image) for image in images[1:])]

    args.site_dir.mkdir(parents=True, exist_ok=True)
    args.preview_dir.mkdir(parents=True, exist_ok=True)
    for variant, image in zip(VARIANTS, images):
        image.save(args.site_dir / f"avatar-{variant.name}.webp", quality=90, method=6)
    save_preview(images, [variant.preview_bg for variant in VARIANTS], args.preview_dir / "preview.png")

    print(f"Wrote {len(images)} avatar variants ({images[0].width}x{images[0].height}) to {args.site_dir}")
    print(f"Review preview: {args.preview_dir / 'preview.png'}")


if __name__ == "__main__":
    main()
