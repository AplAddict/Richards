const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const topbar = document.getElementById('topbar');
const topbarClose = document.querySelector('[data-close-topbar]');
const siteNav = document.querySelector('.site-nav');
const processToggles = document.querySelectorAll('[data-process-toggle]');
const processPanels = document.querySelectorAll('[data-process-panel]');
const statusLookupForm = document.querySelector('[data-status-lookup-form]');
const statusPhoneInput = document.querySelector('[data-status-phone]');
const statusSubmitButton = document.querySelector('[data-status-submit]');
const certTriggers = document.querySelectorAll('[data-cert-trigger]');
const certModal = document.querySelector('[data-cert-modal]');
const certModalImage = certModal?.querySelector('[data-cert-modal-image]');
const certModalTitle = certModal?.querySelector('[data-cert-modal-title]');
const certModalDescription = certModal?.querySelector('[data-cert-modal-description]');
const certModalNote = certModal?.querySelector('[data-cert-modal-note]');
const hero = document.getElementById('home');
const heroVideo = document.getElementById('video-background');
const chatSelector = document.querySelector('call-us-selector');
let lastScrollY = window.scrollY;
let lastNavZoneId = hero ? hero.id : '';

const setNavMotion = (motion) => {
  if (!siteNav) return;
  const motions = ['hero-enter', 'hero-exit', 'reviews-enter', 'reviews-exit', 'menu'];
  motions.forEach((name) => siteNav.classList.remove(`nav-motion-${name}`));
  siteNav.classList.add(`nav-motion-${motion}`);
};

const rafThrottle = (callback) => {
  let scheduled = false;
  return () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      callback();
    });
  };
};

const syncViewportHeight = () => {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};

const syncTopbarOffset = () => {
  const widgetDismissed = !!topbar?.querySelector('.es-announcement-bar-closed');
  topbar?.classList.toggle('is-collapsed', widgetDismissed && !topbar.hidden);
  const topbarVisible = !!(
    topbar
    && !topbar.hidden
    && !topbar.classList.contains('is-collapsed')
    && window.getComputedStyle(topbar).display !== 'none'
  );
  const topbarHeight = topbarVisible ? topbar.offsetHeight : 0;
  const navHeight = siteNav?.offsetHeight || 84;
  const navTop = topbarVisible && window.scrollY < topbarHeight ? `${topbarHeight}px` : '0px';
  document.documentElement.style.setProperty('--topbar-offset', `${topbarHeight}px`);
  document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
  document.documentElement.style.setProperty('--nav-top', navTop);
  siteNav?.classList.toggle('is-scrolled', window.scrollY > Math.max(24, topbarHeight));
};

const syncNavVisibility = () => {
  if (!siteNav) return;

  const menuOpen = navToggle?.getAttribute('aria-expanded') === 'true';
  const heroSection = document.querySelector('.hero');
  const navHeight = siteNav.offsetHeight || 84;
  const visibleZones = Array.from(document.querySelectorAll('[data-nav-visible]'));
  const fallbackZones = ['#home', '#status', '#certifications', '#dropoff', '#storage', '#about']
    .map((selector) => document.querySelector(selector))
    .filter(Boolean);
  const zones = visibleZones.length ? visibleZones : fallbackZones;
  const zonePaddingTop = navHeight + 28;
  const zonePaddingBottom = Math.max(64, Math.round(window.innerHeight * 0.18));
  const scrollY = window.scrollY;
  const scrollDirection = scrollY >= lastScrollY ? 'down' : 'up';
  const activeZone = zones.find((section) => {
    const sectionTop = section.offsetTop - zonePaddingTop;
    const sectionBottom = section.offsetTop + section.offsetHeight + zonePaddingBottom;
    return scrollY >= sectionTop && scrollY <= sectionBottom;
  });

  const heroThreshold = heroSection
    ? Math.max(72, heroSection.offsetHeight - navHeight - 48)
    : 140;

  if (menuOpen) {
    setNavMotion('menu');
    siteNav.classList.remove('is-hidden');
    lastScrollY = scrollY;
    return;
  }

  if (scrollY <= heroThreshold) {
    setNavMotion(scrollDirection === 'down' ? 'hero-enter' : 'hero-enter');
    siteNav.classList.remove('is-hidden');
    lastNavZoneId = 'home';
    lastScrollY = scrollY;
    return;
  }

  if (activeZone) {
    const zoneMotion = activeZone.dataset.navMotion || 'reviews';
    setNavMotion(zoneMotion === 'hero' ? 'hero-enter' : 'reviews-enter');
    siteNav.classList.remove('is-hidden');
    lastNavZoneId = activeZone.id || zoneMotion;
    lastScrollY = scrollY;
    return;
  }

  const exitingMotion = lastNavZoneId === 'reviews' ? 'reviews-exit' : 'hero-exit';
  setNavMotion(exitingMotion);
  siteNav.classList.add('is-hidden');
  lastScrollY = scrollY;
};

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('is-open', !expanded);
    siteNav?.classList.remove('is-hidden');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    });
  });
}

