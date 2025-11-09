/**
 * 🎨 METRO UI - COMPONENTES BASE
 * Componentes reutilizáveis no estilo Windows Phone / Metro
 */

import { MetroColors } from '@/constants/metro-design-system';
import { ReactNode } from 'react';

// ============================================
// METRO BUTTON
// ============================================

interface MetroButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'base' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  accentColor?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function MetroButton({
  children,
  onClick,
  variant = 'primary',
  size = 'base',
  disabled = false,
  fullWidth = false,
  accentColor = MetroColors.blue,
  className = '',
  type = 'button',
}: MetroButtonProps) {
  const baseStyles = `
    font-segoe uppercase tracking-wide font-semibold
    border-none transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;

  const sizeStyles = {
    sm: 'h-8 px-3 text-xs',
    base: 'h-10 px-5 text-sm',
    lg: 'h-12 px-7 text-base',
  };

  const variantStyles = {
    primary: `text-white hover:opacity-90`,
    secondary: `border-2 hover:bg-opacity-10`,
    ghost: `bg-transparent hover:bg-opacity-10`,
    danger: `bg-[${MetroColors.red}] text-white hover:opacity-90`,
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const style: React.CSSProperties = {};
  if (variant === 'primary' || variant === 'danger') {
    style.backgroundColor = variant === 'danger' ? MetroColors.red : accentColor;
  }
  if (variant === 'secondary' || variant === 'ghost') {
    style.color = accentColor;
    style.borderColor = variant === 'secondary' ? accentColor : 'transparent';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

// ============================================
// METRO TILE (Card quadrado/retangular)
// ============================================

interface MetroTileProps {
  children: ReactNode;
  color?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large' | 'wide';
  className?: string;
  hoverable?: boolean;
}

export function MetroTile({
  children,
  color = MetroColors.blue,
  onClick,
  size = 'medium',
  className = '',
  hoverable = true,
}: MetroTileProps) {
  const sizeStyles = {
    small: 'aspect-square',
    medium: 'aspect-square md:col-span-1',
    large: 'aspect-square md:col-span-2 md:row-span-2',
    wide: 'aspect-[2/1] md:col-span-2',
  };

  const hoverStyles = hoverable
    ? 'hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        p-6 flex flex-col justify-between
        transition-all duration-200
        ${sizeStyles[size]}
        ${hoverStyles}
        ${className}
      `}
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  );
}

// ============================================
// METRO INPUT
// ============================================

interface MetroInputProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  accentColor?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export function MetroInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  fullWidth = false,
  accentColor = MetroColors.blue,
  bgColor = '#FFFFFF',
  textColor = '#1A1A1A',
  className = '',
}: MetroInputProps) {
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        h-10 px-3 font-segoe text-sm
        border-2 border-transparent
        transition-all duration-200
        focus:outline-none focus:border-opacity-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? 'border-red-500' : ''}
        ${widthStyle}
        ${className}
      `}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderColor: error ? MetroColors.red : 'transparent',
      }}
      onFocus={(e) => {
        e.target.style.borderColor = accentColor;
      }}
      onBlur={(e) => {
        if (!error) {
          e.target.style.borderColor = 'transparent';
        }
      }}
    />
  );
}

// ============================================
// METRO HEADER
// ============================================

interface MetroHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onBack?: () => void;
  accentColor?: string;
  textColor?: string;
  className?: string;
}

export function MetroHeader({
  title,
  subtitle,
  action,
  actionLabel,
  onAction,
  onBack,
  accentColor = MetroColors.blue,
  textColor = '#FFFFFF',
  className = '',
}: MetroHeaderProps) {
  return (
    <header className={`py-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="mb-2 font-segoe text-sm uppercase tracking-wide hover:opacity-80"
              style={{ color: accentColor }}
            >
              ← voltar
            </button>
          )}
          <h1
            className="font-segoe text-4xl font-light lowercase mb-1"
            style={{ color: textColor }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="font-segoe text-sm opacity-60" style={{ color: textColor }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="font-segoe text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
            style={{ color: accentColor }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </header>
  );
}

// ============================================
// METRO LOADING (Windows 10/11 Style)
// ============================================

interface MetroLoadingProps {
  size?: 'sm' | 'base' | 'lg';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export function MetroLoading({
  size = 'base',
  color = MetroColors.blue,
  text,
  fullScreen = false,
}: MetroLoadingProps) {
  const sizeMap = {
    sm: { container: 32, dot: 4 },
    base: { container: 48, dot: 6 },
    lg: { container: 64, dot: 8 },
  };

  const { container, dot } = sizeMap[size];

  const content = (
    <div className="flex flex-col items-center gap-6">
      {/* Windows Loading Animation - 6 dots in circle */}
      <div 
        className="relative" 
        style={{ width: container, height: container }}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const angle = (index * 60 * Math.PI) / 180;
          const radius = container / 2 - dot;
          const x = container / 2 + radius * Math.cos(angle - Math.PI / 2);
          const y = container / 2 + radius * Math.sin(angle - Math.PI / 2);

          return (
            <div
              key={index}
              className="absolute rounded-full animate-windows-dot"
              style={{
                width: dot,
                height: dot,
                left: x - dot / 2,
                top: y - dot / 2,
                backgroundColor: color,
                animationDelay: `${index * 0.1}s`,
              }}
            />
          );
        })}
      </div>
      {text && (
        <p className="font-segoe text-sm lowercase" style={{ color }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        {content}
      </div>
    );
  }

  return content;
}

// ============================================
// METRO MODAL OVERLAY
// ============================================

interface MetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function MetroModal({
  isOpen,
  onClose,
  children,
  maxWidth = 'md',
}: MetroModalProps) {
  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidthStyles[maxWidth]} bg-white dark:bg-black border border-gray-800 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================
// METRO STATS CARD
// ============================================

interface MetroStatsCardProps {
  value: string | number;
  label: string;
  color?: string;
  bgColor?: string;
  icon?: ReactNode;
  className?: string;
}

export function MetroStatsCard({
  value,
  label,
  color = '#FFFFFF',
  bgColor = '#1A1A1A',
  icon,
  className = '',
}: MetroStatsCardProps) {
  return (
    <div
      className={`p-4 border border-gray-800 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-segoe text-3xl font-light" style={{ color }}>
            {value}
          </p>
          <p className="font-segoe text-xs uppercase opacity-60" style={{ color }}>
            {label}
          </p>
        </div>
        {icon && <div style={{ color }}>{icon}</div>}
      </div>
    </div>
  );
}
