import Phaser from 'phaser';
import { Events, SceneKeys } from '../config/constants';
import { WorldPresentation } from '../config/worldPresentation';
import { BaseWorldScene } from './BaseWorldScene';

export class UpperFloorScene extends BaseWorldScene {
  private readonly stairs = new Phaser.Math.Vector2(790, 265);

  constructor() { super(SceneKeys.UpperFloor); }

  create(): void {
    this.add.image(480, 270, 'upperFloor').setScale(WorldPresentation.interior.backgroundScale).setDepth(0);
    this.setupPlayer(790, 300, 960, 540);

    const walls = this.physics.add.staticGroup();
    this.addWall(walls, 480, 82, 720, 75);
    this.addWall(walls, 45, 285, 55, 400);
    this.addWall(walls, 915, 315, 65, 360);
    this.addWall(walls, 180, 518, 340, 32);
    this.addWall(walls, 780, 518, 340, 32);
    this.physics.add.collider(this.player, walls);

    this.game.events.emit(Events.Location, { location: 'Rizal Home • Upper Floor', objective: 'Explore the family home' });
    this.cameras.main.fadeIn(300, 18, 14, 10);
  }

  private addWall(group: Phaser.Physics.Arcade.StaticGroup, x: number, y: number, width: number, height: number): void {
    const zone = this.add.zone(x, y, width, height);
    this.physics.add.existing(zone, true);
    group.add(zone);
  }

  override update(): void {
    const nearStairs = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.stairs.x, this.stairs.y) < 64;
    this.setContext(nearStairs ? 'GO DOWN' : '', nearStairs ? () => this.transition(SceneKeys.GroundFloor, { fromUpper: true }) : undefined);
    super.update();
    this.player.setDepth(this.player.y + WorldPresentation.depth.actorOffset);
  }
}
