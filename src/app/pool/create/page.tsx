import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import CreatePool from '@/components/pool/create/createPool';

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CreatePoolP = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Pool" />

      <div className="flex flex-col gap-5">
        <CreatePool />
      </div>
    </DefaultLayout>
  );
}
export default CreatePoolP;