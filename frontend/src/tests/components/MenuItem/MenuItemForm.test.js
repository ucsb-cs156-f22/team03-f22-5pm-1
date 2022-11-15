import { render, waitFor, fireEvent } from "@testing-library/react";
import MenuItemForm from "main/components/MenuItem/MenuItemForm";
import { MenuItemFixtures } from "fixtures/MenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("MenuItemForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <MenuItemForm />
            </Router>
        );
        await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
    });


    test("renders correctly when passing in a MenuItem ", async () => {

        const { getByText, getByTestId } = render(
            <Router  >
                <MenuItemForm initialMenuItem={MenuItemFixtures.oneMenuItem} />
            </Router>
        );
        await waitFor(() => expect(getByTestId(/MenuItemForm-id/)).toBeInTheDocument());
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/MenuItemForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <MenuItemForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("MenuItemForm-diningCommonsCode")).toBeInTheDocument());
        const NameField = getByTestId("MenuItemForm-name");
        const submitButton = getByTestId("MenuItemForm-submit");

        fireEvent.change(NameField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/diningCommonsCode is required./)).toBeInTheDocument());
        expect(getByText(/station is required./)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <MenuItemForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("MenuItemForm-submit")).toBeInTheDocument());
        const submitButton = getByTestId("MenuItemForm-submit");

        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/diningCommonsCode is required./)).toBeInTheDocument());
        expect(getByText(/name is required./)).toBeInTheDocument();
        expect(getByText(/station is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText } = render(
            <Router  >
                <MenuItemForm submitAction={mockSubmitAction} />
            </Router>
        );
        await waitFor(() => expect(getByTestId("MenuItemForm-diningCommonsCode")).toBeInTheDocument());

        const diningCommonsCodeField = getByTestId("MenuItemForm-diningCommonsCode");
        const NameField = getByTestId("MenuItemForm-name");
        const stationField = getByTestId("MenuItemForm-station");
        const submitButton = getByTestId("MenuItemForm-submit");

        fireEvent.change(diningCommonsCodeField, { target: { value: 'ortega' } });
        fireEvent.change(NameField, { target: { value: 'Chicken Caesar Salad' } });
        fireEvent.change(stationField, { target: { value: 'Entrees' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/diningCommonsCode is required./)).not.toBeInTheDocument();
        expect(queryByText(/name is required./)).not.toBeInTheDocument();
        expect(queryByText(/station is required./)).not.toBeInTheDocument();
    });


    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <MenuItemForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("MenuItemForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("MenuItemForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});