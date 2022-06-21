import AddIcon from "@mui/icons-material/Add";
import PauseIcon from "@mui/icons-material/Pause";
import PictureInPictureAltIcon from "@mui/icons-material/PictureInPictureAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Button,
  ButtonGroup,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import styled from "styled-components";

const Controllers = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  align-content: stretch;
  flex-direction: column;
  border: 1px solid gray;
  padding: 8px;
  margin: 10px 16px;
  border-radius: 8px;
  width: fit-content;
  div {
    margin: 2px;
  }
`;

export const TimerController = ({
  start,
  setStart,
  tick,
  setTick,
  stop,
  isAvailablePiP,
  video,
  videoClock,
  clock,
  setClock,
}: {
  start: boolean;
  setStart: any;
  tick: any;
  setTick: any;
  stop: any;
  isAvailablePiP: boolean | undefined;
  videoClock: any;
  video: any;
  clock: boolean;
  setClock: any;
}): JSX.Element => {
  return (
    <Controllers>
      <div>
        <Typography>タイマー操作</Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ButtonGroup disabled={clock}>
            <Button
              disabled={start}
              onClick={() => setStart(true)}
              startIcon={<PlayArrowIcon />}
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
            >
              一時停止
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              disabled={!isAvailablePiP}
              onClick={async () => {
                try {
                  if (clock) {
                    if (
                      videoClock.current !== document.pictureInPictureElement
                    ) {
                      await videoClock.current.requestPictureInPicture();
                    } else {
                      await document.exitPictureInPicture();
                    }
                  } else {
                    if (video.current !== document.pictureInPictureElement) {
                      await video.current.requestPictureInPicture();
                    } else {
                      await document.exitPictureInPicture();
                    }
                  }
                } catch (error) {
                  console.log("ERROR", error);
                }
              }}
              startIcon={<PictureInPictureAltIcon />}
            >
              ピクチャーインピクチャー
            </Button>
          </ButtonGroup>
          <FormControlLabel
            style={{ marginLeft: "4px" }}
            label="時計モード"
            control={<Switch onClick={() => setClock(!clock)} />}
          />
        </div>
      </div>
      <div>
        <Typography style={{ margin: "0 2px" }}>タイマー時間設定</Typography>
        <ButtonGroup disabled={clock}>
          <Button
            color="error"
            onClick={() => setTick(tick - 10 * 60)}
            startIcon={<RemoveIcon />}
          >
            10分
          </Button>
          <Button
            color="error"
            onClick={() => setTick(tick - 5 * 60)}
            startIcon={<RemoveIcon />}
          >
            5分
          </Button>
          <Button
            color="success"
            onClick={() => setTick(tick + 5 * 60)}
            startIcon={<AddIcon />}
          >
            5分
          </Button>
          <Button
            color="success"
            onClick={() => setTick(tick + 10 * 60)}
            startIcon={<AddIcon />}
          >
            10分
          </Button>
          <Button
            onClick={() => {
              setTick(0);
              setStart(false);
              stop();
            }}
            startIcon={<RestartAltIcon />}
          >
            リセット
          </Button>
        </ButtonGroup>
      </div>
      <div style={{ width: "100%", margin: "0 4px" }}>
        <a
          href="https://www.izumiz.me/blog/pip-countdown-timer"
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="caption">Blog Post</Typography>
        </a>
        {"  "}
        <a
          href="https://github.com/izumiz-dev/negative-timer"
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="caption">Github Repo</Typography>
        </a>
        {"  "}
        <a
          href="https://twitter.com/izumiz_dev"
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="caption">Contact</Typography>
        </a>
      </div>
    </Controllers>
  );
};
