import { render, waitFor, fireEvent  } from "@testing-library/react";
import OrganizationCreatePage from "main/pages/Organization/OrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("OrganizationCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <OrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();

        const organization = {
            "orgCode": "test1",
            "orgTranslationShort": "test1",
            "orgTranslation": "test1",
            "inactive": false
          };
        
    
        axiosMock.onPost("/api/ucsborganization/post").reply( 202, organization );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <OrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("OrganizationForm-orgCode")).toBeInTheDocument();
        });

        const orgCodeField = getByTestId("OrganizationForm-orgCode");
        const orgTranslationShortField = getByTestId("OrganizationForm-orgTranslationShort");
        const orgTranslationField = getByTestId("OrganizationForm-orgTranslation");
        const inactiveField = getByTestId("OrganizationForm-inactive");

        const submitButton = getByTestId("OrganizationForm-submit");

        fireEvent.change(orgCodeField, { target: { value: 'test1' } });
        fireEvent.change(orgTranslationShortField, { target: { value: 'test1' } });
        fireEvent.change(orgTranslationField, { target: { value: 'test1' } });
        fireEvent.change(inactiveField, { target: { value: false } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            "orgCode": "test1",
            "orgTranslationShort": "test1",
            "orgTranslation": "test1",
            "inactive": false,
        });

        expect(mockToast).toBeCalledWith("New Organization Created - orgCode: test1");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization/list" });
    });


});


