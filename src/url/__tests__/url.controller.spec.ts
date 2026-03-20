import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from '../controllers/url.controller';
import { UrlService } from '../services/url.service';

describe('UrlController', () => {
  let controller: UrlController;
  let urlServiceMock: {
    createUrl: jest.Mock;
    getUrl: jest.Mock;
    getStats: jest.Mock;
    updateUrl: jest.Mock;
    deleteUrl: jest.Mock;
  };

  beforeEach(async () => {
    urlServiceMock = {
      createUrl: jest.fn(),
      getUrl: jest.fn(),
      getStats: jest.fn(),
      updateUrl: jest.fn(),
      deleteUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: urlServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should create a shortened URL via service', async () => {
    const dto = { url: 'https://example.com' };
    const serviceResponse = {
      id: 1,
      url: dto.url,
      shortCode: 'abc123',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    urlServiceMock.createUrl.mockResolvedValue(serviceResponse);

    const result = await controller.createUrl(dto);

    expect(urlServiceMock.createUrl).toHaveBeenCalledWith(dto);
    expect(result).toEqual(serviceResponse);
  });

  it('should get URL by shortCode via service', async () => {
    const serviceResponse = {
      id: 1,
      url: 'https://example.com',
      shortCode: 'abc123',
      clicks: 3,
    };

    urlServiceMock.getUrl.mockResolvedValue(serviceResponse);

    const result = await controller.getUrl('abc123');

    expect(urlServiceMock.getUrl).toHaveBeenCalledWith('abc123');
    expect(result).toEqual(serviceResponse);
  });

  it('should get URL stats by shortCode via service', async () => {
    const serviceResponse = {
      id: 1,
      url: 'https://example.com',
      shortCode: 'abc123',
      clicks: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: null,
    };

    urlServiceMock.getStats.mockResolvedValue(serviceResponse);

    const result = await controller.getStats('abc123');

    expect(urlServiceMock.getStats).toHaveBeenCalledWith('abc123');
    expect(result).toEqual(serviceResponse);
  });

  it('should update URL by shortCode via service', async () => {
    const dto = { url: 'https://updated.example.com' };
    const serviceResponse = {
      id: 1,
      url: dto.url,
      shortCode: 'abc123',
      clicks: 4,
      updatedAt: new Date(),
    };

    urlServiceMock.updateUrl.mockResolvedValue(serviceResponse);

    const result = await controller.updateUrl('abc123', dto);

    expect(urlServiceMock.updateUrl).toHaveBeenCalledWith('abc123', dto);
    expect(result).toEqual(serviceResponse);
  });

  it('should delete URL by shortCode via service', async () => {
    const serviceResponse = { message: 'URL deleted successfully' };

    urlServiceMock.deleteUrl.mockResolvedValue(serviceResponse);

    const result = await controller.deleteUrl('abc123');

    expect(urlServiceMock.deleteUrl).toHaveBeenCalledWith('abc123');
    expect(result).toEqual(serviceResponse);
  });
});