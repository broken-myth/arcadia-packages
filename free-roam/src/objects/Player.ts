import { Physics } from "phaser";
import { config } from "../config/config";
import { FreeRoamScene } from "../scenes/FreeRoam";
import { Animations } from "../types";

const animations: Animations = {
	up: {
		startFrame: 0,
		endFrame: 15,
	},
	down: {
		startFrame: 64,
		endFrame: 79,
	},
	right: {
		startFrame: 32,
		endFrame: 47,
	},
	idle: {
		startFrame: 48,
		endFrame: 63,
	},
	left: {
		startFrame: 16,
		endFrame: 31,
	},
};

class Player extends Physics.Arcade.Sprite {
	cursor: Phaser.Types.Input.Keyboard.CursorKeys | undefined = undefined;
	wKey: Phaser.Input.Keyboard.Key | undefined = undefined;
	aKey: Phaser.Input.Keyboard.Key | undefined = undefined;
	sKey: Phaser.Input.Keyboard.Key | undefined = undefined;
	dKey: Phaser.Input.Keyboard.Key | undefined = undefined;

	velocity = config.player.velocity;

	parentScene: FreeRoamScene;

	insideMatchmakerRegion = false;

	changeCharacter = (characterURL: string) => {
		this.setTexture(characterURL);
		this.setupAnimations();
	};

	matchmaker = {
		regionBoundaries: {
			low: {
				x: 1563,
				y: 1542,
			},
			high: {
				x: 1756,
				y: 1736,
			},
		},
		textCoords: {
			x: 1640,
			y: 1610,
		},
	};
	constructor(
		parentScene: FreeRoamScene, // scene
		x: number, // x position
		y: number, // y position
		texture: string,
		cursor?: Phaser.Types.Input.Keyboard.CursorKeys,
		frame?: string | number
	) {
		super(parentScene, x, y, texture, frame);

		this.parentScene = parentScene;

		this.scale = window.innerHeight / (config.player.frameWidth * 5);

		this.cursor = cursor;

		this.setUpKeys(); // set up WASD keys

		// place the player at the center of the screen
		this.setOrigin(0.5, 0.5);

		// add camera follow where the player is at the center of the camera
		parentScene.cameras.main.startFollow(this, true, 1, 1);

		parentScene.physics.add.existing(this);
		parentScene.add.existing(this);

		this.setCollideWorldBounds(true);

		this.body.setSize(this.body.width * 0.5, this.body.height * 0.6, true);
		this.body.setOffset(this.body.offset.x, this.body.offset.y + 30);

		this.setupAnimations();
	}

	private setUpKeys() {
		this.wKey = this.parentScene.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.W
		);
		this.aKey = this.parentScene.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.A
		);
		this.sKey = this.parentScene.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.S
		);
		this.dKey = this.parentScene.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.D
		);
	}

	private setupAnimations() {
		Object.keys(animations).forEach((key) => {
			const animation = animations[key];
			this.anims.remove(key);
			this.anims.create({
				key: key,
				frames: this.anims.generateFrameNumbers(
					this.parentScene.characterURL,
					{
						start: animation.startFrame,
						end: animation.endFrame,
					}
				),
				frameRate: config.player.frameRate,
				repeat: -1,
			});
		});
	}

	private idle() {
		this.setVelocityX(0);
		this.setVelocityY(0);
		this.anims.play("idle", true);
	}

	private moveUp() {
		this.setVelocityY(-this.velocity);
		this.setVelocityX(0);
		this.anims.play("up", true);
	}

	private moveRight() {
		this.setVelocityX(this.velocity);
		this.setVelocityY(0);
		this.anims.play("right", true);
	}

	private moveDown() {
		this.setVelocityY(this.velocity);
		this.setVelocityX(0);
		this.anims.play("down", true);
	}

	private moveLeft() {
		this.setVelocityX(-this.velocity);
		this.setVelocityY(0);
		this.anims.play("left", true);
	}

	update() {
		if (
			this.y < this.matchmaker.regionBoundaries.high.y &&
			this.y > this.matchmaker.regionBoundaries.low.y &&
			this.x > this.matchmaker.regionBoundaries.low.x &&
			this.x < this.matchmaker.regionBoundaries.high.x
		) {
			this.insideMatchmakerRegion = true;
		} else {
			this.insideMatchmakerRegion = false;
		}

		if (!this.cursor) {
			return;
		}

		if (this.cursor.up.isDown || this.wKey?.isDown) {
			this.moveUp();
		} else if (this.cursor.right.isDown || this.dKey?.isDown) {
			this.moveRight();
		} else if (this.cursor.down.isDown || this.sKey?.isDown) {
			this.moveDown();
		} else if (this.cursor.left.isDown || this.aKey?.isDown) {
			this.moveLeft();
		} else {
			this.idle();
		}
	}
}

export default Player;
