import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { toastArgTypes } from '../../../.storybook/arg-types';
import { componentSource } from '../../../.storybook/docs-source';
import { docsLocale, toastCopy } from '../../../.storybook/docs-locale';
import { Button } from '../Button/Button';
import { ToastProvider, useToast } from './ToastProvider';

const importToast = "import { Button, ToastProvider, useToast } from 'd-ui';";

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  argTypes: toastArgTypes,
  args: {
    maxVisible: 3,
    defaultDuration: 6000,
    defaultDismissible: false,
    children: null,
  },
  decorators: [
    (Story, context) => (
      <ToastProvider
        maxVisible={context.args.maxVisible}
        defaultDuration={context.args.defaultDuration}
        defaultDismissible={context.args.defaultDismissible}
        label={context.args.label}
      >
        <div className="min-h-48">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  args: { children: null },
  parameters: componentSource(
    importToast,
    `function SaveButton() {
  const { toast } = useToast();
  return (
    <Button
      {/* Minuté, donc sans bouton fermer : il disparaîtrait sous le doigt. */}
      onClick={() => toast({ variant: 'success', message: 'Enregistré.' })}
    >
      Enregistrer
    </Button>
  );
}

<ToastProvider>
  <SaveButton />
</ToastProvider>`,
  ),
  render: (_, { globals }) => {
    const copy = toastCopy(docsLocale(globals.locale));
    function Demo() {
      const { toast } = useToast();
      return (
        <Button
          type="button"
          onClick={() =>
            toast({
              variant: 'success',
              message: copy.saved,
            })
          }
        >
          {copy.show}
        </Button>
      );
    }
    return <Demo />;
  },
};

export const Variants: Story = {
  name: 'Variantes',
  args: { children: null },
  parameters: componentSource(
    importToast,
    `toast({ variant: 'info', message: '…' });
toast({ variant: 'success', message: '…' });
toast({ variant: 'warning', message: '…' });
toast({ variant: 'danger', message: '…' });`,
  ),
  render: (_, { globals }) => {
    const copy = toastCopy(docsLocale(globals.locale));
    function Demo() {
      const { toast } = useToast();
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => toast({ variant: 'info', message: copy.published })}
          >
            {copy.showInfo}
          </Button>
          <Button
            type="button"
            onClick={() => toast({ variant: 'success', message: copy.saved })}
          >
            {copy.showSuccess}
          </Button>
          <Button
            type="button"
            onClick={() => toast({ variant: 'warning', message: copy.warning })}
          >
            {copy.showWarning}
          </Button>
          <Button
            type="button"
            onClick={() => toast({ variant: 'danger', message: copy.danger })}
          >
            {copy.showDanger}
          </Button>
        </div>
      );
    }
    return <Demo />;
  },
};

export const WithAction: Story = {
  name: 'Avec action',
  args: { children: null },
  parameters: componentSource(
    importToast,
    `{/* Avec une action, pas d'auto-fermeture : le bouton doit rester atteignable. */}
toast({
  variant: 'info',
  message: 'Nouvelle version disponible.',
  actionLabel: 'Voir les détails',
  onActionClick: () => {},
  dismissLabel: 'Fermer la notification',
});`,
  ),
  render: (_, { globals }) => {
    const copy = toastCopy(docsLocale(globals.locale));
    function Demo() {
      const { toast } = useToast();
      return (
        <Button
          type="button"
          onClick={() =>
            toast({
              variant: 'info',
              message: copy.callback,
              actionLabel: copy.action,
              onActionClick: () => undefined,
              dismissLabel: copy.dismiss,
            })
          }
        >
          {copy.show}
        </Button>
      );
    }
    return <Demo />;
  },
};

export const Dismissible: Story = {
  name: 'Fermable',
  args: { children: null },
  parameters: componentSource(
    importToast,
    `toast({
  variant: 'info',
  message: 'Les notes seront publiées demain.',
  dismissible: true,
  dismissLabel: 'Fermer la notification',
  duration: 0,
});`,
  ),
  render: (_, { globals }) => {
    const copy = toastCopy(docsLocale(globals.locale));
    function Demo() {
      const { toast } = useToast();

      useEffect(() => {
        toast({
          variant: 'info',
          message: copy.published,
          dismissible: true,
          dismissLabel: copy.dismiss,
          duration: 0,
        });
      }, [toast]);

      return (
        <Button
          type="button"
          onClick={() =>
            toast({
              variant: 'info',
              message: copy.published,
              dismissible: true,
              dismissLabel: copy.dismiss,
              duration: 0,
            })
          }
        >
          {copy.showDismissible}
        </Button>
      );
    }
    return <Demo />;
  },
};

export const Queue: Story = {
  name: 'File d’attente',
  args: { children: null, maxVisible: 2, defaultDuration: 0 },
  parameters: componentSource(
    importToast,
    `<ToastProvider maxVisible={2}>
  …
</ToastProvider>`,
  ),
  render: (_, { globals }) => {
    const copy = toastCopy(docsLocale(globals.locale));
    function Demo() {
      const { toast } = useToast();
      return (
        <Button
          type="button"
          onClick={() => {
            toast({ variant: 'info', message: copy.queueFirst });
            toast({ variant: 'info', message: copy.queueSecond });
            toast({ variant: 'info', message: copy.queueThird });
          }}
        >
          {copy.enqueue}
        </Button>
      );
    }
    return <Demo />;
  },
};
