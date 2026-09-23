// 手札 app.js — 自動生成（scripts/build-pwa.mjs）build 202609230742
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
// 棚卸し（問診 v3）— 設計書 §18 / docs/research/2026-09-15-生きる目的を問診で仮決めする.md
// 本人指示（2026-09-15/16）「丁寧にボリュームを取得して、それを集中させる」「いろんな手法のカードを増やして。やりたくないやつは飛ばしていい。性格診断くらい設問は多くていい」
//   1) 拡げる: 手法カード（出典つき）を好きな順に。型は 書く／選ぶ／当てはまり度 の3種。飛ばしてよい
//   2) 絞る:   集まった材料を見返して「今も本当」に星（上限10）→ 3つに
//   3) 組み立て: 残った自分の言葉で「［誰］のために、［使うもの］を使って、［増やすもの］を増やす人」
// AI は推定しない。数字は端末が数える。タイプ名で固定しない（当てはまり度は目盛りのまま見せる）。

const STAR_LIMIT = 10;
const FINAL_LIMIT = 3;
const VALUE_STEPS = [10, 5, 3];

const GROUPS = [
  { id: 'now', title: 'いまのこと' },
  { id: 'past', title: '昔のこと' },
  { id: 'future', title: 'これからのこと' },
  { id: 'people', title: 'まわりの人' },
  { id: 'who', title: '誰のためか（輪郭）' },
  { id: 'self', title: '好き・得意・大事' },
  { id: 'whole', title: '全体を見る（当てはまり度）' },
  { id: 'record', title: 'いまの状況（記録用）' },
  { id: 'belief', title: '信念（当たり前だと思っていること）' },
  { id: 'temper', title: '内向型の資質（INFP と言われる人の素材）' },
];

const w = (id, text, hint = '', max = 3) => ({ id, text, hint, max });
const pk = (words, dir = null) => words.split(/\s+/).filter(Boolean).map(w => ({ w, dir }));
const r = (id, text, dir = null) => ({ id, text, dir });

// 価値の言葉（方向のタグつき。null は方向に寄らない）
const VALUES = [
  ...['健康', '体力', '眠り', '軽さ', '動くこと', '外に出ること', '自然'].map(w => ({ w, dir: 'body' })),
  ...['学び', '作ること', '上達', '集中', '好奇心', '表現', '完成させること'].map(w => ({ w, dir: 'make' })),
  ...['安心', '余裕', '蓄え', 'お金が分かっていること', '自立', '備え'].map(w => ({ w, dir: 'money' })),
  ...['家族', '仲間', '感謝されること', '信頼', '会話', '役に立つこと', '居場所', '笑い'].map(w => ({ w, dir: 'people' })),
  ...['理解', '考えること', '知ること', '説明できること', '判断力'].map(w => ({ w, dir: 'head' })),
  ...['自由', '静けさ', '誠実', '挑戦', '安定', '楽しさ', '美しさ', '誇り', '感謝', '正直', '思いやり', '勇気', '遊び', '伝統', '静かな時間', 'ユーモア'].map(w => ({ w, dir: null })),
];

