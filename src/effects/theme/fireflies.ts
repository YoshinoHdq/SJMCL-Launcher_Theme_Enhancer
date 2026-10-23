  themeEffects.fireflies = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 110; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          vx: (Math.random() - 0.5) * 0.38,
          vy: -0.06 - Math.random() * 0.22,
          size: 1.2 + Math.random() * 2.3,
          phase: Math.random() * Math.PI * 2,
          pulse: 0.004 + Math.random() * 0.012,
          hue: 52 + Math.random() * 24,
          op: 0.35 + Math.random() * 0.65
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "rgba(3,13,24," + 0.22 * int / 100 + ")");
      bg.addColorStop(0.55, "rgba(5,24,28," + 0.18 * int / 100 + ")");
      bg.addColorStop(1, "rgba(4,12,16," + 0.28 * int / 100 + ")");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        d.phase += d.pulse;
        const pulse = 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(d.phase));
        const a = d.op * pulse * (int / 100);
        d.x += d.vx + Math.sin(frm * 0.004 + d.phase) * 0.16;
        d.y += d.vy + Math.cos(frm * 0.005 + d.phase) * 0.045;
        if (d.y < -20) {
          d.y = h + 20;
          d.x = Math.random() * w;
        }
        if (d.x < -20) d.x = w + 20;
        if (d.x > w + 20) d.x = -20;
        const glowRadius = d.size * (3.2 + pulse * 1.8);
        ctx.fillStyle = "hsla(" + d.hue + ",100%,72%," + a * 0.09 + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + (d.hue + 8) + ",100%,84%," + a + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };
