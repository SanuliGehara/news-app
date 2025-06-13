import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ValidationPipe, UsePipes } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any) {
    return this.articleService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.articleService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createArticleDto: CreateArticleDto, @Request() req: any) {
    return this.articleService.create(createArticleDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @Request() req: any) {
    return this.articleService.update(Number(id), updateArticleDto, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.articleService.remove(Number(id), req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/like')
  async like(@Param('id') id: string, @Request() req: any) {
    return this.articleService.incrementLike(Number(id), req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/view')
  async view(@Param('id') id: string) {
    return this.articleService.incrementView(Number(id));
  }
}
