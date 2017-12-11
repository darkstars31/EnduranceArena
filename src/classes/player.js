import Phaser from 'phaser'
import character from './character';
import { randomInt } from '../utils';

export default class Player extends character {

  constructor (...args) {
    super(args);
   this.animationSetup();
  }

  animationSetup() {
    this.sprite = game.add.sprite(- 100, game.world.height / 2, 'noviceAtlas');
    game.add.tween(this.sprite).to({x: game.world.width /3}, 2000, 'Linear',true);
    //this.sprite1 = game.add.sprite(game.world.width /3, game.world.height / 2 - 60, 'damageAtlas','lucky'); loading a specific frame from an Atlas
    this.sprite.scale.x = -1;
    this.sprite.anchor.setTo(.5,.5);
    this.sprite.animations.add('walk');
    this.sprite.animations.play('walk',10, true);
    this.animations = [];
  }

  animationIdle() {
    this.sprite.loadTexture('noviceAtlas');
    this.sprite.animations.add('idle');
    this.sprite.play('walk', 10, true);
  }

  animationDeath(){
      this.sprite.loadTexture('noviceDeath');
      this.sprite.animations.add('death');
      this.sprite.play('death', 6, false);
  }

  animationHurt() {
      this.sprite.loadTexture('noviceDamaged');
      this.sprite.animations.add('hurt').onComplete.add(()=>{this.animationIdle()});
      this.sprite.play('hurt', 6, false);
  }

}
