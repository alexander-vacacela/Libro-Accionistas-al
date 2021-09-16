import React, { useState, useEffect }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { Button } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { DataGrid } from '@mui/x-data-grid';
import { API } from 'aws-amplify';
import { listOperaciones } from './../graphql/queries';

import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';

import Badge from '@material-ui/core/Badge';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    appBarSpacer: {
        //display: 'flex',
        //alignItems: 'center',
        //justifyContent: 'flex-end',
        //padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing(2),        
      },
/*
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  */

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
      
    fetchOperaciones();
  }, [operaciones]);
 
  
  async function fetchOperaciones() {
    const apiData = await API.graphql({ query: listOperaciones });
    const operacionesFromAPI = apiData.data.listOperaciones.items;
    await Promise.all(operacionesFromAPI.map(async accionista => {
    return accionista;
    }))
    setOperaciones(apiData.data.listOperaciones.items);
    if(count == 0)
      {      
      setCount(1);
      setRows(apiData.data.listOperaciones.items);
      }

  }

  const requestSearch = (searchValue) => {
      setSearchText(searchValue);
      const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
      const filteredRows = operaciones.filter((row) => {
        return Object.keys(row).some((field) => {

          if (row[field] != null) {
          return searchRegex.test(row[field].toString());
          }
        });
      });
      setRows(filteredRows);
    };

    const handleClickRevisar = () => {
      setOpenRevisar(true);
    };
    
    const handleRevisarOperacion = () => {
    
  
      console.log('revisar...');
      setOpenRevisar(false);
    
    
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
                    <Button variant="outlined" startIcon={<WarningIcon/>} size='medium'>Rechazadas
                        <Badge color="secondary" overlap="circular" badgeContent="2" style={{left: 30,}}>                     
                        </Badge>
                    </Button>
                    <Button variant="outlined" startIcon={<CheckIcon/>} size='medium'>Aprobadas
                        <Badge color="secondary" overlap="circular" badgeContent="13" style={{left: 30,}}>                         
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

        <Dialog open={openRevisar} onClose={handleRevisarOperacion} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Cesión</DialogTitle>
        <DialogContent>

          <DialogContentText>
            Seleccionar los títulos a transferir
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleRevisarOperacion} color="primary" >
            Aprobar
          </Button>
        </DialogActions>
      </Dialog>


      </main>


  );
}