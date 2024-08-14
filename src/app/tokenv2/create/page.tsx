// "use client";
import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

import CreateToken from '../../../components/tokenv2/create3';

// import { CreateToken } from '../../../components/tokenv1/CreateToken';

// import {
//   CreateToken2 as CreateToken,
// } from '../../components/tokenv1/CreateToken2';

//zzll
export const metadata: Metadata = {
  title: "Create spl-2022 token | Gluon",
  description: "Create spl-2022 token on Solana blockchain with Gluon dex.",
  // icons: {
  //   icon: '/images/logo/Gluon4.png', // /public path
  // },
}

export default function Token() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Token V2" />

      <div className="flex flex-col gap-5">
        <CreateToken />
      </div>
    </DefaultLayout>
  );
}
