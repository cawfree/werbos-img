import sharp from "sharp";
import { typeCheck } from "type-check";
import { existsSync, lstatSync, readdirSync } from "fs";
import { sep } from "path";

const defaultOptions = Object
  .freeze({
    width: 64,
    height: 64,
  });

const isDirectory = e => typeCheck('String', e) && lstatSync(e).isDirectory();
const isDirectories = e => Array.isArray(e) && e.length > 0 && e.reduce((r, f) => r && isDirectory(f), true);

const isFile = e => typeCheck('String', e) && existsSync(e);

const isFiles = e => Array.isArray(e) && e.length > 0 && e.reduce((r, f) => (r && isFile(f)), true);

const ensureAspectRatio = (images) => {
  if (images.length <= 0) {
    throw new Error('Expected at least a single image, but encountered none.');
  }
  const ars = images
    .map(({ bitmap: { width, height } }) => (width / height));
  if ([...new Set(ars)].length !== 1) {
    throw new Error("You have specified an image range consisting of multiple different aspect ratios.");
  }
  return images;
};

const openFiles = (opts, input, hooks) => {
  const { width, height } = opts;
  // TODO: need to enforce that all images have the same aspect ratio
  return input
    .reduce(
      (p, path, i) => p
        .then(
          (images) => Promise
            .resolve(
              sharp(path)
                .resize(width, height)
                .threshold()
            )
            .then((scaledImage) => (images.push(scaledImage) && undefined) || images),
        ),
      Promise.resolve([]),
    );
};

const openDirectories = (opts, inputs, hooks) => Promise
  .all(
    inputs.map(
      dir => Promise.resolve(readdirSync(dir))
        .then(files => openFiles(
          opts,
          files.map(file => `${dir}${sep}${file}`),
          hooks,
        )),
    ),
  );
  
//  input
//  .reduce(
//    (p, dir) => p
//      .then(
//        imgs => Promise.resolve(readdirSync(dir))
//          .then(files => openFiles(
//            opts,
//            files.map(file => `${dir}${sep}${file}`),
//            hooks,
//          ))
//          .then(extras => imgs.concat(...extras)),
//      ),
//    Promise.resolve([]),
//  );

// TODO: Register using global state!
export const img = (options = defaultOptions) => (handle) => {
  const opts = { ...defaultOptions, ...options };
  return [
    handle(isDirectory, (input, hooks) => openDirectories(opts, [input], hooks)),
    handle(isDirectories, (input, hooks) => openDirectories(opts, input, hooks)),
    handle(isFile, (input, hooks) => openFiles(opts, [input], hooks)),
    handle(isFiles, (input, hooks) => openFiles(opts, input, hooks)),
  ] && undefined;
};
