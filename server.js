const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── SERVE FRONTEND (Embedded HTML) ─────────────────────────────
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="FinSmart AI - Personal Finance Advisor powered by Google Gemini"/>
<title>FinSmart AI Advisor</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
:root{--bg:#0a0d12;--surface:#111520;--surface2:#181d2e;--border:#1e2538;--accent:#00e5a0;--accent2:#0077ff;--text:#e8eaf0;--muted:#6b7280;--danger:#ff4d6d;--gold:#f4c542}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;display:flex;flex-direction:column}
header{display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100}
.logo{display:flex;align-items:center;gap:.5rem;font-family:'Playfair Display',serif;font-size:1.4rem}
.logo span{color:var(--accent)}
nav{display:flex;gap:.5rem}
.nav-btn{padding:.5rem 1.2rem;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:.9rem;cursor:pointer;transition:all .2s}
.nav-btn:hover{color:var(--text);border-color:var(--accent)}
.nav-btn.active{background:var(--accent);color:#000;border-color:var(--accent);font-weight:500}
main{flex:1;padding:2rem;max-width:1100px;margin:0 auto;width:100%}
footer{text-align:center;padding:1rem;color:var(--muted);font-size:.8rem;border-top:1px solid var(--border)}
/* CHAT */
.chat-wrap{display:flex;flex-direction:column;height:75vh;background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden}
.chat-head{padding:1rem 1.5rem;border-bottom:1px solid var(--border);background:var(--surface2)}
.chat-head h2{font-family:'Playfair Display',serif;font-size:1.2rem;color:var(--accent)}
.chat-head p{font-size:.8rem;color:var(--muted);margin-top:2px}
.quick-btns{display:flex;gap:.5rem;flex-wrap:wrap;padding:.75rem 1.5rem 0}
.q-btn{padding:.35rem .85rem;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:.78rem;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
.q-btn:hover{border-color:var(--accent);color:var(--accent)}
.messages{flex:1;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem}
.messages::-webkit-scrollbar{width:4px}
.messages::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
.msg{display:flex;gap:.75rem;animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.msg.user{flex-direction:row-reverse}
.avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.msg.user .avatar{background:var(--accent2)}
.msg.ai .avatar{background:var(--accent);color:#000}
.bubble{max-width:70%;padding:.75rem 1rem;border-radius:12px;font-size:.9rem;line-height:1.6;white-space:pre-wrap}
.msg.user .bubble{background:var(--accent2);color:#fff;border-bottom-right-radius:4px}
.msg.ai .bubble{background:var(--surface2);border:1px solid var(--border);border-bottom-left-radius:4px}
.typing{display:flex;gap:4px;align-items:center;padding:.5rem 0}
.dot{width:8px;height:8px;background:var(--accent);border-radius:50%;animation:bounce 1.2s infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes bounce{0%,80%,100%{transform:scale(.8);opacity:.5}40%{transform:scale(1.2);opacity:1}}
.input-area{padding:1rem 1.5rem;border-top:1px solid var(--border);background:var(--surface2);display:flex;gap:.75rem}
.chat-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:.75rem 1rem;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.9rem;outline:none;resize:none;transition:border-color .2s}
.chat-input:focus{border-color:var(--accent)}
.chat-input::placeholder{color:var(--muted)}
.send-btn{padding:.75rem 1.5rem;background:var(--accent);color:#000;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-weight:500;cursor:pointer;transition:opacity .2s}
.send-btn:hover{opacity:.85}
.send-btn:disabled{opacity:.4;cursor:not-allowed}
/* DASHBOARD */
.dashboard{display:flex;flex-direction:column;gap:1.5rem}
.db-head h2{font-family:'Playfair Display',serif;font-size:1.8rem}
.db-head p{color:var(--muted);margin-top:4px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem}
.stat{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.25rem;transition:border-color .2s}
.stat:hover{border-color:var(--accent)}
.stat-label{font-size:.8rem;color:var(--muted);margin-bottom:.5rem}
.stat-val{font-size:1.8rem;font-weight:500}
.green{color:var(--accent)}.red{color:var(--danger)}.gold{color:var(--gold)}
.panels{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
@media(max-width:700px){.panels{grid-template-columns:1fr}}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.5rem}
.panel h3{font-family:'Playfair Display',serif;font-size:1rem;margin-bottom:1rem;color:var(--accent)}
.exp-form{display:flex;flex-direction:column;gap:.75rem}
.form-row{display:flex;gap:.5rem}
.inp{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.6rem .9rem;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;width:100%;transition:border-color .2s}
.inp:focus{border-color:var(--accent)}
.add-btn{padding:.6rem 1rem;background:var(--accent);color:#000;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-weight:500;cursor:pointer}
.exp-list{display:flex;flex-direction:column;gap:.5rem;max-height:220px;overflow-y:auto;margin-top:.5rem}
.exp-item{display:flex;justify-content:space-between;align-items:center;padding:.6rem .75rem;background:var(--surface2);border-radius:8px;font-size:.85rem;animation:fadeIn .3s ease}
.exp-cat{color:var(--muted);font-size:.75rem}
.exp-amt{color:var(--danger);font-weight:500}
.bar-chart{display:flex;flex-direction:column;gap:.6rem}
.bar-row{display:flex;align-items:center;gap:.75rem;font-size:.82rem}
.bar-label{width:90px;color:var(--muted);text-align:right;flex-shrink:0}
.bar-track{flex:1;height:10px;background:var(--surface2);border-radius:6px;overflow:hidden}
.bar-fill{height:100%;border-radius:6px;background:var(--accent);transition:width .6s ease}
.bar-val{width:60px;color:var(--text);text-align:right}
.save-btn{margin-top:1rem;width:100%;padding:.7rem;background:transparent;border:1px solid var(--accent);color:var(--accent);border-radius:8px;font-family:'DM Sans',sans-serif;font-size:.88rem;cursor:pointer;transition:all .2s}
.save-btn:hover{background:var(--accent);color:#000}
.toast{position:fixed;bottom:2rem;right:2rem;background:var(--accent);color:#000;padding:.75rem 1.5rem;border-radius:10px;font-weight:500;animation:slideUp .3s ease;z-index:999}
@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
.empty{color:var(--muted);font-size:.85rem;text-align:center;padding:1rem 0}
.hidden{display:none}
</style>
</head>
<body>
<header>
  <div class="logo">₿ FinSmart <span>AI</span></div>
  <nav>
    <button class="nav-btn active" id="btn-chat" onclick="showTab('chat')">💬 AI Advisor</button>
    <button class="nav-btn" id="btn-dash" onclick="showTab('dash')">📊 Dashboard</button>
  </nav>
</header>

<main>
  <!-- CHAT TAB -->
  <div id="tab-chat" class="chat-wrap" role="main" aria-label="AI Finance Chat">
    <div class="chat-head">
      <h2>💬 AI Financial Advisor</h2>
      <p>Powered by Google Gemini · Ask me anything about money</p>
    </div>
    <div class="quick-btns">
      <button class="q-btn" onclick="sendQ('How do I start investing?')">How do I start investing?</button>
      <button class="q-btn" onclick="sendQ('Best way to save for retirement?')">Save for retirement?</button>
      <button class="q-btn" onclick="sendQ('How to reduce debt fast?')">Reduce debt fast?</button>
      <button class="q-btn" onclick="sendQ('What is the 50/30/20 rule?')">50/30/20 rule?</button>
      <button class="q-btn" onclick="sendQ('SIP vs lump sum investment?')">SIP vs lump sum?</button>
    </div>
    <div class="messages" id="messages" role="log" aria-live="polite">
      <div class="msg ai">
        <div class="avatar" aria-hidden="true">🤖</div>
        <div class="bubble">👋 Hello! I'm your FinSmart AI Advisor powered by Google Gemini.\n\nI can help you with:\n• 💰 Budgeting & saving strategies\n• 📈 Investment advice\n• 🏦 Debt management\n• 📊 Financial planning\n\nWhat financial question can I help you with today?</div>
      </div>
    </div>
    <div class="input-area">
      <textarea class="chat-input" id="chat-input" rows="1" placeholder="Ask me about budgeting, investing, saving..." aria-label="Type your question" onkeydown="handleKey(event)"></textarea>
      <button class="send-btn" id="send-btn" onclick="sendMessage()" aria-label="Send">Send →</button>
    </div>
  </div>

  <!-- DASHBOARD TAB -->
  <div id="tab-dash" class="dashboard hidden" role="main" aria-label="Finance Dashboard">
    <div class="db-head">
      <h2>📊 Finance Dashboard</h2>
      <p>Track your expenses and manage your budget</p>
    </div>
    <div class="stats" id="stats"></div>
    <div class="panels">
      <div class="panel">
        <h3>➕ Add Expense</h3>
        <div class="exp-form">
          <input class="inp" id="exp-name" placeholder="Expense name" aria-label="Expense name"/>
          <div class="form-row">
            <input class="inp" id="exp-amt" type="number" placeholder="Amount (₹)" aria-label="Amount"/>
            <select class="inp" id="exp-cat" aria-label="Category">
              <option>Food</option><option>Transport</option><option>Housing</option>
              <option>Entertainment</option><option>Health</option><option>Shopping</option><option>Other</option>
            </select>
          </div>
          <button class="add-btn" onclick="addExpense()">Add Expense</button>
        </div>
        <h3 style="margin-top:1.5rem">🧾 Recent Expenses</h3>
        <div class="exp-list" id="exp-list" role="list"></div>
      </div>
      <div class="panel">
        <h3>📈 Budget vs Spent</h3>
        <div class="bar-chart" id="bar-chart"></div>
        <button class="save-btn" onclick="saveToSheets()" id="save-btn" aria-label="Save to Google Sheets">💾 Save to Google Sheets</button>
      </div>
    </div>
  </div>
</main>

<footer><p>FinSmart AI · Powered by Google Gemini · Built for #PromptWars by Hack2Skill</p></footer>
<div class="toast hidden" id="toast"></div>

<script>
// ── STATE ──────────────────────────────────────
let expenses = [
  {name:"Groceries",amount:1200,category:"Food",date:"2026-04-18"},
  {name:"Metro pass",amount:500,category:"Transport",date:"2026-04-17"},
  {name:"Netflix",amount:649,category:"Entertainment",date:"2026-04-15"}
];
const BUDGET = {Food:5000,Transport:2000,Housing:10000,Entertainment:3000,Health:2000,Shopping:4000,Other:2000};
const CATS = Object.keys(BUDGET);
let loading = false;

// ── TABS ──────────────────────────────────────
function showTab(tab) {
  document.getElementById('tab-chat').classList.toggle('hidden', tab !== 'chat');
  document.getElementById('tab-dash').classList.toggle('hidden', tab !== 'dash');
  document.getElementById('btn-chat').classList.toggle('active', tab === 'chat');
  document.getElementById('btn-dash').classList.toggle('active', tab === 'dash');
  if (tab === 'dash') renderDash();
}

// ── CHAT ──────────────────────────────────────
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function sendQ(q) {
  document.getElementById('chat-input').value = q;
  sendMessage();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || loading) return;
  loading = true;
  input.value = '';
  document.getElementById('send-btn').disabled = true;

  addBubble('user', text);
  const typingEl = addTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({message: text})
    });
    const data = await res.json();
    typingEl.remove();
    addBubble('ai', data.reply || 'Sorry, I could not get a response. Please try again.');
  } catch(e) {
    typingEl.remove();
    addBubble('ai', '⚠️ Connection error. Please check your internet and try again.');
  } finally {
    loading = false;
    document.getElementById('send-btn').disabled = false;
  }
}

function addBubble(role, text) {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.setAttribute('aria-label', (role === 'ai' ? 'AI' : 'You') + ': ' + text);
  div.innerHTML = '<div class="avatar" aria-hidden="true">' + (role === 'ai' ? '🤖' : '👤') + '</div><div class="bubble">' + text + '</div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function addTyping() {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg ai';
  div.setAttribute('aria-label', 'AI is typing');
  div.innerHTML = '<div class="avatar">🤖</div><div class="bubble"><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

// ── DASHBOARD ─────────────────────────────────
function renderDash() {
  const total = expenses.reduce((s,e) => s + Number(e.amount), 0);
  const totalBudget = Object.values(BUDGET).reduce((a,b) => a+b, 0);
  const remaining = totalBudget - total;

  document.getElementById('stats').innerHTML =
    stat('Monthly Budget', '₹' + totalBudget.toLocaleString(), 'gold') +
    stat('Total Spent', '₹' + total.toLocaleString(), 'red') +
    stat('Remaining', '₹' + remaining.toLocaleString(), remaining >= 0 ? 'green' : 'red') +
    stat('Transactions', expenses.length, '');

  const list = document.getElementById('exp-list');
  if (expenses.length === 0) {
    list.innerHTML = '<p class="empty">No expenses yet</p>';
  } else {
    list.innerHTML = expenses.map(e =>
      '<div class="exp-item" role="listitem"><div><div>' + e.name + '</div><div class="exp-cat">' + e.category + ' · ' + e.date + '</div></div><div class="exp-amt">-₹' + Number(e.amount).toLocaleString() + '</div></div>'
    ).join('');
  }

  const maxBudget = Math.max(...Object.values(BUDGET));
  document.getElementById('bar-chart').innerHTML = CATS.map(cat => {
    const spent = expenses.filter(e => e.category === cat).reduce((s,e) => s + Number(e.amount), 0);
    const pct = Math.min((spent / maxBudget) * 100, 100);
    const color = spent > BUDGET[cat] ? '#ff4d6d' : 'var(--accent)';
    return '<div class="bar-row" aria-label="' + cat + ': ₹' + spent + ' of ₹' + BUDGET[cat] + '"><div class="bar-label">' + cat + '</div><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div><div class="bar-val">₹' + spent.toLocaleString() + '</div></div>';
  }).join('');
}

function stat(label, val, cls) {
  return '<div class="stat"><div class="stat-label">' + label + '</div><div class="stat-val ' + cls + '">' + val + '</div></div>';
}

function addExpense() {
  const name = document.getElementById('exp-name').value.trim();
  const amount = document.getElementById('exp-amt').value;
  const category = document.getElementById('exp-cat').value;
  if (!name || !amount) return showToast('⚠️ Fill in name and amount!');
  expenses.unshift({name, amount: Number(amount), category, date: new Date().toISOString().split('T')[0]});
  document.getElementById('exp-name').value = '';
  document.getElementById('exp-amt').value = '';
  renderDash();
  showToast('✅ Expense added!');
}

async function saveToSheets() {
  const btn = document.getElementById('save-btn');
  btn.textContent = 'Saving...';
  btn.disabled = true;
  try {
    const res = await fetch('/api/save-expenses', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({expenses})
    });
    const data = await res.json();
    showToast(data.success ? '✅ Saved to Google Sheets!' : '⚠️ Could not save. Check config.');
  } catch(e) {
    showToast('⚠️ Save failed. Check connection.');
  } finally {
    btn.textContent = '💾 Save to Google Sheets';
    btn.disabled = false;
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

// ── INIT ──────────────────────────────────────
renderDash();
</script>
</body>
</html>`;

app.get("/", (req, res) => res.send(HTML));
app.get("/health", (req, res) => res.json({ status: "ok", service: "FinSmart AI Advisor" }));

// ─── GEMINI AI CHAT ──────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message" });
  }
  const sanitized = message.trim().slice(0, 1000);

  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are FinSmart, an expert personal finance advisor for Indian users. 
Give practical, clear, and actionable financial advice. 
Use Indian currency (₹/INR) and Indian context where relevant. 
Keep responses concise (under 200 words). Use bullet points where helpful.
Do not give specific stock tips. Always remind users to consult a certified advisor for major decisions.

User question: ${sanitized}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ reply: "⚠️ AI service is temporarily unavailable. Please try again in a moment." });
  }
});

// ─── SAVE TO GOOGLE SHEETS ───────────────────────────────────────
app.post("/api/save-expenses", async (req, res) => {
  const { expenses } = req.body;
  if (!Array.isArray(expenses)) {
    return res.status(400).json({ error: "Invalid data" });
  }
  try {
    const { google } = require("googleapis");
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const rows = expenses.map(e => [e.date, e.name, e.category, `₹${e.amount}`]);
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:D",
      valueInputOption: "RAW",
      requestBody: { values: [["Date", "Expense", "Category", "Amount"], ...rows] },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Sheets error:", error.message);
    res.status(500).json({ error: "Could not save to Google Sheets." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ FinSmart AI running on port ${PORT}`));

module.exports = app;
