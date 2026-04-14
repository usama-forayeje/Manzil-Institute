import { z } from "zod";

// ─── Constants ─────────────────────────────────────────────
export const DESIGNATION_LABELS: Record<string, string> = {
  principal: "অধ্যক্ষ / প্রিন্সিপাল (Principal)",
  secondary_principal: "সহকারী অধ্যক্ষ (Secondary Principal)",
  headmaster: "প্রধান শিক্ষক (Headmaster)",
  assistant_teacher: "সহকারী শিক্ষক (Assistant Teacher)",
  general_teacher: "জেনারেল শিক্ষক (General Teacher)",

  residential_teacher: "আবাসিক শিক্ষক (Residential Teacher)",
  unResidential_teacher: "অনাবাসিক শিক্ষক (Unresidential Teacher)",
  hifz_teacher: "হিফজ শিক্ষক (Hifz Teacher)",
  nazera_teacher: "নাজেরা শিক্ষক (Nazera Teacher)",
  unpaid_teacher: "অবৈতনিক শিক্ষক (Unpaid Teacher)",
  accountant: "হিসাবরক্ষক (Accountant)",
  staff: "স্টাফ (Staff)",
  guard: "নিরাপত্তা রক্ষী (Security Guard / Guard)",
  caretaker: "তত্ত্বাবধায়ক (Caretaker)",
  adviser: "উপদেষ্টা (Adviser)",
  web_developer: "ওয়েব ডেভেলপার (Web Developer)",
  digital_marketer: "ডিজিটাল মার্কেটার (Digital Marketer)",
  graphics_designer: "গ্রাফিক্স ডিজাইনার (Graphics Designer)",
  content_writer: "কন্টেন্ট রাইটার (Content Writer)",
  it_teacher: "আইটি শিক্ষক (IT Teacher)",
  librarian: "লাইব্রেরিয়ান (Librarian)",
  lab_assistant: "ল্যাব সহকারী (Lab Assistant)",
  office_assistant: "অফিস সহকারী (Office Assistant)",
  driver: "ড্রাইভার (Driver)",
  cleaner: "পরিচ্ছন্নতা কর্মী (Cleaner)",
  other: "অন্যান্য (Other)",
};

export const TEACHER_DESIGNATIONS = [
  "assistant_teacher",
  "general_teacher",
  "unpaid_teacher",
  "residential_teacher",
  "hifz_teacher",
  "nazera_teacher",
  "headmaster",
  "principal",
  "secondary_principal",
];

// Non-teacher/Staff designations for special handling
export const NON_TEACHER_DESIGNATIONS = [
  "staff",
  "guard",
  "caretaker",
  "cleaner",
  "driver",
  "cook",
  "office_assistant",
  "accountant",
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-", "unknown"];

export const MARITAL_STATUS_LABELS: Record<string, string> = {
  unmarried: "অবিবাহিত (Unmarried)",
  married: "বিবাহিত (Married)",
  widowed: "বিধবা/বিপত্নীক (Widowed)",
  divorced: "তালাকপ্রাপ্ত (Divorced)",
};

export const RELIGION_LABELS: Record<string, string> = {
  islam: "ইসলাম (Islam)",
  hinduism: "হিন্দু (Hinduism)",
  other: "অন্যান্য (Other)",
};
export const RELATIONSHIP_LABELS: Record<string, string> = {
  father: "পিতা (Father)",
  mother: "মাতা (Mother)",
  spouse: "স্বামী/স্ত্রী (Spouse)",
  brother: "ভাই (Brother)",
  sister: "বোন (Sister)",
  uncle: "চাচা/মামা (Uncle)",
  aunt: "ফুফু/খালা (Aunt)",
  teacher: "শিক্ষক (Teacher)",
  friend: "বন্ধু (Friend)",
  other: "অন্যান্য (Other)",
};


export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank: "ব্যাংক (Bank)",
  mobile_banking: "মোবাইল ব্যাংকিং (bKash/Nagad/Rocket)",
  cash: "নগদ (Cash)",
};

export const MOBILE_BANKING_PROVIDERS: Record<string, string> = {
  bkash: "বিকাশ (bKash)",
  nagad: "নগদ (Nagad)",
  rocket: "রকেট (Rocket)",
  upay: "উপায় (Upay)",
};

