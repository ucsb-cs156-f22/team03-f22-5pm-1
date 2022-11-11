import { render, waitFor, fireEvent } from "@testing-library/react";
import HelpRequestsForm from "main/components/HelpRequests/HelpRequestsForm";
import { HelpRequestsFixtures } from "fixtures/HelpRequestsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestsForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <HelpRequestsForm />
            </Router>
        );
        await waitFor(() => expect(getByText(/Email/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
    });


    test("renders correctly when passing in a HelpRequests ", async () => {

        const { getByText, getByTestId } = render(
            <Router  >
                <HelpRequestsForm initialHelpRequests={HelpRequestsFixtures.oneHelpRequests} />
            </Router>
        );
        await waitFor(() => expect(getByTestId(/HelpRequestsForm-id/)).toBeInTheDocument());
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/HelpRequestsForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <HelpRequestsForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("HelpRequestsForm-requesterEmail")).toBeInTheDocument());
        const requestTimeField = getByTestId("HelpRequestsForm-requestTime");
        const submitButton = getByTestId("HelpRequestsForm-submit");

        fireEvent.change(requestTimeField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/requesterEmail is required./)).toBeInTheDocument());
        expect(getByText(/requestTime must be in ISO format, e.g. 2022-01-02T15:30/)).toBeInTheDocument();
        expect(getByText(/explanation is required./)).toBeInTheDocument();
        expect(getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();
        expect(getByText(/teamId is required./)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <HelpRequestsForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("HelpRequestsForm-submit")).toBeInTheDocument());
        const submitButton = getByTestId("HelpRequestsForm-submit");

        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/requestTime is required./)).toBeInTheDocument());
        expect(getByText(/requesterEmail is required./)).toBeInTheDocument();
        expect(getByText(/explanation is required./)).toBeInTheDocument();
        expect(getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();
        expect(getByText(/teamId is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText } = render(
            <Router  >
                <HelpRequestsForm submitAction={mockSubmitAction} />
            </Router>
        );
        await waitFor(() => expect(getByTestId("HelpRequestsForm-requesterEmail")).toBeInTheDocument());

        const requesterEmailField = getByTestId("HelpRequestsForm-requesterEmail");
        const teamIdField = getByTestId("HelpRequestsForm-teamId");
        const tableOrBreakoutRoomField = getByTestId("HelpRequestsForm-tableOrBreakoutRoom");
        const explanationField = getByTestId("HelpRequestsForm-explanation");
        const requestTimeField = getByTestId("HelpRequestsForm-requestTime");
        const submitButton = getByTestId("HelpRequestsForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'batman2022@gmail.com' } });
        fireEvent.change(teamIdField, { target: { value: 'Teambat' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: 'Breakoutroom' } });
        fireEvent.change(explanationField, { target: { value: 'This is some explanation.' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/requestTime is required./)).not.toBeInTheDocument();
        expect(queryByText(/requesterEmail is required./)).not.toBeInTheDocument();
        expect(queryByText(/tableOrBreakoutRoom is required./)).not.toBeInTheDocument();
        expect(queryByText(/explanation is required./)).not.toBeInTheDocument();
        expect(queryByText(/teamId is required./)).not.toBeInTheDocument();
    });


    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <HelpRequestsForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("HelpRequestsForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("HelpRequestsForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


