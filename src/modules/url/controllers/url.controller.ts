import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UrlService } from "../services/url.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateUrlDto } from "../dto/create-url.dto";
import { UpdateUrlDto } from "../dto/update-url.dto";
import { UrlResponseDto } from "../dto/url-response.dto";

@ApiTags("URLs")
@Controller("shorten")
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a new shortened URL" })
  @ApiResponse({
    status: 201,
    description: "URL shortened successfully",
    type: UrlResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid URL format" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createUrl(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.createUrl(createUrlDto);
  }

  @Get(":shortCode")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Fetch a shortened URL and increment click count" })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved the original URL",
    type: UrlResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "Short URL not found" })
  async getUrl(@Param("shortCode") shortCode: string) {
    return this.urlService.getUrl(shortCode);
  }

  @Get(":shortCode/stats")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get statistics for a shortened URL" })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
    type: UrlResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "Short URL not found" })
  async getStats(@Param("shortCode") shortCode: string) {
    return this.urlService.getStats(shortCode);
  }

  @Put(":shortCode")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update a shortened URL" })
  @ApiResponse({
    status: 200,
    description: "URL updated successfully",
    type: UrlResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Short URL not found" })
  async updateUrl(
    @Param("shortCode") shortCode: string,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    return this.urlService.updateUrl(shortCode, updateUrlDto);
  }

  @Delete(":shortCode")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Delete a shortened URL" })
  @ApiResponse({ status: 204, description: "URL deleted successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Short URL not found" })
  async deleteUrl(@Param("shortCode") shortCode: string) {
    return this.urlService.deleteUrl(shortCode);
  }
}
