import React, { useState, useEffect }  from 'react';

import { Grid, Button,Typography,makeStyles,ButtonGroup,Badge,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,IconButton,TextField,
  ListItem, ListItemText, ListSubheader, List, Divider, } from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';

import { DataGrid } from '@mui/x-data-grid';
import { API, Storage } from 'aws-amplify';
import { listOperaciones, listTituloPorOperacions } from './../graphql/queries';
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
    justifyContent: 'space-between',
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

  //const [estado, setEstado] = useState('Pendiente');
  const [titulos, setTitulos] = useState([])


  const columns = [
    { field: 'id', headerName: 'Nro', width: 80, type: 'number' },
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
  }, [operaciones.length]);
 
  
  async function fetchOperaciones(estado) {

console.log('entro de nuevo ??', 'SIIII')

    let filter = {
      estado: {
          eq: estado // filter priority = 1
      },
      
  };



    const apiData = await API.graphql({ query: listOperaciones , variables: { filter: filter, sortDirection: 'DESC'},  });
    const operacionesFromAPI = apiData.data.listOperaciones.items;
    //await Promise.all(operacionesFromAPI.map(async accionista => {
    //return accionista;
    //}))
    
//    const apiData = await API.graphql(graphqlOperation(listOperaciones, { estado: 'Pendiente', sortDirection: 'ASC' }));
//    const operacionesFromAPI = apiData.data.listOperaciones.items;
    //const sorted = [...operacionesFromAPI].sort((a, b) => b['operacion'] - a['operacion']);
    //console.log('sorte',sorted)
    
    setOperaciones(operacionesFromAPI);
    if(count === 0)
      {      
      setCount(1);
      setRows(operacionesFromAPI);
      }

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

      //console.log('values',values.row);
      //console.log('operacion',values.row.id);
    };
    
    const handleRevisarOperacion = () => {
      //codigo para aprobar

      setOpenRevisar(false);    
    };
  
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
            }
          });
        })
        .catch(err => console.log(err));
        
    };



  return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

          <Grid container spacing={3} >
            <Grid item xs={12} >
                <ButtonGroup size="medium" variant="text" aria-label="text button group" style={{paddingBottom: 0, backgroundColor:'white'}} fullWidth='true'>
                    <Button variant="contained" startIcon={<EditIcon/>} size="medium" color="primary">
                        <Typography variant='subtitle2'>Pendientes</Typography>
                        <Badge color="secondary" overlap="circular" badgeContent={rows.length} style={{left: 30,}}>                         
                        </Badge>
                    </Button>
                    <Button variant="text" startIcon={<CheckIcon color='disabled'/>} size='medium'>
                        <Typography variant='subtitle2' style={{color:'grey'}}>Aprobadas</Typography>
                        <Badge color="secondary" overlap="circular" badgeContent="13" style={{left: 30,}}>                         
                        </Badge>
                    </Button>                                  
                    <Button variant="text" startIcon={<WarningIcon color='disabled'/>} size='medium'>
                        <Typography variant='subtitle2' style={{color:'grey'}}>Rechazadas</Typography>
                        <Badge color="secondary" overlap="circular" badgeContent="2" style={{left: 30,}}>                     
                        </Badge>
                    </Button>
                    <Button variant="text" startIcon={<DeleteIcon color='disabled'/>} size='medium'>
                        <Typography variant='subtitle2' style={{color:'grey'}}>Anuladas</Typography>
                        <Badge color="secondary" overlap="circular" badgeContent="0" style={{left: 30,}}>                         
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
</Grid>

<Grid item xs={4} >
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
            
          }
          > 
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
          <Button onClick={handleRevisarOperacion} color="primary" variant='contained'>
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