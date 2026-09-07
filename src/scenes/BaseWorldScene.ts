import Phaser from 'phaser';
import { Events, SceneKeys } from '../config/constants';
import { Player } from '../entities/player/Player';
import { InputController } from '../systems/input/InputController';
import { WorldPresentation } from '../config/worldPresentation';

export abstract class BaseWorldScene extends Phaser.Scene {
  protected player!: Player;
  protected controls!: InputController;
  protected action: (() => void) | undefined;
  protected prompt = '';
  private transitioning = false;
  private playerDepth = Number.NaN;

  protected setupPlayer(x: number, y: number, worldWidth: number, worldHeight: number): void {
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.player = new Player(this, x, y);
    this.controls = new InputController(this);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight).startFollow(this.player, true, .1, .1).setRoundPixels(true);
    this.syncPlayerDepth();
    if (!this.scene.isActive(SceneKeys.Hud)) this.scene.launch(SceneKeys.Hud);
  }

  protected setContext(prompt: string, action?: () => void): void {
    if (this.transitioning && prompt) return;
    this.action = action;
    if (this.prompt === prompt) return;
    this.prompt = prompt;
    this.game.events.emit(Events.Prompt, prompt);
  }

  protected transition(scene: string, data?: object): void {
    if (this.transitioning) return;
    this.transitioning = true;
    this.setContext('', undefined);
    this.player.setVelocity(0).setActive(false);
    this.cameras.main.fadeOut(250, 18, 14, 10);
    this.time.delayedCall(260, () => this.scene.start(scene, data));
  }

  protected syncPlayerDepth(): void {
    const nextDepth = Math.floor(this.player.y) + WorldPresentation.depth.actorOffset;
    if (nextDepth === this.playerDepth) return;
    this.playerDepth = nextDepth;
    this.player.setDepth(nextDepth);
  }

  update(): void {
    if (!this.player.active) return;
    this.player.move(this.controls.movement());
    if (this.controls.consumeAction() && this.action) this.action();
    this.syncPlayerDepth();
  }
}
