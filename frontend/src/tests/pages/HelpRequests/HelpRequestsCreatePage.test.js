import { render, waitFor, fireEvent } from "@testing-library/react";
import HelpRequestsCreatePage from "main/pages/HelpRequests/HelpRequestsCreatePage";
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

describe("HelpRequestsCreatePage tests", () => {

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
                    <HelpRequestsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const helprequests = {
            id: 17,
            requesterEmail: "Request Email",
            teamId: "Dog",
            tableOrBreakoutRoom: "table",
            explanation: "Here is some explanation",
            solved: true,
            requestTime: "2022-02-02T00:00"
        };

        axiosMock.onPost("/api/helprequests/post").reply( 202, helprequests );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("HelpRequestsForm-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmailField = getByTestId("HelpRequestsForm-requesterEmail");
        const teamIdField = getByTestId("HelpRequestsForm-teamId");
        const tableOrBreakoutRoomField = getByTestId("HelpRequestsForm-tableOrBreakoutRoom");
        const explanationField = getByTestId("HelpRequestsForm-explanation");
        const requestTimeField = getByTestId("HelpRequestsForm-requestTime");
        const submitButton = getByTestId("HelpRequestsForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'Request Email' } });
        fireEvent.change(teamIdField, { target: { value: 'Dog' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: 'table' } });
        fireEvent.change(explanationField, { target: { value: 'Here is some explanation' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-02-02T00:00' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "requesterEmail": "Request Email",
            "teamId": "Dog",
            "tableOrBreakoutRoom": "table",
            "explanation": "Here is some explanation",
            "solved": false,
            "requestTime": "2022-02-02T00:00"
        });

        expect(mockToast).toBeCalledWith("New helpRequest Created - id: 17 teamId: Dog");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequests/list" });
    });


});


