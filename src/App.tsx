import { useEffect, useRef, useState } from "react";
import { Timer } from "./Timer";
import useSound from "use-sound";
import Sound from "./sound.mp3";
import html2canvas from "html2canvas";

function App() {
  const $dom = useRef<any>(null);
  const $video = useRef<any>(null);
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

  useEffect(() => {
    html2canvas($dom.current)
      .then((canvas) => {
        const stream = canvas.captureStream();
        $video.current.srcObject = stream as any;
        $video.current.play();
      })
      .catch((err) => {
        console.error(err);
      });
  }, [tick]);

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
        <button
          onClick={async () => {
            try {
              if ($video.current !== document.pictureInPictureElement) {
                await $video.current.requestPictureInPicture();
              } else {
                await document.exitPictureInPicture();
              }
            } catch (error) {
              console.log("ERROR", error);
            }
          }}
        >
          PiP (Experimental)
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
        ref={$dom}
      >
        <Timer tick={tick} />
      </div>
      <video
        style={{ display: "none" }}
        height="100px"
        width="400px"
        ref={$video}
      />
    </div>
  );
}

export default App;
