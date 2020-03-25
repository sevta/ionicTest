import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonLabel,
  IonList,
  IonItem,
  IonInput,
  IonContent,
  IonButtons,
  IonIcon,
  IonSpinner
} from "@ionic/react";
import { fire, db } from "../../../utils/firebase";
import { chevronBack } from "ionicons/icons";

export default function SignUp({ history }) {
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function doSignUp() {
    setLoading(true);
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(resp => {
        setLoading(false);
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
            console.log(docRef);
            setLoading(false);
            history.push("/app/home");
          });
      })
      .catch(err => {
        setMsg(err.message);
        setLoading(false);
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonInput
              value={email}
              placeholder="Email"
              onIonChange={ev => setEmail(ev.target.value)}
            />
          </IonItem>
          <IonItem>
            <IonInput
              value={password}
              placeholder="Password"
              type="password"
              onIonChange={ev => setPassword(ev.target.value)}
            />
          </IonItem>
          <p className="text-center text-red-700 mt-5">{msg}</p>
          {loading && <IonSpinner name="crescent" className="block mx-auto" />}
          <IonButton
            expand="full"
            onClick={doSignUp}
            className="mt-5 text-white"
          >
            Signup
          </IonButton>{" "}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
