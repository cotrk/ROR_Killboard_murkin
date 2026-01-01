import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export function ErrorMessage({
  message,
  name,
  customText,
}: {
  message?: string;
  name?: string;
  customText?: string | null;
}): ReactElement {
  const { t } = useTranslation('components');

  return (
    <div className="alert alert-error">
      <div className="flex items-start gap-2">
        <i className="fas fa-exclamation-triangle mt-1"></i>
        <div className="flex-1">
          <p className="font-medium">{t('global.errorMessage.errorWithSadSmiley')}</p>
          {name && <pre className="text-xs mt-1 bg-error/10 p-2 rounded">{name}</pre>}
          {message && <pre className="text-xs mt-1 bg-error/10 p-2 rounded">{message}</pre>}
          {customText && <p className="text-sm mt-1">{customText}</p>}
        </div>
      </div>
    </div>
  );
}
