/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Player from '../classes/player';
import Monster from '../classes/monster'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    let isPlayersTurn = true;
    this.buttonList = [];

    let background = this.add.sprite(0,0, 'battleBackground1');
    background.scale.setTo(.68,.68);

    let playerSprite = this.add.sprite(this.world.width /4, this.world.height / 2, 'noviceWalk');
    playerSprite.scale.x = -1;
    playerSprite.anchor.setTo(.5,.5);
    playerSprite.animations.add('walk');
    playerSprite.animations.play('walk', 10, true);

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
      x: this.world.width /4,
      y: this.world.height / 2 - 45,
      asset: 'mushroom'
    })

    this.game.add.existing(this.mushroom)
  }

  initUserInterface () {
    this.playerHp = this.add.text(60, this.game.height / 12, this.player.hp + "/" + this.player.hpMax, {font: 'Patua One', fontSize: 16, fill: '#fff', smoothed: false})
    this.playerHp.padding.set(10, 16)
    this.playerHp.anchor.setTo(0.5)

    this.mobHp = this.add.text( this.game.width - 60, this.game.height / 12, this.mob.hp + "/" + this.mob.hpMax, {font: 'Patua One', fontSize: 16, fill: '#fff', smoothed: false})
    this.mobHp.padding.set(10, 16)
    this.mobHp.anchor.setTo(0.5)

    let uiButtonSpacing = 0;
    this.uiButtonsItems.forEach((item) => {
      var button = this.add.button(40 + uiButtonSpacing,this.game.height - 25, item.button, item.method, this);
      button.anchor.setTo(.5,.5);
      button.scale.setTo(item.scale.x,item.scale.y);
      uiButtonSpacing += 50;
      this.buttonList.push(button);
    });   
    
  }

  onAttackClick() {
    this.isPlayersTurn = false;
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

    if(this.isPlayersTurn){
      this.buttonList.forEach((item)=> item.inputEnable = true);
    } else {      
      this.buttonList.forEach((item)=> item.inputEnable = false);      
      this.player.hp -= this.mob.strength + this.rnd.integerInRange(4,5);
      this.isPlayersTurn = true;
    }

    this.playerHp.setText( (this.player.hp > 0 ? this.player.hp.toFixed(): 0) + "/" + this.player.hpMax);
    this.mobHp.setText( (this.mob.hp > 0 ? this.mob.hp.toFixed() : 0) + "/" + this.mob.hpMax);
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 130, 10)
    }
  }
}
