  var _magnetPoles = null;
  var _magneticStreams = null;
  var _magneticStreamFrame = -999;
  themeEffects.magnetic_field = {
    init: function(c2) {
      var w = c2.width;
      var h = c2.height;
      _magnetPoles = [
        { bx: w * 0.32, by: h * 0.4, ax: w * 0.05, ay: h * 0.04, phase: 0, sign: 1, hue: 198 },
        { bx: w * 0.68, by: h * 0.6, ax: w * 0.04, ay: h * 0.05, phase: 2.3, sign: -1, hue: 286 }
      ];
      _magneticStreams = null;
      _magneticStreamFrame = -999;
      var p = [];
      for (var i = 0; i < 240; i++) {
        p.push({
          x: Math.random() * w,
          y: Math.random() * h,
          speed: 0.1 + Math.random() * 0.25,
          size: 1.6 + Math.random() * 3.4,
          ph: Math.random() * Math.PI * 2,
          rank: Math.random()
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      var poles = _magnetPoles || [];
      if (!poles.length) return;
      var px = [];
      var py = [];
      for (var i = 0; i < poles.length; i++) {
        px[i] = poles[i].bx + Math.sin(frm * 0.003 + poles[i].phase) * poles[i].ax;
        py[i] = poles[i].by + Math.cos(frm * 0.0025 + poles[i].phase) * poles[i].ay;
      }
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (var q = 0; q < poles.length; q++) {
        var pole = poles[q];
        var glow = ctx.createRadialGradient(px[q], py[q], 0, px[q], py[q], 22);
        glow.addColorStop(0, "hsla(" + pole.hue + ",100%,84%," + 0.2 * strength + ")");
        glow.addColorStop(0.5, "hsla(" + pole.hue + ",100%,74%," + 0.07 * strength + ")");
        glow.addColorStop(1, "hsla(" + pole.hue + ",100%,68%,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(px[q] - 22, py[q] - 22, 44, 44);
        ctx.strokeStyle = "hsla(" + pole.hue + ",80%,82%," + 0.18 * strength + ")";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(px[q], py[q], 7, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (!_magneticStreams || frm - _magneticStreamFrame > 20) {
        _magneticStreams = [];
        var seeds = [[0.18, 0.3], [0.82, 0.3], [0.3, 0.68], [0.7, 0.72], [0.5, 0.2], [0.5, 0.8]];
        for (var sd = 0; sd < seeds.length; sd++) {
          var sx = seeds[sd][0] * w;
          var sy = seeds[sd][1] * h;
          var hueSeed = 198;
          var points = [{ x: sx, y: sy }];
          var closeSeed = 1e9;
          for (var step = 0; step < 55; step++) {
            var fx = 0;
            var fy = 0;
            for (var pi = 0; pi < poles.length; pi++) {
              var ddx = sx - px[pi];
              var ddy = sy - py[pi];
              var rr2 = ddx * ddx + ddy * ddy + 120;
              var f = poles[pi].sign * 2600 / rr2;
              fx += ddx * f;
              fy += ddy * f;
              var dd = ddx * ddx + ddy * ddy;
              if (dd < closeSeed) {
                closeSeed = dd;
                hueSeed = poles[pi].hue;
              }
            }
            var fm = Math.hypot(fx, fy);
            if (fm < 1e-6) break;
            sx += (fx / fm) * 7;
            sy += (fy / fm) * 7;
            if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) break;
            points.push({ x: sx, y: sy });
          }
          if (points.length > 2) _magneticStreams.push({ points: points, hue: hueSeed });
        }
        _magneticStreamFrame = frm;
      }
      for (var si = 0; si < _magneticStreams.length; si++) {
        var stream = _magneticStreams[si];
        ctx.beginPath();
        ctx.moveTo(stream.points[0].x, stream.points[0].y);
        for (var sp = 1; sp < stream.points.length; sp++) ctx.lineTo(stream.points[sp].x, stream.points[sp].y);
        ctx.strokeStyle = "hsla(" + stream.hue + ",100%,80%," + 0.055 * strength + ")";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      var visible = 0.45 + 0.55 * strength;
      for (var k = 0; k < p.length; k++) {
        var d = p[k];
        if (d.rank > visible) continue;
        var vx = 0;
        var vy = 0;
        var nearest = 0;
        var nearestDist = 1e9;
        for (var m = 0; m < poles.length; m++) {
          var dx = d.x - px[m];
          var dy = d.y - py[m];
          var r2 = dx * dx + dy * dy + 120;
          var force = poles[m].sign * 2600 / r2;
          vx += dx * force;
          vy += dy * force;
          var dist = dx * dx + dy * dy;
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = m;
          }
        }
        var mag = Math.hypot(vx, vy);
        if (mag < 1e-6) continue;
        var angle = Math.atan2(vy, vx);
        d.x += Math.cos(angle) * d.speed * 0.35;
        d.y += Math.sin(angle) * d.speed * 0.35;
        if (d.x < -30) d.x = w + 30;
        if (d.x > w + 30) d.x = -30;
        if (d.y < -30) d.y = h + 30;
        if (d.y > h + 30) d.y = -30;
        var glow2 = Math.min(1, mag * 0.03);
        var len = d.size * (0.65 + 0.35 * Math.sin(frm * 0.02 + d.ph));
        var hue = poles[nearest].hue;
        var alpha = (0.18 + 0.3 * glow2) * strength;
        ctx.strokeStyle = "hsla(" + hue + ",100%,80%," + alpha * 0.35 + ")";
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(d.x - Math.cos(angle) * len, d.y - Math.sin(angle) * len);
        ctx.lineTo(d.x + Math.cos(angle) * len, d.y + Math.sin(angle) * len);
        ctx.stroke();
        ctx.strokeStyle = "hsla(" + hue + ",100%,86%," + alpha + ")";
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
      ctx.restore();
    }
  };
