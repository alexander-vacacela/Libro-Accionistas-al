import React, { useState, useEffect, Fragment } from 'react'
import { API,Storage,graphqlOperation } from 'aws-amplify';
import { getParametro, listAccionistasxJuntas, listAccionistas, listDividendos, } from '../graphql/queries';


import { makeStyles } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';

import { Grid, Typography,  Button, ListItem, ListItemText, ListSubheader, List, Chip, TextField , LinearProgress,
    FormControl,  Box, Tabs, Tab, IconButton, Checkbox, InputLabel,Select, MenuItem, 
    Dialog, DialogActions,DialogContent,DialogTitle, ListItemIcon,Snackbar, CircularProgress, Divider} from '@material-ui/core';

import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

import PageviewIcon from '@material-ui/icons/Pageview';
import CheckIcon from '@material-ui/icons/Check';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import FunctionsIcon from '@material-ui/icons/Functions';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';

import { uuid } from 'uuidv4';
import { createDividendos,  } from '../graphql/mutations';
import MuiAlert from '@material-ui/lab/Alert';

import jsPDF from "jspdf";
import "jspdf-autotable";

import logo from '../images/logoUNACEMmedMarco.jpg';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  

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
    appBarSpacer: {
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),        
    },
    button: {
        borderRadius: 20,
      }
  }),
  { defaultTheme },
);


