import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Personal");
  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem("tinyWins");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tinyWins", JSON.stringify(wins));
  }, [wins]);

  const today = new Date();

  function isSameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function normalizeDate(dateString) {
    const d = new Date(dateString);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function addWin(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const newWin = {
      id: Date.now(),
      text: text.trim(),
      category,
      createdAt: new Date().toISOString(),
    };

    setWins([newWin, ...wins]);
    setText("");
    setCategory("Personal");
  }

  function deleteWin(id) {
    setWins(wins.filter((win) => win.id !== id));
  }

  const winsToday = wins.filter((win) =>
    isSameDay(new Date(win.createdAt), today)
  ).length;

  const uniqueWinDays = [
    ...new Set(wins.map((win) => normalizeDate(win.createdAt).toDateString())),
  ]
    .map((d) => new Date(d))
    .sort((a, b) => b - a);

  let streak = 0;
  let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  for (const day of uniqueWinDays) {
    if (isSameDay(day, cursor)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (day < cursor) {
      break;
    }
  }

  const greeting = useMemo(() => {
    if (winsToday === 0) return "Start with one small win today.";
    if (winsToday === 1) return "Nice start — keep going.";
    return "You’re doing great today.";
  }, [winsToday]);

  function getEmoji(category) {
    if (category === "Health") return "🌿";
    if (category === "Learning") return "📚";
    if (category === "Career") return "💼";
    return "💖";
  }

  return (
    <div className="app">
      <div className="container">
        <header className="hero">
          <p className="eyebrow">Tiny Wins ✨</p>
          <h1>Celebrate small progress.</h1>
          <p className="subtext">{greeting}</p>
        </header>

        <section className="stats">
          <div className="stat-card">
            <span>Today</span>
            <strong>{winsToday}</strong>
          </div>

          <div className="stat-card">
            <span>Streak</span>
            <strong>{streak} 🔥</strong>
          </div>
        </section>

        <section className="composer">
          <form onSubmit={addWin}>
            <label htmlFor="winInput" className="label">
              What went well today?
            </label>

            <textarea
              id="winInput"
              placeholder="Write one small win..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="3"
            />

            <div className="composer-row">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Personal</option>
                <option>Health</option>
                <option>Learning</option>
                <option>Career</option>
              </select>

              <button type="submit">Add Win</button>
            </div>
          </form>
        </section>

        <section className="wins-section">
          <div className="section-header">
            <h2>Recent wins</h2>
            <span>{wins.length} total</span>
          </div>

          {wins.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌷</div>
              <p>No wins yet. Add your first one.</p>
            </div>
          ) : (
            <div className="wins-list">
              {wins.map((win) => (
                <div key={win.id} className="win-item">
                  <div className="win-left">
                    <div className="win-emoji">{getEmoji(win.category)}</div>

                    <div className="win-content">
                      <p className="win-text">{win.text}</p>
                      <div className="win-meta">
                        <span className="win-category">{win.category}</span>
                        <span className="dot">•</span>
                        <span>
                          {new Date(win.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deleteWin(win.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;