export const DIVISIONS = [
  "Dhaka", "Chattogram", "Rajshahi", "Khulna",
  "Barishal", "Sylhet", "Rangpur", "Mymensingh",
];

export const DIVISION_LABELS: Record<string, string> = {
  Dhaka: "ঢাকা (Dhaka)",
  Chattogram: "চট্টগ্রাম (Chattogram)",
  Rajshahi: "রাজশাহী (Rajshahi)",
  Khulna: "খুলনা (Khulna)",
  Barishal: "বরিশাল (Barishal)",
  Sylhet: "সিলেট (Sylhet)",
  Rangpur: "রংপুর (Rangpur)",
  Mymensingh: "ময়মনসিংহ (Mymensingh)",
};

export const DISTRICTS_BY_DIVISION: Record<string, string[]> = {
  Dhaka: [
    "ঢাকা", "ফরিদপুর", "গাজীপুর", "গোপালগঞ্জ", "কিশোরগঞ্জ", "মাদারীপুর",
    "মানিকগঞ্জ", "মুন্সীগঞ্জ", "নারায়ণগঞ্জ", "নরসিংদী", "রাজবাড়ী",
    "শরীয়তপুর", "টাঙ্গাইল"
  ],
  Chattogram: [
    "বান্দরবান", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "চট্টগ্রাম", "কক্সবাজার",
    "ফেনী", "খাগড়াছড়ি", "লক্ষ্মীপুর", "নোয়াখালী", "রাঙ্গামাটি"
  ],
  Rajshahi: [
    "বগুড়া", "জয়পুরহাট", "নওগাঁ", "নাটোর", "চাঁপাইনবাবগঞ্জ", "পাবনা",
    "রাজশাহী", "সিরাজগঞ্জ"
  ],
  Khulna: [
    "বাগেরহাট", "চুয়াডাঙ্গা", "যশোর", "ঝিনাইদহ", "খুলনা", "কুষ্টিয়া",
    "মাগুরা", "মেহেরপুর", "নড়াইল", "সাতক্ষীরা"
  ],
  Barishal: [
    "বরগুনা", "বরিশাল", "ভোলা", "ঝালকাঠি", "পটুয়াখালী", "পিরোজপুর"
  ],
  Sylhet: [
    "হবিগঞ্জ", "মৌলভীবাজার", "সুনামগঞ্জ", "সিলেট"
  ],
  Rangpur: [
    "দিনাজপুর", "গাইবান্ধা", "কুড়িগ্রাম", "লালমনিরহাট", "নীলফামারী",
    "পঞ্চগড়", "রংপুর", "ঠাকুরগাঁও"
  ],
  Mymensingh: [
    "জামালপুর", "ময়মনসিংহ", "নেত্রকোণা", "শেরপুর"
  ],
};

