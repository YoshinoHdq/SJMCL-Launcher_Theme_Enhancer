  themeEffects.dust = {
    init: function(c2) {
      var p = [];
      for (var i = 0; i < 200; i++) {
        p.push({ x: Math.random() * c2.width, y: Math.random() * c2.height * -1, sz: 2 + Math.floor(Math.random() * 4), sp: 0.2 + Math.random() * 0.6, op: 0.2 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2, drift: (Math.random() - 0.5) * 0.8, colorIdx: Math.floor(Math.random() * 8) });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(180,160,120," + 0.08 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      var sizes = [2, 3, 4, 5];
      for (var i = 0; i < p.length; i++) {
        var d = p[i], sz = d.sz * (int / 100), a = d.op * (int / 100);
        if (a < 0.02) continue;
        ctx.fillStyle = "rgba(" + (180 + Math.floor(Math.random() * 40)) + "," + (160 + Math.floor(Math.random() * 40)) + "," + (140 + Math.floor(Math.random() * 40)) + "," + a + ")";
        ctx.fillRect(Math.round(d.x), Math.round(d.y), Math.round(Math.max(sz, 1)), Math.round(Math.max(sz, 1)));
        d.y += d.sp;
        d.x += Math.sin(frm * 5e-3 + d.phase) * d.drift;
        if (d.y > h + 10) {
          d.y = -10;
          d.x = Math.random() * w;
          d.colorIdx = Math.floor(Math.random() * 8);
        }
      }
    }
  };
  




