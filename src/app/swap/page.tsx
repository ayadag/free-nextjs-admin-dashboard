import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Swap4 from '@/components/swap/swap4/swap4';

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Limit = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Swap" />

      <div className="flex flex-col gap-5">
        <Swap4 />
      </div>
    </DefaultLayout>
  );
}
export default Limit;