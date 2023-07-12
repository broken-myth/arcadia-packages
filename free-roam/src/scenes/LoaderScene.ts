import { Scene } from "phaser";
import { assets } from "../utils/assets";
import keys from "../utils/keys";
import { config } from "../config/config";

export class LoaderScene extends Scene {
    playerSprite:Phaser.GameObjects.Sprite;

    preload(){
        this.load.spritesheet(keys.PLAYER_ASSET,assets.player_sprite,{
            frameWidth:48,
            frameHeight:48
        })
    }
    
    constructor(){
        super({key:keys.LOADER_SCENE})
    }

    create(){
        this.add.text(window.innerWidth/2-50,window.innerHeight/2,"Teleporting...")
        this.playerSprite = this.add.sprite(window.innerWidth/2,window.innerHeight/2-150,keys.PLAYER_ASSET)
        this.playerSprite.scale = 1;
        this.playerSprite.anims.create({
            key:"right",
            frames:this.anims.generateFrameNumbers(keys.PLAYER_ASSET,{
                start:32,
                end:47,
            }),
            frameRate:config.player.frameRate,
            repeat:1
        })
    }

    update(): void {
        this.playerSprite.anims.play("right",true)
    }
} 