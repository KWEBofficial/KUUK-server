import AppDataSource from '../config/dataSource';
import Menu from '../entity/menu.entity';

const MenuRepository = AppDataSource.getRepository(Menu).extend({});

export default MenuRepository;
