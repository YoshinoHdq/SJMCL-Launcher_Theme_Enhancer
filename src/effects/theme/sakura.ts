  themeEffects.sakura = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 160; i++) {
        const depth = Math.random();
        const fromLeft = Math.random() > 0.72;
        p.push({
          x: fromLeft ? -12 - Math.random() * c2.width * 0.12 : Math.random() * c2.width,
          y: fromLeft ? Math.random() * c2.height : -12 - Math.random() * c2.height * 0.15,
          depth,
          sz: 3 + depth * 7 + Math.random() * 3,
          vx: 0.22 + depth * 0.65 + Math.random() * 0.22,
          vy: 0.38 + depth * 0.85 + Math.random() * 0.25,
          op: 0.28 + depth * 0.52,
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.035,
          flip: Math.random() * Math.PI * 2,
          flipSpeed: 0.012 + Math.random() * 0.025,
          sway: 0.25 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
          hue: 330 + Math.random() * 18,
          sat: 58 + Math.random() * 24,
          light: 72 + Math.random() * 18
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, 0, w, h);
      grd.addColorStop(0, "rgba(255,185,210," + 0.025 * int / 100 + ")");
      grd.addColorStop(1, "rgba(90,25,55," + 0.055 * int / 100 + ")");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      const wind = 0.28 + 0.55 * (0.5 + 0.5 * Math.sin(frm * 0.006));
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        const a = Math.min(0.92, d.op * (int / 100));
        const sz = d.sz * (0.8 + 0.4 * int / 100);
        if (a > 0.02) {
          ctx.save();
          ctx.translate(d.x, d.y);
          ctx.rotate(d.rot);
          ctx.scale(0.18 + Math.abs(Math.cos(d.flip)) * 0.82, 1);
          ctx.fillStyle = "hsla(" + d.hue + "," + d.sat + "%," + d.light + "%," + a + ")";
          ctx.beginPath();
          ctx.moveTo(0, -sz);
          ctx.bezierCurveTo(sz * 0.95, -sz * 0.38, sz * 0.62, sz * 0.5, 0, sz);
          ctx.bezierCurveTo(-sz * 0.62, sz * 0.5, -sz * 0.95, -sz * 0.38, 0, -sz);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        d.x += d.vx + wind * d.sway;
        d.y += d.vy;
        d.rot += d.spin;
        d.flip += d.flipSpeed;
        if (d.x > w + sz * 2 || d.y > h + sz * 2) {
          if (Math.random() < 0.72) {
            d.x = Math.random() * w;
            d.y = -sz * 2 - Math.random() * h * 0.1;
          } else {
            d.x = -sz * 2 - Math.random() * w * 0.08;
            d.y = Math.random() * h * 0.75;
          }
          d.depth = Math.random();
          d.sz = 3 + d.depth * 7 + Math.random() * 3;
          d.vx = 0.22 + d.depth * 0.65 + Math.random() * 0.22;
          d.vy = 0.38 + d.depth * 0.85 + Math.random() * 0.25;
        }
      }
    }
  };
