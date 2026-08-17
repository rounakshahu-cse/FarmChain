export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  appName: string;
  tagline: string;
  roles: {
    farmer: string;
    merchant: string;
    transporter: string;
    seller: string;
    admin: string;
  };
  nav: {
    dashboard: string;
    myListings: string;
    marketplace: string;
    liveBidding: string;
    transportJobs: string;
    mandiIntelligence: string;
    plantDoctor: string;
    pesticideStore: string;
    myOrders: string;
    adminPanel: string;
    switchDemo: string;
    notifications: string;
    trustScore: string;
    verifiedBadge: string;
  };
  farmer: {
    createListing: string;
    activeListings: string;
    totalRevenue: string;
    liveBidsCount: string;
    bestMandiAlert: string;
    cropName: string;
    variety: string;
    quantity: string;
    qualityGrade: string;
    basePrice: string;
    costOfProduction: string;
    farmLocation: string;
    scheduleTomorrow: string;
    scheduleTomorrowDesc: string;
    submitListing: string;
    profitMargin: string;
    profitable: string;
    belowCost: string;
    acceptWinningBid: string;
    connectTransportPrompt: string;
    bookTransportNow: string;
  };
  merchant: {
    browseListings: string;
    searchCrops: string;
    scheduledTomorrowBanner: string;
    previousClosePrice: string;
    placeBid: string;
    yourBidPerQtl: string;
    quickIncrement: string;
    currentHighestBid: string;
    outbidAlert: string;
    dealWon: string;
  };
  transporter: {
    availableLoads: string;
    assignedTrips: string;
    pickup: string;
    drop: string;
    distance: string;
    loadWeight: string;
    payout: string;
    vehicleType: string;
    acceptJob: string;
    startTrip: string;
    markDelivered: string;
    completed: string;
  };
  mandi: {
    title: string;
    subtitle: string;
    selectCrop: string;
    mandiName: string;
    modalPrice: string;
    freightDeduction: string;
    netRealizedProfit: string;
    aiBestChoice: string;
    priceTrend: string;
  };
  disease: {
    title: string;
    subtitle: string;
    uploadPrompt: string;
    selectSample: string;
    analyzingLeaf: string;
    detectedDisease: string;
    confidenceScore: string;
    severity: string;
    symptoms: string;
    organicRemedy: string;
    chemicalTreatment: string;
    buyRecommendedMedicine: string;
  };
  pesticides: {
    title: string;
    allCategories: string;
    fungicide: string;
    pesticide: string;
    fertilizer: string;
    neemOil: string;
    seeds: string;
    sprayer: string;
    buyNow: string;
    verifiedSeller: string;
    deliveryInDays: string;
  };
  chatbot: {
    title: string;
    subtitle: string;
    askPlaceholder: string;
    quickPrompts: {
      mandiRate: string;
      transportCost: string;
      diseaseCare: string;
      myBids: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "Smart Krishi Connect",
    tagline: "Empowering Farmers, Connecting Opportunities",
    roles: {
      farmer: "Farmer (Kisan)",
      merchant: "Merchant (Vyapari)",
      transporter: "Transporter (Vahan)",
      seller: "Input / Pesticide Seller",
      admin: "Platform Admin",
    },
    nav: {
      dashboard: "Dashboard",
      myListings: "My Crop Listings",
      marketplace: "Crop Marketplace",
      liveBidding: "Live Bidding Room",
      transportJobs: "Transport & Logistics",
      mandiIntelligence: "Mandi Intelligence",
      plantDoctor: "AI Plant Doctor",
      pesticideStore: "Pesticides & Inputs",
      myOrders: "My Orders & Deals",
      adminPanel: "Admin Oversight",
      switchDemo: "Switch Demo Persona",
      notifications: "Notifications",
      trustScore: "Trust Score",
      verifiedBadge: "Verified",
    },
    farmer: {
      createListing: "Create New Crop Listing",
      activeListings: "Active Harvest Listings",
      totalRevenue: "Total Realized Sales",
      liveBidsCount: "Active Merchant Bids",
      bestMandiAlert: "Best Mandi Opportunity",
      cropName: "Crop Name",
      variety: "Variety / Hybrid",
      quantity: "Quantity (Quintals)",
      qualityGrade: "Quality Grade",
      basePrice: "Reserve Base Price (₹/Qtl)",
      costOfProduction: "Cost of Production (₹/Qtl)",
      farmLocation: "Farm Location & Village",
      scheduleTomorrow: "Schedule Bidding for Tomorrow",
      scheduleTomorrowDesc: "Merchants get 24h advance notice with APMC closing rates to place higher competitive bids",
      submitListing: "Publish Crop Listing",
      profitMargin: "Profit Margin",
      profitable: "Profitable Deal",
      belowCost: "Below Cost Margin",
      acceptWinningBid: "Accept Winning Bid & Lock Deal",
      connectTransportPrompt: "Deal finalized! Would you like to connect with a verified transporter?",
      bookTransportNow: "Book Smart Transport",
    },
    merchant: {
      browseListings: "Discover Farm Fresh Listings",
      searchCrops: "Search crops, varieties, or locations...",
      scheduledTomorrowBanner: "⏰ Scheduled Bidding Opens Tomorrow",
      previousClosePrice: "Last Mandi Close Rate",
      placeBid: "Submit Live Bid",
      yourBidPerQtl: "Your Bid (₹/Quintal)",
      quickIncrement: "Quick Add",
      currentHighestBid: "Leading Bid",
      outbidAlert: "You have been outbid! Increase your bid to win.",
      dealWon: "Congratulations! Your bid was accepted.",
    },
    transporter: {
      availableLoads: "Available Produce Loads",
      assignedTrips: "My Active Trips",
      pickup: "Pickup Farm",
      drop: "Destination Mandi / Warehouse",
      distance: "Distance",
      loadWeight: "Load Weight",
      payout: "Guaranteed Payout",
      vehicleType: "Matched Vehicle",
      acceptJob: "Accept Delivery Job",
      startTrip: "Start Trip (In Transit)",
      markDelivered: "Confirm Delivery & Collect Payment",
      completed: "Completed Trip",
    },
    mandi: {
      title: "Real-Time Mandi Price Intelligence",
      subtitle: "Compare gross market rates vs. Net Profit after freight deductions to select your most profitable mandi.",
      selectCrop: "Select Crop to Compare",
      mandiName: "Mandi Market",
      modalPrice: "Modal Rate (₹/Qtl)",
      freightDeduction: "Freight Cost / Qtl",
      netRealizedProfit: "Net Realized Price (₹/Qtl)",
      aiBestChoice: "AI Recommended Maximum Profit Mandi",
      priceTrend: "Price Trend",
    },
    disease: {
      title: "AI Plant Doctor & Crop Health",
      subtitle: "Instant leaf diagnostic scan for diseases with organic and chemical remedies & 1-click medicine purchase.",
      uploadPrompt: "Upload Crop Leaf Photo or Choose Sample",
      selectSample: "Or Select a Sample Crop Leaf:",
      analyzingLeaf: "AI Neural Network Scanning Leaf Cell Pathology...",
      detectedDisease: "Detected Disease",
      confidenceScore: "Diagnostic Confidence",
      severity: "Severity Level",
      symptoms: "Observed Symptoms",
      organicRemedy: "Organic & Bio-Control Remedy",
      chemicalTreatment: "Standard Chemical Treatment",
      buyRecommendedMedicine: "Buy Recommended Treatment from Verified Seller",
    },
    pesticides: {
      title: "Verified Agri Inputs & Pesticides",
      allCategories: "All Products",
      fungicide: "Bio-Fungicides",
      pesticide: "Bio-Pesticides",
      fertilizer: "Nutrients & Bio-Stimulants",
      neemOil: "Organic Neem Oil",
      seeds: "Certified Seeds",
      sprayer: "Sprayers & Tools",
      buyNow: "Buy Now",
      verifiedSeller: "Verified Krishi Kendra",
      deliveryInDays: "Delivery in 24-48 Hours",
    },
    chatbot: {
      title: "Krishi Sahayak AI Copilot",
      subtitle: "Grounded with live Mandi prices, your active bids, transport rates, and disease remedies.",
      askPlaceholder: "Ask about mandi prices, transport, disease care, or your orders...",
      quickPrompts: {
        mandiRate: "What is the live mandi price for Soybean?",
        transportCost: "How much to transport 30 quintals 50 km?",
        diseaseCare: "How to cure Tomato Early Blight?",
        myBids: "Check my active crop listings and bids",
      },
    },
  },
  hi: {
    appName: "स्मार्ट कृषि कनेक्ट",
    tagline: "किसानों का सशक्तिकरण, अवसरों का सीधा जुड़ाव",
    roles: {
      farmer: "किसान (Farmer)",
      merchant: "व्यापारी (Merchant)",
      transporter: "ट्रांसपोर्टर (Transporter)",
      seller: "दवा व खाद विक्रेता",
      admin: "सिस्टम एडमिन",
    },
    nav: {
      dashboard: "डैशबोर्ड",
      myListings: "मेरी फसलें (Listings)",
      marketplace: "फसल बाज़ार",
      liveBidding: "लाइव बोली कक्ष (Bidding)",
      transportJobs: "स्मार्ट ट्रांसपोर्ट",
      mandiIntelligence: "मंडी भाव व मुनाफा",
      plantDoctor: "AI फसल डॉक्टर",
      pesticideStore: "कीटनाशक व बीज बाज़ार",
      myOrders: "सौदा व ऑर्डर",
      adminPanel: "एडमिन कंट्रोल",
      switchDemo: "डेमो यूज़र बदलें",
      notifications: "सूचनाएं",
      trustScore: "विश्वास स्कोर",
      verifiedBadge: "सत्यापित",
    },
    farmer: {
      createListing: "नई फसल लिस्टिंग बनाएं",
      activeListings: "सक्रिय फसल लिस्टिंग",
      totalRevenue: "कुल प्राप्त बिक्री",
      liveBidsCount: "व्यापारियों की बोलियां",
      bestMandiAlert: "सर्वश्रेष्ठ मंडी अवसर",
      cropName: "फसल का नाम",
      variety: "किस्म / वैरायटी",
      quantity: "मात्रा (क्विंटल)",
      qualityGrade: "गुणवत्ता ग्रेड",
      basePrice: "न्यूनतम बेस भाव (₹/क्विंटल)",
      costOfProduction: "उत्पादन लागत (₹/क्विंटल)",
      farmLocation: "खेत का पता व गांव",
      scheduleTomorrow: "बोली कल के लिए निर्धारित करें",
      scheduleTomorrowDesc: "व्यापारियों को 24 घंटे पहले नोटिस व मंडी भाव मिलेगा, जिससे वे बेहतर बोली लगाएंगे",
      submitListing: "फसल लिस्टिंग प्रकाशित करें",
      profitMargin: "मुनाफा मार्जिन",
      profitable: "लाभदायक सौदा",
      belowCost: "लागत से कम",
      acceptWinningBid: "बोली स्वीकार करें और सौदा लॉक करें",
      connectTransportPrompt: "सौदा पक्का हुआ! क्या आप सत्यापित ट्रांसपोर्टर से जुड़ना चाहते हैं?",
      bookTransportNow: "स्मार्ट ट्रांसपोर्ट बुक करें",
    },
    merchant: {
      browseListings: "खेत से ताज़ा फसलें खोजें",
      searchCrops: "फसल, किस्म या स्थान खोजें...",
      scheduledTomorrowBanner: "⏰ निर्धारित बोली कल खुलेगी",
      previousClosePrice: "पिछला मंडी क्लोजिंग भाव",
      placeBid: "लाइव बोली लगाएं",
      yourBidPerQtl: "आपकी बोली (₹/क्विंटल)",
      quickIncrement: "त्वरित बढ़ाएं",
      currentHighestBid: "सर्वोच्च बोली",
      outbidAlert: "अन्य व्यापारी ने अधिक बोली लगाई है! जीतने के लिए बोली बढ़ाएं।",
      dealWon: "बधाई! आपकी बोली स्वीकार कर ली गई है।",
    },
    transporter: {
      availableLoads: "उपलब्ध माल (Loads)",
      assignedTrips: "मेरी सक्रिय ट्रिप्स",
      pickup: "पिकअप खेत",
      drop: "मंडी / गोदाम स्थान",
      distance: "दूरी",
      loadWeight: "वजन",
      payout: "निश्चित किराया भुगतान",
      vehicleType: "उपयुक्त गाड़ी",
      acceptJob: "गाड़ी बुक करें / स्वीकारें",
      startTrip: "ट्रिप शुरू करें (रास्ते में)",
      markDelivered: "डिलीवरी पक्की करें व भुगतान लें",
      completed: "सफल डिलीवरी",
    },
    mandi: {
      title: "लाइव मंडी भाव व वास्तविक मुनाफा विश्लेषण",
      subtitle: "सिर्फ मंडी भाव ही नहीं, ट्रांसपोर्ट खर्च घटाकर अधिकतम शुद्ध मुनाफा देने वाली मंडी चुनें।",
      selectCrop: "तुलना के लिए फसल चुनें",
      mandiName: "मंडी का नाम",
      modalPrice: "मॉडल भाव (₹/क्विंटल)",
      freightDeduction: "ट्रांसपोर्ट खर्च / क्विंटल",
      netRealizedProfit: "शुद्ध प्राप्त भाव (₹/क्विंटल)",
      aiBestChoice: "AI द्वारा सुझाई गई सर्वाधिक मुनाफे वाली मंडी",
      priceTrend: "भाव का रुझान",
    },
    disease: {
      title: "AI फसल डॉक्टर (रोग निदान)",
      subtitle: "पत्ते का फोटो अपलोड करें और तुरंत रोग की जांच, जैविक व रासायनिक उपचार और सही दवा पाएं।",
      uploadPrompt: "पत्ते का फोटो अपलोड करें या नमूना चुनें",
      selectSample: "या नीचे दिए गए नमूने चुनें:",
      analyzingLeaf: "AI न्यूरल नेटवर्क पत्ते की जांच कर रहा है...",
      detectedDisease: "पाया गया रोग",
      confidenceScore: "सटीकता (Confidence)",
      severity: "रोग की गंभीरता",
      symptoms: "लक्षण",
      organicRemedy: "जैविक उपचार",
      chemicalTreatment: "रासायनिक उपचार",
      buyRecommendedMedicine: "सत्यापित विक्रेता से सही दवा खरीदें",
    },
    pesticides: {
      title: "सत्यापित कृषि उत्पाद व कीटनाशक बाज़ार",
      allCategories: "सभी उत्पाद",
      fungicide: "फफूंदनाशक",
      pesticide: "कीटनाशक",
      fertilizer: "पोषक तत्व व टॉनिक",
      neemOil: "शुद्ध नीम तेल",
      seeds: "प्रमाणित बीज",
      sprayer: "स्प्रेयर व उपकरण",
      buyNow: "अभी खरीदें",
      verifiedSeller: "सत्यापित कृषि सेवा केंद्र",
      deliveryInDays: "24-48 घंटों में खेत पर डिलीवरी",
    },
    chatbot: {
      title: "कृषि सहायक AI डिजिटल साथी",
      subtitle: "लाइव मंडी भाव, आपकी बोलियां, ट्रांसपोर्ट और फसल रोग की सटीक जानकारी।",
      askPlaceholder: "मंडी भाव, ट्रांसपोर्ट किराया, फसल रोग या सौदे के बारे में पूछें...",
      quickPrompts: {
        mandiRate: "सोयाबीन का आज का लाइव मंडी भाव क्या है?",
        transportCost: "30 क्विंटल माल 50 किमी ले जाने का किराया कितना होगा?",
        diseaseCare: "टमाटर का करपा (Blight) रोग कैसे ठीक करें?",
        myBids: "मेरी फसल पर कितनी बोलियां आई हैं?",
      },
    },
  },
  mr: {
    appName: "स्मार्ट कृषी कनेक्ट",
    tagline: "शेतकऱ्यांचे सक्षमीकरण, संधींचा थेट संगम",
    roles: {
      farmer: "शेतकरी (Farmer)",
      merchant: "व्यापारी (Merchant)",
      transporter: "वाहतूकदार (Transporter)",
      seller: "कृषी औषध व खत विक्रेता",
      admin: "सिस्टम ॲडमिन",
    },
    nav: {
      dashboard: "डॅशबोर्ड",
      myListings: "माझी पिके (Listings)",
      marketplace: "शेतमाल बाजार",
      liveBidding: "थेट लिलाव कक्ष (Bidding)",
      transportJobs: "स्मार्ट वाहतूक",
      mandiIntelligence: "बाजारभाव व नफा",
      plantDoctor: "AI पीक डॉक्टर",
      pesticideStore: "औषधे व बियाणे",
      myOrders: "माझे सौदे",
      adminPanel: "ॲडमिन कंट्रोल",
      switchDemo: "डेमो वापरकर्ता बदला",
      notifications: "सूचना",
      trustScore: "विश्वास निर्देशांक",
      verifiedBadge: "व्हेरिफाइड",
    },
    farmer: {
      createListing: "नवीन शेतमाल विक्रीसाठी जोडा",
      activeListings: "विक्रीसाठी उपलब्ध शेतमाल",
      totalRevenue: "एकूण मिळालेली रक्कम",
      liveBidsCount: "व्यापाऱ्यांच्या चालू ऑफर्स",
      bestMandiAlert: "सर्वाधिक नफा देणारी मंडी",
      cropName: "पिकाचे नाव",
      variety: "वाण / जात",
      quantity: "प्रमाण (क्विंटल)",
      qualityGrade: "गुणवत्ता ग्रेड",
      basePrice: "किमान मूळ भाव (₹/क्विंटल)",
      costOfProduction: "उत्पादन खर्च (₹/क्विंटल)",
      farmLocation: "शेत / गावाचा पत्ता",
      scheduleTomorrow: "लिलाव उद्यासाठी निश्चित करा",
      scheduleTomorrowDesc: "व्यापाऱ्यांना २४ तास आधी नोटीस व कालचे बाजारभाव मिळतील, जेणेकरून अधिक चढ्या बोली लागतील",
      submitListing: "शेतमाल विक्रीसाठी टाका",
      profitMargin: "नफा मार्जिन",
      profitable: "फायदेशीर सौदा",
      belowCost: "उत्पादन खर्चापेक्षा कमी",
      acceptWinningBid: "सर्वोच्च बोली स्वीकारा व सौदा पक्का करा",
      connectTransportPrompt: "सौदा पक्का झाला! तुम्हाला योग्य वाहतूकदाराशी जोडायचे आहे का?",
      bookTransportNow: "स्मार्ट गाडी बुक करा",
    },
    merchant: {
      browseListings: "थेट शेतकऱ्यांकडून शेतमाल शोधा",
      searchCrops: "पीक, जात किंवा गाव शोधा...",
      scheduledTomorrowBanner: "⏰ उद्या सुरू होणारा शेतमाल लिलाव",
      previousClosePrice: "मागील मंडी बंद भाव",
      placeBid: "थेट बोली लावा",
      yourBidPerQtl: "तुमचा भाव (₹/क्विंटल)",
      quickIncrement: "वाढवा",
      currentHighestBid: "सध्याची सर्वोच्च बोली",
      outbidAlert: "दुसऱ्या व्यापाऱ्याने तुमच्यापेक्षा जास्त बोली लावली आहे!",
      dealWon: "अभिनंदन! तुमची बोली शेतकऱ्याने स्वीकारली आहे.",
    },
    transporter: {
      availableLoads: "वाहतुकीसाठी उपलब्ध माल",
      assignedTrips: "माझ्या चालू फेऱ्या (Trips)",
      pickup: "शेतकऱ्याचे शेत",
      drop: "मार्केट यार्ड / गोदामाचा पत्ता",
      distance: "अंतर (किमी)",
      loadWeight: "मालाचे वजन",
      payout: "निश्चित भाडे रक्कम",
      vehicleType: "योग्य गाडी प्रकार",
      acceptJob: "फेरी स्वीकारा",
      startTrip: "प्रवास सुरू करा (मार्गावर)",
      markDelivered: "माल पोहोचवला व भाडे जमा",
      completed: "यशस्वी फेरी",
    },
    mandi: {
      title: "थेट बाजारभाव व निव्वळ नफा विश्लेषण",
      subtitle: "केवळ भाव पाहू नका, वाहतूक खर्च वजा करून खऱ्या अर्थाने सर्वाधिक नफा देणारी मंडी निवडा.",
      selectCrop: "पिकाची निवड करा",
      mandiName: "मंडी / मार्केट यार्ड",
      modalPrice: "सरासरी भाव (₹/क्विंटल)",
      freightDeduction: "वाहतूक खर्च / क्विंटल",
      netRealizedProfit: "हातात मिळणारा निव्वळ भाव",
      aiBestChoice: "AI शिफारस: सर्वाधिक नफ्याची बाजारपेठ",
      priceTrend: "भावाची दिशा",
    },
    disease: {
      title: "AI पीक डॉक्टर (रोग व कीड निदान)",
      subtitle: "पानाचा फोटो काढा, AI त्वरित रोग शोधून सेंद्रिय व रासायनिक फवारणीची योग्य माहिती देईल.",
      uploadPrompt: "पानाचा फोटो अपलोड करा किंवा नमुना निवडा",
      selectSample: "किंवा खालील नमुने तपासा:",
      analyzingLeaf: "AI न्यूरल नेटवर्क पानाचे सूक्ष्म निदान करत आहे...",
      detectedDisease: "आढळलेला रोग / कीड",
      confidenceScore: "निदान अचूकता (Confidence)",
      severity: "तीव्रता",
      symptoms: "लक्षणे",
      organicRemedy: "सेंद्रिय व जैविक उपाय",
      chemicalTreatment: "रासायनिक फवारणी",
      buyRecommendedMedicine: "व्हेरिफाइड दुकानातून योग्य औषध खरेदी करा",
    },
    pesticides: {
      title: "खात्रीशीर कृषी औषधे, खते व बियाणे",
      allCategories: "सर्व उत्पादने",
      fungicide: "बुरशीनाशके",
      pesticide: "कीटकनाशके",
      fertilizer: "पोषकद्रव्ये व टॉनिक",
      neemOil: "शुद्ध निंबोळी तेल",
      seeds: "प्रमाणित बियाणे",
      sprayer: "पंप व उपकरणे",
      buyNow: "खरेदी करा",
      verifiedSeller: "नोंदणीकृत कृषी सेवा केंद्र",
      deliveryInDays: "२४ ते ४८ तासांत थेट शेतावर डिलिव्हरी",
    },
    chatbot: {
      title: "कृषी सहायक AI डिजिटल साथी",
      subtitle: "थेट बाजारभाव, लिलावाच्या चालू ऑर्डर्स, वाहतूक भाडे आणि पीक निदानाची खात्रीशीर माहिती.",
      askPlaceholder: "बाजारभाव, गाडीचे भाडे, पीक रोग किंवा चालू लिलावाविषयी विचारा...",
      quickPrompts: {
        mandiRate: "सोयाबीनचा आजचा थेट बाजारभाव काय आहे?",
        transportCost: "३० क्विंटल माल ५० किमी नेण्यासाठी किती भाडे लागेल?",
        diseaseCare: "टोमॅटोचा करपा रोग कसा बरा करावा?",
        myBids: "माझ्या शेतमालावर किती व्यापाऱ्यांच्या बोली आल्या आहेत?",
      },
    },
  },
};
