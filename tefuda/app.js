// 手札 app.js — 自動生成（scripts/build-pwa.mjs）build 202609151035
(() => {
"use strict";
// ---- pwa/src/store.mjs
// ブラウザ版 store: brain/lib/store.mjs と同じ logicalDate / newId を提供し、保存先は localStorage
function logicalDate(date = new Date(), cutoffHour = 4) {
  const d = new Date(date.getTime());
  if (d.getHours() < cutoffHour) d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function newId(prefix, date = new Date()) {
  const ymd = logicalDate(date).replaceAll('-', '');
  const rand = Math.random().toString(36).slice(2, 8).padEnd(6, '0');
  return `${prefix}_${ymd}_${rand}`;
}

const DB_KEY = 'tefuda.v1';

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveDb(db) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch { /* 容量超過などは無視。次回保存で回復 */ }
}

// ---- brain/lib/catalog.mjs
const CATEGORIES = ['味わう', '自分を見る', '整える', '少し変える', '人とつながる'];
const TYPES = ['前', '中', '後', '寝る前朝'];
const SOURCE_TYPES = ['研究者', '経験談', '思想', '占い', '有名人', '民間', 'ネット', '自作'];
const EVIDENCE = ['研究あり', '経験談', '伝統', '占い', '不明'];
const KINDS = ['回数系', '1行系', '現物系'];
const BANNED = ['罰', '恥', '連続', 'ストリーク', '診断', '病', '怠け', 'ダメ'];

const DIRECTIONS = [
  { id: 'body', trouble: '体が重い', gains: ['体が軽い時間', '眠れる夜'], actions: [
    { id: 'body1', name: 'テレビの前で足踏み1分', kind: '回数系', shift: false, unit: '回' },
    { id: 'body2', name: '玄関でスクワット5回', kind: '回数系', shift: false, unit: '回' },
    { id: 'body3', name: '寝る前に床で伸び1分', kind: '回数系', shift: false, unit: '回' } ] },
  { id: 'make', trouble: '仕事以外に何もない自分', gains: ['自分の作ったもの', '自分の時間'], actions: [
    { id: 'make1', name: '写真を1枚撮って1語つける', kind: '現物系', shift: true, unit: '枚' },
    { id: 'make2', name: '今日思ったことを1文書く', kind: '1行系', shift: false, unit: '文' },
    { id: 'make3', name: '本を1ページ読む', kind: '現物系', shift: false, unit: 'ページ' } ] },
  { id: 'money', trouble: 'お金の不安', gains: ['分かっている感', '余裕'], actions: [
    { id: 'money1', name: '今日使った額を1行', kind: '1行系', shift: false, unit: '行' },
    { id: 'money2', name: '固定費を1つ調べて1行', kind: '1行系', shift: false, unit: '行' },
    { id: 'money3', name: '要らないサブスクを1つ探して1行', kind: '1行系', shift: false, unit: '行' } ] },
  { id: 'people', trouble: '人が薄い', gains: ['誰かとのやりとり', '居場所'], actions: [
    { id: 'people1', name: '誰かの投稿に1つ反応', kind: '回数系', shift: true, unit: '回' },
    { id: 'people2', name: '家族・同僚に1つ質問', kind: '回数系', shift: false, unit: '回' },
    { id: 'people3', name: '1人に「元気？」だけ送る', kind: '回数系', shift: true, unit: '回' } ] },
  { id: 'head', trouble: '頭を使っていない', gains: ['分かった感', '話せること'], actions: [
    { id: 'head1', name: 'ニュース1本の見出しを自分の言葉で1行', kind: '1行系', shift: false, unit: '行' },
    { id: 'head2', name: '気になる言葉を1つ調べて1行', kind: '1行系', shift: false, unit: '行' },
    { id: 'head3', name: '英語を1文音読', kind: '回数系', shift: true, unit: '回' } ] },
];

const ALL = ['回数系', '1行系', '現物系'];
const c = (id, name, claim, how, type, category, sourceType, source, evidence, applies, shift, qText, qOpts) =>
  ({ id, name, claim, how, type, category, sourceType, source, evidence, applies, shift, question: { text: qText, options: qOpts }, seed: true });

const SEED_CARDS = [
  c('s01', 'ときめく1つを置く', '好きな物を1つだけ置いてから始める', '机や玄関に好きな物を1つだけ置いてから2分', '前', '整える', '経験談', '近藤麻理恵の考え方の要約', '経験談', ALL, false, '置いたのは何？', ['物', '写真', '置かなかった']),
  c('s02', '気を散らす物を1つ消す', '目の前の邪魔を1つ減らすと入りやすい', '2分の間だけ、目の前の邪魔な物を1つ伏せる', '中', '整える', '経験談', 'Cal Newport の考え方の要約', '経験談', ALL, false, '伏せたのは何？', ['スマホ', '別の物', '伏せなかった']),
  c('s03', '終わった瞬間を画面が祝う', 'できた瞬間の感情が定着を早める', '本人は何もしない。完了の瞬間に画面が光るだけ', '後', '味わう', '研究者', 'BJ Fogg の考え方の要約', '研究あり', ALL, true, '光った時どうだった？', ['少し嬉しい', '何も', '恥ずかしい']),
  c('s04', '終わり方を良くする', '記憶は終わり方で決まる', '最後の10秒だけ丁寧に', '後', '味わう', '研究者', 'Kahneman のピークエンド則の要約', '研究あり', ALL, true, '最後の10秒、何をした？', ['丁寧にした', '普通', '忘れた']),
  c('s05', '1票が入る', '行動は「自分はこういう人」への1票', '完了すると「〇〇の人に1票」が自動で出る（本人は何もしない）', '後', '自分を見る', '経験談', 'James Clear の考え方の要約', '経験談', ALL, true, '1票、しっくりきた？', ['きた', '微妙', 'こない']),
  c('s06', '気分はそのまま手だけ', '気分を変えずに行動だけ先に', '気分を選ばずに着手。「気分: そのまま」と出るだけ', '中', '自分を見る', '思想', '森田正馬の考え方の要約', '伝統', ALL, true, '着手前の気分は？', ['重い', '普通', '軽い']),
  c('s07', '抵抗に名前をつける', '名前がつくと抵抗は弱る', '完了後に「今日の抵抗は？」を1タップ', '後', '自分を見る', '経験談', 'Steven Pressfield の考え方の要約', '経験談', ALL, true, '今日の抵抗は？', ['眠い', '面倒', '意味ない']),
  c('s08', '「まだ」をつける', 'できない、ではなく、まだできない', 'できなかった日に「まだ」を1タップ（責めない）', '後', '自分を見る', '研究者', 'Carol Dweck の考え方の要約', '研究あり', ALL, true, '今日は？', ['できた', 'まだ', '飛ばした']),
  c('s09', '明日の邪魔を1つ決める', '願い→結果→邪魔→対策の順で考えると動ける', '完了後に「明日うまくいったら？→邪魔は？→そのとき何する？」を3タップ', '後', '少し変える', '研究者', 'Gabriele Oettingen の WOOP の要約', '研究あり', ALL, false, '明日の邪魔は？', ['眠気', '時間', '気分']),
  c('s10', '少しだけ難しく', 'ちょうど少し上を狙うと没頭する', '1文→2文、5回→7回に', '中', '少し変える', '研究者', 'Csikszentmihalyi のフローの要約', '研究あり', ALL, false, '難しさは？', ['ちょうど', '楽', 'きつい']),
  c('s11', '今日の良かったこと1つ', '良かったことを数えると続く', '完了後に「良かったこと」を1タップ', '後', '味わう', '研究者', 'Martin Seligman の考え方の要約', '研究あり', ALL, true, '今日の良かったことは？', ['体', '人', '仕事']),
  c('s12', '呼吸3回してから', '今ここに注意を戻してから始める', '着手の代わりに呼吸3回→そのまま2分', '前', '整える', '思想', 'Jon Kabat-Zinn の考え方の要約', '伝統', ALL, true, '呼吸3回、できた？', ['できた', '1回', 'しなかった']),
  // 出番専用（車内で1タップ・1分以内）
  c('w01', '客待ちの良かったこと', '待ち時間にも1つは良いことがある', '客待ちの間に「良かったこと」を1タップ', '後', '味わう', '自作', '出番専用', '不明', ['回数系'], true, '良かったことは？', ['客', '道', '天気']),
  c('w02', '抵抗に名前（車内）', '名前がつくと抵抗は弱る', '信号待ちで「今の抵抗」を1タップ', '後', '自分を見る', '経験談', 'Steven Pressfield の考え方の要約', '経験談', ['回数系'], true, '今の抵抗は？', ['眠い', '面倒', 'なし']),
  c('w03', '呼吸3回（車内）', '今ここに注意を戻す', '客待ちで呼吸3回、アプリが数える', '中', '整える', '思想', 'Jon Kabat-Zinn の考え方の要約', '伝統', ['回数系'], true, '呼吸3回、できた？', ['できた', '1回', 'しなかった']),
  c('w04', '1語だけ残す', '今日を1語にすると記憶に残る', '客待ちで今日の1語を1タップ（候補から）', '後', '味わう', '自作', '出番専用', '不明', ['回数系'], true, '今日の1語は？', ['静か', '忙しい', '普通']),
  c('w05', '1人に元気？（車内）', '短い一言でつながりは保てる', '客待ちで1人に「元気？」だけ送る', '中', '人とつながる', '研究者', 'Rogers, Milkman & Volpp の要約', '研究あり', ['回数系'], true, '送れた？', ['送った', '迷った', '送らなかった']),
];

function validateCard(card) {
  const errors = [];
  const req = ['id', 'name', 'claim', 'how', 'type', 'category', 'sourceType', 'source', 'evidence', 'applies', 'question'];
  for (const k of req) if (card[k] === undefined || card[k] === null || card[k] === '') errors.push(`${k} が空`);
  if (typeof card.name === 'string' && [...card.name].length > 12) errors.push('name は12字以内');
  if (typeof card.how === 'string' && [...card.how].length > 60) errors.push('how は60字以内');
  if (!TYPES.includes(card.type)) errors.push(`type は ${TYPES.join('/')} のどれか`);
  if (!CATEGORIES.includes(card.category)) errors.push(`category は ${CATEGORIES.join('/')} のどれか`);
  if (!SOURCE_TYPES.includes(card.sourceType)) errors.push(`sourceType は ${SOURCE_TYPES.join('/')} のどれか`);
  if (!EVIDENCE.includes(card.evidence)) errors.push(`evidence は ${EVIDENCE.join('/')} のどれか`);
  if (!Array.isArray(card.applies) || card.applies.length === 0 || !card.applies.every(a => KINDS.includes(a))) errors.push('applies は 回数系/1行系/現物系 の空でない配列');
  if (typeof card.shift !== 'boolean') errors.push('shift は true/false');
  if (!card.question || typeof card.question.text !== 'string' || !Array.isArray(card.question.options) || card.question.options.length !== 3) errors.push('question は text と options[3]');
  const text = `${card.name ?? ''}${card.claim ?? ''}${card.how ?? ''}`;
  for (const b of BANNED) if (text.includes(b)) errors.push(`害の門番: 「${b}」を含む`);
  return { ok: errors.length === 0, errors };
}

function findAction(actionId) {
  for (const d of DIRECTIONS) for (const a of d.actions) if (a.id === actionId) return { ...a, directionId: d.id };
  return null;
}

// ---- brain/lib/experiment.mjs


const CUTOFF_N = 3;
const FIRST_CARD = 's01';

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function initState({ directionId, gainIndex = 0, ownWord = null, actionId, today }) {
  const d = DIRECTIONS.find(x => x.id === directionId);
  if (!d) throw new Error(`unknown direction ${directionId}`);
  const action = actionId ?? d.actions[0].id;
  return {
    version: 1,
    direction: { id: d.id, trouble: d.trouble, gain: ownWord ?? d.gains[gainIndex], ownWord },
    actionMode: 'rotate',
    experiment: { id: newId('e', new Date(today)), actionId: action, cardId: FIRST_CARD, startedOn: today, completions: 0 },
    mitate: null,
    totals: { completions: 0, returns: 0 },
    lastCompletionDate: null,
    triedCards: [],
    verdicts: [],
    retiredActions: [],
    pending: { cutoff: false, firstConfirm: true },
  };
}

function complete(state, cards, { today, shift = false }) {
  const s = structuredClone(state);
  const events = [];
  if (s.lastCompletionDate && daysBetween(s.lastCompletionDate, today) >= 3) {
    s.totals.returns += 1;
    events.push({ type: 'return' });
  }
  s.totals.completions += 1;
  s.experiment.completions += 1;
  s.lastCompletionDate = today;
  events.push({ type: 'completion', shift });
  if (s.experiment.completions >= CUTOFF_N && !s.pending.cutoff) {
    s.pending.cutoff = true;
    events.push({ type: 'cutoff' });
  }
  return { state: s, events };
}

function candidates(state, cards, { shift = false }) {
  const action = findAction(state.experiment.actionId);
  const tried = new Set([...state.triedCards, state.experiment.cardId]);
  const triedCats = new Map();
  for (const id of tried) {
    const c = cards.find(x => x.id === id);
    if (c) triedCats.set(c.category, (triedCats.get(c.category) ?? 0) + 1);
  }
  return cards
    .filter(c => !tried.has(c.id))
    .filter(c => c.applies.includes(action.kind))
    .filter(c => !shift || c.shift)
    .sort((a, b) => (triedCats.get(a.category) ?? 0) - (triedCats.get(b.category) ?? 0) || a.id.localeCompare(b.id))
    .slice(0, 3);
}

function nextActionId(state) {
  const d = DIRECTIONS.find(x => x.id === state.direction.id);
  const alive = d.actions.filter(a => !state.retiredActions.includes(a.id));
  if (state.actionMode === 'fixed' || alive.length === 0) return state.experiment.actionId;
  const start = d.actions.findIndex(a => a.id === state.experiment.actionId);
  for (let step = 1; step <= d.actions.length; step++) {
    const cand = d.actions[(start + step) % d.actions.length];
    if (!state.retiredActions.includes(cand.id)) return cand.id;
  }
  return state.experiment.actionId;
}

function applyVerdict(state, cards, { verdict, nextCardId, today }) {
  const s = structuredClone(state);
  const cur = s.experiment;
  s.verdicts.push({ cardId: cur.cardId, verdict, on: today });
  if (!s.triedCards.includes(cur.cardId)) s.triedCards.push(cur.cardId);
  if (verdict === 'もういい' && !s.retiredActions.includes(cur.actionId)) s.retiredActions.push(cur.actionId);
  const actionId = nextActionId(s);
  s.experiment = { id: newId('e', new Date(today)), actionId, cardId: nextCardId, startedOn: today, completions: 0 };
  s.pending.cutoff = false;
  return s;
}

function changeDirection(state, { directionId, gainIndex = 0, ownWord = null }) {
  const d = DIRECTIONS.find(x => x.id === directionId);
  const s = structuredClone(state);
  s.direction = { id: d.id, trouble: d.trouble, gain: ownWord ?? d.gains[gainIndex], ownWord };
  s.experiment.actionId = d.actions[0].id;
  return s;
}

function setMitate(state, text) {
  const s = structuredClone(state);
  if (s.mitate && s.totals.completions - s.mitate.setAtTotal < CUTOFF_N) {
    const left = CUTOFF_N - (s.totals.completions - s.mitate.setAtTotal);
    return { ok: false, state: s, reason: `同じ見立てを${CUTOFF_N}回試すまで次は出さない（あと${left}回）` };
  }
  s.mitate = { text, setAtTotal: s.totals.completions };
  return { ok: true, state: s };
}

// ---- brain/lib/model.mjs

const ROW_MIN = 3;
const FAVORITE_MIN_TRIED = 8;
const FAVORITE_MIN_MATAUKA = 3;

function tally(state, cards, log, model) {
  const denied = new Set(model.denied ?? []);
  const byCat = new Map(CATEGORIES.map(c => [c, { category: c, matauka: 0, mouii: 0, up: 0, down: 0, n: 0, evidence: [] }]));
  const cat = id => cards.find(c => c.id === id)?.category;
  for (const v of state.verdicts ?? []) {
    const key = `v:${v.cardId}`;
    const c = cat(v.cardId);
    if (denied.has(key) || !c) continue;
    const row = byCat.get(c);
    if (v.verdict === 'また使う') row.matauka += 1; else row.mouii += 1;
    row.n += 1;
    row.evidence.push(key);
  }
  for (const e of log.entries ?? []) {
    if (e.type !== 'thumb') continue;
    const key = `t:${e.id}`;
    const c = cat(e.cardId);
    if (denied.has(key) || !c) continue;
    const row = byCat.get(c);
    if (e.value === 'up') row.up += 1; else row.down += 1;
    row.n += 1;
    row.evidence.push(key);
  }
  const rows = [...byCat.values()].filter(r => r.n >= ROW_MIN);
  const hiddenCategories = [...byCat.values()].filter(r => r.n < ROW_MIN).map(r => r.category);
  let favorite = null;
  if ((state.triedCards?.length ?? 0) >= FAVORITE_MIN_TRIED) {
    const best = rows.filter(r => r.matauka >= FAVORITE_MIN_MATAUKA).sort((a, b) => b.matauka - a.matauka)[0];
    if (best) favorite = { category: best.category };
  }
  return { rows, favorite, hiddenCategories };
}

function denyEvidence(model, id) {
  const m = structuredClone(model);
  if (!m.denied.includes(id)) m.denied.push(id);
  return m;
}

function renderModel(t, state, model) {
  const lines = [];
  lines.push(`『${state.direction?.gain ?? '?'}』のために ${state.totals?.completions ?? 0} 回 ／ 戻ってきた回数: ${state.totals?.returns ?? 0}`);
  lines.push('');
  lines.push('■ 見方のタイプ（数字は端末が数えたもの。3件未満は出さない）');
  if (t.rows.length === 0) lines.push('  まだ数字はない（3件たまると出る）');
  for (const r of t.rows) {
    lines.push(`  ${r.category}: また使う ${r.matauka} ／ もういい ${r.mouii} ／ 👍${r.up} 👎${r.down} （n=${r.n}） 根拠: ${r.evidence.join(', ')}`);
  }
  if (t.favorite) lines.push(`  → 好きなタイプ: ${t.favorite.category}（試した札 ${state.triedCards.length} 枚・「また使う」3枚以上）`);
  lines.push('');
  lines.push('■ 本人の言葉');
  if (!model.words?.length) lines.push('  （まだ無い）');
  for (const w of model.words ?? []) lines.push(`  ${w.on}: ${w.text}`);
  if (model.selfDesc?.text) lines.push(`■ 自己記述（${model.selfDesc.approved ? '承認済み' : '下書き'}）: ${model.selfDesc.text}`);
  if (model.denied?.length) lines.push(`■ 否定した根拠: ${model.denied.join(', ')}`);
  return lines.join('\n');
}

// ---- brain/lib/tree.mjs

const W = 400, H = 400, BASE_Y = 360, CX = 200;
const ANGLES = [-60, -30, 0, 30, 60];
const COLORS = { '味わう': '#e0862f', '自分を見る': '#7b61ff', '整える': '#2e8b57', '少し変える': '#d64b7a', '人とつながる': '#3a8dde' };

// 決定的な擬似乱数（mulberry32）。同じ入力なら同じ木になる
function rand(seed) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function renderTree({ completions = [], returns = 0, tried = 0, graduated = false }) {
  const trunk = 40 + 6 * Math.sqrt(tried);
  const topY = BASE_Y - trunk;
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-leaves="${completions.length}" data-trunk="${trunk}">`);
  out.push(`<rect width="${W}" height="${H}" fill="#fffdf6"/>`);
  for (let i = 0; i < returns; i++) {
    out.push(`<ellipse class="ring" cx="${CX}" cy="${BASE_Y + 6}" rx="${14 + i * 5}" ry="${4 + i * 1.5}" fill="none" stroke="#8b5a2b" stroke-width="1.5"/>`);
  }
  out.push(`<rect x="${CX - 8}" y="${topY}" width="16" height="${trunk}" rx="6" fill="#8b5a2b"/>`);
  DIRECTIONS.forEach((d, i) => {
    const mine = completions.filter(c => c.directionId === d.id);
    const len = 12 + 4 * Math.sqrt(mine.length);
    const a = (ANGLES[i] - 90) * Math.PI / 180;
    const x2 = CX + Math.cos(a) * len * 3;
    const y2 = topY + Math.sin(a) * len * 3;
    out.push(`<line class="branch" x1="${CX}" y1="${topY}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#8b5a2b" stroke-width="5" stroke-linecap="round"/>`);
    mine.forEach((c, k) => {
      const r1 = rand(k * 7919 + i * 13);
      const r2 = rand(k * 104729 + i * 17);
      const lx = x2 + (r1 - 0.5) * 40;
      const ly = y2 + (r2 - 0.5) * 30;
      const size = c.shift ? 5 : 7;
      out.push(`<circle class="leaf" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${size}" fill="${COLORS[c.category] ?? '#999'}"/>`);
    });
    const bookCount = mine.filter(c => c.fromBook).length;
    for (let f = 0; f < Math.floor(bookCount / 3); f++) {
      out.push(`<circle class="fruit" cx="${(x2 + f * 10).toFixed(1)}" cy="${(y2 + 14).toFixed(1)}" r="6" fill="#c83a2c"/>`);
    }
  });
  if (graduated) out.push(`<circle class="flower" cx="${CX}" cy="${topY - 10}" r="9" fill="#f4d35e" stroke="#e0862f" stroke-width="2"/>`);
  out.push('</svg>');
  return out.join('\n');
}

