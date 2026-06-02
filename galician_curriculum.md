# Galician Language Learning Curriculum

## For a Duolingo-Style Mobile App

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Exercise Types Reference](#exercise-types-reference)
3. [Level A1 — Foundations](#level-a1--foundations)
4. [Level A2 — Everyday Life](#level-a2--everyday-life)
5. [Level B1 — Independence](#level-b1--independence)
6. [Level B2 — Fluency & Nuance](#level-b2--fluency--nuance)
7. [Gamification & Engagement Layer](#gamification--engagement-layer)
8. [Galician-Specific Teaching Notes](#galician-specific-teaching-notes)

---

## Design Philosophy

### Why This Order?

The curriculum follows five pedagogical principles:

1. **Immediate usefulness.** Learners should be able to say something real after the very first lesson. Greetings and "I am / my name is" come before abstract grammar because motivation dies if you can't *do* anything yet.

2. **Grammar as a byproduct.** Grammar is never taught in isolation. The learner encounters a pattern in context (e.g., "Eu son María"), then the app highlights the pattern ("son = I am"), then drills variations. Explicit grammar labels ("present indicative of ser") appear only in optional tip screens.

3. **Spiral progression.** Every grammar point resurfaces across later units in new contexts. The present tense of "ter" appears in Unit 2 (family — "Teño un irmán") and returns in Unit 5 (food — "Temos fame"), Unit 9 (health — "Ten febre"), etc.

4. **High-frequency-first vocabulary.** Word selection is driven by corpus frequency data. The 500 most frequent Galician words cover ~80% of everyday speech. We front-load these across A1–A2 rather than organizing purely by "topic."

5. **Contrastive awareness (Spanish interference).** Most learners will know Spanish. The curriculum deliberately surfaces Galician–Spanish differences early and often (e.g., "tenho" vs. "tengo," "facer" vs. "hacer," articles "o/a" vs. "el/la") with dedicated contrast exercises.

### Lesson Structure (Every Lesson)

Each lesson follows a consistent internal arc:

- **Warm-up (2–3 exercises):** Review material from previous lessons via spaced repetition. Keeps old words alive.
- **Introduction (3–4 exercises):** New vocabulary/grammar presented in context. Image-matching, listen-and-select, guided translation.
- **Practice (5–6 exercises):** Drilling the new material. Fill-in-the-blank, word ordering, multiple choice.
- **Integration (3–4 exercises):** Mix new and old material. Translate full sentences, dialogue completion, "select all correct" exercises.
- **Challenge (1–2 exercises):** Slightly above current level. Open translation, mini-dialogue, or cultural context question.

Total: ~15 exercises per lesson, ~3–5 minutes.

---

## Exercise Types Reference

Use this as a lookup when the curriculum references exercise types by code.

| Code | Exercise Type | Description | When to Use |
|------|--------------|-------------|-------------|
| `IMG_SELECT` | Image Select | Show 4 images, play/show a word, tap the correct image | New vocabulary introduction, concrete nouns |
| `MATCH_PAIRS` | Match Pairs | Drag to connect Galician words with translations (or images) | Vocabulary review, 4–6 pairs |
| `WORD_BANK_L1_L2` | Word Bank (to Galician) | Given a sentence in the user's language, build the Galician translation from a word bank | Core sentence-building, grammar practice |
| `WORD_BANK_L2_L1` | Word Bank (from Galician) | Given a Galician sentence, build translation from word bank | Reading comprehension, meaning check |
| `TYPE_L1_L2` | Free Type (to Galician) | Type the full Galician translation (no word bank) | Advanced practice, harder variation |
| `TYPE_L2_L1` | Free Type (from Galician) | Type the translation of a Galician sentence | Comprehension check |
| `FILL_BLANK` | Fill in the Blank | Galician sentence with one blank, choose from 3–4 options | Grammar drilling (verb forms, articles, prepositions) |
| `FILL_BLANK_TYPE` | Fill in the Blank (typed) | Same as above but the learner types the missing word | Harder recall version |
| `LISTEN_SELECT` | Listen & Select | Play audio, select the correct written sentence from 3 options | Listening discrimination, spelling patterns |
| `LISTEN_TYPE` | Listen & Type | Play audio, type what you hear | Dictation, spelling, phonetic awareness |
| `SELECT_CORRECT` | Select All Correct | Given a prompt, select all correct answers from 4–6 options | Plural/conjugation patterns, nuance |
| `DIALOGUE` | Dialogue Completion | A short conversation with one line missing; pick or type the response | Pragmatics, natural speech patterns |
| `SORT_SENTENCE` | Sort the Sentence | Given scrambled Galician words, arrange into correct order | Word order, syntax awareness |
| `CONTRAST` | Spanish–Galician Contrast | Show a Spanish sentence; ask "How would this be different in Galician?" with targeted options | Interference prevention, false friends |
| `CONTEXT_CLUE` | Context Clue | Short Galician paragraph with an underlined unknown word; guess meaning from context | Reading strategies, B1+ |
| `STORY` | Mini Story | 6–10 sentence narrative with interspersed comprehension questions | Engagement, integrated skills, end-of-unit |
| `SPEAK` | Speak | Prompt appears, learner records pronunciation, app gives feedback | Pronunciation practice (if app supports speech recognition) |
| `CULTURE_TIP` | Culture Tip Card | Non-graded informational card about Galician culture, shown between exercises | Engagement, cultural context |

---

## Level A1 — Foundations

**Goal:** Survive basic social situations. Introduce yourself, order food, ask simple questions, understand short phrases.

**Word target:** ~500 words by end of A1.

**Grammar by end of A1:** Present tense (ser, estar, ter, regular -ar/-er/-ir verbs), articles (o/a/os/as), basic prepositions (en, de, con, para, a), possessives, question words, numbers 0–100, hay/há.

---

### A1 · Unit 1 — Ola! (Hello!)

**Purpose:** Day-one survival. The learner can greet people, say their name, and say goodbye. Establishes the app's rhythm and builds instant confidence.

**Vocabulary (20 words):**
ola, bos días, boas tardes, boas noites, adeus, ata logo, por favor, grazas, de nada, si, non, eu, ti, el, ela, son, es, chámome, e, que tal

**Grammar focus:** `ser` (son, es, é) — only 3 forms, no explicit conjugation table yet.

**Lessons:**

#### Lesson 1: Greetings & Goodbyes
- **Teaches:** ola, bos días, boas tardes, boas noites, adeus, ata logo
- **Exercises:**
  1. `IMG_SELECT` — Hear "Bos días," select the morning image
  2. `IMG_SELECT` — Hear "Boas noites," select the night image
  3. `MATCH_PAIRS` — Match greetings to their time of day (4 pairs)
  4. `LISTEN_SELECT` — Play "Boas tardes," pick correct written form from 3
  5. `WORD_BANK_L1_L2` — "Good morning" → build "Bos días"
  6. `FILL_BLANK` — "Boa_ _oites" (spelling reinforcement)
  7. `DIALOGUE` — Person says "Ola!" — pick the response (Ola! / Grazas / Adeus)
  8. `WORD_BANK_L2_L1` — "Ata logo" → build "See you later"
  9. `LISTEN_TYPE` — Hear "Adeus," type it
  10. `SORT_SENTENCE` — Arrange: "días / Bos" → "Bos días"
  11. `DIALOGUE` — It's 9 PM, someone arrives. Pick the greeting.
  12. `CONTRAST` — Spanish "Buenas noches" → How is it in Galician? (Boas noites)
- **Tip screen:** "Galician uses 'bos' (masc.) and 'boas' (fem.) where Spanish uses 'buenos/buenas.' The adjective matches the noun!"

#### Lesson 2: My Name Is...
- **Teaches:** chámome, como te chamas?, son, eu, e (and), que tal
- **Exercises:**
  1. `LISTEN_SELECT` — "Chámome Ana" — select correct meaning
  2. `WORD_BANK_L1_L2` — "My name is Pedro" → "Chámome Pedro"
  3. `FILL_BLANK` — "_____ María" (Chámome / Son / Ola)
  4. `DIALOGUE` — "Ola! Como te chamas?" → pick "Chámome [name]"
  5. `WORD_BANK_L1_L2` — "I am Ana and he is Pedro" → "Eu son Ana e el é Pedro"
  6. `SORT_SENTENCE` — "chamas / te / Como / ?" → "Como te chamas?"
  7. `LISTEN_TYPE` — Hear "Que tal?" type it
  8. `DIALOGUE` — Two-turn exchange: greeting + name introduction
  9. `TYPE_L1_L2` — "Hello, my name is [user]"
  10. `CONTRAST` — Spanish "Me llamo" vs. Galician "Chámome" — note the structure difference
- **Tip screen:** "'Chámome' literally means 'I call myself.' It's one word! The verb 'chamar' (to call) will come back later."

#### Lesson 3: Please & Thank You
- **Teaches:** por favor, grazas, de nada, si, non, perdoa (excuse me)
- **Exercises:**
  1. `IMG_SELECT` — Situations: someone receiving a gift → "Grazas"
  2. `MATCH_PAIRS` — Galician ↔ meaning (6 pairs: por favor, grazas, de nada, si, non, perdoa)
  3. `LISTEN_SELECT` — "Grazas" — pick from 3 written options (tests z vs. c spelling)
  4. `DIALOGUE` — Someone hands you something. Respond.
  5. `WORD_BANK_L1_L2` — "No, thank you" → "Non, grazas"
  6. `FILL_BLANK` — "— Grazas! — De ____" (nada / favor / noche)
  7. `DIALOGUE` — You bump into someone → pick "Perdoa"
  8. `SORT_SENTENCE` — "favor / por / Auga / ," → "Auga, por favor"
  9. `WORD_BANK_L2_L1` — "Si, por favor" → "Yes, please"
  10. `TYPE_L1_L2` — "Excuse me, thank you"
  11. `CONTRAST` — Spanish "gracias" → Galician "grazas" (z, not ci)
- **Tip screen:** "Galician spelling is phonetic — 'grazas' has a z because you hear a /θ/ sound. No silent letters!"

#### Lesson 4: Review & Mini Story
- **Exercises:**
  1–4. Spaced repetition mix of all Unit 1 vocabulary
  5. `STORY` — "Ana arrives at a café. She says 'Bos días!' The waiter says 'Bos días! Como te chamas?' Ana says 'Chámome Ana, que tal?'..." (3 interspersed questions)
  6. `DIALOGUE` — Full 4-line conversation: greeting → name → how are you → goodbye
  7. `TYPE_L1_L2` — Free-type a greeting + name sentence
- **Culture tip:** "In Galicia, people often greet with two kisses on the cheek (like in much of Spain). 'Que tal?' is casual — like 'How's it going?'"

---

### A1 · Unit 2 — A miña familia (My Family)

**Purpose:** Introduce family vocabulary, possessives (meu/miña), and the verb "ter" (to have). Learners can say "I have a brother," "My mother is..." etc. This is motivating because talking about yourself and your people is deeply personal.

**Vocabulary (25 words):**
nai/mai, pai, irmán, irmá, fillo, filla, avó, avoa, home, muller, neno, nena, amigo, amiga, familia, meu, miña, teu, túa, seu, súa, ter (teño, tes, ten), un, unha, quen

**Grammar focus:** Possessives (meu/miña/teu/túa), ter (present: teño, tes, ten, temos, tedes, teñen), indefinite articles (un, unha), gender agreement.

**Lessons:**

#### Lesson 5: Mother, Father, Siblings
- **Teaches:** nai, pai, irmán, irmá, familia, un, unha
- **Exercises:**
  1. `IMG_SELECT` — Family tree image: "nai" → tap the mother
  2. `IMG_SELECT` — "irmá" → tap the sister
  3. `MATCH_PAIRS` — nai/pai/irmán/irmá with images (4 pairs)
  4. `LISTEN_SELECT` — "irmán" vs "irmá" — distinguish masculine/feminine
  5. `FILL_BLANK` — "Teño ___ irmá" (un / unha / o) — introduces "unha" before feminine nouns
  6. `WORD_BANK_L1_L2` — "I have a brother" → "Teño un irmán"
  7. `CONTRAST` — Spanish "hermano" → Galician "irmán" (completely different word!)
  8. `SORT_SENTENCE` — "un / Teño / e / irmán / irmá / unha" → "Teño un irmán e unha irmá"
  9. `FILL_BLANK` — "A miña ____ chámase Rosa" (nai / pai / irmán)
  10. `DIALOGUE` — "Tes irmáns?" → respond "Si, teño un irmán"
  11. `LISTEN_TYPE` — Hear "familia," type it
  12. `TYPE_L1_L2` — "I have a sister"
- **Tip screen:** "Galician kept the Latin root for 'brother/sister' — irmán/irmá (from Latin 'germanus'). Spanish replaced it with 'hermano.' You'll see this a lot — Galician often preserves older forms."

#### Lesson 6: My, Your, His/Her
- **Teaches:** meu, miña, teu, túa, seu, súa + revisiting family nouns
- **Exercises:**
  1. `FILL_BLANK` — "O ___ pai chámase Xosé" (meu / miña / meus)
  2. `FILL_BLANK` — "A ___ nai é profesora" (meu / miña / meus)
  3. `SELECT_CORRECT` — Which are correct? "o meu irmán" ✓ "a meu irmá" ✗ "a miña irmá" ✓ "o miña pai" ✗
  4. `WORD_BANK_L1_L2` — "Your sister" → "A túa irmá"
  5. `MATCH_PAIRS` — meu↔my(masc), miña↔my(fem), teu↔your(masc), túa↔your(fem)
  6. `SORT_SENTENCE` — "irmán / O / teu / Paulo / chámase" → "O teu irmán chámase Paulo"
  7. `FILL_BLANK` — "O ___ fillo ten tres anos" (seu / súa / seus)
  8. `WORD_BANK_L2_L1` — "A súa familia é grande" → "His/her family is big"
  9. `CONTRAST` — Spanish "mi hermana" (no article) vs. Galician "a miña irmá" (article + possessive)
  10. `TYPE_L1_L2` — "My father is called Manuel"
- **Tip screen:** "In Galician, possessives almost always come with the article: 'O MEU pai,' 'A MIÑA nai.' Spanish drops the article ('mi padre'), but Galician keeps it. Think of it as 'THE my father.'"

#### Lesson 7: The Verb "Ter" (To Have)
- **Teaches:** Full present conjugation: teño, tes, ten, temos, tedes, teñen
- **Exercises:**
  1. `FILL_BLANK` — "Eu ___ un can" (teño / tes / ten)
  2. `FILL_BLANK` — "Ti ___ unha irmá" (teño / tes / ten)
  3. `FILL_BLANK` — "El ___ dous fillos" (teño / tes / ten)
  4. `SELECT_CORRECT` — Select all correct: "Nós temos" ✓ "Nós teño" ✗ "Eles teñen" ✓ "Eles ten" ✗
  5. `MATCH_PAIRS` — Pronouns ↔ verb forms (eu/teño, ti/tes, el/ten, nós/temos)
  6. `WORD_BANK_L1_L2` — "We have a big family" → "Temos unha familia grande"
  7. `SORT_SENTENCE` — "teñen / Eles / nenos / dous" → "Eles teñen dous nenos"
  8. `CONTRAST` — Spanish "tengo, tienes, tiene" → Galician "teño, tes, ten" — note the ñ in different places
  9. `FILL_BLANK_TYPE` — "Vós ___ moitos amigos" (type: tedes)
  10. `DIALOGUE` — "Cantos irmáns tes?" → build response
  11. `TYPE_L1_L2` — "They have three children"
- **Tip screen:** "'Ter' is one of the most important verbs in Galician. Notice 'teño' — the ñ is in the first person (eu), not the third like Spanish 'tiene.'"

#### Lesson 8: Review — Family Portrait
- **Exercises:**
  1–3. Spaced repetition of Units 1–2
  4. `STORY` — "A miña familia: Chámome Brais. Teño unha irmá, chámase Sabela. O meu pai chámase Antón e a miña nai chámase Carme. Temos un can chamado Fiz." (4 comprehension questions interspersed)
  5. `DIALOGUE` — Multi-turn: introduce your family to someone
  6. `TYPE_L1_L2` — Describe your own family (2 sentences)
- **Culture tip:** "Galician names! Xosé, Brais, Sabela, Antón, Carme, Fiz — these are traditional Galician forms. Many have Latin or Celtic roots. 'Brais' comes from the patron saint of sore throats!"

---

### A1 · Unit 3 — Números e cores (Numbers & Colors)

**Purpose:** Numbers 0–20 (then 20–100 in a later lesson) and basic colors. These are high-utility and allow the learner to handle prices, ages, and descriptions.

**Vocabulary (30 words):**
cero, un/unha, dous/dúas, tres, catro, cinco, seis, sete, oito, nove, dez, once, doce, trece, catorce, quince, dezaseis, dezasete, dezaoito, dezanove, vinte, vermello, azul, verde, amarelo, branco, negro, laranxa, rosa, marrón

**Grammar focus:** Number-gender agreement (dous/dúas), adjective placement and agreement with colors.

**Lessons:**

#### Lesson 9: Numbers 0–10
- **Teaches:** cero through dez, cantos/cantas (how many)
- **Exercises:**
  1. `IMG_SELECT` — Show 3 apples → "tres"
  2. `MATCH_PAIRS` — Numerals ↔ Galician words (6 pairs)
  3. `LISTEN_TYPE` — Hear "sete," type it
  4. `FILL_BLANK` — "___ gatos" (showing 5 cats) → cinco
  5. `LISTEN_SELECT` — Distinguish "seis" vs "dez" (similar sounds)
  6. `WORD_BANK_L1_L2` — "I have four brothers" → "Teño catro irmáns"
  7. `FILL_BLANK` — "Teño ____ irmás" (showing 2 sisters) → dúas (not dous!)
  8. `CONTRAST` — Spanish "dos" (invariable) vs. Galician "dous/dúas" (gendered!)
  9. `SELECT_CORRECT` — "Dous gatos" ✓ "Dúas gatos" ✗ "Dúas gatas" ✓ "Dous gatas" ✗
  10. `TYPE_L1_L2` — "I have two sisters and one brother"
- **Tip screen:** "Galician counts differently depending on gender! 'Dous' for masculine, 'dúas' for feminine. Two boys = 'dous nenos.' Two girls = 'dúas nenas.' This also applies to 'un/unha' (one)."

#### Lesson 10: Numbers 11–20
- **Teaches:** once through vinte
- **Exercises:** (similar progression with new numbers, focus on dezaseis–dezanove pattern, which is more transparent than Spanish dieciséis)
  1. `MATCH_PAIRS` — 11–16 numerals ↔ words
  2. `LISTEN_SELECT` — Distinguish similar numbers (trece/catorce)
  3. `FILL_BLANK` — Price tags in a shop scenario
  4. `WORD_BANK_L1_L2` — "I am seventeen years old" → "Teño dezasete anos"
  5–10. (Progressive drilling, age-related sentences, "Cantos anos tes?")
  11. `CONTRAST` — Spanish "dieciséis" → Galician "dezaseis" — note the transparent "dez-a-seis" (ten-and-six) structure
- **Tip screen:** "Galician teens are beautifully logical: 'dezaseis' = dez + a + seis (ten and six). Much easier than Spanish's contracted forms!"

#### Lesson 11: Colors
- **Teaches:** vermello/a, azul, verde, amarelo/a, branco/a, negro/a, laranxa, rosa, marrón
- **Exercises:**
  1. `IMG_SELECT` — Red apple → "vermello"
  2. `IMG_SELECT` — Blue sky → "azul"
  3. `MATCH_PAIRS` — Color swatches ↔ Galician words
  4. `FILL_BLANK` — "A casa é ____" (showing a white house) → branca (not branco!)
  5. `SELECT_CORRECT` — "O coche vermello" ✓ "O coche vermella" ✗ "A casa vermella" ✓
  6. `WORD_BANK_L1_L2` — "The green book" → "O libro verde"
  7. `SORT_SENTENCE` — "azul / O / é / ceo" → "O ceo é azul"
  8. `CONTRAST` — Spanish "rojo" → Galician "vermello" (completely different! from Latin 'vermiculus')
  9. `FILL_BLANK` — "Dúas flores ____" (amarelas / amarelo / amarelos)
  10. `TYPE_L1_L2` — "The white house and the red car"
- **Tip screen:** "'Vermello' comes from Latin 'vermiculus' (little worm) — the cochineal insect used to make red dye. Spanish uses 'rojo' from Latin 'russus.' Different history, same beautiful red."

#### Lesson 12: Numbers 20–100 & Review
- **Teaches:** vinte, trinta, corenta, cincuenta, sesenta, setenta, oitenta, noventa, cen
- **Exercises:** (Counting pattern drilling, price exercises, combining with colors — "Vinte euros," "Corenta e cinco")
  1–6. Number pattern drills (vinte e un, vinte e dous...)
  7. `DIALOGUE` — Shopping scenario: "Canto custa?" "Trinta e cinco euros"
  8. `STORY` — Color-and-number-themed mini story about a market
  9–10. Mixed review of Units 1–3
- **Tip screen:** "Tens in Galician: trinta, corenta, cincuenta... Notice 'corenta' (not *cuarenta like Spanish). The Galician forms are often closer to Portuguese."

---

### A1 · Unit 4 — No café (At the Café)

**Purpose:** First real-world scenario. Order drinks and food, ask for the bill. Introduces key verbs (querer, poder) and the structure "Quero un/unha..."

**Vocabulary (25 words):**
café, auga, leite, cervexa, viño, zume, té, pan, bocadillo, torta, queixo, xamón, a conta, quero, queres, quere, podo, podes, pode, canto custa, aquí, alí, máis, menos, outro/outra

**Grammar focus:** Querer/poder (present, 3 forms), demonstratives introduction (este/esta), "canto custa?"

**Lessons:**

#### Lesson 13: Drinks
- **Teaches:** café, auga, leite, cervexa, viño, zume, té, quero, por favor
- **Exercises:**
  1. `IMG_SELECT` — Coffee cup → "café"
  2. `IMG_SELECT` — Wine glass → "viño"
  3. `MATCH_PAIRS` — Drink images ↔ words
  4. `WORD_BANK_L1_L2` — "I want a coffee, please" → "Quero un café, por favor"
  5. `FILL_BLANK` — "Quero ____ auga" (un / unha / o) → unha
  6. `LISTEN_SELECT` — "cervexa" — pick correct spelling from 3
  7. `DIALOGUE` — Waiter: "Que quere?" You: pick "Un café, por favor"
  8. `SORT_SENTENCE` — "favor / por / Un / viño / , / quero" → "Quero un viño, por favor"
  9. `CONTRAST` — Spanish "cerveza" → Galician "cervexa" (x not z — very common pattern!)
  10. `TYPE_L1_L2` — "I want a tea with milk"
- **Tip screen:** "The Galician 'x' often appears where Spanish has 'z' or 'j': cervexa, queixo, xamón. The 'x' is pronounced like English 'sh' — /ʃ/. 'Cervexa' = 'cer-VEH-sha.'"

#### Lesson 14: Food & Ordering
- **Teaches:** pan, bocadillo, torta, queixo, xamón, quero/queres/quere
- **Exercises:**
  1. `IMG_SELECT` — Cheese → "queixo"
  2. `MATCH_PAIRS` — Food items ↔ words
  3. `WORD_BANK_L1_L2` — "I want a ham sandwich" → "Quero un bocadillo de xamón"
  4. `FILL_BLANK` — "El ____ un café" (quero / queres / quere)
  5. `DIALOGUE` — Ordering for two: "Quero un café e ela quere un té"
  6. `FILL_BLANK` — "Un bocadillo de ____ e ____" (queixo / xamón) — combine two items
  7. `SORT_SENTENCE` — "queixo / de / bocadillo / Un / quero" → "Quero un bocadillo de queixo"
  8. `LISTEN_TYPE` — Hear "xamón," type it
  9. `CONTRAST` — Spanish "queso" / "jamón" → Galician "queixo" / "xamón"
  10. `TYPE_L1_L2` — "She wants bread and cheese"
- **Tip screen:** "Galician cuisine is famous! 'Queixo' (cheese) — try queixo de tetilla, a creamy breast-shaped cheese from Galicia. 'Xamón' — Galicia's cured ham is world-class."

#### Lesson 15: How Much & The Bill
- **Teaches:** canto custa, a conta, euro, caro, barato, outro/outra, máis
- **Exercises:**
  1. `LISTEN_SELECT` — "Canto custa?" — select correct meaning
  2. `WORD_BANK_L1_L2` — "How much does it cost?" → "Canto custa?"
  3. `DIALOGUE` — "Canto custa o café?" → "Dous euros"
  4. `FILL_BLANK` — "É moi ____" (caro / barato) — showing a high price
  5. `WORD_BANK_L1_L2` — "Another coffee, please" → "Outro café, por favor"
  6. `FILL_BLANK` — "_____ cervexa, por favor" (Outro / Outra) → Outra (feminine!)
  7. `DIALOGUE` — "A conta, por favor" + paying scenario
  8. `SORT_SENTENCE` — "custa / Canto / cervexa / a / ?" → "Canto custa a cervexa?"
  9. `TYPE_L1_L2` — "The bill, please. How much is it?"
  10. `STORY` — Full café scene: enter, greet, order, ask price, pay, leave
- **Culture tip:** "In Galician cafés, it's common to have a 'pincho' (small snack) with your drink, often included in the price. Café culture is central to Galician social life."

#### Lesson 16: Review — Café Roleplay
- Full spaced repetition of Units 1–4
- Extended `STORY` with a complete café visit
- `DIALOGUE` chains — 6-turn conversation
- Mixed `TYPE_L1_L2` sentences combining family, numbers, and café vocabulary

---

### A1 · Unit 5 — Ser e estar (Being)

**Purpose:** Tackle the ser/estar distinction with Galician-specific usage. Crucial grammar that underpins everything.

**Vocabulary (20 words):**
ser (son, es, é, somos, sodes, son), estar (estou, estás, está, estamos, estades, están), ben, mal, contento/a, canso/a, enfermo/a, aquí, alí, grande, pequeno/a, novo/a, vello/a, bonito/a, alto/a, baixo/a, galego/a, español/a, de, en

**Grammar focus:** Full present conjugation of ser and estar, when to use each, nationality/origin (ser de), location (estar en), adjective agreement.

**Lessons:**

#### Lesson 17: "Ser" — Identity & Characteristics
- **Teaches:** son, es, é, somos, sodes, son + adjectives for identity
- **Exercises:**
  1. `FILL_BLANK` — "Eu ___ galego" (son / estou / teño)
  2. `FILL_BLANK` — "Ela ___ profesora" (é / está / ten)
  3. `WORD_BANK_L1_L2` — "I am Spanish" → "Son español/a"
  4. `SELECT_CORRECT` — Select uses of "ser": identity ✓ location ✗ characteristics ✓ temporary state ✗
  5. `MATCH_PAIRS` — Pronoun ↔ ser form (6 pairs)
  6. `WORD_BANK_L1_L2` — "We are Galician" → "Somos galegos"
  7. `SORT_SENTENCE` — "alta / é / Ela / e / bonita" → "Ela é alta e bonita"
  8. `FILL_BLANK` — "O meu pai ___ alto" (é / está) → é (permanent characteristic)
  9. `TYPE_L1_L2` — "My mother is a doctor. She is very good."
  10. `CONTRAST` — Note: Galician "sodes" (vós) vs Spanish "sois" — Galician preserves the -d-
- **Tip screen:** "'Ser' is for things that define you: identity, profession, origin, inherent qualities. 'Son galego' (I am Galician) — that's who you are."

#### Lesson 18: "Estar" — States & Locations
- **Teaches:** estou, estás, está, estamos, estades, están + ben/mal/contento/canso/enfermo + locations
- **Exercises:**
  1. `FILL_BLANK` — "Eu ___ ben, grazas" (son / estou) → estou
  2. `FILL_BLANK` — "O café ___ aquí" (é / está) → está
  3. `WORD_BANK_L1_L2` — "I am tired" → "Estou canso/a"
  4. `FILL_BLANK` — "Eles ___ en Santiago" (son / están) → están
  5. `DIALOGUE` — "Que tal?" → "Estou ben, e ti?"
  6. `SELECT_CORRECT` — "Estar" uses: location ✓ mood ✓ nationality ✗ profession ✗
  7. `WORD_BANK_L1_L2` — "She is happy" → "Ela está contenta"
  8. `SORT_SENTENCE` — "casa / Estamos / na" → "Estamos na casa"
  9. `FILL_BLANK_TYPE` — "Onde ___?" (estás — type it)
  10. `TYPE_L1_L2` — "We are in the café. We are happy."
- **Tip screen:** "'Estar' is for how you feel right now and where you are right now. 'Estou canso' — I'm tired (right now, not as a personality trait!)."

#### Lesson 19: Ser vs. Estar — The Contrast
- **Teaches:** Contrastive exercises mixing both verbs
- **Exercises:**
  1. `FILL_BLANK` — "María ___ de Vigo" (é / está) → é (origin)
  2. `FILL_BLANK` — "María ___ en Vigo" (é / está) → está (location)
  3. `FILL_BLANK` — "O café ___ quente" (é / está) → está (temporary state)
  4. `FILL_BLANK` — "O café ___ bo" (é / está) → é (inherent quality)
  5. `SELECT_CORRECT` — For each sentence, pick ser or estar (6 mini-exercises)
  6. `WORD_BANK_L1_L2` — "He is tall but he is tired" → "El é alto pero está canso"
  7. `DIALOGUE` — Mixed conversation using both
  8. `STORY` — Descriptive paragraph about a person (uses both ser and estar)
  9. `TYPE_L1_L2` — "My friend is Galician. She is in Santiago. She is happy."
  10. `CONTRAST` — Cases where Galician uses estar differently from Spanish (if any)
- **Tip screen:** "Quick rule of thumb: SER = the clock, the calendar, and who you ARE. ESTAR = the map, the mood, and how you FEEL."

#### Lesson 20: Unit Review & Checkpoint
- Spaced repetition across all Unit 5 material
- Mixed ser/estar exercises in new contexts
- `STORY` — Meeting someone new: introductions, where they're from, how they're doing
- **Checkpoint quiz:** 10 scored questions covering Units 1–5 (must score 80%+ to unlock Unit 6)

---

### A1 · Unit 6 — O día a día (Daily Life)

**Purpose:** Daily routine vocabulary and regular present-tense -ar verbs. The learner can describe what they do in a typical day.

**Vocabulary (25 words):**
espertar, levantarse, comer, beber, durmir, traballar, estudar, falar, vivir, ir (vou, vas, vai, imos, ides, van), casa, escola, traballo, mañá, tarde, noite, sempre, ás veces, nunca, hoxe, mañá (tomorrow), pronto, tarde (late)

**Grammar focus:** Regular -ar verbs (full conjugation: -o, -as, -a, -amos, -ades, -an), reflexive "levantarse," ir (irregular present), time adverbs.

**Lessons:**

#### Lesson 21: Morning Routine (-AR Verbs)
- **Teaches:** espertar, levantarse, falar, traballar, estudar + regular -ar pattern
- **Exercises:**
  1. `IMG_SELECT` — Person waking up → "espertar"
  2. `FILL_BLANK` — "Eu espert___ ás oito" (-o / -as / -a) → -o
  3. `FILL_BLANK` — "Ela traballa___ no hospital" → ERROR: show "traballa" is already conjugated
  4. Actually: `FILL_BLANK` — "Ela ___ no hospital" (traballo / traballas / traballa) → traballa
  5. `MATCH_PAIRS` — -AR verb endings: eu/-o, ti/-as, el/-a, nós/-amos
  6. `WORD_BANK_L1_L2` — "I wake up at seven" → "Esperto ás sete"
  7. `SORT_SENTENCE` — "levántome / Eu / sete / ás" → "Eu levántome ás sete"
  8. `FILL_BLANK` — "Nós _____ galego" (falamos / falas / falan) → falamos
  9. `SELECT_CORRECT` — Correct forms: "Eu traballo" ✓ "Ti traballas" ✓ "El traballo" ✗ "Nós traballan" ✗
  10. `TYPE_L1_L2` — "I wake up and she works"
- **Tip screen:** "Regular -AR verbs are the biggest group in Galician. Learn the pattern once and you can conjugate hundreds of verbs: falar (to speak), traballar (to work), estudar (to study), comprar (to buy)..."

#### Lesson 22: The Verb "Ir" (To Go)
- **Teaches:** vou, vas, vai, imos, ides, van + a/á/ao/ó + places
- **Exercises:**
  1. `FILL_BLANK` — "Eu ___ á escola" (vou / vas / vai)
  2. `MATCH_PAIRS` — Pronoun ↔ ir form
  3. `WORD_BANK_L1_L2` — "I go to work" → "Vou ao traballo"
  4. `FILL_BLANK` — "Nós ___ á praia" (vou / imos / van) → imos
  5. `CONTRAST` — Spanish "vamos" → Galician "imos" (quite different!)
  6. `FILL_BLANK` — "Van ___ casa" (a / á / ao) → á (a + a = á)
  7. `SORT_SENTENCE` — "escola / van / á / Eles" → "Eles van á escola"
  8. `DIALOGUE` — "Onde vas?" → "Vou ao café"
  9. `SELECT_CORRECT` — Contractions: "a + o = ao" ✓ "a + a = á" ✓ "a + o = ó" ✗ (actually "ó" does exist in some dialects — simplify for A1)
  10. `TYPE_L1_L2` — "We go to school in the morning"
- **Tip screen:** "'Imos' (we go) is uniquely Galician — Spanish says 'vamos.' Also notice the contractions: 'a + o = ao,' 'a + a = á.' These are everywhere in Galician!"

#### Lesson 23: My Day (Routine)
- **Teaches:** Combining verbs into a daily routine narrative, time expressions
- **Exercises:**
  1. `SORT_SENTENCE` — Build a routine sentence from scrambled parts
  2. `WORD_BANK_L1_L2` — "I always study in the afternoon" → "Sempre estudo pola tarde"
  3. `FILL_BLANK` — "_____ como na casa" (Sempre / Ás veces / Nunca) — contextual
  4. `DIALOGUE` — "Que fas pola mañá?" → describe morning routine
  5. `STORY` — "O día de Xoán" — a full day from waking to sleeping, 4 comprehension Qs
  6. `TYPE_L1_L2` — Write 2 sentences about your daily routine
  7–10. Spaced repetition mixing Units 1–6
- **Culture tip:** "Galician mealtimes: 'xantar' (lunch) is the big meal, usually 2–3 PM. 'Cea' (dinner) is lighter, around 9–10 PM. 'Almorzo' is breakfast. The rhythm of the day revolves around xantar!"

#### Lesson 24: Review & Checkpoint
- Full review of A1 Units 1–6
- Extended `STORY` combining all themes
- Checkpoint quiz: must score 80%+ to proceed

---

### A1 · Unit 7 — A casa e a cidade (Home & City)

**Purpose:** Describe your home and navigate a city. Introduces "haber" (hai = there is/are), prepositions of place, and common locations.

**Vocabulary (25 words):**
casa, cuarto, cociña, baño, sala, rúa, praza, tenda, supermercado, farmacia, hospital, igrexa, parque, praia, río, hai (there is/are), preto de, lonxe de, enfronte de, detrás de, ao lado de, entre, arriba, abaixo, dentro

**Grammar focus:** Hai (there is/are — invariable), prepositions of place, contractions (no, na, do, da, polo, pola), definite articles with locations.

**Lessons:**

#### Lesson 25: Rooms in the House
- Focus: casa, cuarto, cociña, baño, sala + hai
- Exercises emphasize "Na miña casa hai..." structure

#### Lesson 26: Around Town
- Focus: rúa, praza, tenda, farmacia, hospital, igrexa, praia
- Exercises: giving/understanding simple directions, "Hai unha farmacia preto de aquí?"

#### Lesson 27: Prepositions of Place
- Focus: preto de, lonxe de, enfronte de, detrás de, ao lado de
- Exercises: describing where things are on a map/image

#### Lesson 28: Review & Contractions Deep Dive
- Focus: en + o = no, en + a = na, de + o = do, de + a = da, por + o = polo, por + a = pola
- `CONTRAST` — Spanish "en el" vs Galician "no," Spanish "de la" vs Galician "da"
- Checkpoint quiz

---

### A1 · Unit 8 — Que hora é? (What Time Is It?)

**Purpose:** Tell time, days of the week, months, make plans. Introduces near future with "ir + infinitive."

**Vocabulary (25 words):**
hora, minuto, mediodía, medianoite, luns, martes, mércores, xoves, venres, sábado, domingo, semana, mes, xaneiro, febreiro, marzo, abril, maio, xuño, xullo, agosto, setembro, outubro, novembro, decembro

**Grammar focus:** Telling time ("É a unha," "Son as dúas"), ir + infinitive (near future), days/months (no capitals in Galician).

**Lessons:**

#### Lesson 29: Telling Time
- "Que hora é?" "É a unha" / "Son as tres e media" / "Son as catro menos cuarto"
- Note Galician-specific: feminine articles with hours ("Son AS dúas" not "Son os dous")

#### Lesson 30: Days & Months
- Days and months in Galician (note: xoves, mércores, xaneiro, febreiro — different from Spanish!)
- `CONTRAST` — Spanish "jueves" → Galician "xoves," Spanish "enero" → Galician "xaneiro"

#### Lesson 31: Making Plans (ir + infinitive)
- "Vou comer ás dúas" / "Imos ir á praia o sábado"
- Combines ir (Unit 6) with new infinitives

#### Lesson 32: A1 Final Review & Story
- Comprehensive review of all 8 units
- Extended story using all A1 grammar and vocabulary
- **A1 Completion Checkpoint** — scored test, certificate/badge

---

## Level A2 — Everyday Life

**Goal:** Handle common everyday situations with some independence. Describe experiences, habits, make comparisons, talk about the past.

**Word target:** ~1,000 words cumulative by end of A2.

**Grammar by end of A2:** Past tenses (pretérito perfecto, pretérito imperfecto), comparison, direct/indirect object pronouns, imperative (basic), reflexive verbs, conjunctions (pero, porque, cando, mentres).

---

### A2 · Unit 9 — A comida galega (Galician Food)

**Purpose:** Expand food vocabulary significantly with culturally authentic Galician dishes. Introduces -er/-ir verb conjugation patterns.

**Vocabulary (30 words):**
polbo, marisco, mexillón, peixe, carne, polo, empanada, caldo galego, filloas, pementos de Padrón, pataca, cenoria, tomate, cebola, alface, froita, mazá, laranxa (fruit), pera, comer, beber, cociñar, preparar, probar, gustar, encantar, preferir, necesitar, prato, receita

**Grammar focus:** Regular -er verbs (como, comes, come, comemos, comedes, comen), regular -ir verbs (vivir pattern), gustar/encantar construction ("Gústame o polbo").

**Lessons:**

#### Lesson 33: Galician Dishes
- polbo á feira, empanada, caldo galego, filloas, pementos de Padrón
- `CULTURE_TIP` — Each dish with cultural context
- `IMG_SELECT` with real Galician food imagery

#### Lesson 34: Ingredients
- Vegetables, fruits, meats, seafood vocabulary
- -ER verb conjugation drills with "comer"

#### Lesson 35: I Like / I Don't Like (Gustar)
- "Gústame o polbo" / "Non me gusta a carne" / "Encántame o marisco"
- Note the inverted construction — the thing you like is the subject
- `CONTRAST` — Same structure as Spanish but watch: "Gústame" not "Me gusta" word order

#### Lesson 36: At the Restaurant
- Full restaurant dialogue: ordering, asking about dishes, expressing preferences
- `STORY` — Dinner out in Santiago de Compostela

---

### A2 · Unit 10 — O pretérito (The Past - Part 1)

**Purpose:** First past tense — pretérito perfecto (simple past). This is the most important grammar leap in A2.

**Vocabulary (20 words):**
onte (yesterday), a semana pasada, o mes pasado, o ano pasado, antes, despois, logo, primeiro, xa, aínda, acabar de, ir (fun, fuches, foi, fomos, fostes, foron), facer (fixen, fixeches, fixo, fixemos, fixestes, fixeron), comer (comín, comiches...), falar (falei, falaches...)

**Grammar focus:** Pretérito perfecto of regular -ar/-er/-ir verbs + key irregulars (ir/ser → fun, facer → fixen, ter → tiven).

**Lessons:**

#### Lesson 37: What Did You Do Yesterday? (-AR Past)
- Regular -ar past: falei, falaches, falou, falamos, falastes, falaron
- "Onte falei co meu pai"

#### Lesson 38: -ER/-IR Past Tense
- Regular -er/-ir past: comín, comiches, comeu, comemos, comestes, comeron
- "Comemos polbo no restaurante"

#### Lesson 39: Irregular Past — Ir, Facer, Ter
- fun/foi/fomos, fixen/fixo/fixemos, tiven/tivo/tivemos
- `CONTRAST` — Galician "fixen" vs Spanish "hice," Galician "fun" vs Spanish "fui"

#### Lesson 40: Telling a Story
- Combine past tenses into narrative
- `STORY` — "A viaxe de Marta" — a trip story using past tense throughout
- Time expressions: onte, a semana pasada, primeiro... despois... logo

---

### A2 · Unit 11 — O tempo e a roupa (Weather & Clothing)

**Purpose:** Talk about weather (very relevant in rainy Galicia!) and clothing. Introduces impersonal constructions.

**Vocabulary (25 words):**
chover (chove), sol, vento, frío, calor, neve, néboa, nube, chuvia, tempo, camiseta, pantalón, vestido, chaqueta, zapatos, botas, paraugas, gorro, poñer, quitar, levar (to wear), abrigarse, hoxe chove, fai frío, fai calor, hai sol, hai néboa

**Grammar focus:** Impersonal weather expressions (chove, fai frío, hai néboa), verb "levar" for wearing clothes, demonstratives (este/ese/aquel).

**Lessons:**

#### Lesson 41: The Weather
- "Chove moito en Galicia!" — iconic
- `CULTURE_TIP` — "In Galicia, there's a word for every type of rain: orballo (drizzle), sarabia (hail), babuña (mist-rain)..."

#### Lesson 42: Clothing
- Basic clothing + "Levo unha chaqueta porque chove"

#### Lesson 43: This, That, That Over There
- Este/esta/estes/estas, ese/esa, aquel/aquela
- Applied to clothing and weather contexts

#### Lesson 44: Review — What's the Weather Like?
- Full weather + clothing integration
- `DIALOGUE` — Planning what to wear based on weather

---

### A2 · Unit 12 — Pretérito imperfecto (The Past - Part 2)

**Purpose:** The imperfect tense for habitual past actions and descriptions. Combined with pretérito perfecto for storytelling.

**Vocabulary (15 new words + grammar focus):**
cando era neno/a, antes, sempre, normalmente, cada día, mentres, recordar, soñar, pensar, sentir, saber, coñecer, parecer, crer, querer (past)

**Grammar focus:** Imperfect of -ar (falaba, falabas...), -er (comía, comías...), -ir (vivía, vivías...). Irregular imperfects: ser (era), ir (ía), ter (tiña).

**Lessons:**

#### Lesson 45: When I Was Young (-AR Imperfect)
- "Cando era neno, xogaba no parque todos os días"
- Regular -ar imperfect pattern: -aba, -abas, -aba, -abamos, -abades, -aban

#### Lesson 46: -ER/-IR Imperfect + Irregulars
- -ía, -ías, -ía, -iamos, -iades, -ían
- "Vivía en Vigo," "Tiñamos un can"

#### Lesson 47: Imperfect vs. Pretérito
- The crucial distinction: "Chovía cando saín da casa" (it was raining when I left)
- Imperfect = background/ongoing, Pretérito = completed action
- `STORY` — Narrative that weaves both tenses

#### Lesson 48: A2 Midpoint Checkpoint
- Comprehensive review of A2 Units 9–12
- Scored test

---

### A2 · Unit 13 — A saúde (Health)

**Purpose:** Health vocabulary, body parts, expressing pain/illness. Practical and high-stakes scenario.

**Vocabulary (25 words):**
cabeza, brazo, perna, man, pe, costas, estómago, ollo, orella, boca, dente, dor, doer (dóeme), febre, gripe, constipado, médico/a, enfermeiro/a, receita (prescription), pastilla, descansar, sentirse (séntome), mellor, peor, doente

**Grammar focus:** Doer construction (like gustar: "Dóeme a cabeza"), reflexive verbs (sentirse), body parts with definite article.

**Lessons:**

#### Lesson 49: Body Parts
- IMG_SELECT-heavy lesson for body vocabulary
- "O brazo," "A perna" — gender of body parts

#### Lesson 50: It Hurts (Doer)
- "Dóeme a cabeza" / "Dóenme as costas"
- Same inverted construction as gustar

#### Lesson 51: At the Doctor
- Full medical scenario dialogue
- "Que lle pasa?" "Téñome febre e dóeme a gorxa"

#### Lesson 52: Review & Story
- `STORY` — Going to the doctor in a Galician town

---

### A2 · Unit 14 — Comparacións e opinións (Comparisons & Opinions)

**Purpose:** Make comparisons, express opinions. Grammatically enables more nuanced expression.

**Vocabulary (20 words):**
máis... ca/que, menos... ca/que, tan... coma, o/a mellor, o/a peor, o/a máis, o/a menos, penso que, creo que, paréceme que, na miña opinión, estou de acordo, non estou de acordo, é verdade, é mentira, seguro, claro, sen dúbida, quizais, talvez

**Grammar focus:** Comparative structures (máis... ca, menos... ca, tan... coma), superlatives (o máis... de), opinion expressions.

**Lessons:**

#### Lesson 53: More Than, Less Than
- "Santiago é máis bonito ca Lugo" (note: "ca" not "que" before nouns in standard Galician!)
- `CONTRAST` — Galician "ca" vs Spanish "que" in comparisons

#### Lesson 54: The Best, The Worst (Superlatives)
- "A mellor comida de Galicia" / "O peor tempo do ano"

#### Lesson 55: In My Opinion
- "Penso que..." / "Paréceme que..." / "Na miña opinión..."
- `DIALOGUE` — Debating which Galician city is best

#### Lesson 56: A2 Review & Story
- `STORY` — Comparing two Galician cities (Vigo vs. A Coruña)
- Integration of comparison + past tenses + food + weather

---

### A2 · Unit 15 — Pronomes (Object Pronouns)

**Purpose:** Direct and indirect object pronouns. Complex but essential for natural speech.

**Vocabulary (grammar-heavy unit, ~10 new words):**
me, te, lle, nos, vos, lles, o/a/os/as (direct object), dar, dicir, escribir, mandar, preguntar, explicar, mostrar, contar, pedir, ofrecer

**Grammar focus:** Indirect object pronouns (me, te, lle, nos, vos, lles), direct object pronouns (o, a, os, as), pronoun placement (proclisis vs. enclisis — a key Galician feature), combined pronouns.

**Lessons:**

#### Lesson 57: Indirect Object Pronouns
- "Díxenlle a verdade" (I told her/him the truth)
- Me, te, lle, nos, vos, lles

#### Lesson 58: Direct Object Pronouns
- "Cómeo todos os días" (I eat it every day)
- O, a, os, as

#### Lesson 59: Pronoun Placement — The Galician Rule
- **Critical Galician-specific lesson:** In Galician, pronouns go BEFORE the verb (proclisis) in most cases but AFTER (enclisis) in specific situations
- "Non o fixen" (before — negation triggers proclisis)
- "Fíxeno onte" (after — affirmative main clause)
- `CONTRAST` — This is very different from Spanish! "Lo hice" (always before in spoken Spanish) vs. Galician's strict rules

#### Lesson 60: A2 Final Review & Checkpoint
- Comprehensive A2 review across all units
- Extended narrative exercise
- **A2 Completion Checkpoint** — scored test, certificate/badge

---

## Level B1 — Independence

**Goal:** Handle most situations while traveling in Galicia. Express opinions, hopes, plans, and hypotheticals. Understand main points of clear standard speech.

**Word target:** ~2,000 words cumulative by end of B1.

**Grammar by end of B1:** Subjunctive (present), conditional, future tense, relative clauses, passive voice, reported speech, personal infinitive (unique to Galician/Portuguese).

---

### B1 · Unit 16 — Viaxar por Galicia (Traveling Through Galicia)

**Purpose:** Travel vocabulary with rich cultural content. The Camino de Santiago, the Rías Baixas, etc.

**Vocabulary (30 words):**
viaxe, viaxar, billete, tren, autobús, avión, estación, aeroporto, hotel, albergue, reserva, reservar, habitación, maleta, mapa, camiño (path), peregrino, catedral, costa, ría, illa, faro, porto, aldea, vila, paisaxe, montaña, val, bosque, carballeira (oak grove)

**Grammar focus:** Future tense (regular: falarei, falarás, falará, falaremos, falaredes, falarán + irregulars), conditional introduction.

**Lessons:**

#### Lesson 61: Travel Basics
- Transport, booking, accommodation vocabulary
- Future tense with travel plans: "Viaxarei a Santiago en maio"

#### Lesson 62: The Future Tense
- Regular formation + key irregulars (ter → terei, facer → farei, dicir → direi, poder → poderei)
- `CONTRAST` — Galician "farei" vs Spanish "haré"

#### Lesson 63: The Camino de Santiago
- Cultural deep-dive unit
- Vocabulary: peregrino, albergue, etapa, credencial, Camiño de Santiago
- `STORY` — A pilgrim's day on the Camino
- `CULTURE_TIP` — History and significance of the Camino

#### Lesson 64: The Galician Coast
- Rías Baixas, illas Cíes, faro, costa, praia
- `STORY` — Day trip to the Illas Cíes
- Review + future tense integration

---

### B1 · Unit 17 — O condicional (The Conditional)

**Purpose:** Express hypotheticals, polite requests, wishes.

**Grammar focus:** Conditional mood (falaría, falarías, falaría, falariamos, falaríades, falarían), "se + imperfect subjunctive" (introduced lightly).

**Lessons:**

#### Lesson 65: I Would Like... (Conditional)
- "Gustaríame viaxar a Galicia" / "Querería un café"
- Polite requests and wishes

#### Lesson 66: What Would You Do?
- Hypothetical scenarios: "Se tivese diñeiro, compraría unha casa na praia"
- Light introduction to imperfect subjunctive (only in fixed phrases for now)

#### Lesson 67: Advice & Recommendations
- "Deberías probar o polbo" / "Poderías visitar Santiago"
- Conditional of deber, poder, querer

#### Lesson 68: Review
- Integration of conditional with travel vocabulary
- `STORY` — Planning a dream trip to Galicia

---

### B1 · Unit 18 — O subxuntivo presente (Present Subjunctive)

**Purpose:** The subjunctive is essential for natural Galician. Introduced through common triggers.

**Grammar focus:** Present subjunctive formation, triggers (quero que, espero que, é necesario que, non creo que, para que, cando + future meaning).

**Lessons:**

#### Lesson 69: Formation
- Regular: fale, fales, fale, falemos, faledes, falen (-ar); coma, comas (-er); viva, vivas (-ir)
- Key irregulars: sexa (ser), estea (estar), teña (ter), vaia (ir), faga (facer), poida (poder), saiba (saber)
- `CONTRAST` — Galician "sexa" vs Spanish "sea," "teña" vs "tenga"

#### Lesson 70: Wishes & Desires
- "Quero que veñas á festa" / "Espero que esteas ben"
- Trigger: querer que, esperar que, desexar que

#### Lesson 71: Doubt & Opinion
- "Non creo que sexa verdade" / "Dúbido que poida vir"
- Trigger: non creo que, dúbido que, é posíbel que

#### Lesson 72: Purpose & Time
- "Fágoo para que entendas" / "Cando chegues, chámame"
- Trigger: para que, antes de que, cando (future meaning)

---

### B1 · Unit 19 — O infinitivo persoal (The Personal Infinitive)

**Purpose:** This is a uniquely Galician (and Portuguese) feature that doesn't exist in Spanish. It's a defining characteristic of the language and very practical.

**Grammar focus:** The personal (inflected) infinitive: falar → falar, falares, falar, falarmos, falardes, falaren. Used when the infinitive has its own explicit subject different from the main verb's subject.

**Lessons:**

#### Lesson 73: What Is the Personal Infinitive?
- "É importante falarmos galego" (It's important that WE speak Galician — the infinitive has its own subject "nós")
- Compare: "É importante falar galego" (generic — anyone speaking Galician)
- `CONTRAST` — This does NOT exist in Spanish! It's a superpower of Galician.

#### Lesson 74: Common Uses
- "Para entendermos mellor..." / "Antes de saírmos..." / "Ao chegardes vós..."
- After prepositions when the infinitive clause has a different subject

#### Lesson 75: Practice & Integration
- Mixed exercises with regular infinitive vs. personal infinitive
- `STORY` — Narrative using personal infinitive naturally

#### Lesson 76: B1 Midpoint Checkpoint
- Comprehensive review of B1 Units 16–19
- Scored test

---

### B1 · Unit 20 — A cultura galega (Galician Culture)

**Purpose:** Cultural literacy unit. Music, literature, festivals. Enables the learner to discuss cultural topics.

**Vocabulary (25 words):**
gaita (bagpipe), pandeireta, muiñeira (dance), foliada, festa, romaría, entroido (carnival), magosto (chestnut festival), San Xoán, noite de San Xoán, queimada, conxuro, escritor/a, poeta, cantante, canción, literatura, lingua, galeguismo, morriña (homesickness/longing — untranslatable!), saudade, terra, pobo, tradición, patrimonio

**Grammar focus:** Relative clauses (que, quen, onde, o cal/a cal), reported speech introduction.

**Lessons:**

#### Lesson 77: Music & Dance
- Gaita, muiñeira, pandeireta, foliada
- `CULTURE_TIP` — "The gaita (Galician bagpipe) is the symbol of Galician identity. Celtic roots!"

#### Lesson 78: Festivals & Traditions
- Entroido, romaría, magosto, San Xoán, queimada
- `STORY` — A noite de San Xoán (bonfires, witchcraft, celebration)

#### Lesson 79: Language & Identity
- Galego, lingua, galeguismo, morriña, saudade
- `CULTURE_TIP` — "Morriña and saudade: untranslatable words for the longing a Galician feels for their homeland. Central to Galician identity."
- Discussion vocabulary: "A lingua galega é..."

#### Lesson 80: Review
- Cultural vocabulary integration
- `STORY` — Attending a romaría

---

### B1 · Unit 21 — Traballo e futuro (Work & Future)

**Purpose:** Professional vocabulary, talking about plans, ambitions, career.

**Vocabulary (25 words):**
traballo, empresa, oficina, xefe/a, compañeiro/a, reunión, entrevista, curriculum, salario, vacación, experiencia, formación, carreira, profesión, buscar, atopar, gañar, perder, conseguir, dedicarse a, encargarse de, xubilarse, contrato, paro (unemployment), oportunidade

**Grammar focus:** Future tense consolidation, conditional review, "penso + infinitive" for plans, "levar + gerund" (progressive), subjunctive with future-oriented expressions.

**Lessons:**

#### Lesson 81: At Work
- Office and professional vocabulary
- "Traballo nunha empresa en Vigo"

#### Lesson 82: Job Interview
- `DIALOGUE`-heavy lesson simulating an interview
- "Dedicoume á ensinanza" / "Teño experiencia en..."

#### Lesson 83: Plans & Ambitions
- "Penso traballar en Galicia" / "Gustaríame conseguir un bo traballo"
- Combining future, conditional, and subjunctive

#### Lesson 84: Review & B1 Final Checkpoint
- Comprehensive B1 review
- Extended `STORY` — A job interview in Santiago
- **B1 Completion Checkpoint** — scored test, certificate/badge

---

## Level B2 — Fluency & Nuance

**Goal:** Interact with native speakers with ease. Understand complex texts, express viewpoints clearly, handle abstract topics.

**Word target:** ~3,500 words cumulative by end of B2.

**Grammar by end of B2:** Past subjunctive, pluperfect, compound tenses, complex sentence structures, idiomatic expressions, register variation, advanced pronoun placement.

---

### B2 · Unit 22 — Subxuntivo imperfecto (Past Subjunctive)

**Purpose:** Full command of the subjunctive system. Hypotheticals, unfulfilled conditions, wishes about the past.

**Grammar focus:** Imperfect subjunctive (falase/falases/falase/falásemos/falásedes/falasen OR the -ra forms: falara/falaras/falara...), "se + imperfect subjunctive + conditional" sentences.

**Lessons:**

#### Lesson 85: Formation
- Both forms (-se and -ra): "Se tivese/tivera tempo, iría a Galicia"
- `CONTRAST` — Both forms exist in Galician (as in Spanish) but -se is more common in standard Galician

#### Lesson 86: If I Were... (Hypotheticals)
- "Se fose rico, compraría un barco nas Rías Baixas"
- Full conditional sentences

#### Lesson 87: Wishes About the Past
- "Oxalá fose á festa!" / "Gustaríame que viñeses"
- Combining with "oxalá" (if only)

#### Lesson 88: Review
- Complex conditional sentences
- `STORY` — "Se puidese volver atrás..." — a reflective narrative

---

### B2 · Unit 23 — Tempos compostos (Compound Tenses)

**Purpose:** Pluperfect ("I had done"), present perfect ("I have done"), and compound conditionals.

**Grammar focus:** Auxiliary "ter" + past participle (teño falado, tiña comido, tería ido), participle agreement in some constructions.

**Lessons:**

#### Lesson 89: Present Perfect
- "Teño visitado Santiago moitas veces"
- Note: Galician present perfect uses "ter" not "haber"!
- `CONTRAST` — Spanish "he visitado" → Galician "teño visitado" — completely different auxiliary

#### Lesson 90: Pluperfect
- "Tiña comido cando chegaches"
- "Xa tiñamos ido á praia"

#### Lesson 91: If I Had... (Compound Conditional)
- "Se tivese sabido, tería ido" (If I had known, I would have gone)
- Complex but high-impact structure

#### Lesson 92: Review & Integration
- Compound tenses in narrative context
- `STORY` — A complex story using all past tenses

---

### B2 · Unit 24 — Expresións idiomáticas (Idiomatic Expressions)

**Purpose:** Sound natural. Learn expressions unique to Galician that have no direct translation.

**Vocabulary (30 expressions):**
andar ás

 

 coas

 

 (to be up to something), botar de menos (to miss someone), botar a andar (to set off), dar de si (to stretch/give), estar

 

 

 

 coa

 

 

 

 

 mosca detrás da orella (to be suspicious), estar

 

 

 

 

 

 

 

 coma

 

 

 

 

 

 

 peixe

 

 na

 

 

 

 auga (to be in one's element), levar

 

 

 

 

 

 

 

 os

 

 

 

 

 

 

 

 

 

 

 demos (to go crazy), non ter

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 pés

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 nin

 

 

 

 

 

 

 

 

 

 

 

 cabeza (to make no sense), meter a

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 cuncha (to retreat into one's shell), ir

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 de

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 ventre (to come from the heart)

**Lessons:**

#### Lesson 93: Everyday Expressions
- 10 common expressions with context and practice
- `CONTEXT_CLUE` exercises — guess meaning from context

#### Lesson 94: Emotional Expressions
- Morriña, saudade, botar de menos, expressions of feeling
- `STORY` — An emigrant's letter home (historically authentic genre)

#### Lesson 95: Humorous & Colorful Expressions
- Fun, memorable expressions that make the learner sound natural
- `DIALOGUE` — Casual conversation using expressions

#### Lesson 96: B2 Midpoint Checkpoint
- Scored test covering Units 22–24

---

### B2 · Unit 25 — Galego formal e informal (Register)

**Purpose:** Distinguish formal and informal Galician. Official writing, academic Galician, spoken colloquial Galician.

**Grammar focus:** Formal "vostede" (you-formal) conjugation patterns, written vs. spoken Galician, dialectal awareness, formal letter/email writing.

**Lessons:**

#### Lesson 97: Formal Galician (Vostede)
- "Vostede quere un café?" / "Podería indicarme...?"
- Formal register in shops, offices, with elders

#### Lesson 98: Written Galician
- Email and letter conventions
- "Estimado/a señor/a..." / "Atentamente..."

#### Lesson 99: Dialectal Variation
- Awareness of main dialectal areas (western, central, eastern)
- `CULTURE_TIP` — "Galician has three main dialect groups. Standard Galician (normativo) is what you're learning, but you'll hear variations!"

#### Lesson 100: Review
- Formal vs. informal writing tasks
- `DIALOGUE` — Same scenario in formal and informal register

---

### B2 · Unit 26 — A voz pasiva e construcións complexas (Passive Voice & Complex Structures)

**Purpose:** Academic and journalistic Galician. Complex sentence construction.

**Grammar focus:** Passive with "ser + participle," passive "se" construction, advanced relative clauses, nominalization, gerund use.

**Lessons:**

#### Lesson 101: Passive Voice
- "O libro foi escrito por Rosalía de Castro"
- Passive se: "En Galicia fálase galego"

#### Lesson 102: Complex Sentences
- Concessive (aínda que), causal (dado que, xa que), consecutive (polo tanto, por iso)
- Multi-clause sentences

#### Lesson 103: Discussion & Debate
- Express complex opinions, agree/disagree with nuance
- `DIALOGUE` — Debate about language policy in Galicia

#### Lesson 104: B2 Final Review & Checkpoint
- Comprehensive B2 review
- Extended essay-style exercise
- **B2 Completion Checkpoint** — scored test, certificate/badge

---

## Gamification & Engagement Layer

These features should be woven throughout all levels to maintain the Duolingo-like feel.

### XP & Scoring
- Each correct answer: +10 XP (first try), +5 XP (second try)
- Lesson completion bonus: +20 XP
- Perfect lesson (no errors): +50 XP bonus
- Daily streak bonus: +10 XP per day maintained
- Challenge exercises: +15 XP (harder than normal)

### Streaks
- Daily streak counter (prominent on home screen)
- Streak freeze: earned or purchased with in-app currency
- Milestone celebrations: 7, 30, 100, 365 days

### Hearts / Lives
- 5 hearts per session (lose 1 per wrong answer)
- Hearts regenerate over time (1 per hour)
- "Practice to earn hearts" — review old material to refill
- Optional: unlimited hearts for subscribers

### Leaderboards
- Weekly leaderboards (friends or random groups of ~30)
- Leagues: Bronze → Silver → Gold → Sapphire → Ruby → Emerald → Diamond
- Top 10 advance, bottom 5 drop back

### Achievements & Badges
- **First Words:** Complete Lesson 1
- **Family Person:** Complete Unit 2
- **Café Regular:** Complete Unit 4
- **Past Master:** Complete Unit 10
- **Camino Pilgrim:** Complete Unit 16
- **Subjunctive Survivor:** Complete Unit 18
- **Galician Soul:** Learn the word "morriña"
- **Personal Infinitive Pro:** Complete Unit 19
- **Culture Vulture:** Read all culture tips
- **Perfectionist:** Get 10 perfect lessons in a row
- **Polyglot:** Reach B2

### Review System (Spaced Repetition)
- Words enter a review queue after first learning
- Review intervals: 1 day → 3 days → 7 days → 14 days → 30 days → 90 days
- Mistakes reset the interval
- "Practice" button always available to drill weak words
- Each lesson warm-up pulls from the review queue

### Stories (Unlockable)
- Short interactive stories unlock after each unit
- Themed around Galician life, culture, history
- Examples:
  - A1: "O primeiro día en Santiago" (first day in Santiago)
  - A2: "A receita da avoa" (grandmother's recipe)
  - B1: "O Camiño" (a day on the Camino de Santiago)
  - B2: "Carta desde Buenos Aires" (letter from a Galician emigrant)

### Daily Challenges
- One special exercise per day with bonus XP
- Rotates between: listening challenge, speed round, translation challenge, cultural quiz

---

## Galician-Specific Teaching Notes

These notes are for the developer implementing the curriculum. They explain linguistic decisions.

### 1. Orthographic Standard
This curriculum follows the **Real Academia Galega (RAG) / Instituto da Lingua Galega (ILG)** normative standard. This is the official standard used in education, government, and media in Galicia. We do NOT use the reintegrationist (Portuguese-aligned) spelling.

Key implications:
- "nh" is NOT used (that's Portuguese). We write: "unha" (but with the standard pronunciation)
- Use "x" for the /ʃ/ sound: "xente," "xaneiro," "xogar"
- Use "ll" for the palatal lateral: "fillo," "vello," "cabalo"

### 2. Pronoun Placement (Proclisis vs. Enclisis)
This is THE hardest aspect of Galician grammar for Spanish speakers. The rules:

**Proclisis (pronoun BEFORE verb) when:**
- Negation: "Non o fixen"
- Subordinate clauses: "Cando o vin..."
- After certain adverbs: "Sempre me di..."
- Questions: "Que me dis?"
- After "que" (relative): "O libro que lle dei"

**Enclisis (pronoun AFTER verb) when:**
- Affirmative main clause starting with the verb or subject: "Fíxeno onte" / "Eu fíxeno"
- Imperatives: "Dámo!"

This should be taught gradually (A2 introduction, B1 deepening, B2 mastery).

### 3. Key Galician vs. Spanish Differences to Highlight

| Feature | Spanish | Galician | When Taught |
|---------|---------|----------|-------------|
| Definite articles | el, la, los, las | o, a, os, as | A1 Unit 1 |
| Possessive + article | mi padre | o meu pai | A1 Unit 2 |
| "To have" | tener (tengo) | ter (teño) | A1 Unit 2 |
| "To do/make" | hacer | facer | A1 Unit 6 |
| Numbers (gendered) | dos (invariable) | dous/dúas | A1 Unit 3 |
| /ʃ/ sound spelling | j (jamón) | x (xamón) | A1 Unit 4 |
| "We go" | vamos | imos | A1 Unit 6 |
| Contractions | en el, de la | no, da | A1 Unit 7 |
| Comparison particle | más... que | máis... ca | A2 Unit 14 |
| Pronoun placement | mostly proclitic | strict rules | A2 Unit 15 |
| Personal infinitive | doesn't exist | falarmos, etc. | B1 Unit 19 |
| Perfect auxiliary | haber (he comido) | ter (teño comido) | B2 Unit 23 |

### 4. Audio & Pronunciation Notes
- Galician has 7 vowels (open and closed e/o): /a, ɛ, e, i, ɔ, o, u/
- The "x" = /ʃ/ (like English "sh")
- The "nh" in "unha" is pronounced like Spanish "ñ" in some dialects
- Seseo (pronouncing "z" and "c" as /s/) is common in western dialects but the standard has /θ/
- Gheada: pronunciation of "g" as /h/ is very common colloquially but not standard
- Audio recordings should use standard pronunciation with these features noted in culture tips

### 5. Vocabulary Selection Methodology
Words were selected based on:
1. **Frequency:** Galician corpus data (CORGA — Corpus de Referencia do Galego Actual)
2. **Communicative value:** Can the learner DO something with this word?
3. **Cultural relevance:** Words that teach about Galician identity (morriña, saudade, muiñeira, queimada)
4. **Contrast value:** Words that differ significantly from Spanish (to prevent interference)
5. **Morphological productivity:** Words whose roots help learn other words (e.g., "falar" → "falante," "fala," "falador")

### 6. Content Localization
All scenarios and cultural references should be authentically Galician:
- Cities: Santiago de Compostela, Vigo, A Coruña, Ourense, Lugo, Pontevedra
- Food: Polbo á feira, empanada, caldo galego, filloas, pementos de Padrón, torta de Santiago
- Geography: Rías Baixas, Illas Cíes, Costa da Morte, Serra do Courel, Ribeira Sacra
- Festivals: San Xoán, Entroido, Magosto, Romarías
- People: Rosalía de Castro, Castelao, Manuel Rivas (reference-only, no quoted works)
- Music: Gaita, muiñeira, pandeireta
