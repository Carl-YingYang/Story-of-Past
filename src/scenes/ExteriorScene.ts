import Phaser from 'phaser';
import { Events, SceneKeys } from '../config/constants';
import { BaseWorldScene } from './BaseWorldScene';
import { WorldPresentation } from '../config/worldPresentation';

export class ExteriorScene extends BaseWorldScene {
  private readonly worldWidth = 1440;
  private readonly worldHeight = 900;
  private readonly door = new Phaser.Math.Vector2(720, 390);
  private readonly enterHouse = () => this.transition(SceneKeys.GroundFloor);

  constructor() { super(SceneKeys.Exterior); }

  create(data?: { fromHouse?: boolean }): void {
    const p = WorldPresentation.exterior;
    this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, 'grass').setOrigin(0).setTileScale(.32).setTint(0x91a66c).setDepth(0);
    this.composePaths();

    const house = this.add.image(720, 390, 'house').setOrigin(.5, 1).setScale(p.house.scale).setDepth(390);
    this.add.ellipse(720, 385, house.displayWidth * .76, 24, 0x1a2613, .22).setDepth(2);

    const blockers = this.physics.add.staticGroup();
    this.composeTrees(blockers);
    this.composeBoundary(blockers);
    this.composeGarden(blockers);
    this.composeEstate(blockers);

