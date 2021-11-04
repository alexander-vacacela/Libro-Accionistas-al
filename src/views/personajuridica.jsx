import React, { useState } from 'react'
import { makeStyles, Paper, TextField, Button, Typography, MenuItem, Select, Divider, Grid, IconButton, InputLabel, Snackbar  } from '@material-ui/core';
import { Controller, useForm } from "react-hook-form";

import ControlPointIcon from '@material-ui/icons/ControlPoint';
import CheckIcon from '@material-ui/icons/Check';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import { API, Storage, graphqlOperation } from 'aws-amplify';
import {createAccionista} from './../graphql/mutations';

import { uuid } from 'uuidv4';
import MuiAlert from '@material-ui/lab/Alert';

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
    },
    appBarSpacer: {
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),        
    },
    formSectionTitulo: {
        display : 'flex',
        flexDirection : 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    formSection: {
        display : 'flex',
        flexDirection : 'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },
    formSectionContacto: {
      display : 'flex',
      flexDirection : 'column',
      //justifyContent:'flex-start',
      alignItems: 'flex-start',
  },    
    gridSpace: {
        flexDirection: 'column',
        backgroundColor:'#f9f9f9',
        display : 'flex',
        marginLeft : 50,
        borderRadius : 5,
        padding: 20,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#00BCD4'
    },
    divider: {
        marginTop : 20,
        marginBottom : 20,
    },
    customTextField: {
        "& input::placeholder": {
          fontSize: "10px"
        }
      }
  }));
  
  const defaultValues = {
    razonSocial: '',
    apellidoMaterno: '',
    apellidoPaterno: '',
    banco: '1',
    calle: '',
    ciudadDireccion: '1',
    cuenta: '',
    email: '',
    estadoCivil: '',
    identificacion: '',
    decevale: '',
    nacionalidad: '1',
    numero: '',
    observaciónTelefono: '',
    paisBanco: '1',
    paisDireccion: '1',
    primerNombre: '',
    provinciaDireccion: '1',
    segundoNombre: '',
    telefono: '',
    tipoCuenta: '1',
    tipoIdentificacion: '1',
    tipoIdentificacionConyugue: '1',
    identificacionConyugue: '',
    nacionalidadConyugue : '1',
    nombreConyugue : '',
    observacionTelefono: '',
    telefonoAux1: '',
    observacionTelefonoAux1: '',
    telefonoAux2: '',
    observacionTelefonoAux2: '',
    emailAux1: '',
    emailAux2: '',
    tipoIdentificacionRepLegal : '1',
    identificacionRepLegal : '',
    repLegal : '',
    nacionalidadRepLegal : '1',
    telefonoRepLegal : '',
    emailRepLegal : '',
  };
  
