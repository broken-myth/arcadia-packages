export type LootboxDetails = {
	x: number;
	y: number;
	isOpen: boolean;
	lootboxID: string;
	region: RegionName;
};
export type Animation = {
	startFrame: number;
	endFrame: number;
};

export type Animations = {
	[key: string]: Animation;
};

export enum RegionName {
	// eslint-disable-next-line no-unused-vars
	CENTRAL = "CENTRAL",
	// eslint-disable-next-line no-unused-vars
	FIRE = "FIRE",
	// eslint-disable-next-line no-unused-vars
	WATER = "WATER",
	// eslint-disable-next-line no-unused-vars
	THUNDER = "THUNDER",
}

export enum Layer {
	// eslint-disable-next-line no-unused-vars
	BELOW_PLAYER = "BELOW_PLAYER_LAYER",
	// eslint-disable-next-line no-unused-vars
	ABOVE_PLAYER = "ABOVE_PLAYER_LAYER",
	// eslint-disable-next-line no-unused-vars
	OBJECTS = "OBJECTS_LAYER",
}

export type Asset = {
	url: string;
	key: string;
};

export type RegionAsset = {
	map: Asset;
	tileset: Asset;
	overlay?: Asset;
};

export type Point = {
	x: number;
	y: number;
};

export type ArenaDetails = {
	id: number;
	coordinates: Point;
};

export type TeleporterDetails = {
	rotation: number;
	coordinates: Point;
	destination: {
		name: RegionName;
		spawnPoint: Point;
	};
};

export type RegionType = {
	name: RegionName;
	asset: RegionAsset;
	arenaDetails: ArenaDetails[];
	teleporterDetails: TeleporterDetails[];
	lootboxesDetails?: LootboxDetails[];
	spawnPoint: Point;
};
