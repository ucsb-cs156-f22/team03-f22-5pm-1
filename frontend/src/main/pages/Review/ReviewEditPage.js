import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ReviewForm from "main/components/Review/ReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ReviewEditPage() {
  let { id } = useParams();

  const { data: review, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/reviews?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/reviews`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (review) => ({
    url: "/api/reviews",
    method: "PUT",
    params: {
      id: review.id,
    },
    data: {
      itemID: review.itemID,
      reviewerEmail: review.reviewerEmail,
      stars: review.stars,
      dateReviewed: review.dateReviewed,
      comments: review.comments
    }
  });

  const onSuccess = (review) => {
    toast(`Review Updated - id: ${review.id}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/reviews?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/reviews/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Review</h1>
        {review &&
          <ReviewForm initialReview={review} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

