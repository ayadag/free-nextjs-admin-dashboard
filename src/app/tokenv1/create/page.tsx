"use client";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
// import { Metadata } from "next";
import DefaultLayout from '@/components/Layouts/DefaultLayout';

import { Create as CreateToken } from '../../../components/tokenv1/create';

// import { CreateToken } from '../../../components/tokenv1/CreateToken';

// import {
//   CreateToken2 as CreateToken,
// } from '../../components/tokenv1/CreateToken2';

//zzll
// export const metadata: Metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

export default function Token() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Token V1" />

      <div className="flex flex-col gap-5">
        <CreateToken />
      </div>
    </DefaultLayout>
  );
}
