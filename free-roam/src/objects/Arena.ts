import { GameObjects } from "phaser";
import keys from "../utils/keys";
import { Events, eventEmitter } from "../FreeRoam";
import { FreeRoamScene } from "../scenes/FreeRoamScene";

class Arena extends GameObjects.Sprite{
    parentScene:FreeRoamScene
    text:Phaser.GameObjects.Text
    matchmaking:boolean
    canMatchmake:boolean
    rect:GameObjects.Rectangle
    constructor(
        parentScene:FreeRoamScene,
        x:number,
        y:number,
    ){
        super(
            parentScene,
            parentScene.map.tileToWorldX(x),
            parentScene.map.tileToWorldY(y),
            keys.ARENA_ASSET
        )
        
        this.parentScene = parentScene
        this.scale = 3;
        // this.setupAnimations();
        parentScene.add.existing(this)
    }

    setupAnimations():void{
        this.anims.create({
            key:"spin",
            frames:[{
                key:keys.ARENA_ASSET,
                frame:1,
                duration:0.5,
            },
            {
                key:keys.ARENA_ASSET,
                frame:1,
                duration:0.5
            },
            {
                key:keys.ARENA_ASSET,
                frame:3,
                duration:0.5
            },
            {
                key:keys.ARENA_ASSET,
                frame:4,
                duration:0.5
            },
            {
                key:keys.ARENA_ASSET,
                frame:6,
                duration:0.5
            },{
                key:keys.ARENA_ASSET,
                frame:7,
                duration:0.5
            }
        ],
            frameRate:10,
            repeat:1
        })
    }

    checkIfPlayerIsNear():boolean{
        return(
            Math.abs(this.parentScene.player.x - this.x) < 300 &&
			Math.abs(this.parentScene.player.y - this.y) < 300
        )
    }

    showPopup(): void {
		this.text = this.parentScene.add.text(this.x-15, this.y-70, "Hit Enter to enter the arena", {
			font: "20px Arial",
		});
        this.text.setBackgroundColor("black")
        this.text.setPadding(10)
    //    this.rect =  this.parentScene.add.rectangle(this.x+120,this.y-46,350,50,0x000000);
    //    this.text.setDepth(10)
	}

    triggerMatchmake():void{
        if(this.matchmaking){
            return;
        }
        this.matchmaking = true;
        this.parentScene.pauseGame()
        eventEmitter.emit(Events.START_MATCHMAKING);
        this.text.destroy();
    }

    update():void{
        // this.anims.play("spin",true)
        if(this.matchmaking){
            return
        }
        const isNear = this.checkIfPlayerIsNear()         
        if(isNear && !this.canMatchmake && this.parentScene.currentMap==="central"){
            this.showPopup()
        }
        if(!isNear && this.canMatchmake){
            this.text.destroy()
        }
        
        this.canMatchmake = isNear && this.parentScene.currentMap==="central"

        if(this.canMatchmake&&this.parentScene.enterKey.isDown){
            this.triggerMatchmake();
        }
    }

}

export default Arena