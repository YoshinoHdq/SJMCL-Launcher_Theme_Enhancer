  themeEffects.sand = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 300; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 1 + Math.random() * 3,
          sp: 2 + Math.random() * 8,
          op: 0.1 + Math.random() * 0.3
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(150,120,60," + 0.08 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100);
        ctx.fillStyle = "rgba(200,170,100," + a + ")";
        ctx.fillRect(d.x, d.y, d.sz, d.sz);
        d.x += d.sp + Math.sin(frm * 0.01 + i) * 2;
        d.y += (Math.random() - 0.5) * 0.5;
        if (d.x > w + 5) {
          d.x = -5;
          d.y = Math.random() * h;
        }
      }
    }
  };
