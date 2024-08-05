import React from 'react';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="px-10 border-t border-t-zinc-500 py-10 dark:border-zinc-700/40 flex items-center justify-between">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        <Link href={"/blog"}>Blog</Link>
        <Link href={"/blog/about"}>About</Link>
        <Link href={"/swap"}>Swap</Link>
        <Link href={"/limit"}>Limit Order</Link>
        <Link href={"/pool/create"}>Pool</Link>
        <Link href={"/tokenv1/create"}>Token V1</Link>
        <Link href={"/tokenv2/create"}>Token V2</Link>
        {/* <Link href="/projects">Projects</Link>
        <Link href="/speaking">Speaking</Link>
        <Link href="/uses">Uses</Link> */}
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        &copy; {new Date().getFullYear()} gluon_All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
