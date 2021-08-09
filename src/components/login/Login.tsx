import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { loginUserAction, setUser, updateUserToken } from '../../store/user/actions';
import { useUser } from '../../store/user/selector';
import Modal, { useModal } from '../modal/Modal';
import { LoginButton, LoginButtonWrapper, LoginHeadline, SignInButtonWrapper } from './style';

const Login: FC<{ siteId?: string }> = ({ siteId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isShowing, toggle } = useModal();
    const { isShowing: isShowing2, toggle: toggle2 } = useModal();

    useEffect(() => {
        const token = user.token;
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;

        const renewToken = async () => {
            const res = await fetch('/api/auth/renew', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(token) });
            if (res.ok) {
                const token = await res.text();
                const payload = JSON.parse(atob(token.split('.')[1]));
                const exp = payload.exp;
                document.cookie = `at_${payload.siteId}=${token};exp=${new Date(exp * 1000).toUTCString()};path=/${siteId}/`;

                dispatch(updateUserToken(token));
            } else {
                dispatch(setUser(null));
            }
        }

        console.debug('start timeout', new Date((exp - 60) * 1000), (exp - 60) * 1000 - Date.now());
        const timeout = setTimeout(renewToken, (exp - 60) * 1000 - Date.now());

        return () => clearTimeout(timeout);
    }, [user.token, dispatch, siteId]);

    const onClick = useCallback(async () => {
        if (user.isAuthenticated) {
            await fetch('/api/auth/invalidate', { method: 'POST', credentials: 'include' });
            dispatch(setUser(null));
        } else {
            toggle();
        }
    }, [user, dispatch, toggle]);

    const onConfirm = useCallback(async () => {
        const res = await dispatch(loginUserAction({ eMail: email, password, siteId }));
        if (res.meta.requestStatus === 'fulfilled') {
            toggle();
            setEmail('');
            setPassword('');
        }
    }, [siteId, email, password, dispatch, toggle]);

    return (
        <>
            <LoginButtonWrapper>
                <LoginButton
                    onClick={onClick}
                >
                    {user.isAuthenticated ? 'Logout' : 'Login'}
                </LoginButton>
            </LoginButtonWrapper>
            <Modal
                isShowing={isShowing}
                hide={toggle}
            >
                <LoginHeadline>Login Modal</LoginHeadline>
                <div>
                    <input placeholder="eMail" onChange={ev => setEmail(ev.target.value)} value={email} />
                </div>
                <div>
                    <input placeholder="password" onChange={ev => setPassword(ev.target.value)} value={password} type="password" onKeyDown={ev => ev.key === 'Enter' && onConfirm()}/>
                </div>
                <SignInButtonWrapper>
                    <button onClick={onConfirm}>Login</button>
                    <button onClick={toggle2}>Help</button>
                </SignInButtonWrapper>
            </Modal>
            <Modal
                isShowing={isShowing2}
                hide={toggle2}
            >
                <div>
                    Testing to stack dialogs
                </div>
            </Modal>
        </>
    )
}

export default Login;
