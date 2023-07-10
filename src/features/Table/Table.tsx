import React from "react";
import s from "./Table.module.css";

export const Table = () => {
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
        <tr>
          <td>RUB/CUPCAKE</td>
          <td>1</td>
          <td>2</td>
          <td>3</td>
        </tr>
        <tr>
          <td>USD/CUPCAKE</td>
          <td>4</td>
          <td>5</td>
          <td>6</td>
        </tr>
        <tr>
          <td>EUR/CUPCAKE</td>
          <td>7</td>
          <td>8</td>
          <td>9</td>
        </tr>
      </tbody>
    </table>
  );
};
