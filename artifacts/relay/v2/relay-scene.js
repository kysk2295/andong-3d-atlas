import * as T from 'three';
import {createKit} from './relay-primitives.js';
import {buildRelaySet} from './relay-sets.js';

export class RelayScene{
 constructor(container,{onInteract=()=>{},onFocus=()=>{},onError=()=>{}}={}){
  this.container=container;this.onInteract=onInteract;this.onFocus=onFocus;this.focused=null;this.touchMove={forward:0,side:0};this.kit=createKit();this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.7));
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.shadowMap.autoUpdate=false;
  this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
  this.renderer.domElement.setAttribute('aria-label','1인칭 3D 공간. 드래그 또는 방향키로 둘러보기, W A S D로 이동, R로 시점 복원');this.renderer.domElement.tabIndex=0;
  container.append(this.renderer.domElement);this.scene=new T.Scene();this.scene.background=new T.Color('#c2b9a0');
  this.camera=new T.PerspectiveCamera(58,1,.045,220);this.scene.add(this.camera);
  this.ambient=new T.HemisphereLight('#fff0c9','#556a5f',2);this.scene.add(this.ambient);
  this.sun=new T.DirectionalLight('#ffdba1',3.5);this.sun.position.set(-5,13,8);this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);this.sun.shadow.camera.left=-18;this.sun.shadow.camera.right=18;this.sun.shadow.camera.top=18;this.sun.shadow.camera.bottom=-18;this.sun.shadow.normalBias=.04;this.scene.add(this.sun);
  this.fill=new T.DirectionalLight('#c6dce0',1);this.fill.position.set(6,3,-7);this.scene.add(this.fill);
  this.localLight=new T.PointLight('#ffdb9c',18,12,2);this.localLight.position.set(0,2.5,1);this.scene.add(this.localLight);
  this.rig=new T.Group();this.camera.add(this.rig);this.leftHand=this.kit.hand(this.rig,-1);this.rightHand=this.kit.hand(this.rig,1);this.leftHand.position.set(-.35,-.43,-.72);this.rightHand.position.set(.38,-.46,-.71);this.leftHand.rotation.set(-.35,.2,-.4);this.rightHand.rotation.set(-.4,-.2,.4);
  this.chopsticks=new T.Group();this.rightHand.add(this.chopsticks);for(const x of [-.016,.016]){const q=this.kit.box(this.chopsticks,[.007,.3,.007],[x,.19,0],'#6d5039');q.rotation.z=x;}
  this.brush=new T.Group();this.rightHand.add(this.brush);this.kit.cyl(this.brush,.008,.011,.28,[0,.18,0],this.kit.wood);this.kit.cyl(this.brush,.003,.01,.055,[0,.345,0],'#3b2b1e');
  this.phone=new T.Group();this.leftHand.add(this.phone);this.kit.box(this.phone,[.19,.35,.023],[0,.13,-.037],'#1e3531');this.kit.label(this.phone,'이어드림',[0,.18,-.021],.16,'#274f41','#e8dbb9',.23);this.phone.rotation.x=-.22;
  this.receipt=new T.Group();this.rightHand.add(this.receipt);this.kit.label(this.receipt,'이어드림 영수증',[0,.17,-.034],.21,'#3c4b3c','#f1e8cc',.32);
  for(let y=0;y<9;y++)for(let x=0;x<9;x++)if((x*7+y*3+x*y)%5<2)this.kit.box(this.receipt,[.011,.011,.001],[(x-4)*.013,.11+(y-4)*.013,-.03],'#2f4c40');
  this.bite=this.kit.sphere(this.chopsticks,.027,[0,.34,0],'#ba8343');this.bite.visible=false;
  this.keys=new Set();this.yaw=0;this.pitch=0;this.action=null;this.cache=new Map();this.clock=0;this.disposed=false;this.paused=false;
  this.ray=new T.Raycaster();this.events=new AbortController();const signal=this.events.signal;let drag=null;
  const canvas=this.renderer.domElement;
  canvas.addEventListener('contextmenu',e=>e.preventDefault(),{signal});
  canvas.addEventListener('pointerdown',e=>{canvas.focus({preventScroll:true});drag={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY};if(this.painting)this.paintAt(e);canvas.setPointerCapture(e.pointerId);},{signal});
  canvas.addEventListener('pointermove',e=>{if(!drag||this.action)return;if(this.painting){this.paintAt(e);return;}this.yaw-=(e.clientX-drag.lastX)*.0035;this.pitch=T.MathUtils.clamp(this.pitch-(e.clientY-drag.lastY)*.003,-.68,.55);drag.lastX=e.clientX;drag.lastY=e.clientY;this.orient();},{signal});
  canvas.addEventListener('pointerup',e=>{if(this.painting){drag=null;return;}if(drag&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<6&&!this.action){const rect=canvas.getBoundingClientRect();this.ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),this.camera);let hit=this.ray.intersectObjects(this.current?.hotspots||[],true)[0]?.object;while(hit&&!hit.userData.action)hit=hit.parent;if(hit&&this.camera.position.distanceTo(hit.getWorldPosition(new T.Vector3()))<4.5)this.onInteract(hit.userData.action);}drag=null;},{signal});
  canvas.addEventListener('pointercancel',()=>{drag=null;},{signal});
  canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d','r','W','A','S','D','R','e','E','Shift'].includes(e.key)){e.preventDefault();this.keys.add(e.key.toLowerCase());if(e.key.toLowerCase()==='r')this.resetView();if(e.key.toLowerCase()==='e'&&!e.repeat)this.interact();}},{signal});
  window.addEventListener('keyup',e=>this.keys.delete(e.key.toLowerCase()),{signal});window.addEventListener('blur',()=>this.keys.clear(),{signal});canvas.addEventListener('blur',()=>this.keys.clear(),{signal});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.paused=true;this.cancelAction();onError('3D 화면 연결이 끊겼습니다. 새로고침하거나 아래 버튼으로 여정을 계속할 수 있습니다.');},{signal});
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);this.resize();this.last=performance.now();this.animate();
 }
 resize(){const w=this.container.clientWidth||innerWidth,h=this.container.clientHeight||innerHeight;this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.fov=w<700?68:58;this.camera.updateProjectionMatrix();}
 setScene(id,options={}){
  this.cancelPaint();this.cancelAction();this.id=id;this.options=options;
  const key=JSON.stringify([id,options.meal,options.program,options.craftSteps,options.color,options.maskArt,options.transport,options.cover,options.walked]);
  if(this.current)this.scene.remove(this.current.group);
  if(!this.cache.has(key)){const kit=createKit();this.cache.set(key,{...buildRelaySet(id,kit,options),kit});}
  this.current=this.cache.get(key);this.cache.delete(key);this.cache.set(key,this.current);
  while(this.cache.size>5){const [oldKey,oldSet]=this.cache.entries().next().value;this.disposeSet(oldSet);this.cache.delete(oldKey);}
  this.scene.add(this.current.group);
  const night=this.current.night;this.scene.background.set(night?'#14252b':'#b7bdab');this.scene.fog=new T.Fog(night?'#14252b':'#b7bdab',25,135);
  this.ambient.intensity=night?1.35:2.25;this.ambient.color.set(night?'#bed6e1':'#fff0c9');this.sun.intensity=night?1.2:3;this.fill.intensity=night?.55:1;this.localLight.intensity=['meal','receipt','workshop'].includes(id)?24:10;
  this.localLight.position.set(0,2.8,id==='bridge'?-14:0);this.renderer.toneMappingExposure=night?1.45:1.15;
  this.rig.visible=!options.cover;this.chopsticks.visible=id==='meal';this.brush.visible=id==='workshop'&&options.program==='mask';this.phone.visible=id==='receipt';this.receipt.visible=id==='receipt';
  this.resetHands();this.leftHand.visible=id==='receipt'||id==='meal'||id==='workshop';this.rightHand.visible=id!=='market'&&id!=='transit';
  this.resetView();this.renderer.shadowMap.needsUpdate=true;
 }
 resetView(){if(!this.current)return;this.camera.position.fromArray(this.current.camera);const target=new T.Vector3(...this.current.target);const direction=target.sub(this.camera.position).normalize();this.yaw=Math.atan2(-direction.x,-direction.z);this.pitch=Math.asin(direction.y);this.orient();}
 orient(){this.camera.rotation.order='YXZ';this.camera.rotation.y=this.yaw;this.camera.rotation.x=this.pitch;this.camera.rotation.z=0;}
 look(dx,dy=0){this.yaw+=dx;this.pitch=T.MathUtils.clamp(this.pitch+dy,-.68,.55);this.orient();}
 move(amount,side=0){if(!this.current||this.action||this.painting)return;const b=this.current.bounds;const p=this.camera.position;const x=T.MathUtils.clamp(p.x-Math.sin(this.yaw)*amount+Math.cos(this.yaw)*side,...b.x);const z=T.MathUtils.clamp(p.z-Math.cos(this.yaw)*amount-Math.sin(this.yaw)*side,...b.z);const blocked=(xx,zz)=>(this.current.obstacles||[]).some(o=>Math.abs(xx-o.x)<o.w/2+.18&&Math.abs(zz-o.z)<o.d/2+.18);if(!blocked(x,p.z))p.x=x;if(!blocked(p.x,z))p.z=z;}
 interact(){if(this.focused&&!this.action&&!this.painting)this.onInteract(this.focused.userData.action);}
 updateFocus(){if(!this.current||this.action||this.painting||this.options.cover){this.onFocus(null);return;}this.ray.setFromCamera(new T.Vector2(0,0),this.camera);let hit=this.ray.intersectObjects(this.current.hotspots,true)[0]?.object;while(hit&&!hit.userData.action)hit=hit.parent;this.focused=hit&&this.camera.position.distanceTo(hit.getWorldPosition(new T.Vector3()))<4.5?hit:null;this.onFocus(this.focused?{name:this.focused.userData.name,action:this.focused.userData.action}:null);}
 paintTask({color,step,onProgress}){
  const face=this.current?.refs.mask?.userData.face;if(!face)return Promise.resolve(false);this.resetView();this.camera.position.set(0,1.65,1.15);this.camera.lookAt(0,.98,0);this.keys.clear();
  const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.fillStyle=face.material.color.getStyle();ctx.fillRect(0,0,512,512);if(face.material.map?.image)ctx.drawImage(face.material.map.image,0,0,512,512);
  const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;const material=face.material.clone();material.color.set('#ffffff');material.map=tx;face.material=material;this.current.refs.paintTexture?.dispose();this.current.refs.paintMaterial?.dispose();this.current.refs.paintTexture=tx;this.current.refs.paintMaterial=material;
  return new Promise(resolve=>{this.painting={face,ctx,tx,color:step===1?'#be5b48':step===2?'#53392d':color,cells:new Set(),onProgress,resolve};});
 }
 paintAt(e){const p=this.painting;if(!p)return;const r=this.renderer.domElement.getBoundingClientRect();this.ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.camera);const hit=this.ray.intersectObject(p.face,false)[0];if(!hit?.uv)return;const brushPoint=this.camera.worldToLocal(hit.point.clone());this.rightHand.position.set(brushPoint.x,brushPoint.y-.3,brushPoint.z+.02);this.rightHand.rotation.set(0,0,0);const x=hit.uv.x*512,y=(1-hit.uv.y)*512;p.ctx.fillStyle=p.color;p.ctx.beginPath();p.ctx.arc(x,y,15,0,Math.PI*2);p.ctx.fill();p.tx.needsUpdate=true;p.cells.add(Math.floor(x/18)+','+Math.floor(y/18));const progress=Math.min(1,p.cells.size/14);p.onProgress(progress);if(progress===1){const resolve=p.resolve;this.painting=null;resolve(true);}}
 maskArtwork(){return this.current?.refs.paintTexture?.image?.toDataURL?.('image/png')||null;}
 cancelPaint(success=false){if(this.painting){this.painting.resolve(success);this.painting=null;}}
 setPaused(paused){this.paused=paused;this.keys.clear();this.touchMove={forward:0,side:0};}
 setQuality(low){this.renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,1.7));this.renderer.shadowMap.enabled=!low;this.resize();}
 cancelAction(){if(this.action){this.action.resolve(false);this.action=null;}}
 async act(type,payload={}){
  if(this.disposed)return false;this.cancelAction();this.resetHands();
  return new Promise(resolve=>{const duration=this.reduced ? .25 : ({travel:7,walk:5.5,scan:1.8,enter:1.1,game:1.4}[type]||1.6);this.action={type,payload,duration,elapsed:0,resolve,from:this.camera.position.clone()};});
 }
 resetHands(){this.rightHand.position.set(.38,-.46,-.71);this.rightHand.rotation.set(-.4,-.2,.4);this.leftHand.position.set(-.35,-.43,-.72);this.leftHand.rotation.set(-.35,.2,-.4);this.phone.visible=this.id==='receipt';this.bite.visible=false;}
 tickAction(dt){
  const a=this.action;if(!a)return;a.elapsed+=dt;const p=Math.min(1,a.elapsed/a.duration),ease=p*p*(3-2*p),wave=Math.sin(p*Math.PI);const refs=this.current.refs;
  if(a.type==='enter'){this.camera.position.z=T.MathUtils.lerp(a.from.z,-2.5,ease);}
  if(a.type==='eat'){this.rightHand.position.set(.2,-.44+wave*.36,-.8+wave*.35);this.rightHand.rotation.z=.4-wave*.8;this.bite.visible=p>.2&&p<.8;}
  if(a.type==='scan'||a.type==='redeem'){this.leftHand.position.y=-.43+wave*.2;this.phone.visible=true;}
  if(a.type==='mask'){this.rightHand.position.set(.15+Math.sin(p*Math.PI*4)*.08,-.4,-.85);this.rightHand.rotation.x=-.65;}
  if(a.type==='tea'&&refs.teapot){const step=this.options.craftSteps;if(step===0&&refs.flowers){refs.flowers.visible=true;refs.flowers.position.y=(1-p)*.22;}else{refs.teapot.rotation.z=-wave*.5;refs.teapot.position.y=.82+wave*.17;if(refs.teaStream)refs.teaStream.visible=p>.25&&p<.85&&step===2;}this.rightHand.position.set(.1,-.35,-.82);}
  if(a.type==='soju'){this.rightHand.position.x=.28-wave*.17;this.rightHand.position.y=-.4+wave*.09;if(refs.bottle&&this.options.craftSteps===2)refs.bottle.rotation.z=Math.sin(p*Math.PI*3)*.12;if(refs.distill)refs.distill.visible=this.options.craftSteps===1&&p>.2&&p<.9;}
  if(a.type==='walk'){this.camera.position.z=T.MathUtils.lerp(a.from.z,-9,ease);}
  if(a.type==='travel'){if(refs.roadside)refs.roadside.position.z=p*40;if(refs.city)refs.city.position.z=p*40;this.camera.position.x=a.from.x+(this.reduced?0:Math.sin(p*Math.PI)*.03);}
  if(a.type==='buy'){this.rightHand.position.set(.2,-.45+wave*.14,-.71-wave*.2);}
  if(a.type==='game'&&refs.arrow){refs.arrow.visible=p<1;const end=refs.target.clone();if(!a.payload.hit)end.x+=1;refs.arrow.position.lerpVectors(new T.Vector3(0,1.5,4.8),end,p);refs.arrow.position.y+=Math.sin(p*Math.PI)*1.8;refs.arrow.rotation.x=p*Math.PI*.9;}
  if(p>=1){a.resolve(true);this.action=null;this.resetHands();}
 }
 fountain(){if(this.current?.refs.fountain)this.current.refs.fountain.visible=!this.current.refs.fountain.visible;}
 animate(){if(this.disposed)return;this.frame=requestAnimationFrame(()=>this.animate());const now=performance.now(),dt=Math.min((now-this.last)/1000,.045);this.last=now;if(document.hidden||this.paused)return;
  this.clock+=dt;
  if(this.current&&!this.action){const k=this.keys;if(k.has('arrowleft'))this.look(dt*.8);if(k.has('arrowright'))this.look(-dt*.8);if(k.has('arrowup'))this.look(0,dt*.5);if(k.has('arrowdown'))this.look(0,-dt*.5);const speed=k.has('shift')?3:1.8;this.move(((k.has('w')?1:0)-(k.has('s')?1:0)+this.touchMove.forward)*dt*speed,((k.has('d')?1:0)-(k.has('a')?1:0)+this.touchMove.side)*dt*speed);}
  this.updateFocus();this.tickAction(dt);const refs=this.current?.refs;if(refs?.water)refs.water.material.uniforms.uTime.value=this.reduced?0:this.clock;if(refs?.boats&&!this.reduced)refs.boats.forEach((b,i)=>{b.position.y=Math.sin(this.clock*.7+i)*.035;b.rotation.y=Math.sin(this.clock*.08+i)*.22;});
  if(refs?.people&&!this.reduced)refs.people.forEach((p,i)=>{p.userData.head.rotation.y=Math.sin(this.clock*.45+i*1.7)*.15;});this.renderer.render(this.scene,this.camera);
 }
 disposeSet(s){s.refs.paintTexture?.dispose();s.refs.paintMaterial?.dispose();if(s.refs.water){s.refs.water.geometry.dispose();s.refs.water.material.dispose();}s.kit.dispose();}
 dispose(){this.disposed=true;cancelAnimationFrame(this.frame);this.cancelPaint();this.cancelAction();this.events.abort();this.resizeObserver.disconnect();for(const s of this.cache.values())this.disposeSet(s);this.cache.clear();this.kit.dispose();this.renderer.dispose();this.renderer.domElement.remove();}
}
