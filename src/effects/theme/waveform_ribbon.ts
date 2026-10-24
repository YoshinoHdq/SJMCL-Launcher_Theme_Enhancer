  var _soundRings = [];
  var _soundRingCounter = 0;
  themeEffects.waveform_ribbon = {
    init: function(c2) {
      _soundRings.length = 0;
      _soundRingCounter = 0;
      var p = [];
      for (var i = 0; i < 32; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.1,
          size: 0.6 + Math.random() * 1.4,
          ph: Math.random() * Math.PI * 2
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      var cx = w * 0.5;
      var cy = h * 0.54;
      var R = Math.min(w, h) * 0.095;
      var beat = Math.pow(0.5 + 0.5 * Math.sin(frm * 0.03), 2);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      _soundRingCounter += 1;
      if (_soundRingCounter % 90 === 0) {
        _soundRings.push({ age: 0, life: 90 });
        if (_soundRings.length > 3) _soundRings.shift();
      }
      for (var r = _soundRings.length - 1; r >= 0; r--) {
        var ring = _soundRings[r];
        ring.age += 1;
        var rt = ring.age / ring.life;
        if (rt >= 1) {
          _soundRings.splice(r, 1);
          continue;
        }
        var rr = R * (1.15 + rt * 2.3);
        ctx.strokeStyle = "hsla(" + (198 - rt * 20) + ",100%,78%," + Math.pow(1 - rt, 2) * 0.3 * strength + ")";
        ctx.lineWidth = 1.4 * (1 - rt) + 0.4;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.stroke();
      }
      var halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.6);
      halo.addColorStop(0, "hsla(194,100%,84%," + (0.22 + beat * 0.14) * strength + ")");
      halo.addColorStop(0.45, "hsla(218,100%,72%," + (0.09 + beat * 0.07) * strength + ")");
      halo.addColorStop(1, "hsla(250,100%,66%,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(cx - R * 2.6, cy - R * 2.6, R * 5.2, R * 5.2);
      var core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.72);
      core.addColorStop(0, "hsla(190,100%,92%," + 0.42 * strength + ")");
      core.addColorStop(0.55, "hsla(200,100%,80%," + 0.2 * strength + ")");
      core.addColorStop(1, "hsla(220,100%,70%,0)");
      ctx.fillStyle = core;
      ctx.fillRect(cx - R * 0.72, cy - R * 0.72, R * 1.44, R * 1.44);
      var bars = 64;
      for (var i = 0; i < bars; i++) {
        var angle = (i / bars) * Math.PI * 2 + frm * 0.0022;
        var wave = Math.pow(0.5 + 0.5 * Math.sin(frm * 0.035 + i * 0.9), 2);
        var len = R * (0.28 + 0.62 * wave) * (0.7 + beat * 0.3) + R * 0.1;
        var r0 = R * 1.14;
        var r1 = r0 + len;
        var hue = 186 + (i / bars) * 74;
        ctx.strokeStyle = "hsla(" + hue + ",100%,76%," + (0.22 + wave * 0.46) * strength + ")";
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0);
        ctx.lineTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
        ctx.stroke();
        ctx.fillStyle = "hsla(" + hue + ",100%,86%," + (0.2 + wave * 0.4) * strength + ")";
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1, 1.1 + wave * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "hsla(200,100%,80%," + 0.16 * strength + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
      ctx.stroke();
      for (var d = 0; d < p.length; d++) {
        var mote = p[d];
        mote.x += mote.vx;
        mote.y += mote.vy;
        if (mote.x < -10) mote.x = w + 10;
        if (mote.x > w + 10) mote.x = -10;
        if (mote.y < -10) mote.y = h + 10;
        if (mote.y > h + 10) mote.y = -10;
        var tw = 0.45 + 0.55 * Math.sin(frm * 0.015 + mote.ph);
        ctx.fillStyle = "hsla(" + (196 + (mote.ph * 20) % 40) + ",100%,82%," + 0.18 * tw * strength + ")";
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };
