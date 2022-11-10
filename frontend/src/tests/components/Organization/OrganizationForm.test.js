import { render, waitFor, fireEvent } from "@testing-library/react";
import OrganizationForm from "main/components/Organization/OrganizationForm";
import { organizationFixtures } from "fixtures/organizationFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("OrganizationForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <OrganizationForm />
            </Router>
        );
        await waitFor(() => expect(getByText(/Org Code/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
    });


    test("renders correctly when passing in an Organization ", async () => {

        const { getByText, getByTestId } = render(
            <Router  >
                <OrganizationForm initialOrg={organizationFixtures.oneOrganization}  buttonLabel={"Update"} />
            </Router>
        );
        await waitFor(() => expect(getByTestId(/OrganizationForm-orgCode/)).toBeInTheDocument());
        expect(getByText(/Org Code/)).toBeInTheDocument();
        await waitFor( () => expect(getByTestId(/OrganizationForm-orgCode/)).toHaveValue("test1") );
    });


    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <OrganizationForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("OrganizationForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("OrganizationForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


