import type { Disease } from "../types";

import anthracnose from "@/assets/diseases/anthracnose.jpg";
import bacterialWilt from "@/assets/diseases/bacterial-wilt.jpg";
import blackScurf from "@/assets/diseases/black-scurf.jpg";
import blackSigatoka from "@/assets/diseases/black-sigatoka.jpg";
import citrusCanker from "@/assets/diseases/citrus-canker.jpg";
import downyMildew from "@/assets/diseases/downy-mildew.jpg";
import earlyBlight from "@/assets/diseases/early-blight.jpg";
import lateBlight from "@/assets/diseases/late-blight.jpg";
import leafRust from "@/assets/diseases/leaf-rust.jpg";
import mosaicVirus from "@/assets/diseases/mosaic-virus.jpg";
import powderyMildew from "@/assets/diseases/powdery-mildew.jpg";
import riceBlast from "@/assets/diseases/rice-blast.jpg";

export const diseaseLibrary: Disease[] = [
  {
    id: "late-blight",
    name: "Late Blight",
    crops: ["Tomato", "Potato"],
    cropTag: "Tomato",
    symptoms:
      "Dark, water-soaked blotches with pale green margins on upper leaves, spreading to stems and fruit. A white fuzz appears underneath after damp nights.",
    prevention: [
      "Plant certified, disease-free seed and resistant varieties",
      "Space rows for airflow and avoid overhead irrigation",
      "Remove volunteer potatoes and infected debris before the season",
    ],
    spreads: "Cool nights below 18°C with long leaf wetness and humidity above 85%.",
    image: lateBlight,
  },
  {
    id: "early-blight",
    name: "Early Blight",
    crops: ["Tomato", "Potato", "Eggplant"],
    cropTag: "Tomato",
    symptoms:
      "Brown spots with concentric rings, like a target, starting on the oldest lower leaves and moving upward as the plant sets fruit.",
    prevention: [
      "Mulch to stop soil splash reaching the lower leaves",
      "Rotate away from nightshades for two seasons",
      "Keep plants well fed — stressed plants show symptoms first",
    ],
    spreads: "Warm days of 24–29°C with alternating wet and dry spells.",
    image: earlyBlight,
  },
  {
    id: "leaf-rust",
    name: "Leaf Rust",
    crops: ["Wheat", "Barley", "Rye"],
    cropTag: "Wheat",
    symptoms:
      "Small round orange-brown pustules scattered on the leaf blade that rub off as powder on your fingers.",
    prevention: [
      "Sow rust-tolerant varieties where available",
      "Sow early to escape the peak spore load",
      "Scout the flag leaf weekly from stem elongation",
    ],
    spreads: "Mild temperatures of 15–22°C with dew that holds past sunrise.",
    image: leafRust,
  },
  {
    id: "powdery-mildew",
    name: "Powdery Mildew",
    crops: ["Cucumber", "Pumpkin", "Grape", "Okra"],
    cropTag: "Cucumber",
    symptoms:
      "White powdery patches on the upper leaf surface that merge until the leaf yellows and dries out.",
    prevention: [
      "Thin dense canopies so light and air reach the middle",
      "Avoid excessive nitrogen, which pushes soft growth",
      "Spray potassium bicarbonate or a sulphur product preventively",
    ],
    spreads: "Warm dry days with humid nights — it does not need leaf wetness.",
    image: powderyMildew,
  },
  {
    id: "downy-mildew",
    name: "Downy Mildew",
    crops: ["Grape", "Onion", "Spinach", "Cucumber"],
    cropTag: "Grape",
    symptoms:
      "Angular yellow oily patches bounded by leaf veins on top, with grey-violet fuzz on the underside in the morning.",
    prevention: [
      "Irrigate at the base, never in the late afternoon",
      "Train vines and stems upward to speed drying",
      "Apply protectant sprays before forecast rain, not after",
    ],
    spreads: "Cool wet weather, 10–20°C, with 4+ hours of leaf wetness.",
    image: downyMildew,
  },
  {
    id: "bacterial-wilt",
    name: "Bacterial Wilt",
    crops: ["Maize", "Tomato", "Banana", "Cucumber"],
    cropTag: "Maize",
    symptoms:
      "Sudden daytime wilting with partial overnight recovery, then collapse. Cut stems ooze a milky thread in water.",
    prevention: [
      "Disinfect knives and tools between plants and rows",
      "Uproot and destroy affected plants with the root ball",
      "Rotate to cereals or grasses for at least one season",
    ],
    spreads: "Hot humid soils above 24°C, often after flooding or tool-borne spread.",
    image: bacterialWilt,
  },
  {
    id: "rice-blast",
    name: "Rice Blast",
    crops: ["Rice"],
    cropTag: "Rice",
    symptoms:
      "Diamond-shaped lesions with grey centres and brown borders on leaves; neck infection turns panicles white and empty.",
    prevention: [
      "Split nitrogen applications rather than one heavy dose",
      "Keep a shallow, steady flood rather than drying cycles",
      "Treat seed before sowing in known blast areas",
    ],
    spreads: "Long dew periods with night temperatures near 20°C.",
    image: riceBlast,
  },
  {
    id: "citrus-canker",
    name: "Citrus Canker",
    crops: ["Orange", "Lemon", "Lime"],
    cropTag: "Citrus",
    symptoms:
      "Raised corky brown lesions with an oily margin and yellow halo on leaves, twigs and fruit. Severe cases cause early fruit drop.",
    prevention: [
      "Establish windbreaks — wind-driven rain carries the bacteria",
      "Control leaf miner, whose tunnels open entry points",
      "Prune and burn infected wood in dry weather only",
    ],
    spreads: "Warm rainy weather above 25°C, especially with storms.",
    image: citrusCanker,
  },
  {
    id: "black-scurf",
    name: "Black Scurf",
    crops: ["Potato"],
    cropTag: "Potato",
    symptoms:
      "Hard black crusty specks stuck to the tuber skin, plus brown sunken lesions on underground stems that stunt emergence.",
    prevention: [
      "Plant into warm soil so sprouts emerge quickly",
      "Use clean seed tubers and avoid deep planting",
      "Harvest promptly once the crop has matured",
    ],
    spreads: "Cool wet soils at planting that slow emergence.",
    image: blackScurf,
  },
  {
    id: "anthracnose",
    name: "Anthracnose",
    crops: ["Chilli", "Mango", "Bean"],
    cropTag: "Chilli",
    symptoms:
      "Sunken circular dark spots on ripening fruit with concentric rings of pink or black spore masses in the centre.",
    prevention: [
      "Harvest fruit as it colours rather than leaving it on the plant",
      "Remove and bury infected fruit away from the field",
      "Stake plants so fruit never touches wet soil",
    ],
    spreads: "Warm humid weather from 25–30°C with rain splash during ripening.",
    image: anthracnose,
  },
  {
    id: "mosaic-virus",
    name: "Mosaic Virus",
    crops: ["Cotton", "Tomato", "Cassava", "Bean"],
    cropTag: "Cotton",
    symptoms:
      "Mottled light and dark green patchwork on leaves, puckered or crinkled edges, and stunted growth with poor fruit set.",
    prevention: [
      "Control aphids and whiteflies, which carry the virus",
      "Wash hands and tools after handling infected plants",
      "Rogue out symptomatic plants early rather than treating them",
    ],
    spreads: "Insect vectors and mechanical handling — not weather driven.",
    image: mosaicVirus,
  },
  {
    id: "black-sigatoka",
    name: "Black Sigatoka",
    crops: ["Banana", "Plantain"],
    cropTag: "Banana",
    symptoms:
      "Thin dark streaks running parallel to the veins that widen into black blotches with grey centres, killing leaves early.",
    prevention: [
      "Deleaf infected leaves weekly and lay them flat to dry",
      "Improve drainage between rows",
      "Keep plant spacing wide enough for the canopy to dry",
    ],
    spreads: "Hot, wet, humid conditions above 26°C with frequent rain.",
    image: blackSigatoka,
  },
];

export const cropFilters = [
  "All crops",
  ...Array.from(new Set(diseaseLibrary.map((d) => d.cropTag))),
];
