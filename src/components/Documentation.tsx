import React, { useState } from 'react';
import { BookOpen, Key, Terminal, HelpCircle, ArrowRight, ShieldAlert, Cpu, Laptop, FileArchive } from 'lucide-react';
import { TECHNICAL_SECTIONS } from '../data/simulatorData';

export default function Documentation() {
  const [selectedSection, setSelectedSection] = useState(TECHNICAL_SECTIONS[0].id);

  return (
    <div className="flex flex-col lg:flex-row gap-6 border border-[#2d313d] bg-[#15181e] rounded-xl p-6" id="documentation-section">
      {/* LEFT NAVIGATION: SECTIONS */}
      <div className="w-full lg:w-64 flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-gray-500 uppercase">
            Guide Technique
          </h3>
        </div>

        <div className="flex flex-col gap-1.5">
          {TECHNICAL_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`py-2 px-3 rounded-lg text-left text-xs font-medium cursor-pointer transition-all ${
                selectedSection === sec.id
                  ? 'bg-emerald-950/30 border-l-2 border-emerald-500 text-emerald-400'
                  : 'text-gray-400 hover:bg-gray-850 hover:text-gray-200'
              }`}
            >
              {sec.title}
            </button>
          ))}

          {/* ADDITIONAL USER INSTALLATION STEP */}
          <button
            onClick={() => setSelectedSection('user-guide')}
            className={`py-2 px-3 rounded-lg text-left text-xs font-medium cursor-pointer transition-all ${
              selectedSection === 'user-guide'
                ? 'bg-emerald-950/30 border-l-2 border-emerald-500 text-emerald-400'
                : 'text-gray-400 hover:bg-gray-850 hover:text-gray-200'
            }`}
          >
            Guide Utilisateur Final
          </button>
        </div>

        {/* SECURITY REMINDER */}
        <div className="mt-4 p-3.5 bg-gray-900/60 border border-gray-800 rounded-lg text-[10.5px] text-gray-400 space-y-2">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            Note d'Architecture
          </div>
          <p className="leading-relaxed">
            Contrairement aux scripts ExtendScript traditionnels (.jsx), les plugins UXP s'exécutent dans un environnement sandbox asynchrone sécurisé, préservant la fluidité de l'application CC hôte.
          </p>
        </div>
      </div>

      {/* CORE CONTENT LAYOUT */}
      <div className="flex-1 min-h-[460px] bg-[#0e1014] rounded-xl border border-[#2d313d] p-6 text-gray-300 leading-relaxed overflow-y-auto max-h-[600px] select-text">
        {selectedSection === 'user-guide' ? (
          // DETAILED USER INSTALLATION GUIDE
          <div className="space-y-6">
            <header className="border-b border-gray-800 pb-4">
              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest block font-bold mb-1">DÉPLOIEMENT & SÉCURITÉ</span>
              <h2 className="text-xl font-display font-semibold text-gray-150">Guide d'Installation pour l'Utilisateur Final</h2>
              <p className="text-xs text-gray-500 mt-1">Instructions simples à l'attention des graphistes, monteurs et maquettistes utilisant le plugin.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-900/40 border border-gray-800 rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                  <Laptop className="w-4 h-4" />
                  Méthode 1 : Double-Clic .CCX (Sauf Erreur -4)
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Le package unifié s'installe via l'utilitaire Adobe Creative Cloud Desktop. En cas d'erreur <code className="text-red-400 font-mono">-4</code> (package de développement non signé), préférez la méthode 3.
                </p>
                <ol className="text-[10.5px] text-gray-400 space-y-1 pl-4 list-decimal mt-1.5 leading-tight">
                  <li>Double-cliquez sur le fichier <code className="text-[#FF6633] font-bold">.ccx</code>.</li>
                  <li>Cliquez sur <strong className="text-gray-200">Installer</strong> dans Creative Cloud Desktop.</li>
                  <li>Relancez votre application hôte active.</li>
                </ol>
              </div>

              <div className="p-4 bg-gray-900/40 border border-gray-800 rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                  <FileArchive className="w-4 h-4" />
                  Méthode 2 : Déploiement Manuel
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Pour les déploiements d'entreprise ou les environnements de production restreints.
                </p>
                <ol className="text-[10.5px] text-gray-400 space-y-1 pl-4 list-decimal mt-1.5 leading-tight">
                  <li>Extraire le contenu ZIP du plugin.</li>
                  <li>Déplacez le dossier extrait dans :</li>
                  <span className="block text-[9.5px] bg-black/60 p-1 rounded font-mono text-amber-500/80 my-1 truncate">
                    (Windows) AppData\Roaming\Adobe\UXP\Plugins\External\
                  </span>
                  <span className="block text-[9.5px] bg-black/60 p-1 rounded font-mono text-amber-500/80 my-1 truncate">
                    (macOS) ~/Library/Application Support/Adobe/UXP/Plugins/External/
                  </span>
                </ol>
              </div>

              <div className="p-4 bg-[#FF6633]/5 border border-indigo-500/30 rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <Terminal className="w-4 h-4 shrink-0" />
                  Méthode 3 : UDT Developer (Anti-Erreur -4)
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  L'utilitaire officiel d'Adobe pour charger et tester gratuitement des extensions locales non signées commercialement.
                </p>
                <ol className="text-[10.5px] text-gray-400 space-y-1 pl-4 list-decimal mt-1.5 leading-tight">
                  <li>Téléchargez et décompressez l'archive de code <strong className="text-[#FF6633]">.ZIP</strong>.</li>
                  <li>Lancez le logiciel gratuit <strong className="text-white">Adobe UXP Developer Tool (UDT)</strong>.</li>
                  <li>Cliquez sur <strong className="text-indigo-400">Add Plugin</strong> et sélectionnez le fichier <code className="text-amber-300">manifest.json</code>.</li>
                  <li>Cliquez sur <strong className="text-emerald-400">Load</strong> pour l'utiliser immédiatement !</li>
                </ol>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/20 border border-emerald-900/60 rounded-xl space-y-2.5">
              <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Comment utiliser le plugin dans votre flux de travail ?
              </h3>
              <div className="text-xs text-gray-400 space-y-2">
                <p>
                  1. <strong>Ouvrez l'interface :</strong> Au sein de Photoshop, Illustrator ou After Effects, rendez-vous dans le menu du haut <strong className="text-gray-200">Extensions (ou Plugins) &gt; Sawa Font Finder</strong>.
                </p>
                <p>
                  2. <strong>Scannez les calques :</strong> Cliquez sur <strong className="text-emerald-400">Scanner le Document</strong>. Le plugin examine l'intégralité de vos plans de travails ou timelines et trie les polices locales indisponibles.
                </p>
                <p>
                  3. <strong>Installez d'un clic :</strong>
                </p>
                 <ul className="list-disc pl-5 space-y-1 text-gray-400">
                   <li><strong>Polices Adobe Fonts :</strong> Cliquez sur <em>Activer</em> pour synchroniser instantanément la police.</li>
                   <li><strong>Polices Google Fonts :</strong> Cliquez sur <em>Télécharger</em>, sélectionnez votre dossier d'écriture, puis double-cliquez sur le fichier TTF généré pour l'ajouter dans le système d'exploitation Windows ou macOS.</li>
                   <li><strong>Polices Premium & Alternatives (DaFont, Fontshare, BeFonts, iFonts, etc.) :</strong> Cliquez sur <em>Télécharger</em> pour récupérer en toute sécurité le package de police directement depuis la source externe.</li>
                 </ul>
              </div>
            </div>
          </div>
        ) : (
          // DYNAMIC TECHNICAL SECTIONS
          TECHNICAL_SECTIONS.filter(s => s.id === selectedSection).map((sec) => (
            <div key={sec.id} className="space-y-4">
              <header className="border-b border-gray-800 pb-4">
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest block font-bold mb-1">CONCEPTION TECHNIQUE UXP</span>
                <h2 className="text-xl font-display font-semibold text-gray-150">{sec.title}</h2>
              </header>

              {/* Technical description layout rendering */}
              <div className="space-y-4 text-xs text-gray-400 leading-relaxed">
                {sec.content.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('###')) {
                    return (
                      <h3 key={pIdx} className="text-sm font-semibold text-gray-200 mt-5 mb-2 font-display">
                        {paragraph.replace('###', '').trim()}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('-')) {
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-1.5 my-3 text-gray-400">
                        {paragraph.split('\n').map((li, liIdx) => (
                          <li key={liIdx}>{li.replace('-', '').trim()}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.startsWith('|')) {
                    // Render simple styled tables
                    const rows = paragraph.split('\n').filter(r => r.trim() !== '');
                    return (
                      <div key={pIdx} className="overflow-x-auto my-4 rounded-lg border border-gray-800 bg-gray-900/20">
                        <table className="w-full text-left text-xs text-gray-400">
                          <thead>
                            <tr className="bg-gray-900/60 border-b border-gray-800 text-[10px] uppercase font-bold text-gray-400">
                              {rows[0].split('|').filter(c => c.trim() !== '').map((th, thIdx) => (
                                <th key={thIdx} className="p-3 font-mono">{th.trim()}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-900/40">
                            {rows.slice(2).map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-gray-900/20">
                                {row.split('|').filter(c => c.trim() !== '').map((td, tdIdx) => (
                                  <td key={tdIdx} className="p-3">{td.trim()}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-gray-400 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
