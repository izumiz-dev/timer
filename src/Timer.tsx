export const Timer = ({ tick }: { tick: number }) => {
  return (
    <div>
      {Math.floor(Math.abs(tick) / 60)
        .toString()
        .padStart(2, "0")}
      :{(Math.abs(tick) % 60).toString().padStart(2, "0")}
    </div>
  );
};
