import {  render, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestsIndexPage from "main/pages/HelpRequests/HelpRequestsIndexPage";


import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { HelpRequestsFixtures } from "fixtures/HelpRequestsFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("HelpRequestsIndexPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "HelpRequestsTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        };

        const setupAdminUser = () => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/helprequests/all").reply(200, []);
    
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
            );
    
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/helprequests/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders three dates without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/helprequests/all").reply(200, HelpRequestsFixtures.threeHelpRequests);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/helprequests/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("test what happens when you click edit, admin", async () => {
        setupAdminUser();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/helprequests/all").reply(200, HelpRequestsFixtures.threeHelpRequests);


        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

       expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); 


        const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
       
        fireEvent.click(editButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/helpRequests/edit/1'));

    });


});


