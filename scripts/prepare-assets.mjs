import { cp, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(repositoryRoot, 'public', 'runtime-assets');

const requiredAssets = [
  ['assets-items/grass/base.jpg', 'environment/grass.jpg'],
  ['assets-items/path/dirt-base.jpg', 'environment/path.jpg'],
  ['assets-items/house/rizal-house.png', 'buildings/rizal-house.png'],
  ['assets-items/house/interior-ground-floor.png', 'buildings/ground-floor.png'],
  ['assets-items/house/interior-firstfloor(rizal-room).png', 'buildings/upper-floor.png'],
  ['assets-items/tree/large-mango-tree.png', 'environment/tree-large.png'],
  ['assets-items/tree/small-tropical-tree.png', 'environment/tree-small.png'],
  ['assets-items/bush/flowering-bush.png', 'environment/bush.png'],
  ['assets-items/flowers/white-flower.png', 'environment/flowers.png'],
  ['assets-items/fences/fence-a.png', 'environment/fence.png'],
  ['assets-items/fences/fences-b.png', 'environment/fence-side.png'],
  ['assets-items/fences/gate-open-a.png', 'environment/gate-left.png'],
  ['assets-items/fences/gate-open-b.png', 'environment/gate-right.png'],
  ['assets-items/grass/tallgrass.png', 'environment/tall-grass.png'],
  ['assets-items/flowers/small-flower-cluster.png', 'environment/flower-cluster.png'],
  ['assets-items/rocks/small-rock.png', 'environment/rock-small.png'],
  ['assets-items/rocks/stone-patch.png', 'environment/stone-patch.png'],
  ['assets-items/interactive-objects/sign.png', 'props/sign.png'],
  ['assets-items/interactive-objects/writing-desk.png', 'props/writing-desk.png'],
  ['assets-items/interactive-objects/book.png', 'props/book.png'],
  ['assets-items/interactive-objects/chest.png', 'props/chest.png'],
];

const directions = ['south', 'south-east', 'east', 'north-east', 'north', 'north-west', 'west', 'south-west'];
const joseSourceRoot = path.join('characters', "José's Rizal", 'Idle', 'animations');

for (const direction of directions) {
  for (let frame = 0; frame < 4; frame += 1) {
    const filename = `frame_${String(frame).padStart(3, '0')}.png`;
    requiredAssets.push([
      path.join(joseSourceRoot, 'Breathing', direction, filename),
      path.join('characters', 'jose', 'idle', direction, filename),
    ]);
  }
  for (let frame = 0; frame < 8; frame += 1) {
    const filename = `frame_${String(frame).padStart(3, '0')}.png`;
    requiredAssets.push([
      path.join(joseSourceRoot, 'Walking', direction, filename),
      path.join('characters', 'jose', 'walk', direction, filename),
    ]);
  }
}

await rm(outputRoot, { recursive: true, force: true });

for (const [sourceRelativePath, destinationRelativePath] of requiredAssets) {
  const source = path.resolve(repositoryRoot, sourceRelativePath);
  const destination = path.resolve(outputRoot, destinationRelativePath);

  // Explicit mappings keep both paths inside the repository-owned directories.
  if (!source.startsWith(`${repositoryRoot}${path.sep}`) || !destination.startsWith(`${outputRoot}${path.sep}`)) {
    throw new Error(`Unsafe asset mapping: ${sourceRelativePath}`);
  }

  try {
    const sourceStats = await stat(source);
    if (!sourceStats.isFile()) throw new Error('Source is not a file');
  } catch (error) {
    throw new Error(`Required source asset is missing: ${sourceRelativePath}`, { cause: error });
  }

  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination);
}

console.log(`Prepared ${requiredAssets.length} runtime assets in ${path.relative(repositoryRoot, outputRoot)}.`);
