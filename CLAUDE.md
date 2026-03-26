# CLAUDE.md

## Project

모바일 청첩장 (GitHub Pages 정적 사이트). 바닐라 HTML/CSS/JS, 빌드 도구 없음.

## Local Preview

```bash
python3 -m http.server 8080
open http://localhost:8080
```

포트 충돌 시 `lsof -ti:8080`로 기존 프로세스 확인 후 다른 포트 사용.

## 사진 추가 방법

### 웨딩 갤러리 사진 (`images/gallery/`)
1. `images/gallery/`에 `01.jpg` ~ `06.jpg` 형식으로 저장
2. `index.html`의 `.gallery-swiper > .swiper-wrapper` 안에 슬라이드 추가:
   ```html
   <div class="swiper-slide"><img src="images/gallery/07.jpg" alt="웨딩 사진 7" loading="lazy"></div>
   ```
3. `js/main.js`의 `GALLERY_WEDDING` 배열에도 항목 추가:
   ```js
   { src: 'images/gallery/07.jpg', alt: '웨딩 사진 7' },
   ```

### 일상 사진 (`images/daily/`)
1. `images/daily/`에 이미지 파일 저장 (파일명 자유)
2. `images/daily/photos.json`에 항목 추가:
   ```json
   { "src": "images/daily/파일명.jpg", "caption": "사진 설명" }
   ```
   - 배열 순서가 슬라이더에 표시되는 순서

### 이미지 최적화 (macOS)
```bash
sips --resampleWidth 800 images/daily/*.jpg
```

## Deploy

GitHub Pages: https://github.com/Below0/wedding-invitation
- Settings → Pages → Source: `main` branch
