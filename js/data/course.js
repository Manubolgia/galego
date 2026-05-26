// Galego — Course Structure (Units 1-8)
export const COURSE = [
  {
    id: 'unit-1', title: 'Ola!', subtitle: 'Greetings & Basics', icon: '👋',
    grammarTips: [
      { id: 'g1a', title: 'Galician Articles: o, a, os, as', body: 'Unlike Spanish (el/la), Galician uses o/a for "the". Plurals: os (masc.) and as (fem.). Very similar to Portuguese.', examples: [{gl:'o home',en:'the man'},{gl:'a muller',en:'the woman'},{gl:'os rapaces',en:'the boys'},{gl:'as rapazas',en:'the girls'}] },
      { id: 'g1b', title: 'Ser vs Estar', body: 'Two verbs for "to be": ser (identity, permanent) and estar (state, location, temporary).', examples: [{gl:'Son estudante.',en:'I am a student.'},{gl:'Estou ben.',en:'I am fine.'}] },
    ],
    lessons: ['unit1-lesson1','unit1-lesson2','unit1-lesson3','unit1-lesson4','unit1-lesson5'],
  },
  {
    id: 'unit-2', title: 'A Familia', subtitle: 'Family & People', icon: '👨‍👩‍👧',
    grammarTips: [
      { id: 'g2a', title: 'Possessives: meu / miña', body: 'Possessives agree with the noun, not the possessor. Meu/meus (my, masc.) and miña/miñas (my, fem.).', examples: [{gl:'o meu pai',en:'my father'},{gl:'a miña nai',en:'my mother'}] },
      { id: 'g2b', title: 'Gender Agreement', body: 'Adjectives must match the noun\'s gender. -o for masculine, -a for feminine.', examples: [{gl:'o rapaz alto',en:'the tall boy'},{gl:'a rapaza alta',en:'the tall girl'}] },
    ],
    lessons: ['unit2-lesson1','unit2-lesson2','unit2-lesson3','unit2-lesson4','unit2-lesson5'],
  },
  {
    id: 'unit-3', title: 'Comida e Bebida', subtitle: 'Food & Drink', icon: '🥘',
    grammarTips: [
      { id: 'g3a', title: 'Indefinite Articles: un / unha', body: 'Un (a/an, masc.) and unha (a/an, fem.). Plurals uns/unhas mean "some".', examples: [{gl:'un café',en:'a coffee'},{gl:'unha cervexa',en:'a beer'}] },
      { id: 'g3b', title: 'Querer — To Want', body: 'Common irregular verb. Quero (I want), queres (you want), quere (he/she wants), queremos (we want).', examples: [{gl:'Quero un café.',en:'I want a coffee.'},{gl:'Queremos comer.',en:'We want to eat.'}] },
    ],
    lessons: ['unit3-lesson1','unit3-lesson2','unit3-lesson3','unit3-lesson4','unit3-lesson5'],
  },
  {
    id: 'unit-4', title: 'Cores e Números', subtitle: 'Colors & Numbers 1–20', icon: '🎨',
    grammarTips: [
      { id: 'g4a', title: 'Adjective Agreement', body: 'Colours agree with the noun: -o (masc. sg.), -a (fem. sg.), -os (masc. pl.), -as (fem. pl.).', examples: [{gl:'o coche vermello',en:'the red car'},{gl:'a flor vermella',en:'the red flower'}] },
      { id: 'g4b', title: 'Adjective Placement', body: 'Adjectives usually follow the noun in Galician. Some (grande, pequeno) can precede for emphasis.', examples: [{gl:'un libro azul',en:'a blue book'},{gl:'un gran libro',en:'a great book'}] },
    ],
    lessons: ['unit4-lesson1','unit4-lesson2','unit4-lesson3','unit4-lesson4','unit4-lesson5'],
  },
  {
    id: 'unit-5', title: 'A Casa', subtitle: 'Home & Rooms', icon: '🏠',
    grammarTips: [
      { id: 'g5a', title: 'Contractions: do, da, no, na, polo, pola', body: 'Galician contracts prepositions + articles: de+o=do, de+a=da, en+o=no, en+a=na, por+o=polo, por+a=pola. These are mandatory.', examples: [{gl:'o libro do rapaz',en:'the boy\'s book'},{gl:'estou na casa',en:'I am at home'}] },
      { id: 'g5b', title: 'Prepositions of Place', body: 'sobre (on), baixo (under), diante de (in front of), detrás de (behind), entre (between), ao lado de (next to).', examples: [{gl:'O gato está baixo a mesa.',en:'The cat is under the table.'}] },
    ],
    lessons: ['unit5-lesson1','unit5-lesson2','unit5-lesson3','unit5-lesson4'],
  },
  {
    id: 'unit-6', title: 'O Día a Día', subtitle: 'Daily Routine', icon: '☀️',
    grammarTips: [
      { id: 'g6a', title: 'Present: -ar Verbs', body: 'Remove -ar, add: -o, -as, -a, -amos, -ades, -an.', examples: [{gl:'falar → falo, falas, fala, falamos, falades, falan',en:'to speak → I speak, you speak...'}] },
      { id: 'g6b', title: 'Present: -er and -ir Verbs', body: '-er: -o,-es,-e,-emos,-edes,-en. -ir: -o,-es,-e,-imos,-ides,-en.', examples: [{gl:'comer → como, comes, come...',en:'to eat → I eat...'},{gl:'vivir → vivo, vives, vive...',en:'to live → I live...'}] },
    ],
    lessons: ['unit6-lesson1','unit6-lesson2','unit6-lesson3','unit6-lesson4','unit6-lesson5'],
  },
  {
    id: 'unit-7', title: 'Na Cidade', subtitle: 'In the City & Directions', icon: '🏙️',
    grammarTips: [
      { id: 'g7a', title: 'Estar + Location', body: 'Always use estar (not ser) for the location of things and people.', examples: [{gl:'O banco está á dereita.',en:'The bank is on the right.'},{gl:'Estamos preto do parque.',en:'We are near the park.'}] },
      { id: 'g7b', title: 'Demonstratives: este / ese / aquel', body: 'Three levels of distance: este/esta (near me), ese/esa (near you), aquel/aquela (far). All agree in gender and number.', examples: [{gl:'este edificio',en:'this building'},{gl:'ese restaurante',en:'that restaurant'},{gl:'aquel monte',en:'that mountain far away'}] },
    ],
    lessons: ['unit7-lesson1','unit7-lesson2','unit7-lesson3','unit7-lesson4'],
  },
  {
    id: 'unit-8', title: 'O Tempo', subtitle: 'Weather & Seasons', icon: '🌧️',
    grammarTips: [
      { id: 'g8a', title: 'Impersonal Weather', body: 'Weather verbs have no subject: chove (it rains), neva (it snows), trona (it thunders). Fai + noun is also common.', examples: [{gl:'Chove moito en Galicia.',en:'It rains a lot in Galicia.'},{gl:'Fai frío.',en:'It is cold.'}] },
      { id: 'g8b', title: 'Seasons', body: 'a primavera (spring), o verán (summer), o outono (autumn), o inverno (winter). Use "en" before seasons.', examples: [{gl:'En verán fai calor.',en:'In summer it is hot.'}] },
    ],
    lessons: ['unit8-lesson1','unit8-lesson2','unit8-lesson3','unit8-lesson4'],
  },
];

export function getUnit(unitId) {
  return COURSE.find(u => u.id === unitId) || null;
}
