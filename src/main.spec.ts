import { ValidationPipe } from "@nestjs/common";

const createDocumentMock = jest.fn();
const setupMock = jest.fn();
const createAppMock = jest.fn();

const useGlobalPipesMock = jest.fn();
const listenMock = jest.fn().mockImplementation(async (_port, callback) => {
  if (callback) {
    callback();
  }
});

jest.mock("@nestjs/core", () => ({
  NestFactory: {
    create: (...args: unknown[]) => createAppMock(...args),
  },
}));

jest.mock("@nestjs/swagger", () => {
  const actual = jest.requireActual("@nestjs/swagger");

  class DocumentBuilderMock {
    setTitle() {
      return this;
    }
    setDescription() {
      return this;
    }
    setVersion() {
      return this;
    }
    addBearerAuth() {
      return this;
    }
    addServer() {
      return this;
    }
    addTag() {
      return this;
    }
    build() {
      return { openapi: "3.0.0" };
    }
  }

  return {
    ...actual,
    SwaggerModule: {
      createDocument: (...args: unknown[]) => createDocumentMock(...args),
      setup: (...args: unknown[]) => setupMock(...args),
    },
    DocumentBuilder: DocumentBuilderMock,
  };
});

describe("main bootstrap", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createAppMock.mockResolvedValue({
      useGlobalPipes: useGlobalPipesMock,
      listen: listenMock,
    });

    createDocumentMock.mockReturnValue({});
  });

  it("should initialize app with validation and swagger", async () => {
    process.env.PORT = "3001";
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await import("./main");

    expect(createAppMock).toHaveBeenCalledTimes(1);
    expect(useGlobalPipesMock).toHaveBeenCalledTimes(1);
    expect(useGlobalPipesMock.mock.calls[0][0]).toBeInstanceOf(ValidationPipe);
    expect(createDocumentMock).toHaveBeenCalledTimes(1);
    expect(setupMock).toHaveBeenCalledWith(
      "docs",
      expect.any(Object),
      expect.any(Object),
    );
    expect(listenMock).toHaveBeenCalledWith("3001", expect.any(Function));

    consoleSpy.mockRestore();
    delete process.env.PORT;
  });
});
