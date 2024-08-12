import { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Swap4 from '@/components/swap/swap5/swap5';

export const metadata: Metadata = {
  title: "Swap | Gluon",
  description: "This is Gluon Admin Dashboard",
  icons: {
    icon: '/images/logo/Gluon4.png', // /public path
  },
}

const Home = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Swap" />

      <div className="flex flex-col gap-5">
        <Swap4 />
      </div>
    </DefaultLayout>
  );
}
export default Home;