const CACHE='sukuma-preview-shell-v3';
const BASE='/civicpulse-preview';
const ASSETS=[BASE+'/',BASE+'/index.html',BASE+'/styles.css',BASE+'/app.js',BASE+'/manifest.json',BASE+'/assets/sukuma-app-icon.png',BASE+'/assets/sukuma-horizontal-dark.png',BASE+'/assets/sukuma-horizontal-light.png',BASE+'/sw.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin===self.location.origin && [BASE+'/app.js',BASE+'/index.html',BASE+'/styles.css',BASE+'/sw.js',BASE+'/assets/sukuma-app-icon.png'].includes(url.pathname)){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return res;}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{if(res.ok&&url.origin===self.location.origin){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return res}).catch(()=>caches.match(BASE+'/index.html'))));
});
