import type { Flat } from '../types';

export const INITIAL_FLATS: Flat[] = [
  {
    id: 'matrouh-flat-1',
    rentalTerms: ['summer', 'winter'],
    winterMonthlyPrice: 9000,
    title: {
      ar: 'شاليه ديلوكس إطلالة بانورامية مباشرة على بحر وصخور عجيبة',
      en: 'Deluxe Panoramic Cliff Chalet Directly Overlooking Ageeba Sea'
    },
    area: 'ageeba',
    areaName: {
      ar: 'شاطئ عجيبة',
      en: 'Ageeba Beach'
    },
    pricePerNight: 2800,
    originalPrice: 3200,
    bedrooms: 3,
    bathrooms: 2,
    beds: 5,
    maxGuests: 7,
    floor: 2,
    hasElevator: true,
    hasSeaView: true,
    distanceToBeach: {
      ar: 'أول نمرة على البحر (50 متر)',
      en: 'First line on beach (50m)'
    },
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoFilmedOn: '2026-06-12',
    canInspectBeforePay: true,
    inspectionPolicy: {
      ar: 'معاينة مجانية على الطبيعة فور وصولك لمطروح ومقابلة المالك واستلام المفتاح قبل سداد باقي الإقامة.',
      en: 'Free physical on-site inspection upon arrival in Matrouh, meeting host before paying balance.'
    },
    rating: 4.95,
    reviewCount: 38,
    amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'parking', 'beach_access', 'elevator', 'tv'],
    description: {
      ar: 'استمتع بأروع إطلالة بانورامية في مصر من شرفة شاليه عجيبة الخاص. تصميم مودرن حديث، مكيف بالكامل مع مطبخ أمريكي متكامل وتراس واسع للاستمتاع بغروب الشمس الساحر والمياه الفيروزية النقية.',
      en: 'Experience Egypt’s most breathtaking panoramic view from the private terrace of Ageeba Chalet. Modern decor, fully air-conditioned, complete open kitchen, and a large sunset terrace above the turquoise sea.'
    },
    phoneContact: '+201012345678',
    whatsappNumber: '+201012345678',
    isFeatured: true,
    isSuperhost: true
  },
  {
    id: 'matrouh-flat-2',
    title: {
      ar: 'شقة فندقية فاخرة على الرمال البيضاء بشاطئ الأبيض',
      en: 'Luxury Frontline Apartment on Al-Abyad White Sand Beach'
    },
    area: 'al_abyad',
    areaName: {
      ar: 'شاطئ الأبيض (مالديف مطروح)',
      en: 'Al-Abyad Beach (Maldives of Matrouh)'
    },
    pricePerNight: 2400,
    bedrooms: 2,
    bathrooms: 2,
    beds: 4,
    maxGuests: 6,
    floor: 3,
    hasElevator: true,
    hasSeaView: true,
    distanceToBeach: {
      ar: 'مباشرة على الرمال البيضاء (30 متر)',
      en: 'Directly on the white sands (30m)'
    },
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    canInspectBeforePay: true,
    inspectionPolicy: {
      ar: 'مقابلة المالك أمام مدخل العمارة ومعاينة الشقة والتكييفات والغرف والشرفة قبل أي دفع.',
      en: 'Meet host at building gate to inspect flat, ACs, rooms and balcony before any payment.'
    },
    rating: 4.88,
    reviewCount: 29,
    amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'parking', 'elevator', 'beach_access', 'washer'],
    description: {
      ar: 'شقة فاخرة مجهزة بفرش مودرن فندقي على شاطئ الأبيض الأكثر شهرة بنقاء مياهه البيضاء والفيروزية. مثالية للعائلات وتوفر خصوصية تامة وخدمة أمن وحراسة على مدار الساعة.',
      en: 'A premium apartment furnished to hotel standards right on the renowned crystal-clear Al-Abyad beach. Perfect for families seeking privacy, safety, and pristine waters.'
    },
    phoneContact: '+201098765432',
    whatsappNumber: '+201098765432',
    isFeatured: true,
    isSuperhost: true
  },
  {
    id: 'matrouh-flat-3',
    rentalTerms: ['summer', 'winter', 'yearly'],
    winterMonthlyPrice: 6500,
    yearlyMonthlyPrice: 5000,
    title: {
      ar: 'شقة عائلية برؤية بحرية كاملة أمام حمامات كليوباترا',
      en: 'Spacious Family Apartment with Full View of Cleopatra Bay'
    },
    area: 'cleopatra',
    areaName: {
      ar: 'شاطئ كليوباترا',
      en: 'Cleopatra Beach'
    },
    pricePerNight: 1900,
    originalPrice: 2200,
    bedrooms: 3,
    bathrooms: 1,
    beds: 6,
    maxGuests: 8,
    floor: 4,
    hasElevator: true,
    hasSeaView: true,
    distanceToBeach: {
      ar: '100 متر من شاطئ كليوباترا التاريخي',
      en: '100m from historical Cleopatra Beach'
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    canInspectBeforePay: true,
    inspectionPolicy: {
      ar: 'معاينة مجانية متاحة، قابل المالك وتأكد من مطابقة جميع المواصفات قبل السداد.',
      en: 'Free physical inspection available, meet host and verify all specs before payment.'
    },
    rating: 4.75,
    reviewCount: 22,
    amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'parking', 'elevator', 'tv'],
    description: {
      ar: 'استرخ في واحدة من أروع بقع مرسى مطروح. شقة 3 غرف واسعة مجهزة بجميع وسائل الراحة، قريبة من المزارات السياحية ومزودة بإنترنت فائق السرعة وشاشة سمارت.',
      en: 'Relax in one of the most scenic spots of Marsa Matrouh. A 3-bedroom spacious flat equipped with all home conveniences, high-speed Wi-Fi, and smart TV.'
    },
    phoneContact: '+201122334455',
    whatsappNumber: '+201122334455',
    isFeatured: false,
    isSuperhost: false
  },
  {
    id: 'matrouh-flat-4',
    rentalTerms: ['winter', 'yearly'],
    winterMonthlyPrice: 7500,
    yearlyMonthlyPrice: 6000,
    title: {
      ar: 'شاليه أنيق خطوات من صخرة ليلى مراد وشاطئ الغرام',
      en: 'Charming Seaside Chalet near Laila Mourad Rock & Al-Gharam'
    },
    area: 'al_gharam',
    areaName: {
      ar: 'شاطئ الغرام',
      en: 'Al-Gharam Beach'
    },
    pricePerNight: 2100,
    bedrooms: 2,
    bathrooms: 1,
    beds: 3,
    maxGuests: 5,
    floor: 1,
    hasElevator: false,
    hasSeaView: true,
    distanceToBeach: {
      ar: '80 متر من الشاطئ الهادئ',
      en: '80m from the tranquil beach'
    },
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    canInspectBeforePay: true,
    rating: 4.82,
    reviewCount: 19,
    amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'parking', 'beach_access'],
    description: {
      ar: 'موقع هادئ ورومانسي على شاطئ الغرام الأسطوري. مياه هادئة صالحة للأطفال وممشى صخري جذاب، شاليه دور أرضي مرتفع مع حديقة صغيرة وجلسة باربيكيو مميزة.',
      en: 'Quiet romantic retreat near the legendary Al-Gharam beach. Calm turquoise waters ideal for children, elevated ground floor with a cozy outdoor patio and BBQ corner.'
    },
    phoneContact: '+201234567890',
    whatsappNumber: '+201234567890',
    isFeatured: true,
    isSuperhost: true
  },
  {
    id: 'matrouh-flat-5',
    title: {
      ar: 'بنتهاوس فاخر بكورنيش مطروح بجوار سوق ليبيا والمطاعم',
      en: 'Luxury Corniche Penthouse Downtown near Libyan Market'
    },
    area: 'corniche',
    areaName: {
      ar: 'كورنيش مطروح وسط البلد',
      en: 'Downtown Corniche'
    },
    pricePerNight: 2600,
    originalPrice: 3000,
    bedrooms: 4,
    bathrooms: 3,
    beds: 7,
    maxGuests: 10,
    floor: 7,
    hasElevator: true,
    hasSeaView: true,
    distanceToBeach: {
      ar: 'على الكورنيش الرئيسي مباشرة',
      en: 'Directly on the main Corniche strip'
    },
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    canInspectBeforePay: true,
    rating: 4.91,
    reviewCount: 45,
    amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'parking', 'elevator', 'washer', 'tv'],
    description: {
      ar: 'شقة بنتهاوس ملكية 4 غرف نوم بمساحة 220 متر مربع برؤية شاملة للخليج بأكمله. موقع استراتيجي ينبض بالحياة، دقيقة سيراً على الأقدام لأشهر مطاعم الأسماك والأسواق الشعبية.',
      en: 'Royal 4-bedroom penthouse spanning 220 sqm with 360-degree views of the entire Matrouh bay. Prime lively location, walking distance to famous seafood venues and vibrant souks.'
    },
    phoneContact: '+201001122334',
    whatsappNumber: '+201001122334',
    isFeatured: true,
    isSuperhost: true
  },
  {
    id: 'matrouh-flat-6',
    rentalTerms: ['summer', 'yearly'],
    yearlyMonthlyPrice: 4000,
    title: {
      ar: 'شقة مريحة للأسر بجوار شاطئ روميل الهادئ ومتحف روميل',
      en: 'Family Comfort Apartment by Calm Rommel Bay & Museum'
    },
    area: 'rommel',
    areaName: {
      ar: 'شاطئ روميل',
      en: 'Rommel Beach'
    },
    pricePerNight: 1400,
    bedrooms: 2,
    bathrooms: 1,
    beds: 4,
    maxGuests: 5,
    floor: 2,
    hasElevator: true,
    hasSeaView: true,
    distanceToBeach: {
      ar: '120 متر من شاطئ روميل الهادئ',
      en: '120m from calm Rommel Bay'
    },
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80'
    ],
    canInspectBeforePay: true,
    rating: 4.67,
    reviewCount: 18,
    amenities: ['wifi', 'ac', 'kitchen', 'parking', 'elevator', 'tv'],
    description: {
      ar: 'خيار اقتصادي ممتاز للعائلات مع الأطفال، حيث يتميز شاطئ روميل بانعدام الأمواج والمياه الضحلة الآمنة. الشقة مفروشة بعناية وتضم مطبخاً كاملاً ومكيفاً في جميع الغرف.',
      en: 'An economical top choice for families with toddlers, thanks to Rommel’s calm wave-free shallow waters. Well-furnished flat with a full kitchen and cold AC.'
    },
    phoneContact: '+201099887766',
    whatsappNumber: '+201099887766',
    isFeatured: false,
    isSuperhost: false
  },
  {
    id: 'matrouh-flat-7',
    title: {
      ar: 'فيلا شاليه VIP صف أول بقرية وشاطئ بو سيت الخاص',
      en: 'Exclusive VIP Frontline Chalet at Beau Site Private Beach'
    },
    area: 'beau_site',
    areaName: {
      ar: 'شاطئ بو سيت الراقي',
      en: 'Beau Site Beach'
    },
    pricePerNight: 3500,
    bedrooms: 3,
    bathrooms: 2,
    beds: 5,
    maxGuests: 7,
    floor: 1,
    hasElevator: false,
    hasSeaView: true,
    distanceToBeach: {
      ar: 'مدخل مباشر للشاطئ الخاص (15 متر)',
      en: 'Direct private beach entrance (15m)'
    },
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    canInspectBeforePay: true,
    rating: 4.98,
    reviewCount: 52,
    amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'parking', 'beach_access', 'washer', 'tv'],
    description: {
      ar: 'أرقى تجربة مصيفية في مرسى مطروح داخل مجمع بو سيت العريق. شاطئ رملي خاص نقي ومجهز بشماسي وكراسي مجانية، تراس كبير مطل على البحر مباشرة مع فرش فاخر جداً.',
      en: 'The pinnacle of luxury in Marsa Matrouh inside prestigious Beau Site. Private beach access with complimentary umbrellas, direct beachside patio and ultra-premium interior design.'
    },
    phoneContact: '+201055443322',
    whatsappNumber: '+201055443322',
    isFeatured: true,
    isSuperhost: true
  },
  {
    id: 'matrouh-flat-8',
    rentalTerms: ['winter', 'yearly'],
    winterMonthlyPrice: 5500,
    yearlyMonthlyPrice: 4500,
    title: {
      ar: 'شقة مودرن مطلة على لسان وبحر الفيروز الهادئ',
      en: 'Modern Apartment Overlooking Turquoise Al-Fayrouz Spit'
    },
    area: 'al_fayrouz',
    areaName: {
      ar: 'شاطئ الفيروز',
      en: 'Al-Fayrouz Beach'
    },
    pricePerNight: 1750,
    bedrooms: 2,
    bathrooms: 1,
    beds: 3,
    maxGuests: 4,
    floor: 3,
    hasElevator: true,
    hasSeaView: true,
    distanceToBeach: {
      ar: '70 متر من شاطئ الفيروز',
      en: '70m from Al-Fayrouz Beach'
    },
    images: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
    ],
    canInspectBeforePay: false,
    rating: 4.79,
    reviewCount: 16,
    amenities: ['wifi', 'ac', 'balcony', 'kitchen', 'parking', 'elevator', 'tv'],
    description: {
      ar: 'شقة مشرقة ومتجددة الهواء، تتمتع بإطلالة خلابة على لسان الفيروز المائي الشهير بركوب اللنشات والألعاب المائية. مجهزة بكل ما تحتاجه لإقامة صيفية ممتعة.',
      en: 'Bright and breezy apartment featuring gorgeous vistas of the Al-Fayrouz water tongue, known for boating and water activities. Fully equipped for an unforgettable stay.'
    },
    phoneContact: '+201144556677',
    whatsappNumber: '+201144556677',
    isFeatured: false,
    isSuperhost: false
  },
  {
    id: 'matrouh-flat-9',
    title: {
      ar: 'شقة عائلية هادئة في عجيبة، صف ثانٍ بسعر أوضح',
      en: 'Quieter family flat in Ageeba, second row, clear price'
    },
    area: 'ageeba',
    areaName: { ar: 'شاطئ عجيبة', en: 'Ageeba Beach' },
    pricePerNight: 1900,
    bedrooms: 2,
    bathrooms: 1,
    beds: 3,
    maxGuests: 5,
    floor: 1,
    hasElevator: false,
    hasSeaView: true,
    distanceToBeach: { ar: '180 متر من بحر عجيبة', en: '180m from Ageeba sea' },
    distanceMeters: 180,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    canInspectBeforePay: true,
    inspectionPolicy: {
      ar: 'معاينة في نفس اليوم أو عند الوصول، والدفع بعد مطابقة الشقة.',
      en: 'Same-day or arrival inspection. Pay after the flat matches the listing.'
    },
    rating: 4.6,
    reviewCount: 11,
    amenities: ['wifi', 'ac', 'kitchen', 'balcony', 'tv'],
    description: {
      ar: 'بديل عملي في نفس منطقة عجيبة لمن رفض الشاليه الأول. غرفتان، تكييف، ومطبخ، ويبعد حوالي 180 متراً عن البحر.',
      en: 'A practical Ageeba alternative if the front chalet is not a match. Two bedrooms, air conditioning, a kitchen, about 180 metres from the sea.'
    },
    phoneContact: '+201067890123',
    whatsappNumber: '+201067890123',
    isFeatured: false,
    isSuperhost: false
  },
  {
    id: 'matrouh-flat-10',
    title: {
      ar: 'استوديو اقتصادي في عجيبة لشخصين أو ثلاثة',
      en: 'Budget Ageeba studio for two or three guests'
    },
    area: 'ageeba',
    areaName: { ar: 'شاطئ عجيبة', en: 'Ageeba Beach' },
    pricePerNight: 1200,
    bedrooms: 0,
    bathrooms: 1,
    beds: 1,
    maxGuests: 3,
    floor: 0,
    hasElevator: false,
    hasSeaView: false,
    distanceToBeach: { ar: '250 متر من الشاطئ', en: '250m from the beach' },
    distanceMeters: 250,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
    ],
    canInspectBeforePay: true,
    rating: 4.4,
    reviewCount: 7,
    amenities: ['ac', 'kitchen', 'wifi'],
    description: {
      ar: 'استوديو أرضي بلا مصعد وبلا إطلالة بحر، مناسب لمن يريد سعراً أقل في نفس المنطقة مع معاينة قبل الدفع.',
      en: 'A ground-floor studio with no elevator and no sea view, for a lower price in the same area, with inspection before payment.'
    },
    phoneContact: '+201078901234',
    whatsappNumber: '+201078901234',
    isFeatured: false,
    isSuperhost: false
  },
  {
    id: 'matrouh-flat-11',
    rentalTerms: ['summer', 'winter'],
    winterMonthlyPrice: 5800,
    title: {
      ar: 'شقة بديلة قرب كليوباترا بسعر أقل وبنفس عدد الغرف',
      en: 'Cleopatra alternative with a lower price and the same bedroom count'
    },
    area: 'cleopatra',
    areaName: { ar: 'شاطئ كليوباترا', en: 'Cleopatra Beach' },
    pricePerNight: 1500,
    bedrooms: 2,
    bathrooms: 1,
    beds: 3,
    maxGuests: 5,
    floor: 2,
    hasElevator: true,
    hasSeaView: false,
    distanceToBeach: { ar: '220 متر من حمام كليوباترا', en: '220m from Cleopatra pool' },
    distanceMeters: 220,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    canInspectBeforePay: true,
    rating: 4.55,
    reviewCount: 9,
    amenities: ['wifi', 'ac', 'kitchen', 'elevator', 'tv', 'washer'],
    description: {
      ar: 'تظهر ضمن البدائل إذا رفضت الشقة الأمامية في كليوباترا. السعر أوضح، والمسافة للبحر مكتوبة بالمتر.',
      en: 'Shown as an alternative if you reject the front Cleopatra flat. The price is lower and the beach distance is written in metres.'
    },
    phoneContact: '+201089012345',
    whatsappNumber: '+201089012345',
    isFeatured: false,
    isSuperhost: false
  },
  {
    id: 'matrouh-flat-12',
    title: {
      ar: 'شاليه علم الروم على مياه صافية، غرب وسط مطروح',
      en: 'Alam El-Roum chalet on clear water, west of downtown'
    },
    area: 'alam_el_roum',
    areaName: { ar: 'علم الروم', en: 'Alam El-Roum' },
    pricePerNight: 2000,
    bedrooms: 2,
    bathrooms: 1,
    beds: 3,
    maxGuests: 6,
    floor: 1,
    hasElevator: false,
    hasSeaView: true,
    distanceToBeach: { ar: '90 متر من بحر علم الروم', en: '90m from Alam El-Roum sea' },
    distanceMeters: 90,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    canInspectBeforePay: true,
    inspectionPolicy: {
      ar: 'المعاينة في علم الروم قبل الدفع، واللقاء أمام البيت.',
      en: 'Inspect in Alam El-Roum before paying. Meet in front of the house.'
    },
    rating: 4.7,
    reviewCount: 14,
    amenities: ['wifi', 'ac', 'kitchen', 'balcony', 'parking'],
    description: {
      ar: 'علم الروم بلدة وشاطئ غرب المدينة، وليست شقة على كورنيش وسط البلد. الشاليه يبعد حوالي 90 متراً عن البحر.',
      en: 'Alam El-Roum is a town and beach west of the city, not a downtown corniche flat. The chalet is about 90 metres from the sea.'
    },
    phoneContact: '+201090123456',
    whatsappNumber: '+201090123456',
    isFeatured: true,
    isSuperhost: false
  },
  {
    id: 'matrouh-flat-13',
    rentalTerms: ['summer', 'winter'],
    winterMonthlyPrice: 5000,
    title: {
      ar: 'شقة على شارع الإسكندرية قرب المحلات والمواصلات',
      en: 'Flat on Alexandria Street, near shops and transport'
    },
    area: 'alexandria_st',
    areaName: { ar: 'شارع الإسكندرية', en: 'Alexandria Street' },
    pricePerNight: 1100,
    bedrooms: 2,
    bathrooms: 1,
    beds: 3,
    maxGuests: 5,
    floor: 3,
    hasElevator: true,
    hasSeaView: false,
    distanceToBeach: { ar: 'حوالي 1200 متر من الكورنيش', en: 'About 1,200m from the corniche' },
    distanceMeters: 1200,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    canInspectBeforePay: true,
    rating: 4.4,
    reviewCount: 8,
    amenities: ['wifi', 'ac', 'kitchen', 'elevator', 'tv', 'washer'],
    description: {
      ar: 'على شارع الإسكندرية، الطريق الرئيسي داخل المدينة. بلا إطلالة بحر، وأقرب للمحلات والسوبر جيت من الشواطئ الغربية.',
      en: 'On Alexandria Street, the main road through the city. No sea view, and closer to shops and the bus station than to the western beaches.'
    },
    phoneContact: '+201091234567',
    whatsappNumber: '+201091234567',
    isFeatured: false,
    isSuperhost: false
  },
  {
    id: 'matrouh-flat-14',
    title: {
      ar: 'شقة هادئة خلف سوق ليبيا، دقيقة عن المحلات',
      en: 'Quieter flat behind the Libyan Market, a minute from the shops'
    },
    area: 'souq_libya',
    areaName: { ar: 'سوق ليبيا', en: 'Libyan Market' },
    pricePerNight: 1300,
    bedrooms: 2,
    bathrooms: 1,
    beds: 3,
    maxGuests: 5,
    floor: 2,
    hasElevator: false,
    hasSeaView: false,
    distanceToBeach: { ar: 'حوالي 700 متر من الكورنيش', en: 'About 700m from the corniche' },
    distanceMeters: 700,
    images: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80'
    ],
    canInspectBeforePay: true,
    rating: 4.5,
    reviewCount: 6,
    amenities: ['ac', 'kitchen', 'wifi', 'tv'],
    description: {
      ar: 'في شارع خلفي لسوق ليبيا حتى يقل الزحام، مع إبقاء السوق والكورنيش على مسافة مشي.',
      en: 'On a back street of the Libyan Market so the noise is lower, with the market and corniche still in walking distance.'
    },
    phoneContact: '+201092345678',
    whatsappNumber: '+201092345678',
    isFeatured: false,
    isSuperhost: false
  },
  {
    id: 'matrouh-flat-15',
    rentalTerms: ['summer', 'yearly'],
    yearlyMonthlyPrice: 4200,
    title: {
      ar: 'شقة عائلية في حي الزهور بعيداً عن زحام البحر',
      en: 'Family flat in El Zohour, away from the beach crowds'
    },
    area: 'el_zohour',
    areaName: { ar: 'حي الزهور', en: 'El Zohour' },
    pricePerNight: 1000,
    bedrooms: 3,
    bathrooms: 1,
    beds: 4,
    maxGuests: 7,
    floor: 1,
    hasElevator: false,
    hasSeaView: false,
    distanceToBeach: { ar: 'حي سكني داخل المدينة', en: 'A residential district inside the city' },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    canInspectBeforePay: true,
    rating: 4.3,
    reviewCount: 5,
    amenities: ['ac', 'kitchen', 'wifi', 'parking', 'washer'],
    description: {
      ar: 'في حي الزهور، لمن يريد سكناً عائلياً داخل مطروح وسعر أقل من صف الشاطئ.',
      en: 'In El Zohour, for a family stay inside Matrouh at a lower price than the beach row.'
    },
    phoneContact: '+201093456789',
    whatsappNumber: '+201093456789',
    isFeatured: false,
    isSuperhost: false
  },
  {
    id: 'matrouh-flat-16',
    title: {
      ar: 'شاليه داخل بورتو مطروح مع سؤال واضح عن الشاطئ',
      en: 'Chalet inside Porto Matrouh, with beach access stated clearly'
    },
    area: 'porto_matrouh',
    areaName: { ar: 'بورتو مطروح', en: 'Porto Matrouh' },
    pricePerNight: 2600,
    bedrooms: 2,
    bathrooms: 2,
    beds: 4,
    maxGuests: 6,
    floor: 0,
    hasElevator: false,
    hasSeaView: true,
    distanceToBeach: { ar: 'داخل القرية، 40 متر من شاطئ المنتجع', en: 'Inside the resort, 40m from its beach' },
    distanceMeters: 40,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    canInspectBeforePay: true,
    rating: 4.8,
    reviewCount: 12,
    amenities: ['wifi', 'ac', 'kitchen', 'parking', 'pool', 'beach_access'],
    description: {
      ar: 'وحدة أرضية داخل بورتو مطروح. دخول شاطئ المنتجع مشمول في هذا الإعلان، والمعاينة قبل الدفع.',
      en: 'A ground-floor unit inside Porto Matrouh. Resort beach entry is included in this listing, with inspection before payment.'
    },
    phoneContact: '+201094567890',
    whatsappNumber: '+201094567890',
    isFeatured: false,
    isSuperhost: false
  }
];
