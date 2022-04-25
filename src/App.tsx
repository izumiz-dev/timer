import { useEffect, useRef, useState } from "react";
import { Timer } from "./Timer";
import useSound from "use-sound";
import Sound from "./sound.mp3";
import html2canvas from "html2canvas";
import * as workerTimers from "worker-timers";

function App() {
  const $dom = useRef<any>(null);
  const $video = useRef<any>(null);
  const [start, setStart] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(30 * 60);
  const [play, { stop }] = useSound(Sound);

  useEffect(() => {
    if (start) {
      const id = workerTimers.setInterval(() => {
        setTick((t) => t - 1);
      }, 1000);

      if (tick === 0) {
        play();
      }
      return () => workerTimers.clearInterval(id);
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
      <div>
        <Timer tick={tick} dom={$dom} />
      </div>
      <video style={{ display: "none" }} ref={$video} />
    </div>
  );
}

export default App;
