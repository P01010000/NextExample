import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { loginUserAction, setUser, updateUserToken } from '../../store/user/actions';
import { useUser } from '../../store/user/selector';
import Modal, { useModal } from '../modal/Modal';

const Login: FC<{ siteId?: string }> = ({ siteId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
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
            <button
                onClick={onClick}
            >
                {user.isAuthenticated ? 'Logout' : 'Login'}
            </button>
            <Modal
                isShowing={isShowing}
                hide={toggle}
            >
                <h2 style={{ marginTop: 0 }}>Login Modal</h2>
                <div>
                    <input placeholder="eMail" onChange={ev => setEmail(ev.target.value)} value={email} />
                </div>
                <div>
                    <input placeholder="password" onChange={ev => setPassword(ev.target.value)} value={password} type="password" onKeyDown={ev => ev.key === 'Enter' && onConfirm()}/>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button onClick={onConfirm}>Login</button><button onClick={toggle2}>Help</button>
                </div>
            </Modal>
            <Modal
                isShowing={isShowing2}
                hide={toggle2}
            >
                <div>
                    Testing to stack dialogs
                </div>
            </Modal>
            {show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} onClick={() => setShow(false)}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: 12,
                    }} onClick={(ev) => ev.stopPropagation()}>
                        <h2 style={{ marginTop: 0 }}>Login Modal</h2>
                        <div>
                            <input placeholder="eMail" onChange={ev => setEmail(ev.target.value)} value={email} />
                        </div>
                        <div>
                            <input placeholder="password" onChange={ev => setPassword(ev.target.value)} value={password} type="password" onKeyDown={ev => ev.key === 'Enter' && onConfirm()}/>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button onClick={onConfirm}>Login</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Login;
