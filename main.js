// ==========================================================================
// NEO-BRUTALIST NON-ACADEMIC PORTFOLIO — INTERACTIVE MAIN JS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initAnimatedCounters();
  initMobileDrawer();
  initActiveNav();
  initGalleryFilter();
  initLightbox();
  initFlipCards();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* --------------------------------------------------------------------------
   2. ANIMATED NUMBER COUNTERS
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          let start = 0;
          const duration = 1800; // ms
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              counter.textContent = target + '+';
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(start) + '+';
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const mobileToggle = document.getElementById('mobileToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });
}

/* --------------------------------------------------------------------------
   4. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. GALLERY CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'flex';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initLightbox() {
  const lightboxButtons = document.querySelectorAll('.view-lightbox-btn');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('lightboxClose');

  if (!modal) return;

  lightboxButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');

      if (modalImg) modalImg.src = imgSrc;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;

      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   7. FLIP CARD ACCESSIBILITY (TOUCH & CLICK TOGGLE)
   -------------------------------------------------------------------------- */
function initFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card');

  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

/* --------------------------------------------------------------------------
   8. CONTACT FORM HANDLER
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>SENDING... ⚡</span>';

    setTimeout(() => {
      alert('⚡ Message sent successfully! Thank you for reaching out. Let\'s connect soon!');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1000);
  });
}
