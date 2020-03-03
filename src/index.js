import sharp from "sharp";
import { typeCheck } from "type-check";
import { existsSync, lstatSync, readdirSync } from "fs";
import { sep } from "path";

const defaultOptions = Object
  .freeze(
    {
      width: null,
      height: null,
    },
  );

const isDirectory = e => typeCheck('String', e) && lstatSync(e).isDirectory();
const isDirectories = e => Array.isArray(e) && e.length > 0 && e.reduce((r, f) => r && isDirectory(f), true);

const isFile = e => typeCheck('String', e) && existsSync(e);

const isFiles = e => Array.isArray(e) && e.length > 0 && e.reduce((r, f) => (r && isFile(f)), true);

const toBuffer = img => new Promise(
  (resolve, reject) => img
    .toBuffer(
      (err, buf, info) => {
        if (err) {
          return reject(err);
        }
        return resolve([buf, info]);
      },
    ),
);

const openFiles = (opts, input, hooks) => {
  const { useMeta } = hooks;
  const { width, height } = opts;
  if (!Number.isInteger(width) || width <= 0) {
    return Promise.reject(new Error(`Expected positive integer width, but encountered ${width}.`));
  } else if (!Number.isInteger(height) || height <= 0) {
    return Promise.reject(new Error(`Expected positive integer height, but encountered ${height}.`));
  }
  return input
    .reduce(
      (p, path, i) => p
        .then(
          (images) => Promise
            .resolve(
              sharp(path)
                .resize(width, height)
                .flatten()
                .raw(),
            )
            .then(toBuffer)
            .then(([buf]) => buf),
            // implicitly converts to data; let's use  the buffer
            //.then(([buf]) => (images.push([...buf]) && undefined) || images)
            //// TODO: This channel information is potentially incorrect dependent upon the input data.
            //.then(data => useMeta({ ...useMeta(), [Meta.Transform]: { channels: 3 } }) || data),
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
export const img = (options = defaultOptions) => {
  const opts = { ...defaultOptions, ...options };
  return [
    [isDirectory, (input, hooks) => openDirectories(opts, [input], hooks)],
    [isDirectories, (input, hooks) => openDirectories(opts, input, hooks)],
    [isFile, (input, hooks) => openFiles(opts, [input], hooks)],
    [isFiles, (input, hooks) => openFiles(opts, input, hooks)],
  ];
};
