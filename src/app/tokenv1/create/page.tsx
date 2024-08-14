import { Metadata } from 'next';

// "use client";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

import { Create as CreateToken } from '../../../components/tokenv1/create';

// import { CreateToken } from '../../../components/tokenv1/CreateToken';

// import {
//   CreateToken2 as CreateToken,
// } from '../../components/tokenv1/CreateToken2';

//zzll
export const metadata: Metadata = {
  title: "Create spl token | Gluon",
  description: "Create spl token on Solana blockchain with Gluon dex.",
  icons: {
    icon: '/images/logo/Gluon4.png', // /public path
  },
}

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
