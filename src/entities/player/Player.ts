import Phaser from 'phaser';
import type { Direction } from '../../data/assets';
import { WorldPresentation } from '../../config/worldPresentation';

export interface MovementVector { x: number; y: number; }

export class Player extends Phaser.Physics.Arcade.Sprite {
  private facing: Direction = 'south';
  private readonly speed = 150;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'jose-idle-south-0');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const presentation = WorldPresentation.character;
    this.setScale(presentation.scale).setDepth(20).setCollideWorldBounds(true);
    this.body.setSize(presentation.body.width, presentation.body.height).setOffset(presentation.body.offsetX, presentation.body.offsetY);
    this.play('jose-idle-south');
  }

  move(input: MovementVector): void {
    const vector = new Phaser.Math.Vector2(input.x, input.y);
    if (vector.lengthSq() > 1) vector.normalize();
    this.setVelocity(vector.x * this.speed, vector.y * this.speed);
    if (vector.lengthSq() === 0) {
      if (!this.anims.currentAnim?.key.startsWith('jose-idle')) this.play(`jose-idle-${this.facing}`, true);
      return;
    }
    const horizontal = vector.x > 0.2 ? 'east' : vector.x < -0.2 ? 'west' : '';
    const vertical = vector.y > 0.2 ? 'south' : vector.y < -0.2 ? 'north' : '';
    this.facing = (vertical && horizontal ? `${vertical}-${horizontal}` : vertical || horizontal) as Direction;
    this.play(`jose-walk-${this.facing}`, true);
  }
}
