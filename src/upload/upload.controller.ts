import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseDto } from '../shared/dto/data-response.dto';
import { UploadService } from './upload.service';
import { Public } from '@/shared/decorators/public.decorator';

class FileUploadDto {
  file: string;
}

@Controller('upload')
@ApiTags('upload')
@Public()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({
    summary: 'Upload an image file',
    description:
      'Upload a single image file (JPEG, PNG, or WEBP). Maximum file size: 3MB',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',           
          format: 'binary',
          description: 'Image file to upload (JPEG, PNG, or WEBP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            url: { type: 'string', example: 'https://example.com/image.jpg' },
          },
        },
        message: { type: 'string', example: 'Image uploaded successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or file size too large',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'File size must not exceed 3MB' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 3 }),
          new FileTypeValidator({ fileType: /(jpe?g|png|webp)$/i }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<DataResponseDto> {
    return this.uploadService.uploadImage(file);
  }

  @Post('file')
  @ApiOperation({
    summary: 'Upload any file type',
    description: 'Upload a single file of any supported format',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              example: 'https://example.com/document.pdf',
            },
          },
        },
        message: { type: 'string', example: 'File uploaded successfully' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DataResponseDto> {
    return this.uploadService.fileUpload(file);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete a file',
    description: 'Delete a file from S3 storage using its URL',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['url'],
      properties: {
        url: {
          type: 'string',
          example: 'https://example.com/file.jpg',
          description: 'URL of the file to delete',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'File not found' },
      },
    },
  })
  async deleteFile(@Body('url') url: string): Promise<any> {
    return this.uploadService.deleteFromS3(url);
  }
}
