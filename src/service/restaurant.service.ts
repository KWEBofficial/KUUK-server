import Restaurant from "../entity/restaurant.entity";
import Candidate from "../entity/candidate.entity";
import { InternalServerError } from "../util/customErrors";
import RestaurantRepository from "../repository/restaurant.repository";

export default class RestaurantService {
  // restaurantId로 restaurant 찾기
  static async getRestaurantByRestaurantId(id: number): Promise<Restaurant | null> {
    try {
      return await RestaurantRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerError('식당 정보를 불러오는데 실패했습니다.')
    }
  }

  // candidate로 restaurant 찾기
  static async getRestaurantByCandidate(candidate: Candidate): Promise<Restaurant | null> {
    try {
      const restaurant = candidate.restaurant;
      return this.getRestaurantByRestaurantId(restaurant.id)
    } catch (error) {
      throw new InternalServerError('식당 정보를 불러오는데 실패했습니다.');
    }
  }

  // candidates로 restaurants 찾기 => 결국 우리가 사용하고자 하는 것
  static async getRestaurantsByCandidates(candidates: Candidate[]): Promise<Restaurant[]> {
    try {
      const restaurantPromises = candidates.map(async (candidate) => {
        const restaurant = await this.getRestaurantByCandidate(candidate);
        if (restaurant) {
          return restaurant;
        } else {
          throw new Error(`Restaurant not found for candidate id: ${candidate.id}`);
        }
      });

      return Promise.all(restaurantPromises);
    } catch (error) {
      throw new InternalServerError('식당 정보를 불러오는데 실패했습니다.');
    }
  }
}