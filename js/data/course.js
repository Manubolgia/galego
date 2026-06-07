// Galego — Course Structure (Units 1-12)
// Unit IDs and lesson IDs are stable — do NOT change them (user progress keys depend on these).
export const COURSE = [
  {
    id: 'unit-1', title: 'Ola!', subtitle: 'Greetings & Goodbyes', icon: '👋', level: 'A1',
    grammarTips: [
      { id: 'g1a', title: 'Galician Articles: o, a, os, as', body: 'Unlike Spanish (el/la), Galician uses o/a for "the". Plurals: os (masc.) and as (fem.). Very similar to Portuguese.', examples: [{gl:'o home',en:'the man'},{gl:'a muller',en:'the woman'},{gl:'os rapaces',en:'the boys'},{gl:'as rapazas',en:'the girls'}] },
      { id: 'g1b', title: 'Ser — Identity & Greetings', body: 'Son (I am), es (you are), é (he/she is). Use ser for identity and profession. "Chámome" means "my name is" — literally "I call myself."', examples: [{gl:'Son estudante.',en:'I am a student.'},{gl:'Chámome Ana.',en:'My name is Ana.'},{gl:'Bos días vs. Buenos días',en:'Galician "bos/boas" vs. Spanish "buenos/buenas"'}] },
    ],
    lessons: ['unit1-lesson1','unit1-lesson2','unit1-lesson3','unit1-lesson4','unit1-lesson5'],
  },
  {
    id: 'unit-2', title: 'A Miña Familia', subtitle: 'Family & Possessives', icon: '👨‍👩‍👧', level: 'A1',
    grammarTips: [
      { id: 'g2a', title: 'Possessives always take an article', body: 'In Galician, possessives almost always come WITH the article: "o meu pai" (my father). Spanish drops the article ("mi padre"), Galician keeps it — think "THE my father."', examples: [{gl:'o meu pai',en:'my father'},{gl:'a miña nai',en:'my mother'},{gl:'o teu irmán',en:'your brother'}] },
      { id: 'g2b', title: 'Ter — To Have (teño, tes, ten…)', body: 'Ter is one of the most important verbs. Notice "teño" — the ñ is in the first person (eu), unlike Spanish "tengo/tiene."', examples: [{gl:'Teño un irmán.',en:'I have a brother.'},{gl:'Ela ten dous fillos.',en:'She has two children.'},{gl:'teño / tes / ten / temos / tedes / teñen',en:'I/you/he/we/you pl./they have'}] },
    ],
    lessons: ['unit2-lesson1','unit2-lesson2','unit2-lesson3','unit2-lesson4','unit2-lesson5'],
  },
  {
    id: 'unit-3', title: 'No Café', subtitle: 'At the Café — Ordering & Prices', icon: '☕', level: 'A1',
    grammarTips: [
      { id: 'g3a', title: 'The Galician X — /ʃ/ sound', body: 'The Galician "x" is pronounced like English "sh". It appears where Spanish uses "j" or "z": cervexa (beer), queixo (cheese), xamón (ham). "Cervexa" = "cer-VEH-sha."', examples: [{gl:'cervexa',en:'beer (Spanish: cerveza)'},{gl:'queixo',en:'cheese (Spanish: queso)'},{gl:'xamón',en:'ham (Spanish: jamón)'}] },
      { id: 'g3b', title: 'Querer — To Want', body: 'Quero (I want), queres (you want), quere (he/she wants). Use "quería" for polite requests: "Quería un café" = "I would like a coffee."', examples: [{gl:'Quero un café, por favor.',en:'I want a coffee, please.'},{gl:'Quería un viño.',en:'I would like a wine.'},{gl:'Outro café, por favor.',en:'Another coffee, please.'}] },
    ],
    lessons: ['unit3-lesson1','unit3-lesson2','unit3-lesson3','unit3-lesson4','unit3-lesson5'],
  },
  {
    id: 'unit-4', title: 'Números e Cores', subtitle: 'Numbers & Colors', icon: '🎨', level: 'A1',
    grammarTips: [
      { id: 'g4a', title: 'Gendered Numbers: dous / dúas', body: 'Galician counts differently by gender! "Dous" for masculine, "dúas" for feminine. Two boys = "dous nenos." Two girls = "dúas nenas." Spanish "dos" is invariable — Galician is not!', examples: [{gl:'dous irmáns',en:'two brothers'},{gl:'dúas irmás',en:'two sisters'},{gl:'un can / unha gata',en:'one dog (m.) / one cat (f.)'}] },
      { id: 'g4b', title: 'Colors agree with the noun', body: 'Colors change ending to match the noun\'s gender and number. Some are invariable (azul, verde, laranxa, rosa, marrón).', examples: [{gl:'o coche vermello',en:'the red car'},{gl:'a casa vermella',en:'the red house'},{gl:'o ceo azul / as flores azuis',en:'the blue sky / the blue flowers'}] },
    ],
    lessons: ['unit4-lesson1','unit4-lesson2','unit4-lesson3','unit4-lesson4','unit4-lesson5'],
  },
  {
    id: 'unit-5', title: 'Ser e Estar', subtitle: 'Two Verbs for "To Be"', icon: '🔄', level: 'A1',
    grammarTips: [
      { id: 'g5a', title: 'Ser — who you ARE', body: 'Use ser for identity, profession, origin, and permanent characteristics. "Son galego" (I am Galician — that\'s who you are). Full present: son, es, é, somos, sodes, son.', examples: [{gl:'Son profesora.',en:'I am a teacher.'},{gl:'É de Vigo.',en:'She is from Vigo.'},{gl:'O café é bo.',en:'The coffee is good (inherent quality).'}] },
      { id: 'g5b', title: 'Estar — where you ARE / how you FEEL', body: 'Use estar for location and temporary states. "Estou canso" — I\'m tired right now. Full present: estou, estás, está, estamos, estades, están.', examples: [{gl:'Estou ben, grazas.',en:'I am fine, thanks.'},{gl:'O café está aquí.',en:'The coffee is here (location).'},{gl:'Ela está contenta.',en:'She is happy (right now).'}] },
    ],
    lessons: ['unit5-lesson1','unit5-lesson2','unit5-lesson3','unit5-lesson4'],
  },
  {
    id: 'unit-6', title: 'O Día a Día', subtitle: 'Daily Routine & Regular Verbs', icon: '☀️', level: 'A2',
    grammarTips: [
      { id: 'g6a', title: 'Regular -AR Verbs', body: 'Remove -ar, add: -o, -as, -a, -amos, -ades, -an. Learn this pattern once and you can conjugate hundreds of verbs: falar, traballar, estudar, comprar…', examples: [{gl:'falo / falas / fala / falamos / falades / falan',en:'I speak / you speak / he speaks…'},{gl:'Traballo nunha empresa.',en:'I work in a company.'}] },
      { id: 'g6b', title: 'Ir — To Go (irregular)', body: '"Imos" (we go) is uniquely Galician — Spanish says "vamos." Contractions: a + o = ao, a + a = á. Full present: vou, vas, vai, imos, ides, van.', examples: [{gl:'Vou ao traballo.',en:'I go to work.'},{gl:'Imos á escola.',en:'We go to school.'},{gl:'Elas van á praia.',en:'They go to the beach.'}] },
    ],
    lessons: ['unit6-lesson1','unit6-lesson2','unit6-lesson3','unit6-lesson4','unit6-lesson5'],
  },
  {
    id: 'unit-7', title: 'A Casa e a Cidade', subtitle: 'Home, City & Prepositions', icon: '🏙️', level: 'A2',
    grammarTips: [
      { id: 'g7a', title: 'Hai — There is / There are', body: '"Hai" is invariable — it never changes form. Use it for both singular and plural. It comes from "haber." Spanish equivalent: "hay."', examples: [{gl:'Hai un parque preto de aquí.',en:'There is a park near here.'},{gl:'Hai moitas tendas na rúa.',en:'There are many shops on the street.'}] },
      { id: 'g7b', title: 'Mandatory Contractions', body: 'Galician contracts prepositions + articles — these are NOT optional. en+o=no, en+a=na, de+o=do, de+a=da, por+o=polo, por+a=pola. Spanish "en el" → Galician "no."', examples: [{gl:'Estou na casa.',en:'I am at home (en + a = na).'},{gl:'O libro do rapaz.',en:'The boy\'s book (de + o = do).'},{gl:'Vou polo parque.',en:'I go through the park (por + o = polo).'}] },
    ],
    lessons: ['unit7-lesson1','unit7-lesson2','unit7-lesson3','unit7-lesson4'],
  },
  {
    id: 'unit-8', title: 'Que Hora É?', subtitle: 'Time, Days & Making Plans', icon: '🕐', level: 'A2',
    grammarTips: [
      { id: 'g8a', title: 'Telling Time', body: 'Hours use feminine articles: "Son as dúas" (it\'s two o\'clock). One o\'clock: "É a unha." Galician days and months are different from Spanish — no capital letters!', examples: [{gl:'É a unha.',en:'It\'s one o\'clock.'},{gl:'Son as tres e media.',en:'It\'s half past three.'},{gl:'xoves (Thursday) vs. jueves',en:'Galician vs. Spanish'}] },
      { id: 'g8b', title: 'Ir + Infinitive (Near Future)', body: 'Use conjugated "ir" + infinitive to talk about plans. "Vou comer ás dúas" (I\'m going to eat at two). Combines the verb ir (Unit 6) with any infinitive.', examples: [{gl:'Vou viaxar a Santiago.',en:'I am going to travel to Santiago.'},{gl:'Imos ir á praia o sábado.',en:'We are going to go to the beach on Saturday.'}] },
    ],
    lessons: ['unit8-lesson1','unit8-lesson2','unit8-lesson3','unit8-lesson4'],
  },
  {
    id: 'unit-9', title: 'A Comida Galega', subtitle: 'Galician Food & -ER/-IR Verbs', icon: '🥘', level: 'A2',
    grammarTips: [
      { id: 'g9a', title: 'Regular -ER and -IR Verbs', body: '-ER endings: -o, -es, -e, -emos, -edes, -en. -IR endings: -o, -es, -e, -imos, -ides, -en. The only difference is in "nós" and "vós."', examples: [{gl:'como / comes / come / comemos / comedes / comen',en:'I eat / you eat / he eats…'},{gl:'vivo / vives / vive / vivimos / vivides / viven',en:'I live / you live…'}] },
      { id: 'g9b', title: 'Gustar / Encantar — Inverted Construction', body: '"Gústame" means "it pleases me" = I like it. The thing you like is the SUBJECT of the verb. Plural subject → "Gústanme os peixes" (I like fish).', examples: [{gl:'Gústame o polbo.',en:'I like octopus (lit. octopus pleases me).'},{gl:'Encántame o marisco.',en:'I love seafood.'},{gl:'Non me gusta a carne.',en:'I don\'t like meat.'}] },
    ],
    lessons: ['unit9-lesson1','unit9-lesson2','unit9-lesson3','unit9-lesson4'],
  },
  {
    id: 'unit-10', title: 'O Pretérito', subtitle: 'Simple Past Tense', icon: '⏮️', level: 'A2',
    grammarTips: [
      { id: 'g10a', title: 'Past Tense -AR Verbs', body: '-AR past endings: -ei, -aches, -ou, -amos, -astes, -aron. "Onte falei co meu pai" (Yesterday I spoke with my father). Note: "falou" not "faló."', examples: [{gl:'falei / falaches / falou / falamos / falastes / falaron',en:'I spoke / you spoke / he spoke…'},{gl:'Onte traballei moito.',en:'Yesterday I worked a lot.'}] },
      { id: 'g10b', title: 'Irregular Past: ir, facer, ter', body: 'Key irregulars to memorize: ir/ser → fun/foi/fomos; facer → fixen/fixo/fixemos; ter → tiven/tivo/tivemos. Galician "fixen" vs. Spanish "hice" — quite different!', examples: [{gl:'Fun ao mercado.',en:'I went to the market.'},{gl:'Fixemos a cea.',en:'We made dinner.'},{gl:'Tiven un problema.',en:'I had a problem.'}] },
    ],
    lessons: ['unit10-lesson1','unit10-lesson2','unit10-lesson3','unit10-lesson4'],
  },
  {
    id: 'unit-11', title: 'O Tempo e a Roupa', subtitle: 'Weather & Clothing', icon: '🌧️', level: 'A2',
    grammarTips: [
      { id: 'g11a', title: 'Impersonal Weather Expressions', body: 'Weather verbs have no subject: chove (it rains), neva (it snows). "Fai + noun" is also common. Galicia is famously rainy — there\'s even a word for every type of rain!', examples: [{gl:'Chove moito en Galicia.',en:'It rains a lot in Galicia.'},{gl:'Fai frío.',en:'It is cold.'},{gl:'Hai néboa.',en:'There is fog.'}] },
      { id: 'g11b', title: 'Demonstratives: este / ese / aquel', body: 'Three levels of distance: este/esta (near me), ese/esa (near you), aquel/aquela (far away). All agree in gender and number.', examples: [{gl:'esta chaqueta',en:'this jacket (near me)'},{gl:'ese paraugas',en:'that umbrella (near you)'},{gl:'aquelas botas',en:'those boots (far away)'}] },
    ],
    lessons: ['unit11-lesson1','unit11-lesson2','unit11-lesson3','unit11-lesson4'],
  },
  {
    id: 'unit-12', title: 'A Saúde', subtitle: 'Health, Body & Feelings', icon: '🏥', level: 'B1',
    grammarTips: [
      { id: 'g12a', title: 'Doer — To Hurt (like Gustar)', body: 'Doer works like gustar: "Dóeme a cabeza" (my head hurts — lit. "the head hurts to me"). Plural subject: "Dóenme os ollos" (my eyes hurt).', examples: [{gl:'Dóeme o estómago.',en:'My stomach hurts.'},{gl:'Dóenme as costas.',en:'My back hurts.'},{gl:'Que lle pasa?',en:'What is wrong with you? (formal)'}] },
      { id: 'g12b', title: 'Reflexive Verbs: sentirse, levantarse…', body: 'The reflexive pronoun attaches to or precedes the verb. "Síntome" (I feel), "levántome" (I get up). Common: levantarse, deitarse, sentirse, vestirse.', examples: [{gl:'Síntome mal.',en:'I feel bad.'},{gl:'Levántome ás oito.',en:'I get up at eight.'},{gl:'Téñome febre.',en:'I have a fever.'}] },
    ],
    lessons: ['unit12-lesson1','unit12-lesson2','unit12-lesson3','unit12-lesson4'],
  },
];

export function getUnit(unitId) {
  return COURSE.find(u => u.id === unitId) || null;
}
