import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import {  onDeleteSuccess } from "main/utils/UCSBDateUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export function cellToAxiosParamsDelete(cell){
    return {
        url: "/api/ucsbhelprequest",
        method: "DELETE",
        params:{
            id: cell.row.values.id
        }
    }
}



export default function HelpRequestsTable({ helprequests, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/helprequest/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsbhelprequest/all"]
    );
    // Stryker enable all 
    
    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'Id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Email',
            accessor: 'requesterEmail',
        },
        {
            Header: 'teamid',
            accessor: 'teamId',
        },
        {
            Header: 'table/breakoutroom',
            accessor: 'tableOrBreakoutRoom',
        },
        {
            Header: 'Explanation',
            accessor: 'explanation',
        },
        {
            Header: 'solve or not',
            id: 'solved', // needed for tests
            accessor: (row, _rowIndex) => String(row.solved) // hack needed for boolean values to show up
        },
        {
            Header: 'date',
            accessor: 'requestTime',
        }
    ];

    const columnsIfAdmin = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, "HelpRequestsTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "HelpRequestsTable")
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={helprequests}
        columns={columnsToDisplay}
        testid={"HelpRequestsTable"}
    />;
};