import * as React from 'react';
import { QueryClient,QueryClientProvider } from "react-query"
import { fireEvent, render, RenderAPI,waitFor } from "@testing-library/react-native"



const TestWrapperComponent = (component:any):RenderAPI =>
{
  const query =  new QueryClient({
    defaultOptions: {
      queries: {
        //  turns retries off
        retry: false,
      },
    },
  });

 return  render(
    <QueryClientProvider client={query}>
    {component}
</QueryClientProvider>
  )
}

export default TestWrapperComponent;




