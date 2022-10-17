import { StarIcon } from "@heroicons/react/24/solid";
import { format, parse } from "date-fns";
import { GetServerSideProps } from "next";
import { FC, useState } from "react";
import FirebaseAuthPage from "../../components/FirebaseAuthPage";
import useFirebaseAuth from "../../components/FirebaseProvider";
import { useDetailViewQuery } from "../../graphql";
import Client, { Environment, Local } from "../../lib/client";
import { auth } from "../../lib/fb";

interface Props {
  listingID: number;
  checkin: string;
  checkout: string;
  guests: number;
}

const Book: FC<Props> = ({ listingID, checkin, checkout, guests }) => {
  const [loading, setLoading] = useState(false);
  const authUser = useFirebaseAuth();
  const [result] = useDetailViewQuery({
    variables: { id: listingID },
  });
  const { data, error } = result;

  if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (!data) {
    return <div>Loading...</div>;
  }

  const listing = data.getListing!;

  const checkinDate = parse(checkin, "y-M-d", new Date());
  const checkoutDate = parse(checkout, "y-M-d", new Date());

  const doBook = async () => {
    setLoading(true);
    try {
      const token = await authUser.user!.getIdToken(true);
      const client = new Client(Environment("staging"), { auth: token });
      const resp = await client.booking.Initiate({
        listingID,
        checkin,
        checkout,
        guests,
      });
      window.location.assign(resp.RedirectURL);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-6xl lg:px-8">
        <h1 className="text-3xl tracking-tight text-gray-900">
          Confirm and pay
        </h1>

        <div className="mt-8 lg:flex justify-between">
          <div className="lg:min-w-0 lg:w-1/2">
            <h2 className="text-2xl tracking-tight text-gray-900">Your trip</h2>

            <h3 className="mt-4 text-base text-gray-900 font-semibold">
              Dates
            </h3>
            <div className="mt-1">
              {format(checkinDate, "MMM d")} &ndash;{" "}
              {format(checkoutDate, "MMM d")}
            </div>

            <h3 className="mt-4 text-base text-gray-900 font-semibold">
              Guests
            </h3>
            <div className="mt-1">
              {guests} guest{guests !== 1 ? "s" : ""}
            </div>

            <div className="mt-8">
              {authUser.loading ? (
                <div>Loading auth information...</div>
              ) : !authUser.user ? (
                <FirebaseAuthPage />
              ) : (
                <div>
                  <button
                    type="button"
                    disabled={loading}
                    className="inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => doBook()}
                  >
                    {loading ? (
                      <>
                        <LoadingIcon className="h-4 w-4 mr-1" /> Loading
                      </>
                    ) : (
                      <>Book now</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-md flex-none">
            <div className="border border-gray-300 rounded-lg p-6">
              {/* Listing info */}
              <div className="flex gap-2">
                <img
                  src={listing.pictures[0]}
                  alt={listing.title}
                  className="w-32 h-auto rounded-lg"
                />

                <div className="flex flex-col">
                  <div className="text-xs text-gray-500">Entire cottage</div>
                  <div className="mt-1 text-sm">{listing.title}</div>
                  <div className="mt-auto flex items-center gap-2 text-xs">
                    <div className="flex items-center">
                      <StarIcon className="h-3 w-3" />
                      {Math.round(listing.rating * 100) / 100}
                    </div>
                    <span>·</span>
                    27 reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const listingID = +context.query.id!;
  const guests = +context.query.guests!;
  const checkin = context.query.checkin as string | undefined;
  const checkout = context.query.checkout as string | undefined;
  if (!checkin || !checkout || !guests) {
    return {
      redirect: {
        destination: `/listing/${listingID}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      listingID,
      checkin,
      checkout,
      guests,
    },
  };
};

const LoadingIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 120 30" fill="currentColor">
    <circle cx="15" cy="15" r="15">
      <animate
        attributeName="r"
        from="15"
        to="15"
        begin="0s"
        dur="0.8s"
        values="15;9;15"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        from="1"
        to="1"
        begin="0s"
        dur="0.8s"
        values="1;.5;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="60" cy="15" r="9" fillOpacity="0.3">
      <animate
        attributeName="r"
        from="9"
        to="9"
        begin="0s"
        dur="0.8s"
        values="9;15;9"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        from="0.5"
        to="0.5"
        begin="0s"
        dur="0.8s"
        values=".5;1;.5"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="105" cy="15" r="15">
      <animate
        attributeName="r"
        from="15"
        to="15"
        begin="0s"
        dur="0.8s"
        values="15;9;15"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        from="1"
        to="1"
        begin="0s"
        dur="0.8s"
        values="1;.5;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);
