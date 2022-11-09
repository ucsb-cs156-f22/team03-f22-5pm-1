import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import DiningCommonsEditPage from "main/pages/DiningCommons/DiningCommonsEditPage";
import OrganizationsEditPage from "main/pages/Organizations/OrganizationsEditPage";

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
            code: "ortega"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("OrganizationsEditPage tests", () => {

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

       /*  beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbdiningcommons", { params: { code: "ortega" } }).reply(200, {
                name: "Ortega",
                code: "ortega",
                hasSackMeal: true,
                hasTakeOutMeal: true,
                hasDiningCam: true,
                latitude: 34.410987,
                longitude: -119.84709
            });
            axiosMock.onPut('/api/ucsbdiningcommons').reply(200, {
                name: "Ortega Dining Commons",
                code: "ortega",
                hasSackMeal: true,
                hasTakeOutMeal: true,
                hasDiningCam: true,
                latitude: 34.410123,
                longitude: -119.847123
            });
        }); */

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <OrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

    });
});


