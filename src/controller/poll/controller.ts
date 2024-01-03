import { RequestHandler } from 'express';
import PollService from '../../service/poll.service';
import CreatePollInput from '../../type/poll/create.input';
import { BadRequestError } from '../../util/customErrors';

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
    const { pollName, createdBy, url, createdAt, endedAt } = req.body as CreatePollInput;
    const createPollInput: CreatePollInput = { pollName, createdBy, url, createdAt, endedAt };

    const user = await PollService.createPoll(createPollInput);

    res.status(201).json(user.id);
  } catch (error) {
    next(error);
  }
};
