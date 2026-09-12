/** French ArgTypes descriptions for Storybook Properties tables. */
const cornerRadiusArgType = (defaultValue: 'md' | 'lg') => ({
  control: 'select' as const,
  options: ['none', 'sm', 'md', 'lg', 'xl'],
  description: `Arrondi des coins. Défaut : \`${defaultValue}\`.`,
});

const uiSizeArgType = {
  control: 'inline-radio' as const,
  options: ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'],
  description: '`xxs` à `xxl`. `m` par défaut.',
};

const uiColorArgType = {
  control: 'inline-radio' as const,
  options: ['brand', 'success', 'warning', 'danger', 'info', 'neutral'],
  description:
    'Couleur sémantique (tokens). La couleur seule ne porte pas le sens (1.4.1).',
};

const classNameArgType = {
  control: 'text' as const,
  description: 'Classes fusionnées en dernier avec `cx`.',
};

export const buttonArgTypes = {
  variant: {
    control: 'inline-radio' as const,
    options: ['primary', 'secondary', 'ghost'],
    description:
      'Emphase : `primary` (forte), `secondary` (moyenne), `ghost` (faible). Une seule action forte par vue.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      '`sm` si l’espace est contraint, `md` par défaut, `lg` pour les actions aérées.',
  },
  loading: {
    control: 'boolean' as const,
    description:
      'Affiche un indicateur, conserve le libellé, pose `aria-busy` et désactive le contrôle.',
  },
  loadingIndicator: {
    control: 'inline-radio' as const,
    options: ['spinner', 'bounce'],
    description:
      '`spinner` (défaut) ou `bounce` (trois points). Utilisé si `loading` est vrai.',
  },
  icon: {
    description: 'Icône décorative. Ne remplace pas le nom accessible.',
  },
  iconPosition: {
    control: 'inline-radio' as const,
    options: ['start', 'end'],
    description: 'Position de l’icône : `start` (début) ou `end` (fin).',
  },
  fullWidth: {
    control: 'boolean' as const,
    description: 'Étend le contrôle à la largeur du conteneur.',
  },
  radius: cornerRadiusArgType('md'),
  isSelected: {
    control: 'boolean' as const,
    description:
      'État bascule (emphase moyenne/faible). Pose `aria-pressed` si le libellé ne change pas.',
  },
  disabled: {
    control: 'boolean' as const,
    description: 'Désactive le contrôle : plus focusable, plus d’événements pointeur.',
  },
  'aria-label': {
    description: 'Nom accessible. Obligatoire sur `IconButton` (pas de texte visible).',
  },
};

export const timeAgoArgTypes = {
  date: {
    description:
      'Instant à afficher (`Date`, chaîne ISO-8601, ou millisecondes epoch). Une valeur invalide rend un `<span>`, pas un `<time>`.',
  },
  locale: {
    control: 'text' as const,
    description:
      'Locale BCP 47 transmise à `Intl` et à l’attribut `lang` (WCAG 3.1.2). Défaut : locale d’exécution.',
  },
  live: {
    control: 'boolean' as const,
    description:
      'Rafraîchit le texte relatif sur un intervalle grossier. Visuel uniquement : pas d’`aria-live`.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md'],
    description: 'Taille du texte : `sm` (métadonnées) ou `md` (défaut).',
  },
  title: {
    description: 'Infobulle native. Défaut : l’heure absolue formatée.',
  },
};

export const textFieldArgTypes = {
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      '`sm` si l’espace est contraint, `md` par défaut, `lg` pour les formulaires aérés.',
  },
  label: {
    description:
      'Libellé visible au-dessus du champ. Sinon, un `<label htmlFor>` externe ou `aria-labelledby`.',
  },
  helper: {
    description:
      'Texte d’aide sous le champ. Remplacé par `error` si le champ est invalide.',
  },
  error: {
    description: 'Message d’erreur sous le champ. Pose aussi `aria-invalid`.',
  },
  placeholder: {
    description: 'Exemple de valeur. Ne remplace pas le libellé.',
  },
  invalid: {
    control: 'boolean' as const,
    description:
      'État d’erreur : `aria-invalid` et contour danger. `error` le pose aussi.',
  },
  valid: {
    control: 'boolean' as const,
    description: 'État de succès : contour vert et icône. Ignoré si `invalid`.',
  },
  disabled: {
    control: 'boolean' as const,
    description: 'Désactive le champ : plus focusable, plus d’événements pointeur.',
  },
  required: {
    control: 'boolean' as const,
    description: 'Champ obligatoire. Affiche un astérisque à côté du libellé.',
  },
  icon: {
    description:
      'Icône décorative au début du champ. Complète `label`, ne le remplace pas.',
  },
  prefix: {
    description:
      'Contenu au début du champ (unité, schéma d’URL). Ne remplace pas le libellé.',
  },
  suffix: {
    description: 'Contenu à la fin du champ. Ne remplace pas le libellé.',
  },
  fullWidth: {
    control: 'boolean' as const,
    description: 'Pleine largeur par défaut. Passez `false` pour une largeur fixe.',
  },
  focusShadow: {
    control: 'boolean' as const,
    description:
      'Halo de focus (ombre douce autour du cadre). Inactif sauf si la prop est `true`.',
  },
  clearable: {
    control: 'boolean' as const,
    description: 'Bouton d’effacement dès que la valeur n’est pas vide.',
  },
  clearLabel: {
    description: 'Nom accessible du bouton d’effacement. Défaut : `"Effacer"`.',
  },
  showCount: {
    control: 'boolean' as const,
    description:
      'Compteur de caractères (restants si `maxLength` est posé). Activé par défaut avec `maxLength`.',
  },
  maxLength: {
    description: 'Longueur maximale. Affiche le compteur sauf si `showCount={false}`.',
  },
  countMessage: {
    control: { disable: true },
    description:
      'Libellé du compteur. Reçoit le nombre de caractères et `maxLength`. Défaut : « n caractères restants ». À remplacer pour une autre langue.',
    table: {
      defaultValue: { summary: 'n caractères restants' },
    },
  },
};

export const textInputArgTypes = {
  ...textFieldArgTypes,
  type: {
    control: 'select' as const,
    options: ['text', 'email', 'password', 'search', 'number', 'tel', 'url'],
    description:
      'Type HTML : `text`, `email`, `password`, `search`, `number`, `tel`, `url`.',
  },
  revealPasswordLabel: {
    description:
      'Nom accessible pour afficher le mot de passe. Défaut : `"Afficher le mot de passe"`.',
  },
  hidePasswordLabel: {
    description:
      'Nom accessible pour masquer le mot de passe. Défaut : `"Masquer le mot de passe"`.',
  },
};

export const textareaArgTypes = {
  ...textFieldArgTypes,
  rows: {
    description: 'Nombre de lignes visibles. Défaut : `2`.',
  },
};

const selectionSharedArgTypes = {
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      '`sm` si l’espace est contraint, `md` par défaut, `lg` pour les formulaires aérés.',
  },
  label: {
    description:
      'Libellé visible à côté du contrôle. Sinon, un `<label htmlFor>` externe ou `aria-labelledby`.',
  },
  helper: {
    description:
      'Texte d’aide sous le contrôle. Remplacé par `error` si le contrôle est invalide.',
  },
  error: {
    description: 'Message d’erreur sous le contrôle. Pose aussi `aria-invalid`.',
  },
  invalid: {
    control: 'boolean' as const,
    description:
      'État d’erreur : `aria-invalid` et contour danger. `error` le pose aussi.',
  },
  disabled: {
    control: 'boolean' as const,
    description: 'Désactive le contrôle : plus focusable, plus d’événements pointeur.',
  },
  required: {
    control: 'boolean' as const,
    description: 'Contrôle obligatoire. Affiche un astérisque à côté du libellé.',
  },
};

export const checkboxArgTypes = {
  ...selectionSharedArgTypes,
  indeterminate: {
    control: 'boolean' as const,
    description:
      'État mixte (ni coché ni décoché). Pose `indeterminate` et `aria-checked="mixed"`.',
  },
  checked: {
    control: 'boolean' as const,
    description: 'État coché. Contrôlé si passé, non contrôlé sinon.',
  },
};

