(() => {
  const html = document.documentElement;
  const page = document.querySelector('.burlesque-page');
  const scroller = document.querySelector('.burlesque-horizontal');
  const film = document.querySelector('.burlesque-film');
  const stage = film?.querySelector('.burlesque-stage');
  const enterButton = document.querySelector('.burlesque-enter-series');
  if (!page || !scroller || !film || !stage) return;

  const sliderIds = [8103, 8453];
  const endpointFor = (id, ordered = true) => {
    const base = `https://natalianeuhaus.com/wp-json/wp/v2/ml-slide?ml-slider=${id}&per_page=100&status=publish&_embed=1`;
    return ordered ? `${base}&order=asc&orderby=menu_order` : base;
  };

  const cleanText = (value) => {
    const box = document.createElement('textarea');
    box.innerHTML = value || '';
    return box.value.replace(/<[^>]*>/g, '').trim();
  };

  const preferredSource = (media) => {
    const sizes = media?.media_details?.sizes || {};
    return sizes['1536x1536']?.source_url ||
      sizes.large?.source_url ||
      sizes.medium_large?.source_url ||
      media?.source_url || '';
  };

  async function mediaForSlide(slide) {
    const embedded = slide?._embedded?.['wp:featuredmedia']?.[0];
    if (embedded) return embedded;
    const href = slide?._links?.['wp:featuredmedia']?.[0]?.href;
    if (!href) return null;
    try {
      const response = await fetch(href, { mode: 'cors', credentials: 'omit' });
      return response.ok ? await response.json() : null;
    } catch (_) {
      return null;
    }
  }

  async function requestSlider(id) {
    for (const ordered of [true, false]) {
      try {
        const response = await fetch(endpointFor(id, ordered), {
          mode: 'cors',
          credentials: 'omit',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) continue;
        const data = await response.json();
        if (!Array.isArray(data) || !data.length) continue;
        const sorted = [...data].sort((a, b) =>
          (Number(a.menu_order) || 0) - (Number(b.menu_order) || 0)
        );
        const slides = [];
        for (const item of sorted) {
          const media = await mediaForSlide(item);
          const src = preferredSource(media);
          if (!src) continue;
          const width = Number(media?.media_details?.width) || 0;
          const height = Number(media?.media_details?.height) || 0;
          slides.push({
            src,
            full: media?.source_url || src,
            alt: media?.alt_text || cleanText(media?.caption?.rendered) || cleanText(media?.title?.rendered) || 'Burlesque Mon Amour photograph',
            width,
            height,
          });
        }
        if (slides.length) return slides;
      } catch (_) {
        // Try the next endpoint/slider configuration.
      }
    }
    return [];
  }

  async function loadSlides() {
    for (const id of sliderIds) {
      const slides = await requestSlider(id);
      if (slides.length) return slides;
    }
    throw new Error('The Burlesque gallery could not be loaded.');
  }

  function createLightbox(slides, startIndex) {
    let activeIndex = startIndex;
    const previousOverflow = html.style.overflow;
    const dialog = document.createElement('div');
    dialog.className = 'intermission-lightbox';
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
      track.style.transform = `translate3d(-${activeIndex * 100}%, 0, 0)`;
      previous.disabled = activeIndex === 0;
      next.disabled = activeIndex === slides.length - 1;
      figures.forEach((item, index) => {
        const active = index === activeIndex;
        item.figure.setAttribute('aria-hidden', String(!active));
        item.image.alt = active ? item.alt : '';
        item.image.loading = Math.abs(index - activeIndex) <= 1 ? 'eager' : 'lazy';
      });
    };
    const destroy = () => {
      window.removeEventListener('keydown', onKeyDown);
      html.style.overflow = previousOverflow;
      dialog.remove();
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
    close.focus();
  }

  function buildSequence(slides) {
    stage.replaceChildren();
    const slideEls = [];
    const totalLabel = String(slides.length).padStart(2, '0');

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
      image.loading = index < 2 ? 'eager' : 'lazy';
      image.decoding = 'async';
      image.setAttribute('role', 'button');
      image.tabIndex = index === 0 ? 0 : -1;
      image.setAttribute('aria-label', `Open photograph ${index + 1} of ${slides.length} fullscreen`);
      imageWrap.append(image);

      const panel = document.createElement('figcaption');
      panel.className = 'burlesque-horizontal-panel';
      panel.innerHTML = `
        <div class="burlesque-horizontal-title"><span>Ongoing photographic project</span><h2>Burlesque Mon Amour</h2></div>
        <div class="burlesque-horizontal-series"><span>Series</span><div><small>01</small><strong>Color</strong></div></div>
        <div class="burlesque-horizontal-controls" aria-label="Move between photographs">
          <button class="burlesque-horizontal-previous" type="button" aria-label="Previous photograph"${index === 0 ? ' disabled' : ''}>Previous</button>
          <span aria-label="Current photograph">${String(index + 1).padStart(2, '0')}</span><i></i><span aria-label="Total photographs">${totalLabel}</span>
          <button class="burlesque-horizontal-next" type="button" aria-label="Next photograph"${index === slides.length - 1 ? ' disabled' : ''}>Next</button>
        </div>
        <div class="burlesque-horizontal-progress" aria-hidden="true"><span style="--progress:${(index + 1) / slides.length}"></span></div>`;

      figure.append(imageWrap, panel);
      stage.append(figure);
      slideEls.push(figure);

      const open = () => createLightbox(slides, index);
      image.addEventListener('click', open);
      image.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        open();
      });
      panel.querySelector('.burlesque-horizontal-previous')?.addEventListener('click', () => goToSlide(index - 1));
      panel.querySelector('.burlesque-horizontal-next')?.addEventListener('click', () => goToSlide(index + 1));
    });

    let activeIndex = 0;
    let frame = 0;
    const introWidth = () => scroller.querySelector('.burlesque-intro')?.getBoundingClientRect().width || window.innerWidth;

    function goToSlide(index, behavior = 'smooth') {
      const safeIndex = Math.max(0, Math.min(slides.length - 1, index));
      const target = slideEls[safeIndex];
      if (!target) return;

      // offsetLeft is relative to the inner film/stage, not the outer
      // horizontal scroller. Calculate the target's actual position inside
      // the scroller so the intro panel's width is included.
      const scrollerRect = scroller.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetLeft = scroller.scrollLeft + targetRect.left - scrollerRect.left;
      scroller.scrollTo({ left: targetLeft, behavior });
    }

    function renderFromScroll() {
      frame = 0;
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let closestIndex = -1;
      let closestDistance = Number.POSITIVE_INFINITY;
      slideEls.forEach((slideEl, index) => {
        const slideCenter = slideEl.offsetLeft + slideEl.offsetWidth / 2;
        const distance = Math.abs(slideCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      const inSeries = scroller.scrollLeft >= introWidth() * 0.55;
      page.classList.toggle('is-in-series', inSeries);
      if (closestIndex < 0) return;
      activeIndex = closestIndex;
      slideEls.forEach((slideEl, index) => {
        const active = inSeries && index === activeIndex;
        slideEl.classList.toggle('is-active', active);
        slideEl.setAttribute('aria-hidden', String(!active));
        const image = slideEl.querySelector('img');
        if (image) image.tabIndex = active ? 0 : -1;
      });
    }

    function requestRender() {
      if (!frame) frame = requestAnimationFrame(renderFromScroll);
    }

    enterButton?.addEventListener('click', () => goToSlide(0));
    scroller.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);
    window.addEventListener('keydown', (event) => {
      if (document.querySelector('.intermission-lightbox') || document.querySelector('.menu-panel.is-open')) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (!page.classList.contains('is-in-series')) goToSlide(0);
        else goToSlide(activeIndex + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (activeIndex <= 0) scroller.scrollTo({ left: 0, behavior: 'smooth' });
        else goToSlide(activeIndex - 1);
      }
    });

    scroller.addEventListener('wheel', (event) => {
      if (window.matchMedia('(max-width: 760px)').matches) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      scroller.scrollLeft += event.deltaY;
    }, { passive: false });

    film.classList.add('is-ready');
    stage.setAttribute('aria-busy', 'false');
    renderFromScroll();
  }

  function showError() {
    stage.setAttribute('aria-busy', 'false');
    stage.innerHTML = `<div class="burlesque-error"><p>The photographs could not be loaded from the existing archive.</p><a href="https://natalianeuhaus.com/burlesque-color/" target="_blank" rel="noopener noreferrer">Open the original gallery</a></div>`;
  }

  loadSlides().then(buildSequence).catch(showError);
})();
