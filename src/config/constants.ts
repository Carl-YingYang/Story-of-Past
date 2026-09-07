export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const SceneKeys = {
  Boot: 'Boot', Title: 'Title', Exterior: 'CalambaExterior', GroundFloor: 'GroundFloor', UpperFloor: 'UpperFloor', Hud: 'Hud'
} as const;

export const Events = {
  Location: 'soh:location', Prompt: 'soh:prompt', Fade: 'soh:fade'
} as const;
