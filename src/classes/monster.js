import Phaser from 'phaser'
import character from './character';

export default class Monster extends character{

  constructor () {
    super();
    this.animationSetup();
  }

  animationSetup() {
    this.sprite = game.add.sprite(game.world.width / (3 / 2), game.world.height / 2, 'poringIdle');

    this.sprite1 = game.add.sprite(game.world.width / (3 / 2) + 50, game.world.height / 2, 'poringDamaged');
    this.sprite1.animations.add('attack');
    this.sprite1.play('attack', 4, true);
    
    this.sprite2 = game.add.sprite(game.world.width / (3 / 2) + 100, game.world.height / 2, 'poringDeath');
    this.sprite2.animations.add('death');
    this.sprite2.play('death', 6, false);
    
    this.sprite.anchor.setTo(.5,.5);
    this.sprite.animations.add('idle');
    this.sprite.play('idle', 10, true);
    this.animations = [];
  }

  animationDeath(){
    this.sprite.loadTexture('poringDeath');
  }


}
