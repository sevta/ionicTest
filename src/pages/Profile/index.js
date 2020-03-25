import React, { useState, useContext, useEffect, useRef } from "react";
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
  IonModal,
  IonButtons,
  IonIcon,
  IonInput,
  IonSpinner,
  IonImg,
  IonProgressBar,
  IonActionSheet
} from "@ionic/react";
import AppContext from "../../utils/state";
import { usePhotoGallery } from "../../hooks/usePhotoGallery";

import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import { Context } from "../../utils/store";
import { fire, db, storageRef } from "../../utils/firebase";
import "./index.scss";
import Modal from "./Modal";
import { pencilOutline, pencilSharp, camera } from "ionicons/icons";

const { Camera } = Plugins;

export default function Profile({ history }) {
  const { state, dispatch } = useContext(Context);
  const [msg, setMsg] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgAsFile, setImgAsFile] = useState({});
  const [uploadProgress, setUploadProgress] = useState("0%");
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const { takePhoto, photos } = usePhotoGallery();
  const [username, setUsernmae] = useState(state.user.displayName);
  const [loadingSaveEditProfile, setLoadingSaveEditProfile] = useState(false);
  const [openActionSheet, setOpenActionSheet] = useState(false);
  const [onBackClickFromEditModal, setOnBackClickFromEditModal] = useState();

  const fileRef = useRef();
  let uploadTask = {};

  useEffect(() => {
    console.log("storage ref", state.user);
    if (!state.user.photoUrl) {
      setImgUrl(
        "https://images.unsplash.com/photo-1557991666-3dc7eae97614?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
      );
    } else {
      setImgUrl(state.user.photoUrl);
    }
  }, []);

  function testPhoto() {
    return;
    Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      source: CameraSource.camera,
      resultType: CameraResultType.Uri
    })
      .then(resp => {
        setMsg(resp);
        setImgUrl(resp);
        storageRef.ref().putString(
          resp.webPath,
          "data_url".then(snap => setMsg(snap))
        );
      })
      .catch(err => setMsg(err));
  }

  function updateUsername(ev) {
    let value = ev.target.value;
    setUsernmae(value);
  }

  function openGallery() {
    fileRef.current.click();
  }

  function onFileTrigger(ev) {
    let file = fileRef.current.files[0];
    setImgAsFile(file);
    let reader = new FileReader();
    let url = reader.readAsDataURL(file);
    reader.onloadend = e => {
      setImgUrl(reader.result);
    };
  }

  function backOnModalEditProfile() {
    setShowModalEdit(false);
    setImgUrl(state.user.photoUrl);
    setLoadingSaveEditProfile(false);
    setOnBackClickFromEditModal(true);
  }

  function doOpenActionSheet() {
    console.log("Open action sheet");
    setOpenActionSheet(true);
  }

  useEffect(() => {
    if (onBackClickFromEditModal) {
      console.log("on back", uploadTask);
    }
  }, [onBackClickFromEditModal]);

  function saveEditProfile() {
    setLoadingSaveEditProfile(true);
    db.collection("users")
      .doc(state.user.uid)
      .update({
        displayName: username
      })
      .then(() => {
        if (imgUrl == state.user.photoUrl) {
          setLoadingSaveEditProfile(false);
          setShowModalEdit(false);
          setUploadProgress("0%");
        } else {
          const metadata = {
            contentType: "image/jpeg"
          };

          uploadTask = storageRef
            .ref(`/images/${state.user.uid}`)
            .put(imgAsFile, metadata);

          uploadTask.on(
            "state_changed",
            snap => {
              var progress = (snap.bytesTransferred / snap.totalBytes) * 100;
              // console.log(snap.bytesTransferred / snap.totalBytes);
              setUploadProgress(snap.bytesTransferred / snap.totalBytes);
              // console.log("Upload is " + progress + "% done");
              // console.log("snap", snap);
              // console.log("uploadTask", uploadTask);

              if (onBackClickFromEditModal) {
                console.log("cancel upload");
                uploadTask.cancel();
              }
            },
            err => {
              console.log(err);
            },
            () => {
              storageRef
                .ref("images")
                .child(state.user.uid)
                .getDownloadURL()
                .then(url => {
                  console.log("done", url);
                  db.collection("users")
                    .doc(state.user.uid)
                    .update({
                      photoURL: url
                    })
                    .then(() => {
                      setLoadingSaveEditProfile(false);
                      setShowModalEdit(false);
                      setUploadProgress("0%");
                    });
                });
            }
          );
        }
      })
      .catch(err => console.log(err));
  }

  function doOpenModalEdit() {
    setShowModalEdit(true);
    setOnBackClickFromEditModal(false);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={doOpenModalEdit}>
              <IonLabel>Edit</IonLabel>
            </IonButton>
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="bg-gray-200" fullscreen>
        <Modal
          title="Edit"
          isOpen={showModalEdit}
          back={backOnModalEditProfile}
        >
          <IonActionSheet
            isOpen={openActionSheet}
            onDidDismiss={() => setOpenActionSheet(false)}
            buttons={[
              {
                text: "Album",
                handler: () => openGallery()
              },
              {
                text: "Camera"
              },
              {
                text: "Cancel",
                handler: () => setOpenActionSheet(false)
              }
            ]}
          ></IonActionSheet>
          <div
            className="overflow-hidden border-4 border-gray-200 mx-auto mt-8 mb-4"
            style={{
              width: 100,
              height: 100,
              borderRadius: "100%"
            }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center"
              }}
              src={imgUrl}
            />
          </div>
          <IonList>
            <IonItem>
              <IonLabel position="floating">
                <div className="text-sm text-gray-700 mb-2">Display name</div>
              </IonLabel>{" "}
              <IonInput
                placeholder={username}
                value={username}
                onIonChange={updateUsername}
                className="text-sm"
              ></IonInput>
              <IonButtons slot="end">
                <IonButton></IonButton>
              </IonButtons>
            </IonItem>
            <IonItem lines="full" button onClick={doOpenActionSheet}>
              <div className="text-sm">Change photo</div>
            </IonItem>
            <input
              accept="image/*"
              type="file"
              ref={fileRef}
              onChange={ev => onFileTrigger(ev)}
              style={{
                opacity: 0,
                visibility: "hidden",
                position: "absolute"
              }}
            />
          </IonList>
          {loadingSaveEditProfile && (
            <div className="block flex justify-center relative w-full mx-auto mt-10">
              <IonSpinner name="crescent" />
            </div>
          )}
          {uploadProgress !== "0%" && (
            <div className="absolute w-full top-0 left-0">
              <IonProgressBar
                color="secondary"
                value={uploadProgress}
              ></IonProgressBar>
            </div>
          )}
          <div className="ion-padding">{JSON.stringify(msg)}</div>
          <div className="w-full fixed bottom-0 left-0">
            <IonButton
              expand="full"
              fill="clear"
              color="dark"
              onClick={saveEditProfile}
            >
              Save
            </IonButton>
          </div>
        </Modal>
        <Modal isOpen={showModal} back={() => setShowModal(false)}>
          <h1>Editr</h1>
        </Modal>
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
              {state.user.displayName || "Anonymous"}
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
        <IonCol className="rounded-lg shadow">
          <IonLabel className="ion-padding font-semibold text-center text-gray-800 text-lg capitalize">
            {title}
          </IonLabel>
          <IonSlides
            options={{
              freeMode: true,
              slidesPerView: 4
            }}
          >
            {Array(20)
              .fill("")
              .map((b, i) => (
                <IonSlide key={i}>
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
                        width: 60,
                        height: 60
                      }}
                      className="overflow-hidden"
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
                    <IonLabel className="text-xs  text-black">
                      badge {i + 1}
                    </IonLabel>
                  </IonCard>
                </IonSlide>
              ))}
          </IonSlides>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

// function Modal({ isOpen, back }) {
//   return (
//     <IonModal isOpen={isOpen}>
//       modal
//       <IonButton onClick={back} color="light">
//         back
//       </IonButton>
//     </IonModal>
//   );
// }
