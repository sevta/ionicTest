import React, { useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSlides,
  IonSlide,
  IonCard,
  IonCardContent,
  IonLabel
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import { useParams } from "react-router";

export default function Stage({ history }) {
  const { type } = useParams();

  function gotoGamePage(type, level) {
    history.push(`/app/game/${type}/${level}`);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={chevronBack}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle className="capitalize">{type}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <div className="text-2xl">Stage</div>

              <IonSlides
                options={{
                  freeMode: true,
                  slidesPerView: 1
                }}
              >
                {Array(20)
                  .fill("a")
                  .map((s, i) => (
                    <IonSlide key={i}>
                      <IonCard className="rounded-lg">
                        <img src="https://i.pinimg.com/736x/49/b8/c5/49b8c514a0b2f594ebda026f529606ef.jpg" />

                        <IonCardContent>
                          <IonLabel>
                            <div className="text-lg font-sans">
                              {type} stage {i + 1}
                            </div>
                          </IonLabel>
                          <IonButton
                            expand="full"
                            fill="clear"
                            onClick={() => gotoGamePage(type, i + 1)}
                          >
                            Goto
                          </IonButton>
                        </IonCardContent>
                      </IonCard>
                    </IonSlide>
                  ))}
              </IonSlides>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
