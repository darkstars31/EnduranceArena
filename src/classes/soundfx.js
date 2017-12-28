import Phaser from 'phaser'
import { randomInt } from '../utils'

export default class SoundFx {

  constructor () {

	this.amuletSoundEffect = game.add.audio('audioAmuletSoundEffect');
    this.shieldSoundEffect = game.add.audio('audioShield');
    this.playerDamagedSoundEffect = game.add.audio('audioPlayerDamaged');

    this.audioItems = [];
    this.audioItems.push(game.add.audio('audioHit1'));
    this.audioItems.push(game.add.audio('audioHit2'));
	this.audioItems.push(game.add.audio('audioHit3'));
	
	this.audioAttackMissList = [];
    this.audioAttackMissList.push(game.add.audio('audioMiss1'));
    this.audioAttackMissList.push(game.add.audio('audioMiss2'));
    this.audioAttackMissList.push(game.add.audio('audioMiss3'));
    this.audioAttackMissList.push(game.add.audio('audioMiss4'));

   }

   playerDamaged(){
	   return this.playerDamagedSoundEffect;
   }

   amuletEffect(){
	   return this.amuletSoundEffect;
   }

   shieldEffect(){
	   return this.shieldSoundEffect;
   }

   playerAttack(){
	   return this.audioItems[randomInt(0,this.audioItems.length - 1)];
   }

   attackMiss() {
	   return this.audioAttackMissList[randomInt(0,this.audioAttackMissList.length - 1)];
   }

}
