/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.stage.disableVisibilityChange = true;

    const bannerText = 'Endurance Arena'
    let banner = this.add.text(this.world.centerX, this.game.height / 6, bannerText, {font: 'Bangers', fontSize: 40, fill: '#77BFA3', smoothed: false})
    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    let menuItems = [{ label: 'New Game', inputEnabled: true, gameObject: null}, 
                     { label: 'Continue', inputEnabled: true, gameObject: null}, 
                     { label: 'Settings', inputEnabled: true, gameObject: null}
                ];
    let menuSpacing = 0;
    menuItems.forEach( (menuItem) => {
        let item = this.add.text(this.world.centerX, this.game.height / 3 + menuSpacing, menuItem.label, {font: 'Bangers', fontSize: 20, fill: '#77BFA3', smoothed: false})
        item.padding.set(10, 16)
        menuItem.gameObject = item;
        item.anchor.setTo(0.5)  
        item.inputEnabled = menuItem.inputEnabled;
        item.useHandCursor = true;
        this.addInputs(item);
        menuSpacing += 32;
    });

  }

  addInputs(item) {
    item.events.onInputUp.add(()=>   {this.onMenuItemClick(item)});   
    item.events.onInputOver.add(()=> {this.onMenuItemHover(item)});
    item.events.onInputOut.add(()=>  { console.log('Out')});
  }

  onMenuItemHover(item) {

  }

  onMenuItemClick(item) {
    this.add.audio('audioMenuSelect').play();
    switch(item.text){
        case 'New Game':
            this.state.start('Game'); 
            break;
        case 'Continue':
            break;
        case 'Settings':
            break;
        default: console.log("WTF, how did you even?"); break;         
    }
  }

  render () {
    if (__DEV__) { }
  }
}
