import { render, waitFor, fireEvent } from "@testing-library/react";
import ReviewCreatePage from "main/pages/Review/ReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
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

describe("ReviewCreatePage tests", () => {

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
                    <ReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const review = {
            id: 17,
            itemID: 24,
            reviewerEmail: "ethanlee@ucsb.edu",
            stars: "5",
            dateReviewed: "2022-02-02T00:00",
            comments: "ok"
        };

        axiosMock.onPost("/api/reviews/post").reply( 202, review );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("ReviewForm-itemID")).toBeInTheDocument();
        });
        const itemIDField = getByTestId("ReviewForm-itemID");
        const reviewerEmailField = getByTestId("ReviewForm-reviewerEmail");
        const starsField = getByTestId("ReviewForm-stars");
        const dateReviewedField = getByTestId("ReviewForm-dateReviewed");
        const commentsField = getByTestId("ReviewForm-comments");
        const submitButton = getByTestId("ReviewForm-submit");

        fireEvent.change(itemIDField, { target: { value: '24' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'ethanlee@ucsb.edu' } });
        fireEvent.change(starsField, { target: { value: '5' } });
        fireEvent.change(dateReviewedField, { target: { value: '2022-02-02T00:00' } });
        fireEvent.change(commentsField, { target: { value: 'ok'}});

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "itemId": "24",
                "itemId": undefined,
                "reviewerEmail": "ethanlee@ucsb.edu",
                "stars": "5",
                "dateReviewed": "2022-02-02T00:00",
                "comments": "ok"
        });

        expect(mockToast).toBeCalledWith("New review Created - id: 17");
        expect(mockNavigate).toBeCalledWith({ "to": "/review/list" });
    });


});


