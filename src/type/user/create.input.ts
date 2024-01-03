export default interface CreateUserInput {
  userName: string;
  displayName: string;
  password: string;
  birthDate?: Date;
}
