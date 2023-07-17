import { Scene } from "phaser";
import Player from "../objects/Player";
import Lootbox from "../objects/Lootbox";
import { Events, eventEmitter } from "../FreeRoam";
import { config } from "../config/config";
import Arena from "../objects/Arena";
import Teleporter from "../objects/Teleporter";
import {
	LootboxDetails,
	RegionName,
	RegionType,
	Point,
	Layer,
} from "../types.d";
import { setLooboxes, maps } from "../utils/maps";
import { getCharacterSpriteURL } from "../utils/helpers";

export class FreeRoamScene extends Scene {
	player: Player | null = null;
	spawnPoint: Point | null = null;
	loader: Phaser.Loader.LoaderPlugin | null = null;
	// graphics!: Phaser.GameObjects.Graphics;

	// Keys
	cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
	ekey!: Phaser.Input.Keyboard.Key;
	enterKey!: Phaser.Input.Keyboard.Key;
	map!: Phaser.Tilemaps.Tilemap;

	// Initial Region that the player lands at
	//previousRegionName?: RegionName | null = null; // To keep track of spawn points while coming back from a map to the central map
	details: RegionType | null = null;

	// Objects
	lootboxes: Lootbox[] = [];
	arenas: Arena[] = [];
	teleporters: Teleporter[] = [];

	// Character
	characterURL = "adventurer.webp";

	tileMaps: Record<RegionName, Phaser.Tilemaps.Tilemap> | undefined =
		undefined;

	setupLootboxes(): void {
		if (!this.details || !maps[this.details.name]) {
			return;
		}

		if (maps[this.details.name].lootboxesDetails === undefined) {
			return;
		}

		const lootboxes = maps[this.details.name].lootboxesDetails?.map(
			(lootboxDetails) => {
				return new Lootbox(
					this,
					lootboxDetails.x,
					lootboxDetails.y,
					lootboxDetails.isOpen,
					lootboxDetails.lootboxID
				);
			}
		);

		if (lootboxes) {
			this.lootboxes = lootboxes;
		}
	}

	setupArenas(): void {
		if (!this.details || !maps[this.details.name]) {
			return;
		}
		this.arenas = maps[this.details.name].arenaDetails.map((arenaDetails) => {
			return new Arena(
				this,
				arenaDetails.coordinates.x,
				arenaDetails.coordinates.y
			);
		});
	}

	setupTeleporters(): void {
		if (!this.details || !maps[this.details.name]) {
			return;
		}
		this.teleporters = maps[this.details.name].teleporterDetails.map(
			(teleporterDetails) => {
				return new Teleporter(
					this,
					teleporterDetails.coordinates.x,
					teleporterDetails.coordinates.y,
					teleporterDetails.destination,
					teleporterDetails.rotation
				);
			}
		);
	}

	setupRegion(): void {
		this.setupLootboxes();
		this.setupArenas();
		this.setupTeleporters();
	}

	pauseGame(): void {
		this.scene.pause(config.freeRoam.key);
	}

	resumeGame(): void {
		this.scene.resume(config.freeRoam.key);
	}

	disbaleKeys(): void {
		this.input.keyboard.enabled = false;
	}

	enableKeys(): void {
		this.input.keyboard.enabled = true;
	}

	handleOpenLootbox(lootboxID: string): void {
		if (
			!this.details ||
			!maps[this.details.name] ||
			!maps[this.details.name].lootboxesDetails
		) {
			return;
		}

		maps[this.details.name].lootboxesDetails?.forEach((lootbox) => {
			if (lootbox.lootboxID === lootboxID) {
				lootbox.isOpen = true;
			}
		});
		this.lootboxes.forEach((lootbox) => {
			if (lootbox.ID === lootboxID) {
				lootbox.Open();
			}
		});
	}

	handleCharacterChange(characterURL: string): void {
		this.characterURL = characterURL;
		if (!this.loader) {
			return;
		}
		this.loader.spritesheet(
			this.characterURL,
			getCharacterSpriteURL(this.characterURL),
			{
				frameWidth: config.player.frameWidth,
				frameHeight: config.player.frameHeight,
			}
		);
		this.loader.once("complete", () => {
			this.player?.changeCharacter(this.characterURL);
		});
		this.loader.start();
	}

	constructor(lootboxDetails: LootboxDetails[], characterURL: string) {
		super({ key: config.freeRoam.key });

		if (characterURL) {
			this.characterURL = characterURL;
		}

		setLooboxes(lootboxDetails);

		this.details = maps[RegionName.CENTRAL];
	}

	init(props: { newRegionName?: RegionName; spawnPoint?: Point }) {
		const {
			newRegionName = RegionName.CENTRAL,
			spawnPoint = maps[RegionName.CENTRAL].spawnPoint,
		} = props;

		this.details = maps[newRegionName];
		this.spawnPoint = spawnPoint;
	}

