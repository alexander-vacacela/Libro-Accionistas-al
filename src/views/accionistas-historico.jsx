import React, { useState, useEffect } from 'react';
import { API,graphqlOperation } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import { listAccionistas, getParametro, listAccionistaArchives, listAccionistasxJuntas } from '../graphql/queries';
import { createAccionistaArchive} from './../graphql/mutations';

import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import DevicesOutlinedIcon from '@material-ui/icons/DevicesOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import Grid from '@material-ui/core/Grid';

import { Tooltip, Chip, Button} from '@material-ui/core';

import { styled } from '@material-ui//styles';

  const defaultTheme = createTheme();
  const useStyles = makeStyles(
    (theme) => ({
      root: {
        padding: theme.spacing(0, 2, 0),
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'center',
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

  const Input = styled('input')({
    display: 'none',
  });
    

  function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  
  QuickSearchToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };
  


  
function QuickSearchToolbar(props) {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>    


        <GridToolbarContainer>
          <GridToolbarExport />
        </GridToolbarContainer>
      </div>
      
    );
  }


  export default function AccionistasHistorico() {


    const [cantidadEmitido, setCantidadEmitido] = useState(1);

    function getParticipacion(params) {
      return `${(params.getValue(params.id, 'cantidadAcciones') * 100 / cantidadEmitido).toFixed(8) || ''} `;
    }

    let columns = []

    columns = [
      //{ field: 'id', headerName: 'Nro', width: 80, type: 'number',},
      { 
        field: 'secuencial' , 
        headerName: 'Nro', 
        type: 'number',
        width: 50,
        //filterable: false,        
        //renderCell:(index) => index.api.getRowIndex(index.row.id) + 1
      },      
      {
        field: 'identificacion',
        headerName: 'Identificacion',
        width: 120,
      },
      {
        field: 'decevale',
        headerName: 'Decevale',
        width: 90,
      },      
      {
        field: 'nombre2',
        headerName: 'Nombre',
        width: 250,
        flex: 1 ,
      },
      {
        field: 'paisNacionalidad',
        headerName: 'Nacionalidad',
        width: 110,
      },      
      {
        field: 'direccionPais',
        headerName: 'Residencia',
        width: 110,
      },            
      {
        field: 'cantidadAcciones',
        headerName: 'Acciones',
        //type: 'number',
        width: 100,
        align: "right",
      },             
      {
        field: 'participacion',
        headerName: 'Participación',
        type: 'number',
        width: 100,
        valueGetter: getParticipacion,
      },             
      {
        field: 'tipoAcciones',
        headerName: 'Tipo',
        width: 70,
        renderCell: (cellValues) => {
          return cellValues.row.tipoAcciones == "D" ? 
          <Tooltip title="Desmaterializadas" >
            <DevicesOutlinedIcon /> 
          </Tooltip>
          : 
          <Tooltip title="Ordinarias" >
          <DescriptionOutlinedIcon color='error'/> 
        </Tooltip>
        }
      },       
      {
        field: 'estado',
        headerName: 'Estado',
        width: 110,
        renderCell: (cellValues) => {
          return <Chip size="small" variant="outlined" label={cellValues.row.estado} color={cellValues.row.estado == 'Activo' ? 'primary' : 'secondary'} />
        }
      },      
      
    ];
  
    const [accionistas, setAccionistas] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);


    useEffect(() => {

      fetchParametros();
      fetchAccionistas();
      

    }, []);
   

    async function fetchParametros() {

      const apiData = await API.graphql({ query: getParametro , variables: { id: '1' } });

      const parametrosFromAPI = apiData.data.getParametro;    

      setCantidadEmitido(parametrosFromAPI.cantidadEmitida);
  }

    async function fetchAccionistas() {

      const filter = {
        estado: {
          //eq: estado
          ne: "Inactivo"
        },
      }      
      const apiData = await API.graphql({ query: listAccionistas, variables: { filter: filter, limit: 1000} });
      const accionistasFromAPI = apiData.data.listAccionistas.items;

      let numero = 1;
      let nombre_aux = '';
      accionistasFromAPI.forEach(function (obj) {        
        nombre_aux = obj.tipoPersona == 'PN' ? obj.pn_apellidoPaterno + " " + obj.pn_apellidoMaterno + " " + obj.pn_primerNombre + " " + obj.pn_segundoNombre : obj.nombre;
        obj.nombre2 = nombre_aux.toUpperCase();
      });

      setAccionistas(accionistasFromAPI.sort(function (a, b) {
        if (a.nombre2 > b.nombre2) {
          return 1;
        }
        if (a.nombre2 < b.nombre2) {
          return -1;
        }
        // a must be equal to b
        return 0;
      }));

      accionistasFromAPI.forEach(function (obj) {
        
        obj.secuencial = numero++;
      });


      const apiData2 = await API.graphql({ query: listAccionistaArchives, variables: { filter: filter, limit: 10000} });
      const accionistasFromAPI2 = apiData2.data.listAccionistaArchives.items;


      let numero2 = 1;
      let nombre_aux2 = '';
      accionistasFromAPI2.forEach(function (obj) {        
        nombre_aux2 = obj.tipoPersona == 'PN' ? obj.pn_apellidoPaterno + " " + obj.pn_apellidoMaterno + " " + obj.pn_primerNombre + " " + obj.pn_segundoNombre : obj.nombre;
        obj.nombre2 = nombre_aux2.toUpperCase();
      });

      accionistasFromAPI2.forEach(function (obj) {        
        obj.secuencial = numero2++;
      });

      setRows(accionistasFromAPI2);
        
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

      const addCorteLibro = async () => {
        try {
            
            const transferir = accionistas.map(function(e) {
              return {
                fecha: '2022-12-31',
                id: e.id,
                tipoIdentificacion:  e.tipoIdentificacion,
                identificacion: e.identificacion,
                nombre: e.nombre,
                cantidadAcciones: e.cantidadAcciones,
                participacion: e.participacion,
                tipoAcciones: e.tipoAcciones,
                estado: e.estado,
                tipoPersona: e.tipoPersona,
                pn_primerNombre: e.pn_primerNombre,
                pn_segundoNombre: e.pn_segundoNombre,
                pn_apellidoPaterno: e.pn_apellidoPaterno,
                pn_apellidoMaterno: e.pn_apellidoMaterno,
                decevale: e.decevale,
                direccionPais: e.direccionPais,
                paisNacionalidad: e.paisNacionalidad,
                } ;
            })
    
            Promise.all(
              transferir.map(input => API.graphql(graphqlOperation(createAccionistaArchive, { input: input })))
            ).then(values => {          
                console.log('éxito creating transaction:')
            });
    
    
             } catch (err) {
            console.log('error creating transaction:', err)
        }   
      }
  


  const classes = useStyles();

  const values = {
    someDate: "2017-05-24"
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
{false &&
        <Button                
              variant="contained"
              color="primary"
              className={classes.button}
              size='medium'
              onClick={addCorteLibro}
          >
              Grabar
          </Button>
        }



                <TextField
                    size='small'
                    id="datetime-local"
                    label="Fecha"
                    //type="datetime-local"
                    type="date"
                    defaultValue={Date.now()}
                    //className={classes.textField}
                    variant="standard"
                    InputLabelProps={{
                        shrink: true
                    }}
                    //disabled
                />
            

          <DataGrid
            //getRowId= {(row) => row.code}
            style={{backgroundColor:'white'}}
            //sortModel={ [{field: 'cantidadAcciones', sort: 'desc',}]}
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
         
      </Grid>
    </main>
  );
}