  themeEffects.ripples = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 120; i++) {
        p.push({
          type: "rain",
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          len: 10 + Math.random() * 18,
          speed: 1.8 + Math.random() * 3.5,
          width: 0.55 + Math.random() * 0.95,
          op: 0.15 + Math.random() * 0.15,
          phase: Math.random() * Math.PI * 2
        });
      }
      for (let i = 0; i < 64; i++) {
        const life = 80 + Math.random() * 110;
        p.push({
          type: "ripple",
          x: Math.random() * c2.width,
          y: c2.height * (0.72 + Math.random() * 0.28),
          age: Math.random() * life,
          life,
          maxRadius: 20 + Math.random() * 42,
          op: 0.34 + Math.random() * 0.34
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const strength = int / 100;
      const ground = ctx.createLinearGradient(0, h * 0.64, 0, h);
      ground.addColorStop(0, "rgba(25,45,70,0)");
      ground.addColorStop(1, "rgba(20,35,58," + 0.055 * strength + ")");
      ctx.fillStyle = ground;
      ctx.fillRect(0, h * 0.64, w, h * 0.36);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        if (d.type === "rain") {
          const a = Math.min(0.65, d.op * (0.55 + strength * 0.9));
          ctx.strokeStyle = "rgba(145,180,225," + a + ")";
          ctx.lineWidth = d.width;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + 1.2, d.y - d.len);
          ctx.stroke();
          d.y += d.speed * (0.7 + strength * 0.45);
          d.x += Math.sin(frm * 0.008 + d.phase) * 0.12;
          if (d.y > h + 20) {
            d.y = -20;
            d.x = Math.random() * w;
          }
          continue;
        }
        d.age += 0.8 + strength * 0.85;
        if (d.age >= d.life) {
          d.age = 0;
          d.life = 80 + Math.random() * 110;
          d.x = Math.random() * w;
          d.y = h * (0.72 + Math.random() * 0.28);
          d.maxRadius = 20 + Math.random() * 42;
        }
        const progress = d.age / d.life;
        const radius = d.maxRadius * (1 - Math.pow(1 - progress, 2));
        const alpha = Math.min(0.82, d.op * Math.pow(1 - progress, 1.7) * (0.55 + strength * 0.55));
        if (alpha < 0.01 || radius < 1) continue;
        ctx.strokeStyle = "rgba(100,175,245," + alpha * 0.22 + ")";
        ctx.lineWidth = 2.2 + (1 - progress) * 2.6;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, radius, radius * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(145,205,255," + alpha + ")";
        ctx.lineWidth = 1.1 + (1 - progress) * 1.8;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, radius, radius * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(125,180,245," + alpha * 0.55 + ")";
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, radius * 0.7, radius * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
        if (progress < 0.18) {
          ctx.fillStyle = "rgba(210,235,255," + alpha * 0.8 + ")";
          ctx.beginPath();
          ctx.arc(d.x, d.y - 1, 1 + (1 - progress) * 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  };
