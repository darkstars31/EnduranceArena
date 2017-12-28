import Phaser from 'phaser'
import { randomInt } from '../utils'

export default class Environment {

  constructor () { }

  cloudGeneration() {
    let numClouds = randomInt(1, 10);
    this.clouds = [];
    for(let i = 0;i < numClouds; i++){
      let cloud = game.add.sprite(randomInt(-400,-160),randomInt(8,60), 'cloud1');
      let cloudScale = randomInt(2,5) / 12;
      cloud.alpha = randomInt(2,6) / 10;
      cloud.scale.setTo(cloudScale,cloudScale);
      cloud.speed = cloudScale;
      this.clouds.push(cloud);
    }
  }

  updateClouds() {
	this.clouds.forEach((cloud) => {
		cloud.x += cloud.speed / 2;
		if(cloud.x > 900){
		  cloud.x = randomInt(-500,-160);
		}
	  });
  }
}
