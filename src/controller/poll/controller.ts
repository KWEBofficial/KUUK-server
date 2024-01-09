import { RequestHandler } from 'express';
import PollService from '../../service/poll.service';
import CreatePollInput from '../../type/poll/create.input';
import { BadRequestError } from '../../util/customErrors';
import Restaurant from '../../entity/restaurant.entity';
import FilterInput from '../../type/filter/create.input';

export const getPollById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.query.id);

    const poll = await PollService.getPollById(id);
    if (!poll) throw new BadRequestError('해당하는 투표가 없습니다.');

    res.json(poll);
  } catch (error) {
    next(error);
  }
};

export const getPollsByPollName: RequestHandler = async (req, res, next) => {
  try {
    const pollName = String(req.query.pollName);

    const polls = await PollService.getPollsByPollName(pollName);

    res.json(polls);
  } catch (error) {
    next(error);
  }
};

// GET /poll
// 위치, 카테고리 설정 창 불러오기
export const getSettingform: RequestHandler = async (req, res, next) => {
  try {
    const locations = await PollService.getAllLocations();
    const categories = await PollService.getAllCategories();

    res.json({ locations, categories });
  } catch (error) {
    next(error);
  }
};

// GET /poll/restaurant/:location&category
export const createFilteredRestaurants: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    let { locations, categories }: FilterInput = req.query; //string[], string, nullable
    console.log('Received locations:', locations);
    console.log('Received categories:', categories);

    // locations나 categories가 비었으면 전체 locations/categories 넣어주기
    if (!locations) {
      locations = await PollService.getAllLocations();
    }
    if (!categories) {
      categories = await PollService.getAllCategories();
    }

    const restaurants = await PollService.getRestaurantsByFiltering(
      locations,
      categories,
    );

    res.status(201).json(restaurants);
  } catch (error) {
    next(error);
  }
};

// POST /poll/restaurant
export const creatPollAndCandidate: RequestHandler = async (req, res, next) => {
  try {
    const {
      pollName,
      createdBy,
      // url,
      createdAt,
      endedAt,
      selectedRestaurants,
    } = req.body as CreatePollInput & { selectedRestaurants: Restaurant[] };

    // 선택한 레스토랑이 없다면
    if (!selectedRestaurants) {
      throw new BadRequestError('식당 후보를 하나 이상 선택해주세요.');
    }
    // Poll 이름을 설정 안했다면
    if (!pollName) {
      throw new BadRequestError('투표방 이름을 설정해주세요.');
    }

    // url 생성해야 함(나중에 생성하기)
    const createdUrl = 'aaaa';

    // 투표방 생성
    const createPollInput: CreatePollInput = {
      pollName,
      createdBy,
      url: createdUrl,
      createdAt,
      endedAt,
    };
    const poll = await PollService.createPoll(createPollInput);

    // restaurant를 candidates 테이블에 저장
    const candidate = await PollService.createCandidates(
      poll,
      selectedRestaurants,
    );

    res.status(201).json(candidate);
    // poll/${pollId}로 리다이렉트
    // poll redirect
    // {
    //   "pollName": "머먹지",
    //   "createdBy":
    //   {
    //     "username": "id",
    //     "display_name": "배고파",
    //     "password": "2001-05-23"
    //   },
    //   "createdAt": "2024-01-09",
    //   "endedAt": "2024-01-20",
    //   "selectedRestaurants" :
    //   [
    //     {
    //       "id": 2,
    //       "restaurantName": "동우설렁탕",
    //       "imgDir": "ddd",
    //       "description": "맛있다"
    //     },
    //     {
    //       "id": 1,
    //       "restaurantName": "만두냠냠",
    //       "imgDir": "abcd",
    //       "description": "만두굿"
    //     },
    //     {
    //       "id": 3,
    //       "restaurantName": "맥도날드",
    //       "imgDir": "asdf",
    //       "description": "냠냠"
    //     }
    //   ]
    // }
  } catch (error) {
    next(error);
  }
};
