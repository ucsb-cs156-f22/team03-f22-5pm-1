import { fireEvent, render, waitFor } from "@testing-library/react";
import { articleFixtures } from "fixtures/articleFixtures";
import ArticleTable from "main/components/Article/ArticleTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { cellToAxiosParamsDelete } from "main/components/Article/ArticleTable";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ArticleTable tests", () => {
  const queryClient = new QueryClient();


  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticleTable article={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticleTable article={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticleTable article={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticleTable article={articleFixtures.threeArticle} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Title", "URL", "Explanation", "Email", "Date Added"];
    const expectedFields = ["title", "url", "explanation", "email", "dateAdded"];
    const testId = "ArticleTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Article11");
    expect(getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Article12");

    const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticleTable article={articleFixtures.threeArticle} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`ArticleTable-cell-row-0-col-title`)).toHaveTextContent("Article11"); });

    const editButton = getByTestId(`ArticleTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/article/edit/article11'));

  });

});

describe("cellToAxiosParamsDelete", () => {

  test("It returns the correct params", () => {
      // arrange
      const cell = { row: { values: { title: "Article11" } } };

      // act
      const result = cellToAxiosParamsDelete(cell);

      // assert
      expect(result).toEqual({
          url: "/api/article",
          method: "DELETE",
          params: { title: "Article11" }
      });
    });
  });
