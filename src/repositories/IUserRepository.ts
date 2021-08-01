export type User = {
    personId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    groups: number[];
}

export default interface IUserRepository {
    getUserById(personId: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
}