if (topbar && topbarClose) {
  const hidden = window.localStorage.getItem('richardsTopbarDismissed') === '1';
  if (hidden) {
    topbar.hidden = true;
  }

  topbarClose.addEventListener('click', () => {
    topbar.hidden = true;
    window.localStorage.setItem('richardsTopbarDismissed', '1');
    syncTopbarOffset();
  });
}

if (processToggles.length && processPanels.length) {
  const setActiveProcess = (id) => {
    processToggles.forEach((toggle) => {
      const active = toggle.dataset.processToggle === id;
      toggle.classList.toggle('is-active', active);
      toggle.setAttribute('aria-expanded', String(active));
    });

    processPanels.forEach((panel) => {
      panel.hidden = panel.dataset.processPanel !== id;
    });
  };

  processToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const id = toggle.dataset.processToggle;
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      setActiveProcess(expanded ? '' : id);
    });
  });

  setActiveProcess('');
}

if (statusLookupForm && statusPhoneInput && statusSubmitButton) {
  const normalizePhoneDigits = (value) => {
    let digits = value.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) {
      digits = digits.slice(1);
    }
    return digits.slice(0, 10);
  };

  const formatPhone = (value) => {
    const digits = normalizePhoneDigits(value);
    if (!digits) return '';
    if (digits.length < 4) return `(${digits}`;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const syncStatusSubmit = () => {
    const digits = normalizePhoneDigits(statusPhoneInput.value);
    statusSubmitButton.disabled = digits.length !== 10;
  };

  statusPhoneInput.addEventListener('input', () => {
    statusPhoneInput.value = formatPhone(statusPhoneInput.value);
    syncStatusSubmit();
  });

  statusPhoneInput.addEventListener('blur', () => {
    statusPhoneInput.value = formatPhone(statusPhoneInput.value);
  });

  statusLookupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const digits = normalizePhoneDigits(statusPhoneInput.value);
    if (digits.length !== 10) return;
    statusPhoneInput.value = formatPhone(digits);
    window.open(`https://www.carwise.com/my-repair-status?phno=${digits}`, '_blank', 'noopener');
  });

  syncStatusSubmit();
}

const syncWidgetFallbacks = () => {
  const widgetCards = [
    { card: document.querySelector('.reviews-card'), app: document.querySelector('.reviews-card [data-elfsight-app-lazy]') },
    { card: document.querySelector('.tiktok-feed-card'), app: document.querySelector('.tiktok-feed-card [data-elfsight-app-lazy]') },
  ];

  widgetCards.forEach(({ card, app }) => {
    if (!card || !app) return;
    const hasWidgetContent = app.children.length > 0 || !!app.querySelector('iframe, [class*="es-"]');
    card.classList.toggle('has-widget-content', hasWidgetContent);
  });
};

syncWidgetFallbacks();
window.addEventListener('load', syncWidgetFallbacks);
[500, 1500, 3000].forEach((delay) => {
  window.setTimeout(syncWidgetFallbacks, delay);
});

