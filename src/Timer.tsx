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
      <OuterTimer>
        <StyledTimer tick={tick} ref={dom}>
          {Math.floor(Math.abs(tick) / 60)
            .toString()
            .padStart(2, "0")}
          :{(Math.abs(tick) % 60).toString().padStart(2, "0")}
        </StyledTimer>
      </OuterTimer>
    </>
  );
};

const StyledTimer = styled.div`
  color: ${(props: { tick: number }) =>
    props.tick < 0 ? "#bd2c00" : "#36970d"};
  font-weight: bold;
`;

const OuterTimer = styled.div`
  height: calc(100vh - 130px);
  font-size: calc(25vw + 16px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
