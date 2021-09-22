import React, { useState, useEffect }  from 'react';

import { Grid, Button,Typography,makeStyles,ButtonGroup,Badge,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,IconButton,TextField } from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';

import { DataGrid } from '@mui/x-data-grid';
import { API, Storage } from 'aws-amplify';
import { listOperaciones } from './../graphql/queries';
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
  }, [operaciones]);
 
  
  async function fetchOperaciones(estado) {

    let filter = {
      estado: {
          eq: estado // filter priority = 1
      }
  };

    const apiData = await API.graphql({ query: listOperaciones , variables: { filter: filter} });
    const operacionesFromAPI = apiData.data.listOperaciones.items;
    //await Promise.all(operacionesFromAPI.map(async accionista => {
    //return accionista;
    //}))
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
    };
    
    const handleRevisarOperacion = () => {
      setOpenRevisar(false);    
    };
  

    const getPictureCS = e => {
      e.stopPropagation();
                
      Storage.get(transferencia.cs)
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

          <Grid container spacing={3}>
            <Grid item xs={12}>
                <ButtonGroup size="medium" aria-label="small outlined button group" style={{paddingBottom: 0}} fullWidth='true'>
                    <Button variant="contained" startIcon={<EditIcon/>} size="medium" color="primary">Pendientes                     
                        <Badge color="secondary" overlap="circular" badgeContent={rows.length} style={{left: 30,}}>                         
                        </Badge>
                    </Button>
                    <Button variant="outlined" startIcon={<CheckIcon/>} size='medium'>Aprobadas
                        <Badge color="secondary" overlap="circular" badgeContent="13" style={{left: 30,}}>                         
                        </Badge>
                    </Button>                                  
                    <Button variant="outlined" startIcon={<WarningIcon/>} size='medium'>Rechazadas
                        <Badge color="secondary" overlap="circular" badgeContent="2" style={{left: 30,}}>                     
                        </Badge>
                    </Button>
                    <Button variant="outlined" startIcon={<DeleteIcon/>} size='medium'>Anuladas
                        <Badge color="secondary" overlap="circular" badgeContent="0" style={{left: 30,}}>                         
                        </Badge>
                    </Button>
                </ButtonGroup>

                <DataGrid
                    //disableColumnMenu        
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

        <Dialog fullWidth='true' maxWidth = 'lg' open={openRevisar} onClose={handleRevisarOperacion} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{transferencia.operacion}</DialogTitle>
        <DialogContent>

          <DialogContentText>
          <Grid container>
        <Grid item xs={3} >
            <Typography variant='body2'>
              Fecha Transferencia
            </Typography>
            <Typography variant='h6'>
              {transferencia.fecha}
            </Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Typography variant='body2'>
              Cedente
            </Typography>
            <Typography variant='h6'>
              {transferencia.cedente}
            </Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Typography variant='body2'>
              Cesionario
            </Typography>
            <Typography variant='h6'>
              {transferencia.cesionario}
            </Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Typography variant='body2'>
              Titulos
            </Typography>
            <Typography variant='h6'>
              {transferencia.titulo}
            </Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Typography variant='body2'>
              Acciones
            </Typography>
            <Typography variant='h6'>
              {transferencia.acciones}
            </Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Typography variant='body2'>
              Usuario
            </Typography>
            <Typography variant='subtitle2'>
              {transferencia.usuarioIngreso}
            </Typography>
</Grid>
<Grid item xs={3} >


<Typography variant='h6'>
  Documentación
</Typography>


          <div>
            <Button component="span" color="primary" size='small' style={{marginTop:20}} onClick={getPictureCS}>Carta de Cesión</Button>
            {transferencia.cs && <IconButton ><CheckIcon /></IconButton>}
          </div>



          <div>
            <Button component="span" color="primary" size='small' onClick={getPictureCG}>Carta de Gerente</Button>
            {transferencia.cg  && <IconButton ><CheckIcon /></IconButton>}
          </div>
          <div>
            <Button component="span" color="primary" size='small' onClick={getPictureCI}>Carta de Instrucciones</Button>
            {transferencia.ci  && <IconButton ><CheckIcon /></IconButton>}
          </div>
          <div>
            <Button component="span" color="primary" size='small' onClick={getPictureES}>Escritura</Button>
            {transferencia.es  && <IconButton ><CheckIcon /></IconButton>}
          </div>
          <div>
            <Button component="span" color="primary" size='small' onClick={getPictureCP}>Carta Poder</Button>
            {transferencia.cp  && <IconButton ><CheckIcon /></IconButton>}
          </div>

</Grid>  

<Grid item xs={6} >
<img src={imageCS} alt="documento adjunto" style={{width: '100%'}} />
</Grid>  

</Grid>
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleRevisarOperacion} color="primary" variant='contained'>
            Aprobar
          </Button>
          <Button onClick={handleRevisarOperacion} style={{color: '#ef5350'}} >
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>


      </main>


  );
}