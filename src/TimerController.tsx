import AddIcon from "@mui/icons-material/Add";
import PauseIcon from "@mui/icons-material/Pause";
import PictureInPictureAltIcon from "@mui/icons-material/PictureInPictureAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Fullscreen } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import screenfull from "screenfull";

const Controllers = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  align-content: stretch;
  flex-direction: column;
  border: 1px solid gray;
  padding: 12px;
  margin: 8px 0px 0px 8px;
  border-radius: 8px;
  width: fit-content;
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
  pomodoro,
  setPomodoro,
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
  pomodoro: boolean;
  setPomodoro: any;
}): JSX.Element => {
  return (
    <Controllers>
      <div>
        <div style={{ marginBottom: "8px" }}>
          <Typography style={{ margin: "0 2px" }}>時間設定</Typography>
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
            <Button
              color="error"
              variant={pomodoro ? "contained" : "outlined"}
              onClick={() => {
                setTick(25 * 60);
                setPomodoro(!pomodoro);
                if (pomodoro) {
                  setTick(0);
                  setStart(false);
                  stop();
                }
              }}
            >
              🍅 25分
            </Button>
          </ButtonGroup>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "8px",
            alignItems: "flex-start",
          }}
        >
          <div style={{ marginRight: "8px" }}>
            <Typography>タイマー操作</Typography>
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
                停止
              </Button>
            </ButtonGroup>
          </div>
          <div>
            <Typography>表示設定</Typography>
            <ButtonGroup>
              <Tooltip
                placement="top"
                title="全画面で表示します。操作UIが非表示になります。"
              >
                <Button
                  onClick={() => {
                    if (screenfull.isEnabled) {
                      screenfull.request();
                    }
                  }}
                  startIcon={<Fullscreen />}
                >
                  全画面
                </Button>
              </Tooltip>
              <Tooltip
                placement="top"
                title="コンパクトなウィンドウとして表示します。"
              >
                <Button
                  disabled={!isAvailablePiP}
                  onClick={async () => {
                    try {
                      if (clock) {
                        if (
                          videoClock.current !==
                          document.pictureInPictureElement
                        ) {
                          await videoClock.current.requestPictureInPicture();
                        } else {
                          await document.exitPictureInPicture();
                        }
                      } else {
                        if (
                          video.current !== document.pictureInPictureElement
                        ) {
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
                  PiP
                </Button>
              </Tooltip>
            </ButtonGroup>
          </div>
          <div>
            <Typography style={{ marginLeft: "4px" }}>その他</Typography>
            <Tooltip
              placement="top"
              title="タイマーの代わりに現在時刻が表示されます。"
            >
              <FormControlLabel
                style={{ marginLeft: "4px" }}
                label="時計モード"
                control={<Switch onClick={() => setClock(!clock)} />}
              />
            </Tooltip>
            <Tooltip placement="top" title="今後実装予定です。">
              <FormControlLabel
                style={{ marginLeft: "4px" }}
                label="ダークテーマ"
                control={
                  <Switch onClick={() => window.alert("今後実装予定です。")} />
                }
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", margin: "0 4px" }}>
        <a
          href="https://www.izumiz.me/blog/pip-countdown-timer"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Typography variant="caption">Blog Post</Typography>
        </a>
        {"  "}
        <a
          href="https://github.com/izumiz-dev/negative-timer"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Typography variant="caption">Github Repo</Typography>
        </a>
        {"  "}
        <a
          href="https://twitter.com/izumiz_dev"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Typography variant="caption">Contact</Typography>
        </a>
      </div>
    </Controllers>
  );
};
