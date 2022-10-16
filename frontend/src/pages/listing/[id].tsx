import { StarIcon } from "@heroicons/react/24/solid";
import { GetServerSideProps } from "next";
import { FC } from "react";
import { useDetailViewQuery } from "../../graphql";
import ReservationForm from "../../components/ReservationForm";

interface Props {
  id: number;
}

const Detail: FC<Props> = ({ id }) => {
  const [result] = useDetailViewQuery({
    variables: { id: +id! },
  });
  const { data, error } = result;

  if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (!data) {
    return <div>Loading...</div>;
  }

  const listing = data.getListing!;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-6xl lg:px-8">
        <h2 className="text-3xl tracking-tight text-gray-900">
          {listing.title}
        </h2>
        <p className="text-sm text-gray-700 flex items-center gap-1">
          <span>
            <StarIcon className="h-4 w-4" />
            {Math.round(listing.rating * 100) / 100}
          </span>
          <span>·</span>
          27 reviews
          <span>·</span>
          {listing.location}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
          <div className="group relative">
            <div className="min-h-96 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-96">
              <img
                src={listing.pictures[0]}
                alt={listing.title}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            {listing.pictures.slice(1, 5).map((img) => (
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none">
                <img
                  src={img}
                  alt={listing.title}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl">Entire cabin hosted by Stig</h2>
            <div className="flex items-center gap-1 font-light">
              <span>{Math.ceil(listing.numBeds * 1.5)} guests</span>
              <span>·</span>
              <span>Studio</span>
              <span>·</span>
              <span>
                {listing.numBeds} bed{listing.numBeds !== 1 ? "s" : ""}
              </span>
              <span>·</span>
              <span>
                {listing.numBaths} bath{listing.numBaths !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="flex-none">
            <ReservationForm listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const id = +context.query.id!;
  return { props: { id } };
};
