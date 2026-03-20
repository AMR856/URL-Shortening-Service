import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: {
    register: jest.Mock;
    login: jest.Mock;
    refreshToken: jest.Mock;
  };

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register a user via service', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    const serviceResponse = {
      message: 'User registered successfully.',
      user: { id: 1, email: 'test@example.com' },
    };

    authServiceMock.register.mockResolvedValue(serviceResponse);

    const result = await controller.register(dto);

    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual(serviceResponse);
  });

  it('should login a user via service', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    const serviceResponse = {
      message: 'Login successful',
      accessToken: 'access',
      refreshToken: 'refresh',
      user: { id: 1, email: 'test@example.com' },
    };

    authServiceMock.login.mockResolvedValue(serviceResponse);

    const result = await controller.login(dto);

    expect(authServiceMock.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual(serviceResponse);
  });

  it('should refresh token via service', async () => {
    const dto = { token: 'refresh-token-value' };
    const serviceResponse = { accessToken: 'new-access-token' };

    authServiceMock.refreshToken.mockResolvedValue(serviceResponse);

    const result = await controller.refreshToken(dto);

    expect(authServiceMock.refreshToken).toHaveBeenCalledWith(dto.token);
    expect(result).toEqual(serviceResponse);
  });
});