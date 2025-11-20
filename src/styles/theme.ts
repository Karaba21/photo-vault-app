export const theme = {
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#BB86FC', // Purple accent
    primaryVariant: '#3700B3',
    secondary: '#03DAC6', // Teal accent
    error: '#CF6679',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as 'bold',
      color: '#FFFFFF',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as '600',
      color: '#FFFFFF',
    },
    body: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    caption: {
      fontSize: 12,
      color: '#B0B0B0',
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as '600',
      color: '#000000',
    },
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    round: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
