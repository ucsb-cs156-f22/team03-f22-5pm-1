import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestsEditPage from "main/pages/HelpRequests/HelpRequestsEditPage";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestsEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {

        const restoreConsole = mockConsole();

        const {getByText, queryByTestId} = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(() => expect(getByText("Edit HelpRequests")).toBeInTheDocument());
        expect(queryByTestId("HelpRequestsForm-requesterEmail")).not.toBeInTheDocument();
        restoreConsole();
    });
});



describe("tests where backend is working normally", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
            id: 17,
            requesterEmail: "Request Email",
            teamId: "Dog",
            tableOrBreakoutRoom: "table",
            explanation: "Here is some explanation",
            solved: true,
            requestTime: "2022-02-02T00:00"
        });
        axiosMock.onPut('/api/helprequests').reply(200, {
            id: "17",
            requesterEmail: "Request newEmail",
            teamId: "cat",
            tableOrBreakoutRoom: "breakoutroom",
            explanation: "Here is no explanation",
            solved: false,
            requestTime: "2022-07-07T00:00"
        });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("Is populated with the data provided", async () => {

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(getByTestId("HelpRequestsForm-requesterEmail")).toBeInTheDocument());

        const requesterEmailField = getByTestId("HelpRequestsForm-requesterEmail");
        const teamIdField = getByTestId("HelpRequestsForm-teamId");
        const tableOrBreakoutRoomField = getByTestId("HelpRequestsForm-tableOrBreakoutRoom");
        const explanationField = getByTestId("HelpRequestsForm-explanation");
        const requestTimeField = getByTestId("HelpRequestsForm-requestTime");

        expect(requesterEmailField).toHaveValue("Request Email");
        expect(teamIdField).toHaveValue("Dog");
        expect(tableOrBreakoutRoomField).toHaveValue("table");
        expect(explanationField).toHaveValue("Here is some explanation");
        expect(requestTimeField).toHaveValue("2022-02-02T00:00");
    });

    test("Changes when you click Update", async () => {

        const { getByTestId, getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(getByTestId("HelpRequestsForm-requesterEmail")).toBeInTheDocument());

        const idField = getByTestId("HelpRequestsForm-id");
        const requesterEmailField = getByTestId("HelpRequestsForm-requesterEmail");
        const teamIdField = getByTestId("HelpRequestsForm-teamId");
        const tableOrBreakoutRoomField = getByTestId("HelpRequestsForm-tableOrBreakoutRoom");
        const explanationField = getByTestId("HelpRequestsForm-explanation");
        const requestTimeField = getByTestId("HelpRequestsForm-requestTime");
        const solvedField = getByTestId("HelpRequestsForm-solved")

        expect(idField).toHaveValue("17");
        expect(requesterEmailField).toHaveValue("Request Email");
        expect(teamIdField).toHaveValue("Dog");
        expect(tableOrBreakoutRoomField).toHaveValue("table");
        expect(explanationField).toHaveValue("Here is some explanation");
        expect(requestTimeField).toHaveValue("2022-02-02T00:00");
    
        const submitButton = getByText("Update");
        expect(submitButton).toBeInTheDocument();

        fireEvent.change(requesterEmailField, { target: { value: 'Request newEmail' } })
        fireEvent.change(teamIdField, { target: { value: 'cat' } })
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: "breakoutroom" } })
        fireEvent.change(explanationField, { target: { value: "Here is no explanation" } })
        fireEvent.click(solvedField);
        fireEvent.change(requestTimeField, { target: { value: "2022-07-07T00:00" } })
        

        fireEvent.click(submitButton);

        await waitFor(() => expect(mockToast).toBeCalled);
        expect(mockToast).toBeCalledWith("HelpRequests Updated - id: 17 teamId: cat");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequests/list" });

        expect(axiosMock.history.put.length).toBe(1); // times called
        expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
        expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
            requesterEmail: 'Request newEmail',
            teamId: "cat",
            tableOrBreakoutRoom: "breakoutroom",
            explanation: "Here is no explanation",
            solved: false,
            requestTime: "2022-07-07T00:00"
        })); // posted object

    });
    });
});




