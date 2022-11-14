import { render, waitFor, fireEvent } from "@testing-library/react";
import ArticleForm from "main/components/Article/ArticleForm";
import { articleFixtures } from "fixtures/articleFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ArticleForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <ArticleForm />
            </Router>
        );
        await waitFor(() => expect(getByText(/URL/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
    });

    test("renders correctly when passing in a Article ", async () => {

        const { getByText, getByTestId } = render(
            <Router  >
                <ArticleForm initialArticle={articleFixtures.oneArticle}  buttonLabel={"Update"} />
            </Router>
        );
        await waitFor(() => expect(getByTestId(/ArticleForm-title/)).toBeInTheDocument());
        expect(getByText(/Title/)).toBeInTheDocument();
        await waitFor( () => expect(getByTestId(/ArticleForm-title/)).toHaveValue("Article10") );
    });

    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <ArticleForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("ArticleForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("ArticleForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


