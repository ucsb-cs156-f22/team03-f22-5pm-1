import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticleIndexPage from "main/pages/Article/ArticleIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { articleFixtures } from "fixtures/articleFixtures";
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

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ArticleIndexPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "ArticleTable";

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
        axiosMock.onGet("/api/article/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/article/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders three article without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/article/all").reply(200, articleFixtures.threeArticle);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(  () => { expect(getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("article11"); } );
        expect(getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("article12");
        expect(getByTestId(`${testId}-cell-row-2-col-url`)).toHaveTextContent("article13");

    });

    test("renders three articles without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/article/all").reply(200, articleFixtures.threeArticle);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("article11"); });
        expect(getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("article12");
        expect(getByTestId(`${testId}-cell-row-2-col-url`)).toHaveTextContent("article13");

    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/article/all").timeout();

        const { queryByTestId, getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(3); });

        const expectedHeaders = ['Title', 'URL', 'Explanation', 'Email', 'Date Added'];
    
        expectedHeaders.forEach((headerText) => {
          const header = getByText(headerText);
          expect(header).toBeInTheDocument();
        });

        expect(queryByTestId(`${testId}-cell-row-0-col-url`)).not.toBeInTheDocument();
    });

    test("test what happens when you click edit as an admin", async () => {
        setupAdminUser();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/article/all").reply(200, articleFixtures.threeArticle);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-url`)).toBeInTheDocument(); });

        expect(getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("article11"); 


        const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
       
        fireEvent.click(editButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/article/edit/article11'));

    });

    test("test what happens when you click delete, admin", async () => {
        setupAdminUser();
    
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/article/all").reply(200, articleFixtures.threeArticle);
        axiosMock.onDelete("/api/article").reply(200, "Article with title Article11 was deleted");
    
    
        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    
        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-title`)).toBeInTheDocument(); });
    
        expect(getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("1"); 
    
    
        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
       
        fireEvent.click(deleteButton);
    
        await waitFor(() => { expect(mockToast).toBeCalledWith("Article with title Article11 was deleted") });
    
    });
});


