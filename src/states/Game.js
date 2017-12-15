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
    this.floatingCombatTextGroup = this.add.group();

    this.audioItems = [];
    this.audioItems.push(this.add.audio('audioHit1'));
    this.audioItems.push(this.add.audio('audioHit2'));
    this.audioItems.push(this.add.audio('audioHit3'));
    

    this.bannerText = 'Stage Complete';
    this.banner = this.add.text(this.world.centerX, this.game.height / 6, this.bannerText, {font: 'Bangers', fontSize: 60, fill: '#77BFA3', smoothed: false});
    this.banner.padding.set(10, 16);
    this.banner.anchor.setTo(0.5);
    this.banner.visible = false;


    let monster1 = this.cache.getJSON('MonsterData');
    console.log(monster1[0]);
    this.mob = new Monster(monster1);
    this.mob.hp = this.mob.hpMax;
   
    
    game.player.animationSetup();
    game.player.hp = this.game.player.hpMax;
    
    this.buttonList = [];
    this.uiButtonsItems = [
      { button: 'attackButton', scale: {x: .5, y: .5}, method: this.onAttackClick },
      { button: 'shieldButton', scale: {x: .5, y: .5}, method: this.onDefendClick },
      { button: 'healthPotButton', scale: {x: .5, y: .5}, method: this.onHealthPotClick }
    ];
    this.initUserInterface();

    this.isPlayersTurn = true;

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
    game.playerHp = this.add.text(60, this.game.height / 12, game.player.hp + "/" + game.player.hpMax, {font: 'Patua One', fontSize: 16, fill: '#fff', smoothed: false})
    game.playerHp.anchor.setTo(0.5)

    this.mobHp = this.add.text( this.game.width - 60, this.game.height / 12, this.mob.hp + "/" + this.mob.hpMax, {font: 'Patua One', fontSize: 16, fill: '#fff', smoothed: false})
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
    this.disableButtons();                  
    this.attackAudio = this.audioItems[this.rnd.integerInRange(0,this.audioItems.length - 1)];
    this.attackAudio.play();
    let damage = game.player.calculateAttack();
    this.floatingCombatText(damage, this.mob);
    console.log('Attack: ' + damage);
    this.monsterHealthBar.updateHpBar(damage);
    this.mob.recieveDamage(damage).onComplete.add(()=> this.isPlayersTurn = false);
  }

  onDefendClick() {
    this.disableButtons();                  
    this.isPlayersTurn = false;
  }

  onHealthPotClick() {
    this.disableButtons();                  
    game.player.recieveHealing( game.player.hpMax/5 ).onComplete.add(()=> this.isPlayersTurn = false);
  }

  disableButtons() {
    this.buttonList.forEach((item)=> {item.inputEnabled = false; item.tint = '0x616161'});                      
  }

  floatingCombatText(damage, obj){
        var background = game.add.sprite(obj.sprite.x, obj.sprite.y, 'damageAtlas','damageBackground'); 
        var damageText = this.add.text(obj.sprite.x + 1, obj.sprite.y + 10, Math.abs(damage), {font: 'Patua One', fontSize: 18, fill: '#fff', smoothed: false})
        
        background.scale.setTo(.6,.6);
        background.anchor.setTo(.5);
        damageText.scale.setTo(.7,.7);
        damageText.anchor.setTo(.5);
        this.add.tween(background).to({y: obj.sprite.y - 140}, 2000, "Quart.easeOut",true, 0, 0, 0);
        this.add.tween(damageText).to({y: obj.sprite.y - 140}, 2000, "Quart.easeOut",true, 0, 0, 0);
        this.add.tween(background.scale).to({ x: 1, y: 1}, 2000, "Quart.easeOut",true, 0, 0, 0);
        this.add.tween(damageText.scale).to({ x: 1.2, y: 1.2}, 2000, "Quart.easeOut",true, 0, 0, 0);
        this.add.tween(background).to({ alpha: 0}, 2700, "Quart.easeOut",true, 300, 0, 0);
        this.add.tween(damageText).to({ alpha: 0}, 2700, "Quart.easeOut",true, 300, 0, 0);

        this.floatingCombatTextGroup.add(background);
        this.floatingCombatTextGroup.add(damageText);
  }

  cloudGeneration() {
    let numClouds = this.rnd.integerInRange(1, 10);
    this.clouds = [];
    for(let i = 0;i < numClouds; i++){
      let cloud = this.add.sprite(this.rnd.integerInRange(-400,-160),this.rnd.integerInRange(8,60), 'cloud1');
      let cloudScale = this.rnd.integerInRange(2,5) / 12;
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

    game.playerHp.setText( Phaser.Math.clampBottom(0, game.player.hp.toFixed()) + "/" + game.player.hpMax);      
    this.mobHp.setText( Phaser.Math.clampBottom(0,this.mob.hp.toFixed()) + "/" + this.mob.hpMax);

    if(game.player.isAlive() && this.mob.isAlive()){
        if(!this.isPlayersTurn && this.mob.isAlive()) {  
          let damage = this.mob.calculateAttack();  
        setTimeout(() => {
          this.floatingCombatText(damage, game.player);
          this.playerHealthBar.updateHpBar(damage);
          game.player.recieveDamage(damage).onComplete.add(()=> {
                    this.buttonList.forEach((item)=> {item.inputEnabled = true; item.tint = '0xFFFFFF'}); this.isPlayersTurn = true;});
        }, randomInt(200));
       
      }
    } else {
      this.buttonList.forEach((item)=> item.inputEnabled = false);    
      if(!game.player.isAlive()) {
        this.banner.fill = 'red';
        this.banner.text = "YOU DIED";
        game.player.animationDeath();
      }
      if(!this.mob.isAlive()){
        this.mob.animationDeath();       
      }
      this.banner.visible = true;
    }

    //this.mushroom.x = game.player.sprite.x;
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 130, 10)
    }
  }
}