export const radioArgTypes = {
  ...selectionSharedArgTypes,
  value: {
    description: 'Valeur envoyée avec le groupe. Obligatoire dans un `RadioGroup`.',
  },
};

export const switchArgTypes = {
  ...selectionSharedArgTypes,
  checked: {
    control: 'boolean' as const,
    description:
      'État activé. Contrôlé si passé, non contrôlé sinon. Pose `aria-checked`.',
  },
};

const overlaySharedArgTypes = {
  content: {
    description: 'Contenu du panneau flottant.',
  },
  placement: {
    control: 'select' as const,
    options: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ],
    description:
      'Côté préféré (`top`, `bottom`, `left`, `right`, et variantes `-start` / `-end`). Flip/shift recadrent près des bords du viewport.',
  },
  open: {
    control: 'boolean' as const,
    description: 'Ouvert contrôlé. Sinon `defaultOpen`.',
  },
  defaultOpen: {
    control: 'boolean' as const,
    description: 'Ouvert initial en mode non contrôlé.',
  },
  disabled: {
    control: 'boolean' as const,
    description: 'Empêche l’ouverture.',
  },
};

export const tooltipArgTypes = {
  ...overlaySharedArgTypes,
  radius: cornerRadiusArgType('md'),
  delayMs: {
    control: 'number' as const,
    description:
      'Délai d’ouverture au survol (ms). `0` si `prefers-reduced-motion`. Défaut : `200`.',
  },
};

export const popoverArgTypes = {
  ...overlaySharedArgTypes,
  radius: cornerRadiusArgType('md'),
  trapFocus: {
    control: 'boolean' as const,
    description:
      'Piège le focus dans le panneau (`role="dialog"`). À passer si le contenu est interactif.',
  },
  'aria-label': {
    description:
      'Nom accessible du panneau. Obligatoire avec `trapFocus` si pas de `aria-labelledby`.',
  },
  'aria-labelledby': {
    description: 'Id d’un titre visible qui nomme le panneau.',
  },
};

export const dialogArgTypes = {
  open: {
    control: 'boolean' as const,
    description: 'Ouverture contrôlée. `Dialog` n’a pas de mode non contrôlé.',
  },
  onOpenChange: {
    control: { disable: true },
    description:
      'Appelé avec `false` sur Escape, clic extérieur ou croix de fermeture. C’est vous qui refermez.',
  },
  size: {
    control: 'select' as const,
    options: ['tiny', 'regular', 'big', 'huge'],
    description:
      'Largeur maximale du panneau (LumApps : 400 / 600 / 800 dp, ou plein écran pour `huge`). Toutes les tailles retombent pleine largeur sous le point de rupture `sm`. Défaut : `regular`.',
  },
  alert: {
    control: 'boolean' as const,
    description:
      'Rôle `alertdialog` : décision destructive ou irréversible. Le clic extérieur et la croix sont retirés, `Escape` reste actif (WCAG 2.1.2), et le focus va sur la première action.',
  },
  dismissible: {
    control: 'boolean' as const,
    description:
      'Croix de fermeture en haut à droite du panneau. Ignorée si `alert` ou `processing`.',
  },
  dismissLabel: {
    description: 'Nom accessible de la croix. Défaut : `"Fermer"`.',
  },
  processing: {
    control: 'boolean' as const,
    description:
      'État de traitement : calque semi-opaque et spinner. Bloque les interactions et désactive Escape / clic extérieur tant que la soumission est en cours.',
  },
  bordered: {
    control: 'boolean' as const,
    description:
      'Bordure `border-border` autour du panneau. Défaut : sans bordure (LumApps).',
  },
  radius: cornerRadiusArgType('lg'),
  initialFocus: {
    control: { disable: true },
    description:
      'Ref de l’élément qui prend le focus à l’ouverture. Par défaut, le premier contrôle focusable — ou la première action si `alert`.',
  },
  'aria-label': {
    control: { disable: true },
    description:
      'Nom accessible du dialogue. Requis seulement si aucun `DialogTitle` n’est rendu : le titre visible prime.',
  },
  children: {
    control: { disable: true },
    description:
      'Contenu : `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogActions`.',
  },
};

export const drawerArgTypes = {
  open: {
    control: 'boolean' as const,
    description: 'Ouverture contrôlée. Comme `Dialog`, pas de mode non contrôlé.',
  },
  onOpenChange: {
    control: { disable: true },
    description:
      'Appelé avec `false` sur Escape, clic sur le fond ou croix de fermeture. C’est vous qui refermez.',
  },
  side: {
    control: 'select' as const,
    options: ['left', 'right', 'top', 'bottom'],
    description:
      'Bord d’ancrage du panneau. `left` / `right` désignent le bord physique de l’écran. Défaut : `right`.',
  },
  size: {
    control: 'select' as const,
    options: ['tiny', 'regular', 'big', 'huge'],
    description:
      'Même échelle que `Dialog` : `tiny` (400 dp), `regular` (600 dp), `big` (800 dp), `huge` (l’écran moins une marge). Une largeur pour `left` / `right`, une hauteur pour `top` / `bottom`. Sur petit écran, le panneau occupe tout le bord. Défaut : `regular`.',
  },
  dismissible: {
    control: 'boolean' as const,
    description:
      'Croix de fermeture en haut à droite. Défaut : `true` — un panneau sans actions garde ainsi une sortie visible à la souris et au toucher. Escape et le clic sur le fond restent actifs dans tous les cas.',
  },
  dismissLabel: {
    description: 'Nom accessible de la croix. Défaut : `"Fermer"`.',
  },
  initialFocus: {
    control: { disable: true },
    description:
      'Ref de l’élément qui prend le focus à l’ouverture. Par défaut, le premier contrôle focusable.',
  },
  id: {
    control: { disable: true },
    description:
      '`id` du panneau, à reprendre dans `aria-controls` sur le déclencheur (`Navbar` : `menuControls`).',
  },
  'aria-label': {
    control: { disable: true },
    description:
      'Nom accessible du panneau. Requis seulement si aucun `DrawerTitle` n’est rendu : le titre visible prime.',
  },
  children: {
    control: { disable: true },
    description:
      'Contenu : `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerBody`, `DrawerActions` — les pièces de `Dialog`, sous leur nom de panneau.',
  },
};

export const skeletonArgTypes = {
  shape: {
    control: 'select' as const,
    options: ['rect', 'circle', 'text'],
    description:
      'Forme du bloc. `text` prend la hauteur d’une ligne, `circle` un ratio carré. Défaut : `rect`.',
  },
  width: {
    description: 'Largeur CSS. Nombre en pixels, ou chaîne. Défaut : `100%`.',
  },
  height: {
    description: 'Hauteur CSS. Ignorée pour `text`, qui suit la ligne de base.',
  },
  size: {
    description:
      'Diamètre d’un `circle`. Raccourci pour `width` et `height`. Une longueur CSS, pas l’échelle `xxs`–`xxl` : le squelette doit épouser exactement le bloc qu’il remplace.',
  },
  color: {
    ...uiColorArgType,
    description:
      'Teinte du bloc. Défaut : `neutral`. Décorative : le squelette reste `aria-hidden`.',
  },
  className: classNameArgType,
};

export const skeletonTextArgTypes = {
  lines: {
    control: 'number' as const,
    description: 'Nombre de lignes. Défaut : `3`.',
  },
  lastLineWidth: {
    description:
      'Largeur de la dernière ligne, pour imiter un paragraphe qui s’arrête en cours de ligne. Défaut : `60%`.',
  },
};

export const progressArgTypes = {
  variant: {
    control: 'select' as const,
    options: ['linear', 'circular'],
    description:
      '`linear` (défaut) ou `circular`. Le circulaire exige une `value` : `linear` seul sait être indéterminé.',
  },
  value: {
    control: 'number' as const,
    description:
      'Valeur de 0 à 100, bornée. Omise sur un `linear`, la barre devient indéterminée et `aria-valuenow` disparaît — c’est ce qui la distingue d’un 0 %.',
  },
  label: {
    description:
      'Nom accessible, obligatoire. Une barre sans nom annonce un pourcentage sans dire de quoi.',
  },
  valueText: {
    description:
      'Texte annoncé à la place du pourcentage (`aria-valuetext`) : « Étape 2 sur 4 », « 12 Mo sur 40 ».',
  },
  showValue: {
    control: 'boolean' as const,
    description:
      'Affiche la valeur en clair. Le texte reste hors de l’arbre d’accessibilité : `aria-valuenow` le dit déjà.',
  },
  size: {
    ...uiSizeArgType,
    description:
      'Épaisseur de la barre ou diamètre de l’anneau, sur l’échelle partagée `xxs` à `xxl`. Défaut : `m`.',
  },
  color: {
    ...uiColorArgType,
    description:
      'Teinte du remplissage. Défaut : `brand`. La couleur seule ne porte pas le sens (1.4.1) : un échec se dit dans `label` ou `valueText`.',
  },
  className: classNameArgType,
};

