const Events = {
	LOOTBOX_OPEN: "LOOTBOX_OPEN", // event sent by phaser when a lootbox is opened
	LOOTBOX_OPENED: "LOOTBOX_OPENED", // event sent by the server to confirm that a lootbox has been opened
	START_MATCHMAKING:"START_MATCHMAKING" // event sent by phaser to start matchmaking
};

const eventEmitter = new Phaser.Events.EventEmitter();

export { Events, eventEmitter };
