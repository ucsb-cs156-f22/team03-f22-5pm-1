import { render, waitFor, fireEvent } from "@testing-library/react";
import RecommendationForm from "main/components/Recommendation/RecommendationForm";
import { recommendationFixtures } from "fixtures/recommendationFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("RecommendationForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <RecommendationForm />
            </Router>
        );
        await waitFor(() => expect(getByText(/Requester Email/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
    });


    test("renders correctly when passing in a Recommendation ", async () => {

        const { getByText, getByTestId } = render(
            <Router  >
                <RecommendationForm initialRecommendation={recommendationFixtures.oneRecommendation}  buttonLabel={"Update"} />
            </Router>
        );
        await waitFor(() => expect(getByTestId(/RecommendationForm-id/)).toBeInTheDocument());
        expect(getByText(/Id/)).toBeInTheDocument();
        await waitFor( () => expect(getByTestId(/RecommendationForm-id/)).toHaveValue("1") );
    });


    test("Correct Error messsages when dates are wrong format", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <RecommendationForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("RecommendationForm-dateRequested")).toBeInTheDocument());

        const dateRequestedField = getByTestId("RecommendationForm-dateRequested");
        const dateNeededField = getByTestId("RecommendationForm-dateNeeded");
        const submitButton = getByTestId("RecommendationForm-submit");

        fireEvent.change(dateRequestedField, { target: { value: "a" } });
        fireEvent.change(dateNeededField, { target: { value: "b" } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/Date requested must be in ISO format, e.g. 2022-01-02T15:30/)).toBeInTheDocument());
        expect(getByText(/Date needed must be in ISO format, e.g. 2022-01-02T15:30/)).toBeInTheDocument();
    });

    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <RecommendationForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("RecommendationForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("RecommendationForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


