import React from 'react';

export interface LayoutContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}
