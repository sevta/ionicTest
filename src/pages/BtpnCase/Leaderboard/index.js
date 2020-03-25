import React, { useState, useEffect, useContext } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonList,
  IonItem,
  IonSpinner
} from "@ionic/react";
import "./index.scss";
import { isPlatform } from "@ionic/react";
import { db } from "../../../utils/firebase";
import { Context } from "../../../utils/store";

export default function Leaderboard() {
  const [currentTab, setCurrentTab] = useState("power-up");
  const { state, dispatch } = useContext(Context);

  function onSegmentChanged(ev) {
    let choice = ev.detail.value;
    setCurrentTab(choice);
  }

  function renderTab() {
    switch (currentTab) {
      case "power-up": {
        Array(20)
          .fill("")
          .map((l, i) => <Ranking ranking={i + 1} username="John Doe" />);
        break;
      }

      case "level-up": {
        Array(20)
          .fill("")
          .map((l, i) => <Ranking ranking={i + 1} username="Musli" />);
        break;
      }
      default: {
        break;
      }
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Leaderboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={isPlatform("ios") ? "ion-padding" : ""}>
          <IonSegment value={currentTab} onIonChange={onSegmentChanged}>
            <IonSegmentButton value="power-up">Power Up</IonSegmentButton>
            <IonSegmentButton value="level-up">Level Up</IonSegmentButton>
          </IonSegment>
        </div>

        <IonList>
          {state.topTen ? (
            state.topTen.map((l, i) => (
              <Ranking
                ranking={i + 1}
                username={state.user.displayName || "Anonymous"}
                key={i}
              />
            ))
          ) : (
            <IonSpinner />
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

function Ranking({ ranking, username }) {
  return (
    <IonItem button>
      <IonLabel className="">
        <div className="text-sm capitalize">
          {ranking} {username}
        </div>
      </IonLabel>
    </IonItem>
  );
}
