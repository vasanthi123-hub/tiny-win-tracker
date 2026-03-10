import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [wins, setWins] = useState(() => {
    const savedWins = localStorage.getItem("tinyWins");
    if (savedWins) {
      return JSON.parse(savedWins);
    }

    return [
      { id: 1, title: "Went for a walk", category: "Health", date: "2026-03-09" },
      { id: 2, title: "Studied AWS for 30 minutes", category: "Learning", date: "2026-03-09" },
      { id: 3, title: "Cooked dinner at home", category: "Personal", date: "2026-03-08" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("tinyWins", JSON.stringify(wins));
  }, [wins]);

  const totalWins = useMemo(() => wins.length, [wins]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) return;

    const newWin = {
      id: Date.now(),
      title: title.trim(),
      category,
      date: new Date().toISOString().split("T")[0],
    };

    setWins([newWin, ...wins]);
    setTitle("");
    setCategory("Personal");
  }

  function handleDelete(id) {
    setWins(wins.filter((win) => win.id !== id));
  }

  return (
    <div className="app">
      <div className="container">
        <header className="hero">
          <h1>Tiny Wins Tracker</h1>
          <p>Track the small things that move your life forward.</p>
        </header>

        <section className="card stats">
          <h2>Total Wins</h2>
          <p className="count">{totalWins}</p>
        </section>

        <section className="card">
          <h2>Add a Tiny Win</h2>
          <form onSubmit={handleSubmit} className="win-form">
            <input
              type="text"
              placeholder="Example: Finished my workout"
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
              <option>Other</option>
            </select>

            <button type="submit">Add Win</button>
          </form>
        </section>

        <section className="card">
          <h2>Recent Wins</h2>

          {wins.length === 0 ? (
            <p>No wins yet. Add your first one.</p>
          ) : (
            <ul className="wins-list">
              {wins.map((win) => (
                <li key={win.id} className="win-item">
                  <div>
                    <h3>{win.title}</h3>
                    <p>
                      {win.category} · {win.date}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(win.id)}
                    className="delete-btn"
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