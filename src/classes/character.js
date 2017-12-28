import Phaser from 'phaser'
import { randomInt } from '../utils';
import FloatingCombatText from './floatingCombatText'

export default class Character {

  constructor (obj) {
	this.floatingCombatText = new FloatingCombatText();  
	this.name 			= obj ? obj.name : '';
	this.level 			= obj ? obj.level : 1;
	this.experience		= obj ? obj.experience : 0;
	this.experienceToNext = obj ? obj.experienceToNext : 100;
	this.zeny 			= obj ? obj.zeny : 0;
	this.statPoints 	= obj ? obj.statPoints : 40;
	this.baseAttack 	= obj ? obj.baseAttack : 5;

	this.strength 		= obj ? obj.stats.strength : 1;
	this.agility 		= obj ? obj.stats.agility : 1;
	this.dexterity 		= obj ? obj.stats.dexterity : 1;
	this.vitality 		= obj ? obj.stats.vitality : 1;
	this.intelligence 	= obj ? obj.stats.intelligence : 1;
	this.luck 			= obj ? obj.stats.luck : 1;

	this.inventory = [];
	
	this.blocking = false;
	this.wasBlocking = false;

	this.hp = 0;
	this.hpMax = this.calculateMaxHp();
	}
	
	isAlive() {
		return this.hp > 0 ? true : false;
	}

	recieveDamage(damage, isCrit) {
		if(this.blocking){
			damage = Math.floor(Phaser.Math.clampBottom(1, damage / 2));
			this.blocking = false;
		}
		this.animationHurt();
		this.floatingCombatText.displayDamage(damage, this, isCrit);
		return game.add.tween(this).to({hp: this.hp - damage}, 500, Phaser.Easing.Sinusoidal.Out, true);
	}

	recieveHealing(healing) {
		this.floatingCombatText.displayHealing(healing, this);
		return game.add.tween(this).to({hp: Phaser.Math.clamp(this.hp + healing, 0, this.calculateMaxHp())}, 500, Phaser.Easing.Sinusoidal.Out, true);		
	}

	calculateMaxHp () {
		return Math.floor(this.vitality * 12 + this.level * 3 + 35);
	}

	calculateAttackLowAndHigh() {
		return [ Math.ceil(this.strength) + this.baseAttack, Math.ceil(this.strength*2.4) - this.strength + this.baseAttack];
	}

	calculateChanceToHit(target){
		let isHit = randomInt(0,100) < [this.calculateAccuracy() - target.calculateEvasionChance()];
		if(!isHit){
			this.floatingCombatText.displayText('Miss', target);
		}
		return isHit;
	}

	calculateAttack() {    
		let lowAndHigh = this.calculateAttackLowAndHigh();
		let criticalDamage = 1;
		if(randomInt(0,100) < this.calculateCriticalChance() || this.wasBlocking){
			this.wasBlocking = false;
			criticalDamage = 2 + this.luck * .07;
		}
		let total = randomInt(lowAndHigh[0], lowAndHigh[1]) + this.baseAttack + this.level;
		return Math.round(total * criticalDamage); 
	}

	calculateEvasionChance() {
		return Math.round([this.level + this.agility * 2 + this.luck / 4] / 1.5);
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
