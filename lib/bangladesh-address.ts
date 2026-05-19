import geoData from '../data/bangladesh-geo-data.json';

export interface Union {
  id: string;
  upazila_id: string;
  name: string;
  name_bn: string;
}

export interface Division {
  id: string;
  name: string;
  name_en: string;
  name_bn: string;
}

export interface District {
  id: string;
  division_id: string;
  name: string;
  name_en: string;
  name_bn: string;
  lat?: string;
  lon?: string;
}

export interface Thana {
  id: string;
  district_id: string;
  name: string;
  name_bn: string;
  name_en?: string;
}

interface GeoDivision {
  id: string;
  name: string;
  bn_name: string;
}

interface GeoDistrict {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
  lat?: string;
  lon?: string;
}

interface GeoThana {
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
}

interface GeoUnion {
  id: string;
  upazila_id: string;
  name: string;
  bn_name: string;
}

// ── Dhaka Metro Data ───────────────────────────────────────────────────────

export const DHAKA_METRO_DISTRICTS_BN: Record<
  string,
  { thanas: string[]; wards: number[] }
> = {
  'ঢাকা উত্তর': {
    thanas: [
      'উত্তরা মডেল',
      'উত্তরা পশ্চিম',
      'উত্তরা পূর্ব',
      'উত্তরখান',
      'দক্ষিণখান',
      'তুরাগ',
      'বিমানবন্দর',
      'খিলক্ষেত',
      'গুলশান',
      'বনানী',
      'ভাটারা',
      'বাড্ডা',
      'রামপুরা',
      'তেজগাঁও',
      'তেজগাঁও শিল্পাঞ্চল',
      'হাতিরঝিল',
      'মোহাম্মদপুর',
      'আদাবর',
      'শেরেবাংলা নগর',
      'মিরপুর মডেল',
      'পল্লবী',
      'কাফরুল',
      'ভাসানটেক',
      'রূপনগর',
      'দারুস সালাম',
      'শাহআলী',
      'ক্যান্টনমেন্ট',
    ],
    wards: Array.from({ length: 54 }, (_, i) => i + 1),
  },
  'ঢাকা দক্ষিণ': {
    thanas: [
      'হাজারীবাগ',
      'ধানমন্ডি',
      'নিউমার্কেট',
      'কলাবাগান',
      'শাহবাগ',
      'রমনা',
      'পল্টন',
      'মতিঝিল',
      'সবুজবাগ',
      'খিলগাঁও',
      'মুগদা',
      'যাত্রাবাড়ী',
      'সূত্রাপুর',
      'কোতোয়ালী',
      'বংশাল',
      'চকবাজার',
      'লালবাগ',
      'কামরাঙ্গীরচর',
      'গেণ্ডারিয়া',
      'ওয়ারী',
      'শ্যামপুর',
      'কদমতলী',
      'ডেমরা'
    ],
    wards: Array.from({ length: 75 }, (_, i) => i + 1),
  },
};

export function isDhakaMetroDistrict(districtName: string): boolean {
  return districtName === 'ঢাকা উত্তর' || districtName === 'ঢাকা দক্ষিণ';
}

export function isDhakaMetroThana(thanaName: string): boolean {
  return Object.values(DHAKA_METRO_DISTRICTS_BN).some(d =>
    d.thanas.includes(thanaName)
  );
}

export function getWardsForDhakaMetro(districtName: string): number[] {
  return (DHAKA_METRO_DISTRICTS_BN as any)[districtName]?.wards || [];
}

// ── Data Loading & Mapping ──────────────────────────────────────────────────

const divisions: Division[] = geoData.divisions.map((d: GeoDivision) => ({
  id: d.id,
  name: d.name,
  name_en: d.name,
  name_bn: d.bn_name,
}));

const districts: District[] = geoData.districts.map((d: GeoDistrict) => ({
  id: d.id,
  division_id: d.division_id,
  name: d.name,
  name_en: d.name,
  name_bn: d.bn_name,
  lat: d.lat,
  lon: d.lon,
}));

