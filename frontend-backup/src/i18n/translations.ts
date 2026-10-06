export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  appName: string;
  tagline: string;
  common: {
    save: string;
    cancel: string;
    confirm: string;
    close: string;
    back: string;
    search: string;
    filter: string;
    loading: string;
    noData: string;
    viewDetails: string;
    status: string;
    actions: string;
    viewAll: string;
    success: string;
    error: string;
    switchRole: string;
    logout: string;
    login: string;
    learnMore: string;
    proceed: string;
    refresh: string;
    date: string;
    amount: string;
    quantity: string;
    price: string;
    location: string;
    phone: string;
    contact: string;
    verified: string;
    quintal: string;
    perQuintal: string;
    active: string;
    completed: string;
    pending: string;
  };
  gateway: {
    heroBadge: string;
    title: string;
    subheadline: string;
    chooseRoleTitle: string;
    chooseRoleDesc: string;
    enterAs: string;
    kendraTitle: string;
    kendraDesc: string;
    adminTitle: string;
    adminDesc: string;
    manualLoginToggle: string;
    manualLoginHide: string;
    accountSignIn: string;
    accountSignInDesc: string;
    phoneNumber: string;
    password: string;
    authenticating: string;
    loginButton: string;
    copyright: string;
    zeroMiddlemanBadge: string;
  };
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
    paymentsEscrow: string;
    transporterFleet: string;
    sellerInventory: string;
    sellerOrders: string;
    switchDemo: string;
    notifications: string;
    noNotifications: string;
    markAllRead: string;
    trustScore: string;
    verifiedBadge: string;
    verifiedPersona: string;
    apmcLiveSync: string;
    apmcSyncDesc: string;
  };
  farmer: {
    welcome: string;
    welcomeDesc: string;
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
    recentListings: string;
    enterBiddingRoom: string;
    noListingsFound: string;
    copWarning: string;
    expectedEarnings: string;
    gradeA: string;
    gradeB: string;
    gradeC: string;
  };
  biddingRoom: {
    title: string;
    subtitle: string;
    timeLeft: string;
    liveRoomActive: string;
    currentTopBid: string;
    reserveBasePrice: string;
    copPrice: string;
    profitVsCop: string;
    leadingBuyer: string;
    bidHistory: string;
    noBidsYet: string;
    placeCounterBid: string;
    bidPerQuintal: string;
    quickAdd50: string;
    quickAdd100: string;
    quickAdd200: string;
    submitBid: string;
    outbidWarning: string;
    acceptAndClose: string;
    dealConfirmed: string;
    connectingSocket: string;
  };
  merchant: {
    title: string;
    subtitle: string;
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
    allCrops: string;
    oilseeds: string;
    cereals: string;
    vegetables: string;
    commercial: string;
    enterAuction: string;
    directBuy: string;
    escrowGuaranteed: string;
    sellerFarmer: string;
  };
  transporter: {
    title: string;
    subtitle: string;
    availableLoads: string;
    assignedTrips: string;
    completedTrips: string;
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
    inTransit: string;
    routeDetails: string;
    estimatedEarnings: string;
    noLoadsFound: string;
  };
  transporterFleet: {
    title: string;
    subtitle: string;
    hireTransporter: string;
    ratePerKm: string;
    contactDriver: string;
    callNow: string;
    verifiedFleet: string;
    instantBooking: string;
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
    distanceKm: string;
    compareMandiRates: string;
    grossMandiRate: string;
    netTakeHome: string;
    historicalChart: string;
    aiProfitCalc: string;
    allIndiaMandis: string;
    harvestQuantity: string;
    farmerLocation: string;
    grossModalRate: string;
    netRealized: string;
    regionalComparison: string;
    mandiMarket: string;
    variety: string;
    modalRate: string;
    priceRange: string;
    arrivals: string;
    freight: string;
    trend: string;
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
    cropIdentified: string;
    botanicalName: string;
    cropFamily: string;
    pathogenType: string;
    causalOrganism: string;
    infectionStage: string;
    yieldRisk: string;
    diagnosticMarkers: string;
    sprayDosage: string;
    preventiveMeasures: string;
    uploadOrDrag: string;
    autoDetectCrop: string;
    selectCrop: string;
    stage1: string;
    stage2: string;
    stage3: string;
    recentScans: string;
    certifiedAgriKendra: string;
  };
  pesticides: {
    title: string;
    subtitle: string;
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
    searchProducts: string;
    orderPlacedSuccess: string;
  };
  payments: {
    title: string;
    subtitle: string;
    escrowBalance: string;
    totalSettled: string;
    activeEscrows: string;
    escrowAssurance: string;
    transactionId: string;
    dealName: string;
    party: string;
    amount: string;
    status: string;
    date: string;
    statusLocked: string;
    statusInTransit: string;
    statusReleased: string;
    releaseFunds: string;
    payWithUPI: string;
    phonePeBadge: string;
    disputeProtection: string;
  };
  orders: {
    title: string;
    subtitle: string;
    allOrders: string;
    pendingOrders: string;
    completedOrders: string;
    orderNumber: string;
    cropPurchased: string;
    counterParty: string;
    totalPayment: string;
    deliveryStatus: string;
    invoice: string;
    disputeButton: string;
    farmer: string;
    merchant: string;
    quantity: string;
    agreedRate: string;
    profit: string;
    connectTransporter: string;
  };
  seller: {
    title: string;
    subtitle: string;
    addProduct: string;
    totalProducts: string;
    activeStock: string;
    storeEarnings: string;
    productName: string;
    category: string;
    stock: string;
    price: string;
    editProduct: string;
    deleteProduct: string;
    ordersReceived: string;
  };
  admin: {
    title: string;
    subtitle: string;
    totalPlatformUsers: string;
    activeAuctions: string;
    escrowVolume: string;
    activeTransporters: string;
    platformLedger: string;
    userRegistry: string;
    disputeManagement: string;
    marketSupervision: string;
    systemHealth: string;
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
    send: string;
    clearChat: string;
    thinking: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "Smart Krishi Connect",
    tagline: "Empowering Farmers, Connecting Opportunities",
    common: {
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      close: "Close",
      back: "Back",
      search: "Search...",
      filter: "Filter",
      loading: "Loading...",
      noData: "No records found",
      viewDetails: "View Details",
      status: "Status",
      actions: "Actions",
      viewAll: "View All",
      success: "Operation Successful",
      error: "An error occurred",
      switchRole: "Switch Role",
      logout: "Log Out",
      login: "Log In",
      learnMore: "Learn More",
      proceed: "Proceed",
      refresh: "Refresh",
      date: "Date",
      amount: "Amount",
      quantity: "Quantity",
      price: "Price",
      location: "Location",
      phone: "Phone",
      contact: "Contact",
      verified: "Verified",
      quintal: "Qtl",
      perQuintal: "₹/Quintal",
      active: "Active",
      completed: "Completed",
      pending: "Pending",
    },
    gateway: {
      heroBadge: "Empowering Indian Agriculture · 0% Middleman Cut",
      title: "Smart Krishi Connect",
      subheadline: "A next-generation digital agricultural ecosystem connecting verified farmers directly with wholesale APMC buyers, smart freight transporters, and AI vision crop intelligence.",
      chooseRoleTitle: "Choose Your Role to Enter Workspace",
      chooseRoleDesc: "Select your role below to launch your personalized dashboard and portal:",
      enterAs: "Enter as",
      kendraTitle: "Agri-Input Kendra Seller",
      kendraDesc: "Sell certified bio-pesticides, seeds & sprayers directly to farmers.",
      adminTitle: "APMC Market Supervisor (Admin)",
      adminDesc: "Platform governance, dispute arbitration, and real-time transaction ledger.",
      manualLoginToggle: "Or Log In with Custom Phone / Password",
      manualLoginHide: "Hide Custom Phone & Password Login",
      accountSignIn: "Account Sign In",
      accountSignInDesc: "Enter registered phone number and password to access your dedicated workspace.",
      phoneNumber: "Phone Number",
      password: "Password",
      authenticating: "Authenticating...",
      loginButton: "Log In to Workspace",
      copyright: "Smart Krishi Connect (FarmChain) © 2026. Empowering Indian Agriculture.",
      zeroMiddlemanBadge: "100% Direct APMC Trading · Zero Predatory Cut",
    },
    roles: {
      farmer: "Farmer (Kisan)",
      merchant: "Wholesale Merchant",
      transporter: "Logistics Transporter",
      seller: "Agri-Input Kendra Seller",
      admin: "APMC Market Supervisor",
    },
    nav: {
      dashboard: "Dashboard",
      myListings: "My Crop Listings",
      marketplace: "Crop Marketplace",
      liveBidding: "Live Bidding Room",
      transportJobs: "Freight Transport Hub",
      mandiIntelligence: "Mandi Intelligence",
      plantDoctor: "AI Plant Doctor",
      pesticideStore: "Pesticides & Inputs",
      myOrders: "My Orders & Deals",
      adminPanel: "Admin Oversight",
      paymentsEscrow: "Payments & Escrow",
      transporterFleet: "Transporter Fleet",
      sellerInventory: "Product Inventory",
      sellerOrders: "Order Fulfillment",
      switchDemo: "Switch Demo Persona",
      notifications: "Notifications",
      noNotifications: "No notifications yet",
      markAllRead: "Mark all as read",
      trustScore: "Trust Score",
      verifiedBadge: "Verified",
      verifiedPersona: "Verified Persona",
      apmcLiveSync: "APMC Live Sync Active",
      apmcSyncDesc: "Real-time trade feeds, e-KYC & smart logistics connected",
    },
    farmer: {
      welcome: "Welcome",
      welcomeDesc: "Connect directly with verified wholesale merchants, lock in guaranteed profit-protected bids, calculate real-time net mandi returns, and diagnose crop health with AI vision.",
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
      recentListings: "Recent Crop Listings & Bids",
      enterBiddingRoom: "Enter Live Bidding Room",
      noListingsFound: "No listings posted yet. Click create listing to publish your harvest!",
      copWarning: "Cost-of-production profit protection active for this lot.",
      expectedEarnings: "Estimated Total Value",
      gradeA: "Grade A (Premium)",
      gradeB: "Grade B (Standard)",
      gradeC: "Grade C (Commercial)",
    },
    biddingRoom: {
      title: "APMC Live Bidding & Digital Auction Floor",
      subtitle: "Transparent digital auction with real-time bidding, automatic cost-of-production alerts, and direct buyer settlement.",
      timeLeft: "Auction Timer",
      liveRoomActive: "Live Bidding Session Active",
      currentTopBid: "Current Highest Bid",
      reserveBasePrice: "Reserve Price",
      copPrice: "Farmer Cost of Production",
      profitVsCop: "Guaranteed Profit Margin",
      leadingBuyer: "Leading Merchant",
      bidHistory: "Live Bid Stream",
      noBidsYet: "No bids submitted yet. Be the first to place a bid!",
      placeCounterBid: "Submit Live Counter-Bid",
      bidPerQuintal: "Bid Amount (₹/Quintal)",
      quickAdd50: "+ ₹50 / Qtl",
      quickAdd100: "+ ₹100 / Qtl",
      quickAdd200: "+ ₹200 / Qtl",
      submitBid: "Place Competitive Bid",
      outbidWarning: "You have been outbid! Place a higher bid to reclaim the lead.",
      acceptAndClose: "Accept Leading Bid & Finalize Deal",
      dealConfirmed: "Deal successfully finalized and locked in escrow!",
      connectingSocket: "Connecting to real-time bidding stream...",
    },
    merchant: {
      title: "Wholesale Produce Sourcing Marketplace",
      subtitle: "Discover verified farm produce lots across APMCs, submit real-time competitive bids in open auctions, and lock in guaranteed supply.",
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
      allCrops: "All Crops",
      oilseeds: "Oilseeds",
      cereals: "Grains & Cereals",
      vegetables: "Vegetables",
      commercial: "Commercial",
      enterAuction: "Join Live Auction",
      directBuy: "Buy at Reserve Rate",
      escrowGuaranteed: "100% Escrow Protected Trade",
      sellerFarmer: "Farmer",
    },
    transporter: {
      title: "Smart Logistics & Produce Freight Hub",
      subtitle: "Access verified produce freight loads, accept AI-calculated distance-based payout routes, and manage trip status.",
      availableLoads: "Available Produce Loads",
      assignedTrips: "My Active Trips",
      completedTrips: "Completed Trips",
      pickup: "Pickup Farm",
      drop: "Destination Mandi / Depot",
      distance: "Distance",
      loadWeight: "Load Weight",
      payout: "Guaranteed Payout",
      vehicleType: "Matched Vehicle",
      acceptJob: "Accept Delivery Job",
      startTrip: "Start Trip (In Transit)",
      markDelivered: "Confirm Delivery & Collect Payment",
      completed: "Completed Trip",
      inTransit: "In Transit",
      routeDetails: "Route & Dispatch Details",
      estimatedEarnings: "Freight Rate Payout",
      noLoadsFound: "No loads currently waiting for transport.",
    },
    transporterFleet: {
      title: "Verified Transporter Fleet Directory",
      subtitle: "Connect with verified local freight transporters offering competitive per-km haulage rates.",
      hireTransporter: "Hire Transporter",
      ratePerKm: "Rate / Km",
      contactDriver: "Contact Logistics Partner",
      callNow: "Call Transporter",
      verifiedFleet: "Verified GPS Fleet",
      instantBooking: "Direct Booking Available",
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
      distanceKm: "Distance from Farm",
      compareMandiRates: "APMC Price Comparison Matrix",
      grossMandiRate: "Gross APMC Rate",
      netTakeHome: "Net Take-Home Earnings",
      historicalChart: "30-Day APMC Rate Movement",
      aiProfitCalc: "AI Profit Calculator",
      allIndiaMandis: "All-India Live Mandi Board",
      harvestQuantity: "Harvest Batch Quantity",
      farmerLocation: "Farmer Origin Location",
      grossModalRate: "Gross APMC Modal Rate",
      netRealized: "Net Realized In Hand",
      regionalComparison: "Regional Wholesale APMC Mandi Comparison for",
      mandiMarket: "Mandi / Market",
      variety: "Variety",
      modalRate: "Modal Rate",
      priceRange: "Price Range (Min - Max)",
      arrivals: "Arrivals (Tonnes)",
      freight: "Freight / Qtl",
      trend: "Trend",
    },
    disease: {
      title: "AI Plant Doctor & Crop Health Diagnostic",
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
      cropIdentified: "Identified Crop",
      botanicalName: "Botanical Classification",
      cropFamily: "Plant Family",
      pathogenType: "Pathogen Classification",
      causalOrganism: "Causal Organism",
      infectionStage: "Infection Stage",
      yieldRisk: "Potential Yield Impact",
      diagnosticMarkers: "Observed Diagnostic Indicators",
      sprayDosage: "Spray Dosage & Field Application",
      preventiveMeasures: "Preventive Cultural Best Practices",
      uploadOrDrag: "Click to upload leaf photo or drag & drop image here",
      autoDetectCrop: "🤖 Auto-Detect Crop from Photo",
      selectCrop: "Target Crop for Pathology",
      stage1: "Stage 1: Crop Identification",
      stage2: "Stage 2: Crop Pathology & Diagnosis",
      stage3: "Stage 3: Targeted Agronomic Solutions",
      recentScans: "Recent Diagnostic Prescriptions",
      certifiedAgriKendra: "Certified Agri-Kendra",
    },
    pesticides: {
      title: "Verified Agri Inputs & Pesticides",
      subtitle: "Genuine bio-fertilizers, organic pesticides, high-germination seeds, and agricultural sprayers.",
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
      searchProducts: "Search inputs, fertilizers, medicines...",
      orderPlacedSuccess: "Order placed successfully with Krishi Kendra!",
    },
    payments: {
      title: "PhonePe UPI & APMC Escrow Ledger",
      subtitle: "Secure zero-risk payments held safely in platform escrow until goods are physically delivered and verified.",
      escrowBalance: "Escrow Vault Balance",
      totalSettled: "Total Settled Payouts",
      activeEscrows: "Active Trade Escrows",
      escrowAssurance: "100% Protected Escrow Settlement",
      transactionId: "Transaction Hash / ID",
      dealName: "Harvest / Load Details",
      party: "Counter-Party",
      amount: "Trade Amount",
      status: "Escrow Status",
      date: "Initiated Date",
      statusLocked: "Locked in Escrow",
      statusInTransit: "In Transit Verification",
      statusReleased: "Released to Bank Account",
      releaseFunds: "Release Payment to Farmer",
      payWithUPI: "Pay with PhonePe UPI",
      phonePeBadge: "Secured via PhonePe Business Escrow",
      disputeProtection: "Zero-Dispute APMC Guarantee",
    },
    orders: {
      title: "Trade Orders & Fulfillment Tracker",
      subtitle: "Track farm-to-depot shipments, view verified invoices, and monitor trade milestones in real time.",
      allOrders: "All Active Orders",
      pendingOrders: "Pending Dispatch",
      completedOrders: "Completed & Settled",
      orderNumber: "Order #",
      cropPurchased: "Produce Item",
      counterParty: "Trading Partner",
      totalPayment: "Settlement Sum",
      deliveryStatus: "Delivery Stage",
      invoice: "View APMC Invoice",
      disputeButton: "Report Issue",
      farmer: "Farmer",
      merchant: "Merchant",
      quantity: "Quantity",
      agreedRate: "Agreed Rate",
      profit: "Net Realized Profit",
      connectTransporter: "Connect & Pay Transporter",
    },
    seller: {
      title: "Agri-Input Kendra Inventory Management",
      subtitle: "Manage inventory, update stock levels, and fulfill orders directly to farmers.",
      addProduct: "Add New Product",
      totalProducts: "Catalog Products",
      activeStock: "Units in Stock",
      storeEarnings: "Store Revenue",
      productName: "Product Name",
      category: "Category",
      stock: "Available Units",
      price: "Unit Price (₹)",
      editProduct: "Edit",
      deleteProduct: "Remove",
      ordersReceived: "Farmer Orders Received",
    },
    admin: {
      title: "APMC Market Supervisor & Governance Hub",
      subtitle: "System-wide trade monitoring, dispute arbitration, and audit ledger for agricultural transactions.",
      totalPlatformUsers: "Registered Platform Users",
      activeAuctions: "Live APMC Auctions",
      escrowVolume: "Total Escrow Volume",
      activeTransporters: "Active Transporter Fleet",
      platformLedger: "Real-time Platform Transaction Ledger",
      userRegistry: "Verified User Registry",
      disputeManagement: "Dispute Arbitration Queue",
      marketSupervision: "Market Supervision Rules",
      systemHealth: "System Status: 100% Operational",
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
      send: "Send",
      clearChat: "Clear History",
      thinking: "Krishi Sahayak is analyzing your request...",
    },
  },
  hi: {
    appName: "स्मार्ट कृषि कनेक्ट",
    tagline: "किसानों का सशक्तिकरण, अवसरों का सीधा जुड़ाव",
    common: {
      save: "सुरक्षित करें",
      cancel: "रद्द करें",
      confirm: "पुष्टि करें",
      close: "बंद करें",
      back: "पीछे जाएं",
      search: "खोजें...",
      filter: "फ़िल्टर",
      loading: "लोड हो रहा है...",
      noData: "कोई जानकारी नहीं मिली",
      viewDetails: "विवरण देखें",
      status: "स्थिति",
      actions: "कार्रवाई",
      viewAll: "सभी देखें",
      success: "कार्य सफल रहा",
      error: "कोई त्रुटि हुई",
      switchRole: "भूमिका बदलें",
      logout: "लॉग आउट",
      login: "लॉग इन",
      learnMore: "और जानें",
      proceed: "आगे बढ़ें",
      refresh: "ताज़ा करें",
      date: "दिनांक",
      amount: "राशि",
      quantity: "मात्रा",
      price: "मूल्य",
      location: "स्थान",
      phone: "फोन",
      contact: "संपर्क करें",
      verified: "सत्यापित",
      quintal: "क्विंटल",
      perQuintal: "₹/क्विंटल",
      active: "सक्रिय",
      completed: "पूर्ण",
      pending: "प्रतीक्षारत",
    },
    gateway: {
      heroBadge: "भारतीय कृषि का सशक्तिकरण · 0% बिचौलिया कटौती",
      title: "स्मार्ट कृषि कनेक्ट",
      subheadline: "अगली पीढ़ी का डिजिटल कृषि मंच जो सत्यापित किसानों को सीधे थोक व्यापारियों, स्मार्ट ट्रांसपोर्टरों और AI फसल रोग निदान से जोड़ता है।",
      chooseRoleTitle: "कार्यक्षेत्र में प्रवेश हेतु अपनी भूमिका चुनें",
      chooseRoleDesc: "अपना व्यक्तिगत डैशबोर्ड खोलने के लिए नीचे अपनी भूमिका पर क्लिक करें:",
      enterAs: "प्रवेश करें बतौर",
      kendraTitle: "कृषि सेवा केंद्र (दवा व बीज विक्रेता)",
      kendraDesc: "प्रमाणित जैविक कीटनाशक, बीज और स्प्रेयर सीधे किसानों को बेचें।",
      adminTitle: "मंडी पर्यवेक्षक (एडमिन)",
      adminDesc: "मंच प्रबंधन, विवाद निपटान और रियल-टाइम वित्तीय रिकॉर्ड।",
      manualLoginToggle: "या फोन नंबर व पासवर्ड से लॉग इन करें",
      manualLoginHide: "फोन व पासवर्ड विकल्प छुपाएं",
      accountSignIn: "खाता साइन इन",
      accountSignInDesc: "अपने कार्यक्षेत्र तक पहुंचने के लिए पंजीकृत फोन नंबर और पासवर्ड दर्ज करें।",
      phoneNumber: "फोन नंबर",
      password: "पासवर्ड",
      authenticating: "प्रमाणीकरण जारी है...",
      loginButton: "कार्यक्षेत्र में प्रवेश करें",
      copyright: "स्मार्ट कृषि कनेक्ट (FarmChain) © 2026. भारतीय कृषि सशक्तिकरण।",
      zeroMiddlemanBadge: "100% सीधी मंडी खरीद · शून्य अनुचित कटौती",
    },
    roles: {
      farmer: "किसान (Farmer)",
      merchant: "थोक व्यापारी (Merchant)",
      transporter: "ट्रांसपोर्टर (Logistics)",
      seller: "कृषि सेवा केंद्र विक्रेता",
      admin: "मंडी पर्यवेक्षक (एडमिन)",
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
      paymentsEscrow: "भुगतान व एस्क्रो",
      transporterFleet: "ट्रांसपोर्टर बेड़ा",
      sellerInventory: "उत्पाद इन्वेंटरी",
      sellerOrders: "प्राप्त ऑर्डर",
      switchDemo: "डेमो यूज़र बदलें",
      notifications: "सूचनाएं",
      noNotifications: "कोई नई सूचना नहीं है",
      markAllRead: "सभी पढ़ी गईं चिह्नित करें",
      trustScore: "विश्वास स्कोर",
      verifiedBadge: "सत्यापित",
      verifiedPersona: "सत्यापित प्रोफाइल",
      apmcLiveSync: "मंडी लाइव सिंक सक्रिय",
      apmcSyncDesc: "रियल-टाइम व्यापार डेटा, ई-केवाईसी व स्मार्ट लॉजिस्टिक्स कनेक्टेड",
    },
    farmer: {
      welcome: "नमस्ते",
      welcomeDesc: "सत्यापित व्यापारियों से सीधे जुड़ें, उत्पादन लागत से सुरक्षित लाभदायक बोलियां प्राप्त करें, शुद्ध मंडी मुनाफा जानें और AI से फसल रोग का इलाज करें।",
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
      acceptWinningBid: "सर्वोच्च बोली स्वीकार करें और सौदा लॉक करें",
      connectTransportPrompt: "सौदा पक्का हुआ! क्या आप सत्यापित ट्रांसपोर्टर से जुड़ना चाहते हैं?",
      bookTransportNow: "स्मार्ट ट्रांसपोर्ट बुक करें",
      recentListings: "हालिया फसल लिस्टिंग व बोलियां",
      enterBiddingRoom: "लाइव बोली कक्ष में जाएं",
      noListingsFound: "अभी तक कोई फसल लिस्ट नहीं की गई है। नई फसल जोड़ने के लिए बटन दबाएं!",
      copWarning: "इस फसल पर उत्पादन लागत मुनाफा सुरक्षा सक्रिय है।",
      expectedEarnings: "अनुमानित कुल मूल्य",
      gradeA: "ग्रेड ए (उत्कृष्ट)",
      gradeB: "ग्रेड बी (मध्यम)",
      gradeC: "ग्रेड सी (सामान्य)",
    },
    biddingRoom: {
      title: "मंडी डिजिटल लाइव नीलामी व बोली कक्ष",
      subtitle: "पारदर्शी डिजिटल नीलामी, रियल-टाइम बोली मुकाबला, उत्पादन लागत सुरक्षा और सीधा किसान भुगतान।",
      timeLeft: "नीलामी समय शेष",
      liveRoomActive: "लाइव बोली सत्र सक्रिय",
      currentTopBid: "वर्तमान सर्वोच्च बोली",
      reserveBasePrice: "न्यूनतम बेस भाव",
      copPrice: "किसान की उत्पादन लागत",
      profitVsCop: "सुरक्षित मुनाफा मार्जिन",
      leadingBuyer: "अग्रणी व्यापारी",
      bidHistory: "लाइव बोली प्रवाह",
      noBidsYet: "अभी तक कोई बोली नहीं आई है। पहली बोली लगाएं!",
      placeCounterBid: "लाइव बोली दर्ज करें",
      bidPerQuintal: "बोली भाव (₹/क्विंटल)",
      quickAdd50: "+ ₹50 / क्विंटल",
      quickAdd100: "+ ₹100 / क्विंटल",
      quickAdd200: "+ ₹200 / क्विंटल",
      submitBid: "बोली जमा करें",
      outbidWarning: "अन्य व्यापारी ने आपसे अधिक बोली लगाई है! बढ़त पाने हेतु नई बोली लगाएं।",
      acceptAndClose: "सर्वोच्च बोली स्वीकार कर सौदा पक्का करें",
      dealConfirmed: "सौदा सफलतापूर्वक लॉक हो गया है और एस्क्रो में सुरक्षित है!",
      connectingSocket: "लाइव बोली सर्वर से जुड़ रहा है...",
    },
    merchant: {
      title: "थोक फसल खरीद बाज़ार",
      subtitle: "विभिन्न मंडियों से सत्यापित खेत उत्पाद खोजें, खुली लाइव नीलामी में बोली लगाएं और सीधे खेत से माल सुरक्षित करें।",
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
      allCrops: "सभी फसलें",
      oilseeds: "तिलहन",
      cereals: "अनाज व दालें",
      vegetables: "सब्जियां",
      commercial: "व्यावसायिक",
      enterAuction: "लाइव नीलामी में भाग लें",
      directBuy: "बेस भाव पर सीधा खरीदें",
      escrowGuaranteed: "100% एस्क्रो सुरक्षित सौदा",
      sellerFarmer: "किसान",
    },
    transporter: {
      title: "स्मार्ट कृषि माल ढुलाई व लॉजिस्टिक्स",
      subtitle: "सत्यापित कृषि माल ढुलाई के आर्डर स्वीकारें, दूरी के अनुसार तय भाड़ा पाएं और ट्रिप का प्रबंधन करें।",
      availableLoads: "उपलब्ध माल (Loads)",
      assignedTrips: "मेरी सक्रिय ट्रिप्स",
      completedTrips: "पूर्ण ट्रिप्स",
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
      inTransit: "रास्ते में",
      routeDetails: "रूट व प्रेषण विवरण",
      estimatedEarnings: "भाड़ा भुगतान राशि",
      noLoadsFound: "वर्तमान में कोई माल परिवहन के लिए प्रतीक्षारत नहीं है।",
    },
    transporterFleet: {
      title: "सत्यापित ट्रांसपोर्टर बेड़ा निर्देशिका",
      subtitle: "किमी के अनुसार कम दरों पर कृषि माल ले जाने वाले नजदीकी ट्रांसपोर्टरों से संपर्क करें।",
      hireTransporter: "ट्रांसपोर्टर बुक करें",
      ratePerKm: "दर / किमी",
      contactDriver: "ड्राइवर से बात करें",
      callNow: "सीधा फोन करें",
      verifiedFleet: "जीपीएस युक्त गाड़ियां",
      instantBooking: "त्वरित बुकिंग उपलब्ध",
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
      distanceKm: "खेत से दूरी",
      compareMandiRates: "मंडी भाव तुलना चार्ट",
      grossMandiRate: "कुल मंडी भाव",
      netTakeHome: "हाथ में आने वाला शुद्ध मुनाफा",
      historicalChart: "पिछले 30 दिनों का भाव रुझान",
      aiProfitCalc: "AI मुनाफा कैलकुलेटर",
      allIndiaMandis: "अखिल भारतीय लाइव मंडी बोर्ड",
      harvestQuantity: "फसल बैच मात्रा",
      farmerLocation: "किसान का स्थान",
      grossModalRate: "सकल मंडी मॉडल भाव",
      netRealized: "हाथ में मिलने वाला शुद्ध भाव",
      regionalComparison: "क्षेत्रीय थोक मंडी तुलना -",
      mandiMarket: "मंडी / बाज़ार",
      variety: "किस्म",
      modalRate: "मॉडल भाव",
      priceRange: "भाव दायरा (न्यूनतम - अधिकतम)",
      arrivals: "दैनिक आवक (टन)",
      freight: "भाड़ा / क्विंटल",
      trend: "रुझान",
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
      cropIdentified: "पहचानी गई फसल",
      botanicalName: "वानस्पतिक नाम",
      cropFamily: "पौधे का कुल",
      pathogenType: "रोगकारक प्रकार",
      causalOrganism: "रोगजनक जीव",
      infectionStage: "संक्रमण का चरण",
      yieldRisk: "उपज पर संभावित असर",
      diagnosticMarkers: "पहचाने गए मुख्य लक्षण",
      sprayDosage: "छिड़काव मात्रा व समय",
      preventiveMeasures: "भविष्य के बचाव के उपाय",
      uploadOrDrag: "पत्ती का फोटो अपलोड करें या यहां खींच कर लाएं",
      autoDetectCrop: "🤖 फोटो से फसल स्वतः पहचानें",
      selectCrop: "फसल का प्रकार चुनें",
      stage1: "चरण 1: फसल की पहचान",
      stage2: "चरण 2: फसल रोग निदान",
      stage3: "चरण 3: समाधान व उपचार",
      recentScans: "हालिया रोग जांच इतिहास",
      certifiedAgriKendra: "प्रमाणित कृषि सेवा केंद्र",
    },
    pesticides: {
      title: "सत्यापित कृषि उत्पाद व कीटनाशक बाज़ार",
      subtitle: "शुद्ध जैविक खाद, कीटनाशक, उच्च अंकुरण बीज और कृषि स्प्रेयर।",
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
      searchProducts: "दवाएं, खाद व बीज खोजें...",
      orderPlacedSuccess: "ऑर्डर सफलतापूर्वक दर्ज कर लिया गया है!",
    },
    payments: {
      title: "PhonePe UPI व मंडी एस्क्रो लेजर",
      subtitle: "सुरक्षित भुगतान जो डिलीवरी की भौतिक पुष्टि होने तक सुरक्षित एस्क्रो खाते में रहता है।",
      escrowBalance: "एस्क्रो वॉल्ट बैलेंस",
      totalSettled: "कुल निपटाया गया भुगतान",
      activeEscrows: "सक्रिय एस्क्रो सौदे",
      escrowAssurance: "100% सुरक्षित एस्क्रो गारंटी",
      transactionId: "लेनदेन आईडी",
      dealName: "सौदा / फसल विवरण",
      party: "दूसरा पक्ष",
      amount: "सौदा राशि",
      status: "एस्क्रो स्थिति",
      date: "शुरुआत दिनांक",
      statusLocked: "एस्क्रो में लॉक",
      statusInTransit: "रास्ते में (सत्यापन जारी)",
      statusReleased: "बैंक खाते में जमा",
      releaseFunds: "किसान को भुगतान जारी करें",
      payWithUPI: "PhonePe UPI से भुगतान करें",
      phonePeBadge: "PhonePe बिजनेस एस्क्रो द्वारा सुरक्षित",
      disputeProtection: "शून्य विवाद मंडी सुरक्षा",
    },
    orders: {
      title: "व्यापार ऑर्डर व पूर्ति ट्रैकर",
      subtitle: "खेत से गोदाम तक माल की स्थिति ट्रैक करें, सत्यापित इनवॉइस देखें और चरणों की निगरानी करें।",
      allOrders: "सभी सक्रिय ऑर्डर",
      pendingOrders: "डिस्पैच के लिए तैयार",
      completedOrders: "पूर्ण व भुगतान संपन्न",
      orderNumber: "ऑर्डर सं.",
      cropPurchased: "फसल उत्पाद",
      counterParty: "व्यापार साझेदार",
      totalPayment: "कुल भुगतान राशि",
      deliveryStatus: "डिलीवरी चरण",
      invoice: "मंडी इनवॉइस देखें",
      disputeButton: "समस्या दर्ज करें",
      farmer: "किसान",
      merchant: "व्यापारी",
      quantity: "मात्रा",
      agreedRate: "तय भाव",
      profit: "शुद्ध मुनाफा",
      connectTransporter: "ट्रांसपोर्टर से जुड़ें व भुगतान करें",
    },
    seller: {
      title: "कृषि सेवा केंद्र इन्वेंटरी प्रबंधन",
      subtitle: "स्टॉक प्रबंधन करें, कीमतें अपडेट करें और किसानों के ऑर्डर पूरे करें।",
      addProduct: "नया उत्पाद जोड़ें",
      totalProducts: "कुल उत्पाद",
      activeStock: "उपलब्ध स्टॉक यूनिट्स",
      storeEarnings: "कुल दुकान आय",
      productName: "उत्पाद का नाम",
      category: "श्रेणी",
      stock: "उपलब्ध मात्रा",
      price: "मूल्य (₹)",
      editProduct: "संपादित करें",
      deleteProduct: "हटाएं",
      ordersReceived: "किसानों से प्राप्त ऑर्डर",
    },
    admin: {
      title: "मंडी पर्यवेक्षक व मंच नियंत्रण केंद्र",
      subtitle: "व्यापार की लाइव निगरानी, विवाद निपटान और वित्तीय लेनदेन का पूर्ण लेजर।",
      totalPlatformUsers: "पंजीकृत उपयोगकर्ता",
      activeAuctions: "सक्रिय मंडी नीलामियां",
      escrowVolume: "कुल एस्क्रो वॉल्यूम",
      activeTransporters: "सक्रिय गाड़ियां",
      platformLedger: "रियल-टाइम व्यापार लेजर",
      userRegistry: "सत्यापित उपयोगकर्ता सूची",
      disputeManagement: "विवाद समाधान कतार",
      marketSupervision: "बाज़ार नियंत्रण नियम",
      systemHealth: "सिस्टम स्थिति: 100% सुचारू",
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
      send: "भेजें",
      clearChat: "इतिहास मिटाएं",
      thinking: "कृषि सहायक सोच रहा है...",
    },
  },
  mr: {
    appName: "स्मार्ट कृषी कनेक्ट",
    tagline: "शेतकऱ्यांचे सक्षमीकरण, संधींचा थेट संगम",
    common: {
      save: "जतन करा",
      cancel: "रद्द करा",
      confirm: "निश्चित करा",
      close: "बंद करा",
      back: "मागे जा",
      search: "शोधा...",
      filter: "फिल्टर",
      loading: "लोड होत आहे...",
      noData: "माहिती उपलब्ध नाही",
      viewDetails: "तपशील पहा",
      status: "स्थिती",
      actions: "कृती",
      viewAll: "सर्व पहा",
      success: "यशस्वी झाले",
      error: "त्रुटी आढळली",
      switchRole: "भूमिका बदला",
      logout: "बाहेर पडा (Log Out)",
      login: "लॉग इन",
      learnMore: "अधिक जाणून घ्या",
      proceed: "पुढे जा",
      refresh: "रिफ्रेश करा",
      date: "दिनांक",
      amount: "रक्कम",
      quantity: "प्रमाण",
      price: "भाव",
      location: "स्थान",
      phone: "फोन",
      contact: "संपर्क साधा",
      verified: "व्हेरिफाइड",
      quintal: "क्विंटल",
      perQuintal: "₹/क्विंटल",
      active: "चालू",
      completed: "पूर्ण",
      pending: "प्रलंबित",
    },
    gateway: {
      heroBadge: "भारतीय शेतीचे सक्षमीकरण · 0% दलाली",
      title: "स्मार्ट कृषी कनेक्ट",
      subheadline: "शेतकऱ्यांना थेट कृषी उत्पन्न बाजार समितीचे व्यापारी, परवडणारे माल वाहतूकदार आणि AI पीक रोग निदानाशी जोडणारी डिजिटल परिसंस्था.",
      chooseRoleTitle: "प्रवेश करण्यासाठी आपली भूमिका निवडा",
      chooseRoleDesc: "आपला वैयक्तिक डॅशबोर्ड उघडण्यासाठी खालील भूमिकेवर क्लिक करा:",
      enterAs: "प्रवेश करा:",
      kendraTitle: "कृषी सेवा केंद्र (औषधे व खते)",
      kendraDesc: "प्रमाणित सेंद्रिय औषधे, खते आणि बियाणे थेट शेतकऱ्यांना विका.",
      adminTitle: "बाजार समिती पर्यवेक्षक (ॲडमिन)",
      adminDesc: "बाजार नियमन, वाद निवारण आणि थेट व्यवहार नियंत्रण.",
      manualLoginToggle: "किंवा फोन नंबर व पासवर्डने लॉग इन करा",
      manualLoginHide: "फोन व पासवर्ड पर्याय लपवा",
      accountSignIn: "खाते साइन इन",
      accountSignInDesc: "आपल्या डॅशबोर्डमध्ये जाण्यासाठी नोंदणीकृत फोन नंबर आणि पासवर्ड टाका.",
      phoneNumber: "फोन नंबर",
      password: "पासवर्ड",
      authenticating: "तपासणी चालू आहे...",
      loginButton: "डॅशबोर्डमध्ये प्रवेश करा",
      copyright: "स्मार्ट कृषी कनेक्ट (FarmChain) © 2026. भारतीय कृषी सक्षमीकरण.",
      zeroMiddlemanBadge: "100% थेट शेतकरी-व्यापारी व्यवहार · शून्य फसवणूक",
    },
    roles: {
      farmer: "शेतकरी (Farmer)",
      merchant: "घाऊक व्यापारी (Merchant)",
      transporter: "वाहतूकदार (Logistics)",
      seller: "कृषी सेवा केंद्र विक्रेता",
      admin: "बाजार समिती पर्यवेक्षक (ॲडमिन)",
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
      paymentsEscrow: "पैसे व एस्क्रो",
      transporterFleet: "वाहतूकदार यादी",
      sellerInventory: "औषध साठा",
      sellerOrders: "प्राप्त ऑर्डर्स",
      switchDemo: "डेमो वापरकर्ता बदला",
      notifications: "सूचना",
      noNotifications: "नवीन सूचना नाहीत",
      markAllRead: "सर्व वाचल्या म्हणून चिन्हांकित करा",
      trustScore: "विश्वास निर्देशांक",
      verifiedBadge: "व्हेरिफाइड",
      verifiedPersona: "व्हेरिफाइड प्रोफाइल",
      apmcLiveSync: "बाजार समिती थेट जोडणी",
      apmcSyncDesc: "थेट बाजारभाव, ई-केवायसी व स्मार्ट वाहतूक जोडलेले",
    },
    farmer: {
      welcome: "स्वागत आहे",
      welcomeDesc: "थेट व्यापाऱ्यांशी जोडा, उत्पादन खर्चापेक्षा अधिक नफा मिळवणारी बोली लावा, वाहतूक खर्च वजा करून खरा बाजारभाव शोधा आणि AI ने पिकांचे रोग ओळखा.",
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
      recentListings: "नुकताच नोंदवलेला शेतमाल व बोली",
      enterBiddingRoom: "थेट लिलाव कक्षात जा",
      noListingsFound: "अद्याप कोणताही शेतमाल नोंदवलेला नाही. शेतमाल नोंदवण्यासाठी बटण दाबा!",
      copWarning: "या शेतमालासाठी उत्पादन खर्च नफा संरक्षण सक्रिय आहे.",
      expectedEarnings: "अंदाजे एकूण रक्कम",
      gradeA: "ग्रेड ए (उत्तम प्रत)",
      gradeB: "ग्रेड बी (मध्यम प्रत)",
      gradeC: "ग्रेड सी (साधारण प्रत)",
    },
    biddingRoom: {
      title: "थेट डिजिटल लिलाव व बोली कक्ष",
      subtitle: "पारदर्शक डिजिटल लिलाव, चालू चढाओढ, उत्पादन खर्च नफा संरक्षण आणि थेट हमी पेमेंट.",
      timeLeft: "शिल्लक वेळ",
      liveRoomActive: "थेट लिलाव सुरू आहे",
      currentTopBid: "सध्याची सर्वोच्च बोली",
      reserveBasePrice: "किमान मूळ भाव",
      copPrice: "शेतकऱ्याचा उत्पादन खर्च",
      profitVsCop: "निश्चित नफा मार्जिन",
      leadingBuyer: "सर्वाधिक बोली लावणारा व्यापारी",
      bidHistory: "चालू बोली प्रवाह",
      noBidsYet: "अजून कोणतीही बोली आलेली नाही. पहिली बोली लावा!",
      placeCounterBid: "थेट नवीन बोली लावा",
      bidPerQuintal: "बोली भाव (₹/क्विंटल)",
      quickAdd50: "+ ₹50 / क्विंटल",
      quickAdd100: "+ ₹100 / क्विंटल",
      quickAdd200: "+ ₹200 / क्विंटल",
      submitBid: "बोली नोंदवा",
      outbidWarning: "दुसऱ्या व्यापाऱ्याने तुमच्यापेक्षा जास्त बोली लावली आहे! आघाडी घेण्यासाठी वाढीव बोली लावा.",
      acceptAndClose: "सर्वोच्च बोली स्वीकारून सौदा पक्का करा",
      dealConfirmed: "सौदा यशस्वीरित्या पक्का झाला असून पैसे एस्क्रोमध्ये सुरक्षित आहेत!",
      connectingSocket: "थेट लिलाव सर्व्हरशी जोडत आहे...",
    },
    merchant: {
      title: "घाऊक शेतमाल खरेदी बाजारपेठ",
      subtitle: "थेट शेतकऱ्यांचा प्रमाणित शेतमाल शोधा, खुल्या लिलावात भाग घ्या आणि खात्रीशीर माल खरेदी करा.",
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
      allCrops: "सर्व पिके",
      oilseeds: "गळीत धान्ये",
      cereals: "अन्नधान्य व डाळी",
      vegetables: "भाजीपाला",
      commercial: "नगदी पिके",
      enterAuction: "थेट लिलावात सामील व्हा",
      directBuy: "मूळ भावात थेट खरेदी",
      escrowGuaranteed: "100% सुरक्षित व्यवहार",
      sellerFarmer: "शेतकरी",
    },
    transporter: {
      title: "स्मार्ट शेतमाल वाहतूक व लॉजिस्टिक्स",
      subtitle: "शेतमालाच्या फेऱ्या स्वीकारा, योग्य भाडे मिळवा आणि सुरक्षित माल पोहोचवा.",
      availableLoads: "वाहतुकीसाठी उपलब्ध माल",
      assignedTrips: "माझ्या चालू फेऱ्या (Trips)",
      completedTrips: "पूर्ण झालेल्या फेऱ्या",
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
      inTransit: "मार्गावर",
      routeDetails: "मार्ग व प्रेषण तपशील",
      estimatedEarnings: "भाड्याची एकूण रक्कम",
      noLoadsFound: "सध्या कोणतीही वाहतूक ऑर्डर उपलब्ध नाही.",
    },
    transporterFleet: {
      title: "स्थानिक वाहतूकदार बेडा सूची",
      subtitle: "किमी नुसार रास्त दरात माल पोहोचवणाऱ्या स्थानिक वाहतूकदारांशी थेट संपर्क साधा.",
      hireTransporter: "वाहतूकदार बुक करा",
      ratePerKm: "दर / किमी",
      contactDriver: "चालकाशी बोला",
      callNow: "थेट फोन करा",
      verifiedFleet: "जीपीएस वाहने",
      instantBooking: "त्वरित बुकिंग उपलब्ध",
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
      distanceKm: "शेतापासून अंतर",
      compareMandiRates: "बाजार समिती भाव तुलना",
      grossMandiRate: "एकूण बाजारभाव",
      netTakeHome: "निव्वळ हातात येणारा नफा",
      historicalChart: "गेल्या ३० दिवसांचा भाव कल",
      aiProfitCalc: "AI नफा गणक (कॅल्क्युलेटर)",
      allIndiaMandis: "अखिल भारतीय थेट बाजार समिती मंडळ",
      harvestQuantity: "शेतमाल प्रमाण / वजन",
      farmerLocation: "शेतकऱ्याचे ठिकाण",
      grossModalRate: "एकूण सरासरी बाजारभाव",
      netRealized: "हातात मिळणारा निव्वळ भाव",
      regionalComparison: "प्रादेशिक बाजार समिती तुलना -",
      mandiMarket: "मंडी / मार्केट यार्ड",
      variety: "वाण / जात",
      modalRate: "सरासरी भाव",
      priceRange: "दर मर्यादा (किमान - कमाल)",
      arrivals: "दैनिक आवक (टन)",
      freight: "वाहतूक भाडे / क्विंटल",
      trend: "कल",
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
      cropIdentified: "ओळखलेले पीक",
      botanicalName: "वनस्पतीशास्त्रीय वर्गीकरण",
      cropFamily: "वनस्पती कुळ",
      pathogenType: "रोगकारक प्रकार",
      causalOrganism: "रोगकारक जीव",
      infectionStage: "संसर्गाचा टप्पा",
      yieldRisk: "उत्पादनावरील संभाव्य परिणाम",
      diagnosticMarkers: "महत्त्वाचे निदान घटक",
      sprayDosage: "फवारणी प्रमाण व वेळ",
      preventiveMeasures: "प्रतिबंधात्मक कृषी उपाय",
      uploadOrDrag: "पानाचा फोटो निवडा किंवा येथे ड्रॅग करा",
      autoDetectCrop: "🤖 फोटोवरून पीक आपोआप ओळखा",
      selectCrop: "पिकाचा प्रकार निवडा",
      stage1: "टप्पा १: पीक ओळख",
      stage2: "टप्पा २: पीक रोग निदान",
      stage3: "टप्पा ३: योग्य उपचार पद्धती",
      recentScans: "मागील तपासणी अहवाल",
      certifiedAgriKendra: "प्रमाणित कृषी सेवा केंद्र",
    },
    pesticides: {
      title: "खात्रीशीर कृषी औषधे, खते व बियाणे",
      subtitle: "अस्सल सेंद्रिय औषधे, खते, उच्च उगवणक्षमता बियाणे आणि स्प्रे पंप.",
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
      searchProducts: "औषधे, खते व बियाणे शोधा...",
      orderPlacedSuccess: "ऑर्डर यशस्वीरित्या नोंदवली गेली आहे!",
    },
    payments: {
      title: "PhonePe UPI व एस्क्रो व्यवहार वही",
      subtitle: "माल पोहोचल्याची आणि तपासणीची खात्री होईपर्यंत सुरक्षित एस्क्रो खात्यात रक्कम ठेवली जाते.",
      escrowBalance: "एस्क्रो तिजोरी शिल्लक",
      totalSettled: "एकूण जमा रक्कम",
      activeEscrows: "सक्रिय एस्क्रो व्यवहार",
      escrowAssurance: "100% सुरक्षित व्यवहार हमी",
      transactionId: "व्यवहार आयडी",
      dealName: "शेतमाल व फेरी तपशील",
      party: "समोरील पक्ष",
      amount: "व्यवहार रक्कम",
      status: "एस्क्रो स्थिती",
      date: "सुरुवात तारीख",
      statusLocked: "एस्क्रोमध्ये सुरक्षित",
      statusInTransit: "मार्गावर (तपासणी सुरू)",
      statusReleased: "बँक खात्यात जमा",
      releaseFunds: "शेतकऱ्यास पैसे जमा करा",
      payWithUPI: "PhonePe UPI द्वारे पैसे भरा",
      phonePeBadge: "PhonePe बिझनेस एस्क्रो द्वारे सुरक्षित",
      disputeProtection: "शून्य फसवणूक हमी",
    },
    orders: {
      title: "शेतमाल सौदे व ऑर्डर ट्रॅकिंग",
      subtitle: "शेतापासून गोदामापर्यंत मालाचा प्रवास तपासा, पावती पहा आणि टप्पे समजून घ्या.",
      allOrders: "सर्व चालू सौदे",
      pendingOrders: "पाठवण्यासाठी सज्ज",
      completedOrders: "यशस्वी व पूर्ण झालेले",
      orderNumber: "ऑर्डर क्र.",
      cropPurchased: "शेतमाल",
      counterParty: "व्यवहार भागीदार",
      totalPayment: "एकूण व्यवहार रक्कम",
      deliveryStatus: "डिलिव्हरी टप्पा",
      invoice: "बाजार समिती पावती",
      disputeButton: "तक्रार नोंदवा",
      farmer: "शेतकरी",
      merchant: "व्यापारी",
      quantity: "प्रमाण",
      agreedRate: "ठरलेला भाव",
      profit: "निव्वळ नफा",
      connectTransporter: "वाहतूकदार जोडा व भाडे भरा",
    },
    seller: {
      title: "कृषी सेवा केंद्र माल साठा व विक्री",
      subtitle: "औषधांचा साठा नियंत्रित करा, किमती बदला आणि शेतकऱ्यांना वेळेवर माल द्या.",
      addProduct: "नवीन उत्पादन जोडा",
      totalProducts: "एकूण उत्पादने",
      activeStock: "उपलब्ध साठा",
      storeEarnings: "दुकानाची एकूण कमाई",
      productName: "उत्पादनाचे नाव",
      category: "श्रेणी",
      stock: "शिल्लक प्रमाण",
      price: "किंमत (₹)",
      editProduct: "बदल करा",
      deleteProduct: "काढून टाका",
      ordersReceived: "शेतकऱ्यांकडून आलेल्या ऑर्डर्स",
    },
    admin: {
      title: "बाजार समिती पर्यवेक्षक नियंत्रण कक्ष",
      subtitle: "थेट व्यवहार देखरेख, वाद निवारण आणि शेतकरी-व्यापारी आर्थिक नोंदी.",
      totalPlatformUsers: "एकूण नोंदणीकृत वापरकर्ते",
      activeAuctions: "सुरू असलेले लिलाव",
      escrowVolume: "एकूण एस्क्रो उलाढाल",
      activeTransporters: "सक्रिय वाहतूक गाड्या",
      platformLedger: "थेट व्यवहार वही",
      userRegistry: "सत्यापित व्यक्ती यादी",
      disputeManagement: "वाद निवारण कक्ष",
      marketSupervision: "बाजार नियम व अटी",
      systemHealth: "सिस्टम स्थिती: 100% सुरळीत",
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
      send: "पाठवा",
      clearChat: "इतिहास मिटवा",
      thinking: "कृषी सहायक विश्लेषण करत आहे...",
    },
  },
};
