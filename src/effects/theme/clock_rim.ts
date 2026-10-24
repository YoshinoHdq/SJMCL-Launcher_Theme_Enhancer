  var _pocketWatches = null;
  var _pocketPulses = [];
  function drawPocketWatch(ctx, d, frm, strength, pulses) {
    var r = d.size * 0.5;
    var alpha = d.alpha * strength;
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rot);
    var face = ctx.createRadialGradient(-r * 0.25, -r * 0.3, 0, 0, 0, r);
    face.addColorStop(0, "rgba(20,20,26," + 0.1 * alpha + ")");
    face.addColorStop(1, "rgba(6,6,10," + 0.3 * alpha + ")");
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = face;
    ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    var halo = ctx.createRadialGradient(0, 0, r * 0.8, 0, 0, r * 1.7);
    halo.addColorStop(0, "hsla(" + d.hue + ",70%,72%,0)");
    halo.addColorStop(0.55, "hsla(" + d.hue + ",70%,72%," + 0.07 * alpha + ")");
    halo.addColorStop(1, "hsla(" + d.hue + ",65%,60%,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(-r * 1.7, -r * 1.7, r * 3.4, r * 3.4);
    ctx.strokeStyle = "hsla(" + d.hue + ",60%,74%," + 0.5 * alpha + ")";
    ctx.lineWidth = Math.max(1.2, r * 0.035);
    ctx.beginPath();
    ctx.arc(0, 0, r - 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "hsla(" + d.hue + ",45%,66%," + 0.2 * alpha + ")";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
    ctx.stroke();
    for (var i = 0; i < 12; i++) {
      var a = (i / 12) * Math.PI * 2;
      var inner = r * (i % 3 === 0 ? 0.72 : 0.79);
      ctx.strokeStyle = "hsla(" + d.hue + ",60%,82%," + (i % 3 === 0 ? 0.45 : 0.3) * alpha + ")";
      ctx.lineWidth = i % 3 === 0 ? 1.4 : 1;
      ctx.beginPath();
      ctx.moveTo(Math.sin(a) * inner, -Math.cos(a) * inner);
      ctx.lineTo(Math.sin(a) * r * 0.9, -Math.cos(a) * r * 0.9);
      ctx.stroke();
    }
    var hourA = (frm * 0.00006 + d.phase * 1.6) % 1 * Math.PI * 2;
    var minA = (frm * 0.0006 + d.phase * 2.7) % 1 * Math.PI * 2;
    var sec = Math.floor(frm / 60 + d.tickPhase) % 60;
    var secA = (sec / 60) * Math.PI * 2;
    ctx.strokeStyle = "hsla(" + d.hue + ",45%,88%," + 0.55 * alpha + ")";
    ctx.lineWidth = Math.max(2, r * 0.06);
    ctx.beginPath();
    ctx.moveTo(-Math.sin(hourA) * r * 0.08, Math.cos(hourA) * r * 0.08);
    ctx.lineTo(Math.sin(hourA) * r * 0.38, -Math.cos(hourA) * r * 0.38);
    ctx.stroke();
    ctx.lineWidth = Math.max(1.3, r * 0.038);
    ctx.strokeStyle = "hsla(" + d.hue + ",50%,90%," + 0.6 * alpha + ")";
    ctx.beginPath();
    ctx.moveTo(-Math.sin(minA) * r * 0.1, Math.cos(minA) * r * 0.1);
    ctx.lineTo(Math.sin(minA) * r * 0.58, -Math.cos(minA) * r * 0.58);
    ctx.stroke();
    ctx.strokeStyle = "hsla(8,85%,72%," + 0.62 * alpha + ")";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-Math.sin(secA) * r * 0.16, Math.cos(secA) * r * 0.16);
    ctx.lineTo(Math.sin(secA) * r * 0.74, -Math.cos(secA) * r * 0.74);
    ctx.stroke();
    ctx.fillStyle = "hsla(" + d.hue + ",60%,86%," + 0.7 * alpha + ")";
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(1.6, r * 0.055), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(235,245,255," + 0.16 * alpha + ")";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.74, -2.55, -1.6);
    ctx.stroke();
    ctx.fillStyle = "hsla(" + d.hue + ",55%,74%," + 0.65 * alpha + ")";
    ctx.fillRect(-r * 0.06, -r - 6, r * 0.12, 5);
    ctx.strokeStyle = "hsla(" + d.hue + ",50%,72%," + 0.45 * alpha + ")";
    ctx.beginPath();
    ctx.arc(0, -r - 8.5, 2.2, 0, Math.PI * 2);
    ctx.stroke();
    if (d.chain) {
      ctx.strokeStyle = "hsla(" + d.hue + ",45%,70%," + 0.22 * alpha + ")";
      ctx.lineWidth = 1;
      for (var c = 0; c < 7; c++) {
        var ct = c / 7;
        var cx = -ct * r * 0.55 - Math.sin(ct * Math.PI) * r * 0.12;
        var cy = -r - 12 - ct * r * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 1.6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
    if (sec !== d.lastSec) {
      if (d.lastSec >= 0) {
        var cosR = Math.cos(d.rot);
        var sinR = Math.sin(d.rot);
        var tipX = Math.sin(secA) * r * 0.74;
        var tipY = -Math.cos(secA) * r * 0.74;
        pulses.push({
          x: d.x + tipX * cosR - tipY * sinR,
          y: d.y + tipX * sinR + tipY * cosR,
          age: 0,
          life: 34,
          hue: d.hue,
          size: r
        });
        if (pulses.length > 10) pulses.shift();
      }
      d.lastSec = sec;
    }
    ctx.restore();
  }
  themeEffects.clock_rim = {
    init: function(c2) {
      var w = c2.width, h = c2.height;
      var sizes = [48, 60, 76, 92, 54, 68];
      var zones = [
        [0.14, 0.22], [0.5, 0.15], [0.84, 0.24],
        [0.2, 0.74], [0.55, 0.82], [0.84, 0.7]
      ];
      var watches = [];
      for (var i = 0; i < sizes.length; i++) {
        watches.push({
          x: (zones[i][0] + (Math.random() - 0.5) * 0.06) * w,
          y: (zones[i][1] + (Math.random() - 0.5) * 0.06) * h,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.1,
          size: sizes[i],
          alpha: 0.5 + Math.random() * 0.3,
          hue: i === 4 ? 208 : 42,
          rotBase: (Math.random() - 0.5) * 0.5,
          rotAmp: 0.12 + Math.random() * 0.24,
          rotSpd: 0.0008 + Math.random() * 0.0014,
          phase: Math.random() * Math.PI * 2,
          tickPhase: Math.floor(Math.random() * 60),
          lastSec: -1,
          chain: i % 3 === 0
        });
      }
      _pocketWatches = watches;
      _pocketPulses.length = 0;
      var p = [];
      for (var d = 0; d < 30; d++) {
        p.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.08,
          vy: -0.02 - Math.random() * 0.06,
          size: 0.5 + Math.random() * 1.2,
          ph: Math.random() * Math.PI * 2
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < p.length; i++) {
        var dust = p[i];
        dust.x += dust.vx;
        dust.y += dust.vy;
        if (dust.x < -8) dust.x = w + 8;
        if (dust.x > w + 8) dust.x = -8;
        if (dust.y < -8) dust.y = h + 8;
        if (dust.y > h + 8) dust.y = -8;
        var tw = 0.4 + 0.6 * Math.sin(frm * 0.02 + dust.ph);
        ctx.fillStyle = "hsla(45,60%,86%," + 0.14 * tw * strength + ")";
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      var watches = _pocketWatches || [];
      for (var d = 0; d < watches.length; d++) {
        var watch = watches[d];
        watch.x += watch.vx;
        watch.y += watch.vy;
        if (watch.x < -120) watch.x = w + 120;
        if (watch.x > w + 120) watch.x = -120;
        if (watch.y < -120) watch.y = h + 120;
        if (watch.y > h + 120) watch.y = -120;
        watch.rot = watch.rotBase + Math.sin(frm * watch.rotSpd + watch.phase) * watch.rotAmp;
        drawPocketWatch(ctx, watch, frm, strength, _pocketPulses);
      }
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (var q = _pocketPulses.length - 1; q >= 0; q--) {
        var pulse = _pocketPulses[q];
        pulse.age += 1;
        var t = pulse.age / pulse.life;
        if (t >= 1) {
          _pocketPulses.splice(q, 1);
          continue;
        }
        var rr = pulse.size * (0.75 + t * 1.1);
        ctx.strokeStyle = "hsla(" + pulse.hue + ",70%,82%," + Math.pow(1 - t, 2) * 0.3 * strength + ")";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, rr, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  };
