// Type definitions for the Adobe Creative Cloud UXP Font Scout Developer Suite

export type HostAppId = 'AE' | 'AI' | 'PS' | 'PR' | 'ID' | 'IC';

export interface HostApp {
  id: HostAppId;
  name: string;
  fullName: string;
  color: string;
  bgColor: string;
  themeColor: string; // Theme used in CC App
  accentColor: string;
  iconName: string;
  sampleFiles: SampleFile[];
}

export interface SampleFile {
  id: string;
  name: string;
  description: string;
  layerCount: number;
  fonts: DocumentFont[];
}

export interface DocumentFont {
  family: string;
  style: string;
  postScriptName: string;
  status: 'installed' | 'missing';
  provider?: 'Adobe Fonts' | 'Google Fonts' | 'System' | 'Unknown' | 'iFonts' | 'DaFont' | 'BeFonts' | 'Fontshare' | '1001 Fonts' | 'DaFontFree';
  googleFontUrl?: string;
  adobeFontUrl?: string;
  fontUrl?: string;
  license?: string;
  category?: string;
}

export interface CodeFile {
  name: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

export interface GuideStep {
  title: string;
  description: string;
  code?: string;
}

export interface SearchResult {
  family: string;
  provider: 'Google Fonts' | 'Adobe Fonts' | 'iFonts' | 'DaFont' | 'BeFonts' | 'Fontshare' | '1001 Fonts' | 'DaFontFree';
  category?: string;
  status: 'available';
  downloadUrl?: string;
  detailsUrl?: string;
}
