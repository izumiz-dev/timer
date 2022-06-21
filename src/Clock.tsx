import styled from "styled-components";

export const Clock = ({
  time,
  dom,
}: {
  time: Date;
  dom?: React.MutableRefObject<any>;
}) => {
  return (
    <>
      <OuterClock>
        <StyledClock ref={dom}>{formatterHHMM.format(time)}</StyledClock>
      </OuterClock>
    </>
  );
};

const StyledClock = styled.div`
  font-weight: bold;
`;

const OuterClock = styled.div`
  height: calc(100vh - 220px);
  font-size: calc(25vw + 16px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const formatterHHMM = Intl.DateTimeFormat("ja-JP", {
  hour: "2-digit",
  minute: "2-digit",
});
