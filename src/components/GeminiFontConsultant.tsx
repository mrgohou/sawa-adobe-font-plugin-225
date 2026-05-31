import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Trash2, ArrowRight, BookOpen, AlertCircle, Cloud } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const CONSULTANT_TEMPLATES = [
  {
    title: "Associations Harmonieuses",
    prompt: "Quelles sont les meilleures règles d'or et astuces graphiques pour associer des polices Serif et Sans-Serif dans un design moderne ?"
  },
  {
    title: "Lisibilité sur Écrans",
    prompt: "Quels types de polices et caractéristiques géométriques garantissent une lisibilité optimale pour la lecture de longs textes sur les écrans mobiles ?"
  },
  {
    title: "Licences & Droits d'Auteur",
    prompt: "Peux-tu m'expliquer clairement la différence entre les licences de polices OFL (Open Font License), domaine public, commercial et usage exclusif ?"
  }
];

interface GeminiFontConsultantProps {
  isWidget?: boolean;
}

export default function GeminiFontConsultant({ isWidget = false }: GeminiFontConsultantProps = {}) {
  const { user, chatHistory, syncChatMessage, clearChatHistory, loginWithGoogle } = useFirebase();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Derive message thread based on auth status
  const messages = user 
    ? chatHistory.map(h => ({ role: h.role, content: h.content })) 
    : localMessages;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    // Append user message local state or database sync
    const userMsg: ChatMessage = { role: 'user', content: query };
    if (user) {
      await syncChatMessage('user', query);
    } else {
      setLocalMessages(prev => [...prev, userMsg]);
    }

    setInputPrompt('');
    setLoading(true);
    setErrorStatus(null);

    try {
      const response = await fetch('/api/consultant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: query,
          history: messages // pass preceding context
        })
      });

      if (!response.ok) {
        throw new Error("Impossible de communiquer avec le serveur d'IA.");
      }

      const data = await response.json();
      if (data.error === "Missing API Key") {
        setErrorStatus("Clé API Gemini non configurée dans la console. Simulation locale active.");
      }
      
      if (user) {
        await syncChatMessage('model', data.response);
      } else {
        setLocalMessages(prev => [...prev, { role: 'model', content: data.response }]);
      }
    } catch (err: any) {
      console.error(err);
      const fallbackMsg = "Désolé ! Une erreur de réseau ou de communication est survenue. L'API d'arrière-plan n'a pas pu traiter la demande.\n\n**Recommandation Typographique :** Lorsque vous choisissez des polices pour des projets Adobe, privilégiez un fort contraste d'épaisseur ou d'œil afin de donner du dynamisme à vos compositions.";
      
      if (user) {
        await syncChatMessage('model', fallbackMsg);
      } else {
        setLocalMessages(prev => [...prev, { role: 'model', content: fallbackMsg }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (user) {
      await clearChatHistory();
    } else {
      setLocalMessages([]);
    }
    setErrorStatus(null);
  };

  return (
    <div className={isWidget ? "h-full flex flex-col justify-between" : "border border-[#2d313d] bg-[#15181e] rounded-xl p-6"} id="consultant-section">
      {!isWidget && (
        <header className="border-b border-gray-800 pb-4 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-semibold text-gray-150">Expert Typographie & Design - Gemini API</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">Interrogez l'intelligence artificielle pour tout savoir sur l'histoire des caractères, les associations, la lisibilité et l'art de la typographie.</p>
          </div>
          
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-red-400 border border-transparent hover:border-red-950 hover:bg-red-950/20 rounded-lg cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Effacer
            </button>
          )}
        </header>
      )}

      {/* QUICK SUGGESTIONS TEMPLATES */}
      {messages.length === 0 && (
        <div className="mb-4 space-y-2">
          <span className="text-[10px] font-mono text-indigo-400 uppercase font-black block tracking-wider">Modèles & Questions</span>
          <div className={isWidget ? "grid grid-cols-1 gap-2" : "grid grid-cols-1 md:grid-cols-3 gap-3"}>
            {CONSULTANT_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(tpl.prompt)}
                className="p-2.5 bg-gray-900/40 hover:bg-[#1473e6]/10 hover:border-[#1473e6]/30 border border-gray-800/80 rounded-lg text-left text-xs text-gray-400 font-medium cursor-pointer transition-all flex flex-col gap-1"
              >
                <div className="text-gray-200 font-semibold truncate w-full flex items-center justify-between text-xs">
                  {tpl.title}
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                </div>
                {!isWidget && <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">"{tpl.prompt}"</p>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CHAT THREAD VIEW */}
      <div className={`flex flex-col gap-3 overflow-y-auto mb-4 pr-1.5 ${isWidget ? 'max-h-[310px] flex-1' : 'max-h-[460px]'}`}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3.5 p-4 rounded-xl text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gray-800/30 border border-gray-800 text-gray-200 ml-10'
                : 'bg-[#0f1115] border border-indigo-950/50 text-gray-300 mr-10'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === 'user' ? 'bg-indigo-950 text-indigo-400' : 'bg-purple-950 text-purple-400'
            }`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            
            <div className="space-y-3 flex-1 select-text">
              {/* Parse rudimentary submarkdowns securely inside strings */}
              {msg.content.split('\n').map((line, idx) => {
                if (line.startsWith('###')) {
                  return <h4 key={idx} className="text-gray-100 font-bold font-display mt-4 select-text">{line.replace('###', '').trim()}</h4>;
                }
                if (line.startsWith('**')) {
                  return <p key={idx} className="font-semibold text-gray-200 select-text">{line.replaceAll('**', '')}</p>;
                }
                if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
                  return <p key={idx} className="pl-3 text-gray-400 select-text">{line}</p>;
                }
                if (line.startsWith('- ')) {
                  return <li key={idx} className="list-disc pl-5 text-gray-400 select-text">{line.slice(2)}</li>;
                }
                if (line.includes('`')) {
                  // Render highlight inline codes
                  const parts = line.split('`');
                  return (
                    <p key={idx} className="text-gray-400 select-text">
                      {parts.map((p, pIdx) => (
                        pIdx % 2 === 1 
                          ? <code key={pIdx} className="bg-gray-900 border border-gray-800 font-mono text-orange-400 px-1 py-0.2 rounded mx-0.5 text-[10.5px]">{p}</code> 
                          : p
                      ))}
                    </p>
                  );
                }
                return <p key={idx} className="text-gray-400 leading-relaxed select-text">{line}</p>;
              })}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3.5 p-4 rounded-xl text-xs bg-[#0f1115] border border-indigo-950/20 text-gray-400 mr-10 animate-pulse">
            <Bot className="w-5 h-5 text-purple-400 shrink-0" />
            <span>Gemini élabore vos conseils en typographie et design...</span>
          </div>
        )}

        {errorStatus && (
          <div className="p-3.5 bg-yellow-950/20 border border-yellow-900/50 rounded-lg text-xs text-yellow-500 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
            <p className="leading-tight">{errorStatus}</p>
          </div>
        )}
      </div>

      {/* CHATBAR INPUT */}
      <div className="flex gap-2 shrink-0">
        <input
          disabled={loading}
          type="text"
          placeholder={isWidget ? "Une question ?" : "Posez votre question sur les polices, l'harmonisation ou le design..."}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          disabled={loading || !inputPrompt.trim()}
          onClick={() => handleSendMessage()}
          className="px-4 py-2.5 bg-[#1473e6] disabled:bg-gray-850 disabled:text-gray-600 hover:bg-[#1162c4] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          {!isWidget && "Envoyer"}
        </button>
      </div>
    </div>
  );
}
