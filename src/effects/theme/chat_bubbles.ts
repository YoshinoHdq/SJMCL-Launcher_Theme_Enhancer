  function chatBubblePath(ctx, w, h) {
    var r = Math.min(h * 0.45, w * 0.3);
    ctx.beginPath();
    ctx.moveTo(-w * 0.5 + r, -h * 0.5);
    ctx.lineTo(w * 0.5 - r, -h * 0.5);
    ctx.quadraticCurveTo(w * 0.5, -h * 0.5, w * 0.5, -h * 0.5 + r);
    ctx.lineTo(w * 0.5, h * 0.5 - r);
    ctx.quadraticCurveTo(w * 0.5, h * 0.5, w * 0.5 - r, h * 0.5);
    ctx.lineTo(-w * 0.5 + r, h * 0.5);
    ctx.quadraticCurveTo(-w * 0.5, h * 0.5, -w * 0.5, h * 0.5 - r);
    ctx.lineTo(-w * 0.5, -h * 0.5 + r);
    ctx.quadraticCurveTo(-w * 0.5, -h * 0.5, -w * 0.5 + r, -h * 0.5);
    ctx.closePath();
  }
  themeEffects.chat_bubbles = {
    init: function(c2) {
      var p = [];
      for (var i = 0; i < 22; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: c2.height * (0.15 + Math.random() * 0.7),
          w: 50 + Math.random() * 45,
          h: 28 + Math.random() * 20,
          vx: (Math.random() - 0.5) * 0.12,
          hue: [200, 206, 330][Math.floor(Math.random() * 3)] + Math.random() * 10,
          phase: Math.random() * Math.PI * 2,
          rate: 0.5 + Math.random() * 0.8,
          side: Math.random() < 0.5 ? -1 : 1,
          mode: Math.random() < 0.6 ? 0 : 1,
          age: Math.random() * 300,
          life: 600 + Math.random() * 500,
          pop: 0,
          rank: Math.random()
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      ctx.save();
      for (var i = 0; i < p.length; i++) {
        var d = p[i];
        d.age += 1;
        d.x += d.vx;
        d.y += Math.sin(frm * 0.01 * d.rate + d.phase) * 0.14;
        if (d.age > d.life || d.x < -d.w || d.x > w + d.w) {
          d.x = Math.random() * w;
          d.y = h * (0.15 + Math.random() * 0.7);
          d.age = 0;
          d.life = 600 + Math.random() * 500;
          d.pop = 1;
        }
        var fadeIn = Math.min(1, d.age / 45);
        var fadeOut = Math.min(1, (d.life - d.age) / 70);
        var alpha = strength * fadeIn * fadeOut;
        if (alpha < 0.01) continue;
        if (d.rank > 0.4 + 0.6 * strength) continue;
        if (d.pop > 0) {
          ctx.strokeStyle = "hsla(" + d.hue + ",100%,86%," + d.pop * 0.3 * strength + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.w * 0.45 + (1 - d.pop) * 22, 0, Math.PI * 2);
          ctx.stroke();
          d.pop -= 0.035;
          if (d.pop < 0) d.pop = 0;
        }
        ctx.save();
        ctx.translate(d.x, d.y);
        chatBubblePath(ctx, d.w, d.h);
        ctx.fillStyle = "hsla(" + d.hue + ",72%,90%," + alpha * 0.1 + ")";
        ctx.fill();
        ctx.strokeStyle = "hsla(" + d.hue + ",80%,86%," + alpha * 0.34 + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        var tx = d.side < 0 ? -d.w * 0.3 : d.w * 0.3;
        ctx.moveTo(tx, d.h * 0.42);
        ctx.lineTo(tx + d.side * 9, d.h * 0.42 + 10);
        ctx.lineTo(tx + d.side * 3, d.h * 0.42);
        ctx.closePath();
        ctx.fillStyle = "hsla(" + d.hue + ",72%,90%," + alpha * 0.1 + ")";
        ctx.fill();
        ctx.strokeStyle = "hsla(" + d.hue + ",80%,86%," + alpha * 0.3 + ")";
        ctx.stroke();
        if (d.mode === 0) {
          for (var k = 0; k < 3; k++) {
            var dotA = 0.3 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(frm * 0.07 + k * 1.7 + d.phase), 2);
            ctx.fillStyle = "hsla(" + d.hue + ",100%,88%," + dotA * alpha * 0.95 + ")";
            ctx.beginPath();
            ctx.arc(-d.w * 0.15 + k * 9, 0, 1.9, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.strokeStyle = "hsla(" + d.hue + ",100%,90%," + alpha * 0.55 + ")";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(-d.w * 0.22, -4);
          ctx.lineTo(d.w * 0.2, -4);
          ctx.moveTo(-d.w * 0.22, 4);
          ctx.lineTo(d.w * 0.08, 4);
          ctx.stroke();
        }
        ctx.strokeStyle = "hsla(" + d.hue + ",100%,96%," + alpha * 0.22 + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(4, d.h * 0.28), -2.7, -1.9);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
  };
