import React from 'react';
import { useTheme } from '@material-ui/core/styles';
//import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer ,} from 'recharts';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';

import Title from './title';

const data = [
    { name: 'Desmaterizalidas', value: 14000 },
    { name: 'Ordinarias', value: 3000 },
  ];
  
  const COLORS = ['#FFBB28', '#FF8042'];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

export default function ChartAcciones() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Acciones</Title>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend align="center" height={20}/>
        </PieChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}