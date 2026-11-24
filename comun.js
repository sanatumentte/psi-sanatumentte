/* Lógica compartida · Sana tu Mentte (requiere tests-data.js antes) */
const WA='https://wa.me/message/CVCEFMEVO3MYM1?text=';
const FREQ=['Nunca o casi nunca','Algunas veces','Con frecuencia','Casi siempre'];
const TIMG={autoestima:'img/tests2/autoestima.jpg',relaciones:'img/tests2/relaciones.jpg',ansiedad:'img/tests2/ansiedad.jpg',animo:'img/tests2/animo.jpg',resiliencia:'img/tests2/resiliencia.jpg',crecimiento:'img/tests2/crecimiento.jpg'};
const AREAS={
 ans:{t:'Ansiedad y sobrepensamiento',img:'img/mente.jpg',test:'ansiedad',
  q:['Me cuesta detener los pensamientos, incluso cuando quiero descansar.','Me preocupo por situaciones que todavía no han ocurrido.','Siento tensión física: pecho apretado, respiración agitada o malestar estomacal.','Repaso una y otra vez conversaciones o decisiones.','La preocupación interfiere con mi sueño o mi concentración.'],
  work:['Identificar y evaluar los pensamientos que mantienen la preocupación','Técnicas de respiración y regulación fisiológica','Exposición gradual a lo que hoy evitas']},
 aut:{t:'Baja autoestima',img:'img/abrazo.jpg',test:'autoestima',
  q:['Siento que no soy suficiente.','Me comparo con otras personas y salgo perdiendo.','Me hablo con dureza cuando cometo un error.','Me cuesta aceptar halagos o reconocer mis logros.','Antepongo las necesidades de otros por miedo a no ser aceptado/a.'],
  work:['Reconocer y cuestionar el diálogo interno crítico','Construir una valoración personal más realista y compasiva','Reducir la dependencia de la aprobación externa']},
 her:{t:'Culpa y heridas del pasado',img:'img/fotos.jpg',test:'crecimiento',
  q:['Recuerdo situaciones del pasado que todavía me duelen.','Siento culpa por hechos que ya ocurrieron.','Algunas experiencias pasadas influyen en cómo reacciono hoy.','Me cuesta perdonarme o perdonar a otros.','Evito pensar o hablar de ciertos momentos de mi vida.'],
  work:['Procesar las experiencias difíciles en un espacio seguro','Diferenciar la responsabilidad real de la culpa excesiva','Resignificar la propia historia']},
 pro:{t:'Crisis de propósito',img:'img/montana.jpg',test:'animo',
  q:['Siento que mi vida no tiene una dirección clara.','Cumplo con mis responsabilidades, pero siento vacío.','Me pregunto con frecuencia para qué hago lo que hago.','Me cuesta tomar decisiones importantes sobre mi futuro.','Perdí interés en lo que antes me motivaba.'],
  work:['Clarificar valores personales','Definir metas coherentes con esos valores','Integrar la fe como fuente de sentido, si así lo deseas']},
 des:{t:'Desgaste emocional',img:'img/rodillas.jpg',test:'animo',
  q:['Me siento agotado/a emocionalmente, incluso después de descansar.','Me cuesta decir que no, aunque ya no tenga capacidad.','Siento que cargo con los problemas de los demás.','Me irrito con facilidad o lloro sin una razón clara.','Dejé de hacer actividades que antes disfrutaba.'],
  work:['Establecer límites sin culpa','Recuperar actividades de descanso y disfrute','Redistribuir la carga emocional']},
 rel:{t:'Conflictos relacionales',img:'img/pareja.jpg',test:'relaciones',
  q:['Tengo discusiones que se repiten con personas cercanas.','Me cuesta expresar lo que siento sin explotar o callar.','Temo que las personas que quiero se alejen.','Siento que doy más de lo que recibo en mis relaciones.','Me cuesta poner límites con mi pareja, familia o amistades.'],
  work:['Identificar patrones que se repiten en tus vínculos','Comunicación asertiva','Construir relaciones más seguras sin perder tu identidad']}
};
/* Preguntas exclusivas de la evaluación inicial (distintas a las del tamizaje de cada área) */
const FQ={
 ans:['Me siento nervioso/a o inquieto/a sin una razón clara.','Anticipo que las cosas van a salir mal.'],
 aut:['Dudo de mis capacidades, aunque otros confíen en mí.','Me siento menos valioso/a que las personas a mi alrededor.'],
 her:['Hay experiencias de mi pasado que siento sin resolver.','Me reprocho decisiones que tomé hace tiempo.'],
 pro:['Siento que estoy viviendo en piloto automático.','No tengo claro qué quiero para mi vida.'],
 des:['Siento que ya no tengo energía para nada.','Termino el día sin espacio ni tiempo para mí.'],
 rel:['Mis relaciones cercanas me generan más tensión que tranquilidad.','Siento que las personas importantes para mí no me entienden.']
};
Object.keys(FQ).forEach(k=>AREAS[k].fq=FQ[k]);

