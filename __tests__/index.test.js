import "@babel/polyfill";
import "@tensorflow/tfjs-node";

import { typeCheck } from "type-check";
import werbos, { threshold, oneHot, shuffle, sequential, dense, train, conv2d } from "@werbos/core";
import { justOnce, noop } from "rippleware";

import { img } from "../src";

jest.setTimeout(24* 60 * 60 * 1000);

it("should be capable of reading image files", async () => {

  // TODO: Need to understand the appropriate style for image shape
  //       try to create something homogeneous which would effectively
  //       be compatible with jimp and sharp.

  // TODO: Needs proper evaluation of path data.
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
        .use(conv2d()),
    );

  const res = await app(
    [
      '/home/cawfree/Downloads/tmp/mnist_png/training/0',
      //'/home/cawfree/Downloads/tmp/mnist_png/training/1',
    ],
  );

  console.log(res);

  //console.log(res[0][0].shape);

  expect(true)
    .toBeTruthy();
});
