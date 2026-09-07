import Phaser from 'phaser';
import { Events, SceneKeys } from '../config/constants';
import { BaseWorldScene } from './BaseWorldScene';
import { WorldPresentation } from '../config/worldPresentation';

export class ExteriorScene extends BaseWorldScene {
  private readonly worldWidth = 1440;
  private readonly worldHeight = 900;
  private readonly door = new Phaser.Math.Vector2(720, 390);

  constructor() { super(SceneKeys.Exterior); }

  create(data?: { fromHouse?: boolean }): void {
    const p = WorldPresentation.exterior;
    this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, 'grass').setOrigin(0).setTint(0x91a66c).setDepth(0);
    this.composePaths();

    const house = this.add.image(720, 390, 'house').setOrigin(.5, 1).setScale(p.house.scale).setDepth(390);
    this.add.ellipse(720, 385, house.displayWidth * .76, 24, 0x1a2613, .22).setDepth(2);

    const blockers = this.physics.add.staticGroup();
    this.composeTrees(blockers);
    this.composeBoundary(blockers);
    this.composeGarden(blockers);

    this.setupPlayer(720, data?.fromHouse ? 435 : 450, this.worldWidth, this.worldHeight);
    this.player.setDepth(this.player.y + WorldPresentation.depth.actorOffset);
    // Structural collision is split around the doorway, keeping the steps reachable.
    const houseLeft = house.x - house.displayWidth / 2;
    const houseRight = house.x + house.displayWidth / 2;
    const doorwayLeft = house.x - p.house.doorwayWidth / 2;
    const doorwayRight = house.x + p.house.doorwayWidth / 2;
    this.addBlocker(blockers, (houseLeft + doorwayLeft) / 2, 304, doorwayLeft - houseLeft, p.house.footprintHeight);
    this.addBlocker(blockers, (doorwayRight + houseRight) / 2, 304, houseRight - doorwayRight, p.house.footprintHeight);
    this.addBlocker(blockers, 24, 450, 48, 900); this.addBlocker(blockers, 1416, 450, 48, 900);
    this.physics.add.collider(this.player, blockers);
    this.game.events.emit(Events.Location, { location: 'Calamba, Laguna', objective: 'Enter the Rizal family home' });
    this.cameras.main.fadeIn(300, 18, 14, 10);
  }

  private composePaths(): void {
    const tint = 0xc8ad7b;
    this.add.tileSprite(720, 620, 92, 470, 'path').setTint(tint).setDepth(1);
    this.add.tileSprite(920, 600, 480, 88, 'path').setTint(tint).setDepth(1);
    this.add.tileSprite(1120, 744, 92, 300, 'path').setTint(tint).setDepth(1);
    this.add.tileSprite(485, 755, 560, 82, 'path').setTint(tint).setDepth(1);
    for (const [x, y] of [[720,600],[1120,600],[720,755]] as const) this.add.ellipse(x, y, 112, 96, 0xb89b6d, .56).setDepth(1);
  }

  private composeTrees(blockers: Phaser.Physics.Arcade.StaticGroup): void {
    const p = WorldPresentation.exterior;
    const trees: ReadonlyArray<[number, number, 'treeLarge' | 'treeSmall']> = [
      [92,205,'treeLarge'],[220,235,'treeSmall'],[1250,210,'treeLarge'],[1360,300,'treeSmall'],
      [120,600,'treeSmall'],[235,855,'treeLarge'],[1300,830,'treeLarge'],[1380,680,'treeSmall'],
      [1020,310,'treeSmall'],[390,330,'treeSmall'],[1220,535,'treeSmall'],
    ];
    for (const [x, baseY, key] of trees) {
      const config = key === 'treeLarge' ? p.treeLarge : p.treeSmall;
      this.add.ellipse(x, baseY - 4, 58, 16, 0x152210, .25).setDepth(baseY - 1);
      this.add.image(x, baseY, key).setOrigin(.5, 1).setScale(config.scale).setDepth(baseY);
      this.addBlocker(blockers, x, baseY - config.footprint.height / 2, config.footprint.width, config.footprint.height);
    }
  }

  private composeBoundary(blockers: Phaser.Physics.Arcade.StaticGroup): void {
    const p = WorldPresentation.exterior;
    const segments = [330,380,430,480,530,580,860,910,960,1010,1060,1110];
    for (const x of segments) {
      this.add.image(x, 505, 'fence').setOrigin(.5, 1).setScale(p.fence.scale).setDepth(505);
      this.addBlocker(blockers, x, 500, p.fence.footprint.width, p.fence.footprint.height);
    }
    const sign = this.add.image(805, 495, 'sign').setOrigin(.5, 1).setScale(p.sign.scale).setDepth(495);
    this.addBlocker(blockers, sign.x, 490, p.sign.footprint.width, p.sign.footprint.height);
  }

  private composeGarden(blockers: Phaser.Physics.Arcade.StaticGroup): void {
    const p = WorldPresentation.exterior;
    const bushes = [[300,385],[350,405],[1090,390],[1142,405],[165,440],[1275,445],[390,830],[1040,820]] as const;
    for (const [x, baseY] of bushes) {
      this.add.image(x, baseY, 'bush').setOrigin(.5, 1).setScale(p.bush.scale).setDepth(baseY);
      this.addBlocker(blockers, x, baseY - 5, p.bush.footprint.width, p.bush.footprint.height);
    }
    const flowerClusters = [[430,430],[455,438],[1005,430],[1030,438],[565,565],[590,570],[965,680],[990,688],[310,715],[335,720]] as const;
    for (const [x, baseY] of flowerClusters) this.add.image(x, baseY, 'flowers').setOrigin(.5, 1).setScale(p.flowers.scale).setDepth(baseY);
  }

  private addBlocker(group: Phaser.Physics.Arcade.StaticGroup, x: number, y: number, width: number, height: number): void {
    const zone = this.add.zone(x, y, width, height);
    this.physics.add.existing(zone, true); group.add(zone);
  }

  override update(): void {
    const nearDoor = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.door.x, this.door.y) < 52;
    this.setContext(nearDoor ? 'ENTER' : '', nearDoor ? () => this.transition(SceneKeys.GroundFloor) : undefined);
    super.update();
    this.player.setDepth(this.player.y + WorldPresentation.depth.actorOffset);
  }
}
