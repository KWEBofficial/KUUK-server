import AppDataSource from '../config/dataSource';
import Category from '../entity/category.entity';

const CategoryRepository = AppDataSource.getRepository(Category).extend({});

export default CategoryRepository;
