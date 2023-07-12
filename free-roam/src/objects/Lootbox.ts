import { GameObjects } from "phaser";
import { FreeRoamScene } from "../scenes/FreeRoamScene";
import keys from "../utils/keys";
import { Events, eventEmitter } from "../events/EventEmitters";
import { config } from "../config/config";

class Lootbox extends GameObjects.Image {
	ID: string;
	isOpened: boolean;
	canOpenLootbox = false;
	parentScene: FreeRoamScene;
	text: Phaser.GameObjects.Text;
	openInProgess = false;

	constructor(
		parentScene: FreeRoamScene,
		x: number,
		y: number,
		isOpened: boolean,
		ID: string
	) {
		super(
			parentScene,
			parentScene.map.tileToWorldX(x),
			parentScene.map.tileToWorldY(y),
			isOpened ? keys.LOOTBOXOPEN_ASSET : keys.LOOTBOXCLOSED_ASSET
		);

		this.isOpened = isOpened;
		this.parentScene = parentScene;
		this.ID = ID;

		this.scale = window.innerHeight / (2 * config.tileWidth * 10);

		parentScene.add.existing(this);
	}

	checkIfPlayerIsNear(): boolean {
		return (
			Math.abs(this.parentScene.player.x - this.x) < 100 &&
			Math.abs(this.parentScene.player.y - this.y) < 100
		);
	}

	showPopup(): void {
		this.text = this.parentScene.add.text(this.x, this.y, "Click E to Open", {
			font: "16px Arial",
		});
	}

	triggerOpen(): void {
		if (this.openInProgess) {
			return;
		}
		this.openInProgess = true;
		eventEmitter.emit(Events.LOOTBOX_OPEN, {
			x: this.parentScene.map.worldToTileX(this.parentScene.player.body.x),
			y: this.parentScene.map.worldToTileY(this.parentScene.player.body.y),
			lootboxID: this.ID,
		});
		this.text.destroy();
	}

	Open(): void {
		this.openInProgess = false;
		this.isOpened = true;
		this.setTexture(keys.LOOTBOXOPEN_ASSET);
		this.text.destroy();
	}

	update(): void {
		if (this.isOpened) {
			return;
		}
		const isNear = this.checkIfPlayerIsNear();

		if (isNear && !this.canOpenLootbox) {
			this.showPopup();
		}

		if (!isNear && this.canOpenLootbox) {
			this.text.destroy();
		}

		this.canOpenLootbox = isNear;

		if (
			this.canOpenLootbox &&
			!this.openInProgess &&
			this.parentScene.ekey.isDown
		) {
			this.triggerOpen();
		}
	}
}

export default Lootbox;
