import { RequestHandler } from 'express';
import PollService from '../../service/poll.service';
import CandidateService from '../../service/candidate.service';
import VoteService from '../../service/vote.service';
import CreatePollInput from '../../type/poll/create.input';
import { BadRequestError } from '../../util/customErrors';
import Restaurant from '../../entity/restaurant.entity';

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

export const createPoll: RequestHandler = async (req, res, next) => {
  try {
    const { pollName, createdBy, url, createdAt, endedAt } =
      req.body as CreatePollInput;
    const createPollInput: CreatePollInput = {
      pollName,
      createdBy,
      url,
      createdAt,
      endedAt,
    };

    const poll = await PollService.createPoll(createPollInput);

    res.status(201).json(poll.id);
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
