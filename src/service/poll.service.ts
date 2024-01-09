import Poll from '../entity/poll.entity';
import CreatePollInput from '../type/poll/create.input';
import PollRepository from '../repository/poll.repository';
import { InternalServerError } from '../util/customErrors';
import Restaurant from '../entity/restaurant.entity';
import RestaurantRepository from '../repository/restaurant.repository';
import { In } from 'typeorm';
import Candidate from '../entity/candidate.entity';
import CandidateRepository from '../repository/candidate.repository';
import LocationRepository from '../repository/location.repository';
import CategoryRepository from '../repository/category.repository';

export default class PollService {
  static async getPollById(id: number): Promise<Poll | null> {
    try {
      return await PollRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerError('투표 정보를 불러오는데 실패했습니다.');
    }
  }

  static async getPollsByPollName(pollName: string): Promise<Poll[]> {
    try {
      return await PollRepository.find({ where: { pollName } });
    } catch (error) {
      throw new InternalServerError('투표 정보를 불러오는데 실패했습니다.');
    }
  }

  static async createPoll(createPollInput: CreatePollInput): Promise<Poll> {
    try {
      const userEntity = await PollRepository.create(createPollInput);
      return await PollRepository.save(userEntity);
    } catch (error) {
      throw new InternalServerError('투표 정보를 저장하는데 실패했습니다.');
    }
  }

  static async getRestaurantsByFiltering(
    locations: string[] | string,
    categories: string[] | string,
  ): Promise<Restaurant[]> {
    try {
      // locations와 categories가 단일 문자열이라면 배열 형태로 변환하여 find 수행
      const locationsArray = Array.isArray(locations) ? locations : [locations];
      const categoriesArray = Array.isArray(categories)
        ? categories
        : [categories];

      return await RestaurantRepository.find({
        where: {
          location: { locationName: In(locationsArray) },
          categories: { categoryName: In(categoriesArray) },
        },
      });
    } catch (error) {
      throw new InternalServerError('레스토랑 정보를 불러오는데 실패했습니다.');
    }
  }

  static async createCandidates(
    poll: Poll,
    selectedRestaurants: Restaurant[],
  ): Promise<Candidate[]> {
    try {
      // restaurants list를 객체 하나씩 넣으면서 candidates에 삽입

      const candidateEntities = selectedRestaurants.map((restaurant) => {
        return CandidateRepository.create({
          poll: poll,
          restaurant: restaurant,
        });
      });
      return await CandidateRepository.save(candidateEntities);
    } catch (error) {
      throw new InternalServerError('투표 정보를 저장하는데 실패했습니다.');
    }
  }

  // location 테이블에서 전체 locationName을 추출하여 반환
  static async getAllLocations(): Promise<string[]> {
    try {
      const locations = await LocationRepository.find({
        select: ['locationName'],
      });

      // locations 배열에서 locationName 값만 추출하여 반환
      return locations.map((location) => location.locationName);
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  // category 테이블에서 전체 categoryName을 추출하여 반환
  static async getAllCategories(): Promise<string[]> {
    try {
      const categories = await CategoryRepository.find({
        select: ['categoryName'],
      });

      // locations 배열에서 locationName 값만 추출하여 반환
      return categories.map((category) => category.categoryName);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}
