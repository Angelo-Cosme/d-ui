/**
 * Poids d'un fichier en clair.
 *
 * Vit dans `lib/` parce que deux composants s'en servent : `FileUpload` pour
 * ses messages de refus, `FilePreview` pour chaque ligne. Une primitive n'a
 * pas à importer un module interne du composite qui l'utilise.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  const mega = bytes / (1024 * 1024);
  const rounded = mega >= 10 ? Math.round(mega) : Math.round(mega * 10) / 10;
  return `${rounded} Mo`;
}
