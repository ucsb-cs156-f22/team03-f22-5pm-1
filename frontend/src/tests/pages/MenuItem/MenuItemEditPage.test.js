import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemEditPage from "main/pages/MenuItem/MenuItemEditPage";

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

describe("MenuItemEditPage tests", () => {

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitem", { params: { id: 17 } }).reply(200, {  
                id: 17,
                diningCommonsCode: "ortega",
                name: "Chicken Caesar Salad",
                station: "Entrees",
               
            });
            axiosMock.onPut('/api/menuitem').reply(200, {
                id: "17",
                diningCommonsCode: "ortega",
                name: "Chicken Caesar Salad",
                station: "Entrees",
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(getByTestId("MenuItemForm-diningCommonsCode")).toBeInTheDocument();
            });
    
            const diningCommonsCodeField = getByTestId("MenuItemForm-diningCommonsCode");
            const nameField = getByTestId("MenuItemForm-name");
            const stationField = getByTestId("MenuItemForm-station");
            

            expect(diningCommonsCodeField).toHaveValue("ortega");
            expect(nameField).toHaveValue("Chicken Caesar Salad");
            expect(stationField).toHaveValue("Entrees");
        });

        test("Changes when you click Update", async () => {

            const { getByTestId, getByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(getByTestId("MenuItemForm-diningCommonsCode")).toBeInTheDocument();
            });
    
            const diningCommonsCodeField = getByTestId("MenuItemForm-diningCommonsCode");
            const nameField = getByTestId("MenuItemForm-name");
            const stationField = getByTestId("MenuItemForm-station");
            

            expect(diningCommonsCodeField).toHaveValue("ortega");
            expect(nameField).toHaveValue("Chicken Caesar Salad");
            expect(stationField).toHaveValue("Entrees");
            
           
            const submitButton = getByText("Update");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(diningCommonsCodeField, { target: { value: 'ortega' } })
            fireEvent.change(nameField, { target: { value: 'Baked Pesto Pasta with Chicken' } })
            fireEvent.change(stationField, { target: { value: "Entree Specials" } })
        

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("MenuItem Request Updated - id: 17 diningcommonscode: ortega");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitem/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                diningCommonsCode: "ortega",
                name: "Baked Pesto Pasta with Chicken",
                station: "Entree Specials",
                
            })); // posted object

        });

       
    });
});