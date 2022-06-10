import React, { useState, useEffect } from 'react';
import { API,Storage,Auth,graphqlOperation } from 'aws-amplify';

import { makeStyles } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import { listAsambleas, listDividendos, listAccionistas, listAccionistasxJuntas, listOperaciones,getParametro, listHerederos } from '../graphql/queries';
import { createAccionistasxJunta, updateAsamblea } from '../graphql/mutations';

import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

import jsPDF from "jspdf";
import "jspdf-autotable";

import logo from '../images/logoUNACEMmedMarco.jpg';
import fondo from '../images/Cert1.jpg';
import QRcode from '../images/QRcode.png';

import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import HowToRegIcon from '@material-ui/icons/HowToReg';
//import ThumbUpOffAltIcon from '@material-ui/icons/ThumbUpOffAlt';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import PageviewIcon from '@material-ui/icons/Pageview';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import FaceOutlinedIcon from '@material-ui/icons/FaceOutlined';
import NotInterestedOutlinedIcon from '@material-ui/icons/NotInterestedOutlined';
import DevicesOutlinedIcon from '@material-ui/icons/DevicesOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import FiberNewOutlined from '@material-ui/icons/FiberNewOutlined';


import Grid from '@material-ui/core/Grid';

import {Card, CardContent, Typography,  Button, ListItem, ListItemText, ListSubheader, List, Tooltip, Chip, 
  FormControl, RadioGroup, FormControlLabel, Radio, Box, Tabs, Tab,
  Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle, ListItemIcon,} from '@material-ui/core';

