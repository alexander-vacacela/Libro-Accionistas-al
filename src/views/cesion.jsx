import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Container, Divider, Toolbar, Typography } from '@material-ui/core';


import FormControl from '@material-ui/core/FormControl';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { listAccionistas, listTitulos } from './../graphql/queries';
import {createOperaciones, createTituloPorOperacion} from './../graphql/mutations';

import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from "@material-ui/core/styles";

import {  ListItem, ListItemText, ListSubheader,ListItemSecondaryAction,ListItemIcon } from '@material-ui/core';
import List from '@material-ui/core/List';
//import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

//import { v4 as uuid } from 'uuid'
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

}));


const menuItems = [
  {
      titulo: "265",
      fecha: "02/08/2020",
      cantidad : 500
    },
  {
    titulo: "360",
    fecha: "25/10/2020",
    cantidad : 750
  },
  {
    titulo: "401",
    fecha: "02/01/2021",
    cantidad : 200
  },
  {
    titulo: "483",
    fecha: "17/05/2021",
    cantidad : 500
  },
];

const titPorOper = [
  {
      operacionID: "fe46b292-4ea4-4ab1-b74b-bbe20121ad11",
      titulo: "777",
      acciones : 222
    },
  {
    operacionID: "fe46b292-4ea4-4ab1-b74b-bbe20121ad11",
    titulo: "254",
    acciones : 750
  },
];


const today = new Date();
const fecha = today.getDate() + '-' + (today.getMonth() + 1) + '-' +  today.getFullYear();
/*
const initialFormState = {
  fecha: fecha, operacion: 'Cesión', 
  idCedente: '', cedente: '', idCesionario:'', cesionario: '', 
  titulo: '' , acciones: 0, 
  estado: 'Pendiente', usuarioIngreso: 'Jorge', usuarioAprobador: '',
  cs: '', cg: '', ci: '', es: '', cp: ''}

*/

