import { StepManager } from "@/components/StepManager";
import { TestDescription } from "@/components/TestDescription";

export default function Index() {
  return (
    <div className="space-y-8">
      <TestDescription />
      <StepManager />
    </div>
  );
}