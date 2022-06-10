import React,{useState} from 'react';
import {makeStyles} from '@material-ui/core';

import Header from './header'
import SideBar from './sidebar'


const useStyles = makeStyles((theme) => ({
    root : {
        display: 'flex',
    },
    page : {
        width: '100%',
    },
    }));

export default function Layout({children}){
    const classes = useStyles();
    const [open, setOpen] = useState(false);



    const handleDrawer = () => {
      setOpen(!open);
    };

    return(
        <div className={classes.root}>

            <Header handleDrawer={handleDrawer} open={open}/>

            <SideBar open={open}/>

            <div className={classes.page}>
                {children}
            </div>

            
          </div>
    )
}