export const stepperArgTypes = {
  steps: {
    control: { disable: true },
    description:
      'Liste d’étapes `{ label, description?, href? }`. Avec `href`, l’étape est un vrai `<a>` ; sans, elle est inerte.',
  },
  current: {
    control: 'number' as const,
    description:
      'Index de l’étape en cours. Les précédentes sont terminées, les suivantes à venir — le statut est déduit, pas déclaré étape par étape.',
  },
  variant: {
    control: 'select' as const,
    options: ['circles', 'bullets', 'panels'],
    description:
      '`circles` (défaut), `bullets` ou `panels`. La frise verticale est `circles` en `orientation="vertical"`, pas une variante de plus. Pour la forme à chevrons, le design system a déjà `Breadcrumb`.',
  },
  orientation: {
    control: 'select' as const,
    options: ['horizontal', 'vertical'],
    description: 'Sens de lecture de la liste. Défaut : `horizontal`.',
  },
  size: {
    ...uiSizeArgType,
    description:
      'Échelle partagée `xxs` à `xxl`. Défaut : `m`. Elle règle le marqueur et la taille du texte ; le trait de liaison suit.',
  },
  color: {
    ...uiColorArgType,
    description:
      'Teinte des étapes terminée et en cours. Défaut : `brand`. Le statut se voit aussi sans percevoir la couleur (1.4.1) : coche, pastille pleine, texte masqué.',
  },
  label: {
    description: 'Nom accessible de la liste d’étapes. Obligatoire.',
  },
  hideLabels: {
    control: 'boolean' as const,
    description:
      'Masque les libellés à l’écran seulement — ils restent lus. Réservé à `bullets`.',
  },
  bordered: {
    control: 'boolean' as const,
    description: 'Encadre chaque étape. `panels` uniquement.',
  },
  statusLabels: {
    control: { disable: true },
    description:
      'Les trois statuts annoncés (`complete`, `current`, `upcoming`). Sans eux, le composant retombe sur un fallback anglais : il ne peut pas deviner la langue de la page.',
  },
  className: classNameArgType,
};

export const emojiPopoverArgTypes = {
  placement: overlaySharedArgTypes.placement,
  open: overlaySharedArgTypes.open,
  defaultOpen: overlaySharedArgTypes.defaultOpen,
  disabled: overlaySharedArgTypes.disabled,
  onSelect: {
    description: 'Appelé avec l’emoji choisi. Le panneau se ferme ensuite.',
  },
  'aria-label': {
    description: 'Nom accessible de la barre. Défaut : « Réactions ».',
  },
};

const selectSharedArgTypes = {
  size: textFieldArgTypes.size,
  label: textFieldArgTypes.label,
  helper: textFieldArgTypes.helper,
  error: textFieldArgTypes.error,
  invalid: textFieldArgTypes.invalid,
  valid: textFieldArgTypes.valid,
  disabled: textFieldArgTypes.disabled,
  required: textFieldArgTypes.required,
  fullWidth: textFieldArgTypes.fullWidth,
  options: {
    control: { disable: true },
    description:
      'Liste d’options `{ value, label, icon?, description?, disabled? }` ou de groupes `{ label, options }`.',
  },
  value: {
    description:
      'Valeur contrôlée (`string` ou `string[]` si `multiple`). Sinon `defaultValue`.',
  },
  defaultValue: {
    description: 'Valeur initiale en mode non contrôlé.',
  },
  onValueChange: {
    description:
      'Appelé avec une `string` (sélection unique) ou `string[]` (`multiple`).',
  },
  name: {
    description:
      'Nom du `<select>` natif masqué, pour la soumission HTML (`name` / `form`).',
  },
  form: {
    description: 'Id du formulaire hôte si le champ est rendu hors du `<form>`.',
  },
  emptyMessage: {
    description: 'Texte affiché lorsque la liste est vide. Défaut : « Aucune option ».',
  },
};

export const comboboxArgTypes = {
  ...selectSharedArgTypes,
  placeholder: {
    ...textFieldArgTypes.placeholder,
    description:
      'Texte de recherche. Ne remplace pas le libellé. Défaut : « Rechercher ».',
  },
  multiple: {
    control: 'boolean' as const,
    description:
      'Sélection multiple. Les valeurs s’affichent en chips dans le champ. Défaut : `false`.',
  },
  filter: {
    control: 'inline-radio' as const,
    options: ['auto', 'manual', 'off'],
    description:
      '`auto` masque les non-correspondances, `manual` laisse la liste intacte (`onSearch`), `off` empêche la saisie.',
  },
  onSearch: {
    description: 'Appelé avec le texte saisi (recherche distante, `filter="manual"`).',
  },
  listStatus: {
    control: 'inline-radio' as const,
    options: ['idle', 'loading', 'loadingMore', 'error'],
    description:
      'État du panneau : `idle`, `loading` (placeholders), `loadingMore`, `error`.',
  },
  loadingMessage: {
    description: 'Message annoncé pendant le chargement. Défaut : `"Chargement"`.',
  },
  listErrorMessage: {
    description: 'Titre d’erreur de liste si `listStatus="error"`.',
  },
  listErrorRetryMessage: {
    description: 'Texte secondaire sous l’erreur de liste.',
  },
  emptyMessage: {
    description:
      'Liste vide. Chaîne, nœud, ou `(query) => …`. Défaut : « Aucune option ».',
  },
  beforeOptions: {
    description: 'Contenu injecté en tête de liste (action **Créer**, etc.).',
  },
  renderOption: {
    description: 'Rendu custom d’une option. Reçoit l’option et `selected`.',
  },
  renderSectionTitle: {
    description: 'Rendu custom du libellé de groupe.',
  },
  renderChip: {
    description: 'Rendu custom d’un chip (`multiple`).',
  },
  chipGroupLabel: {
    description: 'Nom accessible du groupe de chips. Défaut : le `label`.',
  },
  chipRemoveLabel: {
    description: 'Suffixe du bouton de retrait d’un chip. Défaut : `"Retirer"`.',
  },
  defaultOpen: {
    control: 'boolean' as const,
    description: 'Ouvre la liste au montage.',
  },
  openOnFocus: {
    control: 'boolean' as const,
    description: 'Ouvre la liste au focus. Utile avec `filter="off"`.',
  },
  icon: textFieldArgTypes.icon,
  clearable: {
    control: 'boolean' as const,
    description:
      'Bouton d’effacement dès qu’une valeur unique est choisie. Ignoré si `multiple`. Défaut : `true`.',
  },
  clearLabel: {
    description: 'Nom accessible du bouton d’effacement. Défaut : `"Effacer"`.',
  },
  toggleLabel: {
    description:
      'Nom accessible du bouton chevron. Défaut : `"Afficher les suggestions"`. Omis : pas de chevron.',
  },
};

export const skipLinkArgTypes = {
  href: {
    description:
      'Cible du lien, un identifiant de page (`#main` par défaut). Le landmark doit déjà être focusable (`tabIndex={-1}`).',
  },
  children: {
    description:
      'Libellé visible au focus. Défaut anglais : `"Skip to main content"`. Passez la langue de l’app.',
  },
};

export const visuallyHiddenArgTypes = {
  children: {
    description:
      'Texte lu par les technologies d’assistance, masqué visuellement. Obligatoire : c’est le nom accessible.',
  },
};

