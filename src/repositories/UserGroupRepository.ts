import IUserGroupRepository from "./IUserGroupRepository";

const userGroupList = [
    {
        personId: '100-12345',
        siteId: '77890-17410',
        groups: [2]
    },
    {
        personId: '100-10000',
        siteId: '77890-17410',
        groups: [1, 2],
    },
    {
        personId: '100-10000',
        siteId: '77890-17411',
        groups: [1, 2],
    },
];


export default class UserGroupRepository implements IUserGroupRepository {
    #siteId: string;

    constructor(siteId: string) {
        this.#siteId = siteId;
    }

    async getUserGroups(personId: string): Promise<number[]> {
        const groups = userGroupList.find((g) => g.siteId === this.#siteId && g.personId === personId);

        return groups?.groups ?? [];
    }
}
