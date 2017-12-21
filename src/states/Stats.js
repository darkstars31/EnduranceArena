import Phaser from 'phaser'
import Player from '../classes/player';

export default class extends Phaser.State {
    init () {}
    preload () {}
  
    create () {
        this.update = false;
        this.menuItemHoverAudio = this.add.audio('audioMenuHover');

        const bannerText = 'Character';
        let banner = this.add.text(this.world.width / 4, this.game.height / 12, bannerText, {font: 'Bangers', fontSize: 36, fill: '#77BFA3', smoothed: false})
        banner.padding.set(10, 16)
        banner.anchor.setTo(0.5)

        let level = this.add.text(this.world.width / 3 + 20, this.game.height / 12, "Level "+ game.player.level, {font: 'Bangers', fontSize: 20, fill: '#77BFA3', smoothed: false})
        level.padding.set(10, 16)

        let money = this.add.text(this.world.width / 3 + 80, this.game.height / 12, "Zeny "+ game.player.zeny, {font: 'Bangers', fontSize: 20, fill: '#77BFA3', smoothed: false})
        money.padding.set(10, 16)

        this.statPoints = this.add.text(this.world.width / 3 + 180, this.game.height / 12, "Stat Points "+ game.player.statPoints, {font: 'Bangers', fontSize: 20, fill: '#77BFA3', smoothed: false})
        this.statPoints.padding.set(10, 16)

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

        this.statPlusIconList = [];
        this.showStats(game.player);
    }

    showStats(player) {
        this.primaryStatsList = [];
        this.secondaryStatsList = [];
        this.stats = [   { key: 'Strength', secondaryKey:'Damage',   secondaryStat: 'calculateAttackLowAndHigh'},
                        { key: 'Agility', secondaryKey:'Evasion(%)',   secondaryStat: 'calculateEvasionChance', isPercent: true},
                        { key: 'Dexterity', secondaryKey:'Accuracy', secondaryStat: 'calculateAccuracy'},
                        { key: 'Vitality', secondaryKey:'Max HP',   secondaryStat: 'calculateMaxHp'},
                        //{ key: 'Intellect'},
                        { key: 'Luck', secondaryKey:'Critical(%)', secondaryStat: 'calculateCriticalChance', isPercent: true}];
        var spacing = 0;
        this.stats.forEach(statItem => {
            let item = this.add.text(this.world.width / 3 - 160, this.game.height/4 + spacing, statItem.key +": "+ game.player[statItem.key.toLowerCase()], {font: 'Bangers', fontSize: 20, fill: '#77BFA3', smoothed: false})
            this.secondaryStatsList.push(this.add.text(this.world.width / 3 - 20, this.game.height/4 + spacing, statItem.secondaryKey +": "+  game.player[statItem.secondaryStat](), {font: 'Bangers', fontSize: 20, fill: '#77BFA3', smoothed: false}));
            if(game.player.statPoints > 0) this.statPlusIconList.push(this.add.button(this.world.width / 3 - 190,this.game.height/4 + spacing, 'statPlusIcon', ()=> { this.spendStatPoint(statItem, item )}, this));
            spacing += 32;
        });

        this.statPlusIconList.forEach((item) => {
            item.scale.setTo(.1,.1);
        });
    }

    spendStatPoint(obj, item) {
        this.update = true;
        if(game.player.statPoints > 1){
            game.player.spendStatPoint(obj);
            item.setText(obj.key +": "+ game.player[obj.key.toLowerCase()]);
            this.statPoints.setText("Stat Points "+ Phaser.Math.clampBottom(0, game.player.statPoints));
        } else {
            this.statPlusIconList.forEach((item) => {
                item.destroy();
            });
        }
 
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
                game.player.hp = game.player.calculateMaxHp();
                this.state.start('Game');
                break;
            case 'Back':
                this.state.start('MainMenu'); 
                break;     
            default: console.log("WTF, how did you even?"); break;         
        }
      }

    render () {
       if(this.update){
            this.secondaryStatsList.forEach((item,index) => {
                item.text = this.stats[index].secondaryKey +": "+  game.player[this.stats[index].secondaryStat]()
            });
            this.update = false;
        }
     
    }
}