// ---- brain/lib/today.mjs


const STAGES = [
  [0, '1日目', '手札を1枚試すと1週目'],
  [1, '1週目', '3枚試すと1か月の段（本から手札を作ってみる）'],
  [3, '1か月', '10枚で3か月の段（好きなタイプが数字で出はじめる）'],
  [10, '3か月', '30枚で半年（自分の説明書 v1）'],
  [30, '半年', '50枚で1年（アプリなしで回る自分）'],
  [50, '1年', '卒業（通知なしで1週間）'],
];

function stage(state) {
  const n = state.triedCards?.length ?? 0;
  let cur = STAGES[0];
  for (const st of STAGES) if (n >= st[0]) cur = st;
  return { label: cur[1], next: cur[2] };
}

function renderToday(state, cards, log, { shift = false } = {}) {
  const card = cards.find(c => c.id === state.experiment.cardId);
  const action = findAction(state.experiment.actionId);
  const leaves = (log.entries ?? []).filter(e => e.type === 'completion').length;
  const st = stage(state);
  const L = [];
  L.push(`『${state.direction.gain}』のために ${state.totals.completions} 回 ／ 木の葉 ${leaves} 枚 ／ 戻ってきた回数 ${state.totals.returns}`);
  L.push('');
  if (shift) L.push('【出番の日】通知なし。開いた時に1分だけ。サボり扱いにはならない。');
  L.push(`■ 今回の実験（${state.experiment.completions}/${CUTOFF_N}）`);
  L.push(`  行動: ${action.name}`);
  L.push(`  見方: ${card.name} — ${card.how}`);
  L.push(`        （${card.source}・${card.evidence}）`);
  if (state.pending.cutoff) {
    L.push('');
    L.push('■ 3回できた。この見方、また使う？／もういい  → `verdict また使う|もういい --next <id>`');
    for (const c of candidates(state, cards, { shift })) L.push(`  候補 ${c.id}: ${c.name}（${c.category}）— ${c.how}`);
  } else {
    L.push('');
    L.push(`■ 今日の1問（完了のあと・飛ばしてよい）: ${card.question.text}`);
    card.question.options.forEach((o, i) => L.push(`  ${i + 1}) ${o}`));
  }
  if (state.mitate) L.push(`\n■ 見立て: ${state.mitate.text}`);
  L.push(`\n■ 道のり  いま: ${st.label} → 次: ${st.next}`);
  return L.join('\n');
}

