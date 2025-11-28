import SongVinyl from "./SongVinyl";
import Link from "next/link";

interface Props {
  song: SongType;
}

const SongCard = ({ song }: Props) => {
  const { id, title, tags, color, imageUrl } = song;

  return (
    <li>
      <Link href={`/songs/${id}`} className="flex w-full flex-col items-center">
        <SongVinyl color={color} imageUrl={imageUrl} />
        <div className="xs:max-w-40 max-w-32">
          <p className="text-foreground xs:text-xl mt-2 line-clamp-1 text-base font-semibold">
            {title}
          </p>
          <p className="text-muted-foreground xs:text-base mt-1 line-clamp-1 text-sm italic">
             {tags?.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(" ")}
          </p>
        </div>
      </Link>
    </li>
  );
};

export default SongCard;
