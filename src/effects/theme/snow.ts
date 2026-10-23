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
