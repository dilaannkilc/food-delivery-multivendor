import { twMerge } from 'tailwind-merge';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextIconClickableProps } from '@/lib/utils/interfaces';
import { Ripple } from 'primereact/ripple';

import { ProgressSpinner } from 'primereact/progressspinner';

export default function TextIconClickable({
  className,
  icon,
  title = '',
  iconStyles,
  onClick,
  loading = false, 
}: TextIconClickableProps) {
  return (
    <div
      className={`text-icon-clickable-container ${twMerge('flex items-center justify-center text-sm', className)}`}
      onClick={onClick}
    >
      {}
      {loading ? (
        <ProgressSpinner style={{ width: '20px', height: '20px' }} /> 
      ) : (
        icon && (
          <FontAwesomeIcon
            icon={icon}
            color={iconStyles?.color ?? 'gray'}
            spin={loading}
          />
        )
      )}
      <div className={loading ? 'opacity-50' : ''}>{title}</div>
      <Ripple />
    </div>
  );
}
