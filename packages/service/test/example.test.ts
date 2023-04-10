import { assert } from "chai";
import { DefaultController } from "../src/controller/DefaultController";

it("example test script for modification", async () => {
  assert.equal(1, 1);
});

it("/ index returns a human readable string with the name of the service in it", async () => {
  const controller = new DefaultController();
  const result: string = await controller.get();

  assert.isTrue(result.includes("@amazing-race/service"));
});