/* ----- Modal ----- */
document.body.insertAdjacentHTML('beforeend','<div class="modal" id="modal" role="dialog" aria-modal="true"><div class="mbox"><button class="mclose" id="mclose" aria-label="Cerrar">×</button><div class="mhead" id="mhead"><div><small id="msub"></small><h3 id="mtitle"></h3></div></div><div class="mbody" id="mbody"></div></div></div>');
const modal=document.getElementById('modal'),mbody=document.getElementById('mbody');
function openModal(img,sub,title){document.getElementById('mhead').style.backgroundImage=img?'url('+img+')':'';document.getElementById('msub').textContent=sub;document.getElementById('mtitle').textContent=title;modal.classList.add('open');document.body.style.overflow='hidden';modal.querySelector('.mbox').scrollTop=0}
function closeModal(){modal.classList.remove('open');document.body.style.overflow=''}
document.getElementById('mclose').onclick=closeModal;
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
function bar(p){setTimeout(()=>{const b=mbody.querySelector('.res-bar i');if(b)b.style.width=p+'%'},60)}
const note='<p class="res-note">Resultado orientativo. No constituye un diagnóstico ni reemplaza una evaluación profesional.</p>';

function runQuiz({questions,labels,vals,preamble,onDone}){
  let i=0;const ans=Array(questions.length).fill(null);
  function render(){
    const q=questions[i],pc=Math.round(i/questions.length*100);
    mbody.innerHTML='<div class="mprog"><span>Pregunta '+(i+1)+' de '+questions.length+'</span><span>'+pc+'%</span></div><div class="mbar"><i style="width:'+pc+'%"></i></div>'+(preamble?'<p class="mpre">'+preamble+'</p>':'')+'<div class="mq"></div><div class="mopts"></div><div id="sf"></div><div class="mnav"><button id="pv" '+(i?'':'disabled')+'>← Anterior</button></div>';
    mbody.querySelector('.mq').textContent=q.text;
    const box=mbody.querySelector('.mopts');
    labels.forEach((l,k)=>{const b=document.createElement('button');b.textContent=l;if(ans[i]===k)b.className='sel';
      b.onclick=()=>{ans[i]=k;box.querySelectorAll('button').forEach(x=>x.className='');b.className='sel';
        if(q.safety&&k>0){document.getElementById('sf').innerHTML='<div class="safety"><b>Gracias por tu sinceridad.</b> Si estás pensando en hacerte daño, busca ayuda ahora: Línea 106 o Línea 192, opción 4 (Colombia, gratuitas, 24 horas), o <a href="'+WA+'Necesito%20apoyo" target="_blank" rel="noopener" style="text-decoration:underline">escríbele a Camila</a>.</div><div style="margin-top:12px"><button class="btn" id="cont">Continuar</button></div>';document.getElementById('cont').onclick=next;return}
        setTimeout(next,220)};box.appendChild(b)});
    document.getElementById('pv').onclick=()=>{if(i>0){i--;render()}};
  }
  function next(){if(i<questions.length-1){i++;render()}else onDone(ans.map(k=>vals[k]))}
  render();
}

