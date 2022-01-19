import React, { useState,useEffect } from 'react';
import { makeStyles, Paper, Avatar , Grid, Typography,TextField,Button,withStyles,ListItem, ListItemText, ListSubheader,ListItemIcon,
  List,IconButton,Snackbar, CircularProgress, LinearProgress, Divider, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { API, Storage, graphqlOperation, Auth } from 'aws-amplify';
import { listAccionistas, listOperaciones, listHerederoPorOperacions } from './../graphql/queries';

import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';                 
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
//import PreviewIcon from '@material-ui/icons/Preview';
import VisibilityIcon from '@material-ui/icons/Visibility';

import MuiAlert from '@material-ui/lab/Alert';
//import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

import { uuid } from 'uuidv4';

import jsPDF from "jspdf";
import "jspdf-autotable";

import logo from '../images/logoUNACEMmedMarco.jpg';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    //height: '83vh',
    height:'calc(100%)',
    display:'flex',    
    justifyContent:'center',
    alignItems:'center',
  },
  appBarSpacer: {
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),        
    
  },
  button: {
    margin: theme.spacing(1),
    marginTop: 35,
    textTransform: 'none',
  },
  titulos: {
    flexDirection: 'row', 
  },
  cedente: {
    display : 'flex',
    flexDirection: 'column', 
    width: '90%',
    marginTop: 20,
  },

}));


const today = new Date();
const fecha = today.getDate() + '-' + (today.getMonth() + 1) + '-' +  today.getFullYear();


const people = [
    { name: "Keanu Reeves", profession: "Actor" },
    { name: "Lionel Messi", profession: "Football Player" },
    { name: "Cristiano Ronaldo", profession: "Football Player" },
    { name: "Jack Nicklaus", profession: "Golf Player" },
  ];