    this.setupPlayer(720, data?.fromHouse ? 435 : 450, this.worldWidth, this.worldHeight);
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
    const addPath = (x: number, y: number, width: number, height: number, angle = 0) =>
      this.add.tileSprite(x, y, width, height, 'path').setTileScale(.26).setTint(tint).setAngle(angle).setDepth(1);
    addPath(720, 505, 68, 230);
    addPath(775, 641, 155, 64, 17);
    addPath(940, 690, 205, 64, 9);
    addPath(1100, 748, 155, 62, 27);
    addPath(1170, 820, 62, 155, 8);
  }

  private composeTrees(blockers: Phaser.Physics.Arcade.StaticGroup): void {
    const p = WorldPresentation.exterior;
    const trees: ReadonlyArray<[number, number, 'treeLarge' | 'treeSmall']> = [
      [70,195,'treeLarge'],[175,205,'treeSmall'],[280,190,'treeLarge'],[410,180,'treeSmall'],
      [1030,185,'treeSmall'],[1150,190,'treeLarge'],[1280,205,'treeSmall'],[1385,235,'treeLarge'],
      [70,390,'treeSmall'],[95,610,'treeLarge'],[125,795,'treeSmall'],[235,875,'treeLarge'],
      [1325,870,'treeLarge'],[1390,730,'treeSmall'],[1380,520,'treeLarge'],
      [1020,315,'treeSmall'],[405,320,'treeSmall'],
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
    const segments = [330,380,430,480,530,580,620,820,860,910,960,1010,1060,1110];
    for (const x of segments) {
      this.add.image(x, 505, 'fence').setOrigin(.5, 1).setScale(p.fence.scale).setDepth(505);
      this.addBlocker(blockers, x, 500, p.fence.footprint.width, p.fence.footprint.height);
    }
    for (const [x, key] of [[666, 'gateLeft'], [774, 'gateRight']] as const) {
      this.add.image(x, 505, key).setOrigin(.5, 1).setScale(p.gate.scale).setDepth(505);
      this.addBlocker(blockers, x, 500, p.gate.footprint.width, p.gate.footprint.height);
    }
    for (const x of [310, 1130]) {
      for (const baseY of [350, 395, 440, 480]) {
        this.add.image(x, baseY, 'fenceSide').setOrigin(.5, 1).setScale(p.fenceSide.scale).setDepth(baseY);
        this.addBlocker(blockers, x, baseY - 17, p.fenceSide.footprint.width, p.fenceSide.footprint.height);
      }
    }
    const sign = this.add.image(805, 495, 'sign').setOrigin(.5, 1).setScale(p.sign.scale).setDepth(495);
    this.addBlocker(blockers, sign.x, 490, p.sign.footprint.width, p.sign.footprint.height);
  }

  private composeGarden(blockers: Phaser.Physics.Arcade.StaticGroup): void {
    const p = WorldPresentation.exterior;
    const bushes = [[330,350],[380,385],[1060,360],[1110,390],[185,440],[1270,445],[315,555],[1080,535],[390,830],[1040,820]] as const;
    for (const [x, baseY] of bushes) {
      this.add.image(x, baseY, 'bush').setOrigin(.5, 1).setScale(p.bush.scale).setDepth(baseY);
      this.addBlocker(blockers, x, baseY - 5, p.bush.footprint.width, p.bush.footprint.height);
    }
    const flowerClusters = [[420,390],[448,402],[992,398],[1020,405],[370,470],[1080,470],[565,545],[590,550],[945,615],[975,622],[300,700],[330,708]] as const;
    for (const [x, baseY] of flowerClusters) this.add.image(x, baseY, 'flowers').setOrigin(.5, 1).setScale(p.flowers.scale).setDepth(baseY);
    for (const [x, baseY] of [[205,510],[245,525],[1190,575],[1240,590],[440,675],[1000,755]] as const)
      this.add.image(x, baseY, 'tallGrass').setOrigin(.5, 1).setScale(p.tallGrass.scale).setDepth(baseY);
    for (const [x, baseY] of [[400,455],[1070,458],[520,790],[890,720],[1190,720]] as const)
      this.add.image(x, baseY, 'flowerCluster').setOrigin(.5, 1).setScale(p.flowerCluster.scale).setDepth(baseY);
    for (const [x, baseY] of [[275,610],[1175,650],[360,775],[1060,860]] as const) {
      this.add.image(x, baseY, 'rockSmall').setOrigin(.5, 1).setScale(p.rock.scale).setDepth(baseY);
      this.addBlocker(blockers, x, baseY - 5, p.rock.footprint.width, p.rock.footprint.height);
    }
    for (const [x, y] of [[650,675],[790,690],[1080,560]] as const)
      this.add.image(x, y, 'stonePatch').setScale(p.stonePatch.scale).setDepth(2).setAlpha(.72);
  }

  private composeEstate(blockers: Phaser.Physics.Arcade.StaticGroup): void {
    const p = WorldPresentation.exterior;
    // A compact cultivated strip beyond the family fence suggests leased estate land.
    this.add.tileSprite(1260, 390, 220, 175, 'grassDark').setTileScale(.28).setTint(0x89a060).setDepth(1);
    for (const y of [345, 385, 425]) {
      for (const x of [1195, 1240, 1285, 1330])
        this.add.image(x, y, 'tallGrass').setOrigin(.5, 1).setScale(.1).setTint(0xb8b06a).setDepth(y);
    }
    const well = this.add.image(1190, 560, 'well').setOrigin(.5, 1).setScale(p.well.scale).setDepth(560);
    this.addBlocker(blockers, well.x, 551, p.well.footprint.width, p.well.footprint.height);
    const marker = this.add.image(1340, 555, 'boundaryMarker').setOrigin(.5, 1).setScale(p.boundaryMarker.scale).setDepth(555);
    this.addBlocker(blockers, marker.x, 551, p.boundaryMarker.footprint.width, p.boundaryMarker.footprint.height);
    for (const x of [1175, 1225, 1275, 1325, 1375]) {
      this.add.image(x, 485, 'fence').setOrigin(.5, 1).setScale(p.fence.scale).setDepth(485);
      this.addBlocker(blockers, x, 480, p.fence.footprint.width, p.fence.footprint.height);
    }
  }

  private addBlocker(group: Phaser.Physics.Arcade.StaticGroup, x: number, y: number, width: number, height: number): void {
    const zone = this.add.zone(x, y, width, height);
    this.physics.add.existing(zone, true); group.add(zone);
  }

  override update(): void {
    const nearDoor = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.door.x, this.door.y) < 52;
    this.setContext(nearDoor ? 'ENTER' : '', nearDoor ? this.enterHouse : undefined);
    super.update();
  }
}
