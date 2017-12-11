import Phaser from 'phaser'
import character from './character';
import { randomInt } from '../utils';

export default class Player extends character {

  constructor (...args) {
    super(args);
   this.animationSetup();
  }

  animationSetup() {
    this.sprite = game.add.sprite(game.world.width /3, game.world.height / 2, 'noviceAtlas');
    //this.sprite1 = game.add.sprite(game.world.width /3, game.world.height / 2 - 60, 'damageAtlas','lucky'); loading a specific frame from an Atlas
    this.sprite.scale.x = -1;
    this.sprite.anchor.setTo(.5,.5);
    this.sprite.animations.add('walk');
    this.sprite.animations.play('walk',10, true);
    this.animations = [];
  }


}
