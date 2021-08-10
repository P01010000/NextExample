import styled from 'styled-components';

export const LoginButtonWrapper = styled.div`
    margin: 10px;
`;

export const LoginButton = styled.button`
    min-height: 30px;
    padding: 7px 12px;
    color: #FFFFFF;
    background-color: #1f3d8e;
    box-shadow: 1px 2px 3px rgb(0 0 0 / 20%);

    position: relative;
    display: inline-block;
    text-align: center;
    border: 0;
    cursor: pointer;
    user-select: none;
    transition: background-color 150ms ease;
    overflow: hidden;
    line-height: 1.15;
    border-radius: 3px;

    :after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
        transition: opacity 500ms;
        background-color: rgba(255, 255, 255, 0.5);
    }

    :active:after {
        opacity: 0.5;
        transition: opacity 0s;
    }
`

export const LoginHeadline = styled.h2`
    margin-top: 0;
`;

export const SignInButtonWrapper = styled.div`
    text-align: center;
`;
