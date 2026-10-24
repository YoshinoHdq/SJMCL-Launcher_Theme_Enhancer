var CURSOR_CANVAS_ID = "lte-cursor-effects";
  var MOUSE_EFFECT_OPTIONS = [
    { id: "cursor_stardust", icon: "✨", labelKey: "cursorStardust", descriptionKey: "mouseEffectsDesc", colors: ["#52e2ff", "#8c6cff", "#ff6fc8"] },
    { id: "comet", icon: "☄️", labelKey: "mouseCometTrail", descriptionKey: "mouseCometDesc", colors: ["#d9fbff", "#55aaff", "#8b5cf6"] },
    { id: "sparkle", icon: "✦", labelKey: "mouseSparkleTrail", descriptionKey: "mouseSparkleDesc", colors: ["#fff2a8", "#62e4ed", "#c7a7ff"] },
    { id: "sakura", icon: "🌸", labelKey: "mouseSakuraTrail", descriptionKey: "mouseSakuraDesc", colors: ["#ffd6e2", "#ff91b8", "#fff1e8"] },
    { id: "snowflake", icon: "❄️", labelKey: "mouseSnowflakeTrail", descriptionKey: "mouseSnowflakeDesc", colors: ["#f4ffff", "#a9ddff", "#8495ff"] },
    { id: "glitch", icon: "▦", labelKey: "mouseGlitchTrail", descriptionKey: "mouseGlitchDesc", colors: ["#47f3ff", "#ff4fcf", "#7b5cff"] },
    { id: "note", icon: "🎵", labelKey: "mouseNoteTrail", descriptionKey: "mouseNoteDesc", colors: ["#b6c9ff", "#8b9cff", "#ff9ecb"] },
    { id: "feather", icon: "🪶", labelKey: "mouseFeatherTrail", descriptionKey: "mouseFeatherDesc", colors: ["#f7fbff", "#b7d3ff", "#ffd9ea"] },
    { id: "rune", icon: "🪄", labelKey: "mouseRuneTrail", descriptionKey: "mouseRuneDesc", colors: ["#c4a8ff", "#a070ff", "#75e3ff"] },
    { id: "enderman", icon: "🟪", labelKey: "mouseEndermanTrail", descriptionKey: "mouseEndermanDesc", colors: ["#e0b3ff", "#b45cff", "#6a2ecc"] },
    { id: "shard", icon: "💠", labelKey: "mouseShardTrail", descriptionKey: "mouseShardDesc", colors: ["#dbe9ff", "#9dd2ff", "#e9c9ff"] },
    { id: "arc", icon: "⚡", labelKey: "mouseArcTrail", descriptionKey: "mouseArcDesc", colors: ["#c9e8ff", "#7bc4ff", "#b18cff"] },
    { id: "confetti", icon: "🎊", labelKey: "mouseConfettiTrail", descriptionKey: "mouseConfettiDesc", colors: ["#ffe08a", "#ff8fb8", "#8fd6ff"] }
  ];
  function getMouseEffectOption(id) {
    return MOUSE_EFFECT_OPTIONS.find(function(option) {
      return option.id === id;
    }) || MOUSE_EFFECT_OPTIONS[0];
  }
  var CLICK_EFFECT_OPTIONS = [
    { id: "click_ripple", icon: "◎", labelKey: "clickRipple", descriptionKey: "clickRippleDesc", colors: ["#9fe9ff", "#5fd0ff", "#a78bfa"] },
    { id: "click_sparks", icon: "✹", labelKey: "clickSparks", descriptionKey: "clickSparksDesc", colors: ["#ffe08a", "#ff9a4d", "#ff5f7e"] },
    { id: "click_runes", icon: "🪄", labelKey: "clickRunes", descriptionKey: "clickRunesDesc", colors: ["#d6b8ff", "#a070ff", "#75e3ff"] },
    { id: "click_freeze", icon: "❄️", labelKey: "clickFreeze", descriptionKey: "clickFreezeDesc", colors: ["#e0f7ff", "#8fd8ff", "#6a9bff"] },
    { id: "click_magnetic", icon: "🧲", labelKey: "clickMagnetic", descriptionKey: "clickMagneticDesc", colors: ["#c6d2ff", "#8fa8ff", "#b06bff"] },
    { id: "click_shatter", icon: "🪞", labelKey: "clickShatter", descriptionKey: "clickShatterDesc", colors: ["#e8f4ff", "#9fd2ff", "#e9c9ff"] }
  ];
  function getClickEffectOption(id) {
    return CLICK_EFFECT_OPTIONS.find(function(option) {
      return option.id === id;
    }) || CLICK_EFFECT_OPTIONS[0];
  }
  var _clickEffectType = getClickEffectOption(getLocal("click_effect_type", "click_ripple")).id;
  var _clickEnabled = false;
  var _clickIntensity = 50;
  var _clickParticles = [];
  var _clickHandler = null;
  var MOUSE_RUNE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var MOUSE_SHARD_SHAPES = null;
  function mouseShardShapes() {
    if (MOUSE_SHARD_SHAPES) return MOUSE_SHARD_SHAPES;
    MOUSE_SHARD_SHAPES = [];
    for (var s = 0; s < 3; s++) {
      var count = 3 + s;
      var verts = [];
      for (var i = 0; i < count; i++) {
        var a = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        var r = 0.55 + Math.random() * 0.45;
        verts.push([Math.cos(a) * r, Math.sin(a) * r]);
      }
      MOUSE_SHARD_SHAPES.push(verts);
    }
    return MOUSE_SHARD_SHAPES;
  }
  function mouseArcPoints(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var len = Math.hypot(dx, dy) || 1;
    var nx = -dy / len;
    var ny = dx / len;
    var segs = 5 + Math.floor(Math.random() * 4);
    var pts = [];
    for (var i = 0; i <= segs; i++) {
      var t = i / segs;
      var jitter = i === 0 || i === segs ? 0 : (Math.random() - 0.5) * 16;
      pts.push({ x: x1 + dx * t + nx * jitter, y: y1 + dy * t + ny * jitter });
    }
    return pts;
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
    if (effect === "note" && Math.random() < 0.38) return;
    if (effect === "feather" && Math.random() < 0.35) return;
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
    if (effect === "note") {
      const chord = Math.random() < 0.08 ? 3 : 1;
      for (let n = 0; n < chord; n++) {
        const roll = Math.random();
        const hue = roll < 0.52 ? 190 + Math.random() * 24 : roll < 0.9 ? 286 + Math.random() * 32 : 46 + Math.random() * 10;
        _cursorParticles.push({
          x: x + (n === 0 ? 0 : (Math.random() - 0.5) * 16),
          y: y + (n === 0 ? 0 : (Math.random() - 0.5) * 12),
          vx: dx * 0.01 + (Math.random() - 0.5) * 0.24,
          vy: -0.14 - Math.random() * 0.26,
          size: (7 + Math.random() * 5) * (n === 0 ? 1 : 0.85) * (0.8 + strength * 0.35),
          hue: hue,
          age: 0,
          life: 28 + Math.floor(Math.random() * 18),
          rot: (Math.random() - 0.5) * 0.6,
          spin: (Math.random() - 0.5) * 0.025,
          sway: 0.15 + Math.random() * 0.32,
          phase: Math.random() * Math.PI * 2,
          glyph: Math.random() < 0.62 ? 0 : 1
        });
      }
      return;
    }
    if (effect === "feather") {
      _cursorParticles.push({
        x, y,
        vx: dx * 0.008 + (Math.random() - 0.5) * 0.22,
        vy: 0.02 + Math.random() * 0.1,
        size: (10 + Math.random() * 7) * (0.8 + strength * 0.35),
        hue: Math.random() < 0.7 ? 200 + Math.random() * 24 : 322 + Math.random() * 18,
        age: 0,
        life: 30 + Math.floor(Math.random() * 18),
        rot: (Math.random() - 0.5) * 1.6,
        spin: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.02 + Math.random() * 0.02,
        sway: 0.15 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      });
      return;
    }
    if (effect === "rune") {
      if (Math.random() < 0.4) return;
      _cursorParticles.push({
        x, y,
        vx: dx * 0.006 + (Math.random() - 0.5) * 0.16,
        vy: -0.06 - Math.random() * 0.12,
        size: (10 + Math.random() * 6) * (0.8 + strength * 0.3),
        hue: 268 + Math.random() * 36,
        age: 0,
        life: 24 + Math.floor(Math.random() * 16),
        rot: (Math.random() - 0.5) * 0.6,
        spin: (Math.random() - 0.5) * 0.025,
        sway: 0.12 + Math.random() * 0.24,
        phase: Math.random() * Math.PI * 2,
        glyph: MOUSE_RUNE_GLYPHS[Math.floor(Math.random() * MOUSE_RUNE_GLYPHS.length)]
      });
      return;
    }
    if (effect === "enderman") {
      _cursorParticles.push({
        x, y,
        vx: dx * 0.006 + (Math.random() - 0.5) * 0.2,
        vy: -0.02 - Math.random() * 0.14,
        size: (3 + Math.random() * 3.2) * (0.8 + strength * 0.4),
        hue: 278 + Math.random() * 34,
        age: 0,
        life: 16 + Math.floor(Math.random() * 14),
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.06
      });
      return;
    }
    if (effect === "shard") {
      if (Math.random() < 0.45) return;
      var shapes = mouseShardShapes();
      _cursorParticles.push({
        x, y,
        vx: dx * 0.008 + (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.3) * 0.12,
        size: (6 + Math.random() * 5) * (0.8 + strength * 0.4),
        hue: Math.random() < 0.72 ? 200 + Math.random() * 22 : 286 + Math.random() * 20,
        age: 0,
        life: 20 + Math.floor(Math.random() * 16),
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.07,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        phase: Math.random() * Math.PI * 2
      });
      return;
    }
    if (effect === "confetti") {
      if (Math.random() < 0.4) return;
      _cursorParticles.push({
        x, y,
        vx: dx * 0.008 + (Math.random() - 0.5) * 0.35,
        vy: 0.02 + Math.random() * 0.16,
        width: (5 + Math.random() * 4) * (0.8 + strength * 0.35),
        height: (2.6 + Math.random() * 2.6) * (0.8 + strength * 0.35),
        hue: [48, 330, 200, 160][Math.floor(Math.random() * 4)] + Math.random() * 18,
        age: 0,
        life: 34 + Math.floor(Math.random() * 22),
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.12,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.05 + Math.random() * 0.05,
        sway: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
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
    if (_cursorEffectType === "arc") {
      var main = mouseArcPoints(fromX, fromY, toX, toY);
      var branch = null;
      if (Math.random() < 0.7 && main.length > 4) {
        var bi = 2 + Math.floor(Math.random() * (main.length - 4));
        var bp = main[bi];
        var ex = bp.x + (Math.random() - 0.5) * 48;
        var ey = bp.y + (Math.random() - 0.5) * 48;
        branch = [
          { x: bp.x, y: bp.y },
          { x: (bp.x + ex) * 0.5 + (Math.random() - 0.5) * 12, y: (bp.y + ey) * 0.5 + (Math.random() - 0.5) * 12 },
          { x: ex, y: ey }
        ];
      }
      _cursorParticles.push({
        kind: "arc",
        main: main,
        branch: branch,
        age: 0,
        life: 10 + Math.floor(Math.random() * 6),
        hue: 192 + Math.random() * 42,
        width: 1.2 + Math.random() * 1.0
      });
      while (_cursorParticles.length > 26) _cursorParticles.shift();
      queueCursorAnimation();
      return;
    }
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
    const limit = _cursorEffectType === "comet" ? 34 : _cursorEffectType === "snowflake" ? 120 : _cursorEffectType === "glitch" ? 150 : _cursorEffectType === "note" ? 110 : _cursorEffectType === "feather" ? 80 : _cursorEffectType === "rune" ? 110 : _cursorEffectType === "enderman" ? 150 : _cursorEffectType === "shard" ? 90 : _cursorEffectType === "confetti" ? 90 : 220;
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
      } else if (_cursorEffectType === "note" || _cursorEffectType === "feather") {
        d.phase += 0.05;
        d.x += Math.sin(d.phase) * d.sway * 0.2;
        d.rot += d.spin;
        if (_cursorEffectType === "feather") {
          d.flip += d.flipSpeed;
          d.y += 0.03;
        }
        d.vx *= 0.96;
        d.vy *= 0.96;
      } else if (_cursorEffectType === "rune") {
        d.phase += 0.06;
        d.x += Math.sin(d.phase) * d.sway * 0.2;
        d.rot += d.spin;
        d.vx *= 0.96;
        d.vy *= 0.985;
      } else if (_cursorEffectType === "enderman") {
        d.rot += d.spin;
        d.x += (Math.random() - 0.5) * 0.3;
        d.vx *= 0.97;
        d.vy *= 0.99;
      } else if (_cursorEffectType === "shard") {
        d.rot += d.spin;
        d.vx *= 0.97;
        d.vy *= 0.97;
      } else if (_cursorEffectType === "confetti") {
        d.phase += 0.08;
        d.x += Math.sin(d.phase) * d.sway * 0.25;
        d.flip += d.flipSpeed;
        d.rot += d.spin;
        d.vy += 0.006;
      } else {
        d.vx *= 0.965;
        d.vy *= 0.965;
      }
      if (d.kind === "arc") {
        const fade = Math.pow(lifeRatio, 1.6);
        const polys = d.branch ? [d.main, d.branch] : [d.main];
        for (let pi = 0; pi < polys.length; pi++) {
          const pts = polys[pi];
          if (!pts || pts.length < 2) continue;
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let pj = 1; pj < pts.length; pj++) ctx.lineTo(pts[pj].x, pts[pj].y);
          ctx.strokeStyle = "hsla(" + d.hue + ",100%,70%," + alpha * 0.28 + ")";
          ctx.lineWidth = d.width * 4.4;
          ctx.stroke();
          ctx.strokeStyle = "hsla(" + d.hue + ",100%,88%," + alpha + ")";
          ctx.lineWidth = d.width;
          ctx.stroke();
          ctx.fillStyle = "hsla(" + d.hue + ",100%,94%," + fade * 0.5 + ")";
          ctx.beginPath();
          ctx.arc(pts[pts.length - 1].x, pts[pts.length - 1].y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        continue;
      }
      if (_cursorEffectType === "rune") {
        const size = d.size * (0.7 + lifeRatio * 0.45);
        ctx.save();
        ctx.font = "600 " + size + "px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(d.x + Math.sin(d.phase) * d.sway * 2, d.y);
        ctx.rotate(d.rot);
        const runeGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.8);
        runeGlow.addColorStop(0, "hsla(" + d.hue + ",100%,82%," + alpha * 0.14 + ")");
        runeGlow.addColorStop(1, "hsla(" + d.hue + ",100%,70%,0)");
        ctx.fillStyle = runeGlow;
        ctx.fillRect(-size * 1.8, -size * 1.8, size * 3.6, size * 3.6);
        ctx.fillStyle = "hsla(" + d.hue + ",100%,82%," + alpha * 0.2 + ")";
        ctx.fillText(d.glyph, 0, 0);
        ctx.font = "600 " + (size * 1.35) + "px monospace";
        ctx.fillStyle = "hsla(" + d.hue + ",100%,80%," + alpha * 0.22 + ")";
        ctx.fillText(d.glyph, 0, 0);
        ctx.font = "600 " + size + "px monospace";
        ctx.fillStyle = "hsla(" + d.hue + ",100%,90%," + alpha + ")";
        ctx.fillText(d.glyph, 0, 0);
        ctx.restore();
        continue;
      }
      if (_cursorEffectType === "enderman") {
        const size = d.size * (0.8 + lifeRatio * 0.3);
        ctx.strokeStyle = "hsla(" + d.hue + ",100%,76%," + alpha * 0.35 + ")";
        ctx.lineWidth = Math.max(0.5, size * 0.6);
        ctx.beginPath();
        ctx.moveTo(d.x - d.vx * 4, d.y - d.vy * 4);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.fillStyle = "hsla(" + d.hue + ",100%,80%," + alpha * 0.2 + ")";
        ctx.beginPath();
        ctx.arc(0, 0, size * 2.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + d.hue + ",100%,74%," + alpha + ")";
        ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
        ctx.fillStyle = "hsla(" + (d.hue + 18) + ",100%,90%," + alpha * 0.8 + ")";
        ctx.fillRect(-size * 0.5, -size * 0.5, size, size * 0.28);
        ctx.restore();
        continue;
      }
      if (_cursorEffectType === "shard") {
        const size = d.size * (0.75 + lifeRatio * 0.35);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.beginPath();
        ctx.moveTo(d.shape[0][0] * size, d.shape[0][1] * size);
        for (let si = 1; si < d.shape.length; si++) ctx.lineTo(d.shape[si][0] * size, d.shape[si][1] * size);
        ctx.closePath();
        const shardGrad = ctx.createLinearGradient(-size, -size, size, size);
        shardGrad.addColorStop(0, "hsla(" + d.hue + ",60%,96%," + alpha * 0.45 + ")");
        shardGrad.addColorStop(0.5, "hsla(" + d.hue + ",45%,84%," + alpha * 0.18 + ")");
        shardGrad.addColorStop(1, "hsla(" + d.hue + ",40%,70%," + alpha * 0.06 + ")");
        ctx.fillStyle = shardGrad;
        ctx.fill();
        ctx.strokeStyle = "hsla(" + d.hue + ",70%,94%," + alpha * 0.9 + ")";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255," + alpha * 0.55 + ")";
        ctx.beginPath();
        ctx.moveTo(d.shape[0][0] * size, d.shape[0][1] * size);
        ctx.lineTo(d.shape[1 % d.shape.length][0] * size, d.shape[1 % d.shape.length][1] * size);
        ctx.stroke();
        if (Math.sin(_cursorFrame * 0.16 + d.phase) > 0.86) {
          ctx.fillStyle = "rgba(240,250,255," + alpha * 0.85 + ")";
          ctx.beginPath();
          ctx.arc(d.shape[0][0] * size, d.shape[0][1] * size, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        continue;
      }
      if (_cursorEffectType === "confetti") {
        const ww = d.width * (0.8 + lifeRatio * 0.25);
        const hh = d.height;
        ctx.save();
        ctx.translate(d.x + Math.sin(d.phase) * d.sway * 2, d.y);
        ctx.rotate(d.rot);
        ctx.scale(0.18 + 0.82 * Math.abs(Math.cos(d.flip)), 1);
        ctx.fillStyle = "hsla(" + d.hue + ",85%,70%," + alpha + ")";
        ctx.fillRect(-ww * 0.5, -hh * 0.5, ww, hh);
        ctx.fillStyle = "rgba(255,255,255," + alpha * 0.35 + ")";
        ctx.fillRect(-ww * 0.5, -hh * 0.5, ww, Math.max(0.6, hh * 0.2));
        ctx.restore();
        continue;
      }
      if (_cursorEffectType === "glitch") {
        const jitterX = d.x + (Math.random() - 0.5) * d.width;
        ctx.fillStyle = "hsla(" + d.hue + ",100%,64%," + alpha * 0.75 + ")";
        ctx.fillRect(jitterX, d.y, d.width, d.height);
        ctx.fillStyle = "hsla(" + (d.hue + 120) + ",100%,70%," + alpha * 0.42 + ")";
        ctx.fillRect(d.x - jitterX + d.width * 0.22, d.y + 1, d.width * 0.68, d.height * 0.72);
        continue;
      }
      if (_cursorEffectType === "note") {
        const glyphs = melodyGlyphs();
        const size = d.size * (0.85 + lifeRatio * 0.35);
        const px = d.x + Math.sin(d.phase) * d.sway * 2.2;
        ctx.strokeStyle = "hsla(" + d.hue + ",100%,82%," + alpha * 0.28 + ")";
        ctx.lineWidth = Math.max(0.6, size * 0.1);
        ctx.beginPath();
        ctx.moveTo(px - d.vx * 7, d.y - d.vy * 7);
        ctx.lineTo(px, d.y);
        ctx.stroke();
        ctx.save();
        ctx.translate(px, d.y);
        ctx.rotate(d.rot);
        ctx.scale(size, size);
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 2.1);
        glow.addColorStop(0, "hsla(" + d.hue + ",100%,84%," + alpha * 0.16 + ")");
        glow.addColorStop(1, "hsla(" + d.hue + ",100%,70%,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(-2.1, -2.1, 4.2, 4.2);
        ctx.fillStyle = "hsla(" + d.hue + ",100%,84%," + alpha * 0.22 + ")";
        ctx.fill(glyphs[d.glyph]);
        ctx.fillStyle = "hsla(" + d.hue + ",100%,90%," + alpha + ")";
        ctx.fill(glyphs[d.glyph]);
        ctx.restore();
        continue;
      }
      if (_cursorEffectType === "feather") {
        const radius = d.size * (0.65 + lifeRatio * 0.35);
        ctx.save();
        ctx.translate(d.x + Math.sin(d.phase) * d.sway * 2.4, d.y);
        ctx.rotate(d.rot);
        ctx.scale(0.55 + 0.45 * Math.abs(Math.cos(d.flip)), 1);
        ctx.fillStyle = "hsla(" + d.hue + ",45%,94%," + alpha * 0.34 + ")";
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.bezierCurveTo(radius * 0.95, -radius * 0.5, radius * 0.85, radius * 0.55, 0, radius);
        ctx.bezierCurveTo(-radius * 0.5, radius * 0.4, -radius * 0.42, -radius * 0.55, 0, -radius);
        ctx.fill();
        ctx.strokeStyle = "hsla(" + d.hue + ",30%,94%," + alpha * 0.8 + ")";
        ctx.lineWidth = Math.max(0.4, radius * 0.08);
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, radius * 0.95);
        ctx.stroke();
        ctx.strokeStyle = "hsla(" + d.hue + ",40%,92%," + alpha * 0.48 + ")";
        ctx.lineWidth = Math.max(0.3, radius * 0.05);
        for (let b = 1; b <= 4; b++) {
          const by = -radius + (b / 5) * radius * 1.9;
          const len = radius * 0.4 * (1 - Math.abs(b / 5 - 0.5));
          ctx.beginPath();
          ctx.moveTo(0, by);
          ctx.lineTo(len, by + len * 0.4);
          ctx.moveTo(0, by);
          ctx.lineTo(-len * 0.8, by + len * 0.35);
          ctx.stroke();
        }
        ctx.restore();
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
    if ((!_cursorEnabled && !_clickEnabled) || isStandaloneWindow()) {
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
    if (_cursorEnabled) {
      if (_cursorEffectType === "comet") drawCursorComet(ctx, strength);
      else drawCursorParticles(ctx, strength, canvas);
    }
    if (_clickEnabled) drawClickParticles(ctx, _clickIntensity / 100);
    ctx.restore();
    const mouseActive = _cursorEnabled && (_cursorEffectType === "comet" ? _cursorHistory.length > 0 : _cursorParticles.length > 0);
    const clickActive = _clickEnabled && _clickParticles.length > 0;
    _cursorAnimation = (mouseActive || clickActive) ? requestAnimationFrame(cursorAnimationLoop) : null;
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
    _cursorParticles.length = 0;
    _cursorHistory.length = 0;
    resetCursorPointer();
    if (!_clickEnabled) {
      if (_cursorAnimation !== null) {
        cancelAnimationFrame(_cursorAnimation);
        _cursorAnimation = null;
      }
      if (_cursorCanvas) {
        _cursorCanvas.remove();
        _cursorCanvas = null;
      }
    }
  }
  function startClickEffects() {
    if (isStandaloneWindow()) return;
    _clickEnabled = true;
    setLocal("click_enabled", true);
    if (!_clickHandler) {
      _clickHandler = handleClick;
      window.addEventListener("pointerdown", _clickHandler, { passive: true });
    }
    ensureCursorCanvas();
  }
  function stopClickEffects(preservePreference) {
    _clickEnabled = false;
    if (!preservePreference) setLocal("click_enabled", false);
    if (_clickHandler) {
      window.removeEventListener("pointerdown", _clickHandler);
      _clickHandler = null;
    }
    _clickParticles.length = 0;
    if (!_cursorEnabled) {
      if (_cursorAnimation !== null) {
        cancelAnimationFrame(_cursorAnimation);
        _cursorAnimation = null;
      }
      if (_cursorCanvas) {
        _cursorCanvas.remove();
        _cursorCanvas = null;
      }
    }
  }
  function setClickEffectType(effectType) {
    _clickEffectType = getClickEffectOption(effectType).id;
    setLocal("click_effect_type", _clickEffectType);
    _clickParticles.length = 0;
  }
  function setClickIntensity(value) {
    _clickIntensity = Math.max(10, Math.min(100, Number(value) || 50));
    setLocal("click_intensity", _clickIntensity);
  }
  function handleClick(event) {
    if (!_clickEnabled || isStandaloneWindow()) return;
    if (event.pointerType !== "touch" && event.button !== 0) return;
    const canvas = ensureCursorCanvas();
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(_cursorCssW, event.clientX - rect.left));
    const y = Math.max(0, Math.min(_cursorCssH, event.clientY - rect.top));
    spawnClickEffect(x, y);
    queueCursorAnimation();
  }
  function spawnClickEffect(x, y) {
    const strength = _clickIntensity / 100;
    if (_clickEffectType === "click_ripple") {
      _clickParticles.push({
        kind: "ripple",
        x, y,
        age: 0,
        life: 44,
        size: 14 + Math.random() * 10,
        hue: 188 + Math.random() * 34
      });
      if (_clickParticles.length > 12) _clickParticles.shift();
      return;
    }
    if (_clickEffectType === "click_sparks") {
      const count = 10 + Math.round(strength * 10);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 2.6 * (0.7 + strength * 0.6);
        _clickParticles.push({
          kind: "spark",
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.6,
          gravity: 0.06 + Math.random() * 0.05,
          age: 0,
          life: 24 + Math.floor(Math.random() * 16),
          hue: 28 + Math.random() * 28,
          size: 1.5 + Math.random() * 1.8
        });
      }
      if (_clickParticles.length > 120) _clickParticles.splice(0, _clickParticles.length - 120);
      return;
    }
    if (_clickEffectType === "click_runes") {
      const glyphs = [];
      for (let i = 0; i < 12; i++) {
        glyphs.push(MOUSE_RUNE_GLYPHS[Math.floor(Math.random() * MOUSE_RUNE_GLYPHS.length)]);
      }
      _clickParticles.push({
        kind: "rune",
        x, y,
        age: 0,
        life: 64,
        size: 24 + Math.random() * 12,
        rot: Math.random() * Math.PI * 2,
        hue: 272 + Math.random() * 30,
        glyphs: glyphs
      });
      if (_clickParticles.length > 8) _clickParticles.shift();
      return;
    }
    if (_clickEffectType === "click_freeze") {
      const size = 18 + Math.random() * 12;
      const shards = [];
      const cracks = [];
      for (let i = 0; i < 10; i++) {
        shards.push({
          a: Math.random() * Math.PI * 2,
          len: size * (0.16 + Math.random() * 0.24),
          speed: 0.7 + Math.random() * 0.9,
          spin: (Math.random() - 0.5) * 0.1
        });
      }
      for (let i = 0; i < 8; i++) {
        const pts = [{ x: 0, y: 0 }];
        let px = 0, py = 0;
        let angle = Math.random() * Math.PI * 2;
        const segs = 2 + Math.floor(Math.random() * 2);
        for (let s = 0; s < segs; s++) {
          const len = size * (0.22 + Math.random() * 0.3);
          px += Math.cos(angle) * len;
          py += Math.sin(angle) * len;
          pts.push({ x: px, y: py });
          angle += (Math.random() - 0.5) * 0.8;
        }
        cracks.push({ pts: pts, delay: Math.random() * 0.12 });
      }
      _clickParticles.push({
        kind: "frost",
        x, y,
        age: 0,
        life: 60,
        size: size,
        hue: 194 + Math.random() * 18,
        shards: shards,
        cracks: cracks
      });
      if (_clickParticles.length > 10) _clickParticles.shift();
      return;
    }
    if (_clickEffectType === "click_magnetic") {
      _clickParticles.push({
        kind: "field",
        x, y,
        age: 0,
        life: 74,
        size: 30 + Math.random() * 20,
        rot: Math.random() * Math.PI * 2,
        hueA: 198 + Math.random() * 20,
        hueB: 278 + Math.random() * 24,
        phase: Math.random() * Math.PI * 2
      });
      if (_clickParticles.length > 8) _clickParticles.shift();
      return;
    }
    if (_clickEffectType === "click_shatter") {
      const size = 30 + Math.random() * 20;
      const branches = [];
      for (let i = 0; i < 9; i++) {
        const pts = [{ x: 0, y: 0 }];
        let px = 0, py = 0;
        let angle = (i / 9) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const segs = 2 + Math.floor(Math.random() * 2);
        for (let s = 0; s < segs; s++) {
          const len = size * (0.24 + Math.random() * 0.3);
          px += Math.cos(angle) * len;
          py += Math.sin(angle) * len;
          pts.push({ x: px, y: py });
          angle += (Math.random() - 0.5) * 0.6;
        }
        branches.push({ pts: pts, delay: Math.random() * 0.1 });
        if (Math.random() < 0.55) {
          const base = pts[1 + Math.floor(Math.random() * (pts.length - 1))];
          const sub = [{ x: base.x, y: base.y }];
          let sa = angle + (Math.random() < 0.5 ? 0.7 : -0.7);
          let sx = base.x, sy = base.y;
          for (let s = 0; s < 2; s++) {
            const len = size * (0.14 + Math.random() * 0.16);
            sx += Math.cos(sa) * len;
            sy += Math.sin(sa) * len;
            sub.push({ x: sx, y: sy });
            sa += (Math.random() - 0.5) * 0.5;
          }
          branches.push({ pts: sub, delay: 0.12 + Math.random() * 0.1 });
        }
      }
      const shapes = mouseShardShapes();
      const shards = [];
      for (let i = 0; i < 7; i++) {
        shards.push({
          a: Math.random() * Math.PI * 2,
          dist: size * (0.1 + Math.random() * 0.35),
          speed: 0.2 + Math.random() * 0.5,
          size: size * (0.06 + Math.random() * 0.09),
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.08,
          shape: shapes[Math.floor(Math.random() * shapes.length)]
        });
      }
      _clickParticles.push({
        kind: "crack",
        x, y,
        age: 0,
        life: 66,
        size: size,
        hue: 200 + Math.random() * 20,
        branches: branches,
        shards: shards
      });
      if (_clickParticles.length > 8) _clickParticles.shift();
    }
  }
  function drawClickParticles(ctx, strength) {
    for (let i = _clickParticles.length - 1; i >= 0; i--) {
      const d = _clickParticles[i];
      d.age += 1;
      if (d.age >= d.life) {
        _clickParticles.splice(i, 1);
        continue;
      }
      const t = d.age / d.life;
      const fade = Math.pow(1 - t, 1.6);
      if (d.kind === "ripple") {
        const radius = d.size * (0.5 + t * 2.6);
        ctx.strokeStyle = "hsla(" + d.hue + ",100%,80%," + fade * 0.9 * strength + ")";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "hsla(" + (d.hue + 18) + ",100%,86%," + fade * 0.4 * strength + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius * 0.62, 0, Math.PI * 2);
        ctx.stroke();
        const glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size * 0.9);
        glow.addColorStop(0, "hsla(" + d.hue + ",100%,82%," + fade * 0.3 * strength + ")");
        glow.addColorStop(1, "hsla(" + (d.hue + 24) + ",100%,70%,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(d.x - d.size, d.y - d.size, d.size * 2, d.size * 2);
        continue;
      }
      if (d.kind === "spark") {
        d.vy += d.gravity;
        d.x += d.vx;
        d.y += d.vy;
        const alpha = fade * strength;
        const hue = d.hue - t * 24;
        ctx.strokeStyle = "hsla(" + hue + ",100%,70%," + alpha * 0.6 + ")";
        ctx.lineWidth = d.size;
        ctx.beginPath();
        ctx.moveTo(d.x - d.vx * 2.8, d.y - d.vy * 2.8);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
        ctx.fillStyle = "hsla(" + (hue + 10) + ",100%,88%," + alpha + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      if (d.kind === "frost") {
        const fade = Math.pow(1 - t, 1.4) * strength;
        ctx.save();
        ctx.translate(d.x, d.y);
        const ringR = d.size * (0.4 + t * 2.4);
        ctx.strokeStyle = "hsla(" + d.hue + ",100%,80%," + fade * 0.38 + ")";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, ringR, 0, Math.PI * 2);
        ctx.stroke();
        const mist = ctx.createRadialGradient(0, 0, 0, 0, 0, d.size * 1.5);
        mist.addColorStop(0, "hsla(" + d.hue + ",100%,86%," + fade * 0.13 + ")");
        mist.addColorStop(1, "hsla(" + (d.hue + 18) + ",100%,70%,0)");
        ctx.fillStyle = mist;
        ctx.fillRect(-d.size * 1.5, -d.size * 1.5, d.size * 3, d.size * 3);
        for (let ci = 0; ci < d.cracks.length; ci++) {
          const crack = d.cracks[ci];
          const prog = Math.min(1, Math.max(0, (t - crack.delay) / 0.5));
          if (prog <= 0) continue;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          for (let pi = 1; pi < crack.pts.length; pi++) ctx.lineTo(crack.pts[pi].x * prog, crack.pts[pi].y * prog);
          ctx.strokeStyle = "hsla(" + d.hue + ",100%,80%," + fade * 0.18 + ")";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.strokeStyle = "hsla(" + d.hue + ",100%,82%," + fade * 0.6 + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        for (let si = 0; si < d.shards.length; si++) {
          const shard = d.shards[si];
          const dist = d.size * (0.25 + t * 2.2) * shard.speed;
          const sx = Math.cos(shard.a) * dist;
          const sy = Math.sin(shard.a) * dist;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(shard.a + t * 1.4 + shard.spin * 10);
          ctx.beginPath();
          ctx.moveTo(0, -shard.len);
          ctx.lineTo(shard.len * 0.45, 0);
          ctx.lineTo(0, shard.len);
          ctx.lineTo(-shard.len * 0.45, 0);
          ctx.closePath();
          ctx.fillStyle = "hsla(" + d.hue + ",75%,88%," + fade * 0.34 + ")";
          ctx.fill();
          ctx.strokeStyle = "hsla(" + d.hue + ",100%,86%," + fade * 0.85 + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
        continue;
      }
      if (d.kind === "field") {
        const fade = Math.pow(1 - t, 1.5) * strength;
        const rot = d.rot + t * 0.6;
        const ax = Math.cos(rot);
        const ay = Math.sin(rot);
        const px = -ay;
        const py = ax;
        const half = d.size * 0.62;
        const Ax = ax * half, Ay = ay * half, Bx = -ax * half, By = -ay * half;
        ctx.save();
        ctx.translate(d.x, d.y);
        for (let m = 1; m <= 5; m++) {
          const off = d.size * (0.3 + m * 0.22);
          for (let sign = -1; sign <= 1; sign += 2) {
            const cx = px * off * sign;
            const cy = py * off * sign;
            const hue = sign > 0 ? d.hueA : d.hueB;
            ctx.strokeStyle = "hsla(" + hue + ",100%,74%," + fade * 0.16 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(Ax, Ay);
            ctx.quadraticCurveTo(cx, cy, Bx, By);
            ctx.stroke();
            for (let k = 1; k <= 9; k++) {
              const u = k / 10;
              const iu = 1 - u;
              const qx = iu * iu * Ax + 2 * iu * u * cx + u * u * Bx;
              const qy = iu * iu * Ay + 2 * iu * u * cy + u * u * By;
              const tx = 2 * iu * (cx - Ax) + 2 * u * (Bx - cx);
              const ty = 2 * iu * (cy - Ay) + 2 * u * (By - cy);
              const ang = Math.atan2(ty, tx);
              const glow = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(u * 8 - t * 10 + d.phase), 2);
              const len = 2.5 + glow * 2.5;
              ctx.strokeStyle = "hsla(" + hue + ",100%,82%," + fade * 0.5 * glow + ")";
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(qx - Math.cos(ang) * len, qy - Math.sin(ang) * len);
              ctx.lineTo(qx + Math.cos(ang) * len, qy + Math.sin(ang) * len);
              ctx.stroke();
            }
          }
        }
        const gA = ctx.createRadialGradient(Ax, Ay, 0, Ax, Ay, d.size * 0.4);
        gA.addColorStop(0, "hsla(" + d.hueA + ",100%,84%," + fade * 0.4 + ")");
        gA.addColorStop(1, "hsla(" + d.hueA + ",100%,70%,0)");
        ctx.fillStyle = gA;
        ctx.fillRect(Ax - d.size * 0.4, Ay - d.size * 0.4, d.size * 0.8, d.size * 0.8);
        const gB = ctx.createRadialGradient(Bx, By, 0, Bx, By, d.size * 0.4);
        gB.addColorStop(0, "hsla(" + d.hueB + ",100%,84%," + fade * 0.4 + ")");
        gB.addColorStop(1, "hsla(" + d.hueB + ",100%,70%,0)");
        ctx.fillStyle = gB;
        ctx.fillRect(Bx - d.size * 0.4, By - d.size * 0.4, d.size * 0.8, d.size * 0.8);
        ctx.restore();
        continue;
      }
      if (d.kind === "crack") {
        const fade = Math.pow(1 - t, 1.3) * strength;
        ctx.save();
        ctx.translate(d.x, d.y);
        if (t < 0.3) {
          const flash = 1 - t / 0.3;
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, d.size * 1.2);
          g.addColorStop(0, "hsla(" + d.hue + ",100%,92%," + flash * 0.28 * strength + ")");
          g.addColorStop(1, "hsla(" + d.hue + ",100%,70%,0)");
          ctx.fillStyle = g;
          ctx.fillRect(-d.size * 1.2, -d.size * 1.2, d.size * 2.4, d.size * 2.4);
        }
        for (let bi = 0; bi < d.branches.length; bi++) {
          const branch = d.branches[bi];
          const prog = Math.min(1, Math.max(0, (t - branch.delay) / 0.45));
          if (prog <= 0) continue;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          for (let pi = 1; pi < branch.pts.length; pi++) ctx.lineTo(branch.pts[pi].x * prog, branch.pts[pi].y * prog);
          ctx.strokeStyle = "hsla(" + d.hue + ",100%,88%," + fade * 0.18 + ")";
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.strokeStyle = "rgba(240,250,255," + fade * 0.75 + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        for (let si = 0; si < d.shards.length; si++) {
          const shard = d.shards[si];
          const dist = shard.dist + d.size * shard.speed * t;
          const sx = Math.cos(shard.a) * dist;
          const sy = Math.sin(shard.a) * dist;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(shard.rot + t * 3 + shard.spin * 10);
          ctx.beginPath();
          ctx.moveTo(shard.shape[0][0] * shard.size, shard.shape[0][1] * shard.size);
          for (let pi = 1; pi < shard.shape.length; pi++) ctx.lineTo(shard.shape[pi][0] * shard.size, shard.shape[pi][1] * shard.size);
          ctx.closePath();
          ctx.fillStyle = "hsla(" + d.hue + ",45%,92%," + fade * 0.18 + ")";
          ctx.fill();
          ctx.strokeStyle = "hsla(" + d.hue + ",70%,94%," + fade * 0.8 + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
        continue;
      }
      d.rot += 0.025;
      const radius = d.size * (0.6 + t * 1.0);
      ctx.font = "600 " + (11 + 5 * fade) + "px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let g = 0; g < 12; g++) {
        const angle = d.rot + (g / 12) * Math.PI * 2;
        const gx = d.x + Math.cos(angle) * radius;
        const gy = d.y + Math.sin(angle) * radius * 0.62;
        ctx.fillStyle = "hsla(" + d.hue + ",100%,84%," + fade * 0.8 * strength + ")";
        ctx.fillText(d.glyphs[g], gx, gy);
      }
      ctx.strokeStyle = "hsla(" + d.hue + ",100%,78%," + fade * 0.48 * strength + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, radius * 0.82, radius * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      const core = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, radius * 0.55);
      core.addColorStop(0, "hsla(" + (d.hue + 20) + ",100%,88%," + fade * 0.2 * strength + ")");
      core.addColorStop(1, "hsla(" + d.hue + ",100%,72%,0)");
      ctx.fillStyle = core;
      ctx.fillRect(d.x - radius * 0.55, d.y - radius * 0.55, radius * 1.1, radius * 1.1);
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
  function restoreClickEffects() {
    _clickIntensity = Math.max(10, Math.min(100, Number(getLocal("click_intensity", 50)) || 50));
    _clickEffectType = getClickEffectOption(getLocal("click_effect_type", "click_ripple")).id;
    if (getLocal("click_enabled", false)) startClickEffects();
  }
  function lteFocusSelectedOption(selector) {
    window.setTimeout(function() {
      var container = document.querySelector(selector);
      if (!container) return;
      var active = container.querySelector('[data-lte-active="1"]');
      if (!active) return;
      if (container.scrollHeight > container.clientHeight + 2) {
        var cRect = container.getBoundingClientRect();
        var aRect = active.getBoundingClientRect();
        var delta = (aRect.top - cRect.top) - (cRect.height - aRect.height) * 0.5;
        container.scrollTop = container.scrollTop + delta;
      }
    }, 40);
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
        background: var(--lte-hover, rgba(255,255,255,0.075)) !important;
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
        background: var(--lte-hover-soft, rgba(255,255,255,0.065)) !important;
      }
      .lte-mouse-option:active {
        transform: scale(0.993);
      }
      .lte-mouse-slider {
        appearance: none;
        -webkit-appearance: none;
        height: 5px;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--mouse-accent, #52e2ff), var(--lte-track, rgba(255,255,255,0.16)));
        outline: none;
      }
      .lte-mouse-slider::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background: var(--lte-thumb, #ffffff);
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
        background: var(--lte-thumb, #ffffff);
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
        background: var(--lte-hover, rgba(255,255,255,0.075)) !important;
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
        scrollbar-color: var(--card-accent, #52e2ff) var(--lte-scroll-track-soft, rgba(255,255,255,0.06));
      }
      .lte-card-options::-webkit-scrollbar {
        width: 6px;
      }
      .lte-card-options::-webkit-scrollbar-track {
        background: var(--lte-scroll-track, rgba(255,255,255,0.035));
        border-radius: 999px;
      }
      .lte-card-options::-webkit-scrollbar-thumb {
        background: var(--card-accent, #52e2ff);
        border-radius: 999px;
      }
      html[data-lte-reduce-motion="1"] .lte-mouse-accent-line,
      html[data-lte-reduce-motion="1"] .lte-card-line-fill,
      html[data-lte-reduce-motion="1"] .lte-video-strip {
        animation: none !important;
      }
      html[data-lte-reduce-motion="1"] [data-lte-titlebar-hidden] {
        transition: none !important;
      }
      @keyframes lte-video-strip-flow {
        0% { background-position: 0 0, 0 50%; }
        100% { background-position: 120px 0, 240% 50%; }
      }
      .lte-video-strip {
        background-image:
          repeating-linear-gradient(90deg, var(--lte-stripe, rgba(255,255,255,0.05)) 0 2px, transparent 2px 18px),
          linear-gradient(90deg, transparent, var(--card-accent, #69e39a), transparent);
        background-size: 120px 100%, 220% 100%;
        background-repeat: repeat, no-repeat;
        opacity: 0.5;
        animation: lte-video-strip-flow 3.2s linear infinite;
      }
      .lte-video-strip.is-live {
        opacity: 0.72;
      }
      .lte-video-strip.is-paused {
        animation-play-state: paused;
        opacity: 0.24;
      }
      .lte-card-option {
        transition: background-color 150ms ease, border-color 170ms ease, transform 100ms ease;
      }
      .lte-card-option:hover {
        background: var(--lte-hover-soft, rgba(255,255,255,0.065)) !important;
      }
      .lte-card-option:active {
        transform: scale(0.993);
      }
      .lte-card-slider {
        appearance: none;
        -webkit-appearance: none;
        height: 5px;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--card-accent, #52e2ff), var(--lte-track, rgba(255,255,255,0.16)));
        outline: none;
      }
      .lte-card-slider::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background: var(--lte-thumb, #ffffff);
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
        background: var(--lte-thumb, #ffffff);
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

  