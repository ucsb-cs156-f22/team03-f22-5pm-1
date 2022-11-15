import React from 'react'
import { useBackend } from 'main/utils/useBackend'; // use prefix indicates a React Hook

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import OrganizationTable from 'main/components/Organization/OrganizationTable';
import { useCurrentUser } from 'main/utils/currentUser' // use prefix indicates a React Hook

export default function OrganizationIndexPage() {


  const currentUser = useCurrentUser();

  const { data: organization, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/organization/all"],
            // Stryker disable next-line StringLiteral,ObjectLiteral : since "GET" is default, "" is an equivalent mutation
            { method: "GET", url: "/api/organization/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Organizations</h1>

        <OrganizationTable organization={organization} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}