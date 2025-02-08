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
import VisibilityIcon from "@mui/icons-material/Visibility";
import GitHubIcon from "@mui/icons-material/GitHub";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { Button, ButtonGroup, GlobalStyles, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { PiPButton } from "./components/PiPButton";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const browser = detect();
const isAvailablePiP: boolean =
  ((browser?.name === "chrome" || browser?.name === "edge-chromium") &&
    (browser?.os === "Mac OS" ||
      (browser?.os && browser.os.includes("Windows")))) ||
  false;

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
  const [isHiddenCtrl, setIsHiddenCtrl] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  const startTimeRef = useRef<number | null>(null);
  const initialTickRef = useRef<number>(0);

  useEffect(() => {
    if (clock) {
      setTime(new Date());

      const now = new Date().getTime();
      const delay = 1000 - (now % 1000);

      const timeoutId = workerTimers.setTimeout(() => {
        setTime(new Date());
        const intervalId = workerTimers.setInterval(() => {
          setTime(new Date());
        }, 1000);
        return () => workerTimers.clearInterval(intervalId);
      }, delay);

      return () => workerTimers.clearTimeout(timeoutId);
    }
  }, [clock]);

  useEffect(() => {
    if (start && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      initialTickRef.current = tick;
    }
    if (!start) {
      startTimeRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  useEffect(() => {
    if (start) {
      const id = workerTimers.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        const newTick = initialTickRef.current - elapsed;
        setTick(newTick);

        if (newTick === bellToTick(bells[0])) {
          ringBell();
        }
        if (newTick === bellToTick(bells[1])) {
          ringBell();
          setTimeout(() => {
            ringBell();
          }, 200);
        }
        if (newTick === bellToTick(bells[2])) {
          ringBell();
          setTimeout(() => {
            ringBell();
          }, 300);
          setTimeout(() => {
            ringBell();
          }, 600);
        }
        if (newTick === 0 && !presentation) {
          play();
        }
      }, 1000);
      return () => workerTimers.clearInterval(id);
    }
  }, [start, bells, presentation, ringBell, play]);

  useEffect(() => {
    if (!$dom.current) return;
    html2canvas($dom.current, {
      ignoreElements: (element) => element.tagName.toLowerCase() === "video",
      backgroundColor: isDarkTheme ? "#000" : "#fff",
    })
      .then((canvas) => {
        const stream = canvas.captureStream();
        if ($video.current) {
          $video.current.srcObject = stream as any;
          ($video.current as HTMLVideoElement)
            .play()
            .catch((err: DOMException) => {
              if (err.name !== "AbortError") {
                console.error("Video playback error:", err);
              }
            });
        }
      })
      .catch((err) => {
        console.error("Canvas capture error:", err);
      });
  }, [tick, isDarkTheme]);

  useEffect(() => {
    if (!$domClock.current) return;
    html2canvas($domClock.current, {
      backgroundColor: isDarkTheme ? "#000" : "#fff",
    })
      .then((canvas) => {
        const stream = canvas.captureStream();
        if ($videoClock.current) {
          $videoClock.current.srcObject = stream as any;
          ($videoClock.current as HTMLVideoElement)
            .play()
            .catch((err: any) => console.error("videoClock play error: ", err));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [time, isDarkTheme]);

  useEffect(() => {
    const unlockAudio = () => {
      const audioElements = document.getElementsByTagName("audio");
      Array.from(audioElements).forEach((el) => {
        const promise = el.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              el.pause();
              el.currentTime = 0;
            })
            .catch(() => {});
        }
      });
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
  }, []);

  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            transition: "background-color 0.5s ease",
          },
        }}
      />
      <CssBaseline />
      <>
        {!screenfull.isFullscreen && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant={isHiddenCtrl ? "contained" : "outlined"}
                endIcon={<VisibilityIcon />}
                onClick={() => setIsHiddenCtrl(!isHiddenCtrl)}
                style={{ margin: "8px 8px 0px 8px" }}
                size="medium"
              >
                {isHiddenCtrl ? "操作パネル表示" : "操作パネル非表示"}
              </Button>
              {isHiddenCtrl && (
                <div style={{ margin: "8px 8px 0px 8px" }}>
                  <ButtonGroup disabled={clock}>
                    <Button
                      disabled={start}
                      onClick={() => {
                        setStart(true);
                        if ($video.current) {
                          $video.current.play();
                        }
                        if ($videoClock.current) {
                          $videoClock.current.play();
                        }
                      }}
                      startIcon={<PlayArrowIcon />}
                      size="medium"
                    >
                      開始
                    </Button>
                    <Button
                      disabled={!start}
                      onClick={() => {
                        setStart(false);
                        stop();
                      }}
                      startIcon={<PauseIcon />}
                      size="medium"
                    >
                      停止
                    </Button>
                    <PiPButton
                      isAvailablePiP={isAvailablePiP}
                      clock={clock}
                      video={$video}
                      videoClock={$videoClock}
                    />
                  </ButtonGroup>
                </div>
              )}
              <div>
                <IconButton
                  style={{ margin: "4px 8px 0px 8px" }}
                  color="primary"
                  size="medium"
                  onClick={() => setIsDarkTheme(!isDarkTheme)}
                >
                  {!isDarkTheme && <DarkModeIcon />}
                  {isDarkTheme && <LightModeIcon />}
                </IconButton>
                <IconButton
                  style={{ margin: "4px 8px 0px 8px" }}
                  color="primary"
                  size="medium"
                  onClick={() => {
                    const w = window.open(
                      "https://github.com/izumiz-dev/timer",
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
            </div>
            {!isHiddenCtrl && (
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
              </div>
            )}
          </div>
        )}
        {clock ? (
          <div>
            <Clock time={time} dom={$domClock} isHiddenCtrl={isHiddenCtrl} />
          </div>
        ) : (
          <Timer
            pomodoro={pomodoro}
            tick={tick}
            dom={$dom}
            isPresentation={presentation}
            isHiddenCtrl={isHiddenCtrl}
            isDarkTheme={isDarkTheme} // 追加
          />
        )}
        {isAvailablePiP && (
          <video muted style={{ display: "none" }} ref={$video} />
        )}
        {isAvailablePiP && (
          <video muted style={{ display: "none" }} ref={$videoClock} />
        )}
      </>
    </ThemeProvider>
  );
}

export default App;

const bellToTick = (bellStr: string) => {
  const minutes: number = Number(bellStr.slice(0, 2));
  const seconds: number = Number(bellStr.slice(-2));
  return -(minutes * 60 + seconds);
};
