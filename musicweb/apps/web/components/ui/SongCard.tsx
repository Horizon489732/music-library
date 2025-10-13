import { SongType } from "@repo/types";
import SongVinyl from "./SongVinyl";
import Link from "next/link";

interface Props {
  song: SongType;
}

const SongCard = ({ song }: Props) => {

    const { id, title, genre, color, imageUrl } = song;

  return (
    <li>
        <Link href={`/songs/${id}`} className="w-full flex flex-col items-center">
            <SongVinyl color={color} imageUrl={imageUrl} />
            <div className="xs:max-w-40 max-w-32">
                <p className="mt-2 line-clamp-1 text-base font-semibold text-foreground xs:text-xl">{title}</p>
                <p className="mt-1 line-clamp-1 text-sm italic text-muted-foreground xs:text-base">{genre}</p>
            </div>
        </Link>
    </li>
  );
};

export default SongCard;
