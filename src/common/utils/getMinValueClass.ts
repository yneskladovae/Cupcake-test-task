import s from "../../features/Table/Table.module.css";
import { CurrencyData } from "../hooks/useLongpolling";

export const getMinValueClass = (pair: string, source: string, currencyData: CurrencyData): string => {
  if (!currencyData[pair]) return "";
  const minValue = Math.min(...Object.values(currencyData[pair]));
  return currencyData[pair][source] === minValue ? s.highlight : "";
};
