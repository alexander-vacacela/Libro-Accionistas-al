import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Container, Divider, Toolbar, Typography } from '@material-ui/core';


import FormControl from '@material-ui/core/FormControl';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { listAccionistas } from './../graphql/queries';
import {createOperaciones} from './../graphql/mutations';

import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from "@material-ui/core/styles";

import {  ListItem, ListItemText, ListSubheader,ListItemSecondaryAction } from '@material-ui/core';
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

const initialFormState = {
  fecha: '', operacion: 'Cesión', 
  idCedente: '', cedente: '', idCesionario:'', cesionario: '', 
  titulo: '' , acciones: 0, 
  estado: 'Pendiente', usuarioIngreso: 'Jorge', usuarioAprobador: '',
  cs: '', cg: '', ci: '', es: '', cp: ''}


export default function Cesion() {

  const [openTitulos, setOpenTitulos] = useState(false);

  const classes = useStyles();
  
  const [formData, setFormData] = useState(initialFormState);
 
  const [accionistas, setAccionistas] = useState([]);
  
  
  //const [operaciones, setOperaciones] = useState([]);
  //const [formState, setFormState] = useState({ fecha: '2021-09-09', operacion: 'Cesión', cedente: '', titulo: '111' , acciones: 111, cesionario: 'JY', estado: 'Pendiente', usuarioIngreso: 'Jorge', usuarioAprobador: '', });

  const addOperacion = async () => {
    try {
        if (!formData.cedente || !formData.cesionario) return
        const operacion = { ...formData }
        //setOperaciones([...operaciones, operacion])
        setFormData({ fecha: '2021-09-09', operacion: 'Cesión', idCedente: '', cedente: '', idCesionario: '', cesionario: 'JY',titulo: '111' , acciones: 111,  estado: 'Pendiente', usuarioIngreso: 'Jorge', usuarioAprobador: '', })
        await API.graphql(graphqlOperation(createOperaciones, { input: operacion }))
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
    console.log('accionistas', accionistas);
  }
/*
  const handleChange1 = (event) => {
    setArchivos({value1: event.target.value});
    console.log(archivos);
  }
*/
const handleClickCedente = (option, value) => {  
  console.log('cedente', value);

  if(value)
  {
    setFormData({ ...formData, 'idCedente': value.id })
    setFormData({ ...formData, 'cedente': value.nombre })
  }
  else {
    setFormData({ ...formData, 'idCedente': '' })
    setFormData({ ...formData, 'cedente': '' })
  }
}

const handleClickCesionario = (option, value) => {  
  if(value)
  {
    setFormData({ ...formData, 'idCesionario': value.id })
    setFormData({ ...formData, 'cesionario': value.nombre })
  }
  else {
    setFormData({ ...formData, 'idCesionario': '' })
    setFormData({ ...formData, 'cesionario': '' })
  }
}


const handleOpenTitulos = () => {
  setOpenTitulos(true);
};

const handleCloseTitulos = () => {
  setOpenTitulos(false);
};
  return (
    <main className={classes.content}>
    <div className={classes.appBarSpacer} />

      <Paper variant="outlined" className={classes.paper}>

      <Dialog open={openTitulos} onClose={handleCloseTitulos} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Títulos de {formData.cedente}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seleccionar los títulos a transferir
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTitulos} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseTitulos} color="primary" variant='contained'>
            Seleccionar
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container>
        <Grid item xs={3} >
          <BlaclTextTypography variant='h6'>
              Cesión
          </BlaclTextTypography>
          <Autocomplete
                  id="combo-box-cedente"
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)'}}
                  renderInput={(params) => <TextField {...params} label="Cedente" margin="normal" />}
                  onChange={(option, value) => handleClickCedente(option, value)}
                />
                      <Autocomplete
                  id="combo-box-cecionario"
                  options={accionistas}
                  getOptionLabel={(option) => option.nombre}
                  style={{ width: 'calc(100%)'}}
                  renderInput={(params) => <TextField {...params} label="Cesionario" margin="normal" />}
                  onChange={(option, value) => handleClickCesionario(option, value)}
                />
                <Button aria-controls="simple-menu" aria-haspopup="true" color='primary' size='small' style={{textTransform: 'none'}}>
                + Crear nuevo accionista
                </Button>
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
          </BlaclTextTypography>
          

          <List dense='true'
          
          subheader={
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
                        {menuItems.map(item => (
                            <ListItem 
                                key={item.titulo} 
                                //button
                                //onClick={()=>history.push(item.path)}
                                
                                >
                                <ListItemText>{item.fecha}</ListItemText>                                
                                <ListItemText>{item.titulo}</ListItemText>
                                <TextField size='small'  type="number" defaultValue={item.cantidad} inputProps={{ style: { textAlign: 'right' }}} />
                                <ListItemSecondaryAction>
                                  <IconButton edge="end" aria-label="delete">
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
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
            <input style={{ display: 'none' }} id="upload-photo1" name="upload-photo1" type="file" onChange={e => setFormData({ ...formData, 'cs': e.target.value})} />
            <Button component="span" color="primary" size='small' style={{marginTop:20}}>Carta de Cesión</Button>
            {formData.cs.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>
          <label htmlFor="upload-photo2">
            <input style={{ display: 'none' }} id="upload-photo2" name="upload-photo2" type="file" onChange={e => setFormData({ ...formData, 'cg': e.target.value})} />
            <Button component="span" color="primary" size='small' >Carta de Gerente</Button>
            {formData.cg.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>
          <label htmlFor="upload-photo3">
            <input style={{ display: 'none' }} id="upload-photo3" name="upload-photo3" type="file" onChange={e => setFormData({ ...formData, 'ci': e.target.value})} />
            <Button component="span" color="primary" size='small' >Carta de Instrucciones</Button>
            {formData.ci.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>
          <label htmlFor="upload-photo4">
            <input style={{ display: 'none' }} id="upload-photo4" name="upload-photo4" type="file" onChange={e => setFormData({ ...formData, 'es': e.target.value})} />
            <Button component="span" color="primary" size='small' >Escritura</Button>
            {formData.es.length > 0 && <IconButton ><CheckIcon /></IconButton>}
          </label>
          <label htmlFor="upload-photo5">
            <input style={{ display: 'none' }} id="upload-photo5" name="upload-photo5" type="file" onChange={e => setFormData({ ...formData, 'cp': e.target.value})} />
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
                    //onClick={()=>history.push('/cesion')}
                >
                    Transferir
                </Button>
        </Grid>

  
      </Grid>





     </Paper>

  </main>




    
  );
}