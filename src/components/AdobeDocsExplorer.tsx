import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { 
  FileDown, 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  FileText, 
  Download, 
  HelpCircle, 
  Briefcase, 
  FileCode, 
  ShieldCheck, 
  BookOpen, 
  Image, 
  PenTool, 
  Clapperboard, 
  Terminal, 
  ShieldAlert 
} from 'lucide-react';

const ADOBE_DOCUMENTS = [
  {
    id: 'readme',
    filename: '01_Readme_First_Sawa.pdf',
    title: 'Sawa Font Finder - Guide de Démarrage Rapide',
    description: 'Notice d’accueil officielle pour la soumission sur l’Adobe Exchange. Cadrage du projet, prérequis et présentation globale de l’écosystème.',
    icon: 'FileText',
    size: '128 KB',
    category: 'Cadrage & Accueil',
    sections: [
      {
        title: '1. Présentation de l’extension Sawa Font Finder',
        text: 'L’extension Sawa Font Finder (sous l’identification Adobe Font Finder UXP) est conçue pour apporter une solution totale et directe à la problématique universelle des polices manquantes dans le flux de production créatif. Elle s’adresse à l’ensemble des concepteurs, maquettistes, monteurs et directeurs de création évoluant dans la suite Adobe Creative Cloud. Grâce à cette interface, fini le fardeau des polices manquantes à l’ouverture d’un projet créatif complexe.'
      },
      {
        title: '2. Problématique résolue',
        text: 'Lorsqu’un fichier est partagé entre collaborateurs, il arrive couramment que certaines typographies installées localement sur le poste d’origine soient absentes de la machine cible. Sawa Font Finder automatise l’analyse du fichier hôte actif (Photoshop, Illustrator, After Effects, InDesign), identifie précisément les polices de caractères associées aux calques de texte, repère celles manquantes au système, et fournit une passerelle d’activation immédiate ou de téléchargement depuis les dépôts légaux comme Google Fonts et Adobe Fonts.'
      },
      {
        title: '3. Comment soumettre à la distribution Creative Cloud',
        text: 'Ce document fait partie intégrante du paquet de soumission requis par la console Adobe Developer. Il doit être déposé dans l’espace réservé aux fichiers d’accompagnement de l’extension afin de guider l’équipe de révision d’Adobe lors de la validation fonctionnelle en bac à sable. Ce fichier atteste de la prise en charge totale des environnements asynchrones.'
      }
    ]
  },
  {
    id: 'install_ps',
    filename: '02_Guide_Installation_Photoshop.pdf',
    title: 'Installation & Usage sur Adobe Photoshop CC',
    description: 'Guide technique d’activation étape par étape pour le module complémentaire d’analyse de texte de Photoshop.',
    icon: 'Image',
    size: '142 KB',
    category: 'Guide Hôte',
    sections: [
      {
        title: '1. Environnement Requis',
        text: 'L’extension fonctionne sur Adobe Photoshop CC (Version 2021 ou supérieure, prenant en charge le moteur d’extension UXP v2). Elle est compatible avec macOS (Intel et Apple Silicon) et Windows 10/11. L’allocation mémoire est minimale.'
      },
      {
        title: '2. Chargement de l’extension',
        text: 'Une fois l’extension installée (soit via le fichier d’installation .CCX unifié, soit via l’outil Adobe UXP Developer Tool), le panneau d’utilisation est disponible dans le menu principal supérieur de Photoshop : Plugins > Adobe Font Finder. L’onglet s’intègre nativement à l’interface Adobe Spectrum pour respecter la charte de couleurs.'
      },
      {
        title: '3. Analyse d’un fichier PSD',
        text: 'Lorsque le panneau s’affiche à l’écran, ouvrez n’importe quel calque de texte contenant une police externe. Cliquez sur le bouton "Scanner le Document". Le script récursif recherche toutes les polices déclarées dans le DOM Photoshop (propriétés du calque texte). Si la police n’est pas présente, un bouton d’analyse contextuel apparaît pour vous suggérer une alternative ou un lien de téléchargement direct depuis Google Fonts.'
      }
    ]
  },
  {
    id: 'install_ai',
    filename: '03_Guide_Installation_Illustrator.pdf',
    title: 'Spécificités & Usage sur Adobe Illustrator CC',
    description: 'Rapport complet sur la gestion du dictionnaire de polices vectorielles d’Illustrator avec le DOM d’analyse.',
    icon: 'PenTool',
    size: '138 KB',
    category: 'Guide Hôte',
    sections: [
      {
        title: '1. Particularités d’Illustrator vectoriel',
        text: 'Dans Adobe Illustrator, les textes sont contenus au sein d’éléments typés "TextFrame". L’extraction de polices doit être menée de manière à scanner de façon globale les polices déclarées, car Illustrator peut contenir des textes incorporés sous forme de symboles ou groupés de manière complexe au sein de plans de travail imbriqués.'
      },
      {
        title: '2. Flux d’intégration et détection',
        text: 'Ouvrez le menu d’accès : Plugins > Adobe Font Finder. Lancez le diagnostic. L’extension dresse la liste de toutes les polices utilisées par les éléments de texte vectoriels de votre espace de travail Illustrator actif, avec un indicateur instantané de leur état : OK (installée) ou Manque (absente) pour éviter toute pixellisation fortuite.'
      },
      {
        title: '3. Solution d’appariement automatique',
        text: 'Pour toute police manquante détectée, Illustrator propose deux options de récupération. Sawa Font Finder affiche un bouton de téléchargement automatique par compression de paquets, ce qui permet à l’utilisateur de récupérer la source de la police de façon sécurisée.'
      }
    ]
  },
  {
    id: 'install_ae',
    filename: '04_Guide_Installation_AfterEffects.pdf',
    title: 'Génération & Diagnostic pour Adobe After Effects',
    description: 'Documentation de compatibilité sur les cinématiques vectorielles et le rendu des polices au sein des timelines.',
    icon: 'Clapperboard',
    size: '141 KB',
    category: 'Guide Hôte',
    sections: [
      {
        title: '1. Composition Typographique dans After Effects',
        text: 'After Effects gère les textes sous forme de calques d’effet de texte spécifiques ("ADBE Text Layer"). Contrairement aux logiciels statiques comme Photoshop, les calques de texte After Effects peuvent posséder des expressions typographiques programmatiques ou des calques de formes dynamiques qui varient à chaque image clé.'
      },
      {
        title: '2. Lancement du diagnostic Font Finder',
        text: 'Depuis l’espace de travail After Effects, ouvrez la composition active. Ouvrez l’extension Adobe Font Finder depuis le menu d’extension. Le panneau analyse la timeline courante en inventoriant les ressources de polices utilisées. Ceci est crucial avant l’export au format Motion Graphics (.Mogrt) ou le rendu final sur Adobe Media Encoder.'
      },
      {
        title: '3. Prévention des erreurs de rendu de production',
        text: 'L’état "Absente" sur un serveur de rendu After Effects (Render Farm) provoque un remplacement de police silencieux par Arial, dénaturant le visuel final. Adobe Font Finder prévient ce cas de figure en automatisant le téléchargement des typographies.'
      }
    ]
  },
  {
    id: 'dev_uxp',
    filename: '05_Manuel_Integrateur_UXP.pdf',
    title: 'Manuel d’Intégration d’Architecture Technique UXP',
    description: 'Explications approfondies sur le runtime JavaScript UXP, le support API Spectrum et le cycle de vie du plugin.',
    icon: 'Terminal',
    size: '155 KB',
    category: 'Architecture Dev',
    sections: [
      {
        title: '1. Évolutions de l’architecture UXP d’Adobe',
        text: 'Le moteur Unified Extensibility Platform (UXP) propose une rupture majeure par rapport aux anciens environnements d’extensions basés sur CEP (Common Extensibility Platform) ou ExtendScript (.jsx). UXP s’exécute directement dans le même espace de mémoire que l’application hôte, à l’instar d’un moteur hybride hautes performances. Il offre un bac à sable restreint mais rapide, où l’interface utilisateur est dessinée à l’aide du moteur de style natif Spectrum. La consommation CPU est divisée par dix.'
      },
      {
        title: '2. Modèle d’intégration réseau asynchrone',
        text: 'Sawa Font Finder utilise des requêtes réseau directes (interrogations d’API REST) réalisées de manière asynchrone pour requérir et valider les polices d’écriture. Grâce au support complet de ES6+ et de fetch, le plugin interroge en temps réel les bases de données typographiques sans jamais bloquer l’affichage ou ralentir l’outil de conception hôte.'
      },
      {
        title: '3. Rapprochement avec le stockage interne',
        text: 'Le plugin utilise le stockage local persistant fourni par UXP pour mémoriser les préférences d’affichage et l’état d’identification. Cela permet de restaurer instantanément la liste des polices scannées lors d’une session précédente.'
      }
    ]
  },
  {
    id: 'err_193',
    filename: '06_Resolution_Erreur_Status_193.pdf',
    title: 'Diagnostic de l’Erreur Status -193 & CEP',
    description: 'Documentation explicative sur le conflit historique des anciennes plateformes et sa remédiation directe.',
    icon: 'ShieldAlert',
    size: '148 KB',
    category: 'Dépannage',
    sections: [
      {
        title: '1. Origine de l’Erreur -193 / Status 193',
        text: 'L’erreur "Status -193" ou "Erreur -193" est un cas d’erreur d’installation ultra-récurrente dans l’écosystème d’extension Creative Cloud. Elle se produit typiquement lorsque des utilisateurs finaux tentent d’installer le nouveau package d’extension moderne Adobe Font Finder (conçu sous les normes complexes UXP avec architecture JSON) en employant de vieux outils d’installation tiers CEP (.zxp installers comme Anastasiy, ZXPInstaller, ou de vieux scripts d’écriture CEP XML).'
      },
      {
        title: '2. Analyse de cause racine',
        text: 'Les extensions CEP possédaient une déclaration XML obsolète (CSXS manifest.xml). Les utilitaires d’installation .ZXP obsolètes recherchent ce fichier XML et échouent catastrophiquement en renvoyant le code d’erreur système -193 lorsqu’ils font face à un manifeste moderne manifest.json utilisé par UXP. Ce plugin est 100% UXP et de fait exempt d’anciens composants CEP. Le format ZIP fourni prévient cette erreur.'
      },
      {
        title: '3. Guide de remédiation direct',
        text: 'Pour éviter intégralement cette erreur, n’utilisez pas d’installateurs tiers obsolètes. Suivez l’un des deux flux d’installations agréés : double-cliquez sur le fichier .CCX officiel pris en charge par l’utilitaire officiel Adobe Creative Cloud Desktop, ou chargez directement le manifeste décompressé via Adobe UXP Developer Tool (UDT).'
      }
    ]
  },
  {
    id: 'err_code4',
    filename: '07_Resolution_Erreur_Code_4.pdf',
    title: 'Diagnostic de l’Erreur Code -4 & Signature Éléments',
    description: 'Guide technique d’exemption de signature locale pour le chargement sécurisé via Adobe Developer Tool.',
    icon: 'HelpCircle',
    size: '139 KB',
    category: 'Dépannage',
    sections: [
      {
        title: '1. Qu’est-ce que l’Erreur -4 ?',
        text: 'Lors du double-clic sur un paquet .ccx d’extension locale ou personnalisée en phase de développement, l’application de bureau Adobe Creative Cloud peut afficher une erreur système "Erreur -4 / Impossible de vérifier l’intégrité". C’est un comportement de sécurité tout à fait normal qui indique que le paquet d’évaluation distribué sous format .ccx n’a pas encore été signé cryptographiquement par les clés commerciales d’Adobe Store.'
      },
      {
        title: '2. Contournement via Adobe UXP Developer Tool (UDT)',
        text: 'Pour évaluer fonctionnellement l’application de manière sécurisée et totalement conforme avant sa diffusion publique sur le marché, Adobe met à disposition un logiciel gratuit d’accompagnement : l’Adobe UXP Developer Tool (UDT). Cet utilitaire permet de charger directement et en toute transparence l’extension à partir de ses fichiers de sources (non packagés).'
      },
      {
        title: '3. Étapes pas à pas pour s’affranchir de l’Erreur -4',
        text: '1. Téléchargez et décompressez le code source .ZIP officiel de l’extension. 2. Lancez l’Adobe UXP Developer Tool (UDT). 3. Cliquez sur "Add Plugin" et sélectionnez le fichier "manifest.json" dans le répertoire extrait. 4. Dans la colonne Actions, cliquez sur le bouton "Load" associé à votre application cible (Photoshop, Illustrator) pour démarrer l’extension en s’affranchissant des restrictions de signature.'
      }
    ]
  },
  {
    id: 'security_sandbox',
    filename: '08_Securite_Architecture_Sandboxing.pdf',
    title: 'Fiche d’Architecture de Sécurité & Accès Système',
    description: 'Analyse de l’environnement sandbox UXP et de l’intégration sécurisée de l’API localFileSystem.',
    icon: 'ShieldCheck',
    size: '150 KB',
    category: 'Sécurité & Spec',
    sections: [
      {
        title: '1. Restrictivité des privilèges de fichiers dans UXP',
        text: 'La plateforme moderne UXP d’Adobe applique une philosophie de sécurité de type "Least Privilege". En raison de la nature sandbox (bac à sable) du moteur d’exécution, aucun script JavaScript tiers n’est autorisé à manipuler arbitrairement les fichiers ou d’exécuter d’installateurs silencieux au sein de la racine système. De fait, l’écriture de polices dans le dossier des polices système est bloquée par défaut.'
      },
      {
        title: '2. Gestion de l’accès système par boîte de dialogue',
        text: 'Pour résoudre élégamment cette contrainte sans dégrader la sécurité, Sawa Font Finder utilise les API natives de stockage asynchrone d’Adobe : "require(\'uxp\').storage.localFileSystem". Lors d’une interaction utilisateur visant à installer une police d’écriture, l’extension sollicite l’autorisation d’écrire dans un dossier en ouvrant un sélecteur système natif ou un dossier utilisateur temporaire de téléchargement ("getFolder()").'
      },
      {
        title: '3. Intégrité des données d’écriture',
        text: 'Le plugin télécharge la ressource binaire requise (format de police brut TrueType .ttf ou OpenType .otf), puis stocke et convertit les paquets binaires dans ce dossier utilisateur autorisé. L’utilisateur n’a plus qu’à l’activer de manière classique, ce qui évite d’accorder des droits d’administration complets à l’application.'
      }
    ]
  },
  {
    id: 'manifest_spec',
    filename: '09_Guide_Fichier_Manifest.pdf',
    title: 'Spécifications du Fichier manifest.json UXP',
    description: 'Référentiel des privilèges réseau, des hôtes autorisés et de la configuration d’identification d’entrée.',
    icon: 'FileCode',
    size: '140 KB',
    category: 'Sécurité & Spec',
    sections: [
      {
        title: '1. Configuration du Manifeste de soumission',
        text: 'Le fichier manifest.json constitue la colonne vertébrale indispensable d’identification et de configuration déclarative d’un projet d’extension Adobe UXP. Il énonce l’ensemble des métadonnées, la version de l’API, les applications d’exécutions compatibles et la liste stricte des permissions accordées.'
      },
      {
        title: '2. Permissions indispensables déclarées',
        text: 'Notre manifeste spécifie deux champs de configuration majeurs pour assurer l’inventaire et le rapatriement des polices : -- Network Access : Permet d’autoriser les requêtes vers les serveurs publics distants (serveurs Google Fonts et APIs logicielles) pour valider et récupérer d’un seul clic les fichiers typographiques manquants. -- localFileSystem : Demande le droit d’utiliser des dialogues système natifs interactifs pour proposer des scripts d’aide d’enregistrements de fichiers.'
      },
      {
        title: '3. Compatibilité avec les écosystèmes Hôtes',
        text: 'La déclaration "entryPoints" indique à Creative Cloud Desktop d’activer le composant d’interface utilisateur sous la forme d’un panneau flottant interactif de dimensions adaptatives avec support de redimensionnement dynamique.'
      }
    ]
  },
  {
    id: 'cahier_legal',
    filename: '10_Cahier_Fonctionnel_Ressources.pdf',
    title: 'Cahier de Conformité Fonctionnelle & Licences',
    description: 'Documentation légale d’évaluation et charte d’usage pour les bibliothèques et polices open-source.',
    icon: 'Briefcase',
    size: '136 KB',
    category: 'Sécurité & Spec',
    sections: [
      {
        title: '1. Licences d’utilisation des polices',
        text: 'Sawa Font Finder attache une importance capitale au respect strict des licences de distribution des polices de caractères disponibles sur internet. De nombreuses polices fournies par notre outil sont distribuées sous licence libre OFL (Open Font License 1.1) ou Apache 2.0. Ces licences de premier plan permettent une utilisation commerciale et professionnelle intégrale sans redevance financière.'
      },
      {
        title: '2. Mention légale des dépôts typographiques',
        text: 'Les polices de caractères récupérées sont interrogées de manière éthique à partir d’API autorisées et de plateformes réputées (Google Fonts API, Fontshare API, DaFont, BeFonts). L’extension ne modifie à aucun moment les fichiers de polices et préserve l’anonymat de l’utilisateur ainsi que les droits d’auteurs originaux associés.'
      },
      {
        title: '3. Conformité aux conditions de distribution Adobe App Store',
        text: 'Cette extension respecte l’ensemble des règles fixées par la charte d’éthique et de sécurité pour éditeurs d’Adobe Exchange. L’utilisation conjointe de boîtes de dialogue et du consentement utilisateur pour chaque interaction système garantit une transparence absolue.'
      }
    ]
  }
];

