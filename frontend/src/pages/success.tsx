import { FC } from "react";

const SuccessPage: FC = () => {
  return (
    <main className="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="max-w-xl">
          <h1 className="text-base font-medium text-indigo-600">Thank you!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight">
            Enjoy your stay!
          </p>
          <p className="mt-2 text-base text-gray-500">
            Your booking #14034056 has been completed.
          </p>
        </div>
      </div>
    </main>
  );
};

export default SuccessPage;
