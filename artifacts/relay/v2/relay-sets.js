import * as T from 'three';

export function buildRelaySet(id,k,options={}){
 const group=new T.Group(),refs={people:[]},hotspots=[];
 const result={group,refs,hotspots,camera:[0,1.65,5],target:[0,1.4,-3],night:false,bounds:{x:[-2,2],z:[-1,6]}};
 const {box,cyl,sphere,tube,label,roof,lamp,table,chair,bowl,plant,pot,mask,food}=k;
 const spot=(object,action,name)=>{object.userData.action=action;object.userData.name=name;hotspots.push(object);return object;};
 function npc(p,role,coat='#54766a',rotation=0){const person=k.person(group,p,{coat,rotation,apron:role==='host'||role==='teacher'});refs.people.push(person);if(role)spot(person,'talk:'+role,{host:'식당 직원과 이야기하기',teacher:'체험 선생님과 이야기하기',guide:'골목 안내인과 이야기하기',vendor:'부스 운영자와 이야기하기'}[role]);return person;}
 function ground(size=40){box(group,[size,.12,size],[0,-.08,0],k.stone);}
 function lattice(parent,x,y,z,w=2,h=1.5){box(parent,[w,.05,.07],[x,y-h/2,z],k.wood);box(parent,[w,.05,.07],[x,y+h/2,z],k.wood);box(parent,[w,h,.035],[x,y,z-.02],k.paper);for(let a=-w/2;a<=w/2+.01;a+=.25)box(parent,[.022,h,.055],[x+a,y,z+.04],'#694f36');for(let b=-h/2;b<=h/2+.01;b+=.25)box(parent,[w,.023,.055],[x,y+b,z+.04],'#694f36');}
 function hanok(parent,p,w=6,d=4,title=''){const a=new T.Group();a.position.set(...p);parent.add(a);box(a,[w,2.5,d],[0,1.25,0],k.paper);for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])box(a,[.18,2.9,.18],[x,1.45,z],k.wood);roof(a,w+.65,d+.55,[0,2.8,0]);lattice(a,0,1.4,d/2+.03,w*.7,1.6);if(title)label(a,title,[0,2.43,d/2+.08],w*.52,'#f3ddb1','#314b40',.44);return a;}
 function interior(){box(group,[10,.12,10],[0,-.07,0],k.wood);box(group,[10,3.5,.16],[0,1.75,-4.3],k.paper);for(const x of [-4.8,4.8]){box(group,[.15,3.5,10],[x,1.75,0],k.paper);box(group,[.2,3.5,.2],[x,1.75,-4.1],k.wood);}for(let z=-4;z<4;z+=2)box(group,[9.8,.2,.2],[0,3.2,z],k.wood);for(const x of [-3,0,3]){lamp(group,[x,2.6,-1.5],.8);lattice(group,x,1.55,-4.19,2.2,1.8);}box(group,[10,.12,10],[0,3.5,0],k.wood);}
 function scenery(){for(let i=0;i<24;i++){const x=(i%2?1:-1)*(20+i*.8),z=-10-(i%8)*9;const mountain=sphere(group,[12,3+i%4*1.4,9],[x,1,z],i%2?'#233b37':'#304943');mountain.castShadow=false;}for(let i=0;i<12;i++){const x=(i%2?1:-1)*(6+i%3*3),z=-4-i*4;cyl(group,.08,.14,3,[x,1.5,z],'#51422c');for(let j=0;j<3;j++)sphere(group,[.8,.9,.8],[x+Math.sin(j*2)*.4,3+j*.3,z],i%3?'#617245':'#bc8449');}}
 function water(){const geo=new T.PlaneGeometry(140,160,64,64);geo.rotateX(-Math.PI/2);const mat=new T.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:`uniform float uTime; varying vec3 vP; void main(){vec3 p=position; p.y+=sin(p.x*.6+uTime*.7)*.027+cos(p.z*.7+uTime*.6)*.022;vP=p;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`uniform float uTime;varying vec3 vP;void main(){float w=sin(vP.x*3.+vP.z*1.6+uTime)*.5+.5;float a=pow(max(0.,sin(vP.z*5.+sin(vP.x)+uTime)),13.);float light=exp(-abs(vP.x)*.12)*a;vec3 c=mix(vec3(.026,.10,.12),vec3(.08,.20,.21),w*.28);c+=vec3(.72,.45,.15)*light*.5;gl_FragColor=vec4(c,1.);}`});const m=new T.Mesh(geo,mat);m.position.set(0,-.3,-20);group.add(m);refs.water=m;}
 function bridge(){water();scenery();
  box(group,[5,.3,65],[0,.08,-13],'#473c2d');
  for(let z=-44;z<20;z+=.43)box(group,[4.3,.12,.4],[0,.3,z],k.wood);
  for(const x of [-2.18,2.18]){
   for(let z=-44;z<20;z+=2.6){box(group,[.13,1.15,.13],[x,.87,z],k.wood);sphere(group,.105,[x,1.48,z],'#bdb090');if(Math.round(z*10)%52===-24){lamp(group,[x,1.65,z],.48);}}
   for(const y of [.57,.92,1.27])box(group,[.09,.075,65],[x,y,-13],k.wood);
   box(group,[.045,.045,65],[x,1.33,-13],k.mat('#ffc875',{emissive:'#ffb24d',emissiveIntensity:1.4}));
  }
  const pavilion=new T.Group();group.add(pavilion);pavilion.position.set(0,.25,-14);for(const x of [-2,2])for(const z of [-2,2])cyl(pavilion,.11,.14,3,[x,1.5,z],'#755037');roof(pavilion,5.8,5.8,[0,3.1,0]);spot(label(pavilion,'月 映 亭',[0,2.67,2.05],1.2,'#eed5a1','#293c32',.4),'primary','월영정 도착 · 다음 장면');
  for(const x of [-2,2]){box(pavilion,[.5,.11,3],[x,.58,0],k.wood);lamp(pavilion,[x,2.35,1.8],.6);}
  const moon=sphere(group,1.9,[18,18,-65],k.mat('#f6e4b6',{emissive:'#e7d5a8',emissiveIntensity:.8}));moon.castShadow=false;
  refs.boats=[];
  for(let i=0;i<3;i++){const a=new T.Group();group.add(a);a.position.set(7+i*6,-.02,-4-i*13);const crescent=new T.Shape();crescent.absarc(0,0,.95,Math.PI*.18,Math.PI*1.82,false);crescent.absarc(.35,0,.8,Math.PI*1.72,Math.PI*.28,true);k.mesh(a,new T.ExtrudeGeometry(crescent,{depth:.27,bevelEnabled:true,bevelThickness:.04,bevelSize:.03,bevelSegments:2,steps:1}),k.mat(['#edbd57','#84c4b8','#ef9bb2'][i],{emissive:['#d89c30','#469789','#bd607a'][i],emissiveIntensity:1.2}),[0,.3,0]);box(a,[1.1,.2,.6],[0,.12,0],'#b6b0a0');refs.boats.push(a);}
  const sail=new T.Group();group.add(sail);sail.position.set(-11,0,-21);sphere(sail,[2.3,.3,.65],[0,0,0],'#725035');cyl(sail,.05,.07,3.4,[0,1.65,0],k.wood);box(sail,[1.6,2.35,.02],[-.65,1.9,0],'#c5a465');
  refs.fountain=new T.Group();group.add(refs.fountain);refs.fountain.visible=false;for(let i=0;i<12;i++)tube(refs.fountain,[[2.35,.2,-i*2.7],[4,2.8,-i*2.7],[6,-.2,-i*2.7]],.025,k.mat('#a3dbe1',{emissive:'#99c6e2',emissiveIntensity:.5,transparent:true,opacity:.65}));
 }
 if(id==='market'){
  ground(45);result.camera=[0,1.68,7];result.target=[0,1.5,-6];result.bounds={x:[-2.4,2.4],z:[-3,8]};
  const back=hanok(group,[0,0,-7],8,3,'안동구시장 · 찜닭골목');
  spot(label(back,'이어드림 식당',[0,1.8,1.65],2.4,'#f6edd5','#753d28',.6),'primary','식당으로 들어가기');
  for(const side of [-1,1])for(let i=0;i<4;i++){
   const g=new T.Group();group.add(g);g.position.set(side*5.4,0,5-i*4);g.rotation.y=side===-1?Math.PI/2:-Math.PI/2;
   box(g,[3.8,3,3.4],[0,1.5,0],k.paper);box(g,[3.9,.12,1.4],[0,2.5,2],i%2?'#937849':'#41615b');
   for(let j=0;j<7;j++)box(g,[.29,.14,1.41],[-1.7+j*.55,2.55,2],i%2?'#e6d6b2':'#c3c4a2');
   label(g,['안동찜닭','간고등어','헛제사밥','안동 특산물'][i],[0,2,1.76],2.5,'#fff1ca',i%2?'#753e2b':'#2e5148',.6);
   box(g,[2.7,1.5,.05],[0,1,1.72],'#293f3b');for(const x of [-1.3,0,1.3])box(g,[.05,1.6,.07],[x,1,1.77],'#b49b76');
   table(g,[0,0,2.3],1.8,.6,.7);for(let j=0;j<4;j++)bowl(g,[-.6+j*.4,.76,2.3],.15,'#e3d6b8','#774e2b');lamp(g,[1.5,2.2,2],.6);
  }
  for(let z=-5;z<8;z+=3.1){tube(group,[[-4,3.6,z],[0,3.2,z],[4,3.6,z]],.012,'#695b45');lamp(group,[0,2.96,z],.52);}
  plant(group,[-2.4,0,-4],1.2);plant(group,[2.4,0,-4],1.2);
  npc([1.5,0,-2],'guide');npc([-2.6,0,2],null,'#9b7652',1.4);npc([2.7,0,-5],null,'#64738a',-.6);
  label(group,'한 끼의 맛에서, 안동의 밤까지',[0,3.8,-5.25],5.2,'#eed8b1','#345147',.5);
 }else if(id==='meal'||id==='receipt'){
  interior();result.camera=[0,1.42,2];result.target=[0,.86,-.15];result.bounds={x:[-.55,.55],z:[1.4,2.5]};
  table(group,[0,0,0],2.3,1.45,.75);refs.food=food(group,options.meal||'jjimdak');refs.food.position.set(0,.82,0);spot(refs.food,'primary','식사 맛보기');
  for(const x of [-.73,.73]){bowl(group,[x,.82,.22],.15,'#e3ded2','#f5ebd2');bowl(group,[x,.82,-.28],.14,'#eee9d8',x<0?'#af4e30':'#547b39');}
  for(const x of [.93,1.01]){const chop=box(group,[.018,.016,.45],[x,.84,.18],'#858d85');chop.rotation.y=-.1;}
  cyl(group,.075,.06,.13,[-.92,.89,.52],'#d1dddc');
  for(const x of [-3.3,3.3])for(const z of [-2.4,.6]){table(group,[x,0,z]);chair(group,[x,0,z+1]);chair(group,[x,0,z-1],Math.PI);bowl(group,[x,.84,z],.22,'#d8ccb2');}
  label(group,'안동의 한 상',[0,2.65,-4.19],2.3,'#675337','#e6d7b8',.48);plant(group,[-4,0,-3.4],1.5);pot(group,[3.5,0,-3.7],1.4);
  npc([1.65,0,-.55],'host','#60735a');npc([-3.3,0,-3.4],null,'#a58c67');
  if(id==='receipt'){
   result.camera=[0,1.45,1.8];result.target=[0,.9,0];refs.food.visible=false;
   const card=label(group,'식사 영수증 · QR 인증',[0,1.4,-.45],.84,'#253c36','#eee8d4',1.06);spot(card,'primary','영수증 스캔');
   const qr=new T.Group();group.add(qr);qr.position.set(0,1.15,-.42);
   for(let y=0;y<17;y++)for(let x=0;x<17;x++)if((x*7+y*3+x*y)%5<2)box(qr,[.018,.018,.004],[(x-8)*.021,(y-8)*.021,0],'#28463e');
   label(group,'시연 전용 · 실제 결제 없음',[0,.87,-.42],.66,'#355448','#eee8d4',.09);
   box(group,[.24,.08,.18],[.8,.83,-.15],'#263c36');label(group,'QR',[.8,.9,-.04],.15,'#e5d4a5','#263c36',.1);
  }
 }else if(id==='workshop'){
  interior();result.camera=[0,1.44,1.75];result.target=[0,.96,-.32];result.bounds={x:[-.5,.5],z:[1.4,2.2]};
  table(group,[0,0,0],2.5,1.5,.73);label(group,'손끝으로 만나는 안동',[0,2.67,-4.17],3,'#574d35','#e4d5b4',.45);
  for(const side of [-1,1]){const g=new T.Group();group.add(g);g.position.set(side*3.7,0,-2.2);for(const y of [.3,1,1.7]){box(g,[1.2,.1,.75],[0,y,0],k.wood);for(let i=0;i<3;i++)pot(g,[-.4+i*.4,y+.05,0],.48);}for(const x of [-.58,.58])box(g,[.08,2,.08],[x,1,0],k.wood);plant(group,[side*3.4,0,1.4],1.2);}
  for(let i=0;i<3;i++){const m=mask(group,[-2+i*2,1.6,-4.05],.8);m.rotation.z=(i-1)*.12;}
  npc([-1.65,0,-.6],'teacher','#8b7458',.3);
  if(options.program==='tea'){
   refs.teapot=pot(group,[-.35,.82,-.05],.64);refs.teapot.rotation.z=0;
   tube(refs.teapot,[[.2,.3,0],[.45,.43,0],[.5,.48,0]],.052,'#685237');
   tube(refs.teapot,[[-.18,.4,0],[-.38,.48,0],[-.4,.22,0],[-.22,.16,0]],.031,'#685237');
   refs.cup=bowl(group,[.4,.8,.12],.17,'#d3d6b6',options.craftSteps>=3?'#c5a747':null);
   bowl(group,[-.8,.8,.27],.12,'#9c794f');for(let i=0;i<7;i++)sphere(group,[.021,.013,.021],[-.8+Math.sin(i*2)*.065,.85,.27+Math.cos(i*2)*.05],'#e8cd6d');
   refs.flowers=new T.Group();group.add(refs.flowers);for(let i=0;i<7;i++){const f=sphere(refs.flowers,[.025,.012,.025],[-.35+Math.sin(i*2)*.08,1.18,-.05+Math.cos(i*2)*.07],'#edd37a');}refs.flowers.visible=options.craftSteps>=1;
   refs.teaStream=cyl(group,.009,.009,.34,[.15,1.04,.09],k.mat('#d2b76a',{transparent:true,opacity:.65}));refs.teaStream.visible=false;refs.steam=new T.Group();group.add(refs.steam);for(let i=0;i<3;i++)tube(refs.steam,[[.34+i*.065,.92,.12],[.32+i*.065,1.04,.1],[.37+i*.065,1.16,.12]],.003,k.mat('#eee6bf',{transparent:true,opacity:.36}));refs.steam.visible=options.craftSteps>=3;
   spot(refs.teapot,'primary','차 우리기');
  }else if(options.program==='soju'){
   refs.still=pot(group,[-.22,.8,-.12],1.15);cyl(refs.still,.21,.14,.28,[0,.75,0],'#775f48');const upper=pot(refs.still,[0,1,0],.75);upper.rotation.x=Math.PI;
   tube(group,[[-.02,1.5,-.12],[.33,1.47,-.12],[.42,1.27,-.12]],.031,'#9c7754');bowl(group,[.43,.8,-.12],.14,'#d4c6a3',options.craftSteps>=2?'#dfe4d8':null);
   bowl(group,[-.9,.8,.2],.16,'#a4845d','#e5d5ac');for(let i=0;i<10;i++)sphere(group,[.012,.008,.007],[-.9+Math.sin(i*2)*.09,.9,.2+Math.cos(i*2)*.07],'#f3e6c8');
   refs.bottle=cyl(group,.065,.065,.25,[.83,.95,.2],k.mat('#638c7d',{roughness:.2}));cyl(group,.025,.055,.1,[.83,1.13,.2],'#638c7d');cyl(group,.033,.033,.04,[.83,1.2,.2],'#b49b74');refs.bottleLabel=label(group,'안동소주',[.83,1,.269],.11,'#514936','#e4d3aa',.13);refs.bottleLabel.visible=options.craftSteps>=3;refs.distill=cyl(group,.007,.007,.28,[.42,1.13,-.12],k.mat('#e7ddbf',{transparent:true,opacity:.7}));refs.distill.visible=false;spot(refs.still,'primary','전통주 과정 체험');
  }else{
   refs.mask=mask(group,[0,.9,0],1.15);refs.mask.rotation.x=-Math.PI*.42;
   if(options.craftSteps>=1)refs.mask.userData.face.material=k.mat(options.color||'#c77a48');
   if(options.maskArt){refs.paintTexture=new T.TextureLoader().load(options.maskArt);refs.paintTexture.colorSpace=T.SRGBColorSpace;refs.paintMaterial=k.mat('#ffffff').clone();refs.paintMaterial.map=refs.paintTexture;refs.mask.userData.face.material=refs.paintMaterial;}
   for(let i=0;i<3;i++){cyl(group,.075,.065,.05,[-.8+i*.23,.82,.2],['#b95842','#e0b962','#3e6860'][i]);}
   refs.brush=box(group,[.022,.022,.4],[.8,.82,.2],k.wood);refs.brush.rotation.y=.6;
   spot(refs.mask,'primary','꾸미기');if(options.craftSteps>=2)for(const side of [-1,1])sphere(refs.mask,[.065,.045,.008],[side*.15,-.075,.126],'#bf5747');
   if(options.craftSteps>=3)label(group,'나의 안동 · 완성',[0,1.23,-.45],.85,'#ead8aa','#36584b',.18);
  }
 }else if(id==='transit'){
  result.camera=[.48,1.4,2.15];result.target=[.05,1.6,-8];result.bounds={x:[.2,.7],z:[1.8,2.5]};
  ground(100);scenery();box(group,[8,.03,100],[0,.02,-20],'#64665f');for(let z=-55;z<24;z+=3.5)box(group,[.12,.012,1.8],[0,.047,z],'#e0ce85');
  refs.city=new T.Group();group.add(refs.city);for(let i=0;i<16;i++){hanok(refs.city,[(i%2?1:-1)*(10+i%3*2),0,12-i*7],5,3);}
  refs.roadside=new T.Group();group.add(refs.roadside);for(let i=0;i<18;i++){const x=(i%2?1:-1)*6,z=-i*5;cyl(refs.roadside,.06,.07,4,[x,2,z],'#3d514d');sphere(refs.roadside,.16,[x,4,z],k.mat('#e4ce97',{emissive:'#e4ce97',emissiveIntensity:.7}));}
  refs.vehicle=new T.Group();group.add(refs.vehicle);const bus=refs.vehicle;box(bus,[2.6,.12,5.4],[0,.3,0],'#42554f');box(bus,[2.6,.15,5.5],[0,2.6,0],'#d0c9b4');
  for(const x of [-1.25,1.25]){box(bus,[.12,.95,5.5],[x,.75,0],'#657b6c');for(const z of [-2.65,-1,1,2.65])box(bus,[.1,1.9,.08],[x,1.55,z],'#d0c9b4');}
  for(const x of [-.7,.7])for(const z of [-1.55,.0]){box(bus,[.5,.5,.12],[x,1.15,z],'#7d9276');box(bus,[.5,.1,.5],[x,.88,z+.2],'#7d9276');cyl(bus,.025,.025,1.4,[x,1.25,z-.1],'#b5b39c');}
  box(bus,[2.5,.4,.4],[0,.77,-2.45],'#354840');label(bus,options.transport==='taxi'?'월영교 방향 · 택시':'이어드림 · 월영교 방면',[0,2.22,-2.54],1.9,'#ead9aa','#344e43',.22);
  if(options.transport==='walk'){bus.visible=false;result.camera=[3.2,1.7,5];result.target=[3.2,1.6,-18];result.bounds={x:[2.9,3.5],z:[3,6]};}
  if(options.transport==='taxi'){
   bus.visible=false;const car=new T.Group();group.add(car);box(car,[2.1,.14,4],[0,.33,0],'#2e3938');box(car,[2.1,.1,3.8],[0,1.98,0],'#d0cabc');
   for(const x of [-1,1]){box(car,[.1,.6,4],[x,.63,0],'#727d70');for(const z of [-1.8,1.7])box(car,[.07,1.1,.1],[x,1.45,z],'#c6c3b5');}
   box(car,[2,.32,.6],[0,.95,-1.55],'#3b4340');const wheel=k.mesh(car,new T.TorusGeometry(.21,.025,8,24),k.mat('#292f2b'),[-.5,1.16,-1.3]);wheel.rotation.x=-.35;
   label(car,'월영교 →',[.1,1.12,-1.22],.43,'#d7dabc','#253e36',.19);result.camera=[.4,1.3,.6];result.target=[0,1.15,-8];result.bounds={x:[.25,.6],z:[.45,.9]};
  }
  result.night=true;
 }else if(id==='bridge'){
  bridge();result.night=true;result.camera=options.cover?[4.7,3.1,15]:[0,1.94,13];result.target=options.cover?[0,1.4,-12]:[0,1.9,-17];result.bounds={x:[-1.6,1.6],z:[-12,14]};
  if(options.walked){result.camera=[0,1.94,-9];result.target=[0,1.8,-19];}
  npc([-1.3,.36,-5],null,'#a88861',Math.PI);npc([1.3,.36,-23],null,'#56756b');
 }else if(id==='popup'){
  ground(55);result.night=true;result.camera=[0,1.7,6.6];result.target=[0,1.6,-4];result.bounds={x:[-7.4,7.4],z:[-2.2,7]};result.obstacles=[{x:-3.3,z:1.6,w:2,d:2.7},{x:3.3,z:1.6,w:2,d:2.7}];
  scenery();const river=box(group,[60,.04,30],[0,-.1,-30],k.mat('#183c3e',{roughness:.2}));
  for(let i=0;i<5;i++){
   const x=(i-2)*3.15,z=i%2===0?-4.7:-5.4,g=new T.Group();g.position.set(x,0,z);group.add(g);
   box(g,[2.65,.12,2.1],[0,.06,0],k.wood);for(const q of [-1.23,1.23])for(const r of [-.94,.94])box(g,[.065,2.5,.065],[q,1.25,r],k.wood);
   for(const side of [-1,1]){const top=box(g,[2.9,.07,1.4],[0,2.46,side*.53],i%2?'#b8874d':'#507262');top.rotation.x=side*.28;}
   table(g,[0,0,.6],2.6,.65,.95);label(g,['안동의 맛','탈과 공예','월영차회','작은 놀이터','여행 안내'][i],[0,2.08,1.05],2.12,'#f8e9c7',i%2?'#815b34':'#35554a',.35);
   lamp(g,[1.08,1.65,1.08],.58);
   const vendor=k.person(g,[.3,0,-.2],{coat:i%2?'#997c5b':'#557064',apron:true});refs.people.push(vendor);
   if(i===0){for(let n=0;n<3;n++){cyl(g,.115,.085,.25,[-.65+n*.6,1.1,.58],'#d8c299');sphere(g,.1,[-.65+n*.6,1.25,.58],'#aa6f35');}spot(g,'buy-food','로컬 푸드');}
   if(i===1){for(let n=0;n<3;n++)mask(g,[-.62+n*.62,1.4,.54],.6);spot(g,'buy-craft','탈 기념품');}
   if(i===2){pot(g,[-.55,1,.5],.7);for(let n=0;n<3;n++)bowl(g,[.05+n*.4,1.02,.65],.1,'#e2dcc4','#b39d48');}
   if(i===3){pot(g,[0,.15,1.9],.85);for(let n=0;n<3;n++)cyl(g,.009,.009,.7,[-.07+n*.07,.7,1.9],'#a38c55');spot(g,'game','투호 놀이');refs.target=new T.Vector3(x,.75,z+1.9);}
  }
  for(let z=-3;z<8;z+=4){tube(group,[[-9,4,z],[0,3.2,z],[9,4,z]],.016,'#72623b');for(let x=-8;x<9;x+=1.25){const bulb=sphere(group,.055,[x,3.22+Math.abs(x)*.085,z],k.mat('#ffdc8c',{emissive:'#ffbd53',emissiveIntensity:2}));bulb.castShadow=false;}}
  for(const x of [-3.3,3.3]){table(group,[x,0,1.6],1.3,.7,.75);chair(group,[x,0,2.4]);chair(group,[x,0,.8],Math.PI);}
  label(group,'월영교 야간 팝업 · 이어드림',[0,3.8,-7],5,'#f4d9a3','#30483b',.5);
  refs.arrow=cyl(group,.014,.014,.65,[0,1.2,5],'#b18d52');refs.arrow.visible=false;
 }
 return result;
}
