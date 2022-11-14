import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ArticleForm from "main/components/Article/ArticleForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ArticleCreatePage() {

  const objectToAxiosParams = (article) => ({
    url: "/api/article/post",
    method: "POST",
    params: {
      title: article.title,
      url: article.url,
      explanation: article.explanation,
      email: article.email,
      dateAdded: article.dateAdded,
    }
  });

  const onSuccess = (article) => {
    toast(`New Article Created - title: ${article.title} url: ${article.url}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/article/all"]
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
        <h1>Create New Article</h1>

        <ArticleForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}