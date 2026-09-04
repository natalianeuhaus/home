(() => {
  const html = document.documentElement;
  const page = document.querySelector('.burlesque-page');
  const scroller = document.querySelector('.burlesque-horizontal');
  const film = document.querySelector('.burlesque-film');
  const stage = film?.querySelector('.burlesque-stage');
  const collections = document.querySelector('.burlesque-collections');
  const enterButton = document.querySelector('.burlesque-enter-series');
  if (!page || !scroller || !film || !stage || !collections) return;

  const backstoryTrigger = document.querySelector("[data-burlesque-backstory-open]");
  const backstoryDialog = document.querySelector(".burlesque-backstory");
  const backstoryClose = backstoryDialog?.querySelector("[data-burlesque-backstory-close]");
  const introCopy = page.querySelector(".burlesque-intro-copy");
  const copyrightFooter = page.querySelector(".project-copyright-footer--overlay");
  const mobileEnding = window.matchMedia("(max-width: 760px)");

  const placeBurlesqueEnding = () => {
    if (!introCopy || !backstoryTrigger || !backstoryDialog || !copyrightFooter) return;
    if (mobileEnding.matches) {
      backstoryTrigger.classList.add("burlesque-mobile-ending");
      copyrightFooter.classList.add("burlesque-mobile-ending");
      introCopy.append(backstoryTrigger, copyrightFooter);
      return;
    }
    backstoryTrigger.classList.remove("burlesque-mobile-ending");
    copyrightFooter.classList.remove("burlesque-mobile-ending");
    page.append(copyrightFooter);
    backstoryDialog.before(backstoryTrigger);
  };

  placeBurlesqueEnding();
  if (typeof mobileEnding.addEventListener === "function") {
    mobileEnding.addEventListener("change", placeBurlesqueEnding);
  } else {
    mobileEnding.addListener(placeBurlesqueEnding);
  }

  let backstoryPreviousOverflow = "";

  const closeBackstory = () => {
    if (!backstoryDialog || !backstoryTrigger) return;
    backstoryDialog.classList.remove("is-visible");
    backstoryDialog.setAttribute("aria-hidden", "true");
    backstoryTrigger.setAttribute("aria-expanded", "false");
    html.style.overflow = backstoryPreviousOverflow;
    window.setTimeout(() => {
      if (!backstoryDialog.classList.contains("is-visible")) backstoryDialog.hidden = true;
    }, 480);
    backstoryTrigger.focus();
  };

  backstoryTrigger?.addEventListener("click", () => {
    if (!backstoryDialog || !backstoryClose) return;
    backstoryPreviousOverflow = html.style.overflow;
    backstoryDialog.hidden = false;
    backstoryDialog.setAttribute("aria-hidden", "false");
    backstoryTrigger.setAttribute("aria-expanded", "true");
    html.style.overflow = "hidden";
    requestAnimationFrame(() => {
      backstoryDialog.classList.add("is-visible");
      backstoryClose.focus();
    });
  });
  backstoryClose?.addEventListener("click", closeBackstory);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && backstoryDialog?.classList.contains("is-visible")) closeBackstory();
  });

  const localSlides = Array.from({ length: 37 }, (_, index) => {
    const number = index + 1;
    const src = `images/Natalia_Neuhaus-${number}.jpg`;
    return {
      src,
      full: src,
      alt: `Burlesque Mon Amour photograph ${number}`,
      width: 1200,
      height: 800
    };
  });

  const blackAndWhiteSlides = [
    {
      src: 'images-black-and-white/Natalia_Neuhaus-1.webp',
      full: 'images-black-and-white/Natalia_Neuhaus-1.webp',
      alt: 'Black-and-white Burlesque Mon Amour photograph 1',
      width: 2048,
      height: 1365
    }
  ];

  function installProgressStyles() {
    if (document.getElementById('burlesque-progress-styles')) return;
    const style = document.createElement('style');
    style.id = 'burlesque-progress-styles';
    style.textContent = `
      .burlesque-progress{--progress:0;position:absolute;z-index:8;left:0;bottom:0;width:100%;height:1px;background:#15171570;transform:scaleX(var(--progress));transform-origin:0;transition:transform .8s cubic-bezier(.22,1,.36,1);pointer-events:none}
      .burlesque-lightbox-status{z-index:3;position:absolute;right:28px;bottom:24px;display:flex;align-items:center;gap:18px;color:rgba(241,239,231,.54);letter-spacing:.18em;font:9px/1.4 Arial,Helvetica,sans-serif;font-variant-numeric:tabular-nums}
      .burlesque-lightbox .burlesque-lightbox-first{position:static;color:rgba(241,239,231,.54);background:transparent;border:0;padding:0;letter-spacing:.18em;font:inherit;cursor:pointer;transition:color .25s ease}
      .burlesque-lightbox .burlesque-lightbox-first:hover,.burlesque-lightbox .burlesque-lightbox-first:focus-visible{color:#f1efe7;opacity:1}
      .burlesque-lightbox-counter{pointer-events:none}
      @media (max-width:760px){.burlesque-lightbox-status{right:16px;bottom:14px;gap:14px}}
      @media (prefers-reduced-motion:reduce){.burlesque-progress{transition:none}}
    `;
    document.head.append(style);
  }

  function preloadPhotograph(slide, index) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.fetchPriority = index < 3 ? 'high' : 'auto';
      image.onload = async () => {
        try { await image.decode(); } catch (_) {}
        resolve(slide);
      };
      image.onerror = () => reject(new Error(`Could not preload ${slide.src}`));
      image.src = slide.src;
    });
  }

  async function loadSlides() {
    await Promise.all([
      preloadPhotograph(localSlides[0], 0),
      preloadPhotograph(blackAndWhiteSlides[0], 0)
    ]);
    return localSlides;
  }

  function createLightbox(slides, startIndex, triggerImage, options = {}) {
    let activeIndex = startIndex;
    const previousOverflow = html.style.overflow;
    const requestBrowserFullscreen = Boolean(options.requestBrowserFullscreen);
    const dialog = document.createElement('div');
    dialog.className = 'intermission-lightbox burlesque-lightbox';
    if (slides.length === 1) dialog.classList.add('is-single-slide');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    const close = document.createElement('button');
    close.className = 'intermission-lightbox-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Close fullscreen slideshow');
    close.textContent = '×';

    const previous = document.createElement('button');
    previous.className = 'intermission-lightbox-arrow intermission-lightbox-arrow--previous';
    previous.type = 'button';
    previous.setAttribute('aria-label', 'Previous photograph');
    previous.textContent = '←';

    const viewport = document.createElement('div');
    viewport.className = 'intermission-lightbox-viewport';
    const track = document.createElement('div');
    track.className = 'intermission-lightbox-track';
    const figures = slides.map((slide, index) => {
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      image.src = slide.full || slide.src;
      image.decoding = 'async';
      image.loading = index === activeIndex ? 'eager' : 'lazy';
      figure.append(image);
      track.append(figure);
      return { figure, image, alt: slide.alt };
    });
    viewport.append(track);

    const next = document.createElement('button');
    next.className = 'intermission-lightbox-arrow intermission-lightbox-arrow--next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next photograph');
    next.textContent = '→';

    const first = document.createElement('button');
    first.className = 'burlesque-lightbox-first';
    first.type = 'button';
    first.textContent = 'FIRST';
    first.setAttribute('aria-label', 'Return to the first photograph');

    const counter = document.createElement('div');
    counter.className = 'burlesque-lightbox-counter';
    counter.setAttribute('aria-live', 'polite');
    counter.setAttribute('aria-atomic', 'true');

    const status = document.createElement('div');
    status.className = 'burlesque-lightbox-status';
    status.append(first, counter);

    dialog.append(close, previous, viewport, next, status);
    document.body.append(dialog);
    html.style.overflow = 'hidden';

    const render = () => {
      dialog.setAttribute('aria-label', `Fullscreen photograph ${activeIndex + 1} of ${slides.length}`);
      counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      first.hidden = activeIndex === 0;
      track.style.transform = `translate3d(-${activeIndex * 100}%,0,0)`;
      previous.disabled = activeIndex === 0;
      next.disabled = activeIndex === slides.length - 1;
      figures.forEach((item, index) => {
        const active = index === activeIndex;
        item.figure.setAttribute('aria-hidden', String(!active));
        item.image.alt = active ? item.alt : '';
        item.image.loading = active ? 'eager' : 'lazy';
      });
    };

    let wheelGestureActive = false;
    let wheelGestureTimer = 0;
    let isClosing = false;
    let ownsBrowserFullscreen = false;
    let onFullscreenChange = null;
    const destroy = () => {
      if (isClosing) return;
      isClosing = true;
      window.clearTimeout(wheelGestureTimer);
      window.removeEventListener('keydown', onKeyDown);
      if (onFullscreenChange) document.removeEventListener('fullscreenchange', onFullscreenChange);
      if (ownsBrowserFullscreen && document.fullscreenElement === dialog && document.exitFullscreen) {
        ownsBrowserFullscreen = false;
        document.exitFullscreen().catch(() => {});
      }
      dialog.classList.remove('is-visible');
      dialog.classList.add('is-closing');
      const finish = () => {
        html.style.overflow = previousOverflow;
        dialog.remove();
        triggerImage?.focus({ preventScroll: true });
      };
      const closingTime = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650;
      window.setTimeout(finish, closingTime);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') destroy();
      if (event.key === 'Home' && activeIndex > 0) {
        event.preventDefault();
        activeIndex = 0;
        render();
      }
      if (event.key === 'ArrowLeft' && activeIndex > 0) { activeIndex -= 1; render(); }
      if (event.key === 'ArrowRight' && activeIndex < slides.length - 1) { activeIndex += 1; render(); }
    };

    close.addEventListener('click', destroy);
    dialog.addEventListener('click', destroy);
    viewport.addEventListener('click', (event) => event.stopPropagation());
    viewport.addEventListener('wheel', (event) => {
      const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(movement) < 8) return;
      event.preventDefault();
      event.stopPropagation();

      window.clearTimeout(wheelGestureTimer);
      wheelGestureTimer = window.setTimeout(() => {
        wheelGestureActive = false;
      }, 180);

      if (wheelGestureActive) return;
      wheelGestureActive = true;

      if (movement > 0 && activeIndex < slides.length - 1) {
        activeIndex += 1;
        render();
      } else if (movement < 0 && activeIndex > 0) {
        activeIndex -= 1;
        render();
      }
    }, { passive: false });
    first.addEventListener('click', (event) => {
      event.stopPropagation();
      activeIndex = 0;
      render();
    });
    previous.addEventListener('click', (event) => { event.stopPropagation(); activeIndex = Math.max(0, activeIndex - 1); render(); });
    next.addEventListener('click', (event) => { event.stopPropagation(); activeIndex = Math.min(slides.length - 1, activeIndex + 1); render(); });
    window.addEventListener('keydown', onKeyDown);

    onFullscreenChange = () => {
      if (ownsBrowserFullscreen && !document.fullscreenElement) destroy();
    };

    if (requestBrowserFullscreen && typeof dialog.requestFullscreen === 'function') {
      ownsBrowserFullscreen = true;
      document.addEventListener('fullscreenchange', onFullscreenChange);
      try {
        const fullscreenRequest = dialog.requestFullscreen();
        fullscreenRequest?.catch(() => {
          ownsBrowserFullscreen = false;
          document.removeEventListener('fullscreenchange', onFullscreenChange);
        });
      } catch (_) {
        ownsBrowserFullscreen = false;
        document.removeEventListener('fullscreenchange', onFullscreenChange);
      }
    }

    render();
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-visible')));
    close.focus();
  }

  function buildSequence(slides) {
    installProgressStyles();
    stage.replaceChildren();
    const slideEls = [];

    slides.forEach((slide, index) => {
      const figure = document.createElement('figure');
      const ratio = slide.height ? slide.width / slide.height : 1.5;
      const sizeClass = ratio > 1.35 ? 'burlesque-horizontal-slide--wide' : ratio < 0.88 ? 'burlesque-horizontal-slide--portrait' : 'burlesque-horizontal-slide--medium';
      figure.className = `burlesque-horizontal-slide ${sizeClass}`;
      figure.dataset.index = String(index);
      figure.setAttribute('aria-hidden', String(index !== 0));

      const imageWrap = document.createElement('div');
      imageWrap.className = 'burlesque-horizontal-image';
      const image = document.createElement('img');
      image.src = slide.src;
      image.alt = slide.alt;
      image.loading = index === 0 ? 'eager' : 'lazy';
      image.decoding = 'async';
      image.setAttribute('role', 'button');
      image.tabIndex = index === 0 ? 0 : -1;
      image.setAttribute('aria-label', `Open photograph ${index + 1} of ${slides.length} fullscreen`);
      imageWrap.append(image);

      const controls = document.createElement('div');
      controls.className = 'burlesque-horizontal-controls';
      controls.setAttribute('aria-label', 'Move between photographs');
      controls.innerHTML = `
        <button class="burlesque-horizontal-previous" type="button" aria-label="${index === 0 ? 'Back to project introduction' : 'Previous photograph'}">Previous</button>
        <button class="burlesque-horizontal-next" type="button" aria-label="Next photograph"${index === slides.length - 1 ? ' disabled' : ''}>Next</button>`;

      figure.append(imageWrap, controls);
      stage.append(figure);
      slideEls.push(figure);

      const open = () => createLightbox(slides, index, image);
      image.addEventListener('click', open);
      image.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        open();
      });
      controls.querySelector('.burlesque-horizontal-previous')?.addEventListener('click', () => {
        if (index === 0) setSeriesOpen(false);
        else goToSlide(index - 1);
      });
      controls.querySelector('.burlesque-horizontal-next')?.addEventListener('click', () => goToSlide(index + 1));
    });

    const progress = document.createElement('div');
    progress.className = 'burlesque-progress';
    progress.setAttribute('aria-hidden', 'true');
    film.append(progress);

    let activeIndex = 0;

    function setSeriesOpen(open) {
      page.classList.toggle('is-in-series', open);
      scroller.setAttribute('data-view', open ? 'series' : 'intro');
    }

    function updateProgress() {
      progress.style.setProperty('--progress', String((activeIndex + 1) / slides.length));
    }

    function renderSlide() {
      stage.style.transform = `translate3d(-${activeIndex * 100}%,0,0)`;
      slideEls.forEach((slideEl, index) => {
        const active = index === activeIndex;
        slideEl.classList.toggle('is-active', active);
        slideEl.setAttribute('aria-hidden', String(!active));
        const image = slideEl.querySelector('img');
        if (image) {
          image.tabIndex = active ? 0 : -1;
          if (active) image.loading = 'eager';
        }
      });
      updateProgress();
    }

    function goToSlide(index) {
      const safeIndex = Math.max(0, Math.min(slides.length - 1, index));
      if (safeIndex === activeIndex) return;
      activeIndex = safeIndex;
      renderSlide();
    }

    enterButton?.addEventListener('click', () => {
      collections.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });

    collections.querySelector('[data-burlesque-collection="black-and-white"]')?.addEventListener('click', (event) => {
      createLightbox(blackAndWhiteSlides, 0, event.currentTarget, { requestBrowserFullscreen: true });
    });
    collections.querySelector('[data-burlesque-collection="color"]')?.addEventListener('click', (event) => {
      createLightbox(slides, 0, event.currentTarget, { requestBrowserFullscreen: true });
    });

    if ('IntersectionObserver' in window) {
      const collectionsObserver = new IntersectionObserver(([entry]) => {
        setSeriesOpen(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      }, { root: scroller, threshold: [0, 0.35, 0.7] });
      collectionsObserver.observe(collections);
    } else {
      const updateCollectionState = () => {
        const rect = collections.getBoundingClientRect();
        setSeriesOpen(rect.top < window.innerHeight * 0.65 && rect.bottom > window.innerHeight * 0.35);
      };
      scroller.addEventListener('scroll', updateCollectionState, { passive: true });
      updateCollectionState();
    }

    scroller.scrollLeft = 0;
    setSeriesOpen(false);
    stage.style.transform = 'translate3d(0,0,0)';
    film.classList.add('is-ready');
    stage.setAttribute('aria-busy', 'false');
    renderSlide();
  }

  function showError() {
    stage.setAttribute('aria-busy', 'false');
    stage.innerHTML = '<div class="burlesque-error"><p>The photographs could not be loaded.</p></div>';
  }

  loadSlides().then(buildSequence).catch(showError);
})();
