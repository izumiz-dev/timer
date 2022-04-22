import { useEffect, useState } from "react";
import { Timer } from "./Timer";
import useSound from "use-sound";
import Sound from "./sound.mp3";

function App() {
  const [start, setStart] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(30 * 60);
  const [play, { stop }] = useSound(Sound);

  useEffect(() => {
    if (start) {
      const id = setInterval(() => {
        setTick((t) => t - 1);
      }, 1000);
      if (tick === 0) {
        play();
      }
      return () => clearInterval(id);
    }
  }, [tick, start, play]);

  return (
    <div>
      <div>
        <button onClick={() => setStart(true)}>START</button>
        <button
          onClick={() => {
            setStart(false);
            stop();
          }}
        >
          STOP
        </button>
        <input
          onChange={(e) => {
            setTick(Number(e.target.value) * 60);
          }}
        />
        Mins
      </div>
      <div
        style={{
          height: "100vh",
          fontSize: "calc(25vw + 16px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: tick < 0 ? "#bd2c00" : "#36970d",
          fontWeight: "bold",
          fontFamily: "monospace",
        }}
      >
        <Timer tick={tick} />
      </div>
    </div>
  );
}

export default App;
