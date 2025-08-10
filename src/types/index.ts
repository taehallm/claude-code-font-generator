export type Theme = 'light' | 'dark' | 'inverted-black' | 'inverted-white';

export type ExportFormat = 'txt' | 'png' | 'svg';

export interface TypographySettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface ThemeColors {
  textColor: string;
  backgroundColor: string;
}

export interface GeneratorSettings {
  text: string;
  theme: Theme;
  typography: TypographySettings;
  glowEnabled: boolean;
  transparentEnabled: boolean;
}

export interface FontCharacter {
  [key: string]: string[];
}