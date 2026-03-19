import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { jwtConfig, jwtRefreshConfig } from '../../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      message: 'User registered successfully.',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
    );

    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { secret: jwtRefreshConfig.secret, expiresIn: jwtRefreshConfig.signOptions.expiresIn },
    );

    await this.prisma.refresh_tokens.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    const storedToken = await this.prisma.refresh_tokens.findUnique({
      where: { token },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtRefreshConfig.secret,
      });

      const newAccessToken = this.jwtService.sign(
        { userId: payload.userId },
      );

      return {
        accessToken: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