export const iconArgTypes = {
  as: {
    control: false as const,
    description:
      'Composant SVG à rendre. Jamais importé par `d-ui` : le bundle ne garde que ce que l’app passe.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      'Aligné sur `Button` : `sm` 16 px, `md` 20 px (défaut), `lg` 24 px. Réduit le SVG en CSS, sans changer de jeu Heroicons.',
  },
  label: {
    description:
      'Nom accessible. Absent : icône décorative (`aria-hidden`, `focusable="false"`). Présent : `role="img"`. Ne pas l’utiliser à côté d’un libellé visible, ni dans le slot `icon` d’un `Button`.',
  },
};

export const themeArgTypes = {
  mode: {
    control: 'inline-radio' as const,
    options: ['light', 'dark', 'system'],
    description:
      '`light` / `dark` explicites, ou `system` (suit `prefers-color-scheme`). Pose `data-d-ui-theme` sur l’enveloppe, pas sur `document.documentElement`.',
  },
  tokens: {
    description:
      'Surcharge white-label : `brand`, `brandHover`, `onBrand`, `focus`. Écrit les variables `--d-ui-color-*` en inline.',
  },
};

export const textArgTypes = {
  as: {
    control: 'inline-radio' as const,
    options: ['p', 'span', 'div', 'label', 'legend'],
    description: 'Élément rendu. `p` par défaut ; `span` pour du texte en ligne.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['body', 'body-sm', 'caption'],
    description: '`body` (courant), `body-sm` (aide), `caption` (métadonnées).',
  },
  tone: {
    control: 'inline-radio' as const,
    options: ['default', 'muted', 'danger'],
    description:
      '`default` (`text-fg`), `muted` (`text-fg-muted`, toujours ≥ 4.5:1), `danger` (message d’erreur). Jamais via `className`.',
  },
  weight: {
    control: 'inline-radio' as const,
    options: ['regular', 'medium', 'semibold'],
    description: 'Graisse : `regular`, `medium`, `semibold`.',
  },
  color: {
    control: 'select' as const,
    options: ['brand', 'dark', 'light', 'warning', 'danger', 'success', 'info', 'violet'],
    description:
      'Famille de la page Color. Remplace `tone`. `light` se lit sur un fond `fg`.',
  },
  colorVariant: {
    control: 'select' as const,
    options: ['D2', 'D1', 'N', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'],
    description:
      'Cran de la rampe (`N` par défaut). Ignoré si `color` est absente. Les crans L sont des teintes, pas du texte courant.',
  },
  noWrap: {
    control: 'boolean' as const,
    description:
      'Empêche le retour à la ligne. Un parent `overflow-hidden` coupe sans ellipse. Activé automatiquement par `truncate` sur une ligne.',
  },
  truncate: {
    control: 'boolean' as const,
    description:
      '`true` : une ligne avec ellipse. `{ lines: n }` : n lignes (`n` > 1). Le lecteur d’écran lit toujours le texte entier.',
  },
};

export const headingArgTypes = {
  level: {
    control: 'inline-radio' as const,
    options: [1, 2, 3, 4, 5, 6],
    description: 'Niveau sémantique : rend un vrai `h1`…`h6` (WCAG 1.3.1).',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['display', 'title', 'subtitle', 'body'],
    description:
      'Taille visuelle, indépendante du `level`. Par défaut, la taille suit le niveau.',
  },
  bold: {
    control: 'boolean' as const,
    description: 'Passe en `font-bold`. Désactivé par défaut (`font-normal`).',
  },
};

export const linkArgTypes = {
  href: {
    description: 'Cible du lien. Obligatoire pour un vrai `<a>`.',
  },
  external: {
    control: 'boolean' as const,
    description:
      'Ouvre un nouvel onglet, pose `rel="noopener noreferrer"`, annonce l’ouverture (texte masqué).',
  },
  externalLabel: {
    description:
      'Texte annoncé pour un lien externe. Défaut anglais : `"(opens in a new tab)"`.',
  },
  color: {
    control: 'inline-radio' as const,
    options: ['default', 'dark', 'light'],
    description:
      '`default` : token `link` (et `visited`). `dark` : encre (`fg`). `light` : fond (`bg`), à poser sur un fond `fg`. Non héritée du parent.',
  },
  icon: {
    description:
      'Icône décorative (`aria-hidden`). Ne remplace pas le nom accessible. Suit `currentColor`.',
  },
  iconPosition: {
    control: 'inline-radio' as const,
    options: ['start', 'end'],
    description: 'Position de l’icône : `start` (début) ou `end` (fin).',
  },
};

export const dividerArgTypes = {
  orientation: {
    control: 'inline-radio' as const,
    options: ['horizontal', 'vertical'],
    description:
      '`horizontal` : `div` en `w-full` (100 % du parent). `vertical` : `div` en `self-stretch` dans un flex.',
  },
  label: {
    description:
      'Nom accessible. Sans `label`, le trait est décoratif (`aria-hidden`). Avec `label` en horizontal, le texte est visible au centre et les filets remplissent le parent. Ne le renseigner que si la séparation porte du sens.',
  },
};

export const calendarArgTypes = {
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      '`sm` si l’espace est contraint, `md` par défaut, `lg` pour les vues aérées.',
  },
  locale: {
    control: 'text' as const,
    description:
      'Locale BCP 47 pour `Intl` et `lang`. Défaut : `fr`. Les flèches passent en anglais si la locale commence par `en`.',
  },
  weekStartsOn: {
    control: { type: 'inline-radio' as const },
    options: [0, 1, 2, 3, 4, 5, 6],
    description:
      'Premier jour de la semaine (0 = dimanche, 1 = lundi). Défaut : `weekStartFromLocale(locale)`.',
  },
  numberOfMonths: {
    control: { type: 'inline-radio' as const },
    options: [1, 2, 3],
    description:
      'Nombre de mois côte à côte (1 à 3). Défaut : 1, ou 2 si `selectionMode="range"`.',
  },
  disabled: {
    control: 'boolean' as const,
    description: 'Désactive la grille et la navigation.',
  },
  value: {
    description:
      'Sélection contrôlée : `{ year, month, day }` ou `{ start, end }` si `selectionMode="range"`. `null` = aucune.',
  },
  defaultValue: {
    description: 'Sélection au montage (non contrôlé). Date unique ou `{ start, end }`.',
  },
  onValueChange: {
    description: 'Appelé lorsqu’un jour disponible est choisi (date ou plage).',
  },
  month: {
    description: 'Premier mois affiché (contrôlé). Le jour est ignoré.',
  },
  defaultMonth: {
    description: 'Premier mois affiché au montage.',
  },
  onMonthChange: {
    description: 'Appelé lorsque l’utilisateur change de mois.',
  },
  today: {
    description:
      'Date « aujourd’hui » (`aria-current="date"`). Défaut : date civile locale. À figer dans les tests.',
  },
  minValue: {
    description:
      'Première date sélectionnable (incluse). Borne aussi le sélecteur d’année.',
  },
  maxValue: {
    description:
      'Dernière date sélectionnable (incluse). Borne aussi le sélecteur d’année.',
  },
  selectionMode: {
    control: 'inline-radio' as const,
    options: ['single', 'range'],
    description:
      '`single` (défaut) : une date. `range` : début puis fin (`{ start, end }`).',
  },
  isDateUnavailable: {
    description:
      'Fonction `(date) => boolean` pour exclure des jours (week-ends, fériés).',
  },
  previousMonthLabel: {
    description: 'Nom accessible du bouton mois précédent. Défaut : « Mois précédent ».',
  },
  nextMonthLabel: {
    description: 'Nom accessible du bouton mois suivant. Défaut : « Mois suivant ».',
  },
  monthSelectLabel: {
    description: 'Nom accessible du sélecteur de mois. Défaut : « Mois ».',
  },
  yearSelectLabel: {
    description: 'Nom accessible du sélecteur d’année. Défaut : « Année ».',
  },
  name: {
    description: 'Nom du champ masqué `YYYY-MM-DD` (date unique, ou début de plage).',
  },
  nameEnd: {
    description:
      'Nom du champ masqué de fin de plage. Utilisé si `selectionMode="range"`.',
  },
};

