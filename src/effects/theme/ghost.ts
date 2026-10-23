  themeEffects.ghost = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 7; i++) {
        const size = 34 + Math.random() * 42;
        p.push({
          x: Math.random() * c2.width,
          y: c2.height * (0.2 + Math.random() * 0.8),
          size,
          vx: (Math.random() - 0.5) * 0.22,
          vy: -0.06 - Math.random() * 0.13,
          phase: Math.random() * Math.PI * 2,
          pulse: 0.004 + Math.random() * 0.009,
          op: 0.24 + Math.random() * 0.42,
          hue: 188 + Math.random() * 55
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const strength = int / 100;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        d.phase += d.pulse;
        d.x += d.vx + Math.sin(frm * 0.006 + d.phase) * 0.24;
        d.y += d.vy + Math.cos(frm * 0.004 + d.phase) * 0.035;
        if (d.y < -d.size * 2) {
          d.y = h + d.size * 2;
          d.x = Math.random() * w;
        }
        if (d.x < -d.size * 2) d.x = w + d.size * 2;
        if (d.x > w + d.size * 2) d.x = -d.size * 2;
        const pulse = 0.65 + 0.35 * Math.sin(d.phase);
        const a = d.op * strength * pulse;
        const s = d.size;
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(Math.sin(d.phase * 0.7) * 0.045);
        const body = ctx.createLinearGradient(0, -s, 0, s * 1.35);
        body.addColorStop(0, "hsla(" + d.hue + ",92%,88%," + a * 0.42 + ")");
        body.addColorStop(0.55, "hsla(" + (d.hue + 12) + ",90%,76%," + a * 0.28 + ")");
        body.addColorStop(1, "hsla(" + (d.hue + 24) + ",88%,70%,0)");
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.moveTo(-s * 0.56, -s * 0.05);
        ctx.bezierCurveTo(-s * 0.58, -s * 0.86, s * 0.58, -s * 0.86, s * 0.56, -s * 0.05);
        ctx.bezierCurveTo(s * 0.64, s * 0.35, s * 0.5, s * 0.68, s * 0.62, s * 1.04);
        ctx.bezierCurveTo(s * 0.3, s * 0.82, s * 0.18, s * 1.16, 0, s * 0.94);
        ctx.bezierCurveTo(-s * 0.18, s * 1.16, -s * 0.3, s * 0.82, -s * 0.62, s * 1.04);
        ctx.bezierCurveTo(-s * 0.5, s * 0.68, -s * 0.64, s * 0.35, -s * 0.56, -s * 0.05);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "hsla(" + (d.hue + 25) + ",100%,91%," + a * 0.85 + ")";
        ctx.beginPath();
        ctx.ellipse(-s * 0.19, -s * 0.2, s * 0.075, s * 0.12, -0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(s * 0.19, -s * 0.2, s * 0.075, s * 0.12, 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + (d.hue + 35) + ",100%,97%," + a * 0.5 + ")";
        ctx.beginPath();
        ctx.ellipse(-s * 0.19, -s * 0.2, s * 0.025, s * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(s * 0.19, -s * 0.2, s * 0.025, s * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
  };