export const UPAZILAS_BY_DISTRICT: Record<string, string[]> = {
  // Dhaka Division
  "ঢাকা": ["ধামরাই", "দোহার", "কেরানীগঞ্জ", "নবাবগঞ্জ", "সাভার"],
  "ফরিদপুর": ["আলফাডাঙ্গা", "ভাঙ্গা", "বোয়ালমারী", "চরভদ্রাসন", "ফরিদপুর সদর", "মধুখালী", "নগরকান্দা", "সদরপুর", "সালথা"],
  "গাজীপুর": ["গাজীপুর সদর", "কালিয়াকৈর", "কালীগঞ্জ", "কাপাসিয়া", "শ্রীপুর"],
  "গোপালগঞ্জ": ["গোপালগঞ্জ সদর", "কাশিয়ানী", "কোটালীপাড়া", "মুকসুদপুর", "টুঙ্গিপাড়া"],
  "কিশোরগঞ্জ": ["অষ্টগ্রাম", "বাজিতপুর", "ভৈরব", "হোসেনপুর", "ইটনা", "করিমগঞ্জ", "কটিয়াদী", "কিশোরগঞ্জ সদর", "কুলিয়ারচর", "মিঠামইন", "নিকলী", "পাকুন্দিয়া", "তাড়াইল"],
  "মাদারীপুর": ["রাজৈর", "মাদারীপুর সদর", "কালকিনি", "শিবচর"],
  "মানিকগঞ্জ": ["দৌলতপুর", "ঘিওর", "হরিরামপুর", "মানিকগঞ্জ সদর", "সাটুরিয়া", "শিবালয়", "সিংগাইর"],
  "মুন্সীগঞ্জ": ["গজারিয়া", "লৌহজং", "মুন্সীগঞ্জ সদর", "সিরাজদিখান", "শ্রীনগর", "টংগিবাড়ী"],
  "নারায়ণগঞ্জ": ["আড়াইহাজার", "বন্দর", "নারায়ণগঞ্জ সদর", "রূপগঞ্জ", "সোনারগাঁও"],
  "নরসিংদী": ["নরসিংদী সদর", "বেলাবো", "মনোহরদী", "পলাশ", "রায়পুরা", "শিবপুর"],
  "রাজবাড়ী": ["বালিয়াকান্দি", "গোয়ালন্দ", "পাংশা", "রাজবাড়ী সদর", "কালুখালী"],
  "শরীয়তপুর": ["ভেদরগঞ্জ", "ডামুড্যা", "গোসাইরহাট", "নড়িয়া", "শরীয়তপুর সদর", "জাজিরা"],
  "টাঙ্গাইল": ["গোপালপুর", "বাসাইল", "ভুয়াপুর", "দেলদুয়ার", "ঘাটাইল", "কালিহাতী", "মধুপুর", "মির্জাপুর", "নাগরপুর", "সখিপুর", "টাঙ্গাইল সদর", "ধনবাড়ী"],

  // Chattogram Division
  "বান্দরবান": ["বান্দরবান সদর", "থানচি", "রুমা", "রোয়াংছড়ি", "লামা", "আলী কদম", "নাইক্ষ্যংছড়ি"],
  "ব্রাহ্মণবাড়িয়া": ["ব্রাহ্মণবাড়িয়া সদর", "আশুগঞ্জ", "নাসিরনগর", "নবীনগর", "সরাইল", "শাহবাজপুর", "কসবা", "আখাউড়া", "বাঞ্ছারামপুর", "বিজয়নগর"],
  "চাঁদপুর": ["চাঁদপুর সদর", "হাইমচর", "কচুয়া", "ফরিদগঞ্জ", "মতলব উত্তর", "মতলব দক্ষিণ", "হাজীগঞ্জ", "শাহরাস্তি"],
  "চট্টগ্রাম": ["আনোয়ারা", "বাঁশখালী", "বোয়ালখালী", "চন্দনাইশ", "ফটিকছড়ি", "হাটহাজারী", "লোহাগাড়া", "মিরসরাই", "পটিয়া", "রাঙ্গুনিয়া", "রাউজান", "সন্দ্বীপ", "সাতকানিয়া", "সীতাকুণ্ড", "কর্ণফুলী"],
  "কক্সবাজার": ["চকোরিয়া", "কক্সবাজার সদর", "কুতুবদিয়া", "মহেশখালী", "রামু", "টেকনাফ", "উখিয়া", "পেকুয়া"],
  "ফেনী": ["ফেনী সদর", "ছাগলনাইয়া", "দাগনভূঞা", "পরশুরাম", "ফুলগাজী", "সোনাগাজী"],
  "খাগড়াছড়ি": ["দীঘিনালা", "খাগড়াছড়ি সদর", "লক্ষ্মীছড়ি", "মহালছড়ি", "মানিকছড়ি", "মাটিরাঙ্গা", "পানছড়ি", "রামগড়"],
  "লক্ষ্মীপুর": ["লক্ষ্মীপুর সদর", "রায়পুর", "রামগঞ্জ", "রামগতি", "কমলনগর"],
  "নোয়াখালী": ["নোয়াখালী সদর", "বেগমগঞ্জ", "চাটখিল", "কোম্পানীগঞ্জ", "সেনবাগ", "হাতিয়া", "সুবর্ণচর", "সোনাইমুড়ী", "কবিরহাট"],
  "রাঙ্গামাটি": ["রাঙ্গামাটি সদর", "বেলাছড়ি", "বাঘাইছড়ি", "বরকল", "জুরাছড়ি", "লংগদু", "নানিয়ারচর", "কাপ্তাই", "রাজস্থলী", "কাউখালী"],

  // Rajshahi Division
  "বগুড়া": ["আদমদীঘি", "বগুড়া সদর", "ধুনট", "দুপচাঁচিয়া", "গাবতলী", "কাহালু", "নন্দীগ্রাম", "সারিয়াকান্দি", "শেরপুর", "শিবগঞ্জ", "সোনাতলা", "শাজাহানপুর"],
  "জয়পুরহাট": ["আক্কেলপুর", "জয়পুরহাট সদর", "কালাই", "ক্ষেতলাল", "পাঁচবিবি"],
  "নওগাঁ": ["আত্রাই", "ধামইরহাট", "মহাদেবপুর", "নওগাঁ সদর", "নিয়ামতপুর", "পত্নীতলা", "পোরশা", "রাণীনগর", "সাপাহার", "বদলগাছী", "মান্দা"],
  "নাটোর": ["বাগাতিপাড়া", "বড়াইগ্রাম", "গুরুদাসপুর", "লালপুর", "নাটোর সদর", "সিংড়া", "নলডাঙ্গা"],
  "চাঁপাইনবাবগঞ্জ": ["ভোলাহাট", "গোমস্তাপুর", "নাচোল", "চাঁপাইনবাবগঞ্জ সদর", "শিবগঞ্জ"],
  "পাবনা": ["আটঘরিয়া", "বেড়া", "ভাঙ্গুড়া", "চাটমোহর", "ফরিদপুর", "ঈশ্বরদী", "পাবনা সদর", "সাঁথিয়া", "সুজানগর"],
  "রাজশাহী": ["বাঘা", "বাগমারা", "চারঘাট", "দুর্গাপুর", "গোদাগাড়ী", "মোহনপুর", "পবা", "পুঠিয়া", "তানোর"],
  "সিরাজগঞ্জ": ["বেলকুচি", "চৌহালী", "কামারখন্দ", "কাজীপুর", "রায়গঞ্জ", "শাহজাদপুর", "সিরাজগঞ্জ সদর", "তাড়াশ", "উল্লাপাড়া"],

  // Khulna Division
  "বাগেরহাট": ["বাগেরহাট সদর", "চিতলমারী", "ফকিরহাট", "কচুয়া", "মোল্লাহাট", "মোংলা", "মোড়েলগঞ্জ", "রামপাল", "শরণখোলা"],
  "চুয়াডাঙ্গা": ["আলমডাঙ্গা", "চুয়াডাঙ্গা সদর", "দামুড়হুদা", "জীবননগর"],
  "যশোর": ["অভয়নগর", "বাঘেরপাড়া", "চৌগাছা", "ঝিকরগাছা", "কেশবপুর", "যশোর সদর", "মণিরামপুর", "শার্শা"],
  "ঝিনাইদহ": ["হরিনাকুণ্ডু", "ঝিনাইদহ সদর", "কালীগঞ্জ", "কোটচাঁদপুর", "মহেশপুর", "শৈলকুপা"],
  "খুলনা": ["বটিয়াঘাটা", "দাকোপ", "দুমুরিয়া", "দিঘলিয়া", "কয়রা", "পাইকগাছা", "ফুলতলা", "রূপসা", "তেরখাদা"],
  "কুষ্টিয়া": ["ভেড়ামারা", "দৌলতপুর", "খোকসা", "কুমারখালী", "কুষ্টিয়া সদর", "মিরপুর"],
  "মাগুরা": ["মাগুরা সদর", "মহম্মদপুর", "শালিখা", "শ্রীপুর"],
  "মেহেরপুর": ["গাংনী", "মেহেরপুর সদর", "মুজিবনগর"],
  "নড়াইল": ["কালিয়া", "লোহাগাড়া", "নড়াইল সদর"],
  "সাতক্ষীরা": ["আশাশুনি", "দেবহাটা", "কলারোয়া", "কালিগঞ্জ", "সাতক্ষীরা সদর", "শ্যামনগর", "তালা"],

  // Barishal Division
  "বরগুনা": ["আমতলী", "বামনা", "বরগুনা সদর", "বেতাগী", "পাথরঘাটা", "তালতলী"],
  "বরিশাল": ["আগৈলঝাড়া", "বাবুগঞ্জ", "বাকেরগঞ্জ", "বানারীপাড়া", "গৌরনদী", "হিজলা", "বরিশাল সদর", "মেহেন্দিগঞ্জ", "মুলাদী", "উজিরপুর"],
  "ভোলা": ["ভোলা সদর", "বোরহানউদ্দিন", "চরফ্যাশন", "দৌলতখান", "লালমোহন", "মনপুরা", "তজুমদ্দিন"],
  "ঝালকাঠি": ["ঝালকাঠি সদর", "কাঠালিয়া", "নলছিটি", "রাজাপুর"],
  "পটুয়াখালী": ["বাউফল", "দশমিনা", "গলাচিপা", "কলাপাড়া", "মির্জাগঞ্জ", "পটুয়াখালী সদর", "রাঙ্গাবালী", "দুমকি"],
  "পিরোজপুর": ["ভাণ্ডারিয়া", "কাউখালী", "মঠবাড়িয়া", "নাজিরপুর", "পিরোজপুর সদর", "নেছারাবাদ (স্বরূপকাঠি)", "ইন্দুরকানি"],

  // Sylhet Division
  "হবিগঞ্জ": ["আজমিরীগঞ্জ", "বাহুবল", "বানিয়াচং", "চুনারুঘাট", "হবিগঞ্জ সদর", "লাখাই", "মাধবপুর", "নবীগঞ্জ", "শায়েস্তাগঞ্জ"],
  "মৌলভীবাজার": ["বড়লেখা", "কমলগঞ্জ", "কুলাউড়া", "মৌলভীবাজার সদর", "রাজনগর", "শ্রীমঙ্গল", "জুড়ী"],
  "সুনামগঞ্জ": ["বিশ্বম্ভরপুর", "ছাতক", "দক্ষিণ সুনামগঞ্জ", "দিরাই", "ধর্মপাশা", "দোয়ারাবাজার", "জগন্নাথপুর", "জামালগঞ্জ", "শাল্লা", "সুনামগঞ্জ সদর", "তাহিরপুর", "মধ্যনগর"],
  "সিলেট": ["বালাগঞ্জ", "বিয়ানীবাজার", "বিশ্বনাথ", "ফেঞ্চুগঞ্জ", "গোলাপগঞ্জ", "গোয়াইনঘাট", "জৈন্তাপুর", "কানাইঘাট", "সিলেট সদর", "জকিগঞ্জ", "দক্ষিণ সুরমা", "ওসমানী নগর"],

  // Rangpur Division
  "দিনাজপুর": ["বিরামপুর", "বীরগঞ্জ", "বিরল", "বোচাগঞ্জ", "চিরিরবন্দর", "ফুলবাড়ী", "ঘোড়াঘাট", "হাকিমপুর", "কাহারোল", "খানসামা", "দিনাজপুর সদর", "নবাবগঞ্জ", "পার্বতীপুর"],
  "গাইবান্ধা": ["ফুলছড়ি", "গাইবান্ধা সদর", "গোবিন্দগঞ্জ", "পলাশবাড়ী", "সাদুল্লাপুর", "সাঘাটা", "সুন্দরগঞ্জ"],
  "কুড়িগ্রাম": ["ভুরুঙ্গামারী", "চিলমারী", "ফুলবাড়ী", "কুড়িগ্রাম সদর", "নগেশ্বরী", "রাজারহাট", "রৌমারী", "উলিপুর", "চর রাজিবপুর"],
  "লালমনিরহাট": ["আদিতমারী", "হাতীবান্ধা", "কালীগঞ্জ", "লালমনিরহাট সদর", "পাটগ্রাম"],
  "নীলফামারী": ["ডিমলা", "ডোমার", "জলঢাকা", "কিশোরগঞ্জ", "নীলফামারী সদর", "সৈয়দপুর"],
  "পঞ্চগড়": ["আটোয়ারী", "বোদা", "দেবীগঞ্জ", "পঞ্চগড় সদর", "তেঁতুলিয়া"],
  "রংপুর": ["বদরগঞ্জ", "গংগাচড়া", "কাউনিয়া", "রংপুর সদর", "মিঠাপুকুর", "পীরগাছা", "পীরগঞ্জ", "তারাগঞ্জ"],
  "ঠাকুরগাঁও": ["বালিয়াডাঙ্গী", "হরিপুর", "পীরগঞ্জ", "রাণীশংকৈল", "ঠাকুরগাঁও সদর"],

  // Mymensingh Division
  "জামালপুর": ["বকশীগঞ্জ", "দেওয়ানগঞ্জ", "ইসলামপুর", "জামালপুর সদর", "মাদারগঞ্জ", "মেলান্দহ", "সরিষাবাড়ী"],
  "ময়মনসিংহ": ["ত্রিশাল", "ধোবাউড়া", "ফুলবাড়িয়া", "গফরগাঁও", "গৌরীপুর", "হালুয়াঘাট", "ঈশ্বরগঞ্জ", "মুক্তাগাছা", "ময়মনসিংহ সদর", "নান্দাইল", "ফুলপুর", "তারাকান্দা"],
  "নেত্রকোণা": ["আটপাড়া", "বারহাট্টা", "দুর্গাপুর", "খালিয়াজুড়ি", "কলমাকান্দা", "কেন্দুয়া", "মদন", "মোহনগঞ্জ", "নেত্রকোণা সদর", "পূর্বধলা"],
  "শেরপুর": ["ঝিনাইগাতী", "নকলা", "নালিতাবাড়ী", "শেরপুর সদর", "শ্রীবরদী"],
};

