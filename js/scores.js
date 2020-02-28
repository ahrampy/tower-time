"use strict";

const key = "../keys.js".key;

class Scores {
  constructor() {
    this.loadFireBase();
  }

  loadFireBase() {
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

  update(name, score) {
    firebase
      .database()
      .ref("scores")
      .push({
        name: name,
        score: score
      });
  }

  handleScores(screen) {
    const scoreList = document.createElement("ol");
    scoreList.classList.add("score-list");
    let lowestShowing;
    const highscores = firebase
      .database()
      .ref("scores")
      .orderByChild("score")
      .limitToLast(10);
    highscores.on("value", snap => {
      const scores = snap.val();
      const idArr = Object.keys(scores).reverse();
      for (let i = 0; i < idArr.length; i++) {
        const name = scores[idArr[i]].name;
        const score = scores[idArr[i]].score;
        const li = document.createElement("li");
        li.innerText = score + ": " + name;
        scoreList.appendChild(li);
      }
      lowestShowing = scores[idArr[9]].score;
    });
    screen.appendChild(scoreList);
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.classList.add("nameInput");
    input.placeholder = "add your name";
    // input.classList.add("score-name");
    form.appendChild(input);
    screen.appendChild(form);
    form.addEventListener("submit", event =>
      this.addScore(event, lowestShowing)
    );
  }

  addScore(event, lowestShowing) {
    event.preventDefault();
    const name = document.querySelector(".nameInput");
    const scoreList = document.querySelector(".score-list");
    if (tt.score >= lowestShowing) {
      scoreList.innerHTML = "";
    }
    name.style.visibility = "hidden";
    this.update(name.value, tt.score);
  }
}