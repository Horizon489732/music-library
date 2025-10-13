import type { SongType } from '@repo/types';
import Image from 'next/image';
import Star from '@icons/star.svg';
import CD from '@icons/cd.svg';
import { Button } from '@repo/ui';
import SongVinyl from './SongVinyl';

const SongOverview = ({
  title,
  artist,
  album,
  rating,
  genre,
  total_copies,
  available_copies,
  duration,
  description,
  color,
  imageUrl,
}: SongType) => {
  return (
    <section className="flex flex-col-reverse items-center gap-12 sm:gap-32 xl:flex-row xl:gap-8">
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="text-foreground text-5xl font-bold md:text-7xl">{title}</h1>
        <div className="text-muted-foreground mt-7 flex flex-row flex-wrap items-center gap-4 text-xl">
          <p>
            By <span className="text-primary font-semibold">{artist}</span>
          </p>
          <p>
            Genre: <span className="text-primary font-semibold">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src={Star} alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>

          <div className="flex flex-row flex-wrap gap-4">
            <p>
              Total Copies: <span>{total_copies}</span>
            </p>
            <p>
              Available Copies: <span>{available_copies}</span>
            </p>
          </div>

          <p className="mt-2 text-justify text-xl">{description}</p>
          <Button className="!max-md:w-full mt-4 min-h-14 w-fit rounded-sm">
            <Image src={CD} alt="star" width={20} height={20} />
            <p className="font-mono text-xl">Rent CD</p>
          </Button>
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
              className="absolute z-0 opacity-55 left-16 bottom-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SongOverview;