// ─── Helper Schemas ─────────────────────────────────────────
const addressSchema = z.object({
  division: z.string().min(1, "বিভাগ নির্বাচন করুন").optional().or(z.literal("")),
  district: z.string().min(1, "জেলা নির্বাচন করুন").optional().or(z.literal("")),
  upazila: z.string().min(1, "উপজেলা নির্বাচন করুন").optional().or(z.literal("")),
  thana: z.string().min(1, "থানা উল্লেখ করুন").optional().or(z.literal("")),
  postOffice: z.string().min(1, "পোস্ট অফিস উল্লেখ করুন").optional().or(z.literal("")),
  village: z.string().min(1, "গ্রাম/এলাকা অবশ্যই দিতে হবে").optional().or(z.literal("")),
  postCode: z.string().max(10).optional().or(z.literal("")),
});

// ─── Step 1: Personal & Family Information ─────────────────
export const personalFamilySchema = z.object({
  nameEn: z
    .string()
    .min(3, "English name must be at least 3 characters")
    .max(100),
  nameBn: z
    .string()
    .min(2, "বাংলায় পূর্ণ নাম দিতে হবে")
    .max(100),
  fatherNameBn: z
    .string()
    .min(2, "পিতার নাম বাংলায় দিতে হবে")
    .max(100),
  fatherNameEn: z
    .string()
    .min(3, "Father's name in English is required")
    .max(100),
  motherNameBn: z
    .string()
    .min(2, "মাতার নাম বাংলায় দিতে হবে")
    .max(100),
  motherNameEn: z
    .string()
    .min(3, "Mother's name in English is required")
    .max(100),
  gender: z.string().min(1, "লিঙ্গ নির্বাচন করুন"),
  maritalStatus: z.enum(["unmarried", "married", "widowed", "divorced"], {
    message: "বৈবাহিক অবস্থা নির্বাচন করুন",
  }),
  religion: z.enum(["islam", "hinduism", "christianity", "buddhism", "other"], {
    message: "ধর্ম নির্বাচন করুন",
  }),
  nationality: z
    .string()
    .min(2, "জাতীয়তা দিতে হবে")
    .default("বাংলাদেশী"),
  photoUrl: z.string().optional(),
  photoFile: z.any().optional(),
});

