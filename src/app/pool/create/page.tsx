import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import CreatePool from '@/components/pool/create/createPool';

export const metadata: Metadata = {
  title: "Create Pool | Gluon",
  description: "Create pool on Solana blockchain with Gluon dex.",
  // icons: {
  //   icon: '/images/logo/Gluon4.png', // /public path
  // },
}

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