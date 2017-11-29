/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'Endurance Arena'
    let banner = this.add.text(this.world.centerX, this.game.height / 6, bannerText, {font: 'Bangers', fontSize: 40, fill: '#77BFA3', smoothed: false})
    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    let menuItems = ['New Game', 'Continue', 'Settings']
    let menuSpacing = 0;
    menuItems.forEach( (item) => {
        let banner = this.add.text(this.world.centerX, this.game.height / 3 + menuSpacing, item, {font: 'Bangers', fontSize: 20, fill: '#77BFA3', smoothed: false})
        banner.padding.set(10, 16)
        banner.anchor.setTo(0.5)  
        menuSpacing += 32;
    })


   

  }

  render () {
    if (__DEV__) { }
  }
}
