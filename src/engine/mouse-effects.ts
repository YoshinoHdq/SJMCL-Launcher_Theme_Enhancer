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
  var _cursorCssW = 0;
  var _cursorCssH = 0;
  var _cursorDpr = 1;
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
    _cursorCssW = width;
    _cursorCssH = height;
    _cursorDpr = sizeCanvas(_cursorCanvas, width, height).dpr;
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
      hue: (x / Math.max(1, _cursorCssW) * 250 + nowColor) % 360,
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
    const x = Math.max(0, Math.min(_cursorCssW, event.clientX - rect.left));
    const y = Math.max(0, Math.min(_cursorCssH, event.clientY - rect.top));
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
    ctx.setTransform(_cursorDpr, 0, 0, _cursorDpr, 0, 0);
    ctx.clearRect(0, 0, _cursorCssW, _cursorCssH);
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

  