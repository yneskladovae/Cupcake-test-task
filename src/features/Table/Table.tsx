import React, { useEffect, useState } from "react";
import s from "./Table.module.css";
import { BASE_URL, FIRST_ENDPOINTS, SECOND_ENDPOINTS, THIRD_ENDPOINTS } from "../../common/constants/constants";
import axios from "axios";

export type Endpoint = {
  source: string;
  path?: string;
  longpoll?: string;
};

export type CurrencyData = {
  [pair: string]: {
    [source: string]: number;
  };
};

export type ResponseDataType = {
  rates: {
    [currency: string]: number;
  };
  base: string;
};

export const Table = () => {
  const [currencyData, setCurrencyData] = useState<CurrencyData>({});

  useEffect(() => {
    const fetchData = async (endpoints: Endpoint[]) => {
      try {
        const responses = await Promise.all(
          endpoints.map((endpoint) => axios.get<ResponseDataType>(BASE_URL + endpoint.path)),
        );
        const updatedCurrencyData: CurrencyData = {};

        responses.forEach((response, index) => {
          const { rates, base } = response.data;
          const source = endpoints[index].source;

          Object.keys(rates).forEach((currency) => {
            if (currency !== base) {
              const pair = `${currency}/${base}`;
              updatedCurrencyData[pair] = updatedCurrencyData[pair] || {};
              updatedCurrencyData[pair][source] = rates[currency];
            }
          });
        });

        setCurrencyData(updatedCurrencyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const longPolling = async (endpoints: Endpoint[]) => {
      while (true) {
        try {
          const responses = await Promise.all(
            endpoints.map((endpoint) => axios.get<ResponseDataType>(BASE_URL + endpoint.longpoll)),
          );
          const updatedCurrencyData: CurrencyData = {};

          responses.forEach((response, index) => {
            const { rates, base } = response.data;
            const source = endpoints[index].source;

            Object.keys(rates).forEach((currency) => {
              if (currency !== base) {
                const pair = `${currency}/${base}`;
                updatedCurrencyData[pair] = updatedCurrencyData[pair] || {};
                updatedCurrencyData[pair][source] = rates[currency];
              }
            });
          });

          setCurrencyData((prevData) => ({ ...prevData, ...updatedCurrencyData }));
        } catch (error) {
          console.error("Error polling data:", error);
        }
      }
    };

    longPolling([
      { source: "First", longpoll: FIRST_ENDPOINTS.longpoll },
      { source: "Second", longpoll: SECOND_ENDPOINTS.longpoll },
      { source: "Third", longpoll: THIRD_ENDPOINTS.longpoll },
    ]);
    fetchData([
      { source: "First", path: FIRST_ENDPOINTS.path },
      { source: "Second", path: SECOND_ENDPOINTS.path },
      { source: "Third", path: THIRD_ENDPOINTS.path },
    ]);
  }, []);

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
            <td>{sources.First}</td>
            <td>{sources.Second}</td>
            <td>{sources.Third}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
