import { ClassDomain } from "../class.domain";
import { describe, expect, test, vi } from "vitest";

// ClassPersistence mock
const mockClassPeristence = {
  getClasses: vi.fn(),
  getClassById: vi.fn(),
  createClass: vi.fn(),
  updateClass: vi.fn(),
  deleteClass: vi.fn(),
};
vi.mock("../../persistence/class.persistence", () => {
  return {
    ClassPersistence: vi.fn().mockImplementation(() => {
      return mockClassPeristence;
    }),
  };
});

describe("class domain test", () => {
  /*
  const classDomain: ClassDomain = new ClassDomain();
  test("get class by id", async () => {
    const id: string = "b";
    const expected = { id: "b", name: "a" };
    mockClassPeristence.getClassById.mockResolvedValue(expected);
    expect(await classDomain.getClassById(id)).toStrictEqual(expected);
  });
  */
});