export default function Dividendos() {

    const [accionistasCorte, setAccionistasCorte] = useState([])
    const [openAccionistas, setOpenAccionistas] = useState(false);

    const [cantidadEmitido, setCantidadEmitido] = useState(1);
    const [valorNominal, setValorNominal] = useState(1);
    const [baseImponible, setBaseImponible] = useState(0);
    const [retencionNoResidente, setRetencionNoResidente] = useState(0);

    const [FB1, setFB1] = useState(0);
    const [FB2, setFB2] = useState(0);
    const [FB3, setFB3] = useState(0);
    const [FB4, setFB4] = useState(0);
    const [FB5, setFB5] = useState(0);
    const [FB6, setFB6] = useState(0);

    const [FE1, setFE1] = useState(0);
    const [FE2, setFE2] = useState(0);
    const [FE3, setFE3] = useState(0);
    const [FE4, setFE4] = useState(0);
    const [FE5, setFE5] = useState(0);
    const [FE6, setFE6] = useState(0);

    const [RFB1, setRFB1] = useState(0);
    const [RFB2, setRFB2] = useState(0);
    const [RFB3, setRFB3] = useState(0);
    const [RFB4, setRFB4] = useState(0);
    const [RFB5, setRFB5] = useState(0);
    const [RFB6, setRFB6] = useState(0);

    const [RFE1, setRFE1] = useState(0);
    const [RFE2, setRFE2] = useState(0);
    const [RFE3, setRFE3] = useState(0);
    const [RFE4, setRFE4] = useState(0);
    const [RFE5, setRFE5] = useState(0);
    const [RFE6, setRFE6] = useState(0);

    
    const handleClose = () => 
    {
        setOpenAccionistas(false);
    }

    const [dividendos, setDividendos] = useState([]); 

    function getParticipacion(params) {
        return `${params.getValue(params.id, 'cantidadAcciones') * 100 / cantidadEmitido || ''} `;
    }

    function getDividendo(params) {
        return `${ (params.getValue(params.id, 'cantidadAcciones') * periodoSeleccionado.dividendoRepartir / cantidadEmitido).toFixed(2) || ''} `;
    }

    function getBaseImponible(params) {
        return `${ (params.getValue(params.id, 'cantidadAcciones') * periodoSeleccionado.dividendoRepartir * (baseImponible/100.00) / cantidadEmitido).toFixed(2) || ''} `;
    }
    
    function getRetencion(params) {
        let base = (params.getValue(params.id, 'cantidadAcciones') * periodoSeleccionado.dividendoRepartir * (baseImponible/100.00) / cantidadEmitido).toFixed(2)
        let num = 0;
        if  (base > FB1 && base < FE1) { num = RFB1 + (base - FB1)*RFE1/100.00; }
        if  (base > FB2 && base < FE2) { num = RFB2 + (base - FB2)*RFE2/100.00; }
        if  (base > FB3 && base < FE3) { num = RFB3 + (base - FB3)*RFE3/100.00; }
        if  (base > FB4 && base < FE4) { num = RFB4 + (base - FB4)*RFE4/100.00; }
        if  (base > FB5 && base < FE5) { num = RFB5 + (base - FB5)*RFE5/100.00; }
        if  (base > FB6 && base < FE6) { num = RFB6 + (base - FB6)*RFE6/100.00; } 
        return `${ num.toFixed(2) || ''} `;
    }

    function getNetoRecibir(params) {
        let dividendo = (params.getValue(params.id, 'cantidadAcciones') * periodoSeleccionado.dividendoRepartir / cantidadEmitido).toFixed(2);
        let base = (params.getValue(params.id, 'cantidadAcciones') * periodoSeleccionado.dividendoRepartir * (baseImponible/100.00) / cantidadEmitido).toFixed(2);
        let num = 0;
        if  (base > FB1 && base < FE1) { num = dividendo - (RFB1 + (base - FB1)*RFE1/100.00); }
        if  (base > FB2 && base < FE2) { num = dividendo - (RFB2 + (base - FB2)*RFE2/100.00); }
        if  (base > FB3 && base < FE3) { num = dividendo - (RFB3 + (base - FB3)*RFE3/100.00); }
        if  (base > FB4 && base < FE4) { num = dividendo - (RFB4 + (base - FB4)*RFE4/100.00); }
        if  (base > FB5 && base < FE5) { num = dividendo - (RFB5 + (base - FB5)*RFE5/100.00); }
        if  (base > FB6 && base < FE6) { num = dividendo - (RFB6 + (base - FB6)*RFE6/100.00); } 
        return `${ num.toFixed(2) || ''} `;
    }

    //////////////////////////////

    function getParticipacion1(cantidadAcciones) {
        return ((cantidadAcciones / cantidadEmitido) * 100.00).toFixed(16) ;
    }
    
    function getRetencion1(base, residente) {       
      
      

        let num = base*retencionNoResidente/100.00;
        //console.log("RESIDENCIAAAA",residente, base);
        //num = base*retencionNoResidente/100.00
        //if(residente == "Ecuador"){
        if  (base > FB1 && base < FE1) { num = RFB1 + (base - FB1)*RFE1/100.00; }
        if  (base > FB2 && base < FE2) { num = RFB2 + (base - FB2)*RFE2/100.00; }
        if  (base > FB3 && base < FE3) { num = RFB3 + (base - FB3)*RFE3/100.00; }
        if  (base > FB4 && base < FE4) { num = RFB4 + (base - FB4)*RFE4/100.00; }
        if  (base > FB5 && base < FE5) { num = RFB5 + (base - FB5)*RFE5/100.00; }
        if  (base > FB6 && base < FE6) { num = RFB6 + (base - FB6)*RFE6/100.00; } 
        //}
        //if(residente != "Ecuador") num = base*retencionNoResidente;


        return num.toFixed(2);
    }

    ///////////////////////////



    const [openCrearDividendo, setOpenCrearDividendo] = useState(false);
    const handleCloseCrearDividendo = () => {
        setFormData({
        periodo:  '',
        dividendo: 0,
        porcentajeRepartir: 0,
        dividendoRepartir: 0,
        fechaCorte: '',
        fechaPago: '',
        estado: 'Nuevo',
        retencion: 0,
        idDividendoOrigen:  '',
        saldoDividendo: 0,
        saldoPorcentajeDividendo: 0,
        entregado: 0,
        porEntregar: 0,
        });

        setOpenCrearDividendo(false)

    }
    
    const handleOpenCrearDividendo = () => setOpenCrearDividendo(true);

    const handleConfirmarDividendo = () => console.log("MATRIZ", accionistasCorte);

    const columns = [
        {
          field: 'periodo',
          headerName: 'Año',
          width: 80,
        },
        {
            field: 'estado',
            headerName: 'Estado',
            width: 110,
            renderCell: (cellValues) => {
              return <Chip size="small" variant="outlined" label={cellValues.row.estado} color={cellValues.row.estado == 'Nuevo' ? 'primary' : 'secondary'} />
            }
        },         
        {
          field: 'dividendo',
          headerName: 'Dividendo',
          type: 'number',
          width: 120,
        },      
        {
          field: 'porcentajeRepartir',
          headerName: '% Reparto',
          type: 'number',
          width: 80,
        },
        {
          field: 'dividendoRepartir',
          headerName: 'Repartir',
          type: 'number',
          width: 120,
        },  
        {
          field: 'fechaCorte',
          headerName: 'Corte',
          width: 90,
        },
        {
          field: 'fechaPago',
          headerName: 'Pago',
          width: 90,
        },

        /*
        {
            field: 'retencion',
            headerName: 'Retención',
            type: 'number',
            width: 120,
          }, 
          */    
          {
            field: 'saldoPorcentajeDividendo',
            headerName: 'Saldo %',
            type: 'number',
            width: 100,
          },   
          {
            field: 'saldoDividendo',
            headerName: 'Saldo Div',
            type: 'number',
            width: 120,
          },                                            
        {
          //field: "Quorum",
          field: "Acciones",
          width: 100,
          renderCell: (cellValues) => {

            setPeriodoSeleccionado(cellValues.row);

            return <Fragment> <IconButton  onClick={() =>  
              {
                fetchAccionistas(cellValues.row);
              }
            } color='primary'><DonutLargeIcon /></IconButton>

            <IconButton  onClick={() =>  
              {
                fetchAccionistas(cellValues.row);
              }
            } color='primary'><PageviewIcon /></IconButton>
            
            </Fragment>

          }
        },
        {
            field: 'entregado',
            headerName: 'Entregado',
            type: 'number',
            width: 120,
          },   
          {
            field: 'porEntregar',
            headerName: 'Por Entregar',
            type: 'number',
            width: 120,
          },             
      ];

      const columnsAccionistasCorte = [
        {
            field: 'identificacion',
            headerName: 'Identificación',
            width: 100,
        },
        {
          field: 'nombre',
          headerName: 'Nombre',
          width: 200,
        },
        {
            field: 'tipoPersona',
            headerName: 'Persona',
            width: 60,
          },              
        {
            field: 'estado',
            headerName: 'Estado',
            width: 100,
            renderCell: (cellValues) => {
              return <Chip size="small" variant="outlined" label={cellValues.row.estado} color={cellValues.row.estado == 'Activo' ? 'primary' : 'secondary'} />
            }
        },         
        {
            field: 'paisNacionalidad',
            headerName: 'Nacionalidad',
            width: 100,
        },   
        {
            field: 'direccionPais',
            headerName: 'Residencia',
            width: 100,
        },  
        {
          field: 'cantidadAcciones',
          headerName: 'Acciones',
          type: 'number',
          width: 100,
        },  
        {
            field: 'participacion',
            headerName: 'Participación',
            type: 'number',
            width: 110,
            //valueGetter: getParticipacion,
        },                   
        {
            field: 'dividendo',
            headerName: 'Dividendo',
            type: 'number',
            width: 110,
            //valueGetter: getDividendo,
          },   
          {
            field: 'baseImponible',
            headerName: 'Base Imponible',
            type: 'number',
            width: 110,
            //valueGetter: getBaseImponible,
          },   
          {
            field: 'retencion',
            headerName: 'Retención',
            type: 'number',
            width: 110,
            //valueGetter: getRetencion,
          },   
          {
            field: 'dividendoRecibido',
            headerName: 'Recibir',
            type: 'number',
            width: 110,
            //valueGetter: getNetoRecibir,
          },                        
      ];

          
    const [rows, setRows] = useState([]);

    const [periodoSeleccionado, setPeriodoSeleccionado]= useState({});

    const [openSnack, setOpenSnack] = useState(false);
    
    const [circular, setCircular] = useState(false);

    const[refrescar, setRefrescar]=useState(false);
  

    useEffect(() => {

    fetchParametros();
    fetchDividendos();
    //fetchTodosAccionistas();
    if (periodoSeleccionado.id) refrescarAccionistas();

    }, [refrescar]);
     
  
      async function fetchParametros() {
  
        const apiData = await API.graphql({ query: getParametro , variables: { id: '1' } });
  
        const parametrosFromAPI = apiData.data.getParametro;    
  
        //console.log("PARAMETROS",parametrosFromAPI);

        setCantidadEmitido(parametrosFromAPI.cantidadEmitida);
        setValorNominal(parametrosFromAPI.valorNominal);

        setBaseImponible(parametrosFromAPI.baseImponible);
        setRetencionNoResidente(parametrosFromAPI.noResidente);

        setFB1(parametrosFromAPI.IGdesde1);
        setFB2(parametrosFromAPI.IGdesde2);
        setFB3(parametrosFromAPI.IGdesde3);
        setFB4(parametrosFromAPI.IGdesde4);
        setFB5(parametrosFromAPI.IGdesde5);
        setFB6(parametrosFromAPI.IGdesde6);

        setFE1(parametrosFromAPI.IGhasta1);
        setFE2(parametrosFromAPI.IGhasta2);
        setFE3(parametrosFromAPI.IGhasta3);
        setFE4(parametrosFromAPI.IGhasta4);
        setFE5(parametrosFromAPI.IGhasta5);
        setFE6(parametrosFromAPI.IGhasta6);

        setRFB1(parametrosFromAPI.FBretencion1);
        setRFB2(parametrosFromAPI.FBretencion2);
        setRFB3(parametrosFromAPI.FBretencion3);
        setRFB4(parametrosFromAPI.FBretencion4);
        setRFB5(parametrosFromAPI.FBretencion5);
        setRFB6(parametrosFromAPI.FBretencion6);

        setRFE1(parametrosFromAPI.FEretencion1);
        setRFE2(parametrosFromAPI.FEretencion2);
        setRFE3(parametrosFromAPI.FEretencion3);
        setRFE4(parametrosFromAPI.FEretencion4);
        setRFE5(parametrosFromAPI.FEretencion5);
        setRFE6(parametrosFromAPI.FEretencion6);


    }

      async function fetchDividendos() {
        const apiData = await API.graphql({ query: listDividendos, variables: {  limit: 1000} });
        const dividendosFromAPI = apiData.data.listDividendos.items;
        setDividendos(dividendosFromAPI);
        setRows(dividendosFromAPI);          
      }

      async function fetchAccionistas(row) {


        let filter = {
          estado: {
              ne: "Inactivo" // filter priority = 1
          },
        };
    
        const apiData = await API.graphql({ query: listAccionistas, variables: { filter: filter, limit : 1000} });
        const accionistasFromAPI = apiData.data.listAccionistas.items;       

        
        console.log("PERIODO SELECCIONADO II",periodoSeleccionado.dividendoRepartir);

        const accionistasCalculo = accionistasFromAPI.map(function(e) {
            return {
                id: e.id,
                idAccionista: e.idAccionista,
                tipoIdentificacion:  e.tipoIdentificacion,
                identificacion: e.identificacion,
                nombre: e.nombre,
                direccionPais: e.direccionPais,
                paisNacionalidad: e.paisNacionalidad,
                cantidadAcciones: e.cantidadAcciones.toFixed(0),
                participacion: getParticipacion1(e.cantidadAcciones),
                tipoAcciones: e.tipoAcciones,
                estado: e.estado,
                tipoPersona: e.tipoPersona,
                decevale: e.decevale,
                idDividendo: periodoSeleccionado.id,
                periodo: periodoSeleccionado.periodo,
                dividendo:  (periodoSeleccionado.dividendoRepartir * getParticipacion1(e.cantidadAcciones) / 100.00).toFixed(2),
                baseImponible: (baseImponible * (periodoSeleccionado.dividendoRepartir * getParticipacion1(e.cantidadAcciones) / 100.00).toFixed(2) / 100.00).toFixed(2),
                retencion: getRetencion1((baseImponible * (periodoSeleccionado.dividendoRepartir * getParticipacion1(e.cantidadAcciones) / 100.00).toFixed(2) / 100.00).toFixed(2),e.direccionPais),
                dividendoRecibido: ((periodoSeleccionado.dividendoRepartir * getParticipacion1(e.cantidadAcciones) / 100.00).toFixed(2) - getRetencion1((baseImponible * (periodoSeleccionado.dividendoRepartir * getParticipacion1(e.cantidadAcciones) / 100.00).toFixed(2) / 100.00).toFixed(2),e.direccionPais)).toFixed(2),
                estadoDividendo: 'Confirmado',
                documento: '',
                solicitado: false,
                fechaSolicitud: '',
                HoraSolicitud: '',
                fechaPago: '',
            } ;
        })


        setAccionistasCorte(accionistasCalculo);
        setPeriodoSeleccionado(row)
        setOpenAccionistas(true)
      }


      async function refrescarAccionistas() {

        let filter = {
            estado: {
                ne: "Inactivo" // filter priority = 1
            },
          };
    
        const apiData = await API.graphql({ query: listAccionistas, variables: { filter: filter, limit : 1000} });
        const accionistasFromAPI = apiData.data.listAccionistas.items;       

        console.log("PERIODO SELECCIONADO",periodoSeleccionado.dividendoRepartir);

        const accionistasCalculo = accionistasFromAPI.map(function(e) {
            return {
                id: e.id,
                idAccionista: e.idAccionista,
                tipoIdentificacion:  e.tipoIdentificacion,
                identificacion: e.identificacion,
                nombre: e.nombre,
                direccionPais: e.direccionPais,
                paisNacionalidad: e.paisNacionalidad,
                cantidadAcciones: e.cantidadAcciones.toFixed(0),
                participacion: getParticipacion1(e.cantidadAcciones),
                tipoAcciones: e.tipoAcciones,
                estado: e.estado,
                tipoPersona: e.tipoPersona,
                decevale: e.decevale,
                idDividendo: periodoSeleccionado.id,
                periodo: periodoSeleccionado.periodo,
                dividendo:  (periodoSeleccionado.dividendoRepartir * getParticipacion1(e.cantidadAcciones) / 100.00).toFixed(2),
                baseImponible: (baseImponible * (periodoSeleccionado.dividendoRepartir * getParticipacion1(e.cantidadAcciones) / 100.00).toFixed(2) / 100.00).toFixed(2),
                retencion: getRetencion1((baseImponible * (periodoSeleccionado.dividendoRepartir * getParticipacion1(e.cantidadAcciones) / 100.00).toFixed(2) / 100.00).toFixed(2),e.direccionPais),
                dividendoRecibido: ((periodoSeleccionado.dividendoRepartir * getParticipacion1(e.cantidadAcciones) / 100.00).toFixed(2) - getRetencion1((baseImponible * (periodoSeleccionado.dividendoRepartir * getParticipacion1(e.cantidadAcciones) / 100.00).toFixed(2) / 100.00).toFixed(2),e.direccionPais)).toFixed(2),
                estadoDividendo: 'Confirmado',
                documento: '',
                solicitado: false,
                fechaSolicitud: '',
                HoraSolicitud: '',
                fechaPago: '',
            } ;
        })

        //console.log("PRUEBAAAAAA",accionistasCalculo);
        setAccionistasCorte(accionistasCalculo);
        }
      

    const handlePeriodoChange = (event) => {setFormData({ ...formData, 'periodo': event.target.value})};

    const handleDividendoChange = (event) => {
        setFormData({ ...formData, 'dividendo': event.target.value, 'dividendoRepartir': event.target.value * formData.porcentajeRepartir /100.00, 'saldoDividendo': event.target.value*(100.00-formData.porcentajeRepartir)/100.00, 'saldoPorcentajeDividendo': 100.0 - formData.porcentajeRepartir})};

    const handlePorcentajeRepartirChange = (event) => {
        setFormData({ ...formData, 'porcentajeRepartir': event.target.value, 'dividendoRepartir': event.target.value * formData.dividendo /100.00, 'saldoDividendo': formData.dividendo*(100.00-event.target.value)/100.00, 'saldoPorcentajeDividendo': 100.0 - event.target.value})        
    };
    
    const handleChangeFechaCorte = (event) => {
        setFormData({ ...formData, 'fechaCorte': event.target.value.split(" ")[0].split("-").reverse().join("-") })
    };
    const handleChangeFechaPago = (event) => {
        setFormData({ ...formData, 'fechaPago': event.target.value.split(" ")[0].split("-").reverse().join("-") })
    };

    const [formData, setFormData] = useState({
            periodo:  '',
            dividendo: 0,
            porcentajeRepartir: 0,
            dividendoRepartir: 0,
            fechaCorte: '',
            fechaPago: '',
            estado: 'Nuevo',
            retencion: 0,
            idDividendoOrigen:  '',
            saldoDividendo: 0,
            saldoPorcentajeDividendo: 0,
            entregado: 0,
            porEntregar: 0,
    });

      const addDividendo = async () => {
        try {
            
            if (!formData.periodo || !formData.dividendo || !formData.porcentajeRepartir || !formData.fechaCorte || !formData.fechaPago) return
    
            setCircular(true);
    
            const dividendo = { ...formData }
    
            setFormData({
                periodo:  '',
                dividendo: 0,
                porcentajeRepartir: 0,
                dividendoRepartir: 0,
                fechaCorte: '',
                fechaPago: '',
                estado: 'Nuevo',
                retencion: 0,
                idDividendoOrigen:  '',
                saldoDividendo: 0,
                saldoPorcentajeDividendo: 0,
                entregado: 0,
                porEntregar: 0,
            });
    
    
            const dividendoID = await API.graphql(graphqlOperation(createDividendos, { input: dividendo }))
        
            setCircular(false);

            handleCloseCrearDividendo();

            setRefrescar(!refrescar);

    
             } catch (err) {
            console.log('error creating transaction:', err)
        }   
      }

      

      const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnack(false);
      };


      function LinearProgressWithLabel(props) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(
                props.value,
              )}%`}</Typography>
            </Box>
          </Box>
        );
      }

      LinearProgressWithLabel.propTypes = {
        /**
         * The value of the progress indicator for the determinate and buffer variants.
         * Value between 0 and 100.
         */
        value: PropTypes.number.isRequired,
      };
      

    const classes = useStyles();

    return (

        <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>
            <Button                
                variant="contained"
                color="primary"
                className={classes.button}
                size='small'
                onClick={ handleOpenCrearDividendo }
                style={{textTransform: 'none'}}
            >
                +  Nuevo Dividendo
            </Button>                
            </div>

            <DataGrid
              style={{backgroundColor:'white'}}
              density="compact"             
              autoHeight='true'
              autoPageSize='true'
              disableColumnMenu 
              rows={rows}
              columns={columns}
              pageSize={20}
              rowsPerPageOptions={[20]}
            />
          </Grid>
  
  
          <Dialog open={openAccionistas} onClose={handleClose} aria-labelledby="form-dialog-title"  fullScreen  >          
            <DialogTitle id="form-dialog-title">Ejercicio {periodoSeleccionado.periodo}</DialogTitle>
            <DialogContent style={{height: '500px'}}>
  
                <DataGrid
                style={{backgroundColor:'white'}}
                density="compact"             
                autoHeight='true'
                maxWidth='true'
                autoPageSize='true'
                disableColumnMenu 
                rows={accionistasCorte}
                columns={columnsAccionistasCorte}
                pageSize={10}
                rowsPerPageOptions={[10]}
                />



            </DialogContent>
            <DialogActions style={{display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-end', width:'100%' }}>            
                        

             <Button onClick={handleConfirmarDividendo} variant="contained" color="primary" style={{textTransform: 'none'}}>
                Confirmar
              </Button>

              <Button onClick={handleClose} color="primary" >
                Salir
              </Button>
            </DialogActions>
          </Dialog>
  
  
          <Dialog open={openCrearDividendo} onClose={handleCloseCrearDividendo} aria-labelledby="form-dialog-title"  maxWidth = 'lg'  >          
            <DialogTitle id="form-dialog-title">Crear nuevo dividendo</DialogTitle>
            <DialogContent style={{height: '350px', width:'300px' }}>
  
            <div style={{display:'flex', flexDirection:'row', alignItems: 'flex-start', justifyContent:'space-between', width:'100%', }}>
            
                <div style={{display:'flex', flexDirection:'column', alignItems: 'flex-start', justifyContent:'space-between', width:'90%', }}>

                    <TextField
                        id="outlined-required"
                        label="Periodo"
                        value={formData.periodo}
                        onChange={handlePeriodoChange}
                        fullWidth
                    /> 

                    <TextField
                        id="outlined-required"
                        label="Dividendo"
                        value={formData.dividendo}
                        type='number'
                        onChange={handleDividendoChange}
                        fullWidth
                    /> 

                    <TextField
                        id="outlined-required"
                        label="% a repartir"
                        value={formData.porcentajeRepartir}
                        type='number'
                        onChange={handlePorcentajeRepartirChange}
                        fullWidth
                    /> 

                    <TextField
                        id="outlined-required"
                        label="Dividendo a Repartir"
                        value={formData.dividendoRepartir}                                
                        fullWidth
                        disabled
                        type='number'
                    /> 

                    <FormControl fullWidth style={{paddingTop:10}}>
                        <TextField
                            size='small'
                            id="datetime-local"
                            label="Fecha Corte"
                            type="date"
                            defaultValue={Date.now()}
                            variant="standard"
                            InputLabelProps={{
                                shrink: true,
                            }}     
                            value={formData.fechaCorte.split(" ")[0].split("-").reverse().join("-")}
                            onChange={handleChangeFechaCorte}     
                            fullWidth='false'          
                        />
                    </FormControl>
                    <FormControl fullWidth style={{paddingTop:10, marginBottom:20}}>
                        <TextField
                            size='small'
                            id="datetime-local-2"
                            label="Fecha Pago"
                            type="date"
                            defaultValue={Date.now()}
                            variant="standard"
                            InputLabelProps={{
                                shrink: true,
                            }}    
                            value={formData.fechaPago.split(" ")[0].split("-").reverse().join("-")}
                            onChange={handleChangeFechaPago}                      
                        />
                    </FormControl>

                    Saldo del periodo {formData.saldoDividendo}
                </div>

            </div>

  
            </DialogContent>
            <DialogActions>
            <Button                
                variant="contained"
                color="primary"
                className={classes.button}
                size='small'
                onClick={ addDividendo }
                style={{textTransform: 'none'}}
            >
                Crear Dividendo
            </Button>   
              <Button onClick={handleCloseCrearDividendo} color="secondary" style={{textTransform: 'none'}}>
                Salir
              </Button>
            </DialogActions>
          </Dialog>

          {circular && <CircularProgress />}
        <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
            <Alert onClose={handleCloseSnack} severity="success">
            Se registró correctamente el dividendo.
        </Alert>
      </Snackbar>
           
        </Grid>
      </main>
  


    );
}