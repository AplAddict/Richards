/**
 * MOBILE UX IMPROVEMENTS
 * Smooth scrolling, menu handling, accessibility enhancements
 */

(function() {
  'use strict';

  // ===== SMOOTH SCROLL HANDLING =====
  
  // Handle smooth scroll on anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        // Close mobile menu if open
        const navWrap = document.getElementById('nav-wrap');
        if (navWrap && navWrap.classList && navWrap.classList.contains(':target')) {
          navWrap.blur();
        }
        
        // Smooth scroll to target
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update hash without instant jump
        window.history.pushState(null, null, href);
      }
    });
  });

  // ===== MOBILE MENU CLOSE ON LINK CLICK =====
  
  const navLinks = document.querySelectorAll('#nav ul#nav li a');
  const navWrap = document.getElementById('nav-wrap');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Close menu on mobile
      if (navWrap && navWrap.style) {
        navWrap.style.display = '';
      }
    });
  });

  // ===== HEADER HIDE ON SCROLL DOWN / SHOW ON SCROLL UP =====
  
  let lastScrollTop = 0;
  const navBar = document.querySelector('#nav-wrap');
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.scrollY;
    
    // Only on mobile
    if (window.innerWidth <= 768) {
      if (currentScroll > lastScrollTop) {
        // Scrolling DOWN - hide nav
        navBar.style.top = '-100px';
        navBar.style.transition = 'top 0.3s ease-out';
      } else {
        // Scrolling UP - show nav
        navBar.style.top = '0';
        navBar.style.transition = 'top 0.3s ease-out';
      }
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });

  // ===== BUTTON TOUCH FEEDBACK =====
  
  const buttons = document.querySelectorAll('button, .button, .contact-phone-btn');
  
  buttons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.opacity = '0.9';
    });
    
    button.addEventListener('touchend', function() {
      this.style.opacity = '1';
    });
  });

  // ===== IMPROVE FOCUS HANDLING =====
  
  // Better keyboard navigation focus visibility
  let usingKeyboard = false;
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      usingKeyboard = true;
    }
  });
  
  document.addEventListener('mousedown', function() {
    usingKeyboard = false;
  });
  
  // Apply focus styles only when using keyboard
  const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
  
  focusableElements.forEach(el => {
    el.addEventListener('focus', function() {
      if (usingKeyboard) {
        this.style.outline = '2px solid #c71e1e';
        this.style.outlineOffset = '2px';
      }
    });
    
    el.addEventListener('blur', function() {
      this.style.outline = 'none';
    });
  });

  // ===== VIEWPORT HEIGHT FIX FOR MOBILE BROWSERS =====
  
  function fixViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  
  fixViewportHeight();
  window.addEventListener('resize', fixViewportHeight);

  // ===== DETECT MOBILE AND ADD CLASS =====
  
  function detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      document.body.classList.add('mobile-device');
    }
  }
  
  detectMobile();

  // ===== IMPROVE FORM INPUT UX =====
  
  const inputs = document.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    // Prevent zoom on focus in iOS
    input.addEventListener('focus', function() {
      if (document.body.classList.contains('mobile-device')) {
        // Input already has font-size: 16px in CSS to prevent zoom
        document.activeElement.scrollIntoView({ block: 'center' });
      }
    });
  });

  // ===== LAZY LOAD IMAGES FOR MOBILE =====
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ===== HANDLE DOUBLE TAP TO ZOOM PREVENTION =====
  
  // On modern mobile browsers, double-tap zoom is less of an issue,
  // but we can add touch-action: manipulation to buttons via CSS

  // ===== SCROLL PERFORMANCE OPTIMIZATION =====
  
  // Throttle scroll events for better performance
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        // Scroll event logic here if needed
        ticking = false;
      });
      ticking = true;
    }
  });

  // ===== HANDLE META VIEWPORT FOR DIFFERENT DEVICES =====
  
  function updateViewport() {
    const width = window.innerWidth;
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (width <= 768) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes');
    } else {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1');
    }
  }
  
  updateViewport();
  window.addEventListener('resize', updateViewport);

  // ===== ANNOUNCE SECTION CHANGES FOR ACCESSIBILITY =====
  
  const sections = document.querySelectorAll('section[id]');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        // Could announce section change for screen readers
        // console.log('Now viewing section:', entry.target.id);
      }
    });
  }, { threshold: 0.5 });
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });

})();
