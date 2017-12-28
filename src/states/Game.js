/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Player from '../classes/player'
import Monster from '../classes/monster'
import HealthBar from '../classes/healthbar'
import Environment from '../classes/environment'
import SoundFx from '../classes/soundfx'
import { randomInt } from '../utils'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    let background = this.add.sprite(0,0, 'battleBackground'+randomInt(1,10));
    background.scale.setTo(.7,.7);
    this.environment = new Environment();
    this.environment.cloudGeneration();

    this.sounds = new SoundFx();
    
    this.stageMenu = [];
    this.stageMenu.push(this.add.text(this.world.centerX, this.game.height / 6, "Stage Complete", {font: 'Bangers', fontSize: 48, fill: '#77BFA3', smoothed: false}));
    this.stageMenu.push(this.add.text(this.world.centerX + 120, this.game.height / 3, "Continue", {font: 'Bangers', fontSize: 24, fill: '#000020', smoothed: false}));
    this.stageMenu.push(this.add.text(this.world.centerX - 100, this.game.height / 3, "", {font: 'Bangers', fontSize: 24, fill: '#000020', smoothed: false})); // Item Shop, Label Removed
    this.stageMenu.push(this.add.text(this.world.centerX, this.game.height / 3, "Return to Main Menu", {font: 'Bangers', fontSize: 24, fill: '#000020', smoothed: false}));

    this.stageMenu.forEach(item => {
      item.inputEnabled = true;
      item.events.onInputUp.add(()=>{this.onMenuItemClick(item)});   
      item.anchor.setTo(0.5);
      item.visible = false;
    });
   

    let monsterData = this.cache.getJSON('MonsterData');
    if(game.player.currentStage > monsterData.length - 1){
      game.stage.start('MainMenu');
    }
    this.mob = new Monster(monsterData[game.player.currentStage]);
    this.mob.hp = this.mob.hpMax;
    game.player.animationSetup();
    
    this.buttonList = [];
    this.uiButtonsItems = [
      { button: 'attackButton', scale: {x: .5, y: .5}, method: this.onAttackClick },
      { button: 'shieldButton', scale: {x: .5, y: .5}, method: this.onDefendClick },
      { button: 'healthPotButton', scale: {x: .5, y: .5}, method: this.onHealthPotClick }
    ];
    this.initUserInterface();

    this.stageEnded = false;
    this.leveledUp = false;
    this.isPlayersTurn = true;
    this.isMonstersTurn = false;

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.game.player.sprite.x,
      y: this.world.height / 2 - 45,
      asset: 'mushroom'
    })

    this.add.tween(this.add.text(this.world.centerX - 50, this.game.height / 6, "Stage " + this.mob.level, {font: 'Bangers', fontSize: 48, fill: '#77BFA3', smoothed: false})
    ).to({ alpha: 0}, 500, "Quart.easeOut",true, 2000, 0, 0);

    this.playerHealthBar = new HealthBar(game.player, 73,(this.game.height / 12) - 7);
    this.monsterHealthBar = new HealthBar(this.mob, this.world.width - 73, (this.game.height / 12) - 7, true);
    this.game.add.existing(this.mushroom)
  }

  initUserInterface () {
    game.playerHp = this.add.text(40, this.game.height / 12, game.player.hp + "/" + game.player.calculateMaxHp(), {font: 'Patua One', fontSize: 16, fill: '#fff', smoothed: false})
    game.playerHp.anchor.setTo(0.5);
    game.playerHp.scale.setTo(1,.8);

    this.mobHp = this.add.text( this.game.width - 40, this.game.height / 12, this.mob.hp + "/" + this.mob.calculateMaxHp(), {font: 'Patua One', fontSize: 16, fill: '#fff', smoothed: false})
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
            if(this.leveledUp){
              game.state.start('Stats');
            } else {
              game.state.start('Game');
            }
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
    if(game.player.calculateChanceToHit(this.mob)){
     
      this.sounds.playerAttack().play();
      let damage = game.player.calculateAttack();
      let isCrit = damage > game.player.calculateAttackLowAndHigh()[1] + 10;
      console.log('Attack: ' + damage);
      this.mob.recieveDamage(damage, isCrit).onComplete.add(()=> {this.isPlayersTurn = false; this.isMonstersTurn = true;});
    } else {
      game.player.wasBlocking = false;
      this.isPlayersTurn = false;
      this.isMonstersTurn = true;
    }
  }

  onDefendClick() {
    this.disableButtons();     
    this.sounds.shieldEffect().play();    
    game.player.blocking = true; 
    game.player.wasBlocking = true;        
    this.isPlayersTurn = false; this.isMonstersTurn = true;
  }

  onHealthPotClick() {
    if(game.player.healthPotions > 0){
        this.sounds.amuletEffect().play();
        this.disableButtons();
        game.player.healthPotions -= 1;
        this.healthPotionCount.setText(game.player.healthPotions);
        game.player.recieveHealing( 40 + (game.player.vitality * 3) - (game.player.vitality/2) ).onComplete.add(()=> {this.isPlayersTurn = false; this.isMonstersTurn = true;});
    } else {

    } 
  }

  disableButtons() {
    this.buttonList.forEach((item)=> {item.inputEnabled = false; item.tint = '0x616161'});                      
  }

  render () {
   this.environment.updateClouds();

    game.playerHp.setText( Phaser.Math.clampBottom(0, game.player.hp.toFixed()) + "/" + game.player.calculateMaxHp());      
    this.mobHp.setText( Phaser.Math.clampBottom(0,this.mob.hp.toFixed()) + "/" + this.mob.calculateMaxHp());
    this.monsterHealthBar.updateHpBar();
    this.playerHealthBar.updateHpBar();

    if(game.player.isAlive() && this.mob.isAlive()){
        if(!this.isPlayersTurn && this.isMonstersTurn && this.mob.isAlive()) {
          this.isMonstersTurn = false;  
          if(this.mob.calculateChanceToHit(game.player)){
            let damage = this.mob.calculateAttack();  
            setTimeout(() => {
              this.sounds.playerDamaged().play();
              let isCrit = damage > this.mob.calculateAttackLowAndHigh()[1] + 10;
              game.player.recieveDamage(damage,isCrit).onComplete.add(()=> {
                        this.buttonList.forEach((item)=> { item.inputEnabled = true; item.tint = '0xFFFFFF'}); this.isPlayersTurn = true;});
            }, 750);
          } else {          
            setTimeout(() => {       
              this.buttonList.forEach((item)=> { item.inputEnabled = true; item.tint = '0xFFFFFF'}); this.isPlayersTurn = true;
            }, 750);
          }   

          setTimeout(() => {       
            game.player.postRoundEvents();
          }, 1500);   
      }
    } else {
      this.stageMenu[0].visible = 1;
      this.buttonList.forEach((item)=> item.inputEnabled = false);    
      if(!game.player.isAlive() && !this.stageEnded) {
        this.endOfRoundEvent(false);
      }
      if(!this.mob.isAlive() && !this.stageEnded){
        this.endOfRoundEvent(true);   
      }
      this.stageEnded = true;
    }

    //this.mushroom.x = game.player.sprite.x;
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 130, 10)
    }
  }

  endOfRoundEvent(playerWins) {
    if(playerWins){
      this.stageMenu[1].visible = 1;
      this.stageMenu[2].visible = 1;
      this.mob.animationDeath();  
      game.player.experience += this.mob.experience;
      game.player.zeny += randomInt(this.mob.level*50, this.mob.level*100);  
      if(game.player.experience > game.player.experienceToNext){
        game.player.levelUp();
        this.leveledUp = true;
      }
      console.log('exp: ' + game.player.experience + ' zeny: '+ game.player.zeny);     
    } else {
      this.stageMenu[0].fill = 'red';
      this.stageMenu[0].text = "YOU DIED";
      this.stageMenu[3].visible = 1;
      game.player.animationDeath();
    }
  }
}
