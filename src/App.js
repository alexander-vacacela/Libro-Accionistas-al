import React, { useState, useEffect } from 'react';
//import './App.css';
import {AmplifyAuthContainer, AmplifyAuthenticator, AmplifySignOut,AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import logo from './images/logoUNACEMmedMarco.jpg';

import { Switch, Route, Link } from "react-router-dom";

import Orders from "./components/orders";
import Dashboard from "./components/dashboard";
import Accionistas from './components/accionistas';
import Cesion from './components/cesion'
import Transferencias from './components/transferencias'
import Blotter from './components/blotter'
import Operaciones from './views/blotter';
import Layout from './components/layout';

function App() {

    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();
  
    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);
    

    return authState === AuthState.SignedIn && user ? (
        <div>            

            <Layout>
              <Switch>
                <Route path="/orders">
                  <Orders/>
                </Route>
                <Route path="/accionistas">
                  <Accionistas />
                </Route>
                <Route path="/cesion">
                  <Cesion />
                </Route>
                <Route path="/transferencias">
                  <Transferencias/>
                </Route>
                <Route path="/blotter">
                  <Blotter/>
                </Route>

                <Route path="/">
                  <Operaciones/>
                </Route>
              </Switch>
              </Layout>
        </div>
    ) : (
      <div style={{backgroundColor:"white",  backgroundImage: `url(${logo})`, backgroundRepeat: "no-repeat"}}>         
        <AmplifyAuthContainer>
          <AmplifyAuthenticator>        
            <AmplifySignIn
              hideSignUp="true" 
              slot="sign-in" 
              headerText="Libro de Accionistas"
              submitButtonText="Iniciar Sesión"            
              />
          </AmplifyAuthenticator>
        </AmplifyAuthContainer>
    </div>
  );

}

export default App;
