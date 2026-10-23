  themeEffects.sunset = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 100; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 1 + Math.random() * 3,
          sp: 0.1 + Math.random() * 0.4,
          op: 0.1 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(255,180,80," + 0.15 * int / 100 + ")");
      grd.addColorStop(0.4, "rgba(255,100,50," + 0.15 * int / 100 + ")");
      grd.addColorStop(1, "rgba(80,40,80," + 0.3 * int / 100 + ")");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      const sunY = h * 0.65 + Math.sin(frm * 3e-3) * 10;
      const sun = ctx.createRadialGradient(w * 0.5, sunY, 0, w * 0.5, sunY, 100);
      sun.addColorStop(0, "rgba(255,220,150," + 0.3 * int / 100 + ")");
      sun.addColorStop(0.5, "rgba(255,150,50," + 0.15 * int / 100 + ")");
      sun.addColorStop(1, "rgba(255,100,50,0)");
      ctx.fillStyle = sun;
      ctx.beginPath();
      ctx.arc(w * 0.5, sunY, 100, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100);
        ctx.fillStyle = "rgba(255,200,100," + a * 0.5 + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.sz, 0, Math.PI * 2);
        ctx.fill();
        d.y += d.sp;
        d.x += Math.sin(frm * 5e-3 + d.phase) * 0.3;
        if (d.y > h + 5) {
          d.y = -5;
          d.x = Math.random() * w;
        }
      }
    }
  };
