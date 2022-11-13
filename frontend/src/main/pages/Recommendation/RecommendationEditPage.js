import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationForm from "main/components/Recommendation/RecommendationForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationEditPage() {

  let { id } = useParams();

  const { data: recommendation, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/recommendation?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/recommendations`,
        params: {
          id
        }
      }
  );

  const objectToAxiosPutParams = (recommendation) => ({
    url: "/api/recommendations",
    method: "PUT",
    params: {
      id: recommendation.id,
    },
    data: {
      requesterEmail: recommendation.requesterEmail,
      professorEmail: recommendation.professorEmail,
      explanation: recommendation.explanation,
      dateRequested: recommendation.dateRequested,
      dateNeeded: recommendation.dateNeeded,
      done: recommendation.done,
    }
  });

  const onSuccess = (recommendation) => {
    toast(`Recommendation Request Updated - id: ${recommendation.id} requester email: ${recommendation.requesterEmail}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/recommendations?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/recommendation/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Recommendation Request</h1>
        
        {recommendation &&
          <RecommendationForm initialRecommendation={recommendation} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

