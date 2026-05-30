import { HostApp, DocumentFont } from '../types';

export const SYSTEM_FONTS_DATABASE: string[] = [
  "Arial", "Times New Roman", "Calibri", "Courier New", "Georgia", "Verdana",
  "Trebuchet MS", "Impact", "Comic Sans MS", "Inter", "Helvetica Neue", "Garamond",
  "Myriad Pro", "Minion Pro", "Adobe Garamond Pro", "Roboto Light", "Lato Light"
];

export const HOST_APPS: HostApp[] = [
  {
    id: 'AE',
    name: 'After Effects',
    fullName: 'Adobe After Effects',
    color: '#9999FF',
    bgColor: '#161320',          // After Effects dark steel-blue UI color
    themeColor: '#181824',
    accentColor: '#3030d0',
    iconName: 'Clapperboard',
    sampleFiles: [
      {
        id: 'ae-cyberpunk',
        name: 'Cyberpunk_Teaser_Promo.aep',
        description: 'Bande-annonce VFX animée avec éclairage néon et textes glitchs.',
        layerCount: 42,
        fonts: [
          { family: 'Orbitron', style: 'Bold', postScriptName: 'Orbitron-Bold', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif', googleFontUrl: 'https://fonts.google.com/specimen/Orbitron' },
          { family: 'Gatwick', style: 'Bold', postScriptName: 'Gatwick-Bold', status: 'missing', provider: 'BeFonts', license: 'Personal Use', category: 'Display', fontUrl: 'https://befonts.com/gatwick-font.html' },
          { family: 'Arial', style: 'Bold', postScriptName: 'Arial-BoldMT', status: 'installed', provider: 'System' }
        ]
      },
      {
        id: 'ae-credits',
        name: 'Cinematic_End_Credits.aep',
        description: 'Générique de fin déroulant avec typographie classique sérif.',
        layerCount: 18,
        fonts: [
          { family: 'Cinzel', style: 'Regular', postScriptName: 'Cinzel-Regular', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Serif', googleFontUrl: 'https://fonts.google.com/specimen/Cinzel' },
          { family: 'Astrella', style: 'Regular', postScriptName: 'Astrella-Regular', status: 'missing', provider: 'iFonts', license: 'Démo', category: 'Script', fontUrl: 'https://ifonts.xyz/astrella-font.html' },
          { family: 'Garamond', style: 'Regular', postScriptName: 'Garamond-Regular', status: 'installed', provider: 'System' }
        ]
      }
    ]
  },
  {
    id: 'AI',
    name: 'Illustrator',
    fullName: 'Adobe Illustrator',
    color: '#FF9900',
    bgColor: '#201a14',          // Illustrator dark warm-gray UI color
    themeColor: '#261e16',
    accentColor: '#d16d00',
    iconName: 'PenTool',
    sampleFiles: [
      {
        id: 'ai-brand',
        name: 'Branding_Guide_v3.ai',
        description: 'Guide graphique vectoriel incluant logos, palettes et infographies.',
        layerCount: 29,
        fonts: [
          { family: 'Oswald', style: 'Light', postScriptName: 'Oswald-Light', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif', googleFontUrl: 'https://fonts.google.com/specimen/Oswald' },
          { family: 'Satoshi', style: 'Regular', postScriptName: 'Satoshi-Regular', status: 'missing', provider: 'Fontshare', license: 'Gratuit (Perso & Pro)', category: 'Geometric Sans', fontUrl: 'https://www.fontshare.com/fonts/satoshi' },
          { family: 'Inter', style: 'Medium', postScriptName: 'Inter-Medium', status: 'installed', provider: 'System' }
        ]
      },
      {
        id: 'ai-packaging',
        name: 'Organic_Tea_Box.ai',
        description: 'Maquette vectorielle d\'emballage carton de thé biologique.',
        layerCount: 14,
        fonts: [
          { family: 'Pacifico', style: 'Regular', postScriptName: 'Pacifico-Regular', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Script', googleFontUrl: 'https://fonts.google.com/specimen/Pacifico' },
          { family: "Keep on Truckin'", style: 'Regular', postScriptName: 'KeepOnTruckin', status: 'missing', provider: 'DaFont', license: 'Gratuit (OFL)', category: 'Fancy/Groovy', fontUrl: 'https://www.dafont.com/keep-on-truckin.font' },
          { family: 'Times New Roman', style: 'Regular', postScriptName: 'TimesNewRomanPSMT', status: 'installed', provider: 'System' }
        ]
      }
    ]
  },
  {
    id: 'PS',
    name: 'Photoshop',
    fullName: 'Adobe Photoshop',
    color: '#00C8FF',
    bgColor: '#161920',          // Photoshop dark-cool gray UI color
    themeColor: '#181c24',
    accentColor: '#0084c8',
    iconName: 'Image',
    sampleFiles: [
      {
        id: 'ps-poster',
        name: 'Movie_Poster_Composite.psd',
        description: 'Affiche de film avec double exposition et calques de réglages volumineux.',
        layerCount: 78,
        fonts: [
          { family: 'Roboto', style: 'Black Condensed', postScriptName: 'Roboto-BlackCondensed', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif', googleFontUrl: 'https://fonts.google.com/specimen/Roboto' },
          { family: 'Humble Boys', style: 'Regular', postScriptName: 'HumbleBoys-Regular', status: 'missing', provider: 'iFonts', license: 'Personal Use', category: 'Display', fontUrl: 'https://ifonts.xyz/humble-boys-font.html' },
          { family: 'Proxima Nova', style: 'Semibold', postScriptName: 'ProximaNova-Semibold', status: 'missing', provider: 'Adobe Fonts', license: 'Adobe License', category: 'Sans-Serif', adobeFontUrl: 'https://fonts.adobe.com/fonts/proxima-nova' },
          { family: 'Helvetica Neue', style: 'Bold', postScriptName: 'HelveticaNeue-Bold', status: 'installed', provider: 'System' }
        ]
      },
      {
        id: 'ps-banner',
        name: 'Summer_Sale_Banner.psd',
        description: 'Vignette e-commerce avec illustrations 3D pour les réseaux sociaux.',
        layerCount: 22,
        fonts: [
          { family: 'Clash Grotesk', style: 'Medium', postScriptName: 'ClashGrotesk-Medium', status: 'missing', provider: 'Fontshare', license: 'Gratuit (Perso & Pro)', category: 'Sans-Serif', fontUrl: 'https://www.fontshare.com/fonts/clash-grotesk' },
          { family: 'Arial', style: 'Regular', postScriptName: 'ArialMT', status: 'installed', provider: 'System' }
        ]
      }
    ]
  },
  {
    id: 'PR',
    name: 'Premiere Pro',
    fullName: 'Adobe Premiere Pro',
    color: '#CC66FF',
    bgColor: '#18121d',
    themeColor: '#1f1326',
    accentColor: '#9d3cc8',
    iconName: 'Video',
    sampleFiles: [
      {
        id: 'pr-vlog',
        name: 'Vlog_Episode_45_Edit.prproj',
        description: 'Timeline vidéo avec découpes rythmiques et bande-son multi-piste.',
        layerCount: 12,
        fonts: [
          { family: 'Bebas Neue', style: 'Regular', postScriptName: 'BebasNeue-Regular', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Display', googleFontUrl: 'https://fonts.google.com/specimen/Bebas+Neue' },
          { family: 'Champagne & Limousines', style: 'Regular', postScriptName: 'ChampagneLimousines', status: 'missing', provider: '1001 Fonts', license: 'Gratuit (Perso)', category: 'Sans-Serif', fontUrl: 'https://www.1001fonts.com/champagne-limousines-font.html' },
          { family: 'Verdana', style: 'Regular', postScriptName: 'Verdana', status: 'installed', provider: 'System' }
        ]
      }
    ]
  },
  {
    id: 'ID',
    name: 'InDesign',
    fullName: 'Adobe InDesign',
    color: '#FF3366',
    bgColor: '#1e1418',
    themeColor: '#26161c',
    accentColor: '#d61a49',
    iconName: 'BookOpen',
    sampleFiles: [
      {
        id: 'id-magazine',
        name: 'Premium_Food_Magazine.indd',
        description: 'Maquette éditoriale de 64 pages riche en blocs textes chaînés.',
        layerCount: 124,
        fonts: [
          { family: 'Playfair Display', style: 'Regular', postScriptName: 'PlayfairDisplay-Regular', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Serif', googleFontUrl: 'https://fonts.google.com/specimen/Playfair+Display' },
          { family: 'Beautiful People', style: 'Regular', postScriptName: 'BeautifulPeople', status: 'missing', provider: 'DaFontFree', license: 'Personal Use', category: 'Script', fontUrl: 'https://www.dafontfree.io/beautiful-people-font/' },
          { family: 'Georgia', style: 'Italic', postScriptName: 'Georgia-Italic', status: 'installed', provider: 'System' }
        ]
      }
    ]
  },
  {
    id: 'IC',
    name: 'InCopy',
    fullName: 'Adobe InCopy',
    color: '#FF6633',
    bgColor: '#1c1411',
    themeColor: '#241a16',
    accentColor: '#d64d1a',
    iconName: 'FileText',
    sampleFiles: [
      {
        id: 'ic-article',
        name: 'Tech_Feature_Article.icml',
        description: 'Fichier de rédaction partagé lié à l\'édition InDesign générale.',
        layerCount: 5,
        fonts: [
          { family: 'Black Burger', style: 'Regular', postScriptName: 'BlackBurger-Regular', status: 'missing', provider: 'iFonts', license: 'Personal Use', category: 'Retro', fontUrl: 'https://ifonts.xyz/black-burger-font.html' },
          { family: 'Courier New', style: 'Regular', postScriptName: 'CourierNewPSMT', status: 'installed', provider: 'System' }
        ]
      }
    ]
  }
];

export const GOOGLE_FONTS_CATALOG: DocumentFont[] = [
  { family: 'Montserrat', style: 'Regular', postScriptName: 'Montserrat-Regular', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif' },
  { family: 'Montserrat', style: 'Bold', postScriptName: 'Montserrat-Bold', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif' },
  { family: 'Oswald', style: 'Light', postScriptName: 'Oswald-Light', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif' },
  { family: 'Oswald', style: 'Bold', postScriptName: 'Oswald-Bold', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif' },
  { family: 'Orbitron', style: 'Bold', postScriptName: 'Orbitron-Bold', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif' },
  { family: 'Cinzel', style: 'Regular', postScriptName: 'Cinzel-Regular', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Serif' },
  { family: 'Pacifico', style: 'Regular', postScriptName: 'Pacifico-Regular', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Script' },
  { family: 'Playfair Display', style: 'Regular', postScriptName: 'PlayfairDisplay-Regular', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Serif' },
  { family: 'Roboto', style: 'Black Condensed', postScriptName: 'Roboto-BlackCondensed', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif' },
  { family: 'Bebas Neue', style: 'Regular', postScriptName: 'BebasNeue-Regular', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Display' },
  { family: 'Fira Sans', style: 'Italic', postScriptName: 'FiraSans-Italic', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif' },
  { family: 'Lobster', style: 'Regular', postScriptName: 'Lobster-Regular', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Display' },
  { family: 'Open Sans', style: 'Regular', postScriptName: 'OpenSans', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif' },
  { family: 'Lato', style: 'Regular', postScriptName: 'Lato', status: 'missing', provider: 'Google Fonts', license: 'OFL', category: 'Sans-Serif' }
];

export const PREMIUM_FONTS_CATALOG: DocumentFont[] = [
  // iFonts
  { family: 'Astrella', style: 'Regular', postScriptName: 'Astrella-Regular', status: 'missing', provider: 'iFonts', license: 'Démo', category: 'Script', fontUrl: 'https://ifonts.xyz/astrella-font.html' },
  { family: 'Humble Boys', style: 'Regular', postScriptName: 'HumbleBoys-Regular', status: 'missing', provider: 'iFonts', license: 'Personal Use', category: 'Display', fontUrl: 'https://ifonts.xyz/humble-boys-font.html' },
  { family: 'Black Burger', style: 'Regular', postScriptName: 'BlackBurger-Regular', status: 'missing', provider: 'iFonts', license: 'Personal Use', category: 'Retro', fontUrl: 'https://ifonts.xyz/black-burger-font.html' },
  
  // DaFont
  { family: "Keep on Truckin'", style: 'Regular', postScriptName: 'KeepOnTruckin', status: 'missing', provider: 'DaFont', license: 'Gratuit (OFL)', category: 'Fancy/Groovy', fontUrl: 'https://www.dafont.com/keep-on-truckin.font' },
  { family: 'Chopin Script', style: 'Regular', postScriptName: 'ChopinScript', status: 'missing', provider: 'DaFont', license: 'Domaine Public', category: 'Calligraphy', fontUrl: 'https://www.dafont.com/chopin-script.font' },
  { family: 'Retro Gaming', style: 'Regular', postScriptName: 'RetroGaming', status: 'missing', provider: 'DaFont', license: 'Gratuit', category: 'Pixel/Arcade', fontUrl: 'https://www.dafont.com/retro-gaming.font' },
  
  // BeFonts
  { family: 'Mona Sans', style: 'Regular', postScriptName: 'MonaSans-Regular', status: 'missing', provider: 'BeFonts', license: 'OFL', category: 'Sans-Serif', fontUrl: 'https://befonts.com/mona-sans-typeface.html' },
  { family: 'Bright Serif', style: 'Regular', postScriptName: 'BrightSerif-Regular', status: 'missing', provider: 'BeFonts', license: 'Démo', category: 'Serif', fontUrl: 'https://befonts.com/bright-serif-font.html' },
  { family: 'Gatwick', style: 'Bold', postScriptName: 'Gatwick-Bold', status: 'missing', provider: 'BeFonts', license: 'Personal Use', category: 'Display', fontUrl: 'https://befonts.com/gatwick-font.html' },
  
  // Fontshare
  { family: 'Clash Grotesk', style: 'Medium', postScriptName: 'ClashGrotesk-Medium', status: 'missing', provider: 'Fontshare', license: 'Gratuit (Perso & Pro)', category: 'Sans-Serif', fontUrl: 'https://www.fontshare.com/fonts/clash-grotesk' },
  { family: 'Satoshi', style: 'Regular', postScriptName: 'Satoshi-Regular', status: 'missing', provider: 'Fontshare', license: 'Gratuit (Perso & Pro)', category: 'Geometric Sans', fontUrl: 'https://www.fontshare.com/fonts/satoshi' },
  { family: 'Synco', style: 'Bold', postScriptName: 'Synco-Bold', status: 'missing', provider: 'Fontshare', license: 'Gratuit (Perso & Pro)', category: 'Sans-Serif', fontUrl: 'https://www.fontshare.com/fonts/synco' },
  
  // 1001 Fonts
  { family: 'Champagne & Limousines', style: 'Regular', postScriptName: 'ChampagneLimousines', status: 'missing', provider: '1001 Fonts', license: 'Gratuit (Perso)', category: 'Sans-Serif', fontUrl: 'https://www.1001fonts.com/champagne-limousines-font.html' },
  { family: 'Alex Brush', style: 'Regular', postScriptName: 'AlexBrush-Regular', status: 'missing', provider: '1001 Fonts', license: 'OFL', category: 'Script', fontUrl: 'https://www.1001fonts.com/alex-brush-font.html' },
  { family: 'League Gothic', style: 'Regular', postScriptName: 'LeagueGothic-Regular', status: 'missing', provider: '1001 Fonts', license: 'OFL', category: 'Display', fontUrl: 'https://www.1001fonts.com/league-gothic-font.html' },
  
  // DaFontFree
  { family: 'Kush Typeface', style: 'Regular', postScriptName: 'KushTypeface', status: 'missing', provider: 'DaFontFree', license: 'Gratuit (Perso)', category: 'Display', fontUrl: 'https://www.dafontfree.io/kush-typeface/' },
  { family: 'Beautiful People', style: 'Regular', postScriptName: 'BeautifulPeople', status: 'missing', provider: 'DaFontFree', license: 'Personal Use', category: 'Script', fontUrl: 'https://www.dafontfree.io/beautiful-people-font/' },
  { family: 'Aveny T', style: 'Regular', postScriptName: 'AvenyT', status: 'missing', provider: 'DaFontFree', license: 'Personal Use', category: 'Sans-Serif', fontUrl: 'https://www.dafontfree.io/aveny-t-font/' }
];

export const TECHNICAL_SECTIONS = [
  {
    id: 'intro',
    title: 'Introduction à UXP',
    content: `La plateforme **UXP (Unified Extensibility Platform)** d'Adobe remplace l'architecture CEP obsolète basée sur ExtendScript, en offrant un moteur JavaScript V8 moderne pré-intégré, une exécution performante et un rendu de l'interface utilisateur basé sur des composants natifs en C++.

### Avantages de UXP :
1. **Performance Accrue** : Fini la surcouche Chromium de CEP qui consommait une mémoire considérable. UXP s’intègre au moteur de rendu central de l’hôte.
2. **Design Unifié** : Les composants spectrum nativement compris (comme \`<sp-button>\`, \`<sp-dropdown>\`) permettent d'épouser automatiquement la couleur de thème choisie par l'utilisateur.
3. **Normes Modernes** : Support de ES6, asynchronisme complet et APIs Web standard (comme \`fetch\` et \`WebSocket\`).`
  },
  {
    id: 'api-hosts',
    title: 'APIs Hôtes Adobe comparées',
    content: `Chaque application Adobe CC fournit son propre sous-ensemble d'objets dans le bac à sable UXP afin d'analyser le document. Notre plugin **UXP Font Scout** embarque une détection d'environnement automatique et bascule sur le script adapté.

| Application Hôte | Node 'Require' UXP | Chemin API DOM pour extraire les polices |
|---|---|---|
| **Photoshop** | \`require('photoshop')\` | Recensement récursif de \`app.activeDocument.layers\` (avec \`layer.kind === TEXT\`). |
| **Illustrator** | \`require('illustrator')\` | Parcours global de \`app.activeDocument.textFrames\` puis propriétés de \`textFont\`. |
| **After Effects** | \`require('aftereffects')\` | Recherche dans les compositions de calques \`ADBE Text Layer\` puis \`ADBE Text Document\`. |
| **InDesign** | \`require('indesign')\` | Accès direct via \`app.activeDocument.fonts\` et statut de police (\`FontStatus.MISSING\`). |
| **InCopy** | \`require('indesign')\` | Même structure qu'InDesign avec \`app.activeDocument.fonts\`. |
| **Premiere Pro** | SDK natif Premiere | Extraction des métadonnées Motion Graphics (Mogrt) via les pistes vidéo de la timeline active. |`
  },
  {
    id: 'security-sandboxing',
    title: 'Restrictions de Sécurité UXP',
    content: `UXP applique des politiques de sécurité strictes analogues à celles d’un navigateur récurrent. Un plugin **ne peut pas** écrire librement dans le dossier système \`C:\\Windows\\Fonts\` ou \`/Library/Fonts\` pour y installer les polices en tâche de fond.

### Méthode d'installation assistée mise en œuvre :
1. **Dialogue didactique** : Le plugin affiche une alerte expliquant la restriction technique.
2. **Dialogue de fichier sécurisé** : UXP fournit le module \`require('uxp').storage.localFileSystem\`. L'API \`getFolder()\` ouvre une boîte de dialogue native OS, invitant l'utilisateur à choisir un dossier de destination.
3. **Écriture assistée** : Le plugin télécharge le binaire de police via \`fetch\` et l'écrit localement dans l'emplacement sélectionné, puis guide l'utilisateur pour double-cliquer dessus pour l'activer sur le système.`
  },
  {
    id: 'packaging-udt',
    title: 'Packaging & Installation CCX',
    content: `Pour déployer votre plugin sur des machines d'utilisateurs ou au sein d'Adobe Exchange, vous devez le packager au format \`.ccx\`.

### Étapes de packaging :
1. Créez un sous-dossier contenant : \`manifest.json\`, \`index.html\`, \`styles.css\`, \`main.js\`, \`hostScripts.js\`, \`serviceAPI.js\` et un dossier \`icons/\`.
2. Lancez l'outil **UDT (UXP Developer Tool)** d'Adobe.
3. Cliquez sur **Add Plugin** et choisissez le dossier de votre manifeste.
4. Pour packager, cliquez sur **Package** et l'outil générera un fichier \`uxp-fontscout.ccx\`.
5. Pour installer, double-cliquez simplement sur le fichier \`.ccx\`. L'application de bureau **Adobe Creative Cloud** s'ouvrira pour l'installer de manière sécurisée.`
  }
];
