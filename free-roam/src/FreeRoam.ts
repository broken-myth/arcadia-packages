import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import Phaser from "phaser";
import { Buffer } from "buffer";
import { config } from "./config/config";
import { createComponent } from "@lit-labs/react";
import React from "react";
import { eventEmitter, Events } from "./events/EventEmitters";
import { FreeRoamScene } from "./scenes/FreeRoam";
import { LoaderScene } from "./scenes/Loader";
import { LootboxDetails } from "./types";

const decrypt = (text: string, key: string) => {
	return Number(
		Buffer.from(text, "base64")
			.toString("utf-8")
			.replace(key + key, "")
	);
};

@customElement("free-roam")
class FreeRoam extends LitElement {
	static styles = css`
		:host {
			display: block;
			width: 100%;
			height: 100%;
		}
	`;

	private _game!: Phaser.Game;

	@property({ type: Array }) lootboxDetails: {
		x: string | number;
		y: string | number;
		isOpen: boolean;
	}[] = [];
	@property({ type: String }) encryptionKey = "";
	@property({ type: String }) characterURL = "";

	firstUpdated(): void {
		this.lootboxDetails.forEach((lootboxDetail) => {
			if (typeof lootboxDetail.x === "number") {
				lootboxDetail.x = lootboxDetail.x.toString();
			}

			if (typeof lootboxDetail.y === "number") {
				lootboxDetail.y = lootboxDetail.y.toString();
			}

			lootboxDetail.x = decrypt(lootboxDetail.x, this.encryptionKey);
			lootboxDetail.y = decrypt(lootboxDetail.y, this.encryptionKey);
		});

		this._game = new Phaser.Game({
			type: Phaser.AUTO,
			parent:
				this.shadowRoot?.querySelector<HTMLElement>("#free-roam") ??
				undefined,
			scene: [
				new FreeRoamScene(
					this.lootboxDetails as LootboxDetails[],
					this.characterURL
				),
				new LoaderScene(),
			],
			dom: {
				createContainer: false,
			},
			scale: {
				mode: Phaser.Scale.RESIZE,
				autoCenter: Phaser.Scale.CENTER_BOTH,
			},
			fps: config.fps,
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 0 },
					debug: false,
					fps: config.fps.target,
				},
			},
		});
	}

	disconnectedCallback(): void {
		this._game.destroy(true);
	}

	render(): TemplateResult {
		const realWidth = window.screen.width * window.devicePixelRatio;
		const realHeight = window.screen.height * window.devicePixelRatio;
		window.innerHeight = realHeight;
		window.innerWidth = realWidth;
		return html`<div id="free-roam"></div>`;
	}
}

const FreeRoamLayer = createComponent({
	tagName: "free-roam",
	elementClass: FreeRoam,
	react: React,
});

export { FreeRoamLayer, FreeRoam, eventEmitter, Events };
