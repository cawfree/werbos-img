import "@babel/polyfill";
import "@tensorflow/tfjs-node";

import { typeCheck } from "type-check";
import werbos, {
  threshold,
  oneHot,
  sequential,
  dense,
  train,
  conv,
  pooling,
  flatten,
} from "@werbos/core";
import { justOnce, noop } from "rippleware";

import { img } from "../src";

jest.setTimeout(24* 60 * 60 * 1000);

it("should be capable of reading image files", async () => {

  // TODO: Need to understand the appropriate style for image shape
  //       try to create something homogeneous which would effectively
  //       be compatible with jimp and sharp.

  const withLabels = () => [
    ['[*]', input => [
      [].concat(...input),
      [].concat(...input.map((e, i) => [...Array(e.length)].fill([i]))),
    ]],
  ];

  const app = werbos()
    .use(img({ width: 28, height: 28 }))
    .sep(withLabels())
    .mix(threshold(), oneHot())
    .use(
      sequential()
        .use(conv({ filters: 32, kernelSize: 3 }))
        .use(pooling())
        .use(conv({ filters: 64, kernelSize: 3 }))
        .use(pooling())
        .use(conv({ filters: 64, kernelSize: 3 }))
        .use(flatten())
        .use(dense({ units: 64 }))
        .use(dense()),
    )
    .use(train({ epochs: 3, batchSize: 64 }));

  await app(
    [
      '/home/cawfree/Downloads/tmp/mnist_png/training/0',
      '/home/cawfree/Downloads/tmp/mnist_png/training/1',
      '/home/cawfree/Downloads/tmp/mnist_png/training/2',
      '/home/cawfree/Downloads/tmp/mnist_png/training/3',
      '/home/cawfree/Downloads/tmp/mnist_png/training/4',
      '/home/cawfree/Downloads/tmp/mnist_png/training/5',
      '/home/cawfree/Downloads/tmp/mnist_png/training/6',
      '/home/cawfree/Downloads/tmp/mnist_png/training/7',
      '/home/cawfree/Downloads/tmp/mnist_png/training/8',
      '/home/cawfree/Downloads/tmp/mnist_png/training/9',
    ],
  );

  const ans = await app(
    [
      '/home/cawfree/Downloads/tmp/mnist_png/testing/0',
      '/home/cawfree/Downloads/tmp/mnist_png/testing/1',
      '/home/cawfree/Downloads/tmp/mnist_png/testing/2',
      '/home/cawfree/Downloads/tmp/mnist_png/testing/3',
      '/home/cawfree/Downloads/tmp/mnist_png/testing/4',
      '/home/cawfree/Downloads/tmp/mnist_png/testing/5',
      '/home/cawfree/Downloads/tmp/mnist_png/testing/6',
      '/home/cawfree/Downloads/tmp/mnist_png/testing/7',
      '/home/cawfree/Downloads/tmp/mnist_png/testing/8',
      '/home/cawfree/Downloads/tmp/mnist_png/testing/9',
    ]
  );

  expect(true)
    .toBeTruthy();
});
