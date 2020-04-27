"use strict";

class DOMHandler {
  constructor () {
    this.play = document.querySelector("#play-button");
    this.tutorial = document.querySelector("#tutorial-window");
    this.wrapper = document.querySelector("#canvas-wrapper");
    this.canvas = document.querySelector("canvas");
    this.topBar = document.querySelector("#game-controls");
    this.infoTiles = document.querySelectorAll("#info > .info-tile");
    this.bank = document.querySelector("#info-bits");
    this.mute = document.querySelector("#mute-button");
    this.auto = document.querySelector("input[name=auto-wave]");
    this.wave = document.querySelector("#wave-button");
    this.bottomBar = document.querySelector("#content-box");
    this.sell = document.querySelector("#sell-button");
    this.towerMenu = document.querySelector("#towers");
    this.towerStats = document.querySelectorAll("#tower-details > .detail-tile");
    this.towerEdits = document.querySelectorAll("#edit-tower-buttons > .edit-button");
    this.upgrade = document.querySelector("#upgrade-button");
    this.sell = document.querySelector("#sell-button");
  }
};
