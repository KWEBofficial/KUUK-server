import { In } from 'typeorm';
import Candidate from '../entity/candidate.entity';
import Poll from '../entity/poll.entity';
import Restaurant from '../entity/restaurant.entity';
import CandidateRepository from '../repository/candidate.repository';
import CategoryRepository from '../repository/category.repository';
import LocationRepository from '../repository/location.repository';
import RestaurantRepository from '../repository/restaurant.repository';
import { InternalServerError } from '../util/customErrors';

export default class CandidateService {
  static async getCandidatesByPollId(pollId: number): Promise<Candidate[]> {
    try {
      return await CandidateRepository.find({
        where: { poll: { id: pollId } },
        relations: ['poll', 'restaurant'],
      });
    } catch (error) {
      throw new InternalServerError('후보 정보를 불러오는데 실패했습니다.');
    }
  }

  static async getRestaurantsByFiltering(
    locations: string[],
    categories: string[],
  ): Promise<Restaurant[]> {
    try {
      return await RestaurantRepository.find({
        where: {
          location: { locationName: In(locations) },
          categories: { categoryName: In(categories) },
        },
        relations: ['location', 'categories', 'menus'],
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
