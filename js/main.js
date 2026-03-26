// Mobile Wedding Invitation — main.js

/* =========================================================
   1. Config
   ========================================================= */
const CONFIG = {
  KAKAO_APP_KEY: 'e1cb13b71eae26c827821c0d2a05d0c2',
  SITE_URL: window.location.href,
  OG_TITLE: '이하영 ♥ 신지원 결혼합니다',
  OG_DESC: '2027년 5월 29일 토요일 오후 3시, 우리은행 본점 4층',
};

/* =========================================================
   2. Toast utility
   ========================================================= */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

/* =========================================================
   3. Clipboard utility
   ========================================================= */
function copyToClipboard(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg || '복사되었습니다');
  }).catch(() => {
    showToast('복사에 실패했습니다');
  });
}

/* =========================================================
   4. BGM Controller
   ========================================================= */
const bgmAudio = document.getElementById('bgm');
const bgmToggle = document.getElementById('bgm-toggle');
let bgmPlaying = false;

function toggleBgm() {
  if (bgmPlaying) {
    bgmAudio.pause();
    bgmPlaying = false;
    bgmToggle.querySelector('.bgm-icon').textContent = '🔇';
  } else {
    bgmAudio.play().then(() => {
      bgmPlaying = true;
      bgmToggle.querySelector('.bgm-icon').textContent = '🔊';
    }).catch(() => {});
  }
}

bgmToggle.addEventListener('click', toggleBgm);

// Auto-play on first user interaction
document.addEventListener('click', function autoPlay(e) {
  if (e.target.closest('#bgm-toggle')) return;
  if (!bgmPlaying) {
    bgmAudio.play().then(() => {
      bgmPlaying = true;
      bgmToggle.querySelector('.bgm-icon').textContent = '🔊';
    }).catch(() => {});
  }
  document.removeEventListener('click', autoPlay);
}, { once: true });

/* =========================================================
   5. Accordion
   ========================================================= */
document.querySelectorAll('.accordion-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const targetId = toggle.dataset.target;
    const content = document.getElementById(targetId);
    const isOpen = toggle.classList.contains('open');

    // Close all accordions
    document.querySelectorAll('.accordion-toggle').forEach(t => {
      t.classList.remove('open');
    });
    document.querySelectorAll('.accordion-content').forEach(c => {
      c.classList.remove('open');
      c.style.maxHeight = null;
    });

    // If it was closed, open it
    if (!isOpen && content) {
      toggle.classList.add('open');
      content.classList.add('open');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
});

/* =========================================================
   6. Copy button handlers
   ========================================================= */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    copyToClipboard(btn.dataset.copy, '계좌번호가 복사되었습니다');
  });
});

document.querySelectorAll('.copy-addr').forEach(btn => {
  btn.addEventListener('click', () => {
    copyToClipboard(btn.dataset.address, '주소가 복사되었습니다');
  });
});

/* =========================================================
   7. Swiper Gallery init
   ========================================================= */
const gallerySwiper = new Swiper('.gallery-swiper', {
  slidesPerView: 1,
  spaceBetween: 0,
  pagination: { el: '.swiper-pagination', clickable: true },
  loop: true,
  autoplay: { delay: 4000, disableOnInteraction: false },
});

/* =========================================================
   8. Kakao Share
   ========================================================= */
Kakao.init(CONFIG.KAKAO_APP_KEY);

document.getElementById('kakao-share').addEventListener('click', () => {
  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: CONFIG.OG_TITLE,
      description: CONFIG.OG_DESC,
      imageUrl: new URL('images/hero/main.jpg', CONFIG.SITE_URL).href,
      link: {
        mobileWebUrl: CONFIG.SITE_URL,
        webUrl: CONFIG.SITE_URL,
      },
    },
    buttons: [
      {
        title: '청첩장 보기',
        link: {
          mobileWebUrl: CONFIG.SITE_URL,
          webUrl: CONFIG.SITE_URL,
        },
      },
    ],
  });
});

/* =========================================================
   9. URL Copy
   ========================================================= */
document.getElementById('copy-url').addEventListener('click', () => {
  copyToClipboard(CONFIG.SITE_URL, 'URL이 복사되었습니다');
});

/* =========================================================
   10. Scroll Animations (Intersection Observer)
   ========================================================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.section:not(.hero)').forEach(section => {
  observer.observe(section);
});
