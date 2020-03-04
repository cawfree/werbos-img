import "@babel/polyfill";
import "@tensorflow/tfjs-node";

import { typeCheck } from "type-check";
import werbos, { threshold, oneHot, shuffle, sequential, dense, train } from "@werbos/core";
import { justOnce } from "rippleware";

import { img } from "../src";

jest.setTimeout(24* 60 * 60 * 1000);

it("should be capable of reading image files", async () => {

    // TODO: Need to understand the appropriate style for image shape
  //       try to create something homogeneous which would effectively
  //       be compatible with jimp and sharp

  //// TODO: Need to throw on invalid aspect ratio
  //const withLabels = () => [
  //  ['[*]', input => [
  //    [].concat(...input),
  //    [].concat(...input.map((e, i) => [...Array(e.length)].fill([i]))),
  //  ]],
  //];

  const app = werbos()
    .use(img({ width: 28, height: 28 }))
    //.use(
    //  [
    //    ['[Buffer]', (e) => console.log('dude, got here')],
    //  ],
    //);
    //.use(
    //  (_, { useMeta }) => console.log(JSON.stringify(useMeta())),
    //);

  await app(
    [
      //'/home/cawfree/Downloads/tmp/mnist_png/training/0',
      //'/home/cawfree/Downloads/tmp/mnist_png/training/1',
      '/home/cawfree/Downloads/tmp/mnist_png/training/1/1230.png',
    ],
  );
    
    //.sep(withLabels())
    //.mix(threshold(), oneHot())
    //.use(justOnce(shuffle()))
    //.use(
    //  sequential()
    //    .use(dense({ units: 512 }))
    //    .use(dense())
    //)
    //.use(train({ epochs: 5, batchSize: 28 }));
  
  //// https://github.com/myleott/mnist_png
  //const result = await app(
  //  [
  //    '/home/cawfree/Downloads/tmp/mnist_png/training/0',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/training/1',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/training/2',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/training/3',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/training/4',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/training/5',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/training/6',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/training/7',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/training/8',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/training/9',
  //  ],
  //);

  //const first = result[0][0];

  //var opt = {
  //  customTypes: {
  //    Buffer: {
  //      typeOf: 'Uint8Array',
  //      validate: Buffer.isBuffer,
  //    },
  //  },
  //};

  //console.log(typeCheck('Buffer', first, opt));

  //console.log(first);

  //var opt = {
  //  customTypes: {
  //    Even: {
  //      typeOf: 'Object',
  //      //typeOf: 'Number',
  //      validate: function(x) {
  //        console.log('validating',x);
  //        return x % 2 === 0;
  //      },
  //    },
  //  },
  //};

  //typeCheck('Even', first, opt);

  //console.log(
  //  typeCheck(
  //    'Buffer',
  //    first,
  //    {
  //      customTypes: {
  //        Buffer: {
  //          typeOf: 'NaN',
  //          validate: (x) => {
  //            console.log('should validate',x);
  //            return false;
  //          },//Buffer.isBuffer(x),
  //        },
  //      },
  //    },
  //  ),
  //);

  //console.log(Object.keys(first));
  //console.log(typeCheck("Array", first));
  //console.log(typeCheck("*", first));
  //console.log(typeCheck("Buffer", first));
  //console.log(typeCheck("Object", first));

  //const result2 = await app(
  //  [
  //    '/home/cawfree/Downloads/tmp/mnist_png/testing/0',
  //    '/home/cawfree/Downloads/tmp/mnist_png/testing/1',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/testing/2',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/testing/3',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/testing/4',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/testing/5',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/testing/6',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/testing/7',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/testing/8',
  //    //'/home/cawfree/Downloads/tmp/mnist_png/testing/9',
  //  ],
  //);

  //console.log(result2);

  expect(true)
    .toBeTruthy();
});