// kind: write=1問ずつ自由記述 / pick=言葉を選んで絞る（options・steps） / rate=当てはまり度（scale 段階）
const METHODS = [
  // ---- いまのこと ----
  { id: 'gtj', group: 'now', kind: 'write', title: '良い時間の日記', source: 'Burnett & Evans『スタンフォード式 人生デザイン講座』', minutes: 6,
    why: '最近の時間の使い方から「好き」と「消耗」を拾う。正解はない。', items: [
      w('gtj1', '休みの日、気づいたらやっていること', '例: 車の掃除／YouTube／昼寝', 5),
      w('gtj2', 'この1か月で、時間を忘れた瞬間', '無ければ「なし」でよい', 3),
      w('gtj3', 'やっていると元気が出ること', '小さいことでよい', 5),
      w('gtj4', 'やると疲れる・消耗すること', 'ここは避ける方向を知るため', 5),
      w('gtj5', '出番の合間に、つい見ているもの・考えていること', '', 3),
      w('gtj6', '「これだけは手を抜かない」と思っていること', '仕事でも家でも', 3),
    ] },
  { id: 'energy', group: 'now', kind: 'write', title: 'エネルギーの棚卸し', source: 'Loehr & Schwartz『成功と幸せのための4つのエネルギー管理術』', minutes: 4,
    why: '1週間のうち、体と気持ちが上がる時間・下がる時間を分ける。', items: [
      w('en1', '1週間の中で、いちばん気分がいい時間帯・場面', '例: 明けの午前、風呂上がり', 3),
      w('en2', '1週間の中で、いちばん重い時間帯・場面', '', 3),
      w('en3', '考えるだけで体が軽くなること', '', 5),
      w('en4', '考えるだけで体が重くなること', '', 5),
    ] },
  { id: 'flow', group: 'now', kind: 'write', title: '夢中の記録', source: 'Csikszentmihalyi『フロー体験』', minutes: 4,
    why: '「難しいけど楽しい」が続くことは、合っている活動のしるし。', items: [
      w('fl1', '難しいけど楽しい、と思えること', '', 5),
      w('fl2', '少しずつ上手くなっている実感があること', '', 3),
      w('fl3', '終わった後に満足が残ること', '', 3),
      w('fl4', '人に言われなくても続けていること', '', 5),
      w('fl5', 'やりかけて放ってあるが、気になっていること', '', 3),
    ] },
  // ---- 昔のこと ----
  { id: 'story', group: 'past', kind: 'write', title: '人生の物語', source: 'McAdams「ライフストーリー・インタビュー」', minutes: 10,
    why: '自分が大事にしていることは、覚えている場面に出る。書きたい場面だけでよい。', items: [
      w('st1', '人生を3つの章に分けるなら、それぞれの題名', '例: 実家／独立／今', 3),
      w('st2', 'いちばん良かった場面', 'いつ・どこで・誰と', 3),
      w('st3', 'いちばんつらかった場面（書ける範囲で）', '', 2),
      w('st4', '「ここで変わった」と思う転機', '', 3),
      w('st5', '子どものころの、はっきり覚えている記憶', '', 3),
      w('st6', '誇らしかった瞬間', '', 3),
      w('st7', '影響を受けた人と、その人から受け取ったもの', '', 3),
      w('st8', '昔から変わらない自分のところ', '', 5),
    ] },
  { id: 'kid', group: 'past', kind: 'write', title: '12歳の自分', source: 'Damon『「目的」を持って生きる』', minutes: 4,
    why: '昔から続く興味は、いちばん信用できる材料。', items: [
      w('kd1', '12歳のころ、放っておくとやっていたこと', '', 5),
      w('kd2', '子どものころ、褒められたこと・得意だったこと', '', 5),
      w('kd3', '子どものころに夢中だった物・場所・遊び', '', 5),
      w('kd4', '昔の自分が今の自分を見たら、驚くこと', '', 3),
    ] },
  { id: 'regret', group: 'past', kind: 'write', title: '後悔の一覧', source: 'Gilovich & Medvec「やらなかった後悔は長く残る」', minutes: 4,
    why: '「やった後悔」は薄れ、「やらなかった後悔」は残る。残っているものを出す。', items: [
      w('rg1', 'やらなくて後悔していること', '', 5),
      w('rg2', 'やめてしまって、今も気になっていること', '', 3),
      w('rg3', '言えなかったこと・伝えていないこと', '', 3),
      w('rg4', 'もう一度やり直せるなら、変えること', '', 3),
    ] },
  // ---- これからのこと ----
  { id: 'bps', group: 'future', kind: 'write', title: '最高の未来の自分', source: 'King「Best Possible Self」（King 2001）', minutes: 6,
    why: '全部うまくいった5年後の1日を、細かく書く。願いではなく描写で。', items: [
      w('bp1', '5年後、全部うまくいっているとして、朝起きてから寝るまでの1日', '細かく', 5),
      w('bp2', 'その1日で、体はどんな感じか', '', 3),
      w('bp3', 'その1日で、仕事以外に何があるか', '', 5),
      w('bp4', 'その1日で、誰と、どんなやりとりをしているか', '', 3),
      w('bp5', 'その1日で、お金の状態はどうか', '', 2),
    ] },
  { id: 'odyssey', group: 'future', kind: 'write', title: '3つの5年', source: 'Burnett & Evans「オデッセイ・プラン」', minutes: 5,
    why: '「1つの正解」を探さず、3つ並べると本音が見える。', items: [
      w('od1', 'このまま続けた場合の5年後', '', 3),
      w('od2', '今の仕事が無くなった場合の5年後', '', 3),
      w('od3', 'お金と人の目を気にしなくていい場合の5年後', '', 3),
    ] },
  { id: 'eulogy', group: 'future', kind: 'write', title: '80歳と弔辞', source: 'Covey『7つの習慣』（終わりを思い描く）', minutes: 5,
    why: '長い目で見ると、何が残るかが分かる。', items: [
      w('eu1', '80歳の自分が「やっておけばよかった」と言いそうなこと', '80歳の目で見る', 5),
      w('eu2', '家族に、自分について言ってほしいこと', '', 3),
      w('eu3', '客や仲間に、自分について言ってほしいこと', '', 3),
      w('eu4', '1年後「これが増えた」と言えたら嬉しいこと', '', 5),
    ] },
  { id: 'anti', group: 'future', kind: 'write', title: 'なりたくない生き方', source: 'Elliot & Sheldon「回避目標」の研究', minutes: 3,
    why: '「嫌」をひっくり返すと、大事なものが出てくる。', items: [
      w('an1', '絶対にこうはなりたくない、と思う生き方', '', 3),
      w('an2', '身近で「ああはなりたくない」と思った例', '書ける範囲で', 3),
      w('an3', 'それをひっくり返すと、どうなっていたいか', '', 3),
    ] },
  { id: 'bucket', group: 'future', kind: 'write', title: 'やってみたいこと100', source: '「バケットリスト」（Gilovich の後悔研究と対）', minutes: 8,
    why: '数を出す。大小・現実性は問わない。', items: [
      w('bk1', 'やってみたいこと・行きたい場所・会いたい人', '思いつくだけ。30まで', 30),
    ] },
  // ---- まわりの人 ----
  { id: 'reaction', group: 'people', kind: 'write', title: '人からの反応', source: '八木仁平『世界一やさしい「やりたいこと」の見つけ方』／神谷美恵子『生きがいについて』', minutes: 5,
    why: '「得意」と「誰の役に立っているか」は、人からの反応に出る。', items: [
      w('re1', 'よく頼まれること', '', 5),
      w('re2', '「ありがとう」と言われたこと（最近の分）', '', 3),
      w('re3', '人に教えられること', '', 3),
      w('re4', '自分がいなくなったら困る人・場面', '', 3),
      w('re5', '誰の役に立ちたいか', '例: 家族／客／仲間／知らない人／未来の自分', 3),
    ] },
  { id: 'envy', group: 'people', kind: 'write', title: 'うらやましさと尊敬', source: 'Schwartz「価値の理論」／Bandura「モデリング」', minutes: 4,
    why: 'うらやましさと尊敬は、自分が大事にしているものの映し。', items: [
      w('ev1', 'うらやましいと思った人と、その人の何が', '例: 〇〇さんの、体が軽そうなところ', 3),
      w('ev2', '尊敬している人と、その人のどこが', '', 3),
      w('ev3', 'その人たちに共通していること', '', 3),
    ] },
  { id: 'contrib', group: 'people', kind: 'write', title: '貢献感', source: 'アドラー（岸見『嫌われる勇気』）／Damon「自分を超えた誰か」', minutes: 4,
    why: '目的には「自分以外の誰か」が要る。', items: [
      w('co1', '最近「誰かの役に立った」と感じた場面', '', 3),
      w('co2', '誰のために動くと、疲れにくいか', '', 3),
      w('co3', '死ぬまでに、誰に何を渡したいか', '物でも技でも言葉でも', 3),
    ] },
  { id: 'friend', group: 'people', kind: 'write', title: '親友への助言', source: 'Kross「自己距離化」（Ethan Kross『Chatter』）', minutes: 3,
    why: '自分のことは分からなくても、親友のことなら言える。', items: [
      w('fr1', '親友が今のあなたと同じ状況なら、何と言ってあげるか', '', 3),
      w('fr2', '10年後の自分から、今の自分への手紙（3行）', '', 3),
      w('fr3', '尊敬する人なら、今のあなたに何を勧めるか', '', 3),
    ] },
  // ---- 好き・得意・大事 ----
  { id: 'likes', group: 'self', kind: 'write', title: '好きの一覧', source: '八木仁平「好き×得意×大事」', minutes: 4,
    why: '好きと得意は別に出す。重なりは後で見る。', items: [
      w('lk1', '好きなこと', '思いつくだけ。15まで', 15),
      w('lk2', 'お金をもらわなくてもやること', '', 5),
      w('lk3', '話し出すと止まらない話題', '', 5),
    ] },
  { id: 'skills', group: 'self', kind: 'write', title: '得意の一覧', source: '八木仁平「好き×得意×大事」', minutes: 4,
    why: '「人より楽にできる」が得意。すごい必要はない。', items: [
      w('sk1', '得意なこと・人より楽にできること', '思いつくだけ。15まで', 15),
      w('sk2', '苦手だけどやっていること', '', 5),
      w('sk3', '好きと得意が重なっていること', '上の一覧を見て', 5),
    ] },
  { id: 'values', group: 'self', kind: 'pick', steps: [10, 5, 3], title: '大事な言葉', source: 'Miller「価値カード分類」（Personal Values Card Sort）', minutes: 5,
    why: 'たくさんの言葉から選んで絞る。10 → 5 → 3。', items: [], get options() { return VALUES; } },
  { id: 'likepick', group: 'self', kind: 'pick', steps: [10, 5], title: '好きなこと（選ぶ）', source: '八木仁平「好き」の一覧化（選択肢版）', minutes: 3,
    why: '目に止まったものをタップ。無ければ自分の言葉を足す。10 → 5。', items: [], options: pk('釣り 車 ドライブ 料理 掃除 片づけ 散歩 筋トレ 風呂 昼寝 音楽 映画 動画 ゲーム 読書 漫画 写真 絵 工作 DIY 園芸 動物 旅行 温泉 神社・寺 食べ歩き 酒 コーヒー 買い物 人と話す 相談に乗る 教える 調べる 数字 地図 天気 歴史 機械 電気 パソコン 将棋・囲碁 麻雀 スポーツ観戦 ゴルフ キャンプ 海 山 川 星') },
  { id: 'skillpick', group: 'self', kind: 'pick', steps: [10, 5], title: '得意なこと（選ぶ）', source: '八木仁平「得意」の一覧化（選択肢版）', minutes: 3,
    why: '「人より楽にできる」を選ぶ。すごい必要はない。10 → 5。', items: [], options: pk('運転 道を覚える 段取り 早起き 続ける 手を動かす 直す 片づける 数字に強い 計算 記憶 観察 聞く 話す なだめる 場を和ませる 説明 教える まとめる 決める 待つ 我慢 体力 力仕事 細かい作業 料理 掃除 交渉 探す 調べる 先読み 危険を避ける 冷静 顔を覚える 気配り 笑わせる 文章 写真 機械 電気 パソコン') },
  { id: 'whopick', group: 'people', kind: 'pick', steps: [5, 3], title: '誰のために（選ぶ）', source: 'Damon「自分を超えた誰か」（選択肢版）', minutes: 2,
    why: '動くと疲れにくい相手を選ぶ。5 → 3。', items: [], options: pk('家族 妻・夫 子 親 兄弟 常連の客 一見の客 同業の仲間 昔の友人 近所の人 知らない人 未来の自分 過去の自分 若い人 年配の人 困っている人 動物 地域 自分自身') },
  // ---- 誰のためか（輪郭）: 直接は聞かない。痕跡・怒り・境界・体の反応から三角測量する（本人指示 2026-09-23）----
  { id: 'anger', group: 'who', kind: 'write', title: '見ていられない場面', source: 'Haidt『社会はなぜ左と右にわかれるのか』（道徳基盤）／Schwartz「価値の理論」', minutes: 4,
    why: '腹が立つ場面には、自分がどちら側に立っているかが出る。怒りは価値の裏返し。', items: [
      w('ag1', '最近、人の話やニュースで腹が立った場面', '小さいことでよい', 5),
      w('ag2', 'その時、割を食っていたのは誰か', '例: 断れない人／知らずに損している人', 3),
      w('ag3', '「見ていられない」と感じるのは、どんな人が、どうなっている時か', '', 3),
      w('ag4', 'つい口を出してしまったこと', '', 3),
    ] },
  { id: 'trace', group: 'who', kind: 'write', title: 'すでに払った時間', source: 'Burnett & Evans『スタンフォード式 人生デザイン講座』／Damon「自分を超えた誰か」', minutes: 4,
    why: 'やりたいことではなく、もう実際にやってしまったことを見る。痕跡は嘘をつかない。', items: [
      w('tc1', '頼まれていないのに、説明した・手を出したこと', '', 5),
      w('tc2', 'お金をもらわずに、いちばん時間を使った相手', '', 3),
      w('tc3', '「またやって」と言われたこと', '', 3),
      w('tc4', '自分の時間を削ってでも直したくなるもの', '', 3),
    ] },
  { id: 'pastme', group: 'who', kind: 'write', title: '何年前の自分か', source: 'Kross『Chatter』自己距離化／McAdams「救済の物語」', minutes: 4,
    why: '「過去の自分」で止めない。何年前の、どの場面かまで降ろすと、相手が具体になる。', items: [
      w('pm1', 'いま戻れるなら、何年前の自分のところへ行くか', '年と、その時の場面を一言', 3),
      w('pm2', 'その時の自分が、いちばん欲しかったもの', '言葉・物・お金・人のどれでも', 3),
      w('pm3', '誰が何を言ってくれたら、あの時は楽になったか', '', 3),
      w('pm4', 'その自分に、いまなら渡せるもの', '', 3),
    ] },
  { id: 'notwho', group: 'who', kind: 'write', title: '動けない相手', source: 'Kelly「レパートリー・グリッド」（対比で輪郭を出す）', minutes: 3,
    why: '「誰のためでないか」を決めると、輪郭は一気に締まる。正直でよい。', items: [
      w('nw1', '正直、助けたいと思えない人', '', 3),
      w('nw2', '関わると消耗する相手の共通点', '', 3),
      w('nw3', '「この人のためには動けない」と思った場面', '', 3),
    ] },
  { id: 'reach', group: 'who', kind: 'write', title: '話が通じる相手', source: 'Little「私的プロジェクト」／Cain『内向型人間の時代』', minutes: 3,
    why: '届く範囲は、すでに同じ景色が見えている人のところにある。', items: [
      w('rc1', '説明していて、いちばん話が通じやすい相手', '', 3),
      w('rc2', '自分の失敗を話せるのは、どういう人か', '', 3),
      w('rc3', '「同じものが見えている」と感じた瞬間', '', 3),
    ] },
  { id: 'paid', group: 'who', kind: 'write', title: '金を払ってでも助けてほしかった', source: 'Christensen「ジョブ理論」／八木仁平『やりたいことの見つけ方』', minutes: 4,
    why: '自分が当事者だった困りごとは、いちばん強い入口になる。', items: [
      w('pd1', 'お金を払ってでも、誰かに助けてほしかった場面', '', 5),
      w('pd2', 'その時、いてほしかったのに、いなかった人', '', 3),
      w('pd3', 'いま同じ場所にいる人は、どこにいるか', '例: 同じ職場／同じ年ごろ／同じ状況', 3),
    ] },
  { id: 'whopick2', group: 'who', kind: 'pick', steps: [10, 5, 3], title: '具体的な相手（選ぶ）', source: '既存「誰のために（選ぶ）」を生活の言葉に置き換えた版（Damon）', minutes: 3,
    why: '「人」「世の中」のような空っぽの言葉を選べなくする。10 → 5 → 3 に絞る。', items: [], options: pk('3年前の自分 10年前の自分 20歳の自分 お金の不安で眠れない人 辞めたいのに動けない人 始めたばかりの新人 一人で抱えている人 夜に働く人 体を壊した人 眠れていない人 家族を養っている人 家族を失った人 力があるのに出せない人 選択肢が無いと思っている人 だまされた人 借金がある人 独りで暮らす年配の人 子どもを育てている人 同じ職場の後輩 同じ仕事の同業者 常連の客 初めて乗る客 親 きょうだい 昔の友人 近所の人 自分の子ども 病気の人 引きこもっている人 才能を腐らせている人') },
  { id: 'bodywho', group: 'who', kind: 'rate', scale: 5, top: 5, title: '思い浮かべた時の体', source: 'Gendlin『フォーカシング』（felt sense）／Loehr & Schwartz「エネルギー管理」', minutes: 3,
    why: '頭で答えさせない。その人のために動くと想像したとき、体が軽くなる=5／重くなる=1。頭の答えとズレたら、そのズレ自体が材料になる。', items: [
      r('bw1', '昔の自分と同じ状況にいる人'), r('bw2', '家族'), r('bw3', '同じ仕事をしている仲間'), r('bw4', '目の前の客'),
      r('bw5', '知らない人・不特定多数'), r('bw6', '年下・始めたばかりの人'), r('bw7', '年上・世話になった人'), r('bw8', '困っていると自分から言える人'),
      r('bw9', '困っていても言えない人'), r('bw10', '自分ひとり'), r('bw11', 'まだ会っていない人'), r('bw12', '会社・組織'),
    ] },
  { id: 'kidpick', group: 'past', kind: 'pick', steps: [10, 5], title: '12歳の自分（選ぶ）', source: 'Damon／McAdams（選択肢版）', minutes: 3,
    why: '子どものころ放っておくとやっていたことを選ぶ。10 → 5。', items: [], options: pk('外で遊ぶ 自転車 虫・魚 川・海 山 秘密基地 野球 サッカー 走る 泳ぐ ゲーム 漫画 アニメ 図鑑 読書 絵 工作 プラモ 機械いじり ラジオ 音楽 歌 楽器 料理 家の手伝い 動物 植物 集める 友だちの家 一人で空想 テレビ 映画 地図 電車・車 星 釣り') },
  { id: 'regretpick', group: 'future', kind: 'pick', steps: [10, 3], title: '80歳の後悔（選ぶ）', source: 'Gilovich「やらなかった後悔」（選択肢版）', minutes: 3,
    why: '80歳の自分が「やっておけばよかった」と言いそうなものを選ぶ。10 → 3。', items: [], options: pk('体を大事にしなかった 歯 眠らなかった 運動しなかった 学ばなかった 資格 本を読まなかった 作らなかった 旅をしなかった 会いたい人に会わなかった 親と話さなかった 子と遊ばなかった 友人と疎遠 好きと言わなかった 謝らなかった お金を貯めなかった お金を使わなかった 独立しなかった 仕事を変えなかった 挑戦しなかった 断らなかった 人の目を気にした 怒りすぎた 我慢しすぎた 楽しまなかった 写真を残さなかった 記録しなかった 感謝を言わなかった 自分の時間を持たなかった') },
  { id: 'growpick', group: 'future', kind: 'pick', steps: [10, 5, 3], title: '増やしたいもの（選ぶ）', source: '手札の「増えるもの」（§3）の選択肢版', minutes: 3,
    why: '1年後「これが増えた」と言えたら嬉しいものを選ぶ。10 → 5 → 3。最後の3つが「増やすもの」と実験の方向の候補になる。', items: [], options: [
      ...pk('体が軽い時間 眠れる夜 朝の余裕 動ける体 痛みのない日 整った部屋 手入れされた車・家', 'body'),
      ...pk('貯金 お金の見通し 収入の柱', 'money'),
      ...pk('家族との時間 笑い 会話 仲間 役に立った感 感謝された数', 'people'),
      ...pk('作ったもの 覚えたこと 読んだ本 行った場所 写真 続いていること 新しい経験', 'make'),
      ...pk('分かっている感 決められる感 自信', 'head'),
      ...pk('一人の時間 静けさ 楽しみの予定 自由な時間'),
    ] },
  { id: 'via', group: 'self', kind: 'rate', scale: 5, top: 5, title: '強みの自己評価', source: 'Peterson & Seligman「VIA 24の強み」（短縮・自己評価）', minutes: 5,
    why: '24の強みに「どれくらい自分らしいか」を1〜5で。上位5つが「使うもの」の候補になる。', items: [
      r('v01', '新しいやり方を思いつく', 'make'), r('v02', '好奇心が強い', 'head'), r('v03', '物事をいろんな角度から考える', 'head'), r('v04', '学ぶのが好き', 'head'), r('v05', '人に助言を求められる', 'people'),
      r('v06', '怖くてもやる', null), r('v07', '始めたことをやり抜く', null), r('v08', '正直で裏表がない', null), r('v09', '元気で活動的', 'body'),
      r('v10', '人を大事にし、大事にされる', 'people'), r('v11', '親切で世話好き', 'people'), r('v12', '人の気持ちが分かる', 'people'),
      r('v13', 'チームで動ける', 'people'), r('v14', '公平である', null), r('v15', 'まとめ役になれる', 'people'),
      r('v16', '許せる', null), r('v17', '控えめ', null), r('v18', '慎重', 'money'), r('v19', '自分を律せる', 'body'),
      r('v20', '美しいものに気づく', null), r('v21', '感謝を忘れない', null), r('v22', '希望を持てる', null), r('v23', 'ユーモアがある', 'people'), r('v24', '大きな何かにつながっている感覚がある', null),
    ] },
  { id: 'meaning', group: 'self', kind: 'rate', scale: 5, top: 5, title: '意味の源', source: 'Schnell「意味の源 26」（Sources of Meaning）', minutes: 5,
    why: '「これがあると生きている感じがする」ものに1〜5。上位が「増やすもの」の候補になる。', items: [
      r('m01', '体を動かすこと', 'body'), r('m02', '健康でいること', 'body'), r('m03', '自然の中にいること', 'body'), r('m04', '楽しむこと・遊び', null),
      r('m05', '何かを作ること', 'make'), r('m06', '知ること・学ぶこと', 'head'), r('m07', '上手くなること', 'make'), r('m08', '自分のやり方でやること', null),
      r('m09', '家族といること', 'people'), r('m10', '仲間といること', 'people'), r('m11', '人の役に立つこと', 'people'), r('m12', '誰かを育てること', 'people'),
      r('m13', '認められること', null), r('m14', '力や影響を持つこと', null), r('m15', '安定していること', 'money'), r('m16', '自由でいること', null),
      r('m17', '伝統や土地とのつながり', null), r('m18', '正しいことをすること', null), r('m19', '静かに自分と向き合うこと', null), r('m20', '大きなものへの信頼（自然・運命・信仰など）', null),
      r('m21', 'お金の見通しが立っていること', 'money'), r('m22', '考えて分かること', 'head'), r('m23', '人と深く話すこと', 'people'), r('m24', '体が軽いこと', 'body'),
      r('m25', '何かを完成させること', 'make'), r('m26', '笑うこと', 'people'),
    ] },
  // ---- 全体を見る ----
  { id: 'ikigai9', group: 'whole', kind: 'rate', scale: 5, top: 0, title: '生きがい9', source: 'Imai ほか「ikigai-9」（2012）', minutes: 2,
    why: '今の「生きがい感」を9問で。点は目安。3か月後にまた測る。', items: [
      r('ik1', '自分は何かの役に立っていると感じる'), r('ik2', '毎日が新鮮で楽しい'), r('ik3', '心に余裕がある'), r('ik4', '自分の考えを持っている'),
      r('ik5', '新しいことを学びたい'), r('ik6', '将来に向けて何かをしている'), r('ik7', '自分は成長していると感じる'), r('ik8', '世の中や人のために何かしたい'), r('ik9', '自分の存在に意味があると感じる'),
    ] },
  { id: 'wheel', group: 'whole', kind: 'rate', scale: 10, top: 0, low: 2, title: '生活の輪', source: 'コーチングの「Wheel of Life」（Meyer）', minutes: 2,
    why: '8つの領域に、今の満足を1〜10で。低いところが「変えたい」の候補。', items: [
      r('wh1', '体・健康', 'body'), r('wh2', '仕事', null), r('wh3', 'お金', 'money'), r('wh4', '家族', 'people'),
      r('wh5', '友人・仲間', 'people'), r('wh6', '学び・作ること', 'make'), r('wh7', '遊び・楽しみ', null), r('wh8', '住まい・暮らしの整い', 'body'),
    ] },
  { id: 'frankl', group: 'self', kind: 'write', title: '3つの価値', source: 'Frankl『夜と霧』『それでも人生にイエスと言う』', minutes: 4,
    why: '意味は3つの道から来る: 作って与える／受け取って感じる／変えられないことへの向き合い方。', items: [
      w('fk1', '自分が作って、誰かに与えているもの', '仕事の中でも外でも', 5),
      w('fk2', '受け取って、心が動いたもの（景色・人・音楽・出来事）', '', 5),
      w('fk3', '変えられない苦しさに、どう向き合っているか', '書ける範囲で', 3),
    ] },
  { id: 'schwartz', group: 'self', kind: 'rate', scale: 5, top: 5, title: '19の価値', source: 'Schwartz「基本的価値の理論」（PVQ-RR 短縮・自己評価）', minutes: 4,
    why: '「こういう人でありたい」に1〜5。上位が「増やすもの」「使うもの」の候補になる。', items: [
      r('sz01', '自分の考えで決めたい', 'head'), r('sz02', '自分のやり方で動きたい', null), r('sz03', '刺激や新しい経験がほしい', 'make'), r('sz04', '楽しみたい', null),
      r('sz05', '成し遂げて認められたい', 'make'), r('sz06', '人を動かす立場にいたい', 'people'), r('sz07', 'お金や物の余裕がほしい', 'money'), r('sz08', '恥をかきたくない・面目を保ちたい', null),
      r('sz09', '自分と身近な人の安全がほしい', 'money'), r('sz10', '世の中が安定していてほしい', null), r('sz11', '昔からのやり方・伝統を守りたい', null), r('sz12', '決まりを守りたい', null),
      r('sz13', '人を怒らせたくない', 'people'), r('sz14', '目立ちたくない・謙虚でいたい', null), r('sz15', '身近な人の面倒を見たい', 'people'), r('sz16', '信頼できる人でありたい', 'people'),
      r('sz17', '弱い立場の人を大事にしたい', 'people'), r('sz18', '自然を守りたい', 'body'), r('sz19', '自分と違う人も受け入れたい', 'people'),
    ] },
  { id: 'osaki', group: 'whole', kind: 'write', title: '生きがいの1問', source: 'Sone ほか「大崎コホート研究」（2008）', minutes: 1,
    why: '研究では、この1問に「ある」と答えた人ほど長生きした。', items: [
      w('os1', 'あなたには「生きがい」がありますか？', '「ある」「ない」「分からない」のどれかを書く', 1),
      w('os2', '「ある」なら、それは何？', '無ければ「候補になりそうなもの」を', 3),
    ] },
  { id: 'perma', group: 'whole', kind: 'rate', scale: 10, top: 0, low: 2, title: '幸せの5つの柱', source: 'Seligman「PERMA」（Butler & Kern の短縮版）', minutes: 2,
    why: '5つの柱に今の状態を1〜10で。低いところが「増やしたいもの」の候補。', items: [
      r('pm1', 'いい気分でいる時間がある', null), r('pm2', '夢中になれるものがある', 'make'), r('pm3', '支え合える人がいる', 'people'), r('pm4', '自分のしていることに意味を感じる', null), r('pm5', 'やり遂げている感覚がある', 'make'),
    ] },
  { id: 'context', group: 'record', kind: 'write', title: 'いまの状況', source: '自分の年表のため（McAdams のライフストーリー＋Sone の追跡調査の考え方）', minutes: 5,
    why: 'その時、何をしていて、何を考え、何を大事にしていたか。あとで年表にして変化を見る。', items: [
      w('cx1', '仕事の状態', '例: 出番の売上、疲れ具合、続けるつもりか', 3),
      w('cx2', '人間関係の状態', '家族・客・仲間・それ以外', 3),
      w('cx3', '体の状態', '眠り・体重・痛み・動けているか', 3),
      w('cx4', 'お金の状態', '書ける範囲で', 2),
      w('cx5', '暮らし・住まいの状態', '', 2),
      w('cx6', 'いま、時間を使っていること', '仕事以外で', 5),
      w('cx7', 'いま、よく考えていること', '', 5),
      w('cx8', 'いま、大事にしていること', '言葉で', 5),
      w('cx9', 'この3か月で変わったこと', '無ければ「なし」', 3),
    ] },
  // ---- 信念（2026-09-21 本人「内向的だから、設問と自由記述で信念を見つけたい」。docs/research/2026-09-21-信念を1人で見つける手法.md）----
  { id: 'change', group: 'belief', kind: 'rate', scale: 5, top: 0, axis: { name: '人は変われる', pos: ['ch1', 'ch3', 'ch5', 'ch7', 'ch9'] }, title: '人は変われるか', source: 'Dweck「Kind of Person」暗黙の理論（言い換え版）', minutes: 2,
    why: '「人の性質は変えられる／変えられない」をどれくらい信じているか。点は目盛り。正解はない。', items: [
      r('ch9', '自分の弱点も、練習で目立たなくできる'), r('ch10', '人は、根っこのところは一生同じだ'),
      r('ch1', '人の基本的な性質は、努力で大きく変えられる'), r('ch2', '自分の性格は、もうだいたい決まっている'), r('ch3', '年を取ってからでも、人は新しいやり方を身につけられる'), r('ch4', 'どんな人にも、変えられない芯がある'),
      r('ch5', '苦手なことは、やり方次第で得意になりうる'), r('ch6', '人は結局、生まれ持ったものの範囲でしか動けない'), r('ch7', '自分は3年前より、ものの見方が変わった'), r('ch8', '「人は変わらない」と思うと、少し楽になる'),
    ] },
  { id: 'control', group: 'belief', kind: 'rate', scale: 5, top: 0, axis: { name: '結果は自分で決まる', pos: ['lc1', 'lc4', 'lc6', 'lc7', 'lc9'] }, title: '結果は自分で決まるか', source: 'Rotter「統制の所在」（言い換え版）', minutes: 2,
    why: '「結果は努力で決まる」と「運や他人で決まる」のどちらに寄っているか。点は目盛り。', items: [
      r('lc9', '今日の気分は、自分の行動で変えられる'), r('lc10', '何をしても、なるようにしかならない'),
      r('lc1', 'うまくいくかどうかは、だいたい自分の準備で決まる'), r('lc2', '人生は運の要素が大きい'), r('lc3', '計画を立てても、結局は周りの都合で変わる'), r('lc4', '自分の稼ぎは、自分の工夫で増やせる'),
      r('lc5', '偉い人や会社の都合には逆らえない'), r('lc6', '嫌なことが起きた時、まず自分の何が悪かったか考える'), r('lc7', '健康は、自分の毎日の選択の結果だ'), r('lc8', '人間関係は、相手次第でどうにもならないことが多い'),
    ] },
  { id: 'musts', group: 'belief', kind: 'rate', scale: 5, top: 5, title: 'べき・ねば の棚卸し', source: 'Ellis の非合理的信念（要求・破局視・耐性・自己卑下 × 達成・所属・快適）SGABS の構造（言い換え版）', minutes: 3,
    why: '自分を縛っている「〜すべき」「〜でなければ」を見つける。上位が「ルール信念」の候補。', items: [
      r('mu1', '仕事で失敗してはいけない'), r('mu2', '人に嫌われてはいけない'), r('mu3', '不快なことは、できるだけ避けるべきだ'),
      r('mu4', '失敗したら、取り返しがつかない'), r('mu5', '人に拒まれるのは、耐えられないほどつらい'), r('mu6', '面倒なことを我慢するのは、無理だ'),
      r('mu7', 'うまくできない自分は、価値が低い'), r('mu8', '人に受け入れられない自分は、ダメな人間だと感じる'), r('mu9', '楽ができないなら、やる意味がない'),
      r('mu10', '一度決めたことは、やり抜かねばならない'), r('mu11', '頼まれたら、断ってはいけない'), r('mu12', '休むのは、さぼりだ'),
    ] },
  { id: 'selfother', group: 'belief', kind: 'rate', scale: 5, top: 0, title: '自分と他人の見方', source: 'Brief Core Schema Scales（自分＋／自分−／他人＋／他人−）の構造（言い換え版）', minutes: 2,
    why: '「自分はこういう者だ」「人はこういう者だ」の4つの面を目盛りで。', items: [
      r('so1', '自分は、役に立つ人間だ'), r('so2', '自分は、面白いところがある'), r('so3', '自分は、信頼できる'),
      r('so4', '自分は、弱い'), r('so5', '自分は、人より劣っている'), r('so6', '自分は、失敗しがちだ'),
      r('so7', '人は、だいたい親切だ'), r('so8', '人は、信用できる'), r('so9', '人は、自分を受け入れてくれる'),
      r('so10', '人は、利用してくる'), r('so11', '人は、冷たい'), r('so12', '人は、自分を見下している'),
    ] },
  { id: 'world', group: 'belief', kind: 'rate', scale: 5, top: 0, axis: { name: '世界は公平で安全', pos: ['wd1', 'wd3', 'wd5', 'wd7', 'wd9'] }, title: '世界の見方', source: 'Janoff-Bulman「世界に関する想定」・Lerner「公正世界信念」（言い換え版）', minutes: 2,
    why: '世界を「だいたい公平で安全」と見るか「理不尽で危ない」と見るか。', items: [
      r('wd1', '真面目にやっていれば、だいたい報われる'), r('wd2', '世の中は理不尽なことのほうが多い'), r('wd3', '困った時、誰かが助けてくれることが多い'), r('wd4', '油断すると足元をすくわれる'), r('wd5', '人生には筋道がある'),
      r('wd6', '悪いことは、突然・理由なく起きる'), r('wd7', '努力した人は、いつか評価される'), r('wd8', '得をするのは要領のいい人だ'), r('wd9', '自分の周りの世界は、おおむね安全だ'), r('wd10', '世の中は弱い者に厳しい'),
    ] },
  { id: 'money', group: 'belief', kind: 'rate', scale: 5, top: 5, title: 'お金と仕事の信念', source: 'Klontz「マネー・スクリプト」（回避・崇拝・地位・警戒）＋ Wrzesniewski「仕事は職／出世／天職」（言い換え版）', minutes: 3,
    why: 'お金と仕事について、疑わずに持っている前提。上位が「隠れた台本」の候補。', items: [
      r('mo1', 'お金の話をするのは、品がない'), r('mo2', 'お金があれば、たいていの問題は解決する'), r('mo3', '稼ぎの額が、その人の値打ちを表す'), r('mo4', 'いつ何があるか分からないから、常に備えておくべきだ'),
      r('mo5', '金持ちは、どこかで人を踏みつけている'), r('mo6', '自分は、お金に向いていない'), r('mo7', '欲しいものを我慢するのは、正しいことだ'), r('mo8', '仕事は、生活のためにやるものだ'),
      r('mo9', '仕事は、自分が何者かを決める'), r('mo10', '仕事に楽しさを求めるのは甘い'), r('mo11', '一つの仕事を長く続けるのが立派だ'), r('mo12', '自分で稼ぐ道を作れる人は、特別な人だ'),
    ] },
  { id: 'relation', group: 'belief', kind: 'rate', scale: 5, top: 0, axis: { name: '人に頼れる', pos: ['rl1', 'rl3', 'rl5', 'rl7', 'rl9'] }, title: '人間関係の信念', source: '愛着（不安／回避）の自己評価 ECR の構造（言い換え版）', minutes: 2,
    why: '人と近づく・頼る・頼られることをどう見ているか。', items: [
      r('rl1', '困った時、人に頼るのは自然なことだ'), r('rl2', '人に頼ると、いずれ失望する'), r('rl3', '本音を話しても、関係は壊れない'), r('rl4', '近づきすぎると、面倒が増える'), r('rl5', '自分は、大事にされる側の人間だ'),
      r('rl6', '嫌われないように、合わせてしまう'), r('rl7', '一人の時間と人といる時間、どちらも大事だ'), r('rl8', '結局、自分のことは自分で何とかするしかない'), r('rl9', '頼られるのは、うれしい'), r('rl10', '人に迷惑をかけてはいけない'),
    ] },
  { id: 'emotion', group: 'belief', kind: 'rate', scale: 5, top: 0, axis: { name: '感情と体は味方', pos: ['em1', 'em3', 'em5', 'em7', 'em9'] }, title: '感情と体の信念', source: 'Ford & Gross「感情についての信念（制御できる／役に立つ）」＋ 身体観（言い換え版）', minutes: 2,
    why: '感情や体の反応を「役に立つ・扱える」と見るか「邪魔・どうにもならない」と見るか。', items: [
      r('em1', '嫌な気分にも、何か知らせがある'), r('em2', '感情は、出さないほうが安全だ'), r('em3', '気分は、体を動かすと変わる'), r('em4', '不安になるのは、弱いからだ'), r('em5', '体の疲れは、正直な信号だ'),
      r('em6', '感情に流されるのは、みっともない'), r('em7', '泣いたり怒ったりしても、それで終わらない'), r('em8', '体は、頑張れば言うことを聞く'), r('em9', '気持ちを言葉にすると、少し楽になる'), r('em10', '気分は、天気のようにどうにもならない'),
    ] },
  { id: 'time', group: 'belief', kind: 'rate', scale: 5, top: 0, axis: { name: '未来は開けている', pos: ['tm1', 'tm3', 'tm5', 'tm7', 'tm9'] }, title: '時間と未来の信念', source: 'Zimbardo「時間的展望」（過去＋／過去−／現在快楽／現在運命／未来）（言い換え版）', minutes: 2,
    why: '過去・現在・未来のどこに重心があるか、未来をどう見ているか。', items: [
      r('tm1', '5年後は、今より良くなっていると思う'), r('tm2', '昔のほうが良かった'), r('tm3', '今日の一手が、先の自分を作る'), r('tm4', '先のことを考えても仕方がない'), r('tm5', '昔の失敗は、今の役に立っている'),
      r('tm6', '過去の嫌な記憶が、たびたび戻ってくる'), r('tm7', '計画を立てるのは、楽しい'), r('tm8', '今が良ければそれでいい'), r('tm9', 'まだ間に合う、と思える'), r('tm10', 'もう手遅れだ、と思うことがある'),
    ] },
  { id: 'failure', group: 'belief', kind: 'rate', scale: 5, top: 0, axis: { name: '失敗は糧になる', pos: ['fa1', 'fa3', 'fa5', 'fa7', 'fa9'] }, title: '努力・失敗・完璧', source: 'Haimovitz & Dweck「失敗は伸ばす／損なう」＋ Frost「完璧主義」（言い換え版）', minutes: 2,
    why: '失敗と努力をどう見ているか。完璧主義の強さ。', items: [
      r('fa1', '失敗は、次にやることを教えてくれる'), r('fa2', '失敗は、できるだけ人に知られたくない'), r('fa3', '下手なうちから人前でやれる'), r('fa4', '中途半端にやるくらいなら、やらないほうがいい'), r('fa5', '努力そのものに、値打ちがある'),
      r('fa6', '間違えると、自分の価値が下がった気がする'), r('fa7', '60点で出して直していくほうが、結局早い'), r('fa8', '一度つまずくと、しばらく手が止まる'), r('fa9', '「できない」は「まだできない」だ'), r('fa10', '基準を下げるのは、負けだ'),
    ] },
  { id: 'worth', group: 'belief', kind: 'rate', scale: 5, top: 5, title: '自分の値打ちの置き場', source: 'Crocker「自尊感情の随伴性」（他者承認・競争・外見・家族・道徳・能力・神）（言い換え版）', minutes: 2,
    why: '「何があれば自分に価値があると感じるか」。上位が、あなたの自尊心の「置き場」。', items: [
      r('wo1', '人に認められた時、自分に価値を感じる'), r('wo2', '人より上手くできた時、自分に価値を感じる'), r('wo3', '見た目が整っている時、自分に価値を感じる'), r('wo4', '家族に喜ばれた時、自分に価値を感じる'),
      r('wo5', '正しいことをした時、自分に価値を感じる'), r('wo6', '稼げた時、自分に価値を感じる'), r('wo7', '何かを作り上げた時、自分に価値を感じる'), r('wo8', '誰かの役に立てた時、自分に価値を感じる'),
      r('wo9', '一人で静かに過ごせた時、自分に価値を感じる'), r('wo10', '何もなくても、自分には価値がある'),
    ] },
  { id: 'meaning2', group: 'belief', kind: 'rate', scale: 5, top: 0, axis: { name: '意味は自分で作る', pos: ['mn1', 'mn3', 'mn5', 'mn7'] }, title: '意味と運命の信念', source: 'Steger MLQ（意味の存在／探求）＋ 運命論・大きなものへの信頼（言い換え版）', minutes: 2,
    why: '人生の意味は「ある／探している／作るもの／与えられるもの」のどれに近いか。', items: [
      r('mn1', '人生の意味は、自分で作るものだ'), r('mn2', '人生の意味は、最初から決まっている'), r('mn3', '今の自分の生き方には、意味がある'), r('mn4', '自分が何のために生きているか、まだ探している'),
      r('mn5', '小さな日常にも、意味を見つけられる'), r('mn6', '起きることには、すべて理由がある'), r('mn7', '意味は、行動したあとに見えてくる'), r('mn8', '大きな流れに任せたほうが、うまくいく'),
    ] },
  { id: 'arrow', group: 'belief', kind: 'write', title: '下向き矢印①（仕事）', source: 'Beck／Burns「下向き矢印法」（認知行動療法）', minutes: 6,
    why: '最近ざわついた考えを1つ選び、「それが本当だとしたら、自分について何を意味する？」を5回。最後の1行が「核の信念」の候補。つらくなったら止めてよい。', items: [
      w('ar0', '最近、仕事で心がざわついた場面と、その時に頭に浮かんだ考え', '例: 客に無視された→「自分は軽く見られている」', 2),
      w('ar1', 'それが本当だとしたら、自分について何を意味する？（1回目）', '', 1),
      w('ar2', 'それが本当だとしたら、何を意味する？（2回目）', '', 1),
      w('ar3', 'それが本当だとしたら、何を意味する？（3回目）', '', 1),
      w('ar4', 'それが本当だとしたら、何を意味する？（4回目）', '', 1),
      w('ar5', 'それが本当だとしたら、何を意味する？（5回目・ここが候補）', '「私は…」の形で', 1),
    ] },
  { id: 'arrow2', group: 'belief', kind: 'write', title: '下向き矢印②（人間関係）', source: 'Beck／Burns「下向き矢印法」', minutes: 6,
    why: '人との場面で。「それが本当だとしたら、自分について何を意味する？」を5回。', items: [
      w('ab0', '最近、人との間で心がざわついた場面と、浮かんだ考え', '例: 返事が来ない→「どうでもいい存在なのか」', 2),
      w('ab1', 'それが本当だとしたら、何を意味する？（1回目）', '', 1), w('ab2', '（2回目）', '', 1), w('ab3', '（3回目）', '', 1), w('ab4', '（4回目）', '', 1), w('ab5', '（5回目・ここが候補）', '「私は…」「人は…」の形で', 1),
    ] },
  { id: 'arrow3', group: 'belief', kind: 'write', title: '下向き矢印③（お金・将来）', source: 'Beck／Burns「下向き矢印法」', minutes: 6,
    why: 'お金や将来の場面で。「それが本当だとしたら、何を意味する？」を5回。', items: [
      w('ac0', '最近、お金や将来で心がざわついた場面と、浮かんだ考え', '例: 通帳を見た→「このままだと…」', 2),
      w('ac1', 'それが本当だとしたら、何を意味する？（1回目）', '', 1), w('ac2', '（2回目）', '', 1), w('ac3', '（3回目）', '', 1), w('ac4', '（4回目）', '', 1), w('ac5', '（5回目・ここが候補）', '「私は…」「世の中は…」の形で', 1),
    ] },
  { id: 'ladder', group: 'belief', kind: 'write', title: 'ラダリング①（好きの何が大事？）', source: 'Hinkle 1965／Reynolds & Gutman「ラダリング」（自己記入式）', minutes: 5,
    why: '好きな物・行動から「それの何が大事？」を4回のぼると、上のほうにある価値が出る。', items: [
      w('la0', '好きな物・よくやること を1つ', '例: 釣り', 1),
      w('la1', 'それの、何が大事？（1回目）', '例: 一人で静かにいられる', 1),
      w('la2', 'それが大事なのは、何が大事だから？（2回目）', '', 1),
      w('la3', 'それが大事なのは、何が大事だから？（3回目）', '', 1),
      w('la4', 'それが大事なのは、何が大事だから？（4回目・ここが候補）', '1語〜1文で', 1),
    ] },
  { id: 'ladder2', group: 'belief', kind: 'write', title: 'ラダリング②（嫌いの何が嫌？）', source: 'Hinkle「ラダリング」（負の方向）', minutes: 5,
    why: '嫌いな物・避けていることから「それの何が嫌？」を4回。避けている理由の奥に、守っている価値がある。', items: [
      w('lb0', '嫌いな物・避けていること を1つ', '例: 飲み会', 1),
      w('lb1', 'それの、何が嫌？（1回目）', '', 1), w('lb2', 'それが嫌なのは、何が嫌だから？（2回目）', '', 1), w('lb3', '（3回目）', '', 1), w('lb4', '（4回目・ここが候補）: 守っているものは？', '1語〜1文で', 1),
    ] },
  { id: 'triad', group: 'belief', kind: 'write', title: '三つ組法（自分の物差し）', source: 'Kelly「レパートリーグリッド」の三つ組法', minutes: 6,
    why: '身近な3人を並べ「2人が似ていて1人が違う点」を言葉の対で書く。出てきた対が、自分が世界を切る物差し（構成概念）。', items: [
      w('tr0', '身近な人を3人（名前でなくてよい）', '例: 父／常連の客A／昔の友人', 3),
      w('tr1', '2人が似ていて1人が違う点（1組目）', '例: 落ち着いている ↔ せわしい', 1),
      w('tr2', '別の3人（または同じ3人）で、もう1組', '', 1),
      w('tr3', 'もう1組', '', 1),
      w('tr4', 'もう1組', '', 1),
      w('tr5', '出てきた対の中で、自分はどちら側にいることが多い？', '', 3),
    ] },
  { id: 'sentence', group: 'belief', kind: 'write', title: '文の続き（私は・人は・世界は）', source: 'Beck の認知の三徴／センテンス・コンプリーション', minutes: 5,
    why: '頭で考えず、手が動くままに続きを書く。思いつくだけ。', items: [
      w('sc1', '私は…', '思いつくだけ', 10), w('sc2', '人というのは…', '', 10), w('sc3', '世の中は…', '', 10),
      w('sc4', 'もし〜なら、〜だ（自分のルール）', '例: もし頼まれたら、断ってはいけない', 10), w('sc5', '本当は…', '', 5),
    ] },
  { id: 'phrases', group: 'belief', kind: 'write', title: '口ぐせと家の言葉', source: 'Beck「中間信念」＋ 家族療法の「家のルール」', minutes: 5,
    why: '信念は口ぐせに出る。自分の口ぐせ、親がよく言った言葉、家で暗黙だったルールを集める。', items: [
      w('ph1', '自分がよく言う言葉・口ぐせ', '例: 「まあいいか」「どうせ」', 8),
      w('ph2', '親や育った家でよく言われた言葉', '例: 「人様に迷惑をかけるな」', 8),
      w('ph3', '家で暗黙だったルール（言われなくても守っていたこと）', '', 5),
      w('ph4', '上の中で、今も自分を動かしている言葉', '', 3),
      w('ph5', '上の中で、もう手放したい言葉', '', 3),
    ] },
  { id: 'lines', group: 'belief', kind: 'write', title: '一線（絶対にしないこと）', source: 'Schwartz「価値の侵害」・道徳基盤理論（Haidt）', minutes: 5,
    why: '「絶対にしない」「許せない」「怒った」の裏に、いちばん強い信念がある。', items: [
      w('ln1', '自分が絶対にしないこと', '', 5), w('ln2', '人がやると許せないこと', '', 5), w('ln3', '最近、腹が立った場面と、何が踏まれたか', '', 3), w('ln4', '恥ずかしかった場面と、何を守れなかったか', '', 3), w('ln5', '上から見える「自分が大事にしている一線」を1文で', '', 2),
    ] },
  { id: 'decisions', group: 'belief', kind: 'write', title: '決断の記録', source: 'McAdams「ライフストーリー」の転機＋意思決定の前提の洗い出し', minutes: 8,
    why: '大きな決断には、その時の前提（信念）が隠れている。5つ並べて、共通する前提を探す。', items: [
      w('dc1', '人生の大きな決断を5つ（何を選び、何を捨てたか）', '1行1つ', 5),
      w('dc2', 'それぞれ、その時「これが当たり前」と思っていたこと', '', 5),
      w('dc3', '5つに共通している前提', '', 3),
      w('dc4', 'いま同じ決断をするなら、変わる前提は？', '', 3),
    ] },
  { id: 'opposite', group: 'belief', kind: 'write', title: '反対の自分', source: '認知行動療法「別の見方」・行動実験の設計', minutes: 5,
    why: '候補の信念が逆だったら、1日がどう変わるかを描く。信念の効き目が見える。', items: [
      w('op0', '候補の信念を1つ', '例: 頼まれたら断ってはいけない', 1),
      w('op1', 'その反対の文', '例: 断っても関係は続く', 1),
      w('op2', '反対が本当だとしたら、明日の1日はどう変わる？', '朝から順に', 5),
      w('op3', '反対が本当だとしたら、やめられること・始められること', '', 5),
      w('op4', '反対を2分だけ試すなら、何をする？', '', 1),
    ] },
  { id: 'diary', group: 'belief', kind: 'write', title: '信念日記（1週間）', source: '認知行動療法「思考記録表」（状況→考え→気分→行動）', minutes: 3,
    why: '1日1つ、信念が動いた瞬間を「状況／浮かんだ考え／気分／した行動」で。7日で癖が見える。1日1行でよい。', items: [
      w('dy1', '1日目', '状況／考え／気分／行動', 1), w('dy2', '2日目', '', 1), w('dy3', '3日目', '', 1), w('dy4', '4日目', '', 1), w('dy5', '5日目', '', 1), w('dy6', '6日目', '', 1), w('dy7', '7日目', '', 1),
      w('dy8', '7日を見返して、何度も出てきた考え', '', 3),
    ] },
  { id: 'affirm', group: 'belief', kind: 'write', title: '価値の作文', source: 'Cohen & Sherman「values affirmation」', minutes: 8,
    why: '「大事な言葉」から2〜3選び、それが大事だった場面を書く。効果が数か月続くという研究がある。', items: [
      w('af1', '大事な言葉から2〜3つ', '「大事な言葉」カードの3つでよい', 3),
      w('af2', 'その言葉が大事だった、具体的な場面', 'いつ・どこで・何が', 3),
      w('af3', 'その場面で、自分は何をしたか', '', 3),
      w('af4', 'この価値が、これからの1週間のどこに出てくるか', '', 3),
    ] },
  { id: 'evidence', group: 'belief', kind: 'write', title: '反証さがし', source: '認知行動療法「証拠の検討」', minutes: 5,
    why: '候補の信念1つに、支える事実・反する事実・別の見方を並べる。確信の度合いが少し動けば十分。', items: [
      w('vd0', '検討する信念（下向き矢印や文の続きから1つ）', '例: 私は軽く見られている', 1),
      w('vd1', 'それを支える事実', '', 5), w('vd2', 'それに反する事実', '', 5), w('vd3', '親友なら、どう言うか', '', 2),
      w('vd4', '確信の度合い（0〜100）: 前 → 後', '例: 80 → 60', 1),
    ] },
  { id: 'expressive', group: 'belief', kind: 'write', title: '4日間の書き出し', source: 'Pennebaker「表現的ライティング」（200本超の研究）', minutes: 20,
    why: '引っかかっている出来事1つについて、1日15〜20分×4日、事実と感情の両方を、直さずに書き続ける。人に見せない前提。つらくなったら止めてよい（相談窓口: よりそいホットライン 0120-279-338）。', items: [
      w('ex1', '1日目', '20分。止めずに書く', 1), w('ex2', '2日目', '同じ出来事を、別の角度から', 1), w('ex3', '3日目', '', 1), w('ex4', '4日目', 'この出来事が、いまの自分にどうつながるか', 1),
    ] },
  // ---- 内向型の資質（2026-09-21 本人「INFP タイプの資質を見つける方法を調べろ」。docs/research/2026-09-21-内向型INFPの資質を見つける.md。INFP かどうかは判定しない）----
  { id: 'introv', group: 'temper', kind: 'rate', scale: 5, top: 0, axis: { name: '内向（一人で充電）', pos: ['iv2', 'iv4', 'iv6', 'iv8', 'iv10'] }, title: '内向の2側面', source: 'Big Five Aspect Scales（DeYoung）外向の「熱意」「主張」の言い換え', minutes: 2,
    why: '外向は「人といて楽しい（熱意）」と「前に出る（主張）」の2つ。どちらが低い／高いかで、内向の形が分かる。', items: [
      r('iv1', '人と一緒にいると元気が出る'), r('iv2', '人と会ったあとは、一人の時間で充電したい'), r('iv3', '初対面でも話しかけるほうだ'), r('iv4', '話すより、聞いているほうが多い'), r('iv5', '会議や集まりで、自分から意見を言う'),
      r('iv6', '前に出るより、裏で支えるほうが性に合う'), r('iv7', 'にぎやかな場所が好きだ'), r('iv8', '静かな場所のほうが頭が働く'), r('iv9', '主導権を取るのは苦にならない'), r('iv10', '深い話ができる少人数のほうがいい'),
    ] },
  { id: 'openn', group: 'temper', kind: 'rate', scale: 5, top: 0, axis: { name: '開放性（想像・審美）', pos: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7', 'op8'] }, title: '開放性の2側面', source: 'Big Five Aspect Scales「審美・想像（Openness）」「知性（Intellect）」の言い換え', minutes: 2,
    why: '「美しいもの・想像」と「考えること・抽象」のどちらに開いているか。INFP の説明で「直観」と呼ばれる部分。', items: [
      r('op1', '空想にふけることが多い'), r('op2', '音楽や景色に、心を動かされる'), r('op3', '物語や比喩で考えるのが好きだ'), r('op4', '「意味」を見つけると、動ける'),
      r('op5', '難しい問題を考えるのが楽しい'), r('op6', '仕組みや理屈を知りたくなる'), r('op7', '新しい考え方に出会うとわくわくする'), r('op8', '言葉をひねるのが好きだ'),
      r('op9', '決まったやり方のほうが安心する'), r('op10', '抽象的な話は苦手だ'),
    ] },
  { id: 'sensit', group: 'temper', kind: 'rate', scale: 5, top: 0, axis: { name: '感受性（刺激に深く反応）', pos: ['se1', 'se2', 'se3', 'se4', 'se5', 'se6', 'se7', 'se8', 'se9', 'se10', 'se11', 'se12'], allPositive: true }, title: '感受性の3つ', source: 'Aron「感覚処理感受性（HSP）」3因子: 興奮しやすさ・審美的感受性・低い感覚閾値（言い換え）', minutes: 2,
    why: '刺激を深く処理する性質。3つに分かれる（疲れやすさ／美しさへの反応／音や光への敏感さ）。人口の15〜20%が高め。', items: [
      r('se1', '短時間にやることが多いと、混乱する'), r('se2', '人の気分に影響される'), r('se3', '見られていると、いつも通りにできない'), r('se4', '忙しい日のあとは、暗い部屋で休みたい'),
      r('se5', '細かな違いや変化によく気づく'), r('se6', '芸術や音楽に深く心を動かされる'), r('se7', '豊かで複雑な内面があると思う'), r('se8', '人がどうすれば心地よいか、すぐ分かる'),
      r('se9', '大きな音や強い光が苦手だ'), r('se10', 'カフェインや薬の効きが強い'), r('se11', 'ざらざらした布や強いにおいが気になる'), r('se12', '痛みに敏感なほうだ'),
    ] },
  { id: 'valued', group: 'temper', kind: 'rate', scale: 5, top: 0, axis: { name: '価値主導（自分の物差しで決める）', pos: ['vd1', 'vd2', 'vd3', 'vd4', 'vd5', 'vd6', 'vd7', 'vd8'] }, title: '価値主導と本物らしさ', source: 'Schwartz「自己志向」・authenticity 尺度・内向的感情（Fi）の記述（言い換え）', minutes: 2,
    why: '決めるとき「自分の内側の物差し」と「周りの基準」のどちらを使うか。INFP の説明で「内向的感情」と呼ばれる部分。', items: [
      r('vd1', '人がどう言おうと、自分が納得しないと動けない'), r('vd2', '自分の価値観に反する仕事は、給料が良くても続かない'), r('vd3', '本音と違うことを言うと、あとで疲れる'), r('vd4', '正しさより「自分にとって本当か」を優先する'),
      r('vd5', '嘘をつけない・演じるのが苦手だ'), r('vd6', '人の評価より、自分の基準で満足を決める'), r('vd7', '「何のために」が無いと、手が止まる'), r('vd8', '自分らしくいられる場所と、そうでない場所がはっきりある'),
      r('vd9', '周りに合わせるほうが楽だ'), r('vd10', '多数派の意見に乗るほうが安心する'),
    ] },
  { id: 'projects', group: 'temper', kind: 'write', title: '私的プロジェクトの評価', source: 'Brian Little「Personal Projects Analysis」（列挙→評価。核のプロジェクト＝自分らしさ×楽しさ）', minutes: 12,
    why: '今、時間と気持ちを使っている「プロジェクト」を10個出し、6つの目盛りで採点する。「自分らしさ」と「楽しさ」の高いものが核のプロジェクト＝資質が現れている場所。', items: [
      w('pp1', '今やっていること・気にかけていること（小さくてよい）', '1行1つ。10個まで', 10),
      w('pp2', 'それぞれの「重要さ」「楽しさ」「自分らしさ」「進み」「難しさ」「自分で決められる度合い」を 1〜5 で', '例: 釣り 3,5,5,4,2,5', 10),
      w('pp3', '「自分らしさ」と「楽しさ」が両方高いもの（＝核のプロジェクト）', '', 3),
      w('pp4', '重要だが楽しくないもの（やらされ）', '', 3),
      w('pp5', '核のプロジェクトのために、普段の自分と違う振る舞いをした場面', 'Little の「free trait」', 3),
    ] },
  { id: 'niche', group: 'temper', kind: 'write', title: '回復の場所', source: 'Cain『Quiet』restorative niche・Little の free trait の代償', minutes: 4,
    why: '内向型は、外向的に振る舞ったあと「回復の場所」が要る。どこで・何をすると戻るかを言葉にする。', items: [
      w('rn1', '疲れた時、確実に回復できる場所・時間', '例: 車の中で20分／風呂', 5),
      w('rn2', '1週間の中で、回復の場所が確保できている時間', '', 3),
      w('rn3', '回復を邪魔しているもの', '', 3),
      w('rn4', '外向的に振る舞わなければならない場面と、そのあとの自分', '', 3),
    ] },
  { id: 'solo', group: 'temper', kind: 'write', title: '一人でやる創造の記録', source: 'Cain「一人でやる創造」・Csikszentmihalyi のフロー・Pennebaker', minutes: 5,
    why: '一人で作った・書いた・考えたものを並べる。人に見せていないものほど、資質が出ている。', items: [
      w('sl1', '一人で作った・書いた・調べた・組んだもの（人に見せていないものも）', '10まで', 10),
      w('sl2', '上の中で、時間を忘れたもの', '', 3),
      w('sl3', '上の中で、人に見せたら反応があったもの', '', 3),
      w('sl4', '「もし時間が無限にあったら作りたいもの」', '', 3),
    ] },
  { id: 'ideal', group: 'temper', kind: 'write', title: '理想と現実の差', source: 'INFP の記述（理想主義・完璧主義・先延ばし）／Higgins「自己不一致理論」', minutes: 5,
    why: '「こうありたい自分」と「今の自分」の差は、資質の方向を教える。差そのものは悪くない。', items: [
      w('id1', 'こうありたい自分（3行で）', '', 3),
      w('id2', '今の自分と、いちばん差があるところ', '', 3),
      w('id3', 'その差のせいで、先延ばしにしていること', '', 3),
      w('id4', '差を「半分」埋めるなら、最初の2分は？', '', 1),
    ] },
  { id: 'tipi', group: 'whole', kind: 'rate', scale: 7, top: 0, title: '性格の傾向', source: 'Gosling ほか「TIPI」（ビッグファイブ10項目）', minutes: 2,
    why: 'タイプ分けではなく、5つの目盛り。「合う手札」を選ぶ参考にする。', items: [
      r('tp1', '外向的で、社交的'), r('tp2', '批判的で、口論しがち'), r('tp3', '信頼でき、自分を律している'), r('tp4', '不安になりやすく、動揺しやすい'), r('tp5', '新しい経験に開かれていて、複雑なことも好き'),
      r('tp6', '控えめで、静か'), r('tp7', '思いやりがあり、温かい'), r('tp8', 'だらしなく、不注意'), r('tp9', '落ち着いていて、感情が安定している'), r('tp10', '型どおりで、創造的ではない'),
    ] },
];

const WHO_CHIPS = ['家族', '客', '仲間', '自分', '未来の自分', '知らない誰か'];

const PROMPTS = METHODS.filter(x => x.kind === 'write').flatMap(c => c.items.map(q => ({ ...q, methodId: c.id })));
const ITEM_COUNT = METHODS.reduce((n, c) => n + (c.kind === 'pick' ? c.options.length : c.items.length), 0);
const CHOICE_METHODS = METHODS.filter(c => c.kind !== 'write');
const WRITE_METHODS = METHODS.filter(c => c.kind === 'write');
const method = id => METHODS.find(x => x.id === id);
function promptText(state, pid) { return PROMPTS.find(q => q.id === pid)?.text ?? aiCard(state)?.items.find(q => q.id === pid)?.text ?? pid; }
function methodTitle(state, id) { return id === 'ai' ? (aiCard(state)?.title ?? 'AI からの問い') : (method(id)?.title ?? id); }

// 選ぶカードの状態。state.picks[cardId] = { step, picks: [[]...], custom: [] }（旧 state.values は values カードとして読む）
function pickState(state, id) {
  const c = method(id);
  const raw = state?.picks?.[id] ?? (id === 'values' ? state?.values : null) ?? {};
  const picks = c.steps.map((_, i) => [...(raw.picks?.[i] ?? [])]);
  return { step: Math.min(raw.step ?? 0, c.steps.length - 1), picks, custom: [...(raw.custom ?? [])] };
}
function pickOptions(state, id) { const c = method(id); return [...c.options.map(o => o.w), ...pickState(state, id).custom]; }
function pickFinal(state, id) { const ps = pickState(state, id); return ps.picks[method(id).steps.length - 1] ?? []; }
function pickDir(id, w) { return method(id).options.find(o => o.w === w)?.dir ?? null; }

// 当てはまり度カードの実際の項目: 本人が言い換えた文（state.rewrite[cardId][itemId]）と足した項目（state.customItems[cardId]=[{id,text}]）を反映
function rateItems(card, state) {
  const rw = state?.rewrite?.[card.id] ?? {};
  const base = card.items.map(i => ({ ...i, text: rw[i.id]?.trim() || i.text, original: i.text }));
  const extra = (state?.customItems?.[card.id] ?? []).map(x => ({ id: x.id, text: x.text, dir: null, custom: true }));
  return [...base, ...extra];
}

// 材料: 自由記述は1行＝1項目。選ぶは最後の段の言葉。当てはまり度は上位（top 個・中央より上）を項目にする
// state: { answers:{promptId:string}, rates:{methodId:{itemId:number}}, values:{picks:[[],[],[]]}, skipped:[] }
function itemsFrom(state) {
  const out = [];
  const ai = aiCard(state);
  const prompts = ai ? [...PROMPTS, ...ai.items.map(q => ({ ...q, methodId: 'ai' }))] : PROMPTS;
  for (const q of prompts) {
    const raw = state?.answers?.[q.id];
    if (!raw) continue;
    String(raw).split(/\r?\n/).map(s => s.trim()).filter(Boolean).forEach((text, i) => out.push({ id: `${q.id}#${i}`, pid: q.id, methodId: q.methodId, text }));
  }
  for (const c of METHODS.filter(x => x.kind === 'pick')) {
    if (state?.skipped?.includes(c.id)) continue;
    for (const w of pickFinal(state, c.id)) out.push({ id: `${c.id}#${w}`, pid: c.id, methodId: c.id, text: w, dir: pickDir(c.id, w) });
  }
  for (const c of METHODS.filter(x => x.kind === 'rate' && x.top > 0)) {
    for (const it of rateTop(c, state?.rates?.[c.id], state)) out.push({ id: `${c.id}#${it.id}`, pid: c.id, methodId: c.id, text: it.text, dir: it.dir, score: it.score });
  }
  return out;
}

function rateTop(card, rates, state) {
  if (!rates) return [];
  const mid = (card.scale + 1) / 2;
  return rateItems(card, state).map(it => ({ ...it, score: rates[it.id] })).filter(it => it.score != null && it.score > mid)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, card.top);
}

