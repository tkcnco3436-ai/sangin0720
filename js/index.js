(function () {
  "use strict";

  function startLazyVideo(el) {
    var video = el.querySelector("[data-src]");
    if (!video || video.src) return;
    video.src = video.getAttribute("data-src");
    // 카드 비율을 하드코딩하지 않고, 실제 영상의 원본 가로세로비로 맞춘다
    video.addEventListener("loadedmetadata", function () {
      if (video.videoWidth && video.videoHeight) {
        el.style.setProperty("--ar", video.videoWidth + " / " + video.videoHeight);
      }
    }, { once: true });
    video.play().catch(function () {});
  }

  var supportsObserver = "IntersectionObserver" in window;
  var revealObserver = supportsObserver
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            startLazyVideo(entry.target);
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: "0px 0px -40px 0px" })
    : null;

  function observeReveal(el) {
    if (revealObserver) revealObserver.observe(el);
    else {
      el.classList.add("is-visible");
      startLazyVideo(el);
    }
  }

  function initReveal() {
    document.querySelectorAll(".reveal").forEach(observeReveal);
  }

  function initDropdownAccordion() {
    document.querySelectorAll(".drawer__group[data-dropdown]").forEach(function (group) {
      var trigger = group.querySelector("[data-dropdown-trigger]");
      if (!trigger) return;
      trigger.addEventListener("click", function () {
        group.classList.toggle("is-open");
      });
    });
  }

  function initPricingToggle() {
    var toggle = document.querySelector("[data-pricing-toggle]");
    if (!toggle) return;
    var buttons = toggle.querySelectorAll("[data-pricing-period]");
    var amounts = document.querySelectorAll(".price-card__amount");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var period = btn.getAttribute("data-pricing-period");
        buttons.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
        amounts.forEach(function (el) {
          var value = el.getAttribute("data-price-" + period);
          if (value != null) el.textContent = value;
        });
      });
    });
  }

  var GALLERY_ITEMS = [
    { avatar: "민", name: "민준 김밥천국", quote: "영상 올리고 나서 방문 예약이 눈에 띄게 늘었어요." },
    { avatar: "서", name: "서연 플라워샵", quote: "사진 한 장이면 끝, 편집할 필요가 없어요." },
    { avatar: "태", name: "태경 오션카페", quote: "1분 30초면 완성이라 매일 새로 올릴 수 있어요." },
    { avatar: "하", name: "하림 편집샵", quote: "세로 영상으로 바로 릴스에 올렸어요." },
    { avatar: "준", name: "준호 로컬베이커리", quote: "AI 주제 추천이 은근히 잘 맞아서 놀랐어요." },
    { avatar: "지", name: "지우 헤어살롱", quote: "무료 체험만으로 효과를 바로 느꼈어요." },
    { avatar: "유", name: "유나 반찬가게", quote: "가로세로 둘 다 뽑아서 채널별로 나눠 올려요." },
    { avatar: "도", name: "도윤 수제버거", quote: "크레딧 부담이 없어서 매주 새 영상을 올려요." },
    { avatar: "은", name: "은채 네일샵", quote: "예약 문의가 확실히 늘었어요." },
    { avatar: "재", name: "재현 스터디카페", quote: "학생들 반응이 좋아서 매주 올리고 있어요." },
    { avatar: "수", name: "수빈 요가원", quote: "회원권 문의가 두 배로 늘었어요." },
    { avatar: "동", name: "동현 동네서점", quote: "책 소개 영상 만들기가 이렇게 쉬울 줄 몰랐어요." },
    { avatar: "예", name: "예린 세탁소", quote: "짧은 영상 하나로 인지도가 확 올라갔어요." },
    { avatar: "성", name: "성민 정육점", quote: "신선함이 영상으로 잘 전달돼요." },
    { avatar: "다", name: "다인 문구점", quote: "신상 소개를 영상으로 빠르게 올려요." },
    { avatar: "우", name: "우진 애견카페", quote: "반려동물 손님들 반응이 폭발적이에요." },
    { avatar: "채", name: "채원 필라테스", quote: "회원분들이 영상 보고 등록했다고 해요." },
    { avatar: "현", name: "현우 안경점", quote: "제품 하나하나 영상으로 소개하기 편해요." },
    { avatar: "소", name: "소율 초밥집", quote: "런치 영상 올리면 바로 예약이 차요." },
    { avatar: "진", name: "진호 분식집", quote: "인스타 조회수가 확실히 달라졌어요." },
    { avatar: "나", name: "나윤 태닝샵", quote: "비포애프터 영상이 반응이 좋아요." },
    { avatar: "형", name: "형준 인테리어샵", quote: "시공 사진을 영상으로 바꾸니 문의가 늘었어요." },
    { avatar: "혜", name: "혜진 사진관", quote: "샘플 컷을 영상으로 홍보하기 좋아요." },
    { avatar: "승", name: "승우 자전거샵", quote: "신제품 입고 소식을 영상으로 빠르게 알려요." },
    { avatar: "아", name: "아영 향수공방", quote: "제품 무드가 영상으로 잘 살아나요." },
    { avatar: "찬", name: "찬희 도자기공방", quote: "클래스 홍보 영상 만들기가 훨씬 수월해졌어요." },
    { avatar: "규", name: "규리 목공방", quote: "작업 과정을 짧게 보여주기 좋아요." },
    { avatar: "시", name: "시우 한의원", quote: "환자분들이 영상 보고 문의를 많이 해요." },
    { avatar: "온", name: "온유 필름카메라샵", quote: "감성 영상이 매장 분위기랑 잘 맞아요." },
    { avatar: "라", name: "라연 빈티지샵", quote: "신상 입고 영상이 반응이 제일 좋아요." },
    { avatar: "건", name: "건우 캘리그라피공방", quote: "작품 소개 영상 만들기가 부담 없어졌어요." },
    { avatar: "미", name: "미소 브런치카페", quote: "메뉴 영상 하나로 웨이팅이 생겼어요." },
    { avatar: "훈", name: "훈이 캠핑용품점", quote: "제품 사용 장면을 영상으로 보여주기 좋아요." },
    { avatar: "솔", name: "솔이 수제청공방", quote: "제작 과정 영상이 신뢰도를 높여줘요." },
    { avatar: "겨", name: "겨울 조명샵", quote: "인테리어 무드 영상이 매출로 이어졌어요." }
  ];
  var GALLERY_PAGE_SIZE_FIRST = 12;
  var GALLERY_PAGE_SIZE_MORE = 10;
  var galleryCursor = 0;

  // 상인월드 실제 결과물 샘플 영상 (image/ 폴더, index.html 기준 상대경로)
  // ar은 ffprobe로 실측한 원본 픽셀 비율 그대로 고정: 세로 영상(720x1280)=9/16, 가로 영상(3840x2160)=16/9
  var SAMPLE_VIDEOS = [
    { src: "image/video01.webm", ar: "9/16" },
    { src: "image/video02.webm", ar: "9/16" },
    { src: "image/영상01.webm", ar: "9/16" },
    { src: "image/영상02.webm", ar: "9/16" },
    { src: "image/stu-vd-mo.webm", ar: "16/9" },
    { src: "image/stu-vd-mo2.webm", ar: "16/9" },
    { src: "image/stu-hd-vd.webm", ar: "16/9" }
  ];

  function galleryCardHTML(item, index) {
    var delay = (index % 4) * 60;
    var video = SAMPLE_VIDEOS[index % SAMPLE_VIDEOS.length];
    var videoSrc = encodeURI(video.src);
    return (
      // item-card-gallery: 썸네일(영상) + 하단 정보 카드. data-* 는 shared-element-gallery 라이트박스가 읽음
      '<div class="gallery-card reveal" style="transition-delay:' + delay + 'ms;" data-avatar="' + item.avatar + '" data-name="' + item.name + '" data-quote="' + item.quote + '">' +
        '<div class="gallery-card__media" style="--ar:' + video.ar + ';">' +
          '<video class="gallery-card__video" data-src="' + videoSrc + '" muted loop playsinline preload="none"></video>' +
        "</div>" +
        '<div class="gallery-card__body">' +
          '<div class="gallery-card__avatar">' + item.avatar + "</div>" +
          '<div class="gallery-card__text">' +
            '<p class="gallery-card__name">' + item.name + "</p>" +
            '<p class="gallery-card__quote">' + item.quote + "</p>" +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function initGallery() {
    var grid = document.querySelector("[data-gallery-grid]");
    var moreBtn = document.querySelector("[data-gallery-more]");
    if (!grid || !moreBtn) return;

    function loadNext(count) {
      var next = GALLERY_ITEMS.slice(galleryCursor, galleryCursor + count);
      if (!next.length) return;
      var wrapper = document.createElement("div");
      wrapper.innerHTML = next.map(function (item, i) {
        return galleryCardHTML(item, galleryCursor + i);
      }).join("");
      Array.prototype.forEach.call(wrapper.children, function (card) {
        grid.appendChild(card);
        observeReveal(card);
      });
      galleryCursor += next.length;
      moreBtn.hidden = galleryCursor >= GALLERY_ITEMS.length;
    }

    loadNext(GALLERY_PAGE_SIZE_FIRST);
    moreBtn.addEventListener("click", function () {
      loadNext(GALLERY_PAGE_SIZE_MORE);
    });
  }

  // ---------- shared-element-gallery 각색: 카드 클릭 -> 확대 라이트박스, 드래그로 닫기 ----------
  // https://21st.dev/@easemize/components/shared-element-gallery 참고. 실제 소스는 접근 불가(사용 예시/의존성만
  // 공개)했지만 설명은 명확함: "마스너리 그리드 + 클릭 시 확대되는 shared-element 전환 + 드래그로 닫기".
  // 진짜 FLIP 좌표 매칭 대신 스케일+페이드 확대 연출로 근사하고, 드래그-투-디스미스는 pointer 이벤트로 그대로 구현.
  function initSharedGallery() {
    var grid = document.querySelector("[data-gallery-grid]");
    var lightbox = document.querySelector("[data-gallery-lightbox]");
    if (!grid || !lightbox) return;

    var panel = lightbox.querySelector("[data-gallery-lightbox-panel]");
    var videoEl = lightbox.querySelector("[data-gallery-lightbox-video]");
    var avatarEl = lightbox.querySelector("[data-gallery-lightbox-avatar]");
    var nameEl = lightbox.querySelector("[data-gallery-lightbox-name]");
    var quoteEl = lightbox.querySelector("[data-gallery-lightbox-quote]");
    var closers = lightbox.querySelectorAll("[data-gallery-lightbox-close]");

    function open(card) {
      var video = card.querySelector(".gallery-card__video");
      var src = video ? (video.getAttribute("data-src") || video.currentSrc || video.src) : "";
      if (src) videoEl.src = src;
      avatarEl.textContent = card.getAttribute("data-avatar") || "";
      nameEl.textContent = card.getAttribute("data-name") || "";
      quoteEl.textContent = card.getAttribute("data-quote") || "";
      lightbox.classList.add("is-active");
      lightbox.setAttribute("aria-hidden", "false");
      videoEl.currentTime = 0;
      videoEl.play().catch(function () {});
      document.body.style.overflow = "hidden";
    }

    function close() {
      lightbox.classList.remove("is-active");
      lightbox.setAttribute("aria-hidden", "true");
      videoEl.pause();
      panel.style.transition = "";
      panel.style.transform = "";
      panel.style.opacity = "";
      document.body.style.overflow = "";
    }

    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".gallery-card");
      if (card) open(card);
    });
    closers.forEach(function (el) { el.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-active")) close();
    });

    var dragging = false;
    var startY = 0;
    var currentY = 0;

    panel.addEventListener("pointerdown", function (e) {
      dragging = true;
      startY = e.clientY;
      currentY = 0;
      panel.style.transition = "none";
      panel.setPointerCapture(e.pointerId);
    });
    panel.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      currentY = Math.max(0, e.clientY - startY);
      panel.style.transform = "translateY(" + currentY + "px)";
      panel.style.opacity = String(Math.max(0.3, 1 - currentY / 400));
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      panel.style.transition = "";
      if (currentY > 120) {
        close();
      } else {
        panel.style.transform = "";
        panel.style.opacity = "";
      }
    }
    panel.addEventListener("pointerup", endDrag);
    panel.addEventListener("pointercancel", endDrag);
  }

  // ---------- cyber-matrix-hero 배경: 커서 근처 문자만 밝게 (mask 기반 스포트라이트) ----------
  var MATRIX_CHARS = "01アイウエオカキクケコ<>/\\{}[]#$%&*+-=";

  function randomMatrixText(count) {
    var out = [];
    for (var i = 0; i < count; i++) {
      out.push(MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length)));
      out.push(((i + 1) % 28 === 0) ? "\n" : " ");
    }
    return out.join("");
  }

  function initHeroMatrix() {
    var hero = document.querySelector("[data-hero-matrix]");
    var base = document.querySelector("[data-matrix-base]");
    var glow = document.querySelector("[data-matrix-glow]");
    if (!hero || !base || !glow) return;

    var text = randomMatrixText(1400);
    base.textContent = text;
    glow.textContent = text;

    var ticking = false;
    hero.addEventListener("mousemove", function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        var xPct = ((e.clientX - rect.left) / rect.width) * 100;
        var yPct = ((e.clientY - rect.top) / rect.height) * 100;
        hero.style.setProperty("--mx", xPct + "%");
        hero.style.setProperty("--my", yPct + "%");
        ticking = false;
      });
    });
  }

  // ---------- warp-dialog 각색: 버튼 클릭 -> 화면 워프 -> 같은 페이지 섹션 스크롤 OR 다른 페이지로 이동 ----------
  function initWarp() {
    var overlay = document.querySelector("[data-warp-overlay]");
    var triggers = document.querySelectorAll("[data-warp-trigger]");
    if (!overlay || !triggers.length) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var targetSel = btn.getAttribute("data-warp-target");
        var href = btn.getAttribute("data-warp-href") || (targetSel ? null : btn.getAttribute("href"));
        var target = targetSel ? document.querySelector(targetSel) : null;
        if (!target && !href) return;

        e.preventDefault();

        function land() {
          if (target) target.scrollIntoView({ behavior: reduceMotion ? "smooth" : "auto", block: "start" });
          else if (href) window.location.href = href;
        }

        if (reduceMotion) {
          land();
          return;
        }

        overlay.classList.add("is-active");
        requestAnimationFrame(function () {
          overlay.classList.add("is-warping");
        });

        setTimeout(land, 340);

        if (target) {
          setTimeout(function () {
            overlay.classList.remove("is-active");
            overlay.classList.remove("is-warping");
          }, 680);
        }
        // href로 실제 페이지 이동하는 경우는 페이지가 새로 로드되므로 오버레이를 되돌릴 필요 없음
      });
    });
  }

  // ---------- gooey-text-morphing: 두 단어를 blur+opacity로 교차시켜 SVG threshold 필터로 "이어붙임" ----------
  function initGooeyText(el) {
    var words = (el.getAttribute("data-gooey-words") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var text1 = el.querySelector("[data-gooey-a]");
    var text2 = el.querySelector("[data-gooey-b]");
    if (!words.length || !text1 || !text2) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      text2.textContent = words[0];
      return;
    }

    var morphTime = 1;     // seconds
    var cooldownTime = 0.4; // seconds — 원본 0.25보다 살짝 늘려 한글 가독 시간 확보
    var textIndex = words.length - 1;
    var time = Date.now();
    var morph = 0;
    var cooldown = cooldownTime;

    function setMorph(fraction) {
      text2.style.filter = "blur(" + Math.min(8 / fraction - 8, 100) + "px)";
      text2.style.opacity = (Math.pow(fraction, 0.4) * 100) + "%";
      var inv = 1 - fraction;
      text1.style.filter = "blur(" + Math.min(8 / inv - 8, 100) + "px)";
      text1.style.opacity = (Math.pow(inv, 0.4) * 100) + "%";
    }

    function doCooldown() {
      morph = 0;
      text2.style.filter = "";
      text2.style.opacity = "100%";
      text1.style.filter = "";
      text1.style.opacity = "0%";
    }

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;
      var fraction = morph / morphTime;
      if (fraction > 1) { cooldown = cooldownTime; fraction = 1; }
      setMorph(fraction);
    }

    function animate() {
      requestAnimationFrame(animate);
      var now = Date.now();
      var shouldIncrement = cooldown > 0;
      var dt = (now - time) / 1000;
      time = now;
      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrement) {
          textIndex = (textIndex + 1) % words.length;
          text1.textContent = words[textIndex % words.length];
          text2.textContent = words[(textIndex + 1) % words.length];
        }
        doMorph();
      } else {
        doCooldown();
      }
    }
    animate();
  }

  function initGooey() {
    document.querySelectorAll("[data-gooey-text]").forEach(initGooeyText);
  }

  // ---------- text-shimmer-wave (colored) ----------
  // https://21st.dev/@motion-primitives/components/text-shimmer-wave/colored 원본 소스(motion/react) 그대로 포팅.
  // 글자별 stagger delay = (i * duration / spread) / length, 색상 base->glow->base 왕복 + 짧은 3D 흔들림.
  // duration/repeatDelay는 원본과 같은 공식(children.length * 0.05 / spread)으로 계산해 사이클 길이를 잡고,
  // CSS keyframe 퍼센트는 그 비율(active구간/전체cycle)로 근사함(원본은 프레임 단위 JS 애니메이션이라 완전 동일 재현은 불가).
  function initTextShimmerWave(el) {
    if (!el) return;
    var text = el.textContent;
    var duration = 1;
    var spread = 1;
    var length = text.length;
    if (!length) return;
    var repeatDelay = (length * 0.05) / spread;
    var cycle = duration + repeatDelay;

    el.textContent = "";
    el.classList.add("shimmer-wave");
    for (var i = 0; i < length; i++) {
      var ch = text.charAt(i);
      var span = document.createElement("span");
      span.className = "shimmer-wave__char";
      span.textContent = ch === " " ? " " : ch;
      var delay = (i * duration) / spread / length;
      span.style.animationDuration = cycle + "s";
      span.style.animationDelay = delay + "s";
      el.appendChild(span);
    }
  }

  // ---------- hero-chat: "AI가 생각하는 모션"(타이핑 점) -> 말풍선 텍스트, 메시지 2개로 분리 ----------
  // 텍스트 노출 방식은 response-stream(mode="fade", speed=20 기본값) 그대로 포팅:
  // segmentDelay = round(100 / sqrt(speed)), fadeDuration은 데모에서 쓰인 1200ms 고정값 사용.
  function initHeroChat() {
    var root = document.querySelector("[data-hero-chat]");
    if (!root) return;
    var rows = root.querySelectorAll("[data-chat-msg]");
    if (!rows.length) return;

    var MESSAGES = ["안녕하세요", "사진 한 장으로 완성하는 AI 콘텐츠를 만듭니다."];
    var THINK_MS = 1100;
    var BETWEEN_MSG_MS = 450;
    var FADE_DURATION = 1200;
    var SEGMENT_DELAY = Math.max(1, Math.round(100 / Math.sqrt(20))); // speed=20 기본값 -> 22ms

    function parts(row) {
      return {
        bubble: row,
        typing: row.querySelector("[data-chat-typing]"),
        text: row.querySelector("[data-chat-text]")
      };
    }

    var readyTarget = root.closest(".hero__col--main") || root;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function revealStatCards(cb, instant) {
      var grid = document.querySelector("[data-stat-cards]");
      if (grid) grid.querySelectorAll(".chat-reveal").forEach(function (el) { el.classList.add("is-visible"); });
      if (cb) setTimeout(cb, instant ? 0 : 400);
    }

    if (reduceMotion) {
      readyTarget.classList.add("is-ready");
      rows.forEach(function (row, i) {
        var p = parts(row);
        if (!p.bubble || !p.typing || !p.text) return;
        p.typing.hidden = true;
        p.text.textContent = MESSAGES[i] || "";
        p.bubble.classList.add("is-visible");
      });
      revealStatCards(null, true);
      return;
    }

    function revealText(p, message, cb) {
      p.typing.hidden = true;
      p.text.innerHTML = "";
      var words = message.split(/(\s+)/).filter(Boolean);
      words.forEach(function (word, idx) {
        var span = document.createElement("span");
        span.className = "fade-segment" + (/^\s+$/.test(word) ? " fade-segment-space" : "");
        span.style.animationDuration = FADE_DURATION + "ms";
        span.style.animationDelay = (idx * SEGMENT_DELAY) + "ms";
        span.textContent = word;
        p.text.appendChild(span);
      });
      var totalMs = FADE_DURATION + words.length * SEGMENT_DELAY;
      setTimeout(cb, totalMs);
    }

    function resetAll() {
      rows.forEach(function (row) {
        var p = parts(row);
        p.bubble.classList.remove("is-visible");
        p.text.innerHTML = "";
        p.typing.hidden = false;
      });
    }

    function runSequence(i) {
      if (i >= rows.length) {
        // 마지막 메시지 다음: 통계 카드 3개 등장 -> 그다음 콘텐츠 만들기 버튼 등장. 이후 재생 반복 안 함
        setTimeout(function () { revealStatCards(); }, BETWEEN_MSG_MS);
        return;
      }
      var p = parts(rows[i]);
      if (!p.bubble || !p.typing || !p.text) { runSequence(i + 1); return; }
      p.typing.hidden = false;
      p.bubble.classList.add("is-visible");
      setTimeout(function () {
        revealText(p, MESSAGES[i] || "", function () {
          setTimeout(function () { runSequence(i + 1); }, BETWEEN_MSG_MS);
        });
      }, THINK_MS);
    }

    resetAll();
    readyTarget.classList.add("is-ready");
    runSequence(0);
  }


  // ---------- portfolio-gallery: 데스크톱 부채꼴 카드 더미 + 모바일 무한 마퀘 ----------
  function initPortfolioGallery() {
    var verticals = SAMPLE_VIDEOS.filter(function (v) { return v.ar === "9/16"; });
    if (!verticals.length) return;

    var stack = document.getElementById("portfolioStack");
    if (stack) {
      var count = Math.min(6, verticals.length * 2);
      var mid = (count - 1) / 2;
      var cards = [];
      for (var i = 0; i < count; i++) {
        var v = verticals[i % verticals.length];
        var offset = i - mid;
        var tx = Math.round(offset * 70) + "px";
        var ty = Math.round(Math.abs(offset) * 16) + "px";
        var rot = Math.round(offset * 7) + "deg";
        var z = 10 - Math.round(Math.abs(offset));
        cards.push(
          '<div class="portfolio-gallery__card" style="--tx:' + tx + ';--ty:' + ty + ';--rot:' + rot + ';--z:' + z + ';">' +
            '<video src="' + encodeURI(v.src) + '" muted loop playsinline autoplay preload="metadata"></video>' +
          "</div>"
        );
      }
      stack.innerHTML = cards.join("");
    }

    var marquee = document.getElementById("portfolioMarquee");
    if (marquee) {
      var run = verticals.map(function (v) {
        return (
          '<div class="portfolio-gallery__marquee-card">' +
            '<video src="' + encodeURI(v.src) + '" muted loop playsinline autoplay preload="metadata"></video>' +
          "</div>"
        );
      }).join("");
      marquee.innerHTML = run + run;
    }
  }

  // ---------- studio-showcase: 핀터레스트형 영상 마스너리 카드 렌더링(실제 보유 영상 재사용) ----------
  function initStudioShowcase() {
    var grid = document.getElementById("studioShowcaseGrid");
    if (!grid) return;
    grid.innerHTML = SAMPLE_VIDEOS.map(function (v) {
      return (
        '<div class="studio-showcase__card" style="--ar:' + v.ar + ';">' +
          '<video src="' + encodeURI(v.src) + '" muted loop playsinline autoplay preload="metadata"></video>' +
        "</div>"
      );
    }).join("");
  }

  // ---------- stellar-banner: animated-banner.tsx의 Countdown 로직 그대로 포팅 ----------
  // 원본: target을 useState 초기값으로 한 번만 고정하고 매초 Date.now()와의 차이를 다시 계산.
  // 여기서는 프로모션 종료를 "페이지를 연 시점 + 3일"로 고정(원본 데모의 "16일 04시간..." 패턴과 동일한 방식).
  function initStellarBanner() {
    var root = document.querySelector("[data-fixed-countdown]");
    if (!root) return;
    var dEl = root.querySelector("[data-cd-d]");
    var hEl = root.querySelector("[data-cd-h]");
    var mEl = root.querySelector("[data-cd-m]");
    var sEl = root.querySelector("[data-cd-s]");
    if (!dEl || !hEl || !mEl || !sEl) return;

    var target = Date.now() + 3 * 24 * 60 * 60 * 1000;

    function pad(v) { return v < 10 ? "0" + v : "" + v; }

    function tick() {
      var diff = Math.max(0, target - Date.now());
      var totalSec = Math.floor(diff / 1000);
      dEl.textContent = pad(Math.floor(totalSec / 86400));
      hEl.textContent = pad(Math.floor((totalSec % 86400) / 3600));
      mEl.textContent = pad(Math.floor((totalSec % 3600) / 60));
      sEl.textContent = pad(totalSec % 60);
    }

    tick();
    setInterval(tick, 1000);
  }

  // ---------- stellar-hero 탭바: 클릭 시 전환 + 4초마다 자동 순환, 탭에 맞는 영상 오버레이 카드 표시 ----------
  function initStellarTabs() {
    var root = document.querySelector("[data-hero-tabs]");
    var video = document.querySelector(".stellar-video");
    if (!root || !video) return;

    var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-tab]"));
    var panels = Array.prototype.slice.call(video.querySelectorAll("[data-tab-panel]"));
    var order = buttons.map(function (b) { return b.getAttribute("data-tab"); });
    var current = 0;

    function setActive(index) {
      current = index;
      var key = order[current];
      buttons.forEach(function (b) { b.classList.toggle("is-active", b.getAttribute("data-tab") === key); });
      panels.forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-tab-panel") === key); });
    }

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var timer = null;
    function resetTimer() {
      if (reduceMotion) return;
      if (timer) clearInterval(timer);
      timer = setInterval(function () { setActive((current + 1) % order.length); }, 4000);
    }

    buttons.forEach(function (btn, i) {
      btn.addEventListener("click", function () { setActive(i); resetTimer(); });
    });

    setActive(0);
    resetTimer();
  }

  // ---------- promo-banner 카운트다운: 오늘 자정까지 남은 시간을 매초 갱신 ----------
  function initCountdownTimer() {
    var root = document.querySelector("[data-countdown-timer]");
    if (!root) return;
    var hEl = root.querySelector("[data-cd-h]");
    var mEl = root.querySelector("[data-cd-m]");
    var sEl = root.querySelector("[data-cd-s]");
    if (!hEl || !mEl || !sEl) return;

    function pad(n) { return n < 10 ? "0" + n : "" + n; }

    function tick() {
      var now = new Date();
      var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
      var diff = Math.max(0, midnight - now);
      var totalSec = Math.floor(diff / 1000);
      var h = Math.floor(totalSec / 3600);
      var m = Math.floor((totalSec % 3600) / 60);
      var s = totalSec % 60;
      hEl.textContent = pad(h);
      mEl.textContent = pad(m);
      sEl.textContent = pad(s);
    }

    tick();
    setInterval(tick, 1000);
  }

  // ---------- hero-video-carousel: simple-ui.html의 carousel-track 로직 그대로 포팅 ----------
  // 카드 폭 기준으로 뷰포트 2배를 채울 만큼 세트를 복제하고, 그 결과를 한 번 더 이어붙여
  // translateX(-50%) 루프가 항상 빈틈없이 이어지게 함(원본 buildCarousel과 동일한 계산식).
  function initHeroVideoCarousel() {
    var track = document.getElementById("heroVideoTrack");
    if (!track) return;

    // dashboard-1 각색: 왼쪽엔 히어로 전용 세로형 영상 2개, 오른쪽엔 통계 카드(HTML에 고정 마크업으로 이미 있음)
    // 비율은 ffprobe 실측값 그대로 고정: hero-vd1(834x1112), hero-vd2(1080x1920, 정확히 9/16)
    var videos = [
      { src: "image/hero-vd1.mp4", ar: "834/1112" },
      { src: "image/hero-vd2.mp4", ar: "9/16" }
    ];

    function cardHTML(v) {
      return (
        '<div class="hero-video-carousel__card" style="--ar:' + v.ar + ';">' +
          '<video src="' + encodeURI(v.src) + '" autoplay loop muted playsinline preload="auto"></video>' +
        "</div>"
      );
    }

    track.innerHTML = videos.map(cardHTML).join("");
    track.querySelectorAll("video").forEach(function (v) {
      v.muted = true;
      var p = v.play();
      if (p) p.catch(function () {});
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initDropdownAccordion();
    initPricingToggle();
    initGallery();
    initSharedGallery();
    initHeroMatrix();
    initWarp();
    initGooey();
    initTextShimmerWave(document.querySelector("[data-shimmer-wave]"));
    initHeroVideoCarousel();
    initHeroChat();
    initCountdownTimer();
    initStellarTabs();
    initStellarBanner();
    initStudioShowcase();
    initPortfolioGallery();
  });
})();
