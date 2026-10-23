  themeEffects.stars = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 150; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 0.5 + Math.random() * 2.5,
          op: 0.3 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
          speed: 5e-3 + Math.random() * 0.02
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(10,10,30," + 0.3 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], twinkle = 0.5 + 0.5 * Math.sin(frm * d.speed + d.phase);
        const a = d.op * twinkle * (int / 100);
        ctx.fillStyle = "rgba(255,240,200," + a + ")";
        ctx.shadowColor = "rgba(255,240,200," + a * 0.5 + ")";
        ctx.shadowBlur = d.sz * 4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  };
  






