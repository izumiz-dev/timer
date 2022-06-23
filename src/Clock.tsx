import styled from "styled-components";
import screenfull from "screenfull";

export const Clock = ({
  time,
  dom,
}: {
  time: Date;
  dom?: React.MutableRefObject<any>;
}) => {
  return (
    <>
      <OuterClock isFullScreen={screenfull.isFullscreen}>
        <StyledClock ref={dom}>{formatterHHMM.format(time)}</StyledClock>
      </OuterClock>
    </>
  );
};

const StyledClock = styled.div`
  font-weight: bold;
  font-family: Consolas, Monaco, monospace, "ＭＳ ゴシック", "MS Gothic",
    Osaka−等幅;
`;

const OuterClock = styled.div`
  ${(props: { isFullScreen: boolean }) =>
    props.isFullScreen ? `height: 100vh` : `height: calc(100vh - 220px)`};
  font-size: calc(25vw + 16px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const formatterHHMM = Intl.DateTimeFormat("ja-JP", {
  hour: "2-digit",
  minute: "2-digit",
});
