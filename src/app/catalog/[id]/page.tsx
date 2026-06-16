import React from 'react';
import CatalogProductPage from './CatalogProductPage';

export function generateStaticParams() {
  return [];
}
export const dynamicParams = false;

type Props = { params: Promise<{ id: string }> };

export default function Page(props: Props) {
  return React.createElement(
    CatalogProductPage as React.ComponentType<Props>,
    props
  );
}
