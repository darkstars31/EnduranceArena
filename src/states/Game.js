/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Player from '../classes/player'
import Monster from '../classes/monster'
import HealthBar from '../classes/healthbar'
import { randomInt } from '../utils'

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
    
    this.stageMenu = [];
    this.stageMenu.push(this.add.text(this.world.centerX, this.game.height / 6, "Stage Complete", {font: 'Bangers', fontSize: 60, fill: '#77BFA3', smoothed: false}));
    this.stageMenu.push(this.add.text(this.world.centerX + 120, this.game.height / 3, "Continue", {font: 'Bangers', fontSize: 24, fill: '#000020', smoothed: false}));
    this.stageMenu.push(this.add.text(this.world.centerX - 100, this.game.height / 3, "Item Shop", {font: 'Bangers', fontSize: 24, fill: '#000020', smoothed: false}));
    this.stageMenu.push(this.add.text(this.world.centerX, this.game.height / 3, "Return to Main Menu", {font: 'Bangers', fontSize: 24, fill: '#000020', smoothed: false}));

    this.stageMenu.forEach(item => {
      item.inputEnabled = true;
      item.events.onInputUp.add(()=>{this.onMenuItemClick(item)});   
      item.anchor.setTo(0.5);
      item.visible = false;
    });
   
    let monsterData = this.cache.getJSON('MonsterData');
    this.mob = new Monster(monsterData[game.player.currentStage]);
    this.mob.hp = this.mob.hpMax;
    game.player.animationSetup();
    game.player.hp = game.player.calculateMaxHp();
    
    this.buttonList = [];
    this.uiButtonsItems = [
      { button: 'attackButton', scale: {x: .5, y: .5}, method: this.onAttackClick },
      { button: 'shieldButton', scale: {x: .5, y: .5}, method: this.onDefendClick },
      { button: 'healthPotButton', scale: {x: .5, y: .5}, method: this.onHealthPotClick }
    ];
    this.initUserInterface();

    this.isPlayersTurn = true;
    this.isMonstersTurn = false;

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.game.player.sprite.x,
      y: this.world.height / 2 - 45,
      asset: 'mushroom'
    })

    this.playerHealthBar = new HealthBar(game.player, 93,26);
    this.monsterHealthBar = new HealthBar(this.mob, this.world.width - 93, 26, true);
    this.game.add.existing(this.mushroom)
  }

  initUserInterface () {
    game.playerHp = this.add.text(60, this.game.height / 12, game.player.hp + "/" + game.player.calculateMaxHp(), {font: 'Patua One', fontSize: 16, fill: '#fff', smoothed: false})
    game.playerHp.anchor.setTo(0.5);
    game.playerHp.scale.setTo(1,.8);

    this.mobHp = this.add.text( this.game.width - 60, this.game.height / 12, this.mob.hp + "/" + this.mob.calculateMaxHp(), {font: 'Patua One', fontSize: 16, fill: '#fff', smoothed: false})
    this.mobHp.anchor.setTo(0.5)
    this.mobHp.scale.setTo(1,.8);

    let uiButtonSpacing = 0;
    this.uiButtonsItems.forEach((item) => {
      var button = this.add.button(60 + uiButtonSpacing,this.game.height - 40, item.button, item.method, this);
      button.anchor.setTo(.5,.5);
      button.scale.setTo(item.scale.x,item.scale.y);
      uiButtonSpacing += 60;
      this.buttonList.push(button);
    });       

    this.healthPotionCount = this.add.text(192, this.game.height - 36, game.player.healthPotions, {font: 'Patua One', fontSize: 16, fill: '#fff', smoothed: false})

  }

  onMenuItemClick(item) {
    switch(item._text){
      case 'Continue':
            game.player.currentStage += 1;
            game.state.start('Game');
            break;
      case 'Item Shop':
            break;
      case 'Return to Main Menu':
            game.state.start('MainMenu');
            break;
      default: console.log(item);
            break;
    }
  }

  onAttackClick() {
    this.disableButtons();                  
    this.attackAudio = this.audioItems[this.rnd.integerInRange(0,this.audioItems.length - 1)];
    this.attackAudio.play();
    let damage = game.player.calculateAttack();
    console.log('Attack: ' + damage);
    this.monsterHealthBar.updateHpBar(damage);
    this.mob.recieveDamage(damage).onComplete.add(()=> {this.isPlayersTurn = false; this.isMonstersTurn = true;});
  }

  onDefendClick() {
    this.disableButtons();         
    game.player.blocking = true;         
    this.isPlayersTurn = false; this.isMonstersTurn = true;
  }

  onHealthPotClick() {
    if(game.player.healthPotions > 0){
        this.disableButtons();
        game.player.healthPotions -= 1;
        this.healthPotionCount.setText(game.player.healthPotions);
        game.player.recieveHealing( 40 ).onComplete.add(()=> {this.isPlayersTurn = false; this.isMonstersTurn = true;});

    } else {

    } 
  }

  disableButtons() {
    this.buttonList.forEach((item)=> {item.inputEnabled = false; item.tint = '0x616161'});                      
  }

  cloudGeneration() {
    let numClouds = this.rnd.integerInRange(1, 10);
    this.clouds = [];
    for(let i = 0;i < numClouds; i++){
      let cloud = this.add.sprite(this.rnd.integerInRange(-400,-160),this.rnd.integerInRange(8,60), 'cloud1');
      let cloudScale = this.rnd.integerInRange(2,5) / 12;
      cloud.alpha = this.rnd.integerInRange(2,6) / 10;
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

    game.playerHp.setText( Phaser.Math.clampBottom(0, game.player.hp.toFixed()) + "/" + game.player.calculateMaxHp());      
    this.mobHp.setText( Phaser.Math.clampBottom(0,this.mob.hp.toFixed()) + "/" + this.mob.calculateMaxHp());

    if(game.player.isAlive() && this.mob.isAlive()){
        if(!this.isPlayersTurn && this.isMonstersTurn && this.mob.isAlive()) {
          this.isMonstersTurn = false;  
          let damage = this.mob.calculateAttack();  
        setTimeout(() => {
          this.playerHealthBar.updateHpBar(damage);
          game.player.recieveDamage(damage).onComplete.add(()=> {
                    this.buttonList.forEach((item)=> { item.inputEnabled = true; item.tint = '0xFFFFFF'}); this.isPlayersTurn = true;});
        }, 750);
       
      }
    } else {
      this.stageMenu[0].visible = 1;
      this.buttonList.forEach((item)=> item.inputEnabled = false);    
      if(!game.player.isAlive()) {
        this.stageMenu[0].fill = 'red';
        this.stageMenu[0].text = "YOU DIED";
        this.stageMenu[3].visible = 1;
        game.player.animationDeath();
      }
      if(!this.mob.isAlive()){
        this.stageMenu[1].visible = 1;
        this.stageMenu[2].visible = 1;
        this.mob.animationDeath();       
      }
    }

    //this.mushroom.x = game.player.sprite.x;
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 130, 10)
    }
  }
}