export type PersonalFamilyData = z.infer<typeof personalFamilySchema>;

// ─── Step 2: Address & Identity ────────────────────────────
// Empty permanent address schema for when same as current
const emptyPermanentAddress = z.object({
  division: z.string(),
  district: z.string(),
  upazila: z.string(),
  thana: z.string(),
  postOffice: z.string(),
  village: z.string(),
  postCode: z.string().optional().or(z.literal("")),
});

export const addressIDSchema = z.object({
  currentAddress: addressSchema,
  permanentSameAsCurrent: z.boolean().default(false),
  permanentAddress: emptyPermanentAddress.optional(),
  // NID - Bengali digit support
  nidNumber: z
    .string()
    .transform((val) => convertToEnglishDigits(val))
    .pipe(z.string().regex(/^(\d{10}|\d{17})$/).optional()),
  dateOfBirth: z.string().min(1, "জন্ম তারিখ দিতে হবে").optional().or(z.literal("")),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-", "unknown"])
    .optional()
    .default("unknown"),
  nidFrontCopyFile: z.any().optional(),
  nidBackCopyFile: z.any().optional(),
  nidFrontCopyUrl: z.string().optional(),
  nidBackCopyUrl: z.string().optional(),
}).superRefine((data, ctx) => {
  // Only validate permanent address if NOT same as current
  if (!data.permanentSameAsCurrent) {
    const pa = data.permanentAddress;
    // Only check if permanentAddress has actual values (not empty)
    if (pa && pa.division) {
      if (!pa?.district) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "স্থায়ী ঠিকানার জেলা দিন", path: ["permanentAddress", "district"] });
      if (!pa?.upazila) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "স্থায়ী ঠিকানার উপজেলা দিন", path: ["permanentAddress", "upazila"] });
      if (!pa?.thana) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "স্থায়ী ঠিকানার থানা দিন", path: ["permanentAddress", "thana"] });
      if (!pa?.postOffice) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "স্থায়ী ঠিকানার পোস্ট অফিস দিন", path: ["permanentAddress", "postOffice"] });
      if (!pa?.village) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "স্থায়ী ঠিকানার গ্রাম/এলাকা দিন", path: ["permanentAddress", "village"] });
    } else {
      // If same as current is NOT checked, permanent address is required
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "স্থায়ী ঠিকানার বিভাগ দিন", path: ["permanentAddress", "division"] });
    }
  }
  // NID validation is handled manually in the component
});

