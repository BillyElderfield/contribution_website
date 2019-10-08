import React, { useReducer } from "react";

const reducer = (state, action)=>{
  switch (action.type) {
    case 'auth': {
      return { ...state, loggedIn: true, username: action.username, profileRef: action.profileRef };
    }
    case 'increment_following': {
      return { ...state, following: state.following-- };
    }
    case 'decrement_following': {
      return { ...state, following: state.following++ };
    }
    default: {
      return state;
    }
  }
}

const initialState = { 
  username: "",
  profileRef: "",
  loggedIn: false, 
  following: "",
};

const UserContext = React.createContext(initialState);

function UserProvider(props) {
  const [user, dispatch] = useReducer(reducer, initialState);
  return (
   <UserContext.Provider value={{ user, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };