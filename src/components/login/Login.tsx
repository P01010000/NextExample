import React, { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { loginUserAction, setUser } from '../../store/user/actions';
import { useUser } from '../../store/user/selector';

const Login: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);

    const onClick = useCallback(async () => {
        if (user.isAuthenticated) {
            await fetch('/api/auth/invalidate', { method: 'POST', credentials: 'include' });
            dispatch(setUser(null));
        } else {
            setShow(true);
        }
    }, [user, dispatch]);

    const onConfirm = useCallback(async () => {
        const res = await dispatch(loginUserAction({ eMail: email, password }));
        if (res.meta.requestStatus === 'fulfilled') {
            setShow(false);
            setEmail('');
            setPassword('');
        }
    }, [email, password, dispatch]);

    return (
        <>
            <button
                onClick={onClick}
            >
                {user.isAuthenticated ? 'Logout' : 'Login'}
            </button>
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
