# Promo clips — delivery spec

Each project in the landing page's Quest Log shows a short square promo clip next to its description.
Clips are matched to projects **by folder name**. Drop the files in and rebuild; no code change is needed.

## Where files go

```
public/media/projects/<slug>/
  promo.mp4     required  H.264, the clip every browser plays
  promo.webm    optional  VP9 or AV1, smaller; served first when present
  poster.webp   optional  first frame, shown before the clip loads
```

A project with no `promo.mp4` shows an animated "NO SIGNAL" screen instead.

### Slugs

| Slug                    | Project                                                 |
| ----------------------- | ------------------------------------------------------- |
| `pvz-survival-night`    | PvZ: Survival Night                                     |
| `pad-searching-tool`    | PAD Searching Tool                                      |
| `anime-shorts-pipeline` | Anime Shorts Pipeline                                   |
| `portfolio-rpg`         | Portfolio RPG                                           |
| `synthvox`              | synthvox                                                |
| `p2p-streaming-video`   | P2P Streaming Video                                     |
| `dragon-chase`          | Dragon Chase                                            |
| `pad-ai-assistant`      | PAD AI Assistant                                        |
| `easy-animation`        | Easy Animation — **text-only card**, no project footage |

The slug is the file name in `src/content/projects/<locale>/<slug>.md`. A new project needs a Markdown
file in both `en/` and `vi/`.

## Clip format

| Property   | Value                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Aspect     | **1:1**, 1080×1080 (720×720 minimum)                                                              |
| Duration   | Up to ~16 s (current renders are 15.6 s); it **loops** on repeat, so end close to the first frame |
| Audio      | None. Clips always play muted, so strip the track                                                 |
| Frame rate | 30 fps                                                                                            |
| Size       | `promo.mp4` ≤ 2 MB, `promo.webm` ≤ 1.5 MB                                                         |
| Safe area  | Keep text and key action inside the central 90%: the screen has rounded corners and scanlines     |
| Look       | Shown on a dark "handheld console" screen in both themes; dark or saturated footage reads best    |

Clips always autoplay, muted and looping, whenever they are on screen (they pause off screen and never
preload). There are no controls: a transparent layer over each clip swallows clicks, long-press and the
context menu.

## Encoding

```sh
# MP4 (required): H.264, no audio, web-optimised
ffmpeg -i master.mov -an -vf "scale=1080:1080:flags=lanczos,fps=30" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart promo.mp4

# WebM (optional): VP9
ffmpeg -i master.mov -an -vf "scale=1080:1080:flags=lanczos,fps=30" \
  -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 promo.webm

# Poster (optional): first frame
ffmpeg -i promo.mp4 -frames:v 1 -c:v libwebp -quality 82 poster.webp
```

## Import rendered clips

Rendered masters live in `docs/promo-video/` as `<NN>-<slug>.mp4`. Import them (re-encode, WebM, poster):

```sh
npm run media:import -- docs/promo-video
```

## Check before committing

```sh
npm run media:status
```

It lists every project, which files it has, and warns about missing MP4s, oversized files, and clips
that are not square (when `ffprobe` is installed).
