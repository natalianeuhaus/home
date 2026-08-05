(() => {
  const html = document.documentElement;

  function initializeNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    const panel = document.querySelector(".menu-panel");
    if (!toggle || !panel) return;

    let scrim = null;
    const links = Array.from(panel.querySelectorAll("a"));

    const setOpen = (open) => {
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
    links.forEach((link) => link.addEventListener("click", () => setOpen(false)));
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

  function createLightbox({ slides, startIndex, className }) {
    let activeIndex = startIndex;
    const dialog = document.createElement("div");
    const prefix = className;
    const previousOverflow = html.style.overflow;

    dialog.className = prefix;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");

    const close = document.createElement("button");
    close.className = `${prefix}-close`;
    close.type = "button";
    close.setAttribute("aria-label", "Close fullscreen slideshow");
    close.textContent = "×";

    const previous = document.createElement("button");
    previous.className = `${prefix}-arrow ${prefix}-arrow--previous`;
    previous.type = "button";
    previous.setAttribute("aria-label", "Previous photograph");
    previous.textContent = "←";

    const viewport = document.createElement("div");
    viewport.className = `${prefix}-viewport`;
    const track = document.createElement("div");
    track.className = `${prefix}-track`;

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
    next.className = `${prefix}-arrow ${prefix}-arrow--next`;
    next.type = "button";
    next.setAttribute("aria-label", "Next photograph");
    next.textContent = "→";

    dialog.append(close, previous, viewport, next);
    document.body.append(dialog);
    html.style.overflow = "hidden";

    const render = () => {
      dialog.setAttribute(
        "aria-label",
        `Fullscreen photograph ${activeIndex + 1} of ${slides.length}`,
      );
      track.style.transform = `translate3d(-${activeIndex * 100}%, 0, 0)`;
      previous.disabled = activeIndex === 0;
      next.disabled = activeIndex === slides.length - 1;
      figures.forEach((item, index) => {
        const isActive = index === activeIndex;
        item.figure.setAttribute("aria-hidden", String(!isActive));
        item.image.alt = isActive ? item.alt : "";
        item.image.loading = Math.abs(index - activeIndex) <= 1 ? "eager" : "lazy";
      });
    };

    const destroy = () => {
      window.removeEventListener("keydown", onKeyDown);
      html.style.overflow = previousOverflow;
      dialog.remove();
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") destroy();
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
    render();
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
      if (!Number.isInteger(index) || index < 0 || index >= slides.length) return;
      createLightbox({
        slides,
        startIndex: index,
        className: "healers-lightbox",
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

  function initializeIntermissionChapters() {
    const tabs = Array.from(
      document.querySelectorAll(".intermission-chapter-tabs button"),
    );
    const description = document.querySelector(".intermission-chapter-description");
    const chapterIndex = document.querySelector(".intermission-chapter-index");
    const scrollIndicator = document.querySelector(".intermission-chapter-scroll span");
    if (!tabs.length || !description || !chapterIndex) return;

    const chapters = [
      {
        label: "Chapter I",
        paragraphs: [
          "New York City was one of the hardest-hit cities in the United States during COVID-19. This chapter is a visual archive of a city famous for its fast-paced streets and congested sidewalks, forced to pause.",
          "The invisible disease shut down the city. Stores were left suspended in time, displaying winter fashion well into spring. Time was nowhere to be seen. Then George Floyd was killed, and people filled the streets to protest yet another Black man killed by police.",
          "Chapter I moves from lockdown and shutdown through the beginning of 2021.",
        ],
      },
      { label: "Chapter II", paragraphs: ["XXXX"] },
      { label: "Chapter III", paragraphs: ["XXXX"] },
    ];

    const alignDescription = (index) => {
      const title = tabs[index].querySelector("strong");
      if (!title) return;
      const offset = Math.max(
        0,
        title.getBoundingClientRect().top - chapterIndex.getBoundingClientRect().top,
      );
      description.style.setProperty("--chapter-description-offset", `${offset}px`);
    };

    const render = (index, focus = false) => {
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
        ...chapters[index].paragraphs.map((text) => {
          const paragraph = document.createElement("p");
          paragraph.textContent = text;
          return paragraph;
        }),
      );
      const enter = document.createElement("button");
      enter.className = "intermission-enter-series";
      enter.type = "button";
      enter.setAttribute("aria-label", "Scroll down to the photographic series");
      enter.innerHTML = "<span>↓</span>";
      enter.addEventListener("click", () => {
        document.getElementById("chapter-1")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      description.append(enter);
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
      const index = tabs.findIndex((tab) => tab.classList.contains("is-active"));
      alignDescription(Math.max(index, 0));
    });
    render(0);
  }

  function initializeIntermissionSequence() {
    const film = document.querySelector(".intermission-film");
    if (!film) return;

    const slides = Array.from(film.querySelectorAll(".intermission-slide"));
    const triggers = Array.from(film.querySelectorAll("[data-intermission-trigger]"));
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
      if (counters[0]) counters[0].textContent = String(index + 1).padStart(2, "0");
      if (counters[1]) counters[1].textContent = String(slides.length).padStart(2, "0");
      progress?.style.setProperty("--progress", String((index + 1) / slides.length));
    };

    const updateFromScroll = () => {
      frame = 0;
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

    buttons[0]?.addEventListener("click", () => scrollToImage(activeIndex - 1));
    buttons[1]?.addEventListener("click", () => scrollToImage(activeIndex + 1));
    slides.forEach((slide, index) => {
      const image = slide.querySelector("img");
      if (!image) return;
      const open = () =>
        createLightbox({
          slides: imageSlides,
          startIndex: index,
          className: "intermission-lightbox",
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
        ([entry]) => page.classList.toggle("nav-on-light", entry.isIntersecting),
        { threshold: 0.05 },
      );
      observer.observe(statement);
    }
  }

  initializeNavigation();
  initializeHomeVideo();
  initializeReveals();
  initializeHealersSlideshow();
  initializeIntermissionChapters();
  initializeIntermissionSequence();
})();