if (chatSelector) {
  const syncChatWidget = () => {
    const callUs = chatSelector.shadowRoot?.querySelector('call-us');
    const callUsRoot = callUs?.shadowRoot;
    const chatButton = callUsRoot?.querySelector('#wplc-chat-button');
    const floatingWidget = callUsRoot?.querySelector('#wp-live-chat-by-3CX');

    if (chatButton) {
      chatButton.disabled = false;
      chatButton.removeAttribute('disabled');
      chatButton.style.opacity = '1';
    }

    if (floatingWidget) {
      const isXsMobile = window.matchMedia('(max-width: 380px)').matches;
      const isMobile = window.matchMedia('(max-width: 640px)').matches;
      const heroSection = document.querySelector('.hero');
      const heroBottom = heroSection?.getBoundingClientRect().bottom ?? 0;
      const hideForHero = heroBottom > window.innerHeight - (isXsMobile ? 92 : 108);
      const avoidTargets = [
        ...document.querySelectorAll('[data-chat-avoid]'),
        document.getElementById('status'),
        document.querySelector('.status-feature-card'),
        document.querySelector('.status-widget-shell'),
        document.querySelector('.action-card-docs'),
      ].filter(Boolean);
      const overlapsAvoidZone = isMobile && avoidTargets.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top < window.innerHeight - (isXsMobile ? 40 : 56) && rect.bottom > 92;
      });
      const hideForAvoidZone = isMobile && overlapsAvoidZone;
      const hideWidget = hideForHero || hideForAvoidZone;
      const baseBottom = isXsMobile ? 8 : isMobile ? 12 : 20;

      floatingWidget.style.right = isXsMobile ? '8px' : isMobile ? '10px' : '20px';
      floatingWidget.style.left = 'auto';
      floatingWidget.style.top = 'auto';
      floatingWidget.style.bottom = `${baseBottom}px`;
      floatingWidget.style.transition = 'opacity 0.18s ease, bottom 0.18s ease, transform 0.18s ease';

      if (isXsMobile) {
        floatingWidget.style.transform = 'scale(0.9)';
        floatingWidget.style.transformOrigin = 'bottom right';
      } else {
        floatingWidget.style.transform = '';
        floatingWidget.style.transformOrigin = '';
      }

      floatingWidget.style.opacity = hideWidget ? '0' : '1';
      floatingWidget.style.pointerEvents = hideWidget ? 'none' : 'auto';
    }
  };
  const syncChatWidgetRaf = rafThrottle(syncChatWidget);

  const observer = new MutationObserver(() => {
    syncChatWidgetRaf();
  });

  observer.observe(chatSelector, { childList: true, subtree: true });
  window.addEventListener('load', syncChatWidget);
  window.addEventListener('resize', syncChatWidget);
  window.addEventListener('scroll', syncChatWidgetRaf, { passive: true });
  window.setTimeout(syncChatWidget, 1800);
}

if (certTriggers.length && certModal && certModalImage && certModalTitle && certModalDescription && certModalNote) {
  const closeCertModal = () => {
    certModal.hidden = true;
    document.body.classList.remove('modal-open');
  };

  const openCertModal = (trigger) => {
    certModalImage.src = trigger.dataset.certImage || '';
    certModalImage.alt = trigger.dataset.certAlt || trigger.dataset.certTitle || 'Certification logo';
    certModalTitle.textContent = trigger.dataset.certTitle || '';
    certModalDescription.textContent = trigger.dataset.certDescription || '';
    certModalNote.textContent = trigger.dataset.certNote || '';
    certModal.hidden = false;
    document.body.classList.add('modal-open');
  };

  certTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openCertModal(trigger));
  });

  certModal.querySelectorAll('[data-cert-close]').forEach((button) => {
    button.addEventListener('click', closeCertModal);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !certModal.hidden) {
      closeCertModal();
    }
  });
}

