import React, { useMemo } from 'react';
import styles from './ProgressBarDynamic.module.css';

// Extend the HTMLAttributes to include ARIA attributes with correct types
interface AriaProgressBarProps {
  'aria-valuenow': number;
  'aria-valuemin': number;
  'aria-valuemax': number;
  'aria-label'?: string;
}

interface ProgressBarDynamicProps extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof AriaProgressBarProps> {
  value: number;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'amber' | 'cyan';
  'aria-label'?: string;
}

const ProgressBarDynamic: React.FC<ProgressBarDynamicProps> = ({
  value,
  color = 'blue',
  className = '',
  'aria-label': ariaLabel = 'Progress',
  ...props
}) => {
  const safeValue = useMemo(() => Math.min(100, Math.max(0, Math.round(value))), [value]);
  const colorClass = styles[`progressBar${color.charAt(0).toUpperCase() + color.slice(1)}`];
  
  // Create a unique ID for the progress bar fill element
  const fillId = useMemo(() => `progress-fill-${Math.random().toString(36).substr(2, 9)}`, []);
  
  // Update the width using CSS custom properties
  React.useEffect(() => {
    const fillElement = document.getElementById(fillId);
    if (fillElement) {
      fillElement.style.width = `${safeValue}%`;
    }
  }, [fillId, safeValue]);
  
  const containerClass = [
    styles.progressBarContainer,
    colorClass,
    className
  ].filter(Boolean).join(' ');
  
  // Prepare ARIA attributes with correct types
  const ariaProps: AriaProgressBarProps = {
    'aria-valuenow': safeValue,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-label': ariaLabel,
  };
  
  return (
    <div 
      className={containerClass}
      role="progressbar"
      {...ariaProps}
      {...props}
    >
      <div 
        id={fillId}
        className={styles.progressBarFill}
      />
    </div>
  );
};

export default ProgressBarDynamic;
