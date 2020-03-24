import React, { useContext, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonModal,
  IonButton
} from "@ionic/react";
import { Context } from "../../../utils/store";
import { fire } from "../../../utils/firebase";

export default function Settings({ history }) {
  const { state, dispatch } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  function doLogout() {
    fire.auth().signOut();
    dispatch({ type: "user_auth", payload: false });
    dispatch({ type: "remove_user" });
    history.push("/signin");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
      <IonContent className="padding">
        <IonList>
          <IonItem button>
            <IonLabel>Dark mode</IonLabel>
            <IonToggle
              checked={state.darkMode}
              onIonChange={() => dispatch({ type: "toggle_darkmode" })}
            />
          </IonItem>
          <IonItem button onClick={() => setShowModal(true)}>
            About
          </IonItem>
          <IonItem button onClick={doLogout}>
            Log out
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

function Modal({ isOpen, onClose }) {
  return (
    <IonModal isOpen={isOpen}>
      <div className="flex items-center justify-center flex-col w-full h-screen">
        <IonLabel>
          <div className="text-xl font-sans">prototype.</div>
          <IonButton color="light" onClick={onClose}>
            Close
          </IonButton>
        </IonLabel>
      </div>
    </IonModal>
  );
}
