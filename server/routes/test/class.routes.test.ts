import request from "supertest";
import { describe, beforeEach, test, vi } from "vitest";
import { app } from "../../app";

// Domain mock
const { mockClassDomain } = vi.hoisted(() => {
  return {
    mockClassDomain: {
      getClasses: vi.fn(),
      getClassById: vi.fn(),
      createClass: vi.fn(),
      updateClass: vi.fn(),
      deleteClass: vi.fn(),
    },
  };
});
vi.mock("../../domain/class.domain", () => {
  return {
    ClassDomain: vi.fn().mockImplementation(() => {
      return mockClassDomain;
    }),
  };
});

// Global test variables
const route: string = "/class";

// Tests
describe("class routes test", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("GET /class/id", () => {
    const id: string = "id";
    mockClassDomain.getClassById.mockResolvedValue({ id: id });
    test("responds on id", () => {
      request(app)
        .get(`${route}/${id}`)
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /class", () => {
    const body = { name: "name" };
    mockClassDomain.getClassById.mockResolvedValue({ id: "id", name: "name" });
    test("responds on payload", () => {
      request(app)
        .post(`${route}`)
        .send(body)
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
});
