import Phaser from 'phaser';
import './style.css';
import { GAME_HEIGHT, GAME_WIDTH } from './config/constants';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { ExteriorScene } from './scenes/ExteriorScene';
import { GroundFloorScene } from './scenes/GroundFloorScene';
import { HudScene } from './scenes/HudScene';

new Phaser.Game({
  type: Phaser.AUTO, parent: 'game', width: GAME_WIDTH, height: GAME_HEIGHT, backgroundColor: '#151a12',
  pixelArt: true, roundPixels: true,
  physics: { default: 'arcade', arcade: { debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: GAME_WIDTH, height: GAME_HEIGHT },
  render: { antialias: false, pixelArt: true, roundPixels: true },
  input: { activePointers: 3 },
  scene: [BootScene, TitleScene, ExteriorScene, GroundFloorScene, HudScene]
});
