import { GameObjects } from "phaser";
import { FreeRoamScene } from "../scenes/FreeRoamScene";
import keys from "../utils/keys";

class Teleporter extends GameObjects.Image{
    parentScene:FreeRoamScene
    text:Phaser.GameObjects.Text
    canTeleport:boolean
    teleportTo:string
    vicinityX:number
    vicinityY:number
    constructor(
        parentScene:FreeRoamScene,
        x:number,
        y:number,
        teleportTo?:string
    ){
        super(
            parentScene,
            parentScene.map.tileToWorldX(x),
            parentScene.map.tileToWorldY(y),
            keys.TELEPORTER_ASSET
        )
        this.parentScene = parentScene
        this.scale = 0.2
        this.alpha = 0
        this.teleportTo = teleportTo
        parentScene.add.existing(this);
    }

    checkIfPlayerIsNear():boolean{
        if(this.teleportTo==="thunder" || this.parentScene.currentMap==="thunder"){
            return(
                Math.abs(this.parentScene.player.x - this.x) < 280 &&
                Math.abs(this.parentScene.player.y - this.y) < 120
            )
        }
            return (
                Math.abs(this.parentScene.player.x - this.x) < 130 &&
                Math.abs(this.parentScene.player.y - this.y) < 315
            )
    }

    showPopup(teleportTo:string): void {
		this.text = this.parentScene.add.text(this.x-15, this.y-70, `Hit Space to teleport to ${teleportTo} map`, {
			font: "20px Arial",
		});
	}

    triggerTeleport():void{
        if(this.parentScene.currentMap==="thunder"||this.parentScene.currentMap==="water"||this.parentScene.currentMap==="fire"){
            this.parentScene.scene.start(keys.LOADER_SCENE);
            setTimeout(()=>{
                this.parentScene.switchToCentralScene(this.parentScene.currentMap);
                this.parentScene.scene.stop(keys.LOADER_SCENE)
            },1000)
        }
        if(this.parentScene.currentMap === "central"){
            if(this.teleportTo){
                if(this.teleportTo==="fire"){
                    this.parentScene.scene.start(keys.LOADER_SCENE);
                    setTimeout(()=>{
                        this.parentScene.switchToFireScene();
                        this.parentScene.scene.stop(keys.LOADER_SCENE)
                    },1000)
                }
                else if(this.teleportTo==="water"){
                    this.parentScene.scene.start(keys.LOADER_SCENE);
                    setTimeout(()=>{
                        this.parentScene.switchToWaterScene();
                        this.parentScene.scene.stop(keys.LOADER_SCENE)
                    },1000)
                    
                }
                else if(this.teleportTo==="thunder"){
                    this.parentScene.scene.start(keys.LOADER_SCENE);
                    setTimeout(()=>{
                        this.parentScene.switchToThunderScene();
                        this.parentScene.scene.stop(keys.LOADER_SCENE)
                    },1000)
                }
            }
            else{
                //Error - no params passed  
            }
        }
    }

    update(): void {
        const isNear = this.checkIfPlayerIsNear()
        if(isNear && !this.canTeleport){
            this.showPopup(this.teleportTo)
        }
        if(!isNear && this.canTeleport){
            this.text.destroy()
        }

        this.canTeleport = isNear

        if(this.canTeleport&&this.parentScene.cursor.space.isDown){
            this.triggerTeleport();
        }
    }    
}

export default Teleporter