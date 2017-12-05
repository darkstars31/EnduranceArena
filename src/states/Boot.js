import Phaser from 'phaser'
import WebFont from 'webfontloader'

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
    this.load.image('attackButton', './assets/images/ui/attackButton.png')
    this.load.image('shieldButton', './assets/images/ui/shieldButton.png')

    this.load.image('battleBackground1', './assets/images/battlebackgrounds/battleback1.png')
    this.load.image('cloud1', './assets/images/cloud.png')

    this.load.spritesheet('novice', './assets/images/spritesheets/novice.png', 40, 80, 8, 12, 5)
    this.load.spritesheet('noviceWalk', './assets/images/spritesheets/playerWalkSheet.png', 47, 86, 8, 2, 0)
    
    this.load.audio('audioMenuSelect','./assets/audio/MENU_Select.ogg')
    
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
