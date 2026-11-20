// ============================================================
//  Practice: spaced-repetition flashcards, quizzes,
//  timeline ordering game, "history or tradition?" drill
// ============================================================
const SRS_INTERVALS = [0, 10 * 60e3, 864e5, 3 * 864e5, 7 * 864e5, 16 * 864e5, 35 * 864e5];

const card = it => ({
  term:     { front: it.term, back: it.def },
  person:   { front: it.name, back: it.role, sub: it.text },
  place:    { front: it.name, back: it.text },
  timeline: { front: it.title, back: it.year, sub: it.text },
  saying:   { front: `"${it.text}"`, back: it.meaning, sub: it.note },
}[it.type]);

const DECKS = {
  term:     { name: 'Key words', icon: '📖' },
  person:   { name: 'People', icon: '👥' },
  place:    { name: 'Places', icon: '📍' },
  timeline: { name: 'Timeline', icon: '🕰️' },
  saying:   { name: 'Sayings', icon: '🪔' },
};

const Practice = {
  sub: 'cards',
  dueCount() { const now = Date.now(); return Object.values(Store.data.srs).filter(c => c.due <= now).length; },
  seedFromLesson(l) {
    const srs = Store.data.srs, now = Date.now();
    Lessons.itemIds(l).forEach(id => { if (ITEMS[id] && !srs[id]) srs[id] = { box: 0, due: now }; });
    Store.save();
  },
  render(el, [sub]) {
    this.sub = sub || this.sub;
    const tabs = [['cards', '🃏 Flashcards'], ['quiz', '❓ Quizzes'], ['order', '🧩 Timeline order'], ['histtrad', '🔍 History or tradition?']];
    el.innerHTML = `<h1>Practice</h1><div class="subtabs">${tabs.map(([k, n]) => `<button data-sub="${k}" class="${k === this.sub ? 'active' : ''}">${n}</button>`).join('')}</div><div id="prac"></div>`;
    $$('.subtabs button', el).forEach(b => b.onclick = () => location.hash = '#/practice/' + b.dataset.sub);
    const p = $('#prac', el);
    ({ cards: () => this.cards(p), quiz: () => this.quizMenu(p), order: () => this.order(p), histtrad: () => this.histTrad(p) }[this.sub] || (() => this.cards(p)))();
  },

  // ---------- Flashcards ----------
  cards(p) {
    const srs = Store.data.srs, now = Date.now();
    p.innerHTML = `<div class="card tip" style="margin-bottom:16px">💡 <b>How it works:</b> read the front, try to recall the answer <em>before</em> flipping, then rate yourself honestly. Hard cards come back sooner; easy ones later.</div>
      <div class="grid g3">${Object.entries(DECKS).map(([k, d]) => {
        const items = QGen.pool(k), due = items.filter(i => srs[i.id] && srs[i.id].due <= now).length, fresh = items.filter(i => !srs[i.id]).length, learned = items.filter(i => srs[i.id] && srs[i.id].box >= 3).length;
        return `<div class="card click" data-deck="${k}"><div class="row"><span style="font-size:1.6rem">${d.icon}</span><b>${d.name}</b></div>
          <div class="progress" style="margin:12px 0 8px"><div style="width:${learned / items.length * 100}%"></div></div>
          <div class="row" style="font-size:.85rem">${due ? `<span class="pill next">${due} due</span>` : ''}${fresh ? `<span class="pill">${fresh} new</span>` : ''}<span class="dim">${learned}/${items.length} learned</span></div></div>`;
      }).join('')}</div>`;
    $$('[data-deck]', p).forEach(c => c.onclick = () => this.session(p, c.dataset.deck));
  },
  session(p, type) {
    const srs = Store.data.srs, now = Date.now(), d = DECKS[type], all = QGen.pool(type);
    let queue = [...shuffle(all.filter(c => srs[c.id] && srs[c.id].due <= now)), ...all.filter(c => !srs[c.id]).slice(0, 8)];
    if (!queue.length) queue = shuffle(all).slice(0, 10);
    let reviewed = 0;
    const show = () => {
      if (!queue.length) {
        p.innerHTML = `<div class="card" style="text-align:center;padding:40px"><div style="font-size:3rem">🎉</div><h2>Session complete!</h2><p class="muted">You reviewed ${reviewed} cards. Come back later for more.</p><button class="btn primary" id="back">Back to decks</button></div>`;
        $('#back').onclick = () => this.cards(p); return;
      }
      const it = queue[0], c = card(it);
      p.innerHTML = `<div class="row" style="max-width:460px;margin:0 auto 12px"><button class="btn ghost sm" id="back">← Decks</button><span class="spacer"></span><span class="muted">${d.icon} ${d.name} · ${queue.length} left</span></div>
        <div class="flash" id="flash"><div class="flash-inner">
          <div class="flash-face flash-front"><div class="big-text">${esc(c.front)}</div><div class="dim" style="margin-top:14px">Recall the answer, then tap to flip</div></div>
          <div class="flash-face flash-back"><div class="muted" style="font-size:.9rem">${esc(c.front)}</div><div class="r" style="font-size:1.3rem;margin:8px 0">${esc(c.back)}</div>${c.sub ? `<div class="muted" style="font-size:.88rem">${esc(c.sub)}</div>` : ''}</div>
        </div></div>
        <div class="rate" id="rate" style="visibility:hidden"><button class="btn again" data-r="0">😕 Again</button><button class="btn good" data-r="1">🙂 Good</button><button class="btn easy" data-r="2">😎 Easy</button></div>
        <p class="dim" style="text-align:center;font-size:.85rem">Keyboard: Space = flip · 1 / 2 / 3 = rate</p>`;
      $('#back').onclick = () => { this.cleanup(); this.cards(p); };
      const flip = () => { $('#flash').classList.add('flipped'); $('#rate').style.visibility = 'visible'; };
      $('#flash').onclick = flip;
      const rate = r => {
        const s = srs[it.id] || { box: 0, due: 0 };
        s.box = r === 0 ? 0 : Math.min(SRS_INTERVALS.length - 1, s.box + r);
        s.due = Date.now() + (r === 0 ? 60e3 : SRS_INTERVALS[s.box]); srs[it.id] = s;
        Store.stat(it.id, r > 0); Store.addXP(1); reviewed++;
        queue.shift(); if (r === 0) queue.splice(Math.min(3, queue.length), 0, it);
        show();
      };
      $$('#rate button').forEach(b => b.onclick = () => rate(+b.dataset.r));
      this.cleanup();
      this._key = e => { if (e.key === ' ') { e.preventDefault(); flip(); } else if ($('#flash')?.classList.contains('flipped') && '123'.includes(e.key)) rate(+e.key - 1); };
      document.addEventListener('keydown', this._key);
    };
    show();
  },
  cleanup() { if (this._key) document.removeEventListener('keydown', this._key); this._key = null; },

  // ---------- Quizzes ----------
  quizMenu(p) {
    const modes = [
      ['mixed', '🎲', 'Mixed review', 'A bit of everything'],
      ['weak', '🎯', 'My weak spots', 'Questions you\'ve missed most'],
      ...Object.entries(DECKS).map(([k, d]) => [k, d.icon, d.name, `Quiz on ${d.name.toLowerCase()}`]),
      ['stories', '📖', 'Story details', 'Questions from the famous stories'],
    ];
    p.innerHTML = `<div class="grid g3">${modes.map(([k, i, n, s]) => `<div class="card click" data-q="${k}"><div style="font-size:1.6rem">${i}</div><b>${esc(n)}</b><div class="muted" style="font-size:.88rem">${esc(s)}</div></div>`).join('')}</div>`;
    $$('[data-q]', p).forEach(c => c.onclick = () => this.startQuiz(p, c.dataset.q, modes));
  },
  startQuiz(p, k, modes) {
    let qs;
    const allIds = Object.keys(ITEMS);
    if (k === 'mixed') qs = QGen.ids(allIds, 10);
    else if (k === 'weak') { const st = Store.data.stats; qs = QGen.ids(allIds.map(id => [id, ((st[id] || {}).w || 0) + 1, ((st[id] || {}).c || 0) + 2]).sort((a, b) => b[1] / b[2] - a[1] / a[2]).slice(0, 10).map(x => x[0])); }
    else if (k === 'stories') qs = QGen.fixed(LESSONS.filter(l => Array.isArray(l.quiz) && l.unit.includes('Stories')).flatMap(l => l.quiz)).slice(0, 10);
    else qs = QGen.type(k, 10);
    Quiz.run(p, qs, { title: modes.find(m => m[0] === k)[2], onDone: (s, t, a) => {
      a.innerHTML = `<button class="btn primary" id="again">↻ Another round</button><button class="btn" id="menu">All quizzes</button>`;
      $('#again').onclick = () => this.startQuiz(p, k, modes); $('#menu').onclick = () => this.quizMenu(p);
    }});
  },

  // ---------- Timeline ordering game ----------
  order(p) {
    // one event per year so the correct order is never ambiguous
    const events = pick(Object.values(Object.fromEntries(shuffle(TIMELINE).map(t => [Math.floor(t.sort), t]))), 5);
    const correct = [...events].sort((a, b) => a.sort - b.sort);
    let placed = [];
    const draw = () => {
      p.innerHTML = `<div class="quiz-wrap"><div class="card tip" style="margin-bottom:16px">🧩 Tap the events in the order they happened — earliest first. Tap a numbered one to undo.</div>
        <div class="card"><div class="order-list">${events.map(e => { const n = placed.indexOf(e); return `<button class="order-item ${n >= 0 ? 'placed' : ''}" data-id="${e.id}"><span class="num">${n >= 0 ? n + 1 : ''}</span><span><b>${esc(e.title)}</b></span></button>`; }).join('')}</div>
        <div class="feedback" id="ord-fb"></div>
        <div class="row" style="justify-content:center"><button class="btn primary" id="ord-check" ${placed.length < events.length ? 'disabled' : ''}>Check order</button><button class="btn" id="ord-new">New set</button></div></div></div>`;
      $$('.order-item', p).forEach(b => b.onclick = () => { const e = events.find(x => x.id === b.dataset.id), n = placed.indexOf(e); if (n >= 0) placed = placed.slice(0, n); else placed.push(e); draw(); });
      $('#ord-new').onclick = () => this.order(p);
      $('#ord-check').onclick = () => {
        const right = placed.filter((e, i) => e === correct[i]).length, ok = right === events.length;
        $('#ord-fb').className = 'feedback ' + (ok ? 'ok' : 'bad');
        $('#ord-fb').innerHTML = (ok ? '🏆 Perfect order! +8 XP' : `${right} of ${events.length} in the right place. Correct order:`) +
          `<div style="text-align:left;margin-top:10px;font-weight:400">${correct.map((e, i) => `<div class="muted">${i + 1}. <b style="color:var(--saffron2)">${esc(e.year)}</b> — ${esc(e.title)}</div>`).join('')}</div>`;
        Store.addXP(ok ? 8 : 2); correct.forEach((e, i) => Store.stat(e.id, placed[i] === e));
        $('#ord-check').disabled = true;
      };
    };
    draw();
  },

  // ---------- History or tradition? ----------
  histTrad(p) {
    const qs = pick(TIMELINE, 8).map(t => ({
      ask: 'Is this a documented historical fact, or a story from devotional tradition?',
      prompt: `<b>${esc(t.year)}</b> — ${esc(t.title)}<div class="muted" style="font-size:.95rem;font-weight:400;margin-top:8px">${esc(t.text)}</div>`,
      opts: ['📜 History', '🪔 Tradition'], a: t.kind === 'hist' ? 0 : 1,
      explain: t.kind === 'hist' ? 'This is documented or broadly agreed by historians.' : 'This comes mainly from devotional accounts such as the Satcharitra. It is meaningful to devotees, but not independently documented.',
    }));
    Quiz.run(p, qs, { title: 'History or tradition?', onDone: (s, t, a) => { a.innerHTML = `<button class="btn primary" id="again">↻ Again</button>`; $('#again').onclick = () => this.histTrad(p); } });
  },
};
