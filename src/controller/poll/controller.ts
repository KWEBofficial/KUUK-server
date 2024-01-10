import { RequestHandler } from 'express';
import PollService from '../../service/poll.service';
import CandidateService from '../../service/candidate.service';
import VoteService from '../../service/vote.service';
import RestaurantService from '../../service/restaurant.service';
import ParticipantService from '../../service/participant.service';
import CreateParticipantInput from '../../type/participant/create.input';
import CreatePollInput from '../../type/poll/create.input';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';
import Restaurant from '../../entity/restaurant.entity';
import FilterInput from '../../type/filter/create.input';
import CreateVoteInput from '../../type/vote/create.input';
import PollRepository from '../../repository/poll.repository';

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

export const getSettingform: RequestHandler = async (req, res, next) => {
  try {
    const locations = await CandidateService.getAllLocations();
    const categories = await CandidateService.getAllCategories();

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

    // locations나 categories가 비었으면 전체 locations/categories 넣어주기
    if (!locations) {
      locations = await CandidateService.getAllLocations();
    }
    if (!categories) {
      categories = await CandidateService.getAllCategories();
    }

    const restaurants = await CandidateService.getRestaurantsByFiltering(
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
    const { pollName, createdUser, createdAt, selectedRestaurants } =
      req.body as CreatePollInput & { selectedRestaurants: Restaurant[] };

    // 선택한 레스토랑이 없다면
    if (!selectedRestaurants) {
      throw new BadRequestError('식당 후보를 하나 이상 선택해주세요.');
    }
    // Poll 이름을 설정 안했다면
    if (!pollName) {
      throw new BadRequestError('투표방 이름을 설정해주세요.');
    }

    // url 생성해야 함
    const protocol = 'http';
    const domain = 'what2eat.com';
    const path = '/invite';
    const param = '/' + PollService.generateRandomString(5);
    const createdUrl = `${protocol}://${domain}${path}${param}`;
    console.log(createdUrl);

    // 투표방 생성
    const createPollInput: CreatePollInput = {
      pollName,
      createdUser,
      url: createdUrl,
      createdAt,
    };
    const poll = await PollService.createPoll(createPollInput);

    // restaurant를 candidates 테이블에 저장
    const candidate = await CandidateService.createCandidates(
      poll,
      selectedRestaurants,
    );

    const createParticipantInput: CreateParticipantInput = {
      user: createdUser,
      displayName: createdUser.displayName,
      poll,
    };

    console.log(createdUser.displayName);

    // participant에 user 저장
    await ParticipantService.saveParticipant(createParticipantInput);

    res.status(201).json(candidate);
  } catch (error) {
    next(error);
  }
};

// GET /poll/:pollId
export const getPollForm: RequestHandler = async (req, res, next) => {
  try {
    const pollId = Number(req.params.pollId);
    console.log(pollId);
    const poll = await PollService.getPollById(pollId);
    const candidates = await CandidateService.getCandidatesByPollId(pollId);
    const restaurants =
      await RestaurantService.getRestaurantsByCandidates(candidates);
    const votesList = await VoteService.getVotesListByCandidates(candidates);
    // 얘네를 적당히 json 형식으로 반환...
    const pollFormData = {
      poll,
      candidates,
      restaurants,
      votesList,
    };
    res.status(201).json(pollFormData);
  } catch (error) {
    next(error);
  }
};

// GET /poll/result/:pollId || pollId라는 poll에서 득표수가 가장 많은 restaurant들의 객체 배열을 res.json으로 넣어줍니다.
export const getPollResultById: RequestHandler = async (req, res, next) => {
  try {
    const pollId = Number(req.params.pollId);

    // pollId라는 poll의 candidate들을 찾는다. candidates = [후보1, 후보2, ...]
    const candidates = await CandidateService.getCandidatesByPollId(pollId);

    // 각 candidate에 투표한 vote의 개수를 찾는다. voteCounts = [후보1 득표수, 후보2 득표수, ...]
    const voteCounts = candidates
      .map((candidate) => VoteService.getVotesByCandidateId(candidate.id)) // 각 후보에게 투표한 vote의 배열로 바꿔줌
      .map((votes) => votes.then((resolvedVotes) => resolvedVotes.length)); // Promise를 풀고 해당 배열의 length로 바꿔줌

    // 최다 득표수
    const maxVoteCount = await Promise.all(voteCounts).then(
      (resolvedVoteCounts) => Math.max(...resolvedVoteCounts),
    );

    // 최다 득표 restaurants(공동 1위 허용할시)를 찾는다. restaurants = [식당1 객체, 식당2 객체, ...] (식당1, 2, ... 가 공동 1등일 때)
    let restaurants: Restaurant[] = [];

    const resolvedVoteCounts = await Promise.all(voteCounts); // Promise 풀어주기

    resolvedVoteCounts.forEach((voteCount, index) => {
      if (voteCount === maxVoteCount) {
        restaurants.push(candidates[index].restaurant);
      }
    });

    res.status(201).json(restaurants);
  } catch (error) {
    next(error);
  }
};

// GET /poll/history
export const getPollsByUserId: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.session;
    if (!user) throw new UnauthorizedError('로그인되어 있지 않습니다.');

    const polls = await PollService.getPollsByUserId(user.id);

    res.status(201).json(polls);
  } catch (error) {
    next(error);
  }
};

// POST /poll/:pollId
export const postVoteInPoll: RequestHandler = async (req, res, next) => {
  try {
    //req.body로 부터 votedUser, votedCandidate 가져오기
    const { votedUser, votedCandidate } = req.body;

    const createVoteInput: CreateVoteInput = {
      votedUser: votedUser,
      candidate: votedCandidate,
    };
    const vote = await VoteService.saveVote(createVoteInput);
    return res.json(vote);
  } catch (error) {
    next(error);
  }
};

// POST /poll/end/:pollId
export const endPoll: RequestHandler = async (req, res, next) => {
  try {
    const currentUser = req.session.user;
    const pollId = Number(req.params.pollId);
    const poll = await PollService.getPollById(pollId);

    // 현재 세션의 유저와 poll을 만든 유저가 다르거나, 세션에 유저 정보가 없다면 error
    if (currentUser?.id !== poll?.createdUser.id || !currentUser) {
      return res
        .status(403)
        .json({ error: '투표를 만든 사용자만 투표를 종료할 수 있습니다.' });
    } else {
      // 같다면 poll table의 endedAt을 update
      const currentTimestamp = new Date();
      await PollRepository.update(
        { id: pollId },
        { endedAt: currentTimestamp },
      );

      return res.status(201).json(currentTimestamp);
      // return res.redirect(`/poll/result/${pollId}`);
    }
  } catch (error) {
    next(error);
  }
};
