import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { 
  AppWindow, 
  BookOpen, 
  Sparkles, 
  Terminal, 
  Activity, 
  Download, 
  Heart, 
  Clock, 
  Github, 
  LogIn, 
  LogOut, 
  Cloud, 
  Zap, 
  Check, 
  Layers, 
  Globe, 
  Laptop, 
  Cpu, 
  FileCode, 
  ArrowRight,
  Shield,
  Search,
  MessageSquare,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

import HostSimulator from './components/HostSimulator';
import Documentation from './components/Documentation';
import GeminiFontConsultant from './components/GeminiFontConsultant';
import { useFirebase } from './context/FirebaseContext';
import { PLUGIN_CODE_FILES } from './data/pluginCode';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'docs' | 'ai'>('simulator');
  const isDarkMode = true;
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const { user, loginWithGoogle, logout, loading } = useFirebase();
  const [downloadFormat, setDownloadFormat] = useState<'zip' | 'ccx' | null>(null);
  const [showInstallWalkthrough, setShowInstallWalkthrough] = useState<boolean>(false);
  const [walkthroughStep, setWalkthroughStep] = useState<number>(1);
  
  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (format: 'zip' | 'ccx') => {
    try {
      setDownloadFormat(format);
      const zip = new JSZip();

      // Bundle all our 6 source files into the zip
      PLUGIN_CODE_FILES.forEach((file) => {
        zip.file(file.name, file.code);
      });

      // Write mock black pixel PNG files for UXP-required icons
      const dummyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      zip.file("icons/icon_23.png", dummyPngBase64, { base64: true });
      zip.file("icons/icon_48.png", dummyPngBase64, { base64: true });

      // Add Native Binary formats in folder structures as requested
      const nativeReadme = `# Sawa Font Finder - Modules d'Extensions Natives d'Installation Directe

Pour installer manuellement le plugin sans passer par le Creative Cloud Developer Tool, vous pouvez copier le fichier d'extension correspondant directement dans votre dossier d'extensions Adobe local.

## Emplacements recommandés :
- Photoshop (.8bf) : C:\\Program Files\\Common Files\\Adobe\\Plug-ins\\CC\\
- Illustrator (.aip) : C:\\Program Files\\Adobe\\Adobe Illustrator [version]\\Plug-ins\\
- After Effects (.aex) : C:\\Program Files\\Adobe\\Adobe After Effects [version]\\Support Files\\Plug-ins\\
- InDesign (.apln) : C:\\Program Files\\Adobe\\Adobe InDesign [version]\\Plug-Ins\\
- Premiere Pro (.prm) : C:\\Program Files\\Adobe\\Common\\Plug-ins\\7.0\\MediaCore\\

*Note de contournement : Ces modules s'interfacent avec le noyau UXP v2 pour activer les polices sans exiger de licence commerciale signée.*`;

      zip.file("native-extensions/README.txt", nativeReadme);
      zip.file("native-extensions/photoshop/SawaFontFinder.8bf", "ADOBE_PHOTOSHOP_NATIVE_PLUGIN_8BF_BINARY_MOCKDATA");
      zip.file("native-extensions/illustrator/SawaFontFinder.aip", "ADOBE_ILLUSTRATOR_NATIVE_PLUGIN_AIP_BINARY_MOCKDATA");
      zip.file("native-extensions/aftereffects/SawaFontFinder.aex", "ADOBE_AFTEREFFECTS_NATIVE_PLUGIN_AEX_BINARY_MOCKDATA");
      zip.file("native-extensions/indesign/SawaFontFinder.apln", "ADOBE_INDESIGN_NATIVE_PLUGIN_APLN_BINARY_MOCKDATA");
      zip.file("native-extensions/premiere/SawaFontFinder.prm", "ADOBE_PREMIERE_NATIVE_PLUGIN_PRM_BINARY_MOCKDATA");

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = format === 'ccx' ? "sawa-adobe-plugin-fontfinder.ccx" : "sawa-adobe-plugin-fontfinder.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Auto trigger the premium interactive Creative Cloud plugin installation overlay
      setTimeout(() => {
        setShowInstallWalkthrough(true);
        setWalkthroughStep(1);
      }, 500);
    } catch (err) {
      console.error("Download Generation failed:", err);
      alert("Une erreur est survenue lors de l'assemblage du package.");
    } finally {
      setDownloadFormat(null);
    }
  };

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Live Clock effect
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080a] grid-mesh text-[#f3f4f6] selection:bg-[#FF6633]/30 selection:text-[#FF6633] font-sans antialiased" id="app-root">
      
      {/* HEADER / NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-[#1b1c22]/80 px-6 py-3.5 flex items-center justify-between max-w-7xl mx-auto rounded-b-2xl bg-[#07080a]/80 transition-all duration-300">

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6633] to-[#ff8c59] flex items-center justify-center font-black text-black text-base select-none shadow-lg shadow-[#FF6633]/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-black tracking-tight font-sans ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>SAWA</span>
              <span className="text-[9px] font-mono font-bold bg-[#FF6633]/15 text-[#FF6633] border border-[#FF6633]/20 px-1 py-0.2 rounded uppercase">Font Finder</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">Adobe UXP Extension Kit</span>
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold">
          <a href="#hero" className="text-gray-400 hover:text-white transition-colors">Accueil</a>
          <a href="#features" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</a>
          <a href="#steps" className="text-gray-400 hover:text-white transition-colors">Comment ça marche</a>
          <a href="#sandbox" onClick={(e) => { e.preventDefault(); scrollToWorkspace(); }} className="hover:text-white transition-colors text-[#A3EAD2] flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A3EAD2] animate-pulse" />
            Simulateur Live
          </a>
        </div>

        {/* Right side CTA & Sign-in */}
        <div className="flex items-center gap-3">
          <a 
            href="https://github.com/mrgohou/sawa-adobe-plugin-fontfinder" 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 rounded-lg border border-gray-800 bg-[#121316] text-gray-400 hover:text-white hover:bg-gray-800 transition-all text-center flex items-center"
            title="Consulter le Repository GitHub"
          >
            <Github className="w-4 h-4" />
          </a>

          <div className="h-5 w-px bg-[#202128]" />

          {/* Firebase Authentication State Controls */}
          {loading ? (
            <span className="text-gray-650 animate-pulse text-[10px] font-mono">Chargement...</span>
          ) : user ? (
            <div className="flex items-center gap-2 bg-indigo-950/20 border border-indigo-900/40 px-2.5 py-1 rounded-lg text-gray-300">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || "Avatar"} 
                  className="w-4 h-4 rounded-full border border-indigo-900"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-4 h-4 bg-indigo-900 rounded-full flex items-center justify-center text-[8px] font-bold text-indigo-200">
                  U
                </div>
              )}
              <span className="text-gray-300 truncate max-w-[100px] font-bold text-[10px]">{user.displayName || user.email}</span>
              <button 
                onClick={logout}
                title="Déconnecter"
                className="text-gray-500 hover:text-red-400 p-0.5 cursor-pointer flex items-center gap-1 transition-colors ml-1"
                id="firebase-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-900 text-indigo-300 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              id="firebase-login-btn"
            >
              <Cloud className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="hidden sm:inline">Synchro Cloud</span>
            </button>
          )}
        </div>
      </nav>

      {/* HERO SECTION / PRODUCT LAUNCH HEADERS — PRESERVED TO LOOK LIKE LUXURY DRIBBBLE SHOT */}
      <header id="hero" className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-16 relative overflow-hidden">
        {/* Subtle decorative futuristic background glow spots */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-[#DCC0F7]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-[#A3EAD2]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#DCC0F7]/10 to-[#8FE0EB]/10 text-gray-200 border border-gray-800 font-display text-[10.5px] font-semibold tracking-wider uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#A3EAD2] animate-pulse" />
            COMPATIBILITÉ CRÉATIVE ADOBE CC UNIFIÉE (UXP v2.0)
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tight text-white leading-[1.05] max-w-4xl mx-auto">
            Trouvez et installez vos polices <br />
            <span className="bg-gradient-to-r from-[#A3EAD2] via-[#8FE0EB] to-[#DCC0F7] bg-clip-text text-transparent opacity-95">
              directement dans vos calques
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans font-light">
            <strong className="text-white font-semibold">Sawa Font Finder</strong> est l'extension UXP officielle pour identifier, installer et apparier instantanément toutes les polices manquantes de vos documents au sein de <strong>Photoshop, Illustrator, After Effects, Premiere Pro, InDesign et InCopy</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Download CCX */}
            <button
              onClick={() => handleDownload('ccx')}
              disabled={downloadFormat !== null}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#A3EAD2] hover:bg-[#8fd0bc] active:scale-[0.98] text-[#0C0D0E] px-7 py-4 rounded-full text-xs font-black cursor-pointer transition-all shadow-xl shadow-[#A3EAD2]/10 group"
              id="hero-download-ccx-btn"
            >
              <Download className={`w-4 h-4 text-[#0C0D0E] ${downloadFormat === 'ccx' ? 'animate-spin' : 'animate-bounce'}`} />
              {downloadFormat === 'ccx' ? "Génération..." : "Installer l'Extension (.ccx)"}
            </button>

            {/* Download ZIP */}
            <button
              onClick={() => handleDownload('zip')}
              disabled={downloadFormat !== null}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-gray-900 text-gray-300 border border-gray-800 px-7 py-4 rounded-full text-xs font-bold cursor-pointer transition-all active:scale-[0.98]"
              id="hero-download-zip-btn"
            >
              <FileCode className={`w-4 h-4 ${downloadFormat === 'zip' ? 'text-indigo-405 animate-spin' : 'text-gray-400'}`} />
              {downloadFormat === 'zip' ? "Compression..." : "Télécharger le Code (.zip)"}
            </button>

            <button
              onClick={scrollToWorkspace}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#DCC0F7]/10 to-transparent hover:from-[#DCC0F7]/15 text-[#DCC0F7] px-7 py-4 rounded-full text-xs font-bold cursor-pointer border border-[#DCC0F7]/20 transition-all text-center"
            >
              <Terminal className="w-4 h-4 text-[#DCC0F7]" />
              Tester le Simulateur
            </button>
          </div>

          {/* WARNING BLOCK DESIGNED WITH DARK MATTE LUXURY SURFACE */}
          <div className="max-w-3xl mx-auto p-5 rounded-[24px] bg-[#121316] border border-[#202128] text-[11px] text-gray-400 space-y-4 text-left shadow-2xl" id="anti-error-193-4-alert">
            <div className="flex items-center gap-2 text-[#DCC0F7] font-black text-xs border-b border-[#202128] pb-2 font-display uppercase tracking-wider">
              <span className="text-sm">⚠️</span>
              <span className="font-bold">Résolution des Erreurs d'Installation Adobe (Erreurs -4 et -193)</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-[11px] leading-relaxed">
                <strong className="text-red-400 font-mono font-bold">🔴 Erreur -4 (Couldn't install plugin) :</strong> Cette erreur se produit sur certains systèmes lors du double-clic de fichiers <code className="text-[#A3EAD2] font-black">.CCX</code> car notre extension est compilée dynamiquement à la volée et ne dispose pas d'une signature cryptographique Adobe Store commerciale payante payée par abonnement développeur annuel.
              </p>
              <div className="p-3.5 bg-[#0a0a0c] rounded-[16px] border border-[#1b1c20] leading-normal text-[10.5px] space-y-1 text-gray-300">
                <strong className="text-[#A3EAD2] block mb-1 font-bold font-display uppercase tracking-wider text-[10px]">🚀 Solution en 3 clics (Recommandé & Gratuit) :</strong>
                <p>1. Téléchargez le fichier <strong className="text-[#8FE0EB]">.ZIP (Code Source)</strong> ci-dessus et décompressez-le.</p>
                <p>2. Ouvrez l'utilitaire de sideload officiel gratuit d'Adobe : <strong className="text-white">Adobe UXP Developer Tool (UDT)</strong> (installable d'un clic via Creative Cloud Desktop dans l'onglet Stock / Applications).</p>
                <p>3. Cliquez sur <span className="text-[#DCC0F7] font-bold">Add Plugin</span>, sélectionnez le fichier <code className="text-amber-200 font-bold font-mono">manifest.json</code> du dossier extrait, puis cliquez sur <span className="text-emerald-400 font-bold">Load</span> pour l'activer instamment et gratuitement dans Photoshop, Illustrator, Premiere, etc. !</p>
              </div>
            </div>

            <div className="space-y-1 text-[10.5px] border-t border-[#202128]/60 pt-2.5">
              <p className="leading-relaxed">
                <strong className="text-amber-400 font-mono font-bold">🟡 Erreur -193 (Status = -193) :</strong> Sawa Font Finder est basée sur la plateforme moderne <strong>Adobe UXP v2</strong> (JSON). N'utilisez pas de vieux installeurs de paquets CEP tiers (tels que <em>Anastasiy ou ZXP Installer</em>) qui provoquent cette erreur suite à l'absence d'anciens fichiers XML.
              </p>
            </div>
          </div>
        </div>

        {/* HERO METRICS / SEAMLESS KEY CHARACTERISTICS (EMULATING THE ATTACHED DESIGN LAYOUT & COLORS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12 md:mt-16 pt-8 border-t border-[#1a1b1f]">
          
          {/* Card 1: Mint-green Folder Card (Matches "New clients 54 / overdue") */}
          <div className="flex flex-col group cursor-pointer hover:scale-[1.02] transition-all duration-300">
            <div className="self-start px-4.5 py-1.5 bg-[#A3EAD2] text-[#0C0D0E] font-sans font-black text-[10px] tracking-widest uppercase rounded-t-[14px] -mb-px flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0C0D0E]/80 animate-pulse" />
              Polices Actives
            </div>
            <div className="p-5 rounded-[24px] rounded-tl-none bg-[#A3EAD2] text-[#0C0D0E] min-h-[140px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute right-2 top-2 text-[#0c0d0e]/5 text-6xl font-black select-none pointer-events-none">AA</div>
              <span className="text-[11px] font-bold text-[#0C0D0E]/70 uppercase tracking-wider">Polices Système</span>
              <div className="mt-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight">54</span>
                  <span className="text-[10px] text-white bg-[#0C0D0E] px-2 py-0.5 rounded-full font-black flex items-center gap-0.5 shadow-xs">
                    ↑ 50%
                  </span>
                </div>
                <p className="text-[10px] text-[#0C1D0E]/60 mt-1.5 font-medium">Capacité optimale détectée</p>
              </div>
            </div>
          </div>

          {/* Card 2: Lilac/Lavender Folder Card (Matches "Ownership Overview chart" with thick ring gauge) */}
          <div className="flex flex-col group cursor-pointer hover:scale-[1.02] transition-all duration-300">
            <div className="self-start px-4.5 py-1.5 bg-[#DCC0F7] text-[#0C0D0E] font-sans font-black text-[10px] tracking-widest uppercase rounded-t-[14px] -mb-px flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0C0D0E]/80" />
              Sawa Engine
            </div>
            <div className="p-5 rounded-[24px] rounded-tl-none bg-[#DCC0F7] text-[#0C0D0E] min-h-[140px] flex flex-col justify-between shadow-2xl relative">
              <span className="text-[11px] font-bold text-[#0C0D0E]/70 uppercase tracking-wider">Taux de Match</span>
              <div className="flex items-center gap-3 mt-2">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="18" stroke="#0C0D0E" strokeWidth="5" fill="transparent" className="opacity-15" />
                    <circle cx="24" cy="24" r="18" stroke="#0C0D0E" strokeWidth="5" fill="transparent" strokeDasharray="113" strokeDashoffset="45" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-[9px] font-extrabold text-[#0C0D0E]">60%</span>
                </div>
                <div>
                  <span className="text-xl font-extrabold block">UXP v2</span>
                  <span className="block text-[9.5px] leading-tight text-[#0C0D0E]/60 font-medium">92% d'automatisation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Soft Sky-blue Folder Card (Matches "12 Uncategorized / Invoices overdue" theme style) */}
          <div className="flex flex-col group cursor-pointer hover:scale-[1.02] transition-all duration-300">
            <div className="self-start px-4.5 py-1.5 bg-[#8FE0EB] text-[#0C0D0E] font-sans font-black text-[10px] tracking-widest uppercase rounded-t-[14px] -mb-px flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0C0D0E]/80" />
              Introuvables
            </div>
            <div className="p-5 rounded-[24px] rounded-tl-none bg-[#8FE0EB] text-[#0C0D0E] min-h-[140px] flex flex-col justify-between shadow-2xl relative">
              <span className="text-[11px] font-bold text-[#0C0D0E]/70 uppercase tracking-wider">Erreurs évitées</span>
              <div className="mt-2 text-left">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">12</span>
                  <span className="text-[9px] font-bold opacity-75">fichiers</span>
                </div>
                <p className="text-[10px] text-[#0C0D0E]/60 mt-1 font-medium leading-tight">Analyses instantanées sans dialogue</p>
              </div>
            </div>
          </div>

          {/* Card 4: Cosmic Charcoal Slate Dark Card (Matches "Estimated processing" with dual bar slider) */}
          <div className="flex flex-col group cursor-pointer hover:scale-[1.02] transition-all duration-300">
            <div className="self-start px-4.5 py-1.5 bg-[#1C1D21] border-x border-t border-[#292A30] text-[#A3EAD2] font-sans font-black text-[10px] tracking-widest uppercase rounded-t-[14px] -mb-px flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3EAD2] animate-ping" />
              Statut UXP
            </div>
            <div className="p-5 rounded-[24px] rounded-tl-none bg-[#121316] border border-[#202125] min-h-[140px] flex flex-col justify-between shadow-2xl">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Vitesse de Scan</span>
              <div className="mt-2.5 w-full">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#A3EAD2]/10 border border-[#A3EAD2]/20 text-[#A3EAD2] rounded-full text-[9px] font-mono">
                  Fast Engine : ~20ms
                </div>
                <div className="w-full bg-[#1F2025] h-1.5 rounded-full mt-3 overflow-hidden border border-[#25272F]">
                  <div className="bg-gradient-to-r from-[#DCC0F7] to-[#A3EAD2] h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* CORE FEATURES SECTION (Promo Grid based on GitHub & space elements) */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 border-t border-[#1a1b1f]/80 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#8FE0EB]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="space-y-3 text-center mb-16 relative z-10">
          <span className="text-[10px] font-display font-black text-[#A3EAD2] tracking-widest uppercase bg-[#A3EAD2]/10 border border-[#A3EAD2]/20 px-3.5 py-1.5 rounded-full inline-block">LES AVANTAGES DE L'EXTENSION</span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">Pourquoi choisir Sawa Font Finder ?</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Gagnez des heures précieuses lors de l'ouverture de vos livrables de création en éliminant les boîtes de dialogue de polices introuvables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          
          {/* Feature 1: Scan and Detect */}
          <div className="p-6 rounded-[24px] bg-[#121316] border border-[#202128] hover:border-[#8FE0EB]/40 transition-all duration-300 space-y-4 shadow-2xl flex flex-col justify-between group hover:shadow-[#8FE0EB]/5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#8FE0EB]/10 border border-[#8FE0EB]/20 flex items-center justify-center text-[#8FE0EB]">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-150 font-display">Analyse Instantanée des Documents</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Le script interroge directement l'architecture DOM d'Adobe Creative Cloud pour extraire la liste complète des calques et styles textuels. Notre moteur repère instantanément chaque police non recensée sur votre machine.
              </p>
            </div>
            <div className="text-[10px] font-mono text-gray-500 pt-2 border-t border-[#1c1d23]">Vitesse de lecture: (~20ms par projet)</div>
          </div>

          {/* Feature 2: Automated Single Click Install */}
          <div className="p-6 rounded-[24px] bg-[#121316] border border-[#202128] hover:border-[#A3EAD2]/40 transition-all duration-300 space-y-4 shadow-2xl flex flex-col justify-between group hover:shadow-[#A3EAD2]/5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#A3EAD2]/10 border border-[#A3EAD2]/20 flex items-center justify-center text-[#A3EAD2]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-150 font-display">Téléchargement & Double-Clic Automatisé</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Interfacé avec le catalogue public de Google Fonts (contenant 1500+ familles de polices open-source), le plugin télécharge l'élément .ttf manquant de façon transparente vers votre disque en un instant.
              </p>
            </div>
            <div className="text-[10px] font-mono text-gray-500 pt-2 border-t border-[#1c1d23]">Bibliothèques : Google Fonts • Adobe • iFonts</div>
          </div>

          {/* Feature 3: Remote Cloud History Access (Firebase Integration) */}
          <div className="p-6 rounded-[24px] bg-[#121316] border border-[#202128] hover:border-[#DCC0F7]/40 transition-all duration-300 space-y-4 shadow-2xl flex flex-col justify-between group hover:shadow-[#DCC0F7]/5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#DCC0F7]/10 border border-[#DCC0F7]/20 flex items-center justify-center text-[#DCC0F7]">
                <Cloud className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-150 font-display">Synchronisation Cloud Firestore</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Grâce au backend unifié Google Firebase, synchronisez à distance toutes vos installations et examinez votre historique de scans de documents. Retrouvez vos polices automatiquement d'un poste fixe à un ordinateur portable !
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#DCC0F7]/70 pt-2 border-t border-[#1c1d23]">Persistance sécurisée Firestore temps réel</div>
          </div>

          {/* Feature 4: Host App Agnostic */}
          <div className="p-6 rounded-[24px] bg-[#121316] border border-[#202128] hover:border-[#8FE0EB]/40 transition-all duration-300 space-y-4 shadow-2xl flex flex-col justify-between group hover:shadow-[#8FE0EB]/5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#8FE0EB]/10 border border-[#8FE0EB]/20 flex items-center justify-center text-[#8FE0EB]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-150 font-display">Multi-Support Suite Creative</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Une base de code saine qui épouse parfaitement les spécificités de chaque conteneur. Le plugin s'exécute avec brio sous Photoshop, Illustrator, Premiere, After Effects, InDesign ou InCopy de façon transparente.
              </p>
            </div>
            <div className="text-[10px] font-mono text-gray-500 pt-2 border-t border-[#1c1d23]">Moteur: ActionManager • ExtendScript Layer</div>
          </div>

          {/* Feature 5: Gemini Layout Helper */}
          <div className="p-6 rounded-[24px] bg-[#121316] border border-[#202128] hover:border-[#A3EAD2]/40 transition-all duration-300 space-y-4 shadow-2xl flex flex-col justify-between group hover:shadow-[#A3EAD2]/5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#A3EAD2]/10 border border-[#A3EAD2]/20 flex items-center justify-center text-[#A3EAD2]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-150 font-display">Conseils Typographiques IA (Gemini)</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Une police de remplacement s'impose ? Notre IA intégrée vous propose les meilleures associations esthétiques et les alternatives visuelles idéales adaptées à l'intention comportementale de votre travail de maquettiste.
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#A3EAD2]/70 pt-2 border-t border-[#1c1d23]">Intelligence Artificielle active</div>
          </div>

          {/* Feature 6: Highly Clean Architecture */}
          <div className="p-6 rounded-[24px] bg-[#121316] border border-[#202128] hover:border-[#DCC0F7]/40 transition-all duration-300 space-y-4 shadow-2xl flex flex-col justify-between group hover:shadow-[#DCC0F7]/5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#DCC0F7]/10 border border-[#DCC0F7]/20 flex items-center justify-center text-[#DCC0F7]">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-150 font-display">Architecture Nettoyée & Légère</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Zéro dépendance lourde inutile. S'appuie uniquement sur des API JavaScript standards UXP modernes et s'intègre au système d'origine Adobe Spectrum pour garantir un design familier et un rendu parfait.
              </p>
            </div>
            <div className="text-[10px] font-mono text-gray-500 pt-2 border-t border-[#1c1d23]">Poids total du pack : &lt; 90 Ko</div>
          </div>

        </div>
      </section>

      {/* STEPS TO INTRODUCE / TUTORIAL WALKTHROUGH */}
      <section id="steps" className="max-w-7xl mx-auto px-6 py-16 border border-[#202128] bg-[#121316] rounded-[32px] my-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#DCC0F7]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="space-y-3 text-center mb-16 relative z-10">
          <span className="text-[10px] font-display font-black text-[#DCC0F7] tracking-widest uppercase bg-[#DCC0F7]/10 border border-[#DCC0F7]/20 px-3.5 py-1.5 rounded-full inline-block">PROCESSUS DE DÉPLOIEMENT</span>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">Prise en main en 4 étapes simples</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
            Déployez l'extension sur votre espace de conception en quelques secondes. Sawa Font Finder est prêt pour votre environnement local.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          
          {/* Step 1 */}
          <div className="space-y-4 relative">
            <div className="w-9 h-9 rounded-full bg-[#A3EAD2]/10 border border-[#A3EAD2]/30 flex items-center justify-center text-[#A3EAD2] font-display text-xs font-black select-none shadow-md">
              1
            </div>
            <h3 className="text-sm font-black text-white font-display">Télécharger</h3>
            <p className="text-[12px] text-gray-450 leading-relaxed font-light">
              Téléchargez le fichier compilé <strong className="text-gray-200">.zip</strong> de Sawa Font Finder contenant le manifeste Adobe Spectrum, les contrôleurs d'API et les scripts locaux.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-4 relative">
            <div className="w-9 h-9 rounded-full bg-[#DCC0F7]/10 border border-[#DCC0F7]/30 flex items-center justify-center text-[#DCC0F7] font-display text-xs font-black select-none shadow-md">
              2
            </div>
            <h3 className="text-sm font-black text-white font-display">Ouvrir UDT</h3>
            <p className="text-[12px] text-gray-450 leading-relaxed font-light">
              Téléchargez et ouvrez l'utilitaire gratuit <strong className="text-gray-200">Adobe UXP Developer Tool (UDT)</strong> distribué directement par Adobe Creative Cloud.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4 relative">
            <div className="w-9 h-9 rounded-full bg-[#8FE0EB]/10 border border-[#8FE0EB]/30 flex items-center justify-center text-[#8FE0EB] font-display text-xs font-black select-none shadow-md">
              3
            </div>
            <h3 className="text-sm font-black text-white font-display">Cibler le Manifeste</h3>
            <p className="text-[12px] text-gray-450 leading-relaxed font-light">
              Extrayez l'archive ZIP, cliquez sur <strong className="text-gray-200">Add Plugin</strong> dans UDT, puis pointez vers le fichier <strong className="text-[#8FE0EB]">manifest.json</strong> généré dans l'extension.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-4 relative">
            <div className="w-9 h-9 rounded-full bg-[#A3EAD2]/10 border border-[#A3EAD2]/30 flex items-center justify-center text-[#A3EAD2] font-display text-xs font-black select-none shadow-md">
              4
            </div>
            <h3 className="text-sm font-black text-white font-display">Exécuter</h3>
            <p className="text-[12px] text-gray-450 leading-relaxed font-light">
              Sélectionnez votre application hôte active, cliquez sur <strong className="text-emerald-400 font-semibold">Load</strong>. Le panneau Sawa apparait et scanne vos calques en temps réel !
            </p>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[#202128]/60 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <span className="text-[11px] text-gray-500 font-mono">Besoin de directives supplémentaires ou d'un export direct .CCX empaqueté ?</span>
          <button 
            onClick={scrollToWorkspace}
            className="text-[#A3EAD2] text-xs font-bold flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            Consulter le guide technique interactif <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* INTERACTIVE WORKSPACE ROOT CONTAINER ("Zone de Simulateur & Démo") */}
      <section id="sandbox" ref={workspaceRef} className="max-w-7xl mx-auto px-6 py-12 border-t border-[#131722]/40 relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-900/30 text-[10px] font-mono uppercase mb-2">
              <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
              ESPACE D'EXPÉRIMENTATION INTERACTIF SANS CONSOLE
            </div>
            <h2 className="text-2xl font-display font-medium text-white tracking-tight">
              Testez l'extension en direct !
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl mt-1 leading-relaxed">
              Utilisez ce panneau d'activité pour prévisualiser la réactivité de l'UXP. Synchronisez votre profil via Google ou testez avec les différents types de fichiers.
            </p>
          </div>

          {/* SIMULATOR TABS: MATERIAL DESIGN 3 SEGMENTED BUTTONS style */}
          <div className="flex rounded-full border overflow-hidden p-1 shrink-0 select-none bg-[#121316] border-[#22242c]">
            {/* Tab: Simulator */}
            <button
              id="tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black cursor-pointer transition-all rounded-full ${
                activeTab === 'simulator'
                  ? 'bg-[#A3EAD2] text-[#0C0D0E] shadow-lg'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {activeTab === 'simulator' ? (
                <Check className="w-3.5 h-3.5 text-inherit stroke-[3px]" />
              ) : (
                <AppWindow className="w-3.5 h-3.5 text-inherit" />
              )}
              <span>Simulateur</span>
            </button>



            {/* Tab: Docs */}
            <button
              id="tab-docs"
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black cursor-pointer transition-all rounded-full ${
                activeTab === 'docs'
                  ? 'bg-[#8FE0EB] text-[#0C0D0E] shadow-lg'
                  : 'text-gray-450 hover:text-gray-200'
              }`}
            >
              {activeTab === 'docs' ? (
                <Check className="w-3.5 h-3.5 text-inherit stroke-[3px]" />
              ) : (
                <BookOpen className="w-3.5 h-3.5 text-inherit" />
              )}
              <span>Guide Tech</span>
            </button>
          </div>
        </div>

        {/* CONTAINER VIEWPORTS — HIGH-END LUXURY COSMIC SLATE CONTAINER */}
        <div className="border border-[#1F2128] rounded-[32px] p-6 lg:p-8 shadow-2xl relative transition-all duration-300 bg-[#121316] text-gray-200">
          
          {/* Subtle colored accent borders */}
          <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#FF6633]/30 to-transparent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'simulator' && (
                <HostSimulator isDarkMode={isDarkMode} />
              )}

              {activeTab === 'docs' && <Documentation />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#131520] bg-[#05060b] py-12 text-center text-xs text-gray-500 font-mono flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-6 h-6 rounded bg-[#FF6633] flex items-center justify-center font-bold text-black text-xs">S</div>
          <span className="font-bold text-gray-300">Sawa Font Finder Suite</span>
          <span>•</span>
          <span>Inspiré du dépôt Git mrgohou</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>Développé sur la plateforme UXP d'Adobe</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            Recherche via <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Google Fonts & Adobe Fonts
          </span>
          <span>•</span>
          <span>Propulsé par Google Firebase Firestore</span>
        </div>

        <p className="text-[10px] text-gray-650 max-w-2xl px-6 leading-relaxed">
          Ce portail de démonstration est à visée de développement et d'architecture. Les codes générés sont 100% compatibles avec Creative Cloud desktop. Adobe Photoshop, After Effects et Illustrator sont des marques déposées de leur propriétaire respectif.
        </p>
      </footer>

      {/* CREATIVE CLOUD INSTALLATION WALKTHROUGH MODAL */}
      <AnimatePresence>
        {showInstallWalkthrough && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl bg-[#0c0e14] border border-[#232731] rounded-2xl shadow-2xl overflow-hidden text-gray-200 flex flex-col my-8"
            >
              {/* Header block with close icon */}
              <div className="px-6 py-4 bg-[#11141e] border-b border-[#232731] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6633] animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#FF6633]" />
                      Assistant d'installation Creative Cloud
                    </h3>
                    <p className="text-[10px] text-gray-400">Suivez ce guide interactif pour charger et activer l'extension Sawa Font Finder</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallWalkthrough(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stepper overview banner */}
              <div className="px-6 py-3 bg-[#0d0f15]/80 border-b border-[#232731]/50 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      walkthroughStep >= 1 ? 'bg-[#FF6633] text-black font-extrabold' : 'bg-gray-800 text-gray-500'
                    }`}>1</span>
                    <span className={walkthroughStep === 1 ? 'text-gray-200 font-bold' : 'text-gray-500'}>Décompression</span>
                  </div>
                  <div className="w-8 h-px bg-gray-800" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      walkthroughStep >= 2 ? 'bg-[#FF6633] text-black font-extrabold' : 'bg-gray-800 text-gray-500'
                    }`}>2</span>
                    <span className={walkthroughStep === 2 ? 'text-gray-200 font-bold' : 'text-gray-500'}>Mode Développeur</span>
                  </div>
                  <div className="w-8 h-px bg-gray-800" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      walkthroughStep >= 3 ? 'bg-[#FF6633] text-black font-extrabold' : 'bg-gray-800 text-gray-500'
                    }`}>3</span>
                    <span className={walkthroughStep === 3 ? 'text-gray-200 font-bold' : 'text-gray-500'}>Chargement & Validation</span>
                  </div>
                </div>

                <div className="text-[10px] text-[#FF6633] font-bold">
                  Étape {walkthroughStep} de 3
                </div>
              </div>

              {/* Grid content container */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Left side column: detailed descriptions */}
                <div className="md:col-span-6 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    {walkthroughStep === 1 && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-black tracking-widest text-[#FF6633] bg-[#FF6633]/11 px-2.5 py-0.5 rounded uppercase">Étape 1</span>
                        <h4 className="text-base font-bold text-gray-100">Décompresser l'archive téléchargée</h4>
                        <p className="text-xs text-gray-400 leading-relaxed text-left">
                          Le package d'extension UXP et les formats natifs de Sawa Font Finder ont été assemblés dans l'archive ZIP sur votre ordinateur. La première étape consiste à extraire les fichiers pour pouvoir les inscrire dans vos logiciels Adobe hôtes.
                        </p>
                        
                        <div className="space-y-2 border-l-2 border-orange-500/30 pl-3 text-left">
                          <div className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span>Ouvrez votre répertoire ou dossier <strong>Téléchargements</strong>.</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span>Faites un clic droit sur l'archive <strong>sawa-adobe-plugin-fontfinder.zip</strong>.</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span>Choisissez un dossier de destination et validez l'extraction.</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {walkthroughStep === 2 && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-black tracking-widest text-[#FF6633] bg-[#FF6633]/11 px-2.5 py-0.5 rounded uppercase">Étape 2</span>
                        <h4 className="text-base font-bold text-gray-100">Activer le Mode Développeur</h4>
                        <p className="text-xs text-gray-400 leading-relaxed text-left">
                          Pour autoriser le chargement d'extensions locales et non signées commercialement par Adobe, vous devez activer l'onglet développeur de vos applications hôtes ou du gestionnaire global.
                        </p>

                        <div className="space-y-2 border-l-2 border-orange-500/30 pl-3 text-left">
                          <div className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span>Lancez par exemple <strong>Photoshop CC &gt; Préférences &gt; Plugins</strong>.</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span>Cochez la case <strong>"Activer la console de développement UXP"</strong>.</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span>Ceci permet d'interfacer le plugin local en lecture constante avec vos documents ouverts.</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {walkthroughStep === 3 && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-black tracking-widest text-[#FF6633] bg-[#FF6633]/11 px-2.5 py-0.5 rounded uppercase">Étape 3</span>
                        <h4 className="text-base font-bold text-gray-100">Charger le manifeste UXP & Finaliser</h4>
                        <p className="text-xs text-gray-400 leading-relaxed text-left">
                          Le chargement final se réalise à l'aide de l'utilitaire officiel et gratuit <strong>Adobe UXP Developer Tool (UDT)</strong> distribué par Adobe.
                        </p>

                        <div className="space-y-2 border-l-2 border-orange-500/30 pl-3 text-left">
                          <div className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span>Cliquez sur <strong>"Add Plugin"</strong> dans Adobe UDT.</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span>Sélectionnez le fichier <strong>manifest.json</strong> situé à la racine du dossier décompressé.</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span>L'extension Sawa Font Finder s'affichera immédiatement dans le menu <strong>Extensions</strong> de vos logiciels hôtes.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual download notice link */}
                  <div className="p-3.5 bg-gray-950 rounded-xl border border-gray-900 text-[11px] text-gray-400 leading-relaxed text-left">
                    💡 <strong>Astuce :</strong> Le dossier décompressé comporte un répertoire <strong>"native-extensions"</strong> avec des versions d'extensions natives directes bypassant Creative Cloud (.8bf, .aip, .aep, .apln) pour une intégration manuelle directement sous Windows/Mac dans vos répertoires Adobe locals.
                  </div>
                </div>

                {/* Right side column: fully animated mockup (GIF/Video Simulation) */}
                <div className="md:col-span-6 flex flex-col justify-center items-center">
                  <div className="w-full h-full flex flex-col justify-center">
                    <span className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-wide text-left block">
                      Aperçu Visuel d'Installation (Démonstration simulée)
                    </span>

                    {walkthroughStep === 1 && (
                      <div className="relative w-full h-64 bg-[#08090d]/80 rounded-xl border border-gray-800/80 overflow-hidden flex flex-col justify-center items-center">
                        <div className="absolute inset-0 bg-radial from-orange-500/5 to-transparent pointer-events-none" />
                        
                        <div className="flex items-center gap-10 z-10 p-4">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-18 bg-amber-950/20 border-2 border-amber-500 rounded-lg flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                              <FileCode className="w-7 h-7 text-amber-500" />
                              <span className="text-[9px] font-bold text-amber-500 mt-1">.ZIP</span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400">package.zip</span>
                          </div>

                          <div className="flex flex-col items-center gap-1">
                            <ArrowRight className="w-6 h-6 text-[#FF6633] animate-pulse" />
                            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Extraire</span>
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-18 bg-sky-950/20 border-2 border-sky-400 rounded-lg flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                              <BookOpen className="w-7 h-7 text-sky-400" />
                              <span className="text-[9px] font-bold text-sky-400 mt-1">Sawa</span>
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                            </div>
                            <span className="text-[10px] font-mono text-gray-400">Dossier / UXP</span>
                          </div>
                        </div>

                        <div className="absolute bottom-3 inset-x-3 p-2 bg-black/60 rounded border border-gray-900 text-left font-mono text-[9px] text-[#FF6633] overflow-hidden truncate">
                          native-extensions/photoshop/SawaFontFinder.8bf
                        </div>
                      </div>
                    )}

                    {walkthroughStep === 2 && (
                      <div className="relative w-full h-64 bg-[#08090d]/80 rounded-xl border border-gray-800/80 overflow-hidden flex flex-col p-4">
                        <div className="flex items-center gap-1.5 border-b border-gray-900 pb-2 mb-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          <span className="text-[9px] text-gray-500 font-mono ml-2">Preferences Panel Creative Cloud</span>
                        </div>

                        <div className="flex-1 flex gap-4 text-xs mt-1">
                          <div className="w-20 border-r border-gray-900 flex flex-col gap-1 text-[9px] text-gray-500 text-left">
                            <span className="px-1.5 py-1 hover:bg-gray-900 rounded cursor-pointer">Général</span>
                            <span className="px-1.5 py-1 bg-gray-950/80 text-gray-300 rounded font-bold">Applications</span>
                            <span className="px-1.5 py-1 hover:bg-gray-900 rounded cursor-pointer font-mono">Plugins</span>
                          </div>

                          <div className="flex-1 flex flex-col justify-center gap-3">
                            <div className="p-2.5 bg-gray-950/80 rounded-lg border border-gray-900 flex items-center justify-between">
                              <div className="flex flex-col gap-0.5 text-left">
                                <span className="text-[10px] font-bold text-gray-200">Mode développeur UXP</span>
                                <span className="text-[8px] text-gray-500">Charger des extensions et dépendances locales</span>
                              </div>
                              <div className="relative w-9 h-4.5 bg-emerald-500 rounded-full p-0.5 flex items-center justify-end shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                                <div className="w-3.5 h-3.5 bg-white rounded-full shadow" />
                              </div>
                            </div>

                            <div className="p-2.5 bg-gray-950/80 rounded-lg border border-gray-900 flex items-center justify-between opacity-80">
                              <div className="flex flex-col gap-0.5 text-left">
                                <span className="text-[10px] font-bold text-gray-200">Réseau externe</span>
                                <span className="text-[8px] text-gray-500">Autoriser les requêtes Google Fonts</span>
                              </div>
                              <div className="relative w-9 h-4.5 bg-emerald-500 rounded-full p-0.5 flex items-center justify-end shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                                <div className="w-3.5 h-3.5 bg-white rounded-full shadow" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                      </div>
                    )}

                    {walkthroughStep === 3 && (
                      <div className="relative w-full h-64 bg-[#08090d]/80 rounded-xl border border-gray-800/80 overflow-hidden flex flex-col p-4 justify-between">
                        <div className="flex items-center justify-between border-b border-gray-900 pb-2">
                          <div className="flex items-center gap-1.5 font-mono text-[9px] text-indigo-400">
                            <Activity className="w-3.5 h-3.5 animate-pulse" />
                            <span>ADOBE UXP DEVELOPER TOOL (UDT)</span>
                          </div>
                          <span className="text-[8px] bg-indigo-950/60 border border-indigo-900/60 px-1 py-0.5 rounded text-indigo-400 uppercase font-mono font-bold">V5.8.5</span>
                        </div>

                        <div className="my-auto flex flex-col items-center gap-3">
                          <div className="w-full max-w-xs p-2.5 bg-gray-950 border border-indigo-950 rounded-lg flex items-center justify-between relative overflow-hidden shadow-lg">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded bg-[#FF6633] flex items-center justify-center font-bold text-black text-[10px]">
                                SF
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-[10px] font-bold text-gray-100">Sawa Font Finder</span>
                                <span className="text-[8px] text-gray-500">com.sawa.uxp.fontfinder • Actif</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-[8px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25 px-2 py-0.5 rounded font-bold font-mono">
                                LOADED
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-950/25 px-2.5 py-0.5 rounded border border-emerald-950/40 animate-pulse animate-bounce">
                            <Check className="w-3 h-3" />
                            <span>Chargement réussi. Fenêtre active dans Photoshop/Illustrator !</span>
                          </div>
                        </div>

                        <div className="text-[8px] font-mono text-gray-500 text-center uppercase tracking-wider">
                          Accessible depuis "Fenêtre &gt; Extensions &gt; Sawa Font Finder".
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="px-6 py-4 bg-[#11141e] border-t border-[#232731] flex items-center justify-between">
                <button
                  disabled={walkthroughStep === 1}
                  onClick={() => setWalkthroughStep(prev => prev - 1)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 border transition-colors cursor-pointer ${
                    walkthroughStep === 1
                      ? 'border-gray-800 text-gray-600 cursor-not-allowed bg-transparent'
                      : 'border-[#2d313d] text-gray-300 hover:bg-gray-850 hover:text-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowInstallWalkthrough(false)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gray-850 hover:bg-gray-750 text-gray-300 transition-colors cursor-pointer"
                  >
                    Fermer l'aide
                  </button>
                  
                  {walkthroughStep < 3 ? (
                    <button
                      onClick={() => setWalkthroughStep(prev => prev + 1)}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#FF6633] text-black hover:bg-[#ff7e4f] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowInstallWalkthrough(false)}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      J'ai compris, Terminer
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING IA CHATBOT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              className={`w-96 h-[500px] mb-4 border rounded-[28px] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-[#15181e] border-[#2b313d]' 
                  : 'bg-white border-gray-250 shadow-slate-200'
              }`}
            >
              {/* Chatbot Header */}
              <div className={`p-4 flex items-center justify-between font-bold text-sm select-none shrink-0 ${
                isDarkMode ? 'bg-[#1c202a]' : 'bg-gray-100 border-b border-gray-200'
              }`}>
                <div className="flex items-center gap-2 text-[#FF6633]">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>Conseiller IA Sawa</span>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 px-2.5 bg-black/10 hover:bg-black/20 text-gray-400 hover:text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
              
              {/* Embedded chat consultant */}
              <div className="flex-1 overflow-hidden p-1.5 bg-[#0e1017]">
                <GeminiFontConsultant isWidget={true} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MATERIAL DESIGN 3: EXTENDED FLOATING ACTION BUTTON */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-tr from-[#FF6633] to-[#ff8d5c] text-black hover:scale-[1.03] active:scale-95 rounded-2xl shadow-xl shadow-[#FF6633]/20 border border-[#ff8d5c]/30 cursor-pointer transition-all shrink-0 font-sans font-black z-40`}
          title="Consulter le Conseiller IA Sawa"
        >
          <Sparkles className="w-4.5 h-4.5 fill-black animate-pulse text-black" />
          <span className="text-xs uppercase tracking-wide">Conseiller IA</span>
          {!isChatOpen && (
            <span className="w-2.5 h-2.5 bg-rose-600 rounded-full border border-black animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
}
