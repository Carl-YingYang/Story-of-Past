/**
 * Presentation scale is anchored to José's 34×57 px visible artwork at 1×.
 * Source images were authored on unrelated canvases, so each category has an
 * intentional display scale and a much smaller physical footprint.
 */
export const WorldPresentation = {
  character: { scale: 1, body: { width: 22, height: 16, offsetX: 33, offsetY: 56 } },
  exterior: {
    house: { scale: 0.42, footprintHeight: 172, doorwayWidth: 46 },
    treeLarge: { scale: 0.48, footprint: { width: 24, height: 15 } },
    treeSmall: { scale: 0.44, footprint: { width: 20, height: 13 } },
    bush: { scale: 0.18, footprint: { width: 34, height: 10 } },
    flowers: { scale: 0.075 },
    fence: { scale: 0.18, footprint: { width: 45, height: 10 } },
    fenceSide: { scale: 0.16, footprint: { width: 24, height: 34 } },
    gate: { scale: 0.15, footprint: { width: 25, height: 10 } },
    sign: { scale: 0.18, footprint: { width: 22, height: 10 } },
    tallGrass: { scale: 0.14 },
    flowerCluster: { scale: 0.1 },
    rock: { scale: 0.1, footprint: { width: 22, height: 11 } },
    stonePatch: { scale: 0.12 },
    well: { scale: 0.22, footprint: { width: 48, height: 18 } },
    boundaryMarker: { scale: 0.18, footprint: { width: 18, height: 9 } },
  },
  interior: {
    backgroundScale: 0.75,
    desk: { scale: 0.22, footprint: { width: 60, height: 18 } },
    book: { scale: 0.065 },
    chest: { scale: 0.18, footprint: { width: 50, height: 18 } },
  },
  depth: { ground: 10, actorOffset: 4 },
} as const;
