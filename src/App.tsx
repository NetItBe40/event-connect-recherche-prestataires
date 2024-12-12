import { StepManager } from "@/components/StepManager"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StepManager />
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App