// 手札 app.js — 自動生成（scripts/build-pwa.mjs）build 202609150011
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

// ---- pwa/src/app.mjs
// 手札 PWA — 画面と操作。ロジックは brain/lib と同じ関数（ビルドで1本にまとめる）






const $ = sel => document.querySelector(sel);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = () => logicalDate(new Date());

let db = loadDb();
let tab = 'today';
let flash = null; // { text, kind }

function persist() { saveDb(db); }
function isShift() { return db?.ui?.shiftDate === today(); }
function leaves() { return db.log.entries.filter(e => e.type === 'completion'); }

// ---------- 画面 ----------
function render() {
  const root = $('#app');
  if (!db) { root.innerHTML = viewOnboarding(); bind(); return; }
  const views = { today: viewToday, tree: viewTree, deck: viewDeck, model: viewModel, settings: viewSettings };
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
  return `
  <main class="onb">
    <h1>手札</h1>
    <p class="lede">やる気はいらない。手札を1枚ずつ試すと、木が育って、自分に合うものが分かってくる。</p>
    <section class="card">
      <h2>1. 今の何が嫌？</h2>
      ${DIRECTIONS.map(d => `<label class="opt"><input type="radio" name="dir" value="${d.id}"> ${esc(d.trouble)}</label>`).join('')}
    </section>
    <section class="card" id="gainBox" hidden>
      <h2>2. それが少し変わったら、何が増える？</h2>
      <div id="gains"></div>
      <label class="opt small">自分の言葉で言い直す（任意）<input type="text" id="ownWord" placeholder="例: 朝が軽い日"></label>
    </section>
    <button class="primary" id="startBtn" disabled>はじめる（最初の手札が届く）</button>
    <p class="note">通知はありません。データはこの端末の中だけに保存されます。</p>
  </main>`;
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
    <div class="gain">『${esc(s.direction.gain)}』のために <b>${s.totals.completions}</b> 回</div>
    <div class="sub">木の葉 ${leaves().length} 枚 ／ 戻ってきた回数 ${s.totals.returns}</div>
    <label class="switch"><input type="checkbox" id="shiftToggle" ${shift ? 'checked' : ''}> 今日は出番（1分の札だけ・通知なし・サボり扱いなし）</label>
  </header>
  ${db.ui?.welcomeBack ? `<div class="okaeri">おかえり。続きから。</div>` : ''}
  <section class="card exp">
    <div class="tag">今回の実験 ${s.experiment.completions}/${CUTOFF_N}</div>
    <div class="act">${esc(action.name)}</div>
    <div class="lens"><b>${esc(card.name)}</b><span class="how">${esc(card.how)}</span><span class="src">${esc(card.source)}・${esc(card.evidence)}</span></div>
    ${cut ? '' : `<button class="primary big" id="doneBtn">できた</button>`}
  </section>
  ${cut ? `
  <section class="card">
    <h2>3回できた。この見方、また使う？</h2>
    <div class="row">
      <button class="choice" data-verdict="また使う">また使う</button>
      <button class="choice ghost" data-verdict="もういい">もういい</button>
    </div>
    <h3>次の1枚を選ぶ</h3>
    ${cands.map(c => `<label class="opt"><input type="radio" name="next" value="${c.id}"> <b>${esc(c.name)}</b><span class="small">（${esc(c.category)}）${esc(c.how)}</span></label>`).join('')}
    ${cands.length === 0 ? '<p class="note">候補が尽きた。図鑑で手札を足すか、設定で方向を変える。</p>' : ''}
    <button class="primary" id="verdictBtn" disabled>この見方で次へ</button>
    <button class="ghost" id="laterBtn">後で</button>
  </section>` : ''}
  ${db.ui?.askQuestion ? `
  <section class="card q">
    <h2>今日の1問（飛ばしてよい）</h2>
    <p>${esc(card.question.text)}</p>
    <div class="row wrap">${card.question.options.map((o, i) => `<button class="choice" data-answer="${i + 1}">${esc(o)}</button>`).join('')}</div>
    <input type="text" id="answerText" placeholder="一言（任意）">
    <div class="row"><button id="answerSave">記録</button><button class="ghost" id="answerSkip">飛ばす</button></div>
  </section>` : ''}
  ${s.mitate ? `<section class="card mitate">🔮 見立て: ${esc(s.mitate.text)}</section>` : ''}
  <section class="card road"><b>道のり</b> いま: ${esc(st.label)} → 次: ${esc(st.next)}</section>`;
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
  <section class="card"><b>図鑑</b> ${db.cards.length} 枚のうち試した ${tried.size} 枚<span class="small">（試していない ${untried} 枚）</span></section>
  ${groups.map(g => `<section class="card"><h3>${esc(g.cat)}</h3><div class="grid">${g.cards.map(c => {
    const v = verdictOf(c.id);
    const cls = c.id === s.experiment.cardId ? 'now' : v === 'また使う' ? 'yes' : v === 'もういい' ? 'no' : tried.has(c.id) ? 'tried' : 'un';
    return `<div class="tile ${cls}"><b>${esc(c.name)}</b><span>${esc(c.type)}・${esc(c.evidence)}${c.fromBook ? '・本' : ''}</span></div>`;
  }).join('')}</div></section>`).join('')}
  <section class="card">
    <h3>手札を足す（本の一節から・自分で）</h3>
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
    <h3>見方のタイプ <span class="small">（数字は端末が数える。3件未満は出さない）</span></h3>
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
    <h3>方向</h3>
    <p>いま: ${esc(s.direction.trouble)} → 『${esc(s.direction.gain)}』</p>
    <select id="dirSel">${DIRECTIONS.map(d => `<option value="${d.id}" ${d.id === s.direction.id ? 'selected' : ''}>${esc(d.trouble)}</option>`).join('')}</select>
    <select id="gainSel"></select>
    <input id="dirWord" placeholder="自分の言葉（任意）">
    <button id="dirChange">方向を変える（山は棚に残る）</button>
  </section>
  <section class="card">
    <h3>見立て（占い調でよい・3回試すまで次は出ない）</h3>
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
function bind() {
  document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); });

  if (!db) {
    const dirs = document.querySelectorAll('input[name=dir]');
    dirs.forEach(r => r.onchange = () => {
      const d = DIRECTIONS.find(x => x.id === r.value);
      $('#gains').innerHTML = d.gains.map((g, i) => `<label class="opt"><input type="radio" name="gain" value="${i}" ${i === 0 ? 'checked' : ''}> ${esc(g)}</label>`).join('');
      $('#gainBox').hidden = false; $('#startBtn').disabled = false;
    });
    $('#startBtn').onclick = () => {
      const dirId = document.querySelector('input[name=dir]:checked')?.value; if (!dirId) return;
      const gainIndex = Number(document.querySelector('input[name=gain]:checked')?.value ?? 0);
      const word = $('#ownWord').value.trim() || null;
      const state = initState({ directionId: dirId, gainIndex, ownWord: word, today: today() });
      db = { cards: SEED_CARDS, state, log: { entries: [] }, model: { denied: [], words: [], selfDesc: null }, ui: {} };
      persist(); tab = 'today'; flash = { text: `はじめました。まず「${findAction(state.experiment.actionId).name}」。`, kind: 'ok' }; render();
    };
    return;
  }

  const s = db.state;
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
  $('#mitateSet') && ($('#mitateSet').onclick = () => { const r = setMitate(s, $('#mitateText').value.trim()); if (!r.ok) { flash = { text: r.reason, kind: 'ng' }; render(); return; } db.state = r.state; persist(); flash = { text: '見立てを置いた。', kind: 'ok' }; render(); });
  $('#exportBtn') && ($('#exportBtn').onclick = () => { $('#ioBox').value = JSON.stringify(db); $('#ioBox').select(); });
  $('#importBtn') && ($('#importBtn').onclick = () => { try { const d = JSON.parse($('#ioBox').value); if (!d.state || !d.cards) throw new Error(); db = d; persist(); flash = { text: '読み込んだ。', kind: 'ok' }; render(); } catch { flash = { text: '読み込めない JSON', kind: 'ng' }; render(); } });
  $('#resetBtn') && ($('#resetBtn').onclick = () => { if (confirm('本当に最初から？ 木も図鑑も消えます。')) { localStorage.removeItem('tefuda.v1'); db = null; render(); } });
}

render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});

})();