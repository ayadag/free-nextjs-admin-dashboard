"use client";
// import { Metadata } from "next";
import DefaultLayout from '@/components/Layouts/DefaultLayout';

import { CreateToken } from '../../components/tokenv1/CreateToken';

// import { CreateToken2 } from '../../components/token/CreateToken2';
//zzll
// export const metadata: Metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

export default function Token() {
  return (
    <>
      <DefaultLayout>
        <CreateToken />
        {/* <CreateToken2 /> */}
      </DefaultLayout>
    </>
  );
}
