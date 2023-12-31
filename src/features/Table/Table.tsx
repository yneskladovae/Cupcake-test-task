import React, { useState } from "react";
import s from "./Table.module.css";
import { FIRST_ENDPOINTS, SECOND_ENDPOINTS, THIRD_ENDPOINTS } from "../../common/constants/constants";
import { Endpoint, useLongpolling } from "../../common/hooks/useLongpolling";
import { getMinValueClass } from "../../common/utils/getMinValueClass";
import { formatValue } from "../../common/utils/formatValue";

export const Table = () => {
  const endpoints: Endpoint[] = [
    { source: "First", path: FIRST_ENDPOINTS.path, longpoll: FIRST_ENDPOINTS.longpoll },
    { source: "Second", path: SECOND_ENDPOINTS.path, longpoll: SECOND_ENDPOINTS.longpoll },
    { source: "Third", path: THIRD_ENDPOINTS.path, longpoll: THIRD_ENDPOINTS.longpoll },
  ];

  const currencyData = useLongpolling(endpoints);

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <th>Pair name/market</th>
          <th>First</th>
          <th>Second</th>
          <th>Third</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(currencyData).map(([pair, sources]) => (
          <tr key={pair}>
            <td>{pair}</td>
            <td className={getMinValueClass(pair, "First", currencyData)}>{formatValue(sources.First)}</td>
            <td className={getMinValueClass(pair, "Second", currencyData)}>{formatValue(sources.Second)}</td>
            <td className={getMinValueClass(pair, "Third", currencyData)}>{formatValue(sources.Third)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
