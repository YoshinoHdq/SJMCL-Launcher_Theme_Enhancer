  var _themeWebs = null;
  function buildThemeWeb(web) {
    var R = web.R;
    var angles = web.angles;
    var spokes = web.spokes;
    var spokePath = new Path2D();
    for (var s = 0; s < spokes; s++) {
      var a = angles[s];
      var ex = Math.cos(a) * R;
      var ey = Math.sin(a) * R;
      var mx = Math.cos(a + 0.035) * R * 0.5;
      var my = Math.sin(a + 0.035) * R * 0.5;
      spokePath.moveTo(0, 0);
      spokePath.quadraticCurveTo(mx, my, ex, ey);
    }
    web.spokePath = spokePath;
    var ringPaths = [];
    var dew = [];
    for (var r = 1; r <= 6; r++) {
      var rr = R * (0.14 + r * 0.135);
      var ringPath = new Path2D();
      for (var j = 0; j < spokes - 1; j++) {
        var a1 = angles[j];
        var a2 = angles[j + 1];
        var p1x = Math.cos(a1) * rr;
        var p1y = Math.sin(a1) * rr;
        var p2x = Math.cos(a2) * rr;
        var p2y = Math.sin(a2) * rr;
        var sag = 0.9 + Math.sin(j + r) * 0.02;
        var cxp = (p1x + p2x) * 0.5 * sag;
        var cyp = (p1y + p2y) * 0.5 * sag;
        ringPath.moveTo(p1x, p1y);
        ringPath.quadraticCurveTo(cxp, cyp, p2x, p2y);
      }
      ringPaths.push(ringPath);
      if (r % 2 === 0) {
        for (var d = 0; d < spokes; d += 2) {
          var da = angles[d];
          dew.push({
            x: Math.cos(da) * rr,
            y: Math.sin(da) * rr,
            phase: d + r * 1.7
          });
        }
      }
    }
    web.ringPaths = ringPaths;
    web.dew = dew;
    return web;
  }
  function makeThemeWeb(x, y, base, R, phase, hue) {
    var spokes = 12;
    var angles = [];
    for (var k = 0; k < spokes; k++) {
      angles.push(base + (k / (spokes - 1)) * (Math.PI / 2 - 0.04) + (Math.random() - 0.5) * 0.035);
    }
    return buildThemeWeb({ x: x, y: y, R: R, phase: phase, hue: hue, angles: angles, spokes: spokes });
  }
  themeEffects.spider_web = {
    init: function(c2) {
      var m = Math.min(c2.width, c2.height);
      _themeWebs = [
        makeThemeWeb(4, 2, 0.02, m * 0.42, 0, 198),
        makeThemeWeb(c2.width - 4, c2.height - 2, Math.PI + 0.02, m * 0.34, 2.1, 208),
        makeThemeWeb(c2.width - 6, 4, Math.PI / 2 + 0.02, m * 0.26, 4.2, 214)
      ];
      return [{ x: 0, y: 0 }];
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      var webs = _themeWebs || [];
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (var wi = 0; wi < webs.length; wi++) {
        var web = webs[wi];
        var sway = Math.sin(frm * 0.0018 + web.phase) * 0.01;
        var R = web.R;
        var mist = ctx.createRadialGradient(web.x, web.y, 0, web.x, web.y, R * 1.1);
        mist.addColorStop(0, "hsla(" + web.hue + ",70%,70%," + 0.035 * strength + ")");
        mist.addColorStop(1, "hsla(" + web.hue + ",60%,60%,0)");
        ctx.fillStyle = mist;
        ctx.fillRect(web.x - R * 1.1, web.y - R * 1.1, R * 2.2, R * 2.2);
        ctx.save();
        ctx.translate(web.x, web.y);
        ctx.rotate(sway);
        ctx.strokeStyle = "hsla(" + web.hue + ",60%,88%," + 0.035 * strength + ")";
        ctx.lineWidth = 2.4;
        ctx.stroke(web.spokePath);
        ctx.strokeStyle = "hsla(" + web.hue + ",65%,90%," + 0.13 * strength + ")";
        ctx.lineWidth = 0.6;
        ctx.stroke(web.spokePath);
        for (var r = 0; r < web.ringPaths.length; r++) {
          ctx.strokeStyle = "hsla(" + web.hue + ",65%,88%," + 0.028 * strength + ")";
          ctx.lineWidth = 2;
          ctx.stroke(web.ringPaths[r]);
          ctx.strokeStyle = "hsla(" + web.hue + ",65%,88%," + 0.1 * strength + ")";
          ctx.lineWidth = 0.55;
          ctx.stroke(web.ringPaths[r]);
        }
        for (var d = 0; d < web.dew.length; d++) {
          var drop = web.dew[d];
          var twinkle = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(frm * 0.03 + drop.phase + web.phase), 2);
          ctx.fillStyle = "hsla(" + web.hue + ",100%,94%," + 0.12 * twinkle * strength + ")";
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, 3.2 + twinkle * 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "hsla(" + web.hue + ",100%,94%," + 0.42 * twinkle * strength + ")";
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, 1.2 + twinkle * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
        var ha = web.angles[3];
        var hr = R * 0.62;
        var hx = Math.cos(ha) * hr;
        var hy = Math.sin(ha) * hr;
        var hang = 10 + 6 * Math.sin(frm * 0.01 + web.phase);
        ctx.strokeStyle = "hsla(" + web.hue + ",60%,90%," + 0.14 * strength + ")";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.quadraticCurveTo(hx + 2, hy + hang * 0.6, hx + Math.sin(frm * 0.02 + web.phase) * 2, hy + hang);
        ctx.stroke();
        var dewAlpha = 0.5 + 0.5 * Math.sin(frm * 0.03 + web.phase);
        ctx.fillStyle = "hsla(" + web.hue + ",100%,94%," + 0.35 * dewAlpha * strength + ")";
        ctx.beginPath();
        ctx.arc(hx + Math.sin(frm * 0.02 + web.phase) * 2, hy + hang, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
  };
