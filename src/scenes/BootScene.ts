import Phaser from 'phaser';
import { SceneKeys } from '../config/constants';
import { directions, imageAssets, joseFrameKey, joseFramePath } from '../data/assets';

export class BootScene extends Phaser.Scene {
  constructor() { super(SceneKeys.Boot); }

  preload(): void {
    Object.entries(imageAssets).forEach(([key, path]) => this.load.image(key, path));
    for (const direction of directions) {
      for (let frame = 0; frame < 4; frame++) this.load.image(joseFrameKey('idle', direction, frame), joseFramePath('idle', direction, frame));
      for (let frame = 0; frame < 8; frame++) this.load.image(joseFrameKey('walk', direction, frame), joseFramePath('walk', direction, frame));
    }
    const bar = this.add.rectangle(480, 390, 320, 8, 0x3a3025).setOrigin(.5);
    const fill = this.add.rectangle(320, 390, 0, 6, 0xd5b66f).setOrigin(0, .5);
    this.load.on('progress', (value: number) => fill.width = 318 * value);
    this.load.on('complete', () => { bar.destroy(); fill.destroy(); });
  }

  create(): void {
    for (const direction of directions) {
      this.anims.create({ key: `jose-idle-${direction}`, frames: Array.from({ length: 4 }, (_, i) => ({ key: joseFrameKey('idle', direction, i) })), frameRate: 4, repeat: -1 });
      this.anims.create({ key: `jose-walk-${direction}`, frames: Array.from({ length: 8 }, (_, i) => ({ key: joseFrameKey('walk', direction, i) })), frameRate: 10, repeat: -1 });
    }
    this.scene.start(SceneKeys.Title);
  }
}