export type AddressIDData = z.infer<typeof addressIDSchema>;

// ─── Step 3: Professional & Educational (Dynamic) ──────────

// Bengali to English digit converter for year field
const convertToEnglishDigits = (str: string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = str;
  bengaliDigits.forEach((bd, i) => {
    result = result.replace(new RegExp(bd, 'g'), englishDigits[i]);
  });
  return result;
};

export const professionalEducationSchema = z.object({
  designation: z.string().min(1, "পদবী নির্বাচন করুন"),
  designationCustom: z.string().optional(),
  employmentType: z.enum(["permanent", "contract"], {
    message: "চাকরির ধরন নির্বাচন করুন",
  }),
  // Education - accepts both Bengali and English year
  education: z.array(z.object({
    degree: z.string().min(1, "শিক্ষাগত যোগ্যতা/ডিগ্রীর নাম দিন"),
    institution: z.string().min(1, "শিক্ষাপ্রতিষ্ঠানের নাম দিন"),
    year: z.string()
      .transform((val) => convertToEnglishDigits(val)) // Convert Bengali to English
      .refine((val) => val.length === 4, { message: "৪ সংখ্যার সাল দিন" })
      .refine((val) => /^\d{4}$/.test(val), { message: "সঠিক সাল দিন" })
      .refine((val) => {
        const year = parseInt(val, 10);
        const currentYear = new Date().getFullYear();
        return year >= 1950 && year <= currentYear + 5;
      }, { message: "বৈধ সাল দিন" }),
  })).min(1, "অন্তত একটি শিক্ষাগত যোগ্যতা যোগ করুন"),
  // Social Media Links
  socialLinks: z.object({
    facebook: z.string().url("সঠিক ফেসবুক লিংক দিন").optional().or(z.literal("")),
    instagram: z.string().url("সঠিক ইনস্টাগ্রাম লিংক দিন").optional().or(z.literal("")),
    twitter: z.string().url("সঠিক X (Twitter) লিংক দিন").optional().or(z.literal("")),
    linkedin: z.string().url("সঠিক লিঙ্কডইন লিংক দিন").optional().or(z.literal("")),
    website: z.string().url("সঠিক ওয়েবসাইট লিংক দিন").optional().or(z.literal("")),
  }).optional(),
  // Previous Experience - Bengali digit support
  previousWorkplace: z.string().optional().or(z.literal("")),
  previousWorkDuration: z.string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val ? convertToEnglishDigits(val) : ""),
  totalExperienceYears: z.string()
    .optional()
    .transform((val) => {
      if (!val) return 0;
      const num = parseInt(convertToEnglishDigits(val), 10);
      return isNaN(num) ? 0 : num;
    }),
  // Role specific fields
  isHafiz: z.boolean().optional().default(false),
  specialSkills: z.string().max(500).optional().or(z.literal("")),
  certificateFiles: z.any().optional(),
  experienceLetterFile: z.any().optional(),
  cvFile: z.any().refine((files) => files?.length > 0 || files instanceof File, { message: "CV আবশ্যিক" }),
  tazkiyahFile: z.any().optional(),
  // URLs
  certificateUrls: z.array(z.string()).optional(),
  experienceLetterUrl: z.string().optional(),
  cvUrl: z.string().optional(),
  tazkiyahUrl: z.string().optional(),
});

