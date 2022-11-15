import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import OrganizationForm from "main/components/Organization/OrganizationForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
export default function OrganizationEditPage() {
  let { code } = useParams();

  const { data: organization, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/ucsborganization?orgCode=${code}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/ucsborganization`,
        params: {
          code
        }
      }
    );


  const objectToAxiosPutParams = (organization) => ({
    url: "/api/ucsborganization",
    method: "PUT",
    params: {
      code: organization.orgCode,
    },
    data: {
      orgTranslationShort: organization.orgTranslationShort,
      orgTranslation: organization.orgTranslation,
      inactive: organization.inactive
    }
  });

  const onSuccess = (organization) => {
    toast(`Organization Updated - orgCode: ${organization.orgCode}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsborganization?code=${code}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/ucsborganization/list" />
  }

  //console.log("CHECK THIS OUT ", organization);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Organization</h1>
        {organization &&
          <OrganizationForm initialOrg={organization} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}