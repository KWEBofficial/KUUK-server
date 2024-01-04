export default interface CreateUserInput {
  username: string;
  displayName: string;
  password: string;
  birthdate?: Date;
}