/* ----- Prueba corta por área ----- */
document.head.insertAdjacentHTML('beforeend','<style>.tile .done-b{position:absolute;top:14px;right:14px;z-index:3;display:none;align-items:center;gap:6px;background:#fff;color:var(--petroleo);font:700 12px Montserrat,system-ui,sans-serif;letter-spacing:.06em;padding:7px 13px;border-radius:99px;box-shadow:0 6px 16px rgba(0,0,0,.2)}.tile.done .done-b{display:inline-flex}.tile.done .go{border-bottom-color:var(--dorado);color:var(--dorado)}</style>');
function markDone(k){document.querySelectorAll('[data-area="'+k+'"]').forEach(t=>{if(!t.querySelector('.done-b'))t.insertAdjacentHTML('beforeend','<span class="done-b">✓ Resuelto</span>');t.classList.add('done');const g=t.querySelector('.go');if(g)g.textContent='✓ Resuelto · Repetir →'})}
function areaQuiz(k){
  const a=AREAS[k],t=TESTS.find(x=>x.id===a.test);
  openModal(null,'Cuestionario breve · 5 preguntas',a.t);
  runQuiz({questions:a.q.map(x=>({text:x})),labels:FREQ,vals:[0,1,2,3],preamble:'Responde pensando en las últimas dos semanas.',onDone:v=>{
    markDone(k);const s=v.reduce((x,y)=>x+y,0),p=Math.round(s/15*100);
    const lv=s<=4?['lv-green','Malestar bajo','Por ahora esta área no parece afectar de forma importante tu día a día.']:s<=9?['lv-gold','Malestar moderado','Esta área ya está interfiriendo en tu bienestar. Es un buen momento para trabajarla.']:['lv-red','Malestar alto','Esta área está afectando de forma importante tu bienestar. Te recomiendo iniciar un proceso terapéutico.'];
    mbody.innerHTML='<span class="res-lvl '+lv[0]+'">'+lv[1]+'</span><div class="res-t">Esta área se trabaja en terapia</div><div class="res-bar"><i></i></div><p class="res-p">'+lv[2]+'</p>'+(()=>{const u=s<=4?0:s<=9?1:2,U=URG[u];return '<div class="res-box rt-urg"><h4>Nivel de urgencia para agendar sesión</h4><div class="rt-meter">'+[0,1,2,3].map(k=>'<i'+(k<=u?' class="on"':'')+'></i>').join('')+'</div><div class="lab"><span>Baja</span><span>Muy alta</span></div><div class="now">'+U.n+' · '+U.t+'</div><p class="res-p" style="margin:0">'+U.d+'</p></div>'})()+'<div class="res-box"><h4>Qué trabajaríamos</h4><ul>'+a.work.map(w=>'<li>'+w+'</li>').join('')+'</ul></div>'+(t?'<div class="res-box"><h4>Siguiente paso: prueba estandarizada</h4><p class="res-p" style="margin:0">Para una medición más precisa, continúa con <b>'+t.title+'</b> ('+t.items+' preguntas, '+t.time+' min).</p></div>':'')+'<div class="res-cta">'+(t?'<button class="btn" id="deep">Continuar con la prueba →</button>':'')+'<a class="btn line" href="'+WA+encodeURIComponent('Hola Camila, respondí el cuestionario de '+a.t+' en tu página y quisiera agendar una sesión.')+'" target="_blank" rel="noopener">Agendar sesión</a></div>'+note;
    bar(p);
    if(t)document.getElementById('deep').onclick=()=>fullTest(t.id);
  }});
}

