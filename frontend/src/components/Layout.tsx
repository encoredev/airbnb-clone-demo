import Link from "next/link";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { FC, Fragment, PropsWithChildren, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const navigation = {
  categories: [,],
  pages: [],
};

const footerNavigation = {};

const Layout: FC<PropsWithChildren> = (props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="relative bg-gray-900">
        {/* Navigation */}
        <header className="relative z-10">
          <nav aria-label="Top">
            {/* Top navigation */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md backdrop-filter">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div>
                  <div className="flex h-16 items-center justify-between">
                    {/* Logo (lg+) */}
                    <div className="hidden lg:flex lg:flex-1 lg:items-center">
                      <Link href="/">
                        <a className="inline-flex items-center gap-2 text-white">
                          <svg
                            className="h-8 w-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path>
                            <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path>
                            <path d="M12 4v6"></path>
                            <path d="M2 18h20"></path>
                          </svg>
                          watermattress
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>

      <main className="flex-grow">{props.children}</main>

      <footer aria-labelledby="footer-heading" className="bg-gray-900">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 py-10">
            <p className="text-sm text-gray-400">
              Copyright &copy; 2022 Water Mattresses, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
