import { useEffect, useRef, useState } from "react";
import { Timer } from "./Timer";
import useSound from "use-sound";
import Sound from "./sound.mp3";
import html2canvas from "html2canvas";
import * as workerTimers from "worker-timers";
import styled from "styled-components";
import Ripple from "react-waves-effect";

const Button = styled.button`
  margin: 0px 2px;
  padding: 0;
`;

const OuterTimer = styled.div`
  height: 100vh;
  font-size: calc(25vw + 16px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
    <>
      <div id="controllers">
        <Button onClick={() => setStart(true)}>START</Button>
        <Button
          onClick={() => {
            setStart(false);
            stop();
          }}
        >
          STOP
        </Button>
        <Button
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
        </Button>
        <input
          onChange={(e) => {
            setTick(Number(e.target.value) * 60);
          }}
        />
        Mins
      </div>
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
    </>
  );
}

export default App;
