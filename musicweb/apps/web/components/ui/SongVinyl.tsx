import { cn } from '@repo/ui/lib/utils';
import Image from 'next/image';

type VinylVariant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';

const variantStyles: Record<VinylVariant, string> = {
  extraSmall: "cd-cover_extra_small",
  small: "cd-cover_small",
  medium: "cd-cover_medium",
  regular: "cd-cover_regular",
  wide: "cd-cover_wide",
};

interface Props {
  className?: string;
  variant?: VinylVariant;
  color?: string; // vinyl background color
  imageUrl?: string;
}

const SongVinyl = ({
  className,
  variant = 'regular',
  color = '#012B48',
  imageUrl = 'https://placehold.co/400x400.png', // make square
}: Props) => {
  return (
    <div
      className={cn(
        'relative inline-block transition-all duration-300',
        variantStyles[variant],
        className
      )}
    >

      {/* Album image */}
      <div className="relative w-full h-full rounded-full overflow-hidden rotate-12 ring-2 ring-black">
        <Image
          src={imageUrl}
          alt="Song CD Player"
          fill
          className="object-cover"
        />

        {/* Small vinyl hole */}
        <div
          className="absolute top-1/2 left-1/2 bg-black rounded-full"
          style={{
            width: '25%',
            height: '25%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
};

export default SongVinyl;
