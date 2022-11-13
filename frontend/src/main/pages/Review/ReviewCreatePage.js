import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ReviewForm from "main/components/Review/ReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ReviewCreatePage() {

  const objectToAxiosParams = (review) => ({
    url: "/api/reviews/post",
    method: "POST",
    params: {
      itemId: review.itemID,
      reviewerEmail: review.reviewerEmail,
      stars: review.stars,
      dateReviewed: review.dateReviewed,
      comments: review.comments
    }
  });

  const onSuccess = (review) => {
    toast(`New review Created - id: ${review.id}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/reviews/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/review/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Review</h1>

        <ReviewForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}