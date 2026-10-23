themeEffects.freeze = {
    init:function(c2){
      var p=[];
      // Layer1: 555 big crystals (thick 5.0)
      for(var i=0;i<55;i++){
        var e=Math.floor(Math.random()*4);
        p.push({_type:0,
          x:e===0?Math.random()*c2.width:e===1?c2.width+5:e===2?Math.random()*c2.width:-5,
          y:e===0?-5:e===1?Math.random()*c2.height:e===2?c2.height+5:Math.random()*c2.height,
          size:28+Math.floor(Math.random()*22),sp:0.01+Math.random()*0.02,
          op:0.7+Math.random()*0.3,phase:Math.random()*Math.PI*2,
          growDir:e,breathPhase:Math.random()*Math.PI*2,
          branch:1+Math.floor(Math.random()*2),maxDist:80+Math.random()*70,
          dist:0,growing:true,thick:5.0
        });
      }
      // Layer2: thin flickering crystals
      for(var i=0;i<70;i++){
        var e=Math.floor(Math.random()*4);
        p.push({_type:1,
          x:e===0?Math.random()*c2.width:e===1?c2.width+8:e===2?Math.random()*c2.width:-8,
          y:e===0?-8:e===1?Math.random()*c2.height:e===2?c2.height+8:Math.random()*c2.height,
          size:8+Math.random()*16,sp:0.02+Math.random()*0.04,
          op:0.2+Math.random()*0.3,phase:Math.random()*Math.PI*2,
          growDir:e,breathPhase:Math.random()*Math.PI*2,
          branch:1+Math.floor(Math.random()*2),maxDist:40+Math.random()*50,
          dist:0,growing:true,thick:1.0,
          extendTime:Math.random()*100,extendSpeed:0.003+Math.random()*0.008,
          flickerSpeed:0.008+Math.random()*0.02,flickerPhase:Math.random()*Math.PI*2
        });
      }
      // Layer3: Snow particles (1.3x normal snow size)
      for(var i=0;i<120;i++){
        p.push({_type:2,
          x:Math.random()*c2.width,y:Math.random()*c2.height,
          sp:0.2+Math.random()*0.8,op:0.2+Math.random()*0.5,
          phase:Math.random()*Math.PI*2,frame:Math.floor(Math.random()*8),
          sz:10+Math.floor(Math.random()*20),drift:(Math.random()-0.5)*0.8
        });
      }
      return p;
    },
    drawSnowflake:function(ctx,cx,cy,size,a,breath,subL,flicker,thick){
      if(subL<0||size<3)return;
      var fade=1-subL*0.3,fv=flicker!==undefined?0.5+0.5*flicker:1;
      var alpha=a*0.6*breath*fade*fv;
      if(alpha<0.015)return;
      ctx.strokeStyle="rgba(100,175,215,"+alpha+")";
      ctx.lineWidth=(thick||1.0)*(1.2-subL*0.2);
      for(var i=0;i<6;i++){
        var a2=Math.PI/3*i+Math.PI/6,ex=cx+size*Math.cos(a2),ey=cy+size*Math.sin(a2);
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);ctx.stroke();
        var sub=size*0.35;
        for(var j=1;j<=2;j++){
          var t=j/3,bx=cx+size*t*Math.cos(a2),by=cy+size*t*Math.sin(a2),sa1=a2+Math.PI/4,sa2=a2-Math.PI/4;
          ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+sub*Math.cos(sa1),by+sub*Math.sin(sa1));ctx.stroke();
          ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+sub*Math.cos(sa2),by+sub*Math.sin(sa2));ctx.stroke();
        }
        if(subL>0)this.drawSnowflake(ctx,ex,ey,size*0.3,a*0.6,breath,subL-1,flicker,thick);
      }
    },
    draw:function(ctx,w,h,p,int,frm){
      var self=this;
      ctx.clearRect(0,0,w,h);
      var fg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h)*0.6);
      fg.addColorStop(0,"rgba(8,30,40,"+0.08*int/100+")");
      fg.addColorStop(0.6,"rgba(4,18,25,"+0.15*int/100+")");
      fg.addColorStop(1,"rgba(2,6,10,"+0.25*int/100+")");
      ctx.fillStyle=fg;ctx.fillRect(0,0,w,h);
      
      var snowImg=window._ltePI&&window._ltePI.snow;
      for(var i=0;i<p.length;i++){
        var d=p[i];
        if(!isFinite(d.x)||!isFinite(d.y))continue;
        // Layer3: snow particles
        if(d._type===2){
          var a=d.op*(int/100);
          if(a<0.02||!snowImg||!snowImg.complete)continue;
          var sy=d.frame*32;
          var s=Math.round(d.sz*(1.5+1.5*int/100)*1.3);
          ctx.drawImage(snowImg,0,sy,64,32,Math.round(d.x-s/2),Math.round(d.y-s/2),s,s/2);
          d.y+=d.sp;d.x+=Math.sin(frm*0.01+d.phase)*d.drift;d.phase+=5e-3;
          if(d.y>h+20){d.y=-20;d.x=Math.random()*w;d.frame=Math.floor(Math.random()*8);}
          continue;
        }
        var a=d.op*(int/100);
        if(a<0.02)continue;
        var br=0.8+0.2*Math.sin(frm*4e-3+d.breathPhase),fv=1;
        if(d._type===1){
          d.flickerPhase+=d.flickerSpeed;
          if(d.growing){d.dist+=d.sp;if(d.dist>=d.maxDist){d.growing=false;d.extendTime=0;}}
          else{d.extendTime+=d.extendSpeed;var wv=Math.sin(d.extendTime+d.phase);d.dist=d.maxDist*(1+wv*0.2);if(wv<-0.19&&Math.random()<0.003){d.growing=true;d.dist=0;d.growDir=Math.floor(Math.random()*4);d.x=d.growDir===0?Math.random()*w:d.growDir===1?w+8:d.growDir===2?Math.random()*w:-8;d.y=d.growDir===0?-8:d.growDir===1?Math.random()*h:d.growDir===2?h+8:Math.random()*h;d.maxDist=40+Math.random()*50;}}
          fv=0.5+0.5*Math.sin(d.flickerPhase);
        }else{
          d.dist+=d.sp*(d.growing?1:-1);
          if(d.dist>d.maxDist||d.dist<2)d.growing=!d.growing;
        }
        var cx=d.x,cy=d.y;
        if(d.growDir===0)cy+=d.dist;else if(d.growDir===1)cx-=d.dist;else if(d.growDir===2)cy-=d.dist;else cx+=d.dist;
        if(cx<-200||cx>w+200||cy<-200||cy>h+200)continue;
        var fs=d.size*(0.5+0.5*int/100)*br;
        self.drawSnowflake(ctx,cx,cy,fs,a,br,d.branch,fv,d.thick||1.0);
      }
    }
  };






