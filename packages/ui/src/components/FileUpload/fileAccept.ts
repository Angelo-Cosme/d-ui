import { formatFileSize } from '../../lib/formatFileSize';

export type FileRejectionReason = 'type' | 'size';

export type FileRejection = {
  file: File;
  reason: FileRejectionReason;
};

export function fileMatchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0 || tokens.includes('*/*') || tokens.includes('*')) {
    return true;
  }

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

export function partitionFiles(
  incoming: File[],
  options: { accept?: string; maxSize?: number },
): { accepted: File[]; rejected: FileRejection[] } {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];

  for (const file of incoming) {
    if (!fileMatchesAccept(file, options.accept)) {
      rejected.push({ file, reason: 'type' });
      continue;
    }
    if (options.maxSize != null && file.size > options.maxSize) {
      rejected.push({ file, reason: 'size' });
      continue;
    }
    accepted.push(file);
  }

  return { accepted, rejected };
}

export function defaultSizeError(file: File, maxSize: number): string {
  return `${file.name} dépasse ${formatFileSize(maxSize)}.`;
}

export function defaultTypeError(file: File): string {
  return `${file.name} n’est pas un type accepté.`;
}

export function defaultRemoveLabel(fileName: string): string {
  return `Retirer ${fileName}`;
}
