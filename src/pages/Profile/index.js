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
  IonToggle,
  IonSegment,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonSlides,
  IonCard,
  IonCardContent,
  IonCol,
  IonSlide,
  IonModal
} from "@ionic/react";
import AppContext from "../../utils/state";
import { usePhotoGallery } from "../../hooks/usePhotoGallery";

import { Plugins, CameraResultType } from "@capacitor/core";
import { Context } from "../../utils/store";
import { fire } from "../../utils/firebase";
import "./index.scss";

const { Camera } = Plugins;

export default function Profile({ history }) {
  const { state, dispatch } = useContext(Context);
  const [msg, setMsg] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { takePhoto } = usePhotoGallery();

  useEffect(() => {
    console.log(state);
    if (state.user.isAnonymous) {
      setImgUrl(
        "https://images.unsplash.com/photo-1557991666-3dc7eae97614?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
      );
    } else {
      setImgUrl(state.user.photoUrl);
    }
  }, []);

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
        <Modal isOpen={showModal} back={() => setShowModal(false)} />
        <div
          style={{
            backgroundColor: "#1eb2a6"
          }}
          className="relative profile-header pt-4 pb-8 flex items-center flex-col justify-center "
        >
          <div
            className="avatar border-2 border-gray-200 bg-white rounded-full overflow-hidden"
            style={{
              width: 90,
              height: 90
            }}
          >
            <img
              src={imgUrl}
              alt=""
              className="h-full w-full"
              style={{
                objectFit: "cover",
                objectPosition: "center"
              }}
            />
          </div>
          <IonLabel className="mt-4 text-white">
            <div className=" font-bold text-xl">
              {state.user.username || "Anonymous"}
            </div>
            <div className="text-center text-gray-100 font-bold text-sm">
              2.000 point
            </div>
          </IonLabel>
        </div>
        <div className="pt-5">
          <BadgesLists
            onBadgeClick={() => setShowModal(true)}
            title="badges power up"
            img="https://images.squarespace-cdn.com/content/v1/53b50881e4b0c3274b8a2548/1492510909031-88KSFBT1Z61DJ6M0RVSR/ke17ZwdGBToddI8pDm48kBM8chhl7o28kfcz6tJuYiN7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UUy9IA8VxsWy-NymjCRldXt3LcLZbGSOjGmldGodSny6iyYOGnikgnVaNNu0qxk8rw/kennethlarsen-illustration-portrait-2.jpg?format=500w"
          />
          <BadgesLists
            onBadgeClick={() => setShowModal(true)}
            title="badges level up"
            img="https://payload.cargocollective.com/1/7/225323/13809838/dog-yellow-blue_842.jpg"
          />
        </div>
      </IonContent>
    </IonPage>
  );
}

function BadgesLists({ title, img, onBadgeClick }) {
  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonLabel className="ion-padding">{title}</IonLabel>
          <IonSlides
            options={{
              freeMode: true,
              slidesPerView: 4
            }}
          >
            {Array(20)
              .fill("")
              .map((b, i) => (
                <IonSlide>
                  <IonCard
                    onClick={onBadgeClick}
                    key={i}
                    style={{
                      border: "none ",
                      boxShadow: "none"
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50
                      }}
                      className="rounded-full overflow-hidden"
                    >
                      <img
                        className="h-full w-full"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center"
                        }}
                        src={img}
                        alt=""
                      />
                    </div>
                    <IonLabel>badge {i + 1}</IonLabel>
                  </IonCard>
                </IonSlide>
              ))}
          </IonSlides>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

function Modal({ isOpen, back }) {
  return (
    <IonModal isOpen={isOpen}>
      modal
      <IonButton onClick={back} color="light">
        back
      </IonButton>
    </IonModal>
  );
}
