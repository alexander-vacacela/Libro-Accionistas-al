import React, { useState, useEffect } from 'react';
import {AmplifyAuthContainer, AmplifyAuthenticator,AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Switch, Route, Redirect } from "react-router-dom";
import logo from './images/logoUNACEMmedMarco.jpg';

import Accionistas from './views/accionistas';
import Cesion from './views/cesion'
import Operaciones from './views/blotter';
import Layout from './components/layout';
import PersonaNatural from './views/personanatural';


function App() {

    const [authState, setAuthState] = useState();
    const [user, setUser] = useState();
  
    useEffect(() => {

        return onAuthUIStateChange((nextAuthState, authData) => {

            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);
    

    return authState === AuthState.SignedIn && user ? (
        <div>            
          <Layout>
            <Switch>
            <Route path="/personanatural">
                <PersonaNatural />
              </Route>              
              <Route path="/accionistas">
                <Accionistas />
              </Route>
              <Route path="/cesion">
                <Cesion />
              </Route>
              <Route path="/blotter">
                <Operaciones/>
              </Route>
              <Route path="/">
                <Redirect to="/blotter" />
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