export default function Reportes() {

  const classes = useStyles();

  const [estadoListado, setEstadoListado] = useState('1');

  const handleChangeEstadoListado = (event) => {
    setEstadoListado(event.target.value);
  };


  const exportPDFLibroAccionistas = async() => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    //const orientation = "portrait"; // portrait or landscape
    const orientation = "landscape"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    //console.log("ESTADO", estado);
    const filter = {
        estado: {
          //eq: estadoLibro == "1" ? "Activo" : estadoLibro == "2" ? "Bloqueado" : estadoLibro == "3" ? "Inactivo" : null
          ne: "Inactivo"
        },
      }      
    const apiData = await API.graphql({ query: listAccionistas, variables: { filter: filter, limit: 10000} });
    const accionistasFromAPI = apiData.data.listAccionistas.items;
    console.log("accionistas", accionistasFromAPI)

    //calcular participacion
    //calcular valor (Q*P)
    const libroAccionista = accionistasFromAPI.map(function(elt) {
        return {identificacion : elt.identificacion, nombre : elt.nombre, paisNacionalidad: elt.paisNacionalidad, cantidadAcciones : elt.cantidadAcciones, tipoAcciones : elt.tipoAcciones, tipoPersona : elt.tipoPersona, participacion : elt.cantidadAcciones * 100.00 / 42930108.00, valor : elt.cantidadAcciones * 40.00 };
      })
   
    const totalAccionistas = Object.keys(accionistasFromAPI).length;
    const totalAcciones = accionistasFromAPI.reduce((a, b) => a + (b["cantidadAcciones"] || 0), 0)

    var val = Math.round(Number(totalAcciones) *100) / 100;
    var parts = val.toString().split(".");
    var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");

    const title = "Libro de Accionistas";
    const headers = [["Identificacion", "Nombre", "Nacionalidad", "Acciones","Tipo","Persona","Participación","Valor"]];

    const data = libroAccionista.map(elt=> [elt.identificacion, elt.nombre, elt.paisNacionalidad, elt.cantidadAcciones,elt.tipoAcciones,elt.tipoPersona, elt.participacion, elt.valor]);

    let content = {
      theme: 'plain',
      startY: 50,
      head: headers,
      body: data
    };

    doc.addImage(logo,"JPEG",700,20,80,30)
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);

    doc.addPage("A4","l");
    doc.text("Total accionistas :     " + totalAccionistas.toString(), marginLeft, 50);
    doc.text("Total acciones    :     " + num.toString(), marginLeft, 80);

    doc.save("LibroAccionistas.pdf")
    
  }

  const exportPDFListadoAccionistas = async() => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    //const orientation = "portrait"; // portrait or landscape
    const orientation = "landscape"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    //console.log("ESTADO", estado);
    const filter = {
        estado: {
          eq: estadoListado == "1" ? "Activo" : estadoListado == "2" ? "Bloqueado" : estadoListado == "3" ? "Inactivo" : null
        },
      }      
    const apiData = await API.graphql({ query: listAccionistas, variables: { filter: filter, limit: 10000} });
    const accionistasFromAPI = apiData.data.listAccionistas.items;
    console.log("accionistas", accionistasFromAPI)

    //calcular participacion
    //calcular valor (Q*P)
    const libroAccionista = accionistasFromAPI.map(function(elt) {
        return {identificacion : elt.identificacion, nombre : elt.nombre, paisNacionalidad: elt.paisNacionalidad, cantidadAcciones : elt.cantidadAcciones, tipoAcciones : elt.tipoAcciones, tipoPersona : elt.tipoPersona, participacion : elt.cantidadAcciones * 100.00 / 42930108.00, valor : elt.cantidadAcciones * 40.00 };
      })

    const totalAccionistas = Object.keys(accionistasFromAPI).length;
    const totalAcciones = accionistasFromAPI.reduce((a, b) => a + (b["cantidadAcciones"] || 0), 0)

    var val = Math.round(Number(totalAcciones) *100) / 100;
    var parts = val.toString().split(".");
    var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        

    const title = "Listado de Accionistas (".concat(estadoListado == "1" ? "Activos)" : estadoListado == "2" ? "Bloqueados)" : "Inactivos)" );
    //const headers = [["Identificacion", "Nombre", "Nacionalidad", "Acciones","Tipo","Persona","Participación","Valor"]];
    const headers = [["Nombre", "Nacionalidad", "Identificacion", "Tipo", "Cuenta", "Tipo Cta", "Acciones","Participación","Dirección","Email"]];

    //const data = libroAccionista.map(elt=> [elt.identificacion, elt.nombre, elt.paisNacionalidad, elt.cantidadAcciones,elt.tipoAcciones,elt.tipoPersona, elt.participacion, elt.valor]);
    const data = libroAccionista.map(elt=> [elt.nombre, elt.paisNacionalidad, elt.identificacion, elt.tipoIdentificacion, elt.cuentaBancaria, elt.tipoCuenta, elt.cantidadAcciones, elt.direccionCalle, elt.email1]);

    let content = {
      theme: 'plain',
      startY: 50,
      head: headers,
      body: data
    };

    doc.addImage(logo,"JPEG",700,20,80,30)    
    doc.text(title, marginLeft, 40);

    doc.autoTable(content);

    doc.addPage("A4","l");
    doc.text("Total accionistas :     " + totalAccionistas.toString(), marginLeft, 50);
    doc.text("Total acciones    :     " + num.toString(), marginLeft, 80);


    doc.save("ListadoAccionistas.pdf")
    
  }


  const exportPDFTransferencias = async() => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(10);

    let filter = {
        estado: {
            eq: 'Aprobada' // filter priority = 1
        },

        or: [{ operacion: {eq:'Cesión'} },
             { operacion: {eq:'Posesión Efectiva'} },
             { operacion: {eq:'Donación'} },
             { operacion: {eq:'Testamento'} }]

    };
  
    const apiData = await API.graphql({ query: listOperaciones , variables: { filter: filter , limit: 10000},  });
    const operacionesFromAPI = apiData.data.listOperaciones.items;
  

    const apiData2 = await API.graphql({ query: listHerederoPorOperacions , variables: {  limit: 10000},  });
    const operacionesFromAPI2 = apiData2.data.listHerederoPorOperacions.items;
    
    const posisionEfectiva = operacionesFromAPI2.map(t1 => ({...t1, ...operacionesFromAPI.find(t2 => t2.id === t1.operacionId)}))

    const operacionesSinPosesionEfectivas = operacionesFromAPI.filter((el) =>
          el.operacion != 'Posesión Efectiva'
        );        

    const finalmente = [...operacionesSinPosesionEfectivas, ...posisionEfectiva]

    /*
    var from = $("#datepicker").val().split("-")
    var f = new Date(from[2], from[1] - 1, from[0])
*/

    finalmente.sort(function (a, b) {
        if (new Date(+a.fecha.split("-")[2],a.fecha.split("-")[1] - 1, +a.fecha.split("-")[0]) > new Date(+b.fecha.split("-")[2],b.fecha.split("-")[1] - 1, +b.fecha.split("-")[0])) return 1;
        if (new Date(+a.fecha.split("-")[2],a.fecha.split("-")[1] - 1, +a.fecha.split("-")[0]) < new Date(+b.fecha.split("-")[2],b.fecha.split("-")[1] - 1, +b.fecha.split("-")[0])) return -1;
        return 0;
      });
      
      //console.log(finalmente);

    //const sortedFinalmente = finalmente.sort((a, b) => b.cedente - a.cedente)


    //console.log("QUE SERA 1", sortedFinalmente)
     // console.log("QUE SERA 2", filterItems)
    //console.log("QUE SERA", a3)
