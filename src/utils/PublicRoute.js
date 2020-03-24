import React, { Component, useContext, useEffect } from "react";
import { Redirect, Route } from "react-router";
import { Context } from "./store";

export const PublicRoute = ({ component: Component, auth, ...rest }) => {
  const { state } = useContext(Context);

  useEffect(() => {
    console.log("in public routes", state.userAuth);
  }, [state]);

  return (
    <Route
      {...rest}
      render={props =>
        state.userAuth ? <Redirect to="/app/home" /> : <Component {...props} />
      }
    />
  );
};