const initHeroVideo = () => {
  if (!hero || !heroVideo) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveDataEnabled = Boolean(navigator.connection && navigator.connection.saveData);
  const disableVideo = prefersReducedMotion || saveDataEnabled;

  if (disableVideo) {
    hero.classList.add('hero-video-unavailable');
    hero.classList.remove('hero-video-ready');
    heroVideo.pause();
    return;
  }

  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.playsInline = true;
  heroVideo.autoplay = true;
  heroVideo.disableRemotePlayback = true;
  heroVideo.setAttribute('muted', '');
  heroVideo.setAttribute('autoplay', '');
  heroVideo.setAttribute('playsinline', '');
  heroVideo.setAttribute('webkit-playsinline', '');
  heroVideo.setAttribute('x-webkit-airplay', 'deny');
  heroVideo.setAttribute('disableRemotePlayback', '');
  heroVideo.preload = 'auto';

  let readySettled = false;
  let interactionRetryBound = false;
  let retryListeners = [];
  let statusTimeout = null;
  let lastPlayAttemptAt = 0;
  let playFailures = 0;

  const clearRetryListeners = () => {
    retryListeners.forEach(([eventName, handler, target = window]) => {
      target.removeEventListener(eventName, handler);
    });
    retryListeners = [];
  };

  const markReady = () => {
    if (readySettled) return;
    readySettled = true;
    hero.classList.add('hero-video-ready');
    hero.classList.remove('hero-video-unavailable');
    if (statusTimeout) {
      window.clearTimeout(statusTimeout);
      statusTimeout = null;
    }
    clearRetryListeners();
  };

  const showUnavailable = () => {
    if (readySettled) return;
    hero.classList.add('hero-video-unavailable');
    hero.classList.remove('hero-video-ready');
  };

  const refreshHeroVideoFlags = () => {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('autoplay', '');
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');
    heroVideo.setAttribute('x-webkit-airplay', 'deny');
    heroVideo.setAttribute('disableRemotePlayback', '');
  };

  const attemptPlay = (reloadFirst = false) => {
    const now = Date.now();
    if (!reloadFirst && now - lastPlayAttemptAt < 250) return;
    lastPlayAttemptAt = now;

    if (reloadFirst || heroVideo.readyState < 2) {
      heroVideo.load();
    }

    refreshHeroVideoFlags();
    hero.classList.remove('hero-video-unavailable');

    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(() => {
        playFailures = 0;
        if (!heroVideo.paused) markReady();
      }).catch(() => {
        playFailures += 1;
        if (playFailures >= 6) {
          showUnavailable();
        }
      });
    }
  };

  const bindInteractionRetry = () => {
    if (interactionRetryBound) return;
    interactionRetryBound = true;

    const retryPlayback = () => {
      if (readySettled) return;
      attemptPlay(true);
    };

    [window, document].forEach((target) => {
      ['pointerdown', 'touchstart', 'touchend', 'click', 'scroll', 'focus'].forEach((eventName) => {
        target.addEventListener(eventName, retryPlayback, { passive: true });
        retryListeners.push([eventName, retryPlayback, target]);
      });
    });
  };

  heroVideo.addEventListener('playing', markReady);
  heroVideo.addEventListener('loadedmetadata', () => {
    if (!readySettled) {
      refreshHeroVideoFlags();
      attemptPlay();
    }
  });
  heroVideo.addEventListener('timeupdate', () => {
    if (!readySettled && heroVideo.currentTime > 0.01) {
      markReady();
    }
  });
  heroVideo.addEventListener('loadeddata', () => {
    if (!readySettled) attemptPlay();
  });
  heroVideo.addEventListener('canplay', () => {
    if (!readySettled && heroVideo.paused) attemptPlay();
  });
  heroVideo.addEventListener('canplaythrough', () => {
    if (!readySettled && heroVideo.paused) attemptPlay();
  });
  heroVideo.addEventListener('error', showUnavailable);
  ['pause', 'stalled', 'waiting', 'suspend', 'emptied'].forEach((eventName) => {
    heroVideo.addEventListener(eventName, () => {
      if (document.hidden) return;
      window.setTimeout(() => {
        if (!document.hidden && heroVideo.paused) {
          attemptPlay(heroVideo.readyState < 2);
        }
      }, eventName === 'pause' ? 250 : 650);
    });
  });

  if (!heroVideo.paused && heroVideo.readyState >= 2 && heroVideo.currentTime > 0.01) {
    markReady();
  }

  attemptPlay(true);
  bindInteractionRetry();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && (!readySettled || heroVideo.paused)) {
      attemptPlay(heroVideo.paused);
    }
  });

  window.addEventListener('pageshow', () => {
    if (!readySettled || heroVideo.paused) {
      attemptPlay(heroVideo.paused);
    }
  });

  statusTimeout = window.setTimeout(() => {
    if (!readySettled && (heroVideo.readyState < 2 || heroVideo.paused)) {
      showUnavailable();
    }
  }, 12000);
};

