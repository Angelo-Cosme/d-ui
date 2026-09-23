import type { SortableMove } from '../src/components/Sortable/sortableMessages';

export type DocsLocale = 'fr' | 'en';

export function docsLocale(value: unknown): DocsLocale {
  return value === 'en' ? 'en' : 'fr';
}

export function localeFromSearch(search = window.location.search): DocsLocale {
  const globals = new URLSearchParams(search).get('globals') ?? '';
  return docsLocale(
    globals
      .split(/[;,&]/)
      .find((part) => part.startsWith('locale:'))
      ?.slice('locale:'.length),
  );
}

/** Sidebar / canvas story titles. Source names stay French; English via Langue. */
export const storyNameEn: Record<string, string> = {
  'Par défaut': 'Default',
  'Forte emphase': 'High emphasis',
  'Emphase moyenne': 'Medium emphasis',
  'Bouton bascule': 'Toggle button',
  'Faible emphase': 'Low emphasis',
  'Petite taille': 'Small size',
  'Pleine largeur': 'Full width',
  Chargement: 'Loading',
  'Icône seule': 'Icon only',
  Désactivé: 'Disabled',
  Invalide: 'Invalid',
  Requis: 'Required',
  Aide: 'Helper',
  Indéterminé: 'Indeterminate',
  Tailles: 'Sizes',
  Groupe: 'Group',
  Plafond: 'Capped count',
  Position: 'Placement',
  Contenu: 'Content',
  'Sur un avatar': 'On an avatar',
  Zéro: 'Zero',
  'Groupe horizontal': 'Horizontal group',
  Valide: 'Valid',
  'Texte de substitution': 'Placeholder',
  Icône: 'Icon',
  Effaçable: 'Clearable',
  'Longueur maximale': 'Max length',
  'Préfixe et suffixe': 'Prefix and suffix',
  'Halo de focus': 'Focus glow',
  Nombre: 'Number',
  'Mot de passe': 'Password',
  Activé: 'On',
  Langue: 'Locale',
  'Mises à jour en direct': 'Live updates',
  Taille: 'Size',
  'Passé et futur': 'Past and future',
  Contrôlé: 'Controlled',
  Placement: 'Placement',
  Collision: 'Collision',
  Portail: 'Portal',
  'Sans piège de focus': 'Without focus trap',
  Alignements: 'Alignments',
  'Options désactivées': 'Disabled options',
  'État vide': 'Empty state',
  'Sélection unique': 'Single selection',
  'Sélection multiple': 'Multiple selection',
  'Rendu personnalisé': 'Custom rendering',
  'Chargement de la suite': 'Loading more',
  'Erreur de liste': 'List error',
  'Types de filtre': 'Filter types',
  Descriptions: 'Descriptions',
  Clavier: 'Keyboard',
  'Cible personnalisée': 'Custom target',
  'Nom d’un bouton icône': 'Icon-only button name',
  'Surcharge de marque': 'Brand override',
  Système: 'System',
  Horizontal: 'Horizontal',
  Vertical: 'Vertical',
  Labellisé: 'Labelled',
  Externe: 'External',
  'Dans un paragraphe': 'In a paragraph',
  'Avec icône': 'With icon',
  'Couleur sombre': 'Dark color',
  'Couleur claire': 'Light color',
  Tons: 'Tones',
  Graisses: 'Weights',
  Niveaux: 'Levels',
  Gras: 'Bold',
  'Taille découplée': 'Decoupled size',
  'Avec aide': 'With helper',
  'Couleur héritée': 'Inherited color',
  'Même silhouette': 'Same silhouette',
  Nomée: 'Named',
  'Dans un bouton': 'Inside a button',
  'Dates restreintes': 'Restricted dates',
  'Début de semaine': 'Week start',
  'Plusieurs mois': 'Multiple months',
  'Week-ends indisponibles': 'Unavailable weekends',
  Année: 'Year',
  'Plage de dates': 'Date range',
  'Styles de base': 'Basic styles',
  'Styles personnalisés': 'Custom styles',
  'Palette principale': 'Primary palette',
  'Palette secondaire': 'Secondary palette',
  Couleurs: 'Colors',
  'Variantes de couleur': 'Color variants',
  'Retour à la ligne et débordement': 'Text wrap and overflow',
  'Zone de dépôt': 'Dropzone',
  'Clic seul': 'Click only',
  'Plusieurs fichiers': 'Multiple files',
  'Accept et taille max': 'Accept and max size',
  Progression: 'Progress',
  'Saisie au clavier': 'Keyboard entry',
  'Activation manuelle': 'Manual activation',
  'Onglets verticaux': 'Vertical tabs',
  'Alignés à gauche': 'Justify left',
  Détachés: 'Detached',
  'Beaucoup de pages': 'Many pages',
  Raccourcis: 'Shortcuts',
  'Variantes de déclencheur': 'Trigger variants',
  'Éléments du menu': 'Menu items',
  'Éléments désactivés': 'Disabled items',
  'Sous-menu': 'Submenu',
  'Menu contextuel': 'Context menu',
  'Avec icônes': 'With icons',
  Replié: 'Collapsed',
  Imbriqués: 'Nested',
  Superposition: 'Overlay',
  'Bouton menu': 'Menu button',
  Variantes: 'Variants',
  'Avec titre': 'With title',
  Fermable: 'Dismissible',
  'Avec actions': 'With actions',
  'Annonce dynamique': 'Live announcement',
  'Sans fond': 'Without background',
  'Avec action': 'With action',
  'File d’attente': 'Queue',
  'Pied de page fixe': 'Fixed footer',
  'Centré, action unique': 'Centered, single action',
  'Centré, actions pleine largeur': 'Centered, wide buttons',
  Alerte: 'Alert',
  'Avec croix de fermeture': 'With dismiss button',
  'Alerte, actions à gauche': 'Alert, left-aligned actions',
  Animation: 'Animation',
  'Avec formulaire': 'With a form',
  Confirmation: 'Confirm dialog',
  'Alerte par variante': 'Alert by kind',
  'Traitement en cours': 'Processing',
  'Contenu défilant': 'Scrollable content',
  'Bordure et coins': 'Border and corners',
  Arrondi: 'Corner radius',
  Apparences: 'Appearances',
  'Avec média': 'With media',
  'En-tête et pied': 'Header and footer',
  Horizontale: 'Horizontal card',
  Lien: 'As a link',
  Bouton: 'As a button',
  Composition: 'Composition',
  Initiales: 'Initials',
  Photo: 'Photo',
  'Sans image': 'No image',
  Carré: 'Square',
  'Avec point': 'With dot',
  Présence: 'Presence',
  'À côté d’un nom': 'Beside a name',
  'Bouton désactivé': 'Disabled button',
  'Plusieurs sections': 'Multiple sections',
  'Sections désactivées': 'Disabled sections',
  Ordonnée: 'Ordered',
  Filets: 'Dividers',
  Emplacements: 'Slots',
  'Alignement numérique': 'Numeric alignment',
  Légende: 'Caption',
  Débordement: 'Overflow',
  'En-tête collant': 'Sticky header',
  'Pied de tableau': 'Table footer',
  'En-tête de ligne': 'Row header',
  'Avec description': 'With description',
  'Image et vidéo': 'Image and video',
  Paragraphe: 'Paragraph',
  Carte: 'Card',
  Widget: 'Widget',
  Liste: 'List',
  Témoignage: 'Testimonial',
  Indéterminée: 'Indeterminate',
  'Avec la valeur': 'With the value',
  Circulaire: 'Circular',
  'Texte annoncé': 'Announced text',
  Pastilles: 'Bullets',
  'Pastilles et texte': 'Bullets and text',
  Panneaux: 'Panels',
  'Panneaux encadrés': 'Panels with border',
  'Fil d’Ariane': 'Breadcrumb',
  'Frise verticale': 'Timeline',
  'Avec une barre de progression': 'With a progress bar',
  Détaillé: 'Detailed',
  'Étapes cliquables': 'Clickable steps',
  'Clavier et annonces': 'Keyboard and announcements',
  'Liste ordonnée': 'Ordered list',
  'Disposition horizontale': 'Horizontal layout',
  Grille: 'Grid',
  'Élément verrouillé': 'Locked item',
  'Boutons Monter / Descendre': 'Move up / down buttons',
  'Pied de carte': 'Card footer',
  'Numéros centrés': 'Centered page numbers',
  'Pied de carte simple': 'Simple card footer',
  Recherche: 'Search',
  Filtres: 'Filtering',
  Tri: 'Sorting',
  'Colonne non triable': 'Non-sortable column',
  'Sélection de lignes': 'Selecting rows',
  'Lignes verrouillées': 'Locked rows',
  Export: 'Export',
  'Avec onglets': 'With tabs',
  Pagination: 'Pagination',
  'Colonnes et lignes': 'Columns and rows',
  'Aucun résultat': 'No results',
  Miniature: 'Thumbnail',
  Rapports: 'Ratios',
  Cadrage: 'Fit',
  'Image indisponible': 'Image unavailable',
  Décorative: 'Decorative',
  Vignette: 'Tile',
  'Fichier refusé': 'Rejected file',
  'Galerie d’images': 'Image gallery',
  'Photo unique': 'Single photo',
  Groupes: 'Groups',
  'Icônes et raccourcis': 'Icons and shortcuts',
  'Mots-clés': 'Keywords',
  'Filtre personnalisé': 'Custom filter',
  'Recherche distante': 'Remote search',
  'Raccourci clavier': 'Keyboard shortcut',
  'Bord d’ancrage': 'Anchor side',
  'Panneau de filtres': 'Filter panel',
  'Sans croix de fermeture': 'Without dismiss button',
  'Focus initial': 'Initial focus',
  'Navigation mobile': 'Mobile navigation',
  'Types de séance': 'Session types',
  'Couleur par jeton': 'Colour by token',
  'Vue jour': 'Day view',
  'Vue semaine': 'Week view',
  'Contenu minimal': 'Minimal content',
  'Avec lien': 'With a link',
};

const storyNameFr: Record<string, string> = Object.fromEntries(
  Object.entries(storyNameEn).map(([fr, en]) => [en, fr]),
);

export function storyLabel(name: string, locale: DocsLocale): string {
  if (locale === 'en') return storyNameEn[name] ?? name;
  return storyNameFr[name] ?? name;
}

/** Manager toolbar labels. Source titles stay French; English via Langue. */
export const toolbarLabelEn: Record<string, string> = {
  Thème: 'Theme',
  Clair: 'Light',
  Sombre: 'Dark',
  Langue: 'Language',
};

