(function() {
  // src/utils/storage.ts
  var PREFIX = "lte-";
  function getLocal(key, defaultValue) {
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v !== null ? JSON.parse(v) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
  function setLocal(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
    }
  }
  var BACKGROUND_HOST_ID = "lte-background-host";
  function isStandaloneWindow() {
    return window.location.pathname.indexOf("/standalone/") === 0;
  }
  function findApplicationShell() {
    const dragRegion = document.querySelector("#sjmcl-window-drag-region, #sjmcl-main-drag-region");
    const titlebar = dragRegion && dragRegion.parentElement;
    return titlebar && titlebar.parentElement || null;
  }
  function ensureBackgroundHost() {
    if (isStandaloneWindow()) return null;
    const existing = document.getElementById(BACKGROUND_HOST_ID);
    if (existing && existing.isConnected) return existing;
    const shell = findApplicationShell();
    if (!shell) return null;
    ["lte-th-bg", "lte-video-bg"].forEach(function(id) {
      const legacy = document.getElementById(id);
      if (legacy && legacy.parentNode === document.body) legacy.parentNode.removeChild(legacy);
    });
    const host = document.createElement("div");
    host.id = BACKGROUND_HOST_ID;
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:0;border-radius:inherit;";
    host.__lteShell = shell;
    host.__ltePreviousPosition = shell.style.position;
    host.__ltePreviousIsolation = shell.style.isolation;
    if (getComputedStyle(shell).position === "static") shell.style.position = "relative";
    shell.style.isolation = "isolate";
    shell.insertBefore(host, shell.firstChild);
    return host;
  }
  function removeBackgroundHost() {
    const host = document.getElementById(BACKGROUND_HOST_ID);
    if (!host) return;
    const shell = host.__lteShell;
    if (shell) {
      shell.style.position = host.__ltePreviousPosition || "";
      shell.style.isolation = host.__ltePreviousIsolation || "";
    }
    if (host.parentNode) host.parentNode.removeChild(host);
  }
  var CURSOR_CANVAS_ID = "lte-cursor-effects";
  var MOUSE_EFFECT_OPTIONS = [
    { id: "cursor_stardust", icon: "✨", labelKey: "cursorStardust", descriptionKey: "mouseEffectsDesc", colors: ["#52e2ff", "#8c6cff", "#ff6fc8"] },
    { id: "comet", icon: "☄️", labelKey: "mouseCometTrail", descriptionKey: "mouseCometDesc", colors: ["#d9fbff", "#55aaff", "#8b5cf6"] },
    { id: "sparkle", icon: "✦", labelKey: "mouseSparkleTrail", descriptionKey: "mouseSparkleDesc", colors: ["#fff2a8", "#62e4ed", "#c7a7ff"] },
    { id: "sakura", icon: "🌸", labelKey: "mouseSakuraTrail", descriptionKey: "mouseSakuraDesc", colors: ["#ffd6e2", "#ff91b8", "#fff1e8"] },
    { id: "snowflake", icon: "❄️", labelKey: "mouseSnowflakeTrail", descriptionKey: "mouseSnowflakeDesc", colors: ["#f4ffff", "#a9ddff", "#8495ff"] },
    { id: "glitch", icon: "▦", labelKey: "mouseGlitchTrail", descriptionKey: "mouseGlitchDesc", colors: ["#47f3ff", "#ff4fcf", "#7b5cff"] }
  ];
  function getMouseEffectOption(id) {
    return MOUSE_EFFECT_OPTIONS.find(function(option) {
      return option.id === id;
    }) || MOUSE_EFFECT_OPTIONS[0];
  }
  var _cursorEffectType = getMouseEffectOption(getLocal("mouse_effect_type", "cursor_stardust")).id;
  var _cursorCanvas = null;
  var _cursorAnimation = null;
  var _cursorEnabled = false;
  var _cursorIntensity = 50;
  var _cursorParticles = [];
  var _cursorHistory = [];
  var _cursorFrame = 0;
  var _cursorLastX = null;
  var _cursorLastY = null;
  var _cursorLastSpawn = 0;
  var _cursorMoveHandler = null;
  var _cursorLeaveHandler = null;
  function ensureCursorCanvas() {
    if (isStandaloneWindow()) return null;
    const host = ensureBackgroundHost();
    if (!host) return null;
    if (!_cursorCanvas) {
      host.querySelectorAll("#" + CURSOR_CANVAS_ID).forEach(function(stale) {
        stale.remove();
      });
      _cursorCanvas = document.createElement("canvas");
      _cursorCanvas.id = CURSOR_CANVAS_ID;
      _cursorCanvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;";
    }
    if (_cursorCanvas.parentNode !== host) host.appendChild(_cursorCanvas);
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;
    if (_cursorCanvas.width !== width) _cursorCanvas.width = width;
    if (_cursorCanvas.height !== height) _cursorCanvas.height = height;
    return _cursorCanvas;
  }
  function queueCursorAnimation() {
    if (_cursorAnimation === null) _cursorAnimation = requestAnimationFrame(cursorAnimationLoop);
  }
  function addCursorParticle(effect, x, y, dx, dy, strength) {
    const nowColor = performance.now() * 0.04;
    if (effect === "sparkle") {
      const golden = Math.random() < 0.35;
      _cursorParticles.push({
        x, y,
        vx: dx * 0.012 + (Math.random() - 0.5) * 0.28,
        vy: dy * 0.012 + (Math.random() - 0.5) * 0.28,
        size: (3 + Math.random() * 4.5) * (0.75 + strength * 0.5),
        hue: golden ? 50 + Math.random() * 16 : 184 + Math.random() * 28,
        age: 0,
        life: 20 + Math.floor(Math.random() * 16),
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.08
      });
      return;
    }
    if (effect === "sakura") {
      _cursorParticles.push({
        x, y,
        vx: dx * 0.012 + (Math.random() - 0.5) * 0.32,
        vy: 0.08 + Math.random() * 0.24,
        size: (3.5 + Math.random() * 4.5) * (0.75 + strength * 0.4),
        hue: 326 + Math.random() * 22,
        age: 0,
        life: 34 + Math.floor(Math.random() * 20),
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.045,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.018 + Math.random() * 0.025,
        sway: 0.2 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2
      });
      return;
    }
    if (effect === "snowflake") {
      _cursorParticles.push({
        x, y,
        vx: (Math.random() - 0.5) * 0.18,
        vy: 0.08 + Math.random() * 0.22,
        size: (2.8 + Math.random() * 4) * (0.75 + strength * 0.45),
        hue: 190 + Math.random() * 22,
        age: 0,
        life: 36 + Math.floor(Math.random() * 20),
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.035,
        phase: Math.random() * Math.PI * 2
      });
      return;
    }
    if (effect === "glitch") {
      _cursorParticles.push({
        x, y,
        vx: dx * 0.01 + (Math.random() - 0.5) * 0.4,
        vy: dy * 0.01 + (Math.random() - 0.5) * 0.35,
        width: (3 + Math.random() * 9) * (0.7 + strength * 0.55),
        height: 1.2 + Math.random() * 2.4,
        hue: Math.random() < 0.5 ? 184 + Math.random() * 24 : 300 + Math.random() * 28,
        age: 0,
        life: 8 + Math.floor(Math.random() * 12)
      });
      return;
    }
    _cursorParticles.push({
      x, y,
      vx: dx * 0.018 + (Math.random() - 0.5) * 0.45,
      vy: dy * 0.018 + (Math.random() - 0.5) * 0.45,
      size: (0.8 + Math.random() * 1.8) * (0.75 + strength * 0.5),
      hue: (x / Math.max(1, _cursorCanvas.width) * 250 + nowColor) % 360,
      age: 0,
      life: 18 + Math.floor(Math.random() * 14)
    });
  }
  function spawnCursorParticles(fromX, fromY, toX, toY) {
    const now = performance.now();
    if (now - _cursorLastSpawn < 8) return;
    _cursorLastSpawn = now;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.hypot(dx, dy);
    if (distance < 4.5) return;
    const strength = _cursorIntensity / 100;
    const steps = Math.max(1, Math.min(_cursorEffectType === "comet" ? 7 : 5, Math.ceil(distance / 13)));
    for (let step = 0; step < steps; step++) {
      const t = (step + 1) / steps;
      const x = fromX + dx * t;
      const y = fromY + dy * t;
      if (_cursorEffectType === "comet") {
        _cursorHistory.push({ x, y, age: 0, life: 22 });
      } else {
        addCursorParticle(_cursorEffectType, x, y, dx, dy, strength);
      }
    }
    const limit = _cursorEffectType === "comet" ? 34 : _cursorEffectType === "snowflake" ? 120 : _cursorEffectType === "glitch" ? 150 : 220;
    if (_cursorEffectType === "comet") {
      while (_cursorHistory.length > limit) _cursorHistory.shift();
    } else {
      while (_cursorParticles.length > limit) _cursorParticles.shift();
    }
    queueCursorAnimation();
  }
  function handleCursorMove(event) {
    if (!_cursorEnabled || isStandaloneWindow()) return;
    const canvas = ensureCursorCanvas();
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(canvas.height, event.clientY - rect.top));
    if (_cursorLastX === null || _cursorLastY === null) {
      _cursorLastX = x;
      _cursorLastY = y;
      return;
    }
    spawnCursorParticles(_cursorLastX, _cursorLastY, x, y);
    _cursorLastX = x;
    _cursorLastY = y;
  }
  function resetCursorPointer() {
    _cursorLastX = null;
    _cursorLastY = null;
  }
  function drawCursorComet(ctx, strength) {
    for (let i = _cursorHistory.length - 1; i >= 0; i--) {
      const point = _cursorHistory[i];
      point.age += 1;
      if (point.age >= point.life) _cursorHistory.splice(i, 1);
    }
    for (let i = 1; i < _cursorHistory.length; i++) {
      const a = _cursorHistory[i - 1];
      const b = _cursorHistory[i];
      const ratio = i / _cursorHistory.length;
      const lifeRatio = 1 - b.age / b.life;
      const alpha = Math.pow(lifeRatio, 1.2) * ratio * strength;
      const hue = 190 + ratio * 95;
      const width = (0.7 + ratio * 3.6) * (0.75 + strength * 0.45);
      ctx.strokeStyle = "hsla(" + hue + ",100%,66%," + alpha * 0.12 + ")";
      ctx.lineWidth = width * 4;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.strokeStyle = "hsla(" + hue + ",100%,74%," + alpha * 0.45 + ")";
      ctx.lineWidth = width * 1.8;
      ctx.stroke();
      ctx.strokeStyle = "hsla(" + (hue + 12) + ",100%,88%," + alpha + ")";
      ctx.lineWidth = width;
      ctx.stroke();
    }
    if (_cursorHistory.length > 0) {
      const head = _cursorHistory[_cursorHistory.length - 1];
      ctx.fillStyle = "rgba(210,250,255," + Math.min(1, strength) + ")";
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2.2 + strength * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function drawCursorParticles(ctx, strength, canvas) {
    for (let i = _cursorParticles.length - 1; i >= 0; i--) {
      const d = _cursorParticles[i];
      d.age += 1;
      if (d.age >= d.life) {
        _cursorParticles.splice(i, 1);
        continue;
      }
      const lifeRatio = 1 - d.age / d.life;
      const alpha = Math.pow(lifeRatio, 1.35) * strength;
      d.x += d.vx || 0;
      d.y += d.vy || 0;
      if (_cursorEffectType === "sakura") {
        d.phase += 0.05;
        d.x += Math.sin(d.phase) * d.sway * 0.18;
        d.rot += d.spin;
        d.flip += d.flipSpeed;
      } else if (_cursorEffectType === "snowflake") {
        d.phase += 0.045;
        d.x += Math.sin(d.phase) * 0.2;
        d.rot += d.spin;
      } else if (_cursorEffectType === "sparkle") {
        d.rot += d.spin;
        d.vx *= 0.95;
        d.vy *= 0.95;
      } else {
        d.vx *= 0.965;
        d.vy *= 0.965;
      }
      if (_cursorEffectType === "glitch") {
        const jitterX = d.x + (Math.random() - 0.5) * d.width;
        ctx.fillStyle = "hsla(" + d.hue + ",100%,64%," + alpha * 0.75 + ")";
        ctx.fillRect(jitterX, d.y, d.width, d.height);
        ctx.fillStyle = "hsla(" + (d.hue + 120) + ",100%,70%," + alpha * 0.42 + ")";
        ctx.fillRect(d.x - jitterX + d.width * 0.22, d.y + 1, d.width * 0.68, d.height * 0.72);
        continue;
      }
      if (_cursorEffectType === "sparkle") {
        const radius = d.size * (0.55 + lifeRatio * 0.65);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.fillStyle = "hsla(" + d.hue + ",100%,72%," + alpha * 0.14 + ")";
        ctx.beginPath();
        ctx.arc(0, 0, radius * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + d.hue + ",100%,86%," + alpha + ")";
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.quadraticCurveTo(radius * 0.16, -radius * 0.16, radius, 0);
        ctx.quadraticCurveTo(radius * 0.16, radius * 0.16, 0, radius);
        ctx.quadraticCurveTo(-radius * 0.16, radius * 0.16, -radius, 0);
        ctx.quadraticCurveTo(-radius * 0.16, -radius * 0.16, 0, -radius);
        ctx.fill();
        ctx.restore();
        continue;
      }
      if (_cursorEffectType === "sakura") {
        const radius = d.size * (0.65 + lifeRatio * 0.5);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.scale(0.18 + Math.abs(Math.cos(d.flip)) * 0.82, 1);
        ctx.fillStyle = "hsla(" + d.hue + ",88%,78%," + alpha + ")";
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.bezierCurveTo(radius * 0.9, -radius * 0.35, radius * 0.6, radius * 0.5, 0, radius);
        ctx.bezierCurveTo(-radius * 0.6, radius * 0.5, -radius * 0.9, -radius * 0.35, 0, -radius);
        ctx.fill();
        ctx.restore();
        continue;
      }
      if (_cursorEffectType === "snowflake") {
        const radius = d.size * (0.65 + lifeRatio * 0.55);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.fillStyle = "hsla(" + d.hue + ",100%,78%," + alpha * 0.13 + ")";
        ctx.beginPath();
        ctx.arc(0, 0, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "hsla(" + d.hue + ",100%,90%," + alpha + ")";
        ctx.lineWidth = Math.max(0.5, radius * 0.16);
        ctx.beginPath();
        for (let arm = 0; arm < 6; arm++) {
          const angle = arm / 6 * Math.PI * 2;
          const ex = Math.cos(angle) * radius;
          const ey = Math.sin(angle) * radius;
          ctx.moveTo(0, 0);
          ctx.lineTo(ex, ey);
          ctx.moveTo(ex * 0.58, ey * 0.58);
          ctx.lineTo(ex * 0.58 + Math.cos(angle + 0.55) * radius * 0.32, ey * 0.58 + Math.sin(angle + 0.55) * radius * 0.32);
          ctx.moveTo(ex * 0.58, ey * 0.58);
          ctx.lineTo(ex * 0.58 + Math.cos(angle - 0.55) * radius * 0.32, ey * 0.58 + Math.sin(angle - 0.55) * radius * 0.32);
        }
        ctx.stroke();
        ctx.restore();
        continue;
      }
      const radius = Math.max(0.45, d.size * (0.6 + lifeRatio * 0.7));
      ctx.strokeStyle = "hsla(" + d.hue + ",100%,76%," + alpha * 0.46 + ")";
      ctx.lineWidth = Math.max(0.5, radius * 0.75);
      ctx.beginPath();
      ctx.moveTo(d.x - d.vx * 2.8, d.y - d.vy * 2.8);
      ctx.lineTo(d.x, d.y);
      ctx.stroke();
      ctx.fillStyle = "hsla(" + d.hue + ",100%,68%," + alpha * 0.12 + ")";
      ctx.beginPath();
      ctx.arc(d.x, d.y, radius * 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "hsla(" + (d.hue + 12) + ",100%,84%," + alpha + ")";
      ctx.beginPath();
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function cursorAnimationLoop() {
    if (!_cursorEnabled || isStandaloneWindow()) {
      _cursorAnimation = null;
      return;
    }
    const canvas = ensureCursorCanvas();
    if (!canvas) {
      _cursorAnimation = null;
      return;
    }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    _cursorFrame++;
    const strength = _cursorIntensity / 100;
    if (_cursorEffectType === "comet") drawCursorComet(ctx, strength);
    else drawCursorParticles(ctx, strength, canvas);
    ctx.restore();
    const active = _cursorEffectType === "comet" ? _cursorHistory.length > 0 : _cursorParticles.length > 0;
    _cursorAnimation = active ? requestAnimationFrame(cursorAnimationLoop) : null;
  }
  function startCursorEffects() {
    if (isStandaloneWindow()) return;
    _cursorEnabled = true;
    setLocal("mouse_enabled", true);
    if (!_cursorMoveHandler) {
      _cursorMoveHandler = handleCursorMove;
      window.addEventListener("pointermove", _cursorMoveHandler, { passive: true });
    }
    if (!_cursorLeaveHandler) {
      _cursorLeaveHandler = resetCursorPointer;
      document.addEventListener("pointerleave", _cursorLeaveHandler, { passive: true });
    }
    ensureCursorCanvas();
  }
  function stopCursorEffects(preservePreference) {
    _cursorEnabled = false;
    if (!preservePreference) setLocal("mouse_enabled", false);
    if (_cursorMoveHandler) {
      window.removeEventListener("pointermove", _cursorMoveHandler);
      _cursorMoveHandler = null;
    }
    if (_cursorLeaveHandler) {
      document.removeEventListener("pointerleave", _cursorLeaveHandler);
      _cursorLeaveHandler = null;
    }
    if (_cursorAnimation !== null) {
      cancelAnimationFrame(_cursorAnimation);
      _cursorAnimation = null;
    }
    _cursorParticles.length = 0;
    _cursorHistory.length = 0;
    resetCursorPointer();
    if (_cursorCanvas) {
      _cursorCanvas.remove();
      _cursorCanvas = null;
    }
  }
  function setCursorIntensity(value) {
    _cursorIntensity = Math.max(10, Math.min(100, Number(value) || 50));
    setLocal("mouse_intensity", _cursorIntensity);
  }
  function setCursorEffectType(effectType) {
    _cursorEffectType = getMouseEffectOption(effectType).id;
    setLocal("mouse_effect_type", _cursorEffectType);
    _cursorParticles.length = 0;
    _cursorHistory.length = 0;
    resetCursorPointer();
  }
  function restoreCursorEffects() {
    _cursorIntensity = Math.max(10, Math.min(100, Number(getLocal("mouse_intensity", 50)) || 50));
    _cursorEffectType = getMouseEffectOption(getLocal("mouse_effect_type", "cursor_stardust")).id;
    if (getLocal("mouse_enabled", false)) startCursorEffects();
  }
  function ensureMouseUiStyles() {
    const existingStyle = document.getElementById("lte-mouse-ui-style");
    const css = `
      @keyframes lte-mouse-line-flow {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      @keyframes lte-mouse-options-in {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .lte-mouse-accent-line {
        height: 2px;
        background-size: 200% 100%;
        animation: lte-mouse-line-flow 5.5s linear infinite;
        transition: opacity 180ms ease, filter 180ms ease;
      }
      .lte-mouse-accent-line.lte-mouse-paused {
        animation-play-state: paused;
        opacity: 0.38;
        filter: saturate(0.55);
      }
      .lte-mouse-selector {
        transition: transform 100ms ease, background-color 160ms ease, border-color 180ms ease, box-shadow 180ms ease;
      }
      .lte-mouse-selector:hover {
        background: rgba(255,255,255,0.075) !important;
        box-shadow: 0 0 16px rgba(92,180,255,0.12);
      }
      .lte-mouse-selector:active {
        transform: scale(0.992);
      }
      .lte-mouse-chevron {
        transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .lte-mouse-chevron.is-open {
        transform: rotate(180deg);
      }
      .lte-mouse-options {
        animation: lte-mouse-options-in 210ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .lte-mouse-option {
        transition: background-color 150ms ease, border-color 170ms ease, transform 100ms ease;
      }
      .lte-mouse-option:hover {
        background: rgba(255,255,255,0.065) !important;
      }
      .lte-mouse-option:active {
        transform: scale(0.993);
      }
      .lte-mouse-slider {
        appearance: none;
        -webkit-appearance: none;
        height: 5px;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--mouse-accent, #52e2ff), rgba(255,255,255,0.16));
        outline: none;
      }
      .lte-mouse-slider::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background: #ffffff;
        border: 1px solid var(--mouse-accent, #52e2ff);
        box-shadow: 0 0 8px var(--mouse-accent, #52e2ff);
        transition: transform 120ms ease, box-shadow 160ms ease;
      }
      .lte-mouse-slider:hover::-webkit-slider-thumb {
        transform: scale(1.1);
      }
      .lte-mouse-slider:active::-webkit-slider-thumb {
        transform: scale(1.2);
      }
      .lte-mouse-slider::-moz-range-thumb {
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background: #ffffff;
        border: 1px solid var(--mouse-accent, #52e2ff);
        box-shadow: 0 0 8px var(--mouse-accent, #52e2ff);
      }
      @keyframes lte-card-line-fade-out {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes lte-card-line-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .lte-card-accent-shell {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        overflow: hidden;
        pointer-events: none;
        transition: opacity 180ms ease, filter 180ms ease;
      }
      .lte-card-accent-shell.is-paused {
        opacity: 0.38;
        filter: saturate(0.55);
      }
      .lte-card-line-layer {
        position: absolute;
        inset: 0;
      }
      .lte-card-line-fill {
        position: absolute;
        inset: 0;
        background-size: 200% 100%;
        animation: lte-mouse-line-flow 5.5s linear infinite;
      }
      .lte-card-line-layer.is-current {
        z-index: 1;
        animation: lte-card-line-fade-in 240ms ease both;
      }
      .lte-card-line-layer.is-previous {
        z-index: 0;
        animation: lte-card-line-fade-out 240ms ease forwards;
      }
      .lte-card-accent-shell.is-paused .lte-card-line-fill {
        animation-play-state: paused;
      }
      .lte-card-selector {
        transition: transform 100ms ease, background-color 160ms ease, border-color 180ms ease, box-shadow 180ms ease;
      }
      .lte-card-selector:hover {
        background: rgba(255,255,255,0.075) !important;
        box-shadow: 0 0 16px var(--card-glow, rgba(92,180,255,0.12));
      }
      .lte-card-selector:active {
        transform: scale(0.992);
      }
      .lte-card-chevron {
        transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .lte-card-chevron.is-open {
        transform: rotate(180deg);
      }
      .lte-card-options {
        max-height: 224px;
        overflow-y: auto;
        padding-right: 3px;
        animation: lte-mouse-options-in 210ms cubic-bezier(0.2, 0.8, 0.2, 1);
        scrollbar-width: thin;
        scrollbar-color: var(--card-accent, #52e2ff) rgba(255,255,255,0.06);
      }
      .lte-card-options::-webkit-scrollbar {
        width: 6px;
      }
      .lte-card-options::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.035);
        border-radius: 999px;
      }
      .lte-card-options::-webkit-scrollbar-thumb {
        background: var(--card-accent, #52e2ff);
        border-radius: 999px;
      }
      .lte-card-option {
        transition: background-color 150ms ease, border-color 170ms ease, transform 100ms ease;
      }
      .lte-card-option:hover {
        background: rgba(255,255,255,0.065) !important;
      }
      .lte-card-option:active {
        transform: scale(0.993);
      }
      .lte-card-slider {
        appearance: none;
        -webkit-appearance: none;
        height: 5px;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--card-accent, #52e2ff), rgba(255,255,255,0.16));
        outline: none;
      }
      .lte-card-slider::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background: #ffffff;
        border: 1px solid var(--card-accent, #52e2ff);
        box-shadow: 0 0 8px var(--card-accent, #52e2ff);
        transition: transform 120ms ease, box-shadow 160ms ease;
      }
      .lte-card-slider:hover::-webkit-slider-thumb {
        transform: scale(1.1);
      }
      .lte-card-slider:active::-webkit-slider-thumb {
        transform: scale(1.2);
      }
      .lte-card-slider::-moz-range-thumb {
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background: #ffffff;
        border: 1px solid var(--card-accent, #52e2ff);
        box-shadow: 0 0 8px var(--card-accent, #52e2ff);
      }
      @media (prefers-reduced-motion: reduce) {
        .lte-mouse-accent-line,
        .lte-mouse-selector,
        .lte-mouse-chevron,
        .lte-mouse-option,
        .lte-mouse-slider::-webkit-slider-thumb,
        .lte-card-line-layer,
        .lte-card-line-fill,
        .lte-card-selector,
        .lte-card-chevron,
        .lte-card-option,
        .lte-card-slider::-webkit-slider-thumb {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    if (existingStyle) {
      if (existingStyle.textContent !== css) existingStyle.textContent = css;
      return;
    }
    const style = document.createElement("style");
    style.id = "lte-mouse-ui-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // src/engine/weather.ts
  var CN = {
    "Beijing": { lat: 39.9, lon: 116.41 },
    "Shanghai": { lat: 31.23, lon: 121.47 },
    "Guangzhou": { lat: 23.13, lon: 113.26 },
    "Shenzhen": { lat: 22.54, lon: 114.06 },
    "Tianjin": { lat: 39.34, lon: 117.36 },
    "Chongqing": { lat: 29.43, lon: 106.5 },
    "Hangzhou": { lat: 30.27, lon: 120.15 },
    "Nanjing": { lat: 32.06, lon: 118.8 },
    "Wuhan": { lat: 30.59, lon: 114.31 },
    "Chengdu": { lat: 30.57, lon: 104.07 },
    "Xi'an": { lat: 34.34, lon: 108.94 },
    "Suzhou": { lat: 31.3, lon: 120.58 },
    "Changsha": { lat: 28.23, lon: 112.94 },
    "Zhengzhou": { lat: 34.75, lon: 113.63 },
    "Dongguan": { lat: 23.02, lon: 113.75 },
    "Qingdao": { lat: 36.07, lon: 120.33 },
    "Shenyang": { lat: 41.81, lon: 123.43 },
    "Ningbo": { lat: 29.87, lon: 121.54 },
    "Kunming": { lat: 25.04, lon: 102.68 },
    "Dalian": { lat: 38.91, lon: 121.62 },
    "Xiamen": { lat: 24.48, lon: 118.09 },
    "Hefei": { lat: 31.82, lon: 117.23 },
    "Foshan": { lat: 23.02, lon: 113.12 },
    "Fuzhou": { lat: 26.07, lon: 119.3 },
    "Harbin": { lat: 45.8, lon: 126.54 },
    "Jinan": { lat: 36.65, lon: 117 },
    "Wenzhou": { lat: 28, lon: 120.7 },
    "Changchun": { lat: 43.88, lon: 125.32 },
    "Shijiazhuang": { lat: 38.04, lon: 114.51 },
    "Changzhou": { lat: 31.81, lon: 119.97 },
    "Quanzhou": { lat: 24.91, lon: 118.59 },
    "Nanning": { lat: 22.82, lon: 108.37 },
    "Guiyang": { lat: 26.65, lon: 106.63 },
    "Nanchang": { lat: 28.68, lon: 115.86 },
    "Taiyuan": { lat: 37.87, lon: 112.55 },
    "Yantai": { lat: 37.46, lon: 121.45 },
    "Jiaxing": { lat: 30.77, lon: 120.76 },
    "Nantong": { lat: 31.98, lon: 120.89 },
    "Jinhua": { lat: 29.08, lon: 119.65 },
    "Zhuhai": { lat: 22.27, lon: 113.57 },
    "Huizhou": { lat: 23.1, lon: 114.42 },
    "Xuzhou": { lat: 34.27, lon: 117.17 },
    "Haikou": { lat: 20.04, lon: 110.33 },
    "Urumqi": { lat: 43.83, lon: 87.62 },
    "Shaoxing": { lat: 30, lon: 120.58 },
    "Zhongshan": { lat: 22.52, lon: 113.38 },
    "Taizhou": { lat: 28.66, lon: 121.42 },
    "Lanzhou": { lat: 36.06, lon: 103.82 },
    "Weifang": { lat: 36.71, lon: 119.16 },
    "Yangzhou": { lat: 32.39, lon: 119.41 },
    "Sanya": { lat: 18.25, lon: 109.51 },
    "Luoyang": { lat: 34.62, lon: 112.45 },
    "Hohhot": { lat: 40.84, lon: 111.75 },
    "Tangshan": { lat: 39.63, lon: 118.18 },
    "Zhenjiang": { lat: 32.19, lon: 119.43 },
    "Wuxi": { lat: 31.49, lon: 120.31 },
    "Liuzhou": { lat: 24.33, lon: 109.4 },
    "Handan": { lat: 36.6, lon: 114.47 },
    "Qufu": { lat: 35.58, lon: 116.99 },
    "Huangshan": { lat: 29.72, lon: 118.34 },
    "Lijiang": { lat: 26.86, lon: 100.23 },
    "Lhasa": { lat: 29.65, lon: 91.17 },
    "Xining": { lat: 36.62, lon: 101.78 },
    "Yinchuan": { lat: 38.47, lon: 106.28 },
    "Guilin": { lat: 25.27, lon: 110.29 },
    "Zhangjiajie": { lat: 29.12, lon: 110.48 },
    "Chengde": { lat: 40.97, lon: 117.94 },
    "Zhoushan": { lat: 30, lon: 122.2 },
    "Wuhu": { lat: 31.37, lon: 118.38 },
    "Baoding": { lat: 38.87, lon: 115.47 },
    "Xiangyang": { lat: 32.08, lon: 112.17 },
    "Hong Kong": { lat: 22.32, lon: 114.17 },
    "Macau": { lat: 22.2, lon: 113.55 },
    "Taipei": { lat: 25.03, lon: 121.57 },
    "Kaohsiung": { lat: 22.63, lon: 120.3 },
    "Taichung": { lat: 24.15, lon: 120.67 },
    "Tainan": { lat: 23, lon: 120.2 },
    "Tokyo": { lat: 35.68, lon: 139.69 },
    "Osaka": { lat: 34.69, lon: 135.5 },
    "Kyoto": { lat: 35.01, lon: 135.77 },
    "Yokohama": { lat: 35.45, lon: 139.64 },
    "Nagoya": { lat: 35.18, lon: 136.91 },
    "Sapporo": { lat: 43.06, lon: 141.35 },
    "Fukuoka": { lat: 33.59, lon: 130.4 },
    "Kobe": { lat: 34.69, lon: 135.2 },
    "Hiroshima": { lat: 34.4, lon: 132.46 },
    "Sendai": { lat: 38.27, lon: 140.87 },
    "Naha": { lat: 26.21, lon: 127.68 },
    "Seoul": { lat: 37.57, lon: 126.98 },
    "Busan": { lat: 35.18, lon: 129.08 },
    "Incheon": { lat: 37.46, lon: 126.71 },
    "Daegu": { lat: 35.87, lon: 128.6 },
    "Daejeon": { lat: 36.35, lon: 127.38 },
    "Gwangju": { lat: 35.17, lon: 126.91 },
    "Jeju": { lat: 33.5, lon: 126.53 },
    "Singapore": { lat: 1.35, lon: 103.82 },
    "Bangkok": { lat: 13.76, lon: 100.5 },
    "Kuala Lumpur": { lat: 3.14, lon: 101.69 },
    "Jakarta": { lat: -6.21, lon: 106.85 },
    "Manila": { lat: 14.6, lon: 120.98 },
    "Ho Chi Minh City": { lat: 10.82, lon: 106.63 },
    "Hanoi": { lat: 21.03, lon: 105.83 },
    "Phnom Penh": { lat: 11.57, lon: 104.88 },
    "Yangon": { lat: 16.84, lon: 96.17 },
    "Chiang Mai": { lat: 18.79, lon: 98.98 },
    "Da Nang": { lat: 16.05, lon: 108.2 },
    "Vientiane": { lat: 17.97, lon: 102.6 },
    "Bandung": { lat: -6.92, lon: 107.6 },
    "Surabaya": { lat: -7.25, lon: 112.75 },
    "Cebu": { lat: 10.32, lon: 123.89 },
    "Mumbai": { lat: 19.08, lon: 72.88 },
    "Delhi": { lat: 28.67, lon: 77.22 },
    "Bangalore": { lat: 12.97, lon: 77.59 },
    "Chennai": { lat: 13.08, lon: 80.27 },
    "Kolkata": { lat: 22.57, lon: 88.36 },
    "Hyderabad": { lat: 17.39, lon: 78.48 },
    "Pune": { lat: 18.52, lon: 73.86 },
    "Ahmedabad": { lat: 23.03, lon: 72.58 },
    "Jaipur": { lat: 26.91, lon: 75.79 },
    "Lucknow": { lat: 26.85, lon: 80.95 },
    "Dhaka": { lat: 23.81, lon: 90.41 },
    "Karachi": { lat: 24.86, lon: 67.01 },
    "Lahore": { lat: 31.55, lon: 74.36 },
    "Colombo": { lat: 6.93, lon: 79.84 },
    "Kathmandu": { lat: 27.72, lon: 85.32 },
    "Dubai": { lat: 25.2, lon: 55.27 },
    "Abu Dhabi": { lat: 24.45, lon: 54.38 },
    "Doha": { lat: 25.29, lon: 51.53 },
    "Kuwait City": { lat: 29.37, lon: 47.99 },
    "Riyadh": { lat: 24.71, lon: 46.68 },
    "Jeddah": { lat: 21.49, lon: 39.18 },
    "Muscat": { lat: 23.59, lon: 58.41 },
    "Tehran": { lat: 35.69, lon: 51.43 },
    "Baghdad": { lat: 33.31, lon: 44.36 },
    "Beirut": { lat: 33.89, lon: 35.5 },
    "Tel Aviv": { lat: 32.09, lon: 34.78 },
    "Amman": { lat: 31.95, lon: 35.93 },
    "Ankara": { lat: 39.93, lon: 32.86 },
    "Istanbul": { lat: 41.01, lon: 28.97 },
    "London": { lat: 51.51, lon: -0.13 },
    "Paris": { lat: 48.86, lon: 2.35 },
    "Berlin": { lat: 52.52, lon: 13.41 },
    "Madrid": { lat: 40.42, lon: -3.7 },
    "Rome": { lat: 41.9, lon: 12.5 },
    "Athens": { lat: 37.98, lon: 23.73 },
    "Vienna": { lat: 48.21, lon: 16.37 },
    "Prague": { lat: 50.08, lon: 14.42 },
    "Warsaw": { lat: 52.23, lon: 21.01 },
    "Budapest": { lat: 47.5, lon: 19.04 },
    "Amsterdam": { lat: 52.37, lon: 4.9 },
    "Brussels": { lat: 50.85, lon: 4.35 },
    "Stockholm": { lat: 59.33, lon: 18.07 },
    "Oslo": { lat: 59.91, lon: 10.75 },
    "Copenhagen": { lat: 55.68, lon: 12.57 },
    "Helsinki": { lat: 60.17, lon: 24.94 },
    "Lisbon": { lat: 38.72, lon: -9.14 },
    "Dublin": { lat: 53.35, lon: -6.26 },
    "Zurich": { lat: 47.38, lon: 8.54 },
    "Milan": { lat: 45.46, lon: 9.19 },
    "Munich": { lat: 48.14, lon: 11.58 },
    "Hamburg": { lat: 53.55, lon: 9.99 },
    "Frankfurt": { lat: 50.11, lon: 8.68 },
    "Barcelona": { lat: 41.39, lon: 2.17 },
    "Valencia": { lat: 39.47, lon: -0.38 },
    "Naples": { lat: 40.85, lon: 14.27 },
    "Venice": { lat: 45.44, lon: 12.32 },
    "Florence": { lat: 43.77, lon: 11.26 },
    "Moscow": { lat: 55.76, lon: 37.62 },
    "Saint Petersburg": { lat: 59.93, lon: 30.34 },
    "Kiev": { lat: 50.45, lon: 30.52 },
    "Minsk": { lat: 53.9, lon: 27.56 },
    "Bucharest": { lat: 44.43, lon: 26.1 },
    "Sofia": { lat: 42.7, lon: 23.32 },
    "Belgrade": { lat: 44.79, lon: 20.45 },
    "Zagreb": { lat: 45.82, lon: 15.98 },
    "New York": { lat: 40.71, lon: -74.01 },
    "Los Angeles": { lat: 34.05, lon: -118.24 },
    "Chicago": { lat: 41.88, lon: -87.63 },
    "San Francisco": { lat: 37.77, lon: -122.42 },
    "Toronto": { lat: 43.65, lon: -79.38 },
    "Vancouver": { lat: 49.28, lon: -123.12 },
    "Montreal": { lat: 45.5, lon: -73.57 },
    "Boston": { lat: 42.36, lon: -71.06 },
    "Seattle": { lat: 47.61, lon: -122.33 },
    "Miami": { lat: 25.76, lon: -80.19 },
    "Houston": { lat: 29.76, lon: -95.37 },
    "Dallas": { lat: 32.78, lon: -96.8 },
    "Washington DC": { lat: 38.91, lon: -77.04 },
    "Denver": { lat: 39.74, lon: -104.99 },
    "Las Vegas": { lat: 36.17, lon: -115.14 },
    "Portland": { lat: 45.52, lon: -122.68 },
    "Atlanta": { lat: 33.75, lon: -84.39 },
    "Philadelphia": { lat: 39.95, lon: -75.17 },
    "Phoenix": { lat: 33.45, lon: -112.07 },
    "San Diego": { lat: 32.72, lon: -117.16 },
    "Mexico City": { lat: 19.43, lon: -99.13 },
    "Cancun": { lat: 21.16, lon: -86.85 },
    "Sao Paulo": { lat: -23.55, lon: -46.63 },
    "Rio de Janeiro": { lat: -22.91, lon: -43.17 },
    "Buenos Aires": { lat: -34.61, lon: -58.38 },
    "Santiago": { lat: -33.45, lon: -70.66 },
    "Lima": { lat: -12.05, lon: -77.04 },
    "Bogota": { lat: 4.71, lon: -74.07 },
    "Caracas": { lat: 10.48, lon: -66.9 },
    "Quito": { lat: -0.18, lon: -78.47 },
    "Montevideo": { lat: -34.9, lon: -56.16 },
    "Brasilia": { lat: -15.79, lon: -47.88 },
    "Manaus": { lat: -3.12, lon: -60.01 },
    "Sydney": { lat: -33.87, lon: 151.21 },
    "Melbourne": { lat: -37.81, lon: 144.96 },
    "Brisbane": { lat: -27.47, lon: 153.03 },
    "Perth": { lat: -31.95, lon: 115.86 },
    "Adelaide": { lat: -34.93, lon: 138.6 },
    "Auckland": { lat: -36.85, lon: 174.76 },
    "Wellington": { lat: -41.29, lon: 174.78 },
    "Christchurch": { lat: -43.53, lon: 172.63 },
    "Cairo": { lat: 30.04, lon: 31.24 },
    "Cape Town": { lat: -33.92, lon: 18.42 },
    "Johannesburg": { lat: -26.2, lon: 28.04 },
    "Nairobi": { lat: -1.29, lon: 36.82 },
    "Lagos": { lat: 6.45, lon: 3.39 },
    "Casablanca": { lat: 33.57, lon: -7.58 },
    "Marrakech": { lat: 31.63, lon: -8 },
    "Addis Ababa": { lat: 9.03, lon: 38.74 },
    "Dar es Salaam": { lat: -6.79, lon: 39.21 },
    "Accra": { lat: 5.6, lon: -0.19 },
    "Dakar": { lat: 14.72, lon: -17.47 },
    "Tunis": { lat: 36.81, lon: 10.18 },
    "Algiers": { lat: 36.75, lon: 3.04 },
    "Khartoum": { lat: 15.51, lon: 32.56 },
    "Luanda": { lat: -8.84, lon: 13.23 }
  };
  function fetchCityGeo(cityName) {
    if (CN[cityName]) return Promise.resolve(CN[cityName]);
    const cached = getLocal("geo_" + cityName, null);
    if (cached) return Promise.resolve(cached);
    return fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(cityName) + "&count=1&language=zh&format=json",
      { signal: AbortSignal.timeout(4e3) }
    ).then(function(r) {
      return r.json();
    }).then(function(d) {
      if (d && d.results && d.results[0]) {
        const r = d.results[0];
        const o = { lat: r.latitude, lon: r.longitude };
        setLocal("geo_" + cityName, o);
        return o;
      }
      return null;
    }).catch(function() {
      return null;
    });
  }
  function fetchWeather(lat, lon) {
    const key = lat.toFixed(1) + "_" + lon.toFixed(1);
    const cached = getLocal("wea_" + key, null);
    if (cached && Date.now() - cached.t < 6e5) return Promise.resolve(cached);
    return fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&timezone=auto",
      { signal: AbortSignal.timeout(4e3) }
    ).then(function(r) {
      return r.json();
    }).then(function(d) {
      if (d && d.current) {
        const o = {
          temp: d.current.temperature_2m,
          humi: d.current.relative_humidity_2m,
          code: d.current.weather_code,
          wind: d.current.wind_speed_10m,
          feels: d.current.apparent_temperature,
          t: Date.now()
        };
        setLocal("wea_" + key, o);
        return o;
      }
      return null;
    }).catch(function() {
      return null;
    });
  }
  function getCityWeather(name, callback) {
    fetchCityGeo(name).then(function(geo) {
      if (!geo) {
        callback(null);
        return;
      }
      fetchWeather(geo.lat, geo.lon).then(function(w) {
        callback(w);
      });
    });
  }
  function mapWMO(code) {
    if (code === 0) return "clear";
    if (code >= 1 && code <= 3) return "cloudy";
    if (code >= 45 && code <= 48) return "fog";
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return "rain";
    if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return "snow";
    if (code >= 95 && code <= 99) return "thunder";
    return "clear";
  }
  function mapWMOIntensity(code) {
    if (code === 0) return 30;
    if (code >= 1 && code <= 3) return 20 + code * 15;
    if (code >= 45 && code <= 48) return 30 + (code - 44) * 15;
    if (code >= 51 && code <= 55) return 30 + (code - 50) * 15;
    if (code >= 56 && code <= 57) return 40;
    if (code >= 61 && code <= 65) return 40 + (code - 60) * 15;
    if (code >= 66 && code <= 67) return 50;
    if (code >= 71 && code <= 75) return 30 + (code - 70) * 15;
    if (code >= 76 && code <= 77) return 40;
    if (code >= 80 && code <= 82) return 50 + (code - 79) * 15;
    if (code >= 85 && code <= 86) return 50;
    if (code >= 95 && code <= 99) return 60 + (code - 94) * 15;
    return 40;
  }
  var WN_ICON = {
    clear: "☀️",
    cloudy: "☁️",
    rain: "🌧️",
    snow: "❄️",
    thunder: "⛈️",
    fog: "🌫️",
    wind: "💨"
  };

  // src/engine/theme-effects.ts
  var THEME_OPTIONS = [
    { v: "rain", l: "Rain", colors: ["#2f6fd0", "#6aa9ff", "#b9dcff"] },
    { v: "ripples", l: "Rain Ripples", colors: ["#32b7e8", "#7ce7ff", "#d9fbff"] },
    { v: "keyboard_glow", l: "Keyboard Glow", colors: ["#52e2ff", "#8c6cff", "#ff6fc8"] },
    { v: "snow", l: "Snow", colors: ["#effcff", "#a9ddff", "#8495ff"] },
    { v: "sand", l: "Sandstorm", colors: ["#d9a45b", "#e8c37a", "#9b6437"] },
    { v: "stars", l: "Starry Sky", colors: ["#fff2a8", "#b6c9ff", "#7b8cff"] },
    { v: "aurora", l: "Aurora", colors: ["#59ffd0", "#5bbcff", "#b36bff"] },
    { v: "leaves", l: "Falling Leaves", colors: ["#a6d86f", "#e1b96a", "#7f9e4c"] },
    { v: "sakura", l: "Cherry Blossom", colors: ["#ffd6e2", "#ff91b8", "#fff1e8"] },
    { v: "fireflies", l: "Firefly Night", colors: ["#f9e784", "#b6ff8a", "#58d68d"] },
    { v: "dna", l: "DNA Particle Drift", colors: ["#5ef2ff", "#7b6cff", "#e36bff"] },
    { v: "ghost", l: "Ghost Shadows", colors: ["#d8d8ff", "#9b7cff", "#6b5d9c"] },
    { v: "water", l: "Underwater", colors: ["#3fd4e8", "#3c8dff", "#b2f5ff"] },
    { v: "fire", l: "Fire", colors: ["#ffd166", "#ff7a3d", "#ff3d5a"] },
    { v: "sunset", l: "Sunset", colors: ["#ffd27a", "#ff8a5c", "#b056a8"] },
    { v: "mc", l: "Minecraft", colors: ["#7ee787", "#5bc0eb", "#ffd166"] },
    { v: "enchanting", l: "Enchanting", colors: ["#c4a8ff", "#f9d6ff", "#75e3ff"] },
    { v: "code", l: "Code", colors: ["#69ff94", "#20d66b", "#b7ffd0"] },
    { v: "dust", l: "Dust", colors: ["#d7c7a3", "#a99472", "#f2e6c9"] },
    { v: "freeze", l: "Freeze", colors: ["#eafcff", "#b5e8ff", "#7aa8ff"] },
    { v: "sculk", l: "Sculk", colors: ["#56e0c0", "#287d91", "#5b4b8a"] },
    { v: "blank", l: "Blank", colors: ["#8e9aaf", "#5e6a7d", "#c5cedd"] }
  ];
  function getThemeOption(id) {
    return THEME_OPTIONS.find(function(option) {
      return option.v === id;
    }) || THEME_OPTIONS[0];
  }
  var _keyboardGlowPulses = [];
  var _keyboardGlowListener = null;
  function getKeyboardGlowPosition(event, w, h) {
    if (["ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", "AltLeft", "AltRight", "MetaLeft", "MetaRight", "CapsLock", "Tab", "Escape"].includes(event.code)) {
      return null;
    }
    if (event.code === "Space") return { x: w * 0.5, y: h * 0.985, hue: 275 };
    const rows = [
      { keys: "QWERTYUIOP", y: 0.91, hue: 195 },
      { keys: "ASDFGHJKL", y: 0.93, hue: 275 },
      { keys: "ZXCVBNM", y: 0.95, hue: 330 }
    ];
    if (/^Key[A-Z]$/.test(event.code)) {
      const key = event.code.slice(3);
      for (let row = 0; row < rows.length; row++) {
        const index = rows[row].keys.indexOf(key);
        if (index >= 0) {
          const ratio = rows[row].keys.length === 1 ? 0.5 : index / (rows[row].keys.length - 1);
          return {
            x: w * (0.12 + ratio * 0.76),
            y: h * 0.985,
            hue: rows[row].hue + ratio * 35
          };
        }
      }
    }
    if (/^Digit[1-9]$/.test(event.code) || event.code === "Digit0") {
      const digit = event.code === "Digit0" ? 10 : Number(event.code.slice(5));
      return { x: w * (0.08 + (digit - 1) / 9 * 0.84), y: h * 0.985, hue: 45 + digit * 6 };
    }
    return null;
  }
  function ensureKeyboardGlowListener() {
    if (_keyboardGlowListener) return;
    _keyboardGlowListener = function(event) {
      if (!_trun || _tt !== "keyboard_glow") return;
      const position = getKeyboardGlowPosition(event, window.innerWidth, window.innerHeight);
      if (!position) return;
      _keyboardGlowPulses.push({
        x: position.x,
        y: position.y,
        hue: (position.x / Math.max(1, window.innerWidth) * 300 + performance.now() * 0.025) % 360,
        age: 0,
        life: 72,
        size: event.code === "Space" ? 1.35 : 1
      });
      if (_keyboardGlowPulses.length > 18) _keyboardGlowPulses.shift();
    };
    window.addEventListener("keydown", _keyboardGlowListener);
  }
  function removeKeyboardGlowListener() {
    if (!_keyboardGlowListener) return;
    window.removeEventListener("keydown", _keyboardGlowListener);
    _keyboardGlowListener = null;
    _keyboardGlowPulses.length = 0;
  }
  var themeEffects = {};
  themeEffects.rain = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 200; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          len: 10 + Math.random() * 25,
          sp: 4 + Math.random() * 8,
          op: 0.2 + Math.random() * 0.4,
          w: 0.5 + Math.random() * 1.5
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, h * 0.3, 0, h);
      grd.addColorStop(0, "rgba(30,40,80,0.1)");
      grd.addColorStop(1, "rgba(30,40,80,0.3)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100);
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 1, d.y - d.len);
        ctx.strokeStyle = "rgba(120,150,220," + a + ")";
        ctx.lineWidth = d.w;
        ctx.stroke();
        d.y += d.sp;
        d.x += Math.sin(frm * 0.01 + i) * 0.3;
        if (d.y > h + 20) {
          d.y = -20;
          d.x = Math.random() * w;
        }
      }
    }
  };
  themeEffects.ripples = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 120; i++) {
        p.push({
          type: "rain",
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          len: 10 + Math.random() * 18,
          speed: 1.8 + Math.random() * 3.5,
          width: 0.55 + Math.random() * 0.95,
          op: 0.15 + Math.random() * 0.15,
          phase: Math.random() * Math.PI * 2
        });
      }
      for (let i = 0; i < 64; i++) {
        const life = 80 + Math.random() * 110;
        p.push({
          type: "ripple",
          x: Math.random() * c2.width,
          y: c2.height * (0.72 + Math.random() * 0.28),
          age: Math.random() * life,
          life,
          maxRadius: 20 + Math.random() * 42,
          op: 0.34 + Math.random() * 0.34
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const strength = int / 100;
      const ground = ctx.createLinearGradient(0, h * 0.64, 0, h);
      ground.addColorStop(0, "rgba(25,45,70,0)");
      ground.addColorStop(1, "rgba(20,35,58," + 0.055 * strength + ")");
      ctx.fillStyle = ground;
      ctx.fillRect(0, h * 0.64, w, h * 0.36);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        if (d.type === "rain") {
          const a = Math.min(0.65, d.op * (0.55 + strength * 0.9));
          ctx.strokeStyle = "rgba(145,180,225," + a + ")";
          ctx.lineWidth = d.width;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + 1.2, d.y - d.len);
          ctx.stroke();
          d.y += d.speed * (0.7 + strength * 0.45);
          d.x += Math.sin(frm * 0.008 + d.phase) * 0.12;
          if (d.y > h + 20) {
            d.y = -20;
            d.x = Math.random() * w;
          }
          continue;
        }
        d.age += 0.8 + strength * 0.85;
        if (d.age >= d.life) {
          d.age = 0;
          d.life = 80 + Math.random() * 110;
          d.x = Math.random() * w;
          d.y = h * (0.72 + Math.random() * 0.28);
          d.maxRadius = 20 + Math.random() * 42;
        }
        const progress = d.age / d.life;
        const radius = d.maxRadius * (1 - Math.pow(1 - progress, 2));
        const alpha = Math.min(0.82, d.op * Math.pow(1 - progress, 1.7) * (0.55 + strength * 0.55));
        if (alpha < 0.01 || radius < 1) continue;
        ctx.strokeStyle = "rgba(100,175,245," + alpha * 0.22 + ")";
        ctx.lineWidth = 2.2 + (1 - progress) * 2.6;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, radius, radius * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(145,205,255," + alpha + ")";
        ctx.lineWidth = 1.1 + (1 - progress) * 1.8;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, radius, radius * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(125,180,245," + alpha * 0.55 + ")";
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, radius * 0.7, radius * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
        if (progress < 0.18) {
          ctx.fillStyle = "rgba(210,235,255," + alpha * 0.8 + ")";
          ctx.beginPath();
          ctx.arc(d.x, d.y - 1, 1 + (1 - progress) * 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  };
  themeEffects.keyboard_glow = {
    init: function(c2) {
      _keyboardGlowPulses.length = 0;
      ensureKeyboardGlowListener();
      const p = [];
      for (let i = 0; i < 90; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: c2.height * (0.82 + Math.random() * 0.18),
          vx: (Math.random() - 0.5) * 0.12,
          vy: -(0.08 + Math.random() * 0.2),
          size: 0.7 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random() * 360
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const strength = int / 100;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      function drawRadialGlow(cx, cy, rxValue, ryValue, hue, alpha) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(rxValue, ryValue);
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        glow.addColorStop(0, "hsla(" + hue + ",100%,72%," + alpha + ")");
        glow.addColorStop(0.42, "hsla(" + (hue + 12) + ",100%,66%," + alpha * 0.62 + ")");
        glow.addColorStop(1, "hsla(" + (hue + 24) + ",100%,60%,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      for (let i = 0; i < 9; i++) {
        const hue = (i * 38 + frm * 0.7) % 360;
        drawRadialGlow(
          w * ((i + 0.5) / 9) + Math.sin(frm * 0.006 + i) * w * 0.018,
          h + 8,
          w * 0.12,
          h * 0.14,
          hue,
          0.14 * strength
        );
      }
      for (let i = 0; i < 5; i++) {
        const hue = (i * 62 + frm * 0.35) % 360;
        drawRadialGlow(w * ((i + 0.5) / 5), -4, w * 0.2, h * 0.1, hue, 0.075 * strength);
      }
      for (let i = 0; i < 4; i++) {
        const hue = (i * 75 + frm * 0.5) % 360;
        const y = h * ((i + 0.5) / 4);
        drawRadialGlow(-5, y, w * 0.1, h * 0.2, hue, 0.085 * strength);
        drawRadialGlow(w + 5, y, w * 0.1, h * 0.2, hue + 140, 0.085 * strength);
      }
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        d.phase += 0.008;
        d.x += d.vx + Math.sin(d.phase + frm * 0.004) * 0.1;
        d.y += d.vy * (0.65 + strength * 0.5);
        if (d.y < h * 0.8) {
          d.y = h * (0.98 + Math.random() * 0.03);
          d.x = Math.random() * w;
        }
        const hue = (d.hue + frm * 0.5) % 360;
        const alpha = (0.12 + 0.22 * (0.5 + 0.5 * Math.sin(d.phase))) * strength;
        ctx.fillStyle = "hsla(" + hue + ",100%,72%," + alpha * 0.12 + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + hue + ",100%,78%," + alpha + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      let edgeFlashAlpha = 0;
      let edgeFlashHue = 0;
      for (let i = _keyboardGlowPulses.length - 1; i >= 0; i--) {
        const pulse = _keyboardGlowPulses[i];
        pulse.age += 1;
        const progress = pulse.age / pulse.life;
        if (progress >= 1) {
          _keyboardGlowPulses.splice(i, 1);
          continue;
        }
        const attack = Math.min(1, progress / 0.05);
        const fade = Math.pow(1 - progress, 2.2);
        const alpha = Math.min(1, 0.96 * attack * fade * strength);
        const edgeEnvelope = attack * Math.pow(1 - progress, 0.72);
        const edgeAlpha = Math.min(1, 0.86 * edgeEnvelope * strength);
        if (edgeAlpha > edgeFlashAlpha) {
          edgeFlashAlpha = edgeAlpha;
          edgeFlashHue = pulse.hue;
        }
        const columnHeight = (64 + progress * 26) * pulse.size;
        drawRadialGlow(pulse.x, pulse.y + 2, 58 * pulse.size, 17 * pulse.size, pulse.hue, alpha * 0.25);
        for (let layer = 0; layer <= 8; layer++) {
          const t = layer / 8;
          const y = pulse.y - t * columnHeight;
          const x = pulse.x + Math.sin(t * Math.PI + frm * 0.03) * 1.6;
          const radiusX = (38 - t * 9) * pulse.size;
          const radiusY = (14 - t * 3) * pulse.size;
          drawRadialGlow(
            x,
            y,
            radiusX,
            radiusY,
            pulse.hue,
            alpha * (0.07 + (1 - t) * 0.1)
          );
        }
        for (let layer = 0; layer <= 6; layer++) {
          const t = layer / 6;
          const y = pulse.y - t * columnHeight * 0.96;
          drawRadialGlow(
            pulse.x,
            y,
            (18 - t * 4) * pulse.size,
            (10 - t * 2.4) * pulse.size,
            pulse.hue + 8,
            alpha * (0.07 + (1 - t) * 0.08)
          );
        }
        for (let layer = 0; layer <= 6; layer++) {
          const t = layer / 6;
          const y = pulse.y - t * columnHeight * 0.92;
          drawRadialGlow(
            pulse.x,
            y,
            (7 - t * 1.8) * pulse.size,
            (9 - t * 2.2) * pulse.size,
            pulse.hue + 14,
            alpha * (0.12 + (1 - t) * 0.14)
          );
        }
        for (let mote = 0; mote < 2; mote++) {
          const moteY = pulse.y - columnHeight * (0.45 + mote * 0.28 + progress * 0.2);
          const moteX = pulse.x + Math.sin(mote * 2.7 + progress * 4) * 3;
          ctx.fillStyle = "hsla(" + (pulse.hue + mote * 18) + ",100%,88%," + alpha * (0.3 - mote * 0.08) + ")";
          ctx.beginPath();
          ctx.arc(moteX, moteY, Math.max(0.45, (0.9 - mote * 0.2) * fade), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (edgeFlashAlpha > 0.015) {
        const flash = edgeFlashAlpha;
        const topHeight = Math.max(34, h * 0.075);
        const sideWidth = Math.max(38, w * 0.055);
        const topGradient = ctx.createLinearGradient(0, 0, 0, topHeight);
        topGradient.addColorStop(0, "hsla(" + edgeFlashHue + ",100%,74%," + flash * 0.3 + ")");
        topGradient.addColorStop(0.42, "hsla(" + (edgeFlashHue + 12) + ",100%,70%," + flash * 0.11 + ")");
        topGradient.addColorStop(1, "hsla(" + (edgeFlashHue + 22) + ",100%,68%,0)");
        ctx.fillStyle = topGradient;
        ctx.fillRect(0, 0, w, topHeight);
        const leftGradient = ctx.createLinearGradient(0, 0, sideWidth, 0);
        leftGradient.addColorStop(0, "hsla(" + edgeFlashHue + ",100%,74%," + flash * 0.28 + ")");
        leftGradient.addColorStop(0.42, "hsla(" + (edgeFlashHue + 12) + ",100%,70%," + flash * 0.1 + ")");
        leftGradient.addColorStop(1, "hsla(" + (edgeFlashHue + 22) + ",100%,68%,0)");
        ctx.fillStyle = leftGradient;
        ctx.fillRect(0, 0, sideWidth, h);
        const rightGradient = ctx.createLinearGradient(w, 0, w - sideWidth, 0);
        rightGradient.addColorStop(0, "hsla(" + edgeFlashHue + ",100%,74%," + flash * 0.28 + ")");
        rightGradient.addColorStop(0.42, "hsla(" + (edgeFlashHue + 12) + ",100%,70%," + flash * 0.1 + ")");
        rightGradient.addColorStop(1, "hsla(" + (edgeFlashHue + 22) + ",100%,68%,0)");
        ctx.fillStyle = rightGradient;
        ctx.fillRect(w - sideWidth, 0, sideWidth, h);
      }
      ctx.restore();
    }
  };
  themeEffects.snow = {
    init: function(c2) {
      var p = [];
      for (var i = 0; i < 200; i++) {
        p.push({ x: Math.random() * c2.width, y: Math.random() * c2.height, sp: 0.2 + Math.random() * 0.8, op: 0.2 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2, frame: Math.floor(Math.random() * 8), sz: 8 + Math.floor(Math.random() * 16), drift: (Math.random() - 0.5) * 0.8 });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(200,220,240," + 0.05 * int / 100 + ")");
      grd.addColorStop(1, "rgba(200,220,240," + 0.15 * int / 100 + ")");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      var img = window._ltePI && window._ltePI.snow;
      for (var i = 0; i < p.length; i++) {
        var d = p[i], a = d.op * (int / 100);
        if (a < 0.02) continue;
        var sy = d.frame * 32;
        var s = Math.round(d.sz * (1.5 + 1.5 * int / 100));
        if (img && img.complete) {
          ctx.drawImage(img, 0, sy, 64, 32, Math.round(d.x - s / 2), Math.round(d.y - s / 2), s, s / 2);
        }
        d.y += d.sp;
        d.x += Math.sin(frm * 0.01 + d.phase) * d.drift;
        d.phase += 5e-3;
        if (d.y > h + 20) {
          d.y = -20;
          d.x = Math.random() * w;
          d.frame = Math.floor(Math.random() * 8);
        }
      }
    }
  };
  themeEffects.sand = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 300; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 1 + Math.random() * 3,
          sp: 2 + Math.random() * 8,
          op: 0.1 + Math.random() * 0.3
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(150,120,60," + 0.08 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100);
        ctx.fillStyle = "rgba(200,170,100," + a + ")";
        ctx.fillRect(d.x, d.y, d.sz, d.sz);
        d.x += d.sp + Math.sin(frm * 0.01 + i) * 2;
        d.y += (Math.random() - 0.5) * 0.5;
        if (d.x > w + 5) {
          d.x = -5;
          d.y = Math.random() * h;
        }
      }
    }
  };
  themeEffects.stars = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 150; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 0.5 + Math.random() * 2.5,
          op: 0.3 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
          speed: 5e-3 + Math.random() * 0.02
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(10,10,30," + 0.3 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], twinkle = 0.5 + 0.5 * Math.sin(frm * d.speed + d.phase);
        const a = d.op * twinkle * (int / 100);
        ctx.fillStyle = "rgba(255,240,200," + a + ")";
        ctx.shadowColor = "rgba(255,240,200," + a * 0.5 + ")";
        ctx.shadowBlur = d.sz * 4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  };
  






themeEffects.aurora = {
    init:function(c2){var p=[];var W=c2.width,H=c2.height;
for(var ci=0;ci<3;ci++){
p.push({x:ci*W*0.28+W*0.05,y:H*0.02+Math.random()*0.03*H,w:W*0.55+Math.random()*0.15*W,ht:H*0.18+Math.random()*0.07*H,op:0.3+Math.random()*0.12,hu:100+ci*30+Math.random()*20,wa:12+Math.random()*18,wf:0.003+Math.random()*0.003,wph:Math.random()*Math.PI*2,fa:8+Math.random()*14,ff:0.01+Math.random()*0.006,fph:Math.random()*Math.PI*2,ds:0.001+Math.random()*0.002,dph:Math.random()*Math.PI*2});}
p.push({x:W*0.05,y:H*0.03,w:W*0.95,ht:H*0.2,op:0.08,hu:130,wa:30,wf:0.003,wph:0,fa:18,ff:0.008,fph:1,ds:0.0015,dph:0,isBase:true});return p;},
draw:function(ctx,ww,hh,p,int,frm){
ctx.clearRect(0,0,ww,hh);
var br=0.7+0.3*Math.sin(frm*0.0012);
for(var ci=0;ci<p.length;ci++){var b=p[ci];var a=b.op*0.5;if(a<0.01)continue;
b.dph+=b.ds;var dx=Math.sin(b.dph)*ww*0.08;var bx=b.x+dx;
var pts=40,tP=[],bP=[];
for(var i=0;i<=pts;i++){var t=i/pts,x=bx+t*b.w;
var wv=Math.sin(frm*b.wf+t*Math.PI*2+b.wph)*b.wa;
var bwv=Math.sin(frm*b.wf*0.5+t*Math.PI*2+b.wph)*b.wa*0.5;
var fd=Math.sin(frm*b.ff+t*Math.PI*4+b.fph)*b.fa;
tP.push({x:x,y:b.y+wv*0.25+fd*0.12});
bP.push({x:x,y:b.y+b.ht+bwv+fd*0.2});}
ctx.beginPath();ctx.moveTo(tP[0].x,tP[0].y);
for(var i=1;i<tP.length;i++)ctx.lineTo(tP[i].x,tP[i].y);
for(var i=bP.length-1;i>=0;i--)ctx.lineTo(bP[i].x,bP[i].y);
ctx.closePath();
var hu=b.hu+Math.sin(frm*0.002)*15;
var grd=ctx.createLinearGradient(0,b.y,0,b.y+b.ht);
if(b.isBase){
grd.addColorStop(0,"hsla("+hu+",70%,60%,"+a*0.08+")");
grd.addColorStop(0.5,"hsla("+(hu+10)+",75%,65%,"+a*0.2+")");
grd.addColorStop(1,"hsla("+(hu+20)+",75%,65%,"+a*0.4*br+")");}
else{
var btA=Math.min(a*br*1.2,0.7);
grd.addColorStop(0,"hsla("+hu+",75%,60%,"+a*0.08+")");
grd.addColorStop(0.15,"hsla("+(hu+8)+",80%,65%,"+a*0.2+")");
grd.addColorStop(0.35,"hsla("+(hu+15)+",85%,70%,"+a*0.35+")");
grd.addColorStop(0.55,"hsla("+(hu+20)+",90%,78%,"+a*0.5+")");
grd.addColorStop(0.72,"hsla("+(hu+25)+",90%,85%,"+btA*0.7+")");
grd.addColorStop(0.86,"hsla("+(hu+28)+",88%,92%,"+btA*0.8+")");
grd.addColorStop(1,"hsla("+(hu+30)+",85%,96%,"+btA+")");}
ctx.fillStyle=grd;ctx.fill();}
// Bottom glow
ctx.globalCompositeOperation="lighter";
for(var ci=0;ci<p.length-1;ci++){var b=p[ci];if(b.isBase)continue;
var a=b.op*0.4;b.dph+=b.ds;var dx=Math.sin(b.dph)*ww*0.08;var bx=b.x+dx;
var pts=40,bP=[];
for(var i=0;i<=pts;i++){var t=i/pts,x=bx+t*b.w;
var bwv=Math.sin(frm*b.wf*0.5+t*Math.PI*2+b.wph)*b.wa*0.5;
var fd=Math.sin(frm*b.ff+t*Math.PI*4+b.fph)*b.fa;
bP.push({x:x,y:b.y+b.ht+bwv+fd*0.2});}
var ga=br*0.12;if(ga<0.02)continue;
var gh=12+8*br;
var hu=b.hu+Math.sin(frm*0.002)*15;
ctx.beginPath();ctx.moveTo(bP[0].x,bP[0].y);
for(var i=1;i<bP.length;i++)ctx.lineTo(bP[i].x,bP[i].y);
for(var i=bP.length-1;i>=0;i--)ctx.lineTo(bP[i].x,bP[i].y+gh);
ctx.closePath();
var gg=ctx.createLinearGradient(0,bP[Math.floor(bP.length/2)].y,0,bP[Math.floor(bP.length/2)].y+gh);
gg.addColorStop(0,"hsla("+(hu+25)+",85%,90%,"+ga*0.8+")");
gg.addColorStop(0.5,"hsla("+(hu+28)+",85%,92%,"+ga*0.4+")");
gg.addColorStop(1,"hsla("+(hu+30)+",80%,94%,0)");
ctx.fillStyle=gg;ctx.fill();}
ctx.globalCompositeOperation="source-over";}
  };







  themeEffects.leaves = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 80; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 4 + Math.random() * 8,
          sp: 0.3 + Math.random() * 1.2,
          op: 0.4 + Math.random() * 0.5,
          rot: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
          hue: 30 + Math.random() * 60
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(60,30,10,0.05)");
      grd.addColorStop(1, "rgba(60,30,10,0.15)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], sz = d.sz * (int / 100), a = d.op * (int / 100);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot + frm * 0.01 * d.sp);
        ctx.fillStyle = "hsla(" + d.hue + ",80%,50%," + a + ")";
        ctx.beginPath();
        ctx.ellipse(0, 0, sz, sz * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        d.y += d.sp;
        d.x += Math.sin(frm * 0.02 + d.phase) * 1.5;
        d.rot += 0.02;
        if (d.y > h + 10) {
          d.y = -10;
          d.x = Math.random() * w;
        }
      }
    }
  };
  themeEffects.sakura = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 160; i++) {
        const depth = Math.random();
        const fromLeft = Math.random() > 0.72;
        p.push({
          x: fromLeft ? -12 - Math.random() * c2.width * 0.12 : Math.random() * c2.width,
          y: fromLeft ? Math.random() * c2.height : -12 - Math.random() * c2.height * 0.15,
          depth,
          sz: 3 + depth * 7 + Math.random() * 3,
          vx: 0.22 + depth * 0.65 + Math.random() * 0.22,
          vy: 0.38 + depth * 0.85 + Math.random() * 0.25,
          op: 0.28 + depth * 0.52,
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.035,
          flip: Math.random() * Math.PI * 2,
          flipSpeed: 0.012 + Math.random() * 0.025,
          sway: 0.25 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
          hue: 330 + Math.random() * 18,
          sat: 58 + Math.random() * 24,
          light: 72 + Math.random() * 18
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, 0, w, h);
      grd.addColorStop(0, "rgba(255,185,210," + 0.025 * int / 100 + ")");
      grd.addColorStop(1, "rgba(90,25,55," + 0.055 * int / 100 + ")");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      const wind = 0.28 + 0.55 * (0.5 + 0.5 * Math.sin(frm * 0.006));
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        const a = Math.min(0.92, d.op * (int / 100));
        const sz = d.sz * (0.8 + 0.4 * int / 100);
        if (a > 0.02) {
          ctx.save();
          ctx.translate(d.x, d.y);
          ctx.rotate(d.rot);
          ctx.scale(0.18 + Math.abs(Math.cos(d.flip)) * 0.82, 1);
          ctx.fillStyle = "hsla(" + d.hue + "," + d.sat + "%," + d.light + "%," + a + ")";
          ctx.beginPath();
          ctx.moveTo(0, -sz);
          ctx.bezierCurveTo(sz * 0.95, -sz * 0.38, sz * 0.62, sz * 0.5, 0, sz);
          ctx.bezierCurveTo(-sz * 0.62, sz * 0.5, -sz * 0.95, -sz * 0.38, 0, -sz);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        d.x += d.vx + wind * d.sway;
        d.y += d.vy;
        d.rot += d.spin;
        d.flip += d.flipSpeed;
        if (d.x > w + sz * 2 || d.y > h + sz * 2) {
          if (Math.random() < 0.72) {
            d.x = Math.random() * w;
            d.y = -sz * 2 - Math.random() * h * 0.1;
          } else {
            d.x = -sz * 2 - Math.random() * w * 0.08;
            d.y = Math.random() * h * 0.75;
          }
          d.depth = Math.random();
          d.sz = 3 + d.depth * 7 + Math.random() * 3;
          d.vx = 0.22 + d.depth * 0.65 + Math.random() * 0.22;
          d.vy = 0.38 + d.depth * 0.85 + Math.random() * 0.25;
        }
      }
    }
  };
  themeEffects.fireflies = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 110; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          vx: (Math.random() - 0.5) * 0.38,
          vy: -0.06 - Math.random() * 0.22,
          size: 1.2 + Math.random() * 2.3,
          phase: Math.random() * Math.PI * 2,
          pulse: 0.004 + Math.random() * 0.012,
          hue: 52 + Math.random() * 24,
          op: 0.35 + Math.random() * 0.65
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "rgba(3,13,24," + 0.22 * int / 100 + ")");
      bg.addColorStop(0.55, "rgba(5,24,28," + 0.18 * int / 100 + ")");
      bg.addColorStop(1, "rgba(4,12,16," + 0.28 * int / 100 + ")");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        d.phase += d.pulse;
        const pulse = 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(d.phase));
        const a = d.op * pulse * (int / 100);
        d.x += d.vx + Math.sin(frm * 0.004 + d.phase) * 0.16;
        d.y += d.vy + Math.cos(frm * 0.005 + d.phase) * 0.045;
        if (d.y < -20) {
          d.y = h + 20;
          d.x = Math.random() * w;
        }
        if (d.x < -20) d.x = w + 20;
        if (d.x > w + 20) d.x = -20;
        const glowRadius = d.size * (3.2 + pulse * 1.8);
        ctx.fillStyle = "hsla(" + d.hue + ",100%,72%," + a * 0.09 + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + (d.hue + 8) + ",100%,84%," + a + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };
  themeEffects.dna = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 18; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          length: 130 + Math.random() * 140,
          angle: 0.24 + Math.random() * 0.22,
          vx: 0.12 + Math.random() * 0.2,
          vy: 0.035 + Math.random() * 0.075,
          amp: 8 + Math.random() * 9,
          twist: 1.1 + Math.random() * 0.9,
          phase: Math.random() * Math.PI * 2,
          spin: 0.006 + Math.random() * 0.012,
          op: 0.25 + Math.random() * 0.22,
          size: 1.1 + Math.random() * 1.8
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const strength = int / 100;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        d.x += d.vx * (0.7 + strength * 0.6);
        d.y += d.vy * (0.7 + strength * 0.6);
        d.phase += d.spin * (0.7 + strength * 0.5);
        if (d.x > w + d.length * 0.7) {
          d.x = -d.length * 0.7;
          d.y = Math.random() * h;
        }
        if (d.y > h + d.length * 0.7) {
          d.y = -d.length * 0.7;
          d.x = Math.random() * w;
        }
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.angle);
        for (let step = 0; step <= 20; step++) {
          const t = step / 20;
          const localY = (t - 0.5) * d.length;
          const theta = t * d.twist * Math.PI * 2 + d.phase;
          const depth = 0.5 + 0.5 * Math.cos(theta);
          const x1 = Math.sin(theta) * d.amp;
          const x2 = -x1;
          const alpha = d.op * (0.35 + strength * 0.65) * (0.28 + depth * 0.72);
          if (step % 2 === 0) {
            ctx.strokeStyle = "rgba(150,220,255," + alpha * 0.42 + ")";
            ctx.lineWidth = 0.7 + depth * 0.9;
            ctx.beginPath();
            ctx.moveTo(x1, localY);
            ctx.lineTo(x2, localY);
            ctx.stroke();
          }
          const radius = (0.7 + depth * 1.1) * d.size;
          ctx.fillStyle = "rgba(105,235,255," + alpha * 0.12 + ")";
          ctx.beginPath();
          ctx.arc(x1, localY, radius * 2.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(105,235,255," + alpha + ")";
          ctx.beginPath();
          ctx.arc(x1, localY, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(245,125,255," + alpha * 0.12 + ")";
          ctx.beginPath();
          ctx.arc(x2, localY, radius * 2.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(245,125,255," + alpha + ")";
          ctx.beginPath();
          ctx.arc(x2, localY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();
    }
  };
  themeEffects.ghost = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 7; i++) {
        const size = 34 + Math.random() * 42;
        p.push({
          x: Math.random() * c2.width,
          y: c2.height * (0.2 + Math.random() * 0.8),
          size,
          vx: (Math.random() - 0.5) * 0.22,
          vy: -0.06 - Math.random() * 0.13,
          phase: Math.random() * Math.PI * 2,
          pulse: 0.004 + Math.random() * 0.009,
          op: 0.24 + Math.random() * 0.42,
          hue: 188 + Math.random() * 55
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const strength = int / 100;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        d.phase += d.pulse;
        d.x += d.vx + Math.sin(frm * 0.006 + d.phase) * 0.24;
        d.y += d.vy + Math.cos(frm * 0.004 + d.phase) * 0.035;
        if (d.y < -d.size * 2) {
          d.y = h + d.size * 2;
          d.x = Math.random() * w;
        }
        if (d.x < -d.size * 2) d.x = w + d.size * 2;
        if (d.x > w + d.size * 2) d.x = -d.size * 2;
        const pulse = 0.65 + 0.35 * Math.sin(d.phase);
        const a = d.op * strength * pulse;
        const s = d.size;
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(Math.sin(d.phase * 0.7) * 0.045);
        const body = ctx.createLinearGradient(0, -s, 0, s * 1.35);
        body.addColorStop(0, "hsla(" + d.hue + ",92%,88%," + a * 0.42 + ")");
        body.addColorStop(0.55, "hsla(" + (d.hue + 12) + ",90%,76%," + a * 0.28 + ")");
        body.addColorStop(1, "hsla(" + (d.hue + 24) + ",88%,70%,0)");
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.moveTo(-s * 0.56, -s * 0.05);
        ctx.bezierCurveTo(-s * 0.58, -s * 0.86, s * 0.58, -s * 0.86, s * 0.56, -s * 0.05);
        ctx.bezierCurveTo(s * 0.64, s * 0.35, s * 0.5, s * 0.68, s * 0.62, s * 1.04);
        ctx.bezierCurveTo(s * 0.3, s * 0.82, s * 0.18, s * 1.16, 0, s * 0.94);
        ctx.bezierCurveTo(-s * 0.18, s * 1.16, -s * 0.3, s * 0.82, -s * 0.62, s * 1.04);
        ctx.bezierCurveTo(-s * 0.5, s * 0.68, -s * 0.64, s * 0.35, -s * 0.56, -s * 0.05);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "hsla(" + (d.hue + 25) + ",100%,91%," + a * 0.85 + ")";
        ctx.beginPath();
        ctx.ellipse(-s * 0.19, -s * 0.2, s * 0.075, s * 0.12, -0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(s * 0.19, -s * 0.2, s * 0.075, s * 0.12, 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + (d.hue + 35) + ",100%,97%," + a * 0.5 + ")";
        ctx.beginPath();
        ctx.ellipse(-s * 0.19, -s * 0.2, s * 0.025, s * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(s * 0.19, -s * 0.2, s * 0.025, s * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
  };
  themeEffects.water = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 150; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 2 + Math.random() * 8,
          sp: 0.1 + Math.random() * 0.5,
          op: 0.1 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(10,40,80," + 0.15 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100), sz = d.sz * (int / 100);
        ctx.fillStyle = "rgba(100,180,255," + a * 0.3 + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, sz, 0, Math.PI * 2);
        ctx.fill();
        d.y += d.sp;
        d.x += Math.sin(frm * 0.01 + d.phase) * 0.5;
        if (d.y > h + 10) {
          d.y = -10;
          d.x = Math.random() * w;
        }
      }
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "rgba(200,230,255," + 0.02 * int / 100 + ")";
        ctx.beginPath();
        ctx.moveTo(w * 0.2 + i * w * 0.3 + Math.sin(frm * 1e-3 + i) * 30, 0);
        ctx.lineTo(w * 0.15 + i * w * 0.3 + Math.sin(frm * 1e-3 + i + 1) * 30, h);
        ctx.lineTo(w * 0.25 + i * w * 0.3 + Math.sin(frm * 1e-3 + i + 2) * 30, h);
        ctx.closePath();
        ctx.fill();
      }
    }
  };
  themeEffects.fire = {
    init: function(c2) {
      var p = [];
      for (var i = 0; i < 250; i++) {
        p.push({ x: Math.random() * c2.width, y: c2.height * 0.6 + Math.random() * c2.height * 0.4, sz: 2 + Math.floor(Math.random() * 6), sp: 0.2 + Math.random() * 1, op: 0.1 + Math.random() * 0.4, hue: 10 + Math.floor(Math.random() * 35), sat: 70 + Math.floor(Math.random() * 30), light: 40 + Math.floor(Math.random() * 35), phase: Math.random() * Math.PI * 2, drift: (Math.random() - 0.5) * 2, scale: 0.3 + Math.random() * 0.8, type: Math.random() > 0.4 ? "flame" : "ember" });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var bgGrd = ctx.createRadialGradient(w * 0.5, h * 0.8, 0, w * 0.5, h * 0.8, Math.max(w, h) * 0.7);
      bgGrd.addColorStop(0, "rgba(80,20,0," + 0.25 * int / 100 + ")");
      bgGrd.addColorStop(0.5, "rgba(40,10,0," + 0.15 * int / 100 + ")");
      bgGrd.addColorStop(1, "rgba(10,5,0," + 0.05 * int / 100 + ")");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, w, h);
      var flameImg = window._ltePI && window._ltePI.flame;
      for (var i = 0; i < p.length; i++) {
        var d = p[i], sz = Math.max(d.sz * (int / 100), 1), a = d.op * (int / 100);
        if (a < 0.02) continue;
        if (d.y < h * 0.5) {
          a *= Math.max(0, d.y / (h * 0.5));
        }
        var brightness = 0.85 + 0.15 * Math.sin(frm * 8e-3 + d.phase);
        if (d.type === "flame") {
          if (flameImg && flameImg.complete) {
            var s = Math.round(sz * d.scale * 2.5);
            ctx.shadowColor = "hsla(" + d.hue + ",100%,40%," + a * 0.3 * brightness + ")";
            ctx.shadowBlur = 6;
            ctx.drawImage(flameImg, Math.round(d.x - s / 2), Math.round(d.y - s / 2), s, s);
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = "hsla(" + d.hue + "," + d.sat + "%," + d.light * brightness + "%," + a + ")";
            ctx.fillRect(Math.round(d.x - sz), Math.round(d.y - sz), Math.round(sz * 2), Math.round(sz * 2));
          }
        } else {
          ctx.fillStyle = "hsla(" + d.hue + ",100%," + 50 * brightness + "%," + a + ")";
          ctx.fillRect(Math.round(d.x), Math.round(d.y), Math.round(Math.max(sz, 1)), Math.round(Math.max(sz, 1)));
        }
        d.y -= d.sp * brightness;
        d.x += Math.sin(frm * 0.015 + d.phase) * d.drift;
        if (d.y < -10 || d.y > h) {
          d.y = h - Math.random() * h * 0.1;
          d.x = Math.random() * w;
          d.type = Math.random() > 0.4 ? "flame" : "ember";
        }
      }
    }
  };
  themeEffects.sunset = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 100; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 1 + Math.random() * 3,
          sp: 0.1 + Math.random() * 0.4,
          op: 0.1 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(255,180,80," + 0.15 * int / 100 + ")");
      grd.addColorStop(0.4, "rgba(255,100,50," + 0.15 * int / 100 + ")");
      grd.addColorStop(1, "rgba(80,40,80," + 0.3 * int / 100 + ")");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      const sunY = h * 0.65 + Math.sin(frm * 3e-3) * 10;
      const sun = ctx.createRadialGradient(w * 0.5, sunY, 0, w * 0.5, sunY, 100);
      sun.addColorStop(0, "rgba(255,220,150," + 0.3 * int / 100 + ")");
      sun.addColorStop(0.5, "rgba(255,150,50," + 0.15 * int / 100 + ")");
      sun.addColorStop(1, "rgba(255,100,50,0)");
      ctx.fillStyle = sun;
      ctx.beginPath();
      ctx.arc(w * 0.5, sunY, 100, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100);
        ctx.fillStyle = "rgba(255,200,100," + a * 0.5 + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.sz, 0, Math.PI * 2);
        ctx.fill();
        d.y += d.sp;
        d.x += Math.sin(frm * 5e-3 + d.phase) * 0.3;
        if (d.y > h + 5) {
          d.y = -5;
          d.x = Math.random() * w;
        }
      }
    }
  };
  themeEffects.mc = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 60; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 3 + Math.random() * 10,
          sp: 0.2 + Math.random() * 0.8,
          op: 0.3 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          col: Math.floor(Math.random() * 3)
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(30,30,30," + 0.2 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      const cols = ["#7CB342", "#5D9CEC", "#FFD54F", "#8D6E63", "#E57373", "#BA68C8"];
      for (let i = 0; i < p.length; i++) {
        const d = p[i], sz = d.sz * (int / 100), a = d.op * (int / 100);
        ctx.fillStyle = cols[d.col % cols.length];
        ctx.globalAlpha = a;
        ctx.fillRect(d.x - sz / 2, d.y - sz / 2, sz, sz);
        ctx.globalAlpha = 1;
        d.y += d.sp * Math.sin(frm * 0.02 + d.phase);
        d.x += Math.cos(frm * 0.015 + d.phase) * 0.5;
        if (d.y > h + 10 || d.y < -10) {
          d.y = Math.random() * h;
          d.x = Math.random() * w;
        }
      }
    }
  };
  themeEffects.enchanting = {
    init: function(c2) {
      const p = [];
      const glyphs2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 60; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 16 + Math.random() * 22,
          sp: 0.15 + Math.random() * 0.5,
          op: 0.25 + Math.random() * 0.55,
          rot: Math.random() * Math.PI * 2,
          rotSp: (Math.random() - 0.5) * 0.01,
          phase: Math.random() * Math.PI * 2,
          wx: (Math.random() - 0.5) * 0.5,
          char: glyphs2[Math.floor(Math.random() * glyphs2.length)]
        });
      }
      for (let i = 0; i < 100; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 0.5 + Math.random() * 3,
          sp: 0.05 + Math.random() * 0.3,
          op: 0.15 + Math.random() * 0.65,
          life: Math.random() * 100,
          phase: Math.random() * Math.PI * 2,
          isSparkle: true,
          hue: 260 + Math.random() * 60
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const bgX = w * 0.5 + Math.sin(frm * 1e-3) * w * 0.05;
      const bgY = h * 0.5 + Math.cos(frm * 15e-4) * h * 0.05;
      const bgGrd = ctx.createRadialGradient(bgX, bgY, 0, bgX, bgY, Math.max(w, h) * 0.7);
      bgGrd.addColorStop(0, "rgba(60,12,80," + 0.35 * int / 100 + ")");
      bgGrd.addColorStop(0.4, "rgba(35,8,55," + 0.25 * int / 100 + ")");
      bgGrd.addColorStop(0.7, "rgba(15,3,30," + 0.15 * int / 100 + ")");
      bgGrd.addColorStop(1, "rgba(5,1,10," + 0.05 * int / 100 + ")");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        if (!d.isSparkle) continue;
        d.life += 0.05;
        const twinkle = 0.3 + 0.7 * Math.sin(d.life * 0.012 + d.phase);
        const a = d.op * twinkle * (int / 100);
        if (a < 0.01) continue;
        ctx.fillStyle = "hsla(" + d.hue + ",80%,70%," + a + ")";
        ctx.shadowColor = "hsla(" + d.hue + ",80%,60%," + a * 0.6 + ")";
        ctx.shadowBlur = d.sz * 4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.sz * twinkle, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        d.y += d.sp * Math.sin(d.life * 0.04);
        d.x += Math.cos(d.life * 0.025 + d.phase) * 0.2;
        if (d.y > h + 5 || d.y < -5) {
          d.y = Math.random() * h;
          d.x = Math.random() * w;
        }
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        if (d.isSparkle) continue;
        const sz = d.sz * (int / 100);
        const a = d.op * (int / 100);
        if (a < 0.01) continue;
        const floatY = Math.sin(frm * 0.012 + d.phase) * 10;
        const floatX = Math.sin(frm * 8e-3 + d.phase * 1.3) * 6;
        ctx.save();
        ctx.translate(d.x + floatX, d.y + floatY);
        ctx.rotate(d.rot + Math.sin(frm * 8e-3 + d.phase) * 0.08);
        ctx.font = Math.round(sz) + "px GalacticSGA, serif";
        ctx.shadowColor = "rgba(180,80,255," + a * 0.9 + ")";
        ctx.shadowBlur = 20 + 15 * Math.sin(frm * 3e-3 + d.phase);
        ctx.fillStyle = "rgba(160,80,255," + a * 0.15 + ")";
        ctx.fillText(d.char, 5, 5);
        ctx.fillStyle = "rgba(200,140,255," + a * 0.25 + ")";
        ctx.fillText(d.char, 2, 2);
        ctx.shadowColor = "rgba(220,150,255," + a * 0.5 + ")";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(230,180,255," + a + ")";
        ctx.fillText(d.char, 0, 0);
        ctx.shadowBlur = 0;
        ctx.restore();
        d.y -= d.sp;
        d.x += d.wx + Math.sin(frm * 8e-3 + d.phase) * 0.3;
        d.rot += d.rotSp;
        if (d.y < -40) {
          d.y = h + 30;
          d.x = Math.random() * w;
          d.char = glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }
    }
  };
  themeEffects.code = {
    init: function(c2) {
      const columns = [];
      const colWidth = 22;
      const colCount = Math.floor(c2.width / colWidth);
      for (let i = 0; i < colCount; i++) {
        const len = 10 + Math.floor(Math.random() * 20);
        const chars = [];
        const timers = [];
        for (let j = 0; j < len; j++) {
          chars.push(Math.random() > 0.5 ? "0" : "1");
          timers.push(Math.floor(Math.random() * 200));
        }
        columns.push({
          x: i * colWidth + Math.random() * 4,
          y: -Math.random() * c2.height * 1.2,
          speed: 1 + Math.random() * 2.5,
          length: len,
          phase: Math.random() * Math.PI * 2,
          chars,
          morphTimers: timers
        });
      }
      return columns;
    },
    draw: function(ctx, w, h, columns, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const bgGrd = ctx.createLinearGradient(0, 0, 0, h);
      bgGrd.addColorStop(0, "rgba(0,8,0," + 0.15 * int / 100 + ")");
      bgGrd.addColorStop(1, "rgba(0,20,5," + 0.3 * int / 100 + ")");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, w, h);
      const fontSize = Math.round(20 + 16 * int / 100);
      ctx.font = fontSize + "px MinecraftPixel, 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const rowHeight = fontSize * 0.95;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        col.y += col.speed;
        if (col.y - col.length * rowHeight > h) {
          col.y = -col.length * rowHeight - Math.random() * 80;
          col.speed = 1 + Math.random() * 2.5;
          for (let j = 0; j < col.length; j++) {
            col.chars[j] = Math.random() > 0.5 ? "0" : "1";
            col.morphTimers[j] = Math.floor(Math.random() * 50);
          }
        }
        for (let j = 0; j < col.length; j++) {
          const charY = col.y - j * rowHeight;
          if (charY < -rowHeight * 2 || charY > h + rowHeight) continue;
          col.morphTimers[j]++;
          if (col.morphTimers[j] > 60 + Math.floor(Math.random() * 120)) {
            col.morphTimers[j] = 0;
            col.chars[j] = Math.random() > 0.5 ? "0" : "1";
          }
          const ratio = j / col.length;
          const columnFade = Math.sin(frm * 3e-3 + col.phase) * 0.15 + 0.5;
          const a = (1 - ratio * 0.85) * columnFade * (int / 100);
          if (a < 0.02) continue;
          const isHead = j === 0;
          const isMid = j < col.length * 0.3;
          if (isHead) {
            ctx.fillStyle = "rgba(180,255,180," + Math.min(a * 2, 1) + ")";
            ctx.shadowColor = "rgba(0,255,100," + Math.min(a * 0.7, 0.5) + ")";
            ctx.shadowBlur = 15;
          } else if (isMid) {
            ctx.fillStyle = "rgba(120,230,120," + a * 0.8 + ")";
            ctx.shadowColor = "rgba(0,200,80," + a * 0.3 + ")";
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = "rgba(60,180,60," + a * 0.5 + ")";
            ctx.shadowColor = "rgba(0,150,50," + a * 0.1 + ")";
            ctx.shadowBlur = 3;
          }
          ctx.fillText(col.chars[j], col.x, charY);
          ctx.shadowBlur = 0;
        }
      }
    }
  };
  themeEffects.blank = {
    init: function(c2) {
      return [];
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
    }
  };
  themeEffects.dust = {
    init: function(c2) {
      var p = [];
      for (var i = 0; i < 200; i++) {
        p.push({ x: Math.random() * c2.width, y: Math.random() * c2.height * -1, sz: 2 + Math.floor(Math.random() * 4), sp: 0.2 + Math.random() * 0.6, op: 0.2 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2, drift: (Math.random() - 0.5) * 0.8, colorIdx: Math.floor(Math.random() * 8) });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(180,160,120," + 0.08 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      var sizes = [2, 3, 4, 5];
      for (var i = 0; i < p.length; i++) {
        var d = p[i], sz = d.sz * (int / 100), a = d.op * (int / 100);
        if (a < 0.02) continue;
        ctx.fillStyle = "rgba(" + (180 + Math.floor(Math.random() * 40)) + "," + (160 + Math.floor(Math.random() * 40)) + "," + (140 + Math.floor(Math.random() * 40)) + "," + a + ")";
        ctx.fillRect(Math.round(d.x), Math.round(d.y), Math.round(Math.max(sz, 1)), Math.round(Math.max(sz, 1)));
        d.y += d.sp;
        d.x += Math.sin(frm * 5e-3 + d.phase) * d.drift;
        if (d.y > h + 10) {
          d.y = -10;
          d.x = Math.random() * w;
          d.colorIdx = Math.floor(Math.random() * 8);
        }
      }
    }
  };
  




themeEffects.freeze = {
    init:function(c2){
      var p=[];
      // Layer1: 555 big crystals (thick 5.0)
      for(var i=0;i<55;i++){
        var e=Math.floor(Math.random()*4);
        p.push({_type:0,
          x:e===0?Math.random()*c2.width:e===1?c2.width+5:e===2?Math.random()*c2.width:-5,
          y:e===0?-5:e===1?Math.random()*c2.height:e===2?c2.height+5:Math.random()*c2.height,
          size:28+Math.floor(Math.random()*22),sp:0.01+Math.random()*0.02,
          op:0.7+Math.random()*0.3,phase:Math.random()*Math.PI*2,
          growDir:e,breathPhase:Math.random()*Math.PI*2,
          branch:1+Math.floor(Math.random()*2),maxDist:80+Math.random()*70,
          dist:0,growing:true,thick:5.0
        });
      }
      // Layer2: thin flickering crystals
      for(var i=0;i<70;i++){
        var e=Math.floor(Math.random()*4);
        p.push({_type:1,
          x:e===0?Math.random()*c2.width:e===1?c2.width+8:e===2?Math.random()*c2.width:-8,
          y:e===0?-8:e===1?Math.random()*c2.height:e===2?c2.height+8:Math.random()*c2.height,
          size:8+Math.random()*16,sp:0.02+Math.random()*0.04,
          op:0.2+Math.random()*0.3,phase:Math.random()*Math.PI*2,
          growDir:e,breathPhase:Math.random()*Math.PI*2,
          branch:1+Math.floor(Math.random()*2),maxDist:40+Math.random()*50,
          dist:0,growing:true,thick:1.0,
          extendTime:Math.random()*100,extendSpeed:0.003+Math.random()*0.008,
          flickerSpeed:0.008+Math.random()*0.02,flickerPhase:Math.random()*Math.PI*2
        });
      }
      // Layer3: Snow particles (1.3x normal snow size)
      for(var i=0;i<120;i++){
        p.push({_type:2,
          x:Math.random()*c2.width,y:Math.random()*c2.height,
          sp:0.2+Math.random()*0.8,op:0.2+Math.random()*0.5,
          phase:Math.random()*Math.PI*2,frame:Math.floor(Math.random()*8),
          sz:10+Math.floor(Math.random()*20),drift:(Math.random()-0.5)*0.8
        });
      }
      return p;
    },
    drawSnowflake:function(ctx,cx,cy,size,a,breath,subL,flicker,thick){
      if(subL<0||size<3)return;
      var fade=1-subL*0.3,fv=flicker!==undefined?0.5+0.5*flicker:1;
      var alpha=a*0.6*breath*fade*fv;
      if(alpha<0.015)return;
      ctx.strokeStyle="rgba(100,175,215,"+alpha+")";
      ctx.lineWidth=(thick||1.0)*(1.2-subL*0.2);
      for(var i=0;i<6;i++){
        var a2=Math.PI/3*i+Math.PI/6,ex=cx+size*Math.cos(a2),ey=cy+size*Math.sin(a2);
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);ctx.stroke();
        var sub=size*0.35;
        for(var j=1;j<=2;j++){
          var t=j/3,bx=cx+size*t*Math.cos(a2),by=cy+size*t*Math.sin(a2),sa1=a2+Math.PI/4,sa2=a2-Math.PI/4;
          ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+sub*Math.cos(sa1),by+sub*Math.sin(sa1));ctx.stroke();
          ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+sub*Math.cos(sa2),by+sub*Math.sin(sa2));ctx.stroke();
        }
        if(subL>0)this.drawSnowflake(ctx,ex,ey,size*0.3,a*0.6,breath,subL-1,flicker,thick);
      }
    },
    draw:function(ctx,w,h,p,int,frm){
      var self=this;
      ctx.clearRect(0,0,w,h);
      var fg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h)*0.6);
      fg.addColorStop(0,"rgba(8,30,40,"+0.08*int/100+")");
      fg.addColorStop(0.6,"rgba(4,18,25,"+0.15*int/100+")");
      fg.addColorStop(1,"rgba(2,6,10,"+0.25*int/100+")");
      ctx.fillStyle=fg;ctx.fillRect(0,0,w,h);
      
      var snowImg=window._ltePI&&window._ltePI.snow;
      for(var i=0;i<p.length;i++){
        var d=p[i];
        if(!isFinite(d.x)||!isFinite(d.y))continue;
        // Layer3: snow particles
        if(d._type===2){
          var a=d.op*(int/100);
          if(a<0.02||!snowImg||!snowImg.complete)continue;
          var sy=d.frame*32;
          var s=Math.round(d.sz*(1.5+1.5*int/100)*1.3);
          ctx.drawImage(snowImg,0,sy,64,32,Math.round(d.x-s/2),Math.round(d.y-s/2),s,s/2);
          d.y+=d.sp;d.x+=Math.sin(frm*0.01+d.phase)*d.drift;d.phase+=5e-3;
          if(d.y>h+20){d.y=-20;d.x=Math.random()*w;d.frame=Math.floor(Math.random()*8);}
          continue;
        }
        var a=d.op*(int/100);
        if(a<0.02)continue;
        var br=0.8+0.2*Math.sin(frm*4e-3+d.breathPhase),fv=1;
        if(d._type===1){
          d.flickerPhase+=d.flickerSpeed;
          if(d.growing){d.dist+=d.sp;if(d.dist>=d.maxDist){d.growing=false;d.extendTime=0;}}
          else{d.extendTime+=d.extendSpeed;var wv=Math.sin(d.extendTime+d.phase);d.dist=d.maxDist*(1+wv*0.2);if(wv<-0.19&&Math.random()<0.003){d.growing=true;d.dist=0;d.growDir=Math.floor(Math.random()*4);d.x=d.growDir===0?Math.random()*w:d.growDir===1?w+8:d.growDir===2?Math.random()*w:-8;d.y=d.growDir===0?-8:d.growDir===1?Math.random()*h:d.growDir===2?h+8:Math.random()*h;d.maxDist=40+Math.random()*50;}}
          fv=0.5+0.5*Math.sin(d.flickerPhase);
        }else{
          d.dist+=d.sp*(d.growing?1:-1);
          if(d.dist>d.maxDist||d.dist<2)d.growing=!d.growing;
        }
        var cx=d.x,cy=d.y;
        if(d.growDir===0)cy+=d.dist;else if(d.growDir===1)cx-=d.dist;else if(d.growDir===2)cy-=d.dist;else cx+=d.dist;
        if(cx<-200||cx>w+200||cy<-200||cy>h+200)continue;
        var fs=d.size*(0.5+0.5*int/100)*br;
        self.drawSnowflake(ctx,cx,cy,fs,a,br,d.branch,fv,d.thick||1.0);
      }
    }
  };






themeEffects.sculk = {
    init:function(c2){
      var p=[];
      var L=[
        {z:0,sc:0.65,ba:0.45,cr:0.45},
        {z:1,sc:1.0,ba:0.70,cr:0.35},
        {z:2,sc:1.5,ba:0.95,cr:0.20}
      ];
      var gc=[20,180,180];
      for(var li=0;li<3;li++){
        var l=L[li],cnt=Math.floor(130*l.cr);
        for(var i=0;i<cnt;i++){
          var bs=12+Math.random()*22;
          p.push({
            bx:Math.random()*c2.width,by:Math.random()*c2.height,x:0,y:0,
            bs:bs,ds:bs*l.sc,
            st:Math.floor(Math.random()*3),
            ph:Math.random()*Math.PI*4,ts:0.004+Math.random()*0.009,
            da:Math.random()*Math.PI*2,fp:0.5+Math.random()*1.8,
            rt:Math.random()*Math.PI*2,rs:(Math.random()-0.5)*0.009,
            ba:l.ba,dp:l.z
          });
        }
      }
      return p;
    },
    drawShape:function(ctx,t,s,a){
      ctx.fillStyle="rgba(20,180,180,1)";
      if(t===0){
        ctx.fillRect(-s*0.4,-s*0.8,s*0.8,s*0.22);
        ctx.fillRect(-s*0.8,-s*0.4,s*0.22,s*0.8);
        ctx.fillRect(s*0.18,-s*0.4,s*0.22,s*0.8);
        ctx.fillRect(-s*0.4,s*0.18,s*0.8,s*0.22);
        ctx.fillRect(-s*0.65,-s*0.65,s*0.22,s*0.22);
        ctx.fillRect(s*0.43,-s*0.65,s*0.22,s*0.22);
        ctx.fillRect(-s*0.65,s*0.43,s*0.22,s*0.22);
        ctx.fillRect(s*0.43,s*0.43,s*0.22,s*0.22);
      }else if(t===1){
        ctx.fillRect(-s*0.4,-s*0.8,s*0.8,s*0.22);
        ctx.fillRect(-s*0.8,-s*0.4,s*0.22,s*0.8);
        ctx.fillRect(s*0.18,-s*0.4,s*0.22,s*0.45);
        ctx.fillRect(-s*0.4,s*0.4,s*0.8,s*0.22);
        ctx.fillRect(s*0.43,-s*0.65,s*0.22,s*0.22);
        ctx.fillRect(s*0.43,s*0.1,s*0.22,s*0.55);
      }else{
        ctx.fillRect(-s*0.7,-s*0.2,s*0.22,s*0.22);
        ctx.fillRect(-s*0.45,-s*0.45,s*0.22,s*0.22);
        ctx.fillRect(-s*0.2,-s*0.7,s*0.22,s*0.22);
        ctx.fillRect(s*0.4,s*0.3,s*0.22,s*0.22);
        ctx.fillRect(s*0.4,-s*0.4,s*0.22,s*0.7);
      }
    },
    draw:function(ctx,w,h,p,int,frm){
      ctx.clearRect(0,0,w,h);
      
      ctx.fillStyle="rgba(8,30,40,0.06)";
      ctx.fillRect(0,0,w,h);
      
      var gc=[20,180,180],dc=[0,110,110],lc=[80,220,230];
      for(var i=0;i<p.length;i++){
        var d=p[i];
        d.ph+=d.ts;d.da+=0.007;
        var x=d.bx+Math.sin(d.da)*22*d.fp,y=d.by+Math.cos(d.da)*14*d.fp;
        d.rt+=d.rs;
        var br=0.5+0.5*Math.sin(d.ph),ra=d.ba*br*(int/100);
        if(ra<0.02)continue;
        ctx.save();ctx.translate(x,y);ctx.rotate(d.rt);
        var gl=ctx.createRadialGradient(0,0,0,0,0,d.ds*2.2);
        gl.addColorStop(0,"rgba("+lc.join(",")+","+ra*0.45+")");
        gl.addColorStop(0.5,"rgba("+gc.join(",")+","+ra*0.22+")");
        gl.addColorStop(1,"rgba("+dc.join(",")+",0)");
        ctx.fillStyle=gl;ctx.fillRect(-d.ds*2.2,-d.ds*2.2,d.ds*4.4,d.ds*4.4);
        ctx.globalAlpha=ra;this.drawShape(ctx,d.st,d.ds,ra);
        ctx.restore();
      }
    }
  };



  var _tc = null;
  var _ta = null;
  var _tp = [];
  var _tt = getLocal("th_type", "rain");
  var _ti = getLocal("th_int", 50);
  var _trun = false;
  var _tfrm = 0;
  var _themeRetryTimer = null;
  function persistThemePreferences() {
    setLocal("th_type", _tt);
    setLocal("th_int", _ti);
  }
  function syncThemeGlobals() {
    window._tt = _tt;
    window._ti = _ti;
    window._trun = _trun;
  }
  function makeThemeCanvas() {
    const host = ensureBackgroundHost();
    if (!host) return null;
    if (!_tc) {
      host.querySelectorAll("#lte-th-bg").forEach(function(stale) {
        stale.remove();
      });
      _tc = document.createElement("canvas");
      _tc.id = "lte-th-bg";
      _tc.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;";
    }
    if (_tc.parentNode !== host) host.appendChild(_tc);
    _tc.width = host.clientWidth || window.innerWidth;
    _tc.height = host.clientHeight || window.innerHeight;
    return _tc;
  }
  function removeThemeCanvas() {
    if (_ta) {
      cancelAnimationFrame(_ta);
      _ta = null;
    }
    if (_tc && _tc.parentNode) _tc.parentNode.removeChild(_tc);
    _tc = null;
    _tp = [];
    _trun = false;
    syncThemeGlobals();
    _tfrm = 0;
  }
  function themeAnimLoop() {
    _tfrm++;
    if (_tc && _trun) {
      try {
        const ctx = _tc.getContext("2d");
        if (ctx && themeEffects[_tt]) {
          themeEffects[_tt].draw(ctx, _tc.width, _tc.height, _tp.filter(function(x) {
            return isFinite(x.x) && isFinite(x.y);
          }), _ti, _tfrm);
        }
      } catch (_e) {
      }
    }
    _ta = requestAnimationFrame(themeAnimLoop);
  }
  function startThemeEffects(type, intensity) {
    if (isStandaloneWindow()) return false;
    if (_trun && _tc) return true;
    _tt = type || "rain";
    _ti = intensity || 50;
    _trun = true;
    syncThemeGlobals();
    persistThemePreferences();
    setLocal("th_enabled", true);
    _tfrm = 0;
    const c2 = makeThemeCanvas();
    if (!c2) {
      _trun = false;
      syncThemeGlobals();
      if (_themeRetryTimer) window.clearTimeout(_themeRetryTimer);
      _themeRetryTimer = window.setTimeout(function() {
        _themeRetryTimer = null;
        if (getLocal("th_enabled", false)) startThemeEffects(_tt, _ti);
      }, 300);
      return false;
    }
    if (themeEffects[_tt]) _tp = themeEffects[_tt].init(c2);
    themeAnimLoop();
    const rs = function() {
      if (_tc) {
        const host = ensureBackgroundHost();
        _tc.width = host && host.clientWidth || window.innerWidth;
        _tc.height = host && host.clientHeight || window.innerHeight;
        if (themeEffects[_tt]) _tp = themeEffects[_tt].init(_tc);
      }
    };
    window.addEventListener("resize", rs);
    window._lteThResize = rs;
    return true;
  }
  function updateThemeEffects(type, intensity) {
    if (type !== null && type !== void 0) {
      _tt = type;
      if (_tc && themeEffects[_tt]) _tp = themeEffects[_tt].init(_tc);
    }
    if (intensity !== null && intensity !== void 0) _ti = intensity;
    syncThemeGlobals();
    persistThemePreferences();
  }
  function stopThemeEffects(preserveEnabledPreference) {
    _trun = false;
    syncThemeGlobals();
    if (!preserveEnabledPreference) setLocal("th_enabled", false);
    if (_themeRetryTimer) {
      window.clearTimeout(_themeRetryTimer);
      _themeRetryTimer = null;
    }
    if (_ta) {
      cancelAnimationFrame(_ta);
      _ta = null;
    }
    if (window._lteThResize) {
      window.removeEventListener("resize", window._lteThResize);
      window._lteThResize = null;
    }
    removeThemeCanvas();
  }
  var VIDEO_DB_NAME = "LTEVidDB";
  var VIDEO_STORE_NAME = "d";
  var VIDEO_KEY = "v";
  function openVideoDatabase() {
    return new Promise(function(resolve, reject) {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB is unavailable"));
        return;
      }
      const request = indexedDB.open(VIDEO_DB_NAME, 1);
      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(VIDEO_STORE_NAME)) db.createObjectStore(VIDEO_STORE_NAME);
      };
      request.onsuccess = function() {
        resolve(request.result);
      };
      request.onerror = function() {
        reject(request.error || new Error("Failed to open video database"));
      };
    });
  }
  function saveVideoBlob(blob) {
    return openVideoDatabase().then(function(db) {
      return new Promise(function(resolve, reject) {
        const tx = db.transaction([VIDEO_STORE_NAME], "readwrite");
        tx.objectStore(VIDEO_STORE_NAME).put(blob, VIDEO_KEY);
        tx.oncomplete = function() {
          db.close();
          resolve();
        };
        tx.onerror = tx.onabort = function() {
          db.close();
          reject(tx.error || new Error("Failed to save video"));
        };
      });
    });
  }
  function loadStoredVideoBlob() {
    return openVideoDatabase().then(function(db) {
      return new Promise(function(resolve, reject) {
        const tx = db.transaction([VIDEO_STORE_NAME], "readonly");
        const request = tx.objectStore(VIDEO_STORE_NAME).get(VIDEO_KEY);
        request.onsuccess = function() {
          db.close();
          resolve(request.result || null);
        };
        request.onerror = function() {
          db.close();
          reject(request.error || new Error("Failed to load video"));
        };
      });
    });
  }
  function deleteStoredVideoBlob() {
    return openVideoDatabase().then(function(db) {
      return new Promise(function(resolve, reject) {
        const tx = db.transaction([VIDEO_STORE_NAME], "readwrite");
        tx.objectStore(VIDEO_STORE_NAME).delete(VIDEO_KEY);
        tx.oncomplete = function() {
          db.close();
          resolve();
        };
        tx.onerror = tx.onabort = function() {
          db.close();
          reject(tx.error || new Error("Failed to delete video"));
        };
      });
    }).catch(function() {
    });
  }
  var _vvideo = null;
  var _vurl = null;
  var _vactive = false;
  var _vpaused = false;
  var _vvol = 0.5;
  var _videoAudioUnlock = null;
  var _videoRestoreTimer = null;
  var _videoPersistenceChain = Promise.resolve();
  try {
    const sv = localStorage.getItem("lte-vvol");
    if (sv) {
      const parsed = parseFloat(sv);
      if (isFinite(parsed)) _vvol = Math.max(0, Math.min(1, parsed));
    }
  } catch (e) {
  }
  function releaseVideoAudioUnlock() {
    if (_videoAudioUnlock) {
      document.removeEventListener("pointerdown", _videoAudioUnlock, true);
      _videoAudioUnlock = null;
    }
  }
  function attachVideoAudioUnlock() {
    if (_videoAudioUnlock) return;
    _videoAudioUnlock = function() {
      if (_vvideo) {
        _vvideo.muted = false;
        _vvideo.volume = _vvol;
        const played = _vvideo.play();
        if (played && played.catch) played.catch(function() {
        });
      }
      releaseVideoAudioUnlock();
    };
    document.addEventListener("pointerdown", _videoAudioUnlock, { capture: true, once: true });
  }
  function clearVideoElement() {
    releaseVideoAudioUnlock();
    if (_vvideo) {
      try {
        _vvideo.pause();
      } catch (e) {
      }
      if (_vvideo.parentNode) _vvideo.parentNode.removeChild(_vvideo);
    }
    _vvideo = null;
    if (_vurl) {
      URL.revokeObjectURL(_vurl);
      _vurl = null;
    }
  }
  function mountVideoElement() {
    const host = ensureBackgroundHost();
    if (!host || !_vurl) return null;
    if (!_vvideo) {
      host.querySelectorAll("#lte-video-bg").forEach(function(stale) {
        stale.remove();
      });
      _vvideo = document.createElement("video");
      _vvideo.id = "lte-video-bg";
      _vvideo.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;object-fit:cover;pointer-events:none;";
      _vvideo.loop = true;
      _vvideo.playsInline = true;
      _vvideo.src = _vurl;
    }
    if (_vvideo.parentNode !== host) host.appendChild(_vvideo);
    return _vvideo;
  }
  function tryPlayVideo(restoreAutoplay) {
    if (!_vvideo) return;
    _vvideo.muted = Boolean(restoreAutoplay);
    _vvideo.volume = _vvol;
    const played = _vvideo.play();
    if (played && played.catch) {
      played.catch(function() {
        if (!_vvideo) return;
        _vvideo.muted = true;
        const retried = _vvideo.play();
        if (retried && retried.catch) retried.catch(function() {
        });
        attachVideoAudioUnlock();
      });
    }
    if (restoreAutoplay) attachVideoAudioUnlock();
  }
  function videoStart(blob, restoreMode) {
    if (isStandaloneWindow()) return false;
    clearVideoElement();
    _vurl = URL.createObjectURL(blob);
    if (!mountVideoElement()) {
      clearVideoElement();
      if (restoreMode) {
        if (_videoRestoreTimer) window.clearTimeout(_videoRestoreTimer);
        _videoRestoreTimer = window.setTimeout(function() {
          _videoRestoreTimer = null;
          videoStart(blob, true);
        }, 300);
      }
      return false;
    }
    _vactive = true;
    _vpaused = restoreMode ? Boolean(getLocal("v_paused", false)) : false;
    if (_vpaused) {
      _vvideo.pause();
    } else {
      tryPlayVideo(Boolean(restoreMode));
    }
    if (!restoreMode) setLocal("v_paused", false);
    return true;
  }
  function pickVideoFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/webm,video/ogg,video/*";
    input.onchange = function(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      setLocal("v_name", file.name);
      _videoPersistenceChain = _videoPersistenceChain.catch(function() {
      }).then(function() {
        return saveVideoBlob(file);
      }).catch(function() {
      });
      videoStart(file, false);
    };
    input.click();
  }
  function videoPlay() {
    if (!_vurl) return;
    if (!mountVideoElement()) return;
    _vpaused = false;
    setLocal("v_paused", false);
    tryPlayVideo(false);
  }
  function videoPause() {
    if (_vvideo) {
      _vvideo.pause();
      _vpaused = true;
      setLocal("v_paused", true);
    }
  }
  function videoKill() {
    clearVideoElement();
    _vactive = false;
    _vpaused = false;
    if (_videoRestoreTimer) {
      window.clearTimeout(_videoRestoreTimer);
      _videoRestoreTimer = null;
    }
    setLocal("v_paused", false);
    try {
      localStorage.removeItem(PREFIX + "v_name");
    } catch (e) {
    }
    _videoPersistenceChain = _videoPersistenceChain.catch(function() {
    }).then(function() {
      return deleteStoredVideoBlob();
    });
  }
  function videoVolume(v) {
    _vvol = Math.max(0, Math.min(1, Number(v) || 0));
    if (_vvideo) {
      _vvideo.volume = _vvol;
      _vvideo.muted = false;
      if (!_vpaused) {
        const played = _vvideo.play();
        if (played && played.catch) played.catch(function() {
        });
      }
    }
    try {
      localStorage.setItem("lte-vvol", String(_vvol));
    } catch (e) {
    }
  }
  function restoreVideoBackground() {
    if (isStandaloneWindow()) return;
    loadStoredVideoBlob().then(function(blob) {
      if (blob) videoStart(blob, true);
    }).catch(function() {
    });
  }

  // src/locales/en.ts
  var en = {
    cityWeather: "City Weather",
    themeEnhancer: "Theme Enhancer",
    mouseEffects: "Mouse Effects",
    cursorStardust: "Cursor Stardust",
    mouseEffectsDesc: "Leave a brief trail of colorful stardust while moving the pointer.",
    mouseCometTrail: "Comet Trail",
    mouseCometDesc: "Draw a continuous tapered comet ribbon behind the pointer.",
    mouseSparkleTrail: "Sparkle Trail",
    mouseSparkleDesc: "Scatter short-lived four-point star flashes along the pointer path.",
    mouseSakuraTrail: "Sakura Trail",
    mouseSakuraDesc: "Leave tiny rotating petals drifting behind the pointer.",
    mouseSnowflakeTrail: "Snowflake Trail",
    mouseSnowflakeDesc: "Leave six-armed ice crystals that slowly drift down and fade.",
    mouseGlitchTrail: "Digital Glitch",
    mouseGlitchDesc: "Leave short neon fragments with a subtle digital distortion.",
    active: "Active",
    standby: "Standby",
    cityWeatherDesc: "Real-time weather with an optional dynamic ambience",
    themeEnhancerDesc: "Video background + 21 custom particle effects",
    searchCity: "Search City",
    searchPlaceholder: "Search city...",
    loading: "Loading...",
    fetchData: "Fetching...",
    humidity: "Humidity",
    wind: "Wind",
    feels: "Feels",
    clear: "Clear",
    cloudy: "Cloudy",
    rain: "Rain",
    snow: "Snow",
    thunderstorm: "Thunderstorm",
    foggy: "Fog",
    windy: "Windy",
    atmosphereEffect: "Atmosphere Effect",
    dynamicAmbience: "Dynamic Ambience",
    ambienceHint: "Controls the animated weather gradient and icon only. Search and weather data stay available.",
    themeParticles: "Theme Particles",
    videoBackground: "Video Background",
    themeSwitchHint: "The video background remains independent from this particle switch.",
    homeWidgets: "Home Widgets",
    homeWidgetsHint: "Choose which feature cards appear on the launcher home page.",
    homeWidgetsApply: "Apply & Reload",
    homeWidgetsPending: "Changes will take effect after the extension reloads.",
    homeWidgetsAllHidden: "All home widgets are hidden. You can re-enable them here at any time.",
    homeWidgetsSingleWarning: "Only one home widget will remain visible. Its saved layout may reset after reload.",
    particleEffects: "Particle Effects",
    saturationOverlay: "saturation overlay",
    themeEffects: "Theme Effects",
    on: "ON",
    off: "OFF",
    video: "Video",
    play: "▶ Play",
    pause: "⏸  Pause",
    remove: "🗑  Remove",
    change: "📁  Change",
    selectVideo: "Select Video File",
    stop: "⏹  Stop",
    start: "▶ Start",
    intensity: "Intensity",
    effectType: "Effect Type",
    volume: "Volume",
    videoLayer: "Isolated background layer",
    effectRain: "🌧  Rain",
    effectRipples: "💧  Rain Ripples",
    effectKeyboardGlow: "⌨️  Keyboard Glow",
    effectSnow: "❄️  Snow",
    effectSandstorm: "🌪  Sandstorm",
    effectStarrySky: "✨  Starry Sky",
    effectAurora: "🌌  Aurora",
    effectFallingLeaves: "🍃  Falling Leaves",
    effectSakura: "🌸  Cherry Blossom",
    effectFireflies: "✨  Firefly Night",
    effectDna: "🧬  DNA Particle Drift",
    effectGhost: "👻  Ghost Shadows",
    effectUnderwater: "🌊  Underwater",
    effectFire: "🔥  Fire",
    effectSunset: "🌅  Sunset",
    effectMinecraft: "🎮  Vigor",
    effectEnchanting: "✨  Enchanting",
    effectCode: "💻  Code (Stealth Hacker)",
    effectDust: "💨 Dust",
    effectFreeze: "❄️ Freeze",
    effectSculk: "🌑 Sculk",
    effectBlank: "🧹 Blank (Clear All)",
    running: "Running",
    stopped: "Stopped",
    sectionCityWeather: "🌤  City Weather",
    sectionVideoBackground: "🎬  Video Background",
    sectionThemeParticles: "✨  Theme Particle Effects",
    typeCityName: "Type a city name...",
    wmoClear: "Sunny",
    wmoCloudy: "Cloudy",
    wmoFog: "Foggy",
    wmoRain: "Rainy",
    wmoSnow: "Snowy",
    wmoThunder: "Thunderstorm",
    author: "Author",
    version: "Version",
    help: "Help",
    layerOrder: "Layer order: Video (z:0) -> Weather (z:1) -> Theme (z:2)",
    enchantingDesc: "Minecraft enchantment table atmosphere with galactic glyphs",
    codeDesc: "Falling 0s and 1s in the style of digital rain"
  };
  var en_default = en;

  // src/locales/zh.ts
  var zh = {
    cityWeather: "城市天气",
    themeEnhancer: "主题增强",
    mouseEffects: "鼠标效果",
    cursorStardust: "光标星尘",
    mouseEffectsDesc: "移动鼠标时留下短暂的彩色星尘轨迹。",
    mouseCometTrail: "彗尾轨迹",
    mouseCometDesc: "光标后方拖出连续的锥形彗尾光带。",
    mouseSparkleTrail: "星芒轨迹",
    mouseSparkleDesc: "沿鼠标路径散布短暂的四角星芒。",
    mouseSakuraTrail: "樱叶轨迹",
    mouseSakuraDesc: "鼠标移动时留下旋转飘落的小樱花瓣。",
    mouseSnowflakeTrail: "雪花拖尾",
    mouseSnowflakeDesc: "留下六角冰晶，轻微旋转并缓慢下落。",
    mouseGlitchTrail: "数据残影",
    mouseGlitchDesc: "留下短小霓虹碎片和轻微数字故障效果。",
    active: "运行中",
    standby: "待机",
    cityWeatherDesc: "实时天气与可开关的动态氛围",
    themeEnhancerDesc: "视频背景 + 21 种自定义粒子效果",
    searchCity: "搜索城市",
    searchPlaceholder: "搜索城市...",
    loading: "加载中...",
    fetchData: "获取数据中...",
    humidity: "湿度",
    wind: "风速",
    feels: "体感",
    clear: "晴",
    cloudy: "多云",
    rain: "雨",
    snow: "雪",
    thunderstorm: "雷暴",
    foggy: "雾",
    windy: "大风",
    atmosphereEffect: "氛围效果",
    dynamicAmbience: "动态氛围",
    ambienceHint: "仅控制天气渐变与图标动效，城市搜索和天气数据始终可用。",
    themeParticles: "主题粒子",
    videoBackground: "视频背景",
    themeSwitchHint: "视频背景独立控制，不受此粒子开关影响。",
    homeWidgets: "主页卡片",
    homeWidgetsHint: "选择要在启动器主页显示的功能卡片。",
    homeWidgetsApply: "应用并刷新",
    homeWidgetsPending: "修改将在扩展刷新后生效。",
    homeWidgetsAllHidden: "已隐藏全部主页卡片，你仍可随时在这里重新开启。",
    homeWidgetsSingleWarning: "仅保留一张主页卡片时，其已保存的布局状态可能会重置。",
    particleEffects: "粒子特效",
    saturationOverlay: "饱和度覆盖",
    themeEffects: "主题特效",
    on: "开",
    off: "关",
    video: "视频",
    play: "▶ 播放",
    pause: "⏸  暂停",
    remove: "🗑  移除",
    change: "📁  更换",
    selectVideo: "选择视频文件",
    stop: "⏹  停止",
    start: "▶ 开始",
    intensity: "强度",
    effectType: "效果类型",
    volume: "音量",
    videoLayer: "隔离背景层",
    effectRain: "🌧  雨天",
    effectRipples: "💧  雨滴涟漪",
    effectKeyboardGlow: "⌨️  键盘光效",
    effectSnow: "❄️  雪天",
    effectSandstorm: "🌪  沙暴",
    effectStarrySky: "✨  星空",
    effectAurora: "🌌  极光",
    effectFallingLeaves: "🍃  落叶",
    effectSakura: "🌸  樱花飘落",
    effectFireflies: "✨  萤火虫之夜",
    effectDna: "🧬  DNA 粒子流",
    effectGhost: "👻  鬼影",
    effectUnderwater: "🌊  海底",
    effectFire: "🔥  火焰",
    effectSunset: "🌅  日落",
    effectMinecraft: "🎮  活力",
    effectEnchanting: "✨  附魔",
    effectCode: "💻  低调的黑客",
    effectDust: "💨 灰尘",
    effectFreeze: "❄️ 冻结",
    effectSculk: "🌑 幽匿",
    effectBlank: "🧹  空白（清除所有粒子）",
    running: "运行中",
    stopped: "已停止",
    sectionCityWeather: "🌤  城市天气",
    sectionVideoBackground: "🎬  视频背景",
    sectionThemeParticles: "✨  主题粒子特效",
    typeCityName: "输入城市名称...",
    wmoClear: "晴朗",
    wmoCloudy: "多云",
    wmoFog: "有雾",
    wmoRain: "有雨",
    wmoSnow: "有雪",
    wmoThunder: "雷暴",
    author: "作者",
    version: "版本",
    help: "帮助",
    layerOrder: "层级：视频 (z:0) → 天气 (z:1) → 主题 (z:2)",
    enchantingDesc: "Minecraft 附魔台氛围，银河字母辉光效果",
    codeDesc: "0 和 1 数字雨，极客风格"
  };
  var zh_default = zh;

  // src/locales/index.ts
  var locales = { en: en_default, zh: zh_default };
  function useLocale(host) {
    const [locale] = host.state.useExtensionState("locale", "en");
    const strings = locales[locale] || en_default;
    return function(key) {
      var _a, _b;
      return (_b = (_a = strings[key]) != null ? _a : en_default[key]) != null ? _b : key;
    };
  }

  // src/widgets/home-widget.ts
  function wmoLocaleKey(type) {
    const m = {
      clear: "wmoClear",
      cloudy: "wmoCloudy",
      rain: "wmoRain",
      snow: "wmoSnow",
      thunder: "wmoThunder",
      fog: "wmoFog",
      windy: "wmoClear"
    };
    return m[type] || "wmoClear";
  }
  function fxLocaleKey(v) {
    const m = {
      rain: "effectRain",
      ripples: "effectRipples",
      keyboard_glow: "effectKeyboardGlow",
      snow: "effectSnow",
      sand: "effectSandstorm",
      stars: "effectStarrySky",
      aurora: "effectAurora",
      leaves: "effectFallingLeaves",
      sakura: "effectSakura",
      fireflies: "effectFireflies",
      dna: "effectDna",
      ghost: "effectGhost",
      water: "effectUnderwater",
      fire: "effectFire",
      sunset: "effectSunset",
      mc: "effectMinecraft",
      enchanting: "effectEnchanting",
      code: "effectCode",
      blank: "effectBlank",
      dust: "effectDust",
      freeze: "effectFreeze",
      sculk: "effectSculk"
    };
    return m[v] || "effectRain";
  }
  function useCrossfadeGradient(React, gradient) {
    const [previous, setPrevious] = React.useState(null);
    const current = React.useRef(gradient);
    const timer = React.useRef(null);
    React.useEffect(function() {
      if (gradient === current.current) return;
      setPrevious(current.current);
      current.current = gradient;
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(function() {
        setPrevious(null);
        timer.current = null;
      }, 260);
      return function() {
        if (timer.current) {
          window.clearTimeout(timer.current);
          timer.current = null;
        }
      };
    }, [gradient]);
    return previous;
  }
  function createCityWeatherWidget(api) {
    ensureMouseUiStyles();
    const React = api.React;
    const ChakraUI = api.ChakraUI;
    const { useState, useEffect, useCallback } = React;
    const el = React.createElement;
    const { Badge, Box, VStack, HStack, Switch, Text } = ChakraUI;
    function weaGradient(type) {
      var m = { clear: "linear-gradient(135deg,rgba(255,200,80,0.35),rgba(255,120,30,0.08))", cloudy: "linear-gradient(135deg,rgba(100,130,160,0.35),rgba(60,70,90,0.08))", rain: "linear-gradient(135deg,rgba(40,80,160,0.4),rgba(15,40,80,0.08))", snow: "linear-gradient(135deg,rgba(180,210,240,0.3),rgba(200,220,250,0.08))", thunder: "linear-gradient(135deg,rgba(50,25,80,0.45),rgba(15,8,30,0.1))", fog: "linear-gradient(135deg,rgba(120,130,140,0.3),rgba(80,85,90,0.08))", wind: "linear-gradient(135deg,rgba(70,140,170,0.3),rgba(40,80,100,0.08))" };
      return m[type] || m.clear;
    }
    function weaPalette(type) {
      var m = {
        clear: ["#ffb52e", "#ffd76a", "#ff8a3d"],
        cloudy: ["#65768d", "#93a5b7", "#c4cfda"],
        rain: ["#315da8", "#5d9bdf", "#b4d8ff"],
        snow: ["#9ebfe4", "#c7e2ff", "#f2fbff"],
        thunder: ["#542d7e", "#8d5ac8", "#d39cff"],
        fog: ["#69727c", "#9ba4ad", "#d1d7dc"],
        wind: ["#3d7d99", "#69bbd2", "#c0f1f7"]
      };
      return m[type] || m.clear;
    }
    function tempColor(t) {
      if (t < 0) return "#66b3ff";
      if (t < 10) return "#88ccff";
      if (t < 20) return "#ffcc44";
      if (t < 30) return "#ff8833";
      return "#ff4444";
    }
    function weaAnim(type) {
      var m = { clear: "pulse 3s ease-in-out infinite", cloudy: "drift 4s ease-in-out infinite", rain: "none", snow: "snowfall 5s ease-in-out infinite", thunder: "flicker 0.5s ease-in-out infinite", fog: "drift 6s ease-in-out infinite", wind: "drift 2s ease-in-out infinite" };
      return m[type] || "none";
    }
    return function CityWeatherWidget() {
      const host = api.getHostContext();
      const es = host.state.useExtensionState;
      const [city, setCity] = es("cw_city", "");
      const [wInfo, setWInfo] = es("cw_wi", null);
      const [ambientEnabled, setAmbientEnabled] = es("cw_ambient_enabled", true);
      const [input, setInput] = useState("");
      const [loading, setLoading] = useState(false);
      const t = useLocale(host);
      useEffect(function() {
        if (!document.getElementById("lte-wx-keys")) {
          var s = document.createElement("style");
          s.id = "lte-wx-keys";
          s.textContent = "@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.08)}}@keyframes drift{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}@keyframes snowfall{0%,100%{transform:translateY(0)rotate(0deg)}50%{transform:translateY(8px)rotate(10deg)}}@keyframes flicker{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes shine{0%{background-position:-200% 0}100%{background-position:200% 0}}";
          document.head.appendChild(s);
        }
      }, []);
      const searchCity = useCallback(function() {
        const v = input.trim();
        if (!v) return;
        setLoading(true);
        setWInfo(null);
        setCity(v);
        try {
          localStorage.setItem("lte-cw_city", JSON.stringify(v));
        } catch (e) {
        }
        getCityWeather(v, function(d) {
          setLoading(false);
          if (d) setWInfo(d);
        });
      }, [input]);
      const weaType = wInfo ? mapWMO(wInfo.code) : "clear";
      const weatherIcon = wInfo ? WN_ICON[weaType] || "" : "";
      const grad = weaGradient(weaType);
      const palette = weaPalette(weaType);
      const accent = palette[1];
      const lineGradient = "linear-gradient(90deg, " + palette[0] + ", " + palette[1] + ", " + palette[2] + ", " + palette[0] + ")";
      const previousLine = useCrossfadeGradient(React, lineGradient);
      const tColor = wInfo ? tempColor(wInfo.temp) : "white";
      const anim = wInfo ? weaAnim(weaType) : "none";
      const active = Boolean(wInfo && ambientEnabled);
      return el(
        Box,
        {
          p: 3,
          borderRadius: "xl",
          bg: "rgba(8,12,24,0.92)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.08)",
          position: "relative",
          overflow: "hidden"
        },
        el(
          Box,
          { className: "lte-card-accent-shell " + (active ? "" : "is-paused") },
          previousLine ? el(Box, {
            key: previousLine,
            className: "lte-card-line-layer is-previous",
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: previousLine }
          })) : null,
          el(Box, {
            key: lineGradient,
            className: "lte-card-line-layer is-current"
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: lineGradient }
          }))
        ),
        // Animated weather gradient overlay
        wInfo ? el(Box, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          style: {
            background: grad,
            opacity: ambientEnabled ? 0.8 : 0.16,
            filter: ambientEnabled ? "saturate(1)" : "saturate(0.35)",
            transition: "opacity 220ms ease, filter 220ms ease"
          }
        }) : null,
        el(
          VStack,
          { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
          el(
            HStack,
            { justify: "space-between", align: "center" },
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(
                Box,
                {
                  w: "26px",
                  h: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "md",
                  bg: accent + "33",
                  color: accent,
                  fontSize: "xs",
                  fontWeight: "bold",
                  border: "1px solid " + accent + "66",
                  transition: "background-color 180ms ease, color 180ms ease, border-color 180ms ease"
                },
                "CW"
              ),
              el(Text, { fontSize: "sm", fontWeight: "bold", color: "gray.100" }, t("cityWeather"))
            ),
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(Badge, { colorScheme: active ? "green" : "gray", variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, active ? t("on") : t("off")),
              el(Switch, {
                isChecked: Boolean(ambientEnabled),
                colorScheme: "blue",
                size: "sm",
                isDisabled: !wInfo,
                onChange: function() {
                  setAmbientEnabled(!ambientEnabled);
                },
                "aria-label": t("dynamicAmbience")
              })
            )
          ),
          el(Text, { fontSize: "xs", color: "gray.500" }, t("ambienceHint")),
          el(
            HStack,
            { spacing: 2 },
            el("input", {
              placeholder: t("searchPlaceholder"),
              value: input,
              onInput: function(e) {
                setInput(e.target.value);
              },
              onKeyDown: function(e) {
                if (e.key === "Enter") searchCity();
              },
              style: {
                flex: 1,
                padding: "6px 10px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)",
                color: "#e2e8f0",
                border: "1px solid " + accent + "55",
                fontSize: "13px",
                outline: "none",
                transition: "border-color 180ms ease, box-shadow 180ms ease"
              }
            }),
            el(
              Box,
              {
                as: "button",
                type: "button",
                className: "lte-mouse-selector lte-card-selector",
                onClick: searchCity,
                disabled: !input.trim() || loading,
                "aria-label": t("searchCity"),
                style: {
                  width: "38px",
                  height: "34px",
                  borderRadius: "10px",
                  background: accent + "22",
                  border: "1px solid " + accent + "66",
                  color: accent,
                  cursor: !input.trim() || loading ? "default" : "pointer",
                  opacity: !input.trim() || loading ? 0.55 : 1,
                  "--card-accent": accent,
                  "--card-glow": accent + "2e"
                }
              },
              loading ? "..." : "🔍"
            )
          ),
          wInfo ? el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              style: {
                border: "1px solid " + accent + (ambientEnabled ? "48" : "24"),
                transition: "border-color 220ms ease, background-color 220ms ease"
              },
              bg: "rgba(255,255,255,0.04)"
            },
            el(
              VStack,
              { spacing: 2, align: "center" },
              el(Text, { fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "medium" }, city || ""),
              el(
                HStack,
                { spacing: 1, align: "center" },
                el("span", { style: { fontSize: "40px", fontWeight: "300", color: tColor, lineHeight: "1", transition: "color 220ms ease, textShadow 220ms ease", textShadow: ambientEnabled ? "0 0 8px " + accent + "60, 0 0 16px " + accent + "30" : "none" } }, wInfo.temp + "°"),
                el(Text, { fontSize: "14px", color: "rgba(255,255,255,0.5)", mt: "6px" }, "C")
              ),
              el(
                HStack,
                { spacing: 1, align: "center" },
                el(Text, { fontSize: "24px", style: { animation: ambientEnabled ? anim : "none", display: "inline-block", opacity: ambientEnabled ? 1 : 0.7, transition: "opacity 220ms ease" } }, weatherIcon),
                el(Text, { fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: "500" }, t(wmoLocaleKey(weaType)))
              ),
              el(Box, { h: "1px", bg: "rgba(255,255,255,0.06)", w: "100%" }),
              el(
                HStack,
                { spacing: 4, justify: "center" },
                el(
                  VStack,
                  { spacing: 0, align: "center" },
                  el(Text, { fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }, t("humidity")),
                  el(Text, { fontSize: "14px", color: "white", fontWeight: "600" }, wInfo.humi + "%")
                ),
                el(
                  VStack,
                  { spacing: 0, align: "center" },
                  el(Text, { fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }, t("wind")),
                  el(Text, { fontSize: "14px", color: "white", fontWeight: "600" }, wInfo.wind + " km/h")
                ),
                wInfo.feels ? el(
                  VStack,
                  { spacing: 0, align: "center" },
                  el(Text, { fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }, t("feels")),
                  el(Text, { fontSize: "14px", color: "white", fontWeight: "600" }, wInfo.feels + "°")
                ) : null
              )
            )
          ) : el(
            Box,
            { p: 3, borderRadius: "xl", bg: "rgba(255,255,255,0.04)", textAlign: "center" },
            el(
              Text,
              { fontSize: "sm", color: "rgba(255,255,255,0.4)" },
              city ? el("span", null, t("loading")) : el("span", null, t("searchCity"))
            )
          )
        )
      );
    };
  }
  function createThemeEnhancerWidget(api) {
    ensureMouseUiStyles();
    const React = api.React;
    const ChakraUI = api.ChakraUI;
    const { useState, useEffect } = React;
    const el = React.createElement;
    const { Badge, Box, VStack, HStack, Switch, Text, Button } = ChakraUI;
    function useVidState() {
      const [s, setS] = useState({ active: window._vactive || false, paused: window._vpaused || false, vol: window._vvol == null ? 0.5 : window._vvol });
      useEffect(function() {
        const id = setInterval(function() {
          setS({ active: window._vactive || false, paused: window._vpaused || false, vol: window._vvol == null ? 0.5 : window._vvol });
        }, 150);
        return function() {
          clearInterval(id);
        };
      }, []);
      return s;
    }
    return function ThemeEnhancerWidget() {
      const host = api.getHostContext();
      const es = host.state.useExtensionState;
      const vs = useVidState();
      const t = useLocale(host);
      var _tt2 = window._tt || "rain";
      var _ti2 = window._ti || 50;
      const [selType, setSelType] = useState(_tt2);
      const [selInt, setSelInt] = useState(_ti2);
      const [running, setRunning] = useState(Boolean(window._trun));
      const [isOpen, setIsOpen] = useState(false);
      const selected = getThemeOption(selType);
      const accent = selected.colors[1];
      const lineGradient = "linear-gradient(90deg, " + selected.colors[0] + ", " + selected.colors[1] + ", " + selected.colors[2] + ", " + selected.colors[0] + ")";
      const previousLine = useCrossfadeGradient(React, lineGradient);
      useEffect(function() {
        const id = setInterval(function() {
          setRunning(Boolean(window._trun));
          const nextType = window._tt || "rain";
          const nextInt = window._ti || 50;
          setSelType(function(previous) {
            return previous === nextType ? previous : nextType;
          });
          setSelInt(function(previous) {
            return previous === nextInt ? previous : nextInt;
          });
        }, 250);
        return function() {
          clearInterval(id);
        };
      }, []);
      function toggleTheme() {
        if (running) {
          stopThemeEffects();
          setRunning(false);
        } else {
          if (selType === "blank") return;
          startThemeEffects(selType, selInt);
          setRunning(Boolean(window._trun));
        }
      }
      function changeType(v) {
        setSelType(v);
        window._tt = v;
        _tt = v;
        if (v === "blank") {
          stopThemeEffects();
          setRunning(false);
        } else if (window._trun) {
          updateThemeEffects(v);
          setRunning(true);
        }
        persistThemePreferences();
      }
      function changeInt(v) {
        var n = parseInt(v);
        setSelInt(n);
        window._ti = n;
        _ti = n;
        if (window._trun) updateThemeEffects(null, n);
        persistThemePreferences();
      }
      function chooseEffect(nextEffect) {
        changeType(nextEffect);
        setIsOpen(false);
      }
      return el(
        Box,
        {
          p: 3,
          borderRadius: "xl",
          bg: "rgba(8,12,24,0.92)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.08)",
          position: "relative",
          overflow: "hidden"
        },
        el(
          Box,
          { className: "lte-card-accent-shell " + (running ? "" : "is-paused") },
          previousLine ? el(Box, {
            key: previousLine,
            className: "lte-card-line-layer is-previous",
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: previousLine }
          })) : null,
          el(Box, {
            key: lineGradient,
            className: "lte-card-line-layer is-current"
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: lineGradient }
          }))
        ),
        el(
          VStack,
          { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
          el(
            HStack,
            { justify: "space-between", align: "center" },
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(
                Box,
                {
                  w: "26px",
                  h: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "md",
                  bg: accent + "33",
                  color: accent,
                  fontSize: "xs",
                  fontWeight: "bold",
                  border: "1px solid " + accent + "66",
                  transition: "background-color 180ms ease, color 180ms ease, border-color 180ms ease"
                },
                "TE"
              ),
              el(Text, { fontSize: "sm", fontWeight: "bold", color: "gray.100" }, t("themeEnhancer"))
            ),
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(Badge, { colorScheme: running ? "green" : "gray", variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, running ? t("on") : t("off")),
              el(Switch, {
                isChecked: running,
                colorScheme: "blue",
                size: "sm",
                isDisabled: selType === "blank",
                onChange: toggleTheme,
                "aria-label": t("themeParticles")
              })
            )
          ),
          el(
            Box,
            {
              p: 2,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.045)",
              border: "1px solid " + accent + "52",
              style: { "--card-accent": accent, "--card-glow": accent + "2e" }
            },
            el(
              VStack,
              { spacing: 2, align: "stretch" },
              el(
                HStack,
                { justify: "space-between", align: "center" },
                el(Text, { fontSize: "xs", color: "gray.300", fontWeight: "600" }, t("themeParticles")),
                el(Badge, { colorScheme: running ? "green" : "gray", variant: "subtle", fontSize: "xs", borderRadius: "full", px: 2 }, running ? t("running") : t("stopped"))
              ),
              el(
                Box,
                {
                  as: "button",
                  type: "button",
                  className: "lte-mouse-selector lte-card-selector",
                  w: "100%",
                  p: 2,
                  borderRadius: "xl",
                  bg: "rgba(255,255,255,0.045)",
                  border: "1px solid " + accent + "66",
                  textAlign: "left",
                  color: "white",
                  onClick: function() {
                    setIsOpen(!isOpen);
                  },
                  "aria-expanded": isOpen
                },
                el(
                  HStack,
                  { justify: "space-between", align: "center" },
                  el(Text, { fontSize: "sm", fontWeight: "semibold" }, t(fxLocaleKey(selType))),
                  el(Text, { className: "lte-mouse-chevron lte-card-chevron " + (isOpen ? "is-open" : ""), fontSize: "sm", color: "gray.400" }, "⌄")
                )
              ),
              isOpen ? el(
                VStack,
                { className: "lte-mouse-options lte-card-options", spacing: 1, align: "stretch" },
                THEME_OPTIONS.map(function(option) {
                  const optionActive = option.v === selType;
                  return el(
                    Box,
                    {
                      as: "button",
                      key: option.v,
                      type: "button",
                      className: "lte-mouse-option lte-card-option",
                      w: "100%",
                      p: 2,
                      borderRadius: "lg",
                      border: "1px solid " + (optionActive ? option.colors[1] + "88" : "transparent"),
                      bg: optionActive ? option.colors[1] + "18" : "transparent",
                      color: optionActive ? "white" : "gray.300",
                      textAlign: "left",
                      onClick: function() {
                        chooseEffect(option.v);
                      }
                    },
                    el(
                      HStack,
                      { justify: "space-between", align: "center" },
                      el(Text, { fontSize: "sm" }, t(fxLocaleKey(option.v))),
                      optionActive ? el(Text, { fontSize: "sm", color: option.colors[1] }, "✓") : null
                    )
                  );
                })
              ) : null,
              el(
                HStack,
                { spacing: 2, align: "center" },
                el(Text, { fontSize: "xs", color: "gray.400", minW: "44px" }, t("intensity")),
                el("input", {
                  type: "range",
                  min: 10,
                  max: 100,
                  step: 5,
                  value: selInt,
                  onChange: function(e) {
                    changeInt(e.target.value);
                  },
                  className: "lte-mouse-slider lte-card-slider",
                  style: { flex: 1, "--mouse-accent": accent, "--card-accent": accent }
                }),
                el(Text, { fontSize: "xs", color: accent, minW: "34px", textAlign: "right" }, selInt + "%")
              )
            )
          ),
          el(Text, { fontSize: "xs", color: "gray.500" }, t("themeSwitchHint")),
          el(
            Box,
            { p: 2, borderRadius: "lg", bg: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)" },
            el(
              VStack,
              { spacing: 2, align: "stretch" },
              el(
                HStack,
                { justify: "space-between", align: "center" },
                el(Text, { fontSize: "xs", color: "gray.300", fontWeight: "600" }, t("videoBackground")),
                el(Badge, { colorScheme: vs.active ? "blue" : "gray", variant: "subtle", fontSize: "xs", borderRadius: "full", px: 2 }, vs.active ? t("video") : t("off"))
              ),
              el(
                HStack,
                { spacing: 1, flex: 1 },
                /*pause removed*/
                el(Button, {
                  size: "xs",
                  colorScheme: "red",
                  variant: "ghost",
                  px: 1,
                  fontSize: "11px",
                  onClick: videoKill
                }, t("remove")),
                el(Button, {
                  size: "xs",
                  colorScheme: "green",
                  variant: "ghost",
                  px: 1,
                  fontSize: "11px",
                  onClick: pickVideoFile
                }, t("change"))
              ),
              el(
                Box,
                null,
                el(Text, { fontSize: "xs", color: "rgba(255,255,255,0.4)", mb: 1 }, t("volume") + ": " + Math.round(vs.vol * 100) + "%"),
                el("input", {
                  type: "range",
                  min: 0,
                  max: 1,
                  step: 0.01,
                  defaultValue: vs.vol,
                  onChange: function(e) {
                    videoVolume(parseFloat(e.target.value));
                  },
                  className: "lte-mouse-slider lte-card-slider",
                  style: { width: "100%", "--mouse-accent": accent, "--card-accent": accent }
                })
              )
            )
          )
        )
      );
    };
  }
  function createMouseEffectsWidget(api) {
    ensureMouseUiStyles();
    const React = api.React;
    const el = React.createElement;
    const { Badge, Box, HStack, Switch, Text, VStack } = api.ChakraUI;
    return function MouseEffectsWidget() {
      const host = api.getHostContext();
      const t = useLocale(host);
      const [enabled, setEnabled] = React.useState(_cursorEnabled);
      const [intensity, setIntensity] = React.useState(_cursorIntensity);
      const [isOpen, setIsOpen] = React.useState(false);
      const [effectType, setEffectType] = React.useState(_cursorEffectType);
      const selected = getMouseEffectOption(effectType);
      const accent = selected.colors[1];
      const lineGradient = "linear-gradient(90deg, " + selected.colors[0] + ", " + selected.colors[1] + ", " + selected.colors[2] + ", " + selected.colors[0] + ")";
      function toggleEnabled() {
        const next = !enabled;
        setEnabled(next);
        if (next) startCursorEffects();
        else stopCursorEffects(false);
      }
      function changeIntensity(event) {
        const next = parseInt(event.target.value, 10);
        setIntensity(next);
        setCursorIntensity(next);
      }
      function chooseEffect(nextEffect) {
        setEffectType(nextEffect);
        setCursorEffectType(nextEffect);
        setIsOpen(false);
      }
      return el(
        Box,
        {
          position: "relative",
          p: 3,
          borderRadius: "xl",
          bg: "rgba(8,12,24,0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden"
        },
        el(Box, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          className: "lte-mouse-accent-line " + (enabled ? "" : "lte-mouse-paused"),
          style: { backgroundImage: lineGradient }
        }),
        el(
          VStack,
          { align: "stretch", spacing: 3, position: "relative", zIndex: 1 },
          el(
            HStack,
            { justify: "space-between", align: "center" },
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(
                Box,
                {
                  w: "26px",
                  h: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "md",
                  bg: accent + "33",
                  color: accent,
                  fontSize: "xs",
                  fontWeight: "bold",
                  border: "1px solid " + accent + "66"
                },
                "ME"
              ),
              el(Text, { fontSize: "sm", fontWeight: "bold", color: "gray.100" }, t("mouseEffects"))
            ),
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(Badge, { colorScheme: enabled ? "green" : "gray", variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, enabled ? t("on") : t("off")),
              el(Switch, { isChecked: enabled, colorScheme: "blue", size: "sm", onChange: toggleEnabled })
            )
          ),
          el(
            Box,
            {
              as: "button",
              type: "button",
              className: "lte-mouse-selector",
              w: "100%",
              p: 2,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.045)",
              border: "1px solid " + accent + "66",
              textAlign: "left",
              color: "white",
              onClick: function() {
                setIsOpen(!isOpen);
              },
              "aria-expanded": isOpen
            },
            el(
              HStack,
              { justify: "space-between", align: "center" },
              el(
                HStack,
                { spacing: 2, align: "center" },
                el(Text, { fontSize: "md", w: "24px", textAlign: "center" }, selected.icon),
                el(Text, { fontSize: "sm", fontWeight: "semibold" }, t(selected.labelKey))
              ),
              el(Text, { className: "lte-mouse-chevron " + (isOpen ? "is-open" : ""), fontSize: "sm", color: "gray.400" }, "⌄")
            )
          ),
          isOpen ? el(
            VStack,
            { className: "lte-mouse-options", spacing: 1, align: "stretch" },
            MOUSE_EFFECT_OPTIONS.map(function(option) {
              const active = option.id === effectType;
              return el(
                Box,
                {
                  as: "button",
                  key: option.id,
                  type: "button",
                  className: "lte-mouse-option",
                  w: "100%",
                  p: 2,
                  borderRadius: "lg",
                  border: "1px solid " + (active ? option.colors[1] + "88" : "transparent"),
                  bg: active ? option.colors[1] + "18" : "transparent",
                  color: active ? "white" : "gray.300",
                  textAlign: "left",
                  onClick: function() {
                    chooseEffect(option.id);
                  }
                },
                el(
                  HStack,
                  { justify: "space-between", align: "center" },
                  el(
                    HStack,
                    { spacing: 2, align: "center" },
                    el(Text, { w: "22px", textAlign: "center" }, option.icon),
                    el(Text, { fontSize: "sm" }, t(option.labelKey))
                  ),
                  active ? el(Text, { fontSize: "sm", color: option.colors[1] }, "✓") : null
                )
              );
            })
          ) : null,
          el(Text, { fontSize: "xs", color: "gray.500" }, t(selected.descriptionKey)),
          el(
            HStack,
            { spacing: 2, align: "center" },
            el(Text, { fontSize: "xs", color: "gray.400", minW: "44px" }, t("intensity")),
            el("input", {
              type: "range",
              min: 10,
              max: 100,
              step: 5,
              value: intensity,
              onChange: changeIntensity,
              className: "lte-mouse-slider",
              style: { flex: 1, "--mouse-accent": accent }
            }),
            el(Text, { fontSize: "xs", color: accent, minW: "34px", textAlign: "right" }, intensity + "%")
          )
        )
      );
    };
  }

  // src/pages/settings-page.ts
  function wmoLocaleKey2(type) {
    const m = {
      clear: "wmoClear",
      cloudy: "wmoCloudy",
      rain: "wmoRain",
      snow: "wmoSnow",
      thunder: "wmoThunder",
      fog: "wmoFog",
      windy: "wmoClear"
    };
    return m[type] || "wmoClear";
  }
  function fxLocaleKey2(v) {
    const m = {
      rain: "effectRain",
      ripples: "effectRipples",
      keyboard_glow: "effectKeyboardGlow",
      snow: "effectSnow",
      sand: "effectSandstorm",
      stars: "effectStarrySky",
      aurora: "effectAurora",
      leaves: "effectFallingLeaves",
      sakura: "effectSakura",
      fireflies: "effectFireflies",
      dna: "effectDna",
      ghost: "effectGhost",
      water: "effectUnderwater",
      fire: "effectFire",
      sunset: "effectSunset",
      mc: "effectMinecraft",
      enchanting: "effectEnchanting",
      code: "effectCode",
      blank: "effectBlank",
      dust: "effectDust",
      freeze: "effectFreeze",
      sculk: "effectSculk"
    };
    return m[v] || "effectRain";
  }
  function createSettingsPage(api) {
    ensureMouseUiStyles();
    const React = api.React;
    const { useState, useEffect } = React;
    const el = React.createElement;
    const { Box, VStack, HStack, Text, Badge, Switch, Button } = api.ChakraUI;
    function settingsWeatherPalette(type) {
      const map = {
        clear: ["#ffb52e", "#ffd76a", "#ff8a3d"],
        cloudy: ["#65768d", "#93a5b7", "#c4cfda"],
        rain: ["#315da8", "#5d9bdf", "#b4d8ff"],
        snow: ["#9ebfe4", "#c7e2ff", "#f2fbff"],
        thunder: ["#542d7e", "#8d5ac8", "#d39cff"],
        fog: ["#69727c", "#9ba4ad", "#d1d7dc"],
        wind: ["#3d7d99", "#69bbd2", "#c0f1f7"]
      };
      return map[type] || map.clear;
    }
    function useVidState() {
      const [s, setS] = useState({
        active: window._vactive || false,
        paused: window._vpaused || false,
        vol: window._vvol == null ? 0.5 : window._vvol
      });
      useEffect(function() {
        const id = setInterval(function() {
          setS({
            active: window._vactive || false,
            paused: window._vpaused || false,
            vol: window._vvol == null ? 0.5 : window._vvol
          });
        }, 150);
        return function() {
          clearInterval(id);
        };
      }, []);
      return s;
    }
    return function SettingsPage() {
      const host = api.getHostContext();
      const es = host.state.useExtensionState;
      const vs = useVidState();
      const [locale, setLocale] = es("locale", "en");
      const t = useLocale(host);
      const [city, setCity] = es("cw_city", "");
      const [wInfo, setWInfo] = es("cw_wi", null);
      const [ambientEnabled, setAmbientEnabled] = es("cw_ambient_enabled", true);
      const [input, setInput] = useState(city || "");
      const [loading, setLoading] = useState(false);
      const [tType, setTType] = useState(window._tt || "rain");
      const [tInt, setTInt] = useState(window._ti || 50);
      const [tRunning, setTRunning] = useState(Boolean(window._trun));
      const [themeOpen, setThemeOpen] = useState(false);
      const [showCityWidget, setShowCityWidget] = useState(getLocal("home_show_city_weather", true));
      const [showThemeWidget, setShowThemeWidget] = useState(getLocal("home_show_theme_enhancer", true));
      const [showMouseWidget, setShowMouseWidget] = useState(getLocal("home_show_mouse_effects", true));
      const [homeWidgetsDirty, setHomeWidgetsDirty] = useState(false);
      const visibleHomeWidgetCount = Number(showCityWidget) + Number(showThemeWidget) + Number(showMouseWidget);
      const selectedTheme = getThemeOption(tType);
      const themeAccent = selectedTheme.colors[1];
      const themeGradient = "linear-gradient(90deg, " + selectedTheme.colors[0] + ", " + selectedTheme.colors[1] + ", " + selectedTheme.colors[2] + ", " + selectedTheme.colors[0] + ")";
      const previousThemeLine = useCrossfadeGradient(React, themeGradient);
      const weatherType = wInfo ? mapWMO(wInfo.code) : "clear";
      const weatherColors = settingsWeatherPalette(weatherType);
      const weatherAccent = weatherColors[1];
      const weatherGradient = "linear-gradient(90deg, " + weatherColors[0] + ", " + weatherColors[1] + ", " + weatherColors[2] + ", " + weatherColors[0] + ")";
      const previousWeatherLine = useCrossfadeGradient(React, weatherGradient);
      const videoAccent = "#69e39a";
      const videoGradient = "linear-gradient(90deg, #51c79a, #8af0c0, #d9fff0, #51c79a)";
      const homeWidgetAccent = "#8c6cff";
      const homeWidgetGradient = "linear-gradient(90deg, #52e2ff, #8c6cff, #ff6fc8, #52e2ff)";
      function renderAccentLine(gradient, previous, paused) {
        return el(
          Box,
          { className: "lte-card-accent-shell " + (paused ? "is-paused" : "") },
          previous ? el(Box, {
            key: previous,
            className: "lte-card-line-layer is-previous"
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: previous }
          })) : null,
          el(Box, {
            key: gradient,
            className: "lte-card-line-layer is-current"
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: gradient }
          }))
        );
      }
      function sectionHeader(accent, initials, title, status, control) {
        return el(
          HStack,
          { justify: "space-between", align: "center", spacing: 3 },
          el(
            HStack,
            { spacing: 2, align: "center" },
            el(
              Box,
              {
                w: "28px",
                h: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "md",
                bg: accent + "2b",
                color: accent,
                fontSize: "10px",
                fontWeight: "bold",
                border: "1px solid " + accent + "55"
              },
              initials
            ),
            el(Text, { fontSize: "sm", fontWeight: "bold", color: "gray.100" }, title)
          ),
          el(
            HStack,
            { spacing: 2, align: "center" },
            status ? el(Badge, { colorScheme: status.color, variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, status.text) : null,
            control || null
          )
        );
      }
      function localeButton(code, label) {
        const active = locale === code;
        const accent = code === "zh" ? "#ff9ec4" : "#6fb8ff";
        return el(
          Box,
          {
            as: "button",
            type: "button",
            className: "lte-mouse-selector lte-card-selector",
            px: 3,
            py: 1.5,
            borderRadius: "full",
            bg: active ? accent + "2b" : "rgba(255,255,255,0.035)",
            border: "1px solid " + (active ? accent + "88" : "rgba(255,255,255,0.08)"),
            color: active ? "white" : "gray.400",
            fontWeight: active ? "semibold" : "normal",
            onClick: function() {
              setLocale(code);
            },
            style: {
              "--card-accent": accent,
              "--card-glow": accent + "2e"
            }
          },
          label
        );
      }
      function updateHomeWidgetSetting(setter, value) {
        setter(value);
        setHomeWidgetsDirty(true);
      }
      function applyHomeWidgetVisibility() {
        setLocal("home_show_city_weather", showCityWidget);
        setLocal("home_show_theme_enhancer", showThemeWidget);
        setLocal("home_show_mouse_effects", showMouseWidget);
        setHomeWidgetsDirty(false);
        if (host.actions && typeof host.actions.reloadSelf === "function") {
          host.actions.reloadSelf();
        }
      }
      function homeWidgetRow(accent, initials, title, checked, onChange) {
        return el(
          HStack,
          {
            justify: "space-between",
            align: "center",
            spacing: 3,
            p: 2,
            borderRadius: "lg",
            bg: "rgba(255,255,255,0.035)",
            border: "1px solid " + accent + (checked ? "48" : "1f")
          },
          el(
            HStack,
            { spacing: 2, align: "center" },
            el(
              Box,
              {
                w: "24px",
                h: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "md",
                bg: accent + "25",
                color: accent,
                fontSize: "9px",
                fontWeight: "bold",
                border: "1px solid " + accent + "52"
              },
              initials
            ),
            el(Text, { fontSize: "sm", color: checked ? "gray.100" : "gray.400", fontWeight: "semibold" }, title)
          ),
          el(Switch, {
            isChecked: checked,
            colorScheme: "blue",
            size: "sm",
            onChange: function() {
              onChange();
            },
            "aria-label": title
          })
        );
      }
      useEffect(function() {
        const id = setInterval(function() {
          setTRunning(Boolean(window._trun));
          const nextType = window._tt || "rain";
          const nextInt = window._ti || 50;
          setTType(function(previous) {
            return previous === nextType ? previous : nextType;
          });
          setTInt(function(previous) {
            return previous === nextInt ? previous : nextInt;
          });
        }, 250);
        return function() {
          clearInterval(id);
        };
      }, []);
      function searchCitySetting() {
        var v = input.trim();
        if (!v) return;
        setLoading(true);
        setWInfo(null);
        setCity(v);
        try {
          localStorage.setItem("lte-cw_city", JSON.stringify(v));
        } catch (e) {
        }
        getCityWeather(v, function(d) {
          setLoading(false);
          if (d) {
            setWInfo(d);
            var weaType = mapWMO(d.code), inten = mapWMOIntensity(d.code);
          }
        });
      }
      function changeThemeType(v) {
        setTType(v);
        window._tt = v;
        _tt = v;
        if (v === "blank") {
          stopThemeEffects();
          setTRunning(false);
        } else if (window._trun) {
          updateThemeEffects(v);
          setTRunning(true);
        }
        persistThemePreferences();
      }
      function changeThemeInt(v) {
        var n = parseInt(v);
        setTInt(n);
        window._ti = n;
        _ti = n;
        if (window._trun) updateThemeEffects(null, n);
        persistThemePreferences();
      }
      function toggleTheme() {
        if (tRunning) {
          stopThemeEffects();
          setTRunning(false);
        } else {
          if (tType === "blank") return;
          startThemeEffects(tType, tInt);
          setTRunning(Boolean(window._trun));
        }
      }
      return el(
        Box,
        {
          p: { base: 4, md: 6 },
          borderRadius: "2xl",
          bg: "rgba(8,12,24,0.95)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.08)",
          maxW: "1120px",
          w: "100%",
          mx: "auto"
        },
        el(
          VStack,
          { spacing: 4, align: "stretch" },
          el(
            HStack,
            { justify: "space-between", align: "center", spacing: 3 },
            el(
              VStack,
              { spacing: 1, align: "flex-start" },
              el(Text, { fontSize: "lg", fontWeight: "bold", color: "white" }, t("themeEnhancer")),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("themeEnhancerDesc"))
            ),
            el(Badge, { colorScheme: "purple", variant: "subtle", borderRadius: "full", fontSize: "xs", px: 3 }, "v2.1.0")
          ),
          // ===== Language Selector =====
          el(
            Box,
            { p: 2.5, borderRadius: "xl", bg: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" },
            el(
              HStack,
              { spacing: 3, align: "center", justify: "space-between", flexWrap: "wrap" },
              el(Text, { fontSize: "sm", color: "gray.300", fontWeight: "600" }, "Language / 语言"),
              el(
                HStack,
                { spacing: 2, flexWrap: "wrap" },
                localeButton("en", "English"),
                localeButton("zh", "中文")
              )
            )
          ),
          // ===== Section: Home Widget Visibility =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid " + homeWidgetAccent + "3d",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": homeWidgetAccent }
            },
            renderAccentLine(homeWidgetGradient, null, false),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                homeWidgetAccent,
                "HW",
                t("homeWidgets"),
                { color: visibleHomeWidgetCount > 0 ? "purple" : "gray", text: visibleHomeWidgetCount + " / 3" }
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("homeWidgetsHint")),
              homeWidgetRow(
                "#69bbd2",
                "CW",
                t("cityWeather"),
                showCityWidget,
                function() {
                  updateHomeWidgetSetting(setShowCityWidget, !showCityWidget);
                }
              ),
              homeWidgetRow(
                themeAccent,
                "TE",
                t("themeEnhancer"),
                showThemeWidget,
                function() {
                  updateHomeWidgetSetting(setShowThemeWidget, !showThemeWidget);
                }
              ),
              homeWidgetRow(
                "#52e2ff",
                "ME",
                t("mouseEffects"),
                showMouseWidget,
                function() {
                  updateHomeWidgetSetting(setShowMouseWidget, !showMouseWidget);
                }
              ),
              visibleHomeWidgetCount === 0 ? el(Text, { fontSize: "xs", color: "orange.300" }, t("homeWidgetsAllHidden")) : null,
              visibleHomeWidgetCount === 1 ? el(Text, { fontSize: "xs", color: "yellow.300" }, t("homeWidgetsSingleWarning")) : null,
              el(
                HStack,
                { justify: "space-between", align: "center", spacing: 3, flexWrap: "wrap" },
                homeWidgetsDirty ? el(Text, { fontSize: "xs", color: "blue.300" }, t("homeWidgetsPending")) : null,
                el(
                  Box,
                  {
                    as: "button",
                    type: "button",
                    className: "lte-mouse-selector lte-card-selector",
                    px: 3,
                    py: 1.5,
                    borderRadius: "lg",
                    bg: homeWidgetsDirty ? homeWidgetAccent + "2b" : "rgba(255,255,255,0.035)",
                    border: "1px solid " + (homeWidgetsDirty ? homeWidgetAccent + "88" : "rgba(255,255,255,0.08)"),
                    color: homeWidgetsDirty ? "white" : "gray.500",
                    cursor: homeWidgetsDirty ? "pointer" : "default",
                    disabled: !homeWidgetsDirty,
                    fontSize: "xs",
                    fontWeight: "semibold",
                    onClick: applyHomeWidgetVisibility,
                    style: {
                      "--card-accent": homeWidgetAccent,
                      "--card-glow": homeWidgetAccent + "2e"
                    }
                  },
                  t("homeWidgetsApply")
                )
              )
            )
          ),
          // ===== Section: City Weather =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid " + weatherAccent + "38",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": weatherAccent }
            },
            renderAccentLine(weatherGradient, previousWeatherLine, !(wInfo && ambientEnabled)),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                weatherAccent,
                "CW",
                t("cityWeather"),
                { color: wInfo && ambientEnabled ? "green" : "gray", text: wInfo && ambientEnabled ? t("on") : t("off") },
                el(Switch, {
                  isChecked: Boolean(ambientEnabled),
                  colorScheme: "blue",
                  size: "sm",
                  isDisabled: !wInfo,
                  onChange: function() {
                    setAmbientEnabled(!ambientEnabled);
                  },
                  "aria-label": t("dynamicAmbience")
                })
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("ambienceHint")),
              el(
                HStack,
                { spacing: 2 },
                el("input", {
                  placeholder: t("typeCityName"),
                  value: input,
                  onInput: function(e) {
                    setInput(e.target.value);
                  },
                  onKeyDown: function(e) {
                    if (e.key === "Enter") searchCitySetting();
                  },
                  style: {
                    flex: 1,
                    minWidth: 0,
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.07)",
                    color: "#e2e8f0",
                    border: "1px solid " + weatherAccent + "55",
                    fontSize: "14px",
                    outline: "none"
                  }
                }),
                el(
                  Box,
                  {
                    as: "button",
                    type: "button",
                    className: "lte-mouse-selector lte-card-selector",
                    onClick: searchCitySetting,
                    disabled: !input.trim() || loading,
                    style: {
                      width: "42px",
                      height: "36px",
                      borderRadius: "10px",
                      background: weatherAccent + "22",
                      border: "1px solid " + weatherAccent + "66",
                      color: weatherAccent,
                      cursor: !input.trim() || loading ? "default" : "pointer",
                      opacity: !input.trim() || loading ? 0.55 : 1,
                      "--card-accent": weatherAccent,
                      "--card-glow": weatherAccent + "2e"
                    }
                  },
                  loading ? "..." : "🔍"
                )
              ),
              wInfo ? el(
                HStack,
                {
                  spacing: { base: 2, md: 5 },
                  align: "center",
                  p: 2.5,
                  borderRadius: "lg",
                  bg: "rgba(255,255,255,0.035)",
                  border: "1px solid " + weatherAccent + (ambientEnabled ? "42" : "22"),
                  flexWrap: "wrap"
                },
                el(
                  VStack,
                  { spacing: 0, align: "flex-start" },
                  el(Text, { fontSize: "xs", color: "gray.400", fontWeight: "600" }, city || ""),
                  el(Text, {
                    fontSize: "2xl",
                    fontWeight: "bold",
                    lineHeight: "1.15",
                    color: weatherAccent,
                    textShadow: ambientEnabled ? "0 0 10px " + weatherAccent + "55" : "none",
                    transition: "text-shadow 180ms ease"
                  }, wInfo.temp + "°C")
                ),
                el(
                  HStack,
                  { spacing: 4, flexWrap: "wrap" },
                  el(Text, { fontSize: "xs", color: "gray.400" }, "💧 " + t("humidity") + ": " + wInfo.humi + "%"),
                  el(Text, { fontSize: "xs", color: "gray.400" }, "💨 " + t("wind") + ": " + wInfo.wind + " km/h"),
                  wInfo.feels ? el(Text, { fontSize: "xs", color: "gray.400" }, "🌡 " + t("feels") + ": " + wInfo.feels + "°C") : null,
                  el(Text, { fontSize: "xs", color: weatherAccent }, "☁ " + t(wmoLocaleKey2(weatherType)) + " · Code " + wInfo.code)
                )
              ) : el(
                Text,
                { fontSize: "sm", color: "gray.500", py: 2 },
                city ? t("loading") : t("searchCity")
              )
            )
          ),
          // ===== Section: Video Background =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid " + videoAccent + "32",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": videoAccent }
            },
            renderAccentLine(videoGradient, null, false),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                videoAccent,
                "VB",
                t("videoBackground"),
                { color: vs.active ? "green" : "gray", text: vs.active ? t("video") : t("off") }
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("videoLayer")),
              vs.active ? el(
                VStack,
                { spacing: 2, align: "stretch" },
                el(
                  HStack,
                  { spacing: 2 },
                  el(Button, {
                    size: "xs",
                    colorScheme: "blue",
                    flex: 1,
                    borderRadius: "9px",
                    onClick: function() {
                      if (window._vpaused) videoPlay();
                      else videoPause();
                    }
                  }, vs.paused ? "▶" : "⏸"),
                  el(Button, { size: "xs", colorScheme: "green", flex: 1, borderRadius: "9px", onClick: pickVideoFile }, t("change")),
                  el(Button, { size: "xs", colorScheme: "red", flex: 1, borderRadius: "9px", onClick: videoKill }, t("remove"))
                ),
                el(
                  HStack,
                  { spacing: 2, align: "center" },
                  el(Text, { fontSize: "xs", color: "gray.400", minW: "92px" }, t("volume") + " " + Math.round(vs.vol * 100) + "%"),
                  el("input", {
                    type: "range",
                    min: 0,
                    max: 1,
                    step: 0.01,
                    defaultValue: vs.vol,
                    onChange: function(e) {
                      videoVolume(parseFloat(e.target.value));
                    },
                    className: "lte-mouse-slider lte-card-slider",
                    style: { flex: 1, "--mouse-accent": videoAccent, "--card-accent": videoAccent }
                  })
                )
              ) : el(
                Box,
                {
                  as: "button",
                  type: "button",
                  className: "lte-mouse-selector lte-card-selector",
                  w: "100%",
                  px: 3,
                  py: 2,
                  borderRadius: "lg",
                  bg: "rgba(105,227,154,0.08)",
                  border: "1px solid " + videoAccent + "4d",
                  onClick: pickVideoFile,
                  style: {
                    "--card-accent": videoAccent,
                    "--card-glow": videoAccent + "26"
                  }
                },
                el(
                  HStack,
                  { justify: "space-between", align: "center", spacing: 3 },
                  el(
                    HStack,
                    { spacing: 2, align: "center" },
                    el(Text, { fontSize: "lg" }, "📁"),
                    el(Text, { fontSize: "sm", fontWeight: "semibold", color: "gray.200" }, t("selectVideo"))
                  ),
                  el(Text, { fontSize: "xs", color: "gray.500" }, "MP4 / WebM / OGG")
                )
              )
            )
          ),
          // ===== Section: Theme Particle Effects =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid " + themeAccent + "42",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": themeAccent }
            },
            renderAccentLine(themeGradient, previousThemeLine, !tRunning),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                themeAccent,
                "TP",
                t("themeParticles"),
                { color: tRunning ? "green" : "gray", text: tRunning ? t("running") : t("stopped") },
                el(Switch, {
                  isChecked: tRunning,
                  colorScheme: "blue",
                  size: "sm",
                  isDisabled: tType === "blank",
                  onChange: toggleTheme,
                  "aria-label": t("themeParticles")
                })
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("themeSwitchHint")),
              el(
                Box,
                {
                  as: "button",
                  type: "button",
                  className: "lte-mouse-selector lte-card-selector",
                  w: "100%",
                  p: 2.5,
                  borderRadius: "xl",
                  bg: "rgba(255,255,255,0.045)",
                  border: "1px solid " + themeAccent + "66",
                  textAlign: "left",
                  color: "white",
                  onClick: function() {
                    setThemeOpen(!themeOpen);
                  },
                  "aria-expanded": themeOpen,
                  style: {
                    "--card-accent": themeAccent,
                    "--card-glow": themeAccent + "2e"
                  }
                },
                el(
                  HStack,
                  { justify: "space-between", align: "center" },
                  el(Text, { fontSize: "sm", fontWeight: "semibold" }, t(fxLocaleKey2(tType))),
                  el(Text, { className: "lte-mouse-chevron lte-card-chevron " + (themeOpen ? "is-open" : ""), fontSize: "sm", color: "gray.400" }, "⌄")
                )
              ),
              themeOpen ? el(
                VStack,
                { className: "lte-mouse-options lte-card-options", spacing: 1, align: "stretch", mt: 1 },
                THEME_OPTIONS.map(function(option) {
                  const active = option.v === tType;
                  return el(
                    Box,
                    {
                      as: "button",
                      key: option.v,
                      type: "button",
                      className: "lte-mouse-option lte-card-option",
                      w: "100%",
                      p: 2,
                      borderRadius: "lg",
                      border: "1px solid " + (active ? option.colors[1] + "88" : "transparent"),
                      bg: active ? option.colors[1] + "18" : "transparent",
                      color: active ? "white" : "gray.300",
                      textAlign: "left",
                      onClick: function() {
                        changeThemeType(option.v);
                        setThemeOpen(false);
                      }
                    },
                    el(
                      HStack,
                      { justify: "space-between", align: "center" },
                      el(Text, { fontSize: "sm" }, t(fxLocaleKey2(option.v))),
                      active ? el(Text, { fontSize: "sm", color: option.colors[1] }, "✓") : null
                    )
                  );
                })
              ) : null,
              el(
                HStack,
                { spacing: 2, align: "center" },
                el(Text, { fontSize: "xs", color: "gray.400", minW: "44px" }, t("intensity")),
                el("input", {
                  type: "range",
                  min: 10,
                  max: 100,
                  step: 5,
                  value: tInt,
                  onChange: function(e) {
                    changeThemeInt(e.target.value);
                  },
                  className: "lte-mouse-slider lte-card-slider",
                  style: { flex: 1, "--mouse-accent": themeAccent, "--card-accent": themeAccent }
                }),
                el(Text, { fontSize: "xs", color: themeAccent, minW: "34px", textAlign: "right" }, tInt + "%")
              )
            )
          ),
          // ===== Section: Help =====
          el(
            Box,
            { p: 3, borderRadius: "lg", bg: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" },
            el(
              VStack,
              { spacing: 1, align: "stretch" },
              el(Text, { fontSize: "xs", color: "gray.500" }, t("version") + " 2.1.0"),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("author") + ": hemekewayoshino"),
              el(Box, { h: "1px", bg: "rgba(255,255,255,0.06)", my: 1 }),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("layerOrder"))
            )
          )
        )
      );
    };
  }

  // src/index.ts
  function getToken() {
    var _a, _b, _c;
    let t = ((_b = (_a = document.currentScript) == null ? void 0 : _a.dataset) == null ? void 0 : _b.extensionToken) || "";
    if (t) return t;
    const scripts = document.querySelectorAll("script");
    for (let i = 0; i < scripts.length; i++) {
      const tok = (_c = scripts[i].dataset) == null ? void 0 : _c.extensionToken;
      if (tok) return tok;
    }
    return "";
  }
  var TOKEN = getToken();
  if (typeof window.registerExtension !== "function") {
    throw new Error("SJMCL host is unavailable");
  }
  window.registerExtension(function(api) {
    try {
      const u = api.resolveAssetUrl("assets/galactic.ttf");
      const f = new FontFace("GalacticSGA", "url(" + u + ")");
      f.load().then(function() {
        document.fonts.add(f);
      }).catch(function() {
      });
    } catch (e) {
    }
    try {
      const u = api.resolveAssetUrl("assets/Minecraft.ttf");
      const f = new FontFace("MinecraftPixel", "url(" + u + ")");
      f.load().then(function() {
        document.fonts.add(f);
      }).catch(function() {
      });
    } catch (e) {
    }
    window._ltePI = {};
    function lp(key, path) {
      var i2 = new Image();
      i2.src = api.resolveAssetUrl(path);
      window._ltePI[key] = i2;
    }
    lp("snow", "assets/particles/snow.png");
    lp("flame", "assets/particles/flame.png");
    for (var i = 0; i < 11; i++) lp("sculk_soul_" + i, "assets/particles/sculk/sculk_soul_" + i + ".png");
    for (var i = 0; i < 7; i++) lp("sculk_charge_" + i, "assets/particles/sculk/sculk_charge_" + i + ".png");
    for (var i = 0; i < 4; i++) lp("sculk_charge_pop_" + i, "assets/particles/sculk/sculk_charge_pop_" + i + ".png");
    syncThemeGlobals();
    restoreCursorEffects();
    if (!isStandaloneWindow()) {
      window.setTimeout(function() {
        syncThemeGlobals();
        if (getLocal("th_enabled", false)) startThemeEffects(_tt, _ti);
        restoreVideoBackground();
      }, 0);
    }
    const homeWidgets = [];
    if (getLocal("home_show_city_weather", true)) {
      homeWidgets.push({
        key: "city-weather",
        title: "City Weather",
        description: "Real-time weather with an optional dynamic ambience",
        icon: "cloud-sun",
        Component: createCityWeatherWidget(api)
      });
    }
    if (getLocal("home_show_theme_enhancer", true)) {
      homeWidgets.push({
        key: "theme-enhancer",
        title: "Theme Enhancer",
        description: "Video background + 21 custom particle effects",
        icon: "palette",
        Component: createThemeEnhancerWidget(api)
      });
    }
    if (getLocal("home_show_mouse_effects", true)) {
      homeWidgets.push({
        key: "mouse-effects",
        title: "Mouse Effects",
        description: "Cursor stardust and pointer feedback",
        icon: "mouse-pointer",
        defaultWidth: 320,
        minWidth: 260,
        Component: createMouseEffectsWidget(api)
      });
    }
    return {
      homeWidgets,
      settingsPage: {
        Component: createSettingsPage(api)
      },
      dispose: function() {
        stopThemeEffects(true);
        stopCursorEffects(true);
        removeKeyboardGlowListener();
        clearVideoElement();
        _vactive = false;
        if (_videoRestoreTimer) {
          window.clearTimeout(_videoRestoreTimer);
          _videoRestoreTimer = null;
        }
        removeBackgroundHost();
      }
    };
  }, TOKEN);
})();
