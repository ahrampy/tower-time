"use strict";

class Scores {
  constructor() {
    this.loadFireBase();
  }

  loadFireBase() {
    var firebaseConfig = {
      apiKey: "AIzaSyCUl00bvLb_3Ytr6Wj_L-XIp-bVX4Yb8b0",
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
    firebase.auth().signInAnonymously();
    firebase
      .database()
      .ref("scores")
      .push({
        name: name,
        score: score
      });
  }

  handleScores(screen, highscores) {
    const scoreTerminal = document.createElement("div");
    scoreTerminal.classList.add("score-terminal");
    const rankList = document.createElement("ol");
    const scoreList = document.createElement("ol");
    const nameList = document.createElement("ol");
    let lowestShowing;
    highscores.on("value", snap => {
      const data = snap.val();
      const idArr = Object.keys(data);
      const scores = [];
      for (let i = 0; i < idArr.length; i++) {
        scores.push([data[idArr[i]].score, data[idArr[i]].name]);
      }
      this.sortScores(scores);
      let rankCount = 1;
      scores.forEach(score => {
        const rankLi = document.createElement("li");
        const scoreLi = document.createElement("li");
        const nameLi = document.createElement("li");
        rankLi.innerText = rankCount++;
        scoreLi.innerText = score[0];
        nameLi.innerText = score[1];
        rankList.appendChild(rankLi);
        scoreList.appendChild(scoreLi);
        nameList.appendChild(nameLi);
      });
      lowestShowing = scores[9][0];
    });

    const rankDiv = document.createElement("div");
    rankDiv.classList.add("score-div");
    const rankTitle = document.createElement("h2");
    rankTitle.innerText = "RANK";
    rankDiv.appendChild(rankTitle);
    rankDiv.appendChild(rankList);
    scoreTerminal.appendChild(rankDiv);

    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("score-div");
    const scoreTitle = document.createElement("h2");
    scoreTitle.innerText = "SCORE";
    scoreDiv.appendChild(scoreTitle);
    scoreDiv.appendChild(scoreList);
    scoreTerminal.appendChild(scoreDiv);

    const nameDiv = document.createElement("div");
    nameDiv.classList.add("score-div");
    const nameTitle = document.createElement("h2");
    nameTitle.innerText = "NAME";
    nameDiv.appendChild(nameTitle);
    nameDiv.appendChild(nameList);
    scoreTerminal.appendChild(nameDiv);

    screen.appendChild(scoreTerminal);
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.classList.add("nameInput");
    input.placeholder = "YOUR NAME";
    input.maxLength = 3;
    form.appendChild(input);
    screen.appendChild(form);
    form.addEventListener("submit", event =>
      this.addScore(event, lowestShowing)
    );
  }

  addScore(event, lowestShowing) {
    event.preventDefault();
    const name = document.querySelector(".nameInput");
    const scoreList = document.querySelectorAll(".score-div");
    if (tt.score >= lowestShowing) {
      scoreList.forEach(div => {
        div.querySelector("ol").innerHTML = "";
      });
    }
    name.style.visibility = "hidden";
    if (tt.f === tt.score) {
      this.update(name.value.toUpperCase(), tt.f);
    } else {
      window.location.reload(false);
    }
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