export const fileUploadArgTypes = {
  label: {
    description:
      'Libellé visible au-dessus du champ. Sinon, un `<label htmlFor>` externe ou `aria-labelledby`.',
  },
  helper: {
    description:
      'Texte d’aide sous le champ. Remplacé par l’erreur si le champ est invalide.',
  },
  error: {
    description: 'Message d’erreur sous le champ. Pose aussi `aria-invalid`.',
  },
  invalid: {
    control: 'boolean' as const,
    description:
      'État d’erreur : `aria-invalid`. Les refus `accept` / `maxSize` invalident aussi le champ.',
  },
  disabled: {
    control: 'boolean' as const,
    description: 'Désactive le bouton, le dépôt et le retrait.',
  },
  required: {
    control: 'boolean' as const,
    description:
      'Pose `required` sur l’input fichier et un astérisque décoratif sur le libellé.',
  },
  dropzone: {
    control: 'boolean' as const,
    description:
      'Zone de glisser-déposer. Le clavier utilise le bouton, pas la zone. Défaut : `true`.',
  },
  multiple: {
    control: 'boolean' as const,
    description: 'Autorise plusieurs fichiers. Chaque nom est listé et suppressible.',
  },
  accept: {
    description:
      'Filtre natif (`accept`) et validation interne (extension ou MIME). Ex. `.pdf,image/*`.',
  },
  maxSize: {
    description:
      'Taille max d’un fichier, en octets. Un refus affiche une alerte lisible, pas seulement la couleur.',
  },
  browseLabel: {
    description:
      'Libellé du bouton. Défaut : « Choisir un fichier » / « Choisir des fichiers ».',
  },
  dropLabel: {
    description: 'Texte de la zone de dépôt. Défaut français.',
  },
  progress: {
    description: 'Slot de progression : nœud sous la liste, ou `(file) => ReactNode`.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description: '`sm` / `md` / `lg` : hauteur de la zone et taille du bouton.',
  },
  preview: {
    control: 'inline-radio' as const,
    options: ['list', 'grid', 'none'],
    description:
      'Forme de l’aperçu : `list` (défaut, une ligne par fichier), `grid` (vignettes, pour des images) ou `none` — les fichiers restent dans `files`, la page les rend elle-même. Avec `none`, un `progress` par fichier n’est plus appelé : il n’y a plus de ligne où le poser.',
  },
};

const pickerFieldArgTypes = {
  label: {
    description:
      'Libellé visible au-dessus du champ. Sinon, un `<label htmlFor>` externe ou `aria-labelledby`.',
  },
  helper: {
    description:
      'Texte d’aide sous le champ. Remplacé par l’erreur si le champ est invalide.',
  },
  error: {
    description: 'Message d’erreur sous le champ. Pose aussi `aria-invalid`.',
  },
  invalid: {
    control: 'boolean' as const,
    description:
      'État d’erreur : `aria-invalid`. Une saisie illisible invalide aussi le champ.',
  },
  disabled: {
    control: 'boolean' as const,
    description: 'Désactive le champ, l’effacement et le déclencheur du panneau.',
  },
  required: {
    control: 'boolean' as const,
    description:
      'Pose `required` sur le champ et un astérisque décoratif sur le libellé.',
  },
  clearable: {
    control: 'boolean' as const,
    description: 'Bouton d’effacement. Défaut : `true`. Nom accessible : « Effacer ».',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description: '`sm` / `md` / `lg` : hauteur du champ.',
  },
};

export const datePickerArgTypes = {
  ...pickerFieldArgTypes,
  locale: {
    control: 'text' as const,
    description:
      'Locale BCP 47. Défaut : `fr` (`JJ/MM/AAAA`). `en` affiche `MM/DD/YYYY`. `name` poste toujours `YYYY-MM-DD`.',
  },
  value: {
    description:
      'Date contrôlée `{ year, month, day }` ou `null`. Pas un `Date` JavaScript.',
  },
  minValue: {
    description: 'Première date acceptée (saisie et calendrier).',
  },
  maxValue: {
    description: 'Dernière date acceptée (saisie et calendrier).',
  },
};

export const timePickerArgTypes = {
  ...pickerFieldArgTypes,
  value: {
    description: 'Heure contrôlée `{ hour, minute }` (0–23 / 0–59) ou `null`.',
  },
  minValue: {
    description: 'Première heure acceptée.',
  },
  maxValue: {
    description: 'Dernière heure acceptée.',
  },
};

export const dateTimePickerArgTypes = {
  ...pickerFieldArgTypes,
  locale: {
    control: 'text' as const,
    description: 'Locale BCP 47 pour le format de date affiché. Défaut : `fr`.',
  },
  value: {
    description:
      'Valeur contrôlée `{ date, time }` ou `null`. `name` poste `YYYY-MM-DDTHH:mm`.',
  },
  minValue: {
    description: 'Borne basse `DateTimeValue` (date puis heure).',
  },
  maxValue: {
    description: 'Borne haute `DateTimeValue` (date puis heure).',
  },
};

export const tabsArgTypes = {
  label: {
    control: 'text' as const,
    description: 'Nom accessible de la `tablist`. Fallback anglais : `Tabs`.',
  },
  value: {
    description: 'Onglet contrôlé (identifiant `Tab value`).',
  },
  defaultValue: {
    description: 'Onglet initial en mode non contrôlé.',
  },
  onValueChange: {
    description: 'Appelé avec l’identifiant de l’onglet activé.',
  },
  activation: {
    control: 'inline-radio' as const,
    options: ['automatic', 'manual'],
    description:
      '`automatic` (défaut) : les flèches sélectionnent. `manual` : flèches pour le focus, Entrée / Espace pour activer.',
  },
  orientation: {
    control: 'inline-radio' as const,
    options: ['horizontal', 'vertical'],
    description:
      '`horizontal` (flèches gauche/droite) ou `vertical` (haut/bas). Pose `aria-orientation`.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      '`sm` si l’espace est contraint, `md` par défaut, `lg` pour les vues aérées.',
  },
  variant: {
    control: 'inline-radio' as const,
    options: ['line', 'detached'],
    description:
      '`line` (défaut) : filet bas 2px (gris / marque). `detached` : pastilles séparées (contour gris au repos, contour `fg` si sélection).',
  },
  layout: {
    control: 'inline-radio' as const,
    options: ['stretch', 'cluster'],
    description:
      '`stretch` (défaut) : les onglets se partagent la largeur. `cluster` : collés à gauche. Ignoré en `detached`.',
  },
  disabled: {
    control: 'boolean' as const,
    description: 'Désactive tous les onglets. Ils restent visibles.',
  },
};

export const alertArgTypes = {
  variant: {
    control: 'inline-radio' as const,
    options: ['info', 'success', 'warning', 'danger'],
    description:
      'Sémantique visuelle et rôle live (`status` ou `alert`). LumApps `error` → `danger`.',
  },
  hasBackground: {
    control: 'boolean' as const,
    description: 'Fond teinté LumApps Message. `false` = variante trimmed (sans fond).',
  },
  title: {
    control: 'text' as const,
    description: 'Titre optionnel au-dessus du corps.',
  },
  dismissible: {
    control: 'boolean' as const,
    description:
      'Bouton fermer : LumApps Message l’autorise seulement pour `info` + `hasBackground`.',
  },
  dismissLabel: {
    control: 'text' as const,
    description: 'Nom du bouton fermer. Fallback anglais : `Dismiss alert`.',
  },
};

export const notificationArgTypes = {
  variant: {
    control: 'inline-radio' as const,
    options: ['info', 'success', 'warning', 'danger'],
    description: 'Variante LumApps Notification. Toujours `role="alert"`.',
  },
  actionLabel: {
    control: 'text' as const,
    description:
      'Libellé du bouton d’action (« Info with callback »). Requiert `onActionClick`.',
  },
  dismissible: {
    control: 'boolean' as const,
    description:
      'Affiche le bouton fermer (optionnel ; LumApps s’appuie sur l’auto-dismiss Toast). Fallback anglais : `Dismiss notification`.',
  },
  dismissLabel: {
    control: 'text' as const,
    description: 'Nom du bouton fermer.',
  },
};

export const emptyStateArgTypes = {
  title: {
    control: 'text' as const,
    description: 'Titre principal du placeholder.',
  },
  description: {
    control: 'text' as const,
    description: 'Texte d’aide sous le titre.',
  },
};

export const errorStateArgTypes = {
  title: {
    control: 'text' as const,
    description: 'Titre de l’échec.',
  },
  description: {
    control: 'text' as const,
    description: 'Corps explicatif.',
  },
  live: {
    control: 'boolean' as const,
    description: 'Pose `role="alert"` quand l’erreur apparaît après chargement.',
  },
};

