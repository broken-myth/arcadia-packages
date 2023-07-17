import { GameObjects } from "phaser";
import { FreeRoamScene } from "../scenes/FreeRoam";
import { Point, RegionName } from "../types.d";
import { config } from "../config/config";

class Teleporter extends GameObjects.Sprite {
	parentScene: FreeRoamScene;
	teleportImage: Phaser.GameObjects.Image | undefined = undefined;
	canTeleport = false;
	destination: {
		name: RegionName;
		spawnPoint: Point;
	};

	setupAnimations(): void {
		this.anims.create({
			key: config.teleporter.animationKey,
			frames: this.anims.generateFrameNumbers(
				config.teleporter.spriteSheet.key,
				{
					start: 0,
					end: 7,
				}
			),
			frameRate: 8,
			repeat: -1,
		});
	}

	constructor(
		parentScene: FreeRoamScene,
		x: number,
		y: number,
		destination: {
			name: RegionName;
			spawnPoint: Point;
		},
		rotation: number
	) {
		super(
			parentScene,
			parentScene.map.tileToWorldX(x),
			parentScene.map.tileToWorldY(y),
			config.teleporter.spriteSheet.key
		);
		this.parentScene = parentScene;
		this.destination = destination;

		// rotate
		this.setAngle(rotation);
		this.setScale(2.5);

		this.setupAnimations();
		parentScene.add.existing(this);
		this.anims.play(config.teleporter.animationKey, true);
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
		this.teleportImage = this.parentScene.add.image(
			this.x,
			this.y,
			config.teleporter.teleportImage.key
		);
		this.teleportImage.setDepth(10);
	}

	triggerTeleport(): void {
		this.parentScene.scene.start(config.loader.key);
		setTimeout(() => {
			this.parentScene.scene.restart({
				newRegionName: this.destination.name,
				spawnPoint: this.destination.spawnPoint,
			});
			this.parentScene.scene.stop(config.loader.key);
		}, 1300);
	}

	update(): void {
		const isNear = this.checkIfPlayerIsNear();
		if (isNear && !this.canTeleport) {
			this.showPopup();
		}
		if (!isNear && this.canTeleport && this.teleportImage) {
			this.teleportImage.destroy();
		}

		this.canTeleport = isNear;

		if (this.canTeleport && this.parentScene.ekey.isDown) {
			this.triggerTeleport();
		}
	}
}

export default Teleporter;
