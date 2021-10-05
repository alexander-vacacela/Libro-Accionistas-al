import React, { useState, useEffect }  from 'react';

import { Grid, Button,Typography,makeStyles,ButtonGroup,Badge,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,IconButton,TextField,
  ListItem, ListItemText, ListSubheader, List, CircularProgress, ListItemIcon} from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutlineOutlined';
//import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/ErrorOutlineOutlined';
//import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { API, Storage } from 'aws-amplify';
import { listOperaciones, listTituloPorOperacions, getNumeroSecuencial, listTitulos,listHerederoPorOperacions } from './../graphql/queries';
import { updateTitulo, createTitulo, updateNumeroSecuencial, updateAccionista, updateOperaciones, createHeredero } from './../graphql/mutations';
import PropTypes from 'prop-types';



const useStyles = makeStyles((theme) => ({
  appBarSpacer: {
      ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),        
  },
  root: {
    padding: theme.spacing(0.5, 0.5, 0),
    justifyContent: 'flex-end',
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  textField: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    margin: theme.spacing(1, 0.5, 1.5),
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(0.5),
    },
    '& .MuiInput-underline:before': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },  
}));

  
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function QuickSearchToolbar(props) {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <TextField
          variant="standard"
          value={props.value}
          onChange={props.onChange}
          placeholder="Buscar..."
          className={classes.textField}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
            endAdornment: (
              <IconButton
                title="Clear"
                aria-label="Clear"
                size="small"
                style={{ visibility: props.value ? 'visible' : 'hidden' }}
                onClick={props.clearSearch}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
        />
        <GridToolbarContainer>
          <GridToolbarExport />
        </GridToolbarContainer>
      </div>
    );
  }
  
  QuickSearchToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

