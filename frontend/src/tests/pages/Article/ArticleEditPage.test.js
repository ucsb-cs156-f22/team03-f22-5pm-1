import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticleEditPage from "main/pages/Article/ArticleEditPage";

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
            title: "article1"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticleEditPage tests", () => {

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/article", { params: { title: "article1" } }).reply(200, {  
                url: "Article1",
                title: "article1",
                explanation: "Article1 explanation",
                email: "article1@gmail.com",
                dateAdded: ""
            });
            axiosMock.onPut('/api/article').reply(200, {
                url: "Article1",
                title: "article1 article",
                explanation: "Article1 explanation",
                email: "article1@gmail.com",
                dateAdded: ""
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticleEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticleEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("ArticleForm-title")).toBeInTheDocument());

            const titleField = getByTestId("ArticleForm-title");
            const urlField = getByTestId("ArticleForm-url");
            const explanationField = getByTestId("ArticleForm-explanation");
            const emailField = getByTestId("ArticleForm-email");

            expect(titleField).toHaveValue("Article1");
            expect(urlField).toHaveValue("article1");
            expect(explanationField).toHaveValue("Article1 explanation");
            expect(emailField).toHaveValue("article1@gmail.com");
        });

        test("Changes when you click Update", async () => {

            const { getByTestId, getByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticleEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("ArticleForm-title")).toBeInTheDocument());

            const titleField = getByTestId("ArticleForm-title");
            const urlField = getByTestId("ArticleForm-url");
            const explanationField = getByTestId("ArticleForm-explanation");
            const emailField = getByTestId("ArticleForm-email");

            expect(titleField).toHaveValue("Article1");
            expect(urlField).toHaveValue("article1");
            expect(explanationField).toHaveValue("Article1 explanatino");
            expect(emailField).toHaveValue("article1@gmail.com");
           
            const submitButton = getByText("Update");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(urlField, { target: { value: 'article1' } })
            fireEvent.change(explanationField, { target: { value: 'Article1 Explanation' } })
            fireEvent.change(emailField, { target: { value: 'article1@gmail.com'  } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Article Updated - title: Article1 url: article1 article");
            expect(mockNavigate).toBeCalledWith({ "to": "/article/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ title:"article1 article" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                url: "article1 article",
                explanation: "Article1 explanation",
                email: "article1@gmail.com"
            })); // posted object

        });

       
    });
});