/* ----- Evaluación inicial: ¿por dónde empezar? ----- */
function finder(){
  const keys=Object.keys(AREAS);
  openModal(null,'Evaluación inicial · 3 minutos','¿Por dónde empezar?');
  /* Va directo a las preguntas: la explicación ya está en la ventana emergente */
  (()=>{
    const qs=[];keys.forEach(k=>qs.push({text:AREAS[k].fq[0],k}));keys.forEach(k=>qs.push({text:AREAS[k].fq[1],k}));
    runQuiz({questions:qs,labels:FREQ,vals:[0,1,2,3],preamble:'Responde pensando en las últimas dos semanas.',onDone:v=>{
      const s={};keys.forEach(k=>s[k]=0);qs.forEach((q,i)=>s[q.k]+=v[i]);
      const ord=[...keys].sort((a,b)=>s[b]-s[a]),top=ord[0],tot=v.reduce((a,b)=>a+b,0),t=TESTS.find(x=>x.id===AREAS[top].test);
      const low=tot<=4;
      mbody.innerHTML='<span class="res-lvl '+(low?'lv-green':'lv-gold')+'">Tu resultado</span><div class="res-t">'+(low?'No se observa malestar significativo':'Área prioritaria: '+AREAS[top].t)+'</div><div class="frows">'+ord.map((k,i)=>'<div class="frow'+(i===0&&!low?' top':'')+'"><span>'+AREAS[k].t+'</span><div class="tr"><i style="width:'+Math.round(s[k]/6*100)+'%"></i></div><b>'+Math.round(s[k]/6*100)+'%</b></div>').join('')+'</div>'+(low?'<p class="res-p">Si aun así algo te inquieta, puedes realizar cualquiera de las pruebas estandarizadas.</p>':'<div class="res-box"><h4>Siguiente paso</h4><p class="res-p" style="margin:0">Continúa con <b>'+t.title+'</b> ('+t.items+' preguntas, '+t.time+' min) para medir esta área con mayor precisión.</p></div>')+'<div class="res-cta">'+(low?'<button class="btn" id="all">Ver pruebas disponibles</button>':'<button class="btn" id="go">Continuar con la prueba →</button>')+'<a class="btn line" href="'+WA+encodeURIComponent('Hola Camila, hice la evaluación inicial en tu página'+(low?'.':' y mi área prioritaria es '+AREAS[top].t+'.'))+'" target="_blank" rel="noopener">Agendar sesión</a></div>'+note;
      const g=document.getElementById('go');if(g)g.onclick=()=>fullTest(t.id);
      const al=document.getElementById('all');if(al)al.onclick=testPicker;
    }});
  })();
}

