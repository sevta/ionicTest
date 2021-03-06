import React, { useEffect, useState, useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  setupConfig,
  IonPage,
  IonSpinner,
  IonContent
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Global CSS */
import "./global.css";
import "./tailwind.css";

// btpn case
import SignIn from "./pages/BtpnCase/Auth/SignIn";
import SignUp from "./pages/BtpnCase/Auth/SignUp";
import { Context } from "./utils/store";
import Tabs from "./Tabs";
import { fire, db } from "./utils/firebase";
import Loading from "./components/Loading";
import { PrivateRoute } from "./utils/PrivateRoute";
import { PublicRoute } from "./utils/PublicRoute";
import { Plugins, StatusBarStyle } from "@capacitor/core";

const { StatusBar } = Plugins;

StatusBar.setBackgroundColor({
  color: "#1eb2a6"
});

setupConfig({
  // mode: "ios",
  rippleEffect: true
});

const App = () => {
  const { state, dispatch } = useContext(Context);
  const [loadingCheckAuth, setLoadingCheckAuth] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    document.querySelector("body").classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  useEffect(() => {
    console.log("user change", state.user.topTen);
  }, [state.user.topTen]);

  useEffect(() => {
    // seeding fake user
    fetchUsers(12, data => dispatch({ type: "seed_users", payload: data }));
    fetchUsers(40, data => dispatch({ type: "seed_users2", payload: data }));

    getAllUsers();

    // auth check
    checkUserAuth();
  }, []);

  function getAllUsers() {
    db.collection("users")
      .limit(10)
      .onSnapshot(doc => {
        let data = [];

        doc.forEach(d => {
          console.log(d.data());
          data.push(d.data());
        });
        console.log("data", data);
        dispatch({ type: "fetch_top_ten", payload: data });
      });
  }

  function checkUserAuth() {
    fire.auth().onAuthStateChanged(user => {
      console.log("Check auth", user);

      if (user) {
        console.log("Authed ?", user);

        // realtime update user every they changed field
        db.collection("users")
          .doc(user.uid)
          .onSnapshot(doc => {
            let user = doc.data();
            dispatch({ type: "user_auth", payload: true });
            dispatch({
              type: "add_user",
              payload: {
                uid: user.uid,
                refreshToken: user.refreshToken,
                photoUrl: user.photoURL,
                displayName: user.displayName,
                email: user.email,
                isAnonymous: user.isAnonymous,
                game: {
                  powerUpScore: {
                    currentLevel: 0,
                    score: 0
                  },
                  levelUpScore: {
                    currentLevel: 0,
                    score: 0
                  }
                }
              }
            });
            setLoadingCheckAuth(false);
          });
      } else {
        console.log("not auth");
        dispatch({ type: "user_auth", payload: false });
        dispatch({ type: "remove_user" });
        setLoadingCheckAuth(false);
      }
    });
  }

  function fetchUsers(len, cb) {
    return fetch(`https://randomuser.me/api/?results=${len}`)
      .then(resp => resp.json())
      .then(data => (cb ? cb(data.results) : null))
      .catch(err => console.log(err));
  }

  if (loadingCheckAuth) {
    return <Loading />;
  } else {
    return (
      <IonApp>
        <IonReactRouter>
          <IonPage>
            <IonRouterOutlet>
              <PublicRoute path="/signin" component={SignIn} />
              <PublicRoute path="/signup" component={SignUp} />
              <Redirect exact from="/" to="/signin" />
            </IonRouterOutlet>
            <PrivateRoute path="/app" component={Tabs} />
          </IonPage>
        </IonReactRouter>
      </IonApp>
    );
  }
};

console.clear();

export default App;
