import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ArticleForm from "main/components/Article/ArticleForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ArticleEditPage() {
  let { title } = useParams();

  const { data: article, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/article?title=${title}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/article`,
        params: {
          title
        }
      }
    );


  const objectToAxiosPutParams = (article) => ({
    url: "/api/article",
    method: "PUT",
    params: {
      title: article.title,
    },
    data: {
      url: article.url,
      hasDiningCam: article.hasDiningCam,
      explanation: article.explanation,
      email: article.email,
      dateAdded: article.dateAdded,
    }
  });

  const onSuccess = (article) => {
    toast(`Article Updated - title: ${article.title} url: ${article.url}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/article?title=${title}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/article/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Article</h1>
        {article &&
          <ArticleForm initialArticle={article} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

