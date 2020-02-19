import "@babel/polyfill";

import compose from "rippleware";
import { img } from "../src";

it("should do something", async () => {
  const app = compose()
    .use(img());

  console.log(await app());
  
  expect(true)
    .toBeTruthy();
});
