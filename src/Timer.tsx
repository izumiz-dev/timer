import screenfull from "screenfull";
import styled from "styled-components";

export const Timer = ({
  tick,
  dom,
  pomodoro,
  isPresentation,
  isHiddenCtrl,
  isDarkTheme,
}: {
  tick: number;
  dom?: React.MutableRefObject<any>;
  pomodoro: boolean;
  isPresentation: boolean;
  isHiddenCtrl: boolean;
  isDarkTheme: boolean;
}): JSX.Element => {
  return (
    <>
      <OuterTimer
        isFullScreen={screenfull.isFullscreen}
        isHiddenCtrl={isHiddenCtrl}
      >
        <StyledTimer
          pomodoro={pomodoro}
          tick={tick}
          ref={dom}
          isPresentation={isPresentation}
          isDarkTheme={isDarkTheme}
        >
          {Math.floor(Math.abs(tick) / 60)
            .toString()
            .padStart(2, "0")}
          :
          {(Math.abs(tick) % 60).toString().padStart(2, "0")}
        </StyledTimer>
      </OuterTimer>
    </>
  );
};

const StyledTimer = styled.div<{
  tick: number;
  pomodoro: boolean;
  isPresentation: boolean;
  isDarkTheme: boolean;
}>`
  color: ${({ tick, pomodoro, isPresentation, isDarkTheme }) => {
    if (isPresentation) {
      return isDarkTheme ? "#E0E0E0" : "#2C2C2C";
    }
    return pomodoro 
      ? isDarkTheme ? "#FFFFFF" : "#FFFFFF"
      : tick < 0 
        ? isDarkTheme ? "#FF6B6B" : "#E53935"
        : isDarkTheme ? "#66BB6A" : "#43A047";
  }};
  display: inline-block;
  background-color: ${({ pomodoro, isDarkTheme }) => (
    pomodoro 
      ? isDarkTheme ? "#C62828" : "#EF5350"
      : "inherit"
  )};
  border-radius: ${({ pomodoro }) => (
    pomodoro ? "12px" : "inherit"
  )};
  font-weight: 600;
  font-family: "SF Mono", Consolas, Monaco, monospace;
`;

const OuterTimer = styled.div<{ isFullScreen: boolean; isHiddenCtrl: boolean }>`
  ${(props) =>
    props.isFullScreen || props.isHiddenCtrl
      ? `height: 100vh`
      : `height: calc(100vh - 220px)`};
  font-size: calc(25vw + 16px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: height 0.3s ease;
`;
