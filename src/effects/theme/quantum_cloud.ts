  var _quantumPairs = null;
  themeEffects.quantum_cloud = {
    init: function(c2) {
      var w = c2.width, h = c2.height;
      var pairs = [];
      for (var i = 0; i < 22; i++) {
        var bx = Math.random() * w;
        var by = Math.random() * h;
        pairs.push({
          bx: bx,
          by: by,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.08,
          r: Math.min(w, h) * (0.025 + Math.random() * 0.06),
          angle: Math.random() * Math.PI * 2,
          spin: (0.0016 + Math.random() * 0.0034) * (Math.random() < 0.5 ? -1 : 1),
          phase: Math.random(),
          hueA: 190 + Math.random() * 28,
          hueB: 278 + Math.random() * 28,
          p1: { x: bx, y: by },
          p2: { x: bx, y: by }
        });
      }
      _quantumPairs = pairs;
      var p = [];
      for (var j = 0; j < pairs.length; j++) {
        p.push(pairs[j].p1);
        p.push(pairs[j].p2);
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      var pairs = _quantumPairs || [];
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        pair.bx += pair.vx;
        pair.by += pair.vy;
        var margin = 120;
        if (pair.bx < -margin) pair.bx = w + margin;
        if (pair.bx > w + margin) pair.bx = -margin;
        if (pair.by < -margin) pair.by = h + margin;
        if (pair.by > h + margin) pair.by = -margin;
        var cyc = (frm * 0.0009 + pair.phase) % 1;
        var scale = 1;
        var flash = 0;
        if (cyc < 0.08) {
          var t1 = cyc / 0.08;
          scale = 1 - t1 * 0.95;
          flash = t1;
        } else if (cyc < 0.14) {
          scale = 0.05;
          flash = 1;
        } else if (cyc < 0.3) {
          var t2 = (cyc - 0.14) / 0.16;
          scale = 0.05 + (1 - Math.pow(1 - t2, 2)) * 0.95;
          flash = 1 - t2;
        }
        var angle = pair.angle + pair.spin * frm;
        var rr = pair.r * scale * (0.9 + 0.1 * Math.sin(frm * 0.01 + pair.phase * 6));
        pair.p1.x = pair.bx + Math.cos(angle) * rr;
        pair.p1.y = pair.by + Math.sin(angle) * rr * 0.8;
        pair.p2.x = pair.bx + Math.cos(angle + Math.PI) * rr * 1.05;
        pair.p2.y = pair.by + Math.sin(angle + Math.PI) * rr * 0.84;
        var pulse = 0.5 + 0.5 * Math.sin(frm * 0.02 + pair.phase * 9);
        var lineA = (0.06 + 0.12 * pulse + flash * 0.24) * strength;
        var lineGrad = ctx.createLinearGradient(pair.p1.x, pair.p1.y, pair.p2.x, pair.p2.y);
        lineGrad.addColorStop(0, "hsla(" + pair.hueA + ",100%,80%," + lineA + ")");
        lineGrad.addColorStop(0.5, "hsla(248,100%,78%," + lineA * 0.7 + ")");
        lineGrad.addColorStop(1, "hsla(" + pair.hueB + ",100%,80%," + lineA + ")");
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(pair.p1.x, pair.p1.y);
        ctx.lineTo(pair.p2.x, pair.p2.y);
        ctx.stroke();
        if (flash > 0.02) {
          var glow = ctx.createRadialGradient(pair.bx, pair.by, 0, pair.bx, pair.by, pair.r * 0.9);
          glow.addColorStop(0, "hsla(225,100%,86%," + flash * 0.26 * strength + ")");
          glow.addColorStop(0.5, "hsla(255,100%,76%," + flash * 0.1 * strength + ")");
          glow.addColorStop(1, "hsla(280,100%,70%,0)");
          ctx.fillStyle = glow;
          ctx.fillRect(pair.bx - pair.r * 0.9, pair.by - pair.r * 0.9, pair.r * 1.8, pair.r * 1.8);
        }
        var alpha = (0.4 + 0.3 * pulse) * strength;
        var size = 2.2 + pulse * 1.4 + flash * 0.9;
        ctx.fillStyle = "hsla(" + pair.hueA + ",100%,80%," + alpha * 0.28 + ")";
        ctx.beginPath();
        ctx.arc(pair.p1.x, pair.p1.y, size * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + pair.hueA + ",100%,86%," + alpha + ")";
        ctx.beginPath();
        ctx.arc(pair.p1.x, pair.p1.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + pair.hueB + ",100%,80%," + alpha * 0.28 + ")";
        ctx.beginPath();
        ctx.arc(pair.p2.x, pair.p2.y, size * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + pair.hueB + ",100%,86%," + alpha + ")";
        ctx.beginPath();
        ctx.arc(pair.p2.x, pair.p2.y, size, 0, Math.PI * 2);
        ctx.fill();
        if (flash > 0.55) {
          ctx.strokeStyle = "hsla(240,100%,85%," + (flash - 0.55) * 0.4 * strength + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pair.bx, pair.by, pair.r * (1.2 + (1 - flash) * 1.6), 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  };
