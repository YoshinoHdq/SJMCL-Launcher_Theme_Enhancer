  var _pianoGlow = {};
  var _pianoPress = {};
  var _pianoNotes = [];
  var _pianoSink = {};
  var _pianoSinkVel = {};
  var _pianoRipples = [];
  var _pianoTopEchoes = [];
  var _pianoSidePulses = [];
  var _pianoListener = null;
  var PIANO_BLACK_BASES = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12];
  var PIANO_WHITE_CODES = {
    KeyZ: 0, KeyX: 1, KeyC: 2, KeyV: 3, KeyB: 4, KeyN: 5, KeyM: 6,
    KeyQ: 7, KeyW: 8, KeyE: 9, KeyR: 10, KeyT: 11, KeyY: 12, KeyU: 13
  };
  var PIANO_BLACK_CODES = {
    KeyS: 0, KeyD: 1, KeyG: 2, KeyH: 3, KeyJ: 4,
    Digit2: 5, Digit3: 6, Digit5: 7, Digit6: 8, Digit7: 9
  };
  function pianoLayout(w, h) {
    var keyH = Math.max(42, Math.min(h * 0.088, 82));
    var nearW = Math.min(w * 0.74, 840);
    var farW = nearW * 0.9;
    var nearY = h * 0.955;
    var nearX = (w - nearW) * 0.5;
    var farX = (w - farW) * 0.5;
    return {
      keyH: keyH,
      nearW: nearW,
      farW: farW,
      nearX: nearX,
      farX: farX,
      nearY: nearY,
      farY: nearY - keyH,
      lip: Math.max(4, keyH * 0.12),
      whiteNearW: nearW / 14,
      whiteFarW: farW / 14,
      blackNearW: nearW / 14 * 0.58,
      blackFarW: farW / 14 * 0.58,
      blackH: keyH * 0.62
    };
  }
  function pianoXAt(u, layout, t) {
    var far = layout.farX + u * layout.farW;
    var near = layout.nearX + u * layout.nearW;
    return far + (near - far) * t;
  }
  function pianoKeyPath(ctx, u0, u1, layout, nearTopY) {
    ctx.beginPath();
    ctx.moveTo(layout.farX + u0 * layout.farW, layout.farY);
    ctx.lineTo(layout.farX + u1 * layout.farW, layout.farY);
    ctx.lineTo(layout.nearX + u1 * layout.nearW, nearTopY);
    ctx.lineTo(layout.nearX + u0 * layout.nearW, nearTopY);
    ctx.closePath();
  }
  function pianoKeyHit(code) {
    if (Object.prototype.hasOwnProperty.call(PIANO_WHITE_CODES, code)) {
      return { id: "w" + PIANO_WHITE_CODES[code], black: false, index: PIANO_WHITE_CODES[code] };
    }
    if (Object.prototype.hasOwnProperty.call(PIANO_BLACK_CODES, code)) {
      return { id: "b" + PIANO_BLACK_CODES[code], black: true, index: PIANO_BLACK_CODES[code] };
    }
    return null;
  }
  function spawnPianoNote(hit, w, h) {
    var layout = pianoLayout(w, h);
    var x, y0, hue;
    if (hit.black) {
      var base = PIANO_BLACK_BASES[hit.index];
      x = pianoXAt((base + 1) / 14, layout, 0.55);
      y0 = layout.farY + layout.blackH * 0.45;
      hue = 282 + (hit.index / 9) * 44;
    } else {
      x = pianoXAt((hit.index + 0.5) / 14, layout, 0.55);
      y0 = layout.farY + layout.keyH * 0.4;
      hue = 190 + (hit.index / 13) * 26;
    }
    _pianoNotes.push({
      bx: x,
      y0: y0,
      prog: 0,
      life: 78 + Math.random() * 42,
      target: h * (0.13 + Math.random() * 0.12),
      swayAmp: 3 + Math.random() * 7,
      swayPh: Math.random() * Math.PI * 2,
      swaySpd: 0.03 + Math.random() * 0.035,
      rot: (Math.random() - 0.5) * 0.24,
      size: (13 + Math.random() * 8) * (hit.black ? 0.9 : 1),
      hue: hue + (Math.random() - 0.5) * 12,
      glyph: Math.random() < 0.55 ? 0 : 1,
      echoed: false,
      x: x,
      y: y0
    });
    _pianoRipples.push({ x: x, y: y0, age: 0, life: 24, hue: hue, black: hit.black });
    if (_pianoRipples.length > 16) _pianoRipples.shift();
    _pianoSidePulses.push({
      side: x < w * 0.5 ? -1 : 1,
      age: 0,
      life: 130 + Math.random() * 70,
      hue: hue,
      pitch: hit.black ? (PIANO_BLACK_BASES[hit.index] + 1) / 14 : (hit.index + 0.5) / 14
    });
    if (_pianoSidePulses.length > 8) _pianoSidePulses.shift();
    if (_pianoNotes.length > 32) _pianoNotes.shift();
  }
  function ensurePianoListener() {
    if (_pianoListener) return;
    _pianoListener = function(event) {
      if (_tt !== "key_nocturne") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      var hit = pianoKeyHit(event.code);
      if (!hit) return;
      if (event.type === "keydown") {
        if (event.repeat) return;
        _pianoPress[hit.id] = true;
        spawnPianoNote(hit, _tcCssW || window.innerWidth, _tcCssH || window.innerHeight);
      } else {
        delete _pianoPress[hit.id];
      }
    };
    window.addEventListener("keydown", _pianoListener);
    window.addEventListener("keyup", _pianoListener);
    window.addEventListener("blur", clearPianoPress);
  }
  function clearPianoPress() {
    for (var k in _pianoPress) delete _pianoPress[k];
  }
  function removePianoKeyListener() {
    if (!_pianoListener) return;
    window.removeEventListener("keydown", _pianoListener);
    window.removeEventListener("keyup", _pianoListener);
    window.removeEventListener("blur", clearPianoPress);
    _pianoListener = null;
    clearPianoPress();
    _pianoGlow = {};
    _pianoNotes.length = 0;
    _pianoSink = {};
    _pianoSinkVel = {};
    _pianoRipples.length = 0;
    _pianoTopEchoes.length = 0;
    _pianoSidePulses.length = 0;
  }
  function updatePianoSink() {
    var ids = {};
    for (var k in _pianoGlow) ids[k] = 1;
    for (var p in _pianoPress) ids[p] = 1;
    for (var id in ids) {
      var target = _pianoPress[id] ? 1 : 0;
      var value = _pianoSink[id] || 0;
      var velocity = _pianoSinkVel[id] || 0;
      velocity += (target - value) * 0.42;
      velocity *= 0.52;
      value += velocity;
      if (target === 0 && Math.abs(value) < 0.01 && Math.abs(velocity) < 0.01) {
        value = 0;
        velocity = 0;
      }
      _pianoSink[id] = value;
      _pianoSinkVel[id] = velocity;
    }
  }
  themeEffects.key_nocturne = {
    init: function() {
      ensurePianoListener();
      clearPianoPress();
      _pianoGlow = {};
      _pianoNotes.length = 0;
      _pianoSink = {};
      _pianoSinkVel = {};
      _pianoRipples.length = 0;
      _pianoTopEchoes.length = 0;
      _pianoSidePulses.length = 0;
      return [{ x: 0, y: 0 }];
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      var glass = 0.35 + 0.65 * strength;
      var layout = pianoLayout(w, h);
      updatePianoSink();
      var whiteNearW = layout.whiteNearW;
      var farY = layout.farY;
      var nearY = layout.nearY;
      var lip = layout.lip;
      var glyphs = melodyGlyphs();
      var i, g, u, hue, cx, nl, nr;
      ctx.save();
      for (i = 0; i < 14; i++) {
        g = _pianoGlow["w" + i] || 0;
        var sinkVal = _pianoSink["w" + i] || 0;
        var sink = sinkVal * Math.max(4, layout.keyH * 0.085);
        var nearTopY = nearY + sink;
        pianoKeyPath(ctx, i / 14, (i + 1) / 14, layout, nearTopY);
        var whiteFill = ctx.createLinearGradient(0, farY, 0, nearTopY);
        whiteFill.addColorStop(0, "rgba(226,238,255," + 0.19 * glass + ")");
        whiteFill.addColorStop(0.5, "rgba(212,226,255," + 0.1 * glass + ")");
        whiteFill.addColorStop(1, "rgba(196,212,248," + 0.06 * glass + ")");
        ctx.fillStyle = whiteFill;
        ctx.fill();
        if (g > 0.01) {
          hue = 190 + (i / 13) * 26;
          pianoKeyPath(ctx, i / 14, (i + 1) / 14, layout, nearTopY);
          var pressFill = ctx.createLinearGradient(0, farY, 0, nearTopY);
          pressFill.addColorStop(0, "hsla(" + hue + ",100%,78%," + g * 0.03 * strength + ")");
          pressFill.addColorStop(1, "hsla(" + hue + ",100%,80%," + g * 0.15 * strength + ")");
          ctx.fillStyle = pressFill;
          ctx.fill();
        }
        nl = layout.nearX + (i / 14) * layout.nearW;
        nr = layout.nearX + ((i + 1) / 14) * layout.nearW;
        var lipH = Math.max(1, lip - sink * 0.85);
        ctx.fillStyle = "rgba(140,162,200," + (0.05 + 0.05 * glass) + ")";
        ctx.fillRect(nl, nearTopY, nr - nl, lipH);
        ctx.fillStyle = "rgba(255,255,255," + 0.14 * glass + ")";
        ctx.fillRect(nl, nearTopY, nr - nl, 1);
        ctx.fillStyle = "rgba(0,0,0," + 0.24 * glass + ")";
        ctx.fillRect(nl, nearTopY + lipH - 1, nr - nl, 1);
      }
      ctx.strokeStyle = "rgba(255,255,255," + (0.12 + 0.08 * glass) + ")";
      ctx.lineWidth = 0.8;
      for (i = 0; i <= 14; i++) {
        u = i / 14;
        ctx.beginPath();
        ctx.moveTo(layout.farX + u * layout.farW, farY);
        ctx.lineTo(layout.nearX + u * layout.nearW, nearY + lip);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(10,14,24," + 0.18 * glass + ")";
      ctx.fillRect(layout.farX, farY, layout.farW, 1.5);
      for (i = 0; i < 10; i++) {
        var base = PIANO_BLACK_BASES[i];
        g = _pianoGlow["b" + i] || 0;
        var blackSinkVal = _pianoSink["b" + i] || 0;
        var blackSink = blackSinkVal * 5.5;
        var farTop = farY + blackSink * 0.5;
        var nearTop = farY + layout.blackH + blackSink;
        var fc = layout.farX + ((base + 1) / 14) * layout.farW;
        var nc = layout.nearX + ((base + 1) / 14) * layout.nearW;
        var farHalf = layout.blackFarW * 0.5;
        var nearHalf = layout.blackNearW * 0.5;
        var faceH = Math.max(1.2, 6 - blackSink * 0.9);
        var faceGrad = ctx.createLinearGradient(0, nearTop, 0, nearTop + faceH);
        faceGrad.addColorStop(0, "rgba(40,48,66," + 0.9 * glass + ")");
        faceGrad.addColorStop(1, "rgba(6,9,16," + 0.88 * glass + ")");
        ctx.fillStyle = faceGrad;
        ctx.fillRect(nc - nearHalf, nearTop, nearHalf * 2, faceH);
        ctx.fillStyle = "rgba(180,200,235," + 0.12 * glass + ")";
        ctx.fillRect(nc - nearHalf, nearTop + faceH - 1, nearHalf * 2, 1);
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.55)";
        ctx.shadowBlur = Math.max(2, 7 - blackSink * 0.8);
        ctx.shadowOffsetY = Math.max(1, 3 - blackSink * 0.5);
        ctx.beginPath();
        ctx.moveTo(fc - farHalf, farTop);
        ctx.lineTo(fc + farHalf, farTop);
        ctx.lineTo(nc + nearHalf, nearTop);
        ctx.lineTo(nc - nearHalf, nearTop);
        ctx.closePath();
        var blackFill = ctx.createLinearGradient(0, farTop, 0, nearTop);
        blackFill.addColorStop(0, "rgba(56,66,90," + 0.94 * glass + ")");
        blackFill.addColorStop(0.35, "rgba(24,30,46," + 0.93 * glass + ")");
        blackFill.addColorStop(1, "rgba(7,9,16," + 0.9 * glass + ")");
        ctx.fillStyle = blackFill;
        ctx.fill();
        ctx.restore();
        if (g > 0.01) {
          hue = 282 + (i / 9) * 44;
          ctx.beginPath();
          ctx.moveTo(fc - farHalf, farTop);
          ctx.lineTo(fc + farHalf, farTop);
          ctx.lineTo(nc + nearHalf, nearTop);
          ctx.lineTo(nc - nearHalf, nearTop);
          ctx.closePath();
          var blackPress = ctx.createLinearGradient(0, farTop, 0, nearTop);
          blackPress.addColorStop(0, "hsla(" + hue + ",100%,74%," + g * 0.06 * strength + ")");
          blackPress.addColorStop(1, "hsla(" + hue + ",100%,76%," + g * 0.2 * strength + ")");
          ctx.fillStyle = blackPress;
          ctx.fill();
        }
        ctx.strokeStyle = "rgba(226,238,255," + (0.22 + 0.18 * glass) + ")";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(fc - farHalf, farTop);
        ctx.lineTo(fc + farHalf, farTop);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255," + 0.08 * glass + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fc - farHalf, farTop);
        ctx.lineTo(nc - nearHalf, nearTop);
        ctx.stroke();
        ctx.strokeStyle = "rgba(150,172,210," + 0.08 * glass + ")";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(nc - nearHalf, nearTop + faceH);
        ctx.lineTo(nc + nearHalf, nearTop + faceH);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "lighter";
      for (var sp = _pianoSidePulses.length - 1; sp >= 0; sp--) {
        var sidePulse = _pianoSidePulses[sp];
        sidePulse.age += 1;
        var st = sidePulse.age / sidePulse.life;
        if (st >= 1) {
          _pianoSidePulses.splice(sp, 1);
          continue;
        }
        var attack = Math.min(1, st / 0.28);
        attack = attack * attack * (3 - 2 * attack);
        var sEnv = attack * Math.pow(1 - st, 1.5);
        var sHeight = h * (0.1 + 0.2 * sidePulse.pitch);
        var sCy = h - sHeight * 0.52;
        var sCx = sidePulse.side < 0 ? -w * 0.015 : w * 1.015;
        var sR = Math.max(120, sHeight * 0.95);
        var bloom = ctx.createRadialGradient(sCx, sCy, 0, sCx, sCy, sR);
        bloom.addColorStop(0, "hsla(" + sidePulse.hue + ",100%,78%," + sEnv * 0.15 * strength + ")");
        bloom.addColorStop(0.45, "hsla(" + sidePulse.hue + ",100%,74%," + sEnv * 0.06 * strength + ")");
        bloom.addColorStop(1, "hsla(" + sidePulse.hue + ",100%,70%,0)");
        ctx.fillStyle = bloom;
        ctx.fillRect(sidePulse.side < 0 ? 0 : w - sR, sCy - sR, sR, sR * 2);
      }
      for (var te = _pianoTopEchoes.length - 1; te >= 0; te--) {
        var echo = _pianoTopEchoes[te];
        echo.age += 1;
        var et = echo.age / echo.life;
        if (et >= 1) {
          _pianoTopEchoes.splice(te, 1);
          continue;
        }
        var efade = Math.pow(1 - et, 1.6);
        var erx = echo.size + et * 55;
        var ery = 8 + et * 16;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, 55);
        ctx.clip();
        var eg = ctx.createRadialGradient(echo.x, 0, 0, echo.x, 0, erx);
        eg.addColorStop(0, "hsla(" + echo.hue + ",100%,84%," + efade * 0.22 * strength + ")");
        eg.addColorStop(0.5, "hsla(" + ((echo.hue + 12) % 360) + ",100%,76%," + efade * 0.08 * strength + ")");
        eg.addColorStop(1, "hsla(" + ((echo.hue + 24) % 360) + ",100%,70%,0)");
        ctx.fillStyle = eg;
        ctx.fillRect(echo.x - erx, 0, erx * 2, 55);
        ctx.restore();
        ctx.strokeStyle = "hsla(" + echo.hue + ",100%,84%," + efade * 0.45 * strength + ")";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(echo.x, 0, erx * 0.55, ery * 0.62, 0, 0, Math.PI);
        ctx.stroke();
        ctx.strokeStyle = "hsla(" + echo.hue + ",100%,82%," + efade * 0.24 * strength + ")";
        ctx.beginPath();
        ctx.ellipse(echo.x, 0, erx, ery, 0, 0, Math.PI);
        ctx.stroke();
        ctx.fillStyle = "hsla(" + echo.hue + ",100%,88%," + efade * 0.35 * strength + ")";
        ctx.fillRect(echo.x - echo.size * 0.5, 0, echo.size, 1.4);
      }
      for (var rp = _pianoRipples.length - 1; rp >= 0; rp--) {
        var rip = _pianoRipples[rp];
        rip.age += 1;
        var rt = rip.age / rip.life;
        if (rt >= 1) {
          _pianoRipples.splice(rp, 1);
          continue;
        }
        var rr = (rip.black ? layout.blackNearW : whiteNearW) * (0.4 + rt * 1.1);
        var ra = Math.pow(1 - rt, 2) * 0.3 * strength;
        ctx.strokeStyle = "hsla(" + rip.hue + ",100%,80%," + ra + ")";
        ctx.lineWidth = 1.4 - rt * 0.6;
        ctx.beginPath();
        ctx.ellipse(rip.x, rip.y, rr, rr * 0.42, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (i = 0; i < 14; i++) {
        g = _pianoGlow["w" + i] || 0;
        if (g < 0.02) continue;
        cx = pianoXAt((i + 0.5) / 14, layout, 0.6);
        hue = 190 + (i / 13) * 26;
        drawPianoGlow(ctx, cx, farY + layout.keyH * 0.55, whiteNearW * 1.15, 30 * g + 8, hue, g * 0.32 * strength);
        var beam = ctx.createLinearGradient(0, farY - 48, 0, farY);
        beam.addColorStop(0, "hsla(" + hue + ",100%,76%,0)");
        beam.addColorStop(1, "hsla(" + hue + ",100%,78%," + g * 0.16 * strength + ")");
        ctx.fillStyle = beam;
        ctx.fillRect(cx - whiteNearW * 0.32, farY - 48, whiteNearW * 0.64, 48);
        var reflect = ctx.createLinearGradient(0, nearY + lip, 0, h);
        reflect.addColorStop(0, "hsla(" + hue + ",100%,76%," + g * 0.14 * strength + ")");
        reflect.addColorStop(1, "hsla(" + hue + ",100%,70%,0)");
        ctx.fillStyle = reflect;
        ctx.fillRect(layout.nearX + (i / 14) * layout.nearW, nearY + lip, whiteNearW, h - nearY - lip);
      }
      for (i = 0; i < 10; i++) {
        g = _pianoGlow["b" + i] || 0;
        if (g < 0.02) continue;
        var base2 = PIANO_BLACK_BASES[i];
        cx = pianoXAt((base2 + 1) / 14, layout, 0.6);
        hue = 282 + (i / 9) * 44;
        drawPianoGlow(ctx, cx, farY + layout.blackH * 0.55, layout.blackNearW * 1.05, 26 * g + 8, hue, g * 0.38 * strength);
        var beam2 = ctx.createLinearGradient(0, farY - 42, 0, farY);
        beam2.addColorStop(0, "hsla(" + hue + ",100%,76%,0)");
        beam2.addColorStop(1, "hsla(" + hue + ",100%,78%," + g * 0.17 * strength + ")");
        ctx.fillStyle = beam2;
        ctx.fillRect(cx - layout.blackNearW * 0.34, farY - 42, layout.blackNearW * 0.68, 42);
        var reflect2 = ctx.createLinearGradient(0, nearY + lip, 0, h);
        reflect2.addColorStop(0, "hsla(" + hue + ",100%,74%," + g * 0.15 * strength + ")");
        reflect2.addColorStop(1, "hsla(" + hue + ",100%,70%,0)");
        ctx.fillStyle = reflect2;
        ctx.fillRect(cx - layout.blackNearW * 0.4, nearY + lip, layout.blackNearW * 0.8, h - nearY - lip);
      }
      for (i = _pianoNotes.length - 1; i >= 0; i--) {
        var d = _pianoNotes[i];
        d.prog += 1 / d.life;
        if (d.prog >= 1) {
          _pianoNotes.splice(i, 1);
          continue;
        }
        var ease = 1 - Math.pow(1 - d.prog, 1.9);
        var y = d.y0 - d.target * ease;
        var x2 = d.bx + Math.sin(d.swayPh + frm * d.swaySpd) * d.swayAmp * (0.35 + 0.65 * d.prog);
        if (!d.echoed && d.prog >= 0.72) {
          d.echoed = true;
          _pianoTopEchoes.push({ x: x2, age: 0, life: 36, hue: d.hue, size: 16 + Math.random() * 12 });
          if (_pianoTopEchoes.length > 14) _pianoTopEchoes.shift();
        }
        var fadeIn = Math.min(1, d.prog / 0.1);
        var outT = Math.max(0, (d.prog - 0.62) / 0.38);
        var fadeOut = 1 - outT * outT * (3 - 2 * outT);
        var alpha = 0.7 * strength * fadeIn * fadeOut;
        if (alpha < 0.01) continue;
        var size = d.size * (0.96 + 0.1 * d.prog);
        var halo = ctx.createRadialGradient(x2, y, 0, x2, y, size * 2.2);
        halo.addColorStop(0, "hsla(" + d.hue + ",100%,76%," + alpha * 0.46 + ")");
        halo.addColorStop(0.45, "hsla(" + ((d.hue + 16) % 360) + ",100%,68%," + alpha * 0.18 + ")");
        halo.addColorStop(1, "hsla(" + ((d.hue + 30) % 360) + ",100%,62%,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(x2 - size * 2.2, y - size * 2.2, size * 4.4, size * 4.4);
        ctx.save();
        ctx.translate(x2, y);
        ctx.rotate(d.rot + Math.sin(frm * 0.01 + d.swayPh) * 0.06);
        ctx.scale(size, size);
        ctx.fillStyle = "hsla(" + d.hue + ",100%,87%," + alpha + ")";
        ctx.fill(glyphs[d.glyph]);
        ctx.restore();
      }
      ctx.restore();
      for (var key in _pianoGlow) {
        var target = _pianoPress[key] ? 1 : 0;
        var value = _pianoGlow[key] || 0;
        value += (target - value) * (target ? 0.32 : 0.11);
        if (!target && value < 0.01) value = 0;
        _pianoGlow[key] = value;
      }
      for (var pressed in _pianoPress) {
        if (pressed in _pianoGlow) continue;
        _pianoGlow[pressed] = 0.32;
      }
    }
  };
  function drawPianoGlow(ctx, cx, cy, rx, ry, hue, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(rx, ry);
    var glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    glow.addColorStop(0, "hsla(" + hue + ",100%,78%," + alpha + ")");
    glow.addColorStop(0.5, "hsla(" + ((hue + 12) % 360) + ",100%,70%," + alpha * 0.55 + ")");
    glow.addColorStop(1, "hsla(" + ((hue + 24) % 360) + ",100%,64%,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
