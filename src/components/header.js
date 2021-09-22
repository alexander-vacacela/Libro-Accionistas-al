import React, {useState} from 'react'
import { useHistory, useLocation } from 'react-router';

import {  AppBar, Toolbar, Typography, makeStyles, Button, MenuItem, Menu, IconButton } from '@material-ui/core';
import clsx from 'clsx';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root : {
      display: 'flex',
  },
  //closed drawer
  appBar: {
    paddingLeft : theme.spacing(7),
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),      
    background: 'transparent', boxShadow: 'none',
  },
  //opened drawer
  appBarShift: {
    paddingLeft : theme.spacing(0),
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background: 'transparent', boxShadow: 'none',
  },
  toolBar: {
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 12,
    color: 'black'
  },
  leftToolbar : {
    display: 'flex',
    alignItems: 'center',
  },
  rightToolbar : {
   display: 'flex',
   alignItems: 'center',
   gap: 10,
  },
  button: {
    borderRadius: 20,
  }
}));


export default function Header(props){

  const classes = useStyles();
  const history = useHistory()
  const location = useLocation()

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElPerfil, setAnchorElPerfil] = useState(null);
  const [anchorElAccionista, setAnchorElAccionista] = useState(null);

  const openPerfil = Boolean(anchorElPerfil);


  const handleMenu = (event) => {
      setAnchorElPerfil(event.currentTarget);
    };
  
  const handleClose = () => {
    setAnchorElPerfil(null);
  };

  const handleClickOperaciones = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOperaciones = () => {
    setAnchorEl(null);
  };

  const handleClickAccionistas = (event) => {
    setAnchorElAccionista(event.currentTarget);
  };

  const handleCloseAccionistas = () => {
    setAnchorElAccionista(null);
  };

  return (

<div className={classes.root}>

<AppBar  className={clsx(classes.appBar, props.open && classes.appBarShift)}>
    <Toolbar className={classes.toolBar}>

    <div className={classes.leftToolbar}>
      <IconButton
          edge="start"
          color="primary"
          aria-label="open drawer"
          onClick={props.handleDrawer}
      >
          <MenuIcon color='black'/>
      </IconButton>
      <Typography variant='caption' color="black" noWrap className={classes.title}>
          Libro de Accionistas{location.pathname.replace('/', ' / ') }
      </Typography>
    </div>

  <div className={classes.rightToolbar}>

    <Button                
        variant="contained"
        color="primary"
        className={classes.button}
        //startIcon={<AddIcon/>}                    
        size='small'
        onClick={()=>history.push('/cesion')}
        style={{textTransform: 'none'}}
    >
        +  Cesión
    </Button>

    <Button aria-controls="menu-operaciones" aria-haspopup="true" onClick={handleClickOperaciones} color='primary' size='small' style={{textTransform: 'none'}}>
        +  Operaciones
    </Button>
    <Menu
        id="menu-operaciones"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseOperaciones}
    >
        <MenuItem onClick={handleCloseOperaciones}>Posesión Efectiva</MenuItem>
        <MenuItem onClick={handleCloseOperaciones}>Testamento</MenuItem>
        <MenuItem onClick={handleCloseOperaciones}>Donación</MenuItem>
        <MenuItem onClick={handleCloseOperaciones}>Canje</MenuItem>
        <MenuItem onClick={handleCloseOperaciones}>Bloqueo</MenuItem>
    </Menu>

    <Button aria-controls="menu-accionista" aria-haspopup="true" onClick={handleClickAccionistas} color='primary' size='small' style={{textTransform: 'none'}}>
        +  Accionista
    </Button>
    <Menu
        id="menu-accionista"
        anchorEl={anchorElAccionista}
        keepMounted
        open={Boolean(anchorElAccionista)}
        onClose={handleCloseAccionistas}
    >
        <MenuItem onClick={()=>{history.push('/personanatural'); setAnchorElAccionista(null);} }>Persona Natural</MenuItem>
        <MenuItem onClick={handleCloseAccionistas}>Persona Jurídica</MenuItem>
    </Menu>



    <IconButton
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={handleMenu}
      color="primary"
    >
      <AccountCircle />
    </IconButton>
    <Menu
      id="menu-appbar"
      anchorEl={anchorElPerfil}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={openPerfil}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClose}>Mi perfil</MenuItem>
      <MenuItem onClick={handleClose}>Salir</MenuItem>
    </Menu>

  </div>

    </Toolbar>
</AppBar>


    </div>
  )
}

 
