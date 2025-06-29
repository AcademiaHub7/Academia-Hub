import React, { useMemo } from 'react';
import './ProgressBar.css';

interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
  label = 'Progression',
  ...props
}) => {
  const { percentage, percentageText, percentageString } = useMemo(() => {
    const safeMax = Math.max(1, Number(max) || 100);
    const safeValue = Math.max(0, Math.min(safeMax, Number(value) || 0));
    const calculatedPercentage = (safeValue / safeMax) * 100;
    const roundedPercentage = Math.round(calculatedPercentage);
    
    return {
      percentage: calculatedPercentage,
      percentageText: roundedPercentage,
      percentageString: `${roundedPercentage}%`
    };
  }, [value, max]);

  // Calculate ARIA values
  const safeMax = Math.max(1, Number(max) || 100);
  const safeValue = Math.max(0, Math.min(safeMax, Number(value) || 0));
  
  // Generate a unique ID for aria-labelledby
  const labelId = React.useId();
  const hasLabel = Boolean(label);

  // Generate a class name for the current percentage (rounded to nearest 5 for better caching)
  const progressClass = `progress-${Math.round(percentage / 5) * 5}`;

  // Ensure ARIA attributes have correct types
  const ariaProps: React.AriaAttributes & {
    'aria-valuenow': number;
    'aria-valuemin': number;
    'aria-valuemax': number;
    'aria-valuetext'?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
  } = {
    'aria-valuenow': safeValue,
    'aria-valuemin': 0,
    'aria-valuemax': safeMax,
    'aria-valuetext': percentageString,
    'aria-label': label,
    ...(hasLabel ? { 'aria-labelledby': labelId } : {})
  };

  return (
    <div 
      className={`progress-bar-container ${className}`}
      data-progress={percentageText}
      role="progressbar"
      title={`${label}: ${percentageString}`}
      {...ariaProps}
      {...props}
    >
      <div className="progress-bar-track">
        <div 
          className={`progress-bar-fill ${progressClass}`}
          aria-hidden="true" 
        />
      </div>
      {hasLabel && (
        <span id={labelId} className="sr-only">
          {label}: {percentageString}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
