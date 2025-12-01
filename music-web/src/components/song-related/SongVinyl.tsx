import { cn } from "@/lib/utils";
import Image from "next/image";

type VinylVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

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
  variant = "regular",
  color = "#D79922",
  imageUrl = "https://placehold.co/400x400.png", // make square
}: Props) => {
  return (
    <div
      className={cn(
        "relative inline-block transition-all duration-300",
        variantStyles[variant],
        className,
      )}
    >
      {/* Album image */}
      <div className="relative h-full w-full rotate-12 overflow-hidden rounded-full ring-2 ring-black">
        <Image
          src={imageUrl}
          alt="Song CD Player"
          fill
          className="object-cover"
        />

        <div
          className={`absolute top-1/2 left-1/2 rounded-full border-2 border-black`}
          style={{
            width: "25%",
            height: "25%",
            backgroundColor: color,
            transform: "translate(-50%, -50%)",
          }}
        />

        <div
          className="absolute top-1/2 left-1/2 rounded-full border-2 border-black bg-white"
          style={{
            width: "5%",
            height: "5%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
};

export default SongVinyl;
