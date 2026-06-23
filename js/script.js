/* ============================================================
   Prime Facility Supplies — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Cache DOM Elements ----
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const sectionNavLinks = Array.from(navLinks).filter(link => {
    const href = link.getAttribute('href') || '';
    return href.startsWith('#');
  });
  const backToTop = document.getElementById('backToTop');
  const quoteModal = document.getElementById('quoteModal');
  const modalClose = document.getElementById('modalClose');
  const quoteForm = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  const contactForm = document.querySelector('form[action="https://formsubmit.co/suhailsiddiqui1993@gmail.com"]:not(.quick-enquiry-form)');
  const quickEnquiryForm = document.querySelector('.quick-enquiry-form');
  const faqItems = document.querySelectorAll('.faq-item');
  const statNumbers = document.querySelectorAll('.stat-item__number');

  // Quote trigger buttons
  const quoteBtns = [
    document.getElementById('headerQuoteBtn'),
    document.getElementById('heroQuoteBtn'),
    document.getElementById('ctaQuoteBtn')
  ];

  // ================================================================
  // HEADER — Scroll shadow
  // ================================================================
  function handleHeaderScroll() {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // ================================================================
  // BACK TO TOP — Show/hide
  // ================================================================
  function handleBackToTop() {
    if (!backToTop) return;

    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ================================================================
  // ACTIVE NAV LINK — Scroll spy
  // ================================================================
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    if (!sectionNavLinks.length || !sections.length) return;

    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        sectionNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Combined scroll handler
  window.addEventListener('scroll', () => {
    handleHeaderScroll();
    handleBackToTop();
    updateActiveNav();
  }, { passive: true });

  // ================================================================
  // MOBILE NAV — Hamburger toggle
  // ================================================================
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger) hamburger.classList.remove('active');
      if (nav) nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ================================================================
  // QUOTE MODAL
  // ================================================================
  function openModal() {
    if (!quoteModal || !quoteForm || !formSuccess) return;

    quoteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset form state
    quoteForm.style.display = '';
    formSuccess.style.display = 'none';
    clearFormErrors();
  }

  function closeModal() {
    if (!quoteModal) return;

    quoteModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  quoteBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openModal);
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close on overlay click (not modal body)
  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (quoteModal && e.key === 'Escape' && quoteModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ================================================================
  // FORM VALIDATION & SUBMISSION
  // ================================================================
  function clearFormErrors() {
    if (!quoteForm) return;

    quoteForm.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    quoteForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }

  function validateForm() {
    if (!quoteForm) return false;

    clearFormErrors();
    let valid = true;

    const name = document.getElementById('qName');
    const phone = document.getElementById('qPhone');
    const email = document.getElementById('qEmail');

    // Name validation
    if (!name.value.trim()) {
      document.getElementById('qNameError').textContent = 'Please enter your name.';
      name.classList.add('error');
      valid = false;
    }

    // Phone validation — digits only, max 15 chars
    const phoneVal = phone.value.trim();
    if (!phoneVal) {
      document.getElementById('qPhoneError').textContent = 'Please enter your phone number.';
      phone.classList.add('error');
      valid = false;
    } else if (!/^\d{7,15}$/.test(phoneVal)) {
      document.getElementById('qPhoneError').textContent = 'Enter a valid phone number (digits only, up to 15).';
      phone.classList.add('error');
      valid = false;
    }

    // Email validation
    if (!email.value.trim()) {
      document.getElementById('qEmailError').textContent = 'Please enter your email.';
      email.classList.add('error');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      document.getElementById('qEmailError').textContent = 'Enter a valid email address.';
      email.classList.add('error');
      valid = false;
    }

    // Message validation
    const message = document.getElementById('qMessage');
    if (message && !message.value.trim()) {
      const msgError = document.getElementById('qMessageError');
      if (msgError) msgError.textContent = 'Please enter your requirements.';
      message.classList.add('error');
      valid = false;
    }

    return valid;
  }

  function getAjaxEndpoint(form) {
    const action = form.getAttribute('action');

    if (action && action.startsWith('https://formsubmit.co/')) {
      return action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
    }

    return 'https://formsubmit.co/ajax/suhailsiddiqui1993@gmail.com';
  }

  function getInlineSuccessBox(form) {
    let successBox = form.nextElementSibling;

    if (!successBox || !successBox.classList.contains('form-submit-success')) {
      successBox = document.createElement('div');
      successBox.className = 'form-submit-success';
      successBox.style.display = 'none';
      successBox.innerHTML = `
        <span class="form-submit-success__icon">✅</span>
        <h4>Thank You!</h4>
        <p>Your request has been received. We'll contact you within 24 hours.</p>
      `;
      form.insertAdjacentElement('afterend', successBox);
    }

    return successBox;
  }

  async function submitFormAjax(form) {
    const formData = Object.fromEntries(new FormData(form));
    const response = await fetch(getAjaxEndpoint(form), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData)
    });

    return response.json();
  }

  function wireInlineAjaxForm(form, submitLabel) {
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.reportValidity()) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      try {
        const data = await submitFormAjax(form);
        if (data.success) {
          const successBox = getInlineSuccessBox(form);
          form.style.display = 'none';
          successBox.style.display = 'block';
          form.reset();
        } else {
          alert('Submission failed. Please try again.');
        }
      } catch (err) {
        alert('Network error. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      try {
        const data = await submitFormAjax(quoteForm);
        if (data.success) {
          quoteForm.style.display = 'none';
          formSuccess.style.display = 'block';
          quoteForm.reset();
        } else {
          alert('Submission failed. Please try again.');
        }
      } catch (err) {
        alert('Network error. Please try again.');
      } finally {
        submitBtn.textContent = 'Submit Request';
        submitBtn.disabled = false;
      }
    });
  }

  wireInlineAjaxForm(contactForm, 'Send Enquiry →');
  wireInlineAjaxForm(quickEnquiryForm, 'Send Enquiry →');

  // ================================================================
  // FAQ ACCORDION
  // ================================================================
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ================================================================
  // ANIMATED COUNTER — Intersection Observer
  // ================================================================
  let counterAnimated = false;

  function animateCounters() {
    if (counterAnimated) return;
    counterAnimated = true;

    statNumbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        num.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          num.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(updateCount);
    });
  }

  // ================================================================
  // SCROLL ANIMATIONS — Intersection Observer
  // ================================================================
  // Add fade-in class to animatable elements
  const animatableSelectors = [
    '.about__glance-card',
    '.about__story',
    '.cat-card',
    '.adv-card',
    '.step-card',
    '.review-card',
    '.faq-item',
    '.section-header'
  ];

  animatableSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('fade-in');
    });
  });

  // Observe elements
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
  });

  // Counter observer
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(statsSection);
  }

  // ================================================================
  // STAGGERED ANIMATION DELAYS
  // ================================================================
  function addStaggerDelay(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });
  }

  addStaggerDelay('.cat-card');
  addStaggerDelay('.adv-card');
  addStaggerDelay('.step-card');
  addStaggerDelay('.review-card');

  // ================================================================
  // SMOOTH SCROLL for anchor links (fallback)
  // ================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ================================================================
  // INITIAL CALLS
  // ================================================================
  handleHeaderScroll();
  handleBackToTop();
});
