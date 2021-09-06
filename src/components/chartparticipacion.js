import React from 'react';
import { useTheme } from '@material-ui/core/styles';
//import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Title from './title';

const data = [
    {
      name: 'Inv. Imbabura',
      acciones: 10000,    },
    {
      name: 'Unicom',
      acciones: 4000,
    },
    {
        name: 'Otros',
        acciones: 3000,
      },
  ];
  
export default function ChartParticipacion() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Participación</Title>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="acciones" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}