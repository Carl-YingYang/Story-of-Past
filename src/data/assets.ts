export type Direction = 'south' | 'south-east' | 'east' | 'north-east' | 'north' | 'north-west' | 'west' | 'south-west';

export const imageAssets = {
  grass: 'runtime-assets/environment/grass.jpg', grassDark: 'runtime-assets/environment/grass-dark.jpg', path: 'runtime-assets/environment/path.jpg', house: 'runtime-assets/buildings/rizal-house.png',
  groundFloor: 'runtime-assets/buildings/ground-floor.png', upperFloor: 'runtime-assets/buildings/upper-floor.png', treeLarge: 'runtime-assets/environment/tree-large.png', treeSmall: 'runtime-assets/environment/tree-small.png',
  bush: 'runtime-assets/environment/bush.png', flowers: 'runtime-assets/environment/flowers.png', flowerCluster: 'runtime-assets/environment/flower-cluster.png',
  fence: 'runtime-assets/environment/fence.png', fenceSide: 'runtime-assets/environment/fence-side.png', gateLeft: 'runtime-assets/environment/gate-left.png', gateRight: 'runtime-assets/environment/gate-right.png',
  tallGrass: 'runtime-assets/environment/tall-grass.png', rockSmall: 'runtime-assets/environment/rock-small.png', stonePatch: 'runtime-assets/environment/stone-patch.png',
  sign: 'runtime-assets/props/sign.png', well: 'runtime-assets/props/well.png', boundaryMarker: 'runtime-assets/props/land-boundary-marker.png',
  desk: 'runtime-assets/props/writing-desk.png', book: 'runtime-assets/props/book.png', chest: 'runtime-assets/props/chest.png'
} as const;

export const directions: Direction[] = ['south', 'south-east', 'east', 'north-east', 'north', 'north-west', 'west', 'south-west'];
export const joseFramePath = (action: 'idle' | 'walk', direction: Direction, frame: number) =>
  `runtime-assets/characters/jose/${action}/${direction}/frame_${String(frame).padStart(3, '0')}.png`;
export const joseFrameKey = (action: 'idle' | 'walk', direction: Direction, frame: number) => `jose-${action}-${direction}-${frame}`;