export const toastArgTypes = {
  maxVisible: {
    control: { type: 'number' as const, min: 1, max: 5, step: 1 },
    description: 'Nombre maximal de toasts visibles. Le reste attend en file.',
  },
  defaultDuration: {
    control: { type: 'number' as const, min: 0, step: 1000 },
    description: 'Durée par défaut avant auto-dismiss (ms). `0` = pas d’auto-dismiss.',
  },
  defaultDismissible: {
    control: 'boolean' as const,
    description:
      'Bouton fermer par défaut sur chaque toast. Surchargeable via `toast({ dismissible })`.',
  },
  label: {
    control: 'text' as const,
    description:
      'Nom accessible de la région du viewport. Fallback anglais : `Notifications`.',
  },
};

export const breadcrumbArgTypes = {
  label: {
    control: 'text' as const,
    description: 'Nom accessible du `nav`. Fallback anglais : `Breadcrumb`.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      '`sm` si l’espace est contraint, `md` par défaut, `lg` pour les en-têtes aérés.',
  },
};

export const paginationArgTypes = {
  page: {
    control: 'number' as const,
    description: 'Page courante, 1-indexée. Contrôlée : passez `onPageChange`.',
  },
  pageCount: {
    control: 'number' as const,
    description: 'Nombre total de pages.',
  },
  onPageChange: {
    description: 'Appelé avec le numéro de page demandé. Pas de navigation Next.js.',
  },
  siblingCount: {
    control: 'number' as const,
    description: 'Pages numérotées de chaque côté de la courante. Défaut : `1`.',
  },
  label: {
    control: 'text' as const,
    description: 'Nom accessible du `nav`. Fallback anglais : `Pagination`.',
  },
  previousLabel: {
    control: 'text' as const,
    description: 'Nom du bouton précédent. Fallback anglais : `Previous page`.',
  },
  nextLabel: {
    control: 'text' as const,
    description: 'Nom du bouton suivant. Fallback anglais : `Next page`.',
  },
  pageLabel: {
    description:
      'Fonction `(page, current) => string` pour le nom de chaque bouton. Doit exposer la page courante.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      '`sm` si l’espace est contraint, `md` par défaut, `lg` pour les pieds de liste aérés.',
  },
  disabled: {
    control: 'boolean' as const,
    description: 'Désactive tous les boutons.',
  },
  children: {
    control: { disable: true },
    description:
      'Disposition libre : composez `PaginationPrevious`, `PaginationPages`, `PaginationNext` et `PaginationStatus`. Sans `children`, le rendu par défaut (précédent, numéros, suivant) est conservé.',
  },
};

export const menuArgTypes = {
  label: {
    control: 'text' as const,
    description: 'Nom accessible du `menu`. Fallback anglais : `Menu`.',
  },
  placement: {
    control: 'select' as const,
    options: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ],
    description:
      'Côté préféré du panneau. Flip/shift recadrent près des bords. Ignoré pour le point du clic droit.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      '`sm` si l’espace est contraint, `md` par défaut, `lg` pour les vues aérées.',
  },
  disabled: {
    control: 'boolean' as const,
    description: 'Empêche l’ouverture. Le déclencheur reste visible.',
  },
  open: {
    description: 'Ouverture contrôlée. Passez `onOpenChange`.',
  },
  defaultOpen: {
    description: 'Ouverture initiale en mode non contrôlé.',
  },
  onOpenChange: {
    description: 'Appelé quand le menu s’ouvre ou se ferme.',
  },
  trigger: {
    control: { disable: true },
    description:
      'Élément focusable unique : `Button`, `IconButton`, `Link`, ou un `Button` compact en pastille.',
  },
};

export const navbarArgTypes = {
  menuLabel: {
    control: 'text' as const,
    description: 'Nom du bouton menu. Fallback anglais : `Open navigation`.',
  },
  menuOpen: {
    control: 'boolean' as const,
    description: 'État ouvert du overlay, pour `aria-expanded`.',
  },
  onMenuOpenChange: {
    description: 'Affiche le bouton hamburger et reçoit le prochain état.',
  },
  menuControls: {
    control: 'text' as const,
    description: '`id` du `Sidebar` overlay (`aria-controls`).',
  },
};

export const sidebarArgTypes = {
  label: {
    control: 'text' as const,
    description: 'Nom accessible du `nav`. Fallback anglais : `Navigation`.',
  },
  collapsed: {
    control: 'boolean' as const,
    description: 'Rail icônes seules. Chaque item garde un nom accessible.',
  },
  collapsible: {
    control: 'boolean' as const,
    description: 'Affiche le bouton replier / déployer.',
  },
  overlay: {
    control: 'boolean' as const,
    description: 'Panneau `dialog` modal (petit écran). Escape et le fond ferment.',
  },
  open: {
    description: 'Ouverture contrôlée en mode `overlay`. Passez `onOpenChange`.',
  },
  defaultOpen: {
    description: 'Ouverture initiale en mode overlay non contrôlé.',
  },
  onOpenChange: {
    description: 'Appelé quand l’overlay s’ouvre ou se ferme.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md'],
    description: '`sm` si l’espace est contraint, `md` par défaut.',
  },
};

export const tagArgTypes = {
  variant: {
    control: 'inline-radio' as const,
    options: ['default', 'success', 'warning', 'danger', 'info', 'neutral'],
    description:
      'Couleur sémantique. `default` = marque. `neutral` = catégorie, pas un statut. Le libellé porte le sens.',
  },
  color: {
    ...uiColorArgType,
    description:
      'Couleur (tokens). Si absente, dérivée de `variant` (`default` → `brand`).',
  },
  appearance: {
    control: 'inline-radio' as const,
    options: ['soft', 'solid', 'outline'],
    description:
      '`soft` (défaut) : fond teinté. `solid` : couleur pleine. `outline` : filet, fond transparent.',
  },
  size: uiSizeArgType,
  className: classNameArgType,
  dot: {
    control: 'boolean' as const,
    description: 'Point décoratif (`aria-hidden`). Ne remplace pas le libellé.',
  },
  icon: {
    description: 'Icône décorative. Ne remplace pas le nom accessible.',
  },
  dismissible: {
    control: 'boolean' as const,
    description:
      'Affiche un bouton pour retirer l’étiquette. L’app démonte le `Tag` après `onDismiss`.',
  },
  dismissLabel: {
    control: 'text' as const,
    description: 'Nom du bouton fermer. Fallback anglais : `Remove`.',
  },
  onDismiss: {
    description:
      'Appelé au clic sur fermer. L’app démonte le `Tag` ; le composant ne se cache pas.',
  },
};

export const badgeArgTypes = {
  count: {
    control: 'number' as const,
    description:
      'Compteur posé sur l’hôte. Masqué si `0` sauf `showZero`. Plafonné par `max` (`99+`).',
  },
  content: {
    description: 'Contenu d’incrustation. Un nombre est traité comme `count`.',
  },
  max: {
    control: 'number' as const,
    description: 'Plafond affiché. Défaut : `99` (`99+` au-delà).',
  },
  showZero: {
    control: 'boolean' as const,
    description: 'Affiche le compteur même à `0`.',
  },
  dot: {
    control: 'boolean' as const,
    description: 'Point de statut, sans chiffre. `label` porte le sens (1.4.1).',
  },
  label: {
    control: 'text' as const,
    description:
      'Annoncé via `aria-describedby` sur l’hôte. Fallback : le chiffre visible.',
  },
  variant: {
    control: 'inline-radio' as const,
    options: ['default', 'success', 'warning', 'danger', 'info', 'neutral'],
    description: 'Couleur de l’incrustation. `danger` par défaut (compteur).',
  },
  color: {
    ...uiColorArgType,
    description: 'Teinte de l’incrustation. Si absente, dérivée de `variant`.',
  },
  appearance: {
    control: 'inline-radio' as const,
    options: ['soft', 'solid', 'outline'],
    description: 'Chrome de l’incrustation. `solid` par défaut.',
  },
  size: uiSizeArgType,
  placement: {
    control: 'select' as const,
    options: ['top-end', 'top-start', 'bottom-end', 'bottom-start'],
    description: 'Coin de l’hôte. `top-end` par défaut (logique : suit `dir`).',
  },
  className: classNameArgType,
};