export default function PersonaJuridica() {
    const classes = useStyles();
    const [countTelef, setCountTelef] = useState(1);
    const [countEmail, setCountEmail] = useState(1);

    const [formData, setFormData] = useState({
      docIdentidadPrincipal: '', docCertificadoBancario: '', docIdentidadConyugue: ''});

    const { handleSubmit, reset, control } = useForm({ defaultValues });
    
    const [openSnack, setOpenSnack] = useState(false);

    const onSubmit = (data) => {
        const accionista = { 
            tipoIdentificacion: tipoIdentificacion.find(o => o.value === data.tipoIdentificacion).label ,
            identificacion: data.identificacion,
            decevale: data.decevale,
            nombre: data.razonSocial, 
            direccionPais: pais.find(o => o.value === data.paisDireccion).label,
            direccionProvincia: provincia.find(o => o.value === data.provinciaDireccion).label,
            direccionCiudad: ciudad.find(o => o.value === data.ciudadDireccion).label ,
            direccionCalle: data.calle,
            direccionNumero: data.numero,
            nombreBanco:  banco.find(o => o.value === data.banco).label,
            tipoCuenta: tipoCuenta.find(o => o.value === data.tipoCuenta).label, 
            cuentaBancaria: data.cuenta,
            paisNacionalidad: nacionalidad.find(o => o.value === data.nacionalidad).label, 
            cantidadAcciones: 0,
            tipoAcciones: 'D',
            estado: 'Activo',
            tipoPersona: 'PJ',

            pn_primerNombre: '',
            pn_segundoNombre: '',
            pn_apellidoPaterno: '',
            pn_apellidoMaterno: '',
            pn_estadoCivil: '', 
            conyugue_tipoIdentificacion: '' ,
            conyugue_identificacion: '',
            conyugue_nombre: '',
            conyugue_nacionalidad: '',           

            telefono1: data.telefono,
            obs1: data.observacionTelefono,
            telefono2: countTelef > 1 ? data.telefonoAux1 : '',
            obs2: countTelef > 1 ? data.observacionTelefonoAux1 : '',
            telefono3: countTelef > 2 ? data.telefonoAux2 : '',
            obs3: countTelef > 2 ? data.observacionTelefonoAux2 : '',
            email1 : data.email,
            email2 : countEmail > 1 ? data.emailAux1 : '',
            email3 : countEmail > 2 ? data.emailAux2 : '',
            docIdentidadPrincipal : formData.docIdentidadPrincipal,
            docCertificadoBancario: formData.docCertificadoBancario,
            docIdentidadConyugue : formData.docIdentidadConyugue,

            repLegal_tipoIdentificacion: tipoIdentificacionPN.find(o => o.value === data.tipoIdentificacionRepLegal).label ,
            repLegal_identificacion: data.identificacionRepLegal,
            repLegal_nombre: data.repLegal,
            repLegal_nacionalidad: nacionalidad.find(o => o.value === data.nacionalidadRepLegal).label,   
            repLegal_telefono: data.telefonoRepLegal,
            repLegal_email: data.emailRepLegal,
            
         };

         addAccionista(accionista);
         console.log('data',data);
         console.log('accionista',accionista);
    }

    const tipoIdentificacion = [
        {
          label: "RUC",
          value: "1",
        },     
      ];
      
      const generateSelectTipoIdentificacion = () => {
        return tipoIdentificacion.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        });
      };

      const tipoIdentificacionPN = [
        {
            label: "Cédula",
            value: "1",
          },
          {
            label: "RUC",
            value: "2",
          },
          {
          label: "Pasaporte",
          value: "3",
          },  
      ];
      
      const generateSelectTipoIdentificacionPN = () => {
        return tipoIdentificacionPN.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        });
      };




      const nacionalidad = [
        {
          label: "Ecuatoriana",
          value: "1",
        },
        {
          label: "Peruana",
          value: "2",
        },
        {
            label: "Estadoudinense",
            value: "3",
          },        
      ];

      const generateSelectNacionalidad = () => {
        return nacionalidad.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        });
      };

      const pais = [
        {
          label: "Ecuador",
          value: "1",
        },
        {
          label: "Perú",
          value: "2",
        },
        {
            label: "Estados Unidos",
            value: "3",
          },        
      ];

      const generateSelectPais = () => {
        return pais.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        });
      };

      const provincia = [
        {
          label: "Pichincha",
          value: "1",
        },
        {
          label: "Guayas",
          value: "2",
        },
        {
            label: "Chimborazo",
            value: "3",
          },        
      ];

      const generateSelectProvincia = () => {
        return provincia.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        });
      };

      const ciudad = [
        {
          label: "Quito",
          value: "1",
        },
        {
          label: "Guayaquil",
          value: "2",
        },
        {
            label: "Riobamba",
            value: "3",
          },        
      ];

      const generateSelectCiudad = () => {
        return ciudad.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        });
      };

      const banco = [
        {
          label: "Banco Pichincha",
          value: "1",
        },
        {
          label: "Banco Guayaquil",
          value: "2",
        },
        {
            label: "Banco Internacional",
            value: "3",
          },        
          {
            label: "Banco del Pacífico",
            value: "4",
          },
          {
            label: "Banco Bolivariano",
            value: "5",
          },
          {
            label: "Diners Club",
            value: "6",
          },
          {
            label: "Banco ProCredit",
            value: "7",
          },
          {
            label: "Banco General Rumiñahui",
            value: "8",
          },
          {
            label: "Produbanco",
            value: "9",
          },   
          {
            label: "Banco del Austro",
            value: "10",
          },                                      
      ];

      const generateSelectBanco = () => {
        return banco.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        });
      };

      const tipoCuenta = [
        {
          label: "Cta Cte",
          value: "1",
        },
        {
          label: "Cta Aho",
          value: "2",
        },    
      ];

      const generateSelectTipoCuenta = () => {
        return tipoCuenta.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        });
      };


      const addAccionista = async (accionista) => {
        try {          
            const operID = await API.graphql(graphqlOperation(createAccionista, { input: accionista }))
            setFormData({ docIdentidadPrincipal: '', docCertificadoBancario: '', docIdentidadConyugue: '' })
            reset(defaultValues);
            setOpenSnack(true)

        } catch (err) {
            console.log('error creating accionista:', err)
        }        
      }

      const limpiarForm = async () => {
            setFormData({ docIdentidadPrincipal: '', docCertificadoBancario: '', docIdentidadConyugue: '' })
            reset(defaultValues);
      }
  
    async function onChangeDI(e) {
      if (!e.target.files[0]) return
      const file = e.target.files[0];
      const filename = uuid() + file.name
      setFormData({ ...formData, docIdentidadPrincipal: filename });
      await Storage.put(filename, file);
    }
    async function onChangeCB(e) {
      if (!e.target.files[0]) return
      const file = e.target.files[0];
      const filename = uuid() + file.name
      setFormData({ ...formData, docCertificadoBancario: filename });
      await Storage.put(filename, file);
    }
    async function onChangeDIC(e) {
      if (!e.target.files[0]) return
      const file = e.target.files[0];
      const filename = uuid() + file.name
      setFormData({ ...formData, docIdentidadConyugue: filename });
      await Storage.put(filename, file);
    }

    const handleCloseSnack = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
    
      setOpenSnack(false);
    };
    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Paper variant="outlined" className={classes.paper}>        
                <form>
                    <Grid container>
                        <Grid item xs={8}>
                            <div className={classes.formSection}>
                                <div>
                                    <Typography variant='subtitle1' style={{color:"#000000"}}>Identificación Persona Jurídica</Typography>
                                    <Controller                    
                                        control={control}
                                        name={"tipoIdentificacion"}
                                        //label={"Y Ahora"}
                                        render={({ field: { onChange, value } }) => (
                                            <Select onChange={onChange} value={value}  variant="outlined" style={{height:37, minWidth:100}}>
                                            {generateSelectTipoIdentificacion()}
                                            </Select>
                                        )}/>
                                        &nbsp;&nbsp;
                                    <Controller
                                    id={"identificacion"}
                                    name={"identificacion"}
                                    control={control}
                                    rules={{
                                        required: 'Requerido'
                                      }}
                                    render={({ field: { onChange, value }, fieldState: { error }, }) => (
                                        <TextField  size='small' onChange={onChange} value={value} label={"Identificación"} variant='outlined' error={!!error} helperText={error ? error.message : null} style={{height:37, width:150}}/>
                                    )}
                                     />
                                        &nbsp;&nbsp;
                                    <Controller
                                    id={"decevale"}
                                    name={"decevale"}
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error }, }) => (
                                        <TextField  size='small' onChange={onChange} value={value} label={"Decevale"} variant='outlined' error={!!error} helperText={error ? error.message : null} style={{height:37, width:100}} />
                                    )}
                                     />    
                                </div>
                                <div>
                                    <Typography variant='subtitle1' style={{color:"#000000"}}>Nombre</Typography>                                
                                    <Controller
                                    name={"razonSocial"}
                                    control={control}
                                    rules={{required: 'Requerido'}}
                                    render={({ field: { onChange, value }, fieldState: { error }, }) => (
                                        <TextField size='small'  onChange={onChange} value={value} label={"Razón Social"}  variant='outlined' error={!!error} helperText={error ? error.message : null} style={{minWidth: 300}}/>
                                    )} />                                 
                                </div>
                                <div>
                                    <Typography variant='subtitle1' style={{color:"#000000"}}>Nacionalidad</Typography>                                
                                    <Controller
                                    control={control}
                                    name={"nacionalidad"}
                                    render={({ field: { onChange, value } }) => (<div>
                                        <Select labelId="nac" id="nacid" onChange={onChange} value={value} defaultValue='1' variant="outlined" style={{height:37, minWidth:150}}>
                                        {generateSelectNacionalidad()}
                                        </Select>
                                        </div>
                                    )}/>                               
                                </div>



                            </div>
                            
                            <div className={classes.formSectionTitulo}>
                                <Typography variant='subtitle1' style={{color:"#000000"}}>Dirección</Typography>
                            </div>    
                            <div className={classes.formSection}>                            
                                <Controller
                                    control={control}
                                    name={"paisDireccion"}
                                    render={({ field: { onChange, value } }) => (
                                        <Select onChange={onChange} value={value} defaultValue='1'  variant="outlined" style={{height:37, minWidth:140}}>
                                        {generateSelectPais()}
                                        </Select>
                                    )}/>
                                <Controller
                                    control={control}
                                    name={"provinciaDireccion"}
                                    render={({ field: { onChange, value } }) => (
                                        <Select onChange={onChange} value={value} defaultValue='1'  variant="outlined" style={{height:37, minWidth:140}}>
                                        {generateSelectProvincia()}
                                        </Select>
                                    )}/>
                                <Controller
                                    control={control}
                                    name={"ciudadDireccion"}
                                    render={({ field: { onChange, value } }) => (
                                        <Select onChange={onChange} value={value} defaultValue='1'  variant="outlined" style={{height:37, minWidth:140}}>
                                        {generateSelectCiudad()}
                                        </Select>
                                    )}/>
                                <Controller
                                name={"calle"}
                                control={control}
                                rules={{required: 'Requerido'}}
                                render={({ field: { onChange, value }, fieldState: { error }, }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Calle"} variant='outlined' style={{minWidth: 300}} error={!!error} helperText={error ? error.message : null}/>
                                )} />
                                <Controller
                                name={"numero"}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Nro"} variant='outlined' style={{width: 80}}/>
                                )} />
                            </div>   
                            <div className={classes.formSectionTitulo}>
                                <Typography variant='subtitle1' style={{color:"#000000"}}>Cuenta Bancaria</Typography>
                            </div>    
                            <div className={classes.formSectionBanco}>                                 
     
                                <Controller
                                    control={control}
                                    name={"banco"}
                                    render={({ field: { onChange, value } }) => (
                                        <Select onChange={onChange} value={value} defaultValue='1' variant="outlined" style={{height:37,minWidth: 220}}>
                                        {generateSelectBanco()}
                                        </Select>
                                    )}/>        
                                    &nbsp;&nbsp;
                                <Controller
                                    control={control}
                                    name={"tipoCuenta"}
                                    render={({ field: { onChange, value } }) => (
                                        <Select onChange={onChange} value={value} defaultValue='1' variant="outlined" style={{height:37,minWidth: 100}}>
                                        {generateSelectTipoCuenta()}
                                        </Select>
                                    )}/>   
                                    &nbsp;&nbsp;                                      
                                <Controller
                                name={"cuenta"}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Nro Cuenta"} variant='outlined'/>
                                )} />
                            </div>
                            &nbsp;&nbsp;    
                            <Divider/>    
                              &nbsp;                            

                            <div className={classes.formSection}> 
                              <div>
                                    <Typography variant='subtitle1' style={{color:"#000000"}}>Identificación Representante Legal</Typography>
                                    <Controller                    
                                        control={control}
                                        name={"tipoIdentificacionRepLegal"}
                                        render={({ field: { onChange, value } }) => (
                                            <Select onChange={onChange} value={value}  variant="outlined" style={{height:37, minWidth:150}}>
                                            {generateSelectTipoIdentificacionPN()}
                                            </Select>
                                        )}/>
                                        &nbsp;&nbsp;
                                    <Controller
                                    id={"identificacionRepLegal"}
                                    name={"identificacionRepLegal"}
                                    control={control}
                                    rules={{
                                        required: 'Requerido'
                                      }}
                                    render={({ field: { onChange, value }, fieldState: { error }, }) => (
                                        <TextField  size='small' onChange={onChange} value={value} label={"Identificación"} variant='outlined' error={!!error} helperText={error ? error.message : null} />
                                    )}
                                     />

                                </div>
                                <div>
                                    <Typography variant='subtitle1' style={{color:"#000000"}}>Nombre Completo</Typography>                                
                                    <Controller
                                    name={"repLegal"}
                                    control={control}
                                    rules={{required: 'Requerido'}}
                                    render={({ field: { onChange, value }, fieldState: { error }, }) => (
                                        <TextField size='small'  onChange={onChange} value={value} label={"Representante Legal"}  variant='outlined' error={!!error} helperText={error ? error.message : null} style={{minWidth: 300}}/>
                                    )} />                                 
                                </div>
                                <div>
                                    <Typography variant='subtitle1' style={{color:"#000000"}}>Nacionalidad</Typography>                                
                                    <Controller
                                    control={control}
                                    name={"nacionalidadRepLegal"}
                                    render={({ field: { onChange, value } }) => (<div>
                                        <Select labelId="nac" id="nacid" onChange={onChange} value={value} defaultValue='1' variant="outlined" style={{height:37, minWidth:150}}>
                                        {generateSelectNacionalidad()}
                                        </Select>
                                        </div>
                                    )}/>                               
                                </div>
                            </div>   
                            <div className={classes.formSectionTitulo}>
                                <Typography variant='subtitle1' style={{color:"#000000"}}>Contacto Representante Legal</Typography>
                            </div>    
                            <div className={classes.formSectionBanco}>                            
                                <Controller
                                name={"telefonoRepLegal"}
                                control={control}
                                rules={{required: 'Requerido'}}
                                render={({ field: { onChange, value }, fieldState: { error }, }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Teléfono"} variant='outlined' style={{minWidth: 100}} error={!!error} helperText={error ? error.message : null}/>
                                )} />
                                &nbsp;&nbsp;
                                <Controller
                                name={"emailRepLegal"}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Email"} variant='outlined' style={{width: 300}}/>
                                )} />
                            </div>   
                                                      
                        </Grid>

                        <Grid item xs={4} >
                            <div className={classes.gridSpace}>

                                <div style={{marginBottom: 20}}>
                                    <Typography variant='subtitle1' style={{color:"#000000"}}>Medios de Contacto</Typography>
                                </div>  

                                <div className={classes.formSection}>   
                                <Controller
                                name={"telefono"}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Teléfono"} variant='outlined' style={{minWidth: 130}}  margin='dense'/>
                                )} />
                                <Controller
                                name={"observacionTelefono"}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Observación"} variant='outlined' fullWidth  margin='dense'/>
                                )} />
                                </div>
                                { countTelef > 1 &&
                                <div className={classes.formSection}>   
                                <Controller
                                name={"telefonoAux1"}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Teléfono aux"} variant='outlined' style={{minWidth: 130}} margin='dense'/>
                                )} />
                                <Controller
                                name={"observacionTelefonoAux1"}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Observación aux"} variant='outlined' fullWidth  margin='dense'/>
                                )} />
                                </div>
                                }
                                { countTelef > 2 &&
                                <div className={classes.formSection}>   
                                <Controller
                                name={"telefonoAux2"}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Teléfono aux"} variant='outlined' style={{minWidth: 130}} margin='dense'/>
                                )} />
                                <Controller
                                name={"observacionTelefonoAux2"}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextField size='small' onChange={onChange} value={value} label={"Observación aux"} variant='outlined' fullWidth  margin='dense'/>
                                )} />
                                </div>   
                                }                                                             
                                <div>                            
                                    <IconButton color='primary' onClick={() => setCountTelef(countTelef + 1)} disabled={countTelef===3 ? true : false}><ControlPointIcon/></IconButton>
                                    <IconButton color='primary' onClick={() => setCountTelef(countTelef - 1)} disabled={countTelef===1 ? true : false} ><RemoveCircleOutlineIcon/></IconButton>
                                  </div>                                

                                <div className={classes.formSectionContacto}>  
                                    <Controller
                                    type='email'
                                    name={"email"}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextField size='small' onChange={onChange} value={value} label={"Email"} variant='outlined'  fullWidth  margin='dense'/>
                                    )} />       
                                    { countEmail > 1 &&
                                    <Controller
                                    type='email'
                                    name={"emailAux1"}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextField size='small' onChange={onChange} value={value} label={"Email auxiliar"} variant='outlined'  fullWidth  margin='dense'/>
                                    )} />       
                                    }     
                                    { countEmail > 2 &&                        
                                    <Controller
                                    type='email'
                                    name={"emailAux2"}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextField size='small' onChange={onChange} value={value} label={"Email auxiliar"} variant='outlined'  fullWidth  margin='dense'/>
                                    )} />   
                                    }     
                                  <div>                            
                                    <IconButton color='primary' onClick={() => setCountEmail(countEmail + 1)} disabled={countEmail===3 ? true : false}><ControlPointIcon/></IconButton>
                                    <IconButton color='primary' onClick={() => setCountEmail(countEmail - 1)} disabled={countEmail===1 ? true : false}><RemoveCircleOutlineIcon/></IconButton>
                                  </div>
                                </div>   

                                <div style={{marginTop: 20}}>
                                    <Typography variant='subtitle1' style={{color:"#000000"}}>Documentos Habilitantes</Typography>
                                </div>  
                                
                                <div className={classes.formSection}>   
                                <label htmlFor="upload-photo1">
                                    <input style={{ display: 'none' }} id="upload-photo1" name="upload-photo1" type="file" onChange={onChangeDI} />
                                    <Button component="span" color="primary" size='small'>Nombramiento</Button>
                                    {formData.docIdentidadPrincipal.length > 0 && <CheckIcon />}
                                </label>
                                </div>  
                                <div className={classes.formSection}>   
                                <label htmlFor="upload-photo2">
                                    <input style={{ display: 'none' }} id="upload-photo2" name="upload-photo2" type="file" onChange={onChangeCB} />
                                    <Button component="span" color="primary" size='small' >Certificado Bancario</Button>
                                    {formData.docCertificadoBancario.length > 0 && <CheckIcon />}
                                </label>
                                </div>  
                            </div>
                        </Grid>                        
                    </Grid>

                    <Divider className={classes.divider}/>
                    <div className={classes.formSection}>  
                        <Button size='small' onClick={limpiarForm} style={{textTransform: 'none'}} color='primary'>Limpiar</Button>
                        <Button siza='small' onClick={handleSubmit(onSubmit)} variant='contained' color='primary' style={{textTransform: 'none'}}>Registrar Accionista</Button>
                    </div>
                    <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                      <Alert onClose={handleCloseSnack} severity="success">
                        Se registró el accionista correctamente!
                      </Alert>
                    </Snackbar>
                </form>    
            </Paper>
        </main>      
    );
}
