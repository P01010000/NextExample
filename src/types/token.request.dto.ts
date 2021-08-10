import TokenType from './tokenType';

export type TokenRequestDTO = {
    siteId: string;
    type?: TokenType;
    email?: string;
    password?: string;
}
