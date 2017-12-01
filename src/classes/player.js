import Phaser from 'phaser'

export default class player {

  constructor () {

	this.level = 1;
	this.statPoints = 0;

	this.strength = 1;
	this.agility = 1;
	this.dexterity = 1;
	this.vitality = 1;
	this.intelligence = 1;
	this.luck = 1;

	this.hp = 0;
	this.hpMax = Math.floor(this.vitality * 20 + this.level * 3 + 35);
  }

  statPointAlocation () {

  }

}
