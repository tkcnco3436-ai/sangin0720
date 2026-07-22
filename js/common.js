(function () {
  "use strict";

  function initDrawer() {
    var drawer = document.querySelector("[data-drawer]");
    var backdrop = document.querySelector("[data-drawer-backdrop]");
    var openBtn = document.querySelector("[data-drawer-open]");
    var closeBtn = document.querySelector("[data-drawer-close]");
    if (!drawer || !backdrop || !openBtn) return;

    function open() {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      openBtn.setAttribute("aria-expanded", "true");
    }
    function close() {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      openBtn.setAttribute("aria-expanded", "false");
    }

    openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  // ---------- 로그인 헤더 프로필 드롭다운: 클릭 토글, 바깥클릭·Esc 닫기 ----------
  function initHeaderProfile() {
    var wrap = document.querySelector("[data-header-profile]");
    if (!wrap) return;
    var btn = wrap.querySelector("[data-header-profile-btn]");
    if (!btn) return;

    function open() {
      wrap.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
    function close() {
      wrap.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (wrap.classList.contains("is-open")) close(); else open();
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  // ---------- mesh-gradient-shader: React useEffect/useRef 껍데기를 벗기고 WebGL 로직만 그대로 포팅 ----------
  // 셰이더 문자열(GLSL)과 컴파일/렌더 루프는 원본과 동일. React state 대신 옵션 객체를 클로저에 담음.
  // canvas를 인자로 받아 페이지 내 여러 개(.mesh-gradient-canvas)에 각각 독립적으로 적용 가능.
  function initStellarMesh(canvas) {
    if (!canvas) return;

    var opts = { speed: 10, intensity: 2, grain: 0.75 };

    var VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";
    var FRAG = [
      "precision highp float;",
      "uniform vec2 u_res; uniform float u_time; uniform float u_speed; uniform float u_intensity; uniform float u_grain;",
      "const vec3 C_PRIMARY = vec3(1.000,1.000,1.000);",
      "const vec3 C_ACCENT  = vec3(1.000,0.396,0.376);",
      "const vec3 C_PINK    = vec3(1.000,1.000,1.000);",
      "const vec3 C_MAGENTA = vec3(1.000,1.000,1.000);",
      "const vec3 C_DEEP    = vec3(1.000,1.000,1.000);",
      "float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }",
      "float grain(vec2 uv){ return hash(uv*vec2(1031.0,1973.0)+fract(u_time)); }",
      "void main(){",
      "  vec2 uv = gl_FragCoord.xy/u_res.xy;",
      "  float t = u_time*0.16*u_speed;",
      "  vec2 p0=vec2(0.24+0.18*sin(t*1.1), 0.30+0.14*cos(t*0.9));",
      "  vec2 p1=vec2(0.80+0.14*cos(t*0.8), 0.26+0.16*sin(t*1.2));",
      "  vec2 p2=vec2(0.56+0.20*sin(t*0.7), 0.76+0.12*cos(t*0.85));",
      "  vec2 p3=vec2(0.16+0.15*cos(t*1.3), 0.70+0.13*sin(t*0.75));",
      "  float e=1.9;",
      "  float w0=pow(1.0/(distance(uv,p0)+0.05),e);",
      "  float w1=pow(1.0/(distance(uv,p1)+0.05),e);",
      "  float w2=pow(1.0/(distance(uv,p2)+0.05),e);",
      "  float w3=pow(1.0/(distance(uv,p3)+0.05),e);",
      "  float ws=w0+w1+w2+w3;",
      "  vec3 col=(C_ACCENT*w0 + C_PINK*w1 + C_PRIMARY*w2 + C_MAGENTA*w3)/ws;",
      "  col = mix(col, vec3(1.000,0.396,0.376), 0.10*u_intensity*sin(t+uv.x*3.0));",
      "  col = mix(col, C_DEEP, smoothstep(0.45,1.15,uv.y)*0.16);",
      "  col += (grain(uv)-0.5)*0.04*u_grain;",
      "  gl_FragColor=vec4(col,1.0);",
      "}"
    ].join("\n");

    var gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) {
      canvas.style.background = "#5869f7";
      return;
    }

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    }

    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, "u_res");
    var uTime = gl.getUniformLocation(prog, "u_time");
    var uSpeed = gl.getUniformLocation(prog, "u_speed");
    var uInt = gl.getUniformLocation(prog, "u_intensity");
    var uGrain = gl.getUniformLocation(prog, "u_grain");

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    window.addEventListener("resize", resize);

    var t0 = performance.now();
    function frame() {
      resize();
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.uniform1f(uSpeed, opts.speed);
      gl.uniform1f(uInt, opts.intensity);
      gl.uniform1f(uGrain, opts.grain);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ---------- 모달 접근성: 열릴 때 포커스 이동/트랩, 닫힐 때 트리거로 복귀 ----------
  // [role="dialog"] 요소를 대상으로, 페이지별 열기/닫기 로직(class·style 무엇이든)을 건드리지 않고
  // 표시 상태 변화(class/style 변경)를 MutationObserver로 감지해 포커스만 관리한다.
  function initModalA11y() {
    var dialogs = document.querySelectorAll('[role="dialog"]');
    if (!dialogs.length) return;

    var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var openDialog = null;
    var lastTrigger = null;

    function isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }
    function focusables(dialog) {
      return Array.prototype.filter.call(dialog.querySelectorAll(FOCUSABLE), isVisible);
    }

    function onOpen(dialog) {
      if (openDialog === dialog) return;
      openDialog = dialog;
      lastTrigger = document.activeElement;
      var items = focusables(dialog);
      if (items.length) {
        items[0].focus();
      } else {
        dialog.setAttribute("tabindex", "-1");
        dialog.focus();
      }
    }
    function onClose(dialog) {
      if (openDialog !== dialog) return;
      openDialog = null;
      if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
      lastTrigger = null;
    }

    dialogs.forEach(function (dialog) {
      var wasOpen = isVisible(dialog);
      new MutationObserver(function () {
        var nowOpen = isVisible(dialog);
        if (nowOpen === wasOpen) return;
        wasOpen = nowOpen;
        if (nowOpen) onOpen(dialog); else onClose(dialog);
      }).observe(dialog, { attributes: true, attributeFilter: ["class", "style"] });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !openDialog) return;
      var items = focusables(openDialog);
      if (!items.length) { e.preventDefault(); return; }
      var first = items[0];
      var last = items[items.length - 1];
      var active = document.activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      else if (!openDialog.contains(active)) { e.preventDefault(); first.focus(); }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.lucide) window.lucide.createIcons();
    initDrawer();
    initHeaderProfile();
    document.querySelectorAll(".mesh-gradient-canvas").forEach(initStellarMesh);
    initModalA11y();
  });
})();