export type ProfessionalEducationData = z.infer<typeof professionalEducationSchema>;

// ─── Step 5: Contact Reference ───────────────────────────────

// Phone number helper - converts Bengali digits to English
const convertPhoneToEnglish = (val: string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = val;
  bengaliDigits.forEach((bd, i) => {
    result = result.replace(new RegExp(bd, 'g'), englishDigits[i]);
  });
  return result;
};

export const contactReferenceSchema = z.object({
  // Phone numbers (Main contact info) - accepts Bengali or English digits
  phonePrimary: z
    .string()
    .transform((val) => convertPhoneToEnglish(val))
    .pipe(z.string().min(11).max(14).regex(/^(\+880|880|0)1[3-9]\d{8}$/)),
  phoneSecondary: z
    .string()
    .transform((val) => val ? convertPhoneToEnglish(val) : "")
    .pipe(z.string().regex(/^(\+880|880|0)1[3-9]\d{8}$/).optional()),
  email: z
    .string()
    .email("সঠিক ইমেইল ঠিকানা দিন")
    .optional()
    .or(z.literal("")),
  // Emergency Contact - Bengali digit support
  emergencyContactNo: z
    .string()
    .transform((val) => convertPhoneToEnglish(val))
    .pipe(z.string().min(11).max(14).regex(/^(\+880|880|0)1[3-9]\d{8}$/)),
  emergencyRelationship: z.string().min(1, "সম্পর্ক নির্বাচন করুন"),
  // WhatsApp - Bengali digit support
  whatsappNo: z
    .string()
    .transform((val) => val ? convertPhoneToEnglish(val) : "")
    .pipe(z.string().min(11).max(14).regex(/^(\+880|880|0)1[3-9]\d{8}$/).optional()),
  // Reference - Bengali digit support
  referenceName: z.string().min(2, "সুপারিশকারীর নাম দিতে হবে"),
  referencePhone: z
    .string()
    .transform((val) => convertPhoneToEnglish(val))
    .pipe(z.string().min(11)),
  referenceOccupation: z.string().optional().or(z.literal("")),
});

