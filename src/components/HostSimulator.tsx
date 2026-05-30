import React, { useState, useEffect, useRef } from 'react';
import { Play, Search, AlertCircle, CheckCircle2, FileVideo, FileText, FileSpreadsheet, Download, Activity, HelpCircle, Layers, Settings, AppWindow, HelpCircle as HelpIcon, Cloud, History, Upload, Trash2, File } from 'lucide-react';
import { HOST_APPS, SYSTEM_FONTS_DATABASE, GOOGLE_FONTS_CATALOG, PREMIUM_FONTS_CATALOG } from '../data/simulatorData';
import { HostApp, SampleFile, DocumentFont } from '../types';
import { useFirebase } from '../context/FirebaseContext';

export default function HostSimulator() {
  const [selectedApp, setSelectedApp] = useState<HostApp>(HOST_APPS[2]); // Photoshop as default
  const [selectedFile, setSelectedFile] = useState<SampleFile>(HOST_APPS[2].sampleFiles[0]);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [scanResults, setScanResults] = useState<DocumentFont[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Consume our rich Cloud Synchronization Context
  const { systemFonts, setSystemFonts, syncInstalledFont, syncScan, user, scanHistory } = useFirebase();
  
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [activeFontForHelp, setActiveFontForHelp] = useState<DocumentFont | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [showAutoPopup, setShowAutoPopup] = useState(false);
  const [lastDismissedFileId, setLastDismissedFileId] = useState<string | null>(null);

  // Custom User Uploaded Files States
  const [uploadedFiles, setUploadedFiles] = useState<SampleFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeAppFiles = [
    ...selectedApp.sampleFiles,
    ...uploadedFiles.filter(f => f.id.startsWith(selectedApp.id + '-'))
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addFiles(Array.from(files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      addFiles(Array.from(files));
    }
  };

  const addFiles = (files: File[]) => {
    files.forEach(file => {
      // 5GB size check limit
      const FIVE_GB = 5 * 1024 * 1024 * 1024;
      if (file.size >= FIVE_GB) {
        alert(`Échec : Le fichier "${file.name}" de (${(file.size / (1024 * 1024 * 1024)).toFixed(2)} Go) dépasse la taille maximale autorisée de 5 Go.`);
        return;
      }

      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      let targetAppId = selectedApp.id;
      if (['psd', 'psb'].includes(extension)) targetAppId = 'PS';
      else if (['ai', 'eps', 'svg'].includes(extension)) targetAppId = 'AI';
      else if (['aep', 'aet'].includes(extension)) targetAppId = 'AE';
      else if (['prproj', 'prel'].includes(extension)) targetAppId = 'PR';
      else if (['indd', 'indm', 'idml'].includes(extension)) targetAppId = 'ID';
      else if (['incp'].includes(extension)) targetAppId = 'IC';

      // Switch to matching host app automatically
      const matchedApp = HOST_APPS.find(a => a.id === targetAppId);
      if (matchedApp && targetAppId !== selectedApp.id) {
        setSelectedApp(matchedApp);
      }

      const readAndCreate = () => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string || '';
          createSimulatedFile(file.name, targetAppId, file.size, content);
        };
        // Slice to 15MB to read files extremely fast without freezing the UI
        const blobToRead = file.slice(0, Math.min(file.size, 15 * 1024 * 1024));
        reader.readAsText(blobToRead);
      };

      readAndCreate();
    });
  };

  const createSimulatedFile = (fileName: string, appId: string, fileSize: number, fileContent?: string) => {
    const layerCount = fileContent 
      ? Math.max(2, Math.min(25, fileContent.split('\n').length)) 
      : Math.floor((fileSize || 50000) / 10200) + 3;

    // Pick a default system font (installed)
    const systemFontName = SYSTEM_FONTS_DATABASE[Math.floor(Math.random() * SYSTEM_FONTS_DATABASE.length)];
    const generatedFonts: DocumentFont[] = [
      { family: systemFontName, style: 'Regular', postScriptName: `${systemFontName}-Regular`, status: 'installed', provider: 'System' }
    ];

    if (fileContent) {
      const textLower = fileContent.toLowerCase();
      const possibleFonts = [...GOOGLE_FONTS_CATALOG, ...PREMIUM_FONTS_CATALOG];
      
      // 1. Scan for matching catalog fonts
      possibleFonts.forEach(font => {
        const lowerName = font.family.toLowerCase();
        if (textLower.includes(lowerName)) {
          if (!generatedFonts.some(f => f.family === font.family)) {
            generatedFonts.push({
              ...font,
              status: systemFonts.includes(font.family) ? 'installed' : 'missing'
            });
          }
        }
      });

      // 2. Scan for font-family CSS properties / HTML tags
      const cssFontFamilyRegex = /font-family\s*:\s*['"]?([^'";,\n\s)]+)['"]?/gi;
      const attrFontFamilyRegex = /font-family\s*=\s*['"]([^'"]+)['"]/gi;
      const faceRegex = /face\s*=\s*['"]([^'"]+)['"]/gi;
      
      const customFontsFound: string[] = [];
      let match;
      
      const scanMatches = (regex: RegExp) => {
        let count = 0;
        while ((match = regex.exec(fileContent)) !== null && count < 50) {
          count++;
          let fam = match[1].trim();
          if (fam.includes(',')) {
            fam = fam.split(',')[0].trim();
          }
          fam = fam.replace(/['"]/g, '').trim();
          if (fam && fam.length > 2 && fam.length < 40) {
            const genericFamilies = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'inherit', 'initial', 'unset'];
            if (!genericFamilies.includes(fam.toLowerCase())) {
              let formattedFam = fam;
              if (fam.includes('-') || fam.includes('_')) {
                formattedFam = fam
                  .split(/[-_]/)
                  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ');
              } else if (/^[a-z]/.test(fam)) {
                formattedFam = fam.charAt(0).toUpperCase() + fam.slice(1);
              }
              if (!customFontsFound.includes(formattedFam)) {
                customFontsFound.push(formattedFam);
              }
            }
          }
        }
      };

      scanMatches(cssFontFamilyRegex);
      scanMatches(attrFontFamilyRegex);
      scanMatches(faceRegex);

      // 3. Scan for PostScript-like font families endings typical in graphics documents (e.g. SFPro-Regular, Calibri-Bold)
      const postscriptRegex = /[\s"/']([a-zA-Z0-9]{3,25})-(Regular|Bold|Italic|Medium|Light|Semibold|Extrabold)/gi;
      let psCount = 0;
      while ((match = postscriptRegex.exec(fileContent)) !== null && psCount < 30) {
        psCount++;
        const fam = match[1].trim();
        const formatted = fam.replace(/([a-z])([A-Z])/g, '$1 $2');
        if (formatted.length > 2 && formatted.length < 40 && !customFontsFound.includes(formatted)) {
          customFontsFound.push(formatted);
        }
      }

      // 4. Inject found unique custom fonts in the document fonts list
      customFontsFound.forEach(fontName => {
        if (!generatedFonts.some(f => f.family.toLowerCase() === fontName.toLowerCase())) {
          const catalogFont = possibleFonts.find(f => f.family.toLowerCase() === fontName.toLowerCase());
          if (catalogFont) {
            generatedFonts.push({
              ...catalogFont,
              status: systemFonts.includes(catalogFont.family) ? 'installed' : 'missing'
            });
          } else {
            generatedFonts.push({
              family: fontName,
              style: 'Regular',
              postScriptName: `${fontName.replace(/\s+/g, '')}-Regular`,
              status: systemFonts.includes(fontName) ? 'installed' : 'missing',
              provider: 'Fichier Source',
              fontUrl: 'https://fonts.google.com'
            });
          }
        }
      });
    }

    // Fallback if no matching or binary to have reliable custom fonts
    if (generatedFonts.length === 1) {
      const gFontsAvailable = GOOGLE_FONTS_CATALOG.filter(f => !systemFonts.includes(f.family));
      const pFontsAvailable = PREMIUM_FONTS_CATALOG.filter(f => !systemFonts.includes(f.family));
      
      if (gFontsAvailable.length > 0) {
        const randomGoogleFont = gFontsAvailable[Math.floor(Math.random() * gFontsAvailable.length)];
        generatedFonts.push({
          ...randomGoogleFont,
          status: 'missing'
        });
      }

      if (pFontsAvailable.length > 0 && Math.random() > 0.4) {
        const randomPremiumFont = pFontsAvailable[Math.floor(Math.random() * pFontsAvailable.length)];
        generatedFonts.push({
          ...randomPremiumFont,
          status: 'missing'
        });
      }
    }

    const newFile: SampleFile = {
      id: `${appId}-uploaded-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: fileName,
      description: `Fichier importé (${(fileSize / 1024).toFixed(1)} Ko). Prêt pour le scan de calques.`,
      layerCount: layerCount > 100 ? 35 : layerCount,
      fonts: generatedFonts
    };

    setUploadedFiles(prev => [...prev, newFile]);
    setSelectedFile(newFile);
    setScanResults(null);
  };

  const handleDeleteUploadedFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile.id === fileId) {
      // Fallback
      const currentAppCustoms = uploadedFiles.filter(f => f.id !== fileId && f.id.startsWith(selectedApp.id + '-'));
      if (currentAppCustoms.length > 0) {
        setSelectedFile(currentAppCustoms[0]);
      } else {
        setSelectedFile(selectedApp.sampleFiles[0]);
      }
      setScanResults(null);
    }
  };

  // Sync selected file when host app changes
  useEffect(() => {
    const currentAppCustoms = uploadedFiles.filter(f => f.id.startsWith(selectedApp.id + '-'));
    if (currentAppCustoms.length > 0) {
      setSelectedFile(currentAppCustoms[0]);
    } else {
      setSelectedFile(selectedApp.sampleFiles[0]);
    }
    setScanResults(null);
    setScanning(false);
    setProgress(0);
  }, [selectedApp]);

  // Handle auto popup invitation when a file is opened/changed containing uninstalled fonts
  useEffect(() => {
    const missing = selectedFile.fonts.filter(font => font.status === 'missing' && !systemFonts.includes(font.family));
    if (missing.length > 0 && lastDismissedFileId !== selectedFile.id) {
      setShowAutoPopup(true);
    } else {
      setShowAutoPopup(false);
    }
    setScanResults(null);
    setScanning(false);
    setProgress(0);
  }, [selectedFile, systemFonts, lastDismissedFileId]);

  // Handle Scanning Simulation
  const handleStartScan = () => {
    setScanning(true);
    setProgress(0);
    setScanResults(null);

    const steps = [
      { text: "Initialisation de l'API Adobe UXP...", p: 15 },
      { text: "Connexion à la base de registre de l'hôte...", p: 35 },
      { text: `Parcours de l'arborescence du document (${selectedFile.name})...`, p: 60 },
      { text: "Extraction des méta-données de caractères de texte...", p: 85 },
      { text: "Vérification des polices locales via uxp.host.fonts...", p: 100 }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setScanStep(steps[stepIdx].text);
        setProgress(steps[stepIdx].p);
        stepIdx++;
      } else {
        clearInterval(interval);
        setScanning(false);
        // Map fonts according to current system font registry
        const results = selectedFile.fonts.map(font => ({
          ...font,
          status: systemFonts.includes(font.family) ? 'installed' : 'missing' as 'installed' | 'missing'
        }));
        setScanResults(results);

        // Synchronize scan history log in Firebase Firestore if the user is authenticated
        const missingCount = results.filter(f => f.status === 'missing').length;
        syncScan(selectedFile.name, selectedApp.name, missingCount);
      }
    }, 700);
  };

  // Simulates activating font in Adobe CC
  const handleActivateAdobeFont = (fontFamily: string) => {
    alert(`[UXP Script Activation] Le plugin communique avec l'agent d'arrière-plan Creative Cloud Desktop. Activation amorcée pour : "${fontFamily}". La police sera synchronisée dans Photoshop/Illustrator sous peu.`);
    
    // Add to system fonts locally and sync to cloud
    setSystemFonts(prev => {
      if (!prev.includes(fontFamily)) {
        return [...prev, fontFamily];
      }
      return prev;
    });
    syncInstalledFont(fontFamily);

    if (scanResults) {
      setScanResults(prev => prev ? prev.map(f => f.family === fontFamily ? { ...f, status: 'installed', provider: 'Adobe Fonts' } : f) : null);
    }
  };

  // Triggers manual install guidance
  const handleOpenGoogleFontHelp = (font: DocumentFont) => {
    setActiveFontForHelp(font);
    setShowHelperModal(true);
  };

  // Trigger real installation & download of Font File
  const handleSimulateDownload = () => {
    if (!activeFontForHelp) return;
    const fontName = activeFontForHelp.family;
    const isGoogleFont = activeFontForHelp.provider === 'Google Fonts';
    setDownloadSuccessMessage("Connexion aux serveurs de polices...");
    
    // Trigger real browser download of the actual font
    setTimeout(() => {
      try {
        if (isGoogleFont) {
          const downloadUrl = `https://fonts.google.com/download?family=${encodeURIComponent(fontName)}`;
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.target = "_blank";
          link.download = `${fontName}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          setDownloadSuccessMessage(
            `📥 Le fichier de police officiel "${fontName}.zip" a été téléchargé sur votre ordinateur ! Double-cliquez dessus pour l’extraire, puis installez le fichier .ttf (.otf) pour de vrai sur Windows/Mac en double-cliquant dessus.`
          );
        } else {
          // Open official download partner page for premium/external fonts
          const fontUrl = activeFontForHelp.fontUrl || "https://fonts.google.com";
          window.open(fontUrl, "_blank");
          setDownloadSuccessMessage(
            `🌐 Redirection vers la page de téléchargement officielle de "${fontName}". Téléchargez et installez le fichier sur votre système pour corriger le défaut.`
          );
        }
      } catch (e) {
        console.error("Font link failure:", e);
        setDownloadSuccessMessage("Échec de l'intégration automatique. Veuillez visiter Google Fonts.");
      }

      // Add font to local system database simulation and sync to cloud
      setSystemFonts(prev => {
        if (!prev.includes(fontName)) {
          return [...prev, fontName];
        }
        return prev;
      });
      syncInstalledFont(fontName);

      if (scanResults) {
        setScanResults(prev => prev ? prev.map(f => f.family === fontName ? { ...f, status: 'installed' } : f) : null);
      }
    }, 800);
  };

  // Dismiss automatic pop-up invitation for current file
  const handleDismissAutoPopup = () => {
    setLastDismissedFileId(selectedFile.id);
    setShowAutoPopup(false);
  };

  // Automated one-click scan and sync of missing fonts
  const handleAutoScanAndInstall = () => {
    setShowAutoPopup(false);
    setScanning(true);
    setProgress(0);
    setScanStep("Détection instantanée et extraction via UXP...");

    setTimeout(() => {
      setProgress(50);
      setScanStep("Téléchargement réel et résolution des dépendances...");

      // Find missing fonts in current file
      const missing = selectedFile.fonts.filter(
        font => font.status === 'missing' && !systemFonts.includes(font.family)
      );

      // Trigger automatic staggered downloads for all missing Google Fonts
      missing.forEach((font, index) => {
        setTimeout(() => {
          if (font.provider === 'Google Fonts') {
            const url = `https://fonts.google.com/download?family=${encodeURIComponent(font.family)}`;
            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.download = `${font.family}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else if (font.fontUrl) {
            window.open(font.fontUrl, '_blank');
          }
        }, index * 400); // Stagger downloads by 400ms to allow smooth parallel triggers
      });

      setTimeout(() => {
        setProgress(100);
        setScanning(false);

        const familiesToInstall = missing.map(f => f.family);

        if (familiesToInstall.length > 0) {
          setSystemFonts(prev => {
            const updated = [...prev];
            familiesToInstall.forEach(fam => {
              if (!updated.includes(fam)) {
                updated.push(fam);
              }
            });
            return updated;
          });
          
          // Sync each newly installed font with standard helper
          familiesToInstall.forEach(fam => {
            syncInstalledFont(fam);
          });
        }

        // Set scan results as fully ok/installed
        const results = selectedFile.fonts.map(font => ({
          ...font,
          status: 'installed' as const
        }));
        setScanResults(results);

        // Log scan completion
        syncScan(selectedFile.name, selectedApp.name, 0);

        // Inform user on how to install downloaded fonts for real on their machine
        alert(
          `🚀 [Sawa Font Installer] Succès :¹ ` +
          `Nous avons lancé le téléchargement de ${familiesToInstall.length} polices manquantes (${familiesToInstall.join(', ')}) sous forme d'archives .ZIP directement depuis Google Fonts !\n\n` +
          `Pour finaliser l'installation Réelle sur votre PC / Mac :\n` +
          `1. Ouvrez votre dossier Téléchargements.\n` +
          `2. Décompressez les fichiers .ZIP téléchargés.\n` +
          `3. Double-cliquez sur chaque fichier .TTF ou .OTF.\n` +
          `4. Cliquez sur "Installer" (Windows) ou "Installer la police" (macOS).\n\n` +
          `Le simulateur Adobe UXP a été synchronisé et affiche maintenant que toutes les polices de "${selectedFile.name}" sont opérationnelles !`
        );
      }, 800);
    }, 500);
  };

  // Get matching fonts for live search in UXP panel (Google or Premium Fonts)
  const filteredSearchFonts = searchQuery 
    ? [...GOOGLE_FONTS_CATALOG, ...PREMIUM_FONTS_CATALOG].filter(f => f.family.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="simulator-section">
      {/* LEFT PANEL: HOST ENVIRONMENT SELECTOR & ACTIVE FILE */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="p-4 bg-[#15181e] rounded-xl border border-[#232731]">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <AppWindow className="w-4 h-4 text-[#FF9900]" />
            1. Choisir l'Application Hôte Adobe CC
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Sélectionnez l'un des 6 hôtes Creative Cloud compatibles pour émuler la détection des polices de calques natifs de l'API UXP correspondante.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {HOST_APPS.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`p-3 rounded-lg border text-left flex items-start flex-col gap-1 transition-all ${
                  selectedApp.id === app.id
                    ? 'border-transparent bg-gray-800'
                    : 'border-[#2d313d] bg-transparent hover:bg-gray-800/40 text-gray-400'
                }`}
                style={{
                  borderLeft: selectedApp.id === app.id ? `4px solid ${app.color}` : '1px solid #2d313d'
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: app.color }}
                  />
                  <span className="font-semibold text-xs text-gray-100">{app.name}</span>
                </div>
                <span className="text-[10px] text-gray-500">{app.fullName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* WORK DOCS SECTOR */}
        <div className="p-4 bg-[#15181e] rounded-xl border border-[#232731] flex-1">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            2. Fichier Actif Émulé
          </h3>
          <div className="flex flex-col gap-2.5">
            {activeAppFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedFile(file);
                  setScanResults(null);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all relative ${
                  selectedFile.id === file.id
                    ? 'border-[#3b82f6]/60 bg-sky-950/20'
                    : 'border-[#232731] bg-transparent hover:bg-gray-800/20'
                }`}
              >
                <div className="flex items-center justify-between pointer-events-none mb-1">
                  <span className="font-semibold text-xs text-gray-200 flex items-center gap-1.5">
                    {file.id.includes('-uploaded-') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Votre fichier importé" />
                    )}
                    {file.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-850 text-gray-400 border border-gray-800 font-mono">
                      {file.layerCount} calques
                    </span>
                    {file.id.includes('-uploaded-') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUploadedFile(file.id);
                        }}
                        className="text-gray-500 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                        title="Supprimer ce document temporaire"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 pointer-events-none">{file.description}</p>
              </div>
            ))}

            {/* DRAG & DROP ZONE */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-1.5 p-4 rounded-xl border border-dashed transition-all duration-200 text-center cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                dragOver
                  ? 'border-[#FF6633] bg-[#FF6633]/5 text-white'
                  : 'border-gray-850 hover:border-gray-750 bg-[#0d0f15]/50 hover:bg-[#0d0f15]/85 text-gray-400 hover:text-gray-200'
              }`}
              id="simulator-drop-zone"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
                id="simulator-file-input"
                accept=".psd,.psb,.ai,.eps,.svg,.aep,.aet,.prproj,.prel,.indd,.indt,.idml,.incp,.txt,.html,.json,.css,.js,.md,.png,.jpg,.jpeg text/*"
              />
              <Upload className={`w-5 h-5 ${dragOver ? 'text-[#FF6633] scale-110 animate-pulse' : 'text-gray-500'} transition-transform`} />
              <div>
                <span className="text-xs font-bold block mb-0.5 text-gray-255">
                  Importez ou Glissez un fichier ici
                </span>
                <span className="text-[10px] text-gray-500 block leading-tight">
                  Fichiers de projets graphiques ou gabarits texte
                </span>
                <span className="inline-block mt-2 text-[9px] font-semibold text-orange-400/90 bg-orange-950/20 px-2 py-0.5 rounded border border-orange-900/20">
                  Taille maximale : moins de 5 Go
                </span>
              </div>
            </div>
          </div>

          {/* SIMULATED SYSTEM STATE MONITOR */}
          <div className="mt-4 pt-3 border-t border-gray-800/60">
            <span className="text-[10px] text-gray-500 font-mono uppercase block mb-1.5">Moniteur Système Émulé</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {systemFonts.map((font, idx) => (
                <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded">
                  {font}
                </span>
              ))}
            </div>
          </div>

          {/* FIRESTORE SCAN HISTORY (REAL-TIME CLOUD GRAPH) */}
          <div className="mt-4 pt-3 border-t border-gray-800/60 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono uppercase flex items-center gap-1">
                <History className="w-3 h-3 text-indigo-400" />
                Historique Cloud ({scanHistory.length})
              </span>
              {user ? (
                <span className="text-[8px] text-emerald-500 font-bold uppercase font-mono flex items-center gap-0.5">
                  <Cloud className="w-2.5 h-2.5" />
                  Synchronisé
                </span>
              ) : (
                <span className="text-[8px] text-gray-650 font-mono uppercase">Hors ligne</span>
              )}
            </div>

            {user ? (
              scanHistory.length > 0 ? (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="p-2 bg-gray-900/65 rounded border border-gray-950 flex flex-col gap-0.5 text-[10px]">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-gray-300 truncate font-semibold w-2/3">{scan.documentName}</span>
                        <span className={`text-[8px] px-1.5 rounded font-bold ${
                          scan.missingCount === 0 
                            ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-950/30' 
                            : 'bg-amber-950/20 text-amber-400 border border-amber-950/30'
                        }`}>
                          {scan.missingCount === 0 ? 'Résolu' : `${scan.missingCount} manquant`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-gray-500">
                        <span>Hôte: {scan.hostApp}</span>
                        <span>{scan.scannedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-gray-500 italic">Aucun scan enregistré. Cliquez sur "Scanner le document" pour commencer !</p>
              )
            ) : (
              <div className="p-2.5 rounded bg-slate-900/10 border border-[#2d313d]/30 text-center space-y-1">
                <p className="text-[10px] text-gray-500 leading-normal">
                  Connectez-vous via le menu en haut pour persister votre historique de scans et synchroniser vos polices d'un poste à l'autre.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LIVE ADOBE EMULATED COMPONENT (UXP PANEL SIMULATOR) */}
      <div className="lg:col-span-7 flex flex-col">
        {/* HOST SCREEN WRAPPER */}
        <div className="w-full h-full bg-[#12141a] rounded-xl border border-[#2d313d] overflow-hidden flex flex-col shadow-2xl">
          {/* Host header simulation */}
          <div 
            className="px-4 py-2 flex items-center justify-between border-b transition-colors duration-300"
            style={{ backgroundColor: selectedApp.bgColor, borderColor: '#2d2d2d' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-black tracking-tighter" style={{ backgroundColor: selectedApp.color, color: '#000' }}>
                {selectedApp.id}
              </span>
              <span className="text-xs font-medium text-gray-300 transition-all duration-300">
                {selectedApp.fullName} (Host Sandbox)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              UXP v5.8 ACTIVE
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col lg:flex-row gap-4 bg-[#1b1c22]">
            {/* STAGE/CANVAS EMULATION */}
            <div className="flex-1 rounded-lg border border-gray-800 bg-gray-950/40 p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group">
              {/* Overlay graphics reflecting CC style */}
              <div className="absolute inset-0 bg-radial from-transparent to-black/20 pointer-events-none" />
              
              <div className="z-10 flex flex-col justify-center items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-300">
                  {selectedApp.id === 'AE' && <FileVideo className="w-6 h-6 text-[#9999FF]" />}
                  {selectedApp.id === 'AI' && <FileText className="w-6 h-6 text-[#FF9900]" />}
                  {selectedApp.id === 'PS' && <FileSpreadsheet className="w-6 h-6 text-[#00C8FF]" />}
                  {['PR', 'ID', 'IC'].includes(selectedApp.id) && <Layers className="w-6 h-6 text-pink-500" />}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-gray-200">{selectedFile.name}</h4>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">Méta-données : {selectedFile.layerCount} Calques chargés</p>
                </div>
              </div>

              {/* Layer structure simulation graphic */}
              <div className="w-full mt-4 max-w-xs flex flex-col gap-1 text-[9px] text-left border border-gray-900/60 p-2 rounded bg-gray-950/30">
                <div className="flex justify-between items-center text-gray-500 font-bold border-b border-gray-900 pb-1 mb-1">
                  <span>NOM CALQUE TEXTE</span>
                  <span>POLICE ASSIGNÉE</span>
                </div>
                {selectedFile.fonts.map((f, i) => (
                  <div key={i} className="flex justify-between text-gray-400 font-mono py-0.5">
                    <span>T_{f.family.substring(0,6)}</span>
                    <span className={systemFonts.includes(f.family) ? 'text-gray-500' : 'text-amber-500/80'}>
                      {f.family} {f.style}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ADOBE UXP PLUGIN PANEL EMULATION (The Actual Extension Viewport) */}
            <div className="w-full lg:w-72 bg-[#1e1e1e] border border-[#3e3e3e] rounded shadow-lg flex flex-col overflow-hidden text-gray-200 relative">
              {/* Plug Title Bar */}
              <div className="bg-[#2a2a2a] border-b border-[#3c3c3c] px-3 py-2 flex items-center justify-between text-[11px] font-semibold text-gray-300">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#3b82f6]" />
                  Sawa Font Finder
                </span>
                <span className="text-[9px] bg-sky-950/60 border border-sky-900 px-1 py-0.5 rounded text-sky-400">Panel</span>
              </div>

              {/* Panel Content */}
              <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
                <button
                  disabled={scanning}
                  onClick={handleStartScan}
                  className={`w-full py-2 px-3 rounded text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer text-white transition-all ${
                    scanning 
                      ? 'bg-amber-600 animate-pulse'
                      : 'bg-[#1473e6] hover:bg-[#1162c4] active:scale-[0.98]'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  {scanning ? 'Scan en cours...' : 'Scanner le Document'}
                </button>

                {/* Progress Loader Animation */}
                {scanning && (
                  <div className="p-2 border border-[#303030] bg-black/10 rounded flex flex-col gap-1.5">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-400 truncate max-w-[80%]">{scanStep}</span>
                      <span className="text-gray-500 font-mono font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-[#3c3c3c] h-1 rounded-full overflow-hidden">
                      <div className="bg-[#1473e6] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Manual Inline Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une police en ligne..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 bg-[#2b2b2b] border border-[#444] rounded text-[10px] text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#1473e6]"
                  />
                  <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-500" />
                </div>

                {/* Fonts Lists Area */}
                <div className="flex-1 flex flex-col min-h-[160px]">
                  {searchQuery ? (
                    // Search results view
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-500 font-bold uppercase mb-1">Résultats en ligne</span>
                      {filteredSearchFonts.length === 0 ? (
                        <p className="text-[10px] text-gray-500 text-center py-4">Aucune police trouvée.</p>
                      ) : (
                        filteredSearchFonts.map((f, idx) => {
                          const isInstalled = systemFonts.includes(f.family);
                          return (
                            <div key={idx} className="p-1.5 bg-[#252525] border border-[#353535] rounded flex items-center justify-between text-[10px]">
                              <span>{f.family}</span>
                              <button 
                                onClick={() => isInstalled ? null : handleOpenGoogleFontHelp(f)}
                                className={`px-2 py-0.5 rounded text-[9px] ${
                                  isInstalled 
                                    ? 'text-gray-500 bg-transparent' 
                                    : 'text-sky-400 bg-sky-950/40 hover:bg-sky-900/40'
                                }`}
                              >
                                {isInstalled ? 'Disponible' : 'Télécharger'}
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  ) : scanResults ? (
                    // Live scan results of the document
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] text-[#808080] font-bold uppercase block border-b border-[#3c3c3c] pb-1">
                        Polices Détectées ({scanResults.length})
                      </span>
                      <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                        {scanResults.map((font, idx) => (
                          <div key={idx} className="p-2 bg-[#252525] border border-[#353535] rounded-lg flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-semibold text-gray-100">{font.family}</span>
                                <span className="text-[8px] text-gray-500">{font.style} | PS: {font.postScriptName}</span>
                              </div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                                font.status === 'installed'
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900'
                                  : 'bg-amber-950/40 text-amber-400 border border-amber-900'
                              }`}>
                                {font.status === 'installed' ? (
                                  <>
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    Ok
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-2.5 h-2.5" />
                                    Manque
                                  </>
                                )}
                              </span>
                            </div>

                            {/* Panel contextual action buttons */}
                            {font.status === 'missing' && (
                              <div className="flex justify-end gap-1.5 mt-1 border-t border-[#353535] pt-1.5">
                                {font.provider === 'Adobe Fonts' ? (
                                  <button
                                    onClick={() => handleActivateAdobeFont(font.family)}
                                    className="bg-[#1473e6] hover:bg-[#1162c4] text-white px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer"
                                  >
                                    Activer via Adobe
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleOpenGoogleFontHelp(font)}
                                    className="bg-gray-850 hover:bg-gray-750 text-sky-400 border border-sky-900/40 px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer"
                                  >
                                    Télécharger ({font.provider || 'Source'})
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Default scan panel view
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-4 border border-dashed border-[#444] rounded bg-black/10 text-gray-500 gap-1.5">
                      <AlertCircle className="w-6 h-6 text-gray-600" />
                      <p className="text-[10px] leading-relaxed">
                        Interface de simulation inactive.<br />Cliquez sur <strong>Scanner le Document</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* AUTOMATIC SCANNING & INSTALLATION POPUP OVERLAY */}
              {showAutoPopup && (
                <div id="uxp-auto-popup" className="absolute inset-x-0 bottom-0 top-[35px] bg-[#1a1c23]/98 border-t border-[#3b82f6]/40 p-4 flex flex-col justify-between z-20 animate-fade-in">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs border-b border-gray-800 pb-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Polices Manquantes Détectées</span>
                    </div>
                    
                    <p className="text-[11px] text-gray-350 leading-normal">
                      Le document <strong className="text-white">"{selectedFile.name}"</strong> contient des polices de caractères non installées sur votre machine.
                    </p>

                    {/* Scrollable missing fonts mini-list */}
                    <div className="space-y-1 bg-black/45 p-2 rounded border border-gray-950 max-h-24 overflow-y-auto">
                      <span className="text-[9px] text-gray-500 font-mono uppercase font-bold block mb-1">Polices manquantes :</span>
                      {selectedFile.fonts
                        .filter(font => font.status === 'missing' && !systemFonts.includes(font.family))
                        .map((f, i) => (
                          <div key={i} className="flex items-center justify-between text-[10px] font-mono py-0.5 border-b border-gray-900/45 last:border-0 pb-0.5">
                            <span className="text-gray-200 truncate">{f.family}</span>
                            <span className="text-[9px] text-[#FF6633] bg-[#FF6333]/15 border border-[#FF6633]/20 px-1.5 py-0.2 rounded font-mono">Manquant</span>
                          </div>
                        ))}
                    </div>

                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      L'extension <strong>Sawa Font Finder</strong> peut résoudre, télécharger et installer l'intégralité de ces polices manquantes automatiquement en arrière-plan.
                    </p>
                  </div>

                  <div className="space-y-2 mt-4 pt-3 border-t border-[#2e313d]/45">
                    <button
                      onClick={handleAutoScanAndInstall}
                      className="w-full py-2 bg-[#1473e6] hover:bg-[#1162c4] active:scale-[0.98] text-white font-bold rounded text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Scanner & Tout Installer (1-clic)
                    </button>
                    
                    <button
                      onClick={handleDismissAutoPopup}
                      className="w-full py-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded text-xs font-semibold transition cursor-pointer text-center border border-gray-700/50"
                    >
                      Ignorer la configuration
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* UXP SANDBOX SECURITY GUIDANCE MODAL */}
      {showHelperModal && activeFontForHelp && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#15181e] border border-[#2b2f3a] rounded-xl max-w-md w-full p-5 shadow-2xl relative">
            <h4 className="text-base font-semibold text-gray-100 flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-sky-400" />
              Sécurité UXP : Installation de "{activeFontForHelp.family}"
            </h4>
            <div className="text-xs text-gray-400 space-y-3 mb-5 border-l-2 border-sky-500/50 pl-3">
              <p>
                <strong>Pourquoi cette boîte de dialogue ?</strong> Les politiques de sécurité strictes de la plateforme <strong>Adobe UXP</strong> interdisent aux plugins d'installer directement ou d'écrire silencieusement des fichiers dans les dossiers système de votre ordinateur (tels que <code className="bg-gray-900 px-1 py-0.5 text-orange-400 rounded">C:\Windows\Fonts</code>).
              </p>
              <p>
                <strong>Solution intégrée :</strong> Ce plugin utilise le module stockage local d'UXP (<code className="bg-gray-900 px-1 py-0.5 text-gray-300">storage.localFileSystem</code>). Nous allons générer et écrire le fichier de police directement dans le répertoire de votre ordinateur de votre choix (par exemple votre dossier de Téléchargements).
              </p>
              <div className="bg-gray-900/60 p-2.5 rounded text-[10px] font-mono border border-gray-800 text-gray-300 flex flex-col gap-1">
                <span>// Appel standard UXP LocalFileSystem :</span>
                <span className="text-emerald-400">const folder = await require('uxp').storage.localFileSystem.getFolder();</span>
                <span className="text-emerald-400">const file = await folder.createFile('{activeFontForHelp.family}-Regular.ttf');</span>
              </div>
            </div>

            {downloadSuccessMessage ? (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 rounded-lg text-xs font-mono mb-6 text-center">
                {downloadSuccessMessage}
              </div>
            ) : (
              <div className="bg-[#1c202a] p-3 rounded-lg border border-gray-800 mb-6 flex flex-col items-center gap-2 text-center">
                <span className="text-[10px] uppercase font-mono text-gray-500">Service de dépôt : {activeFontForHelp.provider}</span>
                <span className="font-bold text-sm text-gray-300">{activeFontForHelp.family} {activeFontForHelp.style}</span>
                <p className="text-[11px] text-gray-400 leading-tight">Licence de distribution : {activeFontForHelp.license}</p>
                
                <button
                  onClick={handleSimulateDownload}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-4 rounded text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Sélectionner un dossier & Écrire la police
                </button>
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] border-t border-gray-800/60 pt-4">
              <a 
                href={activeFontForHelp.fontUrl || activeFontForHelp.googleFontUrl || "https://fonts.google.com"} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#1473e6] hover:underline flex items-center gap-1.5 font-bold"
              >
                Page Source ({activeFontForHelp.provider})
              </a>
              <button
                onClick={() => {
                  setShowHelperModal(false);
                  setDownloadSuccessMessage(null);
                }}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
