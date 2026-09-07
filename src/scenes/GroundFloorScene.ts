import Phaser from 'phaser';
import { Events, SceneKeys } from '../config/constants';
import { BaseWorldScene } from './BaseWorldScene';
import { WorldPresentation } from '../config/worldPresentation';

export class GroundFloorScene extends BaseWorldScene {
  private exit = new Phaser.Math.Vector2(480, 500);

  constructor() { super(SceneKeys.GroundFloor); }

  create(): void {
    const p = WorldPresentation.interior;
    this.add.image(480, 270, 'groundFloor').setScale(p.backgroundScale).setDepth(0);
    this.add.image(250, 410, 'writing-desk').setOrigin(.5, 1).setScale(p.desk.scale).setDepth(410);
    this.add.image(250, 356, 'book').setOrigin(.5, 1).setScale(p.book.scale).setDepth(411);
    this.add.image(700, 410, 'chest').setOrigin(.5, 1).setScale(p.chest.scale).setDepth(410);
    this.setupPlayer(480, 455, 960, 540);
    const walls = this.physics.add.staticGroup();
    this.addWall(walls, 480, 96, 750, 90); this.addWall(walls, 55, 280, 65, 390); this.addWall(walls, 905, 300, 85, 390);
    this.addWall(walls, 170, 515, 300, 35); this.addWall(walls, 790, 515, 300, 35);
    this.addWall(walls, 250, 401, p.desk.footprint.width, p.desk.footprint.height);
    this.addWall(walls, 700, 401, p.chest.footprint.width, p.chest.footprint.height);
    this.addWall(walls, 835, 240, 120, 190);
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
    super.update(); this.player.setDepth(this.player.y + WorldPresentation.depth.actorOffset);
  }
}