/*
    const posesionEfectiva = operacionesFromAPI2.map(function(elt) {
        return {
        fecha : for (var id in operacionesFromAPI) { obj3[attrname] = obj1[attrname]; } ,
        operacion : '', 
        cedente: '', 
        acciones : elt.cantidad, 
        cesionario : elt.nombre,};
      })
*/

    const title = "Reporte de Transferencias";
    const headers = [["Fecha", "Transferencia", "Cedente", "Acciones","Cesionario"]];

    const data = finalmente.map(elt=> [elt.fecha, elt.operacion, elt.cedente, elt.operacion == 'Posesión Efectiva' ? elt.cantidad : elt.acciones, elt.operacion == 'Posesión Efectiva' ? elt.nombre : elt.cesionario]);


    let content = {
      theme: 'plain',
      startY: 50,
      head: headers,
      body: data
    };

    doc.addImage(logo,"JPEG",700,20,80,30)    
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("ReporteTransferencias.pdf")
    
  }


  return (
    <main className={classes.content}>
    <div className={classes.appBarSpacer} />
      <Paper variant="elevation" className={classes.paper}>
        <Grid container style={{width:'90%'}}>
            <Grid item xs={12} >
              <Paper elevation={0} style={{height:50, display:'flex', flexDirection:'row', justifyContent:'flex-start',  alignItems:'center', width:'100%', padding:10, }}>              
                <Avatar style={{backgroundColor:'#f9f9f9' , height: '30px', width: '30px'}}>
                  <PrintOutlinedIcon color='primary'/>                         
                </Avatar>  
                <Typography variant='subtitle2' color='primary' style={{paddingLeft:10}}>
                  Reportes
                </Typography>                       
              </Paper>
              <Divider/>     
            </Grid>
          
        <Grid item xs={2} style={{paddingTop:20, paddingRight:40}}>
          <div>
            <Typography variant='body2' color='secondary'>
                Libro de Accionistas
            </Typography>         

            <FormControl fullWidth style={{paddingTop:30, paddingBottom:50}}>
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
                        shrink: true,
                    }}
                    disabled
                />
            </FormControl>



            <Button                
                size="small"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<VisibilityIcon/>}                    
                //size='medium'
                onClick={exportPDFLibroAccionistas}
            >
                Ver Reporte
            </Button>
          </div>
        </Grid>


        <Grid item xs={2} style={{paddingTop:20, paddingRight:40}}>
          <div>
            <Typography variant='body2' color='secondary'>
                Listado de Accionistas
            </Typography>         

            <FormControl fullWidth style={{paddingTop:30, paddingBottom: 5}}>
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
                        shrink: true,
                    }}
                    disabled
                />
            </FormControl>

            <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={estadoListado}
                label="Estado"
                onChange={handleChangeEstadoListado}
                >
                <MenuItem value={1} >Activo</MenuItem>
                <MenuItem value={2} >Bloqueado</MenuItem>
                <MenuItem value={3} >Inactivo</MenuItem>
                </Select>
            </FormControl>



            <Button                
                size="small"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<VisibilityIcon/>}                    
                //size='medium'
                onClick={exportPDFListadoAccionistas}
            >
                Ver Reporte
            </Button>
          </div>
        </Grid>



        <Grid item xs={2} style={{paddingTop:20, paddingRight:40}}>
            <div>
            <Typography variant='body2' color='secondary'>
                Transferencias
            </Typography>         

            <FormControl fullWidth style={{paddingTop:30,}}>
                <TextField
                    size='small'
                    id="datetime-local"
                    label="Desde"
                    //type="datetime-local"
                    type="date"
                    defaultValue={Date.now()}
                    //className={classes.textField}
                    variant="standard"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </FormControl>
            <FormControl fullWidth style={{paddingTop:7,}}>
                <TextField
                    size='small'
                    id="datetime-local"
                    label="Hasta"
                    //type="datetime-local"
                    type="date"
                    defaultValue={Date.now()}
                    //className={classes.textField}
                    variant="standard"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </FormControl>                        
                    
            <Button                
                size="small"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<VisibilityIcon/>}                    
                //size='medium'
                onClick={exportPDFTransferencias}
            >
                Ver Reporte
            </Button>
          </div>
        </Grid>

        <Grid item xs={2} style={{paddingTop:20, paddingRight:40}}>
            <div>
            <Typography variant='body2' color='secondary'>
                Asambleas
            </Typography>       

            <FormControl disabled fullWidth style={{paddingTop:30,}}>
                <TextField
                    size='small'
                    id="datetime-local"
                    label="Desde"
                    //type="datetime-local"
                    type="date"
                    defaultValue={Date.now()}
                    //className={classes.textField}
                    variant="standard"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    disabled
                />
            </FormControl>
            <FormControl disabled fullWidth style={{paddingTop:7,}}>
                <TextField
                    size='small'
                    id="datetime-local"
                    label="Hasta"
                    //type="datetime-local"
                    type="date"
                    defaultValue={Date.now()}
                    //className={classes.textField}
                    variant="standard"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    disabled
                />
            </FormControl>                        


            <Button                
                size="small"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<VisibilityIcon/>}                    
                disabled
                onClick={exportPDFTransferencias}
            >
                Ver Reporte
            </Button>
          </div>
        </Grid>

        <Grid item xs={2} style={{paddingTop:20, paddingRight:40}}>
            <div>
            <Typography variant='body2' color='secondary' >
                Dividendos
            </Typography>     

            <FormControl disabled fullWidth  style={{paddingTop:40,paddingBottom:50,}}>
                
                <Select
                labelId="simple-select-label"
                id="simple-select"
                value={2}
                label="Periodo"
                //onChange={handleChangeEstadoListado}
                >
                <MenuItem value={1} >2020</MenuItem>
                <MenuItem value={2} >2021</MenuItem>
                <MenuItem value={3} >2022</MenuItem>
                </Select>
            </FormControl>

            <Button                
                size="small"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<VisibilityIcon/>}                    
                disabled
                onClick={exportPDFTransferencias}
            >
                Ver Reporte
            </Button>
          </div>
        </Grid>



  
      </Grid>

     </Paper>

  </main>
    
  );
}