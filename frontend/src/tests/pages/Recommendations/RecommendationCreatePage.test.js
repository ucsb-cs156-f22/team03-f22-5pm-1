import { render, waitFor, fireEvent } from "@testing-library/react";
import RecommendationCreatePage from "main/pages/Recommendation/RecommendationCreatePage";
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


describe("RecommendationCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

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
                    <RecommendationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();

        const recommendation = {
            "id": 17,
            "requesterEmail": "requester@mail.com",
            "professorEmail": "professor@mail.com",
            "explanation": "test post",
            "dateRequested": "2022-10-10T00:00:00",
            "dateNeeded": "2022-10-11T00:00:00",
            "done": true,
          };
        
    
        axiosMock.onPost("/api/recommendations/post").reply( 202, recommendation );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationCreatePage />
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

        const submitButton = getByTestId("RecommendationForm-submit");

        fireEvent.change(reqField, { target: { value: 'requester@mail.com' } });
        fireEvent.change(profField, { target: { value: 'professor@mail.com' } });
        fireEvent.change(explanationField, { target: { value: 'test post' } });
        fireEvent.change(dateRequestedField, { target: { value: '2022-10-10T00:00:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2022-10-11T00:00:00' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            "requesterEmail": "requester@mail.com",
            "professorEmail": "professor@mail.com",
            "explanation": "test post",
            "dateRequested": "2022-10-10T00:00:00",
            "dateNeeded": "2022-10-11T00:00:00",
            "done": false,
        });

        expect(mockToast).toBeCalledWith("New Recommendation Request Created - id: 17 requester email: requester@mail.com");
        expect(mockNavigate).toBeCalledWith({ "to": "/recommendation/list" });
    });

});


