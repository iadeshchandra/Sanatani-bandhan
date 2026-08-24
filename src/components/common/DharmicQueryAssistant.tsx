import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  Building2,
  Flame,
  Globe2,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  Bookmark,
  ChevronDown,
  ChevronUp,
  X,
  Bot,
  HelpCircle,
  ShieldCheck,
  Compass,
  MessageSquareQuote,
  Sparkle,
  Zap,
} from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { useWorkspaceTaxonomy } from '../../hooks/useWorkspaceTaxonomy';
import { useToast } from '../../context/ToastContext';

export type AssistantMode = 'auto' | 'scriptural' | 'administrative' | 'rituals';
export type AssistantLang = 'en' | 'hi' | 'bn' | 'sa';

export interface DharmicAssistantResult {
  title: string;
  summary: string;
  shloka?: string;
  shlokaTransliteration?: string;
  shlokaMeaning?: string;
  scriptureSource?: string;
  guidancePoints: string[];
  moduleActions?: Array<{
    label: string;
    targetModule?: string;
    tip: string;
  }>;
  suggestedQueries: string[];
  isMock?: boolean;
  error?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  query?: string;
  result?: DharmicAssistantResult;
  moduleContext: string;
}

export interface DharmicQueryAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeModule?: string;
  onNavigate?: (module: string) => void;
  isDrawer?: boolean;
}

