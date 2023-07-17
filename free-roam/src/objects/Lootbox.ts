import { GameObjects } from "phaser";
import { FreeRoamScene } from "../scenes/FreeRoam";
import { Events, eventEmitter } from "../events/EventEmitters";
import { config } from "../config/config";

class Lootbox extends GameObjects.Image {
	ID: string;
	isOpened: boolean;
	canOpenLootbox = false;
	parentScene: FreeRoamScene;
	openImage: Phaser.GameObjects.Image | undefined = undefined;
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
			isOpened ? config.lootboxOpen.key : config.lootboxClosed.key
		);

		this.isOpened = isOpened;
		this.parentScene = parentScene;
		this.ID = ID;

		this.scale = window.innerHeight / (2 * config.tileWidth * 10);

		parentScene.add.existing(this);
	}

	checkIfPlayerIsNear(): boolean {
		if (!this.parentScene.player) {
			return false;
		}
		return (
			Math.abs(this.parentScene.player.x - this.x) < 100 &&
			Math.abs(this.parentScene.player.y - this.y) < 100
		);
	}

	showPopup(): void {
		this.openImage = this.parentScene.add
			.image(this.x, this.y - 100, config.openLootbox.key)
			.setDepth(10);
	}

	triggerOpen(): void {
		if (this.openInProgess) {
			return;
		}
		this.openInProgess = true;

		if (this.parentScene.player === null) {
			return;
		}

		const { x, y } = this.parentScene.player.body;

		eventEmitter.emit(Events.LOOTBOX_OPEN, {
			x: this.parentScene.map.worldToTileX(x),
			y: this.parentScene.map.worldToTileY(y),
			lootboxID: this.ID,
		});
		if (this.openImage) {
			this.openImage.destroy();
		}
	}

	Open(): void {
		this.openInProgess = false;
		this.isOpened = true;
		this.setTexture(config.lootboxOpen.key);
		if (this.openImage) {
			this.openImage.destroy();
		}
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
			if (this.openImage) {
				this.openImage.destroy();
			}
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
