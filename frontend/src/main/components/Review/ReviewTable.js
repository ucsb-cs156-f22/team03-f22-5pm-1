import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/ReviewUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function ReviewTable({ reviews, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/review/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/reviews/all"]
    );
    // Stryker enable all 

    //Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }
    
    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'itemID',
            accessor: 'itemId',
        },
        {
            Header: 'reviewerEmail',
            accessor: 'reviewerEmail',
        },
        {
            Header: 'stars',
            accessor: 'stars',
        },
        {
            Header: 'dateReviewed',
            accessor: 'dateReviewed',
        },
        {
            Header: 'comments',
            accessor: 'comments',
        } 
    ];

    const columnsIfAdmin = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, "ReviewTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "ReviewTable")
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={reviews}
        columns={columnsToDisplay}
        testid={"ReviewTable"}
    />;
};