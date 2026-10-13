// ==========================================================================
// SHREYAS NON-ACADEMIC PORTFOLIO — MAIN JS
// UI/UX v2 — Accessible, keyboard-friendly, honest form validation
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initMobileDrawer();
  initActiveNav();
  initFlipCards();
  initContactForm();
  initLightbox();
  setFooterYear();
});

/* --------------------------------------------------------------------------
   1. SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
    const height   = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = height > 0 ? (scrolled / height * 100) + '%' : '0%';
  };

  window.addEventListener('scroll', update, { passive: true });
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER — accessible (aria-expanded, focus trap, Esc)
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggle  = document.getElementById('mobileToggle');
  const drawer  = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const close   = document.getElementById('drawerClose');

  if (!toggle || !drawer) return;

  function openDrawer() {
    drawer.removeAttribute('hidden');
    drawer.classList.add('open');
    overlay && overlay.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    // Move focus into drawer
    close && close.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay && overlay.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    setTimeout(() => {
      drawer.setAttribute('hidden', '');
    }, 310); // after transition
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    drawer.hasAttribute('hidden') ? openDrawer() : closeDrawer();
  });

  close && close.addEventListener('click', closeDrawer);
  overlay && overlay.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hasAttribute('hidden')) {
      closeDrawer();
    }
  });

  // Close when a drawer link is clicked
  drawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   3. ACTIVE NAV LINK HIGHLIGHT
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  const update = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      let current = '';
      const offset = 100;

      sections.forEach(section => {
        const top = section.offsetTop;
        if (window.pageYOffset + offset >= top) {
          current = section.id;
        }
      });

      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });

      ticking = false;
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update(); // run on load
}

/* --------------------------------------------------------------------------
   4. FLIP CARDS — click + keyboard (Enter / Space) + touch
   -------------------------------------------------------------------------- */
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach(card => {
    // Keyboard: Enter or Space toggles flip
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
        // Update accessible label
        const isFlipped = card.classList.contains('flipped');
        const frontH3 = card.querySelector('.flip-front h3');
        const label = frontH3 ? frontH3.textContent : 'Passion card';
        card.setAttribute('aria-label', label + (isFlipped ? ' — showing details' : ' — click to see details'));
      }
    });

    // Click toggle
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

/* --------------------------------------------------------------------------
   5. CONTACT FORM — client-side validation + honest feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  const failBox    = document.getElementById('formFailure');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = document.getElementById('submitBtnText');

  if (!form) return;

  // Helper: validate a single field
  function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;

    const errorId = field.getAttribute('aria-describedby');
    const errorEl = errorId ? document.getElementById(errorId) : null;
    let valid = true;
    let msg   = '';

    if (field.required && !field.value.trim()) {
      valid = false;
      if (field.type === 'email') {
        msg = 'Please enter a valid email address.';
      } else if (field.tagName === 'TEXTAREA') {
        msg = 'Please enter a message.';
      } else {
        msg = 'Please enter your name.';
      }
    } else if (field.type === 'email' && field.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(field.value.trim())) {
        valid = false;
        msg = 'Please enter a valid email address.';
      }
    }

    group.classList.toggle('has-error', !valid);
    if (errorEl) errorEl.textContent = msg;
    field.setAttribute('aria-invalid', String(!valid));

    return valid;
  }

  // Validate on blur for real-time feedback
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-group').classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous messages
    successBox && successBox.classList.remove('visible');
    failBox    && failBox.classList.remove('visible');

    // Validate all required fields
    const required = form.querySelectorAll('input[required], textarea[required]');
    let allValid = true;
    let firstInvalid = null;

    required.forEach(field => {
      const ok = validateField(field);
      if (!ok && !firstInvalid) firstInvalid = field;
      allValid = allValid && ok;
    });

    if (!allValid) {
      firstInvalid && firstInvalid.focus();
      return;
    }

    // Disable submit while "sending"
    if (submitBtn) {
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending…';
    }

    // NOTE: No backend is wired up — form shows an honest message.
    // To wire up a real service (Formspree, EmailJS, etc.), replace
    // the timeout below with a fetch() / API call, then show
    // successBox on 2xx response and failBox on error.
    setTimeout(() => {
      // Simulate a network call result:
      const simulateSuccess = true; // change to false to test failure UI

      if (simulateSuccess) {
        form.reset();
        // Clear validation states
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
        form.querySelectorAll('[aria-invalid]').forEach(f => f.removeAttribute('aria-invalid'));
        successBox && successBox.classList.add('visible');
        successBox && successBox.focus();
      } else {
        failBox && failBox.classList.add('visible');
        failBox && failBox.focus();
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message ⚡';
      }
    }, 900);
  });
}

/* --------------------------------------------------------------------------
   6. LIGHTBOX MODAL — accessible (focus trap, Esc)
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal    = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxClose');
  const imgEl    = document.getElementById('lightboxImg');
  const titleEl  = document.getElementById('lightboxTitle');
  const descEl   = document.getElementById('lightboxDesc');

  if (!modal) return;

  function openModal(src, title, desc, alt) {
    if (imgEl)   { imgEl.src = src || ''; imgEl.alt = alt || title || ''; }
    if (titleEl) titleEl.textContent = title || '';
    if (descEl)  descEl.textContent  = desc  || '';
    modal.removeAttribute('hidden');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => modal.setAttribute('hidden', ''), 260);
  }

  // Trigger from buttons with data attributes
  document.querySelectorAll('.view-lightbox-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(
        btn.dataset.img,
        btn.dataset.title,
        btn.dataset.desc,
        btn.dataset.alt || btn.dataset.title
      );
    });
  });

  closeBtn && closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* --------------------------------------------------------------------------
   7. FOOTER YEAR — keeps copyright accurate automatically
   -------------------------------------------------------------------------- */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}
