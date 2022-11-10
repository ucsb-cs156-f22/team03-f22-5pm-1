import { /*fireEvent, */render/*, waitFor*/ } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationsEditPage from "main/pages/Recommendations/RecommendationsEditPage";

// import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import axios from "axios";
// import AxiosMockAdapter from "axios-mock-adapter";

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
            code: "ortega"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationsEditPage tests", () => {

    describe("tests where backend is working normally", () => {

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

       
    });
});


