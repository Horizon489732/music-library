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
          <div className="flex flex-row gap-1 items-center">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5232 3.20745C10.5619 3.11288 10.628 3.03198 10.7128 2.97504C10.7977 2.9181 10.8976 2.8877 10.9998 2.8877C11.102 2.8877 11.2019 2.9181 11.2868 2.97504C11.3717 3.03198 11.4377 3.11288 11.4765 3.20745L13.4244 7.89253C13.4609 7.9802 13.5208 8.05611 13.5976 8.1119C13.6745 8.1677 13.7652 8.20122 13.8598 8.20878L18.918 8.61395C19.3754 8.65062 19.5606 9.2217 19.2122 9.51962L15.3586 12.8215C15.2866 12.883 15.2329 12.9633 15.2035 13.0533C15.1741 13.1434 15.17 13.2398 15.1917 13.332L16.3697 18.2683C16.3933 18.3673 16.3871 18.4711 16.3518 18.5667C16.3165 18.6622 16.2537 18.7451 16.1713 18.8049C16.0889 18.8647 15.9907 18.8988 15.8889 18.9028C15.7872 18.9068 15.6865 18.8806 15.5997 18.8275L11.2684 16.1829C11.1875 16.1335 11.0946 16.1073 10.9998 16.1073C10.9051 16.1073 10.8121 16.1335 10.7312 16.1829L6.39999 18.8284C6.31314 18.8815 6.21249 18.9078 6.11074 18.9037C6.009 18.8997 5.91072 18.8657 5.82833 18.8058C5.74594 18.746 5.68312 18.6631 5.64782 18.5676C5.61252 18.4721 5.60632 18.3682 5.62999 18.2692L6.80791 13.332C6.82975 13.2398 6.82574 13.1434 6.7963 13.0533C6.76687 12.9632 6.71316 12.883 6.64107 12.8215L2.78741 9.51962C2.70981 9.45347 2.65358 9.36577 2.62585 9.26764C2.59813 9.16951 2.60015 9.06536 2.63166 8.96838C2.66317 8.8714 2.72275 8.78595 2.80285 8.72286C2.88296 8.65976 2.97999 8.62186 3.08166 8.61395L8.13983 8.20878C8.23447 8.20122 8.32519 8.1677 8.40202 8.1119C8.47884 8.05611 8.53878 7.9802 8.57524 7.89253L10.5232 3.20745Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512" width="22" height="22">
              <g>
                <path d="M256,0C114.609,0,0,114.625,0,256s114.609,256,256,256s256-114.625,256-256S397.391,0,256,0z M96.469,149.891
                  l-1.438,2.172l-20.469-13.625l1.453-2.188C108.594,87.375,160.344,53.469,218,43.219l2.578-0.453l4.313,24.203l-2.578,0.438
                  C171.219,76.484,125.359,106.547,96.469,149.891z M145.781,186.688l-20.719-13.953l1.813-2.703
                  c23.438-34.828,60.484-59.313,101.625-67.156l3.203-0.641l4.672,24.547l-3.188,0.594c-34.641,6.656-65.828,27.266-85.594,56.594
                  L145.781,186.688z M159.578,256c0-53.25,43.172-96.406,96.422-96.422c53.25,0.016,96.406,43.172,96.406,96.422
                  S309.25,352.406,256,352.406S159.578,309.25,159.578,256z M280.938,415.25l-4.031-24.656l3.234-0.531
                  c36.609-5.969,69.359-27.203,89.813-58.188l1.797-2.719l20.875,13.719l-1.813,2.75c-24.266,36.781-63.141,61.969-106.656,69.094
                  L280.938,415.25z M436,375.734c-32.594,48.891-84.344,82.813-142.016,93.063l-2.578,0.438l-4.281-24.203l2.563-0.453
                  c51.063-9.047,96.953-39.109,125.844-82.484l1.438-2.188l20.469,13.656L436,375.734z"/>
                <path d="M308.359,203.641c-13.422-13.422-31.891-21.672-52.359-21.688c-20.453,0-38.922,8.266-52.344,21.688
                  S181.969,235.531,181.969,256s8.266,38.938,21.688,52.359s31.891,21.672,52.344,21.688c20.469-0.016,38.938-8.266,52.359-21.688
                  c13.391-13.422,21.672-31.891,21.672-52.359S321.75,217.063,308.359,203.641z M256,295.391c-21.75,0-39.375-17.641-39.375-39.391
                  S234.25,216.625,256,216.625S295.375,234.25,295.375,256S277.75,295.391,256,295.391z"/>
              </g>
              </svg>
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