/* ----- Pruebas estandarizadas ----- */
function testPicker(){
  openModal(null,'Pruebas estandarizadas','Elige una prueba');
  /* cada prueba con su imagen y en qué consiste (como en «Lo que podemos trabajar juntos») */
  const KW={autoestima:'Cómo te percibes · Aceptación · Autocrítica · Valor personal',relaciones:'Miedo al abandono · Rechazo · Seguridad en tus vínculos',ansiedad:'Preocupación · Nerviosismo · Tensión · Irritabilidad',animo:'Interés · Tristeza · Sueño · Energía · Concentración',resiliencia:'Adaptarte · Sostenerte · Recuperarte frente a la adversidad',crecimiento:'Relaciones · Fortaleza · Visión de la vida · Espiritualidad'};
  mbody.innerHTML='<p class="res-p">Instrumentos psicológicos validados, adaptados para responder en línea. Elige la que más se parezca a lo que estás viviendo.</p><div class="pick pick-img">'+TESTS.map(t=>'<button data-t="'+t.id+'" style="background-image:url(img/tests/'+t.id+'.jpg)"><span class="pk-tx"><small class="pk-sub">'+t.subtitle+'</small><b>'+t.title+'</b><span class="pk-kw">'+(KW[t.id]||'')+'</span><small class="pk-meta">'+t.items+' preguntas · '+t.time+' min · <u>Hacer la prueba →</u></small></span></button>').join('')+'</div>';
  mbody.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>fullTest(b.dataset.t));
}
/* ----- Ventana «Elige una prueba»: tarjetas con imagen ----- */
document.head.insertAdjacentHTML('beforeend','<style>'
+'.pick.pick-img{gap:12px}.pick.pick-img button{position:relative;min-height:190px;padding:0;border:0;border-radius:20px;overflow:hidden;display:flex;align-items:flex-end;background:#165a6c center/cover no-repeat;box-shadow:0 10px 24px rgba(22,90,108,.14);transition:transform .3s,box-shadow .3s}'
+'.pick.pick-img button::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(22,90,108,0) 15%,rgba(22,90,108,.55) 50%,rgba(22,90,108,.95))}'
+'.pick.pick-img button:hover{transform:translateY(-3px);box-shadow:0 16px 30px rgba(22,90,108,.24)}.pick.pick-img button:focus-visible{outline:3px solid #dabb81;outline-offset:3px}'
+'.pick-img .pk-tx{position:relative;display:block;padding:16px 18px;color:#fff;text-align:left}'
+'.pick-img .pk-sub{display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#165a6c;background:#f5e8da;padding:4px 10px;border-radius:99px;margin-bottom:8px}'
+'.pick-img b{color:#fff;font-size:22px;line-height:1.15}.pick-img .pk-kw{display:block;font-size:12.5px;line-height:1.45;opacity:.95;margin-top:5px}'
+'.pick-img .pk-meta{display:block;font-size:12px;color:#dfeccd;margin-top:8px}.pick-img .pk-meta u{text-decoration:none;font-weight:600;border-bottom:1px solid rgba(255,255,255,.6)}'
+'</style>');
/* ----- Resultado detallado de las pruebas (orientativo, sin diagnóstico) ----- */
document.head.insertAdjacentHTML('beforeend','<style>'
+'.rt-info dl{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:6px 0 0;font-size:14px;color:var(--suave)}.rt-info dt{font-weight:700;color:var(--petroleo)}.rt-info dd{margin:0}'
+'.rt-score{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;font-size:14px;color:var(--suave);margin-top:-4px}.rt-score b{font-family:"Playfair Display",serif;font-weight:400;font-size:30px;color:var(--petroleo)}'
+'.rt-dims{display:grid;gap:12px;margin-top:10px}.rt-dim{display:grid;grid-template-columns:1fr auto;gap:4px 12px;font-size:14px;align-items:center}.rt-dim span{color:var(--petroleo);font-weight:600}.rt-dim em{font-style:normal;font-size:12px;font-weight:700;letter-spacing:.04em;padding:3px 10px;border-radius:99px}'
+'.rt-dim .tr{grid-column:1/-1;height:9px;background:var(--beige);border-radius:9px;overflow:hidden}.rt-dim .tr i{display:block;height:100%;border-radius:9px}'
+'.rt-a{background:#e2f0e6;color:#2f6b45}.rt-m{background:#f7ecd6;color:#7a5f1e}.rt-r{background:#f6e0da;color:#8a3a2a}'
+'.rt-dim .tr i.rt-a{background:#81a9a7}.rt-dim .tr i.rt-m{background:#dabb81}.rt-dim .tr i.rt-r{background:#c9987c}'
+'.rt-list{list-style:none;display:grid;gap:8px;margin-top:8px}.rt-list li{margin:0!important;padding:10px 14px!important;background:var(--fondo);border-radius:12px;font-size:14px;color:var(--tinta)}.rt-list li small{display:block;font-size:12px;color:var(--suave);font-weight:600;margin-top:2px}'
+'.rt-urg{border:2px solid var(--beige)}.rt-meter{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:12px 0 8px}.rt-meter i{height:10px;border-radius:9px;background:var(--beige)}'
+'.rt-meter i.on:nth-child(1){background:#81a9a7}.rt-meter i.on:nth-child(2){background:#dabb81}.rt-meter i.on:nth-child(3){background:#c9987c}.rt-meter i.on:nth-child(4){background:#a8694a}'
+'.rt-urg .lab{display:flex;justify-content:space-between;font-size:11.5px;color:var(--suave);font-weight:600}.rt-urg .now{font-family:"Playfair Display",serif;font-size:22px;color:var(--petroleo);margin:6px 0 2px}'
+'@media(max-width:560px){.rt-info dl{grid-template-columns:1fr;gap:2px}.rt-info dd{margin-bottom:8px}}'
+'</style>');
const URG=[
 {n:'Baja',t:'Preventiva',d:'No se observa una necesidad urgente. Puedes agendar cuando lo desees, como un espacio para cuidarte y seguir creciendo.'},
 {n:'Media',t:'Recomendada',d:'Te recomiendo agendar una sesión en las próximas 2 a 4 semanas para trabajar lo que aparece en tus respuestas.'},
 {n:'Alta',t:'Prioritaria',d:'Te recomiendo agendar una sesión en los próximos 7 días. Lo que estás viviendo merece acompañamiento.'},
 {n:'Muy alta',t:'Lo antes posible',d:'Te recomiendo buscar acompañamiento profesional en los próximos días. No tienes que atravesar esto solo/a.'}
];
function fullTest(id){
  const t=TESTS.find(x=>x.id===id);openModal(null,t.subtitle+' · '+t.items+' preguntas',t.title);
  runQuiz({questions:t.questions,labels:t.scaleLabels,vals:t.scaleLabels.map((_,k)=>k+t.scaleMin),preamble:t.preamble,onDone:v=>{
    const s=t.score(v),r=t.interpret(s),cls={green:'lv-green',gold:'lv-gold',orange:'lv-gold',red:'lv-red'}[r.lvl]||'lv-gold';
    document.querySelectorAll('[data-test="'+id+'"]').forEach(c=>c.classList.add('ok'));
    const mn=t.scaleMin,mx=t.scaleMin+t.scaleLabels.length-1;
    /* dificultad de cada respuesta de 0 a 1 (1 = lo que más pesa) */
    const dif=i=>{const d=t.dims?t.dims.find(x=>x.items.includes(i)):null,n=(v[i]-mn)/(mx-mn);return d&&d.dir==='recurso'?1-n:n};
    const dims=(t.dims||[]).map(d=>{const n=d.items.reduce((a,i)=>a+(v[i]-mn)/(mx-mn),0)/d.items.length,df=d.dir==='recurso'?1-n:n;
      const k=df<.34?'a':df<.67?'m':'r';
      const w=d.dir==='recurso'?{a:'Fortalecido',m:'En desarrollo',r:'Por fortalecer'}[k]:{a:'Baja',m:'Moderada',r:'Alta'}[k];
      return {n:d.n,p:Math.round(n*100),df,k,w,dir:d.dir}});
    const byDif=[...dims].sort((a,b)=>b.df-a.df),peso=byDif[0],rec=byDif[byDif.length-1];
    let sum='';
    if(dims.length){
      if(peso.df<.34)sum='En tus respuestas no aparece un área que esté pesando de forma importante. Lo que más se mueve, aunque en un nivel bajo, es <b>'+peso.n.toLowerCase()+'</b>.';
      else sum='Lo que más está pesando en tus respuestas es <b>'+peso.n.toLowerCase()+'</b>'+(byDif[1]&&byDif[1].df>=.5?', seguido de <b>'+byDif[1].n.toLowerCase()+'</b>':'')+'.';
      if(rec!==peso&&rec.df<.5)sum+=rec.dir==='recurso'?' Tu mayor recurso aparece en <b>'+rec.n.toLowerCase()+'</b>: es una base valiosa para trabajar lo demás.':' Lo que menos te está afectando es <b>'+rec.n.toLowerCase()+'</b>.';
    }
    const idx=t.questions.map((_,i)=>i).filter(i=>i!==t.safetyItem);
    const altos=idx.filter(i=>dif(i)>=.66).sort((a,b)=>dif(b)-dif(a)).slice(0,4);
    const fuertes=idx.filter(i=>dif(i)<=.2).slice(0,3);
    const item=i=>'<li>'+t.questions[i].text+'<small>Respondiste: '+t.scaleLabels[v[i]-mn]+'</small></li>';
    const safe=t.safetyItem!=null&&v[t.safetyItem]>mn;
    let u={green:0,gold:1,orange:2,red:3}[r.lvl];if(u==null)u=1;if(t.cap!=null)u=Math.min(u,t.cap);
    const U=URG[u];
    const urgBox=safe?'<div class="res-box rt-urg" style="border-color:#c9987c"><h4>Nivel de urgencia para agendar sesión</h4><div class="rt-meter">'+'<i class="on"></i>'.repeat(4)+'</div><div class="now">Inmediata: busca apoyo hoy</div><p class="res-p" style="margin:0 0 10px">Una de tus respuestas indica pensamientos de hacerte daño o de que sería mejor no estar. Eso merece atención hoy mismo, sin esperar a una cita.</p><div class="safety" style="margin-top:0">Línea 106 o Línea 192, opción 4 (Colombia, gratuitas, 24 horas). Si estás en peligro, llama al 123 o acude a urgencias. También puedes <a href="'+WA+encodeURIComponent('Hola Camila, hice la prueba de estado de ánimo en tu página y necesito apoyo.')+'" target="_blank" rel="noopener" style="text-decoration:underline">escribirle a Camila</a>.</div></div>'
      :'<div class="res-box rt-urg"><h4>Nivel de urgencia para agendar sesión</h4><div class="rt-meter">'+[0,1,2,3].map(k=>'<i'+(k<=u?' class="on"':'')+'></i>').join('')+'</div><div class="lab"><span>Baja</span><span>Muy alta</span></div><div class="now">'+U.n+' · '+U.t+'</div><p class="res-p" style="margin:0">'+U.d+'</p></div>';
    mbody.innerHTML='<span class="res-lvl '+cls+'">Tu resultado</span><div class="res-t">'+r.label+'</div>'
      +(t.max?'<div class="rt-score"><b>'+s+'</b><span>de '+t.max+' puntos</span></div>':'')
      +'<div class="res-bar"><i></i></div><p class="res-p">'+r.msg+'</p>'
      +urgBox
      +(dims.length?'<div class="res-box"><h4>Análisis de tus respuestas</h4><p class="res-p" style="margin:0 0 6px">'+sum+'</p><div class="rt-dims">'+dims.map(d=>'<div class="rt-dim"><span>'+d.n+'</span><em class="rt-'+d.k+'">'+d.w+'</em><div class="tr"><i class="rt-'+d.k+'" style="width:'+Math.max(4,d.p)+'%"></i></div></div>').join('')+'</div></div>':'')
      +(altos.length?'<div class="res-box"><h4>Lo que más se destaca</h4><p class="res-p" style="margin:0">Estas son las respuestas que más pesan en tu resultado. Pueden ser un buen punto de partida para conversar en sesión.</p><ul class="rt-list">'+altos.map(item).join('')+'</ul></div>':'')
      +(fuertes.length?'<div class="res-box"><h4>Tus recursos</h4><p class="res-p" style="margin:0">Aspectos que hoy aparecen como fortalezas en tus respuestas.</p><ul class="rt-list">'+fuertes.map(item).join('')+'</ul></div>':'')
      +(t.para?'<div class="res-box rt-info"><h4>Sobre esta prueba</h4><dl><dt>Para qué sirve</dt><dd>'+t.para+'</dd><dt>Qué mide</dt><dd>'+t.mide+'</dd><dt>Cómo se lee</dt><dd>'+t.rango+'</dd><dt>Instrumento</dt><dd>'+t.origen+'</dd></dl></div>':'')
      +'<div class="res-cta"><a class="btn" href="'+WA+encodeURIComponent('Hola Camila, hice la prueba '+t.title+' en tu página y quisiera agendar una sesión.')+'" target="_blank" rel="noopener">Agendar sesión →</a><button class="btn line" id="more">Hacer otra prueba</button></div>'
      +'<p class="res-note">Este resultado es orientativo y no es un diagnóstico. Solo una evaluación profesional puede darte una comprensión completa de lo que estás viviendo.</p>';
    bar(Math.max(4,Math.min(100,r.pct)));
    document.getElementById('more').onclick=testPicker;
  }});
}

