import React, { useState } from 'react';
import { FileCode, Copy, Check, Info, Download, Terminal, ChevronRight } from 'lucide-react';
import { PLUGIN_CODE_FILES } from '../data/pluginCode';
import { CodeFile } from '../types';

export default function CodeViewer() {
  const [activeFile, setActiveFile] = useState<CodeFile>(PLUGIN_CODE_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const [downloading, setDownloading] = useState<false | 'zip' | 'ccx'>(false);

  const handleDownload = async (format: 'zip' | 'ccx') => {
    try {
      setDownloading(format);
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Bundle all our 6 source files into the zip
      PLUGIN_CODE_FILES.forEach((file) => {
        zip.file(file.name, file.code);
      });

      // Write mock black pixel PNG files for UXP-required icons
      const dummyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      zip.file("icons/icon_23.png", dummyPngBase64, { base64: true });
      zip.file("icons/icon_48.png", dummyPngBase64, { base64: true });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = format === 'ccx' ? "sawa-adobe-plugin-fontfinder.ccx" : "sawa-adobe-plugin-fontfinder.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Format generation failed:", err);
      alert("Une erreur est survenue lors de l'assemblage du package.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 border border-[#2d313d] bg-[#15181e] rounded-xl overflow-hidden p-6" id="code-viewer-section">
      {/* SIDEBAR: FILE LIST */}
      <div className="w-full lg:w-64 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-gray-500 uppercase">
            Arborescence UXP
          </h3>
          <span className="text-[10px] bg-indigo-950 text-indigo-400 font-mono px-1.5 py-0.5 border border-indigo-900 rounded">
            6 fichiers
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {PLUGIN_CODE_FILES.map((file) => {
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
                    ? 'bg-gray-800 text-gray-100 border-l-2 border-indigo-500'
                    : 'text-gray-400 hover:bg-gray-800/20 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileCode className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
                  <span className="truncate">{file.name}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-transparent group-hover:text-gray-500'}`} />
              </button>
            );
          })}
        </div>

        {/* PACKAGE GENERATION ADVERTISEMENT */}
        <div className="mt-4 p-3.5 rounded-xl bg-gray-900/85 border border-gray-800 flex flex-col gap-3 text-[11.5px] text-gray-400 leading-relaxed">
          <div className="flex items-center gap-1.5 text-[#FF6633] font-bold font-mono text-xs">
            <Terminal className="w-3.5 h-3.5 animate-pulse" />
            Distribution UXP Packagée
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Sawa Font Finder utilise <strong>Adobe UXP v2</strong> (manifeste JSON). L'obtenir par double-clic sur le fichier <code className="text-amber-400">.ccx</code> peut déclencher l'<strong>Erreur -4</strong> ou <strong className="text-red-400">Status -193</strong> si l'environnement d'écriture local n'est pas signé ou utilise de vieux installeurs.
          </p>

          <div className="p-2.5 rounded bg-red-950/20 border border-red-900/30 text-[10.5px] text-amber-300 font-sans space-y-1.5">
            <div className="font-bold flex items-center gap-1 text-red-300">
              <Info className="w-3.5 h-3.5 shrink-0 text-red-400" />
              Corriger l'erreur -4 & 193 :
            </div>
            <p className="text-[10px] leading-normal text-gray-350">
              1. Téléchargez le fichier <strong className="text-indigo-300">.ZIP</strong> et décompressez-le.<br/>
              2. Lancez l'utilitaire Adobe officiel gratuit <strong className="text-white">Adobe UXP Developer Tool (UDT)</strong>.<br />
              3. Cliquez sur <strong className="text-amber-200">Add Plugin</strong>, pointez sur <code className="text-[9.5px]">manifest.json</code> et cliquez sur <strong className="text-emerald-400">Load</strong> pour l'installer instantanément et gratuitement !
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

            {/* ZIP Developer Source */}
            <button
              onClick={() => handleDownload('zip')}
              disabled={!!downloading}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-gray-800 hover:bg-gray-750 disabled:opacity-50 text-gray-200 border border-gray-700 rounded-lg text-xs cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              <FileCode className="w-3.5 h-3.5" />
              {downloading === 'zip' ? "Compression..." : "Télécharger le Code Source (.zip)"}
            </button>
          </div>
        </div>
      </div>

      {/* CODE STAGE: EDITOR EMULATOR */}
      <div className="flex-1 flex flex-col bg-[#0e1014] rounded-xl border border-[#2d313d] min-h-[480px] overflow-hidden">
        {/* Editor head */}
        <div className="px-4 py-3 bg-[#111319] border-b border-gray-900 flex flex-col md:flex-row gap-3 justify-between md:items-center">
          <div>
            <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">Fichier ACTIF</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs font-mono text-indigo-400">/{activeFile.path}</span>
              <span className="text-[10px] text-gray-400 px-1.5 py-0.2 bg-[#1b1e26] border border-gray-800 rounded capitalize">
                {activeFile.language}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold px-3 py-1.5 rounded text-xs cursor-pointer transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Code copié !
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copier le Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* File intent banner */}
        <div className="px-4 py-2 bg-[#1b1d25] border-b border-gray-900 flex items-start gap-2 text-xs text-gray-400">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="leading-tight">{activeFile.description}</p>
        </div>

        {/* Editor Body */}
        <div className="flex-1 p-4 font-mono text-xs overflow-auto max-h-[500px] text-gray-300 leading-relaxed bg-[#0e1014] select-text">
          <pre className="whitespace-pre">
            <code>
              {activeFile.code.split('\n').map((line, idx) => (
                <div key={idx} className="flex hover:bg-indigo-950/20 py-0.5 px-1 rounded-sm transition-colors group">
                  <span className="w-8 select-none text-gray-600 group-hover:text-indigo-400/60 font-mono text-right pr-3 border-r border-gray-900/60 mr-3">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-[11px] leading-relaxed break-keep">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
