import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function App() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem("momentumWins");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("momentumWins", JSON.stringify(wins));
  }, [wins]);

  const today = new Date();

  function normalizeDate(dateString) {
    const d = new Date(dateString);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function formatDayLabel(date) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  function isSameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function handleSubmit(e) {
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
  }

  function handleDelete(id) {
    setWins(wins.filter((win) => win.id !== id));
  }

  const totalWins = wins.length;

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

  let longestStreak = 0;
  let runningStreak = 0;

  for (let i = 0; i < uniqueWinDays.length; i++) {
    if (i === 0) {
      runningStreak = 1;
    } else {
      const prev = uniqueWinDays[i - 1];
      const curr = uniqueWinDays[i];
      const diffDays = Math.round((prev - curr) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        runningStreak += 1;
      } else {
        runningStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, runningStreak);
  }

  const weeklyData = [...Array(7)].map((_, index) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - index));

    const count = wins.filter((win) =>
      isSameDay(new Date(win.createdAt), d)
    ).length;

    return {
      day: formatDayLabel(d),
      wins: count,
    };
  });

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

  return (
    <div className="app">
      <div className="container">
        <header className="hero">
          <h1>Momentum Tracker</h1>
          <p>Celebrate small daily progress, one win at a time.</p>
        </header>

        <section className="stats-grid">
          <div className="card stat-card">
            <span>Total Wins</span>
            <strong>{totalWins}</strong>
          </div>

          <div className="card stat-card">
            <span>Wins Today</span>
            <strong>{winsToday}</strong>
          </div>

          <div className="card stat-card">
            <span>Current Streak</span>
            <strong>{currentStreak} 🔥</strong>
          </div>

          <div className="card stat-card">
            <span>Longest Streak</span>
            <strong>{longestStreak}</strong>
          </div>
        </section>

        <section className="card">
          <h2>Add a Win</h2>
          <form onSubmit={handleSubmit} className="win-form">
            <input
              type="text"
              placeholder="What is your tiny win today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

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
          </form>
        </section>

        <section className="card chart-card">
          <div className="section-header">
            <h2>Weekly Progress</h2>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="wins" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card">
          <div className="section-header">
            <h2>Recent Wins</h2>

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
              <p>No wins yet — add your first one.</p>
            </div>
          ) : (
            <ul className="wins-list">
              {filteredWins.map((win) => (
                <li key={win.id} className="win-item">
                  <div className="win-main">
                    <h3>{win.title}</h3>
                    <div className="win-meta">
                      <span className={`badge ${win.category.toLowerCase()}`}>
                        {win.category}
                      </span>
                      <span className="win-date">
                        {new Date(win.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(win.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;