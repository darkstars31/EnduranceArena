import Phaser from 'phaser'
import character from './character';
import FloatingCombatText from './floatingCombatText'
import { randomInt } from '../utils';

export default class Player extends character {

  constructor (args) {
    super(args);
    this.currentStage = 0;
    this.skillPoints = 1;
    this.healthPotions = 3;

  }

  gainExperience(experience) {
    this.experience += experience;
  }

  levelUp() {
    this.audioLevelUp = game.add.audio('audioLevelUp');
    this.audioLevelUp.play();
    this.floatingCombatText.displayText('Level Up', this);
    this.level += 1;
    this.experience = 0;
    this.experienceToNext = this.experienceToNext + this.level * 77;
    this.statPoints += 8;
    this.skillPoints += 1;
  }

  spendStatPoint(statPointObj) {
    let stat = statPointObj.key.toLowerCase()
    this[stat] += 1;
    this.statPoints -= Math.floor([(this[stat] - 1)/10]) + 1;
  }

  spendSkillPoint(skillPointObj){
    let skill = skillPointObj.key.toLowerCase()
    this.skillPoints -= 1;
    this.skills[skill] += 1;
  }

  animationSetup() {
    this.sprite = game.add.sprite(- 100, game.world.height / 2, 'noviceAtlas');
    game.add.tween(this.sprite).to({x: game.world.width /3}, 2400, 'Linear',true);
    //this.sprite1 = game.add.sprite(game.world.width /3, game.world.height / 2 - 60, 'damageAtlas','lucky'); loading a specific frame from an Atlas
    this.sprite.scale.x = -1;
    this.sprite.anchor.setTo(.5,.5);
    this.sprite.animations.add('walk');
    this.sprite.animations.play('walk',10, true);

    this.spriteHead = game.add.sprite(- 100, game.world.height / 2 - 40, 'noviceHead');
    this.spriteHead.anchor.setTo(.5);
    this.spriteHead.scale.x = -1;
    game.add.tween(this.spriteHead).to({x: game.world.width / 3}, 2400, 'Linear',true); 

  }

  animationIdle() {
    this.sprite.loadTexture('noviceAtlas');
    this.sprite.animations.add('idle');
    this.sprite.play('walk', 10, true);
  }

  animationDeath(){
      this.sprite.loadTexture('noviceDeath');
      this.sprite.animations.add('death');
      this.sprite.play('death', 6, false);
  }

  animationHurt() {
      this.sprite.loadTexture('noviceDamaged');
      this.sprite.animations.add('hurt').onComplete.add(()=>{this.animationIdle()});
      this.sprite.play('hurt', 6, false);
  }

}
