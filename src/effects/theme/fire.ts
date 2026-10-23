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
