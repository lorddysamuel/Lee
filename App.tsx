import React, { useState, useEffect } from 'react';
import { ALL_CHAPTERS } from './data/chaptersData';
import { Chapter, TabType, Bookmark } from './types';
import { AndroidHeader } from './components/AndroidHeader';
import { BottomNavigation } from './components/BottomNavigation';
import { ChapterView } from './components/ChapterView';
import { AudioPlayerView } from './components/AudioPlayerView';
import { MinistryView } from './components/MinistryView';
import { ShareModal } from './components/ShareModal';
import { SearchModal } from './components/SearchModal';
import { 
  Flame, BookOpen, Volume2, Sparkles, Filter, 
  Search, BookmarkCheck, ArrowRight, Share2, Check, RefreshCw 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('devotional');
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [fontSize, setFontSize] = useState<number>(16);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Bookmarks state with localStorage persistence
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('sms_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Read progress state with localStorage persistence
  const [readChapters, setReadChapters] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('sms_read_chapters');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    isOpen: boolean;
    title: string;
    textToShare: string;
    chapterNumber?: number;
  }>({
    isOpen: false,
    title: '',
    textToShare: ''
  });

  // Save to localStorage whenever bookmarks change
  useEffect(() => {
    try {
      localStorage.setItem('sms_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Error saving bookmarks', e);
    }
  }, [bookmarks]);

  // Save to localStorage whenever read chapters change
  useEffect(() => {
    try {
      localStorage.setItem('sms_read_chapters', JSON.stringify(readChapters));
    } catch (e) {
      console.error('Error saving read chapters', e);
    }
  }, [readChapters]);

  const currentChapter = ALL_CHAPTERS.find(c => c.id === selectedChapterId) || ALL_CHAPTERS[0];

  const handleSelectChapter = (id: number) => {
    setSelectedChapterId(id);
    if (!readChapters.includes(id)) {
      setReadChapters(prev => [...prev, id]);
    }
  };

  const handleToggleBookmark = (chapterId: number) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.chapterId === chapterId);
      if (exists) {
        return prev.filter(b => b.chapterId !== chapterId);
      } else {
        return [...prev, { chapterId, savedAt: new Date().toISOString() }];
      }
    });
  };

  const handleOpenShareChapter = (chapter: Chapter, textToShare: string) => {
    setShareData({
      isOpen: true,
      title: chapter.title,
      textToShare: textToShare,
      chapterNumber: chapter.id
    });
  };

  const handleOpenShareBook = () => {
    setShareData({
      isOpen: true,
      title: 'Save My Soul From Hell Fire - Devotional Book',
      textToShare: 'Download and read the 50-Chapter Devotional Book by Author SAMUEL E from BELIEVERS GLORIOUS TIME MINISTRY WORLDWIDE. Features Bible verses, authentic sermons, live eyewitness warnings, offline audio player, and prayers.'
    });
  };

  const categories = ['All', 'Hell Fire Warnings', 'Eternity & Judgment', 'Repentance & Purity', 'Salvation & Grace', 'Holy Living & Perseverance'];

  const filteredChapters = ALL_CHAPTERS.filter(c => {
    if (selectedCategory === 'All') return true;
    return c.category === selectedCategory;
  });

  const isBookmarked = (chapterId: number) => bookmarks.some(b => b.chapterId === chapterId);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-100 text-slate-900'} font-sans transition-colors duration-200 antialiased`}>
      {/* Top Header */}
      <AndroidHeader
        fontSize={fontSize}
        setFontSize={setFontSize}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        onShareApp={handleOpenShareBook}
      />

      {/* Main Tab Content Container */}
      <main className="max-w-3xl mx-auto px-2 py-3">
        {/* TAB 1: DEVOTIONAL BOOK */}
        {activeTab === 'devotional' && (
          <div className="space-y-4">
            {/* Quick Hero Banner / Devotional Overview */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg text-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-800/40">
                  50 CHAPTER DEVOTIONAL
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{readChapters.length} / 50 Read</span>
                </span>
              </div>

              <h2 className="font-bold text-lg text-slate-100 uppercase tracking-tight">
                Save My Soul From Hell Fire
              </h2>
              <p className="text-xs text-slate-400 italic">
                Author SAMUEL E • BELIEVERS GLORIOUS TIME MINISTRY WORLDWIDE
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-1.5 mt-3 overflow-hidden border border-slate-800">
                <div 
                  className="bg-red-600 h-full transition-all duration-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                  style={{ width: `${(readChapters.length / 50) * 100}%` }}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white border-red-500 font-bold shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Current Chapter Full Reader View */}
            <ChapterView
              chapter={currentChapter}
              totalChapters={ALL_CHAPTERS.length}
              fontSize={fontSize}
              isBookmarked={isBookmarked(currentChapter.id)}
              onToggleBookmark={handleToggleBookmark}
              onSelectChapter={handleSelectChapter}
              onPlayAudio={(ch) => {
                setSelectedChapterId(ch.id);
                setActiveTab('audio');
              }}
              onShareChapter={handleOpenShareChapter}
            />

            {/* 50 Chapter Grid / Selector Tray */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 shadow-lg mt-6">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <h4 className="font-bold text-slate-300 text-xs tracking-wider uppercase flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-500" />
                  <span>50 Chapters Table of Contents</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  Showing {filteredChapters.length} Chapters
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {filteredChapters.map((ch) => {
                  const isRead = readChapters.includes(ch.id);
                  const isSelected = ch.id === selectedChapterId;
                  const isSaved = isBookmarked(ch.id);

                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        handleSelectChapter(ch.id);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`h-11 rounded-xl flex flex-col items-center justify-center font-bold text-xs transition-all relative border ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-500 shadow-md scale-105 z-10'
                          : isRead
                          ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                          : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                      }`}
                      title={`Ch ${ch.id}: ${ch.title}`}
                    >
                      <span>{ch.id}</span>
                      {isSaved && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIO LISTEN */}
        {activeTab === 'audio' && (
          <AudioPlayerView
            chapters={ALL_CHAPTERS}
            currentChapter={currentChapter}
            onSelectChapter={(ch) => setSelectedChapterId(ch.id)}
          />
        )}

        {/* TAB 3: MINISTRY & SALVATION */}
        {activeTab === 'ministry' && (
          <MinistryView
            chapters={ALL_CHAPTERS}
            bookmarks={bookmarks}
            onSelectChapter={(id) => {
              setSelectedChapterId(id);
              setActiveTab('devotional');
            }}
            onRemoveBookmark={handleToggleBookmark}
            onShareBook={handleOpenShareBook}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarksCount={bookmarks.length}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareData.isOpen}
        onClose={() => setShareData({ ...shareData, isOpen: false })}
        title={shareData.title}
        textToShare={shareData.textToShare}
        chapterNumber={shareData.chapterNumber}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chapters={ALL_CHAPTERS}
        onSelectChapter={(id) => {
          handleSelectChapter(id);
          setActiveTab('devotional');
        }}
      />
    </div>
  );
}