export const DharmicQueryAssistant: React.FC<DharmicQueryAssistantProps> = ({
  isOpen = true,
  onClose,
  activeModule = 'dashboard',
  onNavigate,
  isDrawer = false,
}) => {
  const { activeWorkspace } = useAuthWorkspace();
  const { language } = useLanguage();
  const taxonomy = useWorkspaceTaxonomy();
  const { showToast } = useToast();

  const [promptInput, setPromptInput] = useState('');
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('auto');
  const [selectedLang, setSelectedLang] = useState<AssistantLang>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [showPresets, setShowPresets] = useState(true);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Initialize with contextual greeting on first mount
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting: ChatMessage = {
        id: 'initial-greeting',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        moduleContext: activeModule,
        result: {
          title: `Namaste! Sri ${activeWorkspace.name} AI Assistant`,
          summary: `Welcome to the Dharmic Intelligence Desk. I provide authentic Shastric citations, scriptural wisdom, and institutional administration workflows tailored to ${activeWorkspace.type} operations in ${taxonomy.directoryName || 'Devotee'} management, Vedic Rituals, Double-Entry Treasury, and Seva.`,
          shloka: `धर्मो रक्षति रक्षितः।\nयतो धर्मस्ततो जयः॥`,
          shlokaTransliteration: `dharmo rakṣati rakṣitaḥ, yato dharmastato jayaḥ`,
          shlokaMeaning: `Dharma protects those who uphold Dharma. Where there is righteousness, victory is assured.`,
          scriptureSource: `Mahabharata & Manusmriti 8.15`,
          guidancePoints: [
            `Current active desk is [${activeModule}]. Ask any scriptural, procedural, or Vedic astrological query.`,
            `Get real-time Sanskrit Shlokas with Devanagari script, Roman transliteration, and tri-lingual exposition.`,
            `Receive institutional SOP checklists for temple rituals, 80G receipts, Annadanam recipes, and Goshala care.`
          ],
          moduleActions: [
            { label: `Explore ${taxonomy.directoryName}`, targetModule: 'devotee-grid', tip: `View ${taxonomy.memberNoun} profiles` },
            { label: 'Check Live Panjika', targetModule: 'panchang-muhurat', tip: 'View Tithi & Muhurat calculations' }
          ],
          suggestedQueries: getContextualPrompts(activeModule, activeWorkspace.type),
          isMock: false,
        },
      };
      setMessages([initialGreeting]);
    }
  }, [activeWorkspace, activeModule, taxonomy]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Contextual Presets based on active module
  function getContextualPrompts(moduleKey: string, wsType: string): string[] {
    const mod = (moduleKey || '').toLowerCase();
    if (mod.includes('pooja') || mod.includes('aarti') || mod.includes('purohit') || mod.includes('pitru') || mod.includes('panchang')) {
      return [
        'What are the essential Samagri and Sankalp rules for Rudrabhishek?',
        'How to resolve Gotra Pravara conflict for rituals?',
        'What are the rules for Shradh Tithi when overlapping solar noon?',
        'Which Nakshatra and Hora are best for Griha Pravesh?'
      ];
    }
    if (mod.includes('treasury') || mod.includes('tax') || mod.includes('karma') || mod.includes('campaign')) {
      return [
        'Dharmic principles of temple fund management in Arthashastra',
        'How to classify Hundi cash vs Corpus Chanda for 80G exemption?',
        'Chanakya Niti on temple audit and financial transparency',
        'How to assign Karma Merit points to voluntary sevadars?'
      ];
    }
    if (mod.includes('gau') || mod.includes('goshala')) {
      return [
        'Pancha-Gavya preparation ratios and Ayurvedic applications',
        'Spiritual merit of Go-Daan in Padma Purana & Mahabharata',
        'Daily diet and seasonal fodder schedule for Desi Gir cows',
        'How to set up a monthly recurring Go-Seva adoption drive?'
      ];
    }
    if (mod.includes('annadanam') || mod.includes('kitchen')) {
      return [
        'Classical Shaucha (purity) rules for temple kitchen sevadars',
        'Taittiriya Upanishad verses on the sanctity of Anna-Daan',
        'Quantity estimation formula for 1,000 devotees Maha-Prasadam',
        'How to link devotee birthday Sankalps with Annadanam meals?'
      ];
    }
    if (mod.includes('devotee') || mod.includes('family') || mod.includes('vanshavali') || mod.includes('census')) {
      return [
        'How to record Sapinda lineage up to 7 generations in Vanshavali?',
        'Significance of Rishi Gotras and Pravaras in Sanatan Dharma',
        'Devotee engagement and Seva Tier classification matrix',
        'Vedic blessing for family prosperity (Kula Vriddhi)'
      ];
    }
    if (mod.includes('whatsapp') || mod.includes('events') || mod.includes('sanskrit')) {
      return [
        'Draft an inspiring WhatsApp Sandesh for upcoming Ekadashi Vrata',
        'Key shlokas on Seva from Bhagavad Gita with translation',
        'How to plan festival crowd management during Janmashtami / Shivratri',
        'Sacred prayer for institutional peace and harmony'
      ];
    }

    return [
      `Dharmic duties of trustees and sevadars in a ${wsType}`,
      'How to uphold transparency while managing devotee contributions?',
      'Sacred Shloka for overcoming institutional challenges',
      'Daily morning prayer for temple sevaks (Kalyana Mantra)'
    ];
  }

  // Handle Query Submission
  const handleSendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      query: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      moduleContext: activeModule,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPromptInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.query || m.result?.summary)
        .slice(-4)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          text: m.query || m.result?.summary || '',
        }));

      const res = await fetch('/api/gemini/dharmic-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          activeModule,
          workspaceType: activeWorkspace.type,
          workspaceName: activeWorkspace.name,
          sampradaya: activeWorkspace.sampradaya,
          language: selectedLang,
          contextMode: assistantMode,
          conversationHistory: history,
        }),
      });

      const data = await res.json();

      if (data.success && data.result) {
        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          result: data.result,
          moduleContext: activeModule,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to retrieve response');
      }
    } catch (err: any) {
      console.error('Dharmic assistant fetch error:', err);
      const fallbackMessage: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        moduleContext: activeModule,
        result: {
          title: 'Dharmic Guidance Note',
          summary: `Your inquiry regarding "${trimmed}" has been recorded. Sanatan wisdom emphasizes righteous conduct and dedicated seva in all organizational endeavors.`,
          shloka: `कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥`,
          shlokaTransliteration: `karmaṇy-evādhikāras te mā phaleṣu kadācana`,
          shlokaMeaning: `You have a right to perform your prescribed duty, but never to the fruits of action.`,
          scriptureSource: `Bhagavad Gita 2.47`,
          guidancePoints: [
            `Maintain righteous intent (Sankalpa Shuddhi) in executing duties within [${activeModule}].`,
            `Ensure all records and transactions reflect complete institutional transparency.`,
            `Consult senior scholars or trustees for complex Shastric interpretations.`
          ],
          moduleActions: [
            { label: 'Back to Dashboard', targetModule: 'dashboard', tip: 'Return to home' }
          ],
          suggestedQueries: getContextualPrompts(activeModule, activeWorkspace.type),
          isMock: true,
        },
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy Shloka or result
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Speech Synthesis
  const handleSpeak = (text: string) => {
    if (!synthRef.current) {
      showToast('Speech synthesis not supported in this browser.', 'info');
      return;
    }
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };

  const handleBookmark = (title: string, shloka?: string) => {
    const item = shloka ? `${title}: ${shloka}` : title;
    if (!savedNotes.includes(item)) {
      setSavedNotes((prev) => [...prev, item]);
      showToast('Saved to your Dharmic Study Notes', 'success');
    } else {
      setSavedNotes((prev) => prev.filter((n) => n !== item));
      showToast('Removed from saved notes', 'info');
    }
  };

  const clearChat = () => {
    setMessages([]);
    showToast('Chat history cleared', 'info');
  };

  if (!isOpen && isDrawer) return null;

  return (
    <div
      id="dharmic-query-assistant-container"
      className={`flex flex-col bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-100 ${
        isDrawer
          ? 'fixed top-16 right-4 bottom-4 w-full sm:w-[480px] z-50 transition-all duration-300'
          : 'w-full h-full min-h-[600px]'
      }`}
    >
      {/* Auspicious Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 px-5 py-4 border-b border-amber-500/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 font-serif font-bold text-xl select-none">
            ॐ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-amber-100 tracking-wide flex items-center gap-1.5">
                Dharmic Query Assistant
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                Gemini 3.7
              </span>
            </div>
            <p className="text-xs text-amber-200/70 truncate max-w-[280px]">
              Vedic Scriptures & Institutional Administrative Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={clearChat}
            title="Reset Conversation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {isDrawer && onClose && (
            <button
              type="button"
              id="close-assistant-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Module Context & Mode Controls */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">
            Active Context:
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">
            {activeModule}
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 truncate max-w-[140px] hidden sm:inline">
            {activeWorkspace.name}
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setAssistantMode('auto')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              assistantMode === 'auto'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Universal
          </button>
          <button
            type="button"
            onClick={() => setAssistantMode('scriptural')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              assistantMode === 'scriptural'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            Shastra
          </button>
          <button
            type="button"
            onClick={() => setAssistantMode('administrative')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              assistantMode === 'administrative'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3 h-3" />
            Admin SOPs
          </button>
          <button
            type="button"
            onClick={() => setAssistantMode('rituals')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              assistantMode === 'rituals'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3 h-3" />
            Karmakanda
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.sender === 'user' ? (
              // User Query Bubble
              <div className="max-w-[85%] bg-amber-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-md">
                <p className="text-sm leading-relaxed">{msg.query}</p>
                <span className="text-[10px] text-amber-200/80 block text-right mt-1">
                  {msg.timestamp}
                </span>
              </div>
            ) : (
              // AI Dharmic Assistant Response Card
              <div className="w-full max-w-full bg-slate-950 border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3.5">
                {/* Header of Assistant Card */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif text-sm">
                      ॐ
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-200 leading-tight">
                        {msg.result?.title || 'Dharmic Guidance'}
                      </h4>
                      {msg.result?.scriptureSource && (
                        <p className="text-[11px] text-amber-400/80 font-medium">
                          Pramana: {msg.result.scriptureSource}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {msg.result?.shloka && (
                      <button
                        type="button"
                        onClick={() =>
                          handleSpeak(
                            `${msg.result?.shloka}. Meaning: ${msg.result?.shlokaMeaning}`
                          )
                        }
                        title={isSpeaking ? 'Stop Audio' : 'Listen to Shloka Pronunciation'}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors ${
                          isSpeaking ? 'text-amber-400 bg-amber-500/10 animate-pulse' : ''
                        }`}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `${msg.result?.title}\n\n${msg.result?.shloka ? `॥ ${msg.result.shloka} ॥\n${msg.result.shlokaTransliteration}\n\nMeaning: ${msg.result.shlokaMeaning}\nSource: ${msg.result.scriptureSource}\n\n` : ''}${msg.result?.summary}\n\nKey Recommendations:\n${(msg.result?.guidancePoints || []).map((p) => `• ${p}`).join('\n')}`,
                          msg.id
                        )
                      }
                      title="Copy Complete Guidance"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleBookmark(msg.result?.title || 'Note', msg.result?.shloka)
                      }
                      title="Save to Notes"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sanskrit Shloka Box (if present) */}
                {msg.result?.shloka && (
                  <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-orange-950/30 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkle className="w-3 h-3 text-amber-400" />
                        Sacred Shastra Pramana
                      </span>
                      <span>{msg.result.scriptureSource}</span>
                    </div>

                    {/* Devanagari Script */}
                    <div className="font-serif text-base text-amber-100 leading-relaxed font-semibold text-center py-1 tracking-wide">
                      ॥ {msg.result.shloka} ॥
                    </div>

                    {/* Transliteration */}
                    {msg.result.shlokaTransliteration && (
                      <div className="text-xs text-amber-200/80 italic text-center font-mono">
                        "{msg.result.shlokaTransliteration}"
                      </div>
                    )}

                    {/* Meaning */}
                    {msg.result.shlokaMeaning && (
                      <div className="text-xs text-slate-300 border-t border-amber-500/20 pt-2 leading-relaxed">
                        <strong className="text-amber-300 font-semibold">Meaning: </strong>
                        {msg.result.shlokaMeaning}
                      </div>
                    )}
                  </div>
                )}

                {/* Summary / Exposition */}
                <div className="text-xs text-slate-200 leading-relaxed space-y-2">
                  <p>{msg.result?.summary}</p>
                </div>

                {/* Guidance Bullet Points */}
                {msg.result?.guidancePoints && msg.result.guidancePoints.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                      Institutional & Dharmic Recommendations:
                    </span>
                    <ul className="space-y-1.5">
                      {msg.result.guidancePoints.map((point, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-amber-500 font-bold mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Direct Action Buttons (Navigate to App Modules) */}
                {msg.result?.moduleActions && msg.result.moduleActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                      Recommended Next Actions:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.result.moduleActions.map((action, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (action.targetModule && onNavigate) {
                              onNavigate(action.targetModule);
                              showToast(`Switched to ${action.label}`, 'info');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer group"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-amber-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Queries */}
                {msg.result?.suggestedQueries && msg.result.suggestedQueries.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1.5">
                      Suggested Inquiries:
                    </span>
                    <div className="flex flex-col gap-1">
                      {msg.result.suggestedQueries.map((query, qIdx) => (
                        <button
                          key={qIdx}
                          type="button"
                          onClick={() => handleSendQuery(query)}
                          className="text-left text-xs text-amber-300/90 hover:text-amber-200 hover:bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 hover:border-amber-500/30 transition-colors flex items-center justify-between group"
                        >
                          <span className="truncate">"{query}"</span>
                          <Zap className="w-3 h-3 text-amber-500/50 group-hover:text-amber-400 shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Context: {msg.moduleContext}</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex items-center gap-3 bg-slate-950 border border-amber-500/20 rounded-2xl p-4 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-serif">
              ॐ
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-amber-500/20 rounded w-1/3"></div>
              <div className="h-2.5 bg-slate-800 rounded w-3/4"></div>
              <div className="h-2 bg-slate-800 rounded w-1/2"></div>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Contextual Quick Presets Bar */}
      <div className="bg-slate-950 border-t border-slate-800 px-3 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            Quick Prompts for [{activeModule}]:
          </span>
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[10px] text-slate-400 hover:text-amber-300"
          >
            {showPresets ? 'Hide' : 'Show'}
          </button>
        </div>

        {showPresets && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {getContextualPrompts(activeModule, activeWorkspace.type).map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendQuery(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-950/40 border border-slate-700/60 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-200 whitespace-nowrap transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-slate-950 p-3 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(promptInput);
          }}
          className="flex items-center gap-2"
        >
          {/* Language Selector */}
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value as AssistantLang)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-xl px-2 py-2.5 focus:outline-none focus:border-amber-500"
            title="Preferred Language"
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="sa">संस्कृतम् (Sanskrit)</option>
          </select>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              id="dharmic-query-input"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={`Ask scriptural guidance or administrative SOPs for ${activeModule}...`}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="send-dharmic-query-btn"
            disabled={!promptInput.trim() || isLoading}
            className={`p-2.5 rounded-xl font-semibold flex items-center justify-center transition-all ${
              promptInput.trim() && !isLoading
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-amber-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Submit Query to Gemini AI"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