export const avatarArgTypes = {
  src: {
    control: 'text' as const,
    description:
      'URL de la photo. En cas d’échec, initiales puis silhouette, toujours nommées.',
  },
  alt: {
    control: 'text' as const,
    description:
      'Nom accessible de l’image. Défaut : `name`. `""` si un texte voisin porte déjà le sens.',
  },
  name: {
    control: 'text' as const,
    description:
      'Nom de la personne. Sert au nom accessible et, sans `initials`, aux deux lettres du fallback.',
  },
  initials: {
    control: 'text' as const,
    description:
      'Deux lettres max. Sinon dérivé de `name`. Ne remplace pas le nom accessible.',
  },
  size: uiSizeArgType,
  color: {
    ...uiColorArgType,
    description: 'Fond des initiales / silhouette. `neutral` par défaut.',
  },
  className: classNameArgType,
  square: {
    control: 'boolean' as const,
    description: 'Carré arrondi (`rounded-md`) au lieu du cercle.',
  },
  presence: {
    control: 'inline-radio' as const,
    options: ['online', 'offline', 'busy', 'away'],
    description:
      'Point de présence. Le nom accessible inclut `presenceLabel` (couleur seule insuffisante).',
  },
  presenceLabel: {
    control: 'text' as const,
    description:
      'Libellé de `presence`. Fallback anglais : `Online` / `Offline` / `Busy` / `Away`.',
  },
};

export const avatarGroupArgTypes = {
  size: {
    ...uiSizeArgType,
    description: 'Taille descendue sur les enfants sans `size`. `m` par défaut.',
  },
  className: classNameArgType,
  max: {
    control: { type: 'number' as const, min: 1, max: 12, step: 1 },
    description: 'Nombre d’avatars visibles. Le reste devient « +N ».',
  },
  label: {
    control: 'text' as const,
    description: 'Nom accessible du groupe. Fallback anglais : `Avatar group`.',
  },
  overflowLabel: {
    control: { disable: true },
    description: 'Nom du surplus `(count) => string`. Fallback anglais : `N more`.',
  },
};

export const cardArgTypes = {
  href: {
    control: 'text' as const,
    description:
      'Rend un vrai `<a>`. Toute la carte est la cible : pas de bouton ni de lien à l’intérieur.',
  },
  as: {
    control: 'inline-radio' as const,
    options: ['article', 'div', 'button'],
    description:
      'Élément racine si `href` est absent. `article` par défaut. `button` : `type="button"`.',
  },
  orientation: {
    control: 'inline-radio' as const,
    options: ['vertical', 'horizontal'],
    description:
      '`horizontal` : média à gauche dès `sm`. En dessous, la carte redevient une colonne.',
  },
  radius: cornerRadiusArgType('lg'),
  size: {
    ...uiSizeArgType,
    description: 'Densité des slots (padding). `m` par défaut.',
  },
  color: {
    ...uiColorArgType,
    description: 'Teinte de surface. `neutral` = fond par défaut.',
  },
  className: classNameArgType,
  disabled: {
    control: 'boolean' as const,
    description:
      'Désactive la carte-bouton (`as="button"`) : plus d’événements pointeur. Ignoré sur `article` / lien.',
  },
};

export const accordionArgTypes = {
  type: {
    control: 'inline-radio' as const,
    options: ['single', 'multiple'],
    description:
      '`single` (défaut) : une section ouverte à la fois, refermable. `multiple` : plusieurs sections ouvertes.',
  },
  value: {
    description:
      'Sections ouvertes contrôlées. `string` en `single`, `string[]` en `multiple`.',
  },
  defaultValue: {
    description: 'Sections ouvertes au départ en mode non contrôlé.',
  },
  onValueChange: {
    description:
      'Appelé avec l’identifiant (`single`) ou le tableau d’identifiants (`multiple`).',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      '`sm` si l’espace est contraint, `md` par défaut, `lg` pour les vues aérées.',
  },
  className: classNameArgType,
};

export const listArgTypes = {
  as: {
    control: 'inline-radio' as const,
    options: ['ul', 'ol'],
    description: 'Élément de liste. `ul` par défaut. `ol` : liste ordonnée.',
  },
  divided: {
    control: 'boolean' as const,
    description: 'Filet entre les items (`border-border-subtle`).',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      '`sm` si l’espace est contraint, `md` par défaut, `lg` pour les vues aérées.',
  },
  className: classNameArgType,
};

export const sortableListArgTypes = {
  items: {
    control: { disable: true },
    description:
      'Identifiants dans l’ordre affiché (liste contrôlée). Chaque `SortableItem` enfant reprend un de ces `id`.',
  },
  onReorder: {
    control: { disable: true },
    description:
      'Reçoit le nouvel ordre et `{ id, fromIndex, toIndex }` (indices avant déplacement).',
  },
  orientation: {
    control: 'inline-radio' as const,
    options: ['vertical', 'horizontal', 'grid'],
    description:
      '`vertical` (défaut) : colonne, axe vertical seul. `horizontal` : ligne, axe horizontal seul. `grid` : grille, déplacement libre (quatre flèches).',
  },
  as: {
    control: 'inline-radio' as const,
    options: ['ul', 'ol'],
    description:
      '`ul` (défaut) ou `ol` quand l’ordre a un sens. Marqueurs natifs masqués.',
  },
  disabled: {
    control: 'boolean' as const,
    description:
      'Fige la liste : poignées désactivées (`disabled` natif), plus d’annonces.',
  },
  messages: {
    control: { disable: true },
    description:
      'Textes lecteur d’écran : `handle(label)`, `instructions`, `pickedUp`, `moved`, `dropped`, `canceled`. Fallback anglais.',
  },
  className: classNameArgType,
};

export const tableArgTypes = {
  caption: {
    control: 'text' as const,
    description:
      'Légende visible (`<caption>`). Nomme le tableau et, s’il déborde, la région défilable (clavier). En mode données, elle est obligatoire. Préférez `TableCaption` pour du contenu riche en mode parties.',
  },
  hideCaption: {
    control: 'boolean' as const,
    description:
      'Masque la légende à l’écran. Elle reste lue, et continue de nommer la zone défilable. Mode données.',
  },
  stickyHeader: {
    control: 'boolean' as const,
    description:
      'Garde les `TableHead` de l’en-tête visibles au défilement vertical (`position: sticky`). Fond `bg` pour que les lignes ne transpercent pas.',
  },
  size: {
    control: 'inline-radio' as const,
    options: ['sm', 'md', 'lg'],
    description:
      'Densité des cellules. `sm` si l’espace est contraint, `md` par défaut, `lg` pour les vues aérées.',
  },
  columns: {
    control: { disable: true },
    description:
      'Mode données. Colonnes `{ id, header, value, cell?, sortable?, align?, numeric? }`. `value` est la donnée brute — c’est elle qu’on trie et qu’on cherche ; `cell` n’est que le rendu.',
  },
  rows: {
    control: { disable: true },
    description:
      'Mode données. Les lignes, dans leur ordre d’origine. La table n’y touche pas.',
  },
  rowId: {
    control: { disable: true },
    description:
      'Mode données. Clé stable d’une ligne. Jamais l’index : le tri le déplace, et React réutiliserait la mauvaise ligne.',
  },
  sort: {
    control: { disable: true },
    description:
      'Tri contrôlé `{ columnId, direction }` ou `null`. Omis, la table gère son propre tri à partir de `defaultSort`.',
  },
  onSortChange: {
    control: { disable: true },
    description:
      'Reçoit le tri suivant : ascendant, descendant, puis `null` — trois clics ramènent à l’ordre d’origine.',
  },
  search: {
    control: 'text' as const,
    description:
      'Recherche contrôlée. Omise, la barre d’outils la pilote via `setSearch`. Insensible à la casse et aux accents.',
  },
  selectable: {
    control: 'boolean' as const,
    description:
      'Ajoute la colonne de cases à cocher. Chaque case est nommée par `rowLabel`, l’en-tête passe en `mixed` en sélection partielle.',
  },
  selectedIds: {
    control: { disable: true },
    description: 'Sélection contrôlée. Omise, la table garde la sienne.',
  },
  rowLabel: {
    control: { disable: true },
    description:
      'Nom lisible d’une ligne, pour nommer sa case. Sans lui, la case est nommée par l’identifiant — illisible à l’oral.',
  },
  isRowLocked: {
    control: { disable: true },
    description:
      'Ligne verrouillée : pas de case, un cadenas, et un texte masqué qui dit pourquoi. Exclue de « tout cocher ».',
  },
  pageSize: {
    control: 'number' as const,
    description:
      'Pagine la table et rend une `Pagination` sous elle. Omis, toutes les lignes sont rendues.',
  },
  toolbar: {
    control: { disable: true },
    description:
      'Barre au-dessus de la table. En fonction, elle reçoit `{ rows, search, setSearch, selectedIds }` : de quoi chercher, filtrer et exporter sans que la table fabrique de fichier.',
  },
  footer: {
    control: { disable: true },
    description: 'Contenu sous la table, à la place de la pagination automatique.',
  },
  loading: {
    control: 'boolean' as const,
    description:
      'Remplace le corps par un squelette (`SkeletonText`, `aria-hidden`). Le `<table>` porte `aria-busy`. Pas d’annonce « 0 résultats », pas de pagination.',
  },
  empty: {
    control: { disable: true },
    description:
      'Corps vide. Composez `EmptyState` ou `ErrorState`. Omis : `labels.empty` en paragraphe. `Table` n’importe pas le métier du vide.',
  },
  locale: {
    control: 'text' as const,
    description:
      'Locale de comparaison du tri (`localeCompare`). Défaut : celle de l’exécution.',
  },
  labels: {
    control: { disable: true },
    description:
      'Chaînes annoncées (`selectAll`, `selectRow`, `sortBy`, `locked`, `results`, `empty`). Sans elles, fallback anglais : le composant ne devine pas la langue de la page.',
  },
  className: {
    ...classNameArgType,
    description:
      'Classes du conteneur de défilement (`max-h-56`, `max-w-md`) — y compris en mode données. La barre et la pagination restent hors du défilement. Fusionnées en dernier avec `cx`.',
  },
};

