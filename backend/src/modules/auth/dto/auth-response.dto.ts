import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({
    description: "Success message",
  })
  message!: string;

  @ApiProperty({
    description: "JWT access token",
  })
  accessToken!: string;

  @ApiProperty({
    description: "JWT refresh token",
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    description: "User data",
    required: false,
  })
  user?: {
    id: number;
    email: string;
  };
}
