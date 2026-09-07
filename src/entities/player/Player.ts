import Phaser from 'phaser';
import type { Direction } from '../../data/assets';
import { WorldPresentation } from '../../config/worldPresentation';

export interface MovementVector { x: number; y: number; }

export class Player extends Phaser.Physics.Arcade.Sprite {
  private facing: Direction = 'south';
  private readonly speed = 150;
  private activeAnimation = 'jose-idle-south';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'jose-idle-south-0');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const presentation = WorldPresentation.character;
    this.setScale(presentation.scale).setDepth(20).setCollideWorldBounds(true);
    this.body.setSize(presentation.body.width, presentation.body.height).setOffset(presentation.body.offsetX, presentation.body.offsetY);
    this.play(this.activeAnimation);
  }

  move(input: MovementVector): void {
    let x = input.x;
    let y = input.y;
    const magnitudeSquared = x * x + y * y;
    if (magnitudeSquared > 1) {
      const inverseMagnitude = 1 / Math.sqrt(magnitudeSquared);
      x *= inverseMagnitude;
      y *= inverseMagnitude;
    }
    this.setVelocity(x * this.speed, y * this.speed);
    if (magnitudeSquared === 0) {
      this.switchAnimation(`jose-idle-${this.facing}`);
      return;
    }
    const horizontal = x > 0.2 ? 'east' : x < -0.2 ? 'west' : '';
    const vertical = y > 0.2 ? 'south' : y < -0.2 ? 'north' : '';
    this.facing = (vertical && horizontal ? `${vertical}-${horizontal}` : vertical || horizontal) as Direction;
    this.switchAnimation(`jose-walk-${this.facing}`);
  }

  private switchAnimation(key: string): void {
    if (this.activeAnimation === key) return;
    this.activeAnimation = key;
    this.play(key);
  }
}
