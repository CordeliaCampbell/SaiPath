// ============================================================
//  Reflect: daily prompt + private journal (saved with progress)
// ============================================================
const Reflect = {
  offset: 0,
  render(el) {
    const prompt = PROMPTS[(dailyIndex(PROMPTS.length) + this.offset) % PROMPTS.length];
    const entries = [...Store.data.journal].reverse();
    el.innerHTML = `<h1>Reflect</h1>
      <p class="muted">Learning about a teacher means little unless it touches your own life. Take a few quiet minutes with today's prompt. Your reflections stay on your computer.</p>
      <div class="card quote-card">
        <div class="row"><span class="pill next">${esc(prompt.theme)}</span><span class="spacer"></span><button class="btn ghost sm" id="another">↻ Different prompt</button></div>
        <div class="quote" style="margin:14px 0">${esc(prompt.q)}</div>
        <textarea class="journal" id="entry" placeholder="Write freely — there are no wrong answers…">${esc(this.draft || '')}</textarea>
        <div class="row" style="margin-top:12px"><span class="dim" id="count" style="font-size:.85rem"></span><span class="spacer"></span><button class="btn primary" id="save">💾 Save reflection (+5 XP)</button></div>
      </div>
      <div class="section-title"><h2>Your journal</h2><span class="muted">${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}</span></div>
      ${entries.length ? entries.map(e => `<div class="card entry" style="margin-bottom:12px">
          <div class="row"><span class="pill">${esc(e.theme)}</span><span class="dim" style="font-size:.85rem">${new Date(e.at).toLocaleString()}</span><span class="spacer"></span><button class="btn ghost sm" data-del="${e.at}" title="Delete">🗑</button></div>
          <div class="muted" style="margin:10px 0 6px;font-style:italic">${esc(e.q)}</div><div style="white-space:pre-wrap">${esc(e.text)}</div></div>`).join('')
        : '<div class="card"><p class="muted" style="margin:0">No reflections yet. Your first one is waiting above. 🌱</p></div>'}`;
    const ta = $('#entry'), count = () => $('#count').textContent = `${ta.value.trim().split(/\s+/).filter(Boolean).length} words`;
    ta.oninput = () => { this.draft = ta.value; count(); }; count();
    $('#another').onclick = () => { this.offset++; this.render(el); };
    $('#save').onclick = () => {
      const text = ta.value.trim();
      if (text.length < 3) { App.toast('✏️ Write a few words first.'); return; }
      Store.data.journal.push({ at: Date.now(), theme: prompt.theme, q: prompt.q, text });
      this.draft = ''; Store.addXP(5); App.toast('🌱 Reflection saved. +5 XP'); this.render(el);
    };
    $$('[data-del]', el).forEach(b => b.onclick = () => {
      if (!confirm('Delete this reflection?')) return;
      Store.data.journal = Store.data.journal.filter(e => e.at !== +b.dataset.del); Store.save(); this.render(el);
    });
  },
};
