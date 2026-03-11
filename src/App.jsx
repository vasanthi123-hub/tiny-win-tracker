import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem("tinyWins");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("All");
  const [celebration, setCelebration] = useState("");

  useEffect(() => {
    localStorage.setItem("tinyWins", JSON.stringify(wins));
  }, [wins]);

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

  const today = new Date();

  function addWin(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const newWin = {
      id: Date.now(),
      title: title.trim(),
      category,
      createdAt: new Date().toISOString(),
    };

    setWins([newWin, ...wins]);
    setTitle("");
    setCategory("Personal");
    setCelebration("✨ +10 XP! Nice job!");

    setTimeout(() => {
      setCelebration("");
    }, 2000);
  }

  function deleteWin(id) {
    setWins(wins.filter((win) => win.id !== id));
  }

  const totalWins = wins.length;
  const xp = totalWins * 10;
  const level = Math.floor(xp / 50) + 1;
  const xpIntoLevel = xp % 50;
  const xpNeeded = 50;
  const progressPercent = (xpIntoLevel / xpNeeded) * 100;

  const winsToday = wins.filter((win) =>
    isSameDay(new Date(win.createdAt), today)
  ).length;

  const uniqueWinDays = [
    ...new Set(wins.map((win) => normalizeDate(win.createdAt).toDateString())),
  ]
    .map((d) => new Date(d))
    .sort((a, b) => b - a);

  let currentStreak = 0;
  let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  for (const day of uniqueWinDays) {
    if (isSameDay(day, cursor)) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (day < cursor) {
      break;
    }
  }

  const dailyQuestGoal = 3;
  const dailyQuestProgress = Math.min(winsToday, dailyQuestGoal);
  const dailyQuestDone = winsToday >= dailyQuestGoal;

  const achievements = [
    { label: "First Win", earned: totalWins >= 1, emoji: "🌱" },
    { label: "5 Wins", earned: totalWins >= 5, emoji: "✨" },
    { label: "10 Wins", earned: totalWins >= 10, emoji: "🏆" },
    { label: "3 Day Streak", earned: currentStreak >= 3, emoji: "🔥" },
  ];

  const filteredWins = useMemo(() => {
    if (filter === "All") return wins;

    if (filter === "Today") {
      return wins.filter((win) => isSameDay(new Date(win.createdAt), today));
    }

    if (filter === "This Week") {
      const start = new Date();
      start.setDate(today.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      return wins.filter((win) => new Date(win.createdAt) >= start);
    }

    return wins;
  }, [filter, wins]);

  function getCategoryEmoji(cat) {
    if (cat === "Health") return "🌿";
    if (cat === "Learning") return "📚";
    if (cat === "Career") return "💼";
    return "💖";
  }

  return (
    <div className="app-shell">
      <div className="container">
        <header className="hero-card">
          <div className="hero-chip">🎀 Tiny Wins</div>
          <h1>Level up your day</h1>
          <p>Turn tiny wins into momentum, points, and feel-good progress.</p>

          <div className="level-card">
            <div className="level-top">
              <span>Level {level}</span>
              <span>{xpIntoLevel} / {xpNeeded} XP</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat pink">
              <span>Total Wins</span>
              <strong>{totalWins}</strong>
            </div>
            <div className="hero-stat purple">
              <span>Wins Today</span>
              <strong>{winsToday}</strong>
            </div>
            <div className="hero-stat peach">
              <span>Streak</span>
              <strong>{currentStreak} 🔥</strong>
            </div>
          </div>
        </header>

        {celebration && <div className="celebration-banner">{celebration}</div>}

        <section className="card quest-card">
          <div>
            <h2>🎯 Daily Quest</h2>
            <p>Add 3 wins today to complete your quest.</p>
          </div>
          <div className="quest-status">
            <strong>{dailyQuestProgress} / {dailyQuestGoal}</strong>
            <span>{dailyQuestDone ? "Completed ✨" : "In progress"}</span>
          </div>
        </section>

        <section className="card add-card">
          <div className="section-row">
            <div>
              <h2>Add a win</h2>
              <p>What went well today?</p>
            </div>
          </div>

          <form onSubmit={addWin} className="win-form">
            <textarea
              placeholder="Example: finished workout, studied AWS, helped a friend..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows="3"
            />

            <div className="form-bottom">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Personal</option>
                <option>Health</option>
                <option>Learning</option>
                <option>Career</option>
              </select>

              <button type="submit">Add Win ✨</button>
            </div>
          </form>
        </section>

        <section className="card achievements-card">
          <div className="section-row">
            <div>
              <h2>Achievements</h2>
              <p>Unlock little rewards as you keep going.</p>
            </div>
          </div>

          <div className="badges-grid">
            {achievements.map((badge) => (
              <div
                key={badge.label}
                className={`badge-card ${badge.earned ? "earned" : "locked"}`}
              >
                <div className="badge-emoji">{badge.emoji}</div>
                <div className="badge-title">{badge.label}</div>
                <div className="badge-status">
                  {badge.earned ? "Unlocked" : "Locked"}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card wins-card">
          <div className="section-row">
            <div>
              <h2>Your wins</h2>
              <p>Your little progress log.</p>
            </div>

            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Today</option>
              <option>This Week</option>
            </select>
          </div>

          {filteredWins.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌷</div>
              <h3>No wins yet</h3>
              <p>Add your first little win and start building momentum.</p>
            </div>
          ) : (
            <div className="wins-list">
              {filteredWins.map((win) => (
                <div key={win.id} className="win-tile">
                  <div className="win-left">
                    <div className={`emoji-circle ${win.category.toLowerCase()}`}>
                      {getCategoryEmoji(win.category)}
                    </div>

                    <div className="win-content">
                      <h3>{win.title}</h3>
                      <div className="meta-row">
                        <span className={`tag ${win.category.toLowerCase()}`}>
                          {win.category}
                        </span>
                        <span className="date-text">
                          {new Date(win.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deleteWin(win.id)}
                  >
                    ✕
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