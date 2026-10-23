  themeEffects.rain = {
    init: function(c2) {
      const p = [];
      for (let i = 0; i < 200; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          len: 10 + Math.random() * 25,
          sp: 4 + Math.random() * 8,
          op: 0.2 + Math.random() * 0.4,
          w: 0.5 + Math.random() * 1.5
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createLinearGradient(0, h * 0.3, 0, h);
      grd.addColorStop(0, "rgba(30,40,80,0.1)");
      grd.addColorStop(1, "rgba(30,40,80,0.3)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i], a = d.op * (int / 100);
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 1, d.y - d.len);
        ctx.strokeStyle = "rgba(120,150,220," + a + ")";
        ctx.lineWidth = d.w;
        ctx.stroke();
        d.y += d.sp;
        d.x += Math.sin(frm * 0.01 + i) * 0.3;
        if (d.y > h + 20) {
          d.y = -20;
          d.x = Math.random() * w;
        }
      }
    }
  };
