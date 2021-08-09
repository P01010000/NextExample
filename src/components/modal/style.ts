import styled from 'styled-components';

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1040;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
`;

export const ModalWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 1040;
    display: flex;

    @media (min-width: 599px) {
        align-items: center;
        height: 100%;
        left: 50%;
        transform: translateX(-50%);
        max-width: 500px;
    }
`;

export const ModalContent = styled.div`
    z-index: 100;
    background: white;
    position: relative;
    margin: auto auto 0 auto;
    border-radius: 3px;
    max-width: 600px;
    padding: 2rem;
    flex: 1;

    @media (min-width: 599px) {
        margin-bottom: auto;
        max-width: 500px;
    }
`;

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const ModalCloseButton = styled.button`
    margin-left: auto;
    background-color: gray;
    border: none;
    border-radius: 3px;
    padding: 6px 10px;
`;

export const ModalBody = styled.div``;
