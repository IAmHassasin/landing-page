// Page-wide progressive enhancements. Everything here is optional: without JS the page is
// complete and readable, with every section visible and clips playable via native controls.

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

function markScrolled(): void {
  document.documentElement.toggleAttribute('data-scrolled', window.scrollY > 8);
}

function setupReveal(): void {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const pending = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter(
    // Only hide what starts below the fold, so the first screen never flashes.
    (element) => element.getBoundingClientRect().top > window.innerHeight,
  );
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.replace('reveal-pending', 'reveal-done');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  for (const element of pending) {
    element.classList.add('reveal-pending');
    observer.observe(element);
  }
}

function setupCountUp(): void {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const DURATION_MS = 900;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const element = entry.target as HTMLElement;
      const target = Number(element.dataset.countTo);
      if (!Number.isFinite(target)) continue;
      const start = performance.now();
      const tick = (now: number): void => {
        const progress = Math.min((now - start) / DURATION_MS, 1);
        const eased = 1 - (1 - progress) ** 3;
        element.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  });
  document.querySelectorAll<HTMLElement>('[data-count-to]').forEach((element) => {
    observer.observe(element);
  });
}

function setupTimelineRail(): void {
  const timeline = document.querySelector<HTMLElement>('[data-timeline]');
  if (!timeline || reducedMotion.matches) return;
  let queued = false;
  const update = (): void => {
    queued = false;
    const rect = timeline.getBoundingClientRect();
    const reference = window.innerHeight * 0.6;
    const progress = Math.min(Math.max((reference - rect.top) / rect.height, 0), 1);
    timeline.style.setProperty('--rail-progress', `${(progress * 100).toFixed(1)}%`);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

function setupProjectFilter(): void {
  const group = document.querySelector<HTMLElement>('[data-project-filters]');
  const list = document.querySelector<HTMLElement>('[data-project-list]');
  if (!group || !list) return;
  group.hidden = false;
  const buttons = [...group.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const cards = [...list.querySelectorAll<HTMLElement>('[data-category]')];

  group.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (!button) return;
    const filter = button.dataset.filter;
    for (const candidate of buttons) {
      candidate.setAttribute('aria-pressed', String(candidate === button));
    }
    let visibleIndex = 0;
    for (const card of cards) {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) card.dataset.side = visibleIndex++ % 2 === 0 ? 'start' : 'end';
      // Filtered-in cards should not wait for a reveal that may never be triggered.
      if (visible) card.classList.replace('reveal-pending', 'reveal-done');
    }
  });
}

function setupPromoVideos(): void {
  const videos = [...document.querySelectorAll<HTMLVideoElement>('[data-promo-video]')];
  if (videos.length === 0) return;
  const onScreen = new Set<HTMLVideoElement>();
  const RETRY_MS = 300;

  const play = (video: HTMLVideoElement): void => {
    video.play().catch(() => {
      // Refused (power saving, data saver): retried on the next interaction or tab focus.
    });
  };

  // Clips are decorative loops with no user control: block the context menu, drag and long-press.
  const block = (event: Event): void => event.preventDefault();
  document.querySelectorAll<HTMLElement>('[data-promo-shield]').forEach((shield) => {
    shield.addEventListener('contextmenu', block);
    shield.addEventListener('dragstart', block);
  });

  for (const video of videos) {
    video.addEventListener('contextmenu', block);
    // Anything else that pauses a visible clip (OS media keys, browser heuristics) gets overridden.
    video.addEventListener('pause', () => {
      if (onScreen.has(video) && !document.hidden) window.setTimeout(() => play(video), RETRY_MS);
    });
  }

  const playVisible = (): void => onScreen.forEach(play);
  document.addEventListener('pointerdown', playVisible, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) playVisible();
  });

  if (!('IntersectionObserver' in window)) {
    videos.forEach((video) => {
      onScreen.add(video);
      play(video);
    });
    return;
  }

  // Play while on screen, pause off screen to save battery; this also defers each download.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          onScreen.add(video);
          play(video);
        } else {
          onScreen.delete(video);
          video.pause();
        }
      }
    },
    { threshold: 0.25 },
  );
  videos.forEach((video) => observer.observe(video));
}

function setupCover(): void {
  const cover = document.querySelector<HTMLElement>('[data-cover]');
  if (!cover) return;
  const READY_FALLBACK_MS = 2500;

  // Release the pixel reveal once the photo of the current theme has loaded.
  const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const photo = cover.querySelector<HTMLImageElement>(`.layer-${theme} img.photo`);
  const markReady = (): void => cover.classList.add('is-ready');
  if (!photo || photo.complete) {
    markReady();
  } else {
    photo.addEventListener('load', markReady, { once: true });
    photo.addEventListener('error', markReady, { once: true });
    window.setTimeout(markReady, READY_FALLBACK_MS);
  }

  // Gentle parallax: the photo scrolls slower than the page while it is in view.
  const layer = cover.querySelector<HTMLElement>('[data-cover-parallax]');
  if (!layer || reducedMotion.matches) return;
  const PARALLAX_RATIO = 0.3;
  let queued = false;
  const update = (): void => {
    queued = false;
    const offset = Math.min(window.scrollY, cover.offsetHeight) * PARALLAX_RATIO;
    layer.style.setProperty('--parallax', `${offset.toFixed(1)}px`);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
}

function setupTilt(): void {
  if (reducedMotion.matches || !finePointer.matches) return;
  const MAX_DEG = 6;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((screen) => {
    const bezel = screen.firstElementChild as HTMLElement | null;
    if (!bezel) return;
    screen.addEventListener('pointermove', (event) => {
      const rect = screen.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      bezel.style.setProperty('--tilt-x', `${(-y * MAX_DEG).toFixed(2)}deg`);
      bezel.style.setProperty('--tilt-y', `${(x * MAX_DEG).toFixed(2)}deg`);
    });
    screen.addEventListener('pointerleave', () => {
      bezel.style.removeProperty('--tilt-x');
      bezel.style.removeProperty('--tilt-y');
    });
  });
}

function setupEmail(): void {
  const link = document.querySelector<HTMLAnchorElement>('[data-email]');
  if (!link) return;
  const { user, domain } = link.dataset;
  if (!user || !domain) return;
  const address = `${user}@${domain}`;
  link.href = `mailto:${address}`;

  const copy = document.querySelector<HTMLButtonElement>('[data-copy-email]');
  if (!copy || !navigator.clipboard) return;
  const originalLabel = copy.textContent ?? '';
  copy.hidden = false;
  copy.addEventListener('click', () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        copy.textContent = copy.dataset.labelCopied ?? originalLabel;
        window.setTimeout(() => {
          copy.textContent = originalLabel;
        }, 1600);
      })
      .catch(() => {
        // Clipboard refused: select the address so the visitor can copy it manually.
        const range = document.createRange();
        range.selectNodeContents(link);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      });
  });
}

markScrolled();
window.addEventListener('scroll', markScrolled, { passive: true });
setupReveal();
setupCountUp();
setupTimelineRail();
setupProjectFilter();
setupPromoVideos();
setupCover();
setupTilt();
setupEmail();