const toolbarLabelFr: Record<string, string> = Object.fromEntries(
  Object.entries(toolbarLabelEn).map(([fr, en]) => [en, fr]),
);

export function toolbarLabel(name: string, locale: DocsLocale): string {
  if (locale === 'en') return toolbarLabelEn[name] ?? name;
  return toolbarLabelFr[name] ?? name;
}

const fr = {
  default: 'Par défaut',
  disabled: 'Désactivé',
  withIcon: 'Avec icône',
  dropdown: 'Menu',
  split: 'Fractionné',
  subscribe: "S'abonner",
  subscribed: 'Abonné',
  fullWidthSingle: 'Bouton pleine largeur',
  fullWidthTwo: 'Deux boutons pleine largeur',
  button: 'Bouton',
  add: 'Ajouter',
  moreActions: "Plus d'actions",
  openMenu: 'Ouvrir le menu',
  continue: 'Continuer',
  saving: 'Enregistrement',
};

const en = {
  default: 'Default',
  disabled: 'Disabled',
  withIcon: 'With Icon',
  dropdown: 'Dropdown',
  split: 'Split',
  subscribe: 'Subscribe',
  subscribed: 'Subscribed',
  fullWidthSingle: 'Single full width button',
  fullWidthTwo: 'Two full width buttons',
  button: 'Button',
  add: 'Add',
  moreActions: 'More actions',
  openMenu: 'Open menu',
  continue: 'Continue',
  saving: 'Saving',
};

export type ButtonDocsCopy = typeof fr;

export function buttonCopy(locale: DocsLocale): ButtonDocsCopy {
  return locale === 'en' ? en : fr;
}

const timeAgoFr = {
  submitted: 'Soumis',
  lastSeen: 'Vu pour la dernière fois',
  liveHint:
    'live — le texte relatif se met à jour ; les technologies d’assistance ne sont pas annoncées à chaque tick',
  english: 'Anglais',
  french: 'Français',
  englishHint: 'locale="en"',
  frenchHint: 'locale="fr" — heure absolue sur 24 h, sans AM/PM',
  small: 'Petite',
  medium: 'Moyenne',
  mediumHint: 'size="md" (défaut)',
  past: 'Passé',
  future: 'Futur',
  yesterday: 'Hier',
  pastHint: 'Il y a cinq heures',
  futureHint: 'Dans trois heures',
};

const timeAgoEn = {
  submitted: 'Submitted',
  lastSeen: 'Last seen',
  liveHint: 'live — relative text updates; assistive tech is not announced on each tick',
  english: 'English',
  french: 'French',
  englishHint: 'locale="en"',
  frenchHint: 'locale="fr" — 24h absolute time, no AM/PM',
  small: 'Small',
  medium: 'Medium',
  mediumHint: 'size="md" (default)',
  past: 'Past',
  future: 'Future',
  yesterday: 'Yesterday',
  pastHint: 'Five hours ago',
  futureHint: 'In three hours',
};

export type TimeAgoDocsCopy = typeof timeAgoFr;

export function timeAgoCopy(locale: DocsLocale): TimeAgoDocsCopy {
  return locale === 'en' ? timeAgoEn : timeAgoFr;
}

const inputFr = {
  fieldLabel: 'Libellé du champ',
  textareaLabel: 'Libellé de la zone de texte',
  numberLabel: 'Nombre',
  name: 'Nom',
  email: 'Email',
  password: 'Mot de passe',
  search: 'Recherche',
  quantity: 'Quantité',
  site: 'Site',
  placeholder: 'Texte de substitution',
  placeholderName: 'Ada Lovelace',
  helper: 'Texte d’aide',
  validValue: 'Valeur valide',
  invalidValue: 'Valeur invalide',
  filledValue: 'Valeur',
  small: 'Petite',
  medium: 'Moyenne',
  large: 'Grande',
  clear: 'Effacer',
  revealPassword: 'Afficher le mot de passe',
  hidePassword: 'Masquer le mot de passe',
  countRemaining: (n: number) =>
    n === 1 ? '1 caractère restant' : `${n} caractères restants`,
};

const inputEn = {
  fieldLabel: 'Text field label',
  textareaLabel: 'Text area label',
  numberLabel: 'Number',
  name: 'Name',
  email: 'Email',
  password: 'Password',
  search: 'Search',
  quantity: 'Quantity',
  site: 'Site',
  placeholder: 'Placeholder text',
  placeholderName: 'Ada Lovelace',
  helper: 'Helper text',
  validValue: 'Valid value',
  invalidValue: 'Invalid value',
  filledValue: 'Value',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  clear: 'Clear',
  revealPassword: 'Show password',
  hidePassword: 'Hide password',
  countRemaining: (n: number) =>
    n === 1 ? '1 character remaining' : `${n} characters remaining`,
};

export type InputDocsCopy = typeof inputFr;

export function inputCopy(locale: DocsLocale): InputDocsCopy {
  return locale === 'en' ? inputEn : inputFr;
}

const selectionFr = {
  checkboxLabel: 'Recevoir les notifications',
  terms: 'J’accepte les conditions',
  helper: 'Vous pourrez changer d’avis.',
  error: 'Ce champ est requis.',
  groupError: 'Choisissez au moins une option.',
  radioError: 'Choisissez une formule.',
  selectAll: 'Tout sélectionner',
  channels: 'Canaux de notification',
  email: 'Email',
  sms: 'SMS',
  push: 'Push',
  plan: 'Formule',
  monthly: 'Mensuel',
  yearly: 'Annuel',
  team: 'Équipe',
  switchLabel: 'Mode compact',
  switchHelper: 'Réduit les marges de l’interface.',
  small: 'Petite',
  medium: 'Moyenne',
  large: 'Grande',
};

