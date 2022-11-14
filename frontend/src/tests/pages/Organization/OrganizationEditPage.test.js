import {  fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import OrganizationEditPage from "main/pages/Organization/OrganizationEditPage";

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
        useParams: () => ({
            code: "test1"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("OrganizationEditPage tests", () => {

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/organization", { params: { code: "test1" } }).reply(200, {  
                orgCode: "test1",
                orgTranslationShort: "test1",
                orgTranslation: "test1",
                inactive: false
            });
            axiosMock.onPut('/api/organization').reply(200, {
                orgCode: "test1",
                orgTranslationShort: "test1",
                orgTranslation: "test1",
                inactive: false
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <OrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <OrganizationEditPage  />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("OrganizationForm-orgCode")).toBeInTheDocument());

            const orgCodeField = getByTestId("OrganizationForm-orgCode");
            const orgTranslationShortField = getByTestId("OrganizationForm-orgTranslationShort");
            const orgTranslationField = getByTestId("OrganizationForm-orgTranslation");

            expect(orgCodeField).toHaveValue("test1");
            expect(orgTranslationShortField).toHaveValue("test1");
            expect(orgTranslationField).toHaveValue("test1");
        });

        test("Changes when you click Update", async () => {

            const { getByTestId, getByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <OrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("OrganizationForm-orgCode")).toBeInTheDocument());

            const orgCodeField = getByTestId("OrganizationForm-orgCode");
            const orgTranslationShortField = getByTestId("OrganizationForm-orgTranslationShort");
            const orgTranslationField = getByTestId("OrganizationForm-orgTranslation");

            expect(orgCodeField).toHaveValue("test1");
            expect(orgTranslationShortField).toHaveValue("test1");
            expect(orgTranslationField).toHaveValue("test1");
           
            const submitButton = getByText("Update");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(orgTranslationShortField, { target: { value: 'test123' } })
            fireEvent.change(orgTranslationField, { target: { value: "test123" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Organization Updated - orgCode: test1");
            expect(mockNavigate).toBeCalledWith({ "to": "/organization/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "test1" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgTranslationShort: "test123",
                orgTranslation: "test123",
                inactive: false
            })); // posted object

        });

       
    });
});


