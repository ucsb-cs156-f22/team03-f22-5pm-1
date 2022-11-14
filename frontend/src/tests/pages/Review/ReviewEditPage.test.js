import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ReviewEditPage from "main/pages/Review/ReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
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

describe("ReviewEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/reviews", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await waitFor(() => expect(getByText("Edit Review")).toBeInTheDocument());
            expect(queryByTestId("ReviewForm-itemID")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/reviews", { params: { id: 17 } }).reply(200, {
                id: 17,
                itemID : '59',
                reviewerEmail: "boblee@ucsb.edu",
                stars: "0",
                dateReviewed: "2022-03-14T15:00",
                comments: "horrible"
            });
            axiosMock.onPut('/api/reviews').reply(200, {
                id: 17,
                itemID : '69',
                reviewerEmail: "correctemail@ucsb.edu",
                stars: "5",
                dateReviewed: "2022-12-25T08:00",
                comments: "great"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("ReviewForm-itemID")).toBeInTheDocument());

            const idField = getByTestId("ReviewForm-id");
            const itemIDField = getByTestId("ReviewForm-itemID");
            const reviewerEmailField = getByTestId("ReviewForm-reviewerEmail");
            const starsField = getByTestId("ReviewForm-stars");
            const dateReviewedField = getByTestId("ReviewForm-dateReviewed");
            const commentsField = getByTestId("ReviewForm-comments");

            expect(idField).toHaveValue("17");
            expect(itemIDField).toHaveValue("59");
            expect(reviewerEmailField).toHaveValue("boblee@ucsb.edu");
            expect(starsField).toHaveValue("0");
            expect(dateReviewedField).toHaveValue("2022-03-14T15:00");
            expect(commentsField).toHaveValue("horrible");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("ReviewForm-itemID")).toBeInTheDocument());

            const idField = getByTestId("ReviewForm-id");
            const itemIDField = getByTestId("ReviewForm-itemID");
            const reviewerEmailField = getByTestId("ReviewForm-reviewerEmail");
            const starsField = getByTestId("ReviewForm-stars");
            const dateReviewedField = getByTestId("ReviewForm-dateReviewed");
            const commentsField = getByTestId("ReviewForm-comments");
            const submitButton = getByTestId("ReviewForm-submit");

            expect(idField).toHaveValue("17");
            expect(itemIDField).toHaveValue("59");
            expect(reviewerEmailField).toHaveValue("boblee@ucsb.edu");
            expect(starsField).toHaveValue("0");
            expect(dateReviewedField).toHaveValue("2022-03-14T15:00");
            expect(commentsField).toHaveValue("horrible");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(itemIDField, { target: { value: '69' } })
            fireEvent.change(reviewerEmailField, { target: { value: 'correctemail@ucsb.edu' } })
            fireEvent.change(starsField, { target: { value: "5" } })
            fireEvent.change(dateReviewedField, { target: { value: "2022-12-25T08:00" } })
            fireEvent.change(commentsField, { target: { value: "great" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Review Updated - id: 17");
            expect(mockNavigate).toBeCalledWith({ "to": "/review/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId : '69',
                reviewerEmail: "correctemail@ucsb.edu",
                stars: "5",
                dateReviewed: "2022-12-25T08:00",
                comments: "great"
            })); // posted object

        });

       
    });
});


