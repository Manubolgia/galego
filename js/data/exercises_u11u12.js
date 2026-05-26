export const EXERCISES_U11U12 = {

// ═══════════════════════════════════════════════════════════
// UNIT 11 — Viaxar (Travel & Transport)
// ═══════════════════════════════════════════════════════════

'unit11-lesson1': [
  { type:'multiple_choice', prompt:'What does "viaxar" mean?', correctAnswer:'to travel', options:['to fly','to travel','to walk','to drive'], audio:'viaxar' },
  { type:'multiple_choice', prompt:'How do you say "the train"?', correctAnswer:'o tren', options:['o avión','o autobús','o tren','o barco'], audio:'o tren' },
  { type:'matching', prompt:'Match:', pairs:[{gl:'o tren',en:'the train'},{gl:'o avión',en:'the plane'},{gl:'o autobús',en:'the bus'},{gl:'o barco',en:'the boat'}] },
  { type:'translate_type', prompt:'Translate:', sentence:'I go to work by bus', correctAnswer:'Vou ao traballo en autobús', acceptedAnswers:['Vou ao traballo en autobús','vou ao traballo en autobús','Vou ao traballo en autobus'], audio:'Vou ao traballo en autobús' },
  { type:'fill_blank', prompt:'Complete:', sentence:'Vou ___ Santiago en tren', correctAnswer:'a', hint:'I go to Santiago by train', audio:'Vou a Santiago en tren' },
  { type:'word_bank', prompt:'Build:', sentence:'Where is the bus stop?', correctAnswer:['Onde','está','a','parada','do','autobús?'], wordBank:['Onde','está','a','parada','do','autobús?','tren','estación'], audio:'Onde está a parada do autobús?' },
  { type:'multiple_choice', prompt:'"O billete" means:', correctAnswer:'the ticket', options:['the bill','the ticket','the wallet','the passport'], audio:'o billete' },
  { type:'translate_type', prompt:'Translate:', sentence:'I need a ticket to Vigo', correctAnswer:'Necesito un billete para Vigo', acceptedAnswers:['Necesito un billete para Vigo','necesito un billete para Vigo'], audio:'Necesito un billete para Vigo' },
  { type:'fill_blank', prompt:'Complete:', sentence:'Necesito un billete de ___ e volta', correctAnswer:'ida', hint:'I need a return ticket', audio:'Necesito un billete de ida e volta' },
  { type:'listening', prompt:'Type what you hear:', audio:'O tren sae ás nove', correctAnswer:'O tren sae ás nove', acceptedAnswers:['O tren sae ás nove','o tren sae ás nove','O tren sae as nove'] },
  { type:'multiple_choice', prompt:'"Saír" means:', correctAnswer:'to leave / to depart', options:['to arrive','to leave / to depart','to stay','to return'] },
  { type:'word_bank', prompt:'Build:', sentence:'The plane arrives at three', correctAnswer:['O','avión','chega','ás','tres'], wordBank:['O','avión','chega','ás','tres','sae','tren'], audio:'O avión chega ás tres' },
],

'unit11-lesson2': [
  { type:'multiple_choice', prompt:'"Vou viaxar" means:', correctAnswer:'I am going to travel', options:['I travelled','I am going to travel','I want to travel','I like travelling'], audio:'Vou viaxar' },
  { type:'translate_type', prompt:'Translate:', sentence:'I am going to visit Santiago', correctAnswer:'Vou visitar Santiago', acceptedAnswers:['Vou visitar Santiago','vou visitar Santiago'], audio:'Vou visitar Santiago' },
  { type:'fill_blank', prompt:'Complete:', sentence:'Vou ___ en avión', correctAnswer:'viaxar', hint:'I am going to travel by plane', audio:'Vou viaxar en avión' },
  { type:'matching', prompt:'Match:', pairs:[{gl:'vou viaxar',en:'I am going to travel'},{gl:'vou comer',en:'I am going to eat'},{gl:'vou durmir',en:'I am going to sleep'},{gl:'vou comprar',en:'I am going to buy'}] },
  { type:'word_bank', prompt:'Build:', sentence:'We are going to go to the beach', correctAnswer:['Vamos','ir','á','praia'], wordBank:['Vamos','ir','á','praia','a','tren','mercado'], audio:'Vamos ir á praia' },
  { type:'multiple_choice', prompt:'"Ir + a + infinitive" expresses:', correctAnswer:'near future', options:['past actions','near future','commands','wishes'] },
  { type:'translate_type', prompt:'Translate:', sentence:'They are going to arrive tomorrow', correctAnswer:'Van chegar mañá', acceptedAnswers:['Van chegar mañá','van chegar mañá'], audio:'Van chegar mañá' },
  { type:'fill_blank', prompt:'Complete:', sentence:'___ comprar os billetes hoxe', correctAnswer:'Vou', hint:'I am going to buy the tickets today', audio:'Vou comprar os billetes hoxe' },
  { type:'listening', prompt:'Type what you hear:', audio:'Vamos viaxar a Ourense mañá', correctAnswer:'Vamos viaxar a Ourense mañá', acceptedAnswers:['vamos viaxar a Ourense mañá','Vamos viaxar a Ourense mañá'] },
  { type:'multiple_choice', prompt:'"Van" is the "ir" form for:', correctAnswer:'they', options:['we','you (plural)','they','I'] },
  { type:'translate_type', prompt:'Translate:', sentence:'Are you going to travel this summer?', correctAnswer:'Vas viaxar este verán?', acceptedAnswers:['Vas viaxar este verán?','vas viaxar este verán'], audio:'Vas viaxar este verán?' },
  { type:'word_bank', prompt:'Build:', sentence:'She is going to study Galician', correctAnswer:['Ela','vai','estudar','galego'], wordBank:['Ela','vai','estudar','galego','vou','viaxar','eu'], audio:'Ela vai estudar galego' },
],

'unit11-lesson3': [
  { type:'multiple_choice', prompt:'"Fun" means:', correctAnswer:'I went', options:['I go','I went','I will go','I want'], audio:'fun' },
  { type:'translate_type', prompt:'Translate:', sentence:'Yesterday I went to Pontevedra', correctAnswer:'Onte fun a Pontevedra', acceptedAnswers:['Onte fun a Pontevedra','onte fun a Pontevedra'], audio:'Onte fun a Pontevedra' },
  { type:'fill_blank', prompt:'Complete:', sentence:'Onte ___ ao mercado', correctAnswer:'fun', hint:'Yesterday I went to the market', audio:'Onte fun ao mercado' },
  { type:'matching', prompt:'Match past tense of ir:', pairs:[{gl:'fun',en:'I went'},{gl:'fuches',en:'you went'},{gl:'foi',en:'he/she went'},{gl:'fomos',en:'we went'}] },
  { type:'word_bank', prompt:'Build:', sentence:'She went to the beach yesterday', correctAnswer:['Ela','foi','á','praia','onte'], wordBank:['Ela','foi','á','praia','onte','fun','mañá'], audio:'Ela foi á praia onte' },
  { type:'multiple_choice', prompt:'"Onte" means:', correctAnswer:'yesterday', options:['today','tomorrow','yesterday','last week'], audio:'onte' },
  { type:'translate_type', prompt:'Translate:', sentence:'We went to Santiago last week', correctAnswer:'Fomos a Santiago a semana pasada', acceptedAnswers:['Fomos a Santiago a semana pasada','fomos a Santiago a semana pasada'], audio:'Fomos a Santiago a semana pasada' },
  { type:'fill_blank', prompt:'Complete:', sentence:'Eles ___ de vacacións en agosto', correctAnswer:'foron', hint:'They went on holiday in August', audio:'Eles foron de vacacións en agosto' },
  { type:'listening', prompt:'Type what you hear:', audio:'Fun a Lugo onte en tren', correctAnswer:'Fun a Lugo onte en tren', acceptedAnswers:['Fun a Lugo onte en tren','fun a Lugo onte en tren'] },
  { type:'multiple_choice', prompt:'"A semana pasada" means:', correctAnswer:'last week', options:['this week','next week','last week','every week'] },
  { type:'translate_type', prompt:'Translate:', sentence:'Did you go to the restaurant?', correctAnswer:'Fuches ao restaurante?', acceptedAnswers:['Fuches ao restaurante?','fuches ao restaurante'], audio:'Fuches ao restaurante?' },
  { type:'word_bank', prompt:'Build:', sentence:'We went by train to A Coruña', correctAnswer:['Fomos','en','tren','á','Coruña'], wordBank:['Fomos','en','tren','á','Coruña','fun','avión'], audio:'Fomos en tren á Coruña' },
],

'unit11-lesson4': [
  { type:'listening', prompt:'Type what you hear:', audio:'Vou viaxar a Madrid a semana que vén', correctAnswer:'Vou viaxar a Madrid a semana que vén', acceptedAnswers:['vou viaxar a Madrid a semana que vén','Vou viaxar a Madrid a semana que ven'] },
  { type:'translate_type', prompt:'Translate:', sentence:'The hotel is near the station', correctAnswer:'O hotel está preto da estación', acceptedAnswers:['O hotel está preto da estación','o hotel está preto da estación'], audio:'O hotel está preto da estación' },
  { type:'multiple_choice', prompt:'"Chegar" means:', correctAnswer:'to arrive', options:['to leave','to arrive','to stay','to depart'], audio:'chegar' },
  { type:'fill_blank', prompt:'Complete:', sentence:'O avión ___ ás sete da tarde', correctAnswer:'chega', hint:'The plane arrives at seven PM', audio:'O avión chega ás sete da tarde' },
  { type:'matching', prompt:'Match:', pairs:[{gl:'o hotel',en:'the hotel'},{gl:'o aeroporto',en:'the airport'},{gl:'o billete',en:'the ticket'},{gl:'a maleta',en:'the suitcase'}] },
  { type:'word_bank', prompt:'Build:', sentence:'I went on holiday last summer', correctAnswer:['Fun','de','vacacións','o','verán','pasado'], wordBank:['Fun','de','vacacións','o','verán','pasado','vou','este'], audio:'Fun de vacacións o verán pasado' },
  { type:'translate_type', prompt:'Translate:', sentence:'Where does the train to Vigo leave from?', correctAnswer:'De onde sae o tren a Vigo?', acceptedAnswers:['De onde sae o tren a Vigo?','de onde sae o tren a Vigo'], audio:'De onde sae o tren a Vigo?' },
  { type:'multiple_choice', prompt:'"A maleta" means:', correctAnswer:'the suitcase', options:['the wallet','the bag','the suitcase','the backpack'], audio:'a maleta' },
  { type:'fill_blank', prompt:'Complete:', sentence:'A semana que ___ vou a Lisboa', correctAnswer:'vén', hint:'Next week I am going to Lisbon', audio:'A semana que vén vou a Lisboa' },
  { type:'translate_type', prompt:'Translate:', sentence:'I need to book a hotel', correctAnswer:'Necesito reservar un hotel', acceptedAnswers:['Necesito reservar un hotel','necesito reservar un hotel'], audio:'Necesito reservar un hotel' },
  { type:'multiple_choice', prompt:'"Vacacións" means:', correctAnswer:'holidays', options:['vacation','holidays','weekends','free time'], audio:'vacacións' },
  { type:'word_bank', prompt:'Build:', sentence:'The bus leaves at ten in the morning', correctAnswer:['O','autobús','sae','ás','dez','da','mañá'], wordBank:['O','autobús','sae','ás','dez','da','mañá','tren','tarde'], audio:'O autobús sae ás dez da mañá' },
],

// ═══════════════════════════════════════════════════════════
// UNIT 12 — Saúde e Corpo (Health & Body)
// ═══════════════════════════════════════════════════════════

'unit12-lesson1': [
  { type:'multiple_choice', prompt:'What does "a cabeza" mean?', correctAnswer:'the head', options:['the arm','the leg','the head','the stomach'], audio:'a cabeza' },
  { type:'multiple_choice', prompt:'How do you say "the hand"?', correctAnswer:'a man', options:['o pé','a man','o brazo','o dedo'], audio:'a man' },
  { type:'matching', prompt:'Match body parts:', pairs:[{gl:'a cabeza',en:'the head'},{gl:'o brazo',en:'the arm'},{gl:'a perna',en:'the leg'},{gl:'o pé',en:'the foot'}] },
  { type:'translate_type', prompt:'Translate:', sentence:'My head hurts', correctAnswer:'Dóeme a cabeza', acceptedAnswers:['Dóeme a cabeza','dóeme a cabeza','Doeme a cabeza'], audio:'Dóeme a cabeza' },
  { type:'fill_blank', prompt:'Complete:', sentence:'___ a cabeza', correctAnswer:'Dóeme', hint:'My head hurts', audio:'Dóeme a cabeza' },
  { type:'word_bank', prompt:'Build:', sentence:'My stomach hurts', correctAnswer:['Dóeme','o','estómago'], wordBank:['Dóeme','o','estómago','a','cabeza','brazo'], audio:'Dóeme o estómago' },
  { type:'multiple_choice', prompt:'"As costas" means:', correctAnswer:'the back', options:['the ribs','the back','the shoulders','the chest'], audio:'as costas' },
  { type:'translate_type', prompt:'Translate:', sentence:'the eyes', correctAnswer:'os ollos', acceptedAnswers:['os ollos'], audio:'os ollos' },
  { type:'fill_blank', prompt:'Complete:', sentence:'Teño dor de ___', correctAnswer:'cabeza', hint:'I have a headache', audio:'Teño dor de cabeza' },
  { type:'listening', prompt:'Type what you hear:', audio:'Dóeme moito a perna', correctAnswer:'Dóeme moito a perna', acceptedAnswers:['Dóeme moito a perna','doeme moito a perna'] },
  { type:'multiple_choice', prompt:'"O xeonllo" means:', correctAnswer:'the knee', options:['the elbow','the ankle','the knee','the wrist'], audio:'o xeonllo' },
  { type:'word_bank', prompt:'Build:', sentence:'My arms hurt', correctAnswer:['Dóenme','os','brazos'], wordBank:['Dóenme','os','brazos','a','perna','Dóeme'], audio:'Dóenme os brazos' },
],

'unit12-lesson2': [
  { type:'multiple_choice', prompt:'"Estou enfermo/a" means:', correctAnswer:'I am sick', options:['I am tired','I am sick','I am hurt','I am cold'], audio:'Estou enfermo' },
  { type:'translate_type', prompt:'Translate:', sentence:'I have a fever', correctAnswer:'Teño febre', acceptedAnswers:['Teño febre','teño febre'], audio:'Teño febre' },
  { type:'fill_blank', prompt:'Complete:', sentence:'Teño que ir ao ___', correctAnswer:'médico', hint:'I have to go to the doctor', audio:'Teño que ir ao médico' },
  { type:'matching', prompt:'Match:', pairs:[{gl:'a febre',en:'the fever'},{gl:'a tose',en:'the cough'},{gl:'o constipado',en:'the cold'},{gl:'a dor',en:'the pain'}] },
  { type:'word_bank', prompt:'Build:', sentence:'I need medicine', correctAnswer:['Necesito','medicamentos'], wordBank:['Necesito','medicamentos','Quero','médico','febre','ir'], audio:'Necesito medicamentos' },
  { type:'multiple_choice', prompt:'"A farmacia" is where you:', correctAnswer:'buy medicine', options:['see a doctor','buy medicine','get tests','stay overnight'] },
  { type:'translate_type', prompt:'Translate:', sentence:'I feel bad', correctAnswer:'Síntome mal', acceptedAnswers:['Síntome mal','síntome mal','Sintome mal'], audio:'Síntome mal' },
  { type:'fill_blank', prompt:'Complete:', sentence:'___ mal desde onte', correctAnswer:'Síntome', hint:'I feel bad since yesterday', audio:'Síntome mal desde onte' },
  { type:'listening', prompt:'Type what you hear:', audio:'Teño tose e febre', correctAnswer:'Teño tose e febre', acceptedAnswers:['Teño tose e febre','teño tose e febre'] },
  { type:'multiple_choice', prompt:'"Sentirse" is a reflexive verb meaning:', correctAnswer:'to feel', options:['to sit','to feel','to hear','to sense'] },
  { type:'translate_type', prompt:'Translate:', sentence:'She feels better today', correctAnswer:'Ela síntese mellor hoxe', acceptedAnswers:['Ela síntese mellor hoxe','ela síntese mellor hoxe'], audio:'Ela síntese mellor hoxe' },
  { type:'word_bank', prompt:'Build:', sentence:'I have a cold', correctAnswer:['Teño','un','constipado'], wordBank:['Teño','un','constipado','febre','dor','estou'], audio:'Teño un constipado' },
],

'unit12-lesson3': [
  { type:'multiple_choice', prompt:'"Lavarse" means:', correctAnswer:'to wash oneself', options:['to get dressed','to wash oneself','to comb','to wake up'], audio:'lavarse' },
  { type:'matching', prompt:'Match reflexive verbs:', pairs:[{gl:'lavarse',en:'to wash oneself'},{gl:'vestirse',en:'to get dressed'},{gl:'peitearse',en:'to comb one\'s hair'},{gl:'deitarse',en:'to lie down'}] },
  { type:'translate_type', prompt:'Translate:', sentence:'I wash my hands', correctAnswer:'Lavo as mans', acceptedAnswers:['Lavo as mans','lavo as mans'], audio:'Lavo as mans' },
  { type:'fill_blank', prompt:'Complete:', sentence:'___ todas as mañás ás oito', correctAnswer:'Léventome', hint:'I get up every morning at eight', audio:'Léventome todas as mañás ás oito' },
  { type:'word_bank', prompt:'Build:', sentence:'She gets dressed quickly', correctAnswer:['Ela','vístese','rápido'], wordBank:['Ela','vístese','rápido','lávase','deita','mans'], audio:'Ela vístese rápido' },
  { type:'multiple_choice', prompt:'"Deitarse" means:', correctAnswer:'to lie down / to go to bed', options:['to sit down','to stand up','to lie down / to go to bed','to wake up'] },
  { type:'translate_type', prompt:'Translate:', sentence:'We go to bed at eleven', correctAnswer:'Deitámonos ás once', acceptedAnswers:['Deitámonos ás once','deitámonos ás once'], audio:'Deitámonos ás once' },
  { type:'fill_blank', prompt:'Complete:', sentence:'Eles ___ moi cedo', correctAnswer:'léventanse', hint:'They get up very early', audio:'Eles léventanse moi cedo' },
  { type:'listening', prompt:'Type what you hear:', audio:'Lavo as mans antes de comer', correctAnswer:'Lavo as mans antes de comer', acceptedAnswers:['Lavo as mans antes de comer','lavo as mans antes de comer'] },
  { type:'multiple_choice', prompt:'"Cedo" means:', correctAnswer:'early', options:['late','early','fast','slowly'], audio:'cedo' },
  { type:'translate_type', prompt:'Translate:', sentence:'He washes his face every morning', correctAnswer:'El lava a cara todas as mañás', acceptedAnswers:['El lava a cara todas as mañás','el lava a cara todas as mañás'], audio:'El lava a cara todas as mañás' },
  { type:'word_bank', prompt:'Build:', sentence:'I lie down at midnight', correctAnswer:['Déitome','á','medianoite'], wordBank:['Déitome','á','medianoite','Léventome','mañá','ás'], audio:'Déitome á medianoite' },
],

'unit12-lesson4': [
  { type:'listening', prompt:'Type what you hear:', audio:'Dóeme a cabeza e teño febre', correctAnswer:'Dóeme a cabeza e teño febre', acceptedAnswers:['Dóeme a cabeza e teño febre','doeme a cabeza e teño febre'] },
  { type:'translate_type', prompt:'Translate:', sentence:'You should rest', correctAnswer:'Deberías descansar', acceptedAnswers:['Deberías descansar','deberías descansar'], audio:'Deberías descansar' },
  { type:'multiple_choice', prompt:'"Descansar" means:', correctAnswer:'to rest', options:['to sleep','to rest','to eat','to drink'], audio:'descansar' },
  { type:'fill_blank', prompt:'Complete:', sentence:'Teño que ___ máis auga', correctAnswer:'beber', hint:'I have to drink more water', audio:'Teño que beber máis auga' },
  { type:'matching', prompt:'Match:', pairs:[{gl:'descansar',en:'to rest'},{gl:'durmir',en:'to sleep'},{gl:'coidarse',en:'to take care of oneself'},{gl:'mellorar',en:'to get better'}] },
  { type:'word_bank', prompt:'Build:', sentence:'I feel much better', correctAnswer:['Síntome','moito','mellor'], wordBank:['Síntome','moito','mellor','mal','peor','Dóeme'], audio:'Síntome moito mellor' },
  { type:'translate_type', prompt:'Translate:', sentence:'I take care of myself', correctAnswer:'Coídome', acceptedAnswers:['Coídome','coídome','Coidome'], audio:'Coídome' },
  { type:'multiple_choice', prompt:'"Mellorar" means:', correctAnswer:'to get better / to improve', options:['to get worse','to get better / to improve','to recover','to heal'] },
  { type:'fill_blank', prompt:'Complete:', sentence:'Ela vai ___ pronto', correctAnswer:'mellorar', hint:'She is going to get better soon', audio:'Ela vai mellorar pronto' },
  { type:'translate_type', prompt:'Translate:', sentence:'I have to take care of my health', correctAnswer:'Teño que coidar a miña saúde', acceptedAnswers:['Teño que coidar a miña saúde','teño que coidar a miña saúde','Teño que coidar a miña saude'], audio:'Teño que coidar a miña saúde' },
  { type:'multiple_choice', prompt:'"A saúde" means:', correctAnswer:'health', options:['safety','health','salad','greeting'] },
  { type:'word_bank', prompt:'Build:', sentence:'I am going to get better soon', correctAnswer:['Vou','mellorar','pronto'], wordBank:['Vou','mellorar','pronto','Teño','descansar','mal'], audio:'Vou mellorar pronto' },
],

};
