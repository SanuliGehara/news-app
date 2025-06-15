import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}
