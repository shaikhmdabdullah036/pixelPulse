
(function () {
  "use strict";

  var CAROUSEL_IMAGES = [
    {
      src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop&q=80",
      alt: "Industrial pipeline installation",
    },
    {
      src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80",
      alt: "Construction and civil infrastructure",
    },
    {
      src: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=1200&auto=format&fit=crop&q=80",
      alt: "Engineering and hardware",
    },
    {
      src: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&auto=format&fit=crop&q=80",
      alt: "Industrial facility",
    },
    {
      src: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&auto=format&fit=crop&q=80",
      alt: "Factory floor piping",
    },
    {
      src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&auto=format&fit=crop&q=80",
      alt: "Heavy industry equipment",
    },
  ];

  var ZOOM_FACTOR = 2;

  var navToggle = document.getElementById("navToggle");
  var navPanel = document.getElementById("navPanel");
  var productsBtn = document.getElementById("productsBtn");
  var productsMenu = document.getElementById("productsMenu");
  var carousel = document.getElementById("carousel");
  var carouselTrack = document.getElementById("carouselTrack");
  var carouselPrev = document.getElementById("carouselPrev");
  var carouselNext = document.getElementById("carouselNext");
  var carouselThumbs = document.getElementById("carouselThumbs");
  var zoomPanel = document.getElementById("zoomPanel");
  var zoomViewport = document.getElementById("zoomViewport");
  var yearEl = document.getElementById("year");
  var downloadSheet = document.getElementById("download-sheet");

  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  function thumbUrl(fullSrc) {
    return String(fullSrc).replace(/w=\d+/, "w=200");
  }


  function closeMobileNav() {
    if (navPanel) navPanel.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", function () {
      var open = navPanel.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileNav();
        closeProductsMenu();
      });
    });
  }


  function closeProductsMenu() {
    if (!productsBtn || !productsMenu) return;
    productsBtn.setAttribute("aria-expanded", "false");
    productsMenu.setAttribute("hidden", "");
  }

  function toggleProductsMenu() {
    if (!productsBtn || !productsMenu) return;
    var open = productsBtn.getAttribute("aria-expanded") === "true";
    productsBtn.setAttribute("aria-expanded", open ? "false" : "true");
    if (open) productsMenu.setAttribute("hidden", "");
    else productsMenu.removeAttribute("hidden");
  }

  if (productsBtn && productsMenu) {
    productsBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleProductsMenu();
    });

    document.addEventListener("click", function () {
      closeProductsMenu();
    });

    productsMenu.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }


  var currentIndex = 0;
  var slides = [];
  var thumbButtons = [];

  function buildCarousel() {
    if (!carouselTrack || !carouselThumbs) return;

    carouselTrack.textContent = "";
    carouselThumbs.textContent = "";

    CAROUSEL_IMAGES.forEach(function (item, i) {
      var li = document.createElement("li");
      li.className = "carousel__slide" + (i === 0 ? " is-active" : "");
      li.setAttribute("role", "tabpanel");
      li.setAttribute("aria-label", "Slide " + (i + 1) + " of " + CAROUSEL_IMAGES.length);

      var inner = document.createElement("div");
      inner.className = "carousel__slide-inner";

      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.loading = "eager";
      img.decoding = "async";

      var lens = document.createElement("div");
      lens.className = "carousel__lens";
      lens.setAttribute("aria-hidden", "true");
      var lensIcon = document.createElement("span");
      lensIcon.className = "carousel__lens-icon";
      lensIcon.setAttribute("aria-hidden", "true");
      lens.appendChild(lensIcon);

      inner.appendChild(img);
      inner.appendChild(lens);
      li.appendChild(inner);

      inner.addEventListener("mouseenter", function () {
        if (!prefersFinePointerHover() || prefersReducedMotion()) return;
        li.classList.add("is-zooming");
        activateZoomFromSlide(li, img);
        syncLensBackground(lens, img);
      });
      inner.addEventListener("mousemove", function (e) {
        if (!prefersFinePointerHover() || prefersReducedMotion()) return;
        updateZoomFromEvent(e, img);
        updateLensPosition(e, inner, lens, img);
      });
      inner.addEventListener("mouseleave", function () {
        li.classList.remove("is-zooming");
        if (prefersFinePointerHover()) deactivateZoom();
        hideLens(lens);
      });

      carouselTrack.appendChild(li);
      slides.push(li);

      var tb = document.createElement("button");
      tb.type = "button";
      tb.className = "carousel__thumb";
      tb.setAttribute("role", "tab");
      tb.setAttribute("aria-label", "Show image " + (i + 1));
      tb.setAttribute("aria-selected", i === 0 ? "true" : "false");
      var timg = document.createElement("img");
      timg.src = thumbUrl(item.src);
      timg.alt = "";
      tb.appendChild(timg);
      tb.addEventListener("click", function () {
        goToSlide(i);
      });
      carouselThumbs.appendChild(tb);
      thumbButtons.push(tb);
    });

    updateCarousel(false);
  }

  function goToSlide(index) {
    var len = slides.length;
    if (!len) return;
    currentIndex = ((index % len) + len) % len;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === currentIndex);
      slide.classList.remove("is-zooming");
      var loupe = slide.querySelector(".carousel__lens");
      if (loupe) hideLens(loupe);
    });
    thumbButtons.forEach(function (t, i) {
      t.setAttribute("aria-selected", i === currentIndex ? "true" : "false");
    });
    updateCarousel(true);
    if (!prefersFinePointerHover()) {
      applyZoomForActiveSlideNoHover();
    } else {
      deactivateZoom();
    }
  }

  function updateCarousel(animate) {
    if (!carouselTrack) return;
    var offset = -currentIndex * 100;
    carouselTrack.style.transition = animate ? "" : "none";
    carouselTrack.style.transform = "translateX(" + offset + "%)";
    if (!animate) {
      void carouselTrack.offsetHeight;
      carouselTrack.style.transition = "";
    }
  }

  if (carouselPrev) {
    carouselPrev.addEventListener("click", function () {
      goToSlide(currentIndex - 1);
    });
  }
  if (carouselNext) {
    carouselNext.addEventListener("click", function () {
      goToSlide(currentIndex + 1);
    });
  }

  if (carousel) {
    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      }
    });
  }

  var touchStartX = 0;
  if (carousel) {
    var trackWrap = carousel.querySelector(".carousel__track-wrap");
    if (trackWrap) {
      trackWrap.addEventListener(
        "touchstart",
        function (e) {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
      trackWrap.addEventListener(
        "touchend",
        function (e) {
          var dx = e.changedTouches[0].screenX - touchStartX;
          if (Math.abs(dx) > 50) {
            if (dx < 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
          }
        },
        { passive: true }
      );
    }
  }


  function setZoomBackground(el, img) {
    if (!el || !img) return;
    var url = String(img.currentSrc || img.src).replace(/"/g, '\\"');
    el.style.backgroundImage = 'url("' + url + '")';
    el.style.backgroundSize = ZOOM_FACTOR * 100 + "% " + ZOOM_FACTOR * 100 + "%";
    el.style.backgroundRepeat = "no-repeat";
  }

  function activateZoomFromSlide(li, img) {
    if (!zoomPanel || !zoomViewport || prefersReducedMotion()) return;
    zoomPanel.classList.add("is-active");
    zoomPanel.setAttribute("aria-hidden", "false");
    setZoomBackground(zoomViewport, img);
    zoomViewport.style.backgroundPosition = "50% 50%";
  }

  function updateZoomFromEvent(e, img) {
    if (!zoomViewport || !img) return;
    var rect = img.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    var x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    var y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    zoomViewport.style.backgroundPosition = x * 100 + "% " + y * 100 + "%";
  }

  function syncLensBackground(lens, img) {
    if (!lens || !img) return;
    lens.classList.add("is-visible");
  }

  function hideLens(lens) {
    if (!lens) return;
    lens.classList.remove("is-visible");
  }

  function updateLensPosition(e, innerEl, lens, img) {
    if (!innerEl || !lens || !img) return;
    var rect = innerEl.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    var lensW = lens.offsetWidth || 120;
    var lensH = lens.offsetHeight || 120;
    var cx = e.clientX - rect.left;
    var cy = e.clientY - rect.top;
    var left = clamp(cx - lensW / 2, 0, rect.width - lensW);
    var top = clamp(cy - lensH / 2, 0, rect.height - lensH);
    lens.style.left = left + "px";
    lens.style.top = top + "px";
  }

  function deactivateZoom() {
    if (!zoomPanel || !zoomViewport) return;
    zoomPanel.classList.remove("is-active");
    zoomPanel.setAttribute("aria-hidden", "true");
    zoomViewport.style.backgroundImage = "";
  }

  function prefersFinePointerHover() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function applyZoomForActiveSlideNoHover() {
    if (!slides.length) return;
    /* Preview sits over the title — only show it with fine-pointer hover, not stuck on for touch */
    if (!prefersFinePointerHover()) deactivateZoom();
  }

  buildCarousel();
  applyZoomForActiveSlideNoHover();

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  if (downloadSheet) {
    downloadSheet.addEventListener("click", function (e) {
      e.preventDefault();
    });
  }


  var PROCESS_STEPS = [
    {
      label: "Raw material",
      title: "High-grade raw material selection",
      body: "Virgin PE100 compound is verified for density, melt flow, and stress crack resistance before it enters the extrusion line, keeping wall structure uniform end-to-end.",
      bullets: ["PE100 grade material", "Optimal molecular weight distribution"],
      img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=1000&auto=format&fit=crop&q=80",
      alt: "Engineering materials inspection",
    },
    {
      label: "Extrusion",
      title: "Precision single-screw extrusion",
      body: "Temperature-profiled barrels and grooved feed zones melt PE consistently while minimizing oxidative degradation before the melt enters the die package.",
      bullets: ["Stable melt pressure", "Clean die exit geometry"],
      img: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1000&auto=format&fit=crop&q=80",
      alt: "Extrusion hall",
    },
    {
      label: "Cooling",
      title: "Controlled cooling sequence",
      body: "Spray and bath cooling relax stress in the wall while preserving dimensional stability as the pipe exits the extrusion line.",
      bullets: ["Even wall crystallinity", "Reduced ovality"],
      img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1000&auto=format&fit=crop&q=80",
      alt: "Cooling and handling",
    },
    {
      label: "Sizing",
      title: "Vacuum calibration & sizing",
      body: "Vacuum sizing tanks and precision sleeves lock OD and wall thickness within tight tolerances for the full production run.",
      bullets: ["OD/ID within standard limits", "Laser gauging checkpoints"],
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&auto=format&fit=crop&q=80",
      alt: "Calibration zone",
    },
    {
      label: "Quality control",
      title: "In-line quality control",
      body: "Destructive and non-destructive checks—including hydrostatic proof, melt index spot checks, and surface inspection—gate release to marking and dispatch.",
      bullets: ["Batch records per coil / length", "Pressure test certificates"],
      img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1000&auto=format&fit=crop&q=80",
      alt: "Quality checks",
    },
    {
      label: "Marking",
      title: "Durable marking & traceability",
      body: "Laser or ink-jet codes carry standard reference, production date, and traceability fields required by specification and client QA.",
      bullets: ["Readable for service life", "Aligned to ISO marking annexes"],
      img: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1000&auto=format&fit=crop&q=80",
      alt: "Pipe marking",
    },
    {
      label: "Cutting",
      title: "Accurate cutting to length",
      body: "Planetary or guillotine cutters deliver square ends and deburred edges ready for fusion or coupling installation.",
      bullets: ["Length tolerance per order", "Ends prepared for field fusion"],
      img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=1000&auto=format&fit=crop&q=80",
      alt: "Cutting line",
    },
    {
      label: "Packaging",
      title: "Secure packaging & dispatch",
      body: "Coils are wrapped and sticks bundled to protect surfaces during transport; load manifests tie back to batch records.",
      bullets: ["Export-ready crating on request", "Lift points marked for site unloading"],
      img: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1000&auto=format&fit=crop&q=80",
      alt: "Packaging yard",
    },
  ];

  function initProcessTabs() {
    var tabsContainer = document.getElementById("processTabs");
    var titleEl = document.getElementById("processStepTitle");
    var bodyEl = document.getElementById("processStepBody");
    var bulletsEl = document.getElementById("processStepBullets");
    var imgEl = document.getElementById("processStepImg");
    var prevBtn = document.getElementById("processImgPrev");
    var nextBtn = document.getElementById("processImgNext");
    if (!tabsContainer || !titleEl || !bodyEl || !bulletsEl || !imgEl) return;

    var active = 0;

    function renderStep(i) {
      active = (i + PROCESS_STEPS.length) % PROCESS_STEPS.length;
      var s = PROCESS_STEPS[active];
      titleEl.textContent = s.title;
      bodyEl.textContent = s.body;
      bulletsEl.innerHTML = "";
      s.bullets.forEach(function (b) {
        var li = document.createElement("li");
        li.textContent = b;
        bulletsEl.appendChild(li);
      });
      imgEl.src = s.img;
      imgEl.alt = s.alt;
      var tabs = tabsContainer.querySelectorAll('[role="tab"]');
      tabs.forEach(function (tb, idx) {
        tb.setAttribute("aria-selected", idx === active ? "true" : "false");
      });
    }

    PROCESS_STEPS.forEach(function (step, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "process__tab";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", idx === 0 ? "true" : "false");
      b.textContent = step.label;
      b.addEventListener("click", function () {
        renderStep(idx);
      });
      tabsContainer.appendChild(b);
    });

    renderStep(0);

    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        renderStep(active - 1);
      });
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        renderStep(active + 1);
      });
  }

  initProcessTabs();


  function initAppsCarousel() {
    var view = document.querySelector(".applications__viewport");
    var prev = document.getElementById("appsPrev");
    var next = document.getElementById("appsNext");
    if (!view || !prev || !next) return;
    function stepPx() {
      return Math.round(Math.min(view.clientWidth * 0.75, 340));
    }
    prev.addEventListener("click", function () {
      view.scrollBy({ left: -stepPx(), behavior: "smooth" });
    });
    next.addEventListener("click", function () {
      view.scrollBy({ left: stepPx(), behavior: "smooth" });
    });
  }

  initAppsCarousel();


  document.querySelectorAll("[data-dl]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
    });
  });

  var catalogueForm = document.getElementById("catalogueForm");
  if (catalogueForm) {
    catalogueForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = document.getElementById("catalogueEmail");
      if (em && em.value) window.alert("Thanks — we will send the catalogue to " + em.value);
      else window.alert("Please enter a valid email.");
    });
  }

  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.alert("Thank you — our team will respond with a quote shortly.");
    });
  }
})();
