import { createContext, useContext, type ReactNode } from 'react';
import { docsCopy, docsString } from './docs-copy';
import type { DocsLocale } from './docs-locale';

export const DocsLocaleContext = createContext<DocsLocale>('fr');

export const DocsLocaleProvider = DocsLocaleContext.Provider;

export function useDocsLocale(): DocsLocale {
  return useContext(DocsLocaleContext);
}

function renderCode(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={i}>{renderCode(part.slice(2, -2))}</strong>;
    }
    return <span key={i}>{renderCode(part)}</span>;
  });
}

function Copy({ k }: { k: string }) {
  return renderInline(docsString(docsCopy, k, useDocsLocale()));
}

export function T({ k }: { k: string }) {
  return <Copy k={k} />;
}

export function H1({ k }: { k: string }) {
  return (
    <h1>
      <Copy k={k} />
    </h1>
  );
}

export function H2({ k }: { k: string }) {
  return (
    <h2>
      <Copy k={k} />
    </h2>
  );
}

export function H3({ k }: { k: string }) {
  return (
    <h3>
      <Copy k={k} />
    </h3>
  );
}

export function H4({ k }: { k: string }) {
  return (
    <h4>
      <Copy k={k} />
    </h4>
  );
}

export function P({ k }: { k: string }) {
  return (
    <p>
      <Copy k={k} />
    </p>
  );
}

export function Ul({ items }: { items: string[] }) {
  const locale = useDocsLocale();
  return (
    <ul>
      {items.map((k) => (
        <li key={k}>{renderInline(docsString(docsCopy, k, locale))}</li>
      ))}
    </ul>
  );
}

export function Ol({ items }: { items: string[] }) {
  const locale = useDocsLocale();
  return (
    <ol>
      {items.map((k) => (
        <li key={k}>{renderInline(docsString(docsCopy, k, locale))}</li>
      ))}
    </ol>
  );
}

export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  const locale = useDocsLocale();
  return (
    <table className="d-ui-docs-table">
      <thead>
        <tr>
          {headers.map((k) => (
            <th key={k} scope="col">
              {renderInline(docsString(docsCopy, k, locale))}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join('-')}>
            {row.map((k, column) => {
              const content = renderInline(docsString(docsCopy, k, locale));
              /*
               * La première cellule nomme la ligne. En `<td>`, un lecteur d'écran
               * lisait « oui / non / oui » sans dire de quel critère il parlait :
               * c'est la règle que `docs/accessibility.md` pose déjà pour `Table`.
               */
              return column === 0 ? (
                <th key={k} scope="row">
                  {content}
                </th>
              ) : (
                <td key={k}>{content}</td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
