import { Timer } from "./Timer";
import Sound from "./sound.mp3";
import BellSound from "./bell.mp3";
import { detect } from "detect-browser";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import * as workerTimers from "worker-timers";
import { TimerController } from "./TimerController";
import { Clock } from "./Clock";
import screenfull from "screenfull";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";

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
  const [ringBell] = useSound(BellSound, {
    interrupt: true,
  });
  const [clock, setClock] = useState<boolean>(false);
  const [presentation, setPresentation] = useState<boolean>(false);
  const [time, setTime] = useState<Date>(new Date());
  const [pomodoro, setPomodoro] = useState<boolean>(false);
  const [bells, setBells] = useState<string[]>(["10:00", "15:00", "20:00"]);

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

      if (tick === bellToTick(bells[0])) {
        console.log("asdfasdf");
        ringBell();
      }

      if (tick === bellToTick(bells[1])) {
        ringBell();
        setTimeout(() => {
          ringBell();
        }, 200);
      }

      if (tick === bellToTick(bells[2])) {
        ringBell();
        setTimeout(() => {
          ringBell();
        }, 300);
        setTimeout(() => {
          ringBell();
        }, 600);
      }

      if (tick === 0 && !presentation) {
        play();
      }
      return () => workerTimers.clearInterval(id);
    }
  }, [tick, start, play, bells, presentation, ringBell]);

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
        <div
          style={{
            display: "flex",
            width: "100vw",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
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
            presentation={presentation}
            setPresentation={setPresentation}
            bells={bells}
            setBells={setBells}
          />
          <IconButton
            color="primary"
            size="large"
            onClick={() => {
              const w = window.open(
                "https://github.com/izumiz-dev/negative-timer",
                "_blank"
              );
              if (w) {
                w.focus();
              }
            }}
          >
            <GitHubIcon />
          </IconButton>
        </div>
      )}
      {clock ? (
        <div>
          <Clock time={time} dom={$domClock} />
        </div>
      ) : (
        <Timer
          pomodoro={pomodoro}
          tick={tick}
          dom={$dom}
          isPresentation={presentation}
        />
      )}
      {isAvailablePiP && <video style={{ display: "none" }} ref={$video} />}
      {isAvailablePiP && (
        <video style={{ display: "none" }} ref={$videoClock} />
      )}
    </>
  );
}

export default App;

const bellToTick = (bellStr: string) => {
  const minutes: number = Number(bellStr.slice(0, 2));
  const seconds: number = Number(bellStr.slice(-2));
  return -(minutes * 60 + seconds);
};
