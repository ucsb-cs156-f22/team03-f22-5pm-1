import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import OrganizationForm from "main/components/Organization/OrganizationForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function OrganizationCreatePage() {
  const objectToAxiosParams = (organization) => ({
    url: "/api/ucsborganization/post",
    method: "POST",
    params: {
      orgCode: organization.orgCode,
      orgTranslationShort: organization.orgTranslationShort,
      orgTranslation: organization.orgTranslation,
      inactive: organization.inactive,
    }
  });

  const onSuccess = (organization) => {
    toast(`New Organization Created - orgCode: ${organization.orgCode}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/ucsborganization/all"]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/ucsborganization/list" />
  }


  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create Organization</h1>
          <OrganizationForm submitAction={onSubmit} buttonLabel="Create" />
      </div>
    </BasicLayout>
  )
}