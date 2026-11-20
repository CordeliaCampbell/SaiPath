// ============================================================
//  Sai Path core: state & saving, routing, quiz engine,
//  Home / Lessons / Timeline / Teachings / People / Progress
// ============================================================
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = () => new Date().toISOString().slice(0, 10);
const kindPill = k => k === 'hist' ? '<span class="pill badge-hist">History</span>' : '<span class="pill badge-trad">Tradition</span>';

// ---------------- State (auto-saved to progress.json via server.py) ----------------
const Store = {
  key: 'sai-path-v1', data: null, server: false,
  defaults: () => ({ xp: 0, streak: 0, lastDay: null, days: {}, lessons: {}, srs: {}, stats: {}, journal: [], goal: 30, lastRoute: null, updatedAt: 0 }),
  async load() {
    let local = {}, remote = null;
    try { local = JSON.parse(localStorage.getItem(this.key)) || {}; } catch {}
    try { const r = await fetch('/api/progress', { cache: 'no-store' }); if (r.ok) { remote = await r.json(); this.server = true; } } catch {}
    const best = remote && (remote.updatedAt || 0) >= (local.updatedAt || 0) ? remote : local;
    this.data = Object.assign(this.defaults(), best);
    if (this.server && best === local && local.updatedAt) this.flush();
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch {}
  },
  save() {
    this.data.updatedAt = Date.now();
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch {}
    if (!this.server) return;
    App.saveState('saving'); clearTimeout(this._st); this._st = setTimeout(() => this.flush(), 400);
  },
  async flush() {
    clearTimeout(this._st);
    try { const r = await fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.data) }); App.saveState(r.ok ? 'saved' : 'error'); }
    catch { App.saveState('error'); }
  },
  beacon() { if (this.server && this._st) { clearTimeout(this._st); navigator.sendBeacon('/api/progress', new Blob([JSON.stringify(this.data)], { type: 'application/json' })); } },
  replace(obj) { this.data = Object.assign(this.defaults(), obj); this.save(); },
  addXP(n) {
    const d = this.data, t = today();
    if (d.lastDay !== t) { const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); d.streak = d.lastDay === y ? d.streak + 1 : 1; d.lastDay = t; }
    d.xp += n; d.days[t] = (d.days[t] || 0) + n; this.save(); App.updateHeader();
  },
  stat(key, ok) { const s = this.data.stats[key] || (this.data.stats[key] = { c: 0, w: 0 }); ok ? s.c++ : s.w++; this.save(); },
};

