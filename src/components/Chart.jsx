/* eslint react/jsx-boolean-value: 0 */
import React from 'react';
import { view } from '@risingstack/react-easy-state';
import { PieChart, Pie, Cell } from 'recharts';

import mint from '../store';

const Chart = () => {
  const { tokens } = mint;
  const keys = Object.keys(tokens);

  const data = keys.map((key) => {
    const { symbol, weight } = tokens[key];
    return { name: symbol, value: weight.toNumber() };
  });

  return (
    <PieChart width={250} height={200}>
      <Pie
        dataKey="value"
        isAnimationActive={true}
        data={data}
        startAngle={45}
        endAngle={405}
        fill="#8884d8"
        label
      >
        {keys.map((key) => (
          <Cell
            key={key}
            fill={tokens[key].color || '#000000'}
          />
        ))}
      </Pie>
    </PieChart>
  );
};

export default view(Chart);
