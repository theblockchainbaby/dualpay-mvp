export const MACHINES = [
  {
    tier: "Entry",
    name: "Snowie 3000 / Benchmark",
    price: "$1,200–$2,500",
    iceOutput: "400 lbs/day",
    shaveQuality: "Medium-fine",
    power: "120V standard outlet",
    footprint: '14" × 20"',
    warranty: "1 year parts",
    bestFor: "1-cart startup, farmers markets, learning ops",
    pros: ["Low entry cost", "Compact", "Easy maintenance"],
    cons: ["Ice texture inconsistent in heat", "Slower output on rush days", "Blade dulls faster"],
    consistency: "70%",
    consistencyNote: "Good for low volume. Texture varies with block temp and blade wear.",
    repairCost: "$150–$400",
  },
  {
    tier: "Pro",
    name: "Southern Snow / Hatsuyuki HAB-450A",
    price: "$3,500–$5,500",
    iceOutput: "800–1,000 lbs/day",
    shaveQuality: "Ultra-fine (snow texture)",
    power: "220V dedicated circuit",
    footprint: '18" × 26"',
    warranty: "2 year parts + labor",
    bestFor: "Primary cart, daily $500–$1,000 volume target",
    pros: [
      "True snow texture — syrup absorbs vs runs off",
      "Consistent output all day",
      "NSF certified for health dept",
    ],
    cons: ["Requires 220V install", "Heavier (65 lbs)", "Higher upfront cost"],
    consistency: "92%",
    consistencyNote: "This is the sweet spot. Snow texture = better flavor absorption = better product.",
    repairCost: "$200–$600",
  },
  {
    tier: "Commercial",
    name: "Manitowoc / Scotsman Block Ice + Shaver Combo",
    price: "$8,000–$14,000",
    iceOutput: "2,000+ lbs/day",
    shaveQuality: "Competition-grade",
    power: "220V 3-phase",
    footprint: '24" × 36"',
    warranty: "3 year full coverage",
    bestFor: "Festival setup, 3-cart operation, high-volume events",
    pros: [
      "Makes its own block ice on-site",
      "Zero ice delivery dependency",
      "Best possible texture",
    ],
    cons: [
      "Significant capital investment",
      "Requires dedicated electrical",
      "Requires regular descaling",
    ],
    consistency: "98%",
    consistencyNote: "This is the endgame machine for a scaled 3-cart operation.",
    repairCost: "$400–$1,200",
  },
];

export const CONSISTENCY_TIPS = [
  {
    title: "Brix Meter is Non-Negotiable",
    body: "Buy a refractometer ($25). Every syrup batch hits target Brix before it gets bottled. Too low = flavor runs off ice. Too high = crystallizes. 45–55° Brix is the Criminal Cones window.",
  },
  {
    title: "Ice Block Temperature",
    body: "Block ice should be 15–22°F for shaving. Too cold = powdery dust. Too warm = wet slush. Store blocks in chest freezer overnight. Pull 20–30 min before service, never longer.",
  },
  {
    title: "Syrup Temperature at Service",
    body: "Serve syrups at 65–72°F (room temp or slightly cool). Cold syrup hits ice and beads. Room temp syrup soaks in and saturates the cone properly.",
  },
  {
    title: "Pack Ice Firmly",
    body: "Loose ice = syrup runs straight through. Pack with a wooden dowel or purpose-built packer before pouring. The cone should hold shape when flipped.",
  },
  {
    title: "Portion Control",
    body: "Use labeled squeeze bottles. Mark the 2 oz line with a rubber band. Every cone gets the same pour. Consistency = margin protection.",
  },
  {
    title: "Blade Maintenance",
    body: "Inspect blade before every shift. A dull blade creates uneven chunks — visible to customers and ruins texture. Keep a spare blade. Sharpen or replace every 60–80 service hours.",
  },
  {
    title: "Two-Pour Method",
    body: "Pour half syrup, let absorb 5 seconds, pour second half. The ice wicks the first layer deeper and the second layer sits on top for color and visual impact.",
  },
  {
    title: "Batch Logging",
    body: "Log every syrup batch: date, yield, Brix reading, any ingredient variations. When something tastes off, you have a paper trail. This is how you replicate the perfect batch.",
  },
];
