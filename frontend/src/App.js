import React from "react";
import {UserProvider} from "./context/UserContext";
import Main from "./views/Main";

export default function App(){
  return (
    <UserProvider>
      <div className="app">
        <Main />
      </div>
    </UserProvider>
  );
}