export const Timer = ({
  tick,
  dom,
}: {
  tick: number;
  dom?: React.MutableRefObject<any>;
}) => {
  return (
    <div
      ref={dom}
      style={{
        height: "100vh",
        fontSize: "calc(25vw + 16px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: tick < 0 ? "#bd2c00" : "#36970d",
        fontWeight: "bold",
        fontFamily: "monospace",
      }}
    >
      {Math.floor(Math.abs(tick) / 60)
        .toString()
        .padStart(2, "0")}
      :{(Math.abs(tick) % 60).toString().padStart(2, "0")}
    </div>
  );
};
