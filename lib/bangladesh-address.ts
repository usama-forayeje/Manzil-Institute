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

export const DIVISIONS_LIST: string[] = divisions.map(d => d.name_en);
export const DIVISIONS_LIST_BN: string[] = divisions.map(d => d.name_bn);

export const DISTRICTS_BY_DIVISION: Record<string, string[]> = {};
export const DISTRICTS_BY_DIVISION_BN: Record<string, string[]> = {};
export const THANAS_BY_DISTRICT: Record<string, string[]> = {};
export const THANAS_BY_DISTRICT_BN: Record<string, string[]> = {};
export const UNIONS_BY_UPAZILA: Record<string, string[]> = {};
export const UNIONS_BY_UPAZILA_BN: Record<string, string[]> = {};

for (const div of divisions) {
  const divDistricts = districts.filter(d => d.division_id === div.id);
  // Use English name as key
  DISTRICTS_BY_DIVISION[div.name_en] = divDistricts.map(d => d.name_en);
  DISTRICTS_BY_DIVISION_BN[div.name_en] = divDistricts.map(d => d.name_bn);
  // Fix: Add Bengali name as key too (matching DIVISIONS_LIST_BN)
  DISTRICTS_BY_DIVISION_BN[div.name_bn] = divDistricts.map(d => d.name_bn);
}

for (const dist of districts) {
  const districtThanas = thanas.filter(t => t.district_id === dist.id);
  THANAS_BY_DISTRICT[dist.name_en] = districtThanas.map(t => t?.name_en);
  // Fix: Add Bengali keys for both English and Bengali district names
  THANAS_BY_DISTRICT_BN[dist.name_en] = districtThanas.map(t => t.name_bn);
  THANAS_BY_DISTRICT_BN[dist.name_bn] = districtThanas.map(t => t.name_bn);
}

for (const thana of thanas) {
  const upazilaUnions = unions.filter(u => u.upazila_id === thana.id);
  UNIONS_BY_UPAZILA[thana.name] = upazilaUnions.map(u => u.name);
  UNIONS_BY_UPAZILA_BN[thana.name_bn] = upazilaUnions.map(u => u.name_bn);
}

export function getDistrictsOfDivision(division: string): string[] {
  return DISTRICTS_BY_DIVISION[division] || [];
}

export function getDistrictsOfDivisionBN(division: string): string[] {
  return DISTRICTS_BY_DIVISION_BN[division] || [];
}

export function getThanasOfDistrict(district: string): string[] {
  return THANAS_BY_DISTRICT[district] || [];
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

// Dhaka Metro Special Districts (DNCC & DSCC)
// Dhaka North = Dhaka North City Corporation (DNCC)
// Dhaka South = Dhaka South City Corporation (DSCC)

export const DHAKA_METRO_DISTRICTS_BN: Record<
  string,
  { thanas: string[]; wards: number[] }
> = {
  'ঢাকা উত্তর': {
    thanas: [
      'উত্তরা পূর্ব',
      'উত্তরা পশ্চিম',
      'উত্তরখান',
      'দক্ষিণখান',
      'তুরাগ',
      'মিরপুর',
      'পল্লবী',
      'কাফরুল',
      'শেরেবাংলা নগর',
      'তেজগাঁও',
      'তেজগাঁও শিল্পাঞ্চল',
      'গুলশান',
      'বনানী',
      'ভাটারা',
      'বাড্ডা',
      'খিলক্ষেত',
    ],
    wards: Array.from({ length: 54 }, (_, i) => i + 1), // 54 wards DNCC
  },
  'ঢাকা দক্ষিণ': {
    thanas: [
      'কোতোয়ালী',
      'সূত্রাপুর',
      'বংশাল',
      'চকবাজার',
      'লালবাগ',
      'হাজারীবাগ',
      'কামরাঙ্গীরচর',
      'শাহবাগ',
      'রমনা',
      'মতিঝিল',
      'পল্টন',
      'ওয়ারী',
      'যাত্রাবাড়ী',
      'শ্যামপুর',
      'কদমতলী',
      'ডেমরা',
    ],
    wards: Array.from({ length: 75 }, (_, i) => i + 1), // 75 wards DSCC
  },
};

// Check if a district is Dhaka Metro
export function isDhakaMetroDistrict(districtName: string): boolean {
  return districtName === 'ঢাকা উত্তর' || districtName === 'ঢাকা দক্ষিণ';
}

// Check if a thana belongs to Dhaka Metro
export function isDhakaMetroThana(thanaName: string): boolean {
  return Object.values(DHAKA_METRO_DISTRICTS_BN).some(d =>
    d.thanas.includes(thanaName)
  );
}

// Get wards for Dhaka Metro thana
export function getWardsForDhakaMetro(districtName: string): number[] {
  return DHAKA_METRO_DISTRICTS_BN[districtName]?.wards || [];
}
