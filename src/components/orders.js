import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './title';
/*
// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(0, '16 Mar, 2019', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
  createData(1, '16 Mar, 2019', 'Paul McCartney', 'London, UK', 'VISA ⠀•••• 2574', 866.99),
  createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
  createData(3, '16 Mar, 2019', 'Michael Jackson', 'Gary, IN', 'AMEX ⠀•••• 2000', 654.39),
  createData(4, '15 Mar, 2019', 'Bruce Springsteen', 'Long Branch, NJ', 'VISA ⠀•••• 5919', 212.79),
];
*/

function createData(id, operacion, fecha, cedente, cesionario, cantidad) {
    return { id, operacion, fecha, cedente, cesionario, cantidad };
  }
  
  const rows = [
    createData(0, 'Cesión', '06/09/21', 'Carlos Arosemena', 'Inversiones Imbabura', 312),
    createData(1, 'Cesión', '06/09/21', 'Beatriz Monts', 'Inversiones Imbabura', 866),
    createData(2, 'Posición Efectiva', '06/09/21', 'Esteban Palacios', 'Luis Palacios', 100),
    createData(3, 'Donación', '06/09/21', 'Vanessa Paez', 'Gilberto Perez', 654),
    createData(4, 'Bloqueo', '06/09/21', 'Roberto Marticorena', '', 212),
  ];
  

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Transferencias Pendientes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Transferencia</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Cedente</TableCell>
            <TableCell>Cesionario</TableCell>
            <TableCell align="right">Cantidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.operacion}</TableCell>
              <TableCell>{row.fecha}</TableCell>
              <TableCell>{row.cedente}</TableCell>
              <TableCell>{row.cesionario}</TableCell>
              <TableCell align="right">{row.cantidad}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}