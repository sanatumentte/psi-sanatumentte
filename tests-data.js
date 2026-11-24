/* Datos de los tests gratuitos (copiados de index.html) */
const TESTS = [

  /* TEST 1: AUTOESTIMA — Rosenberg */
  {
    id: 'autoestima', title: 'Autoestima',
    subtitle: 'Escala de Rosenberg', icon: '🌱',
    time: '5', items: 10,
    desc: 'Evalúa la relación que tienes contigo mismo/a y tu sentido de valor personal.',
    scaleLabels: ['Muy en desacuerdo', 'En desacuerdo', 'De acuerdo', 'Muy de acuerdo'],
    scaleMin: 0,
    questions: [
      { text: 'En general, estoy satisfecho/a conmigo mismo/a.',                        reverse: false },
      { text: 'A veces pienso que no soy bueno/a en absoluto.',                          reverse: true  },
      { text: 'Creo que tengo varias cualidades positivas.',                              reverse: false },
      { text: 'Puedo hacer las cosas tan bien como la mayoría de las personas.',          reverse: false },
      { text: 'Siento que no tengo mucho de lo que estar orgulloso/a.',                   reverse: true  },
      { text: 'A veces me siento inútil.',                                                reverse: true  },
      { text: 'Siento que soy una persona de valor, al menos igual que las demás.',       reverse: false },
      { text: 'Desearía tenerme más respeto a mí mismo/a.',                               reverse: true  },
      { text: 'En general, tiendo a creer que soy un fracasado/a.',                       reverse: true  },
      { text: 'Tengo una actitud positiva hacia mí mismo/a.',                             reverse: false },
    ],
    score(r){ return r.reduce((s,v,i) => s + (this.questions[i].reverse ? 3-v : v), 0); },
    interpret(s){
      const p = Math.round(s/30*100);
      if(s<=15) return {lvl:'red',   label:'Autoestima baja',    pct:p, msg:'Tu puntuación sugiere una autoestima baja. Esto puede manifestarse como autocrítica intensa, dificultad para reconocer tus logros o sentirte menos valioso/a que los demás. La terapia puede ayudarte a cambiar esa relación contigo mismo/a.', cta:true};
      if(s<=25) return {lvl:'gold',  label:'Autoestima normal',  pct:p, msg:'Tu autoestima está en un rango normal. Hay aspectos que puedes fortalecer — momentos de autocrítica o comparación con otros que la terapia puede ayudarte a explorar.', cta:false};
      return           {lvl:'green', label:'Autoestima elevada', pct:p, msg:'Tienes una buena relación contigo mismo/a. Sigue cultivando esa base de autocompasión y valor propio.', cta:false};
    }
  },

  /* TEST 2: ANSIEDAD EN RELACIONES — ECR-R adaptado */
  {
    id: 'relaciones', title: 'Ansiedad relacional',
    subtitle: 'ECR-R Adaptado', icon: '🤝',
    time: '6', items: 12,
    desc: 'Explora cuánta ansiedad experimentas en tus vínculos emocionales cercanos.',
    scaleLabels: ['Nada de acuerdo', 'Poco de acuerdo', 'Neutral', 'Bastante de acuerdo', 'Totalmente de acuerdo'],
    scaleMin: 1,
    questions: [
      { text: 'Me preocupa que las personas cercanas no se preocupen por mí tanto como yo por ellas.' },
      { text: 'Me preocupa ser abandonado/a.' },
      { text: 'Me preocupa no ser lo suficientemente valioso/a para las personas que quiero.' },
      { text: 'Necesito mucha reaseguración de que soy amado/a.' },
      { text: 'Me preocupa que los demás no me valoren tanto como yo los valoro a ellos.' },
      { text: 'Me preocupa que las personas cercanas dejen de quererme.' },
      { text: 'Cuando alguien importante no está disponible, me angustio mucho.' },
      { text: 'Me altero cuando pienso que alguien podría rechazarme.' },
      { text: 'Me frustra cuando las personas que quiero no están disponibles cuando las necesito.' },
      { text: 'Me preocupa mucho la posibilidad de perder a las personas que amo.' },
      { text: 'El miedo a ser rechazado/a afecta mis decisiones en las relaciones.' },
      { text: 'Necesito saber que mis relaciones son estables y seguras.' },
    ],
    score(r){ return r.reduce((a,b) => a+b, 0); },
    interpret(s){
      const p = Math.round((s-12)/48*100);
      if(s<=25) return {lvl:'green',  label:'Baja ansiedad relacional',    pct:p, msg:'Experimentas poca ansiedad en tus relaciones. Tienes una base de seguridad que te permite conectar sin miedo excesivo al abandono o al rechazo.', cta:false};
      if(s<=40) return {lvl:'gold',   label:'Ansiedad relacional moderada',pct:p, msg:'Hay cierta ansiedad presente en tus vínculos. Miedos al abandono, necesidad de reaseguración o hipersensibilidad al rechazo pueden estar influyendo. Vale la pena explorarlo.', cta:false};
      return           {lvl:'red',    label:'Alta ansiedad relacional',    pct:p, msg:'La ansiedad en tus relaciones es alta. Esto puede generar ciclos de miedo y apego que dificultan la conexión genuina. La terapia puede ayudarte a construir vínculos más seguros.', cta:true};
    }
  },

  /* TEST 3: ANSIEDAD GENERAL — GAD-7 */
  {
    id: 'ansiedad', title: 'Ansiedad general',
    subtitle: 'GAD-7', icon: '🌀',
    time: '4', items: 7,
    desc: 'Evalúa tu nivel general de ansiedad en las últimas dos semanas.',
    preamble: 'Durante las últimas 2 semanas, ¿con qué frecuencia has tenido molestias por los siguientes problemas?',
    scaleLabels: ['Nunca', 'Varios días', 'Más de la mitad', 'Casi todos los días'],
    scaleMin: 0,
    questions: [
      { text: 'Sentirse nervioso/a, ansioso/a o muy alterado/a.' },
      { text: 'No poder dejar de preocuparse o no poder controlar la preocupación.' },
      { text: 'Preocuparse demasiado por diferentes cosas.' },
      { text: 'Dificultad para relajarse.' },
      { text: 'Estar tan inquieto/a que es difícil permanecer sentado/a.' },
      { text: 'Irritarse o frustrarse con facilidad.' },
      { text: 'Sentir miedo, como si algo terrible pudiera pasar.' },
    ],
    score(r){ return r.reduce((a,b) => a+b, 0); },
    interpret(s){
      const p = Math.round(s/21*100);
      if(s<=4)  return {lvl:'green',  label:'Mínima ansiedad',   pct:p, msg:'Tu nivel de ansiedad es mínimo. Estás manejando bien las preocupaciones del día a día.', cta:false};
      if(s<=9)  return {lvl:'gold',   label:'Ansiedad leve',     pct:p, msg:'Hay algo de ansiedad presente. No es grave, pero puede afectar tu bienestar. Considera explorar técnicas de regulación emocional o una consulta de evaluación.', cta:false};
      if(s<=14) return {lvl:'orange', label:'Ansiedad moderada', pct:p, msg:'Tu ansiedad es moderada y merece atención. Está afectando tu funcionamiento cotidiano. Te recomiendo hablar con un profesional.', cta:true};
      return           {lvl:'red',    label:'Ansiedad severa',   pct:p, msg:'La ansiedad está en niveles severos. Esto puede afectar significativamente tu calidad de vida. Por favor, busca apoyo profesional pronto.', cta:true};
    }
  },

  /* TEST 4: ESTADO DE ÁNIMO — PHQ-9 */
  {
    id: 'animo', title: 'Estado de ánimo',
    subtitle: 'PHQ-9', icon: '🌧️',
    time: '5', items: 9,
    desc: 'Evalúa tu estado emocional y posibles síntomas de depresión en las últimas dos semanas.',
    preamble: 'Durante las últimas 2 semanas, ¿con qué frecuencia has tenido molestias por los siguientes problemas?',
    scaleLabels: ['Nunca', 'Varios días', 'Más de la mitad', 'Casi todos los días'],
    scaleMin: 0,
    questions: [
      { text: 'Poco interés o placer en hacer las cosas.',                                           safety: false },
      { text: 'Sentirse triste, decaído/a o sin esperanza.',                                         safety: false },
      { text: 'Problemas para quedarse dormido/a, continuar durmiendo o dormir demasiado.',          safety: false },
      { text: 'Sentirse cansado/a o tener poca energía.',                                            safety: false },
      { text: 'Poco apetito o comer en exceso.',                                                     safety: false },
      { text: 'Sentirse mal consigo mismo/a, o que ha fallado a sí mismo/a.',                        safety: false },
      { text: 'Dificultad para concentrarse en cosas como leer el periódico o ver televisión.',      safety: false },
      { text: 'Moverse o hablar tan despacio que otros podrían notarlo, o lo contrario.',            safety: false },
      { text: 'Pensamientos de que sería mejor estar muerto/a o de hacerse daño de alguna manera.', safety: true  },
    ],
    score(r){ return r.reduce((a,b) => a+b, 0); },
    interpret(s){
      const p = Math.round(s/27*100);
      if(s<=4)  return {lvl:'green',  label:'Mínimos síntomas',          pct:p, msg:'Los síntomas son mínimos. Tu estado de ánimo parece estable en este momento.', cta:false};
      if(s<=9)  return {lvl:'gold',   label:'Síntomas leves',            pct:p, msg:'Hay síntomas leves que vale la pena monitorear. Una conversación con un profesional puede darte claridad y herramientas.', cta:false};
      if(s<=14) return {lvl:'orange', label:'Síntomas moderados',        pct:p, msg:'Estás experimentando síntomas moderados que merecen atención profesional. No tienes que cargarlo solo/a.', cta:true};
      if(s<=19) return {lvl:'red',    label:'Síntomas moderado-severos', pct:p, msg:'Los síntomas son significativos. Te recomiendo buscar apoyo profesional pronto. Mereces sentirte bien.', cta:true};
      return           {lvl:'red',    label:'Síntomas severos',          pct:p, msg:'Los síntomas son severos. Por favor, busca ayuda profesional lo antes posible. Hay personas que pueden acompañarte.', cta:true};
    }
  },

  /* TEST 5: RESILIENCIA — CD-RISC-10 */
  {
    id: 'resiliencia', title: 'Resiliencia',
    subtitle: 'CD-RISC-10', icon: '⚡',
    time: '5', items: 10,
    desc: 'Descubre tu capacidad de adaptarte y recuperarte frente a las adversidades.',
    scaleLabels: ['Nada de acuerdo', 'Poco de acuerdo', 'Algo de acuerdo', 'Bastante de acuerdo', 'Totalmente de acuerdo'],
    scaleMin: 0,
    questions: [
      { text: 'Soy capaz de adaptarme cuando ocurren cambios importantes en mi vida.' },
      { text: 'Puedo lidiar con lo que sea que se me presente.' },
      { text: 'Intento ver el lado positivo de las cosas difíciles.' },
      { text: 'Superar las dificultades me hace más fuerte.' },
      { text: 'Tiendo a recuperarme después de enfermedades, lesiones u otras dificultades.' },
      { text: 'Creo que puedo lograr mis objetivos a pesar de los obstáculos.' },
      { text: 'Bajo presión, me mantengo concentrado/a y con claridad mental.' },
      { text: 'No me rindo fácilmente ante los problemas.' },
      { text: 'Sé a dónde acudir cuando necesito ayuda.' },
      { text: 'Cuando las situaciones se ven sin esperanza, no abandono.' },
    ],
    score(r){ return r.reduce((a,b) => a+b, 0); },
    interpret(s){
      const p = Math.round(s/40*100);
      if(s<=16) return {lvl:'orange', label:'Resiliencia baja',     pct:p, msg:'Tu resiliencia parece estar baja en este momento. Puede costarte recuperarte de los golpes o adaptarte a los cambios. La terapia puede ayudarte a fortalecer estos recursos internos.', cta:true};
      if(s<=29) return {lvl:'gold',   label:'Resiliencia moderada', pct:p, msg:'Tienes una resiliencia moderada. Puedes recuperarte de la adversidad, aunque algunas situaciones te resulten especialmente difíciles. Hay espacio para crecer.', cta:false};
      return           {lvl:'green',  label:'Alta resiliencia',     pct:p, msg:'Tienes una alta capacidad de resiliencia. Puedes adaptarte bien a los cambios y recuperarte de los momentos difíciles. Ese es un recurso enormemente valioso.', cta:false};
    }
  },

  /* TEST 6: CRECIMIENTO POSTRAUMÁTICO — PTGI adaptado */
  {
    id: 'crecimiento', title: 'Crecimiento postraumático',
    subtitle: 'PTGI Adaptado', icon: '🕊️',
    time: '6', items: 10,
    desc: 'Explora si has experimentado crecimiento personal a partir de experiencias difíciles.',
    preamble: 'Las siguientes frases describen cambios que algunas personas experimentan como resultado de una crisis o dificultad importante. Indica en qué medida los has experimentado tú.',
    scaleLabels: ['No lo experimenté', 'Mínimo grado', 'Pequeño grado', 'Grado moderado', 'Gran grado', 'Muy gran grado'],
    scaleMin: 0,
    questions: [
      { text: 'He cambiado mis prioridades sobre lo que es importante en la vida.' },
      { text: 'Tengo una mayor apreciación por el valor de mi propia vida.' },
      { text: 'He desarrollado nuevos intereses que no tenía antes.' },
      { text: 'Tengo una mayor sensación de confianza en mí mismo/a.' },
      { text: 'Tengo una mejor comprensión de los aspectos espirituales de la vida.' },
      { text: 'Sé que puedo contar con las personas en tiempos de dificultad.' },
      { text: 'He establecido un nuevo camino o dirección para mi vida.' },
      { text: 'Tengo una mayor sensación de cercanía con los demás.' },
      { text: 'Estoy más dispuesto/a a expresar mis emociones.' },
      { text: 'Sé que puedo manejar mejor las dificultades que se presenten.' },
    ],
    score(r){ return r.reduce((a,b) => a+b, 0); },
    interpret(s){
      const p = Math.round(s/50*100);
      if(s<=20) return {lvl:'gold',  label:'Crecimiento incipiente',          pct:p, msg:'Has experimentado poco crecimiento postraumático por ahora. Eso no significa que no puedas — a veces el crecimiento tarda. La terapia puede ayudarte a encontrar significado en la adversidad.', cta:false};
      if(s<=35) return {lvl:'green', label:'Crecimiento moderado',            pct:p, msg:'Has experimentado crecimiento moderado a partir de las dificultades. Eso habla de una capacidad notable para encontrar significado incluso en el dolor.', cta:false};
      return           {lvl:'green', label:'Alto crecimiento postraumático',  pct:p, msg:'Has experimentado un alto nivel de crecimiento postraumático. Las experiencias difíciles se han convertido, de alguna manera, en recursos para ti. Eso es profundamente valioso.', cta:false};
    }
  }

];