import { uuid } from 'uuidv4';

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
  
  
export default function Accionistadashboard() {

    const [rows, setRows] = useState([]);
    const [openRegistroAsamblea, setOpenRegistroAsamblea] = useState(false);
    const [asambleaSeleccionada, setAsambleaSeleccionada]= useState({});

    const handleCloseRegistroAsamblea = () =>  setOpenRegistroAsamblea(false);    

    const handleOpenRegistroAsamblea = () => setOpenRegistroAsamblea(true);

    const [accionista, setAccionista] = useState([])

    const[refrescar, setRefrescar]=useState(false);

    const columns = [
        {
          field: 'tipo',
          headerName: 'Asamblea',
          width: 120,
        },
        {
          field: 'fecha',
          headerName: 'Fecha',
          width: 100,
        },      
        {
          field: 'hora',
          headerName: 'Hora',
          width: 80,
        },
        {
          field: 'lugar',
          headerName: 'Lugar',
          width: 120,
        },  
        {
            field: 'link',
            headerName: 'Enlace',
            width: 220,
          },                        
        {
          field: "Registrarse",
          width: 120,
          renderCell: (cellValues) => {
            return <IconButton  onClick={() =>  
              {
                //REgistrase
                //fetchAccionistas(cellValues.row);
                handleOpenRegistroAsamblea();
                setAsambleaSeleccionada(cellValues.row);
              }
            } color='primary'><HowToRegIcon /></IconButton>
          }
        }, 
        
        {
            field: 'Estado',
            headerName: 'Registrado',
            width: 120,
          },   
          {
            field: 'NombreRep',
            headerName: 'Representante',
            width: 120,
          },             
                  
      ];

      const [accionistasxJuntas, setAccionistasxJuntas] = useState([])

      async function fetchAccionistasxAsambleas() {
      
        let filter = {
          identificacion: {
              eq: userName // filter priority = 1
          },
        };
        console.log("Filtros",filter);
        const apiData2 = await API.graphql({ query: listAccionistasxJuntas, variables: { limit : 1000} });
        const accionistasxJuntasFromAPI = apiData2.data.listAccionistasxJuntas.items;       
        setAccionistasxJuntas(accionistasxJuntasFromAPI);
        console.log("accionistasxJuntasFromAPI",accionistasxJuntasFromAPI);
        //setRefrescar(!refrescar);
        
      }

      async function fetchAsambleas() {



        let filter = {
          estado: {
              eq: "Convocatoria" // filter priority = 1
          },
        };

      const apiData = await API.graphql({ query: listAsambleas, variables: {filter: filter, limit: 1000} });
      const asambleasFromAPI = apiData.data.listAsambleas.items;
      const asambleasMerge = asambleasFromAPI.map(obj => ({ ...obj, Estado: '', NombreRep: '' }))
      //let asambleasMerge2 = {} ;
/*
      let filter2 = {
        identificacion: {
            eq: userName // filter priority = 1
        },
      };
      const apiData2 = await API.graphql({ query: listAccionistasxJuntas, variables: { filter: filter2, limit : 1000} })
      const accionistasxJuntasFromAPI = apiData2.data.listAccionistasxJuntas.items;   
*/

        console.log("AHORA1",asambleasMerge) ;
        console.log("AHORA2",accionistasxJuntas) ;
/*
        for (const asambleaLoop of asambleasMerge) {
          let presente = accionistasxJuntas.find(({ asambleaID }) => asambleaID === asambleaLoop.id);
          console.log("PRESENTE",presente)
          if(presente){
            asambleaLoop.Estado = presente.estado;
            asambleasMerge2 = asambleaLoop;
          }
        }

        console.log("AHORA3",asambleasMerge2) ;
        */

        const asambleasMerge2 =  asambleasMerge.map(( asamb ) => {

          const presente = accionistasxJuntas.find(({ asambleaID,identificacion }) => (asambleaID === asamb.id && identificacion === userName));
          
          return {
            ...asamb,
            Estado: typeof(presente) !== 'undefined' ?  "Sí" : "No",
            NombreRep: typeof(presente) !== 'undefined' ? presente.representanteNombre : "",
          }

        });

        console.log("AHORA3",asambleasMerge2) ;


        //Agregar campo estado, nombre de Representante en array
        //Consultar AccionistasxJunta
        //Para cada Asamblea buscar Accionista por Identificacion y actualizar estado y nombre representante
        //No


        




/*
        const data={points:accionistasxJuntas,lines:asambleasFromAPI};

        const compileLines = ( data ) => {
          const { points, lines } = data;
          
           return lines.map(( line ) => {
            const p1 = points.find(({ asambleaID }) => asambleaID === line.id ).nombre;
            const p2 = points.find(({ asambleaID }) => asambleaID === line.id ).nombreRepresentante;
            
            return {
              ...line,
              Estado : p1,
              NombreRep : p2,
            }
          });
        }
        
        const result = compileLines( data );
        
        console.log( "RESULT", result );
*/

      //console.log("QUE SERA",result)
/*
        const asambleasMerge = asambleasFromAPI.map(obj => ({ ...obj, Estado: '', NombreRep: '' }))


        const asambleasMerge2 =  asambleasMerge.map(( asamb ) => {

          //console.log("asfasafasdf", accionistasxJuntasFromAPI);
          if(accionistasxJuntasFromAPI.length>0){
          const presente = accionistasxJuntasFromAPI.find(({ asambleaID,identificacion }) => (asambleaID === asamb.id && identificacion === userName));
          
          return {
            ...asamb,
            Estado: presente.nombre,
            NombreRep: presente.representanteNombre,
          }
        }
        else
        {
          return {
            ...asamb
          }
        }

        });
*/
        setRows(asambleasMerge2);
        //setRows(result);
          
      }

      //Todo esto es temporal solo para mostrar usabilidad
      const columnsDividendos = [
        {
            field: 'periodo',
            headerName: 'Periodo',
            width: 100,
        },
        {
          field: 'dividendo',
          type: 'number',
          headerName: 'Dividendo ($)',
          width: 130,
        },
        {
            field: 'dividendoRepartir',
            type: 'number',
            headerName: 'Repartir ($)',
            width: 120,
          },   
          {
            field: 'fechaCorte',
            headerName: 'Corte',
            width: 100,
        },          
          /*           
        {
            field: 'estado',
            headerName: 'Estado',
            width: 100,
            renderCell: (cellValues) => {
              return <Chip size="small" variant="outlined" label={cellValues.row.estado} color={cellValues.row.estado == 'Activo' ? 'primary' : 'secondary'} />
            }
        }, 
        */        
        {
          field: 'cantidadAcciones',
          headerName: 'Mis Acciones',
          type: 'number',
          width: 130,
        },  
        {
            field: 'participacion',
            headerName: 'Participación (%)',
            type: 'number',
            width: 150,
            //valueGetter: getParticipacion,
        },                   
        {
            field: 'dividendoRecibir',
            headerName: 'Mi Dividendo ($)',
            type: 'number',
            width: 130,
            //valueGetter: getDividendo,
          },   

          {
            field: 'retencion',
            headerName: 'Retención ($)',
            type: 'number',
            width: 130,
            //valueGetter: getRetencion,
          },   
          {
            field: 'dividendoRecibido',
            headerName: 'Recibir ($)',
            type: 'number',
            width: 120,
            //valueGetter: getNetoRecibir,
          }, 
          {
            field: "Confirmar",
            width: 120,
            renderCell: (cellValues) => {
              return <IconButton  onClick={() =>  
                {
                  //REgistrase
                  //fetchAccionistas(cellValues.row);
                }
              } color='primary'><ThumbUpAltIcon /></IconButton>
            }
          },                                  
      ];

      function getParticipacion1(cantidadAcciones) {
        return ((cantidadAcciones / 42930108) * 100.00).toFixed(16) ;
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
    

      const [dividendos, setDividendos] = useState([]); 

      async function fetchDividendos() {
        const apiData = await API.graphql({ query: listDividendos, variables: {  limit: 1000} });
        const dividendosFromAPI = apiData.data.listDividendos.items;


////////////////

const accionistaCalculo = dividendosFromAPI.map(function(e) {
    return {
        id: e.id,
        cantidadAcciones: 4500,
        participacion: getParticipacion1(4500),
        periodo: e.periodo,
        dividendo: e.dividendo,
        porcentajeRepartir: e.porcentajeRepartir,
        dividendoRepartir: e.dividendoRepartir,
        fechaCorte: e.fechaCorte,
        fechaPago: e.fechaPago,
        estado: e.estado,
        dividendoRecibir:  (e.dividendoRepartir * getParticipacion1(4500) / 100.00).toFixed(2),
        baseImponible: (baseImponible * (e.dividendoRepartir * getParticipacion1(4500) / 100.00).toFixed(2) / 100.00).toFixed(2),
        retencion: getRetencion1((baseImponible * (e.dividendoRepartir * getParticipacion1(4500) / 100.00).toFixed(2) / 100.00).toFixed(2),e.direccionPais),
        dividendoRecibido: ((e.dividendoRepartir * getParticipacion1(4500) / 100.00).toFixed(2) - getRetencion1((baseImponible * (e.dividendoRepartir * getParticipacion1(4500) / 100.00).toFixed(2) / 100.00).toFixed(2),e.direccionPais)).toFixed(2),
        estadoDividendo: 'Confirmado',
        fechaSolicitud: '',
    } ;
})


setDividendos(accionistaCalculo);





/////////////

        //setDividendos(dividendosFromAPI);
        //setRows(dividendosFromAPI);          
      }

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

    async function onChangeHabilitante1(e) {
      if (!e.target.files[0]){
        console.log('entro al cancelar')
        return
      }
      const file = e.target.files[0];
      const filename = uuid() + file.name
      setIDRepresentante({ filename });
      await Storage.put(filename, file);
      }

      const [userName, setUserName] = useState("");

      useEffect(() => {

        const user = getUser();
        setUserName(user);
        fetchParametros();
        fetchPerfilUsuario(user);

        fetchAsambleas();
        
        fetchAccionistasxAsambleas();
        
        fetchDividendos();
  
        

      }, [refrescar,accionistasxJuntas.length]);

      function getUser() {
        //console.log("AUTH.USER",Auth.user);
        let user 
        if(Auth.user != null) user = Auth.user.username;
        return user;
        }
  

        async function fetchPerfilUsuario(user) {

          let filter = {
            identificacion: {
                  eq: user // filter priority = 1
              },
            };
  
            //console.log("PARAMETRO", user);
            const apiData = await API.graphql({ query: listAccionistas, variables: { filter: filter, limit: 1000} });
            const accionistaFromAPI = apiData.data.listAccionistas.items;
            setAccionista(accionistaFromAPI);
            //console.log("Accionista", accionistaFromAPI);      
        }
  

      const exportPDFCertificado = async() => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        //const orientation = "portrait"; // portrait or landscape
        const orientation = "landscape"; // portrait or landscape
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(12);
      
        const title = "Unacem Ecuador S.A." ;

        doc.addImage(fondo,"JPEG",0,3,840,590)    

        doc.addImage(logo,"JPEG",668,93,80,30)

        doc.addImage(QRcode,"PNG",667,420,80,80)

        doc.setFontSize(24);
        doc.text(title, 320, 150);

        doc.setFontSize(12);
        doc.text("Capital Suscrito y Autorizado USD 1,717,204.32", 310, 170);

        doc.setFontSize(10);
        const texto1 = "Este Certificado acredita que";
        doc.text(texto1, 370, 250);            
        
        const texto2 = accionista[0].nombre + " con Identificacion " + accionista[0].tipoIdentificacion + " " + accionista[0].identificacion;
        doc.text(texto2, 270, 270);            
      
        const texto3 = "es propietario de " + accionista[0].cantidadAcciones + " acciones" ;
        doc.text(texto3, 340, 290);    

        const texto4 = "con todos los derechos y obligaciones que le corresponden a la Ley y los Estatutos Sociales de la Compañia." ;
        doc.text(texto4, 190, 310);    

        //const texto5 = "Expedido el 08 de Junio del 2022" ;
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"];

        const d = new Date();
        
        const texto5 = "Expedido el " + d.getDate() + " de " + months[d.getMonth()] + " del " + d.getFullYear();
        //const texto5 = "Expedido el " + d.getDate() + " de " + months[d.getMonth()] + " del " + d.getFullYear() + " a las " + d.getHours() + ":" + ('0'+d.getMinutes()).slice(-2) + " horas.";
        doc.text(texto5, 350, 350);    


        doc.setFontSize(8);
        doc.setTextColor(150);
        const texto6 = "Fuente de Información plataforma de accionistas Unacem https://main.d1uap272r7bnzf.amplifyapp.com/"
        doc.text(texto6, 95, 500);            

        
//        doc.autoTable(content);

/*
        doc.addPage("A4","l");
        doc.text("Total accionistas :     " + totalAccionistas.toString(), marginLeft, 50);
        doc.text("Total acciones    :     " + num.toString(), marginLeft, 80);
*/    
    
        doc.save("CertificadoAccionistas.pdf")
        
      }
    
      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const [nombreRepresentante, setNombreRepresentante] = useState('');
    const [identificacionRepresentante, setIdentificacionRepresentante] = useState('');
    const [IDRepresentante,setIDRepresentante] = useState('');

    const addAccionista = async () => {
      try {
          
          //idAsamblea.stopPropagation();
          //console.log("Nro Asamblea",asambleaSeleccionada.id);
          
          //if (!valCedente ) return
  
          const accionista2 =  { asambleaID:asambleaSeleccionada.id, accionistaID: accionista[0].id, nombre: accionista[0].nombre, identificacion: accionista[0].identificacion, acciones: accionista[0].cantidadAcciones, estado: accionista[0].estado, presente: 'false', representanteNombre: nombreRepresentante, representanteDocumento: identificacionRepresentante, representanteDI: IDRepresentante.filename, 
          votacion1: asambleaSeleccionada.votacionTema1 ? true : '',
          votacion2: asambleaSeleccionada.votacionTema2 ? true : '',
          votacion3: asambleaSeleccionada.votacionTema3 ? true : '',
          votacion4: asambleaSeleccionada.votacionTema4 ? true : '',
          votacion5: asambleaSeleccionada.votacionTema5 ? true : '',
          votacion6: asambleaSeleccionada.votacionTema6 ? true : '',
          votacion7: asambleaSeleccionada.votacionTema7 ? true : '',
          votacion8: asambleaSeleccionada.votacionTema8 ? true : '',
          votacion9: asambleaSeleccionada.votacionTema9 ? true : '',
          votacion10: asambleaSeleccionada.votacionTema10 ? true : '',
          }  
  

          //setValCedente({});
          setNombreRepresentante('');
          setIdentificacionRepresentante('');
          setIDRepresentante('');
  
          const accionistaxJuntaID = await API.graphql(graphqlOperation(createAccionistasxJunta, { input: accionista2 }))
  
          

          //console.log("Datos Accionista", accionista2);

          //console.log("updateAsamblea antes", asambleaSeleccionada.id, asambleaSeleccionada.registrados);
          //const updateAsamblea = await API.graphql(graphqlOperation(updateAsamblea, { id: asambleaSeleccionada.id, registrados : accionistasxJuntas.length + 1 }))
          
          const updateAsambleaReturn = await API.graphql({ query: updateAsamblea , variables: { input: {id: asambleaSeleccionada.id, registrados: asambleaSeleccionada.registrados + 1} } });
          
          //console.log("updateAsamblea desp", updateAsamblea);

          setRefrescar(!refrescar);

          handleCloseRegistroAsamblea();
          
           } catch (err) {
          console.log('error creating transaction:', err)
      }   
    }

    const handleChangeNombreRepresentante = (event) => { setNombreRepresentante(event.target.value); };
    const handleChangeIdentificacionRepresentante = (event) => { setIdentificacionRepresentante(event.target.value); };




    const classes = useStyles();

    return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                    {accionista.length > 0 && accionista[0].nombre}
                    </Typography>
                    <Typography variant="body2">
                        <small>{accionista.length > 0 && accionista[0].tipoIdentificacion + " : " + accionista[0].identificacion}</small>                        
                    </Typography>                    
                    <Button size="small" variant="contained"  color="primary" style={{textTransform: 'none', height: '18px', marginTop:'15px'}} onClick={exportPDFCertificado}><small>Imprimir Certificado</small></Button>
                </CardContent>
            </Card>              
          </Grid>

          <Grid item xs={3}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="body2">
                        Acciones
                    </Typography>
                    <Typography variant="h5" component="div">
                        {accionista.length > 0 && numberWithCommas(accionista[0].cantidadAcciones)}
                    </Typography>
                </CardContent>
            </Card>              
          </Grid>

          <Grid item xs={3}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="body2">
                        Capital (USD)
                    </Typography>
                    <Typography variant="h5" component="div">
                    {accionista.length > 0 && numberWithCommas((accionista[0].cantidadAcciones * valorNominal).toFixed(2))}
                    </Typography>
                </CardContent>
            </Card>              
          </Grid>

          <Grid item xs={2}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="body2">
                        Participación (%)
                    </Typography>
                    <Typography variant="h5" component="div">
                    {accionista.length > 0 && (accionista[0].cantidadAcciones * 100 / cantidadEmitido).toFixed(8)}
                    </Typography>
                </CardContent>
            </Card>              
          </Grid>


          <Grid item xs={12}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                        Convocatorias Abiertas
                    </Typography>

                    <DataGrid
                    style={{backgroundColor:'white'}}
                    density="compact"             
                    autoHeight='true'
                    autoPageSize='true'
                    disableColumnMenu 
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    //pagination= {false}
                    />

                </CardContent>
            </Card>              
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                        Dividendos  
                    </Typography>
                    <DataGrid
                    style={{backgroundColor:'white'}}
                    density="compact"             
                    autoHeight='true'
                    maxWidth='true'
                    autoPageSize='true'
                    disableColumnMenu 
                    rows={dividendos}
                    columns={columnsDividendos}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    />
                </CardContent>
            </Card>              
          </Grid>



          <Dialog open={openRegistroAsamblea} onClose={handleCloseRegistroAsamblea} aria-labelledby="form-dialog-title"    >          
            <DialogTitle id="form-dialog-title">Registro en Asamblea</DialogTitle>
            <DialogContent style={{height: '200px'}}>
  
            <Typography variant="body2">Tipo  :   {asambleaSeleccionada.tipo} </Typography>
            <Typography variant="body2">Fecha :   {asambleaSeleccionada.fecha} </Typography>
            <Typography variant="body2">Hora  :   {asambleaSeleccionada.hora} </Typography>
            <Typography variant="body2">Lugar :   {asambleaSeleccionada.lugar} </Typography>

            <TextField
                    id="outlined-required"
                    label={<small>Nombre Representante</small>}
                    value={nombreRepresentante}
                    onChange={handleChangeNombreRepresentante}
                    size='small'
                    variant="outlined"
                    style={{width: '300px', marginTop:7}}
              /> 
              <TextField
                    id="outlined-required"
                    label={<small>Identificación</small>}
                    value={identificacionRepresentante}
                    onChange={handleChangeIdentificacionRepresentante}
                    size='small'
                    variant="outlined"
                    style={{width: '200px',marginTop:7}}
              /> 

                <label htmlFor="upload-photo101">
                    <input style={{ display: 'none' }} id="upload-photo101" name="upload-photo101" type="file" onChange={onChangeHabilitante1} />
                    <Button startIcon={<CloudUploadOutlinedIcon />} variant='outlined' component="span" color="primary" size='small' style={{textTransform: 'none',marginTop:7}}>Identificación delegado</Button>                    
                     
                </label>

            </DialogContent>
            <DialogActions style={{display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-end', width:'100%' }}>            
                        

             <Button onClick={ addAccionista } variant="contained" color="primary" style={{textTransform: 'none'}}>
                Registrarse
              </Button>

              <Button onClick={handleCloseRegistroAsamblea} color="primary" style={{textTransform: 'none'}}>
                Salir
              </Button>
            </DialogActions>
          </Dialog>
  


      </Grid>
    </main>
  );  

}