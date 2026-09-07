import Phaser from 'phaser';
import { Events, GAME_HEIGHT, GAME_WIDTH, SceneKeys } from '../config/constants';

export class HudScene extends Phaser.Scene {
  private locationText!: Phaser.GameObjects.Text;
  private objectiveText!: Phaser.GameObjects.Text;
  private actionButton!: Phaser.GameObjects.Container;
  private actionLabel!: Phaser.GameObjects.Text;
  private joystickKnob?: Phaser.GameObjects.Arc;
  private joystickPointer?: number;

  constructor() { super(SceneKeys.Hud); }

  create(): void {
    const chapterPanel = this.add.container(18, 16).setScrollFactor(0);
    const panel = this.add.rectangle(0, 0, 272, 72, 0x17191a, .92).setOrigin(0).setStrokeStyle(2, 0x9a7946);
    const accent = this.add.rectangle(0, 0, 4, 72, 0xc3a15f).setOrigin(0);
    const chapter = this.add.text(15, 9, 'STORY OF HISTORY  •  CHAPTER I', { fontFamily: 'Montserrat', fontSize: '9px', fontStyle: 'bold', color: '#d5b873', letterSpacing: 1 });
    this.objectiveText = this.add.text(15, 31, 'Awaken in Calamba', { fontFamily: 'Crimson Pro', fontSize: '16px', color: '#fff1cc', wordWrap: { width: 244 } });
    chapterPanel.add([panel, accent, chapter, this.objectiveText]);

    const locationPanel = this.add.container(GAME_WIDTH - 18, 16).setScrollFactor(0);
    const locBg = this.add.rectangle(0, 0, 205, 40, 0x17191a, .92).setOrigin(1, 0).setStrokeStyle(2, 0x9a7946);
    this.locationText = this.add.text(-13, 11, 'Calamba, Laguna', { fontFamily: 'Crimson Pro', fontSize: '15px', color: '#f8e6b9' }).setOrigin(1, 0);
    locationPanel.add([locBg, this.locationText]);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 18, 'WASD / ARROWS TO MOVE   •   E / SPACE TO INTERACT', { fontFamily: 'Montserrat', fontSize: '9px', color: '#f4e3b8', backgroundColor: '#17191acc', padding: { x: 10, y: 6 } }).setOrigin(.5, 1).setVisible(!this.sys.game.device.input.touch);
    this.createActionButton();
    if (this.sys.game.device.input.touch) this.createJoystick();
    this.game.events.on(Events.Location, this.onLocation, this);
    this.game.events.on(Events.Prompt, this.onPrompt, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Events.Location, this.onLocation, this); this.game.events.off(Events.Prompt, this.onPrompt, this);
    });
  }

  private onLocation(data: { location: string; objective: string }): void {
    this.locationText.setText(`◆  ${data.location}`); this.objectiveText.setText(data.objective);
  }

  private createActionButton(): void {
    const circle = this.add.circle(0, 0, 38, 0x191b1c, .88).setStrokeStyle(2, 0xb18b4e).setInteractive({ useHandCursor: true });
    this.actionLabel = this.add.text(0, 0, '', { fontFamily: 'Montserrat', fontSize: '11px', fontStyle: 'bold', color: '#ffecc0', align: 'center' }).setOrigin(.5);
    this.actionButton = this.add.container(GAME_WIDTH - 68, GAME_HEIGHT - 66, [circle, this.actionLabel]).setVisible(false);
    circle.on('pointerdown', () => { circle.setScale(.92); this.game.events.emit('soh:action'); });
    circle.on('pointerup', () => circle.setScale(1));
    circle.on('pointerout', () => circle.setScale(1));
  }

  private onPrompt(prompt: string): void {
    this.actionLabel.setText(prompt); this.actionButton.setVisible(Boolean(prompt));
  }

  private createJoystick(): void {
    const x = 68, y = GAME_HEIGHT - 66;
    const base = this.add.circle(x, y, 47, 0x111619, .5).setStrokeStyle(2, 0xd3bd8b, .5).setInteractive();
    this.joystickKnob = this.add.circle(x, y, 21, 0xd8c59b, .68).setStrokeStyle(2, 0x3a3024);
    base.on('pointerdown', (pointer: Phaser.Input.Pointer) => { this.joystickPointer = pointer.id; this.updateJoystick(pointer); });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => { if (pointer.id === this.joystickPointer && pointer.isDown) this.updateJoystick(pointer); });
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (pointer.id !== this.joystickPointer) return;
      this.joystickPointer = undefined; this.joystickKnob?.setPosition(x, y); this.game.events.emit('soh:joystick', { x: 0, y: 0 });
    });
  }

  private updateJoystick(pointer: Phaser.Input.Pointer): void {
    if (!this.joystickKnob) return;
    const origin = new Phaser.Math.Vector2(68, GAME_HEIGHT - 66);
    const delta = new Phaser.Math.Vector2(pointer.x - origin.x, pointer.y - origin.y);
    if (delta.length() > 38) delta.setLength(38);
    this.joystickKnob.setPosition(origin.x + delta.x, origin.y + delta.y);
    this.game.events.emit('soh:joystick', { x: delta.x / 38, y: delta.y / 38 });
  }
}
