'use client';

import PricingTable from '@/components/autumn/pricing-table';
import StaticPricingTable from '@/components/static-pricing-table';
import { useSession } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n';

// Static product details for unauthenticated users - will be translated
function getStaticProducts(t: any) {
  return [
    {
      id: "free",
      name: t('plans.free.name'),
      description: t('plans.free.description'),
      price: {
        primaryText: t('plans.free.price.primary'),
        secondaryText: t('plans.free.price.secondary')
      },
      items: [
        { 
          primaryText: t('plans.free.features.consultations.primary'),
          secondaryText: t('plans.free.features.consultations.secondary')
        },
        {
          primaryText: t('plans.free.features.support.primary'),
          secondaryText: t('plans.free.features.support.secondary')
        },
        {
          primaryText: t('plans.free.features.basic.primary'),
          secondaryText: t('plans.free.features.basic.secondary')
        }
      ]
    },
    {
      id: "pro",
      name: t('plans.pro.name'),
      description: t('plans.pro.description'),
      recommendText: t('plans.pro.recommend'),
      price: {
        primaryText: t('plans.pro.price.primary'),
        secondaryText: t('plans.pro.price.secondary')
      },
      items: [
        { 
          primaryText: t('plans.pro.features.consultations.primary'),
          secondaryText: t('plans.pro.features.consultations.secondary')
        },
        {
          primaryText: t('plans.pro.features.support.primary'),
          secondaryText: t('plans.pro.features.support.secondary')
        },
        {
          primaryText: t('plans.pro.features.priority.primary'),
          secondaryText: t('plans.pro.features.priority.secondary')
        }
      ]
    }
  ];
}

export default function PricingPage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const staticProducts = getStaticProducts(t);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-[3rem] lg:text-[4.5rem] font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-tr from-orange-600 to-orange-400 bg-clip-text text-transparent">
              {t('plans.title')}
            </span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            {t('plans.description')}
          </p>
          {session && (
            <p className="text-sm text-zinc-500 mt-4">
              {t('plans.currentUser')}: {session.user?.email}
            </p>
          )}
        </div>

        <div className="bg-white rounded-[20px] shadow-xl p-8 border border-zinc-200">
          {/* Use static component for unauthenticated users to avoid API calls */}
          {session ? (
            <PricingTable />
          ) : (
            <StaticPricingTable products={staticProducts} />
          )}
        </div>
      </div>
    </div>
  );
}