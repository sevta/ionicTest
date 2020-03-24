import React, { useEffect, useState, useRef } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonContent,
  IonAlert,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon
} from "@ionic/react";
import { useParams } from "react-router";
import {
  chevronBack,
  chevronBackOutline,
  chevronForwardOutline
} from "ionicons/icons";
import "./index.scss";
import Loading from "../../../components/Loading";
import { TweenLite } from "gsap/all";

export default function Game({ history }) {
  const { type, stage } = useParams();
  const [loadingGame, setLoadingGame] = useState(true);

  useEffect(() => {
    console.log("game type", type);
    console.log("stage", stage);
    setTimeout(() => {
      setLoadingGame(false);
    }, 3000);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle className="capitalize">{type}</IonTitle>
        </IonToolbar>
      </IonHeader>
      {loadingGame ? (
        <Loading />
      ) : (
        <IonContent fullscreen>
          <GameBoard />
          <IonLabel className="ion-padding">
            <div className="text-2xl"> Stage {stage}</div>
          </IonLabel>
        </IonContent>
      )}
    </IonPage>
  );
}

function GameBoard() {
  const [value, setValue] = useState(0);
  const [ballX, setBallX] = useState(30);
  const [panX, setPanX] = useState(0);
  const [isFirstShoot, setIsFirstShoot] = useState(false);

  const goalPost = useRef();
  const ball = useRef();
  const pan = useRef();

  useEffect(() => {
    TweenLite.to(ball.current, 1, {
      y: value
    });
  }, [value]);

  useEffect(() => {
    if (!isFirstShoot) {
      TweenLite.to(pan.current, 0.45, {
        x: panX
      });
      TweenLite.to(ball.current, 1, {
        left: ballX
      });
    }
  }, [panX]);

  function panClick() {
    setIsFirstShoot(true);
    setValue(prev => (prev -= 150));
  }

  function movePan(state) {
    if (state == "left") {
      setPanX(prev => (prev -= 40));
      setBallX(prev => (prev -= 40));
    }

    if (state == "right") {
      setPanX(prev => (prev += 40));
      setBallX(prev => (prev += 40));
    }
  }

  return (
    <div className="game-board">
      <div className="goal-post shadow-lg bg-purple-400" ref={goalPost}></div>
      <div className="ball bg-pink-600 shadow-lg" ref={ball}></div>
      <div
        className="pan bg-teal-600 shadow-lg"
        onClick={panClick}
        ref={pan}
      ></div>
      {!isFirstShoot && (
        <React.Fragment>
          <IonButton
            className="btn-game left"
            color="light"
            onClick={() => movePan("left")}
          >
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonButton
            className="btn-game right"
            color="light"
            onClick={() => movePan("right")}
          >
            <IonIcon icon={chevronForwardOutline} />
          </IonButton>
        </React.Fragment>
      )}
    </div>
  );
}
