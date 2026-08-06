(() => {
  const html = document.documentElement;
  const page = document.querySelector('.burlesque-page');
  const scroller = document.querySelector('.burlesque-horizontal');
  const film = document.querySelector('.burlesque-film');
  const stage = film?.querySelector('.burlesque-stage');
  const enterButton = document.querySelector('.burlesque-enter-series');
  if (!page || !scroller || !film || !stage) return;

  const localSlides = [
    { src: 'images/5O9A0248.jpg', full: 'images/5O9A0248.jpg', alt: 'Burlesque Mon Amour photograph 1', width: 1200, height: 800 },
    { src: 'images/5O9A0351.jpg', full: 'images/5O9A0351.jpg', alt: 'Burlesque Mon Amour photograph 2', width: 1200, height: 800 },
    { src: 'images/5O9A0468.jpg', full: 'images/5O9A0468.jpg', alt: 'Burlesque Mon Amour photograph 3', width: 1200, height: 800 },
    { src: 'images/5O9A0826.jpg', full: 'images/5O9A0826.jpg', alt: 'Burlesque Mon Amour photograph 4', width: 1200, height: 800 },
    { src: 'images/5O9A0963.jpg', full: 'images/5O9A0963.jpg', alt: 'Burlesque Mon Amour photograph 5', width: 1200, height: 800 },
    { src: 'images/5O9A0997.jpg', full: 'images/5O9A0997.jpg', alt: 'Burlesque Mon Amour photograph 6', width: 1200, height: 800 },
    { src: 'images/5O9A1445.jpg', full: 'images/5O9A1445.jpg', alt: 'Burlesque Mon Amour photograph 7', width: 1200, height: 800 },
    { src: 'images/5O9A1531.jpg', full: 'images/5O9A1531.jpg', alt: 'Burlesque Mon Amour photograph 8', width: 1200, height: 800 },
    { src: 'images/5O9A1603.jpg', full: 'images/5O9A1603.jpg', alt: 'Burlesque Mon Amour photograph 9', width: 1200, height: 800 },
    { src: 'images/5O9A1812.jpg', full: 'images/5O9A1812.jpg', alt: 'Burlesque Mon Amour photograph 10', width: 1200, height: 800 },
    { src: 'images/5O9A2319.jpg', full: 'images/5O9A2319.jpg', alt: 'Burlesque Mon Amour photograph 11', width: 1200, height: 800 },
    { src: 'images/5O9A2875.jpg', full: 'images/5O9A2875.jpg', alt: 'Burlesque Mon Amour photograph 12', width: 1200, height: 800 },
    { src: 'images/5O9A4781.jpg', full: 'images/5O9A4781.jpg', alt: 'Burlesque Mon Amour photograph 13', width: 1200, height: 800 },
    { src: 'images/5O9A4889.jpg', full: 'images/5O9A4889.jpg', alt: 'Burlesque Mon Amour photograph 14', width: 1200, height: 800 },
    { src: 'images/5O9A5956.jpg', full: 'images/5O9A5956.jpg', alt: 'Burlesque Mon Amour photograph 15', width: 1200, height: 800 },
    { src: 'images/5O9A6068.jpg', full: 'images/5O9A6068.jpg', alt: 'Burlesque Mon Amour photograph 16', width: 1200, height: 800 },
    { src: 'images/5O9A6825.jpg', full: 'images/5O9A6825.jpg', alt: 'Burlesque Mon Amour photograph 17', width: 1200, height: 800 },
    { src: 'images/5O9A7596.jpg', full: 'images/5O9A7596.jpg', alt: 'Burlesque Mon Amour photograph 18', width: 1200, height: 800 },
    { src: 'images/5O9A7673.jpg', full: 'images/5O9A7673.jpg', alt: 'Burlesque Mon Amour photograph 19', width: 1200, height: 800 },
    { src: 'images/5O9A8496.jpg', full: 'images/5O9A8496.jpg', alt: 'Burlesque Mon Amour photograph 20', width: 1200, height: 800 }
  ];

  function installScrubberStyles() {
    if (document.getElementById('burlesque-scrubber-styles')) return;
    const style = document.createElement('style');
    style.id = 'burlesque-scrubber-styles';
    style.textContent = `
      .burlesque-scrubber{position:absolute;z-index:8;left:0;right:0;bottom:0;height:30px;color:#151715;opacity:1;transition:opacity .35s ease}
      .burlesque-scrubber__input{position:absolute;z-index:2;left:0;right:0;bottom:0;width:100%;height:30px;margin:0;opacity:0;cursor:ew-resize}
      .burlesque-scrubber__track{position:absolute;left:0;right:0;bottom:0;height:1px;background:#15171529;pointer-events:none}
      .burlesque-scrubber__fill{position:absolute;inset:0;background:#15171580;transform:scaleX(var(--scrub-progress,.05));transform-origin:left center;transition:transform .8s cubic-bezier(.22,1,.36,1)}
      .burlesque-scrubber__marker{position:absolute;left:clamp(4px,calc(var(--scrub-position,0) * 100%),calc(100% - 4px));bottom:-3px;width:7px;height:7px;border-radius:50%;background:#151715;transform:translateX(-50%);transition:left .8s cubic-bezier(.22,1,.36,1),transform .2s ease;box-shadow:0 0 0 3px #f0efe9b8}
      .burlesque-scrubber.is-dragging .burlesque-scrubber__fill,.burlesque-scrubber.is-dragging .burlesque-scrubber__marker{transition-duration:.12s}
      .burlesque-scrubber.is-dragging .burlesque-scrubber__marker{transform:translateX(-50%) scale(1.35)}
      .burlesque-scrubber__input:focus-visible + .burlesque-scrubber__track .burlesque-scrubber__marker{outline:1px solid #151715;outline-offset:4px}
      @media (max-width:760px){.burlesque-scrubber,.burlesque-scrubber__input{height:36px}}
      @media (prefers-reduced-motion:reduce){.burlesque-scrubber__fill,.burlesque-scrubber__marker{transition:none}}
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
    await Promise.all(localSlides.map(preloadPhotograph));
    return localSlides;
  }

  function createLightbox(slides, startIndex, triggerImage) {
    let activeIndex = startIndex;
    const previousOverflow = html.style.overflow;
    const dialog = document.createElement('div');
    dialog.className = 'intermission-lightbox burlesque-lightbox';
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
    const figures = slides.map((slide) => {
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      image.src = slide.full || slide.src;
      image.decoding = 'async';
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

    dialog.append(close, previous, viewport, next);
    document.body.append(dialog);
    html.style.overflow = 'hidden';

    const render = () => {
      dialog.setAttribute('aria-label', `Fullscreen photograph ${activeIndex + 1} of ${slides.length}`);
      track.style.transform = `translate3d(-${activeIndex * 100}%,0,0)`;
      previous.disabled = activeIndex === 0;
      next.disabled = activeIndex === slides.length - 1;
      figures.forEach((item, index) => {
        const active = index === activeIndex;
        item.figure.setAttribute('aria-hidden', String(!active));
        item.image.alt = active ? item.alt : '';
        item.image.loading = 'eager';
      });
    };

    let isClosing = false;
    const destroy = () => {
      if (isClosing) return;
      isClosing = true;
      window.removeEventListener('keydown', onKeyDown);
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
      if (event.key === 'ArrowLeft' && activeIndex > 0) { activeIndex -= 1; render(); }
      if (event.key === 'ArrowRight' && activeIndex < slides.length - 1) { activeIndex += 1; render(); }
    };

    close.addEventListener('click', destroy);
    dialog.addEventListener('click', destroy);
    viewport.addEventListener('click', (event) => event.stopPropagation());
    previous.addEventListener('click', (event) => { event.stopPropagation(); activeIndex = Math.max(0, activeIndex - 1); render(); });
    next.addEventListener('click', (event) => { event.stopPropagation(); activeIndex = Math.min(slides.length - 1, activeIndex + 1); render(); });
    window.addEventListener('keydown', onKeyDown);
    render();
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-visible')));
    close.focus();
  }

  function buildSequence(slides) {
    installScrubberStyles();
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
      image.loading = 'eager';
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

    const scrubber = document.createElement('div');
    scrubber.className = 'burlesque-scrubber';
    scrubber.setAttribute('aria-label', 'Photograph progress');
    const scrubberInput = document.createElement('input');
    scrubberInput.className = 'burlesque-scrubber__input';
    scrubberInput.type = 'range';
    scrubberInput.min = '0';
    scrubberInput.max = String(slides.length - 1);
    scrubberInput.step = '1';
    scrubberInput.value = '0';
    scrubberInput.setAttribute('aria-label', 'Jump to a photograph');
    const scrubberTrack = document.createElement('span');
    scrubberTrack.className = 'burlesque-scrubber__track';
    scrubberTrack.innerHTML = '<i class="burlesque-scrubber__fill"></i><b class="burlesque-scrubber__marker"></b>';
    scrubber.append(scrubberInput, scrubberTrack);
    film.append(scrubber);

    let activeIndex = 0;
    let wheelLockedUntil = 0;
    const TRANSITION_MS = 1300;

    function isSeriesOpen() {
      return page.classList.contains('is-in-series');
    }

    function setSeriesOpen(open) {
      page.classList.toggle('is-in-series', open);
      scroller.setAttribute('data-view', open ? 'series' : 'intro');
    }

    function updateScrubber() {
      const progress = (activeIndex + 1) / slides.length;
      const position = slides.length > 1 ? activeIndex / (slides.length - 1) : 0;
      scrubber.style.setProperty('--scrub-progress', String(progress));
      scrubber.style.setProperty('--scrub-position', String(position));
      scrubberInput.value = String(activeIndex);
      scrubberInput.setAttribute('aria-valuetext', `Photograph ${activeIndex + 1} of ${slides.length}`);
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
          image.loading = 'eager';
        }
      });
      updateScrubber();
    }

    function goToSlide(index) {
      const safeIndex = Math.max(0, Math.min(slides.length - 1, index));
      if (safeIndex === activeIndex) return;
      activeIndex = safeIndex;
      renderSlide();
    }

    scrubberInput.addEventListener('input', () => goToSlide(Number(scrubberInput.value)));
    scrubberInput.addEventListener('pointerdown', () => scrubber.classList.add('is-dragging'));
    scrubberInput.addEventListener('pointerup', () => scrubber.classList.remove('is-dragging'));
    scrubberInput.addEventListener('pointercancel', () => scrubber.classList.remove('is-dragging'));
    scrubber.addEventListener('click', (event) => event.stopPropagation());

    enterButton?.addEventListener('click', () => setSeriesOpen(true));

    window.addEventListener('keydown', (event) => {
      if (document.querySelector('.intermission-lightbox') || document.querySelector('.menu-panel.is-open')) return;
      if (event.target === scrubberInput) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (!isSeriesOpen()) setSeriesOpen(true);
        else goToSlide(activeIndex + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (isSeriesOpen() && activeIndex === 0) setSeriesOpen(false);
        else if (isSeriesOpen()) goToSlide(activeIndex - 1);
      }
    });

    scroller.addEventListener('wheel', (event) => {
      if (window.matchMedia('(max-width:760px)').matches) return;
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 18) return;
      event.preventDefault();
      const now = performance.now();
      if (now < wheelLockedUntil) return;
      if (!isSeriesOpen()) {
        if (delta > 0) setSeriesOpen(true);
      } else if (delta > 0 && activeIndex < slides.length - 1) {
        goToSlide(activeIndex + 1);
      } else if (delta < 0 && activeIndex > 0) {
        goToSlide(activeIndex - 1);
      } else if (delta < 0 && activeIndex === 0) {
        setSeriesOpen(false);
      }
      wheelLockedUntil = now + TRANSITION_MS + 25;
    }, { passive: false });

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
