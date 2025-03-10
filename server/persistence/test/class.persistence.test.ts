import { describe, test, beforeAll, afterAll, expect } from "vitest";
import { PrismaSingleton } from "../prismaSingleton";
import dummy_data from "../../util/db-scripts/data.json";

describe("class persistence test", () => {
  beforeAll(async () => {
    await PrismaSingleton.instance.class.createMany({
      data: dummy_data.classes.slice(0, 3),
    });
  });

  afterAll(async () => {
    await PrismaSingleton.instance.class.deleteMany();
    await PrismaSingleton.instance.$disconnect();
  });

  describe("get class by id", () => {
    test("request with existing id responds correctly", async () => {
      const id: string = "class-1";
      const req = PrismaSingleton.instance.class.findUnique({
        where: { id },
      });
      await expect(req).resolves.toStrictEqual({ id: id });
    });

    test("request with unexisting id responds with null", async () => {
      const id: string = "class-0";
      const req = PrismaSingleton.instance.class.findUnique({
        where: { id },
      });
      await expect(req).resolves.toBeNull();
    });
  });
});
