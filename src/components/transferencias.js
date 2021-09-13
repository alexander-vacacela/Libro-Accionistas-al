import React, { useState,useEffect } from 'react';
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

import { useLocation, useHistory} from "react-router-dom";
//import { queryGetAccionista as getAccionista } from '../graphql/queries';
import { getAccionista as queryGetAccionista } from '../graphql/queries';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { listAccionistas } from './../graphql/queries';
import {createOperaciones} from './../graphql/mutations';

import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';


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
  etiqueta: {
    marginTop: '0px',
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
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

/*
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
*/
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

  const [accionistaApi, setAccionistaApi] = useState([]);
  const [titulosApi, setTitulosApi] = useState([]);
  const [accionistas, setAccionistas] = useState([]);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);

  const history = useHistory();

  const location = useLocation()
  //const { accionistaId } = location.state

  const classes = useStyles();
  
  const [selected, setSelected] = useState([]);
  const [total, setTotal] = useState(0);


  //const [operaciones, setOperaciones] = useState([]);
  const [formState, setFormState] = useState({ fecha: '2021-09-09', operacion: 'Cesión', cedente: '', titulo: '111' , acciones: 111, cesionario: 'JY', estado: 'Pendiente', usuarioIngreso: 'Jorge', usuarioAprobador: '', });

  const addOperacion = async () => {
    try {
        if (!formState.cedente || !formState.cesionario) return
        const operacion = { ...formState }
        //setOperaciones([...operaciones, operacion])
        setFormState({ fecha: '2021-09-09', operacion: 'Cesión', cedente: '', titulo: '111' , acciones: 111, cesionario: 'JY', estado: 'Pendiente', usuarioIngreso: 'Jorge', usuarioAprobador: '', })
        await API.graphql(graphqlOperation(createOperaciones, { input: operacion }))
        history.goBack();
    } catch (err) {
        console.log('error creating transaction:', err)
    }
}
  /*
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
*/
const handleClickAuto = (option, value) => {
  setFormState({ ...formState, 'cesionario': option })

}

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

    //console.log('API', accionistaApi.titulos.items);

  }

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    return
   // setFormData({ ...formData, image: file.name });
   // await Storage.put(file.name, file);
   // fetchNotes();
  }

  useEffect(() => {
    getAccionista(location.state.accionistaId);
    fetchAccionistas();
  }, [])

  async function getAccionista( idParam ) {

    const oneAccionista = await API.graphql({ query: queryGetAccionista, variables: { id: idParam  }});
    setAccionistaApi(oneAccionista.data.getAccionista);
    
    setTitulosApi(oneAccionista.data.getAccionista.titulos.items);

    setFormState({ ...formState, 'cedente': oneAccionista.data.getAccionista.nombre })
    
  }

  async function fetchAccionistas() {
    const apiData = await API.graphql({ query: listAccionistas });
    const accionistasFromAPI = apiData.data.listAccionistas.items;
    await Promise.all(accionistasFromAPI.map(async accionista => {
    return accionista;
    }))
    setAccionistas(apiData.data.listAccionistas.items);
    if(count == 0)
      {      
      setCount(1);
      setRows(apiData.data.listAccionistas.items);
      }
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
            <p className={classes.etiqueta}>{accionistaApi.nombre}</p>
            <h6 className={classes.h6}>Cedula</h6>
            <p className={classes.etiqueta}>{accionistaApi.identificacion}</p>  
            
            <h4><br/>Títulos disponibles</h4>
            <h6 className={classes.h6}>Marcar los títulos a transferir</h6>        

            <TableContainer >
                <Table className={classes.table} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>

                    <TableCell padding="checkbox">

                    </TableCell>

                      <TableCell align="center" className={classes.textoTable} >F.Compra</TableCell>
                      <TableCell align="center" className={classes.textoTable} >Título</TableCell>
                      <TableCell align="center" className={classes.textoTable} >Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {titulosApi.map((row) => (
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

                        <TableCell align="center" className={classes.textoTable}>{row.fechaCompra}</TableCell>
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
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)' }}
                  renderInput={(params) => <TextField {...params} label="Nombre" margin="normal" />}
                  //onChange={(option, value) => handleClickAuto(option, value)}
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

              <Fab variant="extended" color='primary' style = {{
                  margin: 0,
                  top: 'auto',
                  right: 20,
                  bottom: 20,
                  left: 'auto',
                  position: 'fixed',
              }} onClick={addOperacion}>
        <SaveIcon className={classes.extendedIcon} />
        Registrar
      </Fab>              
              </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper className={classes.paper}>
          <h3 className={classes.operacion}>Documentación Requerida</h3>
            <Divider/>
            <h6 className={classes.h6}>Cédula</h6>
            <input type="file" onChange={onChange}/>
            <h6 className={classes.h6}>Certificado Bancario</h6>
            <input type="file" onChange={onChange}/>
            <h6 className={classes.h6}>Carta de Cesión</h6>
            <input type="file" onChange={onChange}/>
            <h6 className={classes.h6}>Carta de Gerente</h6>
            <input type="file" onChange={onChange}/>
            <h6 className={classes.h6}>Carta de Instrucciones</h6>
            <input type="file" onChange={onChange}/>
            <h6 className={classes.h6}>Escritura</h6>
            <input type="file" onChange={onChange}/>
            <h6 className={classes.h6}>Poder</h6>
            <input type="file" onChange={onChange}/>

          </Paper>
        </Grid>

        
     </Grid>
    </div>
  );
}