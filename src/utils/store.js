import React, { createContext, useReducer } from "react";

let reducer = (state, action) => {
  switch (action.type) {
    case "increment": {
      return {
        ...state,
        count: state.count + 1
      };
    }
    case "toggle_darkmode": {
      return {
        ...state,
        darkMode: !state.darkMode
      };
    }
    case "seed_users": {
      return {
        ...state,
        users: [...state.users, ...action.payload]
      };
    }
    case "seed_users2": {
      return {
        ...state,
        users2: [...state.users2, ...action.payload]
      };
    }
    case "user_auth": {
      return {
        ...state,
        userAuth: action.payload
      };
    }
    case "add_user": {
      return {
        ...state,
        user: {
          ...action.payload
        }
      };
    }
    case "remove_user": {
      return {
        ...state,
        user: {}
      };
    }
    default:
      return;
  }
};

const initialState = {
  count: 0,
  darkMode: false,
  users: [],
  users2: [],
  user: {},
  userAuth: false
};

const Context = createContext(initialState);

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
}

export { Context, Provider };
