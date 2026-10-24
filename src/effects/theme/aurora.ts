  function auroraRand(seed) {
    var x = Math.sin(seed * 19.731) * 13715.37;
    return x - Math.floor(x);
  }
  themeEffects.aurora = {
    init: function(c2) {
      var p = [];
      for (var i = 0; i < 60; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height * 0.68,
          size: 0.4 + Math.random() * 1.3,
          ph: Math.random() * Math.PI * 2,
          rate: 0.6 + Math.random() * 1.2,
          hue: 190 + Math.random() * 100
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      var wash = ctx.createRadialGradient(w * 0.5, h * 0.02, 0, w * 0.5, h * 0.02, Math.max(w * 0.7, h * 0.6));
      wash.addColorStop(0, "hsla(286,100%,70%," + 0.05 * strength + ")");
      wash.addColorStop(0.35, "hsla(230,100%,66%," + 0.03 * strength + ")");
      wash.addColorStop(0.6, "hsla(185,100%,64%," + 0.025 * strength + ")");
      wash.addColorStop(1, "hsla(270,100%,64%,0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h * 0.7);
      var layers = [
        { count: 56, top: 0.02, bottom: 0.42, width: 10, alpha: 0.1, underlay: 0.1, amp: 24, speed: 0.0009, phase: 0, hueT: 295, hueM: 200, hueB: 170 },
        { count: 64, top: 0.05, bottom: 0.36, width: 8, alpha: 0.13, underlay: 0.14, amp: 18, speed: 0.0013, phase: 2.1, hueT: 270, hueM: 168, hueB: 142 },
        { count: 50, top: 0.08, bottom: 0.31, width: 11, alpha: 0.16, underlay: 0.16, amp: 13, speed: 0.0017, phase: 4.2, hueT: 235, hueM: 158, hueB: 150 }
      ];
      for (var l = 0; l < layers.length; l++) {
        var layer = layers[l];
        var drift = Math.sin(frm * layer.speed * 0.35 + layer.phase) * w * 0.025;
        var gTop = h * layer.top - layer.amp * 2.5;
        var gBottom = h * layer.bottom + layer.amp * 3;
        var grd = ctx.createLinearGradient(0, gTop, 0, gBottom);
        grd.addColorStop(0, "hsla(" + layer.hueT + ",100%,76%,0)");
        grd.addColorStop(0.18, "hsla(" + layer.hueT + ",100%,72%,0.7)");
        grd.addColorStop(0.4, "hsla(" + layer.hueM + ",100%,70%,1)");
        grd.addColorStop(0.65, "hsla(" + layer.hueB + ",100%,68%,0.95)");
        grd.addColorStop(0.88, "hsla(" + (layer.hueB + 10) + ",100%,66%,0.3)");
        grd.addColorStop(0.96, "hsla(" + (layer.hueB + 10) + ",100%,64%,0.08)");
        grd.addColorStop(1, "hsla(" + (layer.hueB + 10) + ",100%,64%,0)");
        var under = ctx.createLinearGradient(0, gTop, 0, gBottom);
        under.addColorStop(0, "hsla(" + layer.hueT + ",100%,72%,0)");
        under.addColorStop(0.22, "hsla(" + layer.hueM + ",100%,70%," + layer.underlay * 0.6 * strength + ")");
        under.addColorStop(0.55, "hsla(" + layer.hueB + ",100%,66%," + layer.underlay * strength + ")");
        under.addColorStop(0.9, "hsla(" + (layer.hueB + 8) + ",100%,64%," + layer.underlay * 0.25 * strength + ")");
        under.addColorStop(1, "hsla(" + (layer.hueB + 8) + ",100%,64%,0)");
        var pts = 36;
        ctx.beginPath();
        for (var s = 0; s <= pts; s++) {
          var us = s / pts;
          var xs = us * w + drift;
          var ys = h * layer.top +
            Math.sin(us * Math.PI * 2 * 1.3 + frm * 0.004 + layer.phase) * layer.amp +
            Math.sin(us * Math.PI * 2 * 4.2 - frm * 0.006 + layer.phase) * layer.amp * 0.4;
          if (s === 0) ctx.moveTo(xs, ys);
          else ctx.lineTo(xs, ys);
        }
        for (var s2 = pts; s2 >= 0; s2--) {
          var us2 = s2 / pts;
          var xs2 = us2 * w + drift;
          var ys2 = h * layer.bottom + Math.sin(us2 * Math.PI * 2 * 2.1 + frm * 0.003 + layer.phase) * layer.amp * 1.1;
          ctx.lineTo(xs2, ys2);
        }
        ctx.closePath();
        ctx.fillStyle = under;
        ctx.fill();
        ctx.fillStyle = grd;
        for (var i = 0; i < layer.count; i++) {
          var u = (i + 0.5) / layer.count;
          var jitter = (auroraRand(i * 1.7 + l * 33.1) - 0.5) * 12;
          var x = u * w + drift + jitter + Math.sin(frm * 0.004 + i * 0.7 + layer.phase) * 5;
          var top = h * layer.top +
            Math.sin(u * Math.PI * 2 * 1.3 + frm * 0.004 + layer.phase) * layer.amp +
            Math.sin(u * Math.PI * 2 * 4.2 - frm * 0.006 + layer.phase) * layer.amp * 0.4;
          var bottom = h * layer.bottom +
            Math.sin(u * Math.PI * 2 * 2.1 + frm * 0.003 + layer.phase) * layer.amp * 1.1;
          var rayW = layer.width * (0.5 + auroraRand(i * 3.3 + l * 17.9) * 1.1);
          var shimmer = 0.5 + 0.5 * Math.sin(u * w * 0.018 - frm * 0.055 + layer.phase);
          var rayA = layer.alpha * strength * (0.55 + 0.45 * shimmer) * (0.7 + 0.3 * auroraRand(i * 7.1 + l)) * (i % 7 === 0 ? 1.5 : 1);
          ctx.globalAlpha = Math.max(0, Math.min(1, rayA));
          ctx.beginPath();
          ctx.moveTo(x, top);
          ctx.lineTo(x + rayW, top + Math.sin(u * 8 + frm * 0.002) * 4);
          ctx.lineTo(x + rayW, bottom);
          ctx.lineTo(x, bottom - 4);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      var horizon = ctx.createLinearGradient(0, h * 0.28, 0, h * 0.46);
      horizon.addColorStop(0, "hsla(150,100%,64%,0)");
      horizon.addColorStop(0.5, "hsla(155,100%,66%," + 0.09 * strength + ")");
      horizon.addColorStop(1, "hsla(160,100%,62%,0)");
      ctx.fillStyle = horizon;
      ctx.fillRect(0, h * 0.28, w, h * 0.18);
      for (var s3 = 0; s3 < p.length; s3++) {
        var star = p[s3];
        var tw = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(frm * 0.02 * star.rate + star.ph), 2);
        ctx.fillStyle = "hsla(" + star.hue + ",100%,86%," + 0.36 * tw * strength + ")";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  };
