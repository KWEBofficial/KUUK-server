import Candidate from "../../entity/candidate.entity";
import Participant from "../../entity/participant.entity";

export default interface CreateVoteInput {
  votedUser: Participant;
  candidate: Candidate;
}