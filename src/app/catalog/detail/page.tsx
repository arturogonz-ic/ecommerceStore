import { Suspense } from 'react';
import CatalogProductPage from './CatalogProductPage';

export default function Page() {
  return (
    <Suspense>
      <CatalogProductPage />
    </Suspense>
  );
}
