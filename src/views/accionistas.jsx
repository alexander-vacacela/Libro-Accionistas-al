import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import { listAccionistas, listTitulos } from '../graphql/queries';

import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import PageviewIcon from '@material-ui/icons/Pageview';
import ReorderIcon from '@material-ui/icons/Reorder';

import Grid from '@material-ui/core/Grid';


import { Typography, Modal, Button, Box, ListItem, ListItemText, ListSubheader, List,} from '@material-ui/core';


  const defaultTheme = createTheme();
  const useStyles = makeStyles(
    (theme) => ({
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
      appBarSpacer: {
        ...theme.mixins.toolbar,
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing(2),        
      },
    }),
    { defaultTheme },
  );
  

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

function QuickSearchToolbar(props) {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <TextField
          variant="standard"
          value={props.value}
          onChange={props.onChange}
          placeholder="Buscar accionista…"
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
  

  export default function Accionistas() {

    const [openTitulos, setOpenTitulos] = useState(false);
    const handleClose = () => setOpenTitulos(false);
    const columns = [
      //{ field: 'id', headerName: 'Nro', width: 80, type: 'number',},
      {
        field: 'identificacion',
        headerName: 'Identificacion',
        width: 150,
      },
      {
        field: 'nombre',
        headerName: 'Nombre',
        width: 180,
        flex: 1 ,
      },
      {
        field: 'paisNacionalidad',
        headerName: 'Nacionalidad',
        width: 150,
      },
      {
          field: 'cantidadAcciones',
          headerName: 'Acciones',
          type: 'number',
          width: 120,
        },
        {
          field: 'tipoAcciones',
          headerName: 'Tipo',
          width: 90,
        },      
        {
          field: 'estado',
          headerName: 'Estado',
          width: 110,
        },      
        {
          field: "Títulos",
          width: 100,
          renderCell: (cellValues) => {
            return <IconButton  disabled={cellValues.row.cantidadAcciones > 0 ? false : true} onClick={() => fetchTitulos(cellValues.row.id, cellValues.row.nombre)} color='primary'><PageviewIcon /></IconButton>
          }
        },

        /*
        {
          field: "Operaciones",
          width: 180,
          renderCell: (cellValues) => {
            return <Link to={{
              pathname: "/transferencias",
              state: {
                accionistaId: cellValues.row.id,
              },
            }} >Cesión</Link>;
          }
        },*/
    ];
    

    const [accionistas, setAccionistas] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(0);
    const [titulos, setTitulos] = useState([])
    const [accionistaSeleccionado, setAccionistaSeleccionado]= useState('');

    useEffect(() => {

      fetchAccionistas();


    }, [accionistas]);
   
    async function fetchAccionistas() {
      const apiData = await API.graphql({ query: listAccionistas });
      const accionistasFromAPI = apiData.data.listAccionistas.items;

      //await Promise.all(accionistasFromAPI.map(async accionista => {
      //return accionista;
      //}))

      setAccionistas(accionistasFromAPI);
      if(count === 0)
        {      
        setCount(1);
        setRows(accionistasFromAPI);
        }

    }

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = accionistas.filter((row) => {
          return Object.keys(row).some((field) => {
            //if (row[field] != null) {
            return row[field] && searchRegex.test(row[field].toString());
            //}

          });
        });
        setRows(filteredRows);
      };

      async function fetchTitulos(id, nombre) {

        let filter = {
          accionistaID: {
              eq: id // filter priority = 1
          },
          estado: {
            ne: 'Inactivo'
          }
        };
    
        const apiData = await API.graphql({ query: listTitulos, variables: { filter: filter} });
        const titulosFromAPI = apiData.data.listTitulos.items;
        setTitulos(titulosFromAPI);
        setAccionistaSeleccionado(nombre)
        setOpenTitulos(true)
        console.log('titulos', titulosFromAPI)
      }
    

  const classes = useStyles();
  return (
    <main className={classes.content}>
    <div className={classes.appBarSpacer} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
      <DataGrid
                          density="compact"             
                          autoHeight='true'
                          autoPageSize='true'
        disableColumnMenu 
        components={{ Toolbar:  QuickSearchToolbar}}
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20]}
        componentsProps={{
            toolbar: {
              value: searchText,
              onChange: (event) => requestSearch(event.target.value),
              clearSearch: () => requestSearch(''),
            },
          }}
      />
                </Grid>

      <Modal
      style={{overflow:'scroll',}}
        open={openTitulos}
        onClose={handleClose}
      >
        <Box sx={{  position: 'absolute',
        
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Títulos
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {accionistaSeleccionado}
          </Typography>

          <List dense='true'           
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around' , width: '100%', marginTop:10 , paddingRight:50 }}>              
                          <Typography variant='caption'  style={{flex: 1}}>
                            Nro. Título
                          </Typography>
                          <Typography variant='caption'  style={{flex: 1}}>
                            Acciones
                          </Typography>         
                          <Typography variant='caption'  style={{flex: 1}}>
                            Estado
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
                              <div style={{flex: 1}}>
                                <ListItemText>{item.estado}</ListItemText>
                              </div>
                            </div>
                        </ListItem>                            
                    ))}
                  </List>



        </Box>
      </Modal>


      

         </Grid>

      </main>

  );
}