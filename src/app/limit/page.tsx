import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import LimitC from '@/components/limit/limit2';

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Limit = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Limit Order" />

      <div className="flex flex-col gap-10">
        <LimitC />
      </div>
    </DefaultLayout>
  );
}
export default Limit;