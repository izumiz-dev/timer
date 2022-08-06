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
  TextField,
} from "@mui/material";
import styled from "styled-components";
import screenfull from "screenfull";
import Box from "@mui/system/Box";

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
  presentation,
  setPresentation,
  bells,
  setBells,
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
  presentation: boolean;
  setPresentation: any;
  bells: string[];
  setBells: any;
}): JSX.Element => {
  return (
    <Controllers>
      <div>
        <div style={{ minHeight: "80px" }}>
          {!presentation && (
            <div style={{ marginBottom: "8px" }}>
              <Typography style={{ margin: "0 2px" }}>
                タイマー時間設定
              </Typography>
              <ButtonGroup disabled={clock} style={{ marginTop: "4px" }}>
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
                  disabled={presentation}
                >
                  🍅 25分
                </Button>
              </ButtonGroup>
            </div>
          )}
          {presentation && (
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <Typography>ベル時間設定</Typography>
              <div>
                <TextField
                  size="small"
                  style={{ width: 80 }}
                  label="1ベル"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => {
                    bells[0] = event.target.value;
                    const newBells = JSON.parse(JSON.stringify(bells));
                    setBells(newBells);
                  }}
                  value={bells[0]}
                  disabled={start}
                />
                <TextField
                  size="small"
                  style={{ width: 80 }}
                  label="2ベル"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => {
                    bells[1] = event.target.value;
                    const newBells = JSON.parse(JSON.stringify(bells));
                    setBells(newBells);
                  }}
                  value={bells[1]}
                  disabled={start}
                />
                <TextField
                  size="small"
                  style={{ width: 80 }}
                  label="3ベル"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  contentEditable={false}
                  onChange={(event) => {
                    bells[2] = event.target.value;
                    const newBells = JSON.parse(JSON.stringify(bells));
                    setBells(newBells);
                  }}
                  value={bells[2]}
                  disabled={start}
                />
              </div>
            </Box>
          )}
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
            <Typography style={{ marginLeft: "4px" }}>その他モード</Typography>
            <Tooltip placement="top" title="プレゼンテーションモード">
              <FormControlLabel
                style={{ marginLeft: "4px" }}
                label="タイムキーパー"
                control={
                  <Switch onClick={() => setPresentation(!presentation)} />
                }
                disabled={pomodoro}
              />
            </Tooltip>
            <Tooltip
              placement="top"
              title="タイマーの代わりに現在時刻が表示されます。"
            >
              <FormControlLabel
                style={{ marginLeft: "4px" }}
                label="時計"
                control={<Switch onClick={() => setClock(!clock)} />}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </Controllers>
  );
};
