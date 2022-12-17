import screenfull from "screenfull";
import styled from "styled-components";

export const Timer = ({
  tick,
  dom,
  pomodoro,
  isPresentation,
  isHiddenCtrl,
}: {
  tick: number;
  dom?: React.MutableRefObject<any>;
  pomodoro: boolean;
  isPresentation: boolean;
  isHiddenCtrl: boolean;
}) => {
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
        >
          {Math.floor(Math.abs(tick) / 60)
            .toString()
            .padStart(2, "0")}
          :{(Math.abs(tick) % 60).toString().padStart(2, "0")}
        </StyledTimer>
      </OuterTimer>
    </>
  );
};

const StyledTimer = styled.div<{
  tick: number;
  pomodoro: boolean;
  isPresentation: boolean;
}>`
  color: ${({ tick, pomodoro, isPresentation }) =>
    isPresentation
      ? "#000000"
      : pomodoro
      ? "#FFFFFF"
      : tick < 0
      ? "#bd2c00"
      : "#36970d"};
  background-color: ${({ pomodoro }) => (pomodoro ? "#ed867f" : "inherit")};
  border-radius: ${({ pomodoro }) => (pomodoro ? "100px" : "inherit")};
  font-weight: bold;
  font-family: Consolas, Monaco, monospace, "ＭＳ ゴシック", "MS Gothic",
    Osaka−等幅;
`;

const OuterTimer = styled.div`
  ${(props: { isFullScreen: boolean; isHiddenCtrl: boolean }) =>
    props.isFullScreen || props.isHiddenCtrl
      ? `height: 100vh`
      : `height: calc(100vh - 220px)`};
  font-size: calc(25vw + 16px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
