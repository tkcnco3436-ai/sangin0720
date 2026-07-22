# 상인월드 확정 UI

`0722공유`(랜딩) + `개발전달-마이페이지`(서비스/관리자)를 합친 최종 정적 UI 산출물.
프레임워크 없이 HTML + CSS + JS, 화면 단위로 CSS/JS 분리(레이어: tokens → common → {group}-common → {page}). 아이콘 Lucide(CDN), 폰트 Pretendard.

## 페이지

| HTML | 설명 | CSS | JS |
|---|---|---|---|
| `index-flex.html` | 랜딩(히어로·로고밴드·How It Works·요금·후기·공지·푸터) | tokens, common, index, index-flex | common, index, index-flex |
| `mypage.html` | 마이페이지(비로그인 헤더) | tokens, common, mypage-common, mypage | common, mypage-common, mypage |
| `mypage-login.html` | 마이페이지(로그인 후 헤더) | tokens, common, mypage-common, mypage | common, mypage-common, mypage |
| `edit.html` | 내 정보 수정 | tokens, common, mypage-common, edit | common, mypage-common, edit |
| `withdraw.html` | 회원탈퇴 | tokens, common, mypage-common, withdraw | common, mypage-common, withdraw |
| `admin-dashboard.html` | 관리자 대시보드 사이드바 | tokens, common, admin-dashboard | admin-dashboard |

## 폴더

```
확정UI/
├─ *.html            페이지 6종
├─ css/              tokens · common · index · index-flex · mypage · mypage-common · edit · withdraw · admin-dashboard
├─ js/               common · index · index-flex · mypage · mypage-common · edit · withdraw · admin-dashboard
└─ image/            logo.svg · Frame 10~13.svg(파트너 로고) · 카드사 8종(신한·KB·현대·롯데·우리·NH·BC·하나)
```

## 비고
- 랜딩 배경 메시 그라디언트는 `common.js`의 WebGL 셰이더(`.mesh-gradient-canvas`).
- 공지사항 영역은 추후 공지 기능 대비 UI만 선작업(데이터 연동 시 목록만 채움).
- 후기·요금·파트너 로고는 시안용 예시 데이터.
- 두 원본 번들의 공유 파일(common.css/tokens.css/common.js/logo.svg)은 완전 동일 — 충돌 없이 병합.
