/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.menuItemHover = null;
    this.menuItemHoverAudio = this.add.audio('audioMenuHover');
    this.stage.disableVisibilityChange = true;

    const bannerText = 'Settings'
    let banner = this.add.text(this.world.centerX, this.game.height / 6, bannerText, {font: 'Bangers', fontSize: 50, fill: '#77BFA3', smoothed: false})
    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    let menuItems = [{ label: 'Back', location: {x: this.world.centerX, y:this.game.height - 60 }, inputEnabled: true, gameObject: null},
                     { label: 'Sound Effects', location: {x: this.world.width / 3, y:this.game.height/3 }, inputEnabled: false, gameObject: null},
                     { label: 'Music', location: {x: this.world.width / (3/2), y:this.game.height/3 }, inputEnabled: false, gameObject: null}];
    menuItems.forEach( (menuItem) => {
        let item = this.add.text(menuItem.location.x, menuItem.location.y, menuItem.label, {font: 'Bangers', fontSize: 30, fill: '#77BFA3', smoothed: false})
        item.padding.set(10, 16)
        menuItem.gameObject = item;
        item.anchor.setTo(0.5)  
        item.inputEnabled = menuItem.inputEnabled;
        item.useHandCursor = true;
        this.addInputs(item);      
    });

    this.volumeButtonsList = [
      { button: 'arrowUpKey', location: {x: this.world.width / 3, y: this.game.height/3 + 60 }, scale: {x: .5, y: .5}, method: ()=>this.onSoundEffectVolumeClick(true) },
      { button: 'arrowUpKey', location: {x: this.world.width / 3, y: this.game.height/3 + 120 }, scale: {x: .5, y: .5}, angle: 180, method: ()=>this.onSoundEffectVolumeClick(false) },
      { button: 'arrowUpKey', location: {x: this.world.width / (3/2), y: this.game.height/3 + 60 }, scale: {x: .5, y: .5}, method: ()=>this.onMusicVolumeClick(true) },
      { button: 'arrowUpKey', location: {x: this.world.width / (3/2), y: this.game.height/3 + 120 }, scale: {x: .5, y: .5}, angle: 180 ,method: ()=>this.onMusicVolumeClick(false) }
    ];

    this.volumeButtonsList.forEach((item) => {
      var button = this.add.button(item.location.x ,item.location.y, item.button, item.method, this);
      button.anchor.setTo(.5,.5);
      if(item.angle){ button.angle = item.angle; }
      button.scale.setTo(item.scale.x,item.scale.y);
    });      

  }

  addInputs(item) {
    if(item.inputEnabled){
      item.events.onInputUp.add(()=>   {this.onMenuItemClick(item)});   
      item.events.onInputOver.add(()=> {this.onMenuItemHover(item)});
      item.events.onInputOut.add(()=>  {this.onMenuItemOut(item)});
    }
  }

  onSoundEffectVolumeClick(turnVolumeUp){
    console.log('SoundEffect ' + turnVolumeUp);
  }

  onMusicVolumeClick(turnVolumeUp){
    console.log('MusicVolume ' + turnVolumeUp);
  }

  onMenuItemHover(item) {
    this.menuItemHover = game.add.sprite(item.position.x - 60, item.position.y + 10, 'menuCursor');
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
        case 'Back':
            this.state.start('MainMenu'); 
            break;     
        default: console.log("WTF, how did you even?"); break;         
    }
  }

  render () {
  }
}
