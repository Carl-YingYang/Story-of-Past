import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SceneKeys } from '../config/constants';

export class TitleScene extends Phaser.Scene {
  constructor() { super(SceneKeys.Title); }

  create(): void {
    this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'grass').setOrigin(0).setTint(0x738453);
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0b0d0a, .48).setOrigin(0);
    for (let i = 0; i < 8; i++) this.add.image(60 + i * 132, 55 + (i % 2) * 390, i % 3 ? 'bush' : 'treeSmall').setScale(.38).setAlpha(.5);
    this.add.text(GAME_WIDTH / 2 + 3, 143, 'STORY OF', { fontFamily: 'Montserrat', fontSize: '20px', fontStyle: 'bold', color: '#1a1510', letterSpacing: 7 }).setOrigin(.5);
    this.add.text(GAME_WIDTH / 2, 140, 'STORY OF', { fontFamily: 'Montserrat', fontSize: '20px', fontStyle: 'bold', color: '#d7bc75', letterSpacing: 7 }).setOrigin(.5);
    this.add.text(GAME_WIDTH / 2 + 4, 203, 'HISTORY', { fontFamily: 'Crimson Pro', fontSize: '70px', fontStyle: 'bold', color: '#19130d' }).setOrigin(.5);
    this.add.text(GAME_WIDTH / 2, 199, 'HISTORY', { fontFamily: 'Crimson Pro', fontSize: '70px', fontStyle: 'bold', color: '#f5e5ba', stroke: '#7c552c', strokeThickness: 2 }).setOrigin(.5);
    this.add.rectangle(GAME_WIDTH / 2, 262, 360, 2, 0xc19a52);
    this.add.text(GAME_WIDTH / 2, 286, 'CHAPTER I', { fontFamily: 'Montserrat', fontSize: '13px', fontStyle: 'bold', color: '#d8bd7b', letterSpacing: 4 }).setOrigin(.5);
    this.add.text(GAME_WIDTH / 2, 319, 'Green Fields, Broken Fences', { fontFamily: 'Crimson Pro', fontSize: '25px', color: '#fff3d2' }).setOrigin(.5);

    const button = this.add.rectangle(GAME_WIDTH / 2, 397, 220, 54, 0x211b15, .96).setStrokeStyle(3, 0xb38a48).setInteractive({ useHandCursor: true });
    const label = this.add.text(GAME_WIDTH / 2, 397, 'BEGIN CHAPTER', { fontFamily: 'Montserrat', fontSize: '14px', fontStyle: 'bold', color: '#f9e8bd', letterSpacing: 1 }).setOrigin(.5);
    const start = () => { button.disableInteractive(); this.cameras.main.fadeOut(350, 10, 9, 7); this.time.delayedCall(360, () => this.scene.start(SceneKeys.Exterior)); };
    button.on('pointerover', () => button.setFillStyle(0x3b2d1d)).on('pointerout', () => button.setFillStyle(0x211b15)).on('pointerdown', start);
    this.input.keyboard?.once('keydown-ENTER', start);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 35, 'A historical narrative adventure  •  Calamba, 1861–1872', { fontFamily: 'Crimson Pro', fontSize: '15px', color: '#cbbd9b' }).setOrigin(.5);
    label.setDepth(2);
    this.cameras.main.fadeIn(500);
  }
}
