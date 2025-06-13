import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto, userId: number) {
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
        authorId: userId,
        publishedAt: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.article.findMany({
      include: { author: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto, userId: number, userRole: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    if (article.authorId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You do not have permission to update this article');
    }
    if (!updateArticleDto || Object.keys(updateArticleDto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    if (article.authorId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You do not have permission to delete this article');
    }
    return this.prisma.article.delete({ where: { id } });
  }

  async incrementLike(id: number, userId: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    const alreadyLiked = await this.prisma.likedArticle.findUnique({
      where: { userId_articleId: { userId, articleId: id } },
    });
    if (alreadyLiked) {
      throw new BadRequestException('You have already liked this article');
    }
    await this.prisma.likedArticle.create({
      data: { userId, articleId: id },
    });
    return this.prisma.article.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
  }

  async incrementView(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return this.prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }
}

