import Phaser from 'phaser'
import WebFont from 'webfontloader'
import Player from '../classes/player';

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#EDEEC9'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers', 'Source Code Pro', 'Russo One', 'Patua One']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
    // Data Files
    this.load.json('MonsterData', './src/data/monsters.json')
    this.load.json('ItemData', './src/data/items.json')

    // Misc
    this.load.image('menuCursor', './assets/images/ui/menuCursor.png')
    this.load.atlas('damageAtlas', './assets/images/spritesheets/damage.png','./assets/images/spritesheets/atlases/damage.json')
    

    // UI
    this.load.image('attackButton', './assets/images/ui/attackButton.png')
    this.load.image('shieldButton', './assets/images/ui/shieldButton.png')
    this.load.image('healthPotButton', './assets/images/ui/healthPotButton.png')
    this.load.image('musicOn', './assets/images/ui/musicOn.png')
    this.load.image('musicOff', './assets/images/ui/musicOff.png')
    this.load.image('arrowUpKey', './assets/images/ui/arrowUpKey.png')

    // Background + Environment
    this.load.image('battleBackground1', './assets/images/battlebackgrounds/battleback1.png')
    this.load.image('cloud1', './assets/images/cloud.png')

    // Animations
    this.load.atlas('noviceAtlas', './assets/images/spritesheets/playerWalk.png','./assets/images/spritesheets/atlases/playerWalk.json')
    this.load.spritesheet('noviceDamaged', './assets/images/spritesheets/noviceHurt.png', 48, 86, 3)
    this.load.spritesheet('noviceDeath', './assets/images/spritesheets/noviceDeath.png', 72, 86, 1)

    this.load.spritesheet('noviceIdle', './assets/images/spritesheets/playerWalkSheet.png', 47, 86, 1, 1, 0)
    this.load.spritesheet('noviceWalk', './assets/images/spritesheets/playerWalkSheet.png', 47, 86, 8, 2, 0)

    this.load.spritesheet('poringIdle', './assets/images/spritesheets/poring.png', 60, 60, 4, 0, 0)
    this.load.spritesheet('poringAttack', './assets/images/spritesheets/poringAttack.png', 60, 45, 7, 0, 0)
    this.load.spritesheet('poringDamaged', './assets/images/spritesheets/poringDamaged.png', 52, 53, 2, 0, 0)
    this.load.spritesheet('poringDeath', './assets/images/spritesheets/poringDeath.png', 96, 75, 5, 0, 0)
    
    
    // Audio
    this.load.audio('battleStage','./assets/audio/prologue.ogg')
    this.load.audio('audioMenuSelect','./assets/audio/MENU_Select.ogg')
    this.load.audio('audioMenuHover','./assets/audio/menuHover.ogg')
    this.load.audio('audioHit1','./assets/audio/hit1.ogg')
    this.load.audio('audioHit2','./assets/audio/hit2.ogg')
    this.load.audio('audioHit3','./assets/audio/hit3.ogg')
    
  }

  create () {
   
    this.game.player = new Player();
    game.player.statPoints = 40;

    var music = this.add.audio('battleStage').play();
    music.volume = .2;

    var soundToggle = game.add.sprite(game.width - 40, game.height - 40, 'musicOn');
    soundToggle.tint = 0xe2e2e2;
    game.stage.addChild(soundToggle);
    soundToggle.inputEnabled = true;
    soundToggle.events.onInputUp.add(() => {
          if(music.volume != 0){
            music.volume = 0;
            soundToggle.loadTexture('musicOff');
          } else {
            music.volume = 0.2;
            soundToggle.loadTexture('musicOn');
          }
    });
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
