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
import TwitterIcon from "@mui/icons-material/Twitter";

import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  IconButton,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { PiPButton } from "./components/PiPButton";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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
  const [isHiddenCtrl, setIsHiddenCtrl] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

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

  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <>
        {/* {!isAvailablePiP && (
          <Alert
            variant="outlined"
            severity="warning"
            style={{ margin: "2px" }}
          >
            <AlertTitle>未サポートのブラウザを検出</AlertTitle>
            申し訳ありませんが、最新版の
            <a
              href="https://www.google.com/intl/ja_jp/chrome/"
              target={"_blank"}
              rel="noreferrer"
            >
              Google Chrome
            </a>
            もしくは
            <a
              href="https://www.microsoft.com/ja-jp/edge"
              target={"_blank"}
              rel="noreferrer"
            >
              Microsoft Edge
            </a>
            をご利用ください。
            正常に機能しない場合や、予期しない誤動作が起こることがあります。
          </Alert>
        )} */}
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
                      onClick={() => setStart(true)}
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
                {localStorage.getItem("experimental") === "true" && (
                  <IconButton
                    style={{ margin: "4px 8px 0px 8px" }}
                    color="primary"
                    size="medium"
                    onClick={() => setIsDarkTheme(!isDarkTheme)}
                  >
                    {/* {isDarkTheme ? <DarkModeIcon/> : </LightModeIcon>} */}
                    {!isDarkTheme && <DarkModeIcon />}
                    {isDarkTheme && <LightModeIcon />}
                  </IconButton>
                )}
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
                <IconButton
                  style={{ margin: "4px 8px 0px 8px" }}
                  color="primary"
                  size="medium"
                  onClick={() => {
                    const w = window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        "便利なウェブタイマー timer.izumiz.me を利用しよう！"
                      )}`,
                      "_blank"
                    );
                    if (w) {
                      w.focus();
                    }
                  }}
                >
                  <TwitterIcon />
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
          />
        )}
        {isAvailablePiP && <video style={{ display: "none" }} ref={$video} />}
        {isAvailablePiP && (
          <video style={{ display: "none" }} ref={$videoClock} />
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
