(function () {
  'use strict';

  function labelForHref(href) {
    if (!href) return '';
    if (href.startsWith('mailto:')) return "Email Richard's Body Shop";
    if (href.startsWith('tel:')) return "Call Richard's Body Shop";
    if (href.includes('carwise.com')) return 'Open Carwise';
    if (href.includes('google.com/maps') || href.includes('maps/place')) return 'Open Google Maps and reviews';
    if (href.includes('instagram.com')) return 'Open Instagram';
    if (href.includes('facebook.com')) return 'Open Facebook';
    if (href.includes('tiktok.com')) return 'Open TikTok';
    if (href.includes('docusign.net')) return 'Open DocuSign form';
    return 'Open link';
  }

  function addAccessibleLabels() {
    document.querySelectorAll('a').forEach((link) => {
      const hasVisibleText = (link.textContent || '').trim().length > 0;
      if (!hasVisibleText && !link.getAttribute('aria-label')) {
        const label = labelForHref(link.getAttribute('href') || '');
        if (label) link.setAttribute('aria-label', label);
      }
      if (link.target === '_blank') {
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  function wireDropoffToggle() {
    const trigger = document.getElementById('dropOffHeading');
    const content = document.getElementById('dropOffContent');
    if (!trigger || !content) return;

    function setExpanded(expanded) {
      trigger.setAttribute('aria-expanded', String(expanded));
      content.hidden = !expanded;
    }

    setExpanded(false);

    trigger.addEventListener('click', function () {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
    });

    document.querySelectorAll('[data-expand-target="dropOffContent"]').forEach((link) => {
      link.addEventListener('click', function () {
        setExpanded(true);
      });
    });
  }

  function handleVideoFallback() {
    const video = document.getElementById('video-background');
    if (!video) return;
    const home = document.getElementById('home');
    const fail = () => home && home.classList.add('hero-video-unavailable');
    video.addEventListener('error', fail);
    window.setTimeout(() => {
      if (video.readyState === 0) fail();
    }, 2000);
  }

  function init() {
    addAccessibleLabels();
    wireDropoffToggle();
    handleVideoFallback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
