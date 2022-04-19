export const Timer = ({ tick }: { tick: number }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontSize: "25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        background: tick < 0 ? "#cdb5ae" : "#c8d5c3",
        color: tick < 0 ? "#bd2c00" : "#36970d",
      }}
    >
      <div>
        {Math.floor(Math.abs(tick) / 60)
          .toString()
          .padStart(2, "0")}
        :{(Math.abs(tick) % 60).toString().padStart(2, "0")}
      </div>
    </div>
  );
};
