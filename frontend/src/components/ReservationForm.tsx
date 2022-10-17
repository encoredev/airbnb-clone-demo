import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React, { useState } from "react";
import { FC } from "react";
import { Listing } from "../graphql";

type ListingSubset = Pick<Listing, "id" | "pricePerNight" | "rating">;

const ReservationForm: FC<{ listing: ListingSubset }> = ({ listing }) => {
  const [checkin, setCheckin] = useState("2022-11-16");
  const [checkout, setCheckout] = useState("2022-11-19");
  const [guests, setGuests] = useState(1);
  return (
    <div className="border rounded-xl shadow-2xl p-8 w-96">
      <div className="flex items-center justify-between">
        {/* Price per night */}
        <div>
          <span className="text-xl font-semibold">
            {listing.pricePerNight} SEK
          </span>{" "}
          <span className="text-lg font-light">night</span>
        </div>

        {/* Rating */}
        <div className="flex items-center">
          <StarIcon className="h-4 w-4" />
          {Math.round(listing.rating * 100) / 100}
        </div>
      </div>

      {/* Check-in form */}
      <div className="mt-4 isolate -space-y-px rounded-md shadow-sm">
        <div className="flex -space-x-px">
          <div className="w-1/2 min-w-0 flex-1 relative rounded-none rounded-tl-md border border-gray-300 px-3 py-2 focus-within:z-10 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
            <label
              htmlFor="checkin"
              className="block text-xs font-medium text-gray-900"
            >
              Check-in
            </label>
            <input
              type="text"
              name="checkin"
              id="checkin"
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
              defaultValue={checkin}
            />
          </div>
          <div className="w-1/2 min-w-0 flex-1 relative rounded-none rounded-tr-md border border-gray-300 px-3 py-2 focus-within:z-10 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
            <label
              htmlFor="checkout"
              className="block text-xs font-medium text-gray-900"
            >
              Check-out
            </label>
            <input
              type="text"
              name="checkout"
              id="checkout"
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
              defaultValue={checkout}
            />
          </div>
        </div>

        <div className="relative rounded-md rounded-t-none border border-gray-300 px-3 py-2 focus-within:z-10 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
          <label
            htmlFor="guests"
            className="block text-xs font-medium text-gray-900"
          >
            Guests
          </label>
          <select
            id="guests"
            name="guests"
            className="relative block w-full border-0 p-0 text-gray-900 focus:z-10 sm:text-sm focus:border-none focus:ring-0"
            defaultValue={guests}
          >
            <option value={1}>1 guest</option>
            <option value={2}>2 guests</option>
            <option value={3}>3 guests</option>
            <option value={4}>4 guests</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <Link
          href={`/book/${listing.id}?checkin=${checkin}&checkout=${checkout}&guests=${guests}`}
        >
          <a>
            <button
              type="button"
              className="w-full inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Continue
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ReservationForm;
