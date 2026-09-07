import Phaser from 'phaser';
import { Events, SceneKeys } from '../config/constants';
import { BaseWorldScene } from './BaseWorldScene';

export class ExteriorScene extends BaseWorldScene {
  private readonly worldWidth = 1800;
  private readonly worldHeight = 1080;
  private door = new Phaser.Math.Vector2(900, 405);

  constructor() { super(SceneKeys.Exterior); }

  create(data?: { fromHouse?: boolean }): void {
    this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, 'grass').setOrigin(0).setTint(0x99a873);
    const path = this.add.tileSprite(900, 725, 190, 710, 'path').setTint(0xc6a878);
    path.setDepth(1);
    this.add.rectangle(550, 860, 1050, 190, 0xa58a5e, .42).setDepth(1);

    const house = this.add.image(900, 265, 'house').setScale(.72).setDepth(8);
    this.add.ellipse(900, 410, house.displayWidth * .82, 52, 0x16200f, .28).setDepth(2);
    for (const [x, y, scale] of [[210,220,.52],[1540,250,.58],[1450,770,.54],[270,790,.46],[1240,180,.4]] as const) {
      const tree = this.add.image(x, y, x % 3 ? 'treeLarge' : 'treeSmall').setScale(scale).setDepth(y);
      this.add.ellipse(x, y + tree.displayHeight * .37, tree.displayWidth * .55, 24, 0x12200f, .25).setDepth(y - 1);
    }
    for (const [x, y] of [[500,320],[1300,340],[360,520],[1430,540],[390,940],[1370,930]] as const) this.add.image(x, y, 'bush').setScale(.38).setDepth(y);
    for (let x = 350; x <= 1450; x += 138) this.add.image(x, 505, 'fence').setScale(.34).setDepth(500);
    this.add.image(740, 470, 'sign').setScale(.45).setDepth(480);
    for (const [x, y] of [[665,440],[1110,450],[620,710],[1190,800],[780,940]] as const) this.add.image(x, y, 'flowers').setScale(.33).setDepth(y);

    this.setupPlayer(data?.fromHouse ? 900 : 900, data?.fromHouse ? 485 : 740, this.worldWidth, this.worldHeight);
    this.player.setDepth(this.player.y + 10);
    const blockers = this.physics.add.staticGroup();
    this.addBlocker(blockers, 900, 286, 560, 225);
    this.addBlocker(blockers, 80, 540, 100, 1080); this.addBlocker(blockers, 1720, 540, 100, 1080);
    this.physics.add.collider(this.player, blockers);
    this.game.events.emit(Events.Location, { location: 'Calamba, Laguna', objective: 'Enter the Rizal family home' });
    this.cameras.main.fadeIn(300, 18, 14, 10);
  }

  private addBlocker(group: Phaser.Physics.Arcade.StaticGroup, x: number, y: number, width: number, height: number): void {
    const zone = this.add.zone(x, y, width, height);
    this.physics.add.existing(zone, true); group.add(zone);
  }

  override update(): void {
    const nearDoor = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.door.x, this.door.y) < 90;
    this.setContext(nearDoor ? 'ENTER' : '', nearDoor ? () => this.transition(SceneKeys.GroundFloor) : undefined);
    super.update();
    this.player.setDepth(this.player.y + 10);
  }
}
