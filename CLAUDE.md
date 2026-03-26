# CLAUDE.md

## Project

모바일 청첩장 (GitHub Pages 정적 사이트). 바닐라 HTML/CSS/JS, 빌드 도구 없음.

## Local Preview

```bash
python3 -m http.server 8080
open http://localhost:8080
```

포트 충돌 시 `lsof -ti:8080`로 기존 프로세스 확인 후 다른 포트 사용.

## Deploy

GitHub Pages: https://github.com/Below0/wedding-invitation
- Settings → Pages → Source: `main` branch
