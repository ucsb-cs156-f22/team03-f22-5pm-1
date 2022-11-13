import OurTable, { ButtonColumn } from "main/components/OurTable";
//import { useBackendMutation } from "main/utils/useBackend";
//import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBDateUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function HelpRequestsTable({ helprequests, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/helpRequests/edit/${cell.row.values.id}`)
    }



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
    
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={helprequests}
        columns={columnsToDisplay}
        testid={"HelpRequestsTable"}
    />;
};