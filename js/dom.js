"use strict";

class DomHandler {
  constructor() {
    // * main
    this.holder = document.querySelector("#holder");
    this.play = document.querySelector("#play-button");
    this.startText = document.querySelector("#game-info");
    this.wrapper = document.querySelector("#canvas-wrapper");
    this.canvas = document.querySelector("canvas");

    // * endgame
    this.gameOver = document.querySelector("#game-over-screen");
    this.overTitle = document.querySelector("#game-over-title");
    this.terminal = document.querySelector("#score-terminal");
    this.scores = document.querySelector(".scores");
    this.final = document.querySelector("#local-score");
    this.local = document.querySelector("#local-top");

    // * tutorial
    this.tutorialOpen = true;
    this.tutorial = document.querySelector("#tutorial-window");
    this.tutorialSlide = document.querySelector("#tutorial-slide");
    this.tutorialText = document.querySelector("#tutorial-text");
    this.tutorialP = document.querySelector("#tutorial-text-p");
    this.tutorialIcon = document.querySelector("#tutorial-icon");

    // * hotkey info
    this.hotkeysOpen = false;
    this.hotkeysSlide = document.querySelector("#hotkeys-slide");
    this.hotkeysIcon = document.querySelector("#hotkeys-icon");
    this.hotkeysText = document.querySelector("#hotkeys-text");

    // * top nav
    this.topBar = document.querySelector("#game-controls");
    this.infoTiles = document.querySelectorAll("#info > .info-tile");
    this.score = document.querySelector("#info-score");
    this.currWave = document.querySelector("#info-wave");
    this.lives = document.querySelector("#info-lives");
    this.bank = document.querySelector("#info-bits");
    this.mute = document.querySelector("#mute-button");
    this.autoBox = document.querySelector("#auto-container");
    this.auto = document.querySelector("input[name=auto-wave]");
    this.wave = document.querySelector("#wave-button");

    // * bottom nav
    this.bottomBar = document.querySelector("#content-box");
    this.towerMenu = document.querySelector("#towers");
    this.towerStats = document.querySelectorAll(
      "#tower-details > .detail-tile"
    );
    this.type = document.querySelector("#tower-type");
    this.damage = document.querySelector("#tower-damage");
    this.range = document.querySelector("#tower-range");
    this.speed = document.querySelector("#tower-speed");
    this.next = document.querySelector("#tower-next");
    this.towerEdits = document.querySelectorAll(
      "#edit-tower-buttons > .edit-button"
    );
    this.upgrade = document.querySelector("#upgrade-button");
    this.sell = document.querySelector("#sell-button");
  }
}
