import Phaser from 'phaser'
import { randomInt } from '../utils';

export default class Character {

  constructor (obj) {
	this.level = 1;
	this.shmeckles = 0;
	
	this.statPoints = 0;
	this.baseAttack = 5;

	this.strength = 1;
	this.agility = 1;
	this.dexterity = 1;
	this.vitality = 1;
	this.intelligence = 1;
	this.luck = 1;

	this.hp = 0;
	this.hpMax = this.calculateMaxHp();
	}
	
	isAlive() {
		return this.hp > 0 ? true : false;
	}

	recieveDamage(damage) {
		this.animationHurt();
		if(damage < 0 && this.hp + damage > this.hpMax){
			this.hp = this.hpMax;
		}
		return game.add.tween(this).to({hp: this.hp - damage}, 500, Phaser.Easing.Sinusoidal.Out, true);
	}

	calculateMaxHp () {
		return Math.floor(this.vitality * 20 + this.level * 3 + 35);
	}

	calculateAttackLowAndHigh() {
		return [ Math.ceil(this.strength/2) + this.baseAttack, this.strength*2 + this.baseAttack];
	}

	calculateAttack() {
    
    let strengthBasedAttackBonus = this.strength * 2;
    let criticalDamage = 0;
    if(randomInt(0,100) < this.calculateCriticalChance()){
      criticalDamage = this.baseAttack + strengthBasedAttackBonus;
    }
    return randomInt(this.strength/2, strengthBasedAttackBonus) + this.baseAttack + criticalDamage; 
	}

	calculateEvasionChance() {
		return [this.level + this.agility + this.luck / 5] * 10;
	}

	calculateAccuracy() {
		return 74 + this.level + this.dexterity + Math.floor(this.luck/3);
	}
	
	calculateCriticalChance() {
    return Math.ceil(this.luck * 0.3);
  }

  calculateHp () {
      this.hp = this.hp.toFixed();
  }



}
