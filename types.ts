export interface BibleVerse {
  reference: string;
  text: string;
}

export interface LiveEvent {
  title: string;
  locationOrContext: string;
  narrative: string;
  warningLesson: string;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  definition: string;
  keyVerse: BibleVerse;
  additionalVerses: BibleVerse[];
  sermonBody: string[];
  liveEvent?: LiveEvent;
  reflectionQuestions: string[];
  prayerText: string;
  category: 'Eternity & Judgment' | 'Repentance & Purity' | 'Hell Fire Warnings' | 'Salvation & Grace' | 'Holy Living & Perseverance';
}

export interface Bookmark {
  chapterId: number;
  savedAt: string;
  note?: string;
}

export type TabType = 'devotional' | 'audio' | 'ministry';

export interface AudioSettings {
  rate: number; // 0.8 to 1.5
  pitch: number;
  autoNext: boolean;
}
