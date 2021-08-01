export default interface IUserGroupRepository {
    getUserGroups(personId: string): Promise<number[]>;
}