// ---------------- Quiz engine ----------------
const Quiz = {
  run(el, questions, { title = 'Quiz', onDone, xpPer = 2 } = {}) {
    let i = 0, score = 0;
    const render = () => {
      if (i >= questions.length) return finish();
      const q = questions[i];
      el.innerHTML = `<div class="quiz-wrap">
        <div class="row"><b>${esc(title)}</b><span class="spacer"></span><span class="muted">${i + 1} / ${questions.length}</span></div>
        <div class="progress" style="margin:10px 0 16px"><div style="width:${(i / questions.length) * 100}%"></div></div>
        <div class="card quiz-q">
          ${q.ask ? `<div class="muted" style="margin-bottom:8px">${q.ask}</div>` : ''}
          <div class="quiz-prompt text">${q.prompt}</div>
          <div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${o}</button>`).join('')}</div>
          <div class="feedback"></div>
          <div class="row" style="justify-content:center;margin-top:6px"><button class="btn primary next-q" style="visibility:hidden">Next →</button></div>
        </div></div>`;
      $$('.opt', el).forEach(b => b.onclick = () => {
        const ok = +b.dataset.k === q.a;
        $$('.opt', el).forEach(x => x.disabled = true);
        b.classList.add(ok ? 'correct' : 'wrong'); $$('.opt', el)[q.a].classList.add('correct');
        const fb = $('.feedback', el); fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = ok ? pick(['✅ Correct!', '🌟 Well done!', '✅ Exactly right!'], 1)[0] : `❌ The answer is: ${q.opts[q.a]}`;
        if (q.explain) fb.innerHTML += `<div class="muted" style="font-weight:400;font-size:.9rem;margin-top:6px">${q.explain}</div>`;
        if (ok) { score++; Store.addXP(xpPer); }
        if (q.key) Store.stat(q.key, ok);
        const nb = $('.next-q', el); nb.style.visibility = 'visible'; nb.focus(); nb.onclick = () => { i++; render(); };
      });
    };
    const finish = () => {
      const pct = Math.round(score / questions.length * 100);
      el.innerHTML = `<div class="quiz-wrap"><div class="card" style="text-align:center;padding:36px">
        <div style="font-size:3.4rem">${pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
        <h2>${pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good work!' : 'Keep going — saburi!'}</h2>
        <p class="muted">You got <b>${score}</b> of <b>${questions.length}</b> correct (${pct}%).</p>
        <div class="row" style="justify-content:center" id="quiz-done-actions"></div></div></div>`;
      onDone && onDone(score, questions.length, $('#quiz-done-actions', el));
    };
    render();
  },
};

// ---------------- Question generation ----------------
const QGen = {
  pool(type) { return Object.values(ITEMS).filter(x => x.type === type); },
  item(id) {
    const it = ITEMS[id], others = pick(this.pool(it.type).filter(x => x.id !== id), 3), all = shuffle([it, ...others]);
    const a = all.indexOf(it), rev = Math.random() < 0.5;
    switch (it.type) {
      case 'term': return rev
        ? { ask: 'Which word matches this meaning?', prompt: esc(it.def), opts: all.map(x => esc(x.term)), a, key: id }
        : { ask: 'What does this word mean?', prompt: esc(it.term), opts: all.map(x => esc(x.def)), a, key: id };
      case 'person': return rev
        ? { ask: 'Who is this?', prompt: esc(it.text), opts: all.map(x => esc(x.name)), a, key: id }
        : { ask: 'What is this person known for?', prompt: esc(it.name), opts: all.map(x => esc(x.role)), a, key: id, explain: esc(it.text) };
      case 'place': return { ask: 'Which place is this?', prompt: esc(it.text.replace(new RegExp(it.name, 'g'), '___')), opts: all.map(x => esc(x.name)), a, key: id };
      case 'saying': return { ask: 'What does this saying mean?', prompt: `"${esc(it.text)}"`, opts: all.map(x => esc(x.meaning)), a, key: id, explain: esc(it.note) };
      case 'timeline': {
        const yrs = shuffle([it, ...pick(this.pool('timeline').filter(x => x.year !== it.year), 3)]);
        return rev
          ? { ask: `What happened in ${esc(it.year)}?`, prompt: esc(it.year), opts: yrs.map(x => esc(x.title)), a: yrs.indexOf(it), key: id, explain: esc(it.text) }
          : { ask: 'When did this happen?', prompt: esc(it.title), opts: yrs.map(x => esc(x.year)), a: yrs.indexOf(it), key: id, explain: esc(it.text) };
      }
    }
  },
  ids(ids, n) { return pick(ids, n || ids.length).map(id => this.item(id)); },
  type(type, n = 10) { return this.ids(this.pool(type).map(x => x.id), Math.min(n, this.pool(type).length)); },
  fixed(list) {
    return shuffle(list).map(q => { const o = shuffle(q.opts.map((t, i) => ({ t, i }))); return { prompt: esc(q.q), opts: o.map(x => esc(x.t)), a: o.findIndex(x => x.i === q.a) }; });
  },
};

// ---------------- App ----------------
const App = {
  async start() {
    await Store.load();
    this.saveState(Store.server ? 'saved' : 'local');
    window.addEventListener('pagehide', () => Store.beacon());
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') Store.beacon(); });
    $$('#tabs button').forEach(b => b.onclick = () => location.hash = '#/' + b.dataset.tab);
    $('.brand').onclick = () => location.hash = '#/home';
    $('#modal').onclick = e => { if (e.target.id === 'modal') App.closeModal(); };
    document.addEventListener('keydown', e => { if (e.key === 'Escape') App.closeModal(); });
    window.addEventListener('hashchange', () => this.route());
    this.updateHeader(); this.route();
  },
  views() { return { home: Home, lessons: Lessons, timeline: Timeline, teachings: Teachings, people: People, practice: Practice, reflect: Reflect, progress: Progress }; },
  route() {
    const [tab = 'home', ...rest] = location.hash.replace(/^#\/?/, '').split('/');
    const views = this.views(), V = views[tab] || Home;
    $$('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === (views[tab] ? tab : 'home')));
    Practice.cleanup();
    const route = location.hash.replace(/^#\/?/, '');
    if (views[tab] && !['home', 'progress'].includes(tab) && Store.data.lastRoute !== route) { Store.data.lastRoute = route; Store.save(); }
    const view = $('#view'); view.innerHTML = '';
    V.render(view, rest.map(decodeURIComponent)); window.scrollTo(0, 0);
  },
  routeLabel(r) {
    const [tab, a] = (r || '').split('/');
    if (tab === 'lessons' && a) { const l = LESSONS.find(x => x.id === a); return l ? `${l.icon} Lesson: ${l.title}` : null; }
    return { lessons: '📚 Lessons', timeline: '🕰️ Timeline', teachings: '🪔 Teachings', people: '👥 People & Places', practice: '🎯 Practice', reflect: '📝 Reflect' }[tab] || null;
  },
  saveState(s) {
    const el = $('#save-state'); if (!el) return;
    const map = { saving: ['⏳', 'Saving…'], saved: ['✅', 'Progress saved to your computer'], error: ['⚠️', 'Could not reach the save server — progress is kept in this browser for now'], local: ['💾', 'Saved in this browser only (start the app with server.py to save to a file)'] };
    const [icon, title] = map[s]; el.textContent = icon; el.title = title;
  },
  updateHeader() { $('#xp').textContent = Store.data.xp; $('#streak').textContent = Store.data.streak; },
  toast(msg, ms = 2600) { const t = $('#toast'); t.innerHTML = msg; t.classList.add('show'); clearTimeout(this._t); this._t = setTimeout(() => t.classList.remove('show'), ms); },
  modal(html) { $('#modal-card').innerHTML = html; $('#modal').classList.remove('hidden'); },
  closeModal() { $('#modal').classList.add('hidden'); },
};

const dailyIndex = n => Math.floor(Date.now() / 864e5) % n;

// ---------------- Home ----------------
const Home = {
  render(el) {
    const d = Store.data, done = LESSONS.filter(l => d.lessons[l.id]).length, next = LESSONS.find(l => !d.lessons[l.id]);
    const todayXP = d.days[today()] || 0, due = Practice.dueCount();
    const s = SAYINGS[dailyIndex(SAYINGS.length)], resume = App.routeLabel(d.lastRoute);
    el.innerHTML = `
      <section class="hero">
        <div class="big-gu">साई</div>
        <p class="pill next" style="margin-bottom:12px">Beginner friendly · no background needed</p>
        <h1>Welcome to <span style="color:var(--saffron2)">Sai Path</span></h1>
        <p class="muted" style="max-width:580px">Discover the life, stories and teachings of Sai Baba of Shirdi — the fakir who taught faith, patience, and that one God is master of all. Short lessons, real stories, and quiet reflection.</p>
        <div class="row" style="margin-top:16px">
          ${resume ? `<a class="btn teal" href="#/${d.lastRoute}">↩ Pick up where you left off: ${esc(resume)}</a>` : ''}
          ${next ? `<a class="btn primary" href="#/lessons/${next.id}">▶ ${done ? 'Continue' : 'Start'}: ${esc(next.title)}</a>` : `<a class="btn primary" href="#/practice">🎯 Keep practicing</a>`}
          <a class="btn" href="#/practice">🃏 Review cards ${due ? `<span class="pill next">${due} due</span>` : ''}</a>
        </div>
      </section>
      <div class="grid g3" style="margin-top:18px">
        <div class="card stat"><div class="n">🔥 ${d.streak}</div><div class="l">day streak</div></div>
        <div class="card stat"><div class="n">${done}<span class="dim" style="font-size:1rem"> / ${LESSONS.length}</span></div><div class="l">lessons completed</div></div>
        <div class="card"><div class="row"><b>Today's goal</b><span class="spacer"></span><span class="muted">${todayXP} / ${d.goal} XP</span></div>
          <div class="progress" style="margin-top:12px"><div style="width:${Math.min(100, todayXP / d.goal * 100)}%"></div></div>
          <p class="dim" style="margin:8px 0 0;font-size:.85rem">${todayXP >= d.goal ? '🎉 Goal reached!' : 'Earn XP from lessons, quizzes, cards and reflections.'}</p></div>
      </div>
      <div class="card quote-card" style="margin-top:16px"><div class="dim" style="font-size:.8rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">Saying of the day</div>
        <div class="quote">"${esc(s.text)}"</div><div class="attrib">${esc(s.meaning)} — ${esc(s.note)}</div>
        <div class="row" style="margin-top:12px"><a class="btn sm" href="#/reflect">📝 Reflect on today's prompt</a></div></div>
      <div class="section-title"><h2>Your path</h2><a href="#/lessons">All lessons →</a></div>
      <div class="grid g3">
        ${[['🌳', 'Meet Sai Baba', 'Who he was, how he arrived in Shirdi, and life at Dwarkamai.', '#/lessons/who'],
           ['🪔', 'Learn his teachings', 'Shraddha & saburi, Sabka Malik Ek, and seeing God in all beings.', '#/lessons/faith'],
           ['📖', 'Hear the stories', 'Lamps lit with water, grinding wheat, the hand in the fire.', '#/lessons/lamps']]
          .map(([i, t, s, h]) => `<a class="card click" href="${h}" style="text-decoration:none;color:inherit"><div style="font-size:1.8rem">${i}</div><h3>${t}</h3><p class="muted" style="margin:0">${s}</p></a>`).join('')}
      </div>
      <div class="section-title"><h2>How this app teaches</h2></div>
      <div class="grid g2">
        <div class="card"><ul class="tip-list" style="margin:0;padding-left:18px">
          <li><b>Stories first.</b> Sai Baba taught through stories, and stories are what we remember best — so each teaching is anchored in one.</li>
          <li><b>A timeline for context.</b> Knowing <em>when</em> and <em>where</em> things happened makes the stories stick.</li>
          <li><b>History and tradition, clearly labelled.</b> You'll always know what historians agree on and what comes from devotional accounts.</li>
        </ul></div>
        <div class="card"><ul class="tip-list" style="margin:0;padding-left:18px">
          <li><b>Recall, don't just reread.</b> Short quizzes and flashcards make you retrieve what you learned — the most effective way to remember.</li>
          <li><b>Spaced repetition.</b> Cards return just before you'd forget them.</li>
          <li><b>Reflection.</b> Daily prompts connect each teaching to your own life — that's where understanding deepens.</li>
        </ul></div>
      </div>`;
  },
};

// ---------------- Lessons ----------------
const Lessons = {
  render(el, [id]) {
    if (id) return this.lesson(el, id);
    const d = Store.data, nextId = (LESSONS.find(l => !d.lessons[l.id]) || {}).id;
    let unit = '', html = `<h1>Lessons</h1><p class="muted">Follow them in order — each builds on the last and ends with a short quiz.</p>`;
    LESSONS.forEach((l, i) => {
      if (l.unit !== unit) { if (unit) html += '</div>'; unit = l.unit; html += `<div class="unit-label">${esc(unit)}</div><div class="grid g2">`; }
      const done = d.lessons[l.id];
      html += `<a class="card click lesson-card ${done ? 'done' : ''}" href="#/lessons/${l.id}" style="text-decoration:none;color:inherit">
        <div class="lesson-icon">${l.icon}</div>
        <div style="flex:1"><div class="row"><b>${i + 1}. ${esc(l.title)}</b>${done ? `<span class="pill ok">✓ ${done}%</span>` : l.id === nextId ? '<span class="pill next">Up next</span>' : ''}</div>
        <div class="muted" style="font-size:.9rem">${esc(l.summary)}</div></div></a>`;
    });
    el.innerHTML = html + '</div>';
  },
  lesson(el, id) {
    const idx = LESSONS.findIndex(l => l.id === id), l = LESSONS[idx];
    if (!l) { location.hash = '#/lessons'; return; }
    el.innerHTML = `<div class="lesson-body">
      <a href="#/lessons" class="muted">← All lessons</a>
      <div class="unit-label">${esc(l.unit)} · Lesson ${idx + 1}</div>
      <h1>${l.icon} ${esc(l.title)}</h1><p class="muted">${esc(l.summary)}</p>
      ${l.sections.map(s => this.section(s)).join('')}
      <div class="card" style="text-align:center"><h3>Ready to check yourself?</h3><p class="muted">A quick quiz to lock it in. Score 60% or more to complete the lesson.</p>
        <button class="btn primary" id="start-quiz">Start quiz →</button></div></div>`;
    $('#start-quiz').onclick = () => Quiz.run(el, this.quizFor(l), { title: l.title, onDone: (score, total, actions) => {
      const pct = Math.round(score / total * 100);
      if (pct >= 60) {
        const first = !Store.data.lessons[l.id];
        Store.data.lessons[l.id] = Math.max(pct, Store.data.lessons[l.id] || 0); Store.save();
        if (first) { Store.addXP(20); App.toast('🎉 Lesson complete! +20 XP'); }
        Practice.seedFromLesson(l);
      }
      const next = LESSONS[idx + 1];
      actions.innerHTML = `<button class="btn" id="retry">↻ Try again</button><a class="btn" href="#/lessons/${l.id}" id="review">📖 Review lesson</a>
        ${next && pct >= 60 ? `<a class="btn primary" href="#/lessons/${next.id}">Next: ${esc(next.title)} →</a>` : ''}`;
      $('#retry').onclick = () => { this.lesson(el, id); $('#start-quiz').click(); };
      $('#review').onclick = e => { e.preventDefault(); this.lesson(el, id); };
    }});
  },
  quizFor(l) {
    if (Array.isArray(l.quiz)) return QGen.fixed(l.quiz);
    if (l.quiz === 'people') return QGen.type('person', 8);
    if (l.quiz.startsWith('ids:')) return QGen.ids(l.quiz.slice(4).split(','));
    return [];
  },
  itemIds(l) {
    if (typeof l.quiz === 'string' && l.quiz.startsWith('ids:')) return l.quiz.slice(4).split(',');
    if (l.quiz === 'people') return PEOPLE.map(p => p.id);
    return [];
  },
  section(s) {
    switch (s.type) {
      case 'text': return `<div class="card">${s.html}</div>`;
      case 'tip': return `<div class="card tip">💡 ${s.html}</div>`;
      case 'story': { const st = STORIES[s.id]; return `<div class="card quote-card"><div class="row" style="margin-bottom:8px"><h3 style="margin:0">${st.icon} ${esc(st.title)}</h3><span class="spacer"></span>${kindPill(st.kind)}</div>${st.text}
        <div class="card tip" style="margin:12px 0 0;padding:14px">🌱 <b>The lesson:</b> ${esc(st.lesson)}</div></div>`; }
      case 'people': return `<div class="grid g2">${PEOPLE.map(p => People.personCard(p)).join('')}</div>`;
    }
    return '';
  },
};

// ---------------- Timeline ----------------
const Timeline = {
  render(el) {
    el.innerHTML = `<h1>Timeline</h1><p class="muted">The key moments of Sai Baba's life and legacy. Exact early dates are uncertain — "c." means "about".</p>
      <div class="row" style="margin-bottom:16px">${kindPill('hist')}<span class="muted" style="font-size:.88rem">documented / broadly agreed</span>${kindPill('trad')}<span class="muted" style="font-size:.88rem">from devotional accounts</span>
        <span class="spacer"></span><a class="btn sm primary" href="#/practice/order">🧩 Play: put events in order</a></div>
      <div class="timeline">${TIMELINE.map(t => `<div class="tl-item card"><div class="row"><span class="tl-year">${esc(t.year)}</span><b>${esc(t.title)}</b><span class="spacer"></span>${kindPill(t.kind)}</div><p class="muted" style="margin:6px 0 0">${esc(t.text)}</p></div>`).join('')}</div>`;
  },
};

// ---------------- Teachings ----------------
const Teachings = {
  sub: 'core',
  render(el, [sub]) {
    this.sub = sub || this.sub;
    const tabs = [['core', 'Core teachings'], ['sayings', 'Sayings'], ['assurances', 'Eleven assurances'], ['stories', 'Stories']];
    el.innerHTML = `<h1>Teachings</h1><div class="subtabs">${tabs.map(([k, n]) => `<button data-sub="${k}" class="${k === this.sub ? 'active' : ''}">${n}</button>`).join('')}</div><div id="tch"></div>`;
    $$('.subtabs button', el).forEach(b => b.onclick = () => location.hash = '#/teachings/' + b.dataset.sub);
    const t = $('#tch', el);
    if (this.sub === 'core') t.innerHTML = `<div class="grid g2">${[
      ['🪙', 'Shraddha — Faith', 'Steady trust in God and the guru. Not blind belief, but a settled confidence that lets go of fear.'],
      ['⏳', 'Saburi — Patience', 'Cheerful perseverance. Waiting calmly, enduring hardship without bitterness, trusting things unfold in time.'],
      ['🤝', 'Sabka Malik Ek — Unity', 'One God is master of all. Respect every religion; what unites people matters more than what divides them.'],
      ['🍲', 'Seva — Service', 'Feed the hungry, welcome guests, care for animals. Serving any being is serving God.'],
      ['🧘', 'Surrender of ego', 'Let go of pride and the need to control. Baba asked for dakshina partly to teach people to loosen their grip on possessions.'],
      ['🕊️', 'Simplicity & honesty', 'He lived with almost nothing and valued truthfulness — as the story of the lamps shows.'],
    ].map(([i, h, p]) => `<div class="card"><div style="font-size:1.8rem">${i}</div><h3>${h}</h3><p class="muted" style="margin:0">${p}</p></div>`).join('')}</div>`;
    if (this.sub === 'sayings') t.innerHTML = `<div class="card tip" style="margin-bottom:16px">💡 Sai Baba wrote nothing himself. These sayings come from devotees' records, mostly the Satcharitra, and wording varies between translations.</div>
      <div class="grid g2">${SAYINGS.map(s => `<div class="card quote-card"><div class="quote">"${esc(s.text)}"</div><div style="margin-top:8px"><b>${esc(s.meaning)}</b></div><div class="attrib">${esc(s.note)}</div></div>`).join('')}</div>`;
    if (this.sub === 'assurances') t.innerHTML = `<div class="card tip" style="margin-bottom:16px">💡 Devotees treasure these eleven promises, gathered from sayings recorded in the Satcharitra. They are shown here in paraphrase — wording differs between versions. They describe devotional faith, not historical claims.</div>
      <div class="card"><ol style="margin:0;padding-left:22px">${ASSURANCES.map(a => `<li style="margin-bottom:10px" class="quote" >${esc(a)}</li>`).join('')}</ol></div>`;
    if (this.sub === 'stories') t.innerHTML = Object.values(STORIES).map(s => Lessons.section({ type: 'story', id: Object.keys(STORIES).find(k => STORIES[k] === s) })).join('<div style="height:16px"></div>');
  },
};

// ---------------- People & Places ----------------
const People = {
  sub: 'people',
  personCard: p => `<div class="card"><div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div class="avatar">${p.icon}</div><div><b>${esc(p.name)}</b><div class="pill next" style="margin:4px 0 6px">${esc(p.role)}</div><p class="muted" style="margin:0;font-size:.92rem">${esc(p.text)}</p></div></div></div>`,
  render(el, [sub]) {
    this.sub = sub || this.sub;
    const tabs = [['people', 'People'], ['places', 'Places in Shirdi'], ['glossary', 'Key words']];
    el.innerHTML = `<h1>People & Places</h1><div class="subtabs">${tabs.map(([k, n]) => `<button data-sub="${k}" class="${k === this.sub ? 'active' : ''}">${n}</button>`).join('')}</div><div id="pp"></div>`;
    $$('.subtabs button', el).forEach(b => b.onclick = () => location.hash = '#/people/' + b.dataset.sub);
    const p = $('#pp', el);
    if (this.sub === 'people') p.innerHTML = `<p class="muted">The devotees who knew Sai Baba and carried his message.</p><div class="grid g2">${PEOPLE.map(this.personCard).join('')}</div>`;
    if (this.sub === 'places') p.innerHTML = `<p class="muted">Places you'll meet in the stories — all can still be visited in Shirdi.</p><div class="grid g2">${PLACES.map(pl => `<div class="card"><div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div class="avatar">${pl.icon}</div><div><b>${esc(pl.name)}</b><p class="muted" style="margin:4px 0 0;font-size:.92rem">${esc(pl.text)}</p></div></div></div>`).join('')}</div>`;
    if (this.sub === 'glossary') p.innerHTML = `<input class="search" id="g-search" placeholder="Search key words…"><div class="vocab-list" id="g-list"></div>`;
    if (this.sub === 'glossary') {
      const draw = q => { q = q.toLowerCase(); $('#g-list').innerHTML = TERMS.filter(t => !q || (t.term + t.def).toLowerCase().includes(q)).map(t => `<div class="card" style="padding:14px 16px"><span class="term">${esc(t.term)}</span><div class="muted">${esc(t.def)}</div></div>`).join('') || '<p class="muted">No matches.</p>'; };
      $('#g-search').oninput = e => draw(e.target.value); draw('');
    }
  },
};

// ---------------- Progress ----------------
const Progress = {
  render(el) {
    const d = Store.data;
    const last14 = Array.from({ length: 14 }, (_, i) => { const t = new Date(Date.now() - (13 - i) * 864e5).toISOString().slice(0, 10); return [t, d.days[t] || 0]; });
    const max = Math.max(d.goal, ...last14.map(x => x[1]));
    const cats = [['term', '📖 Key words'], ['person', '👥 People'], ['place', '📍 Places'], ['timeline', '🕰️ Timeline'], ['saying', '🪔 Sayings']];
    const mastery = type => { const items = QGen.pool(type); const m = items.filter(i => { const s = d.stats[i.id], b = (d.srs[i.id] || {}).box || 0; return b >= 3 || (s && s.c >= 3 && s.c / (s.c + s.w) >= .8); }).length; return [m, items.length]; };
    const tot = Object.values(d.stats).reduce((a, s) => [a[0] + s.c, a[1] + s.w], [0, 0]);
    el.innerHTML = `<h1>Your Progress</h1>
      <div class="grid g3">
        <div class="card stat"><div class="n">⭐ ${d.xp}</div><div class="l">total XP</div></div>
        <div class="card stat"><div class="n">🔥 ${d.streak}</div><div class="l">day streak</div></div>
        <div class="card stat"><div class="n">${Object.keys(d.lessons).length}<span class="dim" style="font-size:1rem"> / ${LESSONS.length}</span></div><div class="l">lessons done</div></div>
        <div class="card stat"><div class="n">${tot[0] + tot[1] ? Math.round(tot[0] / (tot[0] + tot[1]) * 100) : 0}%</div><div class="l">quiz accuracy</div></div>
        <div class="card stat"><div class="n">${d.journal.length}</div><div class="l">reflections written</div></div>
        <div class="card stat"><div class="n">${Object.values(d.srs).filter(c => c.box >= 3).length}</div><div class="l">cards learned</div></div>
      </div>
      <div class="card" style="margin-top:16px"><div class="row"><h3 style="margin:0">Last 14 days</h3><span class="spacer"></span>
        <label class="muted">Daily goal: <select id="goal" style="background:var(--bg2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:4px">${[10, 20, 30, 50, 80].map(g => `<option ${g === d.goal ? 'selected' : ''}>${g}</option>`).join('')}</select> XP</label></div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:140px;margin-top:16px">
          ${last14.map(([t, v]) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end" title="${t}: ${v} XP">
            <div style="width:100%;border-radius:6px 6px 2px 2px;height:${Math.max(2, v / max * 100)}%;background:${v >= d.goal ? 'var(--saffron)' : v ? 'var(--violet)' : 'var(--line)'}"></div>
            <span class="dim" style="font-size:.7rem">${t.slice(8)}</span></div>`).join('')}</div></div>
      <div class="card" style="margin-top:16px"><h3>Mastery by topic</h3>
        ${cats.map(([t, n]) => { const [m, all] = mastery(t); return `<div style="margin-bottom:12px"><div class="row"><b>${n}</b><span class="spacer"></span><span class="muted">${m} / ${all}</span></div><div class="progress" style="margin-top:6px"><div style="width:${m / all * 100}%"></div></div></div>`; }).join('')}</div>
      <div class="card" style="margin-top:16px"><h3>💾 Saving & backups</h3>
        <p class="muted">${Store.server ? 'Your progress and reflections save automatically as you go to a <b>progress.json</b> file in the app folder.' : 'Your progress saves automatically in this browser. Start the app with <code>python server.py</code> to also save it to a file.'}
          ${d.updatedAt ? `<br>Last saved: <b>${new Date(d.updatedAt).toLocaleString()}</b>` : ''}</p>
        <div class="row"><button class="btn" id="export">⬇️ Download a backup</button><button class="btn" id="import">⬆️ Restore from backup</button><input type="file" id="import-file" accept=".json,application/json" hidden>
          <span class="spacer"></span><button class="btn ghost sm" id="reset" style="color:var(--red)">Reset all progress</button></div></div>`;
    $('#goal').onchange = e => { d.goal = +e.target.value; Store.save(); this.render(el); };
    $('#reset').onclick = () => { if (confirm('Erase all progress and reflections? This cannot be undone (download a backup first if you might want it).')) { Store.replace({}); App.updateHeader(); this.render(el); } };
    $('#export').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 1)], { type: 'application/json' })); a.download = `sai-path-progress-${today()}.json`; a.click(); URL.revokeObjectURL(a.href); };
    $('#import').onclick = () => $('#import-file').click();
    $('#import-file').onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try { const obj = JSON.parse(await f.text()); if (typeof obj !== 'object' || obj === null || !('xp' in obj)) throw 0;
        if (!confirm('Replace your current progress with this backup?')) return;
        Store.replace(obj); App.updateHeader(); this.render(el); App.toast('✅ Progress restored');
      } catch { App.toast('⚠️ That file isn\'t a valid progress backup.'); }
    };
  },
};
