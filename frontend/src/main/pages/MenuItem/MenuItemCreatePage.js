import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemForm from "main/components/MenuItem/MenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemCreatePage() {

    const objectToAxiosParams = (menuitem) => ({
        url: "/api/ucsbdiningcommonsmenu/post",
        method: "POST",
        params: {
            diningCommonsCode: menuitem.diningCommonsCode,
            name: menuitem.name,
            station: menuitem.station,
        }
    });

    const onSuccess = (menuitem) => {
        toast(`New MenuItem Request Created - id: ${menuitem.id} diningcommonscode: ${menuitem.diningCommonsCode}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/ucsbdiningcommonsmenu/all"]
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
            <h1>Create New MenuItem Request</h1>
            
            <MenuItemForm submitAction={onSubmit} />    
            </div>
        </BasicLayout>
    )
}




