import Image from "next/image";
import { Button } from "./ui/button";
import SongVinyl from "./SongVinyl";

const SongOverview = ({
  title,
  artist,
  album,
  rating,
  genre,
  total_copies,
  available_copies,
  description,
  color,
  imageUrl,
}: SongType) => {
  return (
    <section className="flex flex-col-reverse items-center gap-12 sm:gap-32 xl:flex-row xl:gap-8">
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="text-foreground text-5xl font-bold md:text-7xl">
          {title}
        </h1>
        <p className="text-xl">
          By <span className="text-secondary font-bold">{artist}</span>
        </p>
        <div className="text-muted-foreground mt-7 flex flex-row flex-wrap items-center gap-4 text-xl">
          <p>
            Genre: <span className="text-primary font-semibold">{genre}</span>
          </p>
          <p>
            Album: <span className="text-primary font-semibold">{album}</span>
          </p>
          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>

          <div className="flex flex-row flex-wrap gap-4">
            <p>
              Total Copies: <span className="text-primary">{total_copies}</span>
            </p>
            <p>
              Available Copies:{" "}
              <span className="text-primary">{available_copies}</span>
            </p>
          </div>

          <p className="mt-2 text-justify text-xl">{description}</p>
          <Button className="!max-md:w-full mt-4 min-h-14 w-fit rounded-sm">
            <Image src="/icons/cd.svg" alt="star" width={20} height={20} />
            <p className="font-mono text-xl">Rent CD</p>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="relative">
          <SongVinyl
            variant="wide"
            color={color}
            imageUrl={imageUrl}
            className="z-10"
          />

          <SongVinyl
            variant="wide"
            color={color}
            imageUrl={imageUrl}
            className="absolute bottom-2 left-16 z-0 opacity-25"
          />
        </div>
      </div>
    </section>
  );
};

export default SongOverview;