function rateLow(card, rates, state) {
  if (!rates) return [];
  return rateItems(card, state).map(it => ({ ...it, score: rates[it.id] })).filter(it => it.score != null)
    .sort((a, b) => a.score - b.score || a.id.localeCompare(b.id)).slice(0, card.low ?? 0);
}

function methodStatus(card, state) {
  if (state?.skipped?.includes(card.id)) return { skipped: true, done: 0, total: 0 };
  if (card.kind === 'pick') return { skipped: false, done: pickFinal(state, card.id).length ? 1 : 0, total: 1 };
  if (card.kind === 'rate') { const rt = state?.rates?.[card.id] ?? {}; const items = rateItems(card, state); return { skipped: false, done: items.filter(i => rt[i.id] != null).length, total: items.length }; }
  return { skipped: false, done: card.items.filter(q => (state?.answers?.[q.id] ?? '').trim()).length, total: card.items.length };
}

function progress(state) {
  const per = {};
  let cardsDone = 0, cardsSkipped = 0;
  for (const c of METHODS) {
    const s = methodStatus(c, state); per[c.id] = s;
    if (s.skipped) cardsSkipped += 1; else if (s.done === s.total) cardsDone += 1;
  }
  const items = itemsFrom(state).length;
  return { per, items, cardsDone, cardsSkipped, cardsTotal: METHODS.length, canNarrow: items >= 12 || cardsDone >= 3 };
}

