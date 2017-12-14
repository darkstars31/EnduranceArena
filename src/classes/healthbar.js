import Phaser from 'phaser'
import character from './character';
import { randomInt } from '../utils';

export default class HealthBar {

	constructor() {	}

	createHealthBar(barLocationX, barLocationY){
		// let barLocationX = 93;
		// let barLocationY = 26;
		let barWidth = 242;
		let barMargin = 4;
		let barHeight = 10;
		var meters = game.add.group();
		var meterBackgroundBitmap = game.add.bitmapData(barWidth, barHeight);
		meterBackgroundBitmap.ctx.beginPath();
		meterBackgroundBitmap.ctx.rect(0, 0, meterBackgroundBitmap.width, meterBackgroundBitmap.height);
		meterBackgroundBitmap.ctx.fillStyle = '#37474F';
		meterBackgroundBitmap.ctx.fill();
		// create a Sprite using the background bitmap data
		var healthMeterBG = game.add.sprite(barLocationX, barLocationY, meterBackgroundBitmap);
		meters.add(healthMeterBG);
	
		// create a red rectangle to use as the health meter itself
		var healthBitmap = game.add.bitmapData(barWidth - barMargin, barHeight - barMargin);
		healthBitmap.ctx.beginPath();
		healthBitmap.ctx.rect(0, 0, healthBitmap.width, healthBitmap.height);
		healthBitmap.ctx.fillStyle = '#F44336';
		healthBitmap.ctx.fill();
	 
		// create the health Sprite using the red rectangle bitmap data
		this.hpBar = game.add.sprite(barLocationX + 2, barLocationY + 2, healthBitmap);
		this.hpBar.widthMax = barWidth;
		meters.add(this.hpBar);
	  }

	updatePlayerHpBar(damage){	
		let healthPercent = this.hpBar.widthMax * (Phaser.Math.percent(game.player.hp - damage,game.player.hpMax));
		game.add.tween(this.hpBar).to({'width':  Phaser.Math.clampBottom(0, healthPercent)}, 500, "Quart.easeOut",true, 0, 0, 0);    
	}


}