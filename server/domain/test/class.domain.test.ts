import { ClassDomain } from "../class.domain";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ClassCreateParams } from "../../util/types/class.types";
import { ZodError } from "zod";

// Persistence mock
const { mockClassPeristence } = vi.hoisted(() => {
  return {
    mockClassPeristence: {
      getClasses: vi.fn(),
      getClassById: vi.fn(),
      createClass: vi.fn(),
      updateClass: vi.fn(),
      deleteClass: vi.fn(),
    },
  };
});
vi.mock("../../persistence/class.persistence", () => {
  return {
    ClassPersistence: vi.fn().mockImplementation(() => {
      return mockClassPeristence;
    }),
  };
});

// Mock implementations and other global test variables
const classDomain: ClassDomain = new ClassDomain();

const mockCreateClass = (body: any) => {
  return { id: "id", name: body.name };
};

// Tests
describe("class domain test", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("create class", () => {
    beforeEach(() => {
      mockClassPeristence.createClass.mockImplementation(mockCreateClass);
    });
    test("responds as expected on valid input", async () => {
      const body: any = { name: "name" };
      expect(await classDomain.createClass(body)).toStrictEqual(
        mockCreateClass(body),
      );
    });
    test("throws error on invalid input", () => {
      const body: any = { name: "" };
      expect(() => classDomain.createClass(body)).rejects.toThrow(ZodError);
    });
  });
});