/* ----- Enlaces, menú y animaciones ----- */
document.querySelectorAll('[data-area]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();areaQuiz(b.dataset.area)}));
document.querySelectorAll('[data-finder]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();menu.classList.remove('open');finder()}));
document.querySelectorAll('[data-picker]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();menu.classList.remove('open');testPicker()}));
document.querySelectorAll('[data-test]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();fullTest(b.dataset.test)}));
const menu=document.getElementById('menu');
document.getElementById('burger').onclick=()=>menu.classList.toggle('open');
menu.querySelectorAll('li>button').forEach(b=>b.onclick=e=>{e.stopPropagation();const li=b.parentNode,was=li.classList.contains('op');menu.querySelectorAll('li.op').forEach(x=>x.classList.remove('op'));if(!was)li.classList.add('op')});
document.addEventListener('click',e=>{if(!menu.contains(e.target))menu.querySelectorAll('li.op').forEach(x=>x.classList.remove('op'))});
menu.addEventListener('scroll',()=>menu.querySelectorAll('li.op').forEach(x=>x.classList.remove('op')),{passive:true});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menu.querySelectorAll('li.op').forEach(x=>x.classList.remove('op'))}));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.06});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*60+'ms';io.observe(el)});
if(location.hash==='#evaluacion')setTimeout(finder,300);
