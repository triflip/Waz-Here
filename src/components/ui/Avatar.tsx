
interface AvatarProps {
    url?: string | null
    name?: string
    size?: 'sm' | 'md' | 'lg'
}

const Avatar = ({url, name, size = 'md'}: AvatarProps) => {

    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-24 h-24 text-2xl'
    }

    const initial =name ? name.charAt(0).toUpperCase() :'🚩'

    return (
      <div className={`${sizes[size]} rounded-full border-2 border-green-500 overflow-hidden bg-gray-900 flex items-center justify-center shrink-0`}>
      {url ? (
        <img
          src={url}
          alt={name || 'avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-green-500 font-bold">{initial}</span>
      )}
    </div>
  )
}

export default Avatar