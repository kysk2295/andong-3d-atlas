import http from 'node:http';
import {readFileSync} from 'node:fs';
import {createStaticServer} from '../../../server.mjs';
const serve=createStaticServer().listeners('request')[0];
http.createServer((req,res)=>{
 let mode='';try{mode=readFileSync(new URL('./fault-mode.txt',import.meta.url),'utf8').trim();}catch{}
 const path=new URL(req.url,'http://localhost').pathname;
 if((mode==='data'&&path==='/data/terrain.json')||(mode==='art'&&path.startsWith('/assets/relay/materials/'))){
  console.log('stalled',mode,path);req.on('close',()=>console.log('cancelled',path));return;
 }
 if(mode.startsWith('slow-art:')&&path.startsWith('/assets/relay/materials/')){setTimeout(()=>serve(req,res),Math.max(0,Number(mode.split(':')[1])-Date.now()));return;}
 if(mode==='bundle'&&/^\/assets\/index-.*\.js$/.test(path)){res.writeHead(404);res.end('missing');return;}
 serve(req,res);
}).listen(4182,'127.0.0.1');
