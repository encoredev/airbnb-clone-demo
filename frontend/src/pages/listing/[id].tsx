import { StarIcon } from "@heroicons/react/24/solid";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FC } from "react";
import { useDetailViewQuery } from "../../graphql";

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
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-5xl lg:px-8">
        <h2 className="text-3xl tracking-tight text-gray-900">
          {listing.title}
        </h2>
        <p className="text-sm text-gray-700 flex items-center gap-1">
          <StarIcon className="h-4 w-4" />
          <span>·</span>
          27 reviews
          <span>·</span>
          {listing.location}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
          <div className="group relative">
            <div className="min-h-96 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-96">
              <img
                src={listing.picture_url}
                alt={listing.title}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none">
              <img
                src="https://a0.muscache.com/im/pictures/f20597bd-2297-4858-a6f5-fc99d8375dc3.jpg?im_w=720"
                alt={listing.title}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none">
              <img
                src="https://a0.muscache.com/im/pictures/8cff6df8-b9fa-40f6-b6b2-27dfe3b178cb.jpg?im_w=720"
                alt={listing.title}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none">
              <img
                src="https://a0.muscache.com/im/pictures/41a26535-1f41-4be4-ae77-6778eab87bfb.jpg?im_w=720"
                alt={listing.title}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none">
              <img
                src="https://a0.muscache.com/im/pictures/19af870b-4b3f-49d7-8a20-ff2ad15f53b3.jpg?im_w=720"
                alt={listing.title}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl">Entire cabin hosted by Stig</h2>
          <div className="flex items-center gap-1 font-light">
            <span>4 guests</span>
            <span>·</span>
            <span>Studio</span>
            <span>·</span>
            <span>2 beds</span>
            <span>·</span>
            <span>1.5 baths</span>
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
