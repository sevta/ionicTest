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
  IonSpinner,
  IonNote,
  IonAvatar,
  IonLoading
} from "@ionic/react";
import "./index.scss";
import { isPlatform } from "@ionic/react";
import { db } from "../../../utils/firebase";
import { Context } from "../../../utils/store";
import Loading from "../../../components/Loading";
export default function Leaderboard() {
  const [currentTab, setCurrentTab] = useState("power-up");
  const [loadingPage, setLoadingPage] = useState(true);
  const { state, dispatch } = useContext(Context);

  function onSegmentChanged(ev) {
    let choice = ev.detail.value;
    setCurrentTab(choice);
  }

  useEffect(() => {
    console.log("leaderboard", state);
    setTimeout(() => {
      setLoadingPage(false);
    }, 500);
  }, []);

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
        <IonLoading
          isOpen={loadingPage}
          spinner="crescent"
          onDidDismiss={() => setLoadingPage(false)}
        ></IonLoading>
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
                username={l.displayName || "Anonymous"}
                score={l.game ? l.game.levelUpScore.score : 0}
                img={
                  l.photoURL ||
                  "https://images.unsplash.com/photo-1557991666-3dc7eae97614?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
                }
                key={i}
                goTo={`/app/profile/${l.uid}`}
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

function Ranking({ ranking, img, username, score, goTo }) {
  return (
    <IonItem button routerLink={goTo}>
      <IonAvatar slot="start">
        <img
          style={{
            width: "100%",
            height: "100%"
          }}
          src={img}
          alt=""
        />
      </IonAvatar>
      <IonLabel className="">
        <div className="text-sm capitalize">
          {ranking} {username}
        </div>
      </IonLabel>
      <IonNote slot="end">
        <IonLabel>
          <div className="text-sm font-bold">{score}</div>
        </IonLabel>
      </IonNote>
    </IonItem>
  );
}
