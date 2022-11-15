import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemForm from "main/components/MenuItem/MenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemEditPage() {

  let { id } = useParams();

  const { data: menuitem, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/ucsbdiningcommonsmenu?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/ucsbdiningcommonsmenu`,
        params: {
          id
        }
      }
  );

  const objectToAxiosPutParams = (menuitem) => ({
    url: "/api/ucsbdiningcommonsmenu",
    method: "PUT",
    params: {
      id: menuitem.id,
    },
    data: {
      diningCommonsCode: menuitem.diningCommonsCode,
      name: menuitem.name,
      station: menuitem.station,
    }
  });

  const onSuccess = (menuitem) => {
    toast(`MenuItem Request Updated - id: ${menuitem.id} diningcommonscode: ${menuitem.diningCommonsCode}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbdiningcommonsmenu?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/menuitem/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit MenuItem Request</h1>
        
        {menuitem &&
          <MenuItemForm initialMenuItem={menuitem} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}