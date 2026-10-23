  themeEffects.water = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 150; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 2 + Math.random() * 8,
          sp: 0.1 + Math.random() * 0.5,
          op: 0.1 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(10,40,80," + 0.15 * int / 100 + ")";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100), sz = d.sz * (int / 100);
        ctx.fillStyle = "rgba(100,180,255," + a * 0.3 + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, sz, 0, Math.PI * 2);
        ctx.fill();
        d.y += d.sp;
        d.x += Math.sin(frm * 0.01 + d.phase) * 0.5;
        if (d.y > h + 10) {
          d.y = -10;
          d.x = Math.random() * w;
        }
      }
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "rgba(200,230,255," + 0.02 * int / 100 + ")";
        ctx.beginPath();
        ctx.moveTo(w * 0.2 + i * w * 0.3 + Math.sin(frm * 1e-3 + i) * 30, 0);
        ctx.lineTo(w * 0.15 + i * w * 0.3 + Math.sin(frm * 1e-3 + i + 1) * 30, h);
        ctx.lineTo(w * 0.25 + i * w * 0.3 + Math.sin(frm * 1e-3 + i + 2) * 30, h);
        ctx.closePath();
        ctx.fill();
      }
    }
  };
