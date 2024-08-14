import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import LimitC from '@/components/limit/limit2';

export const metadata: Metadata = {
  title: "Limit order | Gluon",
  description: "Place limit order on Solana blockchain with Gluon dex.",
  icons: {
    icon: '/images/logo/Gluon4.png', // /public path
  },
}

const Limit = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Limit Order" />

      <div className="flex flex-col gap-5">
        <LimitC />
      </div>
    </DefaultLayout>
  );
}
export default Limit;