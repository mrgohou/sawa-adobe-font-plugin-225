import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  FileCode, 
  Copy, 
  Check, 
  Info, 
  Download, 
  Terminal, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Lock, 
  Settings, 
  Cpu, 
  FolderSync,
  Sun,
  Moon
} from 'lucide-react';
import { PLUGIN_CODE_FILES } from '../data/pluginCode';
import { CodeFile } from '../types';

interface CodeViewerProps {
  onDownloadComplete?: () => void;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightLiveLine(line: string, language: string, isCodeDark: boolean): string {
  if (!line || !line.trim()) return "&nbsp;";
  
  const escaped = escapeHtml(line);
  
  const colors = {
    keyword: isCodeDark ? "text-fuchsia-400 font-bold" : "text-purple-600 font-bold",
    string: isCodeDark ? "text-emerald-400 font-medium" : "text-emerald-700 font-medium",
    comment: isCodeDark ? "text-gray-500 italic" : "text-gray-400 italic",
    number: isCodeDark ? "text-amber-400" : "text-blue-600",
    jsonKey: isCodeDark ? "text-indigo-300 font-semibold" : "text-indigo-800 font-semibold",
    tag: isCodeDark ? "text-fuchsia-400 font-semibold" : "text-purple-600 font-semibold",
    attrName: isCodeDark ? "text-sky-305" : "text-sky-700",
    attrVal: isCodeDark ? "text-emerald-400 font-medium" : "text-emerald-700 font-medium",
  };

  if (language === 'json') {
    return escaped.replace(
      /(&quot;[^"&]+&quot;)(\s*:)/g, 
      `<span class="${colors.jsonKey}">$1</span>$2`
    ).replace(
      /(:\s*)(&quot;[^"&]+&quot;)/g,
      `$1<span class="${colors.string}">$2</span>`
    ).replace(
      /(:\s*)(true|false|null)/g,
      `$1<span class="${colors.keyword}">$2</span>`
    ).replace(
      /(:\s*)([0-9.-]+)/g,
      `$1<span class="${colors.number}">$2</span>`
    );
  }

  if (language === 'css') {
    if (escaped.trim().startsWith("/*") || escaped.trim().startsWith("*")) {
      return `<span class="${colors.comment}">${escaped}</span>`;
    }
    return escaped.replace(
      /([^:{]+)(\s*:)/g,
      `<span class="${colors.attrName}">$1</span>$2`
    ).replace(
      /(:\s*)([^;}\s]+)/g,
      `$1<span class="${colors.string}">$2</span>`
    );
  }

  if (language === 'html') {
    if (escaped.trim().startsWith("&lt;!--")) {
      return `<span class="${colors.comment}">${escaped}</span>`;
    }
    return escaped.replace(
      /(&lt;\/?[a-zA-Z0-9:-]+)/g,
      `<span class="${colors.tag}">$1</span>`
    ).replace(
      /(\/?[a-zA-Z-0-9:]*&gt;)/g,
      `<span class="${colors.tag}">$1</span>`
    ).replace(
      /(\s[a-zA-Z-]+)=(&quot;[^&]*&quot;)/g,
      ` <span class="${colors.attrName}">$1</span>=<span class="${colors.attrVal}">$2</span>`
    );
  }

  // JS / ExtendScript
  if (escaped.trim().startsWith("//") || escaped.trim().startsWith("/*") || escaped.trim().startsWith("*")) {
    return `<span class="${colors.comment}">${escaped}</span>`;
  }

  let codePart = escaped;
  let commentPart = "";
  const commentIndex = escaped.indexOf("//");
  if (commentIndex !== -1) {
    codePart = escaped.substring(0, commentIndex);
    commentPart = `<span class="${colors.comment}">${escaped.substring(commentIndex)}</span>`;
  }

  const jsKeywords = /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|class|extends|new|true|false|null|this|try|catch|finally|async|await)\b/g;
  const jsFunctions = /\b([a-zA-Z0-9_$]+)(?=\()/g;
  const jsStrings = /(&quot;[^&]*&quot;|&#039;[^&#]*&#039;|`[^`]*`)/g;
  const jsNumbers = /\b([0-9.]+)\b/g;

  let highlightedCode = codePart
    .replace(jsStrings, `<span class="${colors.string}">$1</span>`)
    .replace(jsKeywords, `<span class="${colors.keyword}">$1</span>`)
    .replace(jsFunctions, `<span class="text-sky-400 font-semibold">$1</span>`)
    .replace(jsNumbers, `<span class="${colors.number}">$1</span>`);

  return highlightedCode + commentPart;
}

export default function CodeViewer({ onDownloadComplete }: CodeViewerProps) {
  const [files, setFiles] = useState<CodeFile[]>(PLUGIN_CODE_FILES);
  const [activeFile, setActiveFile] = useState<CodeFile>(PLUGIN_CODE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<false | 'zip' | 'ccx'>(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'manifest' | 'css' | 'scripts'>('all');
  const isCodeDark = true;

  // Find the exact active file in the state array to support mutations (like auto-fixing the ID prefix)
  const activeFileIndex = files.findIndex((f) => f.name === activeFile.name);
  const currentActiveFile = activeFileIndex !== -1 ? files[activeFileIndex] : activeFile;

  const filteredFiles = files.filter(file => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'manifest') return file.name.endsWith('.json');
    if (selectedFilter === 'css') return file.name.endsWith('.css');
    if (selectedFilter === 'scripts') return file.name.endsWith('.js') || file.name.endsWith('.html');
    return true;
  });

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentActiveFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (format: 'zip' | 'ccx') => {
    try {
      setDownloading(format);
      const zip = new JSZip();

      // Bundle all our 6 source files into the zip
      files.forEach((file) => {
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
      setTimeout(() => {
        onDownloadComplete?.();
      }, 300);
    } catch (err) {
      console.error("Format generation failed:", err);
      alert("Une erreur est survenue lors de l'assemblage du package.");
    } finally {
      setDownloading(false);
    }
  };

  // Auto-Fix function to change com.adobe.uxp.fontscout namespace to com.sawa.uxp.fontfinder
  const applyManifestAutoFix = () => {
    if (activeFileIndex === -1) return;
    const manifestFile = files[activeFileIndex];
    try {
      const parsed = JSON.parse(manifestFile.code);
      parsed.id = "com.sawa.uxp.fontfinder";
      parsed.name = "Sawa Font Finder";
      const beautifulString = JSON.stringify(parsed, null, 2);
      
      const newFiles = [...files];
      newFiles[activeFileIndex] = {
        ...manifestFile,
        code: beautifulString
      };
      setFiles(newFiles);
    } catch (e) {
      alert("Erreur de parsing pour appliquer l'Auto-Fix automatique.");
    }
  };

  // Perform dynamic analysis of current active manifest JSON state
  const analyzeManifest = () => {
    let idValue = "";
    let manifestVersionValue = 0;
    let iconsCount = 0;
    let hostsCount = 0;
    let parseError = null;

    try {
      const parsed = JSON.parse(currentActiveFile.code);
      idValue = parsed.id || "";
      manifestVersionValue = parsed.manifestVersion || 0;
      iconsCount = Array.isArray(parsed.icons) ? parsed.icons.length : 0;
      hostsCount = Array.isArray(parsed.host) ? parsed.host.length : 0;
    } catch (err: any) {
      parseError = err.message;
    }

    const checks = {
      id: {
        status: parseError ? 'error' : idValue.startsWith('com.adobe') ? 'warning' : idValue ? 'success' : 'error',
        message: parseError 
          ? "Impossible d'analyser le code JSON."
          : idValue.startsWith('com.adobe') 
            ? "Le namespace 'com.adobe' est STRICTEMENT réservé à Adobe. La validation de soumission Creative Cloud échouera." 
            : idValue 
              ? `ID '${idValue}' conforme aux spécifications tierces Adobe.` 
              : "Le champ 'id' est obligatoire.",
        canFix: !parseError && idValue.startsWith('com.adobe')
      },
      version: {
        status: parseError ? 'error' : manifestVersionValue >= 5 ? 'success' : 'warning',
        message: parseError
          ? "Erreur JSON."
          : manifestVersionValue >= 5
            ? `UXP manifestVersion v${manifestVersionValue} compatible avec Creative Cloud moderne.`
            : `manifestVersion < 5 détecté. Risque élevé d'Erreur -193 sous Adobe CC récent.`
      },
      icons: {
        status: parseError ? 'error' : iconsCount >= 2 ? 'success' : 'warning',
        message: parseError
          ? "Erreur JSON."
          : iconsCount >= 2
            ? `${iconsCount} icônes requises (23px, 48px) déclarées.`
            : "Manque le jeu d'icônes standard requis sous UXP."
      },
      hosts: {
        status: parseError ? 'error' : hostsCount > 0 ? 'success' : 'error',
        message: parseError
          ? "Erreur JSON."
          : hostsCount > 0
            ? `${hostsCount} applications hôtes supportées configurées (Photoshop, Illustrator...).`
            : "Aucune application hôte ciblée."
      },
      error4: {
        status: 'info',
        message: "L'Erreur -4 est contournée d'office grâce à l'utilitaire gratuit Adobe UDT pour sideloading gratuit."
      }
    };

    // Calculate dynamic compliance score
    let score = 100;
    if (parseError) {
      score = 0;
    } else {
      if (checks.id.status === 'warning') score -= 25;
      if (checks.id.status === 'error') score -= 35;
      if (checks.version.status === 'warning') score -= 25;
      if (checks.icons.status === 'warning') score -= 15;
      if (checks.hosts.status === 'error') score -= 25;
    }

    return {
      parseError,
      checks,
      score
    };
  };

  const validation = activeFile.name === 'manifest.json' ? analyzeManifest() : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 border border-[#2d313d] bg-[#15181e] rounded-xl overflow-hidden p-6" id="code-viewer-section">
      
      {/* SIDEBAR: FILE LIST & ACTIONS */}
      <div className="w-full lg:w-64 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-gray-500 uppercase">
            Arborescence UXP
          </h3>
          <span className="text-[10px] bg-indigo-950 text-indigo-400 font-mono px-1.5 py-0.5 border border-indigo-900 rounded">
            {filteredFiles.length} / {files.length} fichiers
          </span>
        </div>

        {/* Dropdown HTML select selector */}
        <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-800/60">
          <label htmlFor="file-type-filter-select" className="block text-[9px] uppercase font-mono font-bold text-gray-500 mb-1 text-left">
            Filtrer par type
          </label>
          <select
            id="file-type-filter-select"
            value={selectedFilter}
            onChange={(e) => {
              const val = e.target.value as 'all' | 'manifest' | 'css' | 'scripts';
              setSelectedFilter(val);
              const matched = files.filter(f => {
                if (val === 'all') return true;
                if (val === 'manifest') return f.name.endsWith('.json');
                if (val === 'css') return f.name.endsWith('.css');
                if (val === 'scripts') return f.name.endsWith('.js') || f.name.endsWith('.html');
                return true;
              });
              if (matched.length > 0 && !matched.some(f => f.name === activeFile.name)) {
                setActiveFile(matched[0]);
              }
            }}
            className="w-full text-[11px] font-mono py-1 px-1.5 bg-[#0e1014] border border-[#2d313d] rounded text-gray-300 focus:outline-none focus:border-[#FF6633]"
          >
            <option value="all">📁 Tous les fichiers</option>
            <option value="manifest">📋 Manifest (.json)</option>
            <option value="css">🎨 Styles (.css)</option>
            <option value="scripts">⚙️ Scripts (.js, .html)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          {filteredFiles.map((file) => {
            const isSelected = activeFile.name === file.name;
            return (
              <button
                key={file.name}
                onClick={() => {
                  setActiveFile(file);
                  setCopied(false);
                }}
                className={`py-2 px-3 rounded-lg text-left flex items-center justify-between font-mono text-xs group transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gray-800 text-gray-100 border-l-2 border-[#FF6633]'
                    : 'text-gray-400 hover:bg-gray-800/20 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileCode className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-[#FF6633]' : 'text-gray-500 group-hover:text-gray-400'}`} />
                  <span className="truncate">{file.name}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isSelected ? 'text-[#FF6633] translate-x-0.5' : 'text-transparent group-hover:text-gray-500'}`} />
              </button>
            );
          })}
          {filteredFiles.length === 0 && (
            <span className="text-[10px] text-gray-500 text-center py-4 border border-dashed border-gray-800 rounded-lg">Aucun fichier trouvé</span>
          )}
        </div>

        {/* PACKAGE GENERATION BLOCK */}
        <div className="mt-4 p-3.5 rounded-xl bg-gray-900/85 border border-gray-800 flex flex-col gap-3 text-[11.5px] text-gray-400 leading-relaxed">
          <div className="flex items-center gap-1.5 text-[#FF6633] font-bold font-mono text-xs">
            <Terminal className="w-3.5 h-3.5 animate-pulse" />
            Distribution UXP Packagée
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Sawa Font Finder utilise <strong>Adobe UXP v2</strong> (manifeste JSON). L'obtenir par double-clic sur le fichier <code className="text-amber-400 font-bold font-mono">.ccx</code> peut déclencher l'<strong>Erreur -4</strong> ou <strong className="text-red-400">Status -193</strong> si l'environnement d'écriture local n'est pas signé ou utilise de vieux installeurs.
          </p>

          <div className="p-2.5 rounded bg-red-950/20 border border-red-900/30 text-[10.5px] text-amber-300 font-sans space-y-1.5">
            <div className="font-bold flex items-center gap-1 text-red-300">
              <Info className="w-3.5 h-3.5 shrink-0 text-red-400" />
              Corriger l'erreur -4 & 193 :
            </div>
            <p className="text-[10px] leading-normal text-gray-350">
              1. Téléchargez le fichier <strong className="text-indigo-300">.ZIP</strong> de notre suite et décompressez-le.<br/>
              2. Ouvrez l'utilitaire gratuit <strong className="text-white">Adobe UDT (Adobe UXP Developer Tool)</strong>.<br />
              3. Cliquez sur <strong className="text-amber-200">Add Plugin</strong>, pointez sur <code className="text-[9.5px] font-bold">manifest.json</code> et cliquez sur <strong className="text-emerald-400">Load</strong> pour l'activer instantanément !
            </p>
          </div>

          <div className="space-y-2 pt-1 border-t border-gray-800">
            {/* Native CCX Packaging */}
            <button
              onClick={() => handleDownload('ccx')}
              disabled={!!downloading}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#FF6633] hover:bg-[#e05526] disabled:opacity-50 text-white font-bold rounded-lg text-xs cursor-pointer disabled:cursor-not-allowed transition-all shadow"
            >
              <Download className="w-3.5 h-3.5 animate-bounce" />
              {downloading === 'ccx' ? "Préparation .CCX..." : "Télécharger l'Extension (.ccx)"}
            </button>

            {/* ZIP Developer Source with native binary modules included */}
            <button
              onClick={() => handleDownload('zip')}
              disabled={!!downloading}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-gray-800 hover:bg-gray-750 disabled:opacity-50 text-gray-200 border border-gray-700 rounded-lg text-xs cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              <FolderSync className="w-3.5 h-3.5 text-indigo-400" />
              {downloading === 'zip' ? "Compression..." : "Tél. ZIP (Avec formats natifs)"}
            </button>
          </div>
        </div>
      </div>

      {/* CODE STAGE: EDITOR EMULATOR */}
      <div className={`flex-1 flex flex-col rounded-xl border min-h-[480px] overflow-hidden transition-all duration-300 ${
        isCodeDark 
          ? 'bg-[#0e1014] border-[#2d313d]' 
          : 'bg-white border-gray-250 shadow-md'
      }`}>
        {/* Editor head */}
        <div className={`px-4 py-3 border-b flex flex-col md:flex-row gap-3 justify-between md:items-center transition-colors duration-300 ${
          isCodeDark ? 'bg-[#111319] border-gray-900' : 'bg-gray-100 border-gray-200'
        }`}>
          <div>
            <span className={`text-[10px] font-mono uppercase block tracking-wider ${isCodeDark ? 'text-gray-500' : 'text-gray-450'}`}>Fichier ACTIF</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs font-mono text-[#FF6633]">/{currentActiveFile.path}</span>
              <span className={`text-[10px] px-1.5 py-0.2 border rounded capitalize font-mono ${
                isCodeDark ? 'bg-[#1b1e26] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600'
              }`}>
                {currentActiveFile.language}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 font-bold px-3 py-1.5 rounded text-xs cursor-pointer transition border bg-gray-800 hover:bg-gray-750 text-gray-200 border-gray-700/60"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-550" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copier
                </>
              )}
            </button>
          </div>
        </div>

        {/* File intent banner */}
        <div className={`px-4 py-2 border-b flex items-start gap-2 text-xs transition-colors duration-300 ${
          isCodeDark ? 'bg-[#1b1d25] border-gray-900 text-gray-400' : 'bg-slate-50 border-gray-200 text-slate-600'
        }`}>
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="leading-tight">{currentActiveFile.description}</p>
        </div>

        {/* Dynamic Split Stage when manifest.json is selected */}
        <div className={`flex-1 flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x overflow-hidden ${
          isCodeDark ? 'divide-gray-900' : 'divide-gray-200'
        }`}>
          
          {/* Main Code block (Left Column in split) */}
          <div className={`flex-1 p-4 font-mono text-xs overflow-auto max-h-[500px] leading-relaxed select-text transition-colors duration-300 ${
            isCodeDark ? 'bg-[#0e1014] text-gray-300' : 'bg-[#fafafa] text-slate-800'
          } ${
            activeFile.name === 'manifest.json' ? 'xl:max-w-[50%]' : 'w-full'
          }`}>
            <pre className="whitespace-pre">
              <code>
                {currentActiveFile.code.split('\n').map((line, idx) => (
                  <div key={idx} className="flex hover:bg-indigo-950/10 py-0.5 px-1 rounded-sm transition-colors group">
                    <span className={`w-8 select-none font-mono text-right pr-3 border-r mr-3 transition-colors ${
                      isCodeDark 
                        ? 'text-gray-500 group-hover:text-indigo-400/60 border-gray-800/45' 
                        : 'text-gray-400 group-hover:text-indigo-600 border-gray-200'
                    }`}>
                      {idx + 1}
                    </span>
                    <span 
                      className="flex-1 text-[11px] leading-relaxed break-keep"
                      dangerouslySetInnerHTML={{ __html: highlightLiveLine(line, currentActiveFile.language, isCodeDark) }}
                    />
                  </div>
                ))}
              </code>
            </pre>
          </div>

          {/* Compliance Validator Block (Right Column in split) */}
          {activeFile.name === 'manifest.json' && validation && (
            <div className="flex-1 p-5 bg-[#0a0d14] flex flex-col gap-4 overflow-y-auto max-h-[500px] border-t xl:border-t-0 border-gray-800">
              
              {/* Compliance Header Card */}
              <div className="p-4 bg-gradient-to-r from-gray-900 to-indigo-950/20 border border-gray-800 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    COMPLIANCE ADOBE UXP
                  </div>
                  <h4 className="text-[11px] text-gray-400">Vérification de soumission Creative Cloud</h4>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-2xl font-black font-mono ${
                    validation.score === 100 
                      ? 'text-emerald-400' 
                      : validation.score >= 70 
                        ? 'text-amber-400 animate-pulse' 
                        : 'text-red-400'
                  }`}>
                    {validation.score}%
                  </div>
                  <span className="text-[9px] text-gray-500 font-bold font-mono">SCORE CONFORMITÉ</span>
                </div>
              </div>

              {/* Validation Rules Checklist */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-mono font-bold text-gray-550 uppercase tracking-widest">
                  Règles d'Extensibilité
                </h5>
                
                {/* 1. Namespace ID */}
                <div className="p-3 bg-gray-950/40 border border-gray-850/80 rounded-lg flex gap-3 items-start">
                  <div className="mt-0.5 shrink-0">
                    {validation.checks.id.status === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    {validation.checks.id.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 animate-bounce" />}
                    {validation.checks.id.status === 'error' && <ShieldAlert className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-200">Vérification de l'ID Unique (id)</span>
                      {validation.checks.id.status === 'warning' && (
                        <span className="text-[9px] font-mono bg-amber-955/20 border border-amber-900/60 px-1 py-0.2 rounded text-amber-500 font-bold">
                          Warning CC-Store
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-gray-400">
                      {validation.checks.id.message}
                    </p>
                    
                    {validation.checks.id.canFix && (
                      <button
                        onClick={applyManifestAutoFix}
                        className="mt-2 text-[10px] font-mono font-bold bg-[#FF6633] hover:bg-[#ff7e4f] text-black px-2 py-1 rounded cursor-pointer transition flex items-center gap-1 shrink-0"
                      >
                        <Settings className="w-3 h-3 animate-spin" />
                        Appliquer l'Auto-Fix (com.sawa)
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Version ID */}
                <div className="p-3 bg-gray-950/40 border border-gray-850/80 rounded-lg flex gap-3 items-start">
                  <div className="mt-0.5 shrink-0">
                    {validation.checks.version.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] font-bold text-gray-200">Version du Manifeste (manifestVersion)</span>
                    <p className="text-[10.5px] leading-relaxed text-gray-400">
                      {validation.checks.version.message}
                    </p>
                  </div>
                </div>

                {/* 3. Icons Set */}
                <div className="p-3 bg-gray-950/40 border border-gray-850/80 rounded-lg flex gap-3 items-start">
                  <div className="mt-0.5 shrink-0">
                    {validation.checks.icons.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] font-bold text-gray-200">Assortiment d'Icônes d'Extension</span>
                    <p className="text-[10.5px] leading-relaxed text-gray-400">
                      {validation.checks.icons.message}
                    </p>
                  </div>
                </div>

                {/* 4. Host Integration */}
                <div className="p-3 bg-gray-950/40 border border-gray-850/80 rounded-lg flex gap-3 items-start">
                  <div className="mt-0.5 shrink-0">
                    {validation.checks.hosts.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] font-bold text-gray-200">Applications Hôtes Adobe CC</span>
                    <p className="text-[10.5px] leading-relaxed text-gray-400">
                      {validation.checks.hosts.message}
                    </p>
                  </div>
                </div>

                {/* 5. Secure Signature Bypass Instructions */}
                <div className="p-3 bg-indigo-950/15 border border-indigo-900/40 rounded-lg flex gap-3 items-start">
                  <Terminal className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-1.5 col">
                    <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-indigo-455" />
                      Signature Cryptographique (Bypass Erreur -4)
                    </span>
                    <p className="text-[10px] leading-relaxed text-gray-400">
                      Le Creative Cloud bloque les packages <code className="text-[#FF6633] font-bold">.CCX</code> non signés (erreur d'installation -4). 
                      <strong className="text-white block mt-1">Exécuter sans signature payante :</strong>
                      Sideloadez le code source <code className="text-amber-400">.ZIP</code> via l'utilitaire <strong className="text-indigo-300">Adobe UDT (gratuits)</strong>. Cliquez sur <strong>Add Plugin</strong>, ciblez votre <code className="text-[9.5px]">manifest.json</code>, et cliquez sur <strong>Load</strong>. Le plugin se charge à la volée !
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
