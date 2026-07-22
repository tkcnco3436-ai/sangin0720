(function () {
  "use strict";

  // ---------- 마이페이지: 결제 수단 추가 팝업(카드 등록 폼 + 약관 전체동의) ----------
  function initMypageCardAdd() {
    var openBtn = document.querySelector("[data-mypage-card-add-open]");
    var overlay = document.querySelector("[data-mypage-card-overlay]");
    var paymentList = document.querySelector("[data-mypage-payment-list]");
    var stepLabel = document.querySelector("[data-mypage-wizard-step-label]");
    var stepTitle = document.querySelector("[data-mypage-wizard-title]");
    var steps = document.querySelectorAll("[data-mypage-wizard-step]");
    var leftBtn = document.querySelector("[data-mypage-wizard-left]");
    var rightBtn = document.querySelector("[data-mypage-wizard-right]");
    var issuerTiles = document.querySelectorAll(".mypage-issuer-tile");
    var consentAll = document.querySelector("[data-mypage-consent-all]");
    var consentItems = document.querySelectorAll("[data-mypage-consent-item]");
    if (!openBtn || !overlay || !paymentList || !stepLabel || !stepTitle || !steps.length || !leftBtn || !rightBtn ||
        !issuerTiles.length || !consentAll || !consentItems.length) return;

    var num1 = overlay.querySelector('[data-mypage-card-field="num1"]');
    var num2 = overlay.querySelector('[data-mypage-card-field="num2"]');
    var num3 = overlay.querySelector('[data-mypage-card-field="num3"]');
    var num4 = overlay.querySelector('[data-mypage-card-field="num4"]');
    var mm = overlay.querySelector('[data-mypage-card-field="mm"]');
    var yy = overlay.querySelector('[data-mypage-card-field="yy"]');
    var cvc = overlay.querySelector('[data-mypage-card-field="cvc"]');
    var pw = overlay.querySelector('[data-mypage-card-field="pw"]');
    if (!num1 || !num2 || !num3 || !num4 || !mm || !yy || !cvc || !pw) return;

    var numericFields = [num1, num2, num3, num4, mm, yy, cvc, pw];
    var issuerValue = "";
    var issuerLogo = "";
    var currentStep = 1;
    var TOTAL_STEPS = 3;
    var STEP_TITLES = { 1: "카드사를 선택하세요", 2: "카드 정보를 입력하세요", 3: "약관에 동의해주세요" };

    function isStepValid(step) {
      if (step === 1) return issuerValue !== "";
      if (step === 2) {
        return num1.value.length === 4 && num2.value.length === 4 && num3.value.length === 4 && num4.value.length === 4 &&
          mm.value.length === 2 && yy.value.length === 2 && cvc.value.length === 3 && pw.value.length === 2;
      }
      return Array.prototype.every.call(consentItems, function (item) { return item.checked; });
    }

    function render() {
      stepLabel.textContent = currentStep + " / " + TOTAL_STEPS;
      stepTitle.textContent = STEP_TITLES[currentStep];
      steps.forEach(function (panel) {
        panel.classList.toggle("is-active", Number(panel.getAttribute("data-mypage-wizard-step")) === currentStep);
      });
      leftBtn.textContent = currentStep === 1 ? "취소" : "이전";
      rightBtn.textContent = currentStep === TOTAL_STEPS ? "등록하기" : "다음";
      rightBtn.disabled = !isStepValid(currentStep);
    }

    numericFields.forEach(function (field) {
      field.addEventListener("input", function () {
        field.value = field.value.replace(/\D/g, "").slice(0, field.maxLength);
        render();
      });
    });

    issuerTiles.forEach(function (tile) {
      tile.addEventListener("click", function () {
        issuerValue = tile.getAttribute("data-issuer-name");
        issuerLogo = tile.getAttribute("data-issuer-logo");
        issuerTiles.forEach(function (t) { t.classList.remove("is-selected"); });
        tile.classList.add("is-selected");
        render();
      });
    });

    consentAll.addEventListener("change", function () {
      Array.prototype.forEach.call(consentItems, function (item) { item.checked = consentAll.checked; });
      render();
    });
    Array.prototype.forEach.call(consentItems, function (item) {
      item.addEventListener("change", function () {
        consentAll.checked = Array.prototype.every.call(consentItems, function (i) { return i.checked; });
        render();
      });
    });

    function resetForm() {
      issuerValue = "";
      issuerLogo = "";
      issuerTiles.forEach(function (t) { t.classList.remove("is-selected"); });
      numericFields.forEach(function (field) { field.value = ""; });
      consentAll.checked = false;
      Array.prototype.forEach.call(consentItems, function (item) { item.checked = false; });
      currentStep = 1;
      render();
    }

    function open() {
      resetForm();
      overlay.classList.add("is-open");
    }
    function close() {
      overlay.classList.remove("is-open");
    }

    function addPaymentRow() {
      var maskedNum = "**** **** **** " + num4.value;
      var label = issuerValue + " " + maskedNum;
      var isFirstCard = paymentList.children.length === 0;
      var row = document.createElement("div");
      row.className = "mypage-info-row mypage-payment-item";
      row.setAttribute("data-mypage-card-label", label);
      var defaultSlotHtml = isFirstCard
        ? '<span class="mypage-payment-default-label">기본</span>'
        : '<button class="mypage-btn-ghost" type="button" data-mypage-card-set-default>기본 설정</button>';
      row.innerHTML =
        '<span class="mypage-info-row__icon"><img src="image/' + issuerLogo + '" alt="' + issuerValue + '" width="16" height="16"></span>' +
        '<span class="mypage-info-row__label">' + issuerValue + '</span>' +
        '<span class="mypage-info-row__value">' + maskedNum + '</span>' +
        '<span class="mypage-payment-actions">' +
        defaultSlotHtml +
        '<button class="mypage-btn-ghost" type="button">삭제</button>' +
        '</span>';
      paymentList.appendChild(row);
      updateMypagePaymentEmptyState();
    }

    openBtn.addEventListener("click", open);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });

    leftBtn.addEventListener("click", function () {
      if (currentStep === 1) { close(); return; }
      currentStep -= 1;
      render();
    });
    rightBtn.addEventListener("click", function () {
      if (rightBtn.disabled) return;
      if (currentStep < TOTAL_STEPS) {
        currentStep += 1;
        render();
        return;
      }
      addPaymentRow();
      close();
    });
  }

  // ---------- 마이페이지: 결제 수단 삭제 확인 팝업(마지막 카드 경고 + 삭제하기/취소하기) ----------
  function updateMypagePaymentEmptyState() {
    var paymentList = document.querySelector("[data-mypage-payment-list]");
    var emptyState = document.querySelector("[data-mypage-payment-empty]");
    if (!paymentList || !emptyState) return;
    emptyState.classList.toggle("is-visible", paymentList.children.length === 0);
  }

  function initMypagePaymentDelete() {
    var paymentList = document.querySelector("[data-mypage-payment-list]");
    var overlay = document.querySelector("[data-mypage-delete-overlay]");
    var cancelBtn = document.querySelector("[data-mypage-delete-cancel]");
    var confirmBtn = document.querySelector("[data-mypage-delete-confirm]");
    var cardLabel = document.querySelector("[data-mypage-delete-card-label]");
    var lastWarning = document.querySelector("[data-mypage-delete-last-warning]");
    if (!paymentList || !overlay || !cancelBtn || !confirmBtn || !cardLabel || !lastWarning) return;

    var pendingRow = null;

    function close() {
      overlay.classList.remove("is-open");
      pendingRow = null;
    }

    paymentList.addEventListener("click", function (e) {
      var deleteBtn = e.target.closest(".mypage-btn-ghost:not([data-mypage-card-set-default])");
      if (!deleteBtn) return;
      var row = deleteBtn.closest(".mypage-info-row");
      if (!row) return;
      pendingRow = row;
      cardLabel.textContent = row.getAttribute("data-mypage-card-label") || "";
      lastWarning.classList.toggle("is-visible", paymentList.children.length === 1);
      overlay.classList.add("is-open");
    });

    cancelBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });

    confirmBtn.addEventListener("click", function () {
      if (pendingRow) pendingRow.remove();
      close();
      updateMypagePaymentEmptyState();
    });
  }

  // ---------- 마이페이지: 결제 수단 목록에서 "기본카드 변경" 클릭 시 기본 카드 토글 ----------
  function initMypagePaymentDefault() {
    var paymentList = document.querySelector("[data-mypage-payment-list]");
    if (!paymentList) return;

    function setSlot(row, isDefault) {
      var actions = row.querySelector(".mypage-payment-actions");
      if (!actions) return;
      var existing = actions.querySelector(".mypage-payment-default-label, [data-mypage-card-set-default]");
      if (existing) existing.remove();
      var el;
      if (isDefault) {
        el = document.createElement("span");
        el.className = "mypage-payment-default-label";
        el.textContent = "기본";
      } else {
        el = document.createElement("button");
        el.type = "button";
        el.className = "mypage-btn-ghost";
        el.setAttribute("data-mypage-card-set-default", "");
        el.textContent = "기본 설정";
      }
      actions.insertBefore(el, actions.firstChild);
    }

    paymentList.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-mypage-card-set-default]");
      if (!btn) return;
      var row = btn.closest(".mypage-info-row");
      if (!row) return;

      var currentLabel = paymentList.querySelector(".mypage-payment-default-label");
      var currentDefaultRow = currentLabel ? currentLabel.closest(".mypage-info-row") : null;
      if (currentDefaultRow && currentDefaultRow !== row) setSlot(currentDefaultRow, false);
      setSlot(row, true);
      paymentList.insertBefore(row, paymentList.firstChild);
    });
  }

  // ---------- 마이페이지: 모바일에서 인포 아이콘 클릭 시 그 위치에 말풍선 툴팁으로 설명 문구 표시 ----------
  function initMypageInfoToggle() {
    var toggles = document.querySelectorAll("[data-mypage-info-toggle]");
    var bubble = document.querySelector("[data-mypage-info-modal]");
    var bubbleText = document.querySelector("[data-mypage-info-modal-text]");
    if (!toggles.length || !bubble || !bubbleText) return;

    var currentBtn = null;
    var hideTimer = null;

    function close() {
      bubble.classList.remove("is-open");
      currentBtn = null;
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    }

    function positionNear(btn) {
      var rect = btn.getBoundingClientRect();
      var bubbleWidth = bubble.offsetWidth || 220;
      var top = rect.bottom + 10;
      var left = rect.left + rect.width / 2 - bubbleWidth / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - bubbleWidth - 12));
      var tailLeft = rect.left + rect.width / 2 - left;
      bubble.style.top = top + "px";
      bubble.style.left = left + "px";
      bubble.style.setProperty("--mypage-info-tail-left", tailLeft + "px");
    }

    toggles.forEach(function (btn) {
      var desc = btn.parentElement.querySelector(".mypage-info-row__desc");
      if (!desc) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (currentBtn === btn && bubble.classList.contains("is-open")) { close(); return; }
        currentBtn = btn;
        bubbleText.textContent = desc.dataset.originalText || desc.textContent;
        bubble.classList.add("is-open");
        positionNear(btn);
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(close, 2000);
      });
    });

    document.addEventListener("click", function (e) {
      if (bubble.classList.contains("is-open") && !bubble.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && bubble.classList.contains("is-open")) close();
    });
    window.addEventListener("resize", function () {
      if (bubble.classList.contains("is-open") && currentBtn) positionNear(currentBtn);
    });
  }

  // ---------- 마이페이지: 커버 메시 그라디언트 위에 Mypage ↔ 마이페이지 타이핑 효과 ----------
  function initMypageTypingEffect() {
    var textEl = document.querySelector("[data-mypage-typing-text]");
    if (!textEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      textEl.textContent = "마이페이지";
      return;
    }

    var words = ["Mypage", "마이페이지"];
    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = words[wordIndex];
      if (!deleting) {
        charIndex += 1;
        textEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1200);
          return;
        }
        setTimeout(tick, 120);
      } else {
        charIndex -= 1;
        textEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 60);
      }
    }
    tick();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMypageCardAdd();
    initMypagePaymentDelete();
    updateMypagePaymentEmptyState();
    initMypagePaymentDefault();
    initMypageInfoToggle();
    initMypageTypingEffect();
  });
})();
