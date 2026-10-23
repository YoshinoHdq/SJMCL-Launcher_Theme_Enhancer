  themeEffects.mc = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 60; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 3 + Math.random() * 10,
          sp: 0.2 + Math.random() * 0.8,
          op: 0.3 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          col: Math.floor(Math.random() * 3)
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(30,30,30," + 0.2 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      const cols = ["#7CB342", "#5D9CEC", "#FFD54F", "#8D6E63", "#E57373", "#BA68C8"];
      for (let i = 0; i < p.length; i++) {
        const d = p[i], sz = d.sz * (int / 100), a = d.op * (int / 100);
        ctx.fillStyle = cols[d.col % cols.length];
        ctx.globalAlpha = a;
        ctx.fillRect(d.x - sz / 2, d.y - sz / 2, sz, sz);
        ctx.globalAlpha = 1;
        d.y += d.sp * Math.sin(frm * 0.02 + d.phase);
        d.x += Math.cos(frm * 0.015 + d.phase) * 0.5;
        if (d.y > h + 10 || d.y < -10) {
          d.y = Math.random() * h;
          d.x = Math.random() * w;
        }
      }
    }
  };
