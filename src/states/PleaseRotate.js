import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
   
  }

  create () {
	this.add.text(this.world.centerX, this.world.centerY - 20, 'Please Rotate', { font: '36px Arial', fill: '#77BFA3', align: 'center' }).anchor.setTo(.5);
	this.add.text(this.world.centerX, this.world.centerY + 20, 'Your Device', { font: '36px Arial', fill: '#77BFA3', align: 'center' }).anchor.setTo(.5);

  }
}