export type ContactReferenceData = z.infer<typeof contactReferenceSchema>;

// ─── Step 4: Payment & Reference ───────────────────────────
export const paymentReferenceSchema = z.object({
  expectedSalary: z
    .number({ message: "বেতন সংখ্যায় প্রদান করুন" })
    .min(500, "সঠিক বেতন উল্লেখ করুন"),
  expectedJoiningDate: z.string().min(1, "প্রত্যাশিত যোগদানের তারিখ দিন"),
  // Payment Info
  paymentMethod: z.enum(["bank", "mobile_banking", "cash"], {
    message: "পেমেন্টের মাধ্যম নির্বাচন করুন",
  }),
  bankName: z.string().optional().or(z.literal("")),
  bankBranch: z.string().optional().or(z.literal("")),
  accountName: z.string().optional().or(z.literal("")),
  // Account number - Bengali digit support
  accountNumber: z
    .string()
    .transform((val) => convertToEnglishDigits(val))
    .optional()
    .or(z.literal("")),
  mobileBankingProvider: z.enum(["bkash", "nagad", "rocket", "upay"]).optional(),
  // Mobile banking number - Bengali digit support
  mobileBankingNumber: z
    .string()
    .transform((val) => convertToEnglishDigits(val))
    .pipe(z.string().regex(/^(\+880|880|0)1[3-9]\d{8}$/).optional()),
  // Declaration
  declaration: z.boolean().refine((val) => val === true, {
    message: "ঘোষণাপত্রটি গ্রহণ করা আবশ্যিক",
  }),
  // Additional Notes
  additionalNotes: z.string().max(1000).optional().or(z.literal("")),
});

export type PaymentReferenceData = z.infer<typeof paymentReferenceSchema>;

// ─── Full Combine Schema ────────────────────────────────────
// Note: We combine these for the final submit result
export const fullStaffSchema = personalFamilySchema
  .merge(addressIDSchema)
  .merge(professionalEducationSchema)
  .merge(contactReferenceSchema)
  .merge(paymentReferenceSchema);

export type FullStaffData = z.infer<typeof fullStaffSchema>;