export const imageArgTypes = {
  src: {
    description: 'URL du fichier. Une nouvelle `src` remet l’état de chargement à zéro.',
  },
  alt: {
    description:
      'Texte alternatif, **obligatoire**. `""` est une valeur légitime : c’est ainsi qu’on déclare une image décorative. Sans `alt`, un lecteur d’écran lit le nom du fichier (1.1.1).',
  },
  ratio: {
    control: 'select' as const,
    options: ['auto', 'square', 'video', 'portrait', 'wide'],
    description:
      'Rapport d’aspect réservé avant le chargement, pour que la page ne saute pas. `auto` laisse l’image dicter sa hauteur : elle n’est alors connue qu’une fois le fichier chargé, sauf si `width` et `height` sont donnés tous les deux.',
  },
  fit: {
    control: 'inline-radio' as const,
    options: ['cover', 'contain'],
    description:
      '`cover` (défaut) rogne pour remplir le cadre, `contain` montre l’image entière et laisse du vide.',
  },
  radius: {
    control: 'select' as const,
    options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    description: 'Arrondi du cadre. Défaut : `md`. `full` pour un portrait rond.',
  },
  loading: {
    control: 'inline-radio' as const,
    options: ['lazy', 'eager'],
    description:
      '`lazy` par défaut : une galerie ne télécharge pas trente fichiers avant le premier défilement. `eager` pour une image visible d’emblée.',
  },
  fallback: {
    description:
      'Ce qui remplace l’image si elle ne charge pas. Sans repli, le navigateur affiche son icône cassée — ça ressemble à un bug. Le nom accessible, lui, est conservé.',
  },
  placeholder: {
    description: 'Contenu affiché pendant le chargement. Défaut : un aplat neutre.',
  },
  width: {
    description:
      'Largeur du cadre. Nombre en pixels, ou chaîne CSS. En nombre, elle part aussi sur l’`<img>` comme attribut.',
  },
  height: {
    description:
      'Hauteur du cadre. Ignorée si `ratio` la calcule déjà. Avec `width`, en nombres, c’est ce qui réserve la place en `ratio="auto"`.',
  },
  fallbackLabel: {
    description:
      'Ce que le lecteur d’écran entend en plus du `alt` quand l’image a échoué. Défaut anglais `(image unavailable)` : une page française le remplace (3.1.2).',
  },
  imgClassName: {
    description: 'Classes de l’`<img>` lui-même. `className` habille le cadre.',
  },
  className: classNameArgType,
};

export const filePreviewArgTypes = {
  file: {
    control: { disable: true },
    description:
      'Le `File` à décrire. Le nom, le poids et le type en sont déduits ; l’URL objet de la miniature est créée **et révoquée** par le composant.',
  },
  layout: {
    control: 'inline-radio' as const,
    options: ['row', 'tile'],
    description:
      '`row` (défaut) : une ligne, miniature à gauche. `tile` : une vignette carrée, le nom dessous — la forme d’une galerie.',
  },
  progress: {
    description: 'Slot de progression, rendu sous le nom du fichier.',
  },
  onRemove: {
    control: { disable: true },
    description: 'Sans ce rappel, aucun bouton de retrait n’est rendu.',
  },
  removeLabel: {
    description:
      'Nom accessible du bouton de retrait. Il doit citer le fichier : « Retirer » seul ne dit pas lequel. Défaut : le nom du fichier.',
  },
  error: {
    description:
      'Motif du refus. Il s’accompagne d’un glyphe : l’état ne tient pas qu’à la couleur (1.4.1).',
  },
  disabled: {
    description:
      'Grise le bouton de retrait. `FileUpload` le pose sur chaque ligne quand le champ entier est désactivé.',
  },
  formatSize: {
    control: { disable: true },
    description:
      'Met le poids en mots. Défaut français (`o` / `Ko` / `Mo`) : c’est le seul texte que le composant produit lui-même, et une page anglaise doit pouvoir le remplacer (3.1.2).',
  },
  className: classNameArgType,
};

export const commandMenuArgTypes = {
  open: {
    control: 'boolean' as const,
    description: 'Ouverture contrôlée. Comme `Dialog`, pas de mode non contrôlé.',
  },
  onOpenChange: {
    control: { disable: true },
    description:
      'Appelé avec `false` sur Escape, clic extérieur, ou après `onSelect`. C’est vous qui refermez.',
  },
  items: {
    control: { disable: true },
    description:
      'Commandes `{ value, label, description, icon, shortcut, keywords, disabled }` ou groupes `{ label, items }`. `value` doit être unique.',
  },
  onSelect: {
    control: { disable: true },
    description:
      'Reçoit la commande choisie (clic ou Entrée). Le composant demande ensuite la fermeture ; l’exécution reste chez vous.',
  },
  label: {
    control: 'text' as const,
    description:
      'Nom accessible du dialogue, du champ et de la liste. Défaut : `"Commandes"`.',
  },
  placeholder: {
    control: 'text' as const,
    description:
      'Texte de substitution du champ. Ne remplace pas `label`. Défaut : `"Rechercher une commande"`.',
  },
  emptyMessage: {
    control: { disable: true },
    description:
      'Aucun résultat. Chaîne, nœud, ou `(query) => …`. Annoncé via `role="status"`. Défaut : `"Aucun résultat"`.',
  },
  loading: {
    control: 'boolean' as const,
    description:
      'Remplace la liste par des lignes `Skeleton` et pose `aria-busy`. Entrée et les flèches sont inertes pendant ce temps.',
  },
  loadingMessage: {
    control: 'text' as const,
    description:
      'Texte annoncé pendant le chargement (région `status`, masquée). Défaut : `"Chargement"`.',
  },
  filter: {
    control: { disable: true },
    description:
      '`(item, query) => boolean`. Remplace le filtre par défaut (sous-chaîne sans casse ni accents sur `label`, `keywords`, `description`). `() => true` pour une liste déjà filtrée côté serveur.',
  },
  onQueryChange: {
    control: { disable: true },
    description:
      'Appelé à chaque frappe avec la saisie brute. Point d’entrée d’une recherche distante.',
  },
  className: {
    ...classNameArgType,
    description: 'Classes du panneau du `Dialog`, fusionnées en dernier avec `cx`.',
  },
};
