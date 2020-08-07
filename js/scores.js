export default class Scores {
  constructor(game) {
    this.game = game;
    this.firebase = this.loadFireBase();
  }

  loadFireBase() {
    var firebaseConfig = {
      apiKey: "AIzaSyCUl00bvLb_3Ytr6Wj_L-XIp-bVX4Yb8b0",
      authdomain: "tower-time.firebaseapp.com",
      databaseURL: "https://tower-time.firebaseio.com",
      projectId: "tower-time",
      storageBucket: "tower-time.appspot.com",
      messagingSenderId: "114254327718",
      appId: "1:114254327718:web:7d6db95c7f120f99452967",
      measurementId: "G-0BEHEHSDDL",
    };
    return firebase.initializeApp(firebaseConfig);
  }

  update(name, score) {
    this.firebase.auth().signInAnonymously();
    this.firebase.database().ref("scores").push({
      name: name,
      score: score,
    });
  }

  handleScores(highscores) {
    const rankList = document.createElement("ul");
    const scoreList = document.createElement("ul");
    const nameList = document.createElement("ul");

    let lowestShowing;

    highscores.on("value", (snap) => {
      const data = snap.val();
      const idArr = Object.keys(data);
      const scores = [];

      for (let i = 0; i < idArr.length; i++) {
        scores.push([data[idArr[i]].score, data[idArr[i]].name]);
      }

      this.sortScores(scores);

      let rankCount = 1;
      scores.forEach((score) => {
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

    const lists = [rankList, scoreList, nameList];
    ["RANK", "SCORE", "NAME"].forEach((column, i) => {
      const div = document.createElement("div");
      div.classList.add("score-div");
      const rankTitle = document.createElement("h2");
      rankTitle.innerText = column;
      div.appendChild(rankTitle);
      div.appendChild(lists[i]);
      dom.scores.appendChild(div);
    });

    if (this.game.score >= lowestShowing) {
      const form = document.createElement("form");
      const input = document.createElement("input");
      input.classList.add("name-input");
      input.placeholder = "ADD NAME";
      input.maxLength = 3;
      form.appendChild(input);
      dom.terminal.appendChild(form);
      form.addEventListener("submit", (event) =>
        this.addScore(event, lowestShowing, form)
      );
    } else {
      this.addNewGame();
    }
  }

  addScore(event, lowestShowing, form) {
    event.preventDefault();
    const name = document.querySelector(".name-input");
    const scoreList = document.querySelectorAll(".score-div");
    if (this.game.score >= lowestShowing) {
      scoreList.forEach((div) => {
        div.querySelector("ul").innerHTML = "";
      });
    }
    name.style.visibility = "hidden";
    if (this.game.f === this.game.score) {
      this.update(name.value.toUpperCase(), this.game.f);
    } else {
      window.location.reload(false);
    }
    dom.terminal.removeChild(form);
    this.addNewGame();
  }

  addNewGame() {
    const btn = document.createElement("button");
    btn.classList.add("new-game");
    btn.innerHTML = "NEW GAME";
    btn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        this.game.actions.newGame();
      },
      false
    );
    dom.terminal.appendChild(btn);
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
