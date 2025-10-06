import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  category: string;
  page: string;
}

export function Breadcrumbs({ category, page }: BreadcrumbsProps) {
  const formatLabel = (str: string) => {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
      <span className="font-medium capitalize">{category}</span>
      <ChevronRight className="w-4 h-4" />
      <span>{formatLabel(page)}</span>
    </div>
  );
}
