"use strict";

const dom = {
  playButton: document.querySelector("#play-button"),
  tutorialWindow: document.querySelector("#tutorial-window"),
  canvas: document.querySelector("canvas"),
  topBar: document.querySelector("#game-controls"),
  infoTiles: document.querySelectorAll("#info > .info-tile"),
  bank: document.querySelector("#info-bits"),
  mute: document.querySelector("#mute-button"),
  autoWave: document.querySelector("input[name=auto-wave]"),
  waveButton: document.querySelector("#wave-button"),
  bottomBar: document.querySelector("#content-box"),
  towerEditButtons: document.querySelectorAll(
    "#edit-tower-buttons > .edit-button"
  ),
  upgradeButton: document.querySelector("#upgrade-button"),
  sellButton: document.querySelector("#sell-button"),
  towers: document.querySelector("#towers"),
  towerInfoTiles: document.querySelectorAll("#tower-details > .detail-tile"),
};