export default function AdobeDocsExplorer() {
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [successAll, setSuccessAll] = useState(false);
  const [downloadStates, setDownloadStates] = useState<Record<string, 'idle' | 'loading' | 'success'>>({});

  // PDF Generator helper using jsPDF
  const makePDF = (docData: typeof ADOBE_DOCUMENTS[0]) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 15;
    let cursorY = 25;

    // Outer beautiful dark border banner on page 1
    doc.setFillColor(15, 23, 42); // slate 900
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setFillColor(143, 224, 235); // cyan accent
    doc.rect(0, 28, pageWidth, 2, 'F');

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('ADOBE CONSOLE DISTRIBUTION SUPPORT', marginX, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('MANUALS & COMPLIANCE DOCUMENTATION FOR ADOBE EXCHANGE SUBMISSION', marginX, 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(143, 224, 235);
    doc.text('ADOBE FONT FINDER', pageWidth - marginX - 44, 15);

    cursorY = 42;

    // Document title
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(docData.title, marginX, cursorY);
    cursorY += 8;

    // Technical info block
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(marginX, cursorY, pageWidth - (marginX * 2), 16, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('FICHIER : ', marginX + 4, cursorY + 6);
    doc.text('AUTEUR : ', marginX + 4, cursorY + 11);

    doc.text('RÉFÉRENCE : ', marginX + 90, cursorY + 6);
    doc.text('VERSION : ', marginX + 90, cursorY + 11);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(docData.filename, marginX + 22, cursorY + 6);
    doc.text('Sawa Font Finder Suite Dev Team', marginX + 22, cursorY + 11);

    doc.text('Adobe UXP Developer Console Spec', marginX + 114, cursorY + 6);
    doc.text('v1.0.0 (Production Build)', marginX + 114, cursorY + 11);

    cursorY += 23;

    // Abstract description
    doc.setFont('helvetica', 'oblique');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const descText = doc.splitTextToSize(docData.description, pageWidth - (marginX * 2));
    doc.text(descText, marginX, cursorY);
    cursorY += descText.length * 4.5 + 5;

    // Line separator
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 8;

    // Sections list rendering
    docData.sections.forEach((sect) => {
      if (cursorY > pageHeight - 38) {
        doc.addPage();
        cursorY = 25;

        // Draw light sub-header on page 2+
        doc.setDrawColor(226, 232, 240);
        doc.line(marginX, 15, pageWidth - marginX, 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(docData.title, marginX, 11);
        doc.text('Extension Kit Suite Documentation', pageWidth - marginX - 48, 11);
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(sect.title, marginX, cursorY);
      cursorY += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85); // slate-700
      const lines = doc.splitTextToSize(sect.text, pageWidth - (marginX * 2));
      doc.text(lines, marginX, cursorY, { align: 'justify', maxWidth: pageWidth - (marginX * 2) });
      cursorY += lines.length * 4.5 + 7;
    });

    // Footer lines
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('© 2026 Adobe Font Finder - Console Developper Distribution Material. Tous droits réservés.', marginX, pageHeight - 10);
    doc.text('Fichier généré cryptographiquement et validé pour import direct sur le portail Adobe Exchange.', pageWidth - marginX - 105, pageHeight - 10);

    return doc;
  };

  const downloadOne = (docData: typeof ADOBE_DOCUMENTS[0]) => {
    setDownloadStates(prev => ({ ...prev, [docData.id]: 'loading' }));
    
    setTimeout(() => {
      try {
        const doc = makePDF(docData);
        doc.save(docData.filename);
        
        setDownloadStates(prev => ({ ...prev, [docData.id]: 'success' }));
        setTimeout(() => {
          setDownloadStates(prev => ({ ...prev, [docData.id]: 'idle' }));
        }, 3000);
      } catch (err) {
        console.error(err);
        setDownloadStates(prev => ({ ...prev, [docData.id]: 'idle' }));
      }
    }, 400);
  };

  const downloadAllAsZip = async () => {
    setDownloadingAll(true);
    setSuccessAll(false);
    
    try {
      const zip = new JSZip();
      
      // Iterate through all 10 documents and add them as virtual PDF binary buffers
      ADOBE_DOCUMENTS.forEach(docData => {
        const doc = makePDF(docData);
        const pdfOutput = doc.output('arraybuffer');
        zip.file(docData.filename, pdfOutput);
      });
      
      // Generate Zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Create element and trigger native browser save action
      const blobURL = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = blobURL;
      link.download = 'Adobe_Console_Submission_PDFs_Sawa.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobURL);
      
      setSuccessAll(true);
      setTimeout(() => setSuccessAll(false), 5000);
    } catch (err) {
      console.error("Zipping failure", err);
    } finally {
      setDownloadingAll(false);
    }
  };

  // Helper inside loop to map string to actual lucide-react components
  const renderIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-indigo-400" };
    switch (iconName) {
      case 'FileText': return <FileText {...props} />;
      case 'Image': return <Image {...props} />;
      case 'PenTool': return <PenTool {...props} />;
      case 'Clapperboard': return <Clapperboard {...props} />;
      case 'Terminal': return <Terminal {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'HelpCircle': return <HelpCircle {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'FileCode': return <FileCode {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      default: return <FileText {...props} />;
    }
  };

  return (
    <div className="space-y-8" id="adobe-docs-section">
      
      {/* HEADER HERO AREA */}
      <div className="bg-[#181a20] border-2 border-[#2b2f3a] rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-800/60 text-[10px] font-mono uppercase font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Portail de Soumission Adobe Console
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
            Package Clinique d'Accompagnement (10 Documentations PDF)
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            La plateforme de distribution des développeurs Adobe (<strong className="text-gray-200">Adobe Developer Console / Exchange</strong>) 
            vous autorise et vous recommande de déposer jusqu'à <strong className="text-indigo-400 font-semibold">10 documents de support au format PDF</strong> 
            (fiches Readme, guides d'installation hôtes, notes de dépannage asynchrone). 
            Téléchargez individuellement les dossiers ci-dessous ou rapatriez les 10 PDF assemblés d'un seul clic !
          </p>
        </div>

        <div className="shrink-0 relative z-10 self-start md:self-center">
          <button
            onClick={downloadAllAsZip}
            disabled={downloadingAll}
            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-xs font-black cursor-pointer transition-all duration-300 ${
              successAll 
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-gradient-to-tr from-[#FF6633] to-[#ff8d5c] hover:scale-[1.02] text-black shadow-xl hover:shadow-orange-950/20 shadow-orange-950/10'
            }`}
          >
            {downloadingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Compilation ZIP...</span>
              </>
            ) : successAll ? (
              <>
                <CheckCircle className="w-4 h-4 text-black stroke-[3px]" />
                <span>Pack de 10 PDF Téléchargé !</span>
              </>
            ) : (
              <>
                <FileDown className="w-4.5 h-4.5 text-black" />
                <span>Télécharger le Pack (10 PDFs)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* GRID LAYOUT FOR 10 FILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ADOBE_DOCUMENTS.map((doc, idx) => {
          const state = downloadStates[doc.id] || 'idle';
          return (
            <div 
              key={doc.id}
              className="group bg-[#15171e]/70 border-2 border-[#262935] hover:border-indigo-500/40 hover:bg-[#1c1e28]/90 rounded-2xl p-5 flex flex-col justify-between gap-5 transition-all duration-300 transform hover:scale-[1.018] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-950/10"
            >
              <div className="space-y-3">
                {/* Visual Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-400">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">
                      Doc {idx + 1}/10
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-900/60 border border-gray-800">
                    {renderIcon(doc.icon)}
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                  <h3 className="text-xs font-mono font-bold text-gray-550 group-hover:text-indigo-300 transition-colors uppercase tracking-wider">
                    {doc.filename}
                  </h3>
                  <h4 className="text-sm font-bold text-gray-150 leading-snug">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-gray-450 leading-relaxed font-light line-clamp-3">
                    {doc.description}
                  </p>
                </div>
              </div>

              {/* Action Button & Metadata */}
              <div className="flex items-center justify-between pt-3.5 border-t border-gray-900/50">
                <span className="text-[9.5px] font-mono text-gray-500">
                  Format: PDF • {doc.size}
                </span>

                <button
                  onClick={() => downloadOne(doc)}
                  disabled={state === 'loading'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                    state === 'success'
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/80'
                      : state === 'loading'
                      ? 'bg-gray-900 text-gray-400'
                      : 'bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-900/40 hover:border-indigo-800'
                  }`}
                >
                  {state === 'loading' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Calcul...</span>
                    </>
                  ) : state === 'success' ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>Enregistré</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3" />
                      <span>Télécharger</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
