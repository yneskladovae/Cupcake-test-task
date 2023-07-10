export const formatValue = (value: number) => {
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  return "-";
};
