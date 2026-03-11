import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [win, setWin] = useState("");
  const [wins, setWins] = useState([]);

  useEffect(() => {
    const savedWins = JSON.parse(localStorage.getItem("wins")) || [];
    setWins(savedWins);
  }, []);

  useEffect(() => {
    localStorage.setItem("wins", JSON.stringify(wins));
  }, [wins]);

  const addWin = () => {
    if (win.trim() === "") return;

    const newWin = {
      text: win,
      date: new Date().toISOString()
    };

    setWins([newWin, ...wins]);
    setWin("");
  };

  const deleteWin = (index) => {
    const updatedWins = wins.filter((_, i) => i !== index);
    setWins(updatedWins);
  };

  const today = new Date().toDateString();

  const winsToday = wins.filter(
    (w) => new Date(w.date).toDateString() === today
  );

  return (
    <div className="container">
      <h1>Momentum Tracker</h1>
      <p className="subtitle">Celebrate small daily progress</p>

      <div className="stats">
        <div className="card">
          <h3>Total Wins</h3>
          <p>{wins.length}</p>
        </div>

        <div className="card">
          <h3>Wins Today</h3>
          <p>{winsToday.length}</p>
        </div>
      </div>

      <div className="inputSection">
        <input
          type="text"
          placeholder="What is your tiny win today?"
          value={win}
          onChange={(e) => setWin(e.target.value)}
        />
        <button onClick={addWin}>Add Win</button>
      </div>

      <ul className="winsList">
        {wins.map((w, index) => (
          <li key={index}>
            {w.text}
            <button onClick={() => deleteWin(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;