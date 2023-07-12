type Config = {
	fps: Phaser.Types.Core.FPSConfig;
	tileWidth: number;
	player: {
		velocity: number;
		spawn: {
			x: number;
			y: number;
		};
		frameWidth:number;
		frameHeight:number;
		frameRate: number;
	};
	arena:{
		frameWidth:number;
		frameHeight:number;
	}
};

const config: Config = {
	fps: {
		min: 10,
		target: 30,
		smoothStep: true,
	},
	tileWidth: 16,
	player: {
		velocity: 400,
		spawn: {
			x: 15,
			y: 12,
		},
		frameWidth:256,
		frameHeight:256,
		frameRate: 16,
	},
	arena:{
		frameWidth:64,
		frameHeight:64,
	}
};

export { config };
