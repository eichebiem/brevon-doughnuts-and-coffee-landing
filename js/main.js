/* =========================================================
   Brevon Doughnuts & Coffee — Idea 1: "Royal Classic"
   ========================================================= */

const PRICE_REGULAR = 44;
const PRICE_PREMIUM = 49;

/* ---------- Header shadow on scroll ---------- */
function initHeader() {
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile navigation ---------- */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
}

/* ---------- Menu filter ---------- */
function initMenuFilter() {
  const buttons = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll("#menuGrid .flavor");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });

      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });
}

/* ---------- Box calculator ---------- */
function initCalculator() {
  const regular = document.getElementById("calcRegular");
  const premium = document.getElementById("calcPremium");
  const countEl = document.getElementById("calcCount");
  const totalEl = document.getElementById("calcTotal");

  const toQty = (input) => Math.max(0, Math.min(99, parseInt(input.value, 10) || 0));

  const update = () => {
    const r = toQty(regular);
    const p = toQty(premium);
    const count = r + p;
    const total = r * PRICE_REGULAR + p * PRICE_PREMIUM;

    countEl.textContent = `${count} doughnut${count === 1 ? "" : "s"}`;
    totalEl.textContent = `₱${total.toLocaleString("en-PH")}`;
  };

  [regular, premium].forEach((input) => input.addEventListener("input", update));
  update();
}

/* ---------- Testimonial slider ---------- */
function initSlider() {
  const track = document.getElementById("sliderTrack");
  const dotsWrap = document.getElementById("sliderDots");
  const slides = track.children;
  const total = slides.length;
  let index = 0;
  let timer;

  const dots = Array.from({ length: total }, (_, i) => {
    const dot = document.createElement("button");
    dot.className = "slider__dot";
    dot.setAttribute("aria-label", `Show review ${i + 1}`);
    dot.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(i, userAction = false) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, n) => d.classList.toggle("is-active", n === index));
    if (userAction) restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 6000);
  }

  document.getElementById("sliderPrev").addEventListener("click", () => goTo(index - 1, true));
  document.getElementById("sliderNext").addEventListener("click", () => goTo(index + 1, true));

  goTo(0);
  restart();
}

/* ---------- FAQ ---------- */
function initFaq() {
  const items = document.querySelectorAll(".faq__item");

  items.forEach((item) => {
    const btn = item.querySelector(".faq__q");
    btn.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");

      // Only one answer open at a time
      items.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      });

      item.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });
}

/* ---------- Contact form (sent to Formspree) ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const submit = document.getElementById("formSubmit");
  const status = document.getElementById("formStatus");

  const setError = (input, message) => {
    const field = input.closest(".form__field");
    field.classList.toggle("has-error", Boolean(message));
    field.querySelector(".form__error").textContent = message;
  };

  const showStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle("form__status--error", isError);
    status.hidden = false;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll("[required]").forEach((input) => {
      const empty = !input.value.trim();
      setError(input, empty ? "Please fill this in." : "");
      if (empty) valid = false;
    });

    if (!valid) return;

    submit.disabled = true;
    submit.textContent = "Sending…";
    status.hidden = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Formspree responded with ${response.status}`);

      showStatus("Thank you! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      console.error(error);
      showStatus("Sorry, your message didn't go through. Please try again or call us at 0910 605 1604.", true);
    } finally {
      submit.disabled = false;
      submit.textContent = "Send Message";
    }
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => observer.observe(el));
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  initHeader();
  initNav();
  initMenuFilter();
  initCalculator();
  initSlider();
  initFaq();
  initContactForm();
  initReveal();
});
