import Poll from '../entity/poll.entity';
import Candidate from '../entity/candidate.entity';
import Restaurant from '../entity/restaurant.entity';
import CandidateRepository from '../repository/candidate.repository';
import LocationRepository from '../repository/location.repository';
import CategoryRepository from '../repository/category.repository';
import RestaurantRepository from '../repository/restaurant.repository';
import { InternalServerError } from '../util/customErrors';
import { In } from 'typeorm';

export default class CandidateService {
  static async getCandidatesByPollId(pollId: number): Promise<Candidate[]> {
    try {
      return await CandidateRepository.find({
        where: { poll: { id: pollId } },
        relations: ['poll', 'restaurant'], // 이거 넣어야 poll과 restaurant에 접근 가능
      });
    } catch (error) {
      throw new InternalServerError('후보 정보를 불러오는데 실패했습니다.');
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

  // 선택된 레스토랑 객체 하나씩 candidate 테이블에 저장
  static async createCandidates(
    poll: Poll,
    selectedRestaurants: Restaurant[],
  ): Promise<Candidate[]> {
    try {
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
      return locations.map((location) => location.locationName);
    } catch (error) {
      throw new InternalServerError('위치 정보를 불러오는데 실패했습니다.');
    }
  }

  // category 테이블에서 전체 categoryName을 추출하여 반환
  static async getAllCategories(): Promise<string[]> {
    try {
      const categories = await CategoryRepository.find({
        select: ['categoryName'],
      });
      return categories.map((category) => category.categoryName);
    } catch (error) {
      throw new InternalServerError('카테고리 정보를 불러오는데 실패했습니다.');
    }
  }
}
