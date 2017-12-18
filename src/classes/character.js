import Phaser from 'phaser'
import { randomInt } from '../utils';
import FloatingCombatText from './floatingCombatText'

export default class Character {

  constructor (obj) {
	this.floatingCombatText = new FloatingCombatText();  
	this.name 			= obj ? obj.name : '';
	this.level 			= obj ? obj.level : 1;
	this.zeny 			= obj ? obj.zeny : 0;
	this.statPoints 	= obj ? obj.statPoints : 0;
	this.baseAttack 	= obj ? obj.baseAttack : 5;

	this.strength 		= obj ? obj.stats.strength : 1;
	this.agility 		= obj ? obj.stats.agility : 1;
	this.dexterity 		= obj ? obj.stats.dexterity : 1;
	this.vitality 		= obj ? obj.stats.vitality : 1;
	this.intelligence 	= obj ? obj.stats.intelligence : 1;
	this.luck 			= obj ? obj.stats.luck : 1;

	this.inventory = [];
	
	this.blocking = false;

	this.hp = 0;
	this.hpMax = this.calculateMaxHp();
	}
	
	isAlive() {
		return this.hp > 0 ? true : false;
	}

	recieveDamage(damage) {
		if(this.blocking){
			damage = Math.floor(Phaser.Math.clampBottom(1, damage / 2));
			this.blocking = false;
		}
		this.animationHurt();
		this.floatingCombatText.displayDamage(damage, this);
		return game.add.tween(this).to({hp: this.hp - damage}, 500, Phaser.Easing.Sinusoidal.Out, true);
	}

	recieveHealing(healing) {
		this.floatingCombatText.displayHealing(healing, this);
		return game.add.tween(this).to({hp: Phaser.Math.clamp(this.hp + healing, 0, this.hpMax)}, 500, Phaser.Easing.Sinusoidal.Out, true);		
	}

	calculateMaxHp () {
		return Math.floor(this.vitality * 12 + this.level * 3 + 35);
	}

	calculateAttackLowAndHigh() {
		return [ Math.ceil((this.strength*1.5)/2) + this.baseAttack, this.strength*2 + this.baseAttack];
	}

	calculateAttack() {    
		let strengthBasedAttackBonus = this.strength * 2;
		let criticalDamage = 0;
		if(randomInt(0,100) < this.calculateCriticalChance()){
		criticalDamage = this.baseAttack + strengthBasedAttackBonus;
		}
		return randomInt((this.strength*1.8)/2, strengthBasedAttackBonus) + this.baseAttack + this.level + criticalDamage; 
	}

	calculateEvasionChance() {
		return [this.level + this.agility + this.luck / 5] * 10;
	}

	calculateAccuracy() {
		return 74 + this.level + this.dexterity + Math.floor(this.luck/3);
	}
	
	calculateCriticalChance() {
    return Math.ceil(this.luck - Math.floor(this.luck * .2));
  }

  calculateHp () {
      this.hp = this.hp.toFixed();
  }

  useItem () {
	
  }



}