const selectionEn = {
  checkboxLabel: 'Receive notifications',
  terms: 'I accept the terms',
  helper: 'You can change this later.',
  error: 'This field is required.',
  groupError: 'Choose at least one option.',
  radioError: 'Choose a plan.',
  selectAll: 'Select all',
  channels: 'Notification channels',
  email: 'Email',
  sms: 'SMS',
  push: 'Push',
  plan: 'Plan',
  monthly: 'Monthly',
  yearly: 'Yearly',
  team: 'Team',
  switchLabel: 'Compact mode',
  switchHelper: 'Reduces spacing in the interface.',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export type SelectionDocsCopy = typeof selectionFr;

export function selectionCopy(locale: DocsLocale): SelectionDocsCopy {
  return locale === 'en' ? selectionEn : selectionFr;
}

const selectFr = {
  country: 'Pays',
  city: 'Ville',
  choose: 'Choisir',
  search: 'Rechercher',
  empty: 'Aucune option',
  helper: 'Le pays de résidence.',
  error: 'Ce champ est requis.',
  france: 'France',
  belgium: 'Belgique',
  canada: 'Canada',
  switzerland: 'Suisse',
  europe: 'Europe',
  americas: 'Amériques',
  paris: 'Paris',
  lyon: 'Lyon',
  marseille: 'Marseille',
  brussels: 'Bruxelles',
  toggle: 'Afficher les suggestions',
  clear: 'Effacer',
  remove: 'Retirer',
  cities: 'Villes',
  capital: 'Capitale',
  gastronomy: 'Gastronomie',
  port: 'Port',
  customCity: 'Ville ajoutée',
  create: 'Créer',
  loading: 'Chargement',
  loadingMore: 'Chargement de la suite',
  emptyQuery: 'Aucun résultat pour',
  listError: 'Impossible de charger les options',
  listRetry: 'Réessayez.',
  filterAuto: 'Filtre automatique',
  filterManual: 'Filtre manuel',
  filterOff: 'Sans saisie',
  small: 'Petite',
  medium: 'Moyenne',
  large: 'Grande',
};

const selectEn = {
  country: 'Country',
  city: 'City',
  choose: 'Choose',
  search: 'Search',
  empty: 'No options',
  helper: 'Country of residence.',
  error: 'This field is required.',
  france: 'France',
  belgium: 'Belgium',
  canada: 'Canada',
  switzerland: 'Switzerland',
  europe: 'Europe',
  americas: 'Americas',
  paris: 'Paris',
  lyon: 'Lyon',
  marseille: 'Marseille',
  brussels: 'Brussels',
  toggle: 'Show suggestions',
  clear: 'Clear',
  remove: 'Remove',
  cities: 'Cities',
  capital: 'Capital',
  gastronomy: 'Gastronomy',
  port: 'Port',
  customCity: 'Added city',
  create: 'Create',
  loading: 'Loading',
  loadingMore: 'Loading more',
  emptyQuery: 'No results for',
  listError: 'Could not load options',
  listRetry: 'Try again.',
  filterAuto: 'Automatic filter',
  filterManual: 'Manual filter',
  filterOff: 'No typing',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export type SelectDocsCopy = typeof selectFr;

export function selectCopy(locale: DocsLocale): SelectDocsCopy {
  return locale === 'en' ? selectEn : selectFr;
}

const overlayFr = {
  help: 'Aide',
  tip: 'Enregistrer (⌘S)',
  open: 'Ouvrir',
  close: 'Fermer',
  options: 'Options',
  more: 'Plus d’infos',
  top: 'Haut',
  bottom: 'Bas',
  left: 'Gauche',
  right: 'Droite',
  topStart: 'Haut début',
  topEnd: 'Haut fin',
  alignStart: 'Aligné au début du haut',
  alignEnd: 'Aligné à la fin du haut',
  action: 'Confirmer',
  react: 'Réagir',
  reactions: 'Réactions',
  emojiHeart: 'Cœur étincelant',
  emojiThumbsUp: 'Pouce en l’air',
  emojiParty: 'Cotillons',
  emojiClap: 'Applaudissements',
  emojiJoy: 'Larmes de joie',
  emojiWow: 'Surprise',
  emojiCry: 'Larmes',
  emojiThink: 'Réflexion',
  emojiThumbsDown: 'Pouce en bas',
};

const overlayEn = {
  help: 'Help',
  tip: 'Save (⌘S)',
  open: 'Open',
  close: 'Close',
  options: 'Options',
  more: 'More info',
  top: 'Top',
  bottom: 'Bottom',
  left: 'Left',
  right: 'Right',
  topStart: 'Top start',
  topEnd: 'Top end',
  alignStart: 'Aligned to the start of the top side',
  alignEnd: 'Aligned to the end of the top side',
  action: 'Confirm',
  react: 'React',
  reactions: 'Reactions',
  emojiHeart: 'Sparkling heart',
  emojiThumbsUp: 'Thumbs up',
  emojiParty: 'Party popper',
  emojiClap: 'Clapping hands',
  emojiJoy: 'Face with tears of joy',
  emojiWow: 'Astonished face',
  emojiCry: 'Crying face',
  emojiThink: 'Thinking face',
  emojiThumbsDown: 'Thumbs down',
};

export type OverlayDocsCopy = typeof overlayFr;

export function overlayCopy(locale: DocsLocale): OverlayDocsCopy {
  return locale === 'en' ? overlayEn : overlayFr;
}

const skipLinkFr = {
  label: 'Aller au contenu principal',
  customLabel: 'Aller au contenu',
  hint: 'Tabulation une fois — le lien d’évitement devient visible. Entrée envoie le focus vers le contenu principal.',
  main: 'Contenu principal',
  customTarget: 'Zone de contenu',
  customHint: 'href="#content" — même comportement, autre cible.',
};

const skipLinkEn = {
  label: 'Skip to main content',
  customLabel: 'Skip to content',
  hint: 'Tab once — the skip link becomes visible. Enter moves focus to the main landmark.',
  main: 'Main content',
  customTarget: 'Content area',
  customHint: 'href="#content" — same behaviour, different target.',
};

export type SkipLinkDocsCopy = typeof skipLinkFr;

export function skipLinkCopy(locale: DocsLocale): SkipLinkDocsCopy {
  return locale === 'en' ? skipLinkEn : skipLinkFr;
}

const visuallyHiddenFr = {
  close: 'Fermer',
};

const visuallyHiddenEn = {
  close: 'Close',
};

export type VisuallyHiddenDocsCopy = typeof visuallyHiddenFr;

export function visuallyHiddenCopy(locale: DocsLocale): VisuallyHiddenDocsCopy {
  return locale === 'en' ? visuallyHiddenEn : visuallyHiddenFr;
}

const themeFr = {
  brand: 'Marque violet',
  system: 'Suit le système',
  systemHint:
    'mode="system" — suit prefers-color-scheme, sans toucher document.documentElement.',
};

const themeEn = {
  brand: 'Purple brand',
  system: 'Follows the system',
  systemHint:
    'mode="system" — follows prefers-color-scheme, without touching document.documentElement.',
};

export type ThemeDocsCopy = typeof themeFr;

export function themeCopy(locale: DocsLocale): ThemeDocsCopy {
  return locale === 'en' ? themeEn : themeFr;
}

const typographyFr = {
  sample:
    'Le design system fournit les primitives typographiques pour que les écrans n’inventent pas leurs propres tailles.',
  body: 'body — texte courant',
  bodySm: 'body-sm — texte secondaire, aides de saisie',
  caption: 'caption — légendes, métadonnées',
  styleDisplay: 'Display',
  styleTitle: 'Title',
  styleSubtitle: 'Subtitle — le ciel n’est pas la limite, seulement le début du parcours',
  styleBody:
    'Body Des centaines de milliers d’étudiants suivent un parcours. Le texte courant porte l’essentiel : modules, descriptions, consignes. Il reste utile, simple, et lisible sur toute la largeur de la colonne.',
  styleBodySm:
    'Body-sm Des aides, des légendes secondaires et des métadonnées encore lisibles. Moins d’emphase, même contraste utilisable.',
  styleCaption: 'Caption',
  stylePublish: 'Publié le 12 mars 2026',
  customTitle1: 'Title1',
  customTitle2: 'Title2',
  customTitle3: 'Title3',
  customTitle4: 'Title4',
  customIntro: 'Intro',
  customBodyLarge: 'Body large',
  customBody: 'Body',
  customQuote:
    '« Le design system fournit les primitives typographiques pour que les écrans n’inventent pas leurs propres tailles. »',
  toneDefault: 'tone="default" — contraste maximal',
  toneMuted: 'tone="muted" — reste au-dessus de 4.5:1',
  toneDanger: 'tone="danger" — message d’erreur',
  heading: 'Parcours d’apprentissage',
  level1: 'Niveau 1 — display',
  level2: 'Niveau 2 — title',
  level3: 'Niveau 3 — subtitle',
  level4: 'Niveau 4 — body',
  sizeDecoupledDisplay: 'h2 rendu en display',
  sizeDecoupledSubtitle: 'h1 rendu en subtitle',
  catalogue: 'Consulter le catalogue',
  darkLink: 'Lien sombre',
  lightLink: 'Lien clair',
  inTextBefore: 'Le soulignement est permanent :',
  inTextLink: 'ce lien',
  inTextAfter: 'reste identifiable même sans percevoir la couleur.',
  docs: 'Documentation Dudalo',
  previous: 'Section précédente',
  next: 'Section suivante',
  drafts: 'Brouillons',
  published: 'Publiés',
  labelled: 'Fin des résultats pertinents',
  relevant: 'Résultats pertinents',
  other: 'Autres résultats',
  colorBefore: 'Voici un mot',
  colorEmphasis: 'coloré',
  colorAfter: 'dans la phrase.',
  weightRegular: 'regular — graisse par défaut',
  weightMedium: 'medium — emphase moyenne',
  weightSemibold: 'semibold — emphase forte',
  wrapDefault: 'par défaut',
  wrapNoWrap: 'noWrap',
  wrapTruncate: 'truncate',
  wrapTruncateMultiline: 'truncate { lines: 2 }',
  wrapSample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
};

const typographyEn = {
  sample:
    'The design system provides typography primitives so screens do not invent their own sizes.',
  body: 'body — running text',
  bodySm: 'body-sm — secondary text, field help',
  caption: 'caption — captions, metadata',
  styleDisplay: 'Display',
  styleTitle: 'Title',
  styleSubtitle: 'Subtitle — the sky is not the limit, only the start of the path',
  styleBody:
    'Body Hundreds of thousands of students follow a path. Running text carries the bulk of the content: modules, descriptions, instructions. It stays useful, simple, and readable across the column.',
  styleBodySm:
    'Body-sm Secondary help, captions, and metadata that remain readable. Less emphasis, still a usable contrast.',
  styleCaption: 'Caption',
  stylePublish: 'Published 12 March 2026',
  customTitle1: 'Title1',
  customTitle2: 'Title2',
  customTitle3: 'Title3',
  customTitle4: 'Title4',
  customIntro: 'Intro',
  customBodyLarge: 'Body large',
  customBody: 'Body',
  customQuote:
    '“The design system provides typography primitives so screens do not invent their own sizes.”',
  toneDefault: 'tone="default" — maximum contrast',
  toneMuted: 'tone="muted" — stays above 4.5:1',
  toneDanger: 'tone="danger" — error message',
  heading: 'Learning path',
  level1: 'Level 1 — display',
  level2: 'Level 2 — title',
  level3: 'Level 3 — subtitle',
  level4: 'Level 4 — body',
  sizeDecoupledDisplay: 'h2 rendered as display',
  sizeDecoupledSubtitle: 'h1 rendered as subtitle',
  catalogue: 'Browse the catalogue',
  darkLink: 'Dark color link',
  lightLink: 'Light color link',
  inTextBefore: 'The underline is permanent:',
  inTextLink: 'this link',
  inTextAfter: 'stays identifiable even without perceiving colour.',
  docs: 'Dudalo documentation',
  previous: 'Previous section',
  next: 'Next section',
  drafts: 'Drafts',
  published: 'Published',
  labelled: 'End of relevant results',
  relevant: 'Relevant results',
  other: 'Other results',
  colorBefore: 'Here is a',
  colorEmphasis: 'coloured',
  colorAfter: 'word in the sentence.',
  weightRegular: 'regular — default weight',
  weightMedium: 'medium — medium emphasis',
  weightSemibold: 'semibold — strong emphasis',
  wrapDefault: 'default',
  wrapNoWrap: 'noWrap',
  wrapTruncate: 'truncate',
  wrapTruncateMultiline: 'truncate { lines: 2 }',
  wrapSample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
};

export type TypographyDocsCopy = typeof typographyFr;

export function typographyCopy(locale: DocsLocale): TypographyDocsCopy {
  return locale === 'en' ? typographyEn : typographyFr;
}

const colorFr = {
  brand: 'Marque',
  dark: 'Sombre',
  light: 'Clair',
  danger: 'Danger',
  warning: 'Attention',
  success: 'Succès',
  info: 'Info',
  violet: 'Violet',
};

const colorEn = {
  brand: 'Brand',
  dark: 'Dark',
  light: 'Light',
  danger: 'Danger',
  warning: 'Warning',
  success: 'Success',
  info: 'Info',
  violet: 'Violet',
};

export type ColorDocsCopy = typeof colorFr;

export function colorCopy(locale: DocsLocale): ColorDocsCopy {
  return locale === 'en' ? colorEn : colorFr;
}

const iconFr = {
  continue: 'Continuer',
  filter: 'Filtrer',
  delete: 'Supprimer',
  deleteForever: 'Supprimer définitivement',
};

const iconEn = {
  continue: 'Continue',
  filter: 'Filter',
  delete: 'Delete',
  deleteForever: 'Delete permanently',
};

export type IconDocsCopy = typeof iconFr;

export function iconCopy(locale: DocsLocale): IconDocsCopy {
  return locale === 'en' ? iconEn : iconFr;
}

const calendarFr = {
  weekMonday: 'Semaine le lundi',
  weekSunday: 'Semaine le dimanche',
  french: 'Français',
  english: 'Anglais',
  small: 'Petite',
  medium: 'Moyenne',
  large: 'Grande',
};

const calendarEn = {
  weekMonday: 'Week starts Monday',
  weekSunday: 'Week starts Sunday',
  french: 'French',
  english: 'English',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export type CalendarDocsCopy = typeof calendarFr;

export function calendarCopy(locale: DocsLocale): CalendarDocsCopy {
  return locale === 'en' ? calendarEn : calendarFr;
}

export type CalendarEventSession = {
  /** `YYYY-MM-DD` */
  date: string;
  start: string;
  end: string;
  type: 'lecture' | 'tutorial' | 'lab' | 'exam' | 'other';
  title: string;
  course: string;
  location: string;
};

const calendarEventSessionsFr: CalendarEventSession[] = [
  {
    date: '2026-03-16',
    start: '08:00',
    end: '10:00',
    type: 'lecture',
    title: 'Algorithmique',
    course: 'INF-201',
    location: 'Amphi A',
  },
  {
    date: '2026-03-16',
    start: '10:15',
    end: '12:15',
    type: 'tutorial',
    title: 'Algorithmique — TD groupe 2',
    course: 'INF-201',
    location: 'Salle B12',
  },
  {
    date: '2026-03-16',
    start: '14:00',
    end: '17:00',
    type: 'lab',
    title: 'Programmation web',
    course: 'INF-214',
    location: 'Salle machine 3',
  },
  {
    date: '2026-03-17',
    start: '08:00',
    end: '10:00',
    type: 'lecture',
    title: 'Bases de données',
    course: 'INF-205',
    location: 'Amphi B',
  },
  {
    date: '2026-03-17',
    start: '13:00',
    end: '15:00',
    type: 'tutorial',
    title: 'Mathématiques discrètes',
    course: 'MAT-202',
    location: 'Salle C04',
  },
  {
    date: '2026-03-18',
    start: '09:00',
    end: '11:00',
    type: 'exam',
    title: 'Partiel d’algorithmique',
    course: 'INF-201',
    location: 'Amphi A',
  },
  {
    date: '2026-03-18',
    start: '14:00',
    end: '16:00',
    type: 'other',
    title: 'Permanence de tutorat',
    course: 'L2 Informatique',
    location: 'Bibliothèque, 1er étage',
  },
  {
    date: '2026-03-19',
    start: '10:00',
    end: '12:00',
    type: 'lecture',
    title: 'Réseaux',
    course: 'INF-210',
    location: 'Amphi B',
  },
  {
    date: '2026-03-19',
    start: '14:00',
    end: '17:00',
    type: 'lab',
    title: 'Bases de données — TP',
    course: 'INF-205',
    location: 'Salle machine 1',
  },
  {
    date: '2026-03-20',
    start: '08:00',
    end: '10:00',
    type: 'tutorial',
    title: 'Réseaux — TD',
    course: 'INF-210',
    location: 'Salle B08',
  },
];

const calendarEventSessionsEn: CalendarEventSession[] = [
  {
    date: '2026-03-16',
    start: '08:00',
    end: '10:00',
    type: 'lecture',
    title: 'Algorithms',
    course: 'INF-201',
    location: 'Lecture hall A',
  },
  {
    date: '2026-03-16',
    start: '10:15',
    end: '12:15',
    type: 'tutorial',
    title: 'Algorithms — tutorial group 2',
    course: 'INF-201',
    location: 'Room B12',
  },
  {
    date: '2026-03-16',
    start: '14:00',
    end: '17:00',
    type: 'lab',
    title: 'Web programming',
    course: 'INF-214',
    location: 'Computer room 3',
  },
  {
    date: '2026-03-17',
    start: '08:00',
    end: '10:00',
    type: 'lecture',
    title: 'Databases',
    course: 'INF-205',
    location: 'Lecture hall B',
  },
  {
    date: '2026-03-17',
    start: '13:00',
    end: '15:00',
    type: 'tutorial',
    title: 'Discrete mathematics',
    course: 'MAT-202',
    location: 'Room C04',
  },
  {
    date: '2026-03-18',
    start: '09:00',
    end: '11:00',
    type: 'exam',
    title: 'Algorithms midterm',
    course: 'INF-201',
    location: 'Lecture hall A',
  },
  {
    date: '2026-03-18',
    start: '14:00',
    end: '16:00',
    type: 'other',
    title: 'Tutoring drop-in',
    course: 'Year 2 Computer Science',
    location: 'Library, 1st floor',
  },
  {
    date: '2026-03-19',
    start: '10:00',
    end: '12:00',
    type: 'lecture',
    title: 'Networks',
    course: 'INF-210',
    location: 'Lecture hall B',
  },
  {
    date: '2026-03-19',
    start: '14:00',
    end: '17:00',
    type: 'lab',
    title: 'Databases — lab',
    course: 'INF-205',
    location: 'Computer room 1',
  },
  {
    date: '2026-03-20',
    start: '08:00',
    end: '10:00',
    type: 'tutorial',
    title: 'Networks — tutorial',
    course: 'INF-210',
    location: 'Room B08',
  },
];

const calendarEventFr = {
  typeLabels: {
    lecture: 'Cours magistral',
    tutorial: 'TD',
    lab: 'TP',
    exam: 'Examen',
    other: 'Autre',
  },
  title: 'Algorithmique',
  course: 'INF-201 · L2 Informatique',
  location: 'Amphi A',
  small: 'Petite',
  medium: 'Moyenne',
  customised: 'Examens en violet (jeton surchargé)',
  openDetails: 'Algorithmique',
  noSession: 'Aucune séance ce jour-là.',
  sessionsOf: (day: string) => `Séances du ${day}`,
  sessions: calendarEventSessionsFr,
};

const calendarEventEn: typeof calendarEventFr = {
  typeLabels: {
    lecture: 'Lecture',
    tutorial: 'Tutorial',
    lab: 'Lab',
    exam: 'Exam',
    other: 'Other',
  },
  title: 'Algorithms',
  course: 'INF-201 · Year 2 Computer Science',
  location: 'Lecture hall A',
  small: 'Small',
  medium: 'Medium',
  customised: 'Exams in purple (token override)',
  openDetails: 'Algorithms',
  noSession: 'No session that day.',
  sessionsOf: (day: string) => `Sessions on ${day}`,
  sessions: calendarEventSessionsEn,
};

export type CalendarEventDocsCopy = typeof calendarEventFr;

export function calendarEventCopy(locale: DocsLocale): CalendarEventDocsCopy {
  return locale === 'en' ? calendarEventEn : calendarEventFr;
}

const imageFr = {
  alt: 'Amphithéâtre pendant un cours',
  caption: 'Rentrée 2026',
  broken: 'Image indisponible',
  square: 'Carré',
  video: 'Paysage',
  portrait: 'Portrait',
  wide: 'Bandeau',
  cover: 'Rognée',
  contain: 'Entière',
  fileName: 'plan-de-cours.pdf',
  imageName: 'amphi.png',
  removeFile: (name: string) => `Retirer ${name}`,
  tooHeavy: 'Dépasse 2 Mo',
  sending: 'Envoi : 40 %',
};

const imageEn = {
  alt: 'Lecture hall during a class',
  caption: 'Autumn 2026',
  broken: 'Image unavailable',
  square: 'Square',
  video: 'Landscape',
  portrait: 'Portrait',
  wide: 'Banner',
  cover: 'Cropped',
  contain: 'Whole',
  fileName: 'course-outline.pdf',
  imageName: 'hall.png',
  removeFile: (name: string) => `Remove ${name}`,
  tooHeavy: 'Over 2 MB',
  sending: 'Uploading: 40%',
};

export type ImageDocsCopy = typeof imageFr;

export function imageCopy(locale: DocsLocale): ImageDocsCopy {
  return locale === 'en' ? imageEn : imageFr;
}

const fileUploadFr = {
  label: 'Devoir',
  helper: 'PDF, jusqu’à 5 Mo.',
  browse: 'Choisir un fichier',
  drop: 'Glissez les fichiers ici ou cliquez pour les choisir',
  error: 'Ce champ est requis.',
  progress: 'Envoi : 40 %',
  small: 'Petite',
  medium: 'Moyenne',
  large: 'Grande',
  galleryLabel: 'Photos du cours',
  galleryHelper: 'JPEG ou PNG, jusqu’à 2 Mo par image.',
  galleryFiles: 'Photos choisies',
  photoLabel: 'Photo de profil',
  photoBrowse: 'Choisir une photo',
  noFile: 'Aucun fichier choisi',
  deletePhoto: 'Supprimer la photo',
};

const fileUploadEn = {
  label: 'Assignment',
  helper: 'PDF, up to 5 MB.',
  browse: 'Choose file',
  drop: 'Drop files here or click to choose them',
  error: 'This field is required.',
  progress: 'Upload: 40%',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  galleryLabel: 'Course photos',
  galleryHelper: 'JPEG or PNG, up to 2 MB per image.',
  galleryFiles: 'Chosen photos',
  photoLabel: 'Profile photo',
  photoBrowse: 'Choose a photo',
  noFile: 'No file chosen',
  deletePhoto: 'Delete photo',
};

export type FileUploadDocsCopy = typeof fileUploadFr;

export function fileUploadCopy(locale: DocsLocale): FileUploadDocsCopy {
  return locale === 'en' ? fileUploadEn : fileUploadFr;
}

const datePickerFr = {
  label: 'Échéance',
  helper: 'Saisissez une date ou ouvrez le calendrier.',
  placeholder: 'JJ/MM/AAAA',
  error: 'Date invalide.',
  restricted: 'Entre le 5 et le 25 mars.',
  small: 'Petite',
  medium: 'Moyenne',
  large: 'Grande',
};

const datePickerEn = {
  label: 'Due date',
  helper: 'Type a date or open the calendar.',
  placeholder: 'MM/DD/YYYY',
  error: 'Invalid date.',
  restricted: 'Between 5 and 25 March.',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export type DatePickerDocsCopy = typeof datePickerFr;

export function datePickerCopy(locale: DocsLocale): DatePickerDocsCopy {
  return locale === 'en' ? datePickerEn : datePickerFr;
}

const timePickerFr = {
  label: 'Heure de début',
  helper: 'Format 24 h (HH:mm).',
  error: 'Heure invalide.',
  small: 'Petite',
  medium: 'Moyenne',
  large: 'Grande',
};

const timePickerEn = {
  label: 'Start time',
  helper: '24-hour format (HH:mm).',
  error: 'Invalid time.',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export type TimePickerDocsCopy = typeof timePickerFr;

export function timePickerCopy(locale: DocsLocale): TimePickerDocsCopy {
  return locale === 'en' ? timePickerEn : timePickerFr;
}

const dateTimePickerFr = {
  label: 'Soutenance',
  helper: 'Date et heure de la session.',
  error: 'Date ou heure invalide.',
};

const dateTimePickerEn = {
  label: 'Defense',
  helper: 'Session date and time.',
  error: 'Invalid date or time.',
};

export type DateTimePickerDocsCopy = typeof dateTimePickerFr;

export function dateTimePickerCopy(locale: DocsLocale): DateTimePickerDocsCopy {
  return locale === 'en' ? dateTimePickerEn : dateTimePickerFr;
}

const tabsFr = {
  label: 'Section du cours',
  overview: 'Aperçu',
  homework: 'Devoirs',
  files: 'Fichiers',
  overviewPanel: 'Présentation du cours.',
  homeworkPanel: 'Liste des devoirs.',
  filesPanel: 'Documents du cours.',
  small: 'Petite',
  medium: 'Moyenne',
  large: 'Grande',
  productLabel: 'Type de produit',
  internal: 'Logiciel interne',
  customer: 'Logiciel client',
  marketing: 'Marketing & SEO',
  mobile: 'Applis mobiles',
  internalPanel:
    'Construire un CRM pour mon équipe commerciale de 12 personnes, avec le suivi des deals et des relances…',
  customerPanel: 'Portail client pour suivre les commandes et les tickets de support.',
  marketingPanel:
    'Site vitrine et pages de campagne, avec le référencement déjà en place.',
  mobilePanel: 'Application iOS et Android pour l’équipe terrain.',
  attachImage: 'Joindre une image',
  buildIt: 'Créer',
};

const tabsEn = {
  label: 'Course section',
  overview: 'Overview',
  homework: 'Homework',
  files: 'Files',
  overviewPanel: 'Course overview.',
  homeworkPanel: 'Assignment list.',
  filesPanel: 'Course files.',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  productLabel: 'Product type',
  internal: 'Internal software',
  customer: 'Customer software',
  marketing: 'Marketing & SEO',
  mobile: 'Mobile apps',
  internalPanel:
    'Build a CRM for my 12-person sales team that tracks deals and follow-ups…',
  customerPanel: 'A customer portal to track orders and support tickets.',
  marketingPanel: 'A marketing site and campaign pages, with SEO already in place.',
  mobilePanel: 'An iOS and Android app for the field team.',
  attachImage: 'Attach Image',
  buildIt: 'Build it',
};

export type TabsDocsCopy = typeof tabsFr;

export function tabsCopy(locale: DocsLocale): TabsDocsCopy {
  return locale === 'en' ? tabsEn : tabsFr;
}

const breadcrumbFr = {
  label: 'Fil d’Ariane',
  home: 'Accueil',
  courses: 'Cours',
  math: 'Mathématiques',
  small: 'Petite',
  medium: 'Moyenne',
  large: 'Grande',
};

const breadcrumbEn = {
  label: 'Breadcrumb',
  home: 'Home',
  courses: 'Courses',
  math: 'Mathematics',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export type BreadcrumbDocsCopy = typeof breadcrumbFr;

export function breadcrumbCopy(locale: DocsLocale): BreadcrumbDocsCopy {
  return locale === 'en' ? breadcrumbEn : breadcrumbFr;
}

const paginationFr = {
  label: 'Pagination des devoirs',
  previous: 'Page précédente',
  next: 'Page suivante',
  page: (page: number) => `Page ${page}`,
  pageCurrent: (page: number) => `Page ${page}, page courante`,
};

const paginationEn = {
  label: 'Assignment pagination',
  previous: 'Previous page',
  next: 'Next page',
  page: (page: number) => `Page ${page}`,
  pageCurrent: (page: number) => `Page ${page}, current page`,
};

export type PaginationDocsCopy = typeof paginationFr;

export function paginationCopy(locale: DocsLocale): PaginationDocsCopy {
  return locale === 'en' ? paginationEn : paginationFr;
}

const menuFr = {
  label: 'Actions du devoir',
  fileLabel: 'Actions du fichier',
  actions: 'Actions',
  rename: 'Renommer',
  duplicate: 'Dupliquer',
  delete: 'Supprimer',
  save: 'Enregistrer',
  archive: 'Archiver',
  share: 'Partager',
  copyLink: 'Copier le lien',
  email: 'E-mail',
  open: 'Ouvrir',
  download: 'Télécharger',
  card: 'Fiche devoir',
  moreActions: 'Plus d’actions',
  openAssignment: 'Ouvrir le devoir',
  saveShortcut: '⌘S',
  duplicateShortcut: '⌘⇧D',
  deleteShortcut: '⌘⌫',
  small: 'Petite',
  medium: 'Moyenne',
  large: 'Grande',
};

const menuEn = {
  label: 'Assignment actions',
  fileLabel: 'File actions',
  actions: 'Actions',
  rename: 'Rename',
  duplicate: 'Duplicate',
  delete: 'Delete',
  save: 'Save',
  archive: 'Archive',
  share: 'Share',
  copyLink: 'Copy link',
  email: 'Email',
  open: 'Open',
  download: 'Download',
  card: 'Assignment card',
  moreActions: 'More actions',
  openAssignment: 'Open assignment',
  saveShortcut: '⌘S',
  duplicateShortcut: '⌘⇧D',
  deleteShortcut: '⌘⌫',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export type MenuDocsCopy = typeof menuFr;

export function menuCopy(locale: DocsLocale): MenuDocsCopy {
  return locale === 'en' ? menuEn : menuFr;
}

const dialogFr = {
  open: 'Ouvrir',
  cancel: 'Annuler',
  close: 'Fermer',
  continue: 'Continuer',
  deactivate: 'Désactiver',
  deactivateTitle: 'Désactiver le compte',
  deactivateBody:
    'Le compte sera désactivé et les données associées définitivement supprimées. Cette action est irréversible.',
  paidTitle: 'Paiement accepté',
  paidBody: 'Le reçu vient de partir vers votre adresse de facturation.',
  gotIt: 'J’ai compris',
  planTitle: 'Passer à l’offre annuelle',
  planBody:
    'La facturation devient annuelle et le changement prend effet immédiatement. Le prorata du mois en cours est déduit.',
  subscribe: 'S’abonner',
  updateTitle: 'Nouvelle version disponible',
  updateBody:
    'Rechargez la page pour récupérer la dernière version. Les modifications en cours sont conservées.',
  reload: 'Recharger',
  leaveTitle: 'Quitter sans enregistrer ?',
  leaveBody: 'Les modifications apportées depuis la dernière sauvegarde seront perdues.',
  leave: 'Quitter',
  sizeTitle: 'Largeur du panneau',
  sizeBody:
    'Chaque taille fixe une largeur maximale. Sous le point de rupture sm, toutes occupent la largeur disponible.',
  animationTitle: 'Ouverture animée',
  animationBody:
    'Le fond apparaît en opacité, le panneau monte de quelques pixels. Les deux animations sont coupées si le système demande une réduction des animations.',
  inviteTitle: 'Inviter un membre',
  inviteBody: 'L’invitation expire au bout de sept jours.',
  emailLabel: 'Adresse e-mail',
  emailPlaceholder: 'prenom@exemple.org',
  roleLabel: 'Rôle',
  roleEditor: 'Éditeur',
  roleViewer: 'Lecteur',
  send: 'Envoyer l’invitation',
  confirmOpen: 'Essayer la confirmation',
  confirmTitle: 'Confirmer l’action',
  confirmBody:
    'Cette opération modifiera définitivement vos préférences. Voulez-vous continuer ?',
  agree: 'Accepter',
  disagree: 'Refuser',
  alertOpen: 'Alerte',
  warning: 'Avertissement',
  error: 'Erreur',
  success: 'Succès',
  alertTitle: 'Alerte',
  alertBody:
    'Un événement important requiert votre attention. Consultez les détails avant de continuer.',
  ok: 'OK',
  processingOpen: 'Ouvrir le dialogue en traitement',
  processingTitle: 'Enregistrement en cours',
  processingBody:
    'Vos modifications sont en cours d’enregistrement. Le dialogue reste ouvert jusqu’à la fin du traitement.',
  save: 'Enregistrer',
  scrollOpen: 'Dialogue avec contenu long',
  scrollTitle: 'Conditions d’utilisation',
  scrollParagraph:
    'Le contenu défile entre l’en-tête et le pied de page fixes. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue. Integer legentibus erat a ante historiarum dapibus. Praeterea iter est quasdam res quas ex communi. Ullamco laboris nisi ut aliquid ex ea commodi consequat.',
  tiny: 'Tiny',
  regular: 'Regular',
  big: 'Big',
  huge: 'Huge',
  panelChromeOpen: 'Bordure et coins',
  panelChromeTitle: 'Apparence du panneau',
  panelChromeBody:
    'La bordure et l’arrondi peuvent être ajustés selon le contexte visuel.',
};

const dialogEn = {
  open: 'Open',
  cancel: 'Cancel',
  close: 'Close',
  continue: 'Continue',
  deactivate: 'Deactivate',
  deactivateTitle: 'Deactivate account',
  deactivateBody:
    'The account will be deactivated and its data permanently deleted. This action cannot be undone.',
  paidTitle: 'Payment successful',
  paidBody: 'The receipt is on its way to your billing address.',
  gotIt: 'Got it',
  planTitle: 'Switch to the yearly plan',
  planBody:
    'Billing becomes yearly and the change takes effect immediately. The current month is prorated.',
  subscribe: 'Subscribe',
  updateTitle: 'A new version is available',
  updateBody:
    'Reload the page to pick up the latest version. Work in progress is preserved.',
  reload: 'Reload',
  leaveTitle: 'Leave without saving?',
  leaveBody: 'Changes made since the last save will be lost.',
  leave: 'Leave',
  sizeTitle: 'Panel width',
  sizeBody:
    'Each size sets a maximum width. Below the sm breakpoint, they all take the available width.',
  animationTitle: 'Animated opening',
  animationBody:
    'The backdrop fades in, the panel rises a few pixels. Both animations are dropped when the system asks for reduced motion.',
  inviteTitle: 'Invite a teammate',
  inviteBody: 'The invitation expires after seven days.',
  emailLabel: 'Email address',
  emailPlaceholder: 'first@example.org',
  roleLabel: 'Role',
  roleEditor: 'Editor',
  roleViewer: 'Viewer',
  send: 'Send invitation',
  confirmOpen: 'Try confirm dialog',
  confirmTitle: 'Confirm action',
  confirmBody:
    'This operation will permanently change your preferences. Do you want to continue?',
  agree: 'Agree',
  disagree: 'Disagree',
  alertOpen: 'Alert',
  warning: 'Warning',
  error: 'Error',
  success: 'Success',
  alertTitle: 'Alert dialog',
  alertBody:
    'An important event requires your attention. Review the details before continuing.',
  ok: 'OK',
  processingOpen: 'Open processing dialog',
  processingTitle: 'Saving in progress',
  processingBody:
    'Your changes are being saved. The dialog stays open until processing completes.',
  save: 'Save',
  scrollOpen: 'Long content dialog',
  scrollTitle: 'Terms of use',
  scrollParagraph:
    'Content scrolls between the fixed header and footer. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue. Integer legentibus erat a ante historiarum dapibus. Praeterea iter est quasdam res quas ex communi. Ullamco laboris nisi ut aliquid ex ea commodi consequat.',
  tiny: 'Tiny',
  regular: 'Regular',
  big: 'Big',
  huge: 'Huge',
  panelChromeOpen: 'Border and corners',
  panelChromeTitle: 'Panel appearance',
  panelChromeBody: 'Border and corner radius can be tuned to match the visual context.',
};

export type DialogDocsCopy = typeof dialogFr;

export function dialogCopy(locale: DocsLocale): DialogDocsCopy {
  return locale === 'en' ? dialogEn : dialogFr;
}

const drawerFr = {
  open: 'Ouvrir le panneau',
  cancel: 'Annuler',
  detailTitle: 'Détails de la commande',
  detailBody:
    'Commande n° 4821, passée le 12 septembre. Trois articles, livraison prévue sous cinq jours.',
  detailParagraph:
    'Le panneau garde la page visible derrière lui : on consulte la fiche, on la referme, on retrouve la liste au même endroit.',
  left: 'Gauche',
  right: 'Droite',
  top: 'Haut',
  bottom: 'Bas',
  sideTitle: 'Bord d’ancrage',
  sideBody:
    'Le panneau glisse depuis le bord choisi et s’y attache sur toute sa longueur.',
  tiny: 'Tiny',
  regular: 'Regular',
  big: 'Big',
  huge: 'Huge',
  sizeTitle: 'Taille du panneau',
  sizeBody:
    'La même échelle que Dialog : une largeur pour un panneau latéral, une hauteur pour un panneau haut ou bas.',
  filtersOpen: 'Filtrer',
  filtersTitle: 'Filtres',
  searchLabel: 'Recherche',
  searchPlaceholder: 'Nom ou référence',
  statusLabel: 'Statut',
  statusAll: 'Tous',
  statusActive: 'Actifs',
  statusArchived: 'Archivés',
  categoriesLabel: 'Catégories',
  categories: ['Cours', 'Devoirs', 'Évaluations', 'Ressources', 'Annonces', 'Messages'],
  reset: 'Réinitialiser',
  apply: 'Appliquer',
  addressOpen: 'Modifier l’adresse',
  addressTitle: 'Adresse de livraison',
  streetLabel: 'Adresse',
  streetValue: '12 rue des Lilas',
  cityLabel: 'Ville',
  cityValue: 'Nantes',
  save: 'Enregistrer',
  noteOpen: 'Ajouter un commentaire',
  noteTitle: 'Nouveau commentaire',
  visibilityLabel: 'Visibilité',
  visibilityTeam: 'Équipe',
  visibilityPrivate: 'Privé',
  noteLabel: 'Commentaire',
  notePlaceholder: 'Votre remarque…',
  noteHelper: 'Le focus arrive directement ici, pas sur le sélecteur qui précède.',
  publish: 'Publier',
  menu: 'Menu',
  navLabel: 'Navigation principale',
  openNav: 'Ouvrir la navigation',
  closeNav: 'Fermer la navigation',
  navLinks: ['Accueil', 'Cours', 'Devoirs', 'Messages'],
  main: 'Contenu de la page',
};

const drawerEn = {
  open: 'Open the panel',
  cancel: 'Cancel',
  detailTitle: 'Order details',
  detailBody:
    'Order #4821, placed on 12 September. Three items, delivery expected within five days.',
  detailParagraph:
    'The panel keeps the page visible behind it: you read the sheet, close it, and find the list where you left it.',
  left: 'Left',
  right: 'Right',
  top: 'Top',
  bottom: 'Bottom',
  sideTitle: 'Anchor side',
  sideBody: 'The panel slides in from the chosen edge and spans its whole length.',
  tiny: 'Tiny',
  regular: 'Regular',
  big: 'Big',
  huge: 'Huge',
  sizeTitle: 'Panel size',
  sizeBody:
    'The same scale as Dialog: a width for a side panel, a height for a top or bottom panel.',
  filtersOpen: 'Filter',
  filtersTitle: 'Filters',
  searchLabel: 'Search',
  searchPlaceholder: 'Name or reference',
  statusLabel: 'Status',
  statusAll: 'All',
  statusActive: 'Active',
  statusArchived: 'Archived',
  categoriesLabel: 'Categories',
  categories: [
    'Courses',
    'Assignments',
    'Assessments',
    'Resources',
    'Announcements',
    'Messages',
  ],
  reset: 'Reset',
  apply: 'Apply',
  addressOpen: 'Edit address',
  addressTitle: 'Delivery address',
  streetLabel: 'Address',
  streetValue: '12 Lilac Street',
  cityLabel: 'City',
  cityValue: 'Nantes',
  save: 'Save',
  noteOpen: 'Add a comment',
  noteTitle: 'New comment',
  visibilityLabel: 'Visibility',
  visibilityTeam: 'Team',
  visibilityPrivate: 'Private',
  noteLabel: 'Comment',
  notePlaceholder: 'Your remark…',
  noteHelper: 'Focus lands right here, not on the select before it.',
  publish: 'Publish',
  menu: 'Menu',
  navLabel: 'Main navigation',
  openNav: 'Open navigation',
  closeNav: 'Close navigation',
  navLinks: ['Home', 'Courses', 'Assignments', 'Messages'],
  main: 'Page content',
};

export type DrawerDocsCopy = typeof drawerFr;

export function drawerCopy(locale: DocsLocale): DrawerDocsCopy {
  return locale === 'en' ? drawerEn : drawerFr;
}

const loadingFr = {
  loading: 'Chargement…',
  loadingResults: 'Chargement des résultats',
  save: 'Enregistrer',
  cardBody: 'Les chiffres se consolident, la page se remplit dès qu’ils arrivent.',
  upload: 'Téléversement du fichier',
  uploadValue: '12 Mo sur 40',
  quota: 'Quota de stockage',
  storage: 'Stockage utilisé',
  stepsLabel: 'Étapes de la commande',
  stepDone: 'Terminé',
  stepCurrent: 'Étape en cours',
  stepUpcoming: 'À venir',
  stepCart: 'Panier',
  stepCartHint: 'Vérifier les articles',
  stepShipping: 'Livraison',
  stepShippingHint: 'Adresse et transporteur',
  stepPayment: 'Paiement',
  stepPaymentHint: 'Carte ou virement',
  stepReview: 'Récapitulatif',
  stepReviewHint: 'Relire avant de valider',
  stepOf: 'Étape 2 sur 4',
  back: 'Retour',
  next: 'Continuer',
  addressLabel: 'Adresse de livraison',
  addressPlaceholder: '12 rue des Lilas, Cotonou',
  authorName: 'Amina Doumbouya',
  authorRole: 'Responsable produit',
};

const loadingEn = {
  loading: 'Loading…',
  loadingResults: 'Loading results',
  save: 'Save',
  cardBody: 'The figures are being consolidated; the page fills in as they arrive.',
  upload: 'File upload',
  uploadValue: '12 MB of 40',
  quota: 'Storage quota',
  storage: 'Storage used',
  stepsLabel: 'Order steps',
  stepDone: 'Completed',
  stepCurrent: 'Current step',
  stepUpcoming: 'Upcoming',
  stepCart: 'Cart',
  stepCartHint: 'Check the items',
  stepShipping: 'Shipping',
  stepShippingHint: 'Address and carrier',
  stepPayment: 'Payment',
  stepPaymentHint: 'Card or transfer',
  stepReview: 'Review',
  stepReviewHint: 'Read it over before confirming',
  stepOf: 'Step 2 of 4',
  back: 'Back',
  next: 'Continue',
  addressLabel: 'Delivery address',
  addressPlaceholder: '12 Lilac Street, Cotonou',
  authorName: 'Amina Doumbouya',
  authorRole: 'Product lead',
};

export type LoadingDocsCopy = typeof loadingFr;

export function loadingCopy(locale: DocsLocale): LoadingDocsCopy {
  return locale === 'en' ? loadingEn : loadingFr;
}

const navbarFr = {
  brand: 'Dudalo',
  notifications: 'Notifications',
  profile: 'Profil',
};

const navbarEn = {
  brand: 'Dudalo',
  notifications: 'Notifications',
  profile: 'Profile',
};

export type NavbarDocsCopy = typeof navbarFr;

export function navbarCopy(locale: DocsLocale): NavbarDocsCopy {
  return locale === 'en' ? navbarEn : navbarFr;
}

const sidebarFr = {
  label: 'Navigation principale',
  home: 'Accueil',
  courses: 'Cours',
  homework: 'Devoirs',
  maths: 'Maths',
  history: 'Histoire',
  collapse: 'Replier le menu',
  expand: 'Déployer le menu',
  openNav: 'Ouvrir la navigation',
  closeNav: 'Fermer la navigation',
  main: 'Contenu du cours',
};

const sidebarEn = {
  label: 'Main navigation',
  home: 'Home',
  courses: 'Courses',
  homework: 'Assignments',
  maths: 'Maths',
  history: 'History',
  collapse: 'Collapse sidebar',
  expand: 'Expand sidebar',
  openNav: 'Open navigation',
  closeNav: 'Close navigation',
  main: 'Course content',
};

export type SidebarDocsCopy = typeof sidebarFr;

export function sidebarCopy(locale: DocsLocale): SidebarDocsCopy {
  return locale === 'en' ? sidebarEn : sidebarFr;
}

const alertFr = {
  infoBody: 'Les notes seront visibles après la correction.',
  successBody: 'Vos modifications ont été enregistrées.',
  warningBody: 'Cette action est irréversible.',
  dangerBody: 'Impossible d’enregistrer le devoir.',
  sessionTitle: 'Session expirée',
  sessionBody: 'Reconnectez-vous pour continuer.',
  featureBody: 'Nouvelle fonctionnalité disponible.',
  dismiss: 'Fermer l’alerte',
  trimmedBody: 'Conseil sans fond teinté, directement sous le titre de section.',
  learnMore: 'En savoir plus',
};

const alertEn = {
  infoBody: 'Grades will be visible after marking.',
  successBody: 'Your changes were saved.',
  warningBody: 'This action cannot be undone.',
  dangerBody: 'Unable to save the assignment.',
  sessionTitle: 'Session expired',
  sessionBody: 'Sign in again to continue.',
  featureBody: 'New feature available.',
  dismiss: 'Dismiss alert',
  trimmedBody: 'Tip without a tinted background, directly under the section heading.',
  learnMore: 'Learn more',
};

export type AlertDocsCopy = typeof alertFr;

export function alertCopy(locale: DocsLocale): AlertDocsCopy {
  return locale === 'en' ? alertEn : alertFr;
}

const notificationFr = {
  infoBody: 'Les notes seront publiées demain.',
  successBody: 'Vos modifications ont été enregistrées.',
  warningBody: 'Cette action est irréversible.',
  dangerBody: 'Impossible d’enregistrer le devoir.',
  callbackBody: 'Nouvelle version disponible.',
  action: 'Voir les détails',
};

const notificationEn = {
  infoBody: 'Grades will be published tomorrow.',
  successBody: 'Your changes were saved.',
  warningBody: 'This action cannot be undone.',
  dangerBody: 'Unable to save the assignment.',
  callbackBody: 'New version available.',
  action: 'View details',
};

export type NotificationDocsCopy = typeof notificationFr;

export function notificationCopy(locale: DocsLocale): NotificationDocsCopy {
  return locale === 'en' ? notificationEn : notificationFr;
}

const toastFr = {
  show: 'Afficher un toast',
  showInfo: 'Info',
  showSuccess: 'Succès',
  showWarning: 'Attention',
  showDanger: 'Erreur',
  saved: 'Vos modifications ont été enregistrées.',
  published: 'Les notes seront publiées demain.',
  warning: 'Cette action est irréversible.',
  danger: 'Impossible d’enregistrer le devoir.',
  callback: 'Nouvelle version disponible.',
  action: 'Voir les détails',
  enqueue: 'Enfiler trois toasts',
  queueFirst: 'Premier processus',
  queueSecond: 'Deuxième processus',
  queueThird: 'Troisième processus',
  dismiss: 'Fermer la notification',
  showDismissible: 'Toast fermable',
};

const toastEn = {
  show: 'Show a toast',
  showInfo: 'Info',
  showSuccess: 'Success',
  showWarning: 'Warning',
  showDanger: 'Error',
  saved: 'Your changes were saved.',
  published: 'Grades will be published tomorrow.',
  warning: 'This action cannot be undone.',
  danger: 'Unable to save the assignment.',
  callback: 'New version available.',
  action: 'View details',
  enqueue: 'Enqueue three toasts',
  queueFirst: 'First process',
  queueSecond: 'Second process',
  queueThird: 'Third process',
  dismiss: 'Dismiss notification',
  showDismissible: 'Dismissible toast',
};

export type ToastDocsCopy = typeof toastFr;

export function toastCopy(locale: DocsLocale): ToastDocsCopy {
  return locale === 'en' ? toastEn : toastFr;
}

const emptyStateFr = {
  title: 'Aucun devoir',
  description: 'Créez votre premier devoir pour commencer.',
  primary: 'Créer un devoir',
  coursesTitle: 'Aucun cours',
  coursesDescription: 'Importez un cours ou créez-en un nouveau.',
  secondary: 'Importer',
};

const emptyStateEn = {
  title: 'No assignments',
  description: 'Create your first assignment to get started.',
  primary: 'Create assignment',
  coursesTitle: 'No courses',
  coursesDescription: 'Import a course or create a new one.',
  secondary: 'Import',
};

export type EmptyStateDocsCopy = typeof emptyStateFr;

export function emptyStateCopy(locale: DocsLocale): EmptyStateDocsCopy {
  return locale === 'en' ? emptyStateEn : emptyStateFr;
}

const errorStateFr = {
  title: 'Impossible de charger les devoirs',
  description: 'Vérifiez votre connexion, puis réessayez.',
  retry: 'Réessayer',
  saveTitle: 'Échec de l’enregistrement',
  saveDescription: 'Réessayez ou contactez le support.',
};

const errorStateEn = {
  title: 'Unable to load assignments',
  description: 'Check your connection, then try again.',
  retry: 'Retry',
  saveTitle: 'Save failed',
  saveDescription: 'Try again or contact support.',
};

export type ErrorStateDocsCopy = typeof errorStateFr;

export function errorStateCopy(locale: DocsLocale): ErrorStateDocsCopy {
  return locale === 'en' ? errorStateEn : errorStateFr;
}

const badgeFr = {
  unread: '5 non lus',
  unreadMany: '120 non lus',
  unreadZero: '0 non lus',
  notifications: 'Notifications',
  messages: '3 messages',
  ada: 'Ada Lovelace',
  online: 'En ligne',
  newMark: 'Nouveau',
};

const badgeEn = {
  unread: '5 unread',
  unreadMany: '120 unread',
  unreadZero: '0 unread',
  notifications: 'Notifications',
  messages: '3 messages',
  ada: 'Ada Lovelace',
  online: 'Online',
  newMark: 'New',
};

export type BadgeDocsCopy = typeof badgeFr;

export function badgeCopy(locale: DocsLocale): BadgeDocsCopy {
  return locale === 'en' ? badgeEn : badgeFr;
}

const tagFr = {
  defaultLabel: 'Nouveau',
  success: 'Publié',
  warning: 'Brouillon',
  danger: 'Archivé',
  info: 'Info',
  neutral: 'Neutre',
  soft: 'Léger',
  solid: 'Plein',
  outline: 'Contour',
  dismiss: 'Retirer',
  groupLabel: 'Filtres',
  algebra: 'Algèbre',
  geometry: 'Géométrie',
  analysis: 'Analyse',
  probability: 'Probabilités',
};

const tagEn = {
  defaultLabel: 'New',
  success: 'Published',
  warning: 'Draft',
  danger: 'Archived',
  info: 'Info',
  neutral: 'Neutral',
  soft: 'Soft',
  solid: 'Solid',
  outline: 'Outline',
  dismiss: 'Remove',
  groupLabel: 'Filters',
  algebra: 'Algebra',
  geometry: 'Geometry',
  analysis: 'Analysis',
  probability: 'Probability',
};

export type TagDocsCopy = typeof tagFr;

export function tagCopy(locale: DocsLocale): TagDocsCopy {
  return locale === 'en' ? tagEn : tagFr;
}

const avatarFr = {
  ada: 'Ada Lovelace',
  adaInitial: 'A',
  grace: 'Grace Hopper',
  graceInitial: 'G',
  katherine: 'Katherine Johnson',
  katherineInitial: 'K',
  annie: 'Annie Easley',
  groupLabel: 'Équipe',
  overflow: (count: number) => `${count} de plus`,
  online: 'En ligne',
  offline: 'Hors ligne',
  busy: 'Occupé',
  away: 'Absent',
};

const avatarEn = {
  ada: 'Ada Lovelace',
  adaInitial: 'A',
  grace: 'Grace Hopper',
  graceInitial: 'G',
  katherine: 'Katherine Johnson',
  katherineInitial: 'K',
  annie: 'Annie Easley',
  groupLabel: 'Team',
  overflow: (count: number) => `${count} more`,
  online: 'Online',
  offline: 'Offline',
  busy: 'Busy',
  away: 'Away',
};

export type AvatarDocsCopy = typeof avatarFr;

export function avatarCopy(locale: DocsLocale): AvatarDocsCopy {
  return locale === 'en' ? avatarEn : avatarFr;
}

const cardFr = {
  title: 'Algèbre linéaire',
  subtitle: 'Chapitre 2',
  body: 'Introduction aux espaces vectoriels.',
  open: 'Ouvrir',
  share: 'Partager',
  person: 'Ada Lovelace',
  role: 'Mathématicienne',
  status: 'Actif',
  personBody: 'Notes de lecture sur le moteur analytique.',
  message: 'Message',
};

const cardEn = {
  title: 'Linear algebra',
  subtitle: 'Chapter 2',
  body: 'An introduction to vector spaces.',
  open: 'Open',
  share: 'Share',
  person: 'Ada Lovelace',
  role: 'Mathematician',
  status: 'Active',
  personBody: 'Reading notes on the analytical engine.',
  message: 'Message',
};

export type CardDocsCopy = typeof cardFr;

export function cardCopy(locale: DocsLocale): CardDocsCopy {
  return locale === 'en' ? cardEn : cardFr;
}

const accordionFr = {
  what: 'Qu’est-ce que c’est ?',
  whatBody: 'Un module de révision pour ancrer les notions du cours.',
  when: 'Quand commencer ?',
  whenBody: 'Dès le premier cours, à votre rythme.',
  who: 'Qui corrige ?',
  whoBody: 'Section indisponible pour le moment.',
  why: 'Pourquoi s’entraîner ?',
  whyBody: 'Les exercices courts aident à mémoriser.',
  week1: 'Semaine 1',
  week2: 'Semaine 2',
  lesson1: 'Cours 1',
  lesson2: 'Cours 2',
  lesson3: 'Cours 3',
};

const accordionEn = {
  what: 'What is this?',
  whatBody: 'A revision module to lock in the course ideas.',
  when: 'When should I start?',
  whenBody: 'From the first lesson, at your own pace.',
  who: 'Who marks the work?',
  whoBody: 'This section is unavailable for now.',
  why: 'Why practise?',
  whyBody: 'Short exercises help you remember.',
  week1: 'Week 1',
  week2: 'Week 2',
  lesson1: 'Lesson 1',
  lesson2: 'Lesson 2',
  lesson3: 'Lesson 3',
};

export type AccordionDocsCopy = typeof accordionFr;

export function accordionCopy(locale: DocsLocale): AccordionDocsCopy {
  return locale === 'en' ? accordionEn : accordionFr;
}

const listFr = {
  algebra: 'Algèbre',
  geometry: 'Géométrie',
  analysis: 'Analyse',
  algebraDesc: 'Chapitre 2 — espaces vectoriels',
  geometryDesc: 'Chapitre 3 — figures du plan',
  open: 'Ouvrir',
  stepOne: 'Lire l’énoncé',
  stepTwo: 'Rédiger la preuve',
  stepThree: 'Vérifier le raisonnement',
};

const listEn = {
  algebra: 'Algebra',
  geometry: 'Geometry',
  analysis: 'Analysis',
  algebraDesc: 'Chapter 2 — vector spaces',
  geometryDesc: 'Chapter 3 — plane figures',
  open: 'Open',
  stepOne: 'Read the statement',
  stepTwo: 'Write the proof',
  stepThree: 'Check the reasoning',
};

export type ListDocsCopy = typeof listFr;

export function listCopy(locale: DocsLocale): ListDocsCopy {
  return locale === 'en' ? listEn : listFr;
}

const sortableFr = {
  listLabel: 'Chapitres du cours',
  chapters: [
    'Introduction',
    'Espaces vectoriels',
    'Applications linéaires',
    'Déterminants',
    'Valeurs propres',
  ],
  tagsLabel: 'Étiquettes',
  tags: ['Algèbre', 'Analyse', 'Géométrie', 'Probabilités', 'Statistiques'],
  widgetsLabel: 'Tableau de bord',
  widgets: [
    'Progression',
    'Devoirs à rendre',
    'Notes récentes',
    'Agenda',
    'Messages',
    'Annonces',
  ],
  widgetHint: 'Saisissez la poignée pour réorganiser.',
  moveTag: (label: string) => `Déplacer l’étiquette ${label}`,
  locked: 'Verrouillé',
  lastAnnouncement: 'Dernière annonce :',
  handle: (label?: string) => (label ? `Réordonner ${label}` : 'Réordonner'),
  instructions:
    'Espace ou Entrée pour saisir, flèches pour déplacer, Espace ou Entrée pour déposer, Échap pour annuler.',
  pickedUp: ({ label, from, count }: SortableMove) =>
    `${label} saisi. Position ${from} sur ${count}.`,
  moved: ({ label, to, count }: SortableMove) =>
    `${label} déplacé en position ${to} sur ${count}.`,
  dropped: ({ label, to, count }: SortableMove) =>
    `${label} déposé en position ${to} sur ${count}.`,
  canceled: ({ label, from, count }: SortableMove) =>
    `Annulé. ${label} reste en position ${from} sur ${count}.`,
  moveUp: (label: string) => `Monter ${label}`,
  moveDown: (label: string) => `Descendre ${label}`,
};

const sortableEn = {
  listLabel: 'Course chapters',
  chapters: [
    'Introduction',
    'Vector spaces',
    'Linear maps',
    'Determinants',
    'Eigenvalues',
  ],
  tagsLabel: 'Tags',
  tags: ['Algebra', 'Analysis', 'Geometry', 'Probability', 'Statistics'],
  widgetsLabel: 'Dashboard',
  widgets: ['Progress', 'Assignments due', 'Recent grades', 'Agenda', 'Messages', 'News'],
  widgetHint: 'Grab the handle to rearrange.',
  moveTag: (label: string) => `Move the ${label} tag`,
  locked: 'Locked',
  lastAnnouncement: 'Last announcement:',
  handle: (label?: string) => (label ? `Reorder ${label}` : 'Reorder'),
  instructions:
    'Space or Enter to pick up, arrow keys to move, Space or Enter to drop, Escape to cancel.',
  pickedUp: ({ label, from, count }: SortableMove) =>
    `${label} picked up. Position ${from} of ${count}.`,
  moved: ({ label, to, count }: SortableMove) =>
    `${label} moved to position ${to} of ${count}.`,
  dropped: ({ label, to, count }: SortableMove) =>
    `${label} dropped at position ${to} of ${count}.`,
  canceled: ({ label, from, count }: SortableMove) =>
    `Canceled. ${label} stays at position ${from} of ${count}.`,
  moveUp: (label: string) => `Move ${label} up`,
  moveDown: (label: string) => `Move ${label} down`,
};

export type SortableDocsCopy = typeof sortableFr;

export function sortableCopy(locale: DocsLocale): SortableDocsCopy {
  return locale === 'en' ? sortableEn : sortableFr;
}

const tableFr = {
  caption: 'Notes du trimestre',
  student: 'Élève',
  average: 'Moyenne',
  status: 'Statut',
  ada: 'Ada Lovelace',
  grace: 'Grace Hopper',
  katherine: 'Katherine Johnson',
  annie: 'Annie Easley',
  hypatia: 'Hypatie d’Alexandrie',
  emmy: 'Emmy Noether',
  sofia: 'Sofia Kovalevskaya',
  maryam: 'Maryam Mirzakhani',
  admitted: 'Admise',
  averageAda: '18,5',
  averageGrace: '16,0',
  averageKatherine: '17,2',
  hours: 'Heures',
  hoursAda: '32',
  hoursGrace: '28',
  classAverage: 'Moyenne de classe',
  classAverageValue: '17,2',
  emptyTitle: 'Aucune note',
  emptyDescription: 'Les notes apparaîtront après le premier devoir.',
  scheduleCaption: 'Planning de la semaine',
  module: 'Module',
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  longModule: 'Algèbre linéaire — espaces vectoriels et applications',
  longModuleTwo: 'Géométrie du plan — coniques et transformations',
  slotMorning: '08:00',
  slotLate: '10:00',
  slotAfternoon: '14:00',
  slotMid: '09:00',
  stickyAverages: ['18,5', '16,0', '17,2', '15,5', '19,0', '18,0', '16,8', '17,5'],
};

const tableEn = {
  caption: 'Term grades',
  student: 'Student',
  average: 'Average',
  status: 'Status',
  ada: 'Ada Lovelace',
  grace: 'Grace Hopper',
  katherine: 'Katherine Johnson',
  annie: 'Annie Easley',
  hypatia: 'Hypatia of Alexandria',
  emmy: 'Emmy Noether',
  sofia: 'Sofia Kovalevskaya',
  maryam: 'Maryam Mirzakhani',
  admitted: 'Passed',
  averageAda: '18.5',
  averageGrace: '16.0',
  averageKatherine: '17.2',
  hours: 'Hours',
  hoursAda: '32',
  hoursGrace: '28',
  classAverage: 'Class average',
  classAverageValue: '17.2',
  emptyTitle: 'No grades yet',
  emptyDescription: 'Grades will appear after the first assignment.',
  scheduleCaption: 'Weekly timetable',
  module: 'Module',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  longModule: 'Linear algebra — vector spaces and maps',
  longModuleTwo: 'Plane geometry — conics and transformations',
  slotMorning: '08:00',
  slotLate: '10:00',
  slotAfternoon: '14:00',
  slotMid: '09:00',
  stickyAverages: ['18.5', '16.0', '17.2', '15.5', '19.0', '18.0', '16.8', '17.5'],
};

export type TableDocsCopy = typeof tableFr;

export function tableCopy(locale: DocsLocale): TableDocsCopy {
  return locale === 'en' ? tableEn : tableFr;
}

const tableDataFr = {
  caption: 'Commandes du trimestre',
  search: 'Rechercher une commande',
  searchPlaceholder: 'Client, référence…',
  export: 'Exporter la sélection',
  exported: (count: number) => `${count} ligne(s) prêtes à exporter`,
  status: 'Statut',
  reference: 'Référence',
  client: 'Client',
  amount: 'Montant',
  date: 'Date',
  actions: 'Actions',
  rowActions: 'Actions de la ligne',
  edit: 'Modifier',
  duplicate: 'Dupliquer',
  archive: 'Archiver',
  paid: 'Payée',
  pending: 'En attente',
  late: 'En retard',
  draft: 'Brouillon',
  selectAll: 'Tout sélectionner',
  selectRow: (label: string) => `Sélectionner ${label}`,
  sortBy: 'Trier cette colonne',
  locked: 'Ligne verrouillée — clôturée comptablement',
  results: (count: number) => `${count} résultat(s)`,
  empty: 'Aucune commande ne correspond',
  emptyTitle: 'Aucune commande',
  emptyDescription: 'Les commandes apparaîtront ici, ou élargissez la recherche.',
  onlyLate: 'En retard seulement',
  all: 'Toutes',
  showing: (from: number, to: number, total: number) => `${from} à ${to} sur ${total}`,
  previous: 'Précédent',
  next: 'Suivant',
  tabAll: 'Toutes',
  tabLate: 'En retard',
  tabPaid: 'Payées',
};

const tableDataEn = {
  caption: 'Orders this quarter',
  search: 'Search an order',
  searchPlaceholder: 'Customer, reference…',
  export: 'Export the selection',
  exported: (count: number) => `${count} row(s) ready to export`,
  status: 'Status',
  reference: 'Reference',
  client: 'Customer',
  amount: 'Amount',
  date: 'Date',
  actions: 'Actions',
  rowActions: 'Row actions',
  edit: 'Edit',
  duplicate: 'Duplicate',
  archive: 'Archive',
  paid: 'Paid',
  pending: 'Pending',
  late: 'Late',
  draft: 'Draft',
  selectAll: 'Select all rows',
  selectRow: (label: string) => `Select ${label}`,
  sortBy: 'Sort this column',
  locked: 'Locked row — closed in accounting',
  results: (count: number) => `${count} result(s)`,
  empty: 'No order matches',
  emptyTitle: 'No orders',
  emptyDescription: 'Orders will appear here, or widen the search.',
  onlyLate: 'Late only',
  all: 'All',
  showing: (from: number, to: number, total: number) => `${from} to ${to} of ${total}`,
  previous: 'Previous',
  next: 'Next',
  tabAll: 'All',
  tabLate: 'Late',
  tabPaid: 'Paid',
};

export type TableDataDocsCopy = typeof tableDataFr;

export function tableDataCopy(locale: DocsLocale): TableDataDocsCopy {
  return locale === 'en' ? tableDataEn : tableDataFr;
}

const commandMenuFr = {
  open: 'Ouvrir la palette',
  label: 'Palette de commandes',
  placeholder: 'Rechercher une commande',
  empty: 'Aucun résultat',
  emptyQuery: (query: string) => `Aucune commande pour « ${query} »`,
  loading: 'Chargement des commandes',
  lastCommand: 'Dernière commande :',
  none: 'aucune',
  shortcutHint: '⌘K (Ctrl+K) ouvre et ferme aussi la palette.',
  navigation: 'Navigation',
  actions: 'Actions',
  account: 'Compte',
  home: 'Accueil',
  courses: 'Cours',
  homework: 'Devoirs',
  newAssignment: 'Nouveau devoir',
  newAssignmentDesc: 'Créer un devoir vide',
  newAssignmentKeywords: ['créer', 'ajouter'],
  newAssignmentShortcut: '⌘N',
  importCourse: 'Importer un cours',
  importCourseDesc: 'Depuis un fichier SCORM',
  importShortcut: '⌘I',
  archive: 'Archiver le cours',
  archiveDesc: 'Indisponible pendant la correction',
  theme: 'Changer de thème',
  themeDesc: 'Clair, sombre ou système',
  themeShortcut: '⌘T',
  profile: 'Mon profil',
  logout: 'Se déconnecter',
};

const commandMenuEn = {
  open: 'Open the palette',
  label: 'Command palette',
  placeholder: 'Search a command',
  empty: 'No results',
  emptyQuery: (query: string) => `No command for “${query}”`,
  loading: 'Loading commands',
  lastCommand: 'Last command:',
  none: 'none',
  shortcutHint: '⌘K (Ctrl+K) also opens and closes the palette.',
  navigation: 'Navigation',
  actions: 'Actions',
  account: 'Account',
  home: 'Home',
  courses: 'Courses',
  homework: 'Assignments',
  newAssignment: 'New assignment',
  newAssignmentDesc: 'Create an empty assignment',
  newAssignmentKeywords: ['create', 'add'],
  newAssignmentShortcut: '⌘N',
  importCourse: 'Import a course',
  importCourseDesc: 'From a SCORM file',
  importShortcut: '⌘I',
  archive: 'Archive the course',
  archiveDesc: 'Unavailable while marking',
  theme: 'Switch theme',
  themeDesc: 'Light, dark, or system',
  themeShortcut: '⌘T',
  profile: 'My profile',
  logout: 'Sign out',
};

export type CommandMenuDocsCopy = typeof commandMenuFr;

export function commandMenuCopy(locale: DocsLocale): CommandMenuDocsCopy {
  return locale === 'en' ? commandMenuEn : commandMenuFr;
}
