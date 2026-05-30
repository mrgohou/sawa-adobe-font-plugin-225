import React, { useState, useEffect, useRef } from 'react';
import { Play, Search, AlertCircle, CheckCircle2, FileVideo, FileText, FileSpreadsheet, Download, Activity, HelpCircle, Layers, Settings, AppWindow, HelpCircle as HelpIcon, Cloud, History, Upload, Trash2, File, Sparkles, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { HOST_APPS, SYSTEM_FONTS_DATABASE, GOOGLE_FONTS_CATALOG, PREMIUM_FONTS_CATALOG } from '../data/simulatorData';
import { HostApp, SampleFile, DocumentFont } from '../types';
import { useFirebase } from '../context/FirebaseContext';

const ALTERNATIVES_CATALOG: Record<string, { family: string, provider: string, style: string, license: string, category: string, googleFontUrl: string, fontUrl?: string, profile: string, reason: string }> = {
  'Orbitron': {
    family: 'Syncopate',
    provider: 'Google Fonts',
    style: 'Bold',
    license: 'OFL',
    category: 'Display',
    googleFontUrl: 'https://fonts.google.com/specimen/Syncopate',
    profile: 'Grotesque moderne / futuriste élargie, à empattements d\'angles stricts.',
    reason: 'Syncopate partage le même rythme horizontal élargi et l\'esprit techno-industriel qu\'Orbitron, idéal pour les teases de jeux de rôle ou d\'interfaces SF.'
  },
  'Gatwick': {
    family: 'Outfit',
    provider: 'Google Fonts',
    style: 'SemiBold',
    license: 'OFL',
    category: 'Display',
    googleFontUrl: 'https://fonts.google.com/specimen/Outfit',
    profile: 'Néo-grotesque à contraste modulé et structure très ouverte.',
    reason: 'Outfit apporte la même présence graphique et la même clarté géométrique de titrage de luxe que la police Gatwick.'
  },
  'Cinzel': {
    family: 'Playfair Display',
    provider: 'Google Fonts',
    style: 'Regular',
    license: 'OFL',
    category: 'Serif',
    googleFontUrl: 'https://fonts.google.com/specimen/Playfair+Display',
    profile: 'Sérif romaine classique à haut contraste de pleins et déliés.',
    reason: 'Playfair Display imite avec brio les proportions d\'incises de Cinzel, conservant l\'aspect noble, élégant et purement cinématographique de vos calques.'
  },
  'Astrella': {
    family: 'Dancing Script',
    provider: 'Google Fonts',
    style: 'Medium',
    license: 'OFL',
    category: 'Script',
    googleFontUrl: 'https://fonts.google.com/specimen/Dancing+Script',
    profile: 'Script calligraphique dynamique au tracé fluide et lié.',
    reason: 'Dancing Script remplace avantageusement la cursive Astrella avec sa structure fluide de signature naturelle, conservant le sens artistique.'
  },
  'Oswald': {
    family: 'Bebas Neue',
    provider: 'Google Fonts',
    style: 'Regular',
    license: 'OFL',
    category: 'Sans-Serif',
    googleFontUrl: 'https://fonts.google.com/specimen/Bebas+Neue',
    profile: 'Sans-serif étroite à fût vertical condensé avec une hauteur de x gigantesque.',
    reason: 'Bebas Neue est la référence absolue pour remplacer Oswald en conservant une géométrie condensée à fort impact de titrage compact.'
  },
  'Satoshi': {
    family: 'Plus Jakarta Sans',
    provider: 'Google Fonts',
    style: 'Regular',
    license: 'OFL',
    category: 'Geometric Sans',
    googleFontUrl: 'https://fonts.google.com/specimen/Plus+Jakarta+Sans',
    profile: 'Sans-Sérif géométrique moderne avec des modulations humanistes légères.',
    reason: 'Plus Jakarta Sans capture la pureté géométrique ultra-propre et raffinée de Satoshi, assurant une parfaite lisibilité système.'
  },
  'Pacifico': {
    family: 'Satisfy',
    provider: 'Google Fonts',
    style: 'Regular',
    license: 'OFL',
    category: 'Script',
    googleFontUrl: 'https://fonts.google.com/specimen/Satisfy',
    profile: 'Script rétro vintage dessiné au pinceau avec un angle modéré.',
    reason: 'Satisfy conserve le caractère vintage décontracté, fluide et chaleureux de Pacifico tout en optimisant la détection Adobe.'
  },
  "Keep on Truckin'": {
    family: 'Shrikhand',
    provider: 'Google Fonts',
    style: 'Regular',
    license: 'OFL',
    category: 'Fancy/Groovy',
    googleFontUrl: 'https://fonts.google.com/specimen/Shrikhand',
    profile: 'Sérif psychédélique ultra-grasse inspirée de la pop-culture des années 70.',
    reason: 'Shrikhand offre une alternative gratuite, robuste et officielle au style de titrage groovy et épais de Keep on Truckin\'.'
  },
  'Roboto': {
    family: 'Inter',
    provider: 'Google Fonts',
    style: 'Regular',
    license: 'OFL',
    category: 'Sans-Serif',
    googleFontUrl: 'https://fonts.google.com/specimen/Inter',
    profile: 'Néo-grotesque neutre optimisée pour les écrans.',
    reason: 'Inter offre un dessin extrêmement rigoureux, proche de Roboto, mais avec de meilleurs espacements d\'approche pour les textes d\'interface.'
  },
  'Humble Boys': {
    family: 'Rubik Dirt',
    provider: 'Google Fonts',
    style: 'Regular',
    license: 'OFL',
    category: 'Display',
    googleFontUrl: 'https://fonts.google.com/specimen/Rubik+Dirt',
    profile: 'Display urbain grunge texturé et audacieux.',
    reason: 'Rubik Dirt recrée l\'ambiance subversive et l\'impact lourd de la typographie manuelle grunge de Humble Boys.'
  },
  'Proxima Nova': {
    family: 'Montserrat',
    provider: 'Google Fonts',
    style: 'Medium',
    license: 'OFL',
    category: 'Sans-Serif',
    googleFontUrl: 'https://fonts.google.com/specimen/Montserrat',
    profile: 'Géométrique épuré inspiré des anciennes enseignes de Buenos Aires.',
    reason: 'Montserrat est le clone libre et disponible par défaut le plus parfait de Proxima Nova pour préserver la chasse géométrique originale.'
  }
};

interface HostSimulatorProps {
  isDarkMode?: boolean;
}

export default function HostSimulator({ isDarkMode = true }: HostSimulatorProps) {
  const [selectedApp, setSelectedApp] = useState<HostApp>(HOST_APPS[2]); // Photoshop as default
  const [selectedFile, setSelectedFile] = useState<SampleFile>(HOST_APPS[2].sampleFiles[0]);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [scanResults, setScanResults] = useState<DocumentFont[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'provider'>('name');
  const [showInstallModal, setShowInstallModal] = useState(false);

  const sortedScanResults = scanResults ? [...scanResults].sort((a, b) => {
    if (sortBy === 'name') {
      return a.family.localeCompare(b.family);
    } else {
      const providerA = a.provider || '';
      const providerB = b.provider || '';
      return providerA.localeCompare(providerB);
    }
  }) : null;
  
  // Alternative AI Suggestions state
  const [loadingAlternatives, setLoadingAlternatives] = useState<Record<string, boolean>>({});
  const [suggestedAlternatives, setSuggestedAlternatives] = useState<Record<string, { suggestedFont: DocumentFont, visualProfile: string, reason: string }>>({});
  
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
        while ((match = regex.exec(fileContent)) !== null && count < 5000) {
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
      while ((match = postscriptRegex.exec(fileContent)) !== null && psCount < 3000) {
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

  // Install all missing fonts detected in the scan (Step 2 of Scanner -> Installer)
  const handleInstallMissing = () => {
    if (!scanResults) return;
    const missing = scanResults.filter(
      font => font.status === 'missing' && !systemFonts.includes(font.family)
    );

    if (missing.length === 0) {
      alert("Aucune police manquante à installer !");
      return;
    }

    setScanning(true);
    setProgress(0);
    setScanStep("Téléchargement des polices manquantes...");

    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      if (p <= 100) {
        setProgress(p);
        if (p === 40) {
          setScanStep("Enregistrement système via l'API locale...");
        } else if (p === 80) {
          setScanStep("Mise à jour du registre uxp.host.fonts...");
        }
      } else {
        clearInterval(interval);
        setScanning(false);

        // Staggered download triggers
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
          }, index * 400);
        });

        const familiesToInstall = missing.map(f => f.family);
        setSystemFonts(prev => {
          const updated = [...prev];
          familiesToInstall.forEach(fam => {
            if (!updated.includes(fam)) {
              updated.push(fam);
            }
          });
          return updated;
        });

        // Sync with db
        familiesToInstall.forEach(fam => {
          syncInstalledFont(fam);
        });

        // Update the state of scan results
        setScanResults(prev => prev ? prev.map(f => ({ ...f, status: 'installed' })) : null);

        alert(
          `🚀 [Sawa Font Installer] Installation effectuée : Nous avons lancé le téléchargement de ${familiesToInstall.length} polices manquantes (${familiesToInstall.join(', ')}).\n\n` +
          `Pensez à les installer sous Windows/Mac pour que vos logiciels Adobe CC les détectent de manière permanente !`
        );
      }
    }, 450);
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

  // AI-powered suggestion handler analyzing visual characteristics
  const handleRequestAlternative = (font: DocumentFont) => {
    if (loadingAlternatives[font.family]) return;
    
    setLoadingAlternatives(prev => ({ ...prev, [font.family]: true }));
    
    // Simulate high-tech classification pass (neural, shape & metrics analysis)
    setTimeout(() => {
      const knownAlternative = ALTERNATIVES_CATALOG[font.family];
      
      let suggestion;
      if (knownAlternative) {
        suggestion = {
          suggestedFont: {
            family: knownAlternative.family,
            style: knownAlternative.style,
            postScriptName: `${knownAlternative.family}-${knownAlternative.style}`,
            provider: knownAlternative.provider,
            license: knownAlternative.license,
            category: knownAlternative.category,
            googleFontUrl: knownAlternative.googleFontUrl,
            fontUrl: knownAlternative.fontUrl
          },
          visualProfile: knownAlternative.profile,
          reason: knownAlternative.reason
        };
      } else {
        // Dynamic smart classifications based on family characteristics or metadata
        const isSerif = font.family.toLowerCase().includes('serif') || font.category === 'Serif';
        const isMono = font.family.toLowerCase().includes('mono') || font.family.toLowerCase().includes('code');
        const isScript = font.family.toLowerCase().includes('script') || font.category?.includes('Script') || font.family.toLowerCase().includes('hand') || font.family.toLowerCase().includes('brush');
        
        if (isSerif) {
          suggestion = {
            suggestedFont: {
              family: 'Lora',
              style: 'Regular',
              postScriptName: 'Lora-Regular',
              provider: 'Google Fonts',
              license: 'OFL',
              category: 'Serif',
              googleFontUrl: 'https://fonts.google.com/specimen/Lora'
            },
            visualProfile: 'Sérif littéraire de style transitionnel aux contrastes balancés.',
            reason: `L'IA a identifié des empattements marqués sur "${font.family}". Lora offre une alternative idéale avec un rythme d'écriture fluide et une excellente harmonie visuelle d'affiche.`
          };
        } else if (isMono) {
          suggestion = {
            suggestedFont: {
              family: 'JetBrains Mono',
              style: 'Regular',
              postScriptName: 'JetBrainsMono-Regular',
              provider: 'Google Fonts',
              license: 'OFL',
              category: 'Monospace',
              googleFontUrl: 'https://fonts.google.com/specimen/JetBrains+Mono'
            },
            visualProfile: 'Chasse fixe géométrique moderne optimisée pour les écrans.',
            reason: `L'IA a détecté une structure de chasse fixe (monospace) sur "${font.family}". JetBrains Mono est la référence gratuite absolue avec des espacements de traits hautement lisibles.`
          };
        } else if (isScript) {
          suggestion = {
            suggestedFont: {
              family: 'Dancing Script',
              style: 'Regular',
              postScriptName: 'DancingScript-Regular',
              provider: 'Google Fonts',
              license: 'OFL',
              category: 'Script',
              googleFontUrl: 'https://fonts.google.com/specimen/Dancing+Script'
            },
            visualProfile: 'Script cursive manuscrite moderne au dynamisme fluide.',
            reason: `L'IA a identifié des lignes cursives manuscrites sur "${font.family}". Dancing Script conserve l'élégance naturelle avec des liaisons de caractères souples.`
          };
        } else {
          suggestion = {
            suggestedFont: {
              family: 'Inter',
              style: 'Regular',
              postScriptName: 'Inter-Regular',
              provider: 'Google Fonts',
              license: 'OFL',
              category: 'Sans-Serif',
              googleFontUrl: 'https://fonts.google.com/specimen/Inter'
            },
            visualProfile: 'Sans-Sérif néo-grotesque neutre avec d\'immenses détails de lisibilité.',
            reason: `L'IA suggère d'utiliser Inter en remplacement de "${font.family}". C'est la police libre la plus polyvalente de l'écosystème, préservant la clarté et la chasse géométrique d'origine.`
          };
        }
      }
      
      setSuggestedAlternatives(prev => ({ ...prev, [font.family]: suggestion }));
      setLoadingAlternatives(prev => ({ ...prev, [font.family]: false }));
    }, 850);
  };

  const handleApplyAlternative = (originalFamily: string, altFont: DocumentFont) => {
    if (!scanResults) return;
    
    // Replace the font in scanning results
    const updated = scanResults.map(font => {
      if (font.family === originalFamily) {
        return {
          ...font,
          family: altFont.family,
          style: altFont.style,
          postScriptName: altFont.postScriptName,
          provider: altFont.provider,
          license: altFont.license || 'OFL',
          category: altFont.category,
          googleFontUrl: altFont.googleFontUrl,
          fontUrl: altFont.fontUrl,
          status: 'installed' as const
        };
      }
      return font;
    });
    
    setScanResults(updated);
    
    // Silently register the alternative as installed so the simulation resolves instantly (Ok badge)
    setSystemFonts(prev => {
      if (!prev.includes(altFont.family)) {
        return [...prev, altFont.family];
      }
      return prev;
    });
    syncInstalledFont(altFont.family);
  };

  const handleDownloadAlternative = (altFont: DocumentFont) => {
    const url = altFont.googleFontUrl || altFont.fontUrl || `https://fonts.google.com/specimen/${encodeURIComponent(altFont.family)}`;
    window.open(url, '_blank');
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
      <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
        
        {/* APP SELECTOR CONTAINER - BEAUTIFUL LILAC FOLDER TAB CARD */}
        <div className="flex flex-col">
          <div className="self-start px-4.5 py-1.5 bg-[#DCC0F7] text-[#0C0D0E] font-sans font-black text-[10px] tracking-widest uppercase rounded-t-[14px] -mb-px flex items-center gap-1.5 shadow-sm">
            <AppWindow className="w-3.5 h-3.5" />
            1. Application Hôte Adobe CC
          </div>
          <div className="p-5 rounded-[24px] rounded-tl-none border border-[#202127]/60 bg-[#121316] text-[#f3f4f6] shadow-xl">
            <p className="text-[11px] mb-4.5 leading-relaxed text-gray-400">
              Sélectionnez l'un des 6 hôtes Creative Cloud compatibles pour émuler la détection des polices de calques natifs de l'API UXP correspondante.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {HOST_APPS.map((app) => {
                const isActive = selectedApp.id === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3 rounded-[16px] border text-left flex items-start flex-col gap-1 transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                      isActive
                        ? 'border-gray-700 bg-gray-900 shadow-md font-bold text-white'
                        : 'border-[#202128] bg-transparent hover:bg-gray-850/50 text-gray-400'
                    }`}
                    style={{
                      borderLeft: isActive ? `4px solid ${app.color}` : ''
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {isActive ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3px] shrink-0" />
                      ) : (
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                          style={{ backgroundColor: app.color }}
                        />
                      )}
                      <span className="font-extrabold text-xs tracking-tight text-gray-100">{app.name}</span>
                    </div>
                    <span className="text-[9.5px] text-gray-500 font-medium">{app.fullName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* WORK DOCS SECTOR - BEAUTIFUL MINT FOLDER TAB CARD */}
        <div className="flex flex-col flex-1">
          <div className="self-start px-4.5 py-1.5 bg-[#A3EAD2] text-[#0C0D0E] font-sans font-black text-[10px] tracking-widest uppercase rounded-t-[14px] -mb-px flex items-center gap-1.5 shadow-sm">
            <Layers className="w-3.5 h-3.5" />
            2. Fichier Actif Émulé
          </div>
          <div className="p-5 rounded-[24px] rounded-tl-none border border-[#202127]/60 bg-[#121316] text-[#f3f4f6] flex-1 shadow-xl flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              {activeAppFiles.map((file) => {
                const isActive = selectedFile.id === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      setSelectedFile(file);
                      setScanResults(null);
                    }}
                    className={`p-4 rounded-[18px] border cursor-pointer transition-all duration-300 relative shadow-sm hover:scale-[1.01] ${
                      isActive
                        ? 'border-[#8FE0EB]/50 bg-[#8FE0EB]/10 text-white font-bold'
                        : 'border-[#2d313d] bg-transparent hover:bg-gray-800/10 text-gray-400'
                    }`}
                  >
                  <div className="flex items-center justify-between pointer-events-none mb-1.5">
                    <span className={`font-black text-xs flex items-center gap-1.5 ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                      {file.id.includes('-uploaded-') && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Votre fichier importé" />
                      )}
                      {isActive && <Check className="w-3.5 h-3.5 text-indigo-400 stroke-[3px] shrink-0" />}
                      {file.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                        isActive 
                          ? (isDarkMode ? 'bg-[#1473e6]/25 text-white border-[#1473e6]/30' : 'bg-[#1473e6] text-white border-[#1473e6]') 
                          : (isDarkMode ? 'bg-gray-850 text-gray-400 border-gray-800' : 'bg-gray-100 text-slate-500 border-gray-200')
                      }`}>
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
                  <p className={`text-[11px] pointer-events-none leading-normal ${isActive ? (isDarkMode ? 'text-gray-300' : 'text-slate-700') : (isDarkMode ? 'text-gray-400' : 'text-slate-500')}`}>{file.description}</p>
                </div>
              );
            })}

            {/* DRAG & DROP ZONE - MATERIAL 3 style */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-1.5 p-5 rounded-[20px] border border-dashed transition-all duration-300 text-center cursor-pointer flex flex-col items-center justify-center gap-3 hover:scale-[1.01] ${
                dragOver
                  ? 'border-[#FF6633] bg-[#FF6633]/5 text-white'
                  : (isDarkMode ? 'border-[#1b1c22] hover:border-gray-750 bg-[#0d0f15]/50 hover:bg-[#0d0f15]/85 text-gray-400 hover:text-gray-200' : 'border-gray-200 hover:border-gray-300 bg-white/50 hover:bg-white text-slate-500 hover:text-slate-700 hover:shadow-xs')
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
                <span className={`text-xs font-bold block mb-0.5 ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
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
                <span key={idx} className={`text-[9px] px-1.5 py-0.5 border rounded ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-slate-600 font-medium'}`}>
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
                    <div key={scan.id} className={`p-2 rounded border flex flex-col gap-0.5 text-[10px] ${isDarkMode ? 'bg-gray-900/65 border-gray-950' : 'bg-gray-50/50 border-gray-200/80 shadow-xs'}`}>
                      <div className="flex items-center justify-between font-mono">
                        <span className={`truncate font-semibold w-2/3 ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>{scan.documentName}</span>
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
              <div className={`p-2.5 rounded text-center space-y-1 border ${isDarkMode ? 'bg-slate-900/10 border-[#2d313d]/30' : 'bg-gray-50 border-gray-150'}`}>
                <p className="text-[10px] text-gray-500 leading-normal">
                  Connectez-vous via le menu en haut pour persister votre historique de scans et synchroniser vos polices d'un poste à l'autre.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* RIGHT PANEL: LIVE ADOBE EMULATED COMPONENT (UXP PANEL SIMULATOR) */}
      <div className="lg:col-span-7 flex flex-col">
        {/* HOST SCREEN WRAPPER */}
        <div className={`w-full h-full rounded-xl border overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-[#12141a] border-[#2d313d]' : 'bg-slate-50 border-gray-250'}`}>
          {/* Host header simulation */}
          <div 
            className="px-4 py-2 flex items-center justify-between border-b transition-colors duration-300"
            style={{ backgroundColor: selectedApp.bgColor, borderColor: isDarkMode ? '#2d2d2d' : '#cccccc' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-black tracking-tighter" style={{ backgroundColor: selectedApp.color, color: '#000' }}>
                {selectedApp.id}
              </span>
              <span className={`text-xs font-medium transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>
                {selectedApp.fullName} (Host Sandbox)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              UXP v5.8 ACTIVE
            </div>
          </div>

          <div className={`p-4 flex-1 flex flex-col lg:flex-row gap-4 transition-all duration-300 ${isDarkMode ? 'bg-[#1b1c22]' : 'bg-gray-100/70'}`}>
            {/* STAGE/CANVAS EMULATION */}
            <div className={`flex-1 rounded-lg border p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group transition-all duration-300 ${isDarkMode ? 'border-gray-800 bg-gray-950/40' : 'border-gray-250 bg-white shadow-xs'}`}>
              {/* Overlay graphics reflecting CC style */}
              <div className="absolute inset-0 bg-radial from-transparent to-black/20 pointer-events-none" />

              {/* Advanced Scanning Laser Sweep Animation */}
              {scanning && (
                <div className="absolute inset-0 bg-[#FF6633]/5 flex flex-col justify-between p-4 z-20 pointer-events-none">
                  {/* Glowing Laser Sweep Line */}
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FF6633] to-transparent shadow-[0_0_12px_2px_#FF6633] animate-sweep" />
                  
                  {/* High Tech Corner Brackets */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FF6633]/60" />
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#FF6633]/60" />
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#FF6633]/60" />
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FF6633]/60" />

                  {/* Pulsating text banner overlay */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 bg-black/75 py-3 border-y border-[#FF6633]/20 backdrop-blur-xs">
                    <span className="text-[10px] font-mono font-bold text-[#FF6633] tracking-widest uppercase animate-pulse">
                      Analyse de calques actifs...
                    </span>
                    <span className="text-[9px] font-mono text-gray-400 font-medium px-4">
                      {scanStep || "Lecture..."} ({progress}%)
                    </span>
                  </div>
                </div>
              )}
              
              <div className="z-10 flex flex-col justify-center items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-gray-200 border-gray-300 text-slate-700 shadow-xs'}`}>
                  {selectedApp.id === 'AE' && <FileVideo className="w-6 h-6 text-[#9999FF]" />}
                  {selectedApp.id === 'AI' && <FileText className="w-6 h-6 text-[#FF9900]" />}
                  {selectedApp.id === 'PS' && <FileSpreadsheet className="w-6 h-6 text-[#00C8FF]" />}
                  {['PR', 'ID', 'IC'].includes(selectedApp.id) && <Layers className="w-6 h-6 text-pink-500" />}
                </div>
                <div>
                  <h4 className={`font-semibold text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>{selectedFile.name}</h4>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">Méta-données : {selectedFile.layerCount} Calques chargés</p>
                </div>
              </div>

              {/* Layer structure simulation graphic */}
              <div className={`w-full mt-4 max-w-xs flex flex-col gap-1 text-[9px] text-left border p-2 rounded transition-all duration-300 ${isDarkMode ? 'border-gray-900/60 bg-gray-950/30 text-gray-400' : 'border-gray-200 bg-gray-50/80 text-slate-600'}`}>
                <div className={`flex justify-between items-center font-bold border-b pb-1 mb-1 ${isDarkMode ? 'text-gray-500 border-gray-900' : 'text-slate-400 border-gray-200'}`}>
                  <span>NOM CALQUE TEXTE</span>
                  <span>POLICE ASSIGNÉE</span>
                </div>
                {selectedFile.fonts.map((f, i) => {
                  const isInstalled = systemFonts.includes(f.family);
                  return (
                    <div key={i} className="flex justify-between text-gray-400 font-mono py-0.5 animate-fade-in">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>T_{f.family.substring(0,6)}</span>
                      <span className={`font-semibold transition-all duration-300 ${isInstalled ? 'text-[#30a1ff]' : 'text-[#ff4c4c]'}`}>
                        {f.family} {f.style}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ADOBE UXP PLUGIN PANEL EMULATION (The Actual Extension Viewport) — MATERIAL DESIGN 3 DESIGNED */}
            <div className="w-full lg:w-72 border border-[#22242c] rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative transition-all duration-300 bg-[#121316] text-gray-200">
              {/* Plug Title Bar */}
              <div className="px-4 py-2.5 flex items-center justify-between text-[11px] font-black border-b border-[#22242c] transition-colors duration-300 bg-[#1a1b20] text-gray-200">
                <span className="flex items-center gap-1.5 text-[#A3EAD2]">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Sawa Font Finder
                </span>
                <span className="text-[8.5px] bg-[#DCC0F7]/10 border border-[#DCC0F7]/20 px-1.5 py-0.5 rounded-full text-[#DCC0F7] font-black uppercase tracking-wider">Panel</span>
              </div>

              {/* Panel Content */}
              <div className="p-3.5 flex flex-col gap-3.5 flex-1 overflow-y-auto">
                <button
                  disabled={scanning}
                  onClick={() => {
                    const hasMissing = scanResults && scanResults.some(f => f.status === 'missing');
                    if (scanResults && hasMissing) {
                      setShowInstallModal(true);
                    } else {
                      handleStartScan();
                    }
                  }}
                  className={`w-full py-2.5 px-4 rounded-full text-[11px] font-black flex items-center justify-center gap-1.5 cursor-pointer text-white transition-all shadow-md active:scale-95 ${
                    scanning 
                      ? 'bg-amber-600 animate-pulse'
                      : 'bg-[#FF6633] hover:bg-[#ff7e4f] shadow-[#FF6633]/15'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 animate-pulse" />
                  {scanning ? (
                    progress > 50 ? 'Installation...' : 'Scan en cours...'
                  ) : (
                    scanResults && scanResults.some(f => f.status === 'missing') ? 'Installer l\'alternative' : 'Scanner le fichier'
                  )}
                </button>

                {/* Progress Loader Animation */}
                {scanning && (
                  <div className="p-2.5 border-2 border-[#303030] bg-[#111] rounded-xl flex flex-col gap-1.5">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-400 truncate max-w-[80%]">{scanStep}</span>
                      <span className="text-gray-500 font-mono font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-[#3c3c3c] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#FF6633] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Manual Inline Search — M3 HIGH CONTRAST SEARCH BAR */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une police en ligne..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-8.5 pr-3 py-1.5 border-2 rounded-full text-[10px] transition-all duration-300 focus:outline-none focus:border-[#FF6633] ${
                      isDarkMode 
                        ? 'bg-[#292c35] border-[#383c48] text-gray-100 placeholder-gray-500' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 font-semibold'
                    }`}
                  />
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                </div>

                {/* Fonts Lists Area */}
                <div className="flex-1 flex flex-col min-h-[160px]">
                  {searchQuery ? (
                    // Search results view
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] text-gray-500 font-black uppercase mb-1 flex items-center gap-1">🌐 Catalogue Cloud</span>
                      {filteredSearchFonts.length === 0 ? (
                        <p className="text-[10px] text-gray-500 text-center py-4">Aucune police trouvée.</p>
                      ) : (
                        filteredSearchFonts.map((f, idx) => {
                          const isInstalled = systemFonts.includes(f.family);
                          return (
                            <div key={idx} className={`p-2 border-2 rounded-xl flex items-center justify-between text-[10px] transition-colors ${
                              isDarkMode ? 'bg-[#292c35] border-[#383c48] text-gray-150' : 'bg-white border-slate-200 text-slate-700 font-semibold'
                            }`}>
                              <span className="truncate pr-1">{f.family}</span>
                              <button 
                                onClick={() => isInstalled ? null : handleOpenGoogleFontHelp(f)}
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${
                                  isInstalled 
                                    ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/35' 
                                    : 'text-sky-400 bg-sky-950/40 hover:bg-sky-900/40 border border-sky-900/25'
                                }`}
                              >
                                {isInstalled ? 'Dispo' : 'Installer'}
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  ) : sortedScanResults ? (
                    // Live scan results of the document
                    <div className="flex flex-col gap-2">
                      <div className={`flex items-center justify-between border-b pb-1.5 mb-1 transition-colors duration-300 ${isDarkMode ? 'border-[#3c3c3c]' : 'border-gray-200'}`}>
                        <span className={`text-[9px] font-black uppercase tracking-wide flex items-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-650'}`}>
                          🔤 Polices Détectées ({sortedScanResults.length})
                        </span>
                        
                        {/* Tri dropdown */}
                        <div className="flex items-center gap-1 select-none">
                          <label htmlFor="font-sort-select" className={`text-[8.5px] font-black ${isDarkMode ? 'text-[#808080]' : 'text-slate-400'}`}>Tri :</label>
                          <select
                            id="font-sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'provider')}
                            className={`text-[8.5px] font-black px-2 py-0.5 rounded-full border-2 focus:outline-none focus:border-[#FF6633] cursor-pointer transition-all ${
                              isDarkMode 
                                ? 'bg-[#292c35] border-[#383c48] text-gray-200' 
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <option value="name">Nom</option>
                            <option value="provider">Source</option>
                          </select>
                        </div>
                      </div>
                      <motion.div 
                        className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1"
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: { opacity: 0 },
                          show: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.08
                            }
                          }
                        }}
                      >
                        {sortedScanResults.map((font, idx) => (
                          <motion.div 
                            key={`${font.family}-${idx}`}
                            variants={{
                              hidden: { opacity: 0, y: 12, scale: 0.98 },
                              show: { 
                                opacity: 1, 
                                y: 0, 
                                scale: 1, 
                                transition: { 
                                  type: "spring", 
                                  stiffness: 150, 
                                  damping: 16 
                                } 
                              }
                            }}
                            className={`p-3 rounded-xl flex flex-col gap-1.5 border-2 transition-colors duration-300 ${
                              isDarkMode ? 'bg-[#252834]/80 border-[#383c48]' : 'bg-white border-slate-250 shadow-xxs'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                <span className={`text-[10px] font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-slate-800'}`}>{font.family}</span>
                                <span className="text-[8px] text-gray-500">{font.style} | PS: {font.postScriptName}</span>
                              </div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                                font.status === 'installed'
                                  ? (isDarkMode ? 'bg-[#1c2e4a] text-[#30a1ff] border-[#1d3d6b]' : 'bg-emerald-50 text-emerald-600 border-emerald-100/80')
                                  : (isDarkMode ? 'bg-[#4a1c1c] text-[#ff4c4c] border-[#6b1d1d]' : 'bg-rose-50 text-rose-500 border-rose-100')
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
                               <div className="flex flex-col gap-2 mt-1 border-t border-gray-150/15 dark:border-[#353535] pt-1.5">
                                 <div className="flex justify-end gap-1.5">
                                   <button
                                     onClick={() => handleRequestAlternative(font)}
                                     title="Suggérer une alternative gratuite par l'IA"
                                     className="bg-purple-950/30 hover:bg-purple-900/50 text-purple-400 hover:text-purple-300 border border-purple-900/50 px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer flex items-center gap-1 transition-all"
                                   >
                                     <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                                     Suggérer Alternative
                                   </button>

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

                                 {/* Loading Alternative State */}
                                 {loadingAlternatives[font.family] && (
                                   <div className="p-2 rounded bg-purple-950/10 border border-purple-900/25 text-[10px] space-y-1 block animate-pulse">
                                     <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
                                       <Sparkles className="w-3 h-3 animate-spin" />
                                       <span>Analyse des proportions par l'IA...</span>
                                     </div>
                                     <p className="text-[9px] text-gray-400">Analyse de la chasse, des empattements (Serif, Sans) et de l'aspect ratio...</p>
                                   </div>
                                 )}

                                 {/* Alternative Suggested Result */}
                                 {suggestedAlternatives[font.family] && !loadingAlternatives[font.family] && (
                                   <div className="p-2 rounded bg-gradient-to-br from-purple-950/20 to-slate-900/40 border border-purple-900/40 text-[10px] space-y-2 text-left shadow-inner">
                                     <div className="flex items-center justify-between">
                                       <span className="text-[8px] text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                         <Sparkles className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                                         Alternative IA Proposée :
                                       </span>
                                       <span className="text-[7.5px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/35 px-1 py-0.2 rounded font-semibold font-mono">Gratuit & Libre</span>
                                     </div>
                                     
                                     <div className="flex flex-col gap-0.5">
                                       <span className="text-gray-100 font-bold text-[11px]">{suggestedAlternatives[font.family].suggestedFont.family} {suggestedAlternatives[font.family].suggestedFont.style}</span>
                                       <span className="text-[9px] text-gray-400 leading-tight italic">Caractéristiques : {suggestedAlternatives[font.family].visualProfile}</span>
                                     </div>

                                     <p className="text-[9.5px] text-gray-400 leading-tight">
                                       {suggestedAlternatives[font.family].reason}
                                     </p>

                                     <div className="flex gap-1.5 justify-end pt-1 border-t border-purple-950/25 md:flex-wrap">
                                       <button
                                         onClick={() => handleApplyAlternative(font.family, suggestedAlternatives[font.family].suggestedFont)}
                                         className="bg-[#1473e6] hover:bg-[#1162c4] text-white px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all active:scale-[0.98]"
                                       >
                                         Remplacer par l'Alternative
                                       </button>
                                       <button
                                         onClick={() => handleDownloadAlternative(suggestedAlternatives[font.family].suggestedFont)}
                                         className="bg-transparent border border-gray-700 hover:border-gray-600 text-gray-300 px-1.5 py-0.5 rounded text-[8px] font-medium cursor-pointer transition-all"
                                       >
                                         Fiche Google Fonts ↗
                                       </button>
                                     </div>
                                   </div>
                                 )}
                               </div>
                             )}
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  ) : (
                    // Default scan panel view
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-4 border border-dashed border-[#444] rounded bg-black/10 text-gray-500 gap-1.5">
                      <AlertCircle className="w-6 h-6 text-gray-650" />
                      <p className="text-[10px] leading-relaxed">
                        Interface de simulation inactive.<br />Cliquez sur <strong>Scanner le Document</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* AUTOMATIC SCANNING & INSTALLATION POPUP OVERLAY */}
              {showAutoPopup && (
                <div id="uxp-auto-popup" className="absolute inset-x-0 bottom-0 top-[35px] bg-[#121316]/98 border-t border-[#202128] p-4 flex flex-col justify-between z-20 animate-fade-in text-gray-250">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#DCC0F7] font-black text-[10.5px] uppercase tracking-wider font-display border-b border-[#202128]/70 pb-2">
                      <AlertCircle className="w-3.5 h-3.5 text-[#DCC0F7] shrink-0" />
                      <span>Polices Manquantes Détectées</span>
                    </div>
                    
                    <p className="text-[11px] text-gray-400 leading-normal font-sans font-light">
                      Le document <strong className="text-white font-semibold">"{selectedFile.name}"</strong> contient des polices non installées sur votre machine.
                    </p>

                    {/* Scrollable missing fonts mini-list */}
                    <div className="space-y-1 bg-[#0a0a0c] p-2.5 rounded-[16px] border border-[#1b1c20] max-h-24 overflow-y-auto">
                      <span className="text-[8.5px] text-gray-500 font-mono uppercase font-bold block mb-1">Polices manquantes :</span>
                      {selectedFile.fonts
                        .filter(font => font.status === 'missing' && !systemFonts.includes(font.family))
                        .map((f, i) => (
                          <div key={i} className="flex items-center justify-between text-[10px] font-mono py-1 border-b border-[#1b1c20]/45 last:border-0 pb-1">
                            <span className="text-gray-200 truncate">{f.family}</span>
                            <span className="text-[8px] text-[#ff5f5f] bg-[#ff5f5f]/10 border border-[#ff5f5f]/25 px-1.5 py-0.2 rounded-full font-mono font-bold">Manquant</span>
                          </div>
                        ))}
                    </div>

                    <p className="text-[10px] text-gray-400 leading-relaxed font-sans font-light">
                      L'extension <strong className="text-white">Sawa Font Finder</strong> va identifier toutes les polices d'un document Adobe CC sans limites de calques, puis les installer.
                    </p>
                  </div>

                  <div className="space-y-2 mt-4 pt-3 border-t border-[#202128]/70">
                    <button
                      onClick={() => {
                        setShowAutoPopup(false);
                        handleStartScan();
                      }}
                      className="w-full py-2 bg-[#A3EAD2] hover:bg-[#8fd0bc] active:scale-[0.98] text-[#0C0D0E] font-black rounded-full text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#0C0D0E]" />
                      Scanner
                    </button>
                    
                    <button
                      onClick={handleDismissAutoPopup}
                      className="w-full py-1.5 bg-[#1a1b20] hover:bg-[#202128] text-gray-305 rounded-full text-xs font-bold transition cursor-pointer text-center border border-[#252731]"
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
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="flex flex-col max-w-md w-full relative">
            {/* Folder Tab style header */}
            <div className="self-start px-5 py-2.5 bg-[#8FE0EB] text-[#0C0D0E] font-display font-black text-[10px] tracking-widest uppercase rounded-t-[14px] -mb-px flex items-center gap-1.5 shadow-md">
              <Download className="w-3.5 h-3.5" />
              Sécurité UXP
            </div>
            
            <div className="bg-[#121316] border border-[#202128] rounded-[24px] rounded-tl-none p-6 shadow-2xl relative">
              <h4 className="text-base font-black text-white font-display flex items-center gap-2 mb-2 leading-tight tracking-tight">
                Installation de "{activeFontForHelp.family}"
              </h4>
              <div className="text-xs text-gray-400 space-y-3 mb-5 border-l-2 border-[#8FE0EB]/50 pl-3.5 font-sans font-light leading-relaxed">
                <p>
                  <strong className="text-white font-semibold">Pourquoi cette boîte de dialogue ?</strong> Les politiques de sécurité strictes d'<strong>Adobe UXP</strong> empêchent les extensions d'installer directement ou d'écrire silencieusement des fichiers dans les répertoires système (comme <code className="bg-black/45 px-1 py-0.5 text-[#ff4c4c] rounded text-[10px] font-mono">C:\Windows\Fonts</code>).
                </p>
                <p>
                  <strong className="text-white font-semibold">Solution intégrée :</strong> Ce plugin interroge le stockage local d'UXP (<code className="bg-black/45 px-1 py-0.5 text-gray-300 rounded text-[10px] font-mono">storage.localFileSystem</code>) pour écrire le fichier de police compilé directement dans le dossier de votre convenance.
                </p>
                <div className="bg-[#0a0a0c] p-3 rounded-[16px] text-[10px] font-mono border border-[#1b1c20] text-gray-300 flex flex-col gap-1">
                  <span className="text-gray-500">// Appel direct localFileSystem :</span>
                  <span className="text-[#A3EAD2]">const folder = await require('uxp').storage.localFileSystem.getFolder();</span>
                  <span className="text-[#A3EAD2]">const file = await folder.createFile('{activeFontForHelp.family}-Regular.ttf');</span>
                </div>
              </div>

              {downloadSuccessMessage ? (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 text-[#A3EAD2] rounded-lg text-xs font-mono mb-4 text-center">
                  {downloadSuccessMessage}
                </div>
              ) : (
                <div className="bg-[#1a1b20]/60 p-4 rounded-[16px] border border-[#202128] mb-4 flex flex-col items-center gap-2 text-center">
                  <span className="text-[8.5px] uppercase font-mono text-gray-500 tracking-wider font-bold">Service de dépôt : {activeFontForHelp.provider}</span>
                  <span className="font-extrabold text-white text-[15px] font-display">{activeFontForHelp.family} {activeFontForHelp.style}</span>
                  <p className="text-[10px] text-gray-400 font-light leading-none">Licence de distribution : {activeFontForHelp.license}</p>
                  
                  <button
                    onClick={handleSimulateDownload}
                    className="mt-3 bg-[#A3EAD2] hover:bg-[#8fd0bc] text-[#0C0D0E] font-black py-2 px-5 rounded-full text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-md shadow-[#A3EAD2]/10"
                  >
                    <Download className="w-4 h-4" />
                    Sélectionner un dossier & Écrire
                  </button>
                </div>
              )}

              {/* Sawa Web Search Links Grid (Nulled / Free download sites requested by user) */}
              <div className="mt-4 border-t border-[#202128]/70 pt-4 mb-5">
                <span className="text-[10px] font-black text-[#DCC0F7] uppercase tracking-wider block mb-2.5 font-display">Rechercher cette police sur le Web :</span>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {[
                    { name: "Befonts", url: `https://befonts.com/?s=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "Creative Fabrica", url: `https://www.creativefabrica.com/search/?search=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "Dealjumbo Freebies", url: "https://dealjumbo.com/downloads/category/freebies/fonts-freebies" },
                    { name: "Pixelbuddha Fonts", url: `https://pixelbuddha.net/search?text=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "Fontspace (Nouveau)", url: `https://www.fontspace.com/search?q=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "Fontbundles Free", url: `https://fontbundles.net/search?search=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "Deeezy Premium", url: `https://deeezy.com/search-results?search=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "GraphicDesignFreebies", url: `https://www.graphicdesignfreebies.com/?s=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "OnlineWebFonts", url: `https://www.onlinewebfonts.com/search?q=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "PixelSurplus Fonts", url: `https://pixelsurplus.com/search?q=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "Goodtype Foundry", url: "https://goodtypefoundry.com/" },
                    { name: "Graphic Pear", url: `https://www.graphicpear.com/search/?q=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "Free Design Resources", url: `https://freedesignresources.net/?s=${encodeURIComponent(activeFontForHelp.family)}` },
                    { name: "Dafont Free", url: `https://www.dafontfree.io/?s=${encodeURIComponent(activeFontForHelp.family)}` }
                  ].map((site, sIdx) => (
                    <a
                      key={sIdx}
                      href={site.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-[#1a1b20] border border-[#252731] hover:border-[#8FE0EB]/40 hover:bg-[#8FE0EB]/5 text-[10px] text-gray-400 hover:text-[#8FE0EB] rounded-full truncate text-center font-bold tracking-tight transition-all"
                    >
                      {site.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10.5px] border-t border-[#202128]/70 pt-4">
                <a 
                  href={activeFontForHelp.fontUrl || activeFontForHelp.googleFontUrl || "https://fonts.google.com"} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#8FE0EB] hover:underline flex items-center gap-1.5 font-bold uppercase tracking-widest text-[8.5px]"
                >
                  Page Source ({activeFontForHelp.provider}) ↗
                </a>
                <button
                  onClick={() => {
                    setShowHelperModal(false);
                    setDownloadSuccessMessage(null);
                  }}
                  className="bg-[#1a1b20] border border-[#252731] hover:bg-[#202128] text-gray-300 px-5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETECTED FONTS SUMMARY & INSTANT INSTALLATION MODAL */}
      {showInstallModal && scanResults && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="flex flex-col max-w-md w-full relative text-gray-200">
            {/* Folder Tab style header */}
            <div className="self-start px-5 py-2.5 bg-[#DCC0F7] text-[#0C0D0E] font-display font-black text-[10px] tracking-widest uppercase rounded-t-[14px] -mb-px flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              Assistant Sawa
            </div>

            <div className="bg-[#121316] border border-[#202128] rounded-[24px] rounded-tl-none p-6 shadow-2xl relative">
              <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#202128]">
                <h4 className="text-base font-black text-white font-display flex items-center gap-2">
                  Installation Automatisée des Polices
                </h4>
                <button 
                  onClick={() => setShowInstallModal(false)}
                  className="text-gray-500 hover:text-gray-400 text-xl cursor-pointer font-bold transition"
                >
                  &times;
                </button>
              </div>

              <p className="text-xs text-gray-455 mb-4 leading-relaxed font-sans font-light">
                Le moteur Sawa Font Scout a identifié les polices suivantes comme manquantes dans votre document. Validez la liste ci-dessous avant de procéder :
              </p>

              {/* List of missing fonts to be installed */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 p-3 rounded-[16px] border border-[#202128] mb-5 bg-[#0a0a0c]">
                {scanResults
                  .filter(font => font.status === 'missing' && !systemFonts.includes(font.family))
                  .length === 0 ? (
                    <p className="text-xs text-center text-gray-500 py-3 font-light">Aucune police manquante détectée.</p>
                  ) : (
                    scanResults
                      .filter(font => font.status === 'missing' && !systemFonts.includes(font.family))
                      .map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-[#1b1c20]/60 last:border-0">
                          <div className="flex flex-col col-span-3">
                            <span className="font-extrabold text-[#DCC0F7] font-display">{f.family}</span>
                            <span className="text-[10px] text-gray-500 font-medium">{f.style} • Fournisseur : {f.provider || 'Inconnu'}</span>
                          </div>
                          <span className="text-[9px] font-black text-red-400 bg-red-950/20 border border-red-900/35 px-2.5 py-0.5 rounded-full font-mono">
                            Manquant
                          </span>
                        </div>
                      ))
                  )}
              </div>

              <div className="flex items-start gap-2.5 p-4 rounded-[16px] text-[#DCC0F7] bg-[#DCC0F7]/5 border border-[#DCC0F7]/15 text-xs leading-normal mb-6">
                <Activity className="w-5 h-5 shrink-0" />
                <p className="font-semibold text-[11px] leading-relaxed">
                  <strong className="text-white font-black block mb-0.5 uppercase tracking-wide text-[9px]">Installation instantanée :</strong>
                  Les fichiers ZIP officiels seront servis en téléchargement direct et vos applications Adobe CC virtuelles s'aligneront automatiquement avec ces nouvelles polices.
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4 border-[#202128]">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="bg-[#1a1b20] border border-[#252731] hover:bg-[#202128] text-gray-300 px-5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    handleInstallMissing();
                    setShowInstallModal(false);
                  }}
                  className="bg-[#A3EAD2] hover:bg-[#8fd0bc] text-[#0C0D0E] px-5 py-2 rounded-full text-xs font-black cursor-pointer transition flex items-center gap-1.5 shadow-md shadow-[#A3EAD2]/10"
                >
                  <Download className="w-4 h-4" />
                  Démarrer l'Installation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
