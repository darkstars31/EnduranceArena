import Phaser from 'phaser'
import character from './character';

export default class Monster extends character{

  constructor () {
    super();
    this.animationSetup();
  }

  animationSetup() {
    this.sprite = game.add.sprite(game.world.width / (3 / 2), game.world.height / 2, 'poringIdle');
    this.sprite.anchor.setTo(.5,.5);
    this.sprite.animations.add('idle');
    this.animations = [];
  }


}
