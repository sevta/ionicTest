import React from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon
} from "@ionic/react";
import { Route, Redirect } from "react-router";
import Home from "./pages/BtpnCase/Home";
import Profile from "./pages/Profile";
import { home, person, barChart, settingsOutline } from "ionicons/icons";
import Leaderboard from "./pages/BtpnCase/Leaderboard";
import Stage from "./pages/BtpnCase/Stage";
import Settings from "./pages/BtpnCase/Settings";
import Game from "./pages/BtpnCase/Game";
import { PrivateRoute } from "./utils/PrivateRoute";

const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <PrivateRoute path="/app/home" component={Home} exact />
        <PrivateRoute path="/app/profile" component={Profile} exact />
        <PrivateRoute path="/app/leaderboard" component={Leaderboard} exact />
        <PrivateRoute path="/app/stage/:type" component={Stage} exact />
        <PrivateRoute path="/app/settings" component={Settings} exact />
        <PrivateRoute path="/app/game/:type/:stage" component={Game} exact />
        <PrivateRoute
          path="/app/"
          render={() => <Redirect to="/app/home" />}
          exact
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/app/home">
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/app/profile">
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>

        <IonTabButton tab="leaderboard" href="/app/leaderboard">
          <IonIcon icon={barChart} />
          <IonLabel>Leaderboard</IonLabel>
        </IonTabButton>

        <IonTabButton tab="settings" href="/app/settings">
          <IonIcon icon={settingsOutline} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
