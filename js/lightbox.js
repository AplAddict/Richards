/**
 * Simple Lightbox Gallery with Lazy Loading
 * Lightweight alternative to jQuery-dependent solutions
 */

(function() {
  'use strict';

  // Create lightbox HTML structure
  const lightboxHTML = `
    <div id="lightbox-modal" class="lightbox-modal" style="display:none;">
      <span class="lightbox-close">&times;</span>
      <img class="lightbox-content" src="" alt="Gallery Image">
      <div class="lightbox-nav">
        <span class="lightbox-prev">&#10094;</span>
        <span class="lightbox-next">&#10095;</span>
      </div>
      <div class="lightbox-caption"></div>
    </div>
  `;

  const lightboxCSS = `
    <style>
      .lightbox-modal {
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.95);
        animation: fadeIn 0.3s ease-in;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .lightbox-content {
        margin: auto;
        display: block;
        max-width: 90%;
        max-height: 80vh;
        margin-top: 5vh;
        animation: zoomIn 0.3s ease-in;
      }

      @keyframes zoomIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      .lightbox-close {
        position: absolute;
        top: 20px;
        right: 40px;
        color: #f1f1f1;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s;
      }

      .lightbox-close:hover {
        color: #bbb;
      }

      .lightbox-nav {
        position: absolute;
        top: 50%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        box-sizing: border-box;
        transform: translateY(-50%);
      }

      .lightbox-prev, .lightbox-next {
        color: white;
        font-size: 30px;
        cursor: pointer;
        transition: 0.3s;
        user-select: none;
      }

      .lightbox-prev:hover, .lightbox-next:hover {
        color: #bbb;
      }

      .lightbox-caption {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: #f1f1f1;
        text-align: center;
        font-size: 14px;
        max-width: 80%;
      }

      @media screen and (max-width: 768px) {
        .lightbox-content {
          max-width: 95%;
        }
        .lightbox-close {
          top: 10px;
          right: 15px;
          font-size: 30px;
        }
        .lightbox-prev, .lightbox-next {
          font-size: 20px;
        }
      }
    </style>
  `;

  let galleryImages = [];
  let currentIndex = 0;

  // Initialize lightbox
  function init() {
    document.head.insertAdjacentHTML('beforeend', lightboxCSS);
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // Add click listeners to gallery images
    const galleryLinks = document.querySelectorAll('a[data-lightbox="gallery"]');
    galleryImages = Array.from(galleryLinks);

    galleryLinks.forEach((link, index) => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        currentIndex = index;
        openLightbox(this.href, this.title || '');
      });
    });

    // Modal controls
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (modal.style.display === 'block') {
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'Escape') closeLightbox();
      }
    });

    // Close on background click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeLightbox();
    });
  }

  function openLightbox(src, caption) {
    const modal = document.getElementById('lightbox-modal');
    const content = document.querySelector('.lightbox-content');
    const captionEl = document.querySelector('.lightbox-caption');
    
    content.src = src;
    captionEl.textContent = caption;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function navigate(direction) {
    currentIndex += direction;
    if (currentIndex >= galleryImages.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = galleryImages.length - 1;
    
    const link = galleryImages[currentIndex];
    openLightbox(link.href, link.title || '');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
