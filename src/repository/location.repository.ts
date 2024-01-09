import AppDataSource from '../config/dataSource';
import Location from '../entity/location.entity';

const LocationRepository = AppDataSource.getRepository(Location).extend({});

export default LocationRepository;
