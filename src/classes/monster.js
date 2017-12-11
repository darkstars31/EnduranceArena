import Phaser from 'phaser'
import character from './character';

export default class Monster extends character{

  constructor (...args) {
    super(args);
    this.animationSetup();
  }

  animationSetup() {
    this.sprite = game.add.sprite(game.world.width + 100, game.world.height / 2, 'poringIdle');
    var p = game.add.tween(this.sprite).to({x: game.world.width / (3 / 2)}, 2000, 'Linear',true);
    this.sprite.anchor.setTo(.5);
    this.sprite.animations.add('idle');
    this.sprite.play('idle', 10, true);


    // this.sprite1 = game.add.sprite(game.world.width / (3 / 2) + 50, game.world.height / 2, 'poringDamaged');
    // this.sprite.animations.add('hurt');
    // this.sprite1.play('attack', 4, true);
    
    // this.sprite2 = game.add.sprite(game.world.width / (3 / 2) + 100, game.world.height / 2, 'poringDeath');
    // this.sprite2.animations.add('death');
    // this.sprite2.play('death', 6, true);

  }

  animationDeath(){
    this.sprite.loadTexture('poringDeath');
    this.sprite.animations.add('death');
    this.sprite.play('death', 6, false);
  }

  animationHurt() {
    this.sprite.loadTexture('poringDamaged');
    this.sprite.animations.add('hurt').onComplete.add(()=>{this.sprite.loadTexture('poringIdle'); this.sprite.play('idle');});
    this.sprite.play('hurt', 3, false);
  }


}
