import IUserGroupRepository from './IUserGroupRepository';
import IUserRepository, { User } from './IUserRepository';

const userList = [
    {
        firstName: 'Max',
        lastName: 'Muster',
        personId: '100-12345',
        email: 'max@muster.com',
        password: 'pass:word',
    },
    {
        firstName: 'Global',
        lastName: 'Admin',
        personId: '100-10000',
        email: 'admin@root.com',
        password: '0000',
    }
];

const userMap = new Map(userList.map((u) => [u.personId, u]));
const emailUserMapping = new Map(userList.map((u) => [u.email, u]));


export default class UserRepository implements IUserRepository {
    #siteId: string;
    #userGroupRepo;

    constructor(siteId: string, userGroupRepository: IUserGroupRepository) {
        this.#siteId = siteId;
        this.#userGroupRepo = userGroupRepository;
    }

    async getUserById(personId: string): Promise<User | null> {
        const user = userMap.get(personId);

        if (!user) return null;

        const groups = await this.#userGroupRepo.getUserGroups(personId);

        return {
            ...user,
            groups
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = emailUserMapping.get(email);

        if (!user) return null;

        const groups = await this.#userGroupRepo.getUserGroups(user.personId);

        return {
            ...user,
            groups
        }
    }
}