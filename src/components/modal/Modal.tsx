import React, { FC, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalWrapper } from './style';

export const useModal = () => {
    const [isShowing, setIsShowing] = useState(false);

    const toggle = useCallback(() => {
        setIsShowing((state) => !state);
    }, []);

    return {
        isShowing,
        toggle,
    }
}

const Modal: FC<{ isShowing: boolean, hide: MouseEventHandler }> = ({ isShowing, hide, children }) => {
    useEffect(() => {
        if (isShowing) {
            if (document.body.style.overflow === 'hidden') return;
            document.body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px`;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.paddingRight = '';
                document.body.style.overflow = '';
            }
        }
    }, [isShowing]);

    return isShowing ? ReactDOM.createPortal(
        <>
            <ModalOverlay onClick={hide}/>
            <ModalWrapper onClick={hide}>
                <ModalContent onClick={ev => ev.stopPropagation()}>
                    <ModalHeader>
                        <ModalCloseButton onClick={hide}>
                            &times;
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        {children}
                    </ModalBody>
                </ModalContent>
            </ModalWrapper>
        </>, document.body
    ) : null;
}

export default Modal;