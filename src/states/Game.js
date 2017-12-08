/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Player from '../classes/player';
import Monster from '../classes/monster'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    let background = this.add.sprite(0,0, 'battleBackground1');
    background.scale.setTo(.7,.7);
    this.cloudGeneration();

    this.audioItems = [];
    this.audioItems.push(this.add.audio('audioHit1'));
    this.audioItems.push(this.add.audio('audioHit2'));
    this.audioItems.push(this.add.audio('audioHit3'));
    

    this.bannerText = 'Stage Complete';
    this.banner = this.add.text(this.world.centerX, this.game.height / 6, this.bannerText, {font: 'Bangers', fontSize: 60, fill: '#77BFA3', smoothed: false});
    this.banner.padding.set(10, 16);
    this.banner.anchor.setTo(0.5);
    this.banner.visible = false;


    this.mob = new Monster();
    this.mob.hp = this.mob.hpMax;
    this.mob.sprite.play('idle', 10, true);
    
    this.player = new Player();
    this.player.hp = this.player.hpMax;
    this.player.sprite.animations.play('walk',10, true);
    
    this.buttonList = [];
    this.uiButtonsItems = [
      { button: 'attackButton', scale: {x: .5, y: .5}, method: this.onAttackClick },
      { button: 'shieldButton', scale: {x: .5, y: .5}, method: this.onDefendClick },
      { button: 'healthPotButton', scale: {x: .5, y: .5}, method: this.onDefendClick }
    ];
    this.initUserInterface();

    this.isPlayersTurn = true;

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.width /3,
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
      var button = this.add.button(60 + uiButtonSpacing,this.game.height - 40, item.button, item.method, this);
      button.anchor.setTo(.5,.5);
      button.scale.setTo(item.scale.x,item.scale.y);
      uiButtonSpacing += 60;
      this.buttonList.push(button);
    });       
  }

  onAttackClick() {
    this.isPlayersTurn = false;
    this.attackAudio = this.audioItems[this.rnd.integerInRange(0,this.audioItems.length - 1)];
    this.attackAudio.play();
    let damage = this.player.calculateAttack();
    console.log('Attack: ' + damage);
    this.mob.hp -= damage;
  }

  onDefendClick() {
    console.log('Defend');
    this.isPlayersTurn = false;
  }

  cloudGeneration() {
    let numClouds = this.rnd.integerInRange(1, 3);
    this.clouds = [];
    for(let i = 0;i < numClouds; i++){
      let cloud = this.add.sprite(this.rnd.integerInRange(-400,-160),this.rnd.integerInRange(8,60), 'cloud1');
      let cloudScale = this.rnd.integerInRange(2,5) / 13;
      cloud.scale.setTo(cloudScale,cloudScale);
      cloud.speed = cloudScale;
      this.clouds.push(cloud);
    }
  }

  render () {
    this.clouds.forEach((cloud) => {
      cloud.x += cloud.speed / 2;
      if(cloud.x > 900){
        cloud.x = this.rnd.integerInRange(-500,-160);
      }
    });

    this.playerHp.setText( (this.player.hp > 0 ? this.player.hp.toFixed(): 0) + "/" + this.player.hpMax);      
    this.mobHp.setText( (this.mob.hp > 0 ? this.mob.hp.toFixed() : 0) + "/" + this.mob.hpMax);

    if(this.player.isAlive() && this.mob.isAlive()){
      if(this.isPlayersTurn){
        this.buttonList.forEach((item)=> item.inputEnabled = true);
      } else {      
        this.buttonList.forEach((item)=> item.inputEnabled = false);      
        this.player.hp -= this.mob.strength + this.rnd.integerInRange(4,5);
        this.isPlayersTurn = true;
      }
    } else {
      this.buttonList.forEach((item)=> item.inputEnabled = false);    
      if(!this.player.isAlive()) {
        this.banner.fill = 'red';
        this.banner.text = "YOU DIED";
      }
      this.banner.visible = true;
    }

    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 130, 10)
    }
  }
}
