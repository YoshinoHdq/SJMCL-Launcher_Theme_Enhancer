  themeEffects.enchanting = {
    init: function(c2) {
      const p = [];
      const glyphs2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 60; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 16 + Math.random() * 22,
          sp: 0.15 + Math.random() * 0.5,
          op: 0.25 + Math.random() * 0.55,
          rot: Math.random() * Math.PI * 2,
          rotSp: (Math.random() - 0.5) * 0.01,
          phase: Math.random() * Math.PI * 2,
          wx: (Math.random() - 0.5) * 0.5,
          char: glyphs2[Math.floor(Math.random() * glyphs2.length)]
        });
      }
      for (let i = 0; i < 100; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: Math.random() * c2.height,
          sz: 0.5 + Math.random() * 3,
          sp: 0.05 + Math.random() * 0.3,
          op: 0.15 + Math.random() * 0.65,
          life: Math.random() * 100,
          phase: Math.random() * Math.PI * 2,
          isSparkle: true,
          hue: 260 + Math.random() * 60
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const bgX = w * 0.5 + Math.sin(frm * 1e-3) * w * 0.05;
      const bgY = h * 0.5 + Math.cos(frm * 15e-4) * h * 0.05;
      const bgGrd = ctx.createRadialGradient(bgX, bgY, 0, bgX, bgY, Math.max(w, h) * 0.7);
      bgGrd.addColorStop(0, "rgba(60,12,80," + 0.35 * int / 100 + ")");
      bgGrd.addColorStop(0.4, "rgba(35,8,55," + 0.25 * int / 100 + ")");
      bgGrd.addColorStop(0.7, "rgba(15,3,30," + 0.15 * int / 100 + ")");
      bgGrd.addColorStop(1, "rgba(5,1,10," + 0.05 * int / 100 + ")");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        if (!d.isSparkle) continue;
        d.life += 0.05;
        const twinkle = 0.3 + 0.7 * Math.sin(d.life * 0.012 + d.phase);
        const a = d.op * twinkle * (int / 100);
        if (a < 0.01) continue;
        ctx.fillStyle = "hsla(" + d.hue + ",80%,70%," + a + ")";
        ctx.shadowColor = "hsla(" + d.hue + ",80%,60%," + a * 0.6 + ")";
        ctx.shadowBlur = d.sz * 4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.sz * twinkle, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        d.y += d.sp * Math.sin(d.life * 0.04);
        d.x += Math.cos(d.life * 0.025 + d.phase) * 0.2;
        if (d.y > h + 5 || d.y < -5) {
          d.y = Math.random() * h;
          d.x = Math.random() * w;
        }
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        if (d.isSparkle) continue;
        const sz = d.sz * (int / 100);
        const a = d.op * (int / 100);
        if (a < 0.01) continue;
        const floatY = Math.sin(frm * 0.012 + d.phase) * 10;
        const floatX = Math.sin(frm * 8e-3 + d.phase * 1.3) * 6;
        ctx.save();
        ctx.translate(d.x + floatX, d.y + floatY);
        ctx.rotate(d.rot + Math.sin(frm * 8e-3 + d.phase) * 0.08);
        ctx.font = Math.round(sz) + "px GalacticSGA, serif";
        ctx.shadowColor = "rgba(180,80,255," + a * 0.9 + ")";
        ctx.shadowBlur = 20 + 15 * Math.sin(frm * 3e-3 + d.phase);
        ctx.fillStyle = "rgba(160,80,255," + a * 0.15 + ")";
        ctx.fillText(d.char, 5, 5);
        ctx.fillStyle = "rgba(200,140,255," + a * 0.25 + ")";
        ctx.fillText(d.char, 2, 2);
        ctx.shadowColor = "rgba(220,150,255," + a * 0.5 + ")";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(230,180,255," + a + ")";
        ctx.fillText(d.char, 0, 0);
        ctx.shadowBlur = 0;
        ctx.restore();
        d.y -= d.sp;
        d.x += d.wx + Math.sin(frm * 8e-3 + d.phase) * 0.3;
        d.rot += d.rotSp;
        if (d.y < -40) {
          d.y = h + 30;
          d.x = Math.random() * w;
          d.char = glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }
    }
  };
