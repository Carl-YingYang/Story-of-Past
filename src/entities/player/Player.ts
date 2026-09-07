import Phaser from 'phaser';
import type { Direction } from '../../data/assets';

export interface MovementVector { x: number; y: number; }

export class Player extends Phaser.Physics.Arcade.Sprite {
  private facing: Direction = 'south';
  private readonly speed = 150;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'jose-idle-south-0');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(1.2).setDepth(20).setCollideWorldBounds(true);
    this.body.setSize(25, 19).setOffset(21, 43);
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
    if (Math.abs(vector.x) > Math.abs(vector.y)) this.facing = vector.x > 0 ? 'east' : 'west';
    else this.facing = vector.y > 0 ? 'south' : 'north';
    this.play(`jose-walk-${this.facing}`, true);
  }
}
