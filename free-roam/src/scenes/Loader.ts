import { Scene } from "phaser";
import { config } from "../config/config";

export class LoaderScene extends Scene {
	text: Phaser.GameObjects.Text | undefined = undefined;

	constructor() {
		super({ key: config.loader.key });
	}

	create() {
		const { width, height } = this.scale;

		this.text = this.add
			.text(width / 2, height / 2, "", {
				fontSize: "50px",
				color: "#ffffff",
				fontStyle: "bold",
				align: "center",
				fontFamily: "Monospace",
			})
			.setOrigin(0.5)
			.setAlpha(0.8);

		this.typewriteText("Teleporting...");
	}
	typewriteText(text: string) {
		if (!this.text) return;
		const length = text.length;
		let i = 0;
		this.time.addEvent({
			callback: () => {
				if (!this.text) return;
				this.text.text += text[i];
				++i;
			},
			repeat: length - 1,
			delay: 75,
		});
	}
}
