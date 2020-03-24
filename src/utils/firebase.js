import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyA3xr1-RecoJyEw3-ZsnAoQ6zklqf15ZaU",
  authDomain: "ionictest-8fd6f.firebaseapp.com",
  databaseURL: "https://ionictest-8fd6f.firebaseio.com",
  projectId: "ionictest-8fd6f",
  storageBucket: "ionictest-8fd6f.appspot.com",
  messagingSenderId: "444733250510",
  appId: "1:444733250510:web:a7a1a1735ef5f72693e99f",
  measurementId: "G-FCC7NY9GLD"
};

const fire = firebase.initializeApp(firebaseConfig);
const db = fire.firestore();

firebase.analytics();

export { fire, db };
