import { RequestHandler } from 'express';
import Restaurant from '../../entity/restaurant.entity';
import PollRepository from '../../repository/poll.repository';
import CandidateService from '../../service/candidate.service';
import ParticipantService from '../../service/participant.service';
import PollService from '../../service/poll.service';
import RestaurantService from '../../service/restaurant.service';
import VoteService from '../../service/vote.service';
import FilterInput from '../../type/filter/create.input';
import CreateParticipantInput from '../../type/participant/create.input';
import CreatePollInput from '../../type/poll/create.input';
import ResultRestaurant from '../../type/restaurant/result';
import CreateVoteInput from '../../type/vote/create.input';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';

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

// GET /poll/restaurant?location=정후,고대사거리&category=치킨,돈까스
export const createFilteredRestaurants: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    let { locations, categories }: FilterInput = req.query;

    let locationsArray: string[] = [];
    let categoriesArray: string[] = [];

    if (!locations) {
      locationsArray = await CandidateService.getAllLocations();
    } else {
      locationsArray = locations.split(',');
    }

    if (!categories) {
      categoriesArray = await CandidateService.getAllCategories();
    } else {
      categoriesArray = categories.split(',');
    }

    const restaurants = await CandidateService.getRestaurantsByFiltering(
      locationsArray,
      categoriesArray,
    );

    const sortedRestaurants = restaurants.sort((a, b) => a.id - b.id);

    res.status(200).json(sortedRestaurants);
  } catch (error) {
    next(error);
  }
};

// POST /poll/restaurant
export const creatPollAndCandidate: RequestHandler = async (req, res, next) => {
  try {
    const { pollName, createdAt, selectedRestaurants } =
      req.body as CreatePollInput & { selectedRestaurants: Restaurant[] };
    const userSession = req.session.user;

    if (!selectedRestaurants) {
      throw new BadRequestError('식당 후보를 하나 이상 선택해주세요.');
    }
    if (!pollName) {
      throw new BadRequestError('투표방 이름을 설정해주세요.');
    }

    const createdUrl = PollService.generateRandomString(5);

    // 투표방 생성
    const createPollInput: CreatePollInput = {
      pollName,
      createdUser: userSession ? userSession.id : null,
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
      user: userSession ? userSession.id : null,
      displayName: userSession ? userSession.displayName : null,
      poll,
    };

    // participant 저장
    await ParticipantService.saveParticipant(createParticipantInput);

    res.status(201).json(String(poll.id));
  } catch (error) {
    next(error);
  }
};

// GET /poll/:pollId
export const getPollForm: RequestHandler = async (req, res, next) => {
  try {
    const pollId = Number(req.params.pollId);
    const poll = await PollService.getPollById(pollId);
    const candidatesWithPoll =
      await CandidateService.getCandidatesByPollId(pollId);
    const restaurants =
      await RestaurantService.getRestaurantsByCandidates(candidatesWithPoll);
    const votesList =
      await VoteService.getVotesListByCandidates(candidatesWithPoll);

    const candidates = candidatesWithPoll.map(({ poll, ...rest }) => rest);
    const pollFormData = {
      poll,
      candidates,
      restaurants,
    };

    res.status(200).json(pollFormData);
  } catch (error) {
    next(error);
  }
};

// POST /poll/:pollId
export const postVoteInPoll: RequestHandler = async (req, res, next) => {
  try {
    const { votedCandidate } = req.body;
    const currentParticipant = req.session.user
      ? req.session.user
      : req.session.guest;
    if (!currentParticipant) throw new Error('로그인 정보가 없습니다.');

    const votedParticipant =
      await ParticipantService.getParticipantByDisplayNameandPollId(
        Number(req.params.pollId),
        currentParticipant.displayName,
      );

    if (!votedParticipant) throw new Error('참여자 정보가 없습니다.');

    const createVoteInput: CreateVoteInput = {
      votedUser: votedParticipant,
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
      return res.status(201).json({ res: false });
    } else {
      const currentTimestamp = new Date();
      await PollRepository.update(
        { id: pollId },
        { endedAt: currentTimestamp },
      );

      return res.status(201).json({ res: true });
    }
  } catch (error) {
    next(error);
  }
};

// GET /poll/:pollId/:candidateId
export const getVoteCount: RequestHandler = async (req, res, next) => {
  try {
    const candidateId = Number(req.params.candidateId);
    const voteCounts = (await VoteService.getVotesByCandidateId(candidateId))
      .length
      ? (await VoteService.getVotesByCandidateId(candidateId)).length
      : 0;
    return res.json(voteCounts);
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
      .map((candidate) => VoteService.getVotesByCandidateId(candidate.id))
      .map((votes) => votes.then((resolvedVotes) => resolvedVotes.length));

    const maxVoteCount = await Promise.all(voteCounts).then(
      (resolvedVoteCounts) => Math.max(...resolvedVoteCounts),
    );

    const resolvedVoteCounts = await Promise.all(voteCounts);

    // 최다 득표 restaurants(공동 1위 가능)
    let resultRestaurants: ResultRestaurant[] = [];

    resolvedVoteCounts.forEach((voteCount, index) => {
      if (voteCount === maxVoteCount) {
        const curRestaurant = candidates[index].restaurant;
        resultRestaurants.push({
          id: curRestaurant.id,
          restaurantName: curRestaurant.restaurantName,
          imgDir: curRestaurant.imgDir,
          description: curRestaurant.description,
        });
      }
    });

    res.status(201).json({ maxVoteCount, resultRestaurants });
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

    const response = polls.map(async (poll) => {
      const voteCounts = poll.candidates
        .map(
          async (candidate) =>
            await VoteService.getVotesByCandidateId(candidate.id),
        )
        .map((votes) => votes.then((resolvedVotes) => resolvedVotes.length));

      // 최다 득표수
      const maxVoteCount = await Promise.all(voteCounts).then(
        (resolvedVoteCounts) => Math.max(...resolvedVoteCounts),
      );
      if (maxVoteCount <= 0) return { poll, resultImgDir: '' };

      const resolvedVoteCounts = await Promise.all(voteCounts);

      const index = resolvedVoteCounts.indexOf(maxVoteCount);
      if (index < 0) return { poll, resultImgDir: '' };

      const resultImgDir = poll.candidates[index].restaurant.imgDir;

      return { poll, resultImgDir };
    });

    const resolvedResponse = await Promise.all(response);

    res.json(resolvedResponse);
  } catch (error) {
    next(error);
  }
};

export const deletePollsByPollIds: RequestHandler = async (req, res, next) => {
  try {
    const { pollIds } = req.body;
    pollIds.map((pollId: number) => {
      const poll = PollService.deletePollByPollId(pollId);
    });

    res.status(200).json('Delete success');
  } catch (error) {
    next(error);
  }
};
