const PLAYERS = [
  {
    id: "kohli",
    name: "Virat Kohli",
    jersey: "18",
    country: "IND",
    countryName: "India",
    era: "Modern Icon",
    role: "Batter",
    nickname: "The Chase Master",
    theme: { primary: "#1d4ed8", secondary: "#f59e0b" },
    iccTitles: [
      { trophy: "ODI World Cup", year: "2011" },
      { trophy: "Champions Trophy", year: "2013" },
      { trophy: "T20 World Cup", year: "2024" },
      { trophy: "Champions Trophy", year: "2025" }
    ],
    stats: {
      test: { matches: 123, runs: 9230, wickets: 0, avg: 46.85, sr: 55.5, milestones: "30 Hundreds" },
      odi: { matches: 302, runs: 14181, wickets: 5, avg: 57.88, sr: 93.4, milestones: "51 Hundreds" },
      t20i: { matches: 125, runs: 4188, wickets: 4, avg: 48.69, sr: 137.0, milestones: "1 Hundred / 38 Fifties" }
    },
    signatureMoment: "82* off 53 balls vs Pakistan at the MCG (2022 T20 World Cup) & 76 in the 2024 T20 World Cup Final."
  },
  {
    id: "dhoni",
    name: "MS Dhoni",
    jersey: "07",
    country: "IND",
    countryName: "India",
    era: "Modern Icon",
    role: "Wicketkeeper",
    nickname: "Captain Cool",
    theme: { primary: "#1e40af", secondary: "#eab308" },
    iccTitles: [
      { trophy: "T20 World Cup", year: "2007 (C)" },
      { trophy: "ODI World Cup", year: "2011 (C)" },
      { trophy: "Champions Trophy", year: "2013 (C)" }
    ],
    stats: {
      test: { matches: 90, runs: 4876, wickets: 0, avg: 38.09, sr: 59.1, milestones: "294 Dismissals" },
      odi: { matches: 350, runs: 10773, wickets: 1, avg: 50.57, sr: 87.5, milestones: "444 Dismissals" },
      t20i: { matches: 98, runs: 1617, wickets: 0, avg: 37.60, sr: 126.1, milestones: "91 Dismissals" }
    },
    signatureMoment: "Unbeaten 91* off 79 balls sealed with a six at Wankhede to win the 2011 ODI World Cup Final."
  },
  {
    id: "rohit",
    name: "Rohit Sharma",
    jersey: "45",
    country: "IND",
    countryName: "India",
    era: "Modern Icon",
    role: "Batter",
    nickname: "The Hitman",
    theme: { primary: "#2563eb", secondary: "#38bdf8" },
    iccTitles: [
      { trophy: "T20 World Cup", year: "2007" },
      { trophy: "Champions Trophy", year: "2013" },
      { trophy: "T20 World Cup", year: "2024 (C)" },
      { trophy: "Champions Trophy", year: "2025 (C)" }
    ],
    stats: {
      test: { matches: 67, runs: 4301, wickets: 2, avg: 40.57, sr: 57.0, milestones: "12 Hundreds" },
      odi: { matches: 273, runs: 11168, wickets: 9, avg: 48.76, sr: 92.8, milestones: "3 Double Hundreds" },
      t20i: { matches: 159, runs: 4231, wickets: 1, avg: 32.05, sr: 140.8, milestones: "5 T20I Hundreds" }
    },
    signatureMoment: "World-record 264 in ODIs vs Sri Lanka and 5 centuries in the 2019 ODI World Cup."
  },
  {
    id: "bumrah",
    name: "Jasprit Bumrah",
    jersey: "93",
    country: "IND",
    countryName: "India",
    era: "Modern Icon",
    role: "Bowler",
    nickname: "Boom Boom",
    theme: { primary: "#1d4ed8", secondary: "#60a5fa" },
    iccTitles: [
      { trophy: "T20 World Cup", year: "2024 (POTT)" },
      { trophy: "T20 World Cup", year: "2026" }
    ],
    stats: {
      test: { matches: 45, runs: 332, wickets: 205, avg: 19.40, sr: 42.0, milestones: "13 Five-Wicket Hauls" },
      odi: { matches: 89, runs: 91, wickets: 149, avg: 23.55, sr: 30.7, milestones: "Best: 6/19" },
      t20i: { matches: 78, runs: 8, wickets: 99, avg: 17.50, sr: 17.1, milestones: "Econ: 6.24" }
    },
    signatureMoment: "2024 T20 World Cup Player of the Tournament (15 wickets at 4.17 economy) & 2/18 in the Final."
  },
  {
    id: "hardik",
    name: "Hardik Pandya",
    jersey: "33",
    country: "IND",
    countryName: "India",
    era: "Modern Icon",
    role: "All-Rounder",
    nickname: "Kung Fu Pandya",
    theme: { primary: "#1e3a8a", secondary: "#fb923c" },
    iccTitles: [
      { trophy: "T20 World Cup", year: "2024" },
      { trophy: "Champions Trophy", year: "2025" },
      { trophy: "T20 World Cup", year: "2026" }
    ],
    stats: {
      test: { matches: 11, runs: 532, wickets: 17, avg: 31.29, sr: 73.8, milestones: "5/28 at Trent Bridge" },
      odi: { matches: 94, runs: 1904, wickets: 91, avg: 32.82, sr: 110.8, milestones: "11 Fifties" },
      t20i: { matches: 122, runs: 1930, wickets: 102, avg: 27.97, sr: 142.5, milestones: "100+ Wickets & 1900+ Runs" }
    },
    signatureMoment: "3/20 in the 2024 T20 World Cup Final defending 16 off the last over in Barbados."
  },
  {
    id: "tendulkar",
    name: "Sachin Tendulkar",
    jersey: "10",
    country: "IND",
    countryName: "India",
    era: "Immortal Legend",
    role: "Batter",
    nickname: "Master Blaster",
    theme: { primary: "#1e40af", secondary: "#38bdf8" },
    iccTitles: [
      { trophy: "Champions Trophy", year: "2002" },
      { trophy: "ODI World Cup", year: "2011" }
    ],
    stats: {
      test: { matches: 200, runs: 15921, wickets: 46, avg: 53.78, sr: 54.0, milestones: "51 Test Hundreds" },
      odi: { matches: 463, runs: 18426, wickets: 154, avg: 44.83, sr: 86.2, milestones: "49 ODI Hundreds" },
      t20i: { matches: 1, runs: 10, wickets: 1, avg: 10.00, sr: 83.3, milestones: "100 International 100s" }
    },
    signatureMoment: "First double-century in Men's ODI history (200* vs South Africa, 2010) & 100 international centuries."
  },
  {
    id: "cummins",
    name: "Pat Cummins",
    jersey: "30",
    country: "AUS",
    countryName: "Australia",
    era: "Modern Icon",
    role: "Bowler",
    nickname: "Captain Clutch",
    theme: { primary: "#ca8a04", secondary: "#15803d" },
    iccTitles: [
      { trophy: "ODI World Cup", year: "2015" },
      { trophy: "T20 World Cup", year: "2021" },
      { trophy: "World Test Championship", year: "2023 (C)" },
      { trophy: "ODI World Cup", year: "2023 (C)" }
    ],
    stats: {
      test: { matches: 69, runs: 1480, wickets: 298, avg: 22.40, sr: 46.8, milestones: "13 Five-Wicket Hauls" },
      odi: { matches: 90, runs: 540, wickets: 143, avg: 28.45, sr: 32.1, milestones: "2/34 in 2023 WC Final" },
      t20i: { matches: 59, runs: 165, wickets: 68, avg: 23.10, sr: 18.5, milestones: "2 Hat-tricks in 2024 T20WC" }
    },
    signatureMoment: "Captained Australia to both the 2023 WTC Mace and the 2023 ODI World Cup title in Ahmedabad."
  },
  {
    id: "ponting",
    name: "Ricky Ponting",
    jersey: "14",
    country: "AUS",
    countryName: "Australia",
    era: "Immortal Legend",
    role: "Batter",
    nickname: "Punter",
    theme: { primary: "#eab308", secondary: "#166534" },
    iccTitles: [
      { trophy: "ODI World Cup", year: "1999" },
      { trophy: "ODI World Cup", year: "2003 (C)" },
      { trophy: "Champions Trophy", year: "2006 (C)" },
      { trophy: "ODI World Cup", year: "2007 (C)" },
      { trophy: "Champions Trophy", year: "2009 (C)" }
    ],
    stats: {
      test: { matches: 168, runs: 13378, wickets: 5, avg: 51.85, sr: 58.7, milestones: "41 Test Hundreds" },
      odi: { matches: 375, runs: 13704, wickets: 3, avg: 42.03, sr: 80.3, milestones: "30 ODI Hundreds" },
      t20i: { matches: 17, runs: 401, wickets: 0, avg: 28.64, sr: 132.8, milestones: "98* vs NZ (2005)" }
    },
    signatureMoment: "140* off 121 balls in the 2003 ODI World Cup Final in Johannesburg."
  },
  {
    id: "warne",
    name: "Shane Warne",
    jersey: "23",
    country: "AUS",
    countryName: "Australia",
    era: "Immortal Legend",
    role: "Bowler",
    nickname: "The King of Spin",
    theme: { primary: "#d97706", secondary: "#15803d" },
    iccTitles: [
      { trophy: "ODI World Cup", year: "1999 (POTM Final)" }
    ],
    stats: {
      test: { matches: 145, runs: 3154, wickets: 708, avg: 25.41, sr: 57.4, milestones: "37 Five-Wicket Hauls" },
      odi: { matches: 194, runs: 1018, wickets: 293, avg: 25.73, sr: 36.3, milestones: "4/33 in 1999 WC Final" },
      t20i: { matches: 0, runs: 0, wickets: 0, avg: 0, sr: 0, milestones: "Retired Pre-T20I" }
    },
    signatureMoment: "Ball of the Century to Mike Gatting (1993) & 4/33 in the 1999 World Cup Final at Lord's."
  },
  {
    id: "bavuma",
    name: "Temba Bavuma",
    jersey: "11",
    country: "SA",
    countryName: "South Africa",
    era: "Modern Icon",
    role: "Batter",
    nickname: "WTC Mace Winner",
    theme: { primary: "#15803d", secondary: "#eab308" },
    iccTitles: [
      { trophy: "World Test Championship", year: "2025 (C)" }
    ],
    stats: {
      test: { matches: 65, runs: 3790, wickets: 1, avg: 38.67, sr: 51.2, milestones: "2025 WTC Winning Captain" },
      odi: { matches: 52, runs: 1940, wickets: 0, avg: 43.11, sr: 88.9, milestones: "5 ODI Hundreds" },
      t20i: { matches: 36, runs: 670, wickets: 0, avg: 21.61, sr: 118.1, milestones: "1 Fifty" }
    },
    signatureMoment: "Led South Africa to end their 27-year ICC trophy drought by winning the 2025 WTC Final at Lord's."
  },
  {
    id: "abd",
    name: "AB de Villiers",
    jersey: "17",
    country: "SA",
    countryName: "South Africa",
    era: "Modern Icon",
    role: "Wicketkeeper",
    nickname: "Mr. 360",
    theme: { primary: "#166534", secondary: "#facc15" },
    iccTitles: [],
    stats: {
      test: { matches: 114, runs: 8765, wickets: 2, avg: 50.66, sr: 54.5, milestones: "22 Test Hundreds" },
      odi: { matches: 228, runs: 9577, wickets: 7, avg: 53.50, sr: 101.1, milestones: "Fastest ODI 100 (31 balls)" },
      t20i: { matches: 78, runs: 1672, wickets: 0, avg: 26.12, sr: 135.1, milestones: "10 Fifties" }
    },
    signatureMoment: "149 off 44 balls against West Indies in Johannesburg (2015), reaching 100 in just 31 deliveries."
  },
  {
    id: "kallis",
    name: "Jacques Kallis",
    jersey: "03",
    country: "SA",
    countryName: "South Africa",
    era: "Immortal Legend",
    role: "All-Rounder",
    nickname: "The Ultimate All-Rounder",
    theme: { primary: "#15803d", secondary: "#f59e0b" },
    iccTitles: [
      { trophy: "Champions Trophy", year: "1998 (POTT)" }
    ],
    stats: {
      test: { matches: 166, runs: 13289, wickets: 292, avg: 55.37, sr: 45.9, milestones: "45 Hundreds & 292 Wickets" },
      odi: { matches: 328, runs: 11579, wickets: 273, avg: 44.36, sr: 72.8, milestones: "17 Hundreds & 273 Wickets" },
      t20i: { matches: 25, runs: 666, wickets: 12, avg: 35.05, sr: 119.3, milestones: "5 Fifties" }
    },
    signatureMoment: "Only cricketer in history with over 10,000 runs and 250 wickets in both Test and ODI cricket."
  },
  {
    id: "stokes",
    name: "Ben Stokes",
    jersey: "55",
    country: "ENG",
    countryName: "England",
    era: "Modern Icon",
    role: "All-Rounder",
    nickname: "Miracle Man",
    theme: { primary: "#1e3a8a", secondary: "#ef4444" },
    iccTitles: [
      { trophy: "ODI World Cup", year: "2019 (POTM Final)" },
      { trophy: "T20 World Cup", year: "2022" }
    ],
    stats: {
      test: { matches: 112, runs: 6780, wickets: 215, avg: 35.68, sr: 59.2, milestones: "13 Hundreds & 200+ Wickets" },
      odi: { matches: 114, runs: 3463, wickets: 74, avg: 41.22, sr: 95.6, milestones: "84* in 2019 WC Final" },
      t20i: { matches: 43, runs: 585, wickets: 26, avg: 21.66, sr: 128.0, milestones: "52* in 2022 T20WC Final" }
    },
    signatureMoment: "84* at Lord's to tie the 2019 ODI World Cup Final and 52* at the MCG to win the 2022 T20 World Cup."
  },
  {
    id: "sammy",
    name: "Daren Sammy",
    jersey: "88",
    country: "WI",
    countryName: "West Indies",
    era: "Modern Icon",
    role: "All-Rounder",
    nickname: "Two-Time T20 King",
    theme: { primary: "#881337", secondary: "#facc15" },
    iccTitles: [
      { trophy: "T20 World Cup", year: "2012 (C)" },
      { trophy: "T20 World Cup", year: "2016 (C)" }
    ],
    stats: {
      test: { matches: 38, runs: 1323, wickets: 84, avg: 21.68, sr: 58.3, milestones: "5 Five-Wicket Hauls" },
      odi: { matches: 126, runs: 1871, wickets: 81, avg: 24.94, sr: 100.0, milestones: "9 Fifties" },
      t20i: { matches: 68, runs: 587, wickets: 44, avg: 15.86, sr: 147.4, milestones: "2x T20 WC Captain" }
    },
    signatureMoment: "First captain in history to lift two ICC T20 World Cup trophies (2012 in Colombo & 2016 in Kolkata)."
  },
  {
    id: "williamson",
    name: "Kane Williamson",
    jersey: "22",
    country: "NZ",
    countryName: "New Zealand",
    era: "Modern Icon",
    role: "Batter",
    nickname: "Steady the Ship",
    theme: { primary: "#1e293b", secondary: "#38bdf8" },
    iccTitles: [
      { trophy: "World Test Championship", year: "2021 (C)" }
    ],
    stats: {
      test: { matches: 106, runs: 9320, wickets: 30, avg: 54.82, sr: 51.6, milestones: "33 Test Hundreds" },
      odi: { matches: 171, runs: 7110, wickets: 37, avg: 48.69, sr: 81.5, milestones: "2019 ODI WC POTT" },
      t20i: { matches: 93, runs: 2575, wickets: 6, avg: 33.44, sr: 123.0, milestones: "85 in 2021 T20WC Final" }
    },
    signatureMoment: "Captained New Zealand to victory in the inaugural 2021 ICC World Test Championship Final in Southampton."
  }
];

