import styled from "styled-components";

export const Timer = ({
  tick,
  dom,
}: {
  tick: number;
  dom?: React.MutableRefObject<any>;
}) => {
  return (
    <>
      <StyledTimer tick={tick} ref={dom}>
        {Math.floor(Math.abs(tick) / 60)
          .toString()
          .padStart(2, "0")}
        :{(Math.abs(tick) % 60).toString().padStart(2, "0")}
      </StyledTimer>
    </>
  );
};

const StyledTimer = styled.div`
  color: ${(props: { tick: number }) =>
    props.tick < 0 ? "#bd2c00" : "#36970d"};
  font-weight: bold;
  font-family: monospace;
`;
