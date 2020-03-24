import React, { Component, useContext, useEffect } from "react";
import { Redirect, Route } from "react-router";
import { Context } from "./store";

export const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  const { state } = useContext(Context);

  useEffect(() => {
    console.log("in private routes", state.userAuth);
  }, [state]);

  return (
    <Route
      {...rest}
      render={props =>
        state.userAuth ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};
