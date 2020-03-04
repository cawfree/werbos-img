import sharp from "sharp";
import { typeCheck } from "type-check";
import { existsSync, lstatSync, readdirSync } from "fs";
import { sep } from "path";
import { Meta } from "@werbos/core";

const imageInfoShape = '{channels:Number,width:Number,height:Number}';

const defaultOptions = Object
  .freeze(
    {
      width: null,
      height: null,
    },
  );

const throwOnImageInfoMismatch = (nextInfo, lastInfo) => {
  const { channels: nextChannels } = nextInfo;
  const { channels: lastChannels } = lastInfo;
  if (nextChannels !== lastChannels) {
    throw new Error(`The number of input channels for image data must be homogeneous.`);
  }
};

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

const openFiles = (opts, input) => {
  const { width, height } = opts;
  if (!Number.isInteger(width) || width <= 0) {
    return Promise.reject(new Error(`Expected positive integer width, but encountered ${width}.`));
  } else if (!Number.isInteger(height) || height <= 0) {
    return Promise.reject(new Error(`Expected positive integer height, but encountered ${height}.`));
  }
  // TODO: It would be nicer to allow external callers to take advantage of sharp
  //       (or some generic sharp/jimp interface) to have finer control over these
  //       processes. You know, depending on the call context, maybe this looks
  //       like a composable instance. Maybe not.
  return input
    .reduce(
      (p, path, i) => p
        .then(
          ([images, lastInfo]) => Promise
            .resolve(
              sharp(path)
                .resize(width, height)
                .flatten()
                .raw(),
            )
            .then(toBuffer)
            .then(
              ([nextBuffer, nextInfo]) => {
                // XXX: Basically enforces the same channel.
                (i > 0) && throwOnImageInfoMismatch(
                  nextInfo,
                  lastInfo,
                );
                return [
                  isNaN(images.push(nextBuffer)) || images,
                  nextInfo,
                ];
              },
            ),
        ),
      Promise.resolve([[], undefined]),
    )
    .then(
      // XXX: At this point, we can guarantee the same number of channels,
      //      width and height for all processed image data. We'll need to
      //      apply additional checks for anything more complicated than this.
      ([images, { channels, width, height }]) => [
        images,
        {
          channels,
          width,
          height,
        },
      ],
    );
};

const openDirectories = (opts, inputs) => Promise
  .all(
    inputs.map(
      dir => Promise.resolve(readdirSync(dir))
        .then(files => openFiles(
          opts,
          files.map(file => `${dir}${sep}${file}`),
        )),
    ),
  );

const persistChannelMeta = (useMeta, width, height, channels) => {
  if (!Number.isInteger(width) || width <= 0) {
    throw new Error(`Expected positive integer width, encountered ${width}.`);
  } else if (!Number.isInteger(height) || height <= 0) {
    throw new Error(`Expected positive integer height, encountered ${height}.`);
  } else if (!Number.isInteger(channels) || channels <= 0) {
    throw new Error(`Expected positive integer channels, encountered ${channels}.`);
  }
  return useMeta(
    {
      ...useMeta(),
      [Meta.Transform]: {
        width,
        height,
        channels,
      },
    },
  );
};

// XXX: Returns the appropriate result data alongside
//      the required meta for buffer data.
const forwardResults = (results, { useMeta }) => {
  if (typeCheck(`([Uint8Array],${imageInfoShape})`, results)) {
    const [bufs, { width, height, channels }] = results;
    return persistChannelMeta(useMeta, width, height, channels) || bufs;
  } else if (`[([Uint8Array], ${imageInfoShape})]`, results) {
    const { length } = results;
    for (let i = 1; i < length; i += 1) {
      throwOnImageInfoMismatch(results[i], results[i - 1]);
    }
    // XXX: At this stage, we basically know all of these quantities are the same.
    const [[_, { width, height, channels }]] = results;
    const bufs = results
      .map(([buf]) => buf);
    return persistChannelMeta(useMeta, width, height, channels) || bufs;
  }
  throw new Error(`💥 It looks you might be comparing collections of images against a singular image source, and it is not possible to create tensors based on such a combination. Alternatively, you might be using larger image data than what can be expressed using unsigned bytes, for example, high definition image data. If you believe this may be a bug, please file an issue at https://github.com/cawfree/werbos-img/issues.`);
};
  
// TODO: Register using global state!
export const img = (options = defaultOptions) => {
  const opts = { ...defaultOptions, ...options };
  return [
    [isDirectory, (input, hooks) => openDirectories(opts, [input])
      .then(results => forwardResults(results, hooks))],
    [isDirectories, (input, hooks) => openDirectories(opts, input)
      .then(results => forwardResults(results, hooks))],
    [isFile, (input, hooks) => openFiles(opts, [input])
      .then(results => forwardResults(results, hooks))],
    [isFiles, (input, hooks) => openFiles(opts, input)
      .then(results => forwardResults(results, hooks))],
  ];
};
