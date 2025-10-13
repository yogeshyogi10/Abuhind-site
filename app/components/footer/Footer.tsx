import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-yellow-400 text-slate-900 py-10 sm:py-12 lg:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 lg:py-0 text-center mt-4 sm:-mt-10 lg:-mt-16">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image
            src="/assets/logo/abuhind-logo.png"
            alt="Abu Hind"
            width={320}                  // higher intrinsic pixels for crispness
            height={142}
            className="h-auto w-44 sm:w-56 md:w-60 lg:w-64"
            sizes="(min-width:1024px) 16rem, (min-width:768px) 15rem, (min-width:640px) 14rem, 11rem"
            priority
          />
        </div>

        {/* Description */}
        <p className="mx-auto -mt-7 max-w-3xl text-xs sm:text-sm leading-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco labo
        </p>

        {/* Main nav */}
        <nav aria-label="Footer" className="mt-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium">
            <li><Link href="#" className="hover:underline">Home</Link></li>
            <li><Link href="#" className="hover:underline">About Us</Link></li>
            <li><Link href="#" className="hover:underline">Blog</Link></li>
            <li><Link href="#" className="hover:underline">Contact</Link></li>
          </ul>
        </nav>

        {/* Policies */}
        <div className="mt-5">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs">
            <li><Link href="#" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:underline">Terms of Service</Link></li>
            <li><Link href="#" className="hover:underline">Cookies Policy</Link></li>
          </ul>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-xs">
          &copy; {new Date().getFullYear()} Abuhind. All rights reserved
        </p>
      </div>
    </footer>
  );
}