const thanas: Thana[] = geoData.upazilas.map((t: GeoThana) => ({
  id: t.id,
  district_id: t.district_id,
  name: t.name,
  name_bn: t.bn_name,
}));

const unions: Union[] = geoData.unions.map((u: GeoUnion) => ({
  id: u.id,
  upazila_id: u.upazila_id,
  name: u.name,
  name_bn: u.bn_name,
}));

export const DIVISIONS: Division[] = divisions;
export const DISTRICTS: District[] = districts;
export const THANAS: Thana[] = thanas;
export const UNIONS: Union[] = unions;

export const DIVISIONS_LIST_BN: string[] = divisions.map(d => d.name_bn);

export const DISTRICTS_BY_DIVISION_BN: Record<string, string[]> = {};
export const THANAS_BY_DISTRICT_BN: Record<string, string[]> = {};
export const UNIONS_BY_UPAZILA_BN: Record<string, string[]> = {};

// 1. Divisions -> Districts
for (const div of divisions) {
  const divDistricts = districts.filter(d => d.division_id === div.id);
  DISTRICTS_BY_DIVISION_BN[div.name_en] = divDistricts.map(d => d.name_bn);
  DISTRICTS_BY_DIVISION_BN[div.name_bn] = divDistricts.map(d => d.name_bn);
}

// 2. Districts -> Thanas
for (const dist of districts) {
  const districtThanas = thanas.filter(t => t.district_id === dist.id);
  THANAS_BY_DISTRICT_BN[dist.name_en] = districtThanas.map(t => t.name_bn);
  THANAS_BY_DISTRICT_BN[dist.name_bn] = districtThanas.map(t => t.name_bn);
}

// 3. Thanas -> Unions
for (const thana of thanas) {
  const upazilaUnions = unions.filter(u => u.upazila_id === thana.id);
  UNIONS_BY_UPAZILA_BN[thana.name] = upazilaUnions.map(u => u.name_bn);
  UNIONS_BY_UPAZILA_BN[thana.name_bn] = upazilaUnions.map(u => u.name_bn);
}

// ── Dhaka Metro Integration ────────────────────────────────────────────────

const dhakaDivBN = "ঢাকা";
if (DISTRICTS_BY_DIVISION_BN[dhakaDivBN]) {
  if (!DISTRICTS_BY_DIVISION_BN[dhakaDivBN].includes("ঢাকা উত্তর")) {
    DISTRICTS_BY_DIVISION_BN[dhakaDivBN] = [
      ...DISTRICTS_BY_DIVISION_BN[dhakaDivBN],
      "ঢাকা উত্তর",
      "ঢাকা দক্ষিণ",
    ];
  }
}

// Also add to English key if it exists
if (DISTRICTS_BY_DIVISION_BN["Dhaka"]) {
  if (!DISTRICTS_BY_DIVISION_BN["Dhaka"].includes("ঢাকা উত্তর")) {
    DISTRICTS_BY_DIVISION_BN["Dhaka"] = [
      ...DISTRICTS_BY_DIVISION_BN["Dhaka"],
      "ঢাকা উত্তর",
      "ঢাকা দক্ষিণ",
    ];
  }
}

// Map Metro Thanas
for (const [metroDist, data] of Object.entries(DHAKA_METRO_DISTRICTS_BN)) {
  THANAS_BY_DISTRICT_BN[metroDist] = (data as any).thanas;
}

// ── Exported Helpers ────────────────────────────────────────────────────────

export function getDistrictsOfDivisionBN(division: string): string[] {
  return DISTRICTS_BY_DIVISION_BN[division] || [];
}

export function getThanasOfDistrictBN(district: string): string[] {
  return THANAS_BY_DISTRICT_BN[district] || [];
}

export function getDivisionById(id: string): Division | undefined {
  return divisions.find(d => d.id === id);
}

export function getDistrictById(id: string): District | undefined {
  return districts.find(d => d.id === id);
}

export function getThanaById(id: string): Thana | undefined {
  return thanas.find(t => t.id === id);
}
