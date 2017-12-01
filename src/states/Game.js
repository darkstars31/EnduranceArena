/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Player from '../classes/player';

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {

    this.player = new Player();
    var hpBar = this.add.bitmapData(300,20);
    hpBar.ctx.beginPath();
    hpBar.ctx.rect(0,0,300,40);
    hpBar.ctx.fillStyle = '#00685e';
    hpBar.ctx.fill();

    var bglife = this.add.sprite(this.world.centerX,this.world.centerY, hpBar);
    bglife.anchor.set(0.5);

    this.widthLife = new Phaser.Rectangle(0, 0, hpBar.width, hpBar.height);
    this.totalLife = hpBar.width;
    
    this.life = this.add.sprite(this.game.world.centerX - bglife.width/2 + 10, this.game.world.centerY, hpBar);
    this.life.anchor.y = 0.5;
    this.life.cropEnabled = true;
    this.life.crop(this.widthLife);
    this.time.events.loop(1500, this.cropLife, this);

    
    var uiButtonsItems = [
      { button: 'attackButton', scale: {x: .75, y: .75}, method: this.onAttackClick },
      { button: 'shieldButton', scale: {x: .6, y: .55}, method: this.onDefendClick }
    ];

    let uiButtonSpacing = 0;
    uiButtonsItems.forEach((item) => {
      var button = this.add.button(40 + uiButtonSpacing,this.game.height - 25, item.button, item.method, this);
      button.anchor.setTo(.5,.5);
      button.scale.setTo(item.scale.x,item.scale.y);
      uiButtonSpacing += 50;
    });
    


    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX + 80,
      y: this.world.centerY,
      asset: 'mushroom'
    })

    this.game.add.existing(this.mushroom)
  }

  cropLife(){
    if(this.widthLife.width <= 0){
      this.widthLife.width = this.totalLife;
    }
    else{
      this.add.tween(this.widthLife).to( { width: (this.widthLife.width - (this.totalLife / 10)) }, 200, Phaser.Easing.Linear.None, true);
    }
  }

  onAttackClick() {
    console.log('Attack');
  }

  onDefendClick() {
    console.log('Defend');
  }

  render () {
    this.life.updateCrop();
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
