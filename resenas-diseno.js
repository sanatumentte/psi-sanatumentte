/* Reseñas: conexión con la hoja de Google y diseño automático
   (frase destacada en azul, texto completo en gris y etiquetas). */
const RESENAS_URL='https://script.google.com/macros/s/AKfycbx_969dNQrc8uxsPfmNgO_hBtnHn74nhbDbWlayeFHXmc42qI-LOVs-QozQnwxaazwQZA/exec';

/* Trae las reseñas que llegaron por el formulario (las más nuevas primero) */
function cargarResenas(){
  return fetch(RESENAS_URL).then(r=>r.json()).then(a=>Array.isArray(a)?a:[]).catch(()=>[]);
}

/* Elige la frase que más resume la experiencia para resaltarla */
const RS_CLAVES=/gracias|agradec|aprend|me sent|sent[ií] |ayud|luz|esperanza|paz|san[aée]|cambi|recomiend|acompa[ñn]|escuchad|segur|tranquil|confian|herramient|Dios|bendic|feliz|mejor|fuerza|valor|crec|libertad|alivi|transform/i;
const RS_SALUDO=/^(hola|buen[oa]s|cami(la)?|doc(tora)?|psic[oó]loga|querida)\b[\s,!.:]*/i;
function rsFrases(t){
  const fr=t.replace(/\s+/g,' ').split(/(?<=[.!?…])\s+/).map(x=>x.trim()).filter(Boolean),out=[];
  fr.forEach(f=>{out.push(f);if(f.length>140)f.split(/,\s*/).forEach(c=>{if(c.trim().length>=25)out.push(c.trim())})});
  return out;
}
function rsRecortar(f){
  f=f.replace(RS_SALUDO,'').replace(/^[,;:\s]+/,'').replace(/^(pero|y|que|porque|ya que|adem[aá]s|tambi[eé]n)\s+/i,'').trim();
  f=f.replace(/[.,;:]+$/,'');
  if(f.length>125){
    const c=f.lastIndexOf(',',115);
    f=c>45?f.slice(0,c):f.slice(0,f.lastIndexOf(' ',115))+'…';
  }
  return f.charAt(0).toUpperCase()+f.slice(1);
}
function rsDestacar(t){
  const fr=rsFrases(t);
  let mejor=fr[0]||t,pts=-1e9;
  fr.forEach((f,i)=>{
    const lim=f.replace(RS_SALUDO,'').trim(),L=lim.length;
    if(L<12)return;
    let p=0;
    if(RS_CLAVES.test(lim))p+=6;
    if(L>=25&&L<=120)p+=4;else if(L<=170)p+=1;else p-=3;
    if(/^(gracias|me |aprend|fue |ha sido|siento|hoy )/i.test(lim))p+=2;
    p-=i*.3;
    if(p>pts){pts=p;mejor=f}
  });
  return rsRecortar(mejor);
}

/* Etiquetas según los temas que menciona la reseña */
const RS_TEMAS=[
  [/ansiedad|ansios|p[aá]nico|nervios/i,'Ansiedad'],
  [/estr[eé]s/i,'Estrés'],
  [/\bDios\b|\bfe\b|oraci|bendic|biblia|esp[ií]ritu/i,'Fe'],
  [/virtual|online|en l[ií]nea|videollamada|distancia/i,'Terapia online'],
  [/pareja|relaci[oó]n|novi[oa]|matrimonio|esposo|esposa/i,'Relaciones'],
  [/duelo|p[eé]rdida|perd[ií] a|falleci/i,'Duelo'],
  [/autoestima|quererme|amor propio|valorarme|valer/i,'Autoestima'],
  [/depres|triste|oscur|vac[ií]o|desesperanza/i,'Ánimo'],
  [/famili|mam[aá]|pap[aá]|hij[oa]s?\b/i,'Familia'],
  [/herida|trauma|sanar|sanaci/i,'Sanar heridas']
];
function rsEtiquetas(t){
  const e=RS_TEMAS.filter(x=>x[0].test(t)).map(x=>x[1]).slice(0,2);
  return e.length?e:['Proceso terapéutico'];
}

/* Fecha legible: "noviembre 2026" */
const RS_MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function rsFecha(f){
  f=String(f||'').trim();if(!f)return '';
  let m=f.match(/^(\d{4})-(\d{1,2})/);
  if(m)return RS_MESES[+m[2]-1]?RS_MESES[+m[2]-1]+' '+m[1]:f;
  const d=new Date(f);
  return isNaN(d)?'':RS_MESES[d.getMonth()]+' '+d.getFullYear();
}

/* Arma la reseña con el mismo diseño de las tarjetas de la página */
function disenoResena(r){
  const texto=String(r.texto||'').trim();
  const h=rsDestacar(texto);
  const p=texto.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const soloFrase=p.length===1&&texto.length<=130&&rsRecortar(p[0])===h;
  return {h:h,p:soloFrase?[]:p,tags:rsEtiquetas(texto),nombre:r.nombre||'Paciente',fecha:rsFecha(r.fecha),estrellas:Math.max(1,Math.min(5,Number(r.estrellas)||5))};
}

/* Crea la tarjeta (usa las clases .rvw de la página) */
function tarjetaResena(s){
  const d=document.createElement('article');d.className='shot rvw';
  d.innerHTML='<div class="rvw-q">“</div><div class="rvw-st"></div><h3></h3><div class="rvw-body"></div><button class="rvw-more" type="button">Leer reseña completa</button><div class="rvw-ft"><span class="rvw-av">♡</span><div><b></b><small></small></div><div class="rvw-tags"></div></div>';
  const st=d.querySelector('.rvw-st');st.textContent='★'.repeat(s.estrellas||5);st.setAttribute('aria-label',(s.estrellas||5)+' de 5 estrellas');
  d.querySelector('h3').textContent='«'+s.h+'»';
  const b=d.querySelector('.rvw-body');(s.p||[]).forEach(x=>{const q=document.createElement('p');q.textContent=x;b.appendChild(q)});
  if(!(s.p||[]).length)b.remove();
  d.querySelector('.rvw-ft b').textContent=s.nombre||'Paciente';
  d.querySelector('.rvw-ft small').textContent=s.sub||('Reseña'+(s.fecha?' · '+s.fecha:''));
  const t=d.querySelector('.rvw-tags');(s.tags||[]).forEach(x=>{const e=document.createElement('em');e.textContent=x;t.appendChild(e)});
  const m=d.querySelector('.rvw-more');
  if(!(s.p||[]).length)m.remove();
  else m.onclick=()=>{d.classList.toggle('open');m.textContent=d.classList.contains('open')?'Ver menos':'Leer reseña completa'};
  /* llamar después de ponerla en la página: quita "Leer completa" si el texto es corto */
  d.ajustar=()=>{if(m.isConnected&&b.isConnected&&b.scrollHeight<=b.clientHeight+4)m.remove()};
  return d;
}