const initMotion = () => {
  const revealTargets = document.querySelectorAll('.cert-grid, .shop-collage--homepage');
  const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const canUseGsap = prefersMotion && window.gsap && window.ScrollTrigger;

  if (canUseGsap) {
    document.documentElement.classList.add('gsap-motion');
    window.gsap.registerPlugin(window.ScrollTrigger);

    if (heroVideo && window.matchMedia('(min-width: 641px)').matches) {
      window.gsap.to(heroVideo, {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    const heroTimeline = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
      .from('.hero-copy > *', {
        y: 28,
        autoAlpha: 0,
        duration: 0.82,
        stagger: 0.1,
        clearProps: 'transform,opacity,visibility',
      })
      .from('[data-hero-animate="card"]', {
        y: 34,
        autoAlpha: 0,
        duration: 0.8,
        clearProps: 'transform,opacity,visibility',
      }, 0.12);

    const certTiles = window.gsap.utils.toArray('.cert-grid .cert-tile');
    if (certTiles.length) {
      window.ScrollTrigger.batch(certTiles, {
        start: 'top 84%',
        once: true,
        onEnter: (batch) => window.gsap.to(batch, {
          y: 0,
          duration: 0.56,
          ease: 'power2.out',
          stagger: 0.06,
          overwrite: true,
          clearProps: 'transform,opacity,visibility',
        }),
      });
    }

    const galleryItems = window.gsap.utils.toArray('.shop-collage--homepage .shop-collage-item');
    if (galleryItems.length) {
      window.ScrollTrigger.batch(galleryItems, {
        start: 'top 84%',
        once: true,
        onEnter: (batch) => window.gsap.to(batch, {
          y: 0,
          duration: 0.58,
          ease: 'power2.out',
          stagger: 0.07,
          overwrite: true,
          clearProps: 'transform,opacity,visibility',
        }),
      });
    }

    revealTargets.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  document.documentElement.classList.remove('gsap-motion');

  if (revealTargets.length && prefersMotion) {
    revealTargets.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 70}ms`);
    });

    const revealOnScroll = () => {
      revealTargets.forEach((element) => {
        if (element.classList.contains('is-visible')) return;
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight + 120) {
          element.classList.add('is-visible');
        }
      });
    };

    const revealOnScrollRaf = rafThrottle(revealOnScroll);
    window.addEventListener('load', revealOnScroll);
    window.addEventListener('resize', revealOnScrollRaf);
    window.addEventListener('scroll', revealOnScrollRaf, { passive: true });
    window.setTimeout(revealOnScroll, 120);
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }
};

initHeroVideo();
initMotion();

const syncTopbarOffsetRaf = rafThrottle(syncTopbarOffset);
const syncNavVisibilityRaf = rafThrottle(syncNavVisibility);
const syncViewportHeightRaf = rafThrottle(syncViewportHeight);

window.addEventListener('resize', syncTopbarOffset);
window.addEventListener('resize', syncNavVisibilityRaf);
window.addEventListener('resize', syncViewportHeightRaf);
window.addEventListener('scroll', syncTopbarOffsetRaf, { passive: true });
window.addEventListener('scroll', syncNavVisibilityRaf, { passive: true });
window.addEventListener('pageshow', () => {
  syncViewportHeight();
  syncTopbarOffset();
  syncNavVisibility();
});
window.addEventListener('load', syncViewportHeight);
window.addEventListener('load', syncTopbarOffset);
window.addEventListener('load', syncNavVisibility);
syncViewportHeight();
syncTopbarOffset();
syncNavVisibility();

if (topbar) {
  const topbarObserver = new MutationObserver(syncTopbarOffsetRaf);
  topbarObserver.observe(topbar, { childList: true, subtree: true, attributes: true });
  [300, 1200, 2600].forEach((delay) => window.setTimeout(() => {
    syncViewportHeight();
    syncTopbarOffset();
    syncNavVisibility();
  }, delay));
}
