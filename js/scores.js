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
      const data = snap.val();
      const idArr = Object.keys(data);
      const scores = [];
      for (let i = 0; i < idArr.length; i++) {
        scores.push([data[idArr[i]].score, data[idArr[i]].name]);
      }
      this.sortScores(scores);
      scores.forEach(score => {
        const li = document.createElement("li");
        li.innerText = score[0] + ": " + score[1];
        scoreList.appendChild(li);
      });
      lowestShowing = scores[9][0];
    });
    screen.appendChild(scoreList);
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.classList.add("nameInput");
    input.placeholder = "add your name";
    input.maxLength = 10;
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

  sortScores(arr) {
    let swapped;
    do {
      swapped = false;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i][0] < arr[i + 1][0]) {
          let tmp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = tmp;
          swapped = true;
        }
      }
    } while (swapped);
    return arr;
  }
}
