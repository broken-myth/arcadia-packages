import { Scene } from "phaser";
import Master from "../objects/Player";
import Lootbox from "../objects/Lootbox";
import keys from "../utils/keys";
import { Events, eventEmitter } from "../FreeRoam";
import { config } from "../config/config";
import Arena from "../objects/Arena";
import Teleporter from "../objects/Teleporter";
import { assets } from "../utils/assets";

export interface LootboxDetail {
	x: number;
	y: number;
	isOpen: boolean;
	lootboxID: string;
}

export class FreeRoamScene extends Scene {
	player!: Master;
	cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
	ekey!: Phaser.Input.Keyboard.Key;
	enterKey!: Phaser.Input.Keyboard.Key;
	map!: Phaser.Tilemaps.Tilemap;

	// Initial Map that the player lands at
	previousMap?:string; // To keep track of spawn points while coming back from a map to the central map
	currentMap:string = "central";
	tileSetAssetUrl:string = assets.central_tileset ;
	tileSetAssetKey:string = keys.CENTRAL_TILESET_ASSET;
	mapAssetKey:string = keys.CENTRAL_MAP_ASSET;
	mapAssetUrl:string = assets.central_tilemap;
	playerSpawnX:number = 15;
	playerSpawnY:number = 12;

	lootboxes: Lootbox[] = [];
	lootboxDetails: LootboxDetail[] = [];
	arenas:Arena[] = [];
	teleporters:Teleporter[] = [];


	setupLootboxes(): void {
		this.lootboxDetails.forEach((lootboxDetail) => {
			this.lootboxes.push(
				new Lootbox(
					this,
					lootboxDetail.x as number,
					lootboxDetail.y as number,
					lootboxDetail.isOpen,
					lootboxDetail.lootboxID
				)
			);
		});
	}

	setMapVariables(tileSetAssetKey:string,tileSetAssetUrl:string,mapAssetKey:string,mapAssetUrl:string,spawnX:number,spawnY:number):void{
		this.mapAssetKey=mapAssetKey;
		this.mapAssetUrl = mapAssetUrl;
		this.tileSetAssetKey = tileSetAssetKey
		this.tileSetAssetUrl = tileSetAssetUrl
		this.playerSpawnX = spawnX;
		this.playerSpawnY = spawnY;
	}

	setResources():void{
		if(this.currentMap==="thunder"){
			this.setMapVariables(keys.THUNDER_TILESET_ASSET,assets.thunder_tileset,keys.THUNDER_MAP_ASSET, assets.thunder_tilemap,25,48)
		}else if(this.currentMap==="fire"){
			this.setMapVariables(keys.FIRE_TILESET_ASSET,assets.fire_tileset,keys.FIRE_MAP_ASSET, assets.fire_tilemap,2,25)
		}else if(this.currentMap==="water"){
			this.setMapVariables(keys.WATER_TILESET_ASSET,assets.water_tileset,keys.WATER_MAP_ASSET, assets.water_tilemap,46,25)
		}else if(this.currentMap==="central"){
			if(this.previousMap==="thunder"){
				this.setMapVariables(keys.CENTRAL_TILESET_ASSET,assets.central_tileset,keys.CENTRAL_MAP_ASSET, assets.central_tilemap,25,2)
			}
			else if(this.previousMap){
				if(this.previousMap==="fire"){
					this.setMapVariables(keys.CENTRAL_TILESET_ASSET,assets.central_tileset,keys.CENTRAL_MAP_ASSET, assets.central_tilemap,48,25)
				}
				else if(this.previousMap==="water"){
					this.setMapVariables(keys.CENTRAL_TILESET_ASSET,assets.central_tileset,keys.CENTRAL_MAP_ASSET, assets.central_tilemap,2,25)
				}
			}
		}
	}

	switchToFireScene(): void {
		this.currentMap = "fire"
		this.setResources();
		this.scene.restart();
	}
	switchToWaterScene(): void {
		this.currentMap = "water"
		this.setResources();
		this.scene.restart();
	}
	switchToThunderScene(): void {
		this.currentMap = "thunder"
		this.setResources();
		this.scene.restart();
	}
	switchToCentralScene(previousMap:string): void {
		this.previousMap = previousMap
		this.currentMap = "central"
		this.setResources();
		this.scene.restart();
	}


	setupArenas():void{
		if(this.currentMap==="central"){
			this.arenas = []
			this.arenas.push(
				new Arena(
					this,
					15 ,
					12
				)
			)
		}

	}

