import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import HelpRequestsForm from "main/components/HelpRequests/HelpRequestsForm";

export default function HelpRequestsEditPage() {
  let { id } = useParams();

  const { data: helprequests, _error, _status } =
  useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/helprequests?id=${id}`],
    {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsbhelprequest`,
      params: {
        id
      }
    }
  );

  const objectToAxiosPutParams = (helprequests) => ({
    url: "/api/ucsbhelprequest",
    method: "PUT",
    params: {
      id: helprequests.id,
    },
    data: {
      requesterEmail: helprequests.requesterEmail,
      teamId: helprequests.teamId,
      tableOrBreakoutRoom: helprequests.tableOrBreakoutRoom,
      explanation: helprequests.explanation,
      solved: helprequests.solved,
      requestTime: helprequests.requestTime,
    }
  });

  const onSuccess = (helprequests) => {
    toast(`HelpRequests Updated - id: ${helprequests.id} teamId: ${helprequests.teamId}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess},
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbhelprequest?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/helprequest/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit HelpRequests</h1>
        {helprequests &&
          <HelpRequestsForm initialHelpRequests={helprequests} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}