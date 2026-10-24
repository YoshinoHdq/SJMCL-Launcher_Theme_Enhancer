  var _shatterGlints = [];
  var _shatterLight = 0;
  function makeShatterShape(size) {
    var count = 3 + Math.floor(Math.random() * 3);
    var verts = [];
    var start = Math.random() * Math.PI * 2;
    var stretchX = 0.7 + Math.random() * 0.6;
    var stretchY = 0.7 + Math.random() * 0.6;
    for (var i = 0; i < count; i++) {
      var angle = start + (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.42;
      var radius = size * (0.62 + Math.random() * 0.4);
      verts.push([Math.cos(angle) * radius * stretchX, Math.sin(angle) * radius * stretchY]);
    }
    var path = new Path2D();
    path.moveTo(verts[0][0], verts[0][1]);
    for (var j = 1; j < count; j++) path.lineTo(verts[j][0], verts[j][1]);
    path.closePath();
    var edges = [];
    for (var k = 0; k < count; k++) {
      var a = verts[k];
      var b = verts[(k + 1) % count];
      var mx = (a[0] + b[0]) * 0.5;
      var my = (a[1] + b[1]) * 0.5;
      var mid = Math.hypot(mx, my) || 1;
      edges.push({ ax: a[0], ay: a[1], bx: b[0], by: b[1], nx: mx / mid, ny: my / mid });
    }
    return { path: path, verts: verts, edges: edges, size: size };
  }
  var SHATTER_LAYERS = [
    { count: 20, min: 6, max: 14, alpha: 0.42, speed: 0.4, band: 0.5 },
    { count: 18, min: 12, max: 24, alpha: 0.6, speed: 0.65, band: 0.72 },
    { count: 14, min: 22, max: 42, alpha: 0.8, speed: 1, band: 0.95 },
    { count: 8, min: 44, max: 86, alpha: 1, speed: 1.45, band: 1.25 }
  ];
  var SHATTER_TINTS = [198, 198, 232, 258, 258, 322];
  themeEffects.shattered_glass = {
    init: function(c2) {
      var p = [];
      var w = c2.width, h = c2.height;
      for (var l = 0; l < SHATTER_LAYERS.length; l++) {
        var layer = SHATTER_LAYERS[l];
        for (var i = 0; i < layer.count; i++) {
          var size = layer.min + Math.random() * (layer.max - layer.min);
          p.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.16 * layer.speed,
            vy: (Math.random() - 0.5) * 0.12 * layer.speed,
            rot: Math.random() * Math.PI * 2,
            rotSpd: (Math.random() - 0.5) * 0.0018 * layer.speed,
            alpha: layer.alpha,
            bandSpd: layer.band,
            phase: Math.random() * Math.PI * 2,
            tint: SHATTER_TINTS[Math.floor(Math.random() * SHATTER_TINTS.length)],
            rank: Math.random(),
            shape: makeShatterShape(size)
          });
        }
      }
      _shatterGlints.length = 0;
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      var visible = 0.4 + 0.6 * strength;
      _shatterLight = 0.9 + frm * 0.0022;
      var lx = Math.cos(_shatterLight);
      var ly = Math.sin(_shatterLight);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < p.length; i++) {
        var d = p[i];
        if (d.rank > visible) continue;
        var shape = d.shape;
        var size = shape.size;
        d.x += d.vx;
        d.y += d.vy;
        d.rot += d.rotSpd;
        var margin = size * 1.6 + 30;
        if (d.x < -margin) {
          d.x = w + margin;
          d.y = Math.random() * h;
        } else if (d.x > w + margin) {
          d.x = -margin;
          d.y = Math.random() * h;
        }
        if (d.y < -margin) {
          d.y = h + margin;
          d.x = Math.random() * w;
        } else if (d.y > h + margin) {
          d.y = -margin;
          d.x = Math.random() * w;
        }
        var edgeFade = Math.min(1, Math.min(d.x, d.y, w - d.x, h - d.y) / 70);
        if (edgeFade <= 0) continue;
        var baseAlpha = strength * d.alpha * edgeFade;
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        var body = ctx.createLinearGradient(lx * size, ly * size, -lx * size, -ly * size);
        body.addColorStop(0, "hsla(" + d.tint + ",55%,94%," + 0.075 * baseAlpha + ")");
        body.addColorStop(0.55, "hsla(" + d.tint + ",48%,84%," + 0.03 * baseAlpha + ")");
        body.addColorStop(1, "hsla(" + d.tint + ",44%,74%," + 0.012 * baseAlpha + ")");
        ctx.fillStyle = body;
        ctx.fill(shape.path);
        var bandShift = Math.sin(frm * 0.0035 * d.bandSpd + d.phase) * size * 1.25;
        var bandHalf = Math.max(5, size * 0.5);
        var bandX = lx * bandShift;
        var bandY = ly * bandShift;
        var sweep = ctx.createLinearGradient(bandX - lx * bandHalf, bandY - ly * bandHalf, bandX + lx * bandHalf, bandY + ly * bandHalf);
        sweep.addColorStop(0, "rgba(220,240,255,0)");
        sweep.addColorStop(0.36, "hsla(" + d.tint + ",100%,92%," + 0.03 * baseAlpha + ")");
        sweep.addColorStop(0.5, "hsla(" + d.tint + ",90%,97%," + 0.18 * baseAlpha + ")");
        sweep.addColorStop(0.64, "hsla(" + d.tint + ",100%,92%," + 0.03 * baseAlpha + ")");
        sweep.addColorStop(1, "rgba(220,240,255,0)");
        ctx.save();
        ctx.clip(shape.path);
        ctx.fillStyle = sweep;
        ctx.fillRect(-size * 1.5, -size * 1.5, size * 3, size * 3);
        ctx.restore();
        var brightest = 0;
        var brightEdge = null;
        for (var e = 0; e < shape.edges.length; e++) {
          var edge = shape.edges[e];
          var facing = Math.max(0, edge.nx * lx + edge.ny * ly);
          var lit = facing * facing;
          if (lit > brightest) {
            brightest = lit;
            brightEdge = edge;
          }
          var alpha = (0.05 + 0.5 * lit) * baseAlpha;
          ctx.strokeStyle = "hsla(" + d.tint + ",85%,92%," + alpha + ")";
          ctx.lineWidth = 0.8 + 1.1 * lit;
          ctx.beginPath();
          ctx.moveTo(edge.ax, edge.ay);
          ctx.lineTo(edge.bx, edge.by);
          ctx.stroke();
        }
        if (brightEdge && brightest > 0.22 && size > 15) {
          var fringe = brightest * baseAlpha;
          ctx.lineWidth = 1;
          ctx.strokeStyle = "hsla(190,100%,72%," + fringe * 0.7 + ")";
          ctx.beginPath();
          ctx.moveTo(brightEdge.ax + brightEdge.nx * 2, brightEdge.ay + brightEdge.ny * 2);
          ctx.lineTo(brightEdge.bx + brightEdge.nx * 2, brightEdge.by + brightEdge.ny * 2);
          ctx.stroke();
          ctx.strokeStyle = "hsla(320,100%,74%," + fringe * 0.6 + ")";
          ctx.beginPath();
          ctx.moveTo(brightEdge.ax - brightEdge.nx * 1.8, brightEdge.ay - brightEdge.ny * 1.8);
          ctx.lineTo(brightEdge.bx - brightEdge.nx * 1.8, brightEdge.by - brightEdge.ny * 1.8);
          ctx.stroke();
          ctx.strokeStyle = "hsla(" + d.tint + ",80%,96%," + fringe * 0.34 + ")";
          ctx.beginPath();
          ctx.moveTo(brightEdge.ax - brightEdge.nx * 2.4, brightEdge.ay - brightEdge.ny * 2.4);
          ctx.lineTo(brightEdge.bx - brightEdge.nx * 2.4, brightEdge.by - brightEdge.ny * 2.4);
          ctx.stroke();
        }
        ctx.restore();
      }
      if (p.length && Math.random() < 0.005 * strength) {
        var target = p[Math.floor(Math.random() * p.length)];
        var vertex = target.shape.verts[Math.floor(Math.random() * target.shape.verts.length)];
        var cos = Math.cos(target.rot);
        var sin = Math.sin(target.rot);
        _shatterGlints.push({
          x: target.x + vertex[0] * cos - vertex[1] * sin,
          y: target.y + vertex[0] * sin + vertex[1] * cos,
          age: 0,
          life: 16 + Math.random() * 12,
          hue: target.tint
        });
        if (_shatterGlints.length > 8) _shatterGlints.shift();
      }
      for (var g = _shatterGlints.length - 1; g >= 0; g--) {
        var glint = _shatterGlints[g];
        glint.age += 1;
        var gt = glint.age / glint.life;
        if (gt >= 1) {
          _shatterGlints.splice(g, 1);
          continue;
        }
        var ga = Math.pow(1 - gt, 2) * strength * 0.9;
        var glow = ctx.createRadialGradient(glint.x, glint.y, 0, glint.x, glint.y, 9);
        glow.addColorStop(0, "hsla(" + glint.hue + ",100%,92%," + ga + ")");
        glow.addColorStop(0.5, "hsla(" + glint.hue + ",100%,80%," + ga * 0.35 + ")");
        glow.addColorStop(1, "hsla(" + glint.hue + ",100%,70%,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(glint.x - 9, glint.y - 9, 18, 18);
        var ray = 5 + 7 * (1 - gt);
        ctx.strokeStyle = "hsla(" + glint.hue + ",100%,94%," + ga * 0.8 + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(glint.x - ray, glint.y);
        ctx.lineTo(glint.x + ray, glint.y);
        ctx.moveTo(glint.x, glint.y - ray * 0.7);
        ctx.lineTo(glint.x, glint.y + ray * 0.7);
        ctx.stroke();
      }
      ctx.restore();
    }
  };