export default function Cesion() {

  const classes = useStyles();
 
  const [formData, setFormData] = useState({
    fecha: fecha, operacion: 'Cesión', 
    idCedente: '', cedente: '', idCesionario:'', cesionario: '', 
    titulo: '' , acciones: 0, 
    estado: 'Pendiente', usuarioIngreso: 'Jorge', usuarioAprobador: '',
    cs: '', cg: '', ci: '', es: '', cp: ''});

  const [formDataTitulos, setFormDataTitulos] = useState({ titulos : {
      operacionID: '', titulo: '',acciones: '' }});

  const [formDataTitulos2, setFormDataTitulos2] = useState({});
  
  const [valCedente,setValCedente]=useState({})
  const [valCesionario,setValCesionario]=useState({})

  const [total, setTotal] = useState(0);

  const [checked, setChecked] = useState([0]);

  const [openTitulos, setOpenTitulos] = useState(false);
  
  const [accionistas, setAccionistas] = useState([])
  
  const [titulos, setTitulos] = useState([])
  
  const [titulosSelectos, setTitulosSelectos] = useState([])
  
  const [openSnack, setOpenSnack] = React.useState(false);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    //console.log(newChecked);
  };


  const addOperacion = async () => {
    try {
      console.log("operacion", formData);
      
        if (!formData.cedente || !formData.cesionario) return

        const operacion = { ...formData }
        const operacionTitulos = { ...formDataTitulos }; 

        setFormData({ fecha: fecha, operacion: 'Cesión', idCedente: '', cedente: '', idCesionario: '', cesionario: 'JY',titulo: '' , acciones: '',  estado: 'Pendiente', usuarioIngreso: 'Jorge', usuarioAprobador: '', cs: '', cg: '', ci: '', es: '', cp: ''})
        setFormDataTitulos({ titulos : {operacionID: '', titulo: '',acciones: '' }})
        const operID = await API.graphql(graphqlOperation(createOperaciones, { input: operacion }))

        var filteredTitulos = titulos.filter(function(itm){
          return checked.indexOf(itm.id) > -1;
        });
        const transferir = filteredTitulos.map(function(e) {
          return {operacionID: operID.data.createOperaciones.id, titulo : e.titulo, acciones: e.acciones} ;
        })
     

        Promise.all(
          transferir.map(input => API.graphql(graphqlOperation(createTituloPorOperacion, { input: input })))
        ).then(values => {
          console.log(values); // [3, 1337, "foo"]

          setOpenSnack(true)
          setChecked([])
          setTitulos([])
          setTitulosSelectos([])
          setTotal(0)
          setValCedente({})
          setValCesionario({})

        });

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
    //console.log('accionistas', accionistas);
  }

  async function fetchTitulos(cedente) {

    let filter = {
      accionistaID: {
          eq: cedente // filter priority = 1
      }
  };

    //console.log('cedenteid', cedente);
    //console.log('filtros', filter);

    const apiData = await API.graphql({ query: listTitulos, variables: { filter: filter} });
    const titulosFromAPI = apiData.data.listTitulos.items;
    await Promise.all(titulosFromAPI.map(async titulos => {
    return titulos;
    }))
    setTitulos(apiData.data.listTitulos.items);
    //console.log('titulos', apiData.data);
  }

const handleClickCedente = (option, value) => {  

  if(value)
  {

    setValCedente(value)

    setFormData({ ...formData, 'idCedente': value.id, 'cedente': value.nombre})
    fetchTitulos(value.id);

    setChecked([])
    setTitulosSelectos([])
    setTotal(0)

  }
  else {

    setFormData({ ...formData, 'idCedente': '', 'cedente': '' })
    setChecked([])
    setTitulos([])
    setTitulosSelectos([])
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
  console.log('click cesionario', formData);
}


const handleOpenTitulos = () => {
  setOpenTitulos(true);
};

const handleCloseTitulos = () => {
  setOpenTitulos(false);
};

const handleSeleccionarTitulos = () => {
  //  var data = { records : [{ "empid": 1, "fname": "X", "lname": "Y" }, { "empid": 2, "fname": "A", "lname": "Y" }, { "empid": 3, "fname": "B", "lname": "Y" }, { "empid": 4, "fname": "C", "lname": "Y" }, { "empid": 5, "fname": "C", "lname": "Y" }] }
  //var empIds = [1,4,5]
  var filteredTitulos = titulos.filter(function(itm){
    return checked.indexOf(itm.id) > -1;
  });

  //console.log('filtrados',filteredTitulos)
  //filteredTitulos = { records : filteredArray };
  setTitulosSelectos(filteredTitulos)


  const tituloString = filteredTitulos.map(function(titulos){
    return titulos.titulo;
  }).join(" | ");
  //console.log(tituloString);
  //setFormData({ ...formData, 'titulo': tituloString })

  const sum = filteredTitulos.reduce(function(prev, current) {
    return prev + +current.acciones
  }, 0);
  setTotal(sum);

  //setFormData({ ...formData, 'acciones': sum })

  const transferir = filteredTitulos.map(function(e) {
    return {operacionID: '', titulo : e.titulo, acciones: e.acciones} ;
  })

  console.log('transferir',transferir);
  setFormDataTitulos({ ...formDataTitulos, 'titulos': transferir })
  setFormDataTitulos2({ ...formDataTitulos2,  transferir })

  setFormData({ ...formData, 'titulo': tituloString,'acciones': sum})
  setOpenTitulos(false);


};

/*
const handleInputAccionesChange = (e) => {
  setTitulosSelectos({
      [e.target.name]: e.target.value
  });
}
*/
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

      <Dialog open={openTitulos} onClose={handleSeleccionarTitulos} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Títulos de {formData.cedente}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seleccionar los títulos a transferir
          </DialogContentText>

          <List dense='true'           
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Typography variant='caption'>
                F.Compra
              </Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Typography variant='caption'>
                Título
              </Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Typography variant='caption'>
                Cantidad
              </Typography>
            </ListSubheader>
            
          }
          > 
                        {titulos.map(item => (
                            <ListItem 
                                key={item.id} 
                                button onClick={handleToggle(item.id)}
                                //button
                                //onClick={()=>history.push(item.path)}
                                
                                >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(item.id) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': `checkbox-list-label-${item.id}` }}
              />
            </ListItemIcon>                                  
                                <ListItemText>{item.fechaCompra}</ListItemText>                                
                                <ListItemText>{item.titulo}</ListItemText>
                                <ListItemText>{item.acciones}</ListItemText>
 
                            </ListItem>
                            
                        ))}
                    </List>





        </DialogContent>
        <DialogActions>
          <Button onClick={handleSeleccionarTitulos} color="primary" >
            Seleccionar
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container>
        <Grid item xs={3} >
          <BlaclTextTypography variant='h6'>
              Cesión
              &nbsp;&nbsp;&nbsp;
              <Button aria-controls="simple-menu" aria-haspopup="true" color='primary' size='small' style={{textTransform: 'none'}}>
                + Crear nuevo accionista
              </Button>
          </BlaclTextTypography>
          <Autocomplete
                  value={valCedente}
                  id="combo-box-cedente"
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)'}}
                  renderInput={(params) => <TextField {...params} label="Cedente" margin="normal" />}
                  onChange={(option, value) => handleClickCedente(option, value)}
                />
                <Autocomplete
                  value={valCesionario}
                  id="combo-box-cecionario"
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)'}}
                  renderInput={(params) => <TextField {...params} label="Cesionario" margin="normal" />}
                  onChange={(option, value) => handleClickCesionario(option, value)}
                />

        </Grid>
        <Grid item xs={1} >
        </Grid>
        <Grid item xs={4}>

          <BlaclTextTypography variant='h6' >
            Títulos
            &nbsp;&nbsp;
            <Button aria-controls="simple-menu" aria-haspopup="true" color='primary' size='small' style={{textTransform: 'none'}} onClick={handleOpenTitulos}>
            + Agregar
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Typography variant='caption'>
                      Total acciones : {total}
                    </Typography>
          </BlaclTextTypography>
          

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
                        {titulosSelectos.map(item => (
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




        </Grid>

        <Grid item xs={1} >
        </Grid>
        <Grid item xs={3} container direction='column' justifyContent= 'flex-start'>
          <BlaclTextTypography variant='h6' >
            Documentos requeridos
          </BlaclTextTypography>

          <label htmlFor="upload-photo1">
            <input style={{ display: 'none' }} id="upload-photo1" name="upload-photo1" type="file" onChange={onChangeCS} />
            <Button component="span" color="primary" size='small' style={{marginTop:20}}>Carta de Cesión</Button>
            {formData.cs.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>
          <label htmlFor="upload-photo2">
            <input style={{ display: 'none' }} id="upload-photo2" name="upload-photo2" type="file" onChange={onChangeCG} />
            <Button component="span" color="primary" size='small' >Carta de Gerente</Button>
            {formData.cg.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>
          <label htmlFor="upload-photo3">
            <input style={{ display: 'none' }} id="upload-photo3" name="upload-photo3" type="file" onChange={onChangeCI} />
            <Button component="span" color="primary" size='small' >Carta de Instrucciones</Button>
            {formData.ci.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>
          <label htmlFor="upload-photo4">
            <input style={{ display: 'none' }} id="upload-photo4" name="upload-photo4" type="file" onChange={onChangeES} />
            <Button component="span" color="primary" size='small' >Escritura</Button>
            {formData.es.length > 0 && <IconButton ><CheckIcon /></IconButton>}
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
                    Transferir
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