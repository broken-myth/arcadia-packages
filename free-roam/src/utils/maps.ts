import { RegionType, RegionName, LootboxDetails } from "../types.d";

const centralRegion: RegionType = {
	name: RegionName.CENTRAL,
	asset: {
		tileset: {
			key: "CENTRAL_TILESET",
			url: "/assets/phaser/maps/central/tileset.webp",
		},
		map: {
			key: "CENTRAL_MAP",
			url: "/assets/phaser/maps/central/map.json",
		},
		overlay: {
			key: "CENTRAL_OVERLAY",
			url: "/assets/phaser/maps/central/overlay.webp",
		},
	},
	spawnPoint: {
		x: 19,
		y: 29,
	},
	lootboxesDetails: [],
	arenaDetails: [],
	teleporterDetails: [
		{
			rotation: 180,
			coordinates: {
				x: 20,
				y: 1,
			},
			destination: {
				name: RegionName.THUNDER,
				spawnPoint: {
					x: 19,
					y: 38,
				},
			},
		},
		{
			rotation: 90,
			coordinates: {
				x: 39,
				y: 20,
			},
			destination: {
				name: RegionName.FIRE,
				spawnPoint: {
					x: 1,
					y: 17,
				},
			},
		},
		{
			rotation: 90,
			coordinates: {
				x: 1,
				y: 20,
			},
			destination: {
				name: RegionName.WATER,
				spawnPoint: {
					x: 38,
					y: 19,
				},
			},
		},
	],
};

const waterRegion: RegionType = {
	name: RegionName.WATER,
	asset: {
		tileset: {
			key: "WATER_TILESET",
			url: "/assets/phaser/maps/water/tileset.webp",
		},
		map: {
			key: "WATER_MAP",
			url: "/assets/phaser/maps/water/map.json",
		},
	},
	spawnPoint: {
		x: 38,
		y: 19,
	},
	lootboxesDetails: [],
	arenaDetails: [
		{
			id: 1,
			coordinates: {
				x: 22,
				y: 35,
			},
		},
	],
	teleporterDetails: [
		{
			rotation: 270,
			coordinates: {
				x: 39,
				y: 20,
			},
			destination: {
				name: RegionName.CENTRAL,
				spawnPoint: {
					x: 1,
					y: 20,
				},
			},
		},
	],
};

const fireRegion: RegionType = {
	name: RegionName.FIRE,
	asset: {
		tileset: {
			key: "FIRE_TILESET",
			url: "/assets/phaser/maps/fire/tileset.webp",
		},
		map: {
			key: "FIRE_MAP",
			url: "/assets/phaser/maps/fire/map.json",
		},
		overlay: {
			key: "FIRE_OVERLAY",
			url: "/assets/phaser/maps/fire/overlay.webp",
		},
	},
	lootboxesDetails: [],
	spawnPoint: {
		x: 46,
		y: 25,
	},
	arenaDetails: [
		{
			id: 2,
			coordinates: {
				x: 5,
				y: 11,
			},
		},
	],
	teleporterDetails: [
		{
			rotation: 90,
			coordinates: {
				x: 1,
				y: 17,
			},
			destination: {
				name: RegionName.CENTRAL,
				spawnPoint: {
					x: 39,
					y: 20,
				},
			},
		},
	],
};

const thunderRegion: RegionType = {
	name: RegionName.THUNDER,
	asset: {
		tileset: {
			key: "THUNDER_TILESET",
			url: "/assets/phaser/maps/thunder/tileset.webp",
		},
		map: {
			key: "THUNDER_MAP",
			url: "/assets/phaser/maps/thunder/map.json",
		},
		overlay: {
			key: "THUNDER_OVERLAY",
			url: "/assets/phaser/maps/thunder/overlay.webp",
		},
	},
	spawnPoint: {
		x: 19,
		y: 38,
	},
	lootboxesDetails: [],
	arenaDetails: [
		{
			id: 3,
			coordinates: {
				x: 37,
				y: 21,
			},
		},
	],
	teleporterDetails: [
		{
			rotation: 0,
			coordinates: {
				x: 20,
				y: 39,
			},
			destination: {
				name: RegionName.CENTRAL,
				spawnPoint: {
					x: 20,
					y: 1,
				},
			},
		},
	],
};

const maps = {
	[RegionName.FIRE]: fireRegion,
	[RegionName.WATER]: waterRegion,
	[RegionName.CENTRAL]: centralRegion,
	[RegionName.THUNDER]: thunderRegion,
};

const setLooboxes = (entireLootboxDetails: LootboxDetails[]) => {
	entireLootboxDetails.forEach((lootbox) => {
		maps[lootbox.region].lootboxesDetails?.push(lootbox);
	});
};

export {
	centralRegion,
	waterRegion,
	fireRegion,
	thunderRegion,
	setLooboxes,
	maps,
};
