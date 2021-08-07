import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { JwtPayload } from 'jsonwebtoken';
import { sign, verify } from '../services/auth/auth';

type AuthHandlerResponse = {
    token: string,
    payload: JwtPayload,
} | null;

const authHandler = async ({ req, res }: GetServerSidePropsContext | { req: NextApiRequest, res: NextApiResponse }): Promise<AuthHandlerResponse> => {
    const cookies = req.cookies;
    const siteId = req.state?.site?.siteId ?? new URL(req.headers.referer!).pathname.split('/')[1];
    
    if (!siteId) return null;

    const tokenFromCookie = cookies[`at_${siteId}`];

    if (tokenFromCookie) {
        try {
            const payload = verify(tokenFromCookie);
            if (payload.siteId === siteId) {
                return {
                    token: tokenFromCookie,
                    payload,
                };
            }
        } catch (ex) {
            // remove invalid cookie
            res.setHeader('Set-Cookie', `at_${siteId}=;expires=${new Date(0).toUTCString()}`);
        }
    }
    const authHeader = req.headers.authorization;
    if (authHeader?.substring(0, 7).toLowerCase() === 'bearer ') {
        const tokenFromHeader = authHeader.substring(7).trim();
        try {
            const payload = verify(tokenFromHeader);
            if (payload.siteId === siteId) {
                return {
                    token: tokenFromHeader,
                    payload,
                }
            }
        } catch (ex) {
            // invalid login
        }
    }
    return null;
}

export default authHandler;
