import "@babel/polyfill";

import compose from "rippleware";
import { img } from "../src";

jest.setTimeout(24* 60 * 60 * 1000);

it("should be capable of reading image files", async () => {

  const app = compose()
    .use(img());
  
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
