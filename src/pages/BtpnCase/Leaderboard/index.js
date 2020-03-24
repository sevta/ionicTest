import React, { useState } from "react";
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
  IonItem
} from "@ionic/react";

export default function Leaderboard() {
  const [currentTab, setCurrentTab] = useState("power-up");

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
      <IonContent className="ion-padding">
        <IonSegment value={currentTab} onIonChange={onSegmentChanged}>
          <IonSegmentButton value="power-up">Power Up</IonSegmentButton>
          <IonSegmentButton value="level-up">Level Up</IonSegmentButton>
        </IonSegment>
        <IonList>
          {Array(20)
            .fill("")
            .map((l, i) => (
              <Ranking ranking={i + 1} username="Marwahhh" key={i} />
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

function Ranking({ ranking, username }) {
  return (
    <IonItem>
      <IonLabel>
        {ranking} {username}
      </IonLabel>
    </IonItem>
  );
}
