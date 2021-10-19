import React, { useState, useEffect } from 'react';
import { API,Storage } from 'aws-amplify';
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
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import FaceOutlinedIcon from '@material-ui/icons/FaceOutlined';
import NotInterestedOutlinedIcon from '@material-ui/icons/NotInterestedOutlined';
import DevicesOutlinedIcon from '@material-ui/icons/DevicesOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import FiberNewOutlined from '@material-ui/icons/FiberNewOutlined';


import Grid from '@material-ui/core/Grid';

import { Typography,  Button, ListItem, ListItemText, ListSubheader, List, Tooltip, Chip, 
  FormControl, RadioGroup, FormControlLabel, Radio, Box, Tabs, Tab,
  Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,} from '@material-ui/core';

import logo from './../images/UnderConstruction.gif';
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


  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  


  export default function Accionistas() {

    const [openTitulos, setOpenTitulos] = useState(false);
    const handleClose = () => setOpenTitulos(false);
    
    const [estado, setEstado] = useState('Activo');

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
        
        {
          field: "Info",
          width: 100,
          renderCell: (cellValues) => {
            return <IconButton  disabled={cellValues.row.cantidadAcciones > 0 ? false : true} onClick={() =>  
              //console.log('datos de accionista',cellValues.row )
              fetchTitulos(cellValues.row)
            } color='primary'><PageviewIcon /></IconButton>
          }
        },

        {
          field: "Herederos",
          width: 100,
          renderCell: (cellValues) => {
            return cellValues.row.herederos ? 
            <Tooltip title="Tiene herederos" >

              <GroupOutlinedIcon /> 
            </Tooltip>
            : null
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
    const [accionistaSeleccionado, setAccionistaSeleccionado]= useState({});


    const handleChange = (event) => {
      console.log("estado",event.target.value)
      setEstado(event.target.value);
      //fetchAccionistas(event.target.value);
    };
    
  


    useEffect(() => {

      fetchAccionistas();


    }, [estado]);
   
    async function fetchAccionistas() {

      console.log("entro a buscar con estado",estado)

      const filter = {
        estado: {
          eq: estado
        },
      }      
      const apiData = await API.graphql({ query: listAccionistas, variables: { filter: filter, limit: 1000} });
      const accionistasFromAPI = apiData.data.listAccionistas.items;

      console.log("accionistas",accionistasFromAPI)
      //await Promise.all(accionistasFromAPI.map(async accionista => {
      //return accionista;
      //}))

      setAccionistas(accionistasFromAPI);
      setRows(accionistasFromAPI);
      /*
      if(count === 0)
        {      
        setCount(1);
        setRows(accionistasFromAPI);
        }
*/        
        
        
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

      async function fetchTitulos(row) {

        console.log('entro', row)

        let filter = {
          accionistaID: {
              eq: row.id // filter priority = 1
          },
          estado: {
            ne: 'Inactivo'
          }
        };
    
        const apiData = await API.graphql({ query: listTitulos, variables: { filter: filter, limit : 1000} });
        const titulosFromAPI = apiData.data.listTitulos.items;
        setTitulos(titulosFromAPI);
        setAccionistaSeleccionado(row)
        setOpenTitulos(true)
        console.log('titulos', titulosFromAPI)
      }

      
      const [value, setValue] = useState(0);

      const handleChangeTab = (event, newValue) => {
        setValue(newValue);
      };


      const getPictureDI = e => {
        e.stopPropagation();
              
        Storage.get(accionistaSeleccionado.docIdentidadPrincipal)
          .then(url => {
            var myRequest = new Request(url);
            fetch(myRequest).then(function(response) {
              if (response.status === 200) {
                //setImageCS(url);
                window.open(url)
              }
            });
          })
          .catch(err => console.log(err));
          
      };

  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl component="fieldset" style={{display:'flex', alignItems:'flex-end'}}>
            <RadioGroup
              row
              aria-label="gender"
              name="controlled-radio-buttons-group"
              value={estado}
              onChange={handleChange}     

            >
            <FormControlLabel value="Activo" control={<Radio color="secondary" size="small" />} label={<span style={{ fontSize: '0.8rem' }}>Activos</span>} />
            <FormControlLabel value="Bloqueado" control={<Radio color="secondary" size="small" />} label={<span style={{ fontSize: '0.8rem' }}>Bloqueados</span>} />
            <FormControlLabel value="Inactivo" control={<Radio color="secondary" size="small" />} label={<span style={{ fontSize: '0.8rem' }}>Inactivos</span>} />
            </RadioGroup>
          </FormControl>
          <DataGrid
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


        <Dialog open={openTitulos} onClose={handleClose} aria-labelledby="form-dialog-title"  maxWidth = 'md'  >          
          <DialogTitle id="form-dialog-title">{accionistaSeleccionado.nombre}</DialogTitle>
          <DialogContent style={{height: '400px'}}>


            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
              <Tab label="Info" {...a11yProps(0)} />
              <Tab label="Documentos" {...a11yProps(1)} />
              <Tab label="Títulos" {...a11yProps(2)} />
              <Tab label="Historial" {...a11yProps(3)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>

            <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
              <div style={{marginRight:20}}>
                <Typography variant='caption' >
                  <strong>Tipo Identificación</strong>
                </Typography> 
                <Typography variant='body2'>
                  {accionistaSeleccionado.tipoIdentificacion}
                </Typography> 
              </div>
              <div>
                <Typography variant='caption'>
                  <strong>Identificación</strong>
                </Typography>             
                <Typography variant='body2'>
                  {accionistaSeleccionado.identificacion}
                </Typography> 
              </div>
            </div>

            <Typography variant='caption'>
              <strong>Nacionalidad</strong>
            </Typography> 
            <Typography variant='body2'>
              {accionistaSeleccionado.paisNacionalidad}
            </Typography> 
            <Typography variant='caption'>
              <strong>Dirección</strong>
            </Typography> 
            <Typography variant='body2'>
              {accionistaSeleccionado.direccionPais == null ? '-' : accionistaSeleccionado.direccionPais + ' ' + accionistaSeleccionado.direccionProvincia + ' ' + accionistaSeleccionado.direccionCiudad + ' ' + accionistaSeleccionado.direccionCalle + ' ' + accionistaSeleccionado.direccionNumero}
            </Typography> 
            <Typography variant='caption'>
              <strong>Cuenta Bancaria</strong>
            </Typography> 
            <Typography variant='body2'>
              {accionistaSeleccionado.nombreBanco == null ? '-' : accionistaSeleccionado.nombreBanco + ' ' + accionistaSeleccionado.tipoCuenta + ' ' + accionistaSeleccionado.cuentaBancaria}
            </Typography> 
            {accionistaSeleccionado.tipoPersona == 'PN' &&
            <div>            
              <Typography variant='caption'>
                <strong>Estado Civil</strong>
              </Typography> 
              <Typography variant='body2'>
                {accionistaSeleccionado.pn_estadoCivil == null ? '-' : accionistaSeleccionado.pn_estadoCivil}
              </Typography> 
            </div>
            }
            {accionistaSeleccionado.pn_estadoCivil == 'Casado' &&
            <div>
              <Typography variant='caption'>
                    <strong>Detalles Cónyugue</strong>
              </Typography> 
              <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                <div style={{marginRight:20}}>
                  <Typography variant='caption'>
                    <strong>Tipo Identificación</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.conyugue_tipoIdentificacion}
                  </Typography> 
                </div>
                <div style={{marginRight:20}}>            
                  <Typography variant='caption'>
                    <strong>Identificación</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.conyugue_identificacion}
                  </Typography> 
                </div>
                <div style={{marginRight:20}}>            
                  <Typography variant='caption'>
                    <strong>Nombre</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.conyugue_nombre}
                  </Typography> 
                </div>
                <div style={{marginRight:20}}>
                  <Typography variant='caption'>
                    <strong>Nacionalidad</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.conyugue_nacionalidad}
                  </Typography> 
                </div>
              </div>
            </div>
            }

            <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginRight:20}}>
                <div style={{marginRight:5}}>
                  <Typography variant='caption'>
                    <strong>Teléfono</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.telefono1 == null ? '-' : accionistaSeleccionado.telefono1}
                  </Typography>    
                </div>
                <div>
                  <Typography variant='caption'>
                    <strong>Observación</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.obs1 == null ? '-' : accionistaSeleccionado.obs1}
                  </Typography> 
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginRight:20}}>
                <div style={{marginRight:5}}>
                  <Typography variant='caption'>
                    <strong>Teléfono</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.telefono2 == null ? '-' : accionistaSeleccionado.telefono2}
                  </Typography> 
                </div>
                <div>            
                  <Typography variant='caption'>
                    <strong>Observación</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.obs2 == null ? '-' : accionistaSeleccionado.obs2}
                  </Typography> 
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginRight:20}}>
                <div style={{marginRight:5}}>
                  <Typography variant='caption'>
                    <strong>Teléfono</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.telefono3 == null ? '-' : accionistaSeleccionado.telefono3}
                  </Typography> 
                </div>
                <div>            
                  <Typography variant='caption'>
                    <strong>Observación</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.obs3 == null ? '-' : accionistaSeleccionado.obs3}
                  </Typography>
                </div>            
              </div>
            </div>

            <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
              <div style={{marginRight:20}}>
                <Typography variant='caption'>
                  <strong>Email</strong>
                </Typography> 
                <Typography variant='body2'>
                  {accionistaSeleccionado.email1 == null ? '-' : accionistaSeleccionado.email1}
                </Typography> 
              </div>
              <div style={{marginRight:20}}>                    
                <Typography variant='caption'>
                  <strong>Email</strong>
                </Typography> 
                <Typography variant='body2'>
                  {accionistaSeleccionado.email2 == null ? '-' : accionistaSeleccionado.email2}
                </Typography> 
              </div>
              <div style={{marginRight:20}}>                    
                <Typography variant='caption'>
                  <strong>Email</strong>
                </Typography> 
                <Typography variant='body2'>
                  {accionistaSeleccionado.email3 == null ? '-' : accionistaSeleccionado.email3}
                </Typography> 
              </div>
            </div>

            {accionistaSeleccionado.tipoPersona == 'PJ' &&
            <div>
              <Typography variant='caption'>
                <strong>Detalles Representante Legal</strong>
              </Typography> 
              <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginRight:20}}>
                <div style={{marginRight:20}}>
                  <Typography variant='caption'>
                    <strong>Tipo Identificación</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.repLegal_tipoIdentificacion == null ? '-' : accionistaSeleccionado.repLegal_tipoIdentificacion}
                  </Typography>
                </div>
                <div> 
                  <Typography variant='caption'>
                    <strong>Identificación</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.repLegal_identificacion == null ? '-' : accionistaSeleccionado.repLegal_identificacion}
                  </Typography> 
                </div>
              </div>

              <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginRight:20}}>
                <div style={{marginRight:20}}>
                  <Typography variant='caption'>
                    <strong>Nombre</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.repLegal_nombre == null ? '-' : accionistaSeleccionado.repLegal_nombre}
                  </Typography> 
                </div>
                <div style={{marginRight:20}}> 
                  <Typography variant='caption'>
                    <strong>Nacionalidad</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.repLegal_nacionalidad == null ? '-' : accionistaSeleccionado.repLegal_nacionalidad}
                  </Typography> 
                </div>
                <div style={{marginRight:20}}> 
                  <Typography variant='caption'>
                    <strong>Teléfono</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.repLegal_telefono == null ? '-' : accionistaSeleccionado.repLegal_telefono}
                  </Typography> 
                </div>
                <div style={{marginRight:20}}> 
                  <Typography variant='caption'>
                    <strong>Email</strong>
                  </Typography> 
                  <Typography variant='body2'>
                    {accionistaSeleccionado.repLegal_email == null ? '-' : accionistaSeleccionado.repLegal_email}
                  </Typography> 
                </div>
              </div>
            </div>
            }

            </TabPanel>
            <TabPanel value={value} index={1}>

            <div>
              <Typography variant='caption'>
                <strong>Documento de Identidad</strong>
              </Typography> 
              {accionistaSeleccionado.docIdentidadPrincipal  && 
                <div>
                  <CheckIcon />
                  <Button component="span" color="primary" size='small' onClick={getPictureDI}>Ver</Button>
                </div>
              }
              {!accionistaSeleccionado.docIdentidadPrincipal  && 
                  <div>
                  -
                  </div>
              }
            </div>  
            <div>
              <Typography variant='caption'>
                <strong>Certificado Bancario</strong>
              </Typography> 
              {accionistaSeleccionado.docCertificadoBancario  && 
                <div>
                  <CheckIcon />
                  <Button component="span" color="primary" size='small' onClick={getPictureDI}>Ver</Button>
                </div>
              }
              {!accionistaSeleccionado.docCertificadoBancario  && 
                  <div>
                  -
                  </div>
              }
            </div>  

            {accionistaSeleccionado.pn_estadoCivil == 'Casado'  && 
              <div>
                <Typography variant='caption'>
                  <strong>Documento de Identidad Cónyugue</strong>
                </Typography> 
                {accionistaSeleccionado.docIdentidadConyugue  && 
                  <div>
                    <CheckIcon />
                    <Button component="span" color="primary" size='small' onClick={getPictureDI}>Ver</Button>
                  </div>
                }
                {!accionistaSeleccionado.docIdentidadConyugue  && 
                    <div>
                    -
                    </div>
                }
              </div>  
            }

            </TabPanel>
            <TabPanel value={value} index={2}>
              <List dense='true'           
                subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:'100%', paddingLeft:'100px'}}>                
                    <Typography variant='caption' style={{flex:2, fontWeight:'bold'}}>
                      F.Compra
                    </Typography>
                    <Typography variant='caption' style={{flex:1, fontWeight:'bold'}}>
                      Título
                    </Typography>
                    <Typography variant='caption' style={{flex:1, fontWeight:'bold', display:'flex', alignItems:'flex-end', justifyContent:'flex-end', paddingRight:'30px'}}>
                      Cantidad
                    </Typography>
                    <Typography variant='caption' style={{flex:2, fontWeight:'bold'}}>
                      Estado
                    </Typography>   
                  </div>                               
                </ListSubheader>            
                }> 
                {titulos.map(item => (
                  <ListItem  key={item.id}>  
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:'100%', paddingLeft:'100px'}}>                                                            
                      <ListItemText style={{flex:2}}>{item.fechaCompra}</ListItemText>                                
                      <ListItemText style={{flex:1}}>{item.titulo}</ListItemText>
                      <ListItemText style={{flex:1, display:'flex', alignItems:'flex-end', justifyContent:'flex-end', paddingRight:'30px'}}>{item.acciones}</ListItemText>
                      <ListItemText style={{flex:2}}>{item.estado}</ListItemText>
                    </div>
                  </ListItem>))}
              </List>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <img src={logo} alt="loading..." width='150' height='200' />
              </div>
            </TabPanel>



          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" >
              Salir
            </Button>
          </DialogActions>
        </Dialog>



         
      </Grid>
    </main>
  );
}