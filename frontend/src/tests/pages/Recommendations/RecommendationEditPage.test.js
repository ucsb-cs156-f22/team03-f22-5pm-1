import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationEditPage from "main/pages/Recommendation/RecommendationEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import _mockConsole from "jest-mock-console";

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

describe("RecommendationEditPage tests", () => {

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendations", { params: { id: 17 } }).reply(200, {  
                id: 17,
                requesterEmail: "req@mail.com",
                professorEmail: "prof@mail.com",
                explanation: "original",
                dateRequested: "2022-10-09T00:00:00",
                dateNeeded: "2022-10-10T00:00:00",
                done: false
            });
            axiosMock.onPut('/api/recommendations').reply(200, {
                id: "17",
                requesterEmail: "newReq@mail.com",
                professorEmail: "newProf@mail.com",
                explanation: "new",
                dateRequested: "2022-10-10T00:00:00",
                dateNeeded: "2022-10-11T00:00:00",
                done: true
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(getByTestId("RecommendationForm-requesterEmail")).toBeInTheDocument();
            });
    
            const reqField = getByTestId("RecommendationForm-requesterEmail");
            const profField = getByTestId("RecommendationForm-professorEmail");
            const explanationField = getByTestId("RecommendationForm-explanation");
            const dateRequestedField = getByTestId("RecommendationForm-dateRequested");
            const dateNeededField = getByTestId("RecommendationForm-dateNeeded");

            expect(reqField).toHaveValue("req@mail.com");
            expect(profField).toHaveValue("prof@mail.com");
            expect(explanationField).toHaveValue("original");
            expect(dateRequestedField).toHaveValue("2022-10-09T00:00:00");
            expect(dateNeededField).toHaveValue("2022-10-10T00:00:00")
        });

        test("Changes when you click Update", async () => {

            const { getByTestId, getByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(getByTestId("RecommendationForm-requesterEmail")).toBeInTheDocument();
            });
    
            const reqField = getByTestId("RecommendationForm-requesterEmail");
            const profField = getByTestId("RecommendationForm-professorEmail");
            const explanationField = getByTestId("RecommendationForm-explanation");
            const dateRequestedField = getByTestId("RecommendationForm-dateRequested");
            const dateNeededField = getByTestId("RecommendationForm-dateNeeded");
            const doneField = getByTestId("RecommendationForm-done");

            expect(reqField).toHaveValue("req@mail.com");
            expect(profField).toHaveValue("prof@mail.com");
            expect(explanationField).toHaveValue("original");
            expect(dateRequestedField).toHaveValue("2022-10-09T00:00:00");
            expect(dateNeededField).toHaveValue("2022-10-10T00:00:00")
           
            const submitButton = getByText("Update");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(reqField, { target: { value: 'newReq@mail.com' } })
            fireEvent.change(profField, { target: { value: 'newProf@mail.com' } })
            fireEvent.change(explanationField, { target: { value: "new" } })
            fireEvent.change(dateRequestedField, { target: { value: "2022-10-10T00:00:00"  } })
            fireEvent.change(dateNeededField, { target: { value: "2022-10-11T00:00:00"  } })
            fireEvent.click(doneField)

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Recommendation Request Updated - id: 17 requester email: newReq@mail.com");
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendation/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "newReq@mail.com",
                professorEmail: "newProf@mail.com",
                explanation: "new",
                dateRequested: "2022-10-10T00:00:00",
                dateNeeded: "2022-10-11T00:00:00",
                done: true
            })); // posted object

        });

       
    });
});