// ---- brain/lib/monshin.mjs
// 棚卸し（問診 v2）— 設計書 §18 / docs/research/2026-09-15-生きる目的を問診で仮決めする.md
// 本人指示（2026-09-15）「仮でも雑すぎる。丁寧にボリュームを取得して、それを集中させるやり方に」
//   1) 拡げる: 6つの束 × 自由記述（1つずつ改行・思いつくだけ・数日かけてよい）＋ 価値の言葉の選別（40語超 → 10 → 5 → 3）
//   2) 絞る:   自分の答えを見返して「今も本当」に星（上限10）→ 3つに
//   3) 組み立て: 残った自分の言葉で「［誰］のために、［使うもの］を使って、［増やすもの］を増やす人」
// 「なぜ」は聞かない。研究者名は画面に出さない（出典は research）。AI は推定しない。数字は端末が数える。

const STAR_LIMIT = 10;
const FINAL_LIMIT = 3;
const VALUE_STEPS = [10, 5, 3];

const p = (id, text, hint = '', max = 3) => ({ id, text, hint, max });

const BUNDLES = [
  { id: 'now', title: 'いまのこと', intro: '最近の時間の使い方から、「好き」と「消耗」を拾う。正解はない。', prompts: [
    p('now1', '休みの日、気づいたらやっていること', '例: 車の掃除／YouTube／昼寝', 5),
    p('now2', 'この1か月で、時間を忘れた瞬間', '無ければ「なし」でよい', 3),
    p('now3', 'やっていると元気が出ること', '小さいことでよい', 5),
    p('now4', 'やると疲れる・消耗すること', 'ここは避ける方向を知るため', 5),
    p('now5', '出番の合間に、つい見ているもの・考えていること', '', 3),
    p('now6', '「これだけは手を抜かない」と思っていること', '仕事でも家でも', 3),
  ] },
  { id: 'past', title: '昔のこと', intro: '昔から変わらない興味と、自分を決めた出来事を拾う。', prompts: [
    p('past1', '12歳のころ、放っておくとやっていたこと', '', 5),
    p('past2', '子どものころ、褒められたこと・得意だったこと', '', 5),
    p('past3', 'これまでで「ここで変わった」と思う出来事', '1つずつ改行', 3),
    p('past4', 'いちばん誇らしかった瞬間', '', 3),
    p('past5', '途中でやめたけど、今も少し気になっていること', '', 3),
    p('past6', '昔の自分が今の自分を見たら、驚くこと', '', 3),
  ] },
  { id: 'future', title: 'これからのこと', intro: '長い目で見たときに残る「やっておけばよかった」を先に拾う。', prompts: [
    p('fut1', '80歳の自分が「やっておけばよかった」と言いそうなこと', '80歳の目で見る', 5),
    p('fut2', '絶対にこうはなりたくない、と思う生き方', '「嫌」をひっくり返すと大事なものが出る', 3),
    p('fut3', '1週間、仕事も家事も無かったら、3日目に何をしている？', '', 3),
    p('fut4', '1年後「これが増えた」と言えたら嬉しいこと', '', 5),
    p('fut5', 'お金の心配が無かったら、続けたいこと・始めたいこと', '', 5),
    p('fut6', 'いつか行きたい場所・会いたい人・やってみたいこと', '', 5),
  ] },
  { id: 'people', title: 'まわりの人', intro: '「誰の役に立っているか」と「得意」は、人からの反応に出る。', prompts: [
    p('ppl1', 'よく頼まれること', '', 5),
    p('ppl2', '「ありがとう」と言われたこと（最近の分）', '', 3),
    p('ppl3', 'うらやましいと思った人と、その人の何が', '例: 〇〇さんの、体が軽そうなところ', 3),
    p('ppl4', '尊敬している人と、その人のどこが', '', 3),
    p('ppl5', '自分がいなくなったら困る人・場面', '', 3),
    p('ppl6', '誰の役に立ちたいか', '例: 家族／客／仲間／知らない人／未来の自分', 3),
  ] },
  { id: 'like', title: '好きと得意', intro: '好きなことと得意なことを別々に、数を出す。重なりは後で見る。', prompts: [
    p('like1', '好きなこと', '思いつくだけ。10個まで', 10),
    p('like2', '得意なこと・人より楽にできること', '思いつくだけ。10個まで', 10),
    p('like3', '苦手だけどやっていること', '', 3),
    p('like4', '人に教えられること', '', 3),
    p('like5', '好きと得意が重なっていること', '上の2つを見て、あれば', 3),
    p('like6', 'お金をもらわなくてもやること', '', 3),
  ] },
  { id: 'values', title: '大事なもの', intro: 'たくさんの言葉から選んで絞る。10 → 5 → 3。', prompts: [] }, // 画面は価値の言葉の選別
];

// 価値の言葉（方向のタグつき。null は方向に寄らない）
const VALUES = [
  ...['健康', '体力', '眠り', '軽さ', '動くこと', '外に出ること', '自然'].map(w => ({ w, dir: 'body' })),
  ...['学び', '作ること', '上達', '集中', '好奇心', '表現', '完成させること'].map(w => ({ w, dir: 'make' })),
  ...['安心', '余裕', '蓄え', 'お金が分かっていること', '自立', '備え'].map(w => ({ w, dir: 'money' })),
  ...['家族', '仲間', '感謝されること', '信頼', '会話', '役に立つこと', '居場所', '笑い'].map(w => ({ w, dir: 'people' })),
  ...['理解', '考えること', '知ること', '説明できること', '判断力'].map(w => ({ w, dir: 'head' })),
  ...['自由', '静けさ', '誠実', '挑戦', '安定', '楽しさ', '美しさ', '誇り'].map(w => ({ w, dir: null })),
];

