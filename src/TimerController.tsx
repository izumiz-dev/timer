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
  FormGroup,
  Switch,
} from "@mui/material";
import styled from "styled-components";

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

export const TimerController = ({
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
      <ButtonGroup>
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
          onClick={() => {
            setTick(0);
            setStart(false);
            stop();
          }}
          startIcon={<RestartAltIcon />}
        >
          リセット
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
      </ButtonGroup>
      <div>
        <ButtonGroup>
          <Button onClick={() => setStart(true)} startIcon={<PlayArrowIcon />}>
            開始
          </Button>
          <Button
            onClick={() => {
              setStart(false);
              stop();
            }}
            startIcon={<PauseIcon />}
          >
            一時停止
          </Button>
        </ButtonGroup>
        {isAvailablePiP && (
          <ButtonGroup>
            <Button
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
              ピクチャーインピクチャ
            </Button>
          </ButtonGroup>
        )}
      </div>
      <FormGroup>
        <FormControlLabel
          control={<Switch onClick={() => setClock(!clock)} />}
          label="時計モード"
        />
      </FormGroup>
    </Controllers>
  );
};
