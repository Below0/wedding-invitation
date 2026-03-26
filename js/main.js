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
   2. Firebase
   ========================================================= */
const firebaseConfig = {
  apiKey: "AIzaSyBJbbjRdoBhXJAiHfew5kysEy3xzqXdo-M",
  authDomain: "wedding-invitation-4e968.firebaseapp.com",
  databaseURL: "https://wedding-invitation-4e968-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wedding-invitation-4e968",
  storageBucket: "wedding-invitation-4e968.firebasestorage.app",
  messagingSenderId: "594495943096",
  appId: "1:594495943096:web:de0c3bb71fe1796e1f9f4d",
  measurementId: "G-J8H5CJ6WN1"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

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

// Gallery Easter Egg: toggle between wedding & daily photos
const GALLERY_WEDDING = [
  { src: 'images/gallery/01.jpg', alt: '웨딩 사진 1' },
  { src: 'images/gallery/02.jpg', alt: '웨딩 사진 2' },
  { src: 'images/gallery/03.jpg', alt: '웨딩 사진 3' },
  { src: 'images/gallery/04.jpg', alt: '웨딩 사진 4' },
  { src: 'images/gallery/05.jpg', alt: '웨딩 사진 5' },
  { src: 'images/gallery/06.jpg', alt: '웨딩 사진 6' },
];

let dailyPhotos = [];
let showingDaily = false;
const galleryToggleBtn = document.getElementById('gallery-toggle');
const swiperEl = document.querySelector('.gallery-swiper');

// Load daily photos from manifest JSON
fetch('images/daily/photos.json')
  .then(res => res.json())
  .then(data => { dailyPhotos = data; })
  .catch(() => {});

function buildSlide(photo) {
  const caption = photo.caption
    ? `<div class="slide-caption">${photo.caption}</div>`
    : '';
  return `<div class="swiper-slide">
    <img src="${photo.src}" alt="${photo.caption || ''}" loading="lazy">
    ${caption}
  </div>`;
}

function switchGallery(photos) {
  swiperEl.classList.add('switching');
  setTimeout(() => {
    gallerySwiper.removeAllSlides();
    gallerySwiper.appendSlide(photos.map(buildSlide));
    gallerySwiper.slideTo(0, 0);
    swiperEl.classList.remove('switching');
  }, 400);
}

galleryToggleBtn.addEventListener('click', () => {
  showingDaily = !showingDaily;
  galleryToggleBtn.classList.toggle('active', showingDaily);
  galleryToggleBtn.textContent = showingDaily ? '웨딩 촬영본 보기 💍' : '우리의 일상 엿보기 👀';
  switchGallery(showingDaily ? dailyPhotos : GALLERY_WEDDING);
});

/* =========================================================
   8. Easter Egg — Daily Photo Graduate
   ========================================================= */
function unlockGraduate() {
  if (localStorage.getItem('daily_graduate') === 'true') return;
  localStorage.setItem('daily_graduate', 'true');
  showToast('🎓 일상 졸업! 댓글에 특별 뱃지가 생겼어요');
}

gallerySwiper.on('slideChange', () => {
  if (!showingDaily || dailyPhotos.length === 0) return;
  if (gallerySwiper.realIndex === dailyPhotos.length - 1) {
    unlockGraduate();
  }
});

/* =========================================================
   9. Kakao Share
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
   10. Kakao Map
   ========================================================= */
try {
  const mapContainer = document.getElementById('kakao-map');
  const mapOption = {
    center: new kakao.maps.LatLng(37.5594054, 126.9817843),
    level: 3,
  };
  const map = new kakao.maps.Map(mapContainer, mapOption);

  const marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(37.5594054, 126.9817843),
  });
  marker.setMap(map);

  const infowindow = new kakao.maps.InfoWindow({
    content: '<div style="padding:4px 8px;font-size:12px;white-space:nowrap;">우리은행 본점 4층</div>',
  });
  infowindow.open(map, marker);
} catch (e) {
  const mapContainer = document.getElementById('kakao-map');
  if (mapContainer) mapContainer.style.display = 'none';
}

/* =========================================================
   11. URL Copy
   ========================================================= */
document.getElementById('copy-url').addEventListener('click', () => {
  copyToClipboard(CONFIG.SITE_URL, 'URL이 복사되었습니다');
});

/* =========================================================
   12. D-day Counter
   ========================================================= */
const weddingDate = new Date('2027-05-29T15:00:00+09:00');
function updateDday() {
  const now = new Date();
  const diff = weddingDate - now;
  const el = document.getElementById('dday');
  if (diff <= 0) {
    el.textContent = '오늘 결혼합니다 🎉';
  } else {
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    el.textContent = `결혼식까지 D-${days}`;
  }
}
updateDday();

/* =========================================================
   13. Scroll Animations (Intersection Observer)
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

/* =========================================================
   14. Comments
   ========================================================= */
const commentForm = document.getElementById('comment-form');
const commentNameInput = document.getElementById('comment-name');
const commentMessageInput = document.getElementById('comment-message');

if (commentForm) {
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = commentNameInput.value.trim();
    const message = commentMessageInput.value.trim();
    if (!name || !message) return;

    const submitBtn = commentForm.querySelector('.comment-submit');
    submitBtn.disabled = true;

    try {
      await db.ref('comments').push({
        name,
        message,
        graduate: localStorage.getItem('daily_graduate') === 'true',
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
      commentNameInput.value = '';
      commentMessageInput.value = '';
    } catch (err) {
      console.error(err);
      showToast('댓글 저장에 실패했습니다');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${mm}/${dd} ${hh}:${min}`;
}

function renderComment(child) {
  const { name, message, graduate, createdAt } = child.val();
  const li = document.createElement('li');
  li.className = 'comment-item';
  li.innerHTML = `
    <div class="comment-header">
      <span class="comment-name">${graduate ? '🎓 ' : ''}${escapeHtml(name)}</span>
      <span class="comment-time">${formatTime(createdAt)}</span>
    </div>
    <p class="comment-message">${escapeHtml(message)}</p>
  `;
  return li;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const commentList = document.getElementById('comment-list');
const loadMoreBtn = document.getElementById('comment-load-more');
const PAGE_SIZE = 5;
let allComments = [];
let shownCount = 0;

function renderComments() {
  const next = allComments.slice(shownCount, shownCount + PAGE_SIZE);
  next.forEach((child) => {
    commentList.appendChild(renderComment(child));
  });
  shownCount += next.length;
  loadMoreBtn.hidden = shownCount >= allComments.length;
}

if (commentList) {
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', renderComments);
  }

  db.ref('comments').orderByChild('createdAt').on(
    'value',
    (snapshot) => {
      allComments = [];
      snapshot.forEach((child) => { allComments.push(child); });
      allComments.reverse();
      shownCount = 0;
      commentList.innerHTML = '';
      renderComments();
    },
    (err) => {
      console.error('Comments listener error:', err);
    }
  );
}
