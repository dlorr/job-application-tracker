import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ApplicationPage from "./pages/ApplicationsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationPage />
    </QueryClientProvider>
  );
}

export default App;
