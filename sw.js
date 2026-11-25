// Cache only this game's own shell. AI remains on its original CDN path.
const PREFIX='element-hero-tablet:'+self.registration.scope+':';
const CACHE=PREFIX+'20261125-v1';
const SHELL=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./monster-fire-v091.png','./monster-ice-v091.png','./monster-dual-v091.png','./dungeon-atelier-v10.webp'];
const absolute=p=>new URL(p,self.registration.scope).href;
const assetURLs=new Set(SHELL.slice(1).map(absolute));
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(SHELL.map(p=>new Request(absolute(p),{cache:'reload'})));await self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
 const req=e.request,u=new URL(req.url),scope=new URL(self.registration.scope);
 if(req.method!=='GET'||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname))return;
 if(req.mode==='navigate'&&(u.pathname===scope.pathname||u.pathname===new URL('index.html',scope).pathname)){
  e.respondWith((async()=>{const c=await caches.open(CACHE);try{const res=await fetch(req,{cache:'no-store'});if(res.ok){await c.put(absolute('./index.html'),res.clone());return res}return (await c.match(absolute('./index.html')))||res}catch{return (await c.match(absolute('./index.html')))||Response.error()}})());return;
 }
 if(assetURLs.has(u.href))e.respondWith((async()=>{const c=await caches.open(CACHE);return (await c.match(req))||fetch(req)})());
});
