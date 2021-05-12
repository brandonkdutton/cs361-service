import React, { FC } from 'react';
import { transformations as tr } from './types';

interface props {
  setTr: (t: tr) => void;
}

const TransformMenu: FC<props> = ({ setTr }) => {
  return (
    <fieldset>
      <label htmlFor="transformSelect">Select a transformation</label>
      <select id="transformSelect" onChange={(e) => setTr(e.target.value as tr)}>
        <option disabled selected value="">Select one...</option>
        <option value={tr.saturate}>{tr.saturate}</option>
        <option value={tr.monochrome}>{tr.monochrome}</option>
        <option value={tr.brighten}>{tr.brighten}</option>
        <option value={tr.darken}>{tr.darken}</option>
      </select>
    </fieldset>
  );
};

export default TransformMenu;