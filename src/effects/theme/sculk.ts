themeEffects.sculk = {
    init:function(c2){
      var p=[];
      var L=[
        {z:0,sc:0.65,ba:0.45,cr:0.45},
        {z:1,sc:1.0,ba:0.70,cr:0.35},
        {z:2,sc:1.5,ba:0.95,cr:0.20}
      ];
      var gc=[20,180,180];
      for(var li=0;li<3;li++){
        var l=L[li],cnt=Math.floor(130*l.cr);
        for(var i=0;i<cnt;i++){
          var bs=12+Math.random()*22;
          p.push({
            bx:Math.random()*c2.width,by:Math.random()*c2.height,x:0,y:0,
            bs:bs,ds:bs*l.sc,
            st:Math.floor(Math.random()*3),
            ph:Math.random()*Math.PI*4,ts:0.004+Math.random()*0.009,
            da:Math.random()*Math.PI*2,fp:0.5+Math.random()*1.8,
            rt:Math.random()*Math.PI*2,rs:(Math.random()-0.5)*0.009,
            ba:l.ba,dp:l.z
          });
        }
      }
      return p;
    },
    drawShape:function(ctx,t,s,a){
      ctx.fillStyle="rgba(20,180,180,1)";
      if(t===0){
        ctx.fillRect(-s*0.4,-s*0.8,s*0.8,s*0.22);
        ctx.fillRect(-s*0.8,-s*0.4,s*0.22,s*0.8);
        ctx.fillRect(s*0.18,-s*0.4,s*0.22,s*0.8);
        ctx.fillRect(-s*0.4,s*0.18,s*0.8,s*0.22);
        ctx.fillRect(-s*0.65,-s*0.65,s*0.22,s*0.22);
        ctx.fillRect(s*0.43,-s*0.65,s*0.22,s*0.22);
        ctx.fillRect(-s*0.65,s*0.43,s*0.22,s*0.22);
        ctx.fillRect(s*0.43,s*0.43,s*0.22,s*0.22);
      }else if(t===1){
        ctx.fillRect(-s*0.4,-s*0.8,s*0.8,s*0.22);
        ctx.fillRect(-s*0.8,-s*0.4,s*0.22,s*0.8);
        ctx.fillRect(s*0.18,-s*0.4,s*0.22,s*0.45);
        ctx.fillRect(-s*0.4,s*0.4,s*0.8,s*0.22);
        ctx.fillRect(s*0.43,-s*0.65,s*0.22,s*0.22);
        ctx.fillRect(s*0.43,s*0.1,s*0.22,s*0.55);
      }else{
        ctx.fillRect(-s*0.7,-s*0.2,s*0.22,s*0.22);
        ctx.fillRect(-s*0.45,-s*0.45,s*0.22,s*0.22);
        ctx.fillRect(-s*0.2,-s*0.7,s*0.22,s*0.22);
        ctx.fillRect(s*0.4,s*0.3,s*0.22,s*0.22);
        ctx.fillRect(s*0.4,-s*0.4,s*0.22,s*0.7);
      }
    },
    draw:function(ctx,w,h,p,int,frm){
      ctx.clearRect(0,0,w,h);
      
      ctx.fillStyle="rgba(8,30,40,0.06)";
      ctx.fillRect(0,0,w,h);
      
      var gc=[20,180,180],dc=[0,110,110],lc=[80,220,230];
      for(var i=0;i<p.length;i++){
        var d=p[i];
        d.ph+=d.ts;d.da+=0.007;
        var x=d.bx+Math.sin(d.da)*22*d.fp,y=d.by+Math.cos(d.da)*14*d.fp;
        d.rt+=d.rs;
        var br=0.5+0.5*Math.sin(d.ph),ra=d.ba*br*(int/100);
        if(ra<0.02)continue;
        ctx.save();ctx.translate(x,y);ctx.rotate(d.rt);
        var gl=ctx.createRadialGradient(0,0,0,0,0,d.ds*2.2);
        gl.addColorStop(0,"rgba("+lc.join(",")+","+ra*0.45+")");
        gl.addColorStop(0.5,"rgba("+gc.join(",")+","+ra*0.22+")");
        gl.addColorStop(1,"rgba("+dc.join(",")+",0)");
        ctx.fillStyle=gl;ctx.fillRect(-d.ds*2.2,-d.ds*2.2,d.ds*4.4,d.ds*4.4);
        ctx.globalAlpha=ra;this.drawShape(ctx,d.st,d.ds,ra);
        ctx.restore();
      }
    }
  };



