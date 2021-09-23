import React, { useState,useEffect } from 'react';
import { makeStyles, Paper, Divider, Grid, Typography,TextField,Button,withStyles,ListItem, ListItemText, ListSubheader,ListItemIcon,
  List,IconButton,Snackbar} from '@material-ui/core';



import Autocomplete from '@material-ui/lab/Autocomplete';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { listAccionistas, listTitulos } from './../graphql/queries';
import {createOperaciones, createTituloPorOperacion} from './../graphql/mutations';

import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import MuiAlert from '@material-ui/lab/Alert';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import { uuid } from 'uuidv4';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const BlaclTextTypography = withStyles({
  root: {
    color: "#000000",
  }
})(Typography);

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
  button: {
    margin: theme.spacing(1),
    marginTop: 35,
  },
  titulos: {
    flexDirection: 'row', 
  },
  cedente: {
    display : 'flex',
    flexDirection: 'column', 
    paddingRight : 30,
    paddingLeft : 30,
  },

}));


const today = new Date();
const fecha = today.getDate() + '-' + (today.getMonth() + 1) + '-' +  today.getFullYear();


export default function PosesionEfectiva() {

  const classes = useStyles();
  const [CountHeredero, setCountHeredero] = useState(1);



  const [formData, setFormData] = useState({
    fecha: fecha, operacion: 'Posesión Efectiva', 
    idCedente: '', cedente: '', idCesionario:'', cesionario: '', 
    titulo: '' , acciones: 0, 
    estado: 'Pendiente', usuarioIngreso: 'Jorge', usuarioAprobador: '',
    cs: '', cg: '', ci: '', es: '', cp: ''});

  const [formDataTitulos, setFormDataTitulos] = useState({ titulos : {
      operacionID: '', titulo: '',acciones: '' }});
  
  const [valCedente,setValCedente]=useState({})
  const [valCesionario,setValCesionario]=useState({})

  const [total, setTotal] = useState(0);
  
  const [accionistas, setAccionistas] = useState([])
  
  const [titulos, setTitulos] = useState([])
    
  const [openSnack, setOpenSnack] = useState(false);

 
  const addOperacion = async () => {
    try {
            
        if (!formData.cedente || !formData.cesionario) return

        const operacion = { ...formData }

        setFormData({ fecha: fecha, operacion: 'Cesión', idCedente: '', cedente: '', idCesionario: '', cesionario: 'JY',titulo: '' , acciones: '',  estado: 'Pendiente', usuarioIngreso: 'Jorge', usuarioAprobador: '', cs: '', cg: '', ci: '', es: '', cp: ''})
        setFormDataTitulos({ titulos : {operacionID: '', titulo: '',acciones: '' }})
        const operID = await API.graphql(graphqlOperation(createOperaciones, { input: operacion }))

         } catch (err) {
        console.log('error creating transaction:', err)
    }   
}


  useEffect(() => {
    fetchAccionistas();
  }, [])

  async function fetchAccionistas() {
    const apiData = await API.graphql({ query: listAccionistas });
    const accionistasFromAPI = apiData.data.listAccionistas.items;
    await Promise.all(accionistasFromAPI.map(async accionista => {
    return accionista;
    }))
    setAccionistas(apiData.data.listAccionistas.items);
    
  }

  async function fetchTitulos(cedente) {

    let filter = {
      accionistaID: {
          eq: cedente // filter priority = 1
      }
    };

    const apiData = await API.graphql({ query: listTitulos, variables: { filter: filter} });
    const titulosFromAPI = apiData.data.listTitulos.items;
//    await Promise.all(titulosFromAPI.map(async titulos => {
//    return titulos;
//    }))
    setTitulos(titulosFromAPI);
  
    
    const sum = titulosFromAPI.reduce(function(prev, current) {
        return prev + +current.acciones
      }, 0);
      setTotal(sum);
    

  }

const handleClickCedente = (option, value) => {  

  if(value)
  {

    setValCedente(value)

    setFormData({ ...formData, 'idCedente': value.id, 'cedente': value.nombre})
    fetchTitulos(value.id);

    setTotal(0)

  }
  else {

    setFormData({ ...formData, 'idCedente': '', 'cedente': '' })
    setTitulos([])
    setTotal(0)
    setValCedente({})
  }

}

const handleClickCesionario = (option, value) => {  
  if(value)
  {
    setValCesionario(value)
    setFormData({ ...formData, 'idCesionario': value.id,'cesionario': value.nombre  })
  }
  else {
    setValCesionario({})
    setFormData({ ...formData, 'idCesionario': '', 'cesionario': ''})
  }  
}

const handleCloseSnack = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setOpenSnack(false);
};


