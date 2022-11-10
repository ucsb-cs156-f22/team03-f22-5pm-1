import OurTable, { ButtonColumn} from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import {  onDeleteSuccess } from "main/utils/UCSBDateUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/organization",
        method: "DELETE",
        params: {
            code: cell.row.values.code
        }
    }
}

export default function OrganizationTable({ organization, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/organization/edit/${cell.row.values.code}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/organization/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'Org Code',
            accessor: 'orgCode', 
        },
        {
            Header: 'Org Translation Short',
            accessor: 'orgTranslationShort',
        },
        {
            Header: 'Org Translation ',
            accessor: 'orgTranslation',
        },
        {
            Header: 'Inactive?',
            id: 'inactive', // needed for tests
            accessor: (row, _rowIndex) => String(row.inactive) // hack needed for boolean values to show up
        },
    ];

    const testid = "OrganizationTable";

    const columnsIfAdmin = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, testid),
        ButtonColumn("Delete", "danger", deleteCallback, testid)
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={organization}
        columns={columnsToDisplay}
        testid={testid}
    />;
};