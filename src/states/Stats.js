import Phaser from 'phaser'
import Player from '../classes/player';

export default class extends Phaser.State {
    init () {}
    preload () {}
  
    create () {
        this.menuItemHoverAudio = this.add.audio('audioMenuHover');

        const bannerText = 'Character';
        let banner = this.add.text(this.world.width / 4, this.game.height / 12, bannerText, {font: 'Bangers', fontSize: 36, fill: '#77BFA3', smoothed: false})
        banner.padding.set(10, 16)
        banner.anchor.setTo(0.5)

        let level = this.add.text(this.world.width / 3, this.game.height / 12, "Level "+ game.player.level, {font: 'Bangers', fontSize: 24, fill: '#77BFA3', smoothed: false})
        level.padding.set(10, 16)

        let money = this.add.text(this.world.width / 3 + 100, this.game.height / 12, "Zeny "+ game.player.zeny, {font: 'Bangers', fontSize: 24, fill: '#77BFA3', smoothed: false})
        money.padding.set(10, 16)

        let statPoints = this.add.text(this.world.width / 2 + 200, this.game.height / 12, "Stat Points "+ game.player.statPoints, {font: 'Bangers', fontSize: 24, fill: '#77BFA3', smoothed: false})
        statPoints.padding.set(10, 16)

        let menuItems = [{ label: 'Back', location: {x: this.world.centerX - 50, y:this.game.height - 60 }, inputEnabled: true, gameObject: null},
                         { label: 'Next', location: {x: this.world.centerX + 50, y:this.game.height - 60 }, inputEnabled: true, gameObject: null},
                         { label: 'Stats', location: {x: this.world.width / 3 - 50, y:this.game.height/5 }, inputEnabled: false, gameObject: null},
                         { label: 'Skills', location: {x: this.world.width / (3/2) - 50, y:this.game.height/5 }, inputEnabled: false, gameObject: null}];
        menuItems.forEach( (menuItem) => {
            let item = this.add.text(menuItem.location.x, menuItem.location.y, menuItem.label, {font: 'Bangers', fontSize: 24, fill: '#77BFA3', smoothed: false})
            item.padding.set(10, 16)
            menuItem.gameObject = item;
            item.anchor.setTo(0.5)  
            item.inputEnabled = menuItem.inputEnabled;
            item.useHandCursor = true;
            this.addInputs(item);      
        });

        this.showStats(game.player);
    }

    showStats(player) {
        let stats = [   { key: 'Strength', value: player.strength},
                        { key: 'Agility', value: player.agility},
                        { key: 'Dexterity', value: player.dexterity},
                        { key: 'Vitality', value: player.vitality},
                        { key: 'Intellect', value: player.intelligence},
                        { key: 'Luck', value: player.luck}];
        var spacing = 0;
        stats.forEach(statItem => {
            let item = this.add.text(this.world.width / 3 - 160, this.game.height/4 + spacing, statItem.key +": "+ statItem.value, {font: 'Bangers', fontSize: 20, fill: '#77BFA3', smoothed: false})
            spacing += 32;
        });

        let stats2 = [  { key: 'Damage', value: player.calculateAttackLowAndHigh()[0] +"-"+ player.calculateAttackLowAndHigh()[1]},
                        { key: 'Evasion', value: player.calculateEvasionChance() +"%"},
                        { key: 'Accuracy', value: player.calculateAccuracy()},
                        { key: 'Max HP', value: player.calculateMaxHp()},
                        { key: 'Max MP', value: player.intelligence},
                        { key: 'Critical', value: player.calculateCriticalChance() + "%"}];
        spacing = 0;
        stats2.forEach(statItem => {
            let item = this.add.text(this.world.width / 3 - 20, this.game.height/4 + spacing, statItem.key +": "+ statItem.value, {font: 'Bangers', fontSize: 20, fill: '#77BFA3', smoothed: false})
            spacing += 32;
        });
    }

    addInputs(item) {
        if(item.inputEnabled){
          item.events.onInputUp.add(()=>   {this.onMenuItemClick(item)});   
          item.events.onInputOver.add(()=> {this.onMenuItemHover(item)});
          item.events.onInputOut.add(()=>  {this.onMenuItemOut(item)});
        }
      }

    onMenuItemHover(item) {
        this.menuItemHover = game.add.sprite(item.position.x - 50, item.position.y + 10, 'menuCursor');
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
            case 'Next':
                this.state.start('Game');
                break;
            case 'Back':
                this.state.start('MainMenu'); 
                break;     
            default: console.log("WTF, how did you even?"); break;         
        }
      }

    render () {}
}