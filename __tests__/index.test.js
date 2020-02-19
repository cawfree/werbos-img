import "@babel/polyfill";

import compose from "rippleware";
import { img } from "../src";

it("should be capable of reading image files", async () => {

  const app = compose()
    .use(img());

  const result = await app('/home/cawfree/Downloads/unnamed.jpg');
  const result2 = await app(['/home/cawfree/Downloads/unnamed.jpg']);

  console.log(result, result2);

  expect(app())
    .rejects
    .toBeTruthy();
  
  expect(true)
    .toBeTruthy();
});
