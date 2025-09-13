import React, { useEffect, useRef, useState } from "react";

type Car = { x: number, y: number, dir: number, speed: number };
const WIDTH = 400, HEIGHT = 600, GRID = 40;

function randomLane() {
  let dir = Math.random() > 0.5 ? 1 : -1;
  let y = Math.floor(Math.random() * 10) * GRID + 80;
  let x = dir === 1 ? -80 : WIDTH+40;
  let speed = 2 + Math.random()*2;
  return { x, y, dir, speed };
}

export default function CrossyRoadStyleGame() {
  const [player, setPlayer] = useState({ x: WIDTH/2, y: HEIGHT-60 });
  const [cars, setCars] = useState<Car[]>([]);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setCars(cs => {
        let next = cs.map(c=>({...c, x: c.x + c.dir * c.speed}));
        if (Math.random()<0.08) next.push(randomLane());
        return next.filter(c=>c.x>-100&&c.x<WIDTH+100);
      });
    }, 18);
    return ()=>clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      for (let c of cars) {
        if (
          player.x + 30 > c.x &&
          player.x < c.x + 60 &&
          player.y + 30 > c.y &&
          player.y < c.y + 30
        ) setDead(true);
      }
    }, 60);
    return ()=>clearInterval(id);
  }, [cars, player]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (dead) return;
      if (e.key==="ArrowUp") setPlayer(p=>({...p, y: p.y-GRID, x:p.x}));
      if (e.key==="ArrowDown") setPlayer(p=>({...p, y: p.y+GRID, x:p.x}));
      if (e.key==="ArrowLeft") setPlayer(p=>({...p, x: p.x-GRID}));
      if (e.key==="ArrowRight") setPlayer(p=>({...p, x: p.x+GRID}));
    };
    window.addEventListener("keydown", key); return ()=>window.removeEventListener("keydown", key);
  }, [dead]);

  useEffect(() => {
    if (player.y < 60) {
      setScore(s=>s+1);
      setPlayer({ x: WIDTH/2, y: HEIGHT-60 });
      setCars([]);
    }
  }, [player]);

  function restart() {
    setPlayer({ x: WIDTH/2, y: HEIGHT-60 });
    setCars([]); setScore(0); setDead(false);
  }

  return (
    <div style={{ margin: 40 }}>
      <h1>Crossy Road Style Game</h1>
      <svg width={WIDTH} height={HEIGHT} style={{ border: "2px solid #222", background: "#eee" }}>
        <rect x={player.x} y={player.y} width={30} height={30} fill={dead ? "#e00" : "#0a7"} />
        {cars.map((c, i) => (
          <rect key={i} x={c.x} y={c.y} width={60} height={30} fill="#e33" />
        ))}
      </svg>
      <h2>Score: {score}</h2>
      {dead && <button onClick={restart}>Restart</button>}
    </div>
  );
}