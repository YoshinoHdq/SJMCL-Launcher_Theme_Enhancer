themeEffects.aurora = {
    init:function(c2){var p=[];var W=c2.width,H=c2.height;
for(var ci=0;ci<3;ci++){
p.push({x:ci*W*0.28+W*0.05,y:H*0.02+Math.random()*0.03*H,w:W*0.55+Math.random()*0.15*W,ht:H*0.18+Math.random()*0.07*H,op:0.3+Math.random()*0.12,hu:100+ci*30+Math.random()*20,wa:12+Math.random()*18,wf:0.003+Math.random()*0.003,wph:Math.random()*Math.PI*2,fa:8+Math.random()*14,ff:0.01+Math.random()*0.006,fph:Math.random()*Math.PI*2,ds:0.001+Math.random()*0.002,dph:Math.random()*Math.PI*2});}
p.push({x:W*0.05,y:H*0.03,w:W*0.95,ht:H*0.2,op:0.08,hu:130,wa:30,wf:0.003,wph:0,fa:18,ff:0.008,fph:1,ds:0.0015,dph:0,isBase:true});return p;},
draw:function(ctx,ww,hh,p,int,frm){
ctx.clearRect(0,0,ww,hh);
var br=0.7+0.3*Math.sin(frm*0.0012);
for(var ci=0;ci<p.length;ci++){var b=p[ci];var a=b.op*0.5;if(a<0.01)continue;
b.dph+=b.ds;var dx=Math.sin(b.dph)*ww*0.08;var bx=b.x+dx;
var pts=40,tP=[],bP=[];
for(var i=0;i<=pts;i++){var t=i/pts,x=bx+t*b.w;
var wv=Math.sin(frm*b.wf+t*Math.PI*2+b.wph)*b.wa;
var bwv=Math.sin(frm*b.wf*0.5+t*Math.PI*2+b.wph)*b.wa*0.5;
var fd=Math.sin(frm*b.ff+t*Math.PI*4+b.fph)*b.fa;
tP.push({x:x,y:b.y+wv*0.25+fd*0.12});
bP.push({x:x,y:b.y+b.ht+bwv+fd*0.2});}
ctx.beginPath();ctx.moveTo(tP[0].x,tP[0].y);
for(var i=1;i<tP.length;i++)ctx.lineTo(tP[i].x,tP[i].y);
for(var i=bP.length-1;i>=0;i--)ctx.lineTo(bP[i].x,bP[i].y);
ctx.closePath();
var hu=b.hu+Math.sin(frm*0.002)*15;
var grd=ctx.createLinearGradient(0,b.y,0,b.y+b.ht);
if(b.isBase){
grd.addColorStop(0,"hsla("+hu+",70%,60%,"+a*0.08+")");
grd.addColorStop(0.5,"hsla("+(hu+10)+",75%,65%,"+a*0.2+")");
grd.addColorStop(1,"hsla("+(hu+20)+",75%,65%,"+a*0.4*br+")");}
else{
var btA=Math.min(a*br*1.2,0.7);
grd.addColorStop(0,"hsla("+hu+",75%,60%,"+a*0.08+")");
grd.addColorStop(0.15,"hsla("+(hu+8)+",80%,65%,"+a*0.2+")");
grd.addColorStop(0.35,"hsla("+(hu+15)+",85%,70%,"+a*0.35+")");
grd.addColorStop(0.55,"hsla("+(hu+20)+",90%,78%,"+a*0.5+")");
grd.addColorStop(0.72,"hsla("+(hu+25)+",90%,85%,"+btA*0.7+")");
grd.addColorStop(0.86,"hsla("+(hu+28)+",88%,92%,"+btA*0.8+")");
grd.addColorStop(1,"hsla("+(hu+30)+",85%,96%,"+btA+")");}
ctx.fillStyle=grd;ctx.fill();}
// Bottom glow
ctx.globalCompositeOperation="lighter";
for(var ci=0;ci<p.length-1;ci++){var b=p[ci];if(b.isBase)continue;
var a=b.op*0.4;b.dph+=b.ds;var dx=Math.sin(b.dph)*ww*0.08;var bx=b.x+dx;
var pts=40,bP=[];
for(var i=0;i<=pts;i++){var t=i/pts,x=bx+t*b.w;
var bwv=Math.sin(frm*b.wf*0.5+t*Math.PI*2+b.wph)*b.wa*0.5;
var fd=Math.sin(frm*b.ff+t*Math.PI*4+b.fph)*b.fa;
bP.push({x:x,y:b.y+b.ht+bwv+fd*0.2});}
var ga=br*0.12;if(ga<0.02)continue;
var gh=12+8*br;
var hu=b.hu+Math.sin(frm*0.002)*15;
ctx.beginPath();ctx.moveTo(bP[0].x,bP[0].y);
for(var i=1;i<bP.length;i++)ctx.lineTo(bP[i].x,bP[i].y);
for(var i=bP.length-1;i>=0;i--)ctx.lineTo(bP[i].x,bP[i].y+gh);
ctx.closePath();
var gg=ctx.createLinearGradient(0,bP[Math.floor(bP.length/2)].y,0,bP[Math.floor(bP.length/2)].y+gh);
gg.addColorStop(0,"hsla("+(hu+25)+",85%,90%,"+ga*0.8+")");
gg.addColorStop(0.5,"hsla("+(hu+28)+",85%,92%,"+ga*0.4+")");
gg.addColorStop(1,"hsla("+(hu+30)+",80%,94%,0)");
ctx.fillStyle=gg;ctx.fill();}
ctx.globalCompositeOperation="source-over";}
  };