async function onChangeCS(e) {
  if (!e.target.files[0]) return
  const file = e.target.files[0];
  const filename = uuid() + file.name
  setFormData({ ...formData, cs: filename });
  await Storage.put(filename, file);
}

async function onChangeCG(e) {
  if (!e.target.files[0]) return
  const file = e.target.files[0];
  const filename = uuid() + file.name
  setFormData({ ...formData, cg: filename });
  await Storage.put(filename, file);
}

async function onChangeCI(e) {
  if (!e.target.files[0]) return
  const file = e.target.files[0];
  const filename = uuid() + file.name
  setFormData({ ...formData, ci: filename });
  await Storage.put(filename, file);
}

async function onChangeES(e) {
  if (!e.target.files[0]) return
  const file = e.target.files[0];
  const filename = uuid() + file.name
  setFormData({ ...formData, es: filename });
  await Storage.put(filename, file);
}

async function onChangeCP(e) {
  if (!e.target.files[0]) return
  const file = e.target.files[0];
  const filename = uuid() + file.name
  setFormData({ ...formData, cp: filename });
  await Storage.put(filename, file);
}

  return (
    <main className={classes.content}>
    <div className={classes.appBarSpacer} />
      <Paper variant="outlined" className={classes.paper}>
      <Grid container>
        <Grid item xs={12} >
            <BlaclTextTypography variant='h6'>
              Posesión Efectiva
            </BlaclTextTypography>

        </Grid>
        <Grid item xs={4} >
            <div className={classes.cedente}>
              <Autocomplete
                  value={valCedente}
                  id="combo-box-cedente"
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)'}}
                  renderInput={(params) => <TextField {...params} label="Cedente" margin="normal" helperText='Seleccionar accionista cedente' variant="outlined"/>}
                  onChange={(option, value) => handleClickCedente(option, value)}
                />
                { total > 0 &&
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        <BlaclTextTypography variant='subtitle1' >
                            Títulos
                        </BlaclTextTypography>
                        <Typography variant='caption'>
                            Total acciones : {total}
                        </Typography>
                    </div>
                }
               <List dense='true'          
                    subheader={ total > 0 &&
                    <ListSubheader component="div" id="nested-list-subheader">
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Typography variant='caption'>
                            F.Compra
                        </Typography>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Typography variant='caption'>
                            Título
                        </Typography>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Typography variant='caption'>
                            Cantidad
                        </Typography>
                        </ListSubheader>          
                    }
                    > 
                        {titulos.map(item => (
                            <ListItem 
                                key={item.titulo} 
                                //button
                                //onClick={()=>history.push(item.path)}
                                
                                >
                                <ListItemText>{item.fechaCompra}</ListItemText>                                
                                <ListItemText>{item.titulo}</ListItemText>
                                <TextField size='small'  type="number" defaultValue={item.acciones} inputProps={{ style: { textAlign: 'right' }}} />

                            </ListItem>
                            
                        ))}
                </List>
            </div>
        </Grid>

        
        <Grid item xs={4} >
            <div className={classes.cedente}>
               <Autocomplete
                  value={valCesionario}
                  id="heredero1"
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)'}}
                  renderInput={(params) => <TextField {...params} label="Heredero" margin="normal"  helperText='' variant="outlined"/>}
                  onChange={(option, value) => handleClickCesionario(option, value)}
   
                />
                { CountHeredero > 1 &&
               <Autocomplete
                  value={valCesionario}
                  id="heredero2"
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)'}}
                  renderInput={(params) => <TextField {...params} label="Heredero" margin="normal" helperText='' variant="outlined"/>}
                  onChange={(option, value) => handleClickCesionario(option, value)}
                />
                }
                { CountHeredero > 2 &&
               <Autocomplete
                  value={valCesionario}
                  id="heredero3"
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)'}}
                  renderInput={(params) => <TextField {...params} label="Heredero" margin="normal" helperText='' variant="outlined"/>}
                  onChange={(option, value) => handleClickCesionario(option, value)}
                />
}
{ CountHeredero > 3 &&
               <Autocomplete
                  value={valCesionario}
                  id="heredero4"
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)'}}
                  renderInput={(params) => <TextField {...params} label="Heredero" margin="normal" helperText='' variant="outlined"/>}
                  onChange={(option, value) => handleClickCesionario(option, value)}
                />  
}
{ CountHeredero > 4 &&       
               <Autocomplete
                  value={valCesionario}
                  id="heredero5"
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)'}}
                  renderInput={(params) => <TextField {...params} label="Heredero" margin="normal" helperText='' variant="outlined"/>}
                  onChange={(option, value) => handleClickCesionario(option, value)}
                />   
}                                                             
                <div>                            
                    <IconButton color='primary' onClick={() => setCountHeredero(CountHeredero + 1)} disabled={CountHeredero===20 ? true : false}><ControlPointIcon/></IconButton>
                    <IconButton color='primary' onClick={() => setCountHeredero(CountHeredero - 1)} disabled={CountHeredero===1 ? true : false}><RemoveCircleOutlineIcon/></IconButton>
                </div>            
            </div>
        </Grid>

        <Grid item xs={1}>
        </Grid>

        <Grid item xs={3} container direction='column' justifyContent= 'flex-start' style={{backgroundColor:'#f9f9f9', padding:20}}>
          <BlaclTextTypography variant='subtitle1' >
            Documentos requeridos
          </BlaclTextTypography>
          <label htmlFor="upload-photo1">
            <input style={{ display: 'none' }} id="upload-photo1" name="upload-photo1" type="file" onChange={onChangeCS} />
            <Button component="span" color="primary" size='small' style={{marginTop:20}}>Carta de Posesión Efectiva</Button>
            {formData.cs.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>
          <label htmlFor="upload-photo4">
            <input style={{ display: 'none' }} id="upload-photo4" name="upload-photo4" type="file" onChange={onChangeES} />
            <Button component="span" color="primary" size='small' >Escritura de Posesión efectiva de Bienes</Button>
            {formData.es.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>
          <label htmlFor="upload-photo2">
            <input style={{ display: 'none' }} id="upload-photo2" name="upload-photo2" type="file" onChange={onChangeCG} />
            <Button component="span" color="primary" size='small' >Impuesto a la Herencia</Button>
            {formData.cg.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>

          <label htmlFor="upload-photo3">
            <input style={{ display: 'none' }} id="upload-photo3" name="upload-photo3" type="file" onChange={onChangeCI} />
            <Button component="span" color="primary" size='small' >Declaración Jurada</Button>
            {formData.ci.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>

          <label htmlFor="upload-photo5">
            <input style={{ display: 'none' }} id="upload-photo5" name="upload-photo5" type="file" onChange={onChangeCP} />
            <Button component="span" color="primary" size='small' >Carta Poder</Button>
            {formData.cp.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>
        </Grid>
        <Grid item xs={12} style={{paddingTop:20}} >
          <Divider/>
        </Grid>
        <Grid item xs={12} container direction='row' justifyContent= 'flex-end'>

        <Button                
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<SaveIcon/>}                    
                    size='small'
                    onClick={addOperacion}
                >
                    Solicitar aprobación
                </Button>
        </Grid>

  
      </Grid>


      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success">
          Se registró Cesión en estado Pendiente!
        </Alert>
      </Snackbar>

     </Paper>

  </main>




    
  );
}