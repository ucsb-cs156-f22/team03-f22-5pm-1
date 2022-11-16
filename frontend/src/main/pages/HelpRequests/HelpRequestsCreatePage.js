import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestsForm from "main/components/HelpRequests/HelpRequestsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestsCreatePage() {

  const objectToAxiosParams = (helprequests) => ({
    url: "/api/ucsbhelprequest/post",
    method: "POST",
    params:{
      requesterEmail: helprequests.requesterEmail,
      teamId: helprequests.teamId,
      tableOrBreakoutRoom: helprequests.tableOrBreakoutRoom,
      explanation: helprequests.explanation,
      solved: helprequests.solved,
      requestTime: helprequests.requestTime,
    }
  });

  const onSuccess = (helprequests) => {
    toast(`New helpRequest Created - id: ${helprequests.id} teamId: ${helprequests.teamId}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/ucsbhelprequest/all"]
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
        <h1>Create New Help Requests</h1>
        
        <HelpRequestsForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}