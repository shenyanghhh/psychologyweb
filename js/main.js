(function () {
  'use strict';

  /* ----------------------------------------------------------
     Mobile navigation toggle
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when a link is clicked
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------
     Navbar: add shadow on scroll
  ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(30,52,72,0.12)'
        : '0 2px 12px rgba(30,52,72,0.06)';
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Intake form: Formspree AJAX submission
  ---------------------------------------------------------- */
  const form        = document.getElementById('intake-form');
  const successMsg  = document.getElementById('form-success');
  const errorMsg    = document.getElementById('form-error');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Hide any previous feedback
      successMsg.hidden = true;
      errorMsg.hidden   = true;

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';

      try {
        const data = new FormData(form);
        const response = await fetch(form.action, {
          method:  'POST',
          body:    data,
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          form.reset();
          successMsg.hidden = false;
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          errorMsg.hidden = false;
          errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } catch (_err) {
        errorMsg.hidden = false;
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /* ----------------------------------------------------------
     Animate sections into view on scroll (fade-in-up)
  ---------------------------------------------------------- */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.expertise-card, .step, .about__content, .intake-form').forEach(function (el) {
    el.classList.add('fade-in-up');
    observer.observe(el);
  });

  /* ----------------------------------------------------------
     Sidebar: keep --navbar-h in sync with actual navbar height
  ---------------------------------------------------------- */
  const navbarEl = document.querySelector('.navbar');
  function syncNavbarHeight() {
    if (navbarEl) {
      document.documentElement.style.setProperty('--navbar-h', navbarEl.offsetHeight + 'px');
    }
  }
  syncNavbarHeight();
  window.addEventListener('resize', syncNavbarHeight, { passive: true });

})();
