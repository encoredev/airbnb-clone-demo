import Link from "next/link";
import { FC } from "react";
import { useIndexViewQuery } from "../graphql";
import { StarIcon } from "@heroicons/react/24/solid";

const Home: FC = () => {
  const [result] = useIndexViewQuery({});
  const { data, error } = result;

  if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Customers also purchased
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.listings.map((listing) => (
            <div key={listing.id} className="group relative">
              <div className="min-h-[17.5rem] aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-[17.5rem]">
                <img
                  src={listing.pictures[0]}
                  alt={listing.title}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/listing/${listing.id}`}>
                      <a className="font-bold">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {listing.location}
                      </a>
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <div>{listing.distanceKm} kilometers away</div>
                    <div>Oct 15 — 22 </div>
                    <div className="mt-1">
                      <span className="font-semibold">
                        {listing.pricePerNight} SEK
                      </span>{" "}
                      night
                    </div>
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4" />
                    <span>{Math.round(listing.rating * 100) / 100}</span>
                  </div>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
