import { FC, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

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
            <style jsx>
                {`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 1040;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(3px);
                }

                .modal-wrapper {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 60%;
                    overflow-x: hidden;
                    overflow-y: auto;
                    z-index: 1040;
                    display: flex;
                }

                .modal {
                    z-index: 100;
                    background: white;
                    position: relative;
                    margin: auto auto 0 auto;
                    border-radius: 3px;
                    max-width: 600px;
                    padding: 2rem;
                    flex: 1;
                  }

                  @media (min-width: 599px) {
                      .modal-wrapper {
                          align-items: center;
                          height: 100%;
                          left: 50%;
                          transform: translateX(-50%);
                          max-width: 500px;
                        }
                        .modal {
                          margin-bottom: auto;
                          max-width: 500px;
                      }
                  }

                  .modal-header {
                    display: flex;
                    justify-content: flex-end;
                  }
            `}
            </style>
            <div className="modal-overlay" onClick={hide}/>
            <div className="modal-wrapper" onClick={hide}>
                <div className="modal" onClick={ev => ev.stopPropagation()}>
                    <div className="modal-header">
                        <button type="button" className="modal-close-button" onClick={hide}>
                            &times;
                        </button>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </>, document.body
    ) : null;
}

export default Modal;