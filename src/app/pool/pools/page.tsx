import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import PoolsC from '@/components/pool/pools3';

export const metadata: Metadata = {
  title: "Pools | Gluon",
  description: "This is Gluon Admin Dashboard",
  icons: {
    icon: '/images/logo/Gluon4.png', // /public path
  },
}

const Pools = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Pools" />

      <div className="flex flex-col gap-5">
        <PoolsC />
      </div>
    </DefaultLayout>
  );
}
export default Pools;