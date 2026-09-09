import Phaser from 'phaser';
import type { MovementVector } from '../../entities/player/Player';

export class InputController {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly wasd: Record<'W' | 'A' | 'S' | 'D' | 'E' | 'SPACE', Phaser.Input.Keyboard.Key>;
  private touchVector: MovementVector = { x: 0, y: 0 };
  private readonly movementVector: MovementVector = { x: 0, y: 0 };
  private actionQueued = false;

  constructor(scene: Phaser.Scene) {
    if (!scene.input.keyboard) throw new Error('Keyboard input is unavailable');
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys('W,A,S,D,E,SPACE') as typeof this.wasd;
    scene.game.events.on('soh:joystick', this.setTouchVector, this);
    scene.game.events.on('soh:action', this.queueAction, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.game.events.off('soh:joystick', this.setTouchVector, this);
      scene.game.events.off('soh:action', this.queueAction, this);
    });
  }

  private setTouchVector(vector: MovementVector): void { this.touchVector = vector; }
  private queueAction(): void { this.actionQueued = true; }

  movement(): MovementVector {
    const keyboardX = Number(this.cursors.right.isDown || this.wasd.D.isDown) - Number(this.cursors.left.isDown || this.wasd.A.isDown);
    const keyboardY = Number(this.cursors.down.isDown || this.wasd.S.isDown) - Number(this.cursors.up.isDown || this.wasd.W.isDown);
    this.movementVector.x = keyboardX || keyboardY ? keyboardX : this.touchVector.x;
    this.movementVector.y = keyboardX || keyboardY ? keyboardY : this.touchVector.y;
    return this.movementVector;
  }

  consumeAction(): boolean {
    const keyboard = Phaser.Input.Keyboard.JustDown(this.wasd.E) || Phaser.Input.Keyboard.JustDown(this.wasd.SPACE);
    const active = keyboard || this.actionQueued;
    this.actionQueued = false;
    return active;
  }
}
