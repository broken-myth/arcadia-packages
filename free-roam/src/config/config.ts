import { Asset } from "../types";

type Config = {
	fps: Phaser.Types.Core.FPSConfig;
	tileWidth: number;
	player: {
		key: string;
		velocity: number;
		spawn: {
			x: number;
			y: number;
		};
		frameWidth: number;
		frameHeight: number;
		frameRate: number;
	};
	freeRoam: {
		key: string;
	};
	loader: {
		key: string;
	};
	arena: {
		startMatchImage: Asset;
	};
	lootboxOpen: Asset;
	lootboxClosed: Asset;
	teleporter: {
		frameWidth: number;
		frameHeight: number;
		teleportImage: Asset;
		spriteSheet: Asset;
		animationKey: string;
	};
	openLootbox: Asset;
};

const config: Config = {
	fps: {
		min: 10,
		target: 30,
		smoothStep: true,
	},
	tileWidth: 16,
	player: {
		key: "PLAYER",
		velocity: 400,
		spawn: {
			x: 15,
			y: 12,
		},
		frameWidth: 256,
		frameHeight: 256,
		frameRate: 16,
	},
	freeRoam: {
		key: "FREE_ROAM",
	},
	loader: {
		key: "LOADER",
	},
	arena: {
		startMatchImage: {
			key: "start-match",
			url: "/assets/phaser/objects/start-match.webp",
		},
	},
	lootboxOpen: {
		key: "LOOTBOX_OPEN",
		url: "/assets/phaser/objects/lootbox-open.webp",
	},
	lootboxClosed: {
		key: "LOOTBOX_CLOSED",
		url: "/assets/phaser/objects/lootbox-closed.webp",
	},
	openLootbox: {
		key: "OPEN_LOOTBOX",
		url: "/assets/phaser/objects/open-lootbox.webp",
	},
	teleporter: {
		teleportImage: {
			key: "TELEPORT_IMAGE",
			url: "/assets/phaser/objects/teleport.webp",
		},
		frameWidth: 64,
		frameHeight: 64,
		spriteSheet: {
			key: "teleporter-sprite",
			url: "/assets/phaser/objects/teleporter-sprite.webp",
		},
		animationKey: "teleporter-spin",
	},
};

export { config };
