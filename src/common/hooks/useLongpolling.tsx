import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";

export type CurrencyData = {
  [pair: string]: {
    [source: string]: number;
  };
};

export type ResponseData = {
  rates: {
    [currency: string]: number;
  };
  base: string;
};

export type Endpoint = {
  source: string;
  path: string;
  longpoll?: string;
};

export const useLongpolling = (endpoints: Endpoint[]) => {
  const [currencyData, setCurrencyData] = useState<CurrencyData>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          endpoints.map((endpoint) => axios.get<ResponseData>(BASE_URL + endpoint.path)),
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

    const longPolling = async () => {
      while (true) {
        try {
          const responses = await Promise.all(
            endpoints.map((endpoint) => axios.get<ResponseData>(BASE_URL + endpoint.longpoll)),
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

    fetchData();
    longPolling();
  }, []);

  return currencyData;
};
