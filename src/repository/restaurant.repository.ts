import AppDataSource from '../config/dataSource';
import Restaurant from '../entity/restaurant.entity';

const RestaurantRepository = AppDataSource.getRepository(Restaurant).extend({});

export default RestaurantRepository;
