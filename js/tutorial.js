export default class Tutorial {
	constructor(game, dom) {
		this.game = game;
		this.dom = dom;
		this.slide1 = this.dom.tutorialSlide;
		this.slide2 = this.dom.hotkeysSlide;
		this.slide1.addEventListener("click", this.toggleTutorial.bind(this));
		this.slide2.addEventListener("click", this.toggleHotkeys.bind(this));
		this.default =
			"move your mouse anywhere to learn more, click here to hide tooltips";

		this.tips = this.makeTips();
		this.addListeners(this.tips);
	}

	addListeners(tips) {
		for (const key in tips) {
			const text = tips[key];
			const div = this.dom[key];

			div.addEventListener("mouseover", () => this.showInfo(key, text));
			div.addEventListener("mouseout", this.clearTip.bind(this));
		}
	}

	toggleTutorial() {
		this.dom.tutorialText.classList.toggle("hidden");
		this.dom.tutorialOpen = !this.dom.tutorialOpen;
		this.dom.tutorialSlide.setAttribute(
			"class",
			this.dom.tutorialOpen ? "open" : "closed"
		);
		this.dom.tutorialIcon.classList.toggle("hidden");
	}

	toggleHotkeys() {
		this.dom.hotkeysText.classList.toggle("hidden");
		this.dom.hotkeysOpen = !this.dom.hotkeysOpen;
		this.dom.hotkeysSlide.setAttribute(
			"class",
			this.dom.hotkeysOpen ? "open" : "closed"
		);
		this.dom.hotkeysIcon.classList.toggle("hidden");
	}

	showInfo(name, tip) {
		if (this.game.wave === 0) {
			if (name === "canvas") {
				tip =
					"click a tower to select it, then click on the board to buy and place it";
				if (this.game.bits < 50) {
					tip =
						"now that you have a few towers, you're ready to take on the first wave! good luck";
				}
			} else if (!name) {
				tip =
					"enemies will start at the blue square and try to get to the red one, build towers to stop them";
			}
		}

		if (
			(name === "upgrade" || name === "sell") &&
			!this.game.selectedTowers.length
		) {
			tip = this.default;
		}

		this.dom.tutorialP.innerHTML = tip;

		this.ensureDefault();
	}

	ensureDefault() {
		if (this.dom.tutorialP.innerHTML === "undefined") {
			this.dom.tutorialP.innerHTML = this.default;
		}
	}

	clearTip() {
		this.dom.tutorialP.innerHTML = this.default;
	}

	makeTips() {
		return {
			canvas:
				"enemies will start at the blue square and try to get to the red one, but cannot move through blocks or towers. click on placed towers to edit them",
			score:
				"your score increases for every enemy stopped before it reaches the red square",
			currWave:
				"the amount of waves you have survived so far, including the current wave",
			lives:
				"if an enemy makes it to the red square, you lose a life. reach zero lives and the this.game is over",
			bank: "spend your bank on towers and upgrades. add to it by stopping enemies and sending waves",
			autoBox:
				"select to send the next wave once there are no more enemies on the board",
			wave: "send the next wave of enemies",
			basic:
				"good for using up spare bank and making long walls. packs a punch once upgraded",
			slow: "slows things down a little, but is also a little slow. make sure it can hit its target, or at least something...",
			fast: "fast, but has a low range. it needs to be in the heat of battle to be fully effective",
			all: "attacks everything in its path. give it good direction and it'll blow enemies away",
			type: "the tower's type. look at individual tower notes while a tower is selected",
			damage:
				"amount of damage each of the tower's attacks will deal to an enemy",
			range: "the tower's line of sight",
			speed: "how quickly the tower fires",
			next: "cost to upgrade the tower",
			upgrade: "upgrade the current tower for its next cost",
			sell: "sell the current tower for its most recent cost",
		};
	}
}
