import Phaser from 'phaser'
import Skills from '../classes/skills'

export default class Regen extends Skills {

	constructor (target) { 
		super(self);
		this.target = target;
	}

	execute(skillLv) {
		if(skillLv > 0 && this.target.hp < this.target.calculateMaxHp()) this.target.recieveHealing( skillLv * 5);
	}

}
