"use strict";

const key = "../keys.js".key;

class Scores {
  constructor() {
    this.loadFireBase();
  }
 
  loadFireBase(){
    var firebaseConfig = {
      apiKey: key,
      authDomain: "tower-time.firebaseapp.com",
      databaseURL: "https://tower-time.firebaseio.com",
      projectId: "tower-time",
      storageBucket: "tower-time.appspot.com",
      messagingSenderId: "114254327718",
      appId: "1:114254327718:web:7d6db95c7f120f99452967",
      measurementId: "G-0BEHEHSDDL"
    };
    firebase.initializeApp(firebaseConfig);
  }

  addScore(name, score) {
    firebase
      .database()
      .ref("scores/" + Date.now())
      .set({
        name: name,
        score: score
      });      
  }

}