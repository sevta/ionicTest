import React, { useEffect, useContext, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonList,
  IonItem,
  IonContent,
  IonFooter,
  IonSpinner,
  IonLabel
} from "@ionic/react";
import AppContext from "../../../utils/state";
import { Context } from "../../../utils/store";
import { fire, db } from "../../../utils/firebase";

export default function SignIn({ history }) {
  const { state, dispatch } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function doSignIn() {
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(resp => console.log(resp))
      .catch(err => {
        if (err.code == "auth/wrong-password") {
          setErrMsg("wrong password");
        } else {
          setErrMsg(err.message);
        }
      });
  }

  function doSignInWithAnonymously() {
    setLoading(true);
    fire
      .auth()
      .signInAnonymously()
      .then(resp => {
        // if (resp) history.push("/app/home");
        db.collection("users")
          .doc(resp.user.uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              console.log("doc exists", doc.data());
              // history.push("/app/home");
            } else {
              console.log("create new user here");
              db.collection("users")
                .doc(resp.user.uid)
                .set({
                  uid: resp.user.uid,
                  refreshToken: resp.user.refreshToken,
                  photoUrl: resp.user.photoURL,
                  displayName: resp.user.displayName,
                  email: resp.user.email,
                  isAnonymous: resp.user.isAnonymous,
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
                })
                .then(docRef => {
                  console.log("success create new user", docRef);
                  // history.push("/app/home");
                  setLoading(false);
                })
                .catch(err => {
                  setErrMsg(err.message);
                  setLoading(false);
                });
            }
          });

        setLoading(false);
      })
      .catch(err => {
        setErrMsg(err.message);
        setLoading(false);
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign in</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="p-10">
        <IonList className="mt-12">
          <IonItem>
            <IonInput
              placeholder="Email"
              onIonChange={ev => setEmail(ev.target.value)}
            />
          </IonItem>
          <IonItem>
            <IonInput
              placeholder="Password"
              type="password"
              onIonChange={ev => setPassword(ev.target.value)}
            />
          </IonItem>
          {errMsg && <p className="text-center text-red-500 mt-5">{errMsg}</p>}
          {loading && (
            <IonSpinner name="crescent" className="block mx-auto mt-5" />
          )}
          <IonButton
            expand="full"
            onClick={doSignIn}
            className="mt-5 text-white"
          >
            Sign in
          </IonButton>
          <IonButton
            expand="full"
            color="light"
            className="text-white"
            onClick={() => history.push("/signup")}
          >
            Sign Up
          </IonButton>
          <IonButton
            color="dark"
            fill="clear"
            expand="full"
            onClick={doSignInWithAnonymously}
            className="mt-5"
          >
            Sign in Anonymously
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
