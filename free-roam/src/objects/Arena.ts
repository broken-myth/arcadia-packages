import { GameObjects } from "phaser";
import { Events, eventEmitter } from "../FreeRoam";
import { FreeRoamScene } from "../scenes/FreeRoam";
import { config } from "../config/config";

class Arena extends GameObjects.Rectangle {
	parentScene: FreeRoamScene;
	startMatchImage: GameObjects.Image | undefined = undefined;
	matchmaking = false;
	canMatchmake = true;

	constructor(parentScene: FreeRoamScene, x: number, y: number) {
		super(
			parentScene,
			parentScene.map.tileToWorldX(x),
			parentScene.map.tileToWorldY(y)
		);

		this.parentScene = parentScene;
		this.scale = 3;
		parentScene.add.existing(this);
	}

	checkIfPlayerIsNear(): boolean {
		if (!this.parentScene.player) {
			return false;
		}
		return (
			Math.abs(this.parentScene.player.x - this.x) < 400 &&
			Math.abs(this.parentScene.player.y - this.y) < 400
		);
	}

	endMatchMaking(): void {
		this.canMatchmake = true;
		this.matchmaking = false;
		if (this.startMatchImage) {
			this.startMatchImage.visible = true;
		}
	}

	showPopup(): void {
		this.startMatchImage = this.parentScene.add
			.image(this.x, this.y + 75, config.arena.startMatchImage.key)
			.setDepth(10)
			.setScale(1);
	}

	triggerMatchmake(): void {
		if (this.matchmaking) {
			return;
		}
		this.matchmaking = true;
		this.parentScene.pauseGame();
		eventEmitter.emit(Events.START_MATCHMAKING);
		if (this.startMatchImage) {
			this.startMatchImage.visible = false;
		}
	}

	update(): void {
		if (this.matchmaking) {
			return;
		}

		const isNear = this.checkIfPlayerIsNear();

		if (isNear && !this.canMatchmake) {
			this.showPopup();
		}

		if (!isNear && this.canMatchmake) {
			if (this.startMatchImage) {
				this.startMatchImage.visible = false;
			}
		}

		this.canMatchmake = isNear;

		if (this.canMatchmake && this.parentScene.enterKey.isDown) {
			this.triggerMatchmake();
		}
	}
}

export default Arena;
