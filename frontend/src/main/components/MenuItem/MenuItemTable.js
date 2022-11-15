import OurTable, { ButtonColumn } from "main/components/OurTable";
// import { useBackendMutation } from "main/utils/useBackend";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function MenuItemTable({ menuitems, currentUser }) {

    
    const navigate = useNavigate();

    
    const editCallback = (cell) => {
        navigate(`/menuitem/edit/${cell.row.values.id}`)
    }
    
    
    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'DiningCommonsCode',
            accessor: 'diningCommonsCode',
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Station',
            accessor: 'station',
        },
        
    ];

    

    const columnsIfAdmin = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, "MenuItemTable")
        //ButtonColumn("Delete", "danger", deleteCallback, "MenuItemTable")
        
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={menuitems}
        columns={columnsToDisplay}
        testid={"MenuItemTable"}
    />;
};