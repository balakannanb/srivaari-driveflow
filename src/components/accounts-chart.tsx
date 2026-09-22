import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { day: "Mon", income: 95, expense: 18 },
  { day: "Tue", income: 140, expense: 32 },
  { day: "Wed", income: 82, expense: 21 },
  { day: "Thu", income: 185, expense: 23 },
  { day: "Fri", income: 164, expense: 28 },
  { day: "Sat", income: 210, expense: 40 },
];

export default function AccountsChart() {
  return <ChartContainer config={{ income: { label: "Income", color: "var(--primary)" }, expense: { label: "Expense", color: "var(--warning)" } }} className="h-72 w-full">
    <AreaChart data={chartData}>
      <defs><linearGradient id="income" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.35}/><stop offset="95%" stopColor="var(--color-income)" stopOpacity={0}/></linearGradient></defs>
      <CartesianGrid vertical={false}/>
      <XAxis dataKey="day"/>
      <YAxis/>
      <ChartTooltip content={<ChartTooltipContent/>}/>
      <Area dataKey="income" type="monotone" stroke="var(--color-income)" fill="url(#income)"/>
      <Area dataKey="expense" type="monotone" stroke="var(--color-expense)" fill="transparent"/>
    </AreaChart>
  </ChartContainer>;
}
