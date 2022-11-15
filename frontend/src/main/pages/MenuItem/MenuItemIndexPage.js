import React from 'react'
import { useBackend } from 'main/utils/useBackend'; // use prefix indicates a React Hook

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemTable from 'main/components/MenuItem/MenuItemTable';
import { useCurrentUser } from 'main/utils/currentUser' // use prefix indicates a React Hook

export default function MenuItemIndexPage() {

  const currentUser = useCurrentUser();

  const { data: menuitem, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/ucsbdiningcommonsmenu/all"],
            // Stryker disable next-line StringLiteral,ObjectLiteral : since "GET" is default, "" is an equivalent mutation
            { method: "GET", url: "/api/ucsbdiningcommonsmenu/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>MenuItem Requests</h1>
        <MenuItemTable menuitem={menuitem} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}