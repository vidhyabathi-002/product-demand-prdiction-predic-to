import { Slider } from "@/components/ui/slider";

export function SimulationPanel() {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-muted-foreground">Marketing Spend</label>
        <Slider defaultValue={[50]} max={100} className="mt-2 animate-pulse" />
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">Product Price</label>
        <Slider defaultValue={[39.99]} max={100} step={0.01} className="mt-2 animate-pulse" />
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">Competitor Activity</label>
        <Slider defaultValue={[20]} max={100} className="mt-2 animate-pulse" />
      </div>
    </div>
  );
}