	setupTeleporters():void{
		if(this.currentMap==="thunder"){
			this.teleporters = []
			this.teleporters.push(
				new Teleporter(
					this,
					25,
					49,
					"central"
				)
			)
				}
				else if(this.currentMap === "fire"){
			this.teleporters = []
			this.teleporters.push(
				new Teleporter(
					this,
					1,
					25,
					"central"
				)
					)
				}
				else if(this.currentMap === "water"){
					this.teleporters = []
					this.teleporters.push(
						new Teleporter(
						this,48,25,"central"
					)
			)
		}
		else if(this.currentMap==="central"){
			this.teleporters = []
			this.teleporters.push(
				new Teleporter(
					this,
					25,
					0,
					"thunder"
				),
				new Teleporter(
					this,
					50,
					25,
					"fire"
				),
				new Teleporter(
					this,
					0,
					25,
					"water"
				)
			)
		}
	}
	

	pauseGame(): void {
		this.scene.pause(keys.FREEROAM_SCENE);
	}

	resumeGame(): void {
		this.scene.resume(keys.FREEROAM_SCENE);
	}

	constructor(lootboxDetails: LootboxDetail[]) {
		super({ key: keys.FREEROAM_SCENE });
			this.lootboxDetails = lootboxDetails;
	}

	preload() {
		// Setting the assets of the map to be loaded (when the preload runs after restart) 
		this.load.image(this.tileSetAssetKey, this.tileSetAssetUrl);
		this.load.tilemapTiledJSON(
			this.mapAssetKey,
			this.mapAssetUrl
		);
		// if(this.currentMap==="central"){
		// 	this.load.image(keys.ABOVE_PLAYER_LAYER_ASSET,assets.above_player_layer)
		// }
		this.load.spritesheet(keys.PLAYER_ASSET, assets.player_sprite, {
			frameWidth: config.player.frameWidth,
			frameHeight: config.player.frameHeight,
		});
		this.load.image(
			keys.LOOTBOXCLOSED_ASSET,
			assets.lootbox_closed
		);
		this.load.image(
			keys.LOOTBOXOPEN_ASSET,
			assets.lootbox_open
		);
		if(this.currentMap==="central"){
			this.load.spritesheet(
				keys.ARENA_ASSET,
				assets.arena,{
					frameWidth:config.arena.frameWidth,
					frameHeight:config.arena.frameHeight
				}
			)
		}
		this.load.image(
			keys.TELEPORTER_ASSET,
			assets.teleporter
		)
		// this.load.image(
		// 	keys.ABOVE_PLAYER_TILESET,
		// 	assets.over_the_player_layer
		// )
	}

	handleOpenLootbox(lootboxID: string): void {
		this.lootboxes.forEach((lootbox) => {
			if (lootbox.ID === lootboxID) {
				lootbox.Open();
			}
		});
	}

	create() {
		this.cursor = this.input.keyboard.createCursorKeys();
		this.ekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
		this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
		
		// Setting the map assets according to the current map to teleport to
		
		this.map = this.make.tilemap({ key: this.mapAssetKey });
		const tileset = this.map.addTilesetImage(
			this.tileSetAssetKey,
			this.tileSetAssetKey,
			16,16,1,2
			);

		// const abovePlayerLayerTileset = this.map.addTilesetImage(
		// 	keys.ABOVE_PLAYER_TILESET,
		// 	keys.ABOVE_PLAYER_TILESET,
		// 	16,16,1,2
		// )

		const groundlayer = this.map.createLayer(
			keys.GROUND_LAYER,
			tileset,
			0,
			0
		);
		const objectsLayer = this.map.createLayer(
			keys.OBJECTS_LAYER,
			tileset,
			0,
			0
		);
		const pathLayer = this.map.createLayer(keys.PATH_LAYER, tileset, 0, 0);

		// scale the map
		groundlayer.setScale(window.innerHeight / (config.tileWidth * 10));
		objectsLayer.setScale(window.innerHeight / (config.tileWidth * 10));
		pathLayer.setScale(window.innerHeight / (config.tileWidth * 10));

		this.physics.world.bounds.width = groundlayer.width * groundlayer.scaleX;
		this.physics.world.bounds.height =
			groundlayer.height * groundlayer.scaleY;

		objectsLayer.setCollisionByProperty({ collides: true });

		this.map.setBaseTileSize(config.tileWidth, config.tileWidth);
		// create a player and place it at the centre of the map
		this.player = new Master(
			this,
			this.map.tileToWorldX(this.playerSpawnX),
			this.map.tileToWorldY(this.playerSpawnY),
			keys.PLAYER_ASSET,
			this.cursor
		);


		this.setupArenas()
		this.setupLootboxes();
		this.setupTeleporters()

		eventEmitter.on(Events.LOOTBOX_OPEN, () => {
			this.pauseGame();
		});

		eventEmitter.on(Events.LOOTBOX_OPENED, (lootboxID: string) => {
			this.resumeGame();
			this.handleOpenLootbox(lootboxID);
		});

		this.physics.add.collider(this.player, objectsLayer);
	}

	update() {
		this.player.update();
		this.lootboxes.forEach((lootbox) => {
			lootbox.update();
		});
		this.arenas.forEach(arena=>{
			arena.update()
		})
		this.teleporters.forEach(teleporter=>{
			teleporter.update()
		})

	}
}
