import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Category ID for the blog',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    description: 'Title of the blog',
    example: 'Getting Started with NestJS',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    description: 'Subtitle of the blog',
    example: 'A comprehensive guide to building scalable applications',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subTitle?: string;

  @ApiProperty({
    description: 'Description of the blog',
    example: 'This blog post covers the fundamentals of NestJS framework...',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Image URL for the blog',
    example: 'https://example.com/blog-image.jpg',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image?: string;

  @ApiProperty({
    description: 'Tags for the blog',
    example: 'nestjs,typescript,backend',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  tags?: string;

  @ApiProperty({
    description: 'External link for the blog',
    example: 'https://example.com/blog-post',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  link?: string;

  @ApiProperty({
    description: 'Order/position of the blog',
    example: 1.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the blog is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
