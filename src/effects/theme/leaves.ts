  themeEffects.leaves = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 80; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 4 + Math.random() * 8,
          sp: 0.3 + Math.random() * 1.2,
          op: 0.4 + Math.random() * 0.5,
          rot: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
          hue: 30 + Math.random() * 60
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(60,30,10,0.05)");
      grd.addColorStop(1, "rgba(60,30,10,0.15)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], sz = d.sz * (int / 100), a = d.op * (int / 100);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot + frm * 0.01 * d.sp);
        ctx.fillStyle = "hsla(" + d.hue + ",80%,50%," + a + ")";
        ctx.beginPath();
        ctx.ellipse(0, 0, sz, sz * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        d.y += d.sp;
        d.x += Math.sin(frm * 0.02 + d.phase) * 1.5;
        d.rot += 0.02;
        if (d.y > h + 10) {
          d.y = -10;
          d.x = Math.random() * w;
        }
      }
    }
  };
