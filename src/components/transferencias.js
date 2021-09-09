import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop:80,
    marginLeft:20,
    marginRight:20,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  h6: {
    marginBottom: '0px',
  },
  table: {
    align: 'center',
  },
  textoTable: {
    fontSize: 10,
  },
  formControl: {
    //margin: theme.spacing(2),
    //minWidth: 300,
    minWidth: 'calc(100%)',
  },
  operacion: {
    color:'#717AB4',
  },
}));

function createData(titulo, acciones, fecha) {
  return { titulo, acciones, fecha};
}

const rows = [
  createData(159,250, '15/08/20'),
  createData(237,760, '22/12/20'),
  createData(262,300, '05/01/21'),
  createData(305,820, '07/03/21'),
  createData(356,100, '11/07/21'),
];

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
];

export default function Transferencias() {
  const classes = useStyles();
  
  const [selected, setSelected] = useState([]);
  const [total, setTotal] = useState(0);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    
    //const selectedIndex = selected.indexOf(row.titulo);

    const selectedIndex = selected.map(function(e) {
      return e.titulo;
  }).indexOf(row.titulo);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }


    setSelected(newSelected);

    const sum = newSelected.reduce(function(prev, current) {
      return prev + +current.acciones
    }, 0);
    setTotal(sum);

  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={4} >
          <Paper className={classes.paper}>
            <h3 className={classes.operacion}>Cesión</h3>
            <Divider/>
            <h4>Datos Cedente</h4>            
            <h6 className={classes.h6}>Nombre</h6>
            <text>Karla María Esteban Sastri</text>
            <h6 className={classes.h6}>Cedula</h6>
            <text>1065466541</text>  
            
            <h4><br/>Títulos disponibles</h4>
            <h6 className={classes.h6}>Marcar los títulos a transferir</h6>        

            <TableContainer >
                <Table className={classes.table} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>

                    <TableCell padding="checkbox">

                    </TableCell>

                      <TableCell align="center" className={classes.textoTable} >Compra</TableCell>
                      <TableCell align="center" className={classes.textoTable} >Título</TableCell>
                      <TableCell align="center" className={classes.textoTable} >Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.titulo}
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      tabIndex={-1}
                      >

<TableCell padding="checkbox">
                        <Checkbox 
                          //checked={isItemSelected}
                          //inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>

                        <TableCell align="center" className={classes.textoTable}>{row.fecha}</TableCell>
                        <TableCell align="center" className={classes.textoTable}>{row.titulo}</TableCell>
                        <TableCell align="center" className={classes.textoTable}>{row.acciones}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>


          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
          <h3 className={classes.operacion}>Cesionario</h3>
            <Divider/>
          <FormControl className={classes.formControl}>      
                <Autocomplete
                  id="combo-box-demo"
                  options={top100Films}
                  getOptionLabel={(option) => option.title}
                  style={{ width: 'calc(100%)' }}
                  renderInput={(params) => <TextField {...params} label="Nombre" margin="normal" />}
                />


<a style={{textAlign:'right', fontSize:10}} href={''}>Crear accionista</a>

<h4>Títulos a recibir</h4>
              <TableContainer >
                <Table className={classes.table} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className={classes.textoTable} >Título</TableCell>
                      <TableCell align="center" className={classes.textoTable} >Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selected.map((row) => (
                      <TableRow key={row.titulo}>
                        <TableCell align="center" className={classes.textoTable}>{row.titulo}</TableCell>
                        <TableCell align="center" className={classes.textoTable}>{row.acciones}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <h6 className={classes.h6}>Total acciones a recibir: {total}</h6>
              
              </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper className={classes.paper}>
          <h3 className={classes.operacion}>Documentación Requerida</h3>
            <Divider/>
          </Paper>
        </Grid>

        
     </Grid>
    </div>
  );
}