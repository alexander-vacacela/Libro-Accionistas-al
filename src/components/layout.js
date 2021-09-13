import React from 'react';
import {  AppBar, Toolbar, Typography, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { reportListItems, secondaryListItems } from './listitems';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';

import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import PeopleIcon from '@material-ui/icons/People';
import ViewListIcon from '@material-ui/icons/ViewList';
import DescriptionIcon from '@material-ui/icons/Description';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import { useHistory, useLocation } from 'react-router';

import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import logo from '../images/Unacem.png';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root : {
        display: 'flex',
    },
    page : {
        //width: '100%',
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawerClose: {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9) + 1,
        },
      },
      menuButton: {
        //marginRight: 36,
        //display: 'block',
      },
      menuButtonHidden: {
        display: 'none',
      },
      
      active: {
          background: '#FFBF69'
      },
//close
      appBar: {
        //zIndex: theme.zIndex.drawer + 1,
        paddingLeft : theme.spacing(7),
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),      
        background: 'transparent', boxShadow: 'none',
      },
      //open
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
      title: {
        flexGrow: 1,
        fontSize: 14,
        color: 'black'
      },
    }));

export default function Layout({children}){
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
      setOpen(true);
    };
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const history = useHistory()
    const location = useLocation()

    const menuItems = [
        /*
        {
          label: "Inicio",
          path: "/Dashboard",
          icon: <DashboardIcon />
        },
        */
        {
            label: "Blotter",
            path: "/blotter",
            icon: <AssignmentTurnedInIcon color='black' />
          },
        {
          label: "Accionistas",
          path: "/accionistas",
          icon: <PeopleIcon color='black'/>
        },
        {
          label: "Asambleas",
          path: "/logout",
          icon: <GroupWorkIcon color='black'/>
        },
        {
            label: "Dividendos",
            path: "/logout",
            icon: <AttachMoneyIcon color='black'/>
        },
    ];

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickOperaciones = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleCloseOperaciones = () => {
      setAnchorEl(null);
    };

    return(
        <div className={classes.root}>

            <AppBar  className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                <IconButton
                    edge="start"
                    //color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                >
                    <MenuIcon color='black'/>
                </IconButton>


                <Typography  color="black" noWrap className={classes.title}>
                    Libro de accionistas{location.pathname.replace('/', ' > ') }
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<AddIcon/>}                    
                    size='small'
                >
                    Cesión
                </Button>

                &nbsp;&nbsp;&nbsp;&nbsp;

                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickOperaciones} color='primary' size='small'>
                    + Operaciones
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

                </Toolbar>
            </AppBar>

            <Drawer
                    variant="permanent"
                    anchor='left'
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                      })}
                      classes={{
                        paper: clsx({
                          [classes.drawerOpen]: open,
                          [classes.drawerClose]: !open,
                        }),
                      }}
                    /*
                    classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                    open={open}*/
                >
                     <img src={logo} alt="Logo" width='40' height='40' style={{marginLeft:15, marginTop:10, marginBottom:10}}/>
                    <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose} className={clsx(classes.menuButton, !open && classes.menuButtonHidden)}>
                        <ChevronLeftIcon />
                    </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {menuItems.map(item => (
                            <ListItem 
                                key={item.label} 
                                button
                                onClick={()=>history.push(item.path)}
                                className={location.pathname == item.path ? classes.active : (location.pathname == '/' && item.path == '/blotter') ? classes.active : null}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText>{item.label}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>{secondaryListItems}</List>
                    <Divider />
                    <List>{reportListItems}</List>
            </Drawer>

            <div className={classes.page}>
                {children}
            </div>
        </div>
    )
}