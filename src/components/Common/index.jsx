/**
 * Componentes Base Reutilizables
 * Estos son los bloques fundamentales para construir la interfaz
 */

import React from 'react';

// ========== BUTTON ==========

/**
 * Componente Button personalizable
 */
export const Button = ({
  variant = 'primary', // primary, secondary, success, danger, ghost
  size = 'md', // sm, md, lg, xl
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  children,
  className = '',
  ...props
}) => {
  const variants = {
    primary:
      'bg-gradient-to-r from-primary-900 to-blue-800 hover:from-blue-800 hover:to-primary-900 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5',
    secondary:
      'bg-white hover:bg-primary-50 text-primary-900 border-2 border-primary-900 shadow-sm hover:shadow-md',
    gold:
      'bg-secondary hover:bg-amber-500 text-white shadow-md hover:shadow-lg',
    success:
      'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg',
    ghost:
      'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      className={`
        rounded-lg font-semibold transition-all duration-200
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
          {children}
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
};

// ========== CARD ==========

/**
 * Componente Card versátil
 */
export const Card = ({
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  hover = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md border border-gray-100
        ${hover ? 'transition-all hover:shadow-lg hover:scale-105' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Header */}
      {(title || Icon) && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />}
            <div>
              {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="px-6 py-4">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

// ========== BADGE ==========

/**
 * Componente Badge
 */
export const Badge = ({
  variant = 'blue', // blue, green, yellow, red, orange, gray
  size = 'md', // sm, md, lg
  icon: Icon,
  children,
  className = '',
}) => {
  const variants = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </span>
  );
};

// ========== MODAL ==========

/**
 * Componente Modal
 */
export const Modal = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md', // sm, md, lg, xl, full
  closeButton = true,
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`
            bg-white rounded-xl shadow-2xl
            ${sizes[size]}
            w-full
            max-h-[90vh]
            overflow-y-auto
            flex flex-col
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {closeButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ========== INPUT ==========

/**
 * Componente Input
 */
export const Input = ({
  label,
  error,
  hint,
  icon: Icon,
  fullWidth = true,
  ...props
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          className={`
            w-full px-4 py-2 rounded-lg border transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${Icon ? 'pl-10' : ''}
            ${
              error
                ? 'border-red-300 bg-red-50 text-red-900'
                : 'border-gray-300 bg-white'
            }
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
          {...props}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
};

// ========== TEXTAREA ==========

/**
 * Componente Textarea
 */
export const Textarea = ({
  label,
  error,
  hint,
  fullWidth = true,
  rows = 4,
  ...props
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500">*</span>}
        </label>
      )}

      <textarea
        className={`
          w-full px-4 py-2 rounded-lg border transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500
          resize-none
          ${
            error
              ? 'border-red-300 bg-red-50 text-red-900'
              : 'border-gray-300 bg-white'
          }
          ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
        rows={rows}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
};

// ========== PROGRESS BAR ==========

/**
 * Componente Progress Bar
 */
export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  size = 'md', // sm, md, lg
  color = 'blue', // blue, green, orange, red
}) => {
  const percentage = (value / max) * 100;

  const sizes = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const colors = {
    blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
    orange: 'bg-gradient-to-r from-orange-400 to-orange-600',
    red: 'bg-gradient-to-r from-red-400 to-red-600',
  };

  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-blue-600">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} transition-all duration-500 flex items-center justify-center`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {max && (
        <p className="mt-1 text-xs text-gray-500">
          {value} de {max}
        </p>
      )}
    </div>
  );
};

// ========== ALERT ==========

/**
 * Componente Alert
 */
export const Alert = ({
  variant = 'info', // info, success, warning, error
  title,
  message,
  onClose,
  closeable = true,
}) => {
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'text-blue-900',
      message: 'text-blue-800',
      icon: '🔵',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      title: 'text-green-900',
      message: 'text-green-800',
      icon: '✅',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
      icon: '⚠️',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      title: 'text-red-900',
      message: 'text-red-800',
      icon: '❌',
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`
        ${style.bg} ${style.border} border rounded-lg p-4
        flex items-start gap-3
      `}
    >
      <span className="text-xl flex-shrink-0">{style.icon}</span>

      <div className="flex-1">
        {title && <h3 className={`font-semibold ${style.title}`}>{title}</h3>}
        {message && <p className={`text-sm ${style.message}`}>{message}</p>}
      </div>

      {closeable && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 text-xl ${style.message} hover:opacity-70`}
        >
          ✕
        </button>
      )}
    </div>
  );
};

// ========== LOADING SPINNER ==========

/**
 * Componente Loading Spinner
 */
export const Spinner = ({
  size = 'md', // sm, md, lg
  color = 'blue',
  label,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colors = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`
          ${sizes[size]}
          border-4 border-gray-200 rounded-full
          animate-spin
          ${colors[color]}
          border-t-2
        `}
      />
      {label && <p className="text-sm text-gray-600">{label}</p>}
    </div>
  );
};

// ========== EMPTY STATE ==========

/**
 * Componente Empty State
 */
export const EmptyState = ({
  icon: Icon,
  title = 'Sin resultados',
  message = 'No hay datos para mostrar',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon className="w-16 h-16 text-gray-300 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{message}</p>
      {action && action}
    </div>
  );
};

// ========== STATS CARD ==========

/**
 * Componente Stats Card
 */
export const StatsCard = ({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  trendLabel,
  color = 'blue', // blue, green, orange, red
}) => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
  };

  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50',
  };

  return (
    <Card className={`${bgColors[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-gray-500 text-sm">{unit}</span>}
          </div>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
            </p>
          )}
        </div>
        {Icon && <Icon className={`w-12 h-12 ${colors[color]} opacity-20`} />}
      </div>
    </Card>
  );
};

export default {
  Button,
  Card,
  Badge,
  Modal,
  Input,
  Textarea,
  ProgressBar,
  Alert,
  Spinner,
  EmptyState,
  StatsCard,
};
