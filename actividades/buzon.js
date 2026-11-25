/* buzon.js — Sana tu Mentte (2026-11-25). Lo carga sesion-segura en cada recurso compartido.
   Lo que se escribe (en sesión o en el celular) se guarda CIFRADO en el buzón a los pocos segundos.
   Al abrir el mismo enlace en otro equipo se baja lo más reciente. La app de Camila lo lee y lo pasa al caso sola.
   La llave sale del token del enlace: el buzón (Google) solo ve texto cifrado. */
(function(){ function iniciar(){
  var URL_BUZON = 'https://script.google.com/macros/s/AKfycbxSe9W1iauLBNlA7BZIOuLlm8vrZOjEmAVPY16sx1YMiu_RtFT4UVVLVzufufBURMFE/exec';
  if(/__BUZON__/.test(URL_BUZON) || window.__buzon) return; window.__buzon = 1;
  if(/regalo|venta/i.test(location.pathname)) return;               // recursos de venta: nunca salen del dispositivo
  var H = decodeURIComponent((location.hash||'').slice(1));
  if(/^vista/i.test(H)) return;                                      // vista previa: solo lectura
  var tok = ''; try{ tok = (typeof TOKEN!=='undefined' && TOKEN) || ''; }catch(e){}
  if(!tok){ var m = H.match(/^([A-Za-z0-9]{4,16})\./); if(m) tok = m[1]; }
  if(!tok || !window.crypto || !crypto.subtle) return;
  var te = new TextEncoder(), td = new TextDecoder();
  var LT = 'sana_buzon_t:'+tok, LC = 'sana_buzon_cambio:'+tok, ls = window.localStorage;
  var b64 = function(u){ var s=''; for(var i=0;i<u.length;i+=0x8000) s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000)); return btoa(s); };
  var unb64 = function(s){ return Uint8Array.from(atob(s), function(c){ return c.charCodeAt(0); }); };
  var hex = function(b){ return Array.from(new Uint8Array(b)).map(function(x){ return ('0'+x.toString(16)).slice(-2); }).join(''); };
  var ID, LLAVE;
  var listo = crypto.subtle.digest('SHA-256', te.encode('sana-buzon:'+tok)).then(function(h){ ID = hex(h).slice(0,32);
    return crypto.subtle.digest('SHA-256', te.encode('sana-llave:'+tok)); }).then(function(k){
    return crypto.subtle.importKey('raw', k, 'AES-GCM', false, ['encrypt','decrypt']); }).then(function(k){ LLAVE = k; });
  function cifrar(obj){ var iv = crypto.getRandomValues(new Uint8Array(12));
    return crypto.subtle.encrypt({name:'AES-GCM', iv:iv}, LLAVE, te.encode(JSON.stringify(obj))).then(function(ct){ return b64(iv)+'.'+b64(new Uint8Array(ct)); }); }
  function descifrar(s){ var p = String(s).split('.');
    return crypto.subtle.decrypt({name:'AES-GCM', iv:unb64(p[0])}, LLAVE, unb64(p[1])).then(function(pt){ return JSON.parse(td.decode(pt)); }); }
  /* Claves de este enlace en este equipo (sana_*:<token>, sin respaldos) */
  function misClaves(){ var o={}; for(var i=0;i<ls.length;i++){ var k=ls.key(i); if(/^sana_/.test(k)&&k.slice(-tok.length-1)===':'+tok&&!/^sana_buzon_/.test(k)) o[k]=ls.getItem(k); } return o; }

  /* ---- Subir (unos segundos después de cada cambio, y al salir) ---- */
  var tSub=null, subiendo=false;
  function subir(salida){
    return listo.then(function(){
      var t = +ls.getItem(LC) || Date.now(), msg = '';
      try{ if(typeof mensajeSana==='function') msg = mensajeSana(); }catch(e){}
      return Promise.all([cifrar({t:t, m:msg}), cifrar({t:t, k:misClaves()})]).then(function(c){
        var body = JSON.stringify({id:ID, t:t, app:'SBA1.'+ID+'.'+t+'.'+c[0], eq:'SBD1.'+c[1]});
        return fetch(URL_BUZON, {method:'POST', mode:'no-cors', keepalive: !!salida && body.length<60000, headers:{'Content-Type':'text/plain'}, body:body})
          .then(function(){ ls.setItem(LT, String(t)); avisar('☁️ Guardado'); });
      });
    }).catch(function(){ avisar('⚠️ Sin conexión: se guarda al volver'); });
  }
  window.__buzonCambio = function(){ ls.setItem(LC, String(Date.now())); clearTimeout(tSub); tSub = setTimeout(subir, 4000); };
  document.addEventListener('visibilitychange', function(){ if(document.visibilityState==='hidden' && (+ls.getItem(LC)||0) > (+ls.getItem(LT)||0)) subir(true); });

  /* ---- Bajar al abrir: si en otro equipo hay algo más nuevo, se trae y se recarga una vez ---- */
  listo.then(function(){ return fetch(URL_BUZON+'?id='+ID).then(function(r){ return r.json(); }); }).then(function(r){
    if(!r || !r.t || !r.eq) { if((+ls.getItem(LC)||0) > (+ls.getItem(LT)||0)) subir(); return; }
    var local = Math.max(+ls.getItem(LC)||0, +ls.getItem(LT)||0);
    if(r.t <= local){ if((+ls.getItem(LC)||0) > r.t) subir(); return; }
    return descifrar(String(r.eq).replace(/^SBD1\./,'')).then(function(o){
      var marca='buzonRecarga:'+tok+':'+r.t; if(sessionStorage.getItem(marca)) return;
      window.__buzonRecargando = true;
      Object.keys(o.k||{}).forEach(function(k){ var prev=ls.getItem(k);
        if(prev&&prev!==o.k[k]){ try{ var h=JSON.parse(ls.getItem(k+':hist')||'[]'); h.unshift({g:Date.now(),s:prev}); ls.setItem(k+':hist', JSON.stringify(h.slice(0,15))); }catch(e){} }
        ls.setItem(k, o.k[k]); });
      ls.setItem(LT, String(r.t)); ls.setItem(LC, String(r.t)); sessionStorage.setItem(marca,'1');
      location.reload();
    });
  }).catch(function(){});

  /* Aviso discreto abajo a la izquierda */
  var av=null, tav=null;
  function avisar(t){ if(!document.body) return; if(!av){ av=document.createElement('div'); av.style.cssText='position:fixed;left:12px;bottom:14px;z-index:9998;background:rgba(31,61,69,.85);color:#fff;font:600 .78rem Nunito,system-ui,sans-serif;padding:6px 11px;border-radius:999px;transition:opacity .4s;pointer-events:none'; document.body.appendChild(av); }
    av.textContent=t; av.style.opacity='1'; clearTimeout(tav); tav=setTimeout(function(){ av.style.opacity='0'; },2200); }
}
  /* Corre cuando el recurso ya cargó (necesita su TOKEN y su mensajeSana) */
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(iniciar,50); }); else setTimeout(iniciar,50);
})();
