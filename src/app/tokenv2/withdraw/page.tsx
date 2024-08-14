import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import WithdrawC from '@/components/tokenv2/withdraw/withdraw';

export const metadata: Metadata = {
  title: "Withdraw spl-2022 token fees | Gluon",
  description: "Withdraw spl-2022 token fees on Solana blockchain with Gluon dex.",
  icons: {
    icon: '/images/logo/Gluon4.png', // /public path
  },
}

const Withdraw = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Withdraw" />

      <div className="flex flex-col gap-5">
        <WithdrawC />
      </div>
    </DefaultLayout>
  );
}
export default Withdraw;