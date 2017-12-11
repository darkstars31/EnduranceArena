import Phaser from 'phaser'
import { randomInt } from '../utils';

export default class Character {

  constructor (obj) {
	console.log(obj);
	this.level = 1;
	this.shmeckles = 0;
	
	this.statPoints = 0;

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

	calculateMaxHp () {
		return Math.floor(this.vitality * 20 + this.level * 3 + 35);
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

  calculateHp () {
      this.hp = this.hp.toFixed();
  }



}
