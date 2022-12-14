import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { onDeleteSuccess } from "main/utils/UCSBDateUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/recommendations",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}

export default function RecommendationTable({ recommendation, currentUser }) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/recommendation/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/recommendations/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'Id',
            accessor: 'id', 
        },
        {
            Header: 'Requester Email',
            accessor: 'requesterEmail',
        },
        {
            Header: 'Professor Email',
            accessor: 'professorEmail',
        },
        {
            Header: 'Explanation',
            accessor: 'explanation',
        },
        {
            Header: 'Date Requested',
            accessor: 'dateRequested',
        },
        {
            Header: 'Date Needed',
            accessor: 'dateNeeded',
        },
        {
            Header: 'Done?',
            id: 'done', // needed for tests
            accessor: (row, _rowIndex) => String(row.done) // hack needed for boolean values to show up
        }
    ];

    const testid = "RecommendationTable";

    const columnsIfAdmin = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, testid),
        ButtonColumn("Delete", "danger", deleteCallback, testid),
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={recommendation}
        columns={columnsToDisplay}
        testid={testid}
    />;
};