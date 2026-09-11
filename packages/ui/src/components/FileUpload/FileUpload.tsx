import type { ChangeEvent, DragEvent, InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { FilePreview } from '../FilePreview/FilePreview';
import { mergeDescribedBy } from '../textControl';
import { useFieldControl } from '../Field/useFieldControl';
import {
  defaultRemoveLabel,
  defaultSizeError,
  defaultTypeError,
  partitionFiles,
  type FileRejection,
} from './fileAccept';

export type { FileRejection, FileRejectionReason } from './fileAccept';
export type FileUploadSize = 'sm' | 'md' | 'lg';
export type FileUploadProgress = ReactNode | ((file: File) => ReactNode);
export type FileUploadPreview = 'list' | 'grid' | 'none';

export type FileUploadProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  size?: FileUploadSize;
  /** Libellé visible au-dessus du champ. */
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  fullWidth?: boolean;
  /**
   * Zone de dépôt en plus du clic. Le clavier n’en a pas besoin :
   * le bouton / l’input fichier reste opérable.
   */
  dropzone?: boolean;
  multiple?: boolean;
  /** Taille max d’un fichier, en octets. */
  maxSize?: number;
  files?: File[];
  defaultFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onReject?: (rejections: FileRejection[]) => void;
  /** Slot de progression : nœud unique, ou par fichier. */
  progress?: FileUploadProgress;
  /**
   * Forme de l'aperçu des fichiers choisis.
   *
   * `list` (défaut) : une ligne par fichier. `grid` : des vignettes, la forme
   * d'une galerie d'images. `none` : rien du tout — les fichiers sont dans
   * `files`, la page les rend comme elle veut.
   *
   * Avec `none`, un `progress` **par fichier** n'est jamais appelé : il n'y a
   * plus de ligne où le poser. Un `progress` unique, lui, reste rendu.
   */
  preview?: FileUploadPreview;
  browseLabel?: string;
  dropLabel?: string;
  removeLabel?: (fileName: string) => string;
  filesLabel?: string;
  sizeErrorMessage?: (file: File, maxSize: number) => string;
  typeErrorMessage?: (file: File) => string;
};

const sizeClass: Record<FileUploadSize, string> = {
  sm: 'min-h-24 px-3 py-4 text-sm',
  md: 'min-h-32 px-4 py-6 text-base',
  lg: 'min-h-40 px-5 py-8 text-lg',
};

/*
 * L'identité d'un fichier, sans son rang. Avec l'index, retirer le premier
 * décalait la clé de tous les suivants : chaque aperçu se démontait et
 * remontait, et sa miniature repassait par l'aplat de chargement pour rien.
 */
function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

/*
 * Le même fichier choisi deux fois donnait deux lignes de clé identique — React
 * l'écrit en console, et deux boutons « Retirer photo.png » se retrouvaient
 * côte à côte, impossibles à distinguer à l'oreille. Rechoisir un fichier déjà
 * là ne doit rien ajouter.
 */
