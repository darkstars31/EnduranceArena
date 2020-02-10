import Phaser from 'phaser'
import Skills from '../classes/skills'

export default class Riposte extends Skills {

  constructor (target) { 
    super(self);
		this.target = target;
	}

	execute(skillLv, strength) {
		if(skillLv > 0) this.target.recieveDamage( skillLv * strength/2);
	}

}