const WHO_CHIPS = ['家族', '客', '仲間', '自分', '未来の自分', '知らない誰か'];

const PROMPTS = BUNDLES.flatMap(b => b.prompts.map(q => ({ ...q, bundleId: b.id })));

// 自由記述を「1行＝1項目」に割る。answers: { [promptId]: string }
function itemsFrom(answers) {
  const out = [];
  for (const q of PROMPTS) {
    const raw = answers?.[q.id];
    if (!raw) continue;
    String(raw).split(/\r?\n/).map(s => s.trim()).filter(Boolean).forEach((text, i) => out.push({ id: `${q.id}#${i}`, pid: q.id, bundleId: q.bundleId, text }));
  }
  return out;
}

// 進み具合。valueTop3 は値の選別が終わっていれば配列
function progress(answers, valueTop3) {
  const per = {};
  for (const b of BUNDLES) {
    if (b.id === 'values') { per[b.id] = { done: valueTop3?.length === 3 ? 1 : 0, total: 1 }; continue; }
    const done = b.prompts.filter(q => (answers?.[q.id] ?? '').trim()).length;
    per[b.id] = { done, total: b.prompts.length };
  }
  const items = itemsFrom(answers).length;
  const bundlesDone = Object.values(per).filter(x => x.done === x.total).length;
  // 絞りに進める最低ライン: 項目 12 以上、または束 3 つ完了
  return { per, items, bundlesDone, canNarrow: items >= 12 || bundlesDone >= 3 };
}

// 価値の上位3語から方向を推定（同数は DIRECTIONS 順）。null タグは無視
function directionFromValues(top) {
  const score = Object.fromEntries(DIRECTIONS.map(d => [d.id, 0]));
  for (const w of top ?? []) { const v = VALUES.find(x => x.w === w); if (v?.dir) score[v.dir] += 1; }
  const best = DIRECTIONS.map(d => d.id).reduce((a, b) => (score[b] > score[a] ? b : a));
  return score[best] > 0 ? best : null;
}

// 型に流し込む。空のスロットは省く
function buildPurpose({ who, use, grow }) {
  const parts = [];
  if (who?.trim()) parts.push(`${who.trim()}のために`);
  if (use?.trim()) parts.push(`${use.trim()}を使って`);
  if (grow?.trim()) parts.push(`${grow.trim()}を増やす人`);
  return parts.join('、');
}

// 組み立て画面に出す候補の言葉（自分の答えだけから。順は 星 → 価値 → 好き/得意）
function chipsFor({ stars, valueTop3, answers }) {
  const items = itemsFrom(answers);
  const starred = (stars ?? []).map(id => items.find(i => i.id === id)?.text).filter(Boolean);
  const likes = items.filter(i => i.pid === 'like1' || i.pid === 'like2' || i.pid === 'like5').map(i => i.text);
  const uniq = arr => [...new Set(arr)];
  return {
    use: uniq([...starred, ...likes]).slice(0, 12),
    grow: uniq([...(valueTop3 ?? []), ...starred]).slice(0, 12),
    who: uniq([...items.filter(i => i.pid === 'ppl6').map(i => i.text), ...WHO_CHIPS]).slice(0, 8),
  };
}

// ---- pwa/src/app.mjs
// 手札 PWA — 画面と操作。ロジックは brain/lib と同じ関数（ビルドで1本にまとめる）







const $ = sel => document.querySelector(sel);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = () => logicalDate(new Date());

let db = loadDb();
let tab = 'today';
let flash = null; // { text, kind }
let onb = { phase: 'intro' }; // はじめる前の画面: intro | direction
const REVIEW_DAYS = 90; // 仮の目的の書き直し（設計書 §18）

// 棚卸し（§18 v2）。db とは別に保存: はじめる前からでも、途中で閉じても残る
const M_KEY = 'tefuda.monshin';
const M_INIT = () => ({ phase: 'home', answers: {}, cur: { bundleId: null, idx: 0 }, values: { step: 0, picks: [[], [], []], custom: [] }, stars: [], final: [], slots: { who: '', use: '', grow: '' }, finalText: '', startedOn: null });
let m = (() => { try { return JSON.parse(localStorage.getItem(M_KEY)) ?? M_INIT(); } catch { return M_INIT(); } })();
let inMonshin = false; // true の間は棚卸しの画面だけを出す
function persistM() { try { localStorage.setItem(M_KEY, JSON.stringify(m)); } catch {} }
function openMonshin(phase = 'home') { m.phase = phase; m.startedOn ??= today(); inMonshin = true; persistM(); render(); }
function closeMonshin() { inMonshin = false; persistM(); render(); }