export default function Operaciones() {
  const classes = useStyles();

  const [operaciones, setOperaciones] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [openRevisar, setOpenRevisar] = useState(false);
  const [imageCS, setImageCS] = useState('');
  const [transferencia, setTransferencia] = useState([]);
  const [estado, setEstado] = useState('Pendiente');
  const [titulos, setTitulos] = useState([])
  const [countEstado, setCountEstado] = useState([0,0,0,0])
  const [circular, setCircular] = useState(false);
  const [herederos, setHerederos] = useState([]);


  const columns = [
    //{ field: 'id', headerName: 'Nro', width: 80, type: 'number' },
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 120,
      //flex: 1 ,
    },
    {
      field: 'operacion',
      headerName: 'Operación',
      width: 180,
      flex: 1 ,
    },
    {
      field: 'cedente',
      headerName: 'Cedente',
      width: 180,
      flex: 1 ,
    },
    {
        field: 'acciones',
        headerName: 'Acciones',
        type: 'number',
        width: 150,
        //flex: 1 ,
      },
      {
        field: 'cesionario',
        headerName: 'Cesionario',
        width: 180,
        flex: 1 ,
      },      
      {
        field: "Opciones",
        width: 180,
        renderCell: (cellValues) => {
          return (
            <Button
              //variant="contained"
              color="primary"
              onClick={(event) => {
                handleClickRevisar(event, cellValues);
              }}
            >
              Revisar
            </Button>
          );
        }
        /*
        renderCell: (cellValues) => {
          return <Link to={{
            flex: 1 ,
            pathname: "/",
            state: {
              accionistaId: cellValues.row.id,
            },
          }} >Revisar</Link>; 
          //return <Link to='/transferencias' >Cesión</Link>;
          //return <Link href={`#${cellValues.row.url}`}>Cesión</Link>;
        }*/
      },
  ];


  useEffect(() => {
    fetchOperaciones("Pendiente");
  }, [operaciones.length, count]);
 
  
  async function fetchOperaciones() {

    console.log('entro de nuevo ??', 'SIIII')

    let filter = {
      estado: {
          eq: estado // filter priority = 1
      },
      
  };

    const apiData = await API.graphql({ query: listOperaciones , variables: { filter: filter},  });
    const operacionesFromAPI = apiData.data.listOperaciones.items;
    
    setOperaciones(operacionesFromAPI);
    if(count === 0)
      {      
      setCount(1);
      setRows(operacionesFromAPI);
      }

      const today = new Date();
      const fecha = today.getDate() + '-' + (today.getMonth() + 1) + '-' +  today.getFullYear();

      const apiData1 = await API.graphql({ query: listOperaciones , variables: { filter: {estado:{eq:'Pendiente'}}}});
      const operacionesFromAPI1 = apiData1.data.listOperaciones.items.length; 
      const apiData2 = await API.graphql({ query: listOperaciones , variables: { filter: {estado:{eq:'Aprobada'},fechaAprobacion:{eq:fecha}}}});
      const operacionesFromAPI2 = apiData2.data.listOperaciones.items.length;
      const apiData3 = await API.graphql({ query: listOperaciones , variables: { filter: {estado:{eq:'Rechazada'}}}});
      const operacionesFromAPI3 = apiData3.data.listOperaciones.items.length;
      const apiData4 = await API.graphql({ query: listOperaciones , variables: { filter: {estado:{eq:'Anulada'},fechaAprobacion:{eq:fecha}}}});
      const operacionesFromAPI4 = apiData4.data.listOperaciones.items.length;
      setCountEstado([operacionesFromAPI1,operacionesFromAPI2,operacionesFromAPI3,operacionesFromAPI4])

  }

  const requestSearch = (searchValue) => {
      setSearchText(searchValue);
      const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
      const filteredRows = operaciones.filter((row) => {
        return Object.keys(row).some((field) => {

          //if (row[field] != null) {
          return row[field] &&searchRegex.test(row[field].toString());
          //}
        });
      });
      setRows(filteredRows);
    };

    const handleClickRevisar = (e,values) => {

      setTransferencia(values.row);
      setOpenRevisar(true);
      fetchTitulos(values.row.id);
      fetchHerederos(values.row.id);

      console.log('values',values.row);
      //console.log('operacion',values.row.id);
    };
    
    const handleRevisarOperacion = () => {

      setOpenRevisar(false);    
    };


    const handleAprobarOperacion2 = async() => {
      setCircular(true);

      if(transferencia.operacion == "Cesión")
      {

      for (const titulo of titulos) {
        console.log('titulo', titulo);
        //inactivar los titulos de cedente
        const apiData = await API.graphql({ query: updateTitulo, variables: { input: {id: titulo.tituloId, estado: 'Inactivo'} } });
        console.log('Inactivar titulos',apiData)

        //leer secuencial de titulos
        const secuen = await apiDataSecuencial();
        console.log('Secuencial',secuen)

        let tituloCesionario = {}
        let tituloCedente = {}
        //si la cantidad de acciones a transferir es la misma: crear el mismo titulo al  cesionario
        if(titulo.acciones==titulo.accionesTransferidas){
          console.log('Son iguales')
          tituloCesionario = {
            accionistaID:transferencia.idCesionario,
            titulo : titulo.titulo,
            acciones : titulo.acciones,
            fechaCompra: transferencia.fecha,
            estado:'Activo',}

            console.log('input',tituloCesionario)
            const apiDataTituloCesionario = await API.graphql({ query: createTitulo, variables: { input: tituloCesionario } });  
    
        }
        else{ //si la cantidad de acciones a transferir es menor

          //crear nuevo titulo a cesionario (cantidad a transferir)
          //incrementar secuencial de titulos
          const num = parseInt(secuen.data.getNumeroSecuencial.numerotitulo)  + 1
          const secuen2 = await apiDataUpdate(num);
          console.log('Update Secuencial',secuen2)
          console.log('Son diferentes')
          tituloCesionario = {
            accionistaID:transferencia.idCesionario,
            titulo : num,
            acciones : titulo.accionesTransferidas,
            fechaCompra: transferencia.fecha,
            estado:'Activo', };
         console.log('input',tituloCesionario)
         const apiDataTituloCesionario = await API.graphql({ query: createTitulo, variables: { input: tituloCesionario } });  
 
          //crear nuevo titulo a cedente (cantidad - cantidad a transferir)
          //incrementar secuencial de titulos
          const numCed = num  + 1
          const secuenCed = await apiDataUpdate(numCed);
          console.log('Update Secuencial',secuenCed)
          tituloCedente = {
            accionistaID:transferencia.idCedente,
            titulo : num,
            acciones : titulo.acciones - titulo.accionesTransferidas,
            fechaCompra: transferencia.fecha,
            estado:'Activo',}
          const apiDataTituloCedente = await API.graphql({ query: createTitulo, variables: { input: tituloCedente } });  
          
         };
        }


      //actualizar saldo de acciones para Cedente y Cesionario
      let filter = {
        accionistaID: {
            eq: transferencia.idCedente // filter priority = 1
        },
        estado: {
          ne: 'Inactivo'
        }
      };
      const apiDataTitulosCedente = await API.graphql({ query: listTitulos, variables: { filter: filter, limit: 1000} });
      const titulosCedenteFromAPI = apiDataTitulosCedente.data.listTitulos.items;
      console.log('busca titulos cedente',titulosCedenteFromAPI)
      let totalAccionesCedente = 0;
      titulosCedenteFromAPI.map(titulo => {totalAccionesCedente = totalAccionesCedente + titulo.acciones})
      console.log('total acciones cedente',totalAccionesCedente)

      filter = {
        accionistaID: {
            eq: transferencia.idCesionario // filter priority = 1
        },
        estado: {
          ne: 'Inactivo'
        }
      };
      const apiDataTitulosCesionario = await API.graphql({ query: listTitulos, variables: { filter: filter, limit : 1000} });
      const titulosCesionarioFromAPI = apiDataTitulosCesionario.data.listTitulos.items;
      console.log('busca titulos cedente',titulosCesionarioFromAPI)
      let totalAccionesCesionario= 0;
      titulosCesionarioFromAPI.map(titulo => {totalAccionesCesionario = totalAccionesCesionario + titulo.acciones})
      console.log('total acciones cesionario',totalAccionesCesionario)

      const apiDataUpdateCedente = await API.graphql({ query: updateAccionista, variables: { input: {id: transferencia.idCedente, cantidadAcciones: totalAccionesCedente, estado: totalAccionesCedente== 0 ? 'Inactivo' : 'Activo' } } });
      const apiDataUpdateCesionario = await API.graphql({ query: updateAccionista, variables: { input: {id: transferencia.idCesionario, cantidadAcciones: totalAccionesCesionario } } });

      console.log('Aprobar operacion y actualizar Fecha', transferencia.id)
      //actualizar estado y fechaAprobacion de operacion aprobada
      const today = new Date();
      const fecha = today.getDate() + '-' + (today.getMonth() + 1) + '-' +  today.getFullYear();
      const apiDataUpdateOper = await API.graphql({ query: updateOperaciones, variables: { input: {id: transferencia.id, estado: 'Aprobada', fechaAprobacion: fecha } } });
      console.log(' Pasó Aprobar operacion y actualizar Fecha', apiDataUpdateOper)


    }
    else if(transferencia.operacion == "Posesión Efectiva")
    {
      //obtener fecha actual
      const today = new Date();
      const fecha = today.getDate() + '-' + (today.getMonth() + 1) + '-' +  today.getFullYear();

      //Inactivar Cedente y Actualizar dato "Herederos" (true)
      const apiData = await API.graphql({ query: updateAccionista, variables: { input: {id: transferencia.idCedente,herederos: true, estado: 'Inactivo'} } });

      //Asociar Herederos al Cedente
      for (const heredero of herederos) {        
        const datosHeredero = {
          accionistaHerederoId:heredero.herederoId,
          nombre: heredero.nombre,
          cantidad:  heredero.cantidad > 0 ? heredero.cantidad : transferencia.acciones,  //heredero.cantidad, en caso sea particion
          idCedente: transferencia.idCedente,
          nombreCedente: transferencia.cedente, };
        const apiDataHeredero = await API.graphql({ query: createHeredero, variables: { input: datosHeredero } });  

        //Crear Titulos a Herederos si hay Partición
        if(heredero.cantidad > 0){
        //leer secuencial de titulos
        const secuen = await apiDataSecuencial();
        //incrementar secuencial de titulos
        const num = parseInt(secuen.data.getNumeroSecuencial.numerotitulo)  + 1
        const secuen2 = await apiDataUpdate(num);
        const tituloHeredero = {
          accionistaID:heredero.herederoId,
          titulo : num,
          acciones : heredero.cantidad,
          fechaCompra: fecha,
          estado:'Activo', };
         const apiDataTituloCesionario = await API.graphql({ query: createTitulo, variables: { input: tituloHeredero } });  
        }

  
        //Actualizar Total de Acciones de Herederos e indicar que es Heredero (true)
        let filter = {
          accionistaID: {
              eq: heredero.herederoId // filter priority = 1
          },
          estado: {
            ne: 'Inactivo'
          }
        };
        const apiDataTitulosHeredero = await API.graphql({ query: listTitulos, variables: { filter: filter, limit : 1000} });
        const titulosCedenteFromAPI = apiDataTitulosHeredero.data.listTitulos.items;
        console.log('busca titulos heredero',titulosCedenteFromAPI)
        let totalAccionesHeredero = 0;
        titulosCedenteFromAPI.map(titulo => {totalAccionesHeredero = totalAccionesHeredero + titulo.acciones})
        const apiDataAccionistaHeredero = await API.graphql({ query: updateAccionista, variables: { input: {id: heredero.herederoId, esHeredero: true, cantidadAcciones: totalAccionesHeredero + transferencia.acciones} } });

      }

        //actualizar estado y fechaAprobacion de operacion aprobada
        const apiDataUpdateOper = await API.graphql({ query: updateOperaciones, variables: { input: {id: transferencia.id, estado: 'Aprobada', fechaAprobacion: fecha } } });


    }

    setCircular(false);
    setOpenRevisar(false);          
    setCount(0);
    setTransferencia([]);
    setTitulos([]);
    fetchOperaciones("Pendiente");

    }

    async function fetchHerederos(idOper) {

      let filter = {
        operacionId: {
            eq: idOper // filter priority = 1
        }
      };
  
      const apiData = await API.graphql({ query: listHerederoPorOperacions, variables: { filter: filter} });
      const herederosFromAPI = apiData.data.listHerederoPorOperacions.items;
 
      console.log('busca herederos por Operacion',herederosFromAPI)
      setHerederos(herederosFromAPI);
      
    }
  

    const apiDataSecuencial = async() => await API.graphql({ query: getNumeroSecuencial, variables: { id: '1' } });
    const apiDataUpdate =  async(nuevoSecuencial) => await API.graphql({ query: updateNumeroSecuencial, variables: { input: {id: '1', numerotitulo: nuevoSecuencial} } });
    
    
    async function fetchTitulos(idOper) {

      let filter = {
        operacionID: {
            eq: idOper // filter priority = 1
        }
      };
  
      const apiData = await API.graphql({ query: listTituloPorOperacions, variables: { filter: filter} });
      console.log('titulos I',apiData)
      const titulosFromAPI = apiData.data.listTituloPorOperacions.items;
      console.log('titulos II',titulosFromAPI)
      //await Promise.all(titulosFromAPI.map(async titulos => {
      //return titulos;
      //}))
      setTitulos(titulosFromAPI);
      
    }



    const getPictureCS = e => {
      e.stopPropagation();
                
      Storage.get(transferencia.cs)
        .then(url => {
          var myRequest = new Request(url);
          fetch(myRequest).then(function(response) {
            if (response.status === 200) {              
              setImageCS(url);
              window.open(url)
            }
          });
        })
        .catch(err => console.log(err));
        
    };

    const getPictureCG = e => {
      e.stopPropagation();
            
      Storage.get(transferencia.cg)
        .then(url => {
          var myRequest = new Request(url);
          fetch(myRequest).then(function(response) {
            if (response.status === 200) {
              setImageCS(url);
              window.open(url)
            }
          });
        })
        .catch(err => console.log(err));
        
    };

    const getPictureCI = e => {
      e.stopPropagation();
           
      Storage.get(transferencia.ci)
        .then(url => {
          var myRequest = new Request(url);
          fetch(myRequest).then(function(response) {
            if (response.status === 200) {
              setImageCS(url);
              window.open(url)
            }
          });
        })
        .catch(err => console.log(err));
        
    };

    const getPictureES = e => {
      e.stopPropagation();
      
      Storage.get(transferencia.es)
        .then(url => {
          var myRequest = new Request(url);
          fetch(myRequest).then(function(response) {
            if (response.status === 200) {
              setImageCS(url);
              window.open(url)
            }
          });
        })
        .catch(err => console.log(err));
        
    };

    const getPictureCP = e => {
      e.stopPropagation();
            
      Storage.get(transferencia.cp)
        .then(url => {
          var myRequest = new Request(url);
          fetch(myRequest).then(function(response) {
            if (response.status === 200) {
              setImageCS(url);
              window.open(url)
            }
          });
        })
        .catch(err => console.log(err));
        
    };
    
