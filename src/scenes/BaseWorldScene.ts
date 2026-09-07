import Phaser from 'phaser';
import { Events, SceneKeys } from '../config/constants';
import { Player } from '../entities/player/Player';
import { InputController } from '../systems/input/InputController';

export abstract class BaseWorldScene extends Phaser.Scene {
  protected player!: Player;
  protected controls!: InputController;
  protected action: (() => void) | undefined;
  protected prompt = '';

  protected setupPlayer(x: number, y: number, worldWidth: number, worldHeight: number): void {
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.player = new Player(this, x, y);
    this.controls = new InputController(this);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight).startFollow(this.player, true, .1, .1).setRoundPixels(true);
    if (!this.scene.isActive(SceneKeys.Hud)) this.scene.launch(SceneKeys.Hud);
  }

  protected setContext(prompt: string, action?: () => void): void {
    if (this.prompt === prompt && this.action === action) return;
    this.prompt = prompt;
    this.action = action;
    this.game.events.emit(Events.Prompt, prompt);
  }

  protected transition(scene: string, data?: object): void {
    this.player.setVelocity(0).setActive(false);
    this.cameras.main.fadeOut(250, 18, 14, 10);
    this.time.delayedCall(260, () => this.scene.start(scene, data));
  }

  update(): void {
    if (!this.player.active) return;
    this.player.move(this.controls.movement());
    if (this.controls.consumeAction() && this.action) this.action();
  }
}
