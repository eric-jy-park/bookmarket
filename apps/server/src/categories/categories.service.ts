import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from 'src/users/entities/user.entity';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(id: User['id'], createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save({
      ...createCategoryDto,
      user: { id },
    });
  }

  async findAll(id: User['id']) {
    return this.categoryRepository.find({
      where: {
        user: {
          id,
        },
      },
    });
  }

  async findOne(id: Category['id']) {
    return this.categoryRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async findOneByName(name: Category['name'], userId: User['id']) {
    return this.categoryRepository.findOneOrFail({
      where: { name, user: { id: userId } },
    });
  }

  async update(
    userId: User['id'],
    id: Category['id'],
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.findOne(id);

    if (category.user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.categoryRepository.update(id, {
      ...updateCategoryDto,
    });
  }

  async remove(userId: User['id'], id: Category['id']) {
    const category = await this.findOne(id);

    if (category.user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.categoryRepository.delete(id);
  }
}
