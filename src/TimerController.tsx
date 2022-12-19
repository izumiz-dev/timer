import AddIcon from "@mui/icons-material/Add";
import PauseIcon from "@mui/icons-material/Pause";
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
import NotificationsIcon from "@mui/icons-material/Notifications";
import useSound from "use-sound";
import BellSound from "./bell.mp3";
import { PiPButton } from "./components/PiPButton";

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
  const [ringBell] = useSound(BellSound, {
    interrupt: true,
  });

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
            <div style={{ display: "flex" }}>
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
              <div style={{ marginLeft: "40px" }}>
                <Typography>音量確認</Typography>
                <Button
                  style={{ marginLeft: "4px", marginTop: "6px" }}
                  size="large"
                  variant="outlined"
                  startIcon={<NotificationsIcon />}
                  onClick={() => {
                    ringBell();
                  }}
                >
                  ベルを鳴らす
                </Button>
              </div>
            </div>
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
          <div>
            <Typography>表示設定</Typography>
            <ButtonGroup>
              <Tooltip
                placement="top"
                title="タイマー部分のみ全画面で表示します"
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
                title="タイマー部分のみをピクチャインピクチャで表示します"
              >
                <PiPButton
                  isAvailablePiP={isAvailablePiP}
                  clock={clock}
                  video={video}
                  videoClock={videoClock}
                />
              </Tooltip>
            </ButtonGroup>
          </div>
          <div>
            <Typography style={{ marginLeft: "4px" }}>その他モード</Typography>
            <Tooltip
              placement="top"
              title="３回までベルを鳴らすことができるモード"
            >
              <FormControlLabel
                style={{ marginLeft: "4px" }}
                label="タイムキーパー"
                control={
                  <Switch
                    onClick={() => setPresentation(!presentation)}
                    checked={presentation}
                  />
                }
                disabled={pomodoro}
              />
            </Tooltip>
            <Tooltip placement="top" title="現在時刻が表示されます。">
              <FormControlLabel
                style={{ marginLeft: "4px" }}
                label="時計"
                control={
                  <Switch onClick={() => setClock(!clock)} checked={clock} />
                }
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </Controllers>
  );
};
