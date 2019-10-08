import React, { Component, useState, useContext, useEffect } from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Four0Four from "../views/Four0Four";
import Profile from "../views/Profile1";
import Login from "../views/Login";
import Register from "../views/Register";
import CreateContribution from "../views/CreateContribution";
import NavBar from "../components/NavBar";
import axios from "axios";
import auth from "../util/auth";
import {UserContext, UserProvider} from "../context/UserContext";
axios.defaults.withCredentials = true;

export default function Main(){

  const { user, dispatch } = useContext(UserContext);
  let [loaded, setLoaded] = useState(false);

  useEffect(async ()=>{
    const {success, username, profileRef} = await auth();
    if(success){
        dispatch({type: "auth", username, profileRef});
    }
    setLoaded(true);
  }, []);

  function routeBasedOnLogin(){
    if(!user.loggedIn){
      return(
        <Router>
        <Switch>
          <Route path="/register" component={Register}/>
          <Route path="/" component={Login}/>
          <Route path="/login" component={Login}/>
          <Route path="/profile" component={Login}/>
          <Route component={Four0Four}/>
        </Switch>
        </Router>
      );
    }
    return(
      <Router>
      <NavBar/>
        <Switch>
          <Route exact path="/" component={Profile} profileRef={user.profileRef}/>
          <Route exact path="/profile" component={Profile} profileRef={user.profileRef}/>
          <Route  path="/profile/" component={Profile}/>
          <Route exact path="/login" component={Profile} profileRef={user.profileRef}/>
          <Route exact path="/CreateContribution" component={CreateContribution}/>
          <Route component={Four0Four}/>
        </Switch>
      </Router>
    );
  }

  return (
    <div className="Main">
        {loaded ? routeBasedOnLogin() : null}
    </div>
  );
}