import { useEffect, useRef, useState } from "react";
import { Timer } from "./Timer";
import useSound from "use-sound";
import Sound from "./sound.mp3";
import html2canvas from "html2canvas";
import * as workerTimers from "worker-timers";
import styled from "styled-components";
import Ripple from "react-waves-effect";
import { detect } from "detect-browser";
import "./App.css";
import { Button, ButtonGroup } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import PictureInPictureAltIcon from "@mui/icons-material/PictureInPictureAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const browser = detect();
const isAvailablePiP =
  browser?.name === "chrome" &&
  (browser?.os === "Mac OS" || browser?.os?.includes("Windows"));

console.log(JSON.stringify(browser));

const OuterTimer = styled.div`
  height: 100vh;
  font-size: calc(25vw + 16px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Controllers = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: stretch;
  flex-direction: column;
  div {
    margin: 2px;
  }
`;

const theme = createTheme({
  palette: {
    primary: {
      main: "#cecece",
    },
    secondary: {
      main: "#69a7ba",
    },
  },
});

function App() {
  const $dom = useRef<any>(null);
  const $video = useRef<any>(null);
  const [start, setStart] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(0);
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
    <>
      <ThemeProvider theme={theme}>
        <Controllers>
          <ButtonGroup>
            <Button
              variant="contained"
              color="error"
              onClick={() => setTick(tick - 10 * 60)}
              startIcon={<RemoveIcon />}
            >
              10
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setTick(tick - 5 * 60)}
              startIcon={<RemoveIcon />}
            >
              5
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTick(0);
                setStart(false);
                stop();
              }}
              startIcon={<RestartAltIcon />}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setTick(tick + 5 * 60)}
              startIcon={<AddIcon />}
            >
              5
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setTick(tick + 10 * 60)}
              startIcon={<AddIcon />}
            >
              10
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              variant="contained"
              onClick={() => setStart(true)}
              startIcon={<PlayArrowIcon />}
            >
              Start
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setStart(false);
                stop();
              }}
              startIcon={<PauseIcon />}
            >
              Pause
            </Button>
            {isAvailablePiP && (
              <Button
                variant="contained"
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
                startIcon={<PictureInPictureAltIcon />}
              >
                PiP
              </Button>
            )}
          </ButtonGroup>
        </Controllers>
        <OuterTimer>
          <Ripple
            endHeight="calc(40vh)"
            endWidth="calc(40vh)"
            animationDuration={600}
            animationEasing="ease-in-out"
            color="#000000"
            onClick={() => {
              setStart(!start);
            }}
          >
            <Timer tick={tick} dom={$dom} />
          </Ripple>
        </OuterTimer>
        <video style={{ display: "none" }} ref={$video} />
      </ThemeProvider>
    </>
  );
}

export default App;
