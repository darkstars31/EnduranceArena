/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Player from '../classes/player';
import Monster from '../classes/monster'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.add.sprite(0,0, 'battleBackground1');

    let numClouds = this.rnd.integerInRange(1, 3);
    this.clouds = [];
    for(let i = 0;i < numClouds; i++){
      let cloud = this.add.sprite(this.rnd.integerInRange(-500,-160),this.rnd.integerInRange(10,80), 'cloud1');
      cloud.scale.setTo(.5,.5);
      this.clouds.push(cloud);
    }

    this.mob = new Monster();
    this.mob.hp = this.mob.hpMax;
    
    this.player = new Player();
    this.player.hp = this.player.hpMax;
    
    this.uiButtonsItems = [
      { button: 'attackButton', scale: {x: .75, y: .75}, method: this.onAttackClick },
      { button: 'shieldButton', scale: {x: .6, y: .55}, method: this.onDefendClick }
    ];

    this.initUserInterface();


    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX + 180,
      y: this.world.centerY + 100,
      asset: 'mushroom'
    })

    this.game.add.existing(this.mushroom)
  }

  initUserInterface () {
    this.playerHp = this.add.text(60, this.game.height / 12, this.player.hp + "/" + this.player.hpMax, {font: 'Patua One', fontSize: 16, fill: '#333333', smoothed: false})
    this.playerHp.padding.set(10, 16)
    this.playerHp.anchor.setTo(0.5)

    this.mobHp = this.add.text( this.game.width - 60, this.game.height / 12, this.mob.hp + "/" + this.mob.hpMax, {font: 'Patua One', fontSize: 16, fill: '#333333', smoothed: false})
    this.mobHp.padding.set(10, 16)
    this.mobHp.anchor.setTo(0.5)

    let uiButtonSpacing = 0;
    this.uiButtonsItems.forEach((item) => {
      var button = this.add.button(40 + uiButtonSpacing,this.game.height - 25, item.button, item.method, this);
      button.anchor.setTo(.5,.5);
      button.scale.setTo(item.scale.x,item.scale.y);
      uiButtonSpacing += 50;
    });
    
  }

  onAttackClick() {
    let damage = this.player.calculateAttack();
    console.log('Attack: ' + damage);
    this.mob.hp -= damage;
  }

  onDefendClick() {
    console.log('Defend');
  }



  render () {
    this.clouds.forEach((cloud) => {
      cloud.x += .03;
      if(cloud.x > 900){
        cloud.x = this.rnd.integerInRange(-500,-160);
      }
    });
    this.playerHp.setText(this.player.hp.toFixed() + "/" + this.player.hpMax);
    this.mobHp.setText(this.mob.hp.toFixed() + "/" + this.mob.hpMax);
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 132, 132)
    }
  }
}
