import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import CreateParticipantInput from '../../type/participant/create.input';
import ParticipantService from '../../service/participant.service';
import PollService from '../../service/poll.service';

//GET /guest/login/some-poll-url
export const showGuestLoginPage: RequestHandler = async (req, res, next) => {
  try {
    const url = req.params.url;

    if (!url) throw new BadRequestError('URL이 존재하지 않습니다.');

    const poll = await PollService.getPollByUrl(url as string);
    req.session.guest = { poll: poll };

    res.status(200).json(poll);
  } catch (error) {
    next(error);
  }
};

//POST /guest/login
export const loginGuest: RequestHandler = async (req, res, next) => {
  try {
    const { displayName } = req.body;

    if (!displayName) throw new BadRequestError('닉네임을 기입하세요.');

    const guestSession = req.session.guest;
    if (!guestSession || !guestSession.poll)
      throw new BadRequestError('게스트 정보가 없습니다');

    const existingGuest =
      await ParticipantService.getParticipantByDisplayNameandPollId(
        guestSession.poll.id,
        displayName,
      );
    if (existingGuest)
      throw new BadRequestError('투표방에 동일 닉네임 사용자가 존재합니다.');

    const createParticipantInput: CreateParticipantInput = {
      displayName,
      poll: guestSession.poll,
    };
    const guest = await ParticipantService.saveParticipant(
      createParticipantInput,
    );
    req.session.guest = {
      poll: guest.poll,
      displayName: guest.displayName,
    };
    res.json(guest);
  } catch (error) {
    next(error);
  }
};

// GET /guest/status
export const getStatus: RequestHandler = async (req, res, next) => {
  try {
    if (req.session.guest) {
      res.status(200).json({ displayName: req.session.guest.displayName });
    } else {
      res.status(204).send('로그인 상태가 아닙니다.');
    }
  } catch (error) {
    next(error);
  }
};