/*
    const listarPorEstado = (estado)=>{
      fetchOperaciones(estado);
      setEstado(estado);
    }
*/

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />

        <Grid container spacing={3} >
          <Grid item xs={12} >
              <ButtonGroup size="medium" variant="text" aria-label="text button group" style={{paddingBottom: 0, backgroundColor:'white'}} fullWidth='true'>
                  <Button onClick={()=>{setEstado("Pendiente"); setCount(0) }} variant={estado=="Pendiente" ? "contained" : "text"} startIcon={<EditIcon color={estado=='Pendiente' ? 'inherit': 'disabled'}/>} size="medium" color={estado=="Pendiente" ? "primary" : 'inherit'}>
                      <Typography variant='subtitle2' style={estado=="Pendiente" ? {color:'white'} : {color:'grey'}}>Pendientes</Typography>
                      <Badge color="secondary" overlap="circular" badgeContent={countEstado[0]} style={{left: 30,}}>                         
                      </Badge>
                  </Button>
                  <Button onClick={()=>{setEstado("Aprobada"); setCount(0)}} variant={estado=="Aprobada" ? "contained" : "text"} startIcon={<CheckIcon color={estado=='Aprobada' ? 'inherit': 'disabled'}/>} size='medium' color={estado=="Aprobada" ? "primary" : 'inherit'}>
                      <Typography variant='subtitle2' style={estado=="Aprobada" ? {color:'white'} : {color:'grey'}} >Aprobadas</Typography>
                      <Badge color="secondary" overlap="circular" badgeContent={countEstado[1]} style={{left: 30,}}>                         
                      </Badge>
                  </Button>                                  
                  <Button onClick={()=>{setEstado("Rechazada"); setCount(0)}} variant={estado=="Rechazada" ? "contained" : "text"} startIcon={<WarningIcon color={estado=='Rechazada' ? 'inherit': 'disabled'}/>} size='medium' color={estado=="Rechazada" ? "primary" : 'inherit'}>
                      <Typography variant='subtitle2' style={estado=="Rechazada" ? {color:'white'} : {color:'grey'}}>Rechazadas</Typography>
                      <Badge color="secondary" overlap="circular" badgeContent={countEstado[2]} style={{left: 30,}}>                     
                      </Badge>
                  </Button>
                  <Button onClick={()=>{setEstado("Anulada"); setCount(0)}} variant={estado=="Anulada" ? "contained" : "text"} startIcon={<DeleteIcon color={estado=='Anulada' ? 'inherit': 'disabled'}/>} size='medium' color={estado=="Anulada" ? "primary" : 'inherit'}>
                      <Typography variant='subtitle2' style={estado=="Anulada" ? {color:'white'} : {color:'grey'}}>Anuladas</Typography>
                      <Badge color="secondary" overlap="circular" badgeContent={countEstado[3]} style={{left: 30,}}>                         
                      </Badge>
                  </Button>
              </ButtonGroup>

              <DataGrid
                  //disableColumnMenu
                  sortModel={ [{field: 'fecha', sort: 'desc',}]}
                  style={{backgroundColor:'white'}}
                  density="compact"             
                  autoHeight='true'
                  autoPageSize='true'
                  components={{ Toolbar: QuickSearchToolbar}}
                  rows={rows}
                  columns={columns}
                  componentsProps={{
                      toolbar: {
                      value: searchText,
                      onChange: (event) => requestSearch(event.target.value),
                      clearSearch: () => requestSearch(''),
                      },
                  }}
              />
              
          </Grid>
        </Grid>

      <Dialog fullWidth='false' maxWidth = 'md' open={openRevisar} onClose={handleRevisarOperacion} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" style={{backgroundColor:'#00BCD4'}}>
            <div>{transferencia.operacion}</div>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            <Grid container style={{display:'flex'}}>
              <Grid item xs={4} >
                <Typography variant='h6'>
                Detalle Transferencia
                </Typography>          
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Typography variant='body2'>
                <small>Fecha Solicitud</small>
                </Typography>
                <Typography variant='subtitle1'>
                  {transferencia.fecha}
                </Typography>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Typography variant='body2'>
                <small>Cedente</small>
                </Typography>
                <Typography variant='subtitle1'>
                  {transferencia.cedente}
                </Typography>

                { transferencia.operacion=='Posesión Efectiva' &&
                <List dense='true'           
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around' , width: '100%', marginTop:10 , paddingRight:70 }}>              
                          <Typography variant='caption'  style={{flex: 1}}>
                            Nro. Título
                          </Typography>
                          <Typography variant='caption'  style={{flex: 1}}>
                            Acciones
                          </Typography>                
                        </div>
                      </ListSubheader>
                      
                      }> 
                      {titulos.map(item => (
                        <ListItem key={item.id}>
                            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around', width: '100%', paddingRight:50 }}>              
                              <div style={{flex: 1}}>
                                <ListItemText>{item.titulo}</ListItemText>
                              </div>
                              <div style={{flex: 1}}>
                                <ListItemText>{item.acciones}</ListItemText>
                              </div>
                            </div>
                        </ListItem>                            
                    ))}
                  </List>
                }

                {transferencia.operacion!='Posesión Efectiva' &&
                <div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Typography variant='body2'>
                  <small>Cesionario</small>
                  </Typography>
                  <Typography variant='subtitle1'>
                    {transferencia.cesionario}
                  </Typography>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Typography variant='body2'>
                  <small>Acciones a Transferir</small>
                  </Typography>
                  <Typography variant='subtitle1' color='secondary'>
                    {transferencia.acciones}
                  </Typography>        
                </div>
                }   
              </Grid>

              <Grid item xs={4} >
                { transferencia.operacion=='Posesión Efectiva' &&
                  <div>
                    <Typography variant='h6'>
                      Herederos
                    </Typography>
                    <List dense='true' > 
                        {herederos.map(item => (
                          <ListItem key={item.id}  >
                                <ListItemIcon>
                                  <PersonOutlineIcon/>
                                </ListItemIcon>
                                <ListItemText  secondary={item.cantidad >0 && <div style={{fontSize:10, fontWeight:'bold'}}>Acciones: {item.cantidad}</div>}> {item.nombre} </ListItemText>
                          </ListItem>                            
                      ))}
                    </List>
                  </div>
                }

                {transferencia.operacion!='Posesión Efectiva' &&
                <div>
                  <Typography variant='h6'>
                    Acciones a Transferir
                  </Typography>
                  <List dense='true'           
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around' , width: '100%', marginTop:10}}>              
                          <Typography variant='caption'  style={{flex: 1}}>
                            Título
                          </Typography>
                          <Typography variant='caption'  style={{flex: 1}}>
                            Acciones
                          </Typography>                
                          <Typography variant='caption'  style={{flex: 2}}>
                            Transferir
                          </Typography>
                        </div>
                      </ListSubheader>
                      
                      }> 
                      {titulos.map(item => (
                        <ListItem key={item.id}>

                            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around', width: '100%', paddingRight:40 }}>              
                              <div style={{flex: 1}}>
                                <ListItemText>{item.titulo}</ListItemText>
                              </div>
                              <div style={{flex: 1}}>
                                <ListItemText>{item.acciones}</ListItemText>
                              </div>
                              <div style={{flex: 1}}>
                                <ListItemText style={{color:'#FFB74D'}}>{item.accionesTransferidas}</ListItemText>
                              </div>
                            </div>
                        </ListItem>                            
                    ))}
                  </List>
                </div>
                }                
                <div style={{display:'flex', justifyContent:'center'}}>
                  {circular && <CircularProgress />}
                </div>
              </Grid>

              <Grid item xs={4} >
                <Typography variant='h6'>
                  Documentación
                </Typography>
                <div>
                  <Button component="span" color="primary" size='small' style={{marginTop:20}} onClick={getPictureCS}>
                    {transferencia.operacion == 'Cesión' ? 'Carta de Cesión' : 'Carta de Posesión Efectiva'}
                    </Button>
                  {/*imageCS && <p> Mostrar <a href={imageCS}> PDF</a></p> */}
                  {transferencia.cs && <IconButton ><CheckIcon /></IconButton>}
                </div>
                <div>
                  <Button component="span" color="primary" size='small' onClick={getPictureCG}>
                  {transferencia.operacion == 'Cesión' ? 'Carta de Gerente' : 'Impuesto a la Herencia'}              
                    </Button>
                  {transferencia.cg  && <IconButton ><CheckIcon /></IconButton>}
                </div>
                <div>
                  <Button component="span" color="primary" size='small' onClick={getPictureCI}>
                  {transferencia.operacion == 'Cesión' ? 'Carta de Instrucciones' : 'Declaración Jurada'}              
                    </Button>
                  {transferencia.ci  && <IconButton ><CheckIcon /></IconButton>}
                </div>
                <div>
                  <Button component="span" color="primary" size='small' onClick={getPictureES}>
                  {transferencia.operacion == 'Cesión' ? 'Escritura' : 'Escritura de Posesión efectiva de Bienes'}
                    
                    </Button>
                  {transferencia.es  && <IconButton ><CheckIcon /></IconButton>}
                </div>
                <div>
                  <Button component="span" color="primary" size='small' onClick={getPictureCP}>Carta Poder</Button>
                  {transferencia.cp  && <IconButton ><CheckIcon /></IconButton>}
                </div>            
              </Grid>  
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{backgroundColor:'#f9f9f9', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>             
          <div style={{fontWeight:'normal', fontSize:10, color:'grey'}}>Solicitante: {transferencia.usuarioIngreso}</div>
          <div>          
            <Button onClick={handleAprobarOperacion2} color="primary" variant='contained'>
              Aprobar
            </Button>
            <Button onClick={handleRevisarOperacion}  >
              Rechazar
            </Button>
          </div>            
        </DialogActions>
      </Dialog>
    
    </main>
  );
}