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
        <div>
          <IonLabel>
            Hello
            {state.user.isAnonymous ? "Anonymous" : state.user.email}
          </IonLabel>
        </div>

        <IonButton routerLink="/app/stage/power-up" className="text-white">
          Power Up
        </IonButton>
        <IonButton routerLink="/app/stage/level-up" className="text-white">
          Level Up
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
