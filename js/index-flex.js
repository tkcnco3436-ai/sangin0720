(function () {
  "use strict";

  // 프롬프트 바 제출 → 회원가입으로 이동(데모)
  function initPrompt() {
    var form = document.querySelector("[data-flexhero-prompt]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "signup/";
    });
  }

  // AI 아바타 채팅 시퀀스: (업로드 로딩) → 타이핑 → 멈춤 → 삭제 → 다음, 무한 반복
  function initSequence() {
    var typeEl = document.querySelector("[data-flexhero-type]");
    var textWrap = document.querySelector(".flexhero__prompt-text");
    var badge = document.querySelector("[data-flexhero-badge]");
    var loading = document.querySelector("[data-flexhero-loading]");
    var bar = document.querySelector("[data-flexhero-bar]");
    if (!typeEl || !textWrap) return;

    // upload: 문장 전 이미지 업로드 로딩 재생 / badge: 첨부 배지 표시 여부
    var STEPS = [
      { text: "고객님이 업로드하신 이미지를 분석하고 주제와 컨셉을 제안합니다.", badge: true, upload: true },
      { text: "고객님이 선택한 주제와 컨셉에 따라 영상을 생성합니다.", badge: true, upload: false },
      { text: "안녕하세요 상인월드는 대표님의 이미지 한장으로 콘텐츠를 만듭니다.", badge: false, upload: false }
    ];
    var TYPE_MS = 55, ERASE_MS = 26, HOLD_MS = 2000, GAP_MS = 500, UPLOAD_MS = 2800;

    function showBadge(v) {
      if (!badge) return;
      if (v) {
        badge.hidden = false;
        void badge.offsetWidth;
        badge.classList.remove("is-hiding");
      } else {
        badge.classList.add("is-hiding");   // 페이드아웃
        setTimeout(function () {
          if (badge.classList.contains("is-hiding")) badge.hidden = true;
        }, 420);
      }
    }
    function showText(v) { textWrap.style.display = v ? "" : "none"; }
    function showLoading(v) { if (loading) loading.hidden = !v; }

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      showLoading(false); showText(true); showBadge(STEPS[0].badge);
      typeEl.textContent = STEPS[0].text;
      return;
    }

    var idx = 0;

    function runUpload(done) {
      showText(false);
      showBadge(false);
      showLoading(true);
      if (bar) {
        bar.style.width = "0";
        // 리플로우 강제 후 채우기
        void bar.offsetWidth;
        bar.style.width = "100%";
      }
      setTimeout(function () { showLoading(false); done(); }, UPLOAD_MS);
    }

    function typeStep(step) {
      showLoading(false);
      showText(true);
      var wasVisible = badge && !badge.hidden;
      showBadge(step.badge);
      // 배지를 숨기는 전환이면(예: 채팅3) 페이드아웃이 끝난 뒤 타이핑 시작
      var startDelay = (!step.badge && wasVisible) ? 460 : 0;
      typeEl.textContent = "";
      var i = 0;
      setTimeout(function type() {
        i++;
        typeEl.textContent = step.text.slice(0, i);
        if (i >= step.text.length) setTimeout(erase, HOLD_MS);
        else setTimeout(type, TYPE_MS);
      }, startDelay);

      function erase() {
        var j = step.text.length;
        (function del() {
          j--;
          typeEl.textContent = step.text.slice(0, Math.max(0, j));
          if (j <= 0) { idx = (idx + 1) % STEPS.length; setTimeout(next, GAP_MS); }
          else setTimeout(del, ERASE_MS);
        })();
      }
    }

    function next() {
      var step = STEPS[idx];
      if (step.upload) runUpload(function () { typeStep(step); });
      else typeStep(step);
    }

    setTimeout(next, 600);
  }

  // 후기 기본 프로필: 이름 첫 글자를 아바타 중앙에 표시
  function initTmtAvatars() {
    document.querySelectorAll(".tmt-cap").forEach(function (cap) {
      var av = cap.querySelector(".tmt-cap__avatar");
      var who = cap.querySelector(".tmt-cap__who");
      if (!av || !who || av.textContent.trim()) return;
      var name = who.textContent.split("·")[0].trim();
      if (name) av.textContent = name.charAt(0);
    });
  }

  // 공지 아코디언: 트리거 클릭 시 해당 항목 아래로 펼침(개별 토글)
  function initNotice() {
    var list = document.querySelector("[data-notice]");
    if (!list) return;
    var triggers = list.querySelectorAll(".notice-item__trigger");
    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".notice-item");
        var willOpen = !item.classList.contains("is-open");
        // 다른 항목 전부 닫기(최대 1개만 열림)
        triggers.forEach(function (b) {
          b.closest(".notice-item").classList.remove("is-open");
          b.setAttribute("aria-expanded", "false");
        });
        if (willOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  // How It Works 타임라인 — 뷰포트 중앙에 가장 가까운 항목만 확장 + AI 타이핑 시퀀스
  function initTimeline() {
    var tl = document.querySelector("[data-timeline]");
    if (!tl) return;
    var items = Array.prototype.slice.call(tl.querySelectorAll(".tl-item"));
    if (!items.length) return;

    // 각 채팅 맨 앞에 타이핑 인디케이터 주입
    tl.classList.add("js-typing");
    items.forEach(function (it) {
      var chat = it.querySelector(".tl-chat");
      if (!chat) return;
      var t = document.createElement("div");
      t.className = "tl-msg tl-typing";
      t.innerHTML = '<span class="tl-avatar" aria-hidden="true"></span>' +
        '<span class="tl-bubble tl-bubble--typing"><i></i><i></i><i></i></span>';
      chat.insertBefore(t, chat.firstChild);
    });

    var current = null, ticking = false;

    function activate(best) {
      if (best === current) return;
      current = best;
      items.forEach(function (it) {
        var active = it === best;
        it.classList.toggle("is-active", active);
        var chat = it.querySelector(".tl-chat");
        if (!chat) return;
        clearTimeout(it._typeTimer);
        if (active) {
          chat.classList.remove("is-typed");                 // 타이핑 먼저
          it._typeTimer = setTimeout(function () {
            chat.classList.add("is-typed");                  // 그 뒤 메시지 등장
          }, 700);
        } else {
          chat.classList.remove("is-typed");                 // 벗어나면 리셋(재방문 시 다시 타이핑)
        }
      });
    }

    function update() {
      ticking = false;
      var mid = window.innerHeight / 2;
      var best = null, bestDist = Infinity;
      items.forEach(function (it) {
        var r = it.getBoundingClientRect();
        var c = r.top + r.height / 2;
        var d = Math.abs(c - mid);
        if (d < bestDist) { bestDist = d; best = it; }
      });
      activate(best);
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  // 푸터 스크롤 진입 시 fade-up 등장
  function initFooterReveal() {
    var footer = document.querySelector(".sw-footer");
    if (!footer) return;
    if (!("IntersectionObserver" in window)) { footer.classList.add("is-in"); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { footer.classList.add("is-in"); io.disconnect(); }
      });
    }, { threshold: 0.15 });
    io.observe(footer);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPrompt();
    initSequence();
    initTmtAvatars();
    initNotice();
    initTimeline();
    initFooterReveal();
  });
})();