function withoutDuplicates(files: File[]): File[] {
  const seen = new Set<string>();
  return files.filter((file) => {
    const key = fileKey(file);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function rejectionMessage(
  item: FileRejection,
  maxSize: number | undefined,
  sizeErrorMessage: (file: File, maxSize: number) => string,
  typeErrorMessage: (file: File) => string,
): string {
  if (item.reason === 'size' && maxSize != null) {
    return sizeErrorMessage(item.file, maxSize);
  }
  return typeErrorMessage(item.file);
}

/**
 * Sélecteur de fichiers accessible : input natif masqué, clic, dépôt optionnel.
 *
 * Pas de client HTTP : l’app envoie les `File` elle-même.
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  function FileUpload(
    {
      id,
      size = 'md',
      label,
      helper,
      error,
      invalid = false,
      disabled = false,
      required = false,
      fullWidth = true,
      dropzone = true,
      multiple = false,
      maxSize,
      accept,
      files: filesProp,
      defaultFiles,
      onFilesChange,
      onChange,
      onReject,
      progress,
      browseLabel,
      dropLabel = 'Glissez les fichiers ici ou cliquez pour les choisir',
      removeLabel = defaultRemoveLabel,
      filesLabel = 'Fichiers sélectionnés',
      preview = 'list',
      sizeErrorMessage = defaultSizeError,
      typeErrorMessage = defaultTypeError,
      name,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const field = useFieldControl();
    const generatedId = useId();
    const inputId = field.id ?? id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const listId = `${inputId}-files`;
    const innerRef = useRef<HTMLInputElement>(null);
    const [uncontrolled, setUncontrolled] = useState<File[]>(defaultFiles ?? []);
    const [rejections, setRejections] = useState<FileRejection[]>([]);
    const [dragging, setDragging] = useState(false);
    const files = filesProp ?? uncontrolled;
    const isDisabled = Boolean(disabled || field.disabled);
    const isInvalid = Boolean(invalid || field['aria-invalid'] || rejections.length > 0);
    const description = isInvalid
      ? (error ??
        (rejections.length
          ? rejections
              .map((item) =>
                rejectionMessage(item, maxSize, sizeErrorMessage, typeErrorMessage),
              )
              .join(' ')
          : undefined))
      : helper;
    const describedBy = mergeDescribedBy(
      field['aria-describedby'],
      description ? (isInvalid ? errorId : helperId) : undefined,
    );
    const resolvedBrowse =
      browseLabel ?? (multiple ? 'Choisir des fichiers' : 'Choisir un fichier');

    /*
     * Le `reset` du formulaire vide l'`<input type="file">` natif mais ne dit
     * rien à React : la liste continuait d'afficher des fichiers que le
     * formulaire ne portait plus. C'est le besoin réel derrière le « destroy
     * and reinitialize » de la maquette — en React, il n'y a rien à détruire,
     * il y a un événement à écouter.
     */
    const resetRef = useRef<() => void>(() => {});
    resetRef.current = () => {
      const back = defaultFiles ?? [];
      if (files.length === 0 && back.length === 0 && rejections.length === 0) return;
      setRejections([]);
      if (filesProp === undefined) setUncontrolled(back);
      onFilesChange?.(back);
    };

    useEffect(() => {
      const form = innerRef.current?.form;
      if (!form) return;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const onReset = (event: Event) => {
        /*
         * Le `reset` est annulable : un formulaire qui demande confirmation
         * appelle `preventDefault()` dans son propre gestionnaire, qui remonte
         * après celui-ci. On lit donc la décision une fois la propagation
         * finie — sinon un reset annulé vidait quand même la liste, pendant que
         * l'input natif, lui, gardait son fichier.
         */
        timer = setTimeout(() => {
          if (!event.defaultPrevented) resetRef.current();
        }, 0);
      };
      /* Les dépendances passent par `resetRef` : l'écouteur n'est posé qu'une fois. */
      form.addEventListener('reset', onReset);
      return () => {
        if (timer !== undefined) clearTimeout(timer);
        form.removeEventListener('reset', onReset);
      };
    }, []);

    function assignRef(node: HTMLInputElement | null) {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    }

    function commit(next: File[], rejected: FileRejection[]) {
      if (filesProp === undefined) setUncontrolled(next);
      setRejections(rejected);
      onFilesChange?.(next);
      onReject?.(rejected);
      const input = innerRef.current;
      if (!input) return;
      input.value = '';
    }

    function ingest(incoming: File[]) {
      const { accepted, rejected } = partitionFiles(incoming, { accept, maxSize });
      const next = multiple
        ? withoutDuplicates([...files, ...accepted])
        : accepted.slice(-1);
      commit(next, rejected);
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      const selected = event.target.files ? Array.from(event.target.files) : [];
      ingest(selected);
      onChange?.(event);
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
      event.preventDefault();
      setDragging(false);
      if (isDisabled) return;
      ingest(Array.from(event.dataTransfer.files));
    }

    function openPicker() {
      innerRef.current?.click();
    }

    function removeAt(index: number) {
      commit(
        files.filter((_, current) => current !== index),
        [],
      );
    }

    const control = (
      <input
        {...rest}
        ref={assignRef}
        id={inputId}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={isDisabled}
        required={field.required ?? required}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy}
        tabIndex={-1}
        onChange={handleChange}
        className="d-ui-visually-hidden"
      />
    );

    const picker = dropzone ? (
      <div
        data-dropping={dragging || undefined}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!isDisabled) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node)) return;
          setDragging(false);
        }}
        onDrop={handleDrop}
        className={cx(
          'relative flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed text-center',
          sizeClass[size],
          dragging ? 'border-brand bg-surface-muted' : 'border-border bg-field',
          isInvalid && 'border-danger',
          isDisabled && 'pointer-events-none opacity-50',
          'focus-within:ring-2 focus-within:ring-focus',
        )}
      >
        {control}
        <label htmlFor={inputId} className="cursor-pointer">
          <Text as="span" tone={isDisabled ? 'muted' : 'default'}>
            {dropLabel}
          </Text>
        </label>
        <Button
          type="button"
          variant="secondary"
          size={size}
          disabled={isDisabled}
          onClick={openPicker}
        >
          {resolvedBrowse}
        </Button>
      </div>
    ) : (
      <div className="w-fit rounded-md focus-within:ring-2 focus-within:ring-focus">
        {control}
        <Button
          type="button"
          variant="secondary"
          size={size}
          disabled={isDisabled}
          onClick={openPicker}
        >
          {resolvedBrowse}
        </Button>
      </div>
    );

    return (
      <div
        className={cx(
          'flex flex-col gap-2',
          fullWidth ? 'w-full min-w-0' : 'w-80 max-w-full',
          className,
        )}
      >
        {label ? (
          <label
            htmlFor={inputId}
            className={cx(
              'text-sm leading-5 font-medium',
              isDisabled ? 'text-fg/40' : 'text-fg',
            )}
          >
            {label}
            {required || field.required ? <span aria-hidden="true"> *</span> : null}
          </label>
        ) : null}
        {picker}
        {/*
          La liste reste une `<ul>` nommée quelle que soit la forme : c'est ce
          qui fait annoncer « liste, 3 éléments ». Seule la mise en page change.
          Chaque ligne est un `FilePreview` — l'aperçu, la miniature et la
          révocation de son URL objet vivent là, pas ici.
        */}
        {preview !== 'none' && files.length > 0 ? (
          <ul
            id={listId}
            aria-label={filesLabel}
            className={cx(
              'list-none p-0',
              preview === 'grid'
                ? 'grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4'
                : 'flex flex-col gap-1',
            )}
          >
            {files.map((file, index) => (
              <li key={fileKey(file)} className="min-w-0">
                <FilePreview
                  file={file}
                  layout={preview === 'grid' ? 'tile' : 'row'}
                  disabled={isDisabled}
                  removeLabel={removeLabel(file.name)}
                  onRemove={() => removeAt(index)}
                  progress={typeof progress === 'function' ? progress(file) : undefined}
                />
              </li>
            ))}
          </ul>
        ) : null}
        {progress && typeof progress !== 'function' ? progress : null}
        {description ? (
          <p
            id={isInvalid ? errorId : helperId}
            role={isInvalid ? 'alert' : undefined}
            className={cx('text-sm leading-5', isInvalid ? 'text-danger' : 'text-fg/70')}
          >
            {description}
          </p>
        ) : null}
      </div>
    );
  },
);
