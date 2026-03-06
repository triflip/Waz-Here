// src/components/ui/Button.tsx

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md'
  disabled?: boolean
  fullWidth?: boolean
}

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
}: ButtonProps) => {

  const base = 'font-bold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-green-500 hover:bg-green-400 text-black',
    secondary: 'border border-green-500 text-green-500 hover:bg-green-500 hover:text-black',
    danger:    'border border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500',
  }

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-6 py-3',
  }

  const width = fullWidth ? 'w-full' : ''

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${width}`

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}

export default Button