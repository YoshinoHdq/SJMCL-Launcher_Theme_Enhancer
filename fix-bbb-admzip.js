var fs=require("fs"),path=require("path"),os=require("os"),AdmZip=require("adm-zip");

var cccPath="D:/outputs/org.yoshino.launcher-theme-enhancer-0.2.0-ccc.sjmclx";
var outPath="D:/outputs/org.yoshino.launcher-theme-enhancer-0.2.0-bbb.sjmclx";

// Extract ccc
var zip=new AdmZip(cccPath);
var tmp=fs.mkdtempSync(path.join(os.tmpdir(),"bbb"));
zip.extractAllTo(tmp,true);
var root=path.join(tmp,"org.yoshino.launcher-theme-enhancer");
var jsPath=path.join(root,"frontend","index.js");
var js=fs.readFileSync(jsPath,"utf8");
console.log("CCC JS:",js.length,"bytes, first char:",js.charCodeAt(0));

var start=js.indexOf("themeEffects.freeze");
var end=js.indexOf("function makeThemeCanvas",start+5);
console.log("Freeze:",start,"->",end);

// Build NEW freeze code with frost particles
var nf="themeEffects.freeze = {";
nf+="init:function(c){var p=[],W=c.width,H=c.height;for(var i=0;i<60;i++){var ed=Math.floor(Math.random()*4);";
nf+="p.push({x:ed===0?Math.random()*W:ed===1?W+5:ed===2?Math.random()*W:-5,y:ed===0?-5:ed===1?Math.random()*H:ed===2?H+5:Math.random()*H,";
nf+="size:14+Math.floor(Math.random()*24),sp:0.08+Math.random()*0.12,op:0.5+Math.random()*0.4,growDir:ed,breathPhase:Math.random()*Math.PI*2,";
nf+="branch:1+Math.floor(Math.random()*2),maxDist:50+Math.random()*80,dist:10+Math.random()*30,growing:true});}";
nf+="for(var i=0;i<250;i++){var e=Math.floor(Math.random()*4);";
nf+='p.push({type:"frost",x:e===0?Math.random()*W:e===1?W:e===2?Math.random()*W:0,';
nf+="y:e===0?Math.random()*15:e===1?Math.random()*H:e===2?H-Math.random()*15:Math.random()*H,";
nf+="size:1+Math.random()*2,op:0.02+Math.random()*0.08,vx:(Math.random()-0.5)*0.05,vy:(Math.random()-0.5)*0.05,edge:e});}";
nf+="this._sp=[];return p;},";
nf+="drawSnowflake:function(ctx,cx,cy,size,a,breath,subL){if(subL<0||size<3)return;var fade=1-subL*0.3;";
nf+='ctx.strokeStyle="rgba(180,215,240,"+(a*1.8*breath*fade)+")";ctx.lineWidth=2.0-subL*0.3;';
nf+="for(var i=0;i<6;i++){var angle=Math.PI/3*i+Math.PI/6;var endX=cx+size*Math.cos(angle),endY=cy+size*Math.sin(angle);";
nf+="ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(endX,endY);ctx.stroke();var subSize=size*0.35;";
nf+="for(var j=1;j<=2;j++){var t=j/3,bx=cx+size*t*Math.cos(angle),by=cy+size*t*Math.sin(angle);";
nf+="var sa1=angle+Math.PI/4,sa2=angle-Math.PI/4;";
nf+="ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+subSize*Math.cos(sa1),by+subSize*Math.sin(sa1));ctx.stroke();";
nf+="ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+subSize*Math.cos(sa2),by+subSize*Math.sin(sa2));ctx.stroke();}";
nf+="if(subL>0)this.drawSnowflake(ctx,endX,endY,size*0.3,a*0.6,breath,subL-1);}},";
nf+="draw:function(ctx,w,h,p,int,frm){var self=this,sp=self._sp;ctx.clearRect(0,0,w,h);";
nf+="for(var i=0;i<p.length;i++){var d=p[i];if(d.type!=='frost'||!isFinite(d.x)||!isFinite(d.y))continue;";
nf+="var fa=d.op*(int/100);if(fa>0.005){ctx.fillStyle='rgba(200,225,255,'+fa+')';";
nf+="ctx.fillRect(Math.round(d.x),Math.round(d.y),Math.round(Math.max(d.size,1)),Math.round(Math.max(d.size,1)));}";
nf+="d.x+=d.vx;d.y+=d.vy;if((d.edge===0&&d.y>25)||(d.edge===1&&d.y<h-25)||(d.edge===2&&d.y<h-25)||(d.edge===3&&d.x<w-25)){";
nf+="var ne=Math.floor(Math.random()*4);d.x=ne===0?Math.random()*w:ne===1?w:ne===2?Math.random()*w:0;";
nf+="d.y=ne===0?Math.random()*15:ne===1?Math.random()*h:ne===2?h-Math.random()*15:Math.random()*h;d.edge=ne;}}";
nf+="for(var i=0;i<p.length;i++){var d=p[i];if(d.type==='frost'||!isFinite(d.x)||!isFinite(d.y))continue;";
nf+="var a2=d.op*(int/100);if(a2<0.03)continue;d.dist+=d.sp*(d.growing?1:-1);if(d.dist>d.maxDist||d.dist<2)d.growing=!d.growing;";
nf+="var breath=0.8+0.2*Math.sin(frm*0.004);var cx2=d.x,cy2=d.y;if(d.growDir===0)cy2+=d.dist;else if(d.growDir===1)cx2-=d.dist;";
nf+="else if(d.growDir===2)cy2-=d.dist;else cx2+=d.dist;var fs=d.size*(0.5+0.5*int/100)*breath;";
nf+="self.drawSnowflake(ctx,cx2,cy2,fs,a2,breath,d.branch);";
nf+="if(sp.length<60&&Math.random()<0.05){for(var t=0;t<6;t++){if(Math.random()<0.15){";
nf+="var ang=Math.PI/3*t+Math.PI/6;";
nf+="sp.push({x:Math.round(cx2+fs*Math.cos(ang)),y:Math.round(cy2+fs*Math.sin(ang)),size:2+Math.random()*2,life:0,maxLife:15+Math.floor(Math.random()*20),alpha:0.5+Math.random()*0.4});}}}}";
nf+="for(var i=sp.length-1;i>=0;i--){var s=sp[i];s.life++;var pr=s.life/s.maxLife;if(pr>=1){sp.splice(i,1);continue;}";
nf+="var sa=s.alpha*(1-pr)*(int/100);if(sa<0.02)continue;var sz=Math.max(Math.round(s.size*(1-pr*0.5)),1);";
nf+="ctx.save();ctx.fillStyle='rgba(220,240,255,'+sa+')';ctx.shadowColor='rgba(200,230,255,'+(sa*0.5)+')';ctx.shadowBlur=6;";
nf+="ctx.fillRect(Math.round(s.x-sz/2),Math.round(s.y-sz/2),sz,sz);ctx.restore();}";
nf+="}\n};";

