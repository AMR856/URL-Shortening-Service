import { Test, TestingModule } from "@nestjs/testing";
import { UrlService } from "../services/url.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("UrlService", () => {
  let service: UrlService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      urls: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  describe("createUrl", () => {
    it("should create a shortened URL", async () => {
      const createUrlDto = {
        url: "https://example.com/very/long/url",
      };

      prismaMock.urls.findUnique.mockResolvedValue(null);
      prismaMock.urls.create.mockResolvedValue({
        id: 1,
        url: "https://example.com/very/long/url",
        shortCode: "abc123",
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.createUrl(createUrlDto);

      expect(result).toHaveProperty("shortCode");
      expect(result.url).toBe("https://example.com/very/long/url");
    });

    it("should throw BadRequestException for invalid URL", async () => {
      const createUrlDto = {
        url: "invalid-url",
      };

      await expect(service.createUrl(createUrlDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getUrl", () => {
    it("should throw BadRequestException for missing short code", async () => {
      await expect(service.getUrl("" as unknown as string)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should get URL and increment clicks", async () => {
      prismaMock.urls.findUnique.mockResolvedValue({
        id: 1,
        url: "https://example.com",
        shortCode: "abc123",
        clicks: 5,
      });

      prismaMock.urls.update.mockResolvedValue({
        id: 1,
        url: "https://example.com",
        shortCode: "abc123",
        clicks: 6,
      });

      const result = await service.getUrl("abc123");

      expect(result.clicks).toBe(6);
      expect(prismaMock.urls.update).toHaveBeenCalledWith({
        where: { shortCode: "abc123" },
        data: { clicks: { increment: 1 } },
      });
    });

    it("should throw NotFoundException if URL not found", async () => {
      prismaMock.urls.findUnique.mockResolvedValue(null);

      await expect(service.getUrl("nonexistent")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("updateUrl", () => {
    it("should update an existing URL", async () => {
      prismaMock.urls.findUnique.mockResolvedValue({
        id: 1,
        shortCode: "abc123",
        url: "https://old.example.com",
      });

      const updatedAt = new Date();
      prismaMock.urls.update.mockResolvedValue({
        id: 1,
        shortCode: "abc123",
        url: "https://new.example.com",
        clicks: 2,
        updatedAt,
      });

      const result = await service.updateUrl("abc123", {
        url: "https://new.example.com",
      });

      expect(result).toEqual({
        id: 1,
        shortCode: "abc123",
        url: "https://new.example.com",
        clicks: 2,
        updatedAt,
      });
      expect(prismaMock.urls.update).toHaveBeenCalledWith({
        where: { shortCode: "abc123" },
        data: {
          url: "https://new.example.com",
          updatedAt: expect.any(Date),
        },
      });
    });

    it("should throw BadRequestException for missing new URL", async () => {
      await expect(
        service.updateUrl("abc123", { url: "" as unknown as string }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException for invalid new URL format", async () => {
      await expect(
        service.updateUrl("abc123", { url: "invalid-url" }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException for missing short code", async () => {
      await expect(
        service.updateUrl("" as unknown as string, {
          url: "https://new.example.com",
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw NotFoundException when URL to update is missing", async () => {
      prismaMock.urls.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUrl("unknown", { url: "https://new.example.com" }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("deleteUrl", () => {
    it("should throw BadRequestException for missing short code", async () => {
      await expect(service.deleteUrl("" as unknown as string)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should delete a URL", async () => {
      prismaMock.urls.findUnique.mockResolvedValue({
        id: 1,
        shortCode: "abc123",
      });

      prismaMock.urls.delete.mockResolvedValue({});

      const result = await service.deleteUrl("abc123");

      expect(result.message).toBe("URL deleted successfully");
      expect(prismaMock.urls.delete).toHaveBeenCalledWith({
        where: { shortCode: "abc123" },
      });
    });

    it("should throw NotFoundException if URL not found", async () => {
      prismaMock.urls.findUnique.mockResolvedValue(null);

      await expect(service.deleteUrl("nonexistent")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("getStats", () => {
    it("should return URL stats", async () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z");
      const updatedAt = new Date("2026-01-02T00:00:00.000Z");

      prismaMock.urls.findUnique.mockResolvedValue({
        id: 1,
        url: "https://example.com",
        shortCode: "abc123",
        clicks: 7,
        createdAt,
        updatedAt,
        expiresAt: null,
      });

      const result = await service.getStats("abc123");

      expect(result).toEqual({
        id: 1,
        url: "https://example.com",
        shortCode: "abc123",
        clicks: 7,
        createdAt,
        updatedAt,
        expiresAt: null,
      });
    });

    it("should throw BadRequestException for missing short code", async () => {
      await expect(service.getStats("" as unknown as string)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should throw NotFoundException when stats are missing", async () => {
      prismaMock.urls.findUnique.mockResolvedValue(null);

      await expect(service.getStats("unknown")).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
