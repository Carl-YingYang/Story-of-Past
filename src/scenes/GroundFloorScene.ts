import Phaser from 'phaser';
import { Events, SceneKeys } from '../config/constants';
import { BaseWorldScene } from './BaseWorldScene';

export class GroundFloorScene extends BaseWorldScene {
  private exit = new Phaser.Math.Vector2(480, 500);

  constructor() { super(SceneKeys.GroundFloor); }

  create(): void {
    this.add.image(480, 270, 'groundFloor').setDisplaySize(960, 540).setDepth(0);
    this.add.image(250, 377, 'writing-desk').setScale(.42).setDepth(390);
    this.add.image(242, 342, 'book').setScale(.28).setDepth(395);
    this.add.image(685, 380, 'chest').setScale(.35).setDepth(390);
    this.setupPlayer(480, 455, 960, 540);
    const walls = this.physics.add.staticGroup();
    this.addWall(walls, 480, 96, 750, 90); this.addWall(walls, 55, 280, 65, 390); this.addWall(walls, 905, 300, 85, 390);
    this.addWall(walls, 170, 515, 300, 35); this.addWall(walls, 790, 515, 300, 35);
    this.physics.add.collider(this.player, walls);
    this.game.events.emit(Events.Location, { location: 'Rizal Home • Ground Floor', objective: 'Explore the family home' });
    this.cameras.main.fadeIn(300, 18, 14, 10);
  }

  private addWall(group: Phaser.Physics.Arcade.StaticGroup, x: number, y: number, width: number, height: number): void {
    const zone = this.add.zone(x, y, width, height); this.physics.add.existing(zone, true); group.add(zone);
  }

  override update(): void {
    const nearExit = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.exit.x, this.exit.y) < 65;
    this.setContext(nearExit ? 'EXIT' : '', nearExit ? () => this.transition(SceneKeys.Exterior, { fromHouse: true }) : undefined);
    super.update(); this.player.setDepth(this.player.y + 10);
  }
}