// 方向の推定: 大事な言葉の上位3 ＋ 生活の輪の低い領域 ＋ 意味の源の上位（タグの多数決。同数は DIRECTIONS 順）
function directionHint(state) {
  const score = Object.fromEntries(DIRECTIONS.map(d => [d.id, 0]));
  for (const w of pickFinal(state, 'values')) { const d = pickDir('values', w); if (d) score[d] += 2; }
  for (const w of pickFinal(state, 'growpick')) { const d = pickDir('growpick', w); if (d) score[d] += 2; }
  for (const it of rateLow(method('wheel'), state?.rates?.wheel, state)) if (it.dir) score[it.dir] += 2;
  for (const it of rateLow(method('perma'), state?.rates?.perma, state)) if (it.dir) score[it.dir] += 1;
  for (const it of rateTop(method('meaning'), state?.rates?.meaning, state)) if (it.dir) score[it.dir] += 1;
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

// 組み立て画面に出す候補の言葉（本人の材料だけ。順は 残した3つ → 星 → 各手法の上位）
function chipsFor(state, stars) {
  const items = itemsFrom(state);
  const starred = (stars ?? []).map(id => items.find(i => i.id === id)?.text).filter(Boolean);
  const byPid = (...pids) => items.filter(i => pids.includes(i.pid)).map(i => i.text);
  const uniq = arr => [...new Set(arr.filter(Boolean))];
  return {
    use: uniq([...starred, ...latestRound(state).candidates.flatMap(c => c.use ? [c.use] : []), ...byPid('pp3'), ...pickFinal(state, 'skillpick'), ...pickFinal(state, 'likepick'), ...byPid('via'), ...byPid('lk1', 'sk1', 'sk3', 'lk2', 'fk1')]).slice(0, 16),
    grow: uniq([...pickFinal(state, 'growpick'), ...pickFinal(state, 'values'), ...starred, ...latestRound(state).candidates.flatMap(c => c.grow ? [c.grow] : []), ...byPid('meaning'), ...byPid('schwartz'), ...byPid('eu4'), ...byPid('os2')]).slice(0, 16),
    who: uniq([...pickFinal(state, 'whopick2'), ...pickFinal(state, 'whopick'), ...byPid('ag2', 'ag3', 'tc2', 'pm1', 'pm3', 'pd2', 'pd3', 'rc1'), ...byPid('re5', 'co2'), ...latestRound(state).candidates.flatMap(c => c.who ? [c.who] : []), ...WHO_CHIPS]).slice(0, 10),
  };
}

// 軸つきカードの点: pos の項目はそのまま、他は逆転して平均（1〜scale）
function axisScore(card, rates) {
  if (!card?.axis || !rates) return null;
  const vals = card.items.map(i => (rates[i.id] == null ? null : card.axis.pos.includes(i.id) ? rates[i.id] : card.scale + 1 - rates[i.id])).filter(v => v != null);
  if (!vals.length) return null;
  return { name: card.axis.name, value: vals.reduce((a, b) => a + b, 0) / vals.length, n: vals.length, total: card.items.length, max: card.scale };
}

// 信念の輪郭: 軸つきカード全部＋自分と他人の4面＋上位型（べき・ねば／お金と仕事／値打ちの置き場）＋書く系の候補文
function beliefOutline(state) {
  const rt = state?.rates ?? {};
  const axes = METHODS.filter(c => c.group === 'belief' && c.kind === 'rate' && c.axis).map(c => axisScore(c, rt[c.id])).filter(Boolean);
  const so = rt.selfother ? [['自分＋', ['so1', 'so2', 'so3']], ['自分−', ['so4', 'so5', 'so6']], ['他人＋', ['so7', 'so8', 'so9']], ['他人−', ['so10', 'so11', 'so12']]].map(([name, ids]) => { const v = ids.map(i => rt.selfother[i]).filter(x => x != null); return v.length ? { name, value: v.reduce((a, b) => a + b, 0) / v.length, n: v.length, total: 3, max: 5 } : null; }).filter(Boolean) : [];
  const tops = ['musts', 'money', 'worth'].map(id => ({ id, title: method(id).title, items: rateTop(method(id), rt[id], state).map(i => i.text) })).filter(x => x.items.length);
  const items = itemsFrom(state);
  const by = pid => items.filter(i => i.pid === pid).map(i => i.text);
  const candidates = [...by('ar5'), ...by('ab5'), ...by('ac5'), ...by('la4'), ...by('lb4'), ...by('sc1').slice(0, 5), ...by('sc4').slice(0, 5), ...by('ln5'), ...by('dc3'), ...by('ph4'), ...by('dy8')];
  const cards = METHODS.filter(c => c.group === 'belief');
  const done = cards.filter(c => { const st = methodStatus(c, state); return !st.skipped && st.done === st.total; }).length;
  return { axes, selfOther: so, tops, candidates: [...new Set(candidates)], done, total: cards.length };
}

// 内向型の資質の輪郭: 4軸＋感受性の3つ＋核のプロジェクト（本人が書いた pp3）
function temperOutline(state) {
  const rt = state?.rates ?? {};
  const axes = METHODS.filter(c => c.group === 'temper' && c.kind === 'rate' && c.axis).map(c => axisScore(c, rt[c.id])).filter(Boolean);
  const se = rt.sensit;
  const sub = se ? [['興奮しやすさ', ['se1', 'se2', 'se3', 'se4']], ['審美的感受性', ['se5', 'se6', 'se7', 'se8']], ['感覚の敏感さ', ['se9', 'se10', 'se11', 'se12']]].map(([name, ids]) => { const v = ids.map(i => se[i]).filter(x => x != null); return v.length ? { name, value: v.reduce((a, b) => a + b, 0) / v.length, n: v.length, total: 4, max: 5 } : null; }).filter(Boolean) : [];
  const items = itemsFrom(state);
  const by = pid => items.filter(i => i.pid === pid).map(i => i.text);
  const core = by('pp3'); const niches = by('rn1'); const solo = [...by('sl2'), ...by('sl4')];
  const cards = METHODS.filter(c => c.group === 'temper');
  const done = cards.filter(c => { const st = methodStatus(c, state); return !st.skipped && st.done === st.total; }).length;
  return { axes, sensitivity: sub, core, niches, solo, done, total: cards.length };
}

// 当てはまり度カードの要約（表示用。タイプ名は付けない）
function rateSummary(card, rates, state) {
  if (!rates || Object.keys(rates).length === 0) return null;
  if (card.id === 'ikigai9') { const vals = card.items.map(i => rates[i.id]).filter(v => v != null); return `合計 ${vals.reduce((a, b) => a + b, 0)} / ${card.items.length * card.scale}（答えた ${vals.length} 問）`; }
  if (card.id === 'wheel' || card.id === 'perma') return `低め: ${rateLow(card, rates, state).map(i => `${i.text} ${i.score}`).join('・') || '—'}`;
  if (card.id === 'sensit') { const t = temperOutline({ rates: { sensit: rates } }); return [...t.axes.map(a => `全体 ${a.value.toFixed(1)}`), ...t.sensitivity.map(a => `${a.name} ${a.value.toFixed(1)}`)].join('／') + `（1〜${card.scale}）`; }
  if (card.axis) {
    const a = axisScore(card, rates); if (!a) return null;
    return `「${card.axis.name}」寄り ${a.value.toFixed(1)} / ${card.scale}（答えた ${a.n}）`;
  }
  if (card.id === 'selfother') {
    const g = { '自分＋': ['so1', 'so2', 'so3'], '自分−': ['so4', 'so5', 'so6'], '他人＋': ['so7', 'so8', 'so9'], '他人−': ['so10', 'so11', 'so12'] };
    return Object.entries(g).map(([k, ids]) => { const v = ids.map(i => rates[i]).filter(x => x != null); return v.length ? `${k} ${(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)}` : null; }).filter(Boolean).join('／') + `（1〜${card.scale}）`;
  }
  if (card.id === 'tipi') {
    const rev = v => (v == null ? null : card.scale + 1 - v);
    const pair = (a, b, label) => { const x = rates[a], y = rev(rates[b]); if (x == null || y == null) return null; return `${label} ${((x + y) / 2).toFixed(1)}`; };
    return [pair('tp1', 'tp6', '外向'), pair('tp7', 'tp2', '協調'), pair('tp3', 'tp8', '勤勉'), pair('tp9', 'tp4', '安定'), pair('tp5', 'tp10', '開放')].filter(Boolean).join('／') + `（1〜${card.scale}）`;
  }
  return `上位: ${rateTop(card, rates, state).map(i => i.text).join('・') || '—'}`;
}

// ---------- AI ループ（設計書 §18-4）----------
// 本人指示（2026-09-16）「様子見を作る段階でするのではなく、私に問いを投げて、出た答えを AI が読んで様子見する仕組みがいい」
// 経路: PWA が材料を1つのテキストにまとめる（dumpForAI）→ 本人が Claude Code に貼る（/tefuda 棚卸し）→ AI が JSON で返す
//       （観察・仮の目的の候補・次の問い・次にやるカード）→ PWA に貼り戻す（parseAIReply）→ 「AI からの問い」カードが増える
// AI は数字を数えない・タイプ名を付けない・本人の言葉を引用して候補を作る。決めるのは本人。

const AI_QUESTION_MAX = 5;
function latestRound(state) { const r = state?.ai?.rounds ?? []; return r[r.length - 1] ?? { observations: [], candidates: [], questions: [], nextCards: [], note: '' }; }

// AI の問いは「書く」型の動的カード。answers のキーは ai:<round>:<n>
function aiCard(state) {
  const rounds = state?.ai?.rounds ?? [];
  const items = rounds.flatMap((r, ri) => (r.questions ?? []).map((q, qi) => ({ id: `ai:${ri + 1}:${qi + 1}`, text: q.text, hint: q.hint ?? '', max: q.max ?? 3, round: ri + 1 })));
  if (!items.length) return null;
  return { id: 'ai', group: 'ai', kind: 'write', title: 'AI からの問い', source: 'あなたの材料を読んだ AI（Claude）', minutes: Math.max(2, items.length), why: '前回の材料を読んで、AI が「ここをもう少し聞きたい」と思ったところ。答えるほど次の候補が本人の言葉に近づく。', items };
}

const compact = s => String(s ?? '').replace(/\r?\n/g, ' / ').trim();

// AI 読み取り用の1テキスト。PWA が作り、本人がコピーして Claude Code に貼る
function dumpForAI(state, { today = '', purpose = null, task = 'questions' } = {}) {
  const L = [];
  L.push(`# 手札 棚卸し（AI 読み取り用 v1）${today ? ' ' + today : ''}`);
  L.push('ルール: 数字は数えない。タイプ名を付けない。候補の文は本人の言葉を引用して作る。返事は下の JSON 形式だけ。');
  if (purpose) L.push(`## いまの仮の目的: ${purpose.text}（決めた日 ${purpose.decidedOn}）`);
  const items = itemsFrom(state);
  const stars = (state?.stars ?? []).map(id => items.find(i => i.id === id)?.text).filter(Boolean);
  const fin = (state?.final ?? []).map(id => items.find(i => i.id === id)?.text).filter(Boolean);
  const v3 = pickFinal(state, 'values');
  if (v3.length) L.push(`## 大事な言葉（本人が 49語→3 に絞った）: ${v3.join('・')}`);
  if (stars.length) L.push(`## 星（本人が「今も本当」と選んだ ${stars.length}）: ${stars.join(' ／ ')}`);
  if (fin.length) L.push(`## 残した3つ: ${fin.join(' ／ ')}`);
  for (const c of METHODS) {
    if (state?.skipped?.includes(c.id)) continue;
    if (c.kind === 'write') {
      const rows = c.items.map(q => [q, compact(state?.answers?.[q.id])]).filter(([, a]) => a);
      if (!rows.length) continue;
      L.push(`## [${c.title}]`);
      for (const [q, a] of rows) L.push(`- ${q.text}: ${a}`);
    } else if (c.kind === 'pick') {
      if (c.id === 'values') continue;
      const f = pickFinal(state, c.id); if (!f.length) continue;
      L.push(`## [${c.title}] 選んだ: ${f.join('・')}`);
    } else if (c.kind === 'rate') {
      const rt = state?.rates?.[c.id]; if (!rt || !Object.keys(rt).length) continue;
      const byScore = {};
      for (const it of rateItems(c, state)) if (rt[it.id] != null) (byScore[rt[it.id]] ??= []).push(it.text + (it.custom ? '（本人が足した）' : it.original && it.original !== it.text ? `（言い換え: 元「${it.original}」）` : ''));
      L.push(`## [${c.title}]（1〜${c.scale}）` + Object.keys(byScore).sort((a, b) => b - a).map(k => ` ${k}: ${byScore[k].join('、')}`).join(' /'));
    }
  }
  const ai = aiCard(state);
  if (ai) {
    L.push('## [AI からの問い]（前回の問いと本人の答え）');
    for (const q of ai.items) L.push(`- (${q.round}回目) ${q.text}: ${compact(state?.answers?.[q.id]) || '（未回答）'}`);
  }
  if (state?.skipped?.length) L.push(`## 飛ばしたカード: ${state.skipped.map(id => method(id)?.title ?? id).join('・')}`);
  { const o = beliefOutline(state); if (o.axes.length || o.candidates.length) { L.push(`## 信念の輪郭（端末が数えた目盛り。カード ${o.done}/${o.total} 枚）`); for (const a of o.axes) L.push(`- ${a.name}: ${a.value.toFixed(1)}/${a.max}`); if (o.selfOther.length) L.push(`- 自分と他人: ${o.selfOther.map(a => `${a.name} ${a.value.toFixed(1)}`).join('、')}`); for (const t of o.tops) L.push(`- ${t.title}の上位: ${t.items.join('、')}`); if (o.candidates.length) L.push(`- 本人が書いた候補文: ${o.candidates.join(' ／ ')}`); } }
  { const t = temperOutline(state); if (t.axes.length || t.core.length) { L.push(`## 内向型の資質（端末が数えた目盛り。INFP かどうかは判定しない。カード ${t.done}/${t.total} 枚）`); for (const a of t.axes) L.push(`- ${a.name}: ${a.value.toFixed(1)}/${a.max}`); if (t.sensitivity.length) L.push(`- 感受性の内訳: ${t.sensitivity.map(a => `${a.name} ${a.value.toFixed(1)}`).join('、')}`); if (t.core.length) L.push(`- 核のプロジェクト（自分らしさ×楽しさ）: ${t.core.join('、')}`); if (t.niches.length) L.push(`- 回復の場所: ${t.niches.join('、')}`); if (t.solo.length) L.push(`- 一人でやる創造: ${t.solo.join('、')}`); } }
  const hist = state?.history ?? [];
  if (hist.length) {
    L.push(`## これまでの記録（${hist.length} 回。古い順）— 時系列の変化も見て、観察と問いに使う`);
    hist.forEach((sn, i) => { L.push(`- ${snapshotLine(sn)}`); const d = diffSnapshots(hist[i - 1], sn); if (d.length) L.push(`  変化: ${d.join('；')}`); });
  }
  L.push(...profileDumpSection(state));
  L.push('');
  if (task === 'profile') { L.push('# 依頼: プロファイル（多面）と「可能性」を作る'); L.push(...profileReplyFormat()); return L.join('\n'); }
  L.push('## 返事の形式（この JSON だけを ```json フェンスで。他の文は書かない）');
  L.push('{"observations":["本人の言葉を引用した観察を3行まで（評価・診断はしない）"],');
  L.push(' "candidates":[{"text":"［誰］のために、［使うもの］を使って、［増やすもの］を増やす人","who":"","use":"","grow":"","basis":["引用1","引用2"]}],  // 3つまで');
  L.push(` "questions":[{"text":"次に聞きたい問い","hint":"答え方の例"}],  // ${AI_QUESTION_MAX}つまで。「なぜ」は聞かない`);
  L.push(' "nextCards":["まだやっていないカードの id を2つまで"], "note":"本人への一言（1行）"}');
  L.push(`カード id: ${METHODS.map(c => `${c.id}=${c.title}`).join(', ')}`);
  return L.join('\n');
}

// AI の返事（テキスト）→ round。形が崩れていれば {ok:false, error}
function parseAIReply(text) {
  const m = String(text ?? '').match(/```json\s*([\s\S]*?)```/) ?? [null, String(text ?? '')];
  let obj;
  try { obj = JSON.parse(m[1].trim()); } catch { return { ok: false, error: 'JSON として読めない' }; }
  const str = x => (typeof x === 'string' ? x.trim() : '');
  const round = {
    observations: (Array.isArray(obj.observations) ? obj.observations : []).map(str).filter(Boolean).slice(0, 3),
    candidates: (Array.isArray(obj.candidates) ? obj.candidates : []).map(c => ({ text: str(c?.text), who: str(c?.who), use: str(c?.use), grow: str(c?.grow), basis: (Array.isArray(c?.basis) ? c.basis : []).map(str).filter(Boolean).slice(0, 3) })).filter(c => c.text).slice(0, 3),
    questions: (Array.isArray(obj.questions) ? obj.questions : []).map(q => ({ text: str(q?.text), hint: str(q?.hint), max: 3 })).filter(q => q.text && !q.text.includes('なぜ')).slice(0, AI_QUESTION_MAX),
    nextCards: (Array.isArray(obj.nextCards) ? obj.nextCards : []).map(str).filter(id => method(id)).slice(0, 2),
    note: str(obj.note).slice(0, 120),
  };
  if (!round.observations.length && !round.candidates.length && !round.questions.length) return { ok: false, error: '観察・候補・問いのどれも無い' };
  const banned = ['診断', '病', '怠け', 'ダメ', '型です', 'タイプです'];
  // ［誰］に空っぽの言葉を入れさせない（2026-09-23 本人指示。抽象語は輪郭を消す）
  const EMPTY_WHO = ['人', '人々', '世の中', 'みんな', '社会', '誰か', '他人', '周り', '世界', '国', '皆'];
  const emptyWho = round.candidates.find(c => EMPTY_WHO.includes(c.who.replace(/[のための\s]+$/u, '').trim()));
  if (emptyWho) return { ok: false, error: `［誰］が空っぽの言葉「${emptyWho.who}」。本人が実際に書いた場面・人にする` };
  const all = JSON.stringify(round);
  const hit = banned.find(b => all.includes(b));
  if (hit) return { ok: false, error: `禁止語「${hit}」が入っている` };
  return { ok: true, round };
}

// ---------- 記録（年表）（設計書 §18-5）----------
// 本人指示（2026-09-16）「診断を何回かやって時系列ごとに変化や価値観を記録していく。その時の仕事や人間関係の状態、何を大事にしていて何をしていたか何を考えていたかも」
// 記録＝その時点の材料を丸ごと凍結（答え・当てはまり度・大事な言葉・星・残した3つ・仮の目的・状況）。あとで答えを直しても記録は変わらない。

const num = v => (v == null ? null : Number(v));
function rateNumbers(state) {
  const rt = state?.rates ?? {};
  const total = id => { const c = method(id); const vals = c.items.map(i => rt[id]?.[i.id]).filter(v => v != null); return vals.length ? { total: vals.reduce((a, b) => a + b, 0), n: vals.length, max: c.items.length * c.scale } : null; };
  const per = id => { const c = method(id); const o = {}; for (const i of rateItems(c, state)) if (rt[id]?.[i.id] != null) o[i.text] = num(rt[id][i.id]); return Object.keys(o).length ? o : null; };
  const tipi = () => { const t = rt.tipi; if (!t) return null; const rev = v => (v == null ? null : 8 - v); const pair = (a, b) => (t[a] == null || t[b] == null ? null : Math.round(((t[a] + rev(t[b])) / 2) * 10) / 10); const o = { 外向: pair('tp1', 'tp6'), 協調: pair('tp7', 'tp2'), 勤勉: pair('tp3', 'tp8'), 安定: pair('tp9', 'tp4'), 開放: pair('tp5', 'tp10') }; return Object.values(o).some(v => v != null) ? o : null; };
  return { ikigai9: total('ikigai9'), wheel: per('wheel'), perma: per('perma'), tipi: tipi(), via: rateTop(method('via'), rt.via, state).map(i => i.text), meaning: rateTop(method('meaning'), rt.meaning, state).map(i => i.text), schwartz: rateTop(method('schwartz'), rt.schwartz, state).map(i => i.text) };
}

function snapshot(state, { today, label = '', purpose = null } = {}) {
  const items = itemsFrom(state);
  const text = id => items.find(i => i.id === id)?.text;
  const ctx = {}; for (const q of method('context').items) { const a = state?.answers?.[q.id]; if (a?.trim()) ctx[q.text] = a.trim(); }
  return {
    id: `snap_${today}_${Math.random().toString(36).slice(2, 6)}`, on: today, label,
    purpose: purpose ? { text: purpose.text, gain: purpose.gain ?? null, directionId: purpose.directionId ?? null } : null,
    values: [...pickFinal(state, 'values')], picks: Object.fromEntries(METHODS.filter(c => c.kind === 'pick' && c.id !== 'values').map(c => [c.title, pickFinal(state, c.id)]).filter(([, v]) => v.length)), stars: (state?.stars ?? []).map(text).filter(Boolean), final: (state?.final ?? []).map(text).filter(Boolean),
    context: ctx, numbers: rateNumbers(state),
    answers: { ...(state?.answers ?? {}) }, rates: JSON.parse(JSON.stringify(state?.rates ?? {})), pickState: JSON.parse(JSON.stringify(state?.picks ?? {})), rewrite: JSON.parse(JSON.stringify(state?.rewrite ?? {})), customItems: JSON.parse(JSON.stringify(state?.customItems ?? {})), skipped: [...(state?.skipped ?? [])],
    aiRounds: (state?.ai?.rounds ?? []).length, itemsCount: items.length, cardsDone: progress(state).cardsDone,
  };
}

// 前回との変化（増えた・減った・上下）。表示用の短い行にする
function diffSnapshots(prev, cur) {
  if (!prev) return [];
  const L = [];
  const added = cur.values.filter(w => !prev.values.includes(w)); const removed = prev.values.filter(w => !cur.values.includes(w));
  if (added.length || removed.length) L.push(`大事な言葉: ${added.length ? '＋' + added.join('・') : ''}${added.length && removed.length ? ' ／ ' : ''}${removed.length ? '－' + removed.join('・') : ''}`);
  if ((prev.purpose?.text ?? '') !== (cur.purpose?.text ?? '') && cur.purpose?.text) L.push(`仮の目的: 「${prev.purpose?.text ?? '（なし）'}」→「${cur.purpose.text}」`);
  const a = prev.numbers?.ikigai9, b = cur.numbers?.ikigai9;
  if (a && b) L.push(`生きがい9: ${a.total} → ${b.total}（${b.total - a.total >= 0 ? '＋' : ''}${b.total - a.total}）`);
  for (const key of ['wheel', 'perma', 'tipi']) {
    const pa = prev.numbers?.[key], pb = cur.numbers?.[key]; if (!pa || !pb) continue;
    const d = Object.keys(pb).filter(k => pa[k] != null && pb[k] != null && pa[k] !== pb[k]).map(k => `${k} ${pa[k]}→${pb[k]}`);
    if (d.length) L.push(`${{ wheel: '生活の輪', perma: '5つの柱', tipi: '性格の傾向' }[key]}: ${d.join('、')}`);
  }
  for (const key of ['via', 'meaning', 'schwartz']) {
    const pa = prev.numbers?.[key] ?? [], pb = cur.numbers?.[key] ?? []; if (!pa.length || !pb.length) continue;
    const ad = pb.filter(x => !pa.includes(x)), rm = pa.filter(x => !pb.includes(x));
    if (ad.length || rm.length) L.push(`${{ via: '強み上位', meaning: '意味の源上位', schwartz: '19の価値上位' }[key]}: ${ad.length ? '＋' + ad.join('・') : ''}${ad.length && rm.length ? ' ／ ' : ''}${rm.length ? '－' + rm.join('・') : ''}`);
  }
  for (const k of Object.keys(cur.picks ?? {})) { const pa = prev.picks?.[k] ?? [], pb = cur.picks[k]; const ad = pb.filter(x => !pa.includes(x)), rm = pa.filter(x => !pb.includes(x)); if (pa.length && (ad.length || rm.length)) L.push(`${k}: ${ad.length ? '＋' + ad.join('・') : ''}${ad.length && rm.length ? ' ／ ' : ''}${rm.length ? '－' + rm.join('・') : ''}`); }
  const ca = prev.context ?? {}, cb = cur.context ?? {};
  const changed = Object.keys(cb).filter(k => ca[k] && ca[k] !== cb[k]);
  if (changed.length) L.push(`状況が変わった: ${changed.join('・')}`);
  return L;
}

// 記録の1行要約（年表・AI ダンプ用）
function snapshotLine(sn) {
  const parts = [`${sn.on}${sn.label ? '「' + sn.label + '」' : ''}`];
  if (sn.purpose?.text) parts.push(`目的: ${sn.purpose.text}`);
  if (sn.values.length) parts.push(`大事: ${sn.values.join('・')}`);
  if (sn.numbers?.ikigai9) parts.push(`生きがい9 ${sn.numbers.ikigai9.total}/${sn.numbers.ikigai9.max}`);
  if (sn.numbers?.wheel) parts.push(`輪 ${Object.entries(sn.numbers.wheel).map(([k, v]) => `${k}${v}`).join(' ')}`);
  const cx = Object.entries(sn.context ?? {}).slice(0, 4).map(([k, v]) => `${k}=${v.replace(/\r?\n/g, ' / ').slice(0, 40)}`);
  if (cx.length) parts.push(`状況: ${cx.join('；')}`);
  return parts.join(' ／ ');
}

// ---------- プロファイル（多面）と「可能性」（設計書 §18-6）----------
// 本人指示（2026-09-16）「入力された情報からプロファイリングをかけるボタン。多面的なプロファイルを作っていく機能と、そこから読み取れる『こういう可能性もあるかも』を提案する仕組み」
// 面は固定 10。AI は本人の言葉を引用して各面を1〜2文で書く。可能性は 3〜6、根拠の引用＋2分で試せる実験つき。診断名・タイプ名・断定はしない。
const FACETS = [
  { id: 'energy', name: '元気の源', hint: 'やると元気が出ること・夢中になれること' },
  { id: 'drain', name: '消耗の源', hint: '疲れること・避けたい方向' },
  { id: 'strength', name: '強み（本人の評価）', hint: '得意・強みの上位・人から頼まれること' },
  { id: 'values', name: '大事にしているもの', hint: '大事な言葉・意味の源・19の価値の上位' },
  { id: 'who', name: '誰のために', hint: '役に立ちたい相手・疲れにくい相手' },
  { id: 'core', name: '昔から変わらない芯', hint: '12歳の自分・人生の物語・変わらないところ' },
  { id: 'avoid', name: '避けたい未来', hint: 'なりたくない生き方・80歳の後悔' },
  { id: 'now', name: 'いまの状況の読み', hint: '仕事・人間関係・体・お金・考えていること' },
  { id: 'traits', name: '性格の傾向（数字のまま）', hint: 'TIPI の5つの目盛り・生活の輪・生きがい9' },
  { id: 'beliefs', name: '信念（当たり前だと思っていること）', hint: '下向き矢印・文の続き・べき・ねば・変われるか・自分で決まるか・自分と他人の見方。「私は／人は／世界は」の候補文を本人の言葉で。反証さがしを活かし方に' },
  { id: 'mitate', name: '見立て（占い調・外れてよい）', hint: '1行の言い切り。§16 の「見立て」と同じ扱い' },
];
const POSSIBILITY_MIN = 3, POSSIBILITY_MAX = 6;
const VOTE = ['○', '×', '？'];
const LEVELS = ['2分', '1週間', '3か月']; // 試す大きさ（O*NET の Job Zone に相当。本人が絞る）
const FACET_MIN_ITEMS = 2; // 材料がこれ未満の面は「まだ材料がない」（Crystal の confidence check に相当）

// 方向のスコアの内訳（形の照合＝O*NET の職業照合に相当。端末が出す）
function directionScores(state) {
  const score = Object.fromEntries(DIRECTIONS.map(d => [d.id, 0]));
  for (const w of pickFinal(state, 'values')) { const d = pickDir('values', w); if (d) score[d] += 2; }
  for (const w of pickFinal(state, 'growpick')) { const d = pickDir('growpick', w); if (d) score[d] += 2; }
  for (const it of rateLow(method('wheel'), state?.rates?.wheel, state)) if (it.dir) score[it.dir] += 2;
  for (const it of rateLow(method('perma'), state?.rates?.perma, state)) if (it.dir) score[it.dir] += 1;
  for (const it of rateTop(method('meaning'), state?.rates?.meaning, state)) if (it.dir) score[it.dir] += 1;
  for (const it of rateTop(method('schwartz'), state?.rates?.schwartz, state)) if (it.dir) score[it.dir] += 1;
  for (const it of rateTop(method('via'), state?.rates?.via, state)) if (it.dir) score[it.dir] += 1;
  return score;
}

// 端末が出す可能性（形の照合）: 上位2方向 × その2分の行動。探索の候補であって正解ではない
function localPossibilities(state) {
  const sc = directionScores(state);
  const total = Object.values(sc).reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return DIRECTIONS.map(d => ({ d, s: sc[d.id] })).filter(x => x.s > 0).sort((a, b) => b.s - a.s || DIRECTIONS.indexOf(a.d) - DIRECTIONS.indexOf(b.d)).slice(0, 2)
    .map(({ d, s }) => ({ id: `dir:${d.id}`, directionId: d.id, text: `「${d.trouble}」の方向に材料が寄っている（${s}/${total}）。『${d.gains[0]}』か『${d.gains[1]}』が増える実験が合うかも`, try: d.actions[0].name, level: '2分', confidence: s / total >= 0.4 ? '当たりそう' : '推測', basis: ['大事な言葉・増やしたいもの・生活の輪・意味の源・強みの方向タグの集計'] }));
}

// 端末が数字だけで作る「面」（AI 無しでも即時に出る部分）
function localProfile(state) {
  const n = rateNumbers(state);
  const items = itemsFrom(state);
  const by = pid => items.filter(i => i.pid === pid).map(i => i.text);
  const out = [];
  const val = pickFinal(state, 'values'); if (val.length) out.push({ id: 'values', name: '大事にしているもの', text: `大事な言葉: ${val.join('・')}${n.meaning?.length ? `／意味の源の上位: ${n.meaning.join('・')}` : ''}` });
  const st = [...pickFinal(state, 'skillpick'), ...(n.via ?? []), ...by('pp3')]; if (st.length) out.push({ id: 'strength', name: '強み（本人の評価）', text: [...new Set(st)].slice(0, 8).join('・') });
  const en = [...pickFinal(state, 'likepick'), ...by('gtj3'), ...by('fl1'), ...by('sl2')]; if (en.length) out.push({ id: 'energy', name: '元気の源', text: [...new Set(en)].slice(0, 8).join('・') });
  const dr = [...by('gtj4'), ...by('en4')]; if (dr.length) out.push({ id: 'drain', name: '消耗の源', text: [...new Set(dr)].slice(0, 6).join('・') });
  const who = [...pickFinal(state, 'whopick'), ...by('re5')]; if (who.length) out.push({ id: 'who', name: '誰のために', text: [...new Set(who)].slice(0, 5).join('・') });
  const tr = []; if (n.tipi) tr.push('性格の傾向 ' + Object.entries(n.tipi).filter(([, v]) => v != null).map(([k, v]) => `${k}${v}`).join(' ')); if (n.wheel) tr.push('生活の輪 ' + Object.entries(n.wheel).map(([k, v]) => `${k}${v}`).join(' ')); if (n.ikigai9) tr.push(`生きがい9 ${n.ikigai9.total}/${n.ikigai9.max}`); if (tr.length) out.push({ id: 'traits', name: '性格の傾向（数字のまま）', text: tr.join('／') });
  const av = [...pickFinal(state, 'regretpick'), ...by('an1')]; if (av.length) out.push({ id: 'avoid', name: '避けたい未来', text: [...new Set(av)].slice(0, 5).join('・') });
  { const o = beliefOutline(state); const bl = [...o.axes.map(a => `${a.name} ${a.value.toFixed(1)}/${a.max}`), ...(o.selfOther.length ? [o.selfOther.map(a => `${a.name} ${a.value.toFixed(1)}`).join(' ')] : []), ...o.tops.map(t => `${t.title}上位: ${t.items.join('・')}`), ...(o.candidates.length ? ['候補文: ' + o.candidates.slice(0, 6).join('／')] : [])]; if (bl.length) out.push({ id: 'beliefs', name: '信念（当たり前だと思っていること）', text: bl.join('／'), outline: o }); }
  const dirId = directionHint(state); if (dirId) { const d = DIRECTIONS.find(x => x.id === dirId); out.push({ id: 'direction', name: '実験の方向（数字から）', text: `${d.trouble} → 『${d.gains[0]}』／『${d.gains[1]}』` }); }
  return out;
}

// AI の返事（プロファイル）を読む。形と禁止語を検査
function parseProfile(text) {
  const m = String(text ?? '').match(/```json\s*([\s\S]*?)```/) ?? [null, String(text ?? '')];
  let obj; try { obj = JSON.parse(m[1].trim()); } catch { return { ok: false, error: 'JSON として読めない' }; }
  const str = x => (typeof x === 'string' ? x.trim() : '');
  const arr = x => (Array.isArray(x) ? x : []);
  const facets = arr(obj.facets).map(f => ({ id: str(f?.id), name: FACETS.find(x => x.id === str(f?.id))?.name ?? str(f?.name), text: str(f?.text), thrive: str(f?.thrive), blind: str(f?.blind), basis: arr(f?.basis).map(str).filter(Boolean).slice(0, 3) })).filter(f => f.text && FACETS.some(x => x.id === f.id));
  const possibilities = arr(obj.possibilities).map((p, i) => ({ id: str(p?.id) || `p${i + 1}`, text: str(p?.text), basis: arr(p?.basis).map(str).filter(Boolean).slice(0, 3), try: str(p?.try), level: LEVELS.includes(str(p?.level)) ? str(p?.level) : '2分', confidence: ['推測', '当たりそう'].includes(str(p?.confidence)) ? str(p?.confidence) : '推測' })).filter(p => p.text).slice(0, POSSIBILITY_MAX);
  const profile = { facets, possibilities, summary: str(obj.summary).slice(0, 200), caution: str(obj.caution).slice(0, 200) };
  if (!facets.length && !possibilities.length) return { ok: false, error: '面も可能性も無い' };
  const banned = ['診断', '病', '怠け', 'ダメ', '型です', 'タイプです', '障害', 'に違いない', '間違いなく'];
  const all = JSON.stringify(profile);
  const hit = banned.find(b => all.includes(b));
  if (hit) return { ok: false, error: `禁止語「${hit}」が入っている` };
  return { ok: true, profile };
}

// ダンプに足す: 前回のプロファイルと、可能性への本人の ○×？
function profileDumpSection(state) {
  const L = [];
  const profs = state?.profiles ?? [];
  const last = profs[profs.length - 1];
  if (!last) return L;
  L.push(`## 前回のプロファイル（${last.on}・${profs.length}回目）— 今回は「変わった面」「変わらない面」も書く`);
  for (const f of last.profile.facets) L.push(`- ${f.name}: ${f.text}`);
  const votes = state?.votes ?? {};
  if (last.profile.possibilities.length) {
    L.push('## 前回の「可能性」と本人の反応（○=そうかも ×=違う ？=分からない 無印=未回答）');
    for (const p of last.profile.possibilities) L.push(`- [${votes[`${last.id}:${p.id}`] ?? '無印'}] ${p.text}`);
  }
  return L;
}

function profileReplyFormat() {
  return [
    '## 返事の形式（この JSON だけを ```json フェンスで。他の文は書かない）',
    `{"facets":[{"id":"${FACETS.map(f => f.id).join('|')}","text":"あなたの場合: 本人の言葉を引用して1〜2文。「〜かもしれない」「〜の可能性が高い」と断定を避ける（Gallup の Strengths Insights と同じ書き方）。材料が2個未満の面は text を「まだ材料がない」にして thrive/blind は空","thrive":"活かし方: 2分で試せること1つ","blind":"裏目に出るかも: 1つ（無ければ空）","basis":["引用1","引用2"]}],  // 10面すべて`,
    ` "possibilities":[{"id":"p1","text":"〜という可能性もあるかも（断定しない。探索の候補であって正解ではない）","basis":["引用1","引用2"],"try":"その大きさで試せること1つ","level":"${LEVELS.join('|')}","confidence":"推測|当たりそう"}],  // 3〜6。level は 2分 を最低2つ入れる`,
    ' "summary":"全体を1〜2文で（本人の言葉で）","caution":"この読みの限界を1文（材料の偏り・足りない面）"}',
    `面の id と意味: ${FACETS.map(f => `${f.id}=${f.name}（${f.hint}）`).join(' / ')}`,
    'やらないこと: 診断名・タイプ名・病名・断定（「に違いない」「間違いなく」）・励まし。前回の可能性に × が付いたものは繰り返さない。○ が付いたものは深める。前回のプロファイルがあれば「変わった面」「変わらない面」を summary に書く。',
  ];
}

// ---------- 同期の安全（v17.9）----------
// 本人の iPad の材料が、開いただけの iPhone の「空」に上書きされた事故（2026-09-17）への対策。
// 「中身」= 本体 db がある、または 棚卸しの材料（答え・当てはまり度・選んだ言葉・記録・プロファイル）が1つでもある
function monshinHasContent(m) {
  if (!m) return false;
  if (Object.values(m.answers ?? {}).some(v => String(v ?? '').trim())) return true;
  if (Object.values(m.rates ?? {}).some(r => r && Object.keys(r).length)) return true;
  if (Object.values(m.picks ?? {}).some(p => (p?.picks ?? []).some(a => a.length))) return true;
  if ((m.history ?? []).length || (m.profiles ?? []).length || (m.ai?.rounds ?? []).length || (m.stars ?? []).length) return true;
  return false;
}
function stateHasContent(remote) { return !!(remote?.db?.state && remote?.db?.cards) || monshinHasContent(remote?.monshin); }
// 中身の量（多い方を守る）: 本体があれば +10、答えの行・当てはまり度の項目・選んだ言葉・記録・プロファイル・星を数える。AI の返事は本人の材料ではないので数えない
function contentRichness(remote) {
  const m = remote?.monshin ?? {};
  let n = 0;
  if (remote?.db?.state && remote?.db?.cards) n += 10 + (remote.db.log?.entries?.length ?? 0);
  for (const v of Object.values(m.answers ?? {})) n += String(v ?? '').split(/\r?\n/).filter(x => x.trim()).length;
  for (const r of Object.values(m.rates ?? {})) n += Object.keys(r ?? {}).length;
  for (const p of Object.values(m.picks ?? {})) n += (p?.picks ?? []).reduce((a, b) => a + b.length, 0);
  n += (m.history?.length ?? 0) * 5 + (m.profiles?.length ?? 0) * 5 + (m.stars?.length ?? 0);
  return n;
}
// 内容の署名: 画面の位置（phase/cur/ui）は含めない。これが変わった時だけ「更新」とみなす
function contentSignature(db, m) {
  const { phase, cur, ui, ...rest } = m ?? {};
  const s = JSON.stringify([db ?? null, rest]);
  let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `${s.length}:${h}`;
}

// ---------- 復元: AI 読み取り用の文章（dumpForAI）から棚卸しの状態を組み立て直す（2026-09-17 の事故対応） ----------
// 文章は「1行1項目」を " / " でつないでいるので戻せる。星・残した3つ・記録の中身・本体 db は文章に無いので戻らない。
function stateFromDump(text) {
  const st = { answers: {}, rates: {}, picks: {}, rewrite: {}, customItems: {}, skipped: [], history: [], recovered: true };
  const byTitle = t => METHODS.find(c => c.title === t);
  let cur = null;
  const putPick = (id, words) => { const c = method(id); st.picks[id] = { step: 0, picks: c.steps.map(() => [...words]), custom: words.filter(w => !c.options.some(o => o.w === w)) }; };
  const lines = String(text ?? '').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^## 返事の形式|^# 依頼/.test(line)) break;
    let m;
    if ((m = line.match(/^## 大事な言葉[^:]*: (.+)$/))) { putPick('values', m[1].split('・').map(x => x.trim()).filter(Boolean)); cur = null; continue; }
    if ((m = line.match(/^## 飛ばしたカード: (.+)$/))) { st.skipped = m[1].split('・').map(t => METHODS.find(c => c.title === t.trim())?.id).filter(Boolean); cur = null; continue; }
    if ((m = line.match(/^## \[(.+?)\] 選んだ: (.+)$/))) { const c = byTitle(m[1]); if (c?.kind === 'pick') putPick(c.id, m[2].split('・').map(x => x.trim()).filter(Boolean)); cur = null; continue; }
    if ((m = line.match(/^## \[(.+?)\]（1〜(\d+)）(.*)$/))) {
      const c = byTitle(m[1]); cur = null; if (c?.kind !== 'rate') continue;
      const known = [...c.items].sort((a, b) => b.text.length - a.text.length);
      st.rates[c.id] = {};
      for (const grp of m[3].split(' /')) {
        const g = grp.trim().match(/^(\d+): (.+)$/); if (!g) continue;
        const score = Number(g[1]); let rest = g[2];
        while (rest.length) {
          rest = rest.replace(/^[、\s]+/, ''); if (!rest) break;
          let hit = null;
          const rw = rest.match(/^(.+?)（言い換え: 元「(.+?)」）/); const cu = rest.match(/^(.+?)（本人が足した）/);
          if (rw && !known.some(k => rest.startsWith(k.text + '、') || rest === k.text)) { const orig = known.find(k => k.text === rw[2]); if (orig) { st.rewrite[c.id] ??= {}; st.rewrite[c.id][orig.id] = rw[1]; st.rates[c.id][orig.id] = score; } rest = rest.slice(rw[0].length); continue; }
          if (cu && !known.some(k => rest.startsWith(k.text))) { st.customItems[c.id] ??= []; const id = 'c' + Math.random().toString(36).slice(2, 8); st.customItems[c.id].push({ id, text: cu[1] }); st.rates[c.id][id] = score; rest = rest.slice(cu[0].length); continue; }
          for (const k of known) if (rest.startsWith(k.text)) { hit = k; break; }
          if (!hit) { const cut = rest.indexOf('、'); rest = cut >= 0 ? rest.slice(cut + 1) : ''; continue; }
          st.rates[c.id][hit.id] = score; rest = rest.slice(hit.text.length);
        }
      }
      continue;
    }
    if ((m = line.match(/^## \[(.+?)\]$/))) { const c = byTitle(m[1]); cur = c?.kind === 'write' ? c : null; continue; }
    if ((m = line.match(/^## これまでの記録/))) { cur = 'history'; continue; }
    if (cur === 'history' && (m = line.match(/^- (\d{4}-\d{2}-\d{2})(?:「(.*?)」)?/))) { st.history.push({ on: m[1], label: m[2] ?? '' }); continue; }
    if (cur && cur !== 'history' && (m = line.match(/^- (.+?): (.*)$/))) { const q = cur.items.find(x => x.text === m[1]); if (q) st.answers[q.id] = m[2].split(' / ').map(x => x.trim()).filter(Boolean).join('\n'); continue; }
    if (/^## /.test(line)) cur = null;
  }
  // 記録は見出しだけ残っていたものを、復元した材料で作り直す（中身はその時点のものではない旨を label に）
  st.history = st.history.map(h => ({ ...snapshot(st, { today: h.on, label: `${h.label}（復元: 材料は最新のもの）` }) }));
  return st;
}

// ---- pwa/src/sync.mjs
// 端末間の同期（設計書 §14-3 順番③・v17.7）
//   既定 = Mac mini（合言葉なし）: Tailscale の網の中だけで届く https://mac-mini.<tailnet>.ts.net の同期サーバー（bridge/macmini/tefuda-server.mjs）
//   予備 = GitHub の非公開リポ（fine-grained PAT が要る。端末の localStorage だけに置く）
//   置き場: tefuda.json（{tefuda:1, updatedAt, device, db, monshin}）は新しい updatedAt が勝つ（1人で順番に使う前提）
//           dump.txt（棚卸しの AI 読み取り用）、ai-reply.json（Mac mini の Claude の返事 → 「AI からの問い」）
const SYNC_KEY = 'tefuda.sync';
const API = 'https://api.github.com/repos';
const MACMINI_DEFAULT = 'https://mac-mini.tail15ea48.ts.net';
const richness = st => { const m = st?.monshin ?? {}; let n = 0; if (st?.db?.state && st?.db?.cards) n += 10 + (st.db.log?.entries?.length ?? 0); for (const v of Object.values(m.answers ?? {})) n += String(v ?? '').split(/\r?\n/).filter(x => x.trim()).length; for (const r of Object.values(m.rates ?? {})) n += Object.keys(r ?? {}).length; for (const p of Object.values(m.picks ?? {})) n += (p?.picks ?? []).reduce((a, b) => a + b.length, 0); n += (m.history?.length ?? 0) * 5 + (m.profiles?.length ?? 0) * 5 + (m.stars?.length ?? 0); return n; };
const hasMonshinContent = m => !!m && (Object.values(m.answers ?? {}).some(v => String(v ?? '').trim()) || Object.values(m.rates ?? {}).some(r => r && Object.keys(r).length) || Object.values(m.picks ?? {}).some(p => (p?.picks ?? []).some(a => a.length)) || (m.history ?? []).length > 0 || (m.profiles ?? []).length > 0 || (m.ai?.rounds ?? []).length > 0);

const Sync = {
  cfg: null, timer: null, busy: false, last: { at: null, msg: '', ok: true },
  hooks: { getLocal: () => null, setLocal: () => {}, onStatus: () => {}, getDump: () => '', onAIReply: () => false },

  init(hooks) {
    this.hooks = { ...this.hooks, ...hooks };
    try { this.cfg = JSON.parse(localStorage.getItem(SYNC_KEY)); } catch { this.cfg = null; }
    if (this.cfg && !this.cfg.mode) this.cfg.mode = this.cfg.token ? 'github' : 'macmini';
    if (this.cfg && !this.cfg.device) { this.cfg.device = this.deviceName(); this.save(); }
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && this.enabled()) this.pull({ quiet: true }); });
    window.addEventListener('online', () => { if (this.enabled()) this.push(); });
  },
  enabled() { return !!this.cfg && (this.cfg.mode === 'macmini' ? !!this.cfg.url : !!(this.cfg.token && this.cfg.repo)); },
  // 未設定なら Mac mini に届くか試し、届けば自動でつなぐ（タップ不要。tailnet の中でしか届かないので安全）
  async autoConnect() {
    if (this.cfg || this.autoTried) return false;
    this.autoTried = true;
    const saved = this.cfg; this.cfg = { mode: 'macmini', url: MACMINI_DEFAULT, device: this.deviceName(), lastAt: null, appliedReplies: [] };
    try { const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 4000); const r = await fetch(MACMINI_DEFAULT + '/api/health', { cache: 'no-store', signal: ctl.signal }); clearTimeout(t); if (!r.ok) throw new Error(); }
    catch { this.cfg = saved; this.status('Mac mini に届かない（この端末の Tailscale がオフ？）', false); return false; }
    this.save(); this.status('Mac mini と自動でつながった', true); return true;
  },
  label() { return !this.cfg ? '' : this.cfg.mode === 'macmini' ? `Mac mini（${this.cfg.url.replace(/^https?:\/\//, '')}）` : `GitHub（${this.cfg.repo}）`; },
  save() { try { localStorage.setItem(SYNC_KEY, JSON.stringify(this.cfg)); } catch {} },
  deviceName() {
    const ua = navigator.userAgent;
    const kind = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'iPad' : /iPhone/.test(ua) ? 'iPhone' : /Macintosh/.test(ua) ? 'Mac' : '端末';
    return `${kind}-${Math.random().toString(36).slice(2, 6)}`;
  },
  configureMacMini({ url = MACMINI_DEFAULT } = {}) {
    this.cfg = { mode: 'macmini', url: url.trim().replace(/\/+$/, ''), device: this.cfg?.device ?? this.deviceName(), lastAt: null, appliedReplies: this.cfg?.appliedReplies ?? [] };
    this.save();
  },
  configureGitHub({ repo, token }) {
    this.cfg = { mode: 'github', repo: repo.trim(), token: token.trim(), device: this.cfg?.device ?? this.deviceName(), sha: null, lastAt: null, appliedReplies: this.cfg?.appliedReplies ?? [] };
    this.save();
  },
  disconnect() { this.cfg = null; try { localStorage.removeItem(SYNC_KEY); } catch {} this.status('同期を外した', true); },
  status(msg, ok = true) { this.last = { at: new Date().toISOString(), msg, ok }; this.hooks.onStatus(this.last); },

  // ---- 経路 A: Mac mini ----
  async mmFetch(path, opt = {}) {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 12000);
    try { return await fetch(this.cfg.url + path, { cache: 'no-store', signal: ctl.signal, ...opt }); }
    catch (e) { throw new Error(e.name === 'AbortError' ? 'Mac mini に届かない（Tailscale がつながっているか。12秒待った）' : 'Mac mini に届かない（Tailscale がつながっているか）'); }
    finally { clearTimeout(t); }
  },
  async health() { const r = await this.mmFetch('/api/health'); if (!r.ok) throw new Error(`Mac mini ${r.status}`); const j = await r.json(); this.ai = j.ai ?? null; return j; },

  // ---- 経路 B: GitHub ----
  ghHeaders() { return { Authorization: `Bearer ${this.cfg.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }; },
  async ghGet(path) {
    const r = await fetch(`${API}/${this.cfg.repo}/contents/${path}?ref=main&t=${Date.now()}`, { headers: this.ghHeaders(), cache: 'no-store' });
    if (r.status === 404) return null;
    if (r.status === 401 || r.status === 403) throw new Error('合言葉（PAT）が通らない。期限切れか、権限（Contents 読み書き）か、リポ名を確認');
    if (!r.ok) throw new Error(`GitHub ${r.status}（${path}）`);
    const j = await r.json();
    return { sha: j.sha, text: j.content ? new TextDecoder().decode(Uint8Array.from(atob(j.content.replace(/\n/g, '')), c => c.charCodeAt(0))) : '' };
  },
  async ghPut(path, text, sha, message) {
    const content = btoa(String.fromCharCode(...new TextEncoder().encode(text)));
    const r = await fetch(`${API}/${this.cfg.repo}/contents/${path}`, { method: 'PUT', headers: { ...this.ghHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ message, content, sha: sha ?? undefined, branch: 'main' }) });
    if (r.status === 409 || r.status === 422) return { conflict: true };
    if (!r.ok) throw new Error(`GitHub ${r.status}（${path} 書き込み）`);
    return { sha: (await r.json()).content.sha };
  },

  // ---- 共通の操作（経路で分岐）----
  async readState() {
    if (this.cfg.mode === 'macmini') { const r = await this.mmFetch('/api/state'); if (r.status === 404) return null; if (!r.ok) throw new Error(`Mac mini ${r.status}`); return { text: await r.text() }; }
    const f = await this.ghGet('data/tefuda.json'); if (f) this.cfg.sha = f.sha; return f;
  },
  async writeState(body, local) {
    if (this.cfg.mode === 'macmini') {
      const r = await this.mmFetch('/api/state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body });
      if (r.status === 409) { const j = await r.json(); return { conflict: true, remote: j.remote, reason: j.error }; }
      if (!r.ok) throw new Error(`Mac mini ${r.status}（書き込み）`);
      return { ok: true };
    }
    let r = await this.ghPut('data/tefuda.json', body, this.cfg.sha, `sync from ${this.cfg.device} ${local.updatedAt}`);
    if (r.conflict) { const f = await this.ghGet('data/tefuda.json'); return { conflict: true, remote: f ? JSON.parse(f.text) : null, sha: f?.sha ?? null }; }
    this.cfg.sha = r.sha; return { ok: true };
  },
  async writeDump(dump) {
    if (!dump) return;
    if (this.cfg.mode === 'macmini') { await this.mmFetch('/api/dump', { method: 'PUT', headers: { 'Content-Type': 'text/plain; charset=utf-8' }, body: dump }); return; }
    const d = await this.ghGet('data/dump.txt'); if (!d || d.text !== dump) await this.ghPut('data/dump.txt', dump, d?.sha ?? null, `dump from ${this.cfg.device}`);
  },
  async readReply() {
    if (this.cfg.mode === 'macmini') { const r = await this.mmFetch('/api/ai-reply'); if (r.status === 404) return null; if (!r.ok) return null; return r.text(); }
    const f = await this.ghGet('data/ai-reply.json'); return f?.text ?? null;
  },

  // ---- プロファイル（Mac mini が即時に作る）----
  async requestProfile(dump) {
    if (!this.enabled() || this.cfg.mode !== 'macmini') throw new Error('Mac mini とつながっていない');
    const r = await this.mmFetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'text/plain; charset=utf-8' }, body: dump });
    if (!r.ok) throw new Error(`Mac mini ${r.status}`);
    return r.json();
  },
  async readProfile() {
    if (!this.enabled() || this.cfg.mode !== 'macmini') return null;
    const r = await this.mmFetch('/api/profile'); if (!r.ok) return null; return r.json();
  },
  async profileStatus() { const r = await this.mmFetch('/api/profile-status'); return r.ok ? r.json() : null; },

  // 取り込み: 向こうが新しければ置き換える。AI の返事も見る
  async pull({ quiet = false } = {}) {
    if (!this.enabled() || this.busy) return null;
    this.busy = true;
    try {
      if (this.cfg.mode === 'macmini') { try { await this.health(); } catch {} }
      const f = await this.readState();
      let took = false, remote = null;
      if (f) {
        remote = JSON.parse(f.text);
        const local = this.hooks.getLocal();
        const remoteHas = !!(remote.db?.state && remote.db?.cards) || hasMonshinContent(remote.monshin);
        const rr = richness(remote), lr = richness({ db: local.db, monshin: local.monshin });
        // 中身の量が多い方を守る: 向こうが半分未満なら取り込まない（時刻が新しくても）。同程度なら新しい方
        if (remoteHas && rr >= lr * 0.5 && (!local.hasContent || (remote.updatedAt && (!local.updatedAt || remote.updatedAt > local.updatedAt)))) { this.hooks.setLocal(remote); took = true; }
        else if (remoteHas && rr < lr * 0.5) this.status(`向こう（${remote.device ?? '?'}）の中身が少ないので取り込まなかった（${rr} < ${lr}）`, true);
      }
      const gotAI = await this.pullAIReply();
      // 向こうが無い・古い・空で、こちらに中身があれば送る（開いただけで揃う）
      { const local = this.hooks.getLocal(); const remoteHas = !!(remote?.db?.state && remote?.db?.cards) || hasMonshinContent(remote?.monshin); if (!took && local.hasContent && (!remote || !remoteHas || (local.updatedAt && (!remote.updatedAt || remote.updatedAt < local.updatedAt)))) this.schedulePush(); }
      this.cfg.lastAt = new Date().toISOString(); this.save();
      if (!quiet || took || gotAI) this.status(took ? `他の端末（${remote?.device ?? '?'}）の方が新しいので取り込んだ` : gotAI ? 'AI の返事を取り込んだ' : '取り込み: こちらが最新', true);
      return { took, gotAI };
    } catch (e) { this.status('取り込めない: ' + e.message, false); return null; }
    finally { this.busy = false; }
  },
  async pullAIReply() {
    const text = await this.readReply();
    if (!text) return false;
    let reply; try { reply = JSON.parse(text); } catch { return false; }
    const id = reply.id ?? `${reply.on}:${reply.forDumpHash}`;
    if (this.cfg.appliedReplies.includes(id)) return false;
    const ok = this.hooks.onAIReply(reply);
    if (ok) { this.cfg.appliedReplies = [...this.cfg.appliedReplies.slice(-20), id]; this.save(); }
    return ok;
  },

  // 送信: 保存のたびに 3 秒遅らせてまとめる
  schedulePush() { if (!this.enabled()) return; clearTimeout(this.timer); this.timer = setTimeout(() => this.push(), 3000); },
  async push() {
    if (!this.enabled() || this.busy) { if (this.busy) this.schedulePush(); return; }
    this.busy = true;
    try {
      const local = this.hooks.getLocal();
      if (!local.updatedAt || !local.hasContent) { this.status('この端末にはまだ中身が無いので送らない', true); return; }
      const body = JSON.stringify({ tefuda: 1, updatedAt: local.updatedAt, device: this.cfg.device, db: local.db, monshin: local.monshin });
      let r = await this.writeState(body, local);
      if (r.conflict) {
        if (r.remote && (r.reason === 'remote has content' || r.reason === 'remote richer' || (r.remote.updatedAt && r.remote.updatedAt > local.updatedAt))) { this.hooks.setLocal(r.remote); if (r.sha) this.cfg.sha = r.sha; this.save(); this.status(`他の端末（${r.remote.device ?? '?'}）の方が新しいので取り込んだ`, true); return; }
        if (this.cfg.mode === 'github') { this.cfg.sha = r.sha; r = await this.writeState(body, local); }
        if (r.conflict) throw new Error('書き込みがぶつかった。もう一度「今すぐ同期」');
      }
      await this.writeDump(this.hooks.getDump());
      this.cfg.lastAt = new Date().toISOString(); this.save();
      this.status('送った', true);
    } catch (e) { this.status('送れない: ' + e.message, false); }
    finally { this.busy = false; }
  },
};

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
const M_INIT = () => ({ phase: 'home', answers: {}, rates: {}, picks: {}, rewrite: {}, customItems: {}, skipped: [], ai: { rounds: [] }, profiles: [], votes: {}, history: [], cur: { methodId: null, idx: 0 }, values: { step: 0, picks: [[], [], []], custom: [] }, stars: [], final: [], slots: { who: '', use: '', grow: '' }, finalText: '', startedOn: null });
let m = (() => { try { const x = JSON.parse(localStorage.getItem(M_KEY)); if (!x) return M_INIT(); const y = { ...M_INIT(), ...x, cur: { methodId: null, idx: 0 }, phase: 'home' }; if (x.values && !y.picks.values) y.picks.values = x.values; delete y.values; return y; } catch { return M_INIT(); } })();
let inMonshin = false; // true の間は棚卸しの画面だけを出す
const META_KEY = 'tefuda.meta';
let meta = (() => { try { return JSON.parse(localStorage.getItem(META_KEY)) ?? {}; } catch { return {}; } })();
queueMicrotask(() => { if (!meta.sig) { meta.sig = contentSignature(db, m); try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch {} } });
function touch() {
  // 内容が変わった時だけ更新時刻を進める（画面を開いただけでは進めない＝空の端末が「新しい」にならない）
  const sig = contentSignature(db, m);
  if (meta.sig === sig) return;
  meta.sig = sig; meta.updatedAt = new Date().toISOString();
  try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch {}
  Sync.schedulePush();
}
function persistM() { try { localStorage.setItem(M_KEY, JSON.stringify(m)); } catch {} touch(); }
function openMonshin(phase = 'home') { m.phase = phase; m.startedOn ??= today(); inMonshin = true; persistM(); render(); }
function closeMonshin() { inMonshin = false; persistM(); render(); }

function persist() { saveDb(db); touch(); }
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
      ① <b>拡げる</b>: いろんな人のやり方の「手法カード」${METHODS.length}枚（${ITEM_COUNT}問）から好きなものを。やりたくないカードは飛ばしてよい。1日1〜2枚でよく、途中で閉じても残る<br>
      ② <b>絞る</b>: 自分の答えを見返して「今も本当だ」と思うものに星 → 3つに<br>
      ③ <b>組み立てる</b>: 残った自分の言葉で「誰のために、何を使って、何を増やす人」の1文にする<br>
      できた文は「今日」の画面の上に出て、実験の方向を決めます。3か月たったら書き直します。</p>
      <button class="primary" id="monshinStart">${m.startedOn ? '棚卸しの続きから' : '棚卸しをはじめる'}</button>
      <button class="ghost" id="monshinSkip">先に方向だけ選んで始める（棚卸しはあとで）</button>
    </section>
    <p class="note">通知はありません。データはこの端末の中だけに保存されます。</p>`;
}

// ---------- 棚卸し（§18 v3: 手法カード）----------
function viewMonshin() {
  return { home: mHome, write: mWrite, pick: mPick, rate: mRate, review: mReview, narrow: mNarrow, compose: mCompose, timeline: mTimeline, profile: mProfile, outline: mOutline }[m.phase]();
}
const KIND_LABEL = { write: '書く', pick: '選ぶ', rate: '当てはまり度' };
const cardOf = id => (id === 'ai' ? aiCard(m) : method(id));

function mHome() {
  const pr = progress(m);
  const row = c => {
    const x = pr.per[c.id];
    if (x.skipped) return `<div class="opt btn skipped"><b>${esc(c.title)}</b><span class="small">飛ばした ／ <a href="#" data-unskip="${c.id}">戻す</a></span></div>`;
    const done = x.done === x.total;
    const sum = c.kind === 'rate' && x.done ? rateSummary(c, m.rates[c.id], m) : c.kind === 'pick' && x.done ? `選んだ: ${pickFinal(m, c.id).join('・')}` : null;
    return `<button class="opt btn ${done ? 'done' : ''}" data-method="${c.id}"><b>${esc(c.title)}</b><span class="small">${esc(c.source)}</span><span class="small">${KIND_LABEL[c.kind]}・約${c.minutes}分 ／ ${done ? '✔ 済' : x.done ? `${x.done} / ${x.total}` : 'まだ'}${sum ? ` ／ ${esc(sum)}` : ''}</span></button>`;
  };
  const ai = aiCard(m); const lr = latestRound(m); const rounds = m.ai.rounds.length;
  const aiRow = ai ? (() => { const done = ai.items.filter(q => (m.answers[q.id] ?? '').trim()).length; return `<button class="opt btn ai ${done === ai.items.length ? 'done' : ''}" data-method="ai"><b>${esc(ai.title)}（${rounds}回目）</b><span class="small">${esc(ai.why)}</span><span class="small">書く・${ai.items.length}問 ／ ${done === ai.items.length ? '✔ 済' : `${done} / ${ai.items.length}`}</span></button>`; })() : '';
  return `
    <h1>棚卸し</h1>
    <p class="lede">材料を出す → AI が読む → 問いが返る → 絞る → 1文にする。</p>
    ${rounds ? `<section class="card ai">
      <h2>AI が読んだ（${rounds}回目）</h2>
      ${lr.observations.map(o => `<p>・${esc(o)}</p>`).join('')}
      ${lr.note ? `<p class="small">${esc(lr.note)}</p>` : ''}
      ${lr.nextCards.length ? `<p class="small">次にやるとよさそうなカード: ${lr.nextCards.map(id => `<a href="#" data-method="${id}">${esc(method(id).title)}</a>`).join('・')}</p>` : ''}
      ${aiRow}
    </section>` : ''}
    ${(() => { const o = beliefOutline(m); return `<section class="card">
      <h2>信念と資質の輪郭 <span class="small">（信念 ${o.done}/${o.total}・資質 ${temperOutline(m).done}/${temperOutline(m).total} 枚）</span></h2>
      <p class="why">群「信念」のカードを全部やると、12本の目盛り（人は変われる／結果は自分で決まる／世界は公平で安全／人に頼れる／感情と体は味方／未来は開けている／失敗は糧になる／意味は自分で作る…）と、自分・他人の4面、「べき・ねば」「お金と仕事」「値打ちの置き場」の上位、そして自分で書いた候補文（私は／人は／世界は）が1枚に並ぶ。群「内向型の資質」を足すと、内向・開放性・感受性・価値主導の目盛りと「核のプロジェクト」も並ぶ（INFP かどうかは判定しない）。数字は目盛りで、良い悪いはない。</p>
      <button class="${o.done ? '' : 'ghost'}" id="mOutline">輪郭を見る${o.axes.length ? `（軸 ${o.axes.length}・候補文 ${o.candidates.length}）` : ''}</button>
    </section>`; })()}
    <section class="card">
      <h2>プロファイル（多面）${m.profiles.length ? `・${m.profiles.length} 回目まで` : ''}</h2>
      <p class="why">ここまでの材料を、<b>10の面</b>（元気の源／消耗の源／強み／大事にしているもの／誰のために／昔からの芯／避けたい未来／いまの状況／性格の傾向／見立て）で読む。面ごとに「あなたの場合（あなたの言葉を引用）」「活かし方（2分）」「裏目に出るかも」。そこから<b>「こういう可能性もあるかも」</b>を3〜6個、根拠と試し方つきで出す（正解ではなく探索の候補）。○×？を付けると次回に効く。数字で決まる面は AI 無しで今すぐ出る。</p>
      ${profileBusy ? `<p class="okaeri">AI が読んでいる… ${profileBusy}</p>` : ''}
      <div class="row"><button class="primary choice" id="mProfileMake">${m.profiles.length ? 'プロファイルを更新する' : 'プロファイルを作る'}（AI・1〜2分）</button>${m.profiles.length ? `<button class="choice" id="mProfileOpen">見る</button>` : `<button class="choice" id="mProfileOpen">数字だけ見る</button>`}</div>
    </section>
    <section class="card">
      <h2>記録（自分の年表）${m.history.length ? `・${m.history.length} 回` : ''}</h2>
      <p class="why">その時の材料（答え・当てはまり度・大事な言葉・星・仮の目的・いまの状況）を丸ごと凍結して残す。あとで答えを直しても、白紙からやり直しても、記録は変わらない。年表で「その時、何を大事にして、何をして、何を考えていたか」と前回からの変化が見える。仮の目的を決めた時は自動で1回記録される。3か月ごとにも1回。</p>
      ${m.history.length ? `<p class="small">最新: ${esc(snapshotLine(m.history[m.history.length - 1]).slice(0, 120))}</p>` : ''}
      <div class="row"><input id="mSnapLabel" placeholder="見出し（任意）例: 独立1年目"><button id="mSnap">いまを記録する</button></div>
      <div class="row">${m.history.length ? `<button class="ghost choice" id="mTimeline">年表を見る</button>` : ''}<button class="ghost choice" id="mWipe">白紙からやり直す（記録は残る）</button></div>
    </section>
    <section class="card">
      <h2>AI に読ませる</h2>
      <p class="why">ここまでの材料を1つの文章にまとめてコピーし、Claude（Claude Code のチャット。スマホからでも）に貼る → AI が「観察・仮の目的の候補・次の問い」を返す → その返事をここに貼り戻す。<b>様子を見て次を決めるのは AI、決めるのはあなた</b>。材料が少なくてもよい（少ないなりの問いが返る）。</p>
      <div class="row"><button id="mCopyDump">材料をコピーする</button><button class="ghost" id="mShowDump">文章を見る</button></div>
      <textarea id="mDumpBox" rows="4" hidden readonly></textarea>
      <p class="small">貼る先: Claude Code で <code>/tefuda 棚卸し</code> のあとに貼る（返事は <code>\`\`\`json</code> で返る）</p>
      <textarea id="mReplyBox" rows="3" placeholder="AI の返事（json）をここに貼る"></textarea>
      <button id="mReadReply">返事を読み込む</button>
    </section>
    <section class="card">
      <h2>① 拡げる（手法カード ${METHODS.length} 枚・${ITEM_COUNT} 問）</h2>
      <p class="why">いろんな人のやり方を1枚ずつ。<b>好きな順で、やりたくないカードは飛ばしてよい</b>（飛ばしたカードは一覧で戻せる）。1日1〜2枚でよく、途中で閉じても残る。型は3つ: <b>書く</b>（1行に1つ、思いつくだけ）／<b>選ぶ</b>（言葉をタップして絞る）／<b>当てはまり度</b>（1〜5などで答える。性格テストと同じ形）。</p>
      <p class="small">済 ${pr.cardsDone} 枚・飛ばした ${pr.cardsSkipped} 枚・材料 ${pr.items} 個</p>
      ${!rounds && ai ? aiRow : ''}
      <h3>先にやる: 選択肢系（選ぶ・当てはまり度）${CHOICE_METHODS.length} 枚</h3>
      <p class="why">タップだけで進む。<b>選択肢が微妙なら</b>、選ぶ型は「自分の言葉を足す」、当てはまり度は各項目の「✎」で言い換える／末尾で足す。</p>
      ${GROUPS.filter(g => CHOICE_METHODS.some(c => c.group === g.id)).map(g => `<p class="small grp">${esc(g.title)}</p>${CHOICE_METHODS.filter(c => c.group === g.id).map(row).join('')}`).join('')}
      <h3>あとで: 書く系 ${WRITE_METHODS.length} 枚</h3>
      <p class="why">自由に書く型。あとでよい。気が向いた1枚だけでも材料になる。</p>
      ${GROUPS.filter(g => WRITE_METHODS.some(c => c.group === g.id)).map(g => `<p class="small grp">${esc(g.title)}</p>${WRITE_METHODS.filter(c => c.group === g.id).map(row).join('')}`).join('')}
    </section>
    <section class="card">
      <h2>② 絞る → ③ 1文にする</h2>
      <p class="why">材料 ${pr.items} 個。${pr.canNarrow ? '絞りに進めます（あとからカードを足して、また絞り直してもよい）。' : '材料が 12 個以上、またはカード 3 枚が終わると進めます。'}${m.final.length ? ` いま残している: ${m.final.length} 個。` : ''}</p>
      <button class="primary" id="mToReview" ${pr.canNarrow ? '' : 'disabled'}>${m.stars.length ? '星のつづきから絞る' : '見返して星をつける'}</button>
      ${m.final.length ? `<button id="mToCompose">1文にする画面へ</button>` : ''}
    </section>
    <button class="ghost" id="mClose">閉じる（途中でも残る）</button>`;
}

function mHeader(c) {
  return `<div class="progress">${esc(c.title)} <span class="small">${esc(c.source)}</span></div>`;
}

function mWrite() {
  const c = cardOf(m.cur.methodId);
  const q = c.items[m.cur.idx];
  const v = m.answers[q.id] ?? '';
  const lines = v.split('\n').filter(s => s.trim()).length;
  return `
    ${mHeader(c)}
    <section class="card">
      <div class="small">${m.cur.idx + 1} / ${c.items.length}${m.cur.idx === 0 ? ` ・ ${esc(c.why)}` : ''}</div>
      <h2>${esc(q.text)}</h2>
      <p class="why">${q.hint ? esc(q.hint) + '。' : ''}1つずつ改行。${q.max}個まで。思いつかなければ空で次へ。</p>
      <textarea id="mAns" rows="6" placeholder="ここに書く（1行に1つ）">${esc(v)}</textarea>
      <p class="small">${lines} 個</p>
    </section>
    <button class="primary" id="mNext">${m.cur.idx === c.items.length - 1 ? 'このカードを終える' : '次へ'}</button>
    <div class="row">
      <button class="ghost choice" id="mBack">${m.cur.idx === 0 ? '一覧へ' : '戻る'}</button>
      <button class="ghost choice" id="mHome">一覧へ（残る）</button>
    </div>
    ${c.id === 'ai' ? '' : '<button class="ghost small" id="mSkipCard">このカードはやりたくない → 飛ばす（一覧で戻せる）</button>'}`;
}

function mPick() {
  const c = cardOf(m.cur.methodId);
  const ps = pickState(m, c.id);
  const step = ps.step, last = c.steps.length - 1;
  const limit = c.steps[step];
  const pool = step === 0 ? pickOptions(m, c.id) : ps.picks[step - 1];
  const picked = ps.picks[step];
  return `
    ${mHeader(c)}
    <section class="card">
      <div class="small">${step + 1} / ${c.steps.length} ・ ${esc(c.why)}</div>
      <h2>${step === 0 ? `近いものを、${limit}個まで選ぶ` : `その中から ${limit}つ`}</h2>
      <p class="why">${step === 0 ? '深く考えず、目に止まったものをタップ。<b>ぴったりの言葉が無ければ、下で自分の言葉を足す</b>（足した言葉も選べる）。' : '「これだけは」を残す。捨てた言葉も消えず、戻れる。'} いま ${picked.length} / ${limit}</p>
      <div class="chips">${pool.map(w => `<button class="chip ${picked.includes(w) ? 'on' : ''} ${ps.custom.includes(w) ? 'mine' : ''}" data-val="${esc(w)}">${esc(w)}</button>`).join('')}</div>
      ${step === 0 ? `<div class="row"><input id="mCustom" placeholder="選択肢に無い → 自分の言葉を足す"><button id="mAddCustom">足す</button></div>` : ''}
    </section>
    <button class="primary" id="mValNext" ${picked.length === 0 ? 'disabled' : ''}>${step === last ? `${limit}つに決める` : '次へ'}</button>
    <div class="row">
      <button class="ghost choice" id="mValBack">${step === 0 ? '一覧へ' : '戻る'}</button>
    </div>
    <button class="ghost small" id="mSkipCard">このカードはやりたくない → 飛ばす（一覧で戻せる）</button>`;
}


function mRate() {
  const c = method(m.cur.methodId);
  const rt = m.rates[c.id] ?? {};
  const items = rateItems(c, m);
  const scaleLabel = c.scale === 10 ? '1＝不満 … 10＝満足' : c.scale === 7 ? '1＝全く当てはまらない … 7＝とても当てはまる' : '1＝当てはまらない … 5＝よく当てはまる';
  const answered = items.filter(i => rt[i.id] != null).length;
  const sum = answered ? rateSummary(c, rt, m) : null;
  return `
    ${mHeader(c)}
    <section class="card">
      <h2>${esc(c.why)}</h2>
      <p class="why">${scaleLabel}。直感で。全部でなくてもよい。<b>言葉が微妙なら「✎」で自分の言葉に言い換え</b>、無いものは末尾で足す。${c.id === 'tipi' ? '結果は5つの目盛りで出る（タイプ名は付けない）。' : ''}</p>
      ${items.map(it => `<div class="rateRow"><div class="rateText">${esc(it.text)}${it.original && it.original !== it.text ? `<span class="small">（元: ${esc(it.original)}）</span>` : ''}${it.custom ? '<span class="small">（自分で足した）</span>' : ''} <button class="mini" data-rewrite="${it.id}" title="自分の言葉で言い換える">✎</button></div><div class="rateBtns">${Array.from({ length: c.scale }, (_, k) => k + 1).map(n => `<button class="rb ${rt[it.id] === n ? 'on' : ''}" data-rate="${it.id}" data-n="${n}">${n}</button>`).join('')}</div></div>`).join('')}
      <div class="row"><input id="mRateCustom" placeholder="選択肢に無い → 自分の言葉で項目を足す"><button id="mRateAdd">足す</button></div>
      <p class="small rateSum">答えた ${answered} / ${items.length}${sum ? `<br>${esc(sum)}` : ''}</p>
    </section>
    <button class="primary" id="mRateDone">このカードを終える</button>
    <div class="row"><button class="ghost choice" id="mHome">一覧へ（残る）</button></div>
    <button class="ghost small" id="mSkipCard">このカードはやりたくない → 飛ばす（一覧で戻せる）</button>`;
}

function mReview() {
  const items = itemsFrom(m);
  const top3 = pickFinal(m, 'values');
  const label = i => i.methodId === i.pid ? `${method(i.methodId).title}（当てはまり度 ${i.score}）` : promptText(m, i.pid);
  return `
    <div class="progress">② 絞る 1 / 2</div>
    <section class="card">
      <h2>見返して、「今も本当だ」と思うものに ★</h2>
      <p class="why">あなたの材料を全部並べています（当てはまり度カードは上位だけ）。読んで、まだ本当だと思うものに星（${STAR_LIMIT}個まで）。星は「これが自分」の材料になります。 いま ${m.stars.length} / ${STAR_LIMIT}</p>
      ${top3.length ? `<p class="small">大事な言葉（決めた3つ）: ${top3.map(esc).join('・')}</p>` : ''}
      ${[...(aiCard(m) ? [aiCard(m)] : []), ...METHODS].filter(c => items.some(i => i.methodId === c.id)).map(c => `
        <h3>${esc(c.title)}</h3>
        ${items.filter(i => i.methodId === c.id).map(i => `<button class="opt btn star ${m.stars.includes(i.id) ? 'on' : ''}" data-star="${i.id}"><span class="mark">${m.stars.includes(i.id) ? '★' : '☆'}</span><span class="body">${esc(i.text)}<span class="small">${esc(label(i))}</span></span></button>`).join('')}`).join('')}
    </section>
    <button class="primary" id="mToNarrow" ${m.stars.length === 0 ? 'disabled' : ''}>星から3つに絞る</button>
    <div class="row"><button class="ghost choice" id="mHome">一覧へ（残る）</button></div>`;
}

function mNarrow() {
  const items = itemsFrom(m);
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

let profileBusy = ''; let profilePoll = null;
function mProfile() {
  const lp = localProfile(m); const lpos = localPossibilities(m);
  const P = m.profiles[m.profiles.length - 1] ?? null;
  const lvl = m.ui?.profileLevel ?? '全部';
  const poss = [...lpos.map(p => ({ ...p, src: '数字' })), ...(P ? P.profile.possibilities.map(p => ({ ...p, src: 'AI' })) : [])].filter(p => lvl === '全部' || p.level === lvl);
  const voteKey = p => `${P?.id ?? 'local'}:${p.id}`;
  return `
    <div class="progress">プロファイル ${P ? `（AI ${P.on}・${m.profiles.length}回目）` : '（数字だけ。AI はまだ）'}</div>
    ${P?.profile.summary ? `<section class="card ai"><b>まとめ</b> ${esc(P.profile.summary)}${P.profile.caution ? `<p class="small">限界: ${esc(P.profile.caution)}</p>` : ''}</section>` : ''}
    <section class="card">
      <h2>10の面</h2>
      <p class="why">「あなたの場合」はあなたの言葉からの読み。当たっている必要はない。断定はしない。</p>
      ${FACETS.map(f => { const a = P?.profile.facets.find(x => x.id === f.id); const l = lp.find(x => x.id === f.id); if (!a && !l) return `<div class="facet dim"><b>${esc(f.name)}</b><span class="small">まだ材料がない（${esc(f.hint)}）</span></div>`; return `<div class="facet"><b>${esc(f.name)}</b>${l ? `<div class="small">数字から: ${esc(l.text)}</div>` : ''}${a ? `<div>${esc(a.text)}</div>${a.thrive ? `<div class="small">活かし方（2分）: ${esc(a.thrive)}</div>` : ''}${a.blind ? `<div class="small">裏目に出るかも: ${esc(a.blind)}</div>` : ''}${a.basis?.length ? `<div class="small">根拠: ${a.basis.map(esc).join('／')}</div>` : ''}` : ''}</div>`; }).join('')}
      ${lp.find(x => x.id === 'direction') ? `<div class="facet"><b>実験の方向（数字から）</b><div class="small">${esc(lp.find(x => x.id === 'direction').text)}</div></div>` : ''}
    </section>
    <section class="card">
      <h2>こういう可能性もあるかも</h2>
      <p class="why">探索の候補であって正解ではない。<b>試す大きさ</b>で絞れる。○＝そうかも ×＝違う ？＝分からない。付けた反応は次回のプロファイルに渡る（× は繰り返さない、○ は深める）。</p>
      <div class="chips">${['全部', ...LEVELS].map(x => `<button class="chip ${lvl === x ? 'on' : ''}" data-lvl="${x}">${x}</button>`).join('')}</div>
      ${poss.length ? poss.map(p => `<div class="poss"><div><span class="tag">${p.src}・${esc(p.level)}・${esc(p.confidence)}</span></div><b>${esc(p.text)}</b>${p.try ? `<div class="small">試す: ${esc(p.try)}</div>` : ''}${p.basis?.length ? `<div class="small">根拠: ${p.basis.map(esc).join('／')}</div>` : ''}<div class="row">${VOTE.map(v => `<button class="choice ${m.votes[voteKey(p)] === v ? 'sel' : ''}" data-vote="${esc(voteKey(p))}" data-v="${v}">${v}</button>`).join('')}</div></div>`).join('') : '<p class="small">この大きさの候補はまだ無い。</p>'}
    </section>
    <button class="primary" id="mProfileMake">${P ? 'プロファイルを更新する' : 'AI に読ませてプロファイルを作る'}（1〜2分）</button>
    ${m.profiles.length > 1 ? `<p class="small">これまで ${m.profiles.length} 回。前回: ${esc(m.profiles[m.profiles.length - 2].on)}</p>` : ''}
    <div class="row"><button class="ghost choice" id="mHome">一覧へ</button></div>`;
}

function mOutline() {
  const o = beliefOutline(m);
  const t = temperOutline(m);
  const tOpp = { '内向（一人で充電）': ['人といて充電', '一人で充電'], '開放性（想像・審美）': ['決まった道', '想像・審美'], '感受性（刺激に深く反応）': ['さらっと流す', '深く反応'], '価値主導（自分の物差しで決める）': ['周りの基準', '自分の物差し'] };
  const bar = (a, lo, hi) => `<div class="axis"><div class="axisHead"><span class="small">${esc(lo)}</span><b>${esc(a.name)}</b><span class="small">${esc(hi)}</span></div><div class="axisBar"><div class="axisFill" style="left:${((a.value - 1) / (a.max - 1) * 100).toFixed(0)}%"></div></div><div class="small">${a.value.toFixed(1)} / ${a.max}（${a.n}/${a.total} 問）</div></div>`;
  const opp = { '人は変われる': ['変わらない', '変われる'], '結果は自分で決まる': ['運・他人', '自分'], '世界は公平で安全': ['理不尽・危険', '公平・安全'], '人に頼れる': ['自分でやる', '頼れる'], '感情と体は味方': ['邪魔', '味方'], '未来は開けている': ['手遅れ', '開けている'], '失敗は糧になる': ['損なう', '糧になる'], '意味は自分で作る': ['与えられる', '自分で作る'] };
  const cards = METHODS.filter(c => c.group === 'belief' || c.group === 'temper');
  const todo = cards.filter(c => { const st = pr_status(c); return !st.skipped && st.done < st.total; });
  function pr_status(c) { return progress(m).per[c.id]; }
  return `
    <div class="progress">信念の輪郭 <span class="small">カード ${o.done} / ${o.total}</span></div>
    ${t.axes.length || t.core.length ? `<section class="card"><h2>内向型の資質 <span class="small">（カード ${t.done} / ${t.total}）</span></h2><p class="why">INFP かどうかは判定しない。INFP と言われる人が持ちやすい「素材」を、あなたの目盛りと言葉で出す。</p>${t.axes.map(a => bar(a, ...(tOpp[a.name] ?? ['', '']))).join('')}${t.sensitivity.length ? `<div class="chips">${t.sensitivity.map(a => `<span class="chip">${esc(a.name)} ${a.value.toFixed(1)}</span>`).join('')}</div>` : ''}${t.core.length ? `<p><b>核のプロジェクト</b>（自分らしさ×楽しさ）<br><span class="small">${t.core.map(esc).join('／')}</span></p>` : ''}${t.niches.length ? `<p><b>回復の場所</b><br><span class="small">${t.niches.map(esc).join('／')}</span></p>` : ''}${t.solo.length ? `<p><b>一人でやる創造</b><br><span class="small">${t.solo.map(esc).join('／')}</span></p>` : ''}</section>` : ''}
    ${o.axes.length ? `<section class="card"><h2>信念の目盛り（左右どちらが良いということはない）</h2>${o.axes.map(a => bar(a, ...(opp[a.name] ?? ['', '']))).join('')}</section>` : ''}
    ${o.selfOther.length ? `<section class="card"><h2>自分と他人の見方</h2><div class="chips">${o.selfOther.map(a => `<span class="chip">${esc(a.name)} ${a.value.toFixed(1)}</span>`).join('')}</div></section>` : ''}
    ${o.tops.length ? `<section class="card"><h2>強く持っている前提（上位）</h2>${o.tops.map(t => `<p><b>${esc(t.title)}</b><br><span class="small">${t.items.map(esc).join('／')}</span></p>`).join('')}</section>` : ''}
    ${o.candidates.length ? `<section class="card"><h2>自分で書いた候補文</h2><p class="why">下向き矢印・ラダリング・文の続き・一線・決断・口ぐせ・日記から。これが「輪郭」の言葉の部分。反証さがしで確信を動かせる。</p>${o.candidates.map(c => `<p>・${esc(c)}</p>`).join('')}</section>` : ''}
    ${todo.length ? `<section class="card"><h2>まだのカード（${todo.length}）</h2>${todo.map(c => `<button class="opt btn" data-method="${c.id}"><b>${esc(c.title)}</b><span class="small">${KIND_LABEL[c.kind]}・約${c.minutes}分</span></button>`).join('')}</section>` : '<section class="card ai"><b>信念カードは全部済み。</b> プロファイルを更新すると、AI が「私は／人は／世界は」の候補文を組む。</section>'}
    ${!o.axes.length && !o.candidates.length ? '<section class="card"><p class="small">まだ材料がない。上の「まだのカード」から。設問4枚（10分）で目盛りが出る。</p></section>' : ''}
    <div class="row"><button class="ghost choice" id="mHome">一覧へ</button><button class="ghost choice" id="mProfileOpen">プロファイルへ</button></div>`;
}

function mTimeline() {
  const H = [...m.history].reverse();
  const nums = sn => { const n = sn.numbers ?? {}; const L = []; if (n.ikigai9) L.push(`生きがい9 ${n.ikigai9.total}/${n.ikigai9.max}`); if (n.wheel) L.push(`生活の輪 ${Object.entries(n.wheel).map(([k, v]) => `${k}${v}`).join(' ')}`); if (n.perma) L.push(`5つの柱 ${Object.entries(n.perma).map(([k, v]) => `${k.slice(0, 6)}${v}`).join(' ')}`); if (n.tipi) L.push(`性格の傾向 ${Object.entries(n.tipi).filter(([, v]) => v != null).map(([k, v]) => `${k}${v}`).join(' ')}`); if (n.via?.length) L.push(`強み上位 ${n.via.join('・')}`); if (n.meaning?.length) L.push(`意味の源上位 ${n.meaning.join('・')}`); return L; };
  return `
    <div class="progress">年表（${m.history.length} 回・新しい順）</div>
    ${H.map((sn, k) => { const prev = m.history[m.history.length - 2 - k]; const d = diffSnapshots(prev, sn); return `
    <section class="card snap">
      <h2>${esc(sn.on)}${sn.label ? ` 「${esc(sn.label)}」` : ''}</h2>
      ${sn.purpose?.text ? `<p><b>仮の目的</b> ${esc(sn.purpose.text)}</p>` : '<p class="small">仮の目的: まだ</p>'}
      ${sn.values.length ? `<p><b>大事な言葉</b> ${sn.values.map(esc).join('・')}</p>` : ''}
      ${sn.final.length ? `<p><b>残した3つ</b> ${sn.final.map(esc).join('・')}</p>` : ''}
      ${nums(sn).map(x => `<p class="small">${esc(x)}</p>`).join('')}
      ${Object.keys(sn.context).length ? `<h3>その時の状況</h3>${Object.entries(sn.context).map(([k, v]) => `<p class="small"><b>${esc(k)}</b> ${esc(v).replace(/\n/g, ' / ')}</p>`).join('')}` : '<p class="small">状況: 未記入（「いまの状況」カード）</p>'}
      ${d.length ? `<h3>前回からの変化</h3>${d.map(x => `<p class="small">・${esc(x)}</p>`).join('')}` : (prev ? '<p class="small">前回から変化なし</p>' : '<p class="small">最初の記録</p>')}
      <p class="small">材料 ${sn.itemsCount} 個・済 ${sn.cardsDone} 枚・AI ${sn.aiRounds} 回</p>
    </section>`; }).join('')}
    <div class="row"><button class="ghost choice" id="mHome">一覧へ</button></div>`;
}

function mCompose() {
  const chips = chipsFor(m, m.final.length ? m.final : m.stars);
  const computed = buildPurpose(m.slots);
  const text = m.finalText || computed;
  const dirGuess = directionHint(m) ?? db?.state?.direction?.id ?? 'body';
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
      <p class="why">型は「［誰］のために、［使うもの］を使って、［増やすもの］を増やす人」。下の言葉は全部あなたの材料から。タップで入る。空のところは省かれる。当たっている必要はなく、3か月後に書き直します。</p>
      ${latestRound(m).candidates.length ? `<h3>AI が材料から組んだ候補（タップで入る。直してよい）</h3>${latestRound(m).candidates.map((c, i) => `<button class="opt btn cand" data-cand="${i}"><b>${esc(c.text)}</b>${c.basis.length ? `<span class="small">根拠（あなたの言葉）: ${c.basis.map(esc).join('／')}</span>` : ''}</button>`).join('')}` : ''}
      ${slot('who', '誰のために', '自分でもよい。「自分を超えた誰か」が入ると続きやすい。', chips.who)}
      ${slot('use', '使うもの（好き・得意・強み）', '残した3つ、好き・得意、強みの上位から。', chips.use)}
      ${slot('grow', '増やすもの', '大事な言葉、残した3つ、意味の源の上位から。', chips.grow)}
      <h3>できた文（直してよい）</h3>
      <input id="mFinalText" value="${esc(text)}" placeholder="例: 家族のために、体を動かすことを使って、眠れる夜を増やす人">
    </section>
    <section class="card">
      <h3>実験の方向</h3>
      <p class="why">この文に合う「変えたいこと」を1つ。大事な言葉・生活の輪の低いところから「${esc(DIRECTIONS.find(x => x.id === dirGuess).trouble)}」を先に入れてあります。違えば変える。</p>
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
  const items = itemsFrom(m);
  const purpose = {
    text, directionId, gainIndex, gain: d.gains[gainIndex],
    slots: { ...m.slots }, final: m.final.map(id => items.find(i => i.id === id)?.text).filter(Boolean), stars: m.stars.length, values: pickFinal(m, 'values'), itemsCount: items.length, cardsDone: progress(m).cardsDone, ikigai9: m.rates.ikigai9 ? rateSummary(method('ikigai9'), m.rates.ikigai9, m) : null,
    decidedOn: today(), reviewOn: addDays(today(), REVIEW_DAYS),
    history: [...(prev?.history ?? []), ...(prev ? [{ text: prev.text, on: prev.decidedOn }] : [])],
  };
  m.history.push(snapshot(m, { today: today(), label: prev ? '仮の目的を書き直した' : '仮の目的を決めた', purpose })); persistM();
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
    <p><b>仮の目的</b>＝棚卸しで作る1文（「誰のために、何を使って、何を増やす人」）。棚卸しは、①手法カード（書く／選ぶ／当てはまり度）を好きな順に。やりたくないカードは飛ばす（数日かけてよい）→ ②自分の答えに星をつけて3つに絞る → ③残った自分の言葉で1文にする。当たっている必要はなく、3か月ごとに書き直す。目的は考えて決めるより、動きながら見つかる、という研究に沿っている。</p>
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
    <div class="syncline ${Sync.enabled() ? (Sync.last.ok ? 'ok' : 'ng') : 'ng'}">${Sync.enabled() ? `同期: ${esc(Sync.label())} ／ ${esc(Sync.cfg.lastAt ? Sync.cfg.lastAt.replace('T', ' ').slice(5, 16) : 'まだ')}${Sync.last.msg && !Sync.last.ok ? ` ／ ${esc(Sync.last.msg)}` : ''}` : `同期: 未接続${Sync.last.msg ? `（${esc(Sync.last.msg)}）` : '（Tailscale をオンにして開き直す）'}`}</div>
    ${db.purpose ? `<div class="purpose">仮の目的: ${esc(db.purpose.text)}</div>` : ''}
    <div class="gain">『${esc(s.direction.gain)}』のために <b>${s.totals.completions}</b> 回</div>
    <div class="sub">木の葉 ${leaves().length} 枚 ／ 戻ってきた回数 ${s.totals.returns}</div>
    <label class="switch"><input type="checkbox" id="shiftToggle" ${shift ? 'checked' : ''}> 今日は出番（1分の札だけ・通知なし・サボり扱いなし）</label>
  </header>
  ${db.ui?.welcomeBack ? `<div class="okaeri">おかえり。続きから。</div>` : ''}
  ${db.purpose && db.purpose.reviewOn <= today() ? `<section class="card q"><b>3か月たった。いまを記録して、仮の目的を見直す？</b><p class="why">棚卸しの「いまの状況」カードを更新して「いまを記録する」と、年表に1行増える。材料を見返して星をつけ直すと、文も変わる。いまの文のままでもよい。</p><div class="row"><button id="purposeReview">見返して書き直す</button><button class="ghost" id="purposeKeep">このままでいい（また3か月後）</button></div></section>` : ''}
  ${!db.purpose ? (() => { const pr = progress(m); return `<section class="card q"><b>仮の目的は、まだ無い</b><p class="why">「何のために」が無いと実験は続きにくい。棚卸し（材料を出す → 絞る → 1文）は、1日1〜2枚でよい。いま カード ${pr.cardsDone} / ${pr.cardsTotal} 枚・材料 ${pr.items} 個。</p><button id="openMonshin">${m.startedOn ? '棚卸しの続き' : '棚卸しをはじめる'}</button></section>`; })() : ''}
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
    ${m.history.length ? `<button class="ghost" id="openTimeline">年表を見る（記録 ${m.history.length} 回）</button>` : ''}
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
    <h3>同期（端末をまたぐ）</h3>
    <p class="why">あなたの Mac mini を橋にして、iPad・iPhone・Mac で同じデータにする。<b>合言葉は要らない</b>（Tailscale の網の中＝あなたの端末からしか届かない）。開いた時に取り込み、保存の3秒後に送る。<b>新しい方が勝つ</b>ので、1つの端末で操作してから別の端末を開く。Mac mini の AI も同じ場所を読むので、「AI に読ませる」のコピー＆貼りは不要になる（最長30分で「AI からの問い」が届く）。</p>
    ${Sync.enabled() ? `<p>つながっている: <b>${esc(Sync.label())}</b> ／ この端末の名前 ${esc(Sync.cfg.device)}<br><span class="small">最終同期 ${esc(Sync.cfg.lastAt ? Sync.cfg.lastAt.replace('T', ' ').slice(0, 16) : 'まだ')} ／ ${esc(Sync.last.msg || '—')}</span></p>
    ${Sync.ai ? `<p class="${Sync.ai.ok ? 'small' : 'why'}">AI 橋: ${Sync.ai.ok ? '正常' : '<b>止まっている</b>'} ／ ${esc(Sync.ai.msg)}<span class="small">（${esc(Sync.ai.at.replace('T', ' ').slice(0, 16))}・${esc(Sync.ai.auth)}）</span></p>` : ''}
    <div class="row"><button id="syncNow">今すぐ同期</button><button class="ghost" id="syncOff">外す（この端末だけ）</button></div>` : `
    <button class="primary" id="syncMacMini">Mac mini とつなぐ（合言葉なし）</button>
    <p class="small">つながらない時: この端末で Tailscale アプリがオン（接続中）になっているか確認。</p>
    <details><summary class="small">予備: GitHub の倉庫でつなぐ（合言葉が要る）</summary>
    <input id="syncRepo" placeholder="倉庫（owner/repo）" value="hidenaka/tefuda-data">
    <input id="syncToken" type="password" placeholder="合言葉（fine-grained PAT。tefuda-data だけ・Contents 読み書き）" autocomplete="off">
    <button id="syncOn">GitHub でつなぐ</button></details>`}
  </section>
  <section class="card">
    <h3>データ</h3>
    <p class="why"><b>データはこの端末の中だけ</b>（iPad で書いたものは iPhone には無い）。端末をまたぐ自動の同期は、次の段階（Mac mini と GitHub の橋）で作る。それまでは「書き出す」→ 別の端末の同じ欄に貼って「読み込む」で手で移す（木・図鑑・棚卸し・年表がまとめて入る）。<br>注意: iPad/iPhone では「ホーム画面に追加したアプリ」と「Safari で開いたページ」は別の保存場所。どちらか1つで使う。</p>
    <div class="row"><button id="exportBtn">書き出す（JSON）</button><button id="importBtn" class="ghost">読み込む</button></div>
    <textarea id="ioBox" rows="4" placeholder="ここに貼る／ここに出る"></textarea>
    <button class="danger" id="resetBtn">最初からやり直す</button>
  </section>
  <section class="card small">手札 v0.1（PWA）。設計書 v16.2。数字は端末が数え、AI は数字を推定しない。</section>`;
}

// ---------- 操作 ----------
function pollProfile() {
  clearInterval(profilePoll); const started = Date.now();
  profilePoll = setInterval(async () => {
    try {
      const st = await Sync.profileStatus();
      const p = await Sync.readProfile();
      if (p && !m.profiles.some(x => x.id === p.id)) { clearInterval(profilePoll); profileBusy = ''; m.profiles.push({ id: p.id, on: p.on, profile: p.profile }); m.phase = 'profile'; persistM(); flash = { text: `プロファイルができた（面${p.profile.facets.length}・可能性${p.profile.possibilities.length}）。`, kind: 'ok' }; render(); return; }
      if (st && !st.running && st.status && !st.status.ok) { clearInterval(profilePoll); profileBusy = ''; flash = { text: 'AI が失敗: ' + st.status.msg, kind: 'ng' }; render(); return; }
      if (Date.now() - started > 240000) { clearInterval(profilePoll); profileBusy = ''; flash = { text: '4分待ったが返事が無い。あとで「見る」を押すと届いていることがある。', kind: 'ng' }; render(); }
    } catch {}
  }, 5000);
}

function bindMonshin() {
  const go = phase => { m.phase = phase; persistM(); render(); };
  const openCard = id => { const c = cardOf(id); if (!c) return; m.cur = { methodId: id, idx: 0 }; if (c.kind === 'pick') go('pick'); else if (c.kind === 'rate') go('rate'); else go('write'); };
  $('#mClose') && ($('#mClose').onclick = closeMonshin);
  $('#mHome') && ($('#mHome').onclick = () => { if ($('#mAns')) saveAns(); go('home'); });
  document.querySelectorAll('[data-method]').forEach(b => b.onclick = e => { e.preventDefault(); openCard(b.dataset.method); });
  document.querySelectorAll('[data-unskip]').forEach(a => a.onclick = e => { e.preventDefault(); m.skipped = m.skipped.filter(x => x !== a.dataset.unskip); persistM(); render(); });
  $('#mSkipCard') && ($('#mSkipCard').onclick = () => { const id = m.cur.methodId; if (!m.skipped.includes(id)) m.skipped.push(id); flash = { text: `「${method(id).title}」を飛ばした（一覧で戻せる）`, kind: 'ok' }; go('home'); });
  $('#mToReview') && ($('#mToReview').onclick = () => go('review'));
  $('#mTimeline') && ($('#mTimeline').onclick = () => go('timeline'));
  $('#mProfileOpen') && ($('#mProfileOpen').onclick = () => go('profile'));
  $('#mOutline') && ($('#mOutline').onclick = () => go('outline'));
  document.querySelectorAll('[data-lvl]').forEach(b => b.onclick = () => { m.ui ??= {}; m.ui.profileLevel = b.dataset.lvl; persistM(); render(); });
  document.querySelectorAll('[data-vote]').forEach(b => b.onclick = () => { const k = b.dataset.vote; m.votes[k] = m.votes[k] === b.dataset.v ? undefined : b.dataset.v; if (m.votes[k] === undefined) delete m.votes[k]; persistM(); render(); });
  $('#mProfileMake') && ($('#mProfileMake').onclick = async () => {
    const dump = dumpForAI(m, { today: today(), purpose: db?.purpose ?? null, task: 'profile' });
    if (Sync.enabled() && Sync.cfg.mode === 'macmini') {
      try { const r = await Sync.requestProfile(dump); profileBusy = r.msg ?? '…'; flash = { text: 'Mac mini の AI が読み始めた。1〜2分で出る（この画面のままで待てる）。', kind: 'ok' }; render(); pollProfile(); }
      catch (e) { flash = { text: 'AI に頼めない: ' + e.message, kind: 'ng' }; render(); }
      return;
    }
    try { await navigator.clipboard.writeText(dump); } catch {}
    flash = { text: 'Mac mini とつながっていない。材料（プロファイル依頼つき）をコピーしたので、Claude Code に「/tefuda プロファイル」と書いて貼り、返事を下の欄に貼る。', kind: 'ng' }; render();
  });
  $('#mSnap') && ($('#mSnap').onclick = () => { const sn = snapshot(m, { today: today(), label: $('#mSnapLabel').value.trim(), purpose: db?.purpose ?? null }); m.history.push(sn); persistM(); flash = { text: `記録した（${m.history.length} 回目・${today()}）。`, kind: 'ok' }; go('timeline'); });
  $('#mWipe') && ($('#mWipe').onclick = () => {
    if (!confirm('答え・当てはまり度・大事な言葉・星・AI の問いを白紙にします。記録（年表）と飛ばしたカードは残ります。先に「いまを記録する」を押しましたか？')) return;
    const keep = { history: m.history, skipped: m.skipped, startedOn: m.startedOn };
    m = { ...M_INIT(), ...keep }; persistM(); flash = { text: '白紙にした。記録は年表に残っている。', kind: 'ok' }; go('home');
  });
  if ($('#mCopyDump')) {
    const dump = () => dumpForAI(m, { today: today(), purpose: db?.purpose ?? null });
    $('#mShowDump').onclick = () => { $('#mDumpBox').value = dump(); $('#mDumpBox').hidden = false; $('#mDumpBox').select(); };
    $('#mCopyDump').onclick = async () => {
      const t = dump();
      try { await navigator.clipboard.writeText(t); flash = { text: `コピーした（${t.length}字）。Claude に貼る。`, kind: 'ok' }; }
      catch { $('#mDumpBox').value = t; $('#mDumpBox').hidden = false; $('#mDumpBox').select(); flash = { text: 'コピーできない端末。下の文章を長押しでコピー。', kind: 'ng' }; }
      render();
    };
    $('#mReadReply').onclick = () => {
      const raw = $('#mReplyBox').value;
      if (/"facets"/.test(raw)) { const pr = parseProfile(raw); if (!pr.ok) { flash = { text: '読み込めない: ' + pr.error, kind: 'ng' }; render(); return; } m.profiles.push({ id: `prof:manual:${Date.now()}`, on: today(), profile: pr.profile }); persistM(); flash = { text: 'プロファイルを読み込んだ。', kind: 'ok' }; m.phase = 'profile'; render(); return; }
      const r = parseAIReply(raw);
      if (!r.ok) { flash = { text: '読み込めない: ' + r.error, kind: 'ng' }; render(); return; }
      m.ai.rounds.push({ ...r.round, on: today() }); persistM();
      flash = { text: `AI の返事を読み込んだ（${m.ai.rounds.length}回目）。${r.round.questions.length ? `問いが ${r.round.questions.length} つ増えた。` : ''}`, kind: 'ok' }; render();
    };
  }
  $('#mToCompose') && ($('#mToCompose').onclick = () => go('compose'));

  const saveAns = () => { const c = cardOf(m.cur.methodId); const q = c.items[m.cur.idx]; m.answers[q.id] = $('#mAns').value.replace(/\r/g, ''); persistM(); };
  if (m.phase === 'write') {
    const c = cardOf(m.cur.methodId);
    $('#mAns').oninput = () => { saveAns(); const n = $('#mAns').value.split('\n').filter(s => s.trim()).length; $('#mAns').nextElementSibling.textContent = `${n} 個`; };
    $('#mNext').onclick = () => { saveAns(); if (m.cur.idx >= c.items.length - 1) go('home'); else { m.cur.idx += 1; go('write'); } };
    $('#mBack').onclick = () => { saveAns(); if (m.cur.idx === 0) go('home'); else { m.cur.idx -= 1; go('write'); } };
  }

  if (m.phase === 'rate') {
    const c = method(m.cur.methodId);
    m.rates[c.id] ??= {};
    document.querySelectorAll('[data-rate]').forEach(b => b.onclick = () => {
      const id = b.dataset.rate, n = Number(b.dataset.n);
      m.rates[c.id][id] = m.rates[c.id][id] === n ? undefined : n;
      if (m.rates[c.id][id] === undefined) delete m.rates[c.id][id];
      persistM();
      const row = b.parentElement; row.querySelectorAll('.rb').forEach(x => x.classList.toggle('on', x === b && m.rates[c.id][id] === n));
      const answered = rateItems(c, m).filter(i => m.rates[c.id][i.id] != null).length;
      const p = row.parentElement.parentElement.querySelector('p.small.rateSum'); const sum = answered ? rateSummary(c, m.rates[c.id], m) : null;
      p.innerHTML = `答えた ${answered} / ${rateItems(c, m).length}${sum ? `<br>${esc(sum)}` : ''}`;
    });
    document.querySelectorAll('[data-rewrite]').forEach(b => b.onclick = () => {
      const id = b.dataset.rewrite; const cur = rateItems(c, m).find(i => i.id === id);
      const t = prompt('自分の言葉で言い換える（空にすると元に戻す）', cur.text); if (t === null) return;
      if (cur.custom) { const x = (m.customItems[c.id] ?? []).find(i => i.id === id); if (x) x.text = t.trim() || x.text; }
      else { m.rewrite[c.id] ??= {}; if (t.trim()) m.rewrite[c.id][id] = t.trim(); else delete m.rewrite[c.id][id]; }
      persistM(); render();
    });
    $('#mRateAdd').onclick = () => { const t = $('#mRateCustom').value.trim(); if (!t) return; m.customItems[c.id] ??= []; m.customItems[c.id].push({ id: 'c' + newId('x').slice(2, 8), text: t }); persistM(); render(); };
    $('#mRateDone').onclick = () => go('home');
  }

  if (m.phase === 'pick') {
    const c = cardOf(m.cur.methodId);
    const ps = pickState(m, c.id); const step = ps.step; const limit = c.steps[step]; const last = c.steps.length - 1;
    const save = () => { m.picks[c.id] = ps; persistM(); };
    document.querySelectorAll('[data-val]').forEach(b => b.onclick = () => {
      const w = b.dataset.val; const picked = ps.picks[step]; const i = picked.indexOf(w);
      if (i >= 0) picked.splice(i, 1); else if (picked.length < limit) picked.push(w); else { flash = { text: `${limit}個まで。外してから足す。`, kind: 'ng' }; }
      save(); render();
    });
    $('#mAddCustom') && ($('#mAddCustom').onclick = () => { const w = $('#mCustom').value.trim(); if (!w || pickOptions(m, c.id).includes(w)) return; ps.custom.push(w); if (ps.picks[0].length < limit) ps.picks[0].push(w); save(); render(); });
    $('#mValNext').onclick = () => {
      if (step < last) { ps.step = step + 1; ps.picks[step + 1] = ps.picks[step + 1].filter(w => ps.picks[step].includes(w)); save(); go('pick'); }
      else { ps.step = 0; save(); go('home'); }
    };
    $('#mValBack').onclick = () => { if (step === 0) go('home'); else { ps.step = step - 1; save(); go('pick'); } };
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
    document.querySelectorAll('[data-cand]').forEach(b => b.onclick = () => { readSlots(); const c = latestRound(m).candidates[Number(b.dataset.cand)]; m.slots.who = c.who; m.slots.use = c.use; m.slots.grow = c.grow; m.finalText = c.text; persistM(); render(); });
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
  $('#purposeReview') && ($('#purposeReview').onclick = () => openMonshin(itemsFrom(m).length ? 'review' : 'home'));
  $('#openMonshin') && ($('#openMonshin').onclick = () => openMonshin('home'));
  $('#openTimeline') && ($('#openTimeline').onclick = () => openMonshin('timeline'));
  $('#purposeKeep') && ($('#purposeKeep').onclick = () => { db.purpose.reviewOn = addDays(today(), REVIEW_DAYS); persist(); flash = { text: 'このまま。次は3か月後。', kind: 'ok' }; render(); });
  $('#purposeSet') && ($('#purposeSet').onclick = () => {
    const text = $('#purposeText').value.trim(); if (!text) return;
    const prev = db.purpose;
    db.purpose = { ...(prev ?? { directionId: s.direction.id, gainIndex: 0, gain: s.direction.gain, answers: {}, candidates: [], history: [] }), text, decidedOn: today(), reviewOn: addDays(today(), REVIEW_DAYS),
      history: [...(prev?.history ?? []), ...(prev ? [{ text: prev.text, on: prev.decidedOn }] : [])] };
    persist(); flash = { text: '仮の目的を置いた。', kind: 'ok' }; tab = 'today'; render();
  });
  $('#mitateSet') && ($('#mitateSet').onclick = () => { const r = setMitate(s, $('#mitateText').value.trim()); if (!r.ok) { flash = { text: r.reason, kind: 'ng' }; render(); return; } db.state = r.state; persist(); flash = { text: '見立てを置いた。', kind: 'ok' }; render(); });
  // 書き出しは 本体(db) と 棚卸し(m) をまとめて1つに。読み込みは新旧どちらの形も受ける
  $('#syncMacMini') && ($('#syncMacMini').onclick = async () => {
    Sync.configureMacMini();
    try { await Sync.health(); } catch (e) { Sync.disconnect(); flash = { text: 'つなげない: ' + e.message, kind: 'ng' }; render(); return; }
    const r = await Sync.pull();
    if (r === null) { Sync.disconnect(); flash = { text: 'つなげない: ' + Sync.last.msg, kind: 'ng' }; render(); return; }
    if (!r.took) Sync.schedulePush();
    flash = { text: r.took ? 'Mac mini の方が新しかったので取り込んだ。' : 'Mac mini とつながった。この端末の内容を送る。', kind: 'ok' }; render();
  });
  $('#syncOn') && ($('#syncOn').onclick = async () => {
    const repo = $('#syncRepo').value.trim(), token = $('#syncToken').value.trim();
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo) || token.length < 20) { flash = { text: '倉庫名か合言葉が空・短い。', kind: 'ng' }; render(); return; }
    Sync.configureGitHub({ repo, token });
    const r = await Sync.pull();
    if (r === null) { Sync.disconnect(); flash = { text: 'つなげない: ' + Sync.last.msg, kind: 'ng' }; render(); return; }
    if (!r.took) Sync.schedulePush();
    flash = { text: r.took ? '倉庫の方が新しかったので取り込んだ。' : 'つながった。この端末の内容を送る。', kind: 'ok' }; render();
  });
  $('#syncNow') && ($('#syncNow').onclick = async () => { const r = await Sync.pull(); if (r && !r.took) await Sync.push(); flash = { text: Sync.last.msg, kind: Sync.last.ok ? 'ok' : 'ng' }; render(); });
  $('#syncOff') && ($('#syncOff').onclick = () => { if (confirm('この端末の同期を外します。データは残ります。')) { Sync.disconnect(); render(); } });
  $('#exportBtn') && ($('#exportBtn').onclick = async () => {
    const t = JSON.stringify({ tefuda: 1, exportedOn: today(), db, monshin: m });
    $('#ioBox').value = t; $('#ioBox').select();
    try { await navigator.clipboard.writeText(t); flash = { text: `コピーした（${t.length}字）。別の端末の同じ欄に貼って「読み込む」。`, kind: 'ok' }; render(); $('#ioBox').value = t; } catch {}
  });
  $('#importBtn') && ($('#importBtn').onclick = () => {
    try {
      const d = JSON.parse($('#ioBox').value);
      const newDb = d.tefuda ? d.db : d;
      if (!newDb?.state || !newDb?.cards) throw new Error();
      if (!confirm('この端末のデータを、貼った内容で置き換えます（木・図鑑・棚卸し・年表も）。よいですか？')) return;
      db = newDb; persist();
      if (d.tefuda && d.monshin) { m = { ...M_INIT(), ...d.monshin, cur: { methodId: null, idx: 0 }, phase: 'home' }; persistM(); }
      flash = { text: `読み込んだ（${d.exportedOn ? d.exportedOn + ' の書き出し' : '旧形式'}）。`, kind: 'ok' }; render();
    } catch { flash = { text: '読み込めない JSON', kind: 'ng' }; render(); }
  });
  $('#resetBtn') && ($('#resetBtn').onclick = () => { if (confirm('本当に最初から？ 木も図鑑も棚卸しも消えます。')) { localStorage.removeItem('tefuda.v1'); localStorage.removeItem(M_KEY); db = null; m = M_INIT(); render(); } });
}

Sync.init({
  getLocal: () => ({ updatedAt: meta.updatedAt ?? null, db, monshin: m, hasContent: !!db || monshinHasContent(m) }),
  setLocal: remote => {
    if (remote.db?.state && remote.db?.cards) { db = remote.db; saveDb(db); }
    if (remote.monshin) { m = { ...M_INIT(), ...remote.monshin, cur: { methodId: null, idx: 0 }, phase: 'home' }; try { localStorage.setItem(M_KEY, JSON.stringify(m)); } catch {} }
    meta.updatedAt = remote.updatedAt; meta.sig = contentSignature(db, m); try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch {}
    inMonshin = false; render();
  },
  getDump: () => (progress(m).items || m.ai.rounds.length ? dumpForAI(m, { today: today(), purpose: db?.purpose ?? null }) : ''),
  onAIReply: reply => {
    const r = reply?.round ? { ok: true, round: reply.round } : parseAIReply(JSON.stringify(reply));
    if (!r.ok) return false;
    m.ai.rounds.push({ ...r.round, on: reply.on ?? today(), auto: true }); persistM();
    flash = { text: `Mac mini の AI から返事が届いた（${m.ai.rounds.length}回目）。棚卸しに「AI からの問い」が増えた。`, kind: 'ok' }; render();
    return true;
  },
  onStatus: () => { if ((tab === 'settings' || tab === 'today') && !inMonshin) render(); },
});
render();
(async () => { if (!Sync.enabled() && await Sync.autoConnect()) { const r = await Sync.pull(); if (r && !r.took) Sync.schedulePush(); flash = { text: r?.took ? 'Mac mini にあった方が新しいので取り込んだ。' : 'Mac mini と自動でつながった。この端末の内容を送る。', kind: 'ok' }; render(); } })();
if (Sync.enabled()) Sync.pull({ quiet: true }).then(async () => { try { const p = await Sync.readProfile(); if (p && !m.profiles.some(x => x.id === p.id)) { m.profiles.push({ id: p.id, on: p.on, profile: p.profile }); persistM(); } } catch {} });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});

})();