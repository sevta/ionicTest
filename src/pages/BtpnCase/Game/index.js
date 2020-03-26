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
import { TweenLite, Draggable, Linear, TweenMax } from "gsap/all";
import { gsap } from "gsap";
import { moment } from "moment-timer";

export default function Game({ history }) {
  const { type, stage } = useParams();
  const [loadingGame, setLoadingGame] = useState(true);

  useEffect(() => {
    console.log("game type", type);
    console.log("stage", stage);
    setTimeout(() => {
      setLoadingGame(false);
    }, 100);
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [goalPostX, setGoalPostX] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [panState, setPanState] = useState("right");
  const [score, setScore] = useState(0);
  const padWidth = 60;

  let interval;

  const goalPost = useRef();
  const ball = useRef();
  const pan = useRef();
  const redLine = useRef();

  useEffect(() => {
    gsap.registerPlugin(TweenLite);
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(TweenMax);
    setDefaultTween();
    animatePan();

    console.log("moment", moment);
  }, []);

  useEffect(() => {
    animatePan(panState);
  }, [panState]);

  function setDefaultTween() {
    TweenLite.set(redLine.current, {
      x: 0,
      y: 0
    });
  }

  function animatePan(state) {
    if (state == "right") {
      TweenLite.to(goalPost.current, speed, {
        x: windowWidth - padWidth,
        ease: Linear.easeNone,
        onComplete() {
          setPanState("left");
        }
      });
    } else if (state == "left") {
      TweenLite.to(goalPost.current, speed, {
        x: 0,
        ease: Linear.easeNone,
        onComplete() {
          setPanState("right");
        }
      });
    }
  }

  function ifBallHitGoalPost(callback) {
    let hitGoalPost = checkHit(goalPost.current, "0%");
    let hitRedLine = checkHit(redLine.current, "30%");
    if (hitGoalPost) {
      console.log("hit goal post");
      TweenLite.to(ball.current, 0.4, {
        y: 10,
        onComplete() {
          // TweenMax.killTweensOf(ball.current);
          setValue(0);
          setIsFirstShoot(false);
          TweenLite.set(ball.current, {
            left: ballX,
            y: 0,
            autoAlpha: 1,
            scale: 1,
            onComplete() {
              callback("pan");
            }
          });
        }
      });
    }
    if (hitRedLine) {
      TweenLite.to(ball.current, 0.3, {
        scale: 2,
        autoAlpha: 0,
        onComplete() {
          TweenMax.killTweensOf(ball.current);
          setValue(0);
          setIsFirstShoot(false);
          TweenLite.set(ball.current, {
            left: ballX,
            y: 0,
            autoAlpha: 1,
            scale: 1,
            onComplete() {
              callback("redline");
            }
          });
        }
      });
    }
  }

  useEffect(() => {
    let count = 0;
    TweenLite.to(ball.current, 1.1, {
      y: value,
      onUpdate() {
        count++;
        ifBallHitGoalPost(hit => {
          console.log("what hit", hit);
          console.log(count);
          if (hit == "pan") {
            setScore(score => (score += 10));
            count = 0;
          }
        });
      }
    });
  }, [value]);

  function checkHit(src, depth) {
    let $ball = document.querySelector(".ball");
    return Draggable.hitTest($ball, src, depth);
  }

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
    TweenLite.to(pan.current, 0.1, {
      scale: 1.2,
      onComplete() {
        TweenLite.to(pan.current, 0.2, {
          scale: 1
        });
      }
    });
    setValue(prev => -(window.innerHeight - 150));
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
      <div className="goal-post shadow bg-white" ref={goalPost}></div>
      <div className="ball bg-pink-600 shadow-lg" ref={ball}></div>
      <div className="red-line" ref={redLine}></div>
      <div className="text-white p-2">Score {score}</div>
      <div className="pan bg-white shadow" onClick={panClick} ref={pan}></div>
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
