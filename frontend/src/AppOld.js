import React, { Component } from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Four0Four from "./views/Four0Four";
import Profile from "./views/Profile";
import Login from "./views/Login";
import Register from "./views/Register";
import CreateContribution from "./views/CreateContribution";
import TopBar from "./components/TopBar";
import UserContext from "./context/UserContext";
import axios from "axios";
axios.defaults.withCredentials = true;

class App extends Component {

  state = {
    gotResponse: false,
    loggedIn: false,
    toggleLoggedIn: ()=>this.setState({loggedIn: !this.state.loggedIn}),
    username: "",
    profileRef: "",
    setContext: (key, value)=>{
      let params = {}
      params[key] = value;
      this.setState(params);
    },
    auth: async ()=>{
      try{
        let res = await axios.post("https://localhost:7034/user/auth", {withCredentials: true});
        if(res.status === 200){
          this.setState({
            username: res.data.username,
            profileRef: res.data.profileRef,
            loggedIn: true,
            gotResponse: true});
        }
      }
      catch(err){
        this.setState({gotResponse: true});
      }
    }
  };

  componentWillMount(){
     this.state.auth();
  }

  routeBasedOnLogin = ()=>{
    if(!this.state.loggedIn){
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
        <TopBar/>
        <Switch>
          <Route exact path="/" component={Profile} profileRef={this.state.profileRef}/>
          <Route exact path="/profile" component={Profile} profileRef={this.state.profileRef}/>
          <Route  path="/profile/" component={Profile}/>
          <Route exact path="/login" component={Profile} profileRef={this.state.profileRef}/>
          <Route exact path="/CreateContribution" component={CreateContribution}/>
          <Route component={Four0Four}/>
        </Switch>
      </Router>
    );
  }
  
  render() {
    return (
      <UserContext.Provider value={this.state}>
        <div className="App">
          {this.state.gotResponse ? this.routeBasedOnLogin() : null}
        </div>
      </UserContext.Provider>
    );
  }
}

export default App;