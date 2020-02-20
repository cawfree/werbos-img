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
                .raw()
                .toBuffer(),
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
