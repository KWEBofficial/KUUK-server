import { RequestHandler } from 'express';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';
import CreateParticipantInput from '../../type/participant/create.input';
import ParticipantService from '../../service/participant.service';
import PollService from '../../service/poll.service';

//GET /guest/login?url=some-poll-url 처럼?
// params 이용할 경우 /guest/login/:url
export const showGuestLoginPage: RequestHandler = async (req, res, next) => {
  try {
    //GET 요청에서는 query나 params를 이용
    const url = req.query.url; //url 쿼리 스트링이나 매개변수를 이용해야한다고 합니다(?)
    if (!url) throw new BadRequestError('URL이 존재하지 않습니다.');
    const poll = await PollService.getPollByUrl(url as string);
    req.session.guest = { poll: poll }; //guest session에 poll 정보 넘기기
    res.status(200).json(poll);
  } catch (error) {
    next(error);
  }
};

//POST /guest/login
export const loginGuest: RequestHandler = async (req, res, next) => {
  try {
    //request로 displayName 받아오기
    const { displayName } = req.body;
    //제대로 기입되지 않은 경우 BadRequest
    if (!displayName) throw new BadRequestError('닉네임을 기입하세요.');
    //세션에서 게스트 정보 조회(get에서 넘겨받은 세션)
    const guestSession = req.session.guest; //guest session에서 정보 넘겨받기
    if (!guestSession || !guestSession.poll)
      throw new BadRequestError('게스트 정보가 없습니다');
    //요 로직은 수정해도 괜찮을듯 합니다. 함수명이 너무 길어진.
    const existingGuest =
      await ParticipantService.getParticipantByDisplayNameandPollId(
        guestSession.poll.id, //찾는 건 id로 검색
        displayName,
      );
    if (existingGuest)
      throw new BadRequestError('투표방에 동일 닉네임 사용자가 존재합니다.');

    const createParticipantInput: CreateParticipantInput = {
      displayName,
      poll: guestSession.poll, //세션정보로 넘겨받은 poll정보
    };
    const guest = await ParticipantService.saveParticipant(
      createParticipantInput,
    );
    req.session.guest = {
      poll: guest.poll,
      displayName: guest.displayName,
    };
    res.json(guest);
    return res.redirect(`/poll/${guest.poll.id}`); //리다이렉트 값은 아직 존재하지 않아서
  } catch (error) {
    next(error);
  }
};
