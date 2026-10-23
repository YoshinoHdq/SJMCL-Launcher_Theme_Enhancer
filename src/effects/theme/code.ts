  themeEffects.code = {
    init: function(c2) {
      const columns = [];
      const colWidth = 22;
      const colCount = Math.floor(c2.width / colWidth);
      for (let i = 0; i < colCount; i++) {
        const len = 10 + Math.floor(Math.random() * 20);
        const chars = [];
        const timers = [];
        for (let j = 0; j < len; j++) {
          chars.push(Math.random() > 0.5 ? "0" : "1");
          timers.push(Math.floor(Math.random() * 200));
        }
        columns.push({
          x: i * colWidth + Math.random() * 4,
          y: -Math.random() * c2.height * 1.2,
          speed: 1 + Math.random() * 2.5,
          length: len,
          phase: Math.random() * Math.PI * 2,
          chars,
          morphTimers: timers
        });
      }
      return columns;
    },
    draw: function(ctx, w, h, columns, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const bgGrd = ctx.createLinearGradient(0, 0, 0, h);
      bgGrd.addColorStop(0, "rgba(0,8,0," + 0.15 * int / 100 + ")");
      bgGrd.addColorStop(1, "rgba(0,20,5," + 0.3 * int / 100 + ")");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, w, h);
      const fontSize = Math.round(20 + 16 * int / 100);
      ctx.font = fontSize + "px MinecraftPixel, 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const rowHeight = fontSize * 0.95;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        col.y += col.speed;
        if (col.y - col.length * rowHeight > h) {
          col.y = -col.length * rowHeight - Math.random() * 80;
          col.speed = 1 + Math.random() * 2.5;
          for (let j = 0; j < col.length; j++) {
            col.chars[j] = Math.random() > 0.5 ? "0" : "1";
            col.morphTimers[j] = Math.floor(Math.random() * 50);
          }
        }
        for (let j = 0; j < col.length; j++) {
          const charY = col.y - j * rowHeight;
          if (charY < -rowHeight * 2 || charY > h + rowHeight) continue;
          col.morphTimers[j]++;
          if (col.morphTimers[j] > 60 + Math.floor(Math.random() * 120)) {
            col.morphTimers[j] = 0;
            col.chars[j] = Math.random() > 0.5 ? "0" : "1";
          }
          const ratio = j / col.length;
          const columnFade = Math.sin(frm * 3e-3 + col.phase) * 0.15 + 0.5;
          const a = (1 - ratio * 0.85) * columnFade * (int / 100);
          if (a < 0.02) continue;
          const isHead = j === 0;
          const isMid = j < col.length * 0.3;
          if (isHead) {
            ctx.fillStyle = "rgba(180,255,180," + Math.min(a * 2, 1) + ")";
            ctx.shadowColor = "rgba(0,255,100," + Math.min(a * 0.7, 0.5) + ")";
            ctx.shadowBlur = 15;
          } else if (isMid) {
            ctx.fillStyle = "rgba(120,230,120," + a * 0.8 + ")";
            ctx.shadowColor = "rgba(0,200,80," + a * 0.3 + ")";
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = "rgba(60,180,60," + a * 0.5 + ")";
            ctx.shadowColor = "rgba(0,150,50," + a * 0.1 + ")";
            ctx.shadowBlur = 3;
          }
          ctx.fillText(col.chars[j], col.x, charY);
          ctx.shadowBlur = 0;
        }
      }
    }
  };