	preload() {
		// Setting the assets of the map to be loaded (when the preload runs after restart)
		const { lootboxOpen, lootboxClosed, teleporter, openLootbox } = config;

		this.load.image(lootboxOpen.key, lootboxOpen.url);
		this.load.image(lootboxClosed.key, lootboxClosed.url);
		this.load.image(
			teleporter.teleportImage.key,
			teleporter.teleportImage.url
		);
		this.load.image(openLootbox.key, openLootbox.url);

		this.load.image(
			config.arena.startMatchImage.key,
			config.arena.startMatchImage.url
		);

		if (!this.details) {
			return;
		}

		this.load.image(
			this.details.asset.tileset.key,
			this.details.asset.tileset.url
		);

		this.load.tilemapTiledJSON(
			this.details.asset.map.key,
			this.details.asset.map.url
		);

		if (this.details.asset.overlay) {
			this.load.image(
				this.details.asset.overlay.key,
				this.details.asset.overlay.url
			);
		}

		this.load.spritesheet(
			this.characterURL,
			getCharacterSpriteURL(this.characterURL),
			{
				frameWidth: config.player.frameWidth,
				frameHeight: config.player.frameHeight,
			}
		);

		this.load.spritesheet(
			config.teleporter.spriteSheet.key,
			config.teleporter.spriteSheet.url,
			{
				frameWidth: config.teleporter.frameWidth,
				frameHeight: config.teleporter.frameHeight,
			}
		);
	}

	create() {
		this.cursor = this.input.keyboard.createCursorKeys();
		this.ekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
		this.enterKey = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.ENTER
		);
		this.loader = new Phaser.Loader.LoaderPlugin(this);

		if (!this.details) {
			return;
		}

		this.map = this.make.tilemap({ key: this.details.asset.map.key });

		const tileset = this.map.addTilesetImage(
			this.details.asset.tileset.key,
			this.details.asset.tileset.key,
			16,
			16,
			1,
			2
		);

		const belowPlayerLayer = this.map.createLayer(
			Layer.BELOW_PLAYER,
			tileset,
			0,
			0
		);

		const objectsLayer = this.map.createLayer(Layer.OBJECTS, tileset, 0, 0);

		if (this.details.asset.overlay) {
			const overlay = this.map.addTilesetImage(
				this.details.asset.overlay.key,
				this.details.asset.overlay.key,
				16,
				16,
				1,
				2
			);

			const abovePlayerLayer = this.map.createLayer(
				Layer.ABOVE_PLAYER,
				[tileset, overlay],
				0,
				0
			);
			abovePlayerLayer.setScale(
				window.innerHeight / (config.tileWidth * 10)
			);
			abovePlayerLayer.setDepth(2);
		}

		// scale the map
		belowPlayerLayer.setScale(window.innerHeight / (config.tileWidth * 10));
		objectsLayer.setScale(window.innerHeight / (config.tileWidth * 10));

		belowPlayerLayer.setDepth(0);
		objectsLayer.setDepth(1);

		this.physics.world.bounds.width =
			belowPlayerLayer.width * belowPlayerLayer.scaleX;
		this.physics.world.bounds.height =
			belowPlayerLayer.height * belowPlayerLayer.scaleY;

		objectsLayer.setCollisionByProperty({ collides: true });

		this.map.setBaseTileSize(config.tileWidth, config.tileWidth);
		// create a player and place it at the centre of the map

		if (!this.spawnPoint) {
			this.spawnPoint = this.details.spawnPoint;
		}

		this.player = new Player(
			this,
			this.map.tileToWorldX(this.spawnPoint.x),
			this.map.tileToWorldY(this.spawnPoint.y),
			this.characterURL,
			this.cursor
		);

		this.player.setDepth(1);

		this.setupRegion();

		eventEmitter.on(Events.LOOTBOX_OPEN, () => {
			this.pauseGame();
		});

		eventEmitter.on(Events.LOOTBOX_OPENED, (lootboxID: string) => {
			this.resumeGame();
			this.handleOpenLootbox(lootboxID);
		});

		eventEmitter.on(Events.RESUME_GAME, () => {
			this.resumeGame();
		});

		eventEmitter.on(Events.PAUSE_GAME, () => {
			this.pauseGame();
		});

		eventEmitter.on(Events.CHANGE_CHARACTER, (characterURL: string) => {
			this.handleCharacterChange(characterURL);
		});

		eventEmitter.on(Events.OPEN_DASHBOARD, () => {
			this.pauseGame();
			this.disbaleKeys();
		});

		eventEmitter.on(Events.CLOSE_DASHBOARD, () => {
			this.resumeGame();
			this.enableKeys();
		});

		eventEmitter.on(Events.MATCH_ENDED, () => {
			this.resumeGame();
			this.arenas.forEach((arena) => {
				arena.endMatchMaking();
			});
		});

		this.input.keyboard.disableGlobalCapture();

		this.physics.add.collider(this.player, objectsLayer);

		// const debugGraphics = this.add.graphics().setAlpha(0.75);

		// objectsLayer.renderDebug(debugGraphics, {
		// 	tileColor: null, // Color of non-colliding tiles
		// 	collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
		// 	faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
		// });

		// this.graphics = this.add.graphics();
		// this.graphics.lineStyle(2, 0x00ff00, 1);
	}

	update() {
		if (this.player) {
			// this.graphics.clear();
			// this.graphics.strokeRect(
			// 	this.player.body.x,
			// 	this.player.body.y,
			// 	this.player.body.width,
			// 	this.player.body.height
			// );

			this.player.update();
		}
		this.lootboxes.forEach((lootbox) => {
			lootbox.update();
		});
		this.arenas.forEach((arena) => {
			arena.update();
		});
		this.teleporters.forEach((teleporter) => {
			teleporter.update();
		});
	}
}
