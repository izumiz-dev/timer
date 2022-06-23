import screenfull from "screenfull";
import styled from "styled-components";

export const Timer = ({
  tick,
  dom,
  pomodoro,
}: {
  tick: number;
  dom?: React.MutableRefObject<any>;
  pomodoro: boolean;
}) => {
  return (
    <>
      <OuterTimer isFullScreen={screenfull.isFullscreen}>
        <StyledTimer pomodoro={pomodoro} tick={tick} ref={dom}>
          {Math.floor(Math.abs(tick) / 60)
            .toString()
            .padStart(2, "0")}
          :{(Math.abs(tick) % 60).toString().padStart(2, "0")}
        </StyledTimer>
      </OuterTimer>
    </>
  );
};

const StyledTimer = styled.div<{ tick: number; pomodoro: boolean }>`
  color: ${({ tick, pomodoro }) =>
    pomodoro ? "#FFFFFF" : tick < 0 ? "#bd2c00" : "#36970d"};
  background-color: ${({ pomodoro }) => (pomodoro ? "#ed867f" : "inherit")};
  border-radius: ${({ pomodoro }) => (pomodoro ? "100px" : "inherit")};
  font-weight: bold;
  font-family: Consolas, Monaco, monospace, "ＭＳ ゴシック", "MS Gothic",
    Osaka−等幅;
`;

const OuterTimer = styled.div`
  ${(props: { isFullScreen: boolean }) =>
    props.isFullScreen ? `height: 100vh` : `height: calc(100vh - 220px)`};
  font-size: calc(25vw + 16px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
