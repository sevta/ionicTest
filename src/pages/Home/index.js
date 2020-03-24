import React, { useEffect, useState, useContext } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSlides,
  IonSlide,
  IonItem,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonAvatar,
  IonLabel,
  IonModal
} from "@ionic/react";
import "./index.scss";
import { addOutline, arrowBackOutline, searchOutline } from "ionicons/icons";
import { Context } from "../../utils/store";

export default function Home() {
  const { state, dispatch } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{
            padding: "0 4px"
          }}
        >
          <IonButtons slot="start">
            <IonButton>
              <IonIcon
                icon={searchOutline}
                style={{ color: state.darkMode ? "white" : "black" }}
              ></IonIcon>
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon
                icon={addOutline}
                style={{ color: state.darkMode ? "white" : "black" }}
              ></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Messages</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Modal
          isOpen={showModal}
          onBackClick={() => setShowModal(false)}
          darkMode={state.darkMode}
        />
        <IonGrid>
          <IonRow>
            <IonCol>
              <div className="hidden">Recents</div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSlides
                options={{
                  freeMode: true,
                  slidesPerView: 5,
                  justifyBetween: 0
                }}
              >
                {state.users.map((u, i) => (
                  <IonSlide key={i}>
                    <div className="relative flex items-center justify-center flex-col">
                      <div
                        className="relative border-2 border-pink-700"
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 200,
                          overflow: "hidden",
                          padding: 2
                        }}
                      >
                        <img
                          style={{
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                            objectPosition: "center",
                            height: "100%"
                          }}
                          src={u.picture.large}
                        />
                      </div>
                      <div
                        className="bullets bg-green-400"
                        style={{
                          width: 13,
                          height: 13,
                          borderRadius: 20,
                          position: "absolute",
                          border: "solid 2px",
                          borderColor: state.darkMode ? "black" : "white",
                          top: 8,
                          right: "-1px"
                        }}
                      ></div>
                      <div
                        className="text-xs mt-1 font-sans font-semibold"
                        style={{
                          color: state.darkMode ? "white" : "black"
                        }}
                      >
                        {u.name.first}
                      </div>
                    </div>
                  </IonSlide>
                ))}
              </IonSlides>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid className="pt-0">
          <IonRow className="pt-0">
            <IonCol className="pt-0">
              <IonList className="pt-0">
                {state.users2.map((u, i) => (
                  <IonItem button onClick={() => setShowModal(true)} key={i}>
                    <IonAvatar slot="start" style={{}}>
                      <img
                        style={{
                          width: 45,
                          height: 45
                        }}
                        src={u.picture.large}
                      />
                    </IonAvatar>
                    <IonLabel className="relative">
                      <div className="font-bold">{u.name.first}</div>
                      <div className="text-sm mt-1 text-gray-600">
                        {u.email}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          position: " absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          right: 0
                        }}
                      >
                        10:20
                      </div>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

function Modal({ isOpen, onBackClick, darkMode }) {
  return (
    <IonModal isOpen={isOpen}>
      <IonHeader mode="ios">
        <IonToolbar
          style={{
            padding: "7px 0px"
          }}
        >
          <IonButtons slot="start">
            <IonButton onClick={onBackClick}>
              <IonIcon
                slot="icon-only"
                icon={arrowBackOutline}
                style={{ color: darkMode ? "white" : "black" }}
              />
            </IonButton>
            <div className="flex items-center">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                  overflow: "hidden"
                }}
              >
                <img
                  style={{}}
                  src="https://images.unsplash.com/photo-1571861432256-cd28dee8c8b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=391&q=80"
                />
              </div>
              <div className="ml-3">
                <div className="font-bold">Usman</div>
                <div
                  style={{ fontSize: 12, marginTop: "-2px" }}
                  className={`${
                    darkMode ? "texst-white" : "text-gray-700"
                  } font-sans`}
                >
                  Muhamad Usman
                </div>
              </div>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </IonModal>
  );
}
