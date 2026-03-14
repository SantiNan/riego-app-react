import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    font-family: ${({ theme }) => theme.fontSans};
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  button {
    font-family: ${({ theme }) => theme.fontSans};
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
  }

  input { font-family: ${({ theme }) => theme.fontSans}; }

  ::-webkit-scrollbar { width: 0; }
`;
