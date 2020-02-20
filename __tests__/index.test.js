import "@babel/polyfill";
import "@tensorflow/tfjs-node";

import werbos from "@werbos/core";
import { print, noop } from "rippleware";

import { img } from "../src";

jest.setTimeout(24* 60 * 60 * 1000);

it("should be capable of reading image files", async () => {

  // TODO: Need to understand the appropriate style for image shape
  //       try to create something homogeneous which would effectively
  //       be compatible with jimp and sharp

  // TODO: Need to throw on invalid aspect ratio
  const applyLabels = () => h => h('[*]', input => [
    [].concat(...input),
    [].concat(...[].concat(...input.map((e, i) => [...Array(e.length)].fill(i)))),
  ]);
    
  const app = werbos()
    .use(img())
    .use(applyLabels())
    .use(noop(), print());
  
  const result = await app(
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

  expect(true)
    .toBeTruthy();
});
