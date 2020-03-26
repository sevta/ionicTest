import React, { useContext, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonContent,
  IonButtons,
  IonButton
} from "@ionic/react";
import { Context } from "../../../utils/store";
import "./index.scss";

export default function Home() {
  const { state } = useContext(Context);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="z-10 relative text-white ion-padding text-3xl font-bold">
          <span>Hi, </span>
          <span>{state.user.displayName || "Anonymous"}</span>
        </div>
        <div className="rounded-header"></div>

        <div className="flex flex-col justify-start items-start ion-padding pt-0">
          <IonButton
            color="dark"
            routerLink="/app/stage/power-up"
            className="text-white"
          >
            Power Up
          </IonButton>
          <IonButton
            color="dark"
            routerLink="/app/stage/level-up"
            className="text-white"
          >
            Level Up
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
