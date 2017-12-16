import Phaser from 'phaser'
import character from './character';
import { randomInt } from '../utils';

export default class FloatingCombatText {

    constructor (damage, obj) {
        
    }

    displayDamage(damage, obj) {
        var background = game.add.sprite(obj.sprite.x, obj.sprite.y, 'damageAtlas','damageBackground'); 
        var damageText = game.add.text(obj.sprite.x + 1, obj.sprite.y + 10, Math.abs(damage), {font: 'Patua One', fontSize: 18, fill: '#fff', smoothed: false})
        
        background.scale.setTo(.6,.6);
        background.anchor.setTo(.5);
        damageText.scale.setTo(.7,.7);
        damageText.anchor.setTo(.5, .45);
        game.add.tween(background).to({y: obj.sprite.y - 140}, 2000, "Quart.easeOut",true, 0, 0, 0);
        game.add.tween(damageText).to({y: obj.sprite.y - 140}, 2000, "Quart.easeOut",true, 0, 0, 0);
        game.add.tween(background.scale).to({ x: 1, y: 1}, 2000, "Quart.easeOut",true, 0, 0, 0);
        game.add.tween(damageText.scale).to({ x: 1.2, y: 1.2}, 2000, "Quart.easeOut",true, 0, 0, 0);
        game.add.tween(background).to({ alpha: 0}, 2700, "Quart.easeOut",true, 300, 0, 0);
        game.add.tween(damageText).to({ alpha: 0}, 2700, "Quart.easeOut",true, 300, 0, 0);
    }

    displayHealing(healing, obj){
        var text = game.add.text(obj.sprite.x + 1, obj.sprite.y + 10, Math.abs(healing), {font: 'Patua One', fontSize: 18, fill: '#fff', smoothed: false})
        text.tint = '0x99ff7a';
        text.scale.setTo(.7,.7);
        text.anchor.setTo(.5, .45);
        game.add.tween(text).to({y: obj.sprite.y - 140}, 2000, "Quart.easeOut",true, 0, 0, 0);
        game.add.tween(text.scale).to({ x: 1.2, y: 1.2}, 2000, "Quart.easeOut",true, 0, 0, 0);
        game.add.tween(text).to({ alpha: 0}, 2700, "Quart.easeOut",true, 300, 0, 0);
    }

    
}