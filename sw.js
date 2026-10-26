const CACHE='sukuma-preview-shell-v3';
const BASE='/civicpulse-preview';
const ASSETS=[
  BASE+'/',BASE+'/index.html',BASE+'/styles.css',BASE+'/tokens/tokens.css',
  BASE+'/casework.js',BASE+'/app.js',BASE+'/manifest.json',
  BASE+'/assets/sukuma-symbol-original.png'
];
self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim())
));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin===self.location.origin&&url.pathname.startsWith(BASE+'/')&&
    ['index.html','styles.css','casework.js','app.js','sw.js','manifest.json','tokens/tokens.css','assets/sukuma-symbol-original.png'].some(path=>url.pathname===BASE+'/'+path)){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
      return response;
    }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match(BASE+'/index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
    if(response.ok&&url.origin===self.location.origin){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(BASE+'/index.html'))));
});
