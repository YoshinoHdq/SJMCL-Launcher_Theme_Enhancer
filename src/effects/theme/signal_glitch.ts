  var _glitchNext = -1;
  var _glitchStart = -1;
  var _glitchLife = 26;
  var _glitchSeed = 0;
  function glitchRand(seed, idx) {
    var x = Math.sin(seed * 12.9898 + idx * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }
  themeEffects.signal_glitch = {
    init: function(c2) {
      _glitchNext = -1;
      _glitchStart = -1;
      _glitchSeed = Math.random() * 1000;
      var p = [];
      for (var i = 0; i < 26; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          vy: 0.3 + Math.random() * 0.7,
          seed: Math.random() * 1000,
          hue: Math.random() < 0.5 ? 318 : 188,
          size: 3 + Math.random() * 2.6,
          x2: 0
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      if (_glitchNext < 0) _glitchNext = frm + 220 + Math.random() * 220;
      if (_glitchStart < 0 && frm >= _glitchNext) {
        _glitchStart = frm;
        _glitchLife = 20 + Math.random() * 18;
        _glitchSeed = Math.random() * 1000;
      }
      var progress = 0;
      var active = _glitchStart >= 0;
      if (active) {
        progress = (frm - _glitchStart) / _glitchLife;
        if (progress >= 1) {
          _glitchStart = -1;
          _glitchNext = frm + 300 + Math.random() * 240;
          active = false;
          progress = 0;
        }
      }
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "rgba(160,220,255," + 0.013 * strength + ")";
      for (var y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }
      var bandH = h * 0.075;
      var bandY = ((frm * 1.9) % (h + bandH * 2)) - bandH;
      var bandGrad = ctx.createLinearGradient(0, bandY, 0, bandY + bandH);
      bandGrad.addColorStop(0, "rgba(150,210,255,0)");
      bandGrad.addColorStop(0.5, "rgba(180,230,255," + 0.07 * strength + ")");
      bandGrad.addColorStop(1, "rgba(150,210,255,0)");
      ctx.fillStyle = bandGrad;
      ctx.fillRect(0, bandY, w, bandH);
      for (var n = 0; n < 12; n++) {
        var r = glitchRand(frm * 0.07 + n * 3.3, n);
        var ny = bandY + r * bandH;
        var nx = (glitchRand(frm * 0.05 + n, n + 5) - 0.5) * w * 0.06;
        var nw = w * (0.18 + glitchRand(frm * 0.03 + n, n + 9) * 0.8);
        ctx.fillStyle = n % 2 === 0
          ? "rgba(255,95,162," + 0.12 * strength + ")"
          : "rgba(95,240,255," + 0.12 * strength + ")";
        ctx.fillRect(nx, ny, nw, 1);
      }
      if (active) {
        var env = Math.min(1, progress / 0.1) * Math.pow(1 - progress, 0.55);
        for (var i = 0; i < 9; i++) {
          var r1 = glitchRand(_glitchSeed + i * 3.7, i);
          var r2 = glitchRand(_glitchSeed + i * 5.1, i + 2);
          var r3 = glitchRand(_glitchSeed + i * 7.3, i + 3);
          var r4 = glitchRand(_glitchSeed + i * 9.1, i + 4);
          var gy = r1 * h;
          var gh = 1.5 + r2 * 9;
          var gx = (r3 - 0.5) * w * 0.09;
          var gw = w * (0.2 + r4 * 0.8);
          var hue = i % 3 === 0 ? 322 : 186;
          ctx.fillStyle = "hsla(" + hue + ",100%,62%," + env * (0.06 + r2 * 0.1) * strength + ")";
          ctx.fillRect(gx, gy, gw, gh);
          if (i % 2 === 0) {
            ctx.fillStyle = "rgba(255,90,150," + env * 0.1 * strength + ")";
            ctx.fillRect(gx, gy - 1, gw * 0.6, 1);
            ctx.fillStyle = "rgba(90,240,255," + env * 0.1 * strength + ")";
            ctx.fillRect(gx, gy + gh, gw * 0.6, 1);
          }
        }
        for (var b = 0; b < 3; b++) {
          var bx = glitchRand(_glitchSeed + b * 13.1, b) * w;
          var by = glitchRand(_glitchSeed + b * 17.7, b + 4) * h;
          var bw = 8 + glitchRand(_glitchSeed + b * 19.3, b + 8) * 34;
          var bh = h * (0.08 + glitchRand(_glitchSeed + b * 23.9, b + 11) * 0.28);
          ctx.fillStyle = "rgba(150,220,255," + env * 0.05 * strength + ")";
          ctx.fillRect(bx, by, bw, bh);
          ctx.fillStyle = "rgba(255,255,255," + env * 0.16 * strength + ")";
          ctx.fillRect(bx + bw * 0.5, by, 1, bh);
        }
      }
      for (var d = 0; d < p.length; d++) {
        var drop = p[d];
        drop.y += drop.vy * (0.7 + strength * 0.5);
        if (drop.y > h + 18) {
          drop.y = -18;
          drop.x = Math.random() * w;
          drop.seed = Math.random() * 1000;
        }
        var glyphIndex = Math.floor(frm / 7 + drop.seed);
        var flick = 0.55 + 0.45 * Math.sin(frm * 0.07 + drop.seed);
        var alpha = (active ? 0.45 : 0.3) * flick * strength;
        var cell = drop.size;
        ctx.fillStyle = "hsla(" + drop.hue + ",100%,80%," + alpha + ")";
        for (var row = 0; row < 5; row++) {
          for (var col = 0; col < 3; col++) {
            if (glitchRand(drop.seed + glyphIndex * 17.3, row * 3 + col) < 0.48) continue;
            ctx.fillRect(drop.x + col * cell * 1.15, drop.y + row * cell * 1.15, cell, cell);
          }
        }
      }
      if (active) {
        var brightY = glitchRand(_glitchSeed + 41.3, 21) * h;
        var env2 = Math.min(1, progress / 0.1) * Math.pow(1 - progress, 0.55);
        ctx.fillStyle = "rgba(235,250,255," + env2 * 0.2 * strength + ")";
        ctx.fillRect(0, brightY, w, 1);
      }
      ctx.restore();
    }
  };
