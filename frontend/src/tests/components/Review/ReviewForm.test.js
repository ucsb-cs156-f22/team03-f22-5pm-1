import { render, waitFor, fireEvent } from "@testing-library/react";
import ReviewForm from "main/components/Review/ReviewForm";
import { reviewsFixtures } from "fixtures/reviewsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ReviewForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <ReviewForm />
            </Router>
        );
        await waitFor(() => expect(getByText(/dateReviewed/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
    });


    test("renders correctly when passing in a Review ", async () => {

        const { getByText, getByTestId } = render(
            <Router  >
                <ReviewForm initialReview={reviewsFixtures.oneReview} />
            </Router>
        );
        await waitFor(() => expect(getByTestId(/ReviewForm-id/)).toBeInTheDocument());
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/ReviewForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <ReviewForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("ReviewForm-dateReviewed")).toBeInTheDocument());
        const dateReviewedField = getByTestId("ReviewForm-dateReviewed");
        const submitButton = getByTestId("ReviewForm-submit");

        fireEvent.change(dateReviewedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/dateReviewed must be in ISO format/)).toBeInTheDocument());
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <ReviewForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("ReviewForm-submit")).toBeInTheDocument());
        const submitButton = getByTestId("ReviewForm-submit");

        fireEvent.click(submitButton);

        await waitFor(() => 
        expect(getByText(/itemId is required./)).toBeInTheDocument());
        expect(getByText(/reviewerEmail is required./)).toBeInTheDocument();
        expect(getByText(/stars is required./)).toBeInTheDocument();
        expect(getByText(/dateReviewed is required./)).toBeInTheDocument();
        expect(getByText(/comments is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText } = render(
            <Router  >
                <ReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await waitFor(() => expect(getByTestId("ReviewForm-dateReviewed")).toBeInTheDocument());

        const dateReviewedField = getByTestId("ReviewForm-dateReviewed");
        const itemIdField = getByTestId("ReviewForm-itemId");
        const reviewerEmailField = getByTestId("ReviewForm-reviewerEmail");
        const starsField =  getByTestId("ReviewForm-stars");
        const commentsField =  getByTestId("ReviewForm-comments");
        const submitButton = getByTestId("ReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: '7' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'test@testing.edu' } });
        fireEvent.change(starsField, { target: { value: '5' } });
        fireEvent.change(commentsField, { target: { value: 'a comment is here' } });
        fireEvent.change(dateReviewedField, { target: { value: '2022-01-02T12:00' } });
        
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/dateReviewed must be in ISO format/)).not.toBeInTheDocument();

    });


    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <ReviewForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("ReviewForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("ReviewForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


