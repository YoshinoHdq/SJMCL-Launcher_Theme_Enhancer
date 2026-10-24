  var _fireSprites = null;
  function fireMakeSprite(size, stops) {
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = Math.round(size * 1.7);
    var g = canvas.getContext("2d");
    var grd = g.createRadialGradient(size * 0.5, size * 1.0, 0, size * 0.5, size * 1.0, size * 0.48);
    for (var i = 0; i < stops.length; i++) grd.addColorStop(stops[i][0], stops[i][1]);
    g.fillStyle = grd;
    g.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
  }
  function fireEnsureSprites() {
    if (_fireSprites) return _fireSprites;
    _fireSprites = {
      core: fireMakeSprite(64, [
        [0, "hsla(52,100%,96%,0.95)"],
        [0.35, "hsla(46,100%,82%,0.75)"],
        [0.7, "hsla(38,100%,66%,0.3)"],
        [1, "hsla(32,100%,55%,0)"]
      ]),
      mid: fireMakeSprite(72, [
        [0, "hsla(38,100%,88%,0.85)"],
        [0.4, "hsla(26,100%,64%,0.6)"],
        [0.75, "hsla(16,100%,50%,0.25)"],
        [1, "hsla(10,100%,42%,0)"]
      ]),
      outer: fireMakeSprite(80, [
        [0, "hsla(26,100%,74%,0.55)"],
        [0.45, "hsla(12,100%,54%,0.38)"],
        [0.8, "hsla(4,100%,44%,0.15)"],
        [1, "hsla(0,100%,38%,0)"]
      ])
    };
    return _fireSprites;
  }
  function fireDrawBand(ctx, w, h, frm, strength, cfg) {
    var steps = 48;
    var top = h * (1 - cfg.base) - cfg.a1 - cfg.a2;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (var i = 0; i <= steps; i++) {
      var u = i / steps;
      var x = u * w;
      var y = h * (1 - cfg.base) +
        Math.sin(x * cfg.f1 + frm * cfg.s1 + cfg.ph) * cfg.a1 +
        Math.sin(x * cfg.f2 - frm * cfg.s2 + cfg.ph * 1.7) * cfg.a2;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    var grd = ctx.createLinearGradient(0, top, 0, h);
    grd.addColorStop(0, "hsla(" + (cfg.hue + 12) + ",100%,62%,0)");
    grd.addColorStop(0.35, "hsla(" + cfg.hue + ",100%," + (cfg.light + 8) + "%," + cfg.alpha * 0.25 * strength + ")");
    grd.addColorStop(0.75, "hsla(" + cfg.hue + ",100%," + cfg.light + "%," + cfg.alpha * 0.7 * strength + ")");
    grd.addColorStop(1, "hsla(" + (cfg.hue - 6) + ",100%," + (cfg.light - 6) + "%," + cfg.alpha * strength + ")");
    ctx.fillStyle = grd;
    ctx.fill();
  }
  function fireDrawTongue(ctx, x, baseY, tw, th, frm, phase, strength) {
    var sway = Math.sin(frm * 0.045 + phase) * tw * 0.22;
    var stagger = 0.8 + 0.2 * Math.sin(frm * 0.03 + phase * 1.7);
    var tipY = baseY - th * stagger;
    var grad = ctx.createLinearGradient(0, baseY, 0, tipY);
    grad.addColorStop(0, "hsla(44,100%,86%," + 0.5 * strength + ")");
    grad.addColorStop(0.4, "hsla(28,100%,62%," + 0.3 * strength + ")");
    grad.addColorStop(1, "hsla(16,100%,52%,0)");
    ctx.beginPath();
    ctx.moveTo(x - tw * 0.5, baseY);
    ctx.bezierCurveTo(x - tw * 0.42, baseY - th * 0.35, x + sway - tw * 0.22, baseY - th * 0.65, x + sway, tipY);
    ctx.bezierCurveTo(x + sway + tw * 0.22, baseY - th * 0.65, x + tw * 0.42, baseY - th * 0.35, x + tw * 0.5, baseY);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }
  themeEffects.fire = {
    init: function(c2) {
      fireEnsureSprites();
      var p = [];
      var layers = [
        { n: 50, min: 26, max: 44, smin: 1.4, smax: 2.3, amin: 0.7, amax: 1.0, img: "core" },
        { n: 50, min: 40, max: 70, smin: 0.9, smax: 1.6, amin: 0.5, amax: 0.8, img: "mid" },
        { n: 22, min: 60, max: 100, smin: 0.5, smax: 1.0, amin: 0.25, amax: 0.4, img: "outer" }
      ];
      for (var l = 0; l < layers.length; l++) {
        var cfg = layers[l];
        for (var i = 0; i < cfg.n; i++) {
          p.push({
            kind: 0,
            img: cfg.img,
            x: Math.random() * c2.width,
            y: c2.height * (0.88 + Math.random() * 0.14),
            size: cfg.min + Math.random() * (cfg.max - cfg.min),
            sp: cfg.smin + Math.random() * (cfg.smax - cfg.smin),
            op: cfg.amin + Math.random() * (cfg.amax - cfg.amin),
            drift: (Math.random() - 0.5) * 0.6,
            phase: Math.random() * Math.PI * 2,
            rate: 0.6 + Math.random() * 0.9
          });
        }
      }
      for (var e = 0; e < 26; e++) {
        p.push({
          kind: 1,
          x: Math.random() * c2.width,
          y: c2.height * (0.8 + Math.random() * 0.2),
          sp: 0.6 + Math.random() * 1.4,
          drift: (Math.random() - 0.5) * 1.8,
          phase: Math.random() * Math.PI * 2,
          rate: 0.8 + Math.random() * 1.4,
          size: 0.8 + Math.random() * 1.8
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      var sprites = fireEnsureSprites();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      var ambient = ctx.createRadialGradient(w * 0.5, h * 1.03, 0, w * 0.5, h * 1.03, Math.max(w * 0.55, h * 0.75));
      ambient.addColorStop(0, "hsla(20,100%,62%," + 0.16 * strength + ")");
      ambient.addColorStop(0.5, "hsla(14,100%,48%," + 0.06 * strength + ")");
      ambient.addColorStop(1, "hsla(8,100%,40%,0)");
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, w, h);
      fireDrawBand(ctx, w, h, frm, strength, { base: 0.2, ph: 0, f1: 0.012, s1: 0.03, a1: 32, f2: 0.031, s2: 0.05, a2: 14, hue: 6, light: 56, alpha: 0.65 });
      fireDrawBand(ctx, w, h, frm, strength, { base: 0.14, ph: 1.7, f1: 0.016, s1: 0.04, a1: 24, f2: 0.037, s2: 0.06, a2: 10, hue: 24, light: 68, alpha: 0.7 });
      for (var tg = 0; tg < 11; tg++) {
        var tx = ((tg + 0.5) / 11) * w + Math.sin(tg * 2.3) * w * 0.02;
        fireDrawTongue(ctx, tx, h * 0.995, 64 + (tg % 3) * 34, h * 0.23 + Math.sin(tg * 1.7) * h * 0.04, frm, tg * 1.3, strength);
      }
      fireDrawBand(ctx, w, h, frm, strength, { base: 0.08, ph: 3.1, f1: 0.021, s1: 0.055, a1: 16, f2: 0.049, s2: 0.08, a2: 7, hue: 46, light: 88, alpha: 0.65 });
      for (var i = 0; i < p.length; i++) {
        var d = p[i];
        if (d.kind === 0) {
          d.y -= d.sp * (0.6 + strength * 0.6);
          d.x += Math.sin(frm * 0.02 * d.rate + d.phase) * d.drift;
          if (d.y < h * 0.4) {
            d.y = h + Math.random() * 18;
            d.x = Math.random() * w;
            d.size = d.img === "core" ? 26 + Math.random() * 18 : d.img === "mid" ? 40 + Math.random() * 30 : 60 + Math.random() * 40;
          }
          var hf = Math.min(1, Math.max(0, (d.y - h * 0.42) / (h * 0.22)));
          var flicker = 0.82 + 0.18 * Math.sin(frm * 0.025 * d.rate + d.phase);
          var alpha = d.op * strength * hf * flicker;
          if (alpha < 0.02) continue;
          var sprite = sprites[d.img];
          var size = d.size * (0.9 + 0.1 * Math.sin(frm * 0.02 + d.phase));
          ctx.globalAlpha = Math.min(1, alpha);
          ctx.drawImage(sprite, d.x - size * 0.31, d.y - size * 1.4, size * 0.62, size * 1.9);
        } else {
          d.y -= d.sp * (0.7 + strength * 0.5);
          d.x += Math.sin(frm * 0.03 * d.rate + d.phase) * d.drift;
          if (d.y < h * 0.5) {
            d.y = h * (0.94 + Math.random() * 0.06);
            d.x = Math.random() * w;
          }
          var prog = Math.min(1, Math.max(0, (h * 0.96 - d.y) / (h * 0.42)));
          var hue = 48 - prog * 40;
          var eAlpha = (0.5 - prog * 0.3) * strength * (0.7 + 0.3 * Math.sin(frm * 0.06 * d.rate + d.phase));
          if (eAlpha < 0.02) continue;
          var es = d.size * (1 - prog * 0.45);
          ctx.fillStyle = "hsla(" + hue + ",100%,82%," + eAlpha * 0.15 + ")";
          ctx.beginPath();
          ctx.arc(d.x, d.y, es * 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "hsla(" + hue + ",100%," + (86 - prog * 16) + "%," + eAlpha + ")";
          ctx.beginPath();
          ctx.arc(d.x, d.y, es, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "hsla(30,100%,74%," + 0.08 * strength + ")";
      ctx.fillRect(0, h - 1.5, w, 1.5);
      ctx.restore();
    }
  };