const ICC_TOURNAMENTS = [
  { year: 2026, type: "T20 World Cup", champion: "India", runnerUp: "New Zealand", venue: "Ahmedabad" },
  { year: 2025, type: "World Test Championship", champion: "South Africa", runnerUp: "Australia", venue: "Lord's, London" },
  { year: 2025, type: "Champions Trophy", champion: "India", runnerUp: "New Zealand", venue: "Dubai" },
  { year: 2024, type: "T20 World Cup", champion: "India", runnerUp: "South Africa", venue: "Bridgetown, Barbados" },
  { year: 2023, type: "ODI World Cup", champion: "Australia", runnerUp: "India", venue: "Ahmedabad" },
  { year: 2023, type: "World Test Championship", champion: "Australia", runnerUp: "India", venue: "The Oval, London" },
  { year: 2022, type: "T20 World Cup", champion: "England", runnerUp: "Pakistan", venue: "MCG, Melbourne" },
  { year: 2021, type: "T20 World Cup", champion: "Australia", runnerUp: "New Zealand", venue: "Dubai" },
  { year: 2021, type: "World Test Championship", champion: "New Zealand", runnerUp: "India", venue: "Southampton" },
  { year: 2019, type: "ODI World Cup", champion: "England", runnerUp: "New Zealand", venue: "Lord's, London" },
  { year: 2017, type: "Champions Trophy", champion: "Pakistan", runnerUp: "India", venue: "The Oval, London" },
  { year: 2016, type: "T20 World Cup", champion: "West Indies", runnerUp: "England", venue: "Eden Gardens, Kolkata" },
  { year: 2015, type: "ODI World Cup", champion: "Australia", runnerUp: "New Zealand", venue: "MCG, Melbourne" },
  { year: 2013, type: "Champions Trophy", champion: "India", runnerUp: "England", venue: "Edgbaston, Birmingham" },
  { year: 2012, type: "T20 World Cup", champion: "West Indies", runnerUp: "Sri Lanka", venue: "Colombo" },
  { year: 2011, type: "ODI World Cup", champion: "India", runnerUp: "Sri Lanka", venue: "Wankhede, Mumbai" },
  { year: 2007, type: "ODI World Cup", champion: "Australia", runnerUp: "Sri Lanka", venue: "Bridgetown, Barbados" },
  { year: 2007, type: "T20 World Cup", champion: "India", runnerUp: "Pakistan", venue: "Johannesburg" },
  { year: 2003, type: "ODI World Cup", champion: "Australia", runnerUp: "India", venue: "Johannesburg" },
  { year: 1999, type: "ODI World Cup", champion: "Australia", runnerUp: "Pakistan", venue: "Lord's, London" }
];