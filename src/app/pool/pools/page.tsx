import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import PoolsC from '@/components/pool/pools';

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Pools = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Pools" />

      <div className="flex flex-col gap-10">
        <PoolsC />
      </div>
    </DefaultLayout>
  );
}
export default Pools;