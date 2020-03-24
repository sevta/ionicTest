import React, { useState, useContext, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonButton,
  IonList,
  IonItem,
  IonToggle
} from "@ionic/react";
import AppContext from "../../utils/state";
import { usePhotoGallery } from "../../hooks/usePhotoGallery";

import { Plugins, CameraResultType } from "@capacitor/core";
import { Context } from "../../utils/store";
import { fire } from "../../utils/firebase";

const { Camera } = Plugins;

export default function Profile({ history }) {
  const { state, dispatch } = useContext(Context);
  const [msg, setMsg] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const { takePhoto } = usePhotoGallery();

  function testPhoto() {
    // takePhoto();
    Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    })
      .then(resp => {
        setMsg(resp);
        setImgUrl(resp.webPath);
      })
      .catch(err => setMsg(err));
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button onClick={testPhoto}>
            <IonLabel>Change photo</IonLabel>
          </IonItem>
        </IonList>
        <div>
          <pre>
            <p>{JSON.stringify(msg)}</p>
          </pre>
          {imgUrl && (
            <div>
              <img src={imgUrl} alt="" />
              <IonButton
                onClick={() => {
                  setImgUrl("");
                  setMsg("");
                }}
              >
                Clear
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
