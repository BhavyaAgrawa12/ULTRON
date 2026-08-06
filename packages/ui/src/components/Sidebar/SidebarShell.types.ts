import React from 'react';

export interface SidebarShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  isCollapsed?: boolean;
}
