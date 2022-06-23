import { Timer } from "./Timer";
import Sound from "./sound.mp3";
import { detect } from "detect-browser";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import * as workerTimers from "worker-timers";
import { TimerController } from "./TimerController";
import { Clock } from "./Clock";
import screenfull from "screenfull";

const browser = detect();
const isAvailablePiP =
  (browser?.name === "chrome" || browser?.name === "edge-chromium") &&
  (browser?.os === "Mac OS" || browser?.os?.includes("Windows"));

function App() {
  const $dom = useRef<any>(null);
  const $domClock = useRef<any>(null);
  const $video = useRef<any>(null);
  const $videoClock = useRef<any>(null);
  const [start, setStart] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(0);
  const [play, { stop }] = useSound(Sound);
  const [clock, setClock] = useState<boolean>(false);
  const [time, setTime] = useState<Date>(new Date());
  const [pomodoro, setPomodoro] = useState<boolean>(false);

  useEffect(() => {
    if (clock) {
      const id = workerTimers.setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => workerTimers.clearInterval(id);
    }
  }, [clock]);

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

  useEffect(() => {
    html2canvas($domClock.current)
      .then((canvas) => {
        const stream = canvas.captureStream();
        $videoClock.current.srcObject = stream as any;
        $videoClock.current.play();
      })
      .catch((err) => {
        console.error(err);
      });
  }, [time]);

  return (
    <>
      {!screenfull.isFullscreen && (
        <TimerController
          start={start}
          setStart={setStart}
          tick={tick}
          setTick={setTick}
          stop={stop}
          isAvailablePiP={isAvailablePiP}
          video={$video}
          videoClock={$videoClock}
          clock={clock}
          setClock={setClock}
          pomodoro={pomodoro}
          setPomodoro={setPomodoro}
        />
      )}

      {clock ? (
        <div>
          <Clock time={time} dom={$domClock} />
        </div>
      ) : (
        <Timer pomodoro={pomodoro} tick={tick} dom={$dom} />
      )}
      {isAvailablePiP && <video style={{ display: "none" }} ref={$video} />}
      {isAvailablePiP && (
        <video style={{ display: "none" }} ref={$videoClock} />
      )}
    </>
  );
}

export default App;
