  themeEffects.dna = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 18; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          length: 130 + Math.random() * 140,
          angle: 0.24 + Math.random() * 0.22,
          vx: 0.12 + Math.random() * 0.2,
          vy: 0.035 + Math.random() * 0.075,
          amp: 8 + Math.random() * 9,
          twist: 1.1 + Math.random() * 0.9,
          phase: Math.random() * Math.PI * 2,
          spin: 0.006 + Math.random() * 0.012,
          op: 0.25 + Math.random() * 0.22,
          size: 1.1 + Math.random() * 1.8
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
        d.x += d.vx * (0.7 + strength * 0.6);
        d.y += d.vy * (0.7 + strength * 0.6);
        d.phase += d.spin * (0.7 + strength * 0.5);
        if (d.x > w + d.length * 0.7) {
          d.x = -d.length * 0.7;
          d.y = Math.random() * h;
        }
        if (d.y > h + d.length * 0.7) {
          d.y = -d.length * 0.7;
          d.x = Math.random() * w;
        }
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.angle);
        for (let step = 0; step <= 20; step++) {
          const t = step / 20;
          const localY = (t - 0.5) * d.length;
          const theta = t * d.twist * Math.PI * 2 + d.phase;
          const depth = 0.5 + 0.5 * Math.cos(theta);
          const x1 = Math.sin(theta) * d.amp;
          const x2 = -x1;
          const alpha = d.op * (0.35 + strength * 0.65) * (0.28 + depth * 0.72);
          if (step % 2 === 0) {
            ctx.strokeStyle = "rgba(150,220,255," + alpha * 0.42 + ")";
            ctx.lineWidth = 0.7 + depth * 0.9;
            ctx.beginPath();
            ctx.moveTo(x1, localY);
            ctx.lineTo(x2, localY);
            ctx.stroke();
          }
          const radius = (0.7 + depth * 1.1) * d.size;
          ctx.fillStyle = "rgba(105,235,255," + alpha * 0.12 + ")";
          ctx.beginPath();
          ctx.arc(x1, localY, radius * 2.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(105,235,255," + alpha + ")";
          ctx.beginPath();
          ctx.arc(x1, localY, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(245,125,255," + alpha * 0.12 + ")";
          ctx.beginPath();
          ctx.arc(x2, localY, radius * 2.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(245,125,255," + alpha + ")";
          ctx.beginPath();
          ctx.arc(x2, localY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();
    }
  };