function persist() { saveDb(db); }
function addDays(iso, n) { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
function isShift() { return db?.ui?.shiftDate === today(); }
function leaves() { return db.log.entries.filter(e => e.type === 'completion'); }

// ---------- 画面 ----------
function render() {
  const root = $('#app');
  if (inMonshin) { root.innerHTML = `${flash ? `<div class="flash ${flash.kind}">${esc(flash.text)}</div>` : ''}<main class="onb">${viewMonshin()}</main>`; flash = null; bindMonshin(); return; }
  if (!db) { root.innerHTML = viewOnboarding(); bind(); return; }
  const views = { today: viewToday, tree: viewTree, deck: viewDeck, model: viewModel, settings: viewSettings, help: viewHelp };
  root.innerHTML = `
    ${flash ? `<div class="flash ${flash.kind}">${esc(flash.text)}</div>` : ''}
    <main>${views[tab]()}</main>
    <nav class="tabs">
      ${[['today', '今日', '🎴'], ['tree', '木', '🌳'], ['deck', '図鑑', '📚'], ['model', '自分', '🔢'], ['settings', '設定', '⚙️']]
        .map(([k, l, e]) => `<button data-tab="${k}" class="${tab === k ? 'on' : ''}"><span>${e}</span>${l}</button>`).join('')}
    </nav>`;
  flash = null;
  bind();
}

function viewOnboarding() {
  const inner = { intro: onbIntro, direction: onbDirection }[onb.phase]();
  return `<main class="onb">${inner}</main>`;
}

function onbIntro() {
  return `
    <h1>手札</h1>
    <p class="lede">やる気も目標もいらないアプリです。</p>
    <section class="card intro">
      <h2>これは何？</h2>
      <ol class="steps">
        <li><b>毎日、2分の「実験」が1つ届く</b>。中身は「やること」と、誰かの「考え方」を1枚重ねたもの。</li>
        <li><b>やったら「できた」を押す</b>。木に葉が1枚増える。サボっても減らない。</li>
        <li><b>3回できたら「この考え方、また使う？」と聞く</b>。答えるほど、自分に合うやり方が分かってくる。</li>
      </ol>
    </section>
    <section class="card">
      <h2>最初に「棚卸し」で、仮の目的を決める</h2>
      <p class="why">「何のために」が無いと、2分の実験も続きません。でも目的は、考えて当てるものではなく、<b>材料をたくさん出して、絞って、残ったものを1文にする</b>と出てきます。<br>
      ① <b>拡げる</b>: 6つの束の質問に、思いつくだけ書く（1日1束でよい。途中で閉じても残る）<br>
      ② <b>絞る</b>: 自分の答えを見返して「今も本当だ」と思うものに星 → 3つに<br>
      ③ <b>組み立てる</b>: 残った自分の言葉で「誰のために、何を使って、何を増やす人」の1文にする<br>
      できた文は「今日」の画面の上に出て、実験の方向を決めます。3か月たったら書き直します。</p>
      <button class="primary" id="monshinStart">${m.startedOn ? '棚卸しの続きから' : '棚卸しをはじめる'}</button>
      <button class="ghost" id="monshinSkip">先に方向だけ選んで始める（棚卸しはあとで）</button>
    </section>
    <p class="note">通知はありません。データはこの端末の中だけに保存されます。</p>`;
}

// ---------- 棚卸し（§18 v2）----------
function viewMonshin() {
  return { home: mHome, bundle: mBundle, values: mValues, review: mReview, narrow: mNarrow, compose: mCompose }[m.phase]();
}

function mHome() {
  const pr = progress(m.answers, m.values.picks[2]);
  return `
    <h1>棚卸し</h1>
    <p class="lede">材料を出す → 絞る → 1文にする。</p>
    <section class="card">
      <h2>① 拡げる（6つの束）</h2>
      <p class="why">1束 5〜6問。思いつくだけ、1つずつ改行して書く。うまく書こうとしない。空でも次へ進める。1日1束でよい。</p>
      ${BUNDLES.map(b => { const x = pr.per[b.id]; const done = x.done === x.total; return `<button class="opt btn ${done ? 'done' : ''}" data-bundle="${b.id}"><b>${esc(b.title)}</b><span class="small">${esc(b.intro)}</span><span class="small">${done ? '✔ 済' : `${x.done} / ${x.total}`}</span></button>`; }).join('')}
    </section>
    <section class="card">
      <h2>② 絞る → ③ 1文にする</h2>
      <p class="why">書いた材料 ${pr.items} 個。${pr.canNarrow ? '絞りに進めます。' : '材料が 12 個以上、または束が 3 つ終わると進めます。'}${m.final.length ? ` いま残している3つ: ${m.final.length} 個。` : ''}</p>
      <button class="primary" id="mToReview" ${pr.canNarrow ? '' : 'disabled'}>${m.stars.length ? '星のつづきから絞る' : '見返して星をつける'}</button>
      ${m.final.length ? `<button id="mToCompose">1文にする画面へ</button>` : ''}
    </section>
    <button class="ghost" id="mClose">閉じる（途中でも残る）</button>`;
}

function mBundle() {
  const b = BUNDLES.find(x => x.id === m.cur.bundleId);
  const q = b.prompts[m.cur.idx];
  const v = m.answers[q.id] ?? '';
  const lines = v.split('\n').filter(s => s.trim()).length;
  return `
    <div class="progress">${esc(b.title)} ${m.cur.idx + 1} / ${b.prompts.length}</div>
    <section class="card">
      <h2>${esc(q.text)}</h2>
      <p class="why">${q.hint ? esc(q.hint) + '。' : ''}1つずつ改行。${q.max}個まで。思いつかなければ空で次へ。</p>
      <textarea id="mAns" rows="6" placeholder="ここに書く（1行に1つ）">${esc(v)}</textarea>
      <p class="small">${lines} 個</p>
    </section>
    <button class="primary" id="mNext">${m.cur.idx === b.prompts.length - 1 ? 'この束を終える' : '次へ'}</button>
    <div class="row">
      <button class="ghost choice" id="mBack">${m.cur.idx === 0 ? '束の一覧へ' : '戻る'}</button>
      <button class="ghost choice" id="mHome">一覧へ（残る）</button>
    </div>`;
}

function mValues() {
  const step = m.values.step;
  const limit = VALUE_STEPS[step];
  const pool = step === 0 ? [...VALUES.map(v => v.w), ...m.values.custom] : m.values.picks[step - 1];
  const picked = m.values.picks[step];
  return `
    <div class="progress">大事なもの ${step + 1} / 3</div>
    <section class="card">
      <h2>${step === 0 ? '大事だと思う言葉を、10個まで選ぶ' : step === 1 ? 'その中から 5つ' : 'その中から 3つ'}</h2>
      <p class="why">${step === 0 ? '深く考えず、目に止まったものをタップ。無い言葉は下で足せる。' : '「これだけは」を残す。捨てた言葉も消えず、戻れる。'} いま ${picked.length} / ${limit}</p>
      <div class="chips">${pool.map(w => `<button class="chip ${picked.includes(w) ? 'on' : ''}" data-val="${esc(w)}">${esc(w)}</button>`).join('')}</div>
      ${step === 0 ? `<div class="row"><input id="mCustom" placeholder="自分の言葉を足す"><button id="mAddCustom">足す</button></div>` : ''}
    </section>
    <button class="primary" id="mValNext" ${picked.length === 0 ? 'disabled' : ''}>${step === 2 ? '3つに決める' : '次へ'}</button>
    <div class="row">
      <button class="ghost choice" id="mValBack">${step === 0 ? '束の一覧へ' : '戻る'}</button>
    </div>`;
}

function mReview() {
  const items = itemsFrom(m.answers);
  const top3 = m.values.picks[2];
  return `
    <div class="progress">② 絞る 1 / 2</div>
    <section class="card">
      <h2>見返して、「今も本当だ」と思うものに ★</h2>
      <p class="why">自分が書いたものを全部並べています。読んで、まだ本当だと思うものに星（${STAR_LIMIT}個まで）。星は「これが自分」の材料になります。 いま ${m.stars.length} / ${STAR_LIMIT}</p>
      ${top3.length ? `<p class="small">大事な言葉（決めた3つ）: ${top3.map(esc).join('・')}</p>` : ''}
      ${BUNDLES.filter(b => items.some(i => i.bundleId === b.id)).map(b => `
        <h3>${esc(b.title)}</h3>
        ${items.filter(i => i.bundleId === b.id).map(i => `<button class="opt btn star ${m.stars.includes(i.id) ? 'on' : ''}" data-star="${i.id}"><span class="mark">${m.stars.includes(i.id) ? '★' : '☆'}</span><span class="body">${esc(i.text)}<span class="small">${esc(PROMPTS.find(q => q.id === i.pid).text)}</span></span></button>`).join('')}`).join('')}
    </section>
    <button class="primary" id="mToNarrow" ${m.stars.length === 0 ? 'disabled' : ''}>星から3つに絞る</button>
    <div class="row"><button class="ghost choice" id="mHome">一覧へ（残る）</button></div>`;
}

function mNarrow() {
  const items = itemsFrom(m.answers);
  const starred = m.stars.map(id => items.find(i => i.id === id)).filter(Boolean);
  return `
    <div class="progress">② 絞る 2 / 2</div>
    <section class="card">
      <h2>この中で、3つだけ残すなら？</h2>
      <p class="why">残した3つと「大事な言葉」が、次の1文の材料になります。迷ったら「80歳の自分が残すもの」で選ぶ。 いま ${m.final.length} / ${FINAL_LIMIT}</p>
      ${starred.map(i => `<button class="opt btn star ${m.final.includes(i.id) ? 'on' : ''}" data-final="${i.id}"><span class="mark">${m.final.includes(i.id) ? '◉' : '○'}</span><span class="body">${esc(i.text)}</span></button>`).join('')}
    </section>
    <button class="primary" id="mToCompose" ${m.final.length === 0 ? 'disabled' : ''}>1文にする</button>
    <div class="row"><button class="ghost choice" id="mBackReview">星に戻る</button></div>`;
}

function mCompose() {
  const chips = chipsFor({ stars: m.final.length ? m.final : m.stars, valueTop3: m.values.picks[2], answers: m.answers });
  const computed = buildPurpose(m.slots);
  const text = m.finalText || computed;
  const dirGuess = directionFromValues(m.values.picks[2]) ?? db?.state?.direction?.id ?? 'body';
  const d = DIRECTIONS.find(x => x.id === (m.slots.dir ?? dirGuess));
  const slot = (key, label, why, list) => `
      <h3>${label}</h3>
      <p class="why">${why}</p>
      <div class="chips">${list.map(w => `<button class="chip ${m.slots[key] === w ? 'on' : ''}" data-slot="${key}" data-word="${esc(w)}">${esc(w)}</button>`).join('')}</div>
      <input data-slotin="${key}" value="${esc(m.slots[key])}" placeholder="自分で書いてもよい">`;
  return `
    <div class="progress">③ 1文にする</div>
    <section class="card">
      <h2>残った言葉で、仮の目的を1文にする</h2>
      <p class="why">型は「［誰］のために、［使うもの］を使って、［増やすもの］を増やす人」。下の言葉は全部あなたが書いたもの。タップで入る。空のところは省かれる。当たっている必要はなく、3か月後に書き直します。</p>
      ${slot('who', '誰のために', '自分でもよい。「自分を超えた誰か」が入ると続きやすい。', chips.who)}
      ${slot('use', '使うもの（好き・得意）', '残した3つ、好き・得意から。', chips.use)}
      ${slot('grow', '増やすもの', '大事な言葉、残した3つから。', chips.grow)}
      <h3>できた文（直してよい）</h3>
      <input id="mFinalText" value="${esc(text)}" placeholder="例: 家族のために、体を動かすことを使って、眠れる夜を増やす人">
    </section>
    <section class="card">
      <h3>実験の方向</h3>
      <p class="why">この文に合う「変えたいこと」を1つ。大事な言葉から「${esc(DIRECTIONS.find(x => x.id === dirGuess).trouble)}」を先に入れてあります。違えば変える。</p>
      <select id="mDir">${DIRECTIONS.map(x => `<option value="${x.id}" ${x.id === d.id ? 'selected' : ''}>${esc(x.trouble)}</option>`).join('')}</select>
      <select id="mGain">${d.gains.map((g, i) => `<option value="${i}" ${i === (m.slots.gain ?? 0) ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select>
    </section>
    <button class="primary" id="mSave">${db ? 'この仮の目的にする' : 'この仮の目的ではじめる（最初の実験が届く）'}</button>
    <div class="row"><button class="ghost choice" id="mBackNarrow">3つに戻る</button><button class="ghost choice" id="mHome">一覧へ（残る）</button></div>`;
}

function onbDirection() {
  return `
    <section class="card">
      <h2>1. 今、いちばん「変えたいな」と思うのは？</h2>
      <p class="why">目標を決める質問ではありません。なんとなく嫌だな、と思っていることを1つ選ぶだけ。これが「どの方向の実験が届くか」を決めます。</p>
      ${DIRECTIONS.map(d => `<label class="opt"><input type="radio" name="dir" value="${d.id}"> ${esc(d.trouble)}</label>`).join('')}
    </section>
    <section class="card" id="gainBox" hidden>
      <h2>2. それが少し変わったら、何が増える？</h2>
      <p class="why">「嫌」のままだと人は動きにくいので、「増えるもの」に言い換えます。ここで選んだ言葉が、毎日の画面のいちばん上に出ます（「〇〇のために 12回」のように）。</p>
      <div id="gains"></div>
      <label class="opt small">自分の言葉で言い直してもいい（任意）<input type="text" id="ownWord" placeholder="例: 朝が軽い日"></label>
    </section>
    <button class="primary" id="startBtn" disabled>はじめる（最初の実験が届く）</button>
    <button class="ghost" id="backIntro">最初の画面に戻る</button>
    <p class="note">通知はありません。データはこの端末の中だけに保存されます。</p>`;
}

// はじめる: 共通の初期化。purpose は棚卸し経由のときだけ
function startApp({ directionId, gainIndex, ownWord, purpose }) {
  const state = initState({ directionId, gainIndex, ownWord, today: today() });
  db = { cards: SEED_CARDS, state, log: { entries: [] }, model: { denied: [], words: [], selfDesc: null }, ui: {}, purpose: purpose ?? null };
  persist(); onb = { phase: 'intro' }; inMonshin = false;
  tab = 'today'; flash = { text: `はじめました。まず「${findAction(state.experiment.actionId).name}」。`, kind: 'ok' }; render();
}

// 棚卸しの結果を「仮の目的」として置く（db が無ければ、ここではじめる）
function savePurpose({ text, directionId, gainIndex }) {
  const d = DIRECTIONS.find(x => x.id === directionId);
  const prev = db?.purpose ?? null;
  const items = itemsFrom(m.answers);
  const purpose = {
    text, directionId, gainIndex, gain: d.gains[gainIndex],
    slots: { ...m.slots }, final: m.final.map(id => items.find(i => i.id === id)?.text).filter(Boolean), stars: m.stars.length, values: m.values.picks[2], itemsCount: items.length,
    decidedOn: today(), reviewOn: addDays(today(), REVIEW_DAYS),
    history: [...(prev?.history ?? []), ...(prev ? [{ text: prev.text, on: prev.decidedOn }] : [])],
  };
  if (!db) { startApp({ directionId, gainIndex, ownWord: null, purpose }); return; }
  db.purpose = purpose;
  if (db.state.direction.id !== directionId || db.state.direction.gain !== purpose.gain) db.state = changeDirection(db.state, { directionId, gainIndex, ownWord: null });
  persist(); inMonshin = false; tab = 'today'; flash = { text: '仮の目的を置いた。', kind: 'ok' }; render();
}

function viewHelp() {
  return `
  <section class="card">
    <h2>手札の使い方</h2>
    <p><b>実験</b>＝「やること（2分）」×「重ねる考え方（手札）」。たとえば「玄関でスクワット5回」×「終わり方を良くする（最後の10秒だけ丁寧に）」。</p>
    <p><b>できた</b>を押すと木に葉が1枚。連続記録はなく、減ることもない。サボった翌日に押すと「おかえり」で年輪が1本増える。</p>
    <p><b>仮の目的</b>＝棚卸しで作る1文（「誰のために、何を使って、何を増やす人」）。棚卸しは、①6つの束の質問に思いつくだけ書く（数日かけてよい）→ ②自分の答えに星をつけて3つに絞る → ③残った自分の言葉で1文にする。当たっている必要はなく、3か月ごとに書き直す。目的は考えて決めるより、動きながら見つかる、という研究に沿っている。</p>
    <p><b>3回できたら</b>「この考え方、また使う？／もういい」を1回だけ聞く。どちらも図鑑に1枚として残る（外れも収集）。次の考え方は3枚から選び、やることは自動で次の候補に回る。</p>
    <p><b>今日の1問</b>は、さっき試した考え方について「どうだった？」を3択で聞くだけ。飛ばしてよい。答えは「自分」の画面に本人の言葉として溜まる。</p>
    <p><b>出番の日</b>は上のスイッチを入れると、車内で1分でできる札だけになり、通知もサボり扱いもない。</p>
    <p><b>自分</b>の画面の数字は、この端末が数えたもの。3件たまるまでは出さない。</p>
  </section>`;
}

function viewToday() {
  const s = db.state;
  const card = db.cards.find(c => c.id === s.experiment.cardId);
  const action = findAction(s.experiment.actionId);
  const shift = isShift();
  const st = stage(s);
  const cut = s.pending.cutoff;
  const cands = cut ? candidates(s, db.cards, { shift }) : [];
  return `
  <header class="head">
    ${db.purpose ? `<div class="purpose">仮の目的: ${esc(db.purpose.text)}</div>` : ''}
    <div class="gain">『${esc(s.direction.gain)}』のために <b>${s.totals.completions}</b> 回</div>
    <div class="sub">木の葉 ${leaves().length} 枚 ／ 戻ってきた回数 ${s.totals.returns}</div>
    <label class="switch"><input type="checkbox" id="shiftToggle" ${shift ? 'checked' : ''}> 今日は出番（1分の札だけ・通知なし・サボり扱いなし）</label>
  </header>
  ${db.ui?.welcomeBack ? `<div class="okaeri">おかえり。続きから。</div>` : ''}
  ${db.purpose && db.purpose.reviewOn <= today() ? `<section class="card q"><b>3か月たった。仮の目的、書き直す？</b><p class="why">目的は動きながら見つかるもの。棚卸しの材料を見返して星をつけ直すと、文も変わる。いまの文のままでもよい。</p><div class="row"><button id="purposeReview">見返して書き直す</button><button class="ghost" id="purposeKeep">このままでいい（また3か月後）</button></div></section>` : ''}
  ${!db.purpose ? (() => { const pr = progress(m.answers, m.values.picks[2]); return `<section class="card q"><b>仮の目的は、まだ無い</b><p class="why">「何のために」が無いと実験は続きにくい。棚卸し（材料を出す → 絞る → 1文）は、1日1束でよい。いま 束 ${pr.bundlesDone} / ${BUNDLES.length}・材料 ${pr.items} 個。</p><button id="openMonshin">${m.startedOn ? '棚卸しの続き' : '棚卸しをはじめる'}</button></section>`; })() : ''}
  <section class="card exp">
    <div class="tag">今回の実験 ${s.experiment.completions}/${CUTOFF_N} <button class="mini" id="helpBtn">使い方？</button></div>
    <div class="lbl">やること（2分）</div>
    <div class="act">${esc(action.name)}</div>
    <div class="lbl">重ねる考え方（手札）</div>
    <div class="lens"><b>${esc(card.name)}</b><span class="how">${esc(card.how)}</span><span class="src">出典: ${esc(card.source)}（${esc(card.evidence)}）</span></div>
    ${cut ? '' : `<p class="why">やることを2分やって、その前後にこの考え方を1つ試す。終わったら下を押す。</p><button class="primary big" id="doneBtn">できた</button>`}
  </section>
  ${cut ? `
  <section class="card">
    <h2>3回できた。この考え方「${esc(card.name)}」、また使う？</h2>
    <p class="why">「また使う」＝自分に合った（図鑑に色がつく）。「もういい」＝合わなかった（外れも1枚として残る）。どちらでも次へ進めます。</p>
    <div class="row">
      <button class="choice" data-verdict="また使う">また使う</button>
      <button class="choice ghost" data-verdict="もういい">もういい</button>
    </div>
    <h3>次に重ねる考え方を3枚から選ぶ</h3>
    <p class="why">やることは自動で次の候補に回ります（同じ方向の別の2分）。</p>
    ${cands.map(c => `<label class="opt"><input type="radio" name="next" value="${c.id}"> <b>${esc(c.name)}</b><span class="small">（${esc(c.category)}）${esc(c.how)}</span></label>`).join('')}
    ${cands.length === 0 ? '<p class="note">候補が尽きた。図鑑で手札を足すか、設定で方向を変える。</p>' : ''}
    <button class="primary" id="verdictBtn" disabled>この見方で次へ</button>
    <button class="ghost" id="laterBtn">後で</button>
  </section>` : ''}
  ${db.ui?.askQuestion ? `
  <section class="card q">
    <h2>今日の1問（飛ばしてよい）</h2>
    <p class="why">さっき試した考え方「${esc(card.name)}」について。3択で1つ、一言は任意。答えは「自分」の画面に本人の言葉として溜まります。</p>
    <p><b>${esc(card.question.text)}</b></p>
    <div class="row wrap">${card.question.options.map((o, i) => `<button class="choice" data-answer="${i + 1}">${esc(o)}</button>`).join('')}</div>
    <input type="text" id="answerText" placeholder="一言（任意）">
    <div class="row"><button id="answerSave">記録</button><button class="ghost" id="answerSkip">飛ばす</button></div>
  </section>` : ''}
  ${s.mitate ? `<section class="card mitate">🔮 見立て: ${esc(s.mitate.text)}</section>` : ''}
  <section class="card road"><b>道のり</b> いま: ${esc(st.label)} → 次: ${esc(st.next)}<br><span class="small">試した考え方の枚数で段が進む。遅れても消えない。</span></section>`;
}

function viewTree() {
  const s = db.state;
  const svg = renderTree({ completions: leaves(), returns: s.totals.returns, tried: s.triedCards.length, graduated: !!s.graduated });
  return `<section class="card treebox">${svg}</section>
  <section class="card"><b>葉</b> ${leaves().length} 枚 ／ <b>枝</b> 5方向 ／ <b>年輪</b> ${s.totals.returns} ／ <b>試した札</b> ${s.triedCards.length} 枚<br><span class="small">枯れない・減らない。落ちて戻ると年輪が1本増える。</span></section>`;
}

function viewDeck() {
  const s = db.state;
  const tried = new Set(s.triedCards);
  const verdictOf = id => s.verdicts.filter(v => v.cardId === id).at(-1)?.verdict;
  const untried = db.cards.filter(c => !tried.has(c.id) && c.id !== s.experiment.cardId).length;
  const groups = CATEGORIES.map(cat => ({ cat, cards: db.cards.filter(c => c.category === cat) }));
  return `
  <section class="card"><b>図鑑</b> ${db.cards.length} 枚のうち試した ${tried.size} 枚<span class="small">（試していない ${untried} 枚）</span><p class="why">手札＝いろんな人の「考え方」。研究者も、本の著者も、占いも、同じ棚。色つき＝また使う、灰色＝もういい、点線＝まだ。</p></section>
  ${groups.map(g => `<section class="card"><h3>${esc(g.cat)}</h3><div class="grid">${g.cards.map(c => {
    const v = verdictOf(c.id);
    const cls = c.id === s.experiment.cardId ? 'now' : v === 'また使う' ? 'yes' : v === 'もういい' ? 'no' : tried.has(c.id) ? 'tried' : 'un';
    return `<div class="tile ${cls}"><b>${esc(c.name)}</b><span>${esc(c.type)}・${esc(c.evidence)}${c.fromBook ? '・本' : ''}</span></div>`;
  }).join('')}</div></section>`).join('')}
  <section class="card">
    <h3>手札を足す（本の一節から・自分で）</h3>
    <p class="why">読んだ本の「この人はこうやってきた」を、2分の実験に重ねられる形にして1枚追加します。正確さより「試せる形」であればOK。</p>
    <input id="c_name" placeholder="見方の名前（12字以内）">
    <input id="c_claim" placeholder="1行の主張（その人はこう言っている）">
    <input id="c_how" placeholder="試し方（60字以内）">
    <div class="row wrap">
      <select id="c_type">${TYPES.map(t => `<option>${t}</option>`).join('')}</select>
      <select id="c_cat">${CATEGORIES.map(t => `<option>${t}</option>`).join('')}</select>
      <select id="c_stype">${SOURCE_TYPES.map(t => `<option>${t}</option>`).join('')}</select>
      <select id="c_ev">${EVIDENCE.map(t => `<option>${t}</option>`).join('')}</select>
    </div>
    <input id="c_source" placeholder="出典（著者・書名）">
    <input id="c_q" placeholder="完了後の1問">
    <div class="row wrap"><input id="c_o1" placeholder="選択肢1"><input id="c_o2" placeholder="選択肢2"><input id="c_o3" placeholder="選択肢3"></div>
    <label class="opt small"><input type="checkbox" id="c_shift"> 出番（車内1分）でも出せる</label>
    <button class="primary" id="addCard">追加</button>
    <p class="note">禁止語（罰・恥・連続・診断…）を含む札は登録できません。</p>
  </section>`;
}

function viewModel() {
  const t = tally(db.state, db.cards, db.log, db.model);
  const s = db.state;
  return `
  <section class="card"><div class="gain">『${esc(s.direction.gain)}』のために ${s.totals.completions} 回</div><div class="sub">戻ってきた回数 ${s.totals.returns}</div></section>
  <section class="card">
    <h3>考え方のタイプ <span class="small">（数字は端末が数える。3件未満は出さない）</span></h3>
    <p class="why">「また使う／もういい」の答えを5つのタイプ別に数えたもの。増えてくると「自分は〇〇系が合う」が見えてくる。根拠を押すと、その1件を数えから外せる。</p>
    ${t.rows.length === 0 ? '<p class="note">まだ数字はない（3件たまると出る）</p>' : ''}
    ${t.rows.map(r => `<div class="tallyrow"><b>${esc(r.category)}</b> また使う ${r.matauka} ／ もういい ${r.mouii} ／ 👍${r.up} 👎${r.down} <span class="small">n=${r.n}</span>
      <div class="ev">${r.evidence.map(e => `<button class="mini" data-deny="${esc(e)}">${esc(e)} ✕</button>`).join(' ')}</div></div>`).join('')}
    ${t.favorite ? `<p class="fav">→ 好きなタイプ: <b>${esc(t.favorite.category)}</b></p>` : ''}
  </section>
  <section class="card">
    <h3>本人の言葉</h3>
    ${db.model.words.length === 0 ? '<p class="note">（まだ無い）</p>' : db.model.words.map(w => `<div class="word"><span class="small">${esc(w.on)}</span> ${esc(w.text)}</div>`).join('')}
    <div class="row"><input id="wordText" placeholder="一言を足す"><button id="wordAdd">追加</button></div>
  </section>`;
}

function viewSettings() {
  const s = db.state;
  return `
  <section class="card">
    <h3>使い方</h3><button id="helpBtn2">使い方を読む</button>
  </section>
  <section class="card">
    <h3>仮の目的</h3>
    <p class="why">棚卸し（材料を出す → 絞る → 1文）で作った文。当たっている必要はない。3か月ごとに書き直しを聞く。材料は残っているので、いつでも見返せる。</p>
    ${db.purpose ? `<p>いま: ${esc(db.purpose.text)}<br><span class="small">決めた日 ${esc(db.purpose.decidedOn)} ／ 次の見直し ${esc(db.purpose.reviewOn)}${db.purpose.history?.length ? ` ／ 書き直し ${db.purpose.history.length} 回` : ''}${db.purpose.final?.length ? `<br>残した3つ: ${db.purpose.final.map(esc).join('・')}` : ''}${db.purpose.values?.length ? `<br>大事な言葉: ${db.purpose.values.map(esc).join('・')}` : ''}</span></p>` : '<p class="small">まだ決めていない。</p>'}
    <button id="openMonshin">${db.purpose ? '棚卸しを開く（材料を見返す・書き直す）' : (m.startedOn ? '棚卸しの続き' : '棚卸しをはじめる')}</button>
    <input id="purposeText" placeholder="文だけ直すなら、ここに" value="${esc(db.purpose?.text ?? '')}">
    <button class="ghost" id="purposeSet">文だけ直す（次の見直しは3か月後）</button>
  </section>
  <section class="card">
    <h3>方向</h3>
    <p class="why">最初に選んだ「変えたいこと」と「増えるもの」。変えると、届く実験の方向が変わる。これまでの木と図鑑は残る。</p>
    <p>いま: ${esc(s.direction.trouble)} → 『${esc(s.direction.gain)}』</p>
    <select id="dirSel">${DIRECTIONS.map(d => `<option value="${d.id}" ${d.id === s.direction.id ? 'selected' : ''}>${esc(d.trouble)}</option>`).join('')}</select>
    <select id="gainSel"></select>
    <input id="dirWord" placeholder="自分の言葉（任意）">
    <button id="dirChange">方向を変える（山は棚に残る）</button>
  </section>
  <section class="card">
    <h3>見立て（占い調でよい・3回試すまで次は出ない）</h3>
    <p class="why">「あなたは〇〇系」のような言い切りを1つ置ける。今日の画面に出る。3回試すまで次の見立てには変えられない（毎週別人の占いにしないため）。</p>
    <input id="mitateText" placeholder="例: あなたは『整える』系。今週はこの3枚" value="${esc(s.mitate?.text ?? '')}">
    <button id="mitateSet">置く</button>
  </section>
  <section class="card">
    <h3>データ</h3>
    <p class="small">この端末の中だけに保存。別の端末に移す時は書き出して読み込む。</p>
    <div class="row"><button id="exportBtn">書き出す（JSON）</button><button id="importBtn" class="ghost">読み込む</button></div>
    <textarea id="ioBox" rows="4" placeholder="ここに貼る／ここに出る"></textarea>
    <button class="danger" id="resetBtn">最初からやり直す</button>
  </section>
  <section class="card small">手札 v0.1（PWA）。設計書 v16.2。数字は端末が数え、AI は数字を推定しない。</section>`;
}

// ---------- 操作 ----------
function bindMonshin() {
  const go = phase => { m.phase = phase; persistM(); render(); };
  $('#mClose') && ($('#mClose').onclick = closeMonshin);
  $('#mHome') && ($('#mHome').onclick = () => { if ($('#mAns')) saveAns(); go('home'); });
  document.querySelectorAll('[data-bundle]').forEach(b => b.onclick = () => {
    if (b.dataset.bundle === 'values') { go('values'); return; }
    m.cur = { bundleId: b.dataset.bundle, idx: 0 }; go('bundle');
  });
  $('#mToReview') && ($('#mToReview').onclick = () => go('review'));
  $('#mToCompose') && ($('#mToCompose').onclick = () => go('compose'));

  const saveAns = () => { const b = BUNDLES.find(x => x.id === m.cur.bundleId); const q = b.prompts[m.cur.idx]; m.answers[q.id] = $('#mAns').value.replace(/\r/g, ''); persistM(); };
  if (m.phase === 'bundle') {
    const b = BUNDLES.find(x => x.id === m.cur.bundleId);
    $('#mAns').oninput = () => { saveAns(); const n = $('#mAns').value.split('\n').filter(s => s.trim()).length; $('#mAns').nextElementSibling.textContent = `${n} 個`; };
    $('#mNext').onclick = () => { saveAns(); if (m.cur.idx >= b.prompts.length - 1) go('home'); else { m.cur.idx += 1; go('bundle'); } };
    $('#mBack').onclick = () => { saveAns(); if (m.cur.idx === 0) go('home'); else { m.cur.idx -= 1; go('bundle'); } };
  }

  if (m.phase === 'values') {
    const step = m.values.step; const limit = VALUE_STEPS[step]; const picked = m.values.picks[step];
    document.querySelectorAll('[data-val]').forEach(c => c.onclick = () => {
      const w = c.dataset.val; const i = picked.indexOf(w);
      if (i >= 0) picked.splice(i, 1); else if (picked.length < limit) picked.push(w); else { flash = { text: `${limit}個まで。外してから足す。`, kind: 'ng' }; }
      persistM(); render();
    });
    $('#mAddCustom') && ($('#mAddCustom').onclick = () => { const w = $('#mCustom').value.trim(); if (!w || m.values.custom.includes(w) || VALUES.some(v => v.w === w)) return; m.values.custom.push(w); persistM(); render(); });
    $('#mValNext').onclick = () => {
      if (step < 2) { m.values.step = step + 1; m.values.picks[step + 1] = m.values.picks[step + 1].filter(w => picked.includes(w)); go('values'); }
      else { m.values.step = 0; go('home'); }
    };
    $('#mValBack').onclick = () => { if (step === 0) go('home'); else { m.values.step = step - 1; go('values'); } };
  }

  if (m.phase === 'review') {
    document.querySelectorAll('[data-star]').forEach(b => b.onclick = () => {
      const id = b.dataset.star; const i = m.stars.indexOf(id);
      if (i >= 0) { m.stars.splice(i, 1); m.final = m.final.filter(x => x !== id); } else if (m.stars.length < STAR_LIMIT) m.stars.push(id); else flash = { text: `星は${STAR_LIMIT}個まで。`, kind: 'ng' };
      persistM(); render();
    });
    $('#mToNarrow').onclick = () => go('narrow');
  }

  if (m.phase === 'narrow') {
    document.querySelectorAll('[data-final]').forEach(b => b.onclick = () => {
      const id = b.dataset.final; const i = m.final.indexOf(id);
      if (i >= 0) m.final.splice(i, 1); else if (m.final.length < FINAL_LIMIT) m.final.push(id); else flash = { text: `${FINAL_LIMIT}つまで。`, kind: 'ng' };
      persistM(); render();
    });
    $('#mToCompose').onclick = () => go('compose');
    $('#mBackReview').onclick = () => go('review');
  }

  if (m.phase === 'compose') {
    const readSlots = () => { document.querySelectorAll('[data-slotin]').forEach(i => { m.slots[i.dataset.slotin] = i.value.trim(); }); m.finalText = $('#mFinalText').value.trim(); m.slots.dir = $('#mDir').value; m.slots.gain = Number($('#mGain').value); };
    document.querySelectorAll('[data-slot]').forEach(c => c.onclick = () => { readSlots(); m.slots[c.dataset.slot] = m.slots[c.dataset.slot] === c.dataset.word ? '' : c.dataset.word; m.finalText = ''; persistM(); render(); });
    document.querySelectorAll('[data-slotin]').forEach(i => i.onchange = () => { readSlots(); m.finalText = ''; persistM(); render(); });
    $('#mDir').onchange = () => { readSlots(); m.slots.gain = 0; persistM(); render(); };
    $('#mSave').onclick = () => {
      readSlots();
      const text = m.finalText || buildPurpose(m.slots);
      if (!text) { flash = { text: '言葉を1つ以上入れる。', kind: 'ng' }; render(); return; }
      persistM();
      savePurpose({ text, directionId: m.slots.dir, gainIndex: m.slots.gain });
    };
    $('#mBackNarrow').onclick = () => go('narrow');
  }
}

function bindOnboarding() {
  const go = phase => { onb.phase = phase; render(); };
  $('#monshinStart') && ($('#monshinStart').onclick = () => openMonshin('home'));
  $('#monshinSkip') && ($('#monshinSkip').onclick = () => go('direction'));
  $('#backIntro') && ($('#backIntro').onclick = () => go('intro'));

  if (onb.phase === 'direction') {
    document.querySelectorAll('input[name=dir]').forEach(r => r.onchange = () => {
      const d = DIRECTIONS.find(x => x.id === r.value);
      $('#gains').innerHTML = d.gains.map((g, i) => `<label class="opt"><input type="radio" name="gain" value="${i}" ${i === 0 ? 'checked' : ''}> ${esc(g)}</label>`).join('');
      $('#gainBox').hidden = false; $('#startBtn').disabled = false;
    });
    $('#startBtn').onclick = () => {
      const dirId = document.querySelector('input[name=dir]:checked')?.value; if (!dirId) return;
      const gainIndex = Number(document.querySelector('input[name=gain]:checked')?.value ?? 0);
      startApp({ directionId: dirId, gainIndex, ownWord: $('#ownWord').value.trim() || null, purpose: null });
    };
  }
}

function bind() {
  document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); });

  if (!db) { bindOnboarding(); return; }

  const s = db.state;
  $('#helpBtn') && ($('#helpBtn').onclick = () => { tab = 'help'; render(); });
  $('#shiftToggle') && ($('#shiftToggle').onchange = e => { db.ui.shiftDate = e.target.checked ? today() : null; persist(); render(); });

  $('#doneBtn') && ($('#doneBtn').onclick = () => {
    const card = db.cards.find(c => c.id === s.experiment.cardId);
    const action = findAction(s.experiment.actionId);
    const shift = isShift();
    const r = complete(s, db.cards, { today: today(), shift });
    db.log.entries.push({ id: newId('l'), type: 'completion', on: today(), cardId: card.id, actionId: action.id, directionId: action.directionId, category: card.category, fromBook: !!card.fromBook, shift });
    db.state = r.state;
    db.ui.askQuestion = true;
    db.ui.welcomeBack = r.events.some(e => e.type === 'return');
    persist();
    flash = { text: `できた。葉が1枚増えた（${leaves().length}枚）。`, kind: 'ok' };
    render();
    if (navigator.vibrate) navigator.vibrate(30);
  });

  document.querySelectorAll('[data-answer]').forEach(b => b.onclick = () => { db.ui.answerOpt = Number(b.dataset.answer); document.querySelectorAll('[data-answer]').forEach(x => x.classList.toggle('sel', x === b)); });
  $('#answerSave') && ($('#answerSave').onclick = () => {
    const card = db.cards.find(c => c.id === s.experiment.cardId);
    const text = $('#answerText').value.trim();
    const opt = db.ui.answerOpt ? card.question.options[db.ui.answerOpt - 1] : null;
    if (opt || text) db.log.entries.push({ id: newId('a'), type: 'answer', on: today(), cardId: card.id, option: opt, text: text || null });
    if (text) db.model.words.push({ on: today(), text });
    db.ui.askQuestion = false; db.ui.answerOpt = null; db.ui.welcomeBack = false; persist(); render();
  });
  $('#answerSkip') && ($('#answerSkip').onclick = () => { db.ui.askQuestion = false; db.ui.answerOpt = null; db.ui.welcomeBack = false; persist(); render(); });

  let verdictChoice = null;
  document.querySelectorAll('[data-verdict]').forEach(b => b.onclick = () => { verdictChoice = b.dataset.verdict; document.querySelectorAll('[data-verdict]').forEach(x => x.classList.toggle('sel', x === b)); $('#verdictBtn').disabled = !(verdictChoice && document.querySelector('input[name=next]:checked')); });
  document.querySelectorAll('input[name=next]').forEach(r => r.onchange = () => { $('#verdictBtn').disabled = !(verdictChoice && r.checked); });
  $('#verdictBtn') && ($('#verdictBtn').onclick = () => {
    const nextId = document.querySelector('input[name=next]:checked')?.value; if (!verdictChoice || !nextId) return;
    db.state = applyVerdict(s, db.cards, { verdict: verdictChoice, nextCardId: nextId, today: today() });
    db.ui.askQuestion = false; persist(); flash = { text: '次の実験へ。', kind: 'ok' }; render();
  });
  $('#laterBtn') && ($('#laterBtn').onclick = () => { tab = 'tree'; render(); });

  $('#addCard') && ($('#addCard').onclick = () => {
    const card = { id: 'b_' + newId('c').slice(2), name: $('#c_name').value.trim(), claim: $('#c_claim').value.trim(), how: $('#c_how').value.trim(), type: $('#c_type').value, category: $('#c_cat').value, sourceType: $('#c_stype').value, source: $('#c_source').value.trim(), evidence: $('#c_ev').value, applies: ['回数系', '1行系', '現物系'], shift: $('#c_shift').checked, fromBook: true, question: { text: $('#c_q').value.trim(), options: [$('#c_o1').value.trim(), $('#c_o2').value.trim(), $('#c_o3').value.trim()] } };
    const v = validateCard(card);
    if (!v.ok) { flash = { text: '登録できない: ' + v.errors.join(' / '), kind: 'ng' }; render(); return; }
    if (db.cards.some(c => c.name === card.name)) { flash = { text: '同じ名前の札がある', kind: 'ng' }; render(); return; }
    db.cards.push({ ...card, seed: false }); persist(); flash = { text: `追加: ${card.name}`, kind: 'ok' }; render();
  });

  document.querySelectorAll('[data-deny]').forEach(b => b.onclick = () => { db.model = denyEvidence(db.model, b.dataset.deny); persist(); render(); });
  $('#wordAdd') && ($('#wordAdd').onclick = () => { const t = $('#wordText').value.trim(); if (!t) return; db.model.words.push({ on: today(), text: t }); persist(); render(); });

  if ($('#dirSel')) {
    const fillGains = () => { const d = DIRECTIONS.find(x => x.id === $('#dirSel').value); $('#gainSel').innerHTML = d.gains.map((g, i) => `<option value="${i}">${esc(g)}</option>`).join(''); };
    fillGains(); $('#dirSel').onchange = fillGains;
    $('#dirChange').onclick = () => { db.state = changeDirection(s, { directionId: $('#dirSel').value, gainIndex: Number($('#gainSel').value), ownWord: $('#dirWord').value.trim() || null }); persist(); flash = { text: '方向を変えた。', kind: 'ok' }; tab = 'today'; render(); };
  }
  $('#helpBtn2') && ($('#helpBtn2').onclick = () => { tab = 'help'; render(); });
  $('#purposeReview') && ($('#purposeReview').onclick = () => openMonshin(itemsFrom(m.answers).length ? 'review' : 'home'));
  $('#openMonshin') && ($('#openMonshin').onclick = () => openMonshin('home'));
  $('#purposeKeep') && ($('#purposeKeep').onclick = () => { db.purpose.reviewOn = addDays(today(), REVIEW_DAYS); persist(); flash = { text: 'このまま。次は3か月後。', kind: 'ok' }; render(); });
  $('#purposeSet') && ($('#purposeSet').onclick = () => {
    const text = $('#purposeText').value.trim(); if (!text) return;
    const prev = db.purpose;
    db.purpose = { ...(prev ?? { directionId: s.direction.id, gainIndex: 0, gain: s.direction.gain, answers: {}, candidates: [], history: [] }), text, decidedOn: today(), reviewOn: addDays(today(), REVIEW_DAYS),
      history: [...(prev?.history ?? []), ...(prev ? [{ text: prev.text, on: prev.decidedOn }] : [])] };
    persist(); flash = { text: '仮の目的を置いた。', kind: 'ok' }; tab = 'today'; render();
  });
  $('#mitateSet') && ($('#mitateSet').onclick = () => { const r = setMitate(s, $('#mitateText').value.trim()); if (!r.ok) { flash = { text: r.reason, kind: 'ng' }; render(); return; } db.state = r.state; persist(); flash = { text: '見立てを置いた。', kind: 'ok' }; render(); });
  $('#exportBtn') && ($('#exportBtn').onclick = () => { $('#ioBox').value = JSON.stringify(db); $('#ioBox').select(); });
  $('#importBtn') && ($('#importBtn').onclick = () => { try { const d = JSON.parse($('#ioBox').value); if (!d.state || !d.cards) throw new Error(); db = d; persist(); flash = { text: '読み込んだ。', kind: 'ok' }; render(); } catch { flash = { text: '読み込めない JSON', kind: 'ng' }; render(); } });
  $('#resetBtn') && ($('#resetBtn').onclick = () => { if (confirm('本当に最初から？ 木も図鑑も棚卸しも消えます。')) { localStorage.removeItem('tefuda.v1'); localStorage.removeItem(M_KEY); db = null; m = M_INIT(); render(); } });
}

render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});

})();