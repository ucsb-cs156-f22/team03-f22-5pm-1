import OurTable, { ButtonColumn} from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import {  onDeleteSuccess } from "main/utils/UCSBDateUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

// Delete Function

export default function ArticleTable({ article, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/article/edit/${cell.row.values.url}`)
    }
    
    // Stryker Delete Test

    const columns = [
        {
            Header: 'Title',
            accessor: 'title', 
        },
        {
            Header: 'URL',
            accessor: 'url',
        },
        {
            Header: 'Explanation',
            accessor: 'explanation',
        },
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Date Added',
            accessor: 'dateAdded',
        }
    ];

    const testid = "ArticleTable";

    const columnsIfAdmin = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, testid),
        // Button Column 
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={article}
        columns={columnsToDisplay}
        testid={testid}
    />;
};