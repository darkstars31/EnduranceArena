/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../classes/player';

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    let background = this.add.sprite(0,0, 'battleBackground1');
    background.scale.setTo(.7,.7);
    background.tint = "0x565656";

    this.menuItemHover = null;
    this.menuItemHoverAudio = this.add.audio('audioMenuHover');
    this.stage.disableVisibilityChange = true;

    const bannerText = 'Endurance Arena'
    let banner = this.add.text(this.world.centerX, this.game.height / 6, bannerText, {font: 'Bangers', fontSize: 48, fill: '#77BFA3', smoothed: false})
    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    let menuItems = [{ label: 'New Game', inputEnabled: true, gameObject: null}, 
                     { label: 'Continue', inputEnabled: true, gameObject: null}, 
                     //{ label: 'Stats', inputEnabled: true, gameObject: null},
                     { label: 'Settings', inputEnabled: true, gameObject: null}
                ];
    let menuSpacing = 0;
    menuItems.forEach( (menuItem) => {
        let item = this.add.text(this.world.centerX, this.game.height / 3 + menuSpacing, menuItem.label, {font: 'Bangers', fontSize: 30, fill: '#77BFA3', smoothed: false})
        item.padding.set(10, 16)
        menuItem.gameObject = item;
        item.anchor.setTo(0.5)  
        item.inputEnabled = menuItem.inputEnabled;
        item.useHandCursor = true;
        this.addInputs(item);
        menuSpacing += 36;
    });

  }

  addInputs(item) {
    item.events.onInputUp.add(()=>   {this.onMenuItemClick(item)});   
    item.events.onInputOver.add(()=> {this.onMenuItemHover(item)});
    item.events.onInputOut.add(()=>  {this.onMenuItemOut(item)});
  }

  onMenuItemHover(item) {
    this.menuItemHover = game.add.sprite(item.position.x - 75, item.position.y + 10, 'menuCursor');
    this.menuItemHover.anchor.setTo(.5,.5);
    this.menuItemHover.scale.setTo(1.3,1.3);
    this.menuItemHoverAudio.play();
  }

  onMenuItemOut(item) {
    this.menuItemHover.destroy();
  }

  onMenuItemClick(item) {
    this.add.audio('audioMenuSelect').play();
    switch(item.text){
        case 'New Game':           
            game.player = new Player();
            this.state.start('Stats'); 
            break;
        case 'Continue':
            this.state.start('Game'); 
            break;
        case 'Settings':
            this.state.start('Settings'); 
            break;
        default: console.log("WTF, how did you even?"); break;         
    }
  }

  render () {
  }
}