/* ----- Información de cada prueba y áreas que se analizan en el resultado -----
   dims: grupos de preguntas (índices desde 0). dir 'malestar' = más alto, más dificultad; 'recurso' = más alto, más fortaleza. */
const TINFO = {
  autoestima: {
    para: 'Sirve para conocer cómo te percibes y cuánto valor te reconoces como persona. Es una de las escalas más usadas en el mundo para explorar la autoestima.',
    mide: 'La valoración global que haces de ti: cuánto te aceptas y respetas, y qué tan presente está la autocrítica.',
    origen: 'Escala de Autoestima de Rosenberg (Rosenberg, 1965). 10 afirmaciones.',
    rango: 'Puntaje de 0 a 30. Más puntaje indica una autoestima más sólida.',
    max: 30,
    dims: [
      { n: 'Cómo te valoras', items: [0,2,3,6,9], dir: 'recurso' },
      { n: 'Autocrítica y sensación de poca valía', items: [1,4,5,7,8], dir: 'malestar' }
    ]
  },
  relaciones: {
    para: 'Sirve para explorar cómo vives la cercanía con las personas importantes para ti y cuánta inquietud te generan esos vínculos.',
    mide: 'La ansiedad en las relaciones cercanas: el miedo al abandono o al rechazo y la necesidad de sentirte seguro/a del cariño de otros.',
    origen: 'Adaptación de la dimensión de ansiedad del cuestionario ECR-R (Fraley, Waller y Brennan, 2000). 12 afirmaciones.',
    rango: 'Puntaje de 12 a 60. Más puntaje indica más ansiedad en los vínculos.',
    max: 60,
    dims: [
      { n: 'Miedo al abandono o al rechazo', items: [1,5,7,9,10], dir: 'malestar' },
      { n: 'Preocupación por ser valorado/a', items: [0,2,4], dir: 'malestar' },
      { n: 'Necesidad de seguridad y reaseguración', items: [3,11], dir: 'malestar' },
      { n: 'Malestar cuando el otro no está disponible', items: [6,8], dir: 'malestar' }
    ]
  },
  ansiedad: {
    para: 'Sirve como tamizaje: ayuda a identificar cuánto te está afectando la ansiedad en tu día a día y si conviene buscar acompañamiento.',
    mide: 'Con qué frecuencia has tenido síntomas de ansiedad en las últimas dos semanas: preocupación, nerviosismo, tensión, irritabilidad y temor.',
    origen: 'GAD-7 (Spitzer, Kroenke, Williams y Löwe, 2006). 7 preguntas.',
    rango: 'Puntaje de 0 a 21. De 0 a 4 mínimo, de 5 a 9 leve, de 10 a 14 moderado y de 15 a 21 severo.',
    max: 21,
    dims: [
      { n: 'Preocupación difícil de controlar', items: [1,2], dir: 'malestar' },
      { n: 'Nerviosismo y tensión', items: [0,3,4], dir: 'malestar' },
      { n: 'Irritabilidad', items: [5], dir: 'malestar' },
      { n: 'Temor a que algo malo pase', items: [6], dir: 'malestar' }
    ]
  },
  animo: {
    para: 'Sirve como tamizaje: ayuda a identificar cómo está tu estado de ánimo y si conviene buscar acompañamiento.',
    mide: 'Con qué frecuencia has tenido, en las últimas dos semanas, síntomas relacionados con el ánimo: interés, tristeza, sueño, energía, apetito, concentración y la forma en que te ves.',
    origen: 'PHQ-9 (Kroenke, Spitzer y Williams, 2001). 9 preguntas.',
    rango: 'Puntaje de 0 a 27. De 0 a 4 mínimo, de 5 a 9 leve, de 10 a 14 moderado, de 15 a 19 moderado-severo y de 20 a 27 severo.',
    max: 27,
    safetyItem: 8,
    dims: [
      { n: 'Ánimo e interés', items: [0,1], dir: 'malestar' },
      { n: 'Sueño, energía y apetito', items: [2,3,4], dir: 'malestar' },
      { n: 'Cómo te ves y concentración', items: [5,6], dir: 'malestar' },
      { n: 'Ritmo al moverte o hablar', items: [7], dir: 'malestar' }
    ]
  },
  resiliencia: {
    para: 'Sirve para reconocer tus recursos para afrontar momentos difíciles y qué aspectos conviene fortalecer.',
    mide: 'Tu capacidad de adaptarte, sostenerte y recuperarte frente a la adversidad.',
    origen: 'CD-RISC-10 (Campbell-Sills y Stein, 2007). 10 afirmaciones.',
    rango: 'Puntaje de 0 a 40. Más puntaje indica más recursos de resiliencia.',
    max: 40, cap: 2,
    dims: [
      { n: 'Adaptación y recuperación', items: [0,1,4], dir: 'recurso' },
      { n: 'Perseverancia', items: [5,7,9], dir: 'recurso' },
      { n: 'Mirada ante la dificultad', items: [2,3], dir: 'recurso' },
      { n: 'Claridad bajo presión', items: [6], dir: 'recurso' },
      { n: 'Saber a quién acudir', items: [8], dir: 'recurso' }
    ]
  },
  crecimiento: {
    para: 'Sirve para reconocer los cambios positivos que pueden surgir después de una experiencia difícil.',
    mide: 'Cuánto crecimiento personal has vivido tras una crisis: en tus relaciones, tu fortaleza, tu forma de ver la vida y tu dimensión espiritual.',
    origen: 'Adaptación del Inventario de Crecimiento Postraumático, PTGI (Tedeschi y Calhoun, 1996). 10 afirmaciones.',
    rango: 'Puntaje de 0 a 50. Más puntaje indica más crecimiento.',
    max: 50, cap: 1,
    dims: [
      { n: 'Apreciación de la vida', items: [0,1], dir: 'recurso' },
      { n: 'Nuevas posibilidades', items: [2,6], dir: 'recurso' },
      { n: 'Fortaleza personal', items: [3,9], dir: 'recurso' },
      { n: 'Relación con los demás', items: [5,7,8], dir: 'recurso' },
      { n: 'Dimensión espiritual', items: [4], dir: 'recurso' }
    ]
  }
};
TESTS.forEach(t => Object.assign(t, TINFO[t.id] || {}));
/* textos sin lenguaje de diagnóstico */
(function(){const a=TESTS.find(t=>t.id==='animo');if(a)a.desc='Explora cómo ha estado tu estado de ánimo en las últimas dos semanas.';})();
