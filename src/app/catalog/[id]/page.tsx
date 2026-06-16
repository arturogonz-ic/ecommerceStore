import CatalogProductPage from './CatalogProductPage';

export function generateStaticParams() {
  return [];
}
export const dynamicParams = false;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CatalogProductPage params={params} />;
}
