(() => {
  const html = document.documentElement;

  function initializeNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    const panel = document.querySelector(".menu-panel");
    if (!toggle || !panel) return;

    let scrim = null;
    const links = Array.from(panel.querySelectorAll("a"));

    const setOpen = (open) => {
      html.classList.toggle("menu-open", open);
      toggle.classList.toggle("is-open", open);
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      panel.setAttribute("aria-hidden", String(!open));
      links.forEach((link) => {
        link.tabIndex = open ? 0 : -1;
      });

      if (open && !scrim) {
        scrim = document.createElement("button");
        scrim.className = "menu-scrim";
        scrim.type = "button";
        scrim.setAttribute("aria-label", "Close menu");
        scrim.addEventListener("click", () => setOpen(false));
        document.body.append(scrim);
      } else if (!open && scrim) {
        scrim.remove();
        scrim = null;
      }
    };

    setOpen(false);
    toggle.addEventListener("click", () => {
      setOpen(!panel.classList.contains("is-open"));
    });
    links.forEach((link) =>
      link.addEventListener("click", () => setOpen(false)),
    );
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initializeHomeVideo() {
    const video = document.querySelector(".featured-video");
    if (!video) return;

    const play = () => {
      video.muted = true;
      if (!document.hidden) video.play().catch(() => {});
    };

    video.addEventListener("canplay", play);
    document.addEventListener("visibilitychange", play);
    play();
  }

  function initializeReveals() {
    const page = document.querySelector(".healers-page");
    if (!page) return;

    const items = Array.from(page.querySelectorAll("[data-reveal]"));
    page.classList.add("reveal-ready");

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    items.forEach((item) => observer.observe(item));
  }

  function initializeHealersHeaderTransition() {
    const page = document.querySelector(".healers-page");
    const hero = document.querySelector(".healers-hero");
    if (!page || !hero) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      page.classList.toggle(
        "nav-on-light",
        hero.getBoundingClientRect().bottom <= 96,
      );
    };
    const requestUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  }

  function installHealersLightboxStatusStyles() {
    if (document.getElementById("healers-lightbox-status-styles")) return;
    const style = document.createElement("style");
    style.id = "healers-lightbox-status-styles";
    style.textContent = `
      .healers-lightbox-status,.burlesque-lightbox-status{z-index:3;position:absolute;right:28px;bottom:24px;display:flex;align-items:center;gap:18px;color:rgba(241,239,231,.54);letter-spacing:.18em;font:9px/1.4 Arial,Helvetica,sans-serif;font-variant-numeric:tabular-nums}
      .healers-lightbox .healers-lightbox-first,.burlesque-lightbox .burlesque-lightbox-first{position:static;color:rgba(241,239,231,.54);background:transparent;border:0;padding:0;letter-spacing:.18em;font:inherit;cursor:pointer;transition:color .25s ease}
      .healers-lightbox .healers-lightbox-first:hover,.healers-lightbox .healers-lightbox-first:focus-visible,.burlesque-lightbox .burlesque-lightbox-first:hover,.burlesque-lightbox .burlesque-lightbox-first:focus-visible{color:#f1efe7;opacity:1}
      .healers-lightbox-counter,.burlesque-lightbox-counter{pointer-events:none}
      @media (max-width:760px){.healers-lightbox-status,.burlesque-lightbox-status{right:16px;bottom:14px;gap:14px}}
    `;
    document.head.append(style);
  }

  function installMilkRouteLightboxStyles() {
    if (document.getElementById("milk-route-lightbox-styles")) return;
    const style = document.createElement("style");
    style.id = "milk-route-lightbox-styles";
    style.textContent = `
      .intermission-lightbox{z-index:300;color:#f1efe7;background-color:transparent;place-items:center;display:grid;position:fixed;inset:0;overflow:hidden;opacity:0;transition:opacity .55s cubic-bezier(.22,1,.36,1),background-color .7s cubic-bezier(.22,1,.36,1)}
      .intermission-lightbox.is-visible{background-color:#050606;opacity:1}
      .intermission-lightbox.is-closing{pointer-events:none}
      .intermission-lightbox-viewport{position:absolute;inset:0;overflow:hidden;opacity:0;transform:scale(.975);transition:opacity .48s ease .12s,transform .78s cubic-bezier(.22,1,.36,1) .05s}
      .intermission-lightbox.is-visible .intermission-lightbox-viewport{opacity:1;transform:scale(1)}
      .intermission-lightbox-track{will-change:transform;width:100%;height:100%;transition:transform 1.3s ease-in-out;display:flex}
      .intermission-lightbox-track figure{flex:0 0 100%;place-items:center;height:100%;margin:0;padding:22px 56px;display:grid;position:relative}
      .burlesque-lightbox .intermission-lightbox-track figure>img{width:100%;height:100%;max-width:none;max-height:none;min-width:0;min-height:0;object-fit:contain;object-position:center;display:block}
      .intermission-lightbox-close,.intermission-lightbox-arrow{z-index:2;cursor:pointer;background:transparent;border:0;padding:0;position:absolute}
      .intermission-lightbox-close{width:42px;height:42px;color:rgba(241,239,231,.36);font-size:31px;font-weight:200;line-height:1;top:24px;right:34px;transition:color .25s ease,opacity .25s ease,transform .25s ease}
      .intermission-lightbox-arrow{width:62px;height:42px;color:rgba(241,239,231,.36);font-size:0;line-height:1;top:50%;transform:translateY(-50%);transition:color .25s ease,opacity .25s ease,transform .25s ease}
      .intermission-lightbox-arrow--previous{left:18px}
      .intermission-lightbox-arrow--next{right:18px}
      .intermission-lightbox-arrow::before{content:"";width:44px;height:1px;background:currentColor;position:absolute;top:50%;transform:translateY(-50%)}
      .intermission-lightbox-arrow::after{content:"";width:7px;height:7px;border-top:1px solid currentColor;border-right:1px solid currentColor;position:absolute;top:50%}
      .intermission-lightbox-arrow--previous::before{right:7px;left:auto}
      .intermission-lightbox-arrow--previous::after{left:7px;right:auto;transform:translateY(-50%) rotate(-135deg)}
      .intermission-lightbox-arrow--next::before{left:7px;right:auto}
      .intermission-lightbox-arrow--next::after{right:7px;left:auto;transform:translateY(-50%) rotate(45deg)}
      .burlesque-lightbox .intermission-lightbox-arrow:hover,.burlesque-lightbox .intermission-lightbox-arrow:focus-visible,.burlesque-lightbox .intermission-lightbox-close:hover,.burlesque-lightbox .intermission-lightbox-close:focus-visible{color:#f1efe7;opacity:1}
      .burlesque-lightbox .intermission-lightbox-arrow:disabled{color:#f1efe7;opacity:.18;cursor:default}
      .intermission-lightbox-arrow--previous:hover,.intermission-lightbox-arrow--previous:focus-visible{transform:translate(-3px,-50%)}
      .intermission-lightbox-arrow--next:hover,.intermission-lightbox-arrow--next:focus-visible{transform:translate(3px,-50%)}
      @media(max-width:760px){
        .intermission-lightbox-track figure{padding:16px 38px}
        .intermission-lightbox-close{top:10px;right:12px}
        .intermission-lightbox-arrow{width:52px;height:38px}
        .intermission-lightbox-arrow::before{width:34px}
        .intermission-lightbox-arrow::after{width:6px;height:6px}
        .intermission-lightbox-arrow--previous{left:2px}
        .intermission-lightbox-arrow--next{right:2px}
        .intermission-lightbox-arrow--previous::before{right:6px}
        .intermission-lightbox-arrow--previous::after{left:6px}
        .intermission-lightbox-arrow--next::before{left:6px}
        .intermission-lightbox-arrow--next::after{right:6px}
      }
      @media(prefers-reduced-motion:reduce){.intermission-lightbox,.intermission-lightbox-viewport,.intermission-lightbox-track{transition:none}}
    `;
    document.head.append(style);
  }

  function createLightbox({ slides, startIndex, className, requestBrowserFullscreen = false }) {
    let activeIndex = startIndex;
    const dialog = document.createElement("div");
    const prefix = className;
    const usesBurlesqueViewer =
      prefix === "healers-lightbox" || prefix === "intermission-lightbox";
    const visualPrefix = usesBurlesqueViewer ? "intermission-lightbox" : prefix;
    const previousOverflow = html.style.overflow;
    const enableTrackpadNavigation = prefix === "healers-lightbox";
    const enableStatusNavigation = usesBurlesqueViewer;
    const statusPrefix =
      prefix === "intermission-lightbox" ? "burlesque-lightbox" : "healers-lightbox";
    const animateOpening = usesBurlesqueViewer;
    const shouldRequestBrowserFullscreen = Boolean(requestBrowserFullscreen);
    if (enableStatusNavigation) installHealersLightboxStatusStyles();
    let wheelLockedUntil = 0;
    let touchStartX = null;

    dialog.className = usesBurlesqueViewer
      ? `${prefix}${prefix === "healers-lightbox" ? " intermission-lightbox" : ""} burlesque-lightbox`
      : prefix;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");

    const close = document.createElement("button");
    close.className = `${visualPrefix}-close`;
    close.type = "button";
    close.setAttribute("aria-label", "Close fullscreen slideshow");
    close.textContent = "×";

    const previous = document.createElement("button");
    previous.className = `${visualPrefix}-arrow ${visualPrefix}-arrow--previous`;
    previous.type = "button";
    previous.setAttribute("aria-label", "Previous photograph");
    previous.textContent = "←";

    const viewport = document.createElement("div");
    viewport.className = `${visualPrefix}-viewport`;
    const track = document.createElement("div");
    track.className = `${visualPrefix}-track`;

    const figures = slides.map((slide) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      image.src = slide.src;
      image.decoding = "async";
      figure.append(image);
      track.append(figure);
      return { figure, image, alt: slide.alt };
    });
    viewport.append(track);

    const next = document.createElement("button");
    next.className = `${visualPrefix}-arrow ${visualPrefix}-arrow--next`;
    next.type = "button";
    next.setAttribute("aria-label", "Next photograph");
    next.textContent = "→";

    let first = null;
    let counter = null;
    let status = null;
    if (enableStatusNavigation) {
      first = document.createElement("button");
      first.className = `${statusPrefix}-first`;
      first.type = "button";
      first.textContent = "FIRST";
      first.setAttribute("aria-label", "Return to the first photograph");

      counter = document.createElement("div");
      counter.className = `${statusPrefix}-counter`;
      counter.setAttribute("aria-live", "polite");
      counter.setAttribute("aria-atomic", "true");

      status = document.createElement("div");
      status.className = `${statusPrefix}-status`;
      status.append(first, counter);
    }

    dialog.append(close, previous, viewport, next);
    if (status) dialog.append(status);
    document.body.append(dialog);
    html.style.overflow = "hidden";

    let isClosing = false;
    let ownsBrowserFullscreen = false;
    let onFullscreenChange = null;

    const render = () => {
      dialog.setAttribute(
        "aria-label",
        `Fullscreen photograph ${activeIndex + 1} of ${slides.length}`,
      );
      track.style.transform = `translate3d(-${activeIndex * 100}%, 0, 0)`;
      if (counter) counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      if (first) first.hidden = activeIndex === 0;
      previous.disabled = activeIndex === 0;
      next.disabled = activeIndex === slides.length - 1;
      figures.forEach((item, index) => {
        const isActive = index === activeIndex;
        item.figure.setAttribute("aria-hidden", String(!isActive));
        item.image.alt = isActive ? item.alt : "";
        item.image.loading =
          Math.abs(index - activeIndex) <= 1 ? "eager" : "lazy";
      });
    };

    const onWheel = (event) => {
      if (!enableTrackpadNavigation) return;
      const delta =
        Math.abs(event.deltaX) >= Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (Math.abs(delta) < 18) return;

      event.preventDefault();
      const now = performance.now();
      if (now < wheelLockedUntil) return;

      if (delta > 0 && activeIndex < slides.length - 1) {
        activeIndex += 1;
        render();
        wheelLockedUntil = now + 1325;
      } else if (delta < 0 && activeIndex > 0) {
        activeIndex -= 1;
        render();
        wheelLockedUntil = now + 1325;
      }
    };

    const destroy = () => {
      if (isClosing) return;
      isClosing = true;
      window.removeEventListener("keydown", onKeyDown);
      viewport.removeEventListener("wheel", onWheel);
      if (onFullscreenChange)
        document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (
        ownsBrowserFullscreen &&
        document.fullscreenElement === dialog &&
        document.exitFullscreen
      ) {
        ownsBrowserFullscreen = false;
        document.exitFullscreen().catch(() => {});
      }
      dialog.classList.remove("is-visible");
      dialog.classList.add("is-closing");
      const finish = () => {
        html.style.overflow = previousOverflow;
        dialog.remove();
      };
      const closingTime =
        animateOpening &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 650
          : 0;
      window.setTimeout(finish, closingTime);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") destroy();
      if (event.key === "Home" && activeIndex > 0) {
        event.preventDefault();
        activeIndex = 0;
        render();
      }
      if (event.key === "ArrowLeft" && activeIndex > 0) {
        activeIndex -= 1;
        render();
      }
      if (event.key === "ArrowRight" && activeIndex < slides.length - 1) {
        activeIndex += 1;
        render();
      }
    };

    close.addEventListener("click", destroy);
    dialog.addEventListener("click", destroy);
    viewport.addEventListener("click", (event) => event.stopPropagation());
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0]?.clientX ?? null;
      },
      { passive: true },
    );
    viewport.addEventListener(
      "touchend",
      (event) => {
        if (touchStartX === null) return;
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
        const distance = touchStartX - touchEndX;
        touchStartX = null;
        if (Math.abs(distance) < 48) return;
        if (distance > 0 && activeIndex < slides.length - 1) {
          activeIndex += 1;
          render();
        } else if (distance < 0 && activeIndex > 0) {
          activeIndex -= 1;
          render();
        }
      },
      { passive: true },
    );
    first?.addEventListener("click", (event) => {
      event.stopPropagation();
      activeIndex = 0;
      render();
    });
    previous.addEventListener("click", (event) => {
      event.stopPropagation();
      activeIndex = Math.max(activeIndex - 1, 0);
      render();
    });
    next.addEventListener("click", (event) => {
      event.stopPropagation();
      activeIndex = Math.min(activeIndex + 1, slides.length - 1);
      render();
    });
    window.addEventListener("keydown", onKeyDown);

    onFullscreenChange = () => {
      if (ownsBrowserFullscreen && !document.fullscreenElement) destroy();
    };

    if (
      shouldRequestBrowserFullscreen &&
      typeof dialog.requestFullscreen === "function"
    ) {
      ownsBrowserFullscreen = true;
      document.addEventListener("fullscreenchange", onFullscreenChange);
      try {
        const fullscreenRequest = dialog.requestFullscreen();
        fullscreenRequest?.catch(() => {
          ownsBrowserFullscreen = false;
          document.removeEventListener(
            "fullscreenchange",
            onFullscreenChange,
          );
        });
      } catch (_) {
        ownsBrowserFullscreen = false;
        document.removeEventListener("fullscreenchange", onFullscreenChange);
      }
    }

    render();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => dialog.classList.add("is-visible")),
    );
    close.focus();
  }

  function initializeHealersSlideshow() {
    const triggers = Array.from(
      document.querySelectorAll("[data-healers-slide-index]"),
    ).sort(
      (first, second) =>
        Number(first.dataset.healersSlideIndex) -
        Number(second.dataset.healersSlideIndex),
    );
    if (!triggers.length) return;

    const slides = triggers.map((image) => ({
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt") || "Healers photograph",
    }));

    const open = (image) => {
      const index = Number(image.dataset.healersSlideIndex);
      if (!Number.isInteger(index) || index < 0 || index >= slides.length)
        return;
      createLightbox({
        slides,
        startIndex: index,
        className: "healers-lightbox",
        requestBrowserFullscreen: true,
      });
    };

    triggers.forEach((image) => {
      image.addEventListener("click", () => open(image));
      image.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        open(image);
      });
    });
  }

  function initializeMilkRouteLightbox() {
    const trigger = document.getElementById("slideImage");
    if (!trigger || !trigger.closest(".slideshow")) return;

    installMilkRouteLightboxStyles();
    const slides = Array.from({ length: 48 }, (_, index) => ({
      src: `./landscape/${String(index + 1).padStart(2, "0")}.jpg`,
      alt: `Nevada landscape photograph ${index + 1}`,
    }));

    const open = () => {
      const index = Number(trigger.dataset.slideIndex);
      if (!Number.isInteger(index) || index < 0 || index >= slides.length)
        return;
      createLightbox({
        slides,
        startIndex: index,
        className: "intermission-lightbox",
        requestBrowserFullscreen: true,
      });
    };

    trigger.tabIndex = 0;
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-label", "Open current photograph in fullscreen");
    trigger.addEventListener("click", open);
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      open();
    });
  }

  function initializeHealersBackstory() {
    const trigger = document.querySelector("[data-healers-backstory-open]");
    const dialog = document.querySelector(".healers-backstory");
    const close = dialog?.querySelector("[data-healers-backstory-close]");
    const viewport = dialog?.querySelector(".healers-backstory-viewport");
    const track = dialog?.querySelector(".healers-backstory-track");
    const slides = Array.from(
      dialog?.querySelectorAll(".healers-backstory-slide") || [],
    );
    const previous = dialog?.querySelector(".healers-backstory-previous");
    const next = dialog?.querySelector(".healers-backstory-next");
    const current = dialog?.querySelector("[data-healers-backstory-current]");
    if (
      !trigger ||
      !dialog ||
      !close ||
      !viewport ||
      !track ||
      !slides.length ||
      !previous ||
      !next ||
      !current
    )
      return;

    let activeIndex = 0;
    let isOpen = false;
    let previousOverflow = "";
    let wheelLockedUntil = 0;
    let touchStartX = null;
    const revealAnchor = document.querySelector(".healers-final-photo");

    const revealTrigger = () => {
      trigger.disabled = false;
      trigger.setAttribute("aria-hidden", "false");
      trigger.classList.add("is-ready");
    };

    const hideTrigger = () => {
      if (isOpen) return;
      trigger.disabled = true;
      trigger.setAttribute("aria-hidden", "true");
      trigger.classList.remove("is-ready");
    };

    if (revealAnchor && "IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) revealTrigger();
          else hideTrigger();
        },
        { rootMargin: "0px 0px -14% 0px", threshold: 0 },
      );
      revealObserver.observe(revealAnchor);
    } else if (revealAnchor) {
      const revealFromScroll = () => {
        const rect = revealAnchor.getBoundingClientRect();
        const visible = rect.top < window.innerHeight * 0.86 && rect.bottom > 0;
        if (visible) revealTrigger();
        else hideTrigger();
      };
      window.addEventListener("scroll", revealFromScroll, { passive: true });
      revealFromScroll();
    }

    const render = (index) => {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));
      track.style.transform = `translate3d(-${activeIndex * 100}%, 0, 0)`;
      current.textContent = String(activeIndex + 1).padStart(2, "0");
      previous.disabled = activeIndex === 0;
      next.disabled = activeIndex === slides.length - 1;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.setAttribute("aria-hidden", String(!active));
        slide.querySelectorAll("a, button").forEach((element) => {
          element.tabIndex = active ? 0 : -1;
        });
      });
    };

    const show = (index) => render(index);

    const open = () => {
      if (isOpen) return;
      isOpen = true;
      previousOverflow = html.style.overflow;
      dialog.hidden = false;
      dialog.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      html.style.overflow = "hidden";
      render(0);
      requestAnimationFrame(() => {
        dialog.classList.add("is-visible");
        close.focus();
      });
    };

    const hide = () => {
      if (!isOpen) return;
      isOpen = false;
      dialog.classList.remove("is-visible");
      dialog.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      html.style.overflow = previousOverflow;
      window.setTimeout(() => {
        if (!isOpen) dialog.hidden = true;
      }, 480);
      trigger.focus();
    };

    const onWheel = (event) => {
      if (!isOpen) return;
      const delta =
        Math.abs(event.deltaX) >= Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (Math.abs(delta) < 18) return;
      event.preventDefault();
      const now = performance.now();
      if (now < wheelLockedUntil) return;
      if (delta > 0 && activeIndex < slides.length - 1) {
        show(activeIndex + 1);
        wheelLockedUntil = now + 925;
      } else if (delta < 0 && activeIndex > 0) {
        show(activeIndex - 1);
        wheelLockedUntil = now + 925;
      }
    };

    const onKeyDown = (event) => {
      if (!isOpen) return;
      if (event.key === "Escape") hide();
      if (event.key === "ArrowLeft") show(activeIndex - 1);
      if (event.key === "ArrowRight") show(activeIndex + 1);
      if (event.key !== "Tab") return;

      const focusable = [close, previous, next].filter(
        (element) => !element.disabled,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    trigger.addEventListener("click", open);
    close.addEventListener("click", hide);
    previous.addEventListener("click", () => show(activeIndex - 1));
    next.addEventListener("click", () => show(activeIndex + 1));
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0]?.clientX ?? null;
      },
      { passive: true },
    );
    viewport.addEventListener(
      "touchend",
      (event) => {
        if (touchStartX === null) return;
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
        const distance = touchStartX - touchEndX;
        touchStartX = null;
        if (Math.abs(distance) < 48) return;
        show(activeIndex + (distance > 0 ? 1 : -1));
      },
      { passive: true },
    );
    window.addEventListener("keydown", onKeyDown);
    render(0);
  }

  function initializeIntermissionChapters() {
    const tabs = Array.from(
      document.querySelectorAll(".intermission-chapter-tabs button"),
    );
    const description = document.querySelector(
      ".intermission-chapter-description",
    );
    const chapterIndex = document.querySelector(".intermission-chapter-index");
    const scrollIndicator = document.querySelector(
      ".intermission-chapter-scroll span",
    );
    if (!tabs.length || !description || !chapterIndex) return;

    const chapters = [
      {
        label: "Chapter I",
        targetId: "chapter-1",
        paragraphs: [
          "New York City was one of the hardest-hit cities in the United States during COVID-19. This chapter is a visual archive of a city famous for its fast-paced streets and congested sidewalks, forced to pause.",
          "The invisible disease shut down the city. Stores were left suspended in time, displaying winter fashion well into spring. Time was nowhere to be seen. Then George Floyd was killed, and people filled the streets to protest yet another Black man killed by police.",
          "Chapter I moves from lockdown and shutdown through the beginning of 2021.",
        ],
      },
      {
        label: "Chapter II",
        targetId: "chapter-2",
        videoLabel: "Stop motion video",
        videoSrc:
          "https://rachelbodyworkmassage.com/wp-content/uploads/videos/Arles_Paganini.mp4",
        paragraphs: [
          "For five weeks in 2023, Arles became a kind of intermission—a sun-soaked, enchanted town where time seemed to move differently. I was there through the mentorship award from The VII Foundation and Leica, wandering, observing, and photographing the small encounters that made the unfamiliar briefly feel like home.",
        ],
      },
      { label: "Chapter III", targetId: null, paragraphs: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."] },
    ];
    const films = Array.from(document.querySelectorAll(".intermission-film"));

    const alignDescription = (index) => {
      const title = tabs[index === 1 ? 0 : index].querySelector("strong");
      if (!title) return;
      const offset = Math.max(
        0,
        title.getBoundingClientRect().top -
          chapterIndex.getBoundingClientRect().top,
      );
      description.style.setProperty(
        "--chapter-description-offset",
        `${offset}px`,
      );
    };

    const openVideo = (chapter, trigger) => {
      if (!chapter.videoSrc) {
        return;
      }
      if (document.querySelector(".intermission-video-modal")) {
        return;
      }

      const previousOverflow = document.documentElement.style.overflow;
      const modal = document.createElement("div");
      const header = document.createElement("div");
      const title = document.createElement("span");
      const close = document.createElement("button");
      const body = document.createElement("div");
      const frame = document.createElement("div");
      const player = document.createElement("video");

      modal.className = "intermission-video-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "Arles stop motion video");
      modal.tabIndex = -1;
      header.className = "intermission-video-modal-top";
      title.textContent = "ARLES · 2023";
      close.className = "intermission-video-modal-close";
      close.type = "button";
      close.setAttribute("aria-label", "Close video");
      close.textContent = "×";
      body.className = "intermission-video-modal-body";
      frame.className = "intermission-video-modal-frame";
      player.controls = true;
      player.playsInline = true;
      player.preload = "metadata";
      player.setAttribute("aria-label", "Arles, 2023 stop motion video");
      player.src = chapter.videoSrc;

      const closeVideo = () => {
        player.pause();
        modal.remove();
        document.documentElement.style.overflow = previousOverflow;
        window.removeEventListener("keydown", onKeyDown);
        trigger.focus();
      };
      const onKeyDown = (event) => {
        if (event.key === "Escape") closeVideo();
      };

      close.addEventListener("click", closeVideo);
      modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target === body) closeVideo();
      });
      window.addEventListener("keydown", onKeyDown);
      header.append(title, close);
      frame.append(player);
      body.append(frame);
      modal.append(header, body);
      document.body.append(modal);
      document.documentElement.style.overflow = "hidden";
      const playback = player.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => {});
      }
      modal.focus({ preventScroll: true });
    };

    const render = (index, focus = false) => {
      const chapter = chapters[index];
      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === index;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      description.id = `intermission-chapter-panel-${index + 1}`;
      description.setAttribute(
        "aria-labelledby",
        `intermission-chapter-tab-${index + 1}`,
      );
      description.replaceChildren(
        ...chapter.paragraphs.map((text) => {
          const paragraph = document.createElement("p");
          paragraph.textContent = text;
          return paragraph;
        }),
      );
      if (chapter.videoSrc) {
        const videoLink = document.createElement("button");
        videoLink.className = "intermission-video-link";
        videoLink.type = "button";
        videoLink.textContent = chapter.videoLabel || "Watch video ↗";
        videoLink.addEventListener("click", () =>
          openVideo(chapter, videoLink),
        );
        description.append(videoLink);
      }
      films.forEach((film) => {
        const active = film.id === chapter.targetId;
        film.hidden = !active;
        film.setAttribute("aria-hidden", String(!active));
      });
      if (chapter.targetId) {
        const enter = document.createElement("button");
        enter.className = "intermission-enter-series";
        enter.type = "button";
        enter.setAttribute(
          "aria-label",
          `Scroll down to ${chapter.label} photographic series`,
        );
        enter.innerHTML = "<span>↓</span>";
        enter.addEventListener("click", () => {
          document.getElementById(chapter.targetId)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
        description.append(enter);
      }
      if (scrollIndicator) {
        scrollIndicator.style.transform = `translate3d(0, ${index * 100}%, 0)`;
      }
      requestAnimationFrame(() => alignDescription(index));
      if (focus) tabs[index].focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => render(index));
      tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        render((index + direction + tabs.length) % tabs.length, true);
      });
    });
    window.addEventListener("resize", () => {
      const index = tabs.findIndex((tab) =>
        tab.classList.contains("is-active"),
      );
      alignDescription(Math.max(index, 0));
    });
    render(0);
  }

  function initializeIntermissionCopyright() {
    const source = document.querySelector(
      ".intermission-page > .project-copyright-footer--intermission",
    );
    const navigations = Array.from(
      document.querySelectorAll(".intermission-navigation"),
    );
    if (!source || !navigations.length) return;

    navigations.forEach((navigation, index) => {
      navigation.append(index === 0 ? source : source.cloneNode(true));
    });
  }

  function initializeIntermissionSequences() {
    const films = Array.from(document.querySelectorAll(".intermission-film"));
    films.forEach((film) => {
    const slides = Array.from(film.querySelectorAll(".intermission-slide"));
    const triggers = Array.from(
      film.querySelectorAll("[data-intermission-trigger]"),
    );
    const controls = film.querySelector(".intermission-navigation-controls");
    const progress = film.querySelector(".intermission-progress");
    const statement = document.querySelector(".intermission-statement");
    const page = document.querySelector(".intermission-page");
    if (!slides.length || !triggers.length || !controls) return;

    const buttons = Array.from(controls.querySelectorAll("button"));
    const counters = Array.from(controls.querySelectorAll(":scope > span"));
    let activeIndex = 0;
    let frame = 0;

    const imageSlides = slides.map((slide) => {
      const image = slide.querySelector("img");
      return {
        src: image?.getAttribute("src") || "",
        alt: image?.getAttribute("alt") || "Intermission photograph",
      };
    });

    const render = (index) => {
      activeIndex = index;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        const image = slide.querySelector("img");
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
        if (image) image.tabIndex = active ? 0 : -1;
      });
      if (buttons[0]) buttons[0].disabled = index === 0;
      if (buttons[1]) buttons[1].disabled = index === slides.length - 1;
      if (counters[0])
        counters[0].textContent = String(index + 1).padStart(2, "0");
      if (counters[1])
        counters[1].textContent = String(slides.length).padStart(2, "0");
      progress?.style.setProperty(
        "--progress",
        String((index + 1) / slides.length),
      );
    };

    const updateFromScroll = () => {
      frame = 0;
      if (film.hidden) return;
      const target = window.innerHeight * 0.5;
      let closest = 0;
      let distance = Number.POSITIVE_INFINITY;
      triggers.forEach((trigger, index) => {
        const rect = trigger.getBoundingClientRect();
        const current = Math.abs(rect.top + rect.height / 2 - target);
        if (current < distance) {
          distance = current;
          closest = index;
        }
      });
      render(closest);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(updateFromScroll);
    };

    const scrollToImage = (index) => {
      const trigger = triggers[index];
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const center = window.scrollY + rect.top + rect.height / 2;
      window.scrollTo({
        top: Math.max(0, center - window.innerHeight / 2),
        behavior: "smooth",
      });
    };

    const showImageWithoutScrolling = (index) => {
      const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
      if (nextIndex === activeIndex) return;
      render(nextIndex);
    };

    buttons[0]?.addEventListener("click", () =>
      showImageWithoutScrolling(activeIndex - 1),
    );
    buttons[1]?.addEventListener("click", () =>
      showImageWithoutScrolling(activeIndex + 1),
    );
    slides.forEach((slide, index) => {
      const image = slide.querySelector("img");
      if (!image) return;
      const open = () =>
        createLightbox({
          slides: imageSlides,
          startIndex: index,
          className: "intermission-lightbox",
          requestBrowserFullscreen: true,
        });
      image.addEventListener("click", open);
      image.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        open();
      });
    });

    film.classList.add("motion-ready");
    render(0);
    updateFromScroll();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    if (statement && page && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) =>
          page.classList.toggle("nav-on-light", entry.isIntersecting),
        { threshold: 0.05 },
      );
      observer.observe(statement);
    }
    });
  }

  initializeNavigation();
  initializeHomeVideo();
  initializeReveals();
  initializeHealersHeaderTransition();
  initializeHealersSlideshow();
  initializeMilkRouteLightbox();
  initializeHealersBackstory();
  initializeIntermissionChapters();
  initializeIntermissionCopyright();
  initializeIntermissionSequences();
})();
