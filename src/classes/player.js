import Phaser from 'phaser'
import character from './character';
import { randomInt } from '../utils';

export default class Player extends character {

  constructor () {
    super();
   this.animationSetup();
  }

  animationSetup() {
    this.sprite = game.add.sprite(game.world.width /3, game.world.height / 2, 'noviceWalk');
    this.sprite.scale.x = -1;
    this.sprite.anchor.setTo(.5,.5);
    this.sprite.animations.add('walk');
    this.animations = [];
  }
 

  calculateAttack() {
    let baseAttack = 5;
    let strengthBasedAttackBonus = this.strength * 2;
    let criticalDamage = 0;
    if(randomInt(0,100) < this.calculateCriticalChance()){
      criticalDamage = baseAttack + strengthBasedAttackBonus;
    }
    return randomInt(this.strength/2, strengthBasedAttackBonus) + baseAttack + criticalDamage; 
  }

  calculateCriticalChance() {
    return this.luck / 100;
  }


}
