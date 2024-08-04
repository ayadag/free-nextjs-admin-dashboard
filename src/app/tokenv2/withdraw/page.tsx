import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import WithdrawC from '@/components/tokenv2/withdraw/withdraw';

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

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