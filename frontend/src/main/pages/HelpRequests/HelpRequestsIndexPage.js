import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackend } from 'main/utils/useBackend'; // use prefix indicates a React Hook
import HelpRequestsTable from 'main/components/HelpRequests/HelpRequestsTable';
import { useCurrentUser } from 'main/utils/currentUser' // use prefix indicates a React Hook

export default function HelpRequestsIndexPage() {

  const currentUser = useCurrentUser();

  const { data: helprequests, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/ucsbhelprequest/all"],
            // Stryker disable next-line StringLiteral,ObjectLiteral : since "GET" is default, "" is an equivalent mutation
            { method: "GET", url: "/api/ucsbhelprequest/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>HelpRequests</h1>
        <HelpRequestsTable helprequests={helprequests} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}