js=js.substring(0,start)+nf+js.substring(end);
fs.writeFileSync(jsPath,js,"utf8");
console.log("Modified JS:",js.length,"bytes");

// Add particle assets
var particleSrc="D:/MC??/mc??";
var particleDst=path.join(root,"assets","particles");
fs.mkdirSync(particleDst,{recursive:true});
function cpDir(src,dst){
  fs.mkdirSync(dst,{recursive:true});
  fs.readdirSync(src).forEach(function(f){
    var fp=path.join(src,f);
    if(fs.statSync(fp).isFile())fs.copyFileSync(fp,path.join(dst,f));
  });
}
cpDir(path.join(particleSrc,"??","?????"),path.join(particleDst,"dust"));
cpDir(path.join(particleSrc,"??","??"),path.join(particleDst,"dust"));
cpDir(path.join(particleSrc,"??","?"),path.join(particleDst,"freeze"));
cpDir(path.join(particleSrc,"??","?"),path.join(particleDst,"freeze"));
cpDir(path.join(particleSrc,"??","??"),path.join(particleDst,"sculk"));
fs.copyFileSync(path.join(particleSrc,"??","snow.png"),path.join(particleDst,"snow.png"));
fs.copyFileSync(path.join(particleSrc,"??","??","flame.png"),path.join(particleDst,"flame.png"));
console.log("Particle assets added");

// Repackage with adm-zip
if(fs.existsSync(outPath))fs.unlinkSync(outPath);
var outZip=new AdmZip();
outZip.addLocalFolder(root,"org.yoshino.launcher-theme-enhancer");
outZip.writeZip(outPath);

// Verify
var vzip=new AdmZip(outPath);
var vjs=vzip.readAsText("org.yoshino.launcher-theme-enhancer/frontend/index.js");
console.log("BBB JS:",vjs.length,"bytes, first char:",vjs.charCodeAt(0));
console.log("registerExtension:",vjs.indexOf("window.registerExtension(function")>=0);
console.log("freeze:",vjs.indexOf("themeEffects.freeze")>=0);
console.log("frost:",vjs.indexOf('"frost"')>=0);

// Syntax check
var c=require("child_process");
var tf=path.join(os.tmpdir(),"bbb-check.js");
fs.writeFileSync(tf,vjs,"utf8");
c.execSync("node --check \""+tf+"\"",{stdio:"inherit"});

// Cleanup
fs.rmSync(tmp,{recursive:true,force:true});
console.log("DONE");
