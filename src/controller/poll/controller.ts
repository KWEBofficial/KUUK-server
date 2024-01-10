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

// GET /poll
export const getSettingform: RequestHandler = async (req, res, next) => {
  try {
    const locations = await CandidateService.getAllLocations();
    const categories = await CandidateService.getAllCategories();

    res.json({ locations, categories });
  } catch (error) {
    next(error);
  }
};

// GET /poll/restaurant/:location=정후&category=돈까스
export const createFilteredRestaurants: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    let { locations, categories }: FilterInput = req.query; //string[], string, nullable

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

    if (!selectedRestaurants) {
      throw new BadRequestError('식당 후보를 하나 이상 선택해주세요.');
    }
    if (!pollName) {
      throw new BadRequestError('투표방 이름을 설정해주세요.');
    }

    // url 생성
    const protocol = 'http';
    const domain = 'what2eat.com';
    const path = '/invite';
    const param = '/' + PollService.generateRandomString(5);
    const createdUrl = `${protocol}://${domain}${path}${param}`;

    // 투표방 생성
    const createPollInput: CreatePollInput = {
      pollName,
      createdUser,
      url: createdUrl,
      createdAt,
    };
    const poll = await PollService.createPoll(createPollInput);

    // Candidate 생성
    const candidate = await CandidateService.createCandidates(
      poll,
      selectedRestaurants,
    );

    const createParticipantInput: CreateParticipantInput = {
      user: createdUser,
      displayName: createdUser.displayName,
      poll,
    };

    // participant 저장
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
    const poll = await PollService.getPollById(pollId);
    const candidates = await CandidateService.getCandidatesByPollId(pollId);
    const restaurants =
      await RestaurantService.getRestaurantsByCandidates(candidates);
    const votesList = await VoteService.getVotesListByCandidates(candidates);

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

// POST /poll/:pollId
export const postVoteInPoll: RequestHandler = async (req, res, next) => {
  try {
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

    if (currentUser?.id !== poll?.createdUser.id || !currentUser) {
      return res
        .status(403)
        .json({ error: '투표를 만든 사용자만 투표를 종료할 수 있습니다.' });
    } else {
      // poll table의 endedAt을 update
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

// GET /poll/result/:pollId
export const getPollResultById: RequestHandler = async (req, res, next) => {
  try {
    const pollId = Number(req.params.pollId);

    const candidates = await CandidateService.getCandidatesByPollId(pollId);
    const voteCounts = candidates
      .map((candidate) => VoteService.getVotesByCandidateId(candidate.id)) // 각 후보에게 투표한 vote의 배열로
      .map((votes) => votes.then((resolvedVotes) => resolvedVotes.length)); // Promise를 풀고 해당 배열의 length로

    // 최다 득표수
    const maxVoteCount = await Promise.all(voteCounts).then(
      (resolvedVoteCounts) => Math.max(...resolvedVoteCounts),
    );

    // 최다 득표 restaurants(공동 1위 가능)
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
    if (!user) throw new UnauthorizedError('로그인이 필요합니다.');

    const polls = await PollService.getPollsByUserId(user.id);

    res.status(201).json(polls);
  } catch (error) {
    next(error);
  }
};
