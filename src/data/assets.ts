export type Direction = 'south' | 'north' | 'east' | 'west';

export const imageAssets = {
  grass: 'runtime-assets/environment/grass.jpg', path: 'runtime-assets/environment/path.jpg', house: 'runtime-assets/buildings/rizal-house.png',
  groundFloor: 'runtime-assets/buildings/ground-floor.png', treeLarge: 'runtime-assets/environment/tree-large.png', treeSmall: 'runtime-assets/environment/tree-small.png',
  bush: 'runtime-assets/environment/bush.png', flowers: 'runtime-assets/environment/flowers.png', fence: 'runtime-assets/environment/fence.png',
  sign: 'runtime-assets/props/sign.png', desk: 'runtime-assets/props/writing-desk.png', book: 'runtime-assets/props/book.png', chest: 'runtime-assets/props/chest.png'
} as const;

export const directions: Direction[] = ['south', 'north', 'east', 'west'];
export const joseFramePath = (action: 'idle' | 'walk', direction: Direction, frame: number) =>
  `runtime-assets/characters/jose/${action}/${direction}/frame_${String(frame).padStart(3, '0')}.png`;
export const joseFrameKey = (action: 'idle' | 'walk', direction: Direction, frame: number) => `jose-${action}-${direction}-${frame}`;
