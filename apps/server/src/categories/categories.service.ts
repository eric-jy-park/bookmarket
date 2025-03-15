import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(userId: User['id'], createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
        user: { id: userId },
      },
    });

    if (existingCategory) {
      throw new ConflictException(`Category with name ${createCategoryDto.name} already exists`);
    }

    return this.categoryRepository.save({
      ...createCategoryDto,
      user: { id: userId },
    });
  }

  async findAll(userId: User['id']) {
    return this.categoryRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async findOne(categoryId: Category['id']) {
    return this.categoryRepository.findOneOrFail({
      where: {
        id: categoryId,
      },
    });
  }

  async findOneByName(categoryName: Category['name'], userId: User['id']) {
    return this.categoryRepository.findOneOrFail({
      where: { name: categoryName, user: { id: userId } },
    });
  }

  async update(userId: User['id'], categoryId: Category['id'], updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(categoryId);

    if (category.user.id !== userId) {
      throw new ForbiddenException("This category doesn't belong to this user");
    }

    return this.categoryRepository.update(categoryId, {
      ...updateCategoryDto,
    });
  }

  async remove(userId: User['id'], categoryId: Category['id']) {
    const category = await this.findOne(categoryId);

    if (category.user.id !== userId) {
      throw new ForbiddenException("This category doesn't belong to this user");
    }

    return this.categoryRepository.delete(categoryId);
  }
}
