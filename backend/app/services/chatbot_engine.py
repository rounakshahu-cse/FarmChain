import re
from typing import Dict, Any, List, Optional, Tuple
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from backend.app.models.mandi import MandiPrice
from backend.app.models.listing import CropListing
from backend.app.models.bid import Bid
from backend.app.models.order import Order
from backend.app.models.pesticide import PesticideProduct
from backend.app.models.user import User
from backend.app.services.transport_engine import calculate_transport_options, VEHICLE_FLEET
from backend.app.services.disease_engine import DISEASE_KNOWLEDGE_BASE


# ──────────────────────────────────────────────────────────────────────────────
#  1. COMPREHENSIVE PROJECT KNOWLEDGE BASE (Multi-lingual EN / HI / MR)
# ──────────────────────────────────────────────────────────────────────────────
PROJECT_KB: Dict[str, Dict[str, str]] = {
    "about": {
        "en": (
            "🌾 **Smart Krishi Connect (FarmChain)** is a full-stack digital agricultural marketplace "
            "and intelligence platform designed to eliminate predatory middlemen from agricultural supply chains in India.\n\n"
            "**Core Capabilities & Innovations:**\n"
            "• **⚡ Live APMC Bidding Floor:** Transparent digital auctions with automated Cost-of-Production Profit Margin protection.\n"
            "• **📊 Multi-Mandi Intelligence:** Live APMC modal prices across 10+ regional markets with automated transport freight deduction.\n"
            "• **🚚 Smart Transport & Logistics Engine:** Weight-to-vehicle payload matching with mileage-calculated guaranteed payouts.\n"
            "• **🌿 AI Plant Doctor:** Neural leaf pathology scanning for crop disease diagnosis with dual organic and certified chemical remedies.\n"
            "• **🛍️ Certified Agri-Input Store:** Direct procurement of CIBRC-certified bio-pesticides, fungicides, and foundation seeds.\n"
            "• **🔒 Escrow Payment Security:** 100% default-free payments held in digital escrow and released upon verified delivery.\n"
            "• **🤖 Krishi Sahayak AI Copilot:** Grounded agricultural assistant operating in English, हिंदी, and मराठी.\n"
            "• **🎨 Calm Luxury Design:** Soft Mist (`#DFE5F3`), Sage (`#557373`), Deep Olive (`#272401`), and Warm Linen (`#F2EFEA`).\n\n"
            "**Tech Stack:** React 19 + TypeScript + Vite frontend · FastAPI (Python) + SQLite backend · Native WebSockets for real-time auctions."
        ),
        "hi": (
            "🌾 **Smart Krishi Connect (FarmChain)** एक आधुनिक कृषि डिजिटल बाज़ार और इंटेलिजेंस प्लेटफ़ॉर्म है "
            "जो भारतीय कृषि आपूर्ति श्रृंखला से बिचौलियों को पूरी तरह समाप्त करता है।\n\n"
            "**मुख्य विशेषताएं:**\n"
            "• **⚡ लाइव APMC बोली तल:** लागत-मूल्य आधारित न्यूनतम लाभ सुरक्षा के साथ खुली नीलामी।\n"
            "• **📊 मंडी इंटेलिजेंस:** 10+ मंडियों के ताज़ा भाव और दूरी अनुसार भाड़ा काटकर शुद्ध लाभ की तुलना।\n"
            "• **🚚 स्मार्ट लॉजिस्टिक्स:** उपज के वजन अनुसार सही वाहन का चुनाव और निश्चित किराया।\n"
            "• **🌿 AI प्लांट डॉक्टर:** पत्ती की तस्वीर से 98% सटीक रोग पहचान और जैविक/रासायनिक उपचार।\n"
            "• **🛍️ प्रमाणित कृषि इनपुट केंद्र:** सरकारी CIBRC प्रमाणित कीटनाशक और बीज।\n"
            "• **🔒 सुरक्षित एस्क्रो पेमेंट:** डिलीवरी सत्यापित होने पर सीधे खाते में भुगतान।\n"
            "• **🤖 कृषि सहायक:** 3 भाषाओं (अंग्रेज़ी, हिंदी, मराठी) में AI डिजिटल सहायक।"
        ),
        "mr": (
            "🌾 **Smart Krishi Connect (FarmChain)** हे एक संपूर्ण शेत-ते-बाजार डिजिटल कृषी व्यासपीठ आहे "
            "जे कृषी व्यापारातून दलालांना हटवून शेतकऱ्यांना थेट नफा मिळवून देते.\n\n"
            "**प्रमुख वैशिष्ट्ये:**\n"
            "• **⚡ थेट APMC लिलाव कक्ष:** उत्पादन खर्च संरक्षण आणि पारदर्शक लाइव्ह डिजिटल बोली.\n"
            "• **📊 बाजारभाव व निव्वळ नफा विश्लेषक:** १०+ मंड्यांमधील चालू भाव आणि वाहतूक खर्च वजा करून सर्वोत्तम बाजार.\n"
            "• **🚚 स्मार्ट वाहतूक व्यवस्था:** वजनानुसार योग्य गाडीची शिफारस आणि निश्चित भाडे.\n"
            "• **🌿 AI पीक डॉक्टर:** पानाच्या फोटोवरून ९८% अचूक रोग निदान व सेंद्रिय/रासायनिक उपाय.\n"
            "• **🛍️ प्रमाणित कृषी सेवा केंद्र:** थेट CIBRC प्रमाणित कीटकनाशके व बियाणे खरेदी.\n"
            "• **🔒 एस्क्रो पेमेंट सुरक्षितता:** माल पोहोचताच थेट बँक खात्यात सुरक्षित पेमेंट.\n"
            "• **🤖 कृषी सहाय्यक:** इंग्रजी, हिंदी आणि मराठीमध्ये AI सहाय्य."
        ),
    },
    "roles": {
        "en": (
            "👥 **FarmChain supports 5 tailored role-based portals:**\n\n"
            "1. 🌱 **Farmer (शेतकरी / किसान):** List crop harvests with Cost-of-Production base price protection, track real-time merchant bids, compare mandi net profit margins, scan leaf diseases with AI Plant Doctor, and hire verified transport.\n"
            "2. 🏪 **Wholesale Merchant (व्यापारी):** Discover verified harvest lots across APMCs, submit competitive auction bids via WebSockets, get outbid alerts, and lock in direct crop supplies with escrow.\n"
            "3. 🚛 **Transporter (वाहतूकदार / ट्रांसपोर्टर):** Access verified freight job leads, receive distance-calculated guaranteed payout routes, update live GPS trip status, and get paid directly.\n"
            "4. 🧪 **Agri-Input Seller (कृषी केंद्र विक्रेता):** Manage certified bio-pesticides, organic inputs, seed varieties, and sprayers for direct farmer delivery.\n"
            "5. 🛡️ **APMC Market Supervisor (Admin):** Supervise national platform GMV, audit dispute arbitrations, manage KYC verifications, and monitor escrow settlement.\n\n"
            "💡 You can switch roles at any time by clicking **Switch Role / Log Out** in the top navigation bar!"
        ),
        "hi": (
            "👥 **FarmChain में 5 मुख्य भूमिकाएं (Roles) हैं:**\n\n"
            "1. 🌱 **किसान (Farmer):** फसल लिस्ट करें, लागत सुरक्षा के साथ लाइव बोलियां स्वीकारें, मंडी लाभ जांचें और AI से रोग पहचानें।\n"
            "2. 🏪 **व्यापारी (Merchant):** प्रमाणित फसलें खोजें, लाइव नीलामी में बोली लगाएं और सीधे सौदे पक्के करें।\n"
            "3. 🚛 **ट्रांसपोर्टर (Transporter):** दूरी अनुसार निश्चित भाड़े पर माल ढुलाई के काम स्वीकारें और ट्रिप ट्रैक करें।\n"
            "4. 🧪 **कृषि केंद्र विक्रेता (Input Seller):** प्रमाणित कीटनाशक व बीज का स्टॉक प्रबंधित करें।\n"
            "5. 🛡️ **APMC सुपरवाइजर (Admin):** प्लेटफ़ॉर्म ट्रांजैक्शन, विवाद समाधान और KYC सत्यापन की निगरानी करें।"
        ),
        "mr": (
            "👥 **FarmChain मध्ये ५ समर्पित भूमिका आहेत:**\n\n"
            "1. 🌱 **शेतकरी (Farmer):** शेतमाल लिस्ट करा, थेट व्यापाऱ्यांच्या बोली मिळवा, नफा तपासा आणि रोग निदान करा.\n"
            "2. 🏪 **व्यापारी (Merchant):** थेट प्रमाणित शेतमाल शोधा, लिलावात बोली लावा आणि खरेदी करा.\n"
            "3. 🚛 **वाहतूकदार (Transporter):** अंतरानुसार निश्चित भाड्यावर वाहतूक फेऱ्या स्वीकारा.\n"
            "4. 🧪 **कृषी केंद्र विक्रेता (Seller):** कीटकनाशके व बियाणे इन्व्हेंटरी व्यवस्थापित करा.\n"
            "5. 🛡️ **APMC प्रशासक (Admin):** प्लॅटफॉर्म व्यवहार, विवाद निवारण व KYC पडताळणीवर देखरेख ठेवा."
        ),
    },
    "bidding": {
        "en": (
            "⚡ **Live APMC Bidding Floor & Auction System:**\n\n"
            "• **Cost-of-Production Protection:** Farmers set a base reserve price calculated above their production cost (e.g. ₹3,800 cost -> ₹4,800 base), guaranteeing positive profit margins.\n"
            "• **Real-Time WebSockets:** Merchants submit incremental bids (₹/Quintal) live with sub-second synchronization (`/ws/bids/{listing_id}`).\n"
            "• **Outbid Push Notifications:** Merchants get instant outbid toast alerts prompting higher counter-bids.\n"
            "• **Countdown Timer & Scheduled Auctions:** Auctions run on an active countdown window (e.g. 24 hours or instant session), and future harvests can be scheduled for tomorrow's opening.\n"
            "• **1-Click Deal Acceptance:** Farmers can accept the leading bid to immediately lock the deal, generate an order, and trigger automatic transport matching."
        ),
        "hi": (
            "⚡ **लाइव APMC बोली और डिजिटल नीलामी प्रणाली:**\n\n"
            "• **लागत मूल्य सुरक्षा:** किसान अपनी लागत से ऊपर न्यूनतम मूल्य तय करते हैं जिससे नुकसान नहीं होता।\n"
            "• **रियल-टाइम WebSockets:** व्यापारी प्रति क्विंटल लाइव बोली लगाते हैं जो तुरंत सभी को दिखती है।\n"
            "• **आउटबिड अलर्ट:** जब कोई व्यापारी अधिक बोली लगाता है, तो पिछले व्यापारी को तुरंत नोटिफिकेशन मिलता है।\n"
            "• **1-क्लिक डील लॉक:** किसान सर्वोत्तम बोली स्वीकार करके ऑर्डर और ट्रांसपोर्ट स्वतः शुरू कर सकते हैं।"
        ),
        "mr": (
            "⚡ **थेट APMC लिलाव व डिजिटल बोली प्रणाली:**\n\n"
            "• **उत्पादन खर्च संरक्षण:** शेतकरी उत्पादन खर्चावर आधारित किमान किंमत ठेवतात, ज्यामुळे तोटा होत नाही.\n"
            "• **रियल-टाइम WebSockets:** व्यापारी थेट प्रति क्विंटल बोली लावतात जी त्वरित अपडेट होते.\n"
            "• **आउटबिड सूचना:** दुसऱ्या व्यापाऱ्याने जास्त बोली लावल्यास तत्काळ नोटिफिकेशन येते.\n"
            "• **१-क्लिक व्यवहार निश्चिती:** शेतकरी सर्वोच्च बोली स्वीकारून थेट ऑर्डर आणि गाडी जुळवणी सुरू करतात."
        ),
    },
    "mandi_intelligence": {
        "en": (
            "📊 **Mandi Intelligence & Net Realized Price Calculator:**\n\n"
            "• **The Problem Solved:** A higher gross mandi rate 200 km away may yield less profit than a closer mandi once diesel and freight are deducted.\n"
            "• **The Math Formula:** `Net Realized In Hand (₹/Qtl) = Gross APMC Modal Rate - (Estimated Transport Freight / Quantity in Qtl)`.\n"
            "• **AI Recommendation:** The platform scans regional mandis (Nashik, Mumbai Vashi, Pune, Indore, Delhi Azadpur, etc.) and highlights the ★ Top Profit destination market.\n"
            "• **Interactive Batch Sliders:** Adjust harvest batch size (10 to 200 Qtl) and see instant net revenue forecasts."
        ),
        "hi": (
            "📊 **मंडी इंटेलिजेंस और शुद्ध लाभ कैलकुलेटर:**\n\n"
            "• **हल की गई समस्या:** दूर की मंडी में भाव अधिक होने पर भी अधिक भाड़े के कारण हाथ में कम पैसा आता है।\n"
            "• **सूत्र (Formula):** `शुद्ध लाभ = मंडी का कुल भाव - प्रति क्विंटल ढुलाई भाड़ा`।\n"
            "• **AI सिफारिश:** सिस्टम सभी क्षेत्रीय मंडियों की तुलना करके सर्वाधिक शुद्ध लाभ देने वाली मंडी को ★ Top Profit बताता है।\n"
            "• **इंटरैक्टिव स्लाइडर:** 10 से 200 क्विंटल तक वजन बदलकर कुल शुद्ध कमाई का अनुमान लगाएं।"
        ),
        "mr": (
            "📊 **मंडी इंटेलिजेंस व निव्वळ नफा कॅल्क्युलेटर:**\n\n"
            "• **सोडवलेली समस्या:** दूरच्या बाजारात भाव जास्त असला तरी वाहतूक खर्चामुळे शेतकऱ्याच्या हातात कमी पैसे येतात.\n"
            "• **सूत्र:** `निव्वळ हातात येणारा नफा = APMC भाव - प्रति क्विंटल वाहतूक खर्च`.\n"
            "• **AI शिफारस:** नाशिक, वाशी, पुणे, इंदूर अशा सर्व मंड्यांची तुलना करून सर्वाधिक निव्वळ नफा देणारी मंडी सुचवली जाते.\n"
            "• **इंटरॅक्टिव्ह स्लाइडर:** १० ते २०० क्विंटल प्रमाण बदलून एकूण कमाईचा अंदाज लगेच पहा."
        ),
    },
    "profitability_formula": {
        "en": (
            "📐 **Profitability & Cost-of-Production Formula:**\n\n"
            "• **Total Revenue:** `Bid Price per Quintal × Quantity (Quintals)`\n"
            "• **Total Production Cost:** `Cost of Production per Quintal × Quantity (Quintals)`\n"
            "• **Net Profit Amount:** `Total Revenue - Total Production Cost`\n"
            "• **Profit Margin (%):** `((Bid Price - Cost of Production) / Cost of Production) × 100%`\n\n"
            "**Deal Verdict Indicators:**\n"
            "• 🟢 **Margin ≥ 25%:** Highly Profitable Deal (Top Margin - Emerald)\n"
            "• 🟢 **Margin 10% – 24%:** Good Profitable Deal (Green)\n"
            "• 🟡 **Margin 0% – 9%:** Marginally Profitable / Break-Even+ (Amber)\n"
            "• 🔴 **Margin < 0%:** Loss / Below Cost of Production (Red Warning)"
        ),
        "hi": (
            "📐 **लाभ और लागत सुरक्षा गणितीय सूत्र:**\n\n"
            "• **कुल राजस्व (Revenue):** `बोली मूल्य × मात्रा (क्विंटल)`\n"
            "• **कुल उत्पादन लागत:** `प्रति क्विंटल लागत × मात्रा (क्विंटल)`\n"
            "• **शुद्ध लाभ (Net Profit):** `कुल राजस्व - कुल लागत`\n"
            "• **लाभ प्रतिशत (Margin %):** `((बोली मूल्य - लागत मूल्य) / लागत मूल्य) × 100%`\n\n"
            "• 25%+ मार्जिन: अत्यधिक लाभदायक सौदा (Emerald)\n"
            "• 10%-24% मार्जिन: अच्छा लाभदायक सौदा (Green)\n"
            "• 0%-9% मार्जिन: सामान्य लाभ / लागत वसूल (Amber)\n"
            "• 0% से कम: घाटा / लागत से कम (Red)"
        ),
        "mr": (
            "📐 **नफा व उत्पादन खर्च गणिती सूत्र:**\n\n"
            "• **एकूण महसूल:** `बोली दर × प्रमाण (क्विंटल)`\n"
            "• **एकूण उत्पादन खर्च:** `प्रति क्विंटल खर्च × प्रमाण (क्विंटल)`\n"
            "• **निव्वळ नफा रक्कम:** `एकूण महसूल - एकूण उत्पादन खर्च`\n"
            "• **नफा टक्केवारी (Margin %):** `((बोली दर - उत्पादन खर्च) / उत्पादन खर्च) × १००%`\n\n"
            "• २५%+ नफा: अतिशय फायदेशीर सौदा (Emerald)\n"
            "• १०%-२४% नफा: चांगला फायदेशीर सौदा (Green)\n"
            "• ०%-९% नफा: सर्वसाधारण नफा / खर्च वसूल (Amber)\n"
            "• ०% पेक्षा कमी: तोटा (Red)"
        ),
    },
    "logistics": {
        "en": (
            "🚚 **Smart Transport & Logistics Engine:**\n\n"
            "• **Automated Vehicle Matching:** Matches crop weight (Qtl) and travel distance (km) to the most cost-effective vehicle class:\n"
            "  1. **Mini Truck (Tata Ace / Chota Hathi):** Capacity up to 12 Qtl (Base ₹350 + ₹14/km, max 150 km)\n"
            "  2. **Pickup Truck (Mahindra Bolero Maxi):** Capacity up to 30 Qtl (Base ₹600 + ₹18/km, max 600 km)\n"
            "  3. **Tractor-Trolley:** Capacity up to 50 Qtl (Base ₹750 + ₹16/km, max 60 km rural haul)\n"
            "  4. **10-Ton Heavy Truck (Eicher / Ashok Leyland):** Capacity up to 120 Qtl (Base ₹1,800 + ₹30/km, max 2000 km)\n"
            "  5. **Refrigerated Reefer Van:** Capacity up to 35 Qtl (Base ₹1,200 + ₹26/km, max 1000 km cold chain)\n"
            "• **Pricing Formula:** `Cost = (Base Rate + Distance × Rate/km) × (0.9 + 0.15 × Load Factor)`.\n"
            "• **Guaranteed Payouts:** Fast escrow disbursement upon delivery confirmation with full trip tracking."
        ),
        "hi": (
            "🚚 **स्मार्ट ट्रांसपोर्ट और लॉजिस्टिक्स इंजन:**\n\n"
            "• **स्वचालित वाहन मिलान:** उपज के वजन और दूरी अनुसार सबसे किफायती वाहन चुना जाता है:\n"
            "  1. **छोटा हाथी (Tata Ace):** 12 क्विंटल तक (₹350 बेस + ₹14/किमी)\n"
            "  2. **बोलेरो पिकअप (Mahindra Bolero):** 30 क्विंटल तक (₹600 बेस + ₹18/किमी)\n"
            "  3. **ट्रैक्टर-ट्रॉली:** 50 क्विंटल तक स्थानीय (₹750 बेस + ₹16/किमी)\n"
            "  4. **10-टन भारी ट्रक (Eicher):** 120 क्विंटल तक (₹1,800 बेस + ₹30/किमी)\n"
            "  5. **रेफ्रिजरेटेड वैन (Cold Chain):** 35 क्विंटल तक (₹1,200 बेस + ₹26/किमी)\n"
            "• **निश्चित किराया भुगतान:** डिलीवरी पूरी होते ही एस्क्रो से तुरंत भुगतान मिलता है।"
        ),
        "mr": (
            "🚚 **स्मार्ट वाहतूक व्यवस्था व वाहन शिफारस:**\n\n"
            "• **स्वयंचलित वाहन जुळवणी:** शेतमालाचे वजन आणि अंतरानुसार स्वस्त व योग्य गाडी निवडली जाते:\n"
            "  1. **छोटा हत्ती (Tata Ace):** १२ क्विंटलपर्यंत (₹३५० बेस + ₹१४/किमी)\n"
            "  2. **बोलेरो मॅक्सी ट्रक (Bolero Maxi):** ३० क्विंटलपर्यंत (₹६०० बेस + ₹१८/किमी)\n"
            "  3. **ट्रॅक्टर-ट्रॉली:** ५० क्विंटलपर्यंत स्थानिक (₹७५० बेस + ₹१६/किमी)\n"
            "  4. **१० टन जड ट्रक (Eicher):** १२० क्विंटलपर्यंत (₹१,८०० बेस + ₹३०/किमी)\n"
            "  5. **कोल्ड स्टोरेज रीफर व्हॅन:** ३५ क्विंटलपर्यंत (₹१,२०० बेस + ₹२६/किमी)\n"
            "• **खात्रीशीर भाडे:** माल पोहोचताच एस्क्रो खात्यातून वाहतूकदाराला थेट भाडे मिळते."
        ),
    },
    "plant_doctor": {
        "en": (
            "🌿 **AI Plant Doctor & Crop Pathology Engine:**\n\n"
            "• **Neural Computer Vision:** Upload or choose a sample leaf photo (Tomato, Potato, Cotton, Rice, Soybean, Chilli, etc.).\n"
            "• **High-Accuracy Diagnosis:** Detects diseases like Early Blight, Late Blight, Cotton Bollworm, Rice Blast, Soybean Rust, and Sucking Pests with 98% confidence.\n"
            "• **Dual Treatment Advice:** Provides both an **Organic Remedy** (Neem oil, Trichoderma viride, Cow urine bio-ferments, sticky traps) and a **Certified Chemical Remedy** (Mancozeb 75% WP, Kavach Chlorothalonil, Ridomil Gold, Proclaim Emamectin Benzoate).\n"
            "• **Direct Store Integration:** Direct 1-click buy button to order certified treatments from the Input Store with dosage instructions."
        ),
        "hi": (
            "🌿 **AI प्लांट डॉक्टर (फसल रोग विशेषज्ञ):**\n\n"
            "• **AI विज़न स्कैन:** पत्ती की फ़ोटो से टमाटर, आलू, कपास, धान और सोयाबीन के रोगों की तुरंत जाँच।\n"
            "• **रोग पहचान:** अगेती झुलसा, पछेती झुलसा, तना छेदक/बोंडअळी, ब्लास्ट, रस्ट और रसचूसक कीटों को 98% सटीकता से पहचानता है।\n"
            "• **दोहरा उपचार:** **जैविक उपाय** (नीम तेल, ट्राइकोडर्मा) तथा **प्रमाणित रासायनिक उपचार** (मैंकोजेब, कवक, रिडोमिल गोल्ड) दोनों बताता है।\n"
            "• **सीधी खरीद:** सीधे कृषि स्टोर से दवा ऑर्डर करने की सुविधा।"
        ),
        "mr": (
            "🌿 **AI पीक डॉक्टर (Plant Doctor):**\n\n"
            "• **AI पानाच्या फोटोवरून निदान:** टोमॅटो, बटाटा, कापूस, भात, सोयाबीन इत्यादी पिकांच्या पानांचा फोटो तपासून रोग ओळखतो.\n"
            "• **ओळखले जाणारे रोग:** करपा (Early/Late Blight), बोंडअळी, तांबेरा, करपा ब्लास्ट, मावा आणि रसशोषक किडी ९८% अचूकतेने शोधतो.\n"
            "• **दुहेरी उपचार सल्ला:** **सेंद्रिय उपाय** (निंबोळी अर्क, ट्रायकोडर्मा) आणि **प्रमाणित रासायनिक उपाय** (कवच, रिडोमिल गोल्ड, प्रोक्लेम) दोन्ही मिळतात.\n"
            "• **थेट खरेदी:** औषध थेट ॲग्री स्टोअरमधून बुक करण्याची सुविधा."
        ),
    },
    "pesticide_store": {
        "en": (
            "🛍️ **Certified Agri-Inputs & Pesticide Store:**\n\n"
            "• **Government CIBRC Certified:** All bio-fungicides, organic neem oils, microbial stimulants, certified seeds, and sprayers are verified.\n"
            "• **Top Products Available in Store:**\n"
            "  1. **Kavach Chlorothalonil 75% WP (500g):** ₹680 — For Tomato/Potato Early & Late Blight.\n"
            "  2. **Ridomil Gold MZ Metalaxyl-M (1kg):** ₹1,450 — Devastating oomycete late blight control.\n"
            "  3. **Proclaim Emamectin Benzoate 5% SG (250g):** ₹540 — Bollworm and fruit borer caterpillar control.\n"
            "  4. **Pure Cold-Pressed Neem Oil 10,000 PPM (1L):** ₹420 — Organic shield against aphids, whiteflies, thrips.\n"
            "  5. **Trichoderma Viride Bio-Fungicide (1kg):** ₹280 — Root rot, collar rot, and soil-borne wilt antagonist.\n"
            "  6. **Certified JS-335 Soybean Foundation Seeds (30kg):** ₹2,850 — 98% purity, 85%+ germination.\n"
            "  7. **Bio-Zyme Seaweed Bio-Stimulant (500ml):** ₹490 — Abiotic drought and heat stress reliever.\n"
            "  8. **16L Battery Knapsack Sprayer:** ₹3,200 — 12V 12Ah lithium rechargeable sprayer.\n"
            "• **Direct Booking:** Transparent pricing with Cash on Delivery (COD) or UPI checkout."
        ),
        "hi": (
            "🛍️ **प्रमाणित कीटनाशक और कृषि इनपुट स्टोर:**\n\n"
            "• **CIBRC प्रमाणित उत्पाद:** केवल सरकारी मान्यता प्राप्त बायो-कीटनाशक, नीम तेल और प्रमाणित बीज उपलब्ध हैं।\n"
            "• **प्रमुख उत्पाद:**\n"
            "  1. **कवच क्लोरोथैलोनिल 75% WP (500g):** ₹680 (झुलसा रोग हेतु)\n"
            "  2. **रिडोमिल गोल्ड MZ (1kg):** ₹1,450 (पछेती झुलसा)\n"
            "  3. **प्रोक्लेम एमामेक्टिन बेंजोएट (250g):** ₹540 (इल्ली/बोंडअळी)\n"
            "  4. **शुद्ध नीम तेल 10,000 PPM (1L):** ₹420 (रसचूसक कीट)\n"
            "  5. **ट्राइकोडर्मा विरिडी (1kg):** ₹280 (जड़ गलन/उकठा)\n"
            "  6. **JS-335 प्रमाणित सोयाबीन बीज (30kg):** ₹2,850\n"
            "  7. **बायो-ज़ाइम सीवीड टॉनिक (500ml):** ₹490\n"
            "  8. **16L बैटरी स्प्रे पंप:** ₹3,200\n"
            "• **डिलीवरी:** COD और UPI से सीधे खेत तक सुरक्षित डिलीवरी।"
        ),
        "mr": (
            "🛍️ **प्रमाणित कीटकनाशके व कृषी सेवा केंद्र:**\n\n"
            "• **शासकीय CIBRC प्रमाणित:** सर्व बुरशीनाशके, सेंद्रिय निंबोळी तेल आणि प्रमाणित बियाणे उपलब्ध आहेत.\n"
            "• **स्टोअरमधील मुख्य उत्पादने:**\n"
            "  1. **कवच क्लोरोथॅलोनिल 75% WP (500g):** ₹680 (टोमॅटो/बटाटा करपा)\n"
            "  2. **रिडोमिल गोल्ड MZ (1kg):** ₹1,450 (लेट ब्लाइट)\n"
            "  3. **प्रोक्लेम एमामेक्टिन (250g):** ₹540 (बोंडअळी/अळी)\n"
            "  4. **सेंद्रिय निंबोळी तेल 10,000 PPM (1L):** ₹420 (मावा/तुडतुडे)\n"
            "  5. **ट्रायकोडर्मा विरिडी (1kg):** ₹280 (मूळकूज/मर)\n"
            "  6. **JS-335 प्रमाणित सोयाबीन बियाणे (30kg):** ₹2,850\n"
            "  7. **बायो-झाईम सीवीड टॉनिक (500ml):** ₹490\n"
            "  8. **16L बॅटरी स्प्रे पंप:** ₹3,200\n"
            "• **थेट डिलिव्हरी:** पारदर्शक दरात COD किंवा UPI द्वारे थेट बांधावर डिलिव्हरी."
        ),
    },
    "escrow": {
        "en": (
            "🔒 **Escrow & Payment Security Mechanism:**\n\n"
            "• **How Funds are Protected:** When a merchant's bid is accepted, the total deal amount is held in secure digital escrow.\n"
            "• **Automated Release:** Funds are released to the farmer and transporter automatically upon verified physical delivery at the mandi depot.\n"
            "• **Zero Default Risk:** Eliminates payment delays, bouncing cheques, and traditional trader commission cuts."
        ),
        "hi": (
            "🔒 **एस्क्रो और सुरक्षित भुगतान प्रणाली:**\n\n"
            "• **पैसों की सुरक्षा:** जब किसान बोली स्वीकार करता है, तो व्यापारी का भुगतान सुरक्षित डिजिटल एस्क्रो में जमा हो जाता है।\n"
            "• **स्वतः रिलीज:** माल मंडी पहुँचने और डिलीवरी सत्यापित होने पर पैसे किसान और ट्रांसपोर्टर के खाते में तुरंत ट्रांसफर हो जाते हैं।\n"
            "• **शून्य जोखिम:** चेक बाउंस या भुगतान में देरी का कोई खतरा नहीं।"
        ),
        "mr": (
            "🔒 **एस्क्रो व सुरक्षित पेमेंट व्यवस्था:**\n\n"
            "• **रक्कम सुरक्षितता:** सौदा पक्का झाल्यावर व्यापाऱ्याची रक्कम सुरक्षित डिजिटल एस्क्रो खात्यात ठेवली जाते.\n"
            "• **डिलिव्हरीनंतर थेट वर्ग:** माल सुरक्षित पोहोचल्याची नोंद होताच पैसे थेट शेतकरी आणि वाहतूकदाराला मिळतात.\n"
            "• **शून्य फसवणूक:** चेक बाऊन्स किंवा पैसे थकवण्याचा धोका संपतो."
        ),
    },
    "trust_score": {
        "en": (
            "⭐ **Trust Score & Verification Rating:**\n\n"
            "• Every platform participant starts with a base rating (4.7 to 5.0).\n"
            "• Score increases with on-time deliveries, accurate crop quality grading, zero cancellations, and seamless deal fulfillment.\n"
            "• High trust scores unlock prioritized bidding, higher merchant competition, and faster transporter bookings."
        ),
        "hi": (
            "⭐ **ट्रस्ट स्कोर और सत्यापन रेटिंग:**\n\n"
            "• प्रत्येक उपयोगकर्ता का 1 से 5 स्टार तक ट्रस्ट स्कोर होता है।\n"
            "• समय पर माल डिलीवरी और सही गुणवत्ता ग्रेडिंग से स्कोर बढ़ता है।\n"
            "• उच्च स्कोर वाले किसानों को व्यापारियों से बेहतर भाव मिलते हैं।"
        ),
        "mr": (
            "⭐ **ट्रस्ट स्कोर आणि पडताळणी रेटिंग:**\n\n"
            "• प्रत्येक वापरकर्त्याला १ ते ५ स्टार ट्रस्ट स्कोर असतो.\n"
            "• वेळेवर डिलिव्हरी आणि चांगल्या गुणवत्तेमुळे स्कोर वाढतो.\n"
            "• उच्च स्कोर असलेल्या शेतकऱ्यांना व्यापाऱ्यांकडून जास्त बोली मिळतात."
        ),
    },
    "tech_stack": {
        "en": (
            "⚙️ **Technical Architecture & Specifications:**\n\n"
            "• **Frontend:** React 19, TypeScript, Vite, TailwindCSS v4, Lucide Icons, Canvas Confetti, i18n localization.\n"
            "• **Backend:** FastAPI (Python 3.14), SQLAlchemy ORM, SQLite Database, Uvicorn ASGI Server.\n"
            "• **Real-Time Layer:** Native WebSockets for live bidding stream & outbid alerts (`/ws/bids/{listing_id}`).\n"
            "• **Security:** JWT (JSON Web Tokens), Passlib Bcrypt hashing, Role-Based Access Control (RBAC).\n"
            "• **AI Subsystems:** Multi-mandi freight profitability solver, neural vision crop pathology, and Krishi Sahayak NLP engine."
        ),
        "hi": (
            "⚙️ **तकनीकी आर्किटेक्चर:**\n\n"
            "• **फ्रंटएंड:** React 19 + TypeScript, Vite, TailwindCSS v4, Lucide Icons.\n"
            "• **बैकएंड:** FastAPI (Python), SQLAlchemy, SQLite, Uvicorn.\n"
            "• **रियल-टाइम:** WebSockets (लाइव नीलामी और अलर्ट्स के लिए).\n"
            "• **सुरक्षा:** JWT ऑथेंटिकेशन, Bcrypt पासवर्ड हैशिंग."
        ),
        "mr": (
            "⚙️ **तांत्रिक आर्किटेक्चर:**\n\n"
            "• **फ्रंटएंड:** React 19 + TypeScript, Vite, TailwindCSS v4.\n"
            "• **बॅकएंड:** FastAPI (Python), SQLAlchemy ORM, SQLite डेटाबेस.\n"
            "• **रियल-टाइम:** WebSockets थेट लिलावासाठी.\n"
            "• **सुरक्षा:** JWT प्रमाणीकरण आणि सुरक्षित पासवर्ड हैशिंग."
        ),
    },
    "palette": {
        "en": (
            "🎨 **Calm Luxury Color Palette:**\n\n"
            "FarmChain uses an exclusive light-mode luxury color scheme:\n"
            "• **#F2EFEA (Warm Linen):** Canvas and natural page background.\n"
            "• **#DFE5F3 (Soft Mist):** Ambient highlight cards, secondary pills, and subtle badge tints.\n"
            "• **#557373 (Sage / Slate Pine):** Primary brand actions, CTA buttons, and active tabs.\n"
            "• **#272401 (Deep Olive Umber):** High-value accent tags, trust indicators, and bronze details.\n"
            "• **#0D0D0D (Rich Charcoal):** High-contrast crisp typography and headings."
        ),
        "hi": (
            "🎨 **काल्म लक्ज़री कलर पैलेट:**\n\n"
            "• **#F2EFEA (Warm Linen):** मुख्य बैकग्राउंड.\n"
            "• **#DFE5F3 (Soft Mist):** कार्ड्स और बैज हाइलाइट्स.\n"
            "• **#557373 (Sage Green):** मुख्य बटन और एक्टिव मेनू.\n"
            "• **#272401 (Deep Olive):** ब्रॉन्ज एक्सेंट और ट्रस्ट टैग्स.\n"
            "• **#0D0D0D (Rich Charcoal):** स्पष्ट और पढ़ने में आसान टेक्स्ट।"
        ),
        "mr": (
            "🎨 **काल्म लक्झरी रंग पॅलेट:**\n\n"
            "• **#F2EFEA (वॉर्म लिनन):** मुख्य पृष्ठभाग.\n"
            "• **#DFE5F3 (सॉफ्ट मिस्ट):** हायलाइट कार्ड्स आणि बॅज.\n"
            "• **#557373 (सेज ग्रीन):** मुख्य बटणे आणि निवडलेले मेनू.\n"
            "• **#272401 (डीप ऑलिव्ह):** ब्रॉन्झ एक्सेंट आणि रेटिंग्स.\n"
            "• **#0D0D0D (रिच चारकोल):** ठळक आणि स्पष्ट अक्षरे."
        ),
    },
    "personas": {
        "en": (
            "👤 **Pre-Configured Demo Personas & Login Credentials:**\n\n"
            "• 🌱 **Farmer 1:** Ramesh Patil (Dindori, Nashik, MH) — Phone: `9876543210` (Soybean, Tomato, Onion)\n"
            "• 🌱 **Farmer 2:** Gurpreet Singh (Khanna, Ludhiana, Punjab) — Phone: `9876543211` (Wheat, Basmati Rice)\n"
            "• 🌱 **Farmer 3:** Shivraj Chouhan (Sanwer, Indore, MP) — Phone: `9876543212` (BT Cotton)\n"
            "• 🏪 **Merchant 1:** Suresh Agrawal (Vashi APMC, Mumbai) — Phone: `9876543220`\n"
            "• 🏪 **Merchant 2:** Rajesh Kothari (Choithram Mandi, Indore) — Phone: `9876543221`\n"
            "• 🏪 **Merchant 3:** Vijay Mehra (Azadpur Mandi, Delhi) — Phone: `9876543222`\n"
            "• 🚛 **Transporter 1:** Balwinder Singh (Nashik-Pune Highway) — Phone: `9876543230`\n"
            "• 🚛 **Transporter 2:** Mahendra Shinde (Lasalgaon APMC Yard) — Phone: `9876543231`\n"
            "• 🧪 **Agri Seller:** Dr. Aniruddha Joshi (Maha Krishi Seva Kendra, Nashik) — Phone: `9876543240`\n"
            "• 🛡️ **APMC Admin:** Platform Admin (National Ops Center, Pune) — Phone: `9999999999`\n\n"
            "🔑 **Default Password for ALL demo accounts:** `password123`."
        ),
        "hi": (
            "👤 **डेमो उपयोगकर्ता प्रोफाइल व पासवर्ड:**\n\n"
            "• 🌱 **किसान 1:** रमेश पाटिल (नासिक) — `9876543210`\n"
            "• 🌱 **किसान 2:** गुरप्रीत सिंह (लुधियाना) — `9876543211`\n"
            "• 🌱 **किसान 3:** शिवराज चौहान (इंदौर) — `9876543212`\n"
            "• 🏪 **व्यापारी 1:** सुरेश ट्रेडर्स (वाशी, मुंबई) — `9876543220`\n"
            "• 🏪 **व्यापारी 2:** राजेश कोठारी (इंदौर) — `9876543221`\n"
            "• 🏪 **व्यापारी 3:** विजय मेहरा (दिल्ली) — `9876543222`\n"
            "• 🚛 **ट्रांसपोर्टर:** बलविंदर सिंह — `9876543230`, महेंद्र शिंदे — `9876543231`\n"
            "• 🧪 **कृषि केंद्र:** डॉ. जोशी (एग्रोकेयर) — `9876543240`\n"
            "• 🛡️ **एडमिन:** APMC सुपरवाइजर — `9999999999`\n\n"
            "🔑 **सभी खातों का पासवर्ड:** `password123`"
        ),
        "mr": (
            "👤 **डेमो वापरकर्ता खाती व पासवर्ड:**\n\n"
            "• 🌱 **शेतकरी १:** रमेश पाटील (दिंडोरी, नाशिक) — `9876543210`\n"
            "• 🌱 **शेतकरी २:** गुरप्रीत सिंग (लुधियाना) — `9876543211`\n"
            "• 🌱 **शेतकरी ३:** शिवराज चौहान (इंदूर) — `9876543212`\n"
            "• 🏪 **व्यापारी १:** सुरेश ॲग्रो ट्रेडर्स (वाशी, मुंबई) — `9876543220`\n"
            "• 🏪 **व्यापारी २:** राजेश कोठारी (इंदूर) — `9876543221`\n"
            "• 🏪 **व्यापारी ३:** विजय मेहरा (आझादपूर, दिल्ली) — `9876543222`\n"
            "• 🚛 **वाहतूकदार:** बलविंदर सिंग — `9876543230`, महेंद्र शिंदे — `9876543231`\n"
            "• 🧪 **कृषी केंद्र:** डॉ. अनिरुद्ध जोशी — `9876543240`\n"
            "• 🛡️ **प्रशासक:** APMC सुपरवायझर — `9999999999`\n\n"
            "🔑 **सर्वांचा पासवर्ड:** `password123`"
        ),
    },
    "crops": {
        "en": (
            "🌾 **Key Crops Supported on FarmChain:**\n\n"
            "1. **Soybean (सोयाबीन):** Major varieties like JS-335 (Nashik, Indore) — Modal Price: ~₹5,150 – ₹5,380/Qtl\n"
            "2. **Wheat (गहू / गेहूं):** Sharbati Gold & Kalyan (Khanna, Indore, Azadpur) — Modal Price: ~₹2,780 – ₹2,920/Qtl\n"
            "3. **Cotton (कापूस / कपास):** BT Cotton & Shankar-6 (Akola, Rajkot, Indore) — Modal Price: ~₹7,480 – ₹7,720/Qtl\n"
            "4. **Tomato (टोमॅटो):** Abhinav Hybrid & Desi (Narayangaon, Nashik, Vashi) — Modal Price: ~₹1,520 – ₹1,820/Qtl\n"
            "5. **Red Onion (कांदा / प्याज):** Garwa Red (Lasalgaon, Azadpur, Pune) — Modal Price: ~₹2,350 – ₹2,750/Qtl\n"
            "6. **Basmati Rice (तांदूळ / चावल):** Pusa 1121 Extra Long (Khanna, Karnal) — Modal Price: ~₹4,180 – ₹4,320/Qtl"
        ),
        "hi": (
            "🌾 **प्लेटफ़ॉर्म पर प्रमुख समर्थित फसलें:**\n\n"
            "1. **सोयाबीन (JS-335):** नासिक, इंदौर (भाव: ~₹5,150 – ₹5,380/क्विंटल)\n"
            "2. **गेहूं (शरबती):** लुधियाना, इंदौर (भाव: ~₹2,780 – ₹2,920/क्विंटल)\n"
            "3. **कपास (BT Cotton):** अकोला, राजकोट (भाव: ~₹7,480 – ₹7,720/क्विंटल)\n"
            "4. **टमाटर (हाइब्रिड):** नारायणगांव, नासिक, वाशी (भाव: ~₹1,520 – ₹1,820/क्विंटल)\n"
            "5. **लाल प्याज:** लासलगांव, दिल्ली (भाव: ~₹2,350 – ₹2,750/क्विंटल)\n"
            "6. **बासमती चावल (1121):** खन्ना, करनाल (भाव: ~₹4,180 – ₹4,320/क्विंटल)"
        ),
        "mr": (
            "🌾 **FarmChain वरील प्रमुख शेतमाल:**\n\n"
            "1. **सोयाबीन (JS-335):** नाशिक, इंदूर (बाजारभाव: ~₹५,१५० – ₹५,३८०/क्विंटल)\n"
            "2. **गहू (शरबती):** खन्ना, इंदूर (बाजारभाव: ~₹२,७८० – ₹२,९२०/क्विंटल)\n"
            "3. **कापूस (BT Cotton):** अकोला, राजकोट (बाजारभाव: ~₹७,४८० – ₹७,७२०/क्विंटल)\n"
            "4. **टोमॅटो (अभिनव हायब्रिड):** नारायणगाव, नाशिक, वाशी (बाजारभाव: ~₹१,५२० – ₹१,८२०/क्विंटल)\n"
            "5. **लाल कांदा:** लासलगाव, दिल्ली (बाजारभाव: ~₹२,३५० – ₹२,७५०/क्विंटल)\n"
            "6. **बासमती तांदूळ (११२१):** खन्ना, कर्नाल (बाजारभाव: ~₹४,१८० – ₹४,३२०/क्विंटल)"
        ),
    },
    "create_listing": {
        "en": (
            "📝 **How to Create a Crop Listing (For Farmers):**\n\n"
            "1. Log in as a **Farmer**.\n"
            "2. Click **+ Create New Listing** in the Farmer Portal.\n"
            "3. Fill in: Crop Name, Variety, Quantity (Quintals), Base Reserve Price (₹/Qtl), Cost of Production (₹/Qtl), Quality Grade (Grade A/B/C), and Moisture %.\n"
            "4. Set pickup farm location and upload harvest photo.\n"
            "5. Click **Publish Listing** — your auction goes live immediately for verified merchants!"
        ),
        "hi": (
            "📝 **फसल सूची कैसे बनाएं (किसान के लिए):**\n\n"
            "1. **किसान** के रूप में लॉगिन करें।\n"
            "2. **+ नई फसल लिस्ट करें** बटन दबाएं।\n"
            "3. फसल का नाम, किस्म, मात्रा (क्विंटल), न्यूनतम आधार मूल्य, लागत मूल्य, ग्रेड भरें।\n"
            "4. खेत का पता दर्ज करें और फोटो जोड़ें।\n"
            "5. **सबमिट करें** — आपकी नीलामी तुरंत शुरू हो जाएगी!"
        ),
        "mr": (
            "📝 **पीक यादी कशी तयार करावी (शेतकऱ्यांसाठी):**\n\n"
            "1. **शेतकरी** म्हणून लॉगिन करा.\n"
            "2. **+ नवीन शेतमाल लिस्ट करा** वर क्लिक करा.\n"
            "3. पिकाचे नाव, जात, प्रमाण (क्विंटल), आधारभूत किंमत (₹/क्विंटल), उत्पादन खर्च, ग्रेड भरा.\n"
            "4. शेताचा पत्ता व फोटो जोडा.\n"
            "5. **सबमिट करा** — व्यापाऱ्यांसाठी थेट लिलाव लगेच सुरू होईल!"
        ),
    },
    "api_architecture": {
        "en": (
            "🔌 **Backend API Architecture & REST Endpoints:**\n\n"
            "• `/api/v1/auth` : User registration, JWT login token, persona switching\n"
            "• `/api/v1/listings` : Create, filter, fetch crop listings with bidding status\n"
            "• `/api/v1/bids` : Submit live bids, accept winning bid, fetch bid history\n"
            "• `/api/v1/mandi` : Multi-mandi prices & net realized profitability calculation\n"
            "• `/api/v1/disease` : AI leaf pathology scanner with dual organic/chemical remedies\n"
            "• `/api/v1/transport` : Vehicle recommendation engine & active freight jobs\n"
            "• `/api/v1/pesticides` : CIBRC certified agri-input store & order placement\n"
            "• `/api/v1/orders` : Escrow orders, dispute resolution & settlement\n"
            "• `/api/v1/notifications` : Outbid alerts, auction reminders & transport updates\n"
            "• `/api/v1/admin` : Platform GMV, KYC verifications & market supervision\n"
            "• `/api/v1/chatbot/ask` : Krishi Sahayak multi-lingual copilot\n"
            "• `/ws/bids/{listing_id}` : WebSocket live bidding room stream"
        ),
        "hi": (
            "🔌 **बैकएंड API एंडपॉइंट्स:**\n\n"
            "• `/api/v1/auth` : लॉगिन और टोकन\n"
            "• `/api/v1/listings` : फसल लिस्टिंग प्रबंधन\n"
            "• `/api/v1/bids` : लाइव बोलियां और स्वीकार्यता\n"
            "• `/api/v1/mandi` : मंडी भाव और शुद्ध लाभ गणना\n"
            "• `/api/v1/disease` : AI प्लांट डॉक्टर\n"
            "• `/api/v1/transport` : वाहन व किराया गणना\n"
            "• `/api/v1/pesticides` : प्रमाणित इनपुट स्टोर\n"
            "• `/api/v1/orders` : एस्क्रो भुगतान और ऑर्डर्स\n"
            "• `/ws/bids/{id}` : WebSocket लाइव नीलामी"
        ),
        "mr": (
            "🔌 **बॅकएंड API एंडपॉइंट्स:**\n\n"
            "• `/api/v1/auth` : लॉगिन आणि प्रमाणीकरण\n"
            "• `/api/v1/listings` : शेतमाल याद्या\n"
            "• `/api/v1/bids` : थेट बोली प्रणाली\n"
            "• `/api/v1/mandi` : बाजारभाव व निव्वळ नफा\n"
            "• `/api/v1/disease` : AI पीक रोग निदान\n"
            "• `/api/v1/transport` : वाहतूक व्यवस्था\n"
            "• `/api/v1/pesticides` : कृषी सेवा केंद्र\n"
            "• `/api/v1/orders` : एस्क्रो सौदे\n"
            "• `/ws/bids/{id}` : थेट WebSockets लिलाव"
        )
    }
}


# ──────────────────────────────────────────────────────────────────────────────
#  2. INTENT KEYWORD DICTIONARIES
# ──────────────────────────────────────────────────────────────────────────────
INTENT_KEYWORDS: Dict[str, List[str]] = {
    "about": [
        "what is", "farmchain", "smart krishi", "about", "explain", "overview", "intro",
        "platform", "project", "concept", "mission", "purpose", "why created", "goal",
        "vision", "features", "काय आहे", "क्या है", "प्रोजेक्ट", "प्लॅटफॉर्म", "माहिती", "जानकारी", "उद्देश्य"
    ],
    "roles": [
        "role", "farmer", "merchant", "transporter", "seller", "admin", "persona",
        "user type", "profiles", "account type", "who can use", "switch role",
        "शेतकरी", "व्यापारी", "वाहतूकदार", "किसान", "ट्रांसपोर्टर", "भूमिका", "पात्र", "रोल्स"
    ],
    "bidding": [
        "bid", "bidding", "auction", "live bid", "outbid", "counter bid", "timer",
        "websocket", "accept bid", "bidding room", "floor", "reserve price", "base price",
        "बोली", "लिलाव", "नीलाम", "बिडिंग", "ऑक्शन", "बोली कैसे लगाएं", "लिलाव कसा होतो", "थेट बोली"
    ],
    "mandi_intelligence": [
        "mandi intelligence", "mandi compare", "apmc comparison", "gross rate",
        "net realized rate", "best mandi", "comparison", "freight deduct",
        "मंडी इंटेलिजेंस", "मंडी तुलना", "सर्वोत्तम बाजार", "हातात येणारा भाव"
    ],
    "profitability_formula": [
        "formula", "profitability", "profit margin", "how is profit calculated", "margin calculation",
        "cost of production", "cost-of-production", "verdict", "emerald", "green", "amber",
        "break even", "revenue calculation", "math formula", "calculation formula",
        "सूत्र", "कॅल्क्युलेटर", "नफा कसा काढायचा", "गणित", "फॉर्म्युला", "नफा फॉर्म्युला"
    ],
    "logistics": [
        "logistics", "transport", "vehicle", "truck", "tempo", "chota hathi",
        "bolero", "eicher", "freight", "distance", "km", "fare", "hire truck", "reefer",
        "वाहतूक", "गाडी", "ट्रक", "भाडे", "किराया", "वाहन", "ढुलाई", "छोटा हाथी", "बोलेरो"
    ],
    "plant_doctor": [
        "plant doctor", "disease", "leaf", "pest", "blight", "rust", "pathology",
        "powdery mildew", "diagnosis", "scan", "upload", "photo", "leaf scan",
        "doctor", "remedy", "organic remedy", "chemical remedy", "crop health",
        "रोग", "पान", "कीड", "बीमारी", "पत्ता", "फसल रोग", "पीक डॉक्टर", "निदान", "उपचार"
    ],
    "pesticide_store": [
        "pesticide", "fungicide", "herbicide", "fertilizer", "input store",
        "agri input", "buy pesticide", "medicine shop", "certified", "cibrc",
        "seeds", "sprayer", "neem oil", "kavach", "ridomil", "proclaim", "bio-zyme",
        "कीटकनाशक", "कीटनाशक", "खाद", "उर्वरक", "दुकान", "बियाणे", "दवा", "स्प्रे", "स्टोअर"
    ],
    "escrow": [
        "escrow", "payment", "security", "safe money", "payout", "settlement",
        "fraud", "guarantee", "cheque", "bank transfer", "safe transaction",
        "एस्क्रो", "सुरक्षा", "पेमेंट", "पैसे", "भुगतान", "सुरक्षित"
    ],
    "trust_score": [
        "trust", "score", "rating", "stars", "trust score", "reputation",
        "verified badge", "kyc", "4.9", "5.0",
        "ट्रस्ट", "विश्वास", "स्कोर", "रेटिंग", "स्टार", "पडताळणी"
    ],
    "tech_stack": [
        "tech stack", "technology", "react", "fastapi", "sqlite", "jwt",
        "websocket", "tailwind", "typescript", "backend", "frontend", "api",
        "architecture", "python", "database", "vite",
        "तंत्रज्ञान", "तकनीक", "सॉफ्टवेअर", "आर्किटेक्चर"
    ],
    "palette": [
        "palette", "color", "theme", "calm luxury", "hex", "colors",
        "sage", "linen", "olive", "mist", "charcoal", "light mode",
        "#f2efea", "#dfe5f3", "#557373", "#272401",
        "रंग", "कलर", "थीम"
    ],
    "personas": [
        "ramesh", "suresh", "mahendra", "priya", "gurpreet", "vijay", "shivraj", "kothari", "joshi",
        "login credentials", "demo accounts", "test users", "password", "phone numbers",
        "डेमो खाती", "पासवर्ड", "युझर्स", "लॉगिन"
    ],
    "crops": [
        "crops", "soybean", "wheat", "cotton", "tomato", "onion", "rice", "basmati",
        "पिके", "फसलें", "सोयाबीन", "गहू", "कापूस", "कांदा", "टोमॅटो", "चावल"
    ],
    "create_listing": [
        "how to list", "create listing", "new listing", "add crop", "sell crop",
        "publish harvest", "माल कसा विकायचा", "फसल कैसे बेचें", "यादी कशी करावी", "लिस्टिंग"
    ],
    "api_architecture": [
        "api routes", "endpoints", "rest api", "backend routes", "swagger", "openapi",
        "api सूची", "एंडपॉइंट्स"
    ]
}

CROP_KEYWORDS: Dict[str, str] = {
    "soybean": "Soybean", "soya": "Soybean", "सोयाबीन": "Soybean",
    "wheat": "Wheat", "gehu": "Wheat", "गहू": "Wheat", "गेहूं": "Wheat",
    "cotton": "Cotton", "kapas": "Cotton", "कापूस": "Cotton", "कपास": "Cotton",
    "tomato": "Tomato", "tamatar": "Tomato", "टोमॅटो": "Tomato", "टमाटर": "Tomato",
    "onion": "Red Onion", "pyaaz": "Red Onion", "kanda": "Red Onion", "कांदा": "Red Onion", "प्याज": "Red Onion",
    "rice": "Basmati Rice", "chawal": "Basmati Rice", "तांदूळ": "Basmati Rice", "चावल": "Basmati Rice", "basmati": "Basmati Rice",
}

MANDI_KEYWORDS: Dict[str, str] = {
    "nashik": "Nashik Mandi", "pune": "Pune APMC Market", "vashi": "Vashi APMC Mumbai",
    "mumbai": "Vashi APMC Mumbai", "indore": "Choithram Mandi", "choithram": "Choithram Mandi",
    "lasalgaon": "Lasalgaon Onion Mandi", "khanna": "Khanna Grain Mandi", "ludhiana": "Khanna Grain Mandi",
    "delhi": "Azadpur Mandi", "azadpur": "Azadpur Mandi", "akola": "Akola Cotton Yard",
    "rajkot": "Rajkot APMC Yard", "narayangaon": "Narayangaon Tomato Hub", "karnal": "Karnal Mandi",
}


# ──────────────────────────────────────────────────────────────────────────────
#  3. INTENT SCORING & RETRIEVAL HELPERS
# ──────────────────────────────────────────────────────────────────────────────
def _score_intent(query_text: str, intent_key: str, keywords: List[str]) -> float:
    """Calculate relevance score between user query and intent keywords."""
    score = 0.0
    query_lower = query_text.lower()
    query_tokens = set(re.findall(r'[\w\-]+', query_lower))

    for kw in keywords:
        kw_lower = kw.lower()
        if kw_lower in query_lower:
            score += 3.5
        kw_tokens = set(re.findall(r'[\w\-]+', kw_lower))
        overlap = query_tokens.intersection(kw_tokens)
        score += len(overlap) * 1.5

    return score


def _find_best_intent(query: str) -> Optional[str]:
    """Find the highest scoring intent using semantic token scoring."""
    best_intent = None
    highest_score = 0.0

    for intent, keywords in INTENT_KEYWORDS.items():
        score = _score_intent(query, intent, keywords)
        if score > highest_score:
            highest_score = score
            best_intent = intent

    if highest_score >= 2.0:
        return best_intent
    return None


def _kb_response(intent: str, language: str) -> Dict[str, Any]:
    """Return a structured response from the knowledge base."""
    entry = PROJECT_KB.get(intent, PROJECT_KB["about"])
    lang_key = language if language in entry else "en"
    
    action_map = {
        "about": ["Explore Mandi Prices", "View Live Bidding", "Switch Persona"],
        "roles": ["Farmer Portal", "Merchant Portal", "Transporter Portal"],
        "bidding": ["Open Live Bidding Room", "Create Crop Listing"],
        "mandi_intelligence": ["Open Mandi Intelligence", "Calculate Net Profit"],
        "profitability_formula": ["Calculate Net Profit", "Open Mandi Intelligence"],
        "logistics": ["Calculate Transport Freight", "Book Smart Vehicle"],
        "plant_doctor": ["Open AI Plant Doctor", "Browse Pesticide Store"],
        "pesticide_store": ["Browse Pesticide Store", "Buy Bio-Fungicide"],
        "escrow": ["View My Orders", "Check Payment Security"],
        "trust_score": ["View Trust Ratings", "User Directory"],
        "tech_stack": ["View Architecture", "Open API Docs"],
        "palette": ["View Color Tokens", "Explore Calm Luxury"],
        "personas": ["Demo Login Info", "Switch Role"],
        "crops": ["Check Mandi Rates", "List Produce"],
        "create_listing": ["+ Create New Listing", "View My Listings"],
        "api_architecture": ["View API Routes", "Swagger Docs"],
    }
    
    return {
        "answer": entry[lang_key],
        "language": language,
        "suggested_actions": action_map.get(intent, ["Explore Platform", "Mandi Prices"]),
        "grounded_data": {"intent": intent}
    }


# ──────────────────────────────────────────────────────────────────────────────
#  4. SPECIFIC ENTITY RESOLVERS (Diseases, Store Products, Fleets, Personas)
# ──────────────────────────────────────────────────────────────────────────────
def _check_disease_query(query: str, language: str) -> Optional[Dict[str, Any]]:
    """Checks if the query is asking about a specific plant disease or pathology remedy."""
    q_lower = query.lower()
    
    # If the user is specifically querying price, stock, mandi rates, transport freight, or credentials, do not trigger disease unless explicitly asking about disease/symptom/cure
    disease_intent_words = ["disease", "remedy", "cure", "medicine", "spray", "care", "blight", "pest", "rot", "mildew", "rust", "blast", "bollworm", "aphid", "whitefly", "symptom", "treatment", "रोग", "उपचार", "दवा", "औषध", "करपा", "तांबेरा", "अळी", "झुलसा", "कीट", "उपाय"]
    has_disease_intent = any(w in q_lower for w in disease_intent_words)
    
    is_mandi_or_stock = any(
        re.search(r'\b' + re.escape(w) + r'\b', q_lower) 
        for w in ["mandi", "bhav", "stock", "freight", "km", "password", "who is", "formula", "margin"]
    )
    
    if is_mandi_or_stock and not has_disease_intent:
        return None

    # Check for specific disease matches
    for entry in DISEASE_KNOWLEDGE_BASE:
        disease_name = entry["detected_disease"].lower()
        crop = entry["crop_name"].lower()
        matched = False
        
        is_tomato = any(w in q_lower for w in ["tomato", "टमाटर", "टोमॅटो"])
        is_potato = any(w in q_lower for w in ["potato", "आलू", "बटाटा"])
        is_cotton = any(w in q_lower for w in ["cotton", "कपास", "कापूस"])
        is_rice = any(w in q_lower for w in ["rice", "धान", "चावल", "भात", "तांदूळ"])
        is_soybean = any(w in q_lower for w in ["soybean", "सोयाबीन"])
        is_wheat = any(w in q_lower for w in ["wheat", "गेहूं", "गहू"])

        # Specific named diseases
        if "early blight" in q_lower or (is_tomato and ("blight" in q_lower or "spot" in q_lower or "करपा" in q_lower or "उपचार" in q_lower or "cure" in q_lower or "उपाय" in q_lower or "रोग" in q_lower)):
            if "tomato" in crop:
                matched = True
        elif "late blight" in q_lower or (is_potato and ("blight" in q_lower or "rot" in q_lower or "पछेती" in q_lower or "करपा" in q_lower or "cure" in q_lower or "उपाय" in q_lower)):
            if "potato" in crop:
                matched = True
        elif "bollworm" in q_lower or "बोंडअळी" in q_lower or (is_cotton and ("pest" in q_lower or "worm" in q_lower or "hole" in q_lower or "रोग" in q_lower or "उपाय" in q_lower)):
            if "cotton" in crop:
                matched = True
        elif "rice blast" in q_lower or (is_rice and ("blast" in q_lower or "spindle" in q_lower or "करपा" in q_lower or "रोग" in q_lower or "उपाय" in q_lower)):
            if "rice" in crop:
                matched = True
        elif "soybean rust" in q_lower or "तांबेरा" in q_lower or (is_soybean and ("rust" in q_lower or "pustule" in q_lower or "रोग" in q_lower or "उपाय" in q_lower)):
            if "soybean" in crop:
                matched = True
        elif "whitefly" in q_lower or "aphid" in q_lower or "sucking pest" in q_lower or "मावा" in q_lower or "तुडतुडे" in q_lower:
            if "aphids" in disease_name or "whitefly" in disease_name:
                matched = True
        elif has_disease_intent and any(re.search(r'\b' + re.escape(cw.lower()) + r'\b', q_lower) for cw in re.split(r'[\s/]+', crop) if len(cw) > 2):
            matched = True
            
        if matched:
            if language == "mr":
                ans = (
                    f"🌿 **AI पीक डॉक्टर — {entry['crop_name']} रोग माहिती:**\n\n"
                    f"• **निदान झालेला रोग:** **{entry['detected_disease']}**\n"
                    f"• **तीव्रता (Severity):** {entry['severity']}\n"
                    f"• **लक्षणे:** {entry['symptoms']}\n\n"
                    f"🌱 **सेंद्रिय उपाय (Organic Remedy):**\n{entry['organic_remedy']}\n\n"
                    f"🧪 **प्रमाणित रासायनिक उपचार (Certified Chemical):**\n{entry['chemical_treatment']}\n\n"
                    f"🛍️ **शिफारस केलेले औषध:** **{entry['recommended_product_name']}** ({entry['recommended_product_category']})"
                )
            elif language == "hi":
                ans = (
                    f"🌿 **AI प्लांट डॉक्टर — {entry['crop_name']} रोग विवरण:**\n\n"
                    f"• **पहचाना गया रोग:** **{entry['detected_disease']}**\n"
                    f"• **गंभीरता (Severity):** {entry['severity']}\n"
                    f"• **लक्षण:** {entry['symptoms']}\n\n"
                    f"🌱 **जैविक उपचार (Organic Remedy):**\n{entry['organic_remedy']}\n\n"
                    f"🧪 **प्रमाणित रासायनिक उपचार (Chemical Treatment):**\n{entry['chemical_treatment']}\n\n"
                    f"🛍️ **सुझाई गई दवा:** **{entry['recommended_product_name']}** ({entry['recommended_product_category']})"
                )
            else:
                ans = (
                    f"🌿 **AI Plant Doctor — {entry['crop_name']} Pathology Care:**\n\n"
                    f"• **Detected Condition:** **{entry['detected_disease']}**\n"
                    f"• **Severity Level:** {entry['severity']}\n"
                    f"• **Symptoms:** {entry['symptoms']}\n\n"
                    f"🌱 **Organic Remedy:**\n{entry['organic_remedy']}\n\n"
                    f"🧪 **Certified Chemical Treatment:**\n{entry['chemical_treatment']}\n\n"
                    f"🛍️ **Recommended Store Product:** **{entry['recommended_product_name']}** ({entry['recommended_product_category']})"
                )
            return {
                "answer": ans,
                "language": language,
                "suggested_actions": ["Open AI Plant Doctor", "Browse Pesticide Store", "Buy Bio-Fungicide"],
                "grounded_data": {"disease": entry}
            }
    return None


def _check_pesticide_product_query(query: str, language: str, db: Session) -> Optional[Dict[str, Any]]:
    """Checks if the query is asking about a specific pesticide product or store stock."""
    q_lower = query.lower()
    
    products = db.query(PesticideProduct).all()
    if not products:
        return None

    matched_product = None
    for p in products:
        p_name = p.name.lower()
        p_brand = p.brand.lower()
        
        # Check specific product names with word boundary or distinctive tokens
        if "kavach" in q_lower and "kavach" in p_name:
            matched_product = p
            break
        elif "ridomil" in q_lower and "ridomil" in p_name:
            matched_product = p
            break
        elif "proclaim" in q_lower and "proclaim" in p_name:
            matched_product = p
            break
        elif ("neem oil" in q_lower or "निंबोळी" in q_lower) and "neem" in p_name:
            matched_product = p
            break
        elif "trichoderma" in q_lower and "trichoderma" in p_name:
            matched_product = p
            break
        elif ("sprayer" in q_lower or "स्प्रे पंप" in q_lower or "knapsack" in q_lower) and "sprayer" in p_name:
            matched_product = p
            break
        elif ("bio-zyme" in q_lower or "seaweed" in q_lower or "biozyme" in q_lower) and "bio-zyme" in p_name:
            matched_product = p
            break
        elif ("js-335" in q_lower or "soybean seeds" in q_lower or "सोयाबीन बियाणे" in q_lower) and "js-335" in p_name:
            matched_product = p
            break
        elif any(re.search(r'\b' + re.escape(w.lower()) + r'\b', q_lower) for w in [p.brand, p.name.split()[0]] if len(w) > 3):
            matched_product = p
            break

    if matched_product:
        p = matched_product
        if language == "mr":
            ans = (
                f"🛍️ **प्रमाणित कृषी उत्पादन तपशील — {p.name}:**\n\n"
                f"• **ब्रँड:** {p.brand} (CIBRC प्रमाणित)\n"
                f"• **प्रवर्ग:** {p.category} | **पॅक:** {p.unit}\n"
                f"• **किंमत:** **₹{int(p.price)}** (शिल्लक स्टॉक: {p.stock} युनिट्स, ⭐ {p.rating})\n"
                f"• **उपयुक्त पिके:** {p.target_crops}\n"
                f"• **नियंत्रण:** {p.target_pests}\n"
                f"• **वापरण्याची पद्धत:** {p.usage_instructions}\n"
                f"• **वर्णन:** {p.description}"
            )
        elif language == "hi":
            ans = (
                f"🛍️ **प्रमाणित कृषि उत्पाद विवरण — {p.name}:**\n\n"
                f"• **ब्रांड:** {p.brand} (सरकारी CIBRC प्रमाणित)\n"
                f"• **श्रेणी:** {p.category} | **पैक साइज:** {p.unit}\n"
                f"• **मूल्य:** **₹{int(p.price)}** (स्टॉक: {p.stock} यूनिट, ⭐ {p.rating})\n"
                f"• **लक्षित फसलें:** {p.target_crops}\n"
                f"• **कीट/रोग नियंत्रण:** {p.target_pests}\n"
                f"• **प्रयोग विधि:** {p.usage_instructions}\n"
                f"• **विवरण:** {p.description}"
            )
        else:
            ans = (
                f"🛍️ **Certified Agri-Input Details — {p.name}:**\n\n"
                f"• **Brand:** {p.brand} (Govt CIBRC Certified)\n"
                f"• **Category:** {p.category} | **Unit Size:** {p.unit}\n"
                f"• **Price:** **₹{int(p.price)}** (In Stock: {p.stock} packs, Rating: ⭐ {p.rating})\n"
                f"• **Target Crops:** {p.target_crops}\n"
                f"• **Pest / Target:** {p.target_pests}\n"
                f"• **Usage Instructions:** {p.usage_instructions}\n"
                f"• **Product Summary:** {p.description}"
            )
        return {
            "answer": ans,
            "language": language,
            "suggested_actions": ["Browse Pesticide Store", "Buy Bio-Fungicide", "AI Plant Doctor"],
            "grounded_data": {"product_id": p.id, "price": p.price, "stock": p.stock}
        }
    return None


def _check_vehicle_fleet_query(query: str, language: str) -> Optional[Dict[str, Any]]:
    """Checks if query asks about specific vehicle classes in the transport fleet."""
    q_lower = query.lower()
    
    for v in VEHICLE_FLEET:
        v_name = v["vehicle_type"].lower()
        if any(term in q_lower for term in [v_name, "tata ace", "chota hathi", "bolero", "eicher", "tractor", "reefer", "छोटा हाथी", "बोलेरो", "आयशर"]):
            if ("tata ace" in q_lower or "chota hathi" in q_lower or "छोटा हाथी" in q_lower) and "mini truck" in v_name:
                matched_v = v
            elif ("bolero" in q_lower or "बोलेरो" in q_lower) and "pickup" in v_name:
                matched_v = v
            elif ("tractor" in q_lower or "ट्रॅक्टर" in q_lower or "ट्रैक्टर" in q_lower) and "tractor" in v_name:
                matched_v = v
            elif ("eicher" in q_lower or "heavy truck" in q_lower or "10-ton" in q_lower or "आयशर" in q_lower) and "10-ton" in v_name:
                matched_v = v
            elif ("reefer" in q_lower or "cold" in q_lower or "refrigerated" in q_lower) and "reefer" in v_name:
                matched_v = v
            else:
                continue

            if language == "mr":
                ans = (
                    f"🚚 **वाहन तपशील — {matched_v['vehicle_type']}:**\n\n"
                    f"• **क्षमता:** {matched_v['capacity_quintals']} क्विंटलपर्यंत\n"
                    f"• **आधारभूत भाडे (Base Fare):** ₹{matched_v['base_rate']}\n"
                    f"• **प्रति किलोमीटर दर:** ₹{matched_v['rate_per_km']}/किमी\n"
                    f"• **कमाल अंतर मर्यादा:** {matched_v['max_distance_km']} किमी\n"
                    f"• **उपयुक्तता:** {matched_v['description']}"
                )
            elif language == "hi":
                ans = (
                    f"🚚 **वाहन विवरण — {matched_v['vehicle_type']}:**\n\n"
                    f"• **वहन क्षमता:** {matched_v['capacity_quintals']} क्विंटल तक\n"
                    f"• **आधार शुल्क (Base Fare):** ₹{matched_v['base_rate']}\n"
                    f"• **प्रति किमी दर:** ₹{matched_v['rate_per_km']}/किमी\n"
                    f"• **अधिकतम दूरी सीमा:** {matched_v['max_distance_km']} किमी\n"
                    f"• **उपयोग:** {matched_v['description']}"
                )
            else:
                ans = (
                    f"🚚 **Vehicle Fleet Specification — {matched_v['vehicle_type']}:**\n\n"
                    f"• **Max Payload Capacity:** **{matched_v['capacity_quintals']} Quintals**\n"
                    f"• **Base Booking Rate:** **₹{matched_v['base_rate']}**\n"
                    f"• **Running Freight Rate:** **₹{matched_v['rate_per_km']}/km**\n"
                    f"• **Max Efficient Range:** {matched_v['max_distance_km']} km\n"
                    f"• **Best Suited For:** {matched_v['description']}"
                )
            return {
                "answer": ans,
                "language": language,
                "suggested_actions": ["Calculate Transport Freight", "Book Smart Vehicle"],
                "grounded_data": {"vehicle": matched_v}
            }
    return None


def _check_persona_query(query: str, language: str, db: Session) -> Optional[Dict[str, Any]]:
    """Checks if query asks about a specific persona / user in the platform."""
    q_lower = query.lower()
    
    # If the query is asking to calculate transport freight or mandi rates, skip persona check
    if any(w in q_lower for w in ["calculate", "freight", "km", "quintal", "qtl", "ton", "भाडे", "किराया", "ढुलाई", "mandi rate", "live rate", "bhav"]):
        return None

    GENERIC_WORDS = {"transport", "rural", "agro", "traders", "kendra", "admin", "logistics", "center", "centre", "farm", "connect", "krishi", "seva", "user", "demo", "price", "rate"}
    
    users = db.query(User).all()
    matched_user = None
    for u in users:
        # Check phone match
        if u.phone in q_lower:
            matched_user = u
            break
        
        # Check individual name tokens
        name_parts = [p.lower() for p in re.split(r'[\s\-_]+', u.name) if p.lower() not in GENERIC_WORDS and len(p) > 3]
        if any(re.search(r'\b' + re.escape(part) + r'\b', q_lower) for part in name_parts):
            matched_user = u
            break

    if matched_user:
        u = matched_user
        if language == "mr":
            ans = (
                f"👤 **वापरकर्ता प्रोफाइल तपशील — {u.name}:**\n\n"
                f"• **भूमिका (Role):** {u.role.upper()}\n"
                f"• **फोन नंबर:** `{u.phone}` (लॉगिन आयडी)\n"
                f"• **स्थान:** {u.location}, {u.district}, {u.state}\n"
                f"• **ट्रस्ट रेटिंग:** ⭐ {u.trust_score} / 5.0 ({u.total_deals} यशस्वी व्यवहार)\n"
                f"• **पडताळणी:** {'प्रमाणित (Verified KYC)' if u.verified else 'Pending'}\n\n"
                f"🔑 **डेमो पासवर्ड:** `password123`"
            )
        elif language == "hi":
            ans = (
                f"👤 **उपयोगकर्ता प्रोफाइल विवरण — {u.name}:**\n\n"
                f"• **भूमिका (Role):** {u.role.upper()}\n"
                f"• **मोबाइल नंबर:** `{u.phone}` (लॉगिन)\n"
                f"• **स्थान:** {u.location}, {u.district}, {u.state}\n"
                f"• **विश्वसनीयता स्कोर:** ⭐ {u.trust_score} / 5.0 ({u.total_deals} पूर्ण सौदे)\n"
                f"• **सत्यापन स्थिति:** {'प्रमाणित (Verified KYC)' if u.verified else 'Pending'}\n\n"
                f"🔑 **डेमो पासवर्ड:** `password123`"
            )
        else:
            ans = (
                f"👤 **User Persona Profile — {u.name}:**\n\n"
                f"• **Platform Role:** **{u.role.upper()}**\n"
                f"• **Login Phone:** `{u.phone}`\n"
                f"• **Location:** {u.location}, {u.district} ({u.state})\n"
                f"• **Trust Score:** ⭐ **{u.trust_score} / 5.0** ({u.total_deals} deals fulfilled)\n"
                f"• **KYC Status:** {'Verified Badge Active' if u.verified else 'Pending'}\n\n"
                f"🔑 **Default Demo Password:** `password123`"
            )
        return {
            "answer": ans,
            "language": language,
            "suggested_actions": ["Switch Persona", "View Live Bidding", "My Listings"],
            "grounded_data": {"user_id": u.id, "role": u.role, "phone": u.phone}
        }
    return None


CROP_KEYWORDS: Dict[str, str] = {
    "soybean": "Soybean",
    "सोयाबीन": "Soybean",
    "wheat": "Wheat",
    "गेहूं": "Wheat",
    "गहू": "Wheat",
    "tomato": "Tomato",
    "टमाटर": "Tomato",
    "टोमॅटो": "Tomato",
    "onion": "Onion",
    "कांदा": "Onion",
    "प्याज": "Onion",
    "cotton": "Cotton",
    "कापूस": "Cotton",
    "कपास": "Cotton",
    "gram": "Gram",
    "chana": "Gram",
    "चना": "Gram",
    "हरभरा": "Gram",
    "maize": "Maize",
    "मका": "Maize",
    "मक्का": "Maize",
    "paddy": "Paddy",
    "rice": "Paddy",
    "तांदूळ": "Paddy",
    "चावल": "Paddy",
}

MANDI_KEYWORDS: Dict[str, str] = {
    "nashik": "Nashik Mandi",
    "नाशिक": "Nashik Mandi",
    "pune": "Pune APMC Market",
    "पुणे": "Pune APMC Market",
    "lasalgaon": "Lasalgaon Mandi",
    "लासलगाव": "Lasalgaon Mandi",
    "choithram": "Choithram Mandi",
    "indore": "Choithram Mandi",
    "इंदूर": "Choithram Mandi",
    "इंदौर": "Choithram Mandi",
    "azadpur": "Azadpur Mandi",
    "delhi": "Azadpur Mandi",
    "आझादपूर": "Azadpur Mandi",
    "navi mumbai": "Navi Mumbai Vashi APMC",
    "vashi": "Navi Mumbai Vashi APMC",
    "वाशी": "Navi Mumbai Vashi APMC",
    "mumbai": "Navi Mumbai Vashi APMC",
}

CROP_NAME_I18N: Dict[str, Dict[str, str]] = {
    "Soybean": {"hi": "सोयाबीन (Soybean)", "mr": "सोयाबीन (Soybean)", "en": "Soybean"},
    "Wheat": {"hi": "गेहूं (Wheat)", "mr": "गहू (Wheat)", "en": "Wheat"},
    "Tomato": {"hi": "टमाटर (Tomato)", "mr": "टोमॅटो (Tomato)", "en": "Tomato"},
    "Onion": {"hi": "प्याज (Onion)", "mr": "कांदा (Onion)", "en": "Onion"},
    "Cotton": {"hi": "कपास (Cotton)", "mr": "कापूस (Cotton)", "en": "Cotton"},
    "Gram": {"hi": "चना (Gram)", "mr": "हरभरा (Gram)", "en": "Gram / Chana"},
    "Maize": {"hi": "मक्का (Maize)", "mr": "मका (Maize)", "en": "Maize"},
    "Paddy": {"hi": "चावल / धान (Paddy)", "mr": "भात / तांदूळ (Paddy)", "en": "Paddy / Rice"},
}


def _detect_query_language(query: str, default_lang: str = "en") -> str:
    """Auto-detects Hindi or Marathi from query script and vocabulary if user types in native language."""
    if not query:
        return default_lang
    has_devanagari = bool(re.search(r'[\u0900-\u097F]', query))
    if not has_devanagari:
        return default_lang
        
    marathi_markers = ["आहे", "कसा", "कशी", "काय", "आहेत", "रोगावर", "शेतकरी", "वाहतूक", "भाडे", "लिलाव", "उपाय", "किंमत"]
    hindi_markers = ["क्या", "कैसे", "है", "हैं", "भाव", "रोग", "उपचार", "दवा", "नीलामी", "ताज़ा", "बताओ", "किराया", "कीमत"]
    
    if any(m in query for m in marathi_markers) and not any(h in query for h in ["क्या", "कैसे", "है", "हैं", "ताज़ा", "बताओ"]):
        return "mr"
    elif any(h in query for h in hindi_markers):
        return "hi"
    return "hi" if default_lang == "en" else default_lang


# ──────────────────────────────────────────────────────────────────────────────
#  5. MAIN CHAT PROCESSOR — MULTI-DIMENSIONAL RESOLUTION
# ──────────────────────────────────────────────────────────────────────────────
def process_krishi_chat(
    query: str,
    language: str,
    user_id: Optional[int],
    db: Session
) -> Dict[str, Any]:
    """
    Krishi Sahayak: Context-grounded multi-lingual agricultural AI assistant.
    Trained thoroughly across all project features, formulas, live database states,
    diseases, pesticides, logistics, personas, and business logic with exact answers.
    """
    language = _detect_query_language(query, language or "en")
    q = query.lower().strip()
    grounded_data: Dict[str, Any] = {}
    suggested_actions: List[str] = []

    # ── 1. ENTITY CHECK: Specific Disease or Plant Pathology ────────────────
    disease_res = _check_disease_query(query, language)
    if disease_res:
        return disease_res

    # ── 2. ENTITY CHECK: Specific Pesticide Store Product ───────────────────
    product_res = _check_pesticide_product_query(query, language, db)
    if product_res:
        return product_res

    # ── 3. ENTITY CHECK: Specific Vehicle Class / Fleet Specs ──────────────
    vehicle_res = _check_vehicle_fleet_query(query, language)
    if vehicle_res:
        return vehicle_res

    # ── 4. ENTITY CHECK: Specific User Persona / Demo Account ───────────────
    persona_res = _check_persona_query(query, language, db)
    if persona_res:
        return persona_res

    # ── 5. LIVE DATABASE CHECK: Specific Crop Mandi Rate Queries ────────────
    mandi_match = any(w in q for w in [
        "mandi", "price", "rate", "bhav", "bhaav", "kimat", "cost of crop", "market rate",
        "दर", "भाव", "किंमत", "बाजारभाव", "मंडी भाव", "चालू दर"
    ])
    detected_crop = next(
        (cname for kw, cname in CROP_KEYWORDS.items() if kw in q), None
    )
    detected_mandi = next(
        (mname for kw, mname in MANDI_KEYWORDS.items() if kw in q), None
    )

    if (mandi_match or detected_crop or detected_mandi) and "intelligence" not in q and "calculator" not in q and "formula" not in q:
        query_filter = MandiPrice.crop_name.ilike(f"%{detected_crop}%") if detected_crop else None
        if detected_mandi:
            mandi_filter = MandiPrice.mandi_name.ilike(f"%{detected_mandi.split()[0]}%")
            if query_filter is not None:
                prices = db.query(MandiPrice).filter(query_filter, mandi_filter).all()
            else:
                prices = db.query(MandiPrice).filter(mandi_filter).all()
        else:
            crop_target = detected_crop or "Soybean"
            prices = db.query(MandiPrice).filter(MandiPrice.crop_name.ilike(f"%{crop_target}%")).all()

        if prices:
            best_mandi = max(prices, key=lambda p: p.modal_price)
            crop_base = detected_crop or (prices[0].crop_name if prices else "Crop")
            crop_label = CROP_NAME_I18N.get(crop_base, {}).get(language, crop_base)
            grounded_data["mandi_prices"] = [
                {"mandi": p.mandi_name, "state": p.state, "price": p.modal_price, "trend": p.price_trend}
                for p in prices[:4]
            ]
            suggested_actions = ["View Mandi Intelligence", "Compare Transport Costs", "Create Crop Listing"]
            
            if language == "mr":
                answer = f"📊 **{crop_label} चे चालू APMC बाजारभाव:**\n\n"
                for p in prices[:4]:
                    trend_icon = "📈" if p.price_trend == "rising" or p.price_trend == "up" else "📉" if p.price_trend == "falling" or p.price_trend == "down" else "➡️"
                    answer += f"• **{p.mandi_name} ({p.district}, {p.state}):** ₹{int(p.modal_price)}/क्विंटल (किमान: ₹{int(p.min_price)} – कमाल: ₹{int(p.max_price)}, अंतर: {p.distance_km} किमी) {trend_icon}\n"
                answer += f"\n💡 **AI शिफारस:** **{best_mandi.mandi_name}** मंडी येथे सर्वाधिक **₹{int(best_mandi.modal_price)}/क्विंटल** दर चालू आहे. वाहतूक खर्च वजा करून निव्वळ नफा तपासण्यासाठी 'Mandi Intelligence' पहा!"
            elif language == "hi":
                answer = f"📊 **{crop_label} के ताज़ा APMC मंडी भाव:**\n\n"
                for p in prices[:4]:
                    trend_icon = "📈" if p.price_trend == "rising" or p.price_trend == "up" else "📉" if p.price_trend == "falling" or p.price_trend == "down" else "➡️"
                    answer += f"• **{p.mandi_name} ({p.district}, {p.state}):** ₹{int(p.modal_price)}/क्विंटल (न्यूनतम: ₹{int(p.min_price)} – अधिकतम: ₹{int(p.max_price)}, दूरी: {p.distance_km} किमी) {trend_icon}\n"
                answer += f"\n💡 **AI सुझाव:** **{best_mandi.mandi_name}** में सर्वाधिक **₹{int(best_mandi.modal_price)}/क्विंटल** भाव है। शुद्ध इन-हैंड लाभ देखने के लिए 'मंडी इंटेलिजेंस' खोलें!"
            else:
                answer = f"📊 **Live APMC Mandi Rates — {crop_label}:**\n\n"
                for p in prices[:4]:
                    trend_icon = "📈" if p.price_trend == "rising" or p.price_trend == "up" else "📉" if p.price_trend == "falling" or p.price_trend == "down" else "➡️"
                    answer += f"• **{p.mandi_name} ({p.district}, {p.state}):** ₹{int(p.modal_price)}/Qtl (Range: ₹{int(p.min_price)} – ₹{int(p.max_price)} | Distance: {p.distance_km} km) {trend_icon}\n"
                answer += f"\n💡 **Top Recommendation:** **{best_mandi.mandi_name}** currently offers the highest modal rate at **₹{int(best_mandi.modal_price)}/Qtl**. Use the Mandi Intelligence calculator to deduct freight and lock your deal!"
            return {"answer": answer, "language": language, "suggested_actions": suggested_actions, "grounded_data": grounded_data}

    # ── 6. LIVE DATABASE CHECK: Dynamic Transport Calculation Query ────────
    transport_words = ["transport", "vehicle", "truck", "tempo", "freight", "km", "fare", "गाडी", "वाहतूक", "ट्रक", "भाडे", "किराया", "ढुलाई"]
    if any(w in q for w in transport_words) and "role" not in q and "transporter" not in q and "who is" not in q:
        dist_match = re.search(r'(\d+)\s*(?:km|किमी|किलोमीटर)', q)
        load_match = re.search(r'(\d+)\s*(?:quintal|qtl|ton|टन|क्विंटल)', q)
        distance = float(dist_match.group(1)) if dist_match else 40.0
        load = float(load_match.group(1)) if load_match else 30.0
        quotes = calculate_transport_options(load, distance)
        grounded_data["transport"] = quotes
        suggested_actions = ["Book Smart Transport", "Mandi Intelligence"]
        
        per_qtl = round(quotes['recommended_cost'] / max(1.0, load), 1)
        
        if language == "mr":
            answer = (f"🚚 **स्मार्ट वाहतूक दर अंदाज ({load} क्विंटल, {distance} किमी):**\n\n"
                      f"• **शिफारस केलेले वाहन:** **{quotes['recommended_vehicle']}**\n"
                      f"• **अंदाजे एकूण भाडे:** **₹{quotes['recommended_cost']}**\n"
                      f"• **प्रति क्विंटल वाहतूक खर्च:** **₹{per_qtl}/क्विंटल**\n\n"
                      "💡 आमचे अल्गोरिदम वजनानुसार योग्य गाडी निवडते जेणेकरून रिकाम्या जागेचे अतिरिक्त भाडे पडत नाही!")
        elif language == "hi":
            answer = (f"🚚 **स्मार्ट ट्रांसपोर्ट किराया अनुमान ({load} क्विंटल, {distance} किमी):**\n\n"
                      f"• **सुझाया गया वाहन:** **{quotes['recommended_vehicle']}**\n"
                      f"• **अनुमानित कुल किराया:** **₹{quotes['recommended_cost']}**\n"
                      f"• **प्रति क्विंटल ढुलाई खर्च:** **₹{per_qtl}/क्विंटल**\n\n"
                      "💡 हमारा सिस्टम माल के वजन अनुसार सबसे उपयुक्त वाहन तय करता है!")
        else:
            answer = (f"🚚 **Smart Transport Estimate ({load} Qtl payload, {distance} km distance):**\n\n"
                      f"• **Recommended Vehicle:** **{quotes['recommended_vehicle']}**\n"
                      f"• **Total Estimated Freight:** **₹{quotes['recommended_cost']}**\n"
                      f"• **Freight Deduction per Qtl:** **₹{per_qtl}/Qtl**\n\n"
                      "💡 FarmChain automatically matches optimal vehicle capacity so you never overpay for empty truck volume.")
        return {"answer": answer, "language": language, "suggested_actions": suggested_actions, "grounded_data": grounded_data}

    # ── 7. LIVE DATABASE CHECK: Live Bids & Listings Status ─────────────────
    if any(w in q for w in ["my order", "my bid", "active listing", "live listings", "how many bids", "बीड", "माझी लिस्टिंग", "चालू लिलाव", "ऑर्डर"]):
        active_listings = db.query(CropListing).filter(CropListing.status == "bidding_open").all()
        total_listings = db.query(CropListing).count()
        total_orders = db.query(Order).count()
        grounded_data["active_listings_count"] = len(active_listings)
        grounded_data["total_listings"] = total_listings
        grounded_data["total_orders"] = total_orders
        suggested_actions = ["My Listings", "Live Bidding Room", "My Orders"]
        
        listings_summary = "\n".join([
            f"• **{l.crop_name}** ({l.quantity_quintals} Qtl, Base: ₹{int(l.base_price)}/Qtl, Loc: {l.farm_location})"
            for l in active_listings[:3]
        ])
        
        if language == "mr":
            answer = (f"📋 **सध्याची थेट बाजारपेठ स्थिती:**\n\n"
                      f"• **चालू लिलाव (Bidding Open):** {len(active_listings)} पिके\n"
                      f"{listings_summary}\n\n"
                      f"• **एकूण शेतमाल याद्या:** {total_listings}\n"
                      f"• **पूर्ण झालेले सौदे (Orders):** {total_orders}\n\n"
                      "👉 थेट बोली तपासण्यासाठी 'Live Bidding Room' किंवा 'My Listings' टॅब उघडा!")
        elif language == "hi":
            answer = (f"📋 **लाइव ऑक्शन स्टेटस:**\n\n"
                      f"• **सक्रिय नीलामी (Bidding Open):** {len(active_listings)} फसलें\n"
                      f"{listings_summary}\n\n"
                      f"• **कुल फसल सूचियाँ:** {total_listings}\n"
                      f"• **सफल ऑर्डर:** {total_orders}\n\n"
                      "👉 लाइव बोली देखने के लिए 'Live Bidding Room' खोलें!")
        else:
            answer = (f"📋 **Live Marketplace Status:**\n\n"
                      f"• **Active Bidding Rooms:** **{len(active_listings)} listings** currently open\n"
                      f"{listings_summary}\n\n"
                      f"• **Total Listings Created:** {total_listings}\n"
                      f"• **Finalized Orders:** {total_orders}\n\n"
                      "👉 Open the **Live Bidding Room** to monitor incoming bids and profit margins!")
        return {"answer": answer, "language": language, "suggested_actions": suggested_actions, "grounded_data": grounded_data}

    # ── 8. LIVE DATABASE CHECK: Platform Overview Analytics ─────────────────
    if any(w in q for w in ["platform stats", "analytics", "total users", "gmv", "how many users", "overview data", "प्लॅटफॉर्म आकडेवारी"]):
        user_count = db.query(User).count()
        listing_count = db.query(CropListing).count()
        order_count = db.query(Order).count()
        bid_count = db.query(Bid).count()
        grounded_data["stats"] = {
            "users": user_count, "listings": listing_count,
            "orders": order_count, "bids": bid_count
        }
        answer = (
            f"📊 **FarmChain Live Platform Analytics:**\n\n"
            f"• 👥 Registered Participants: **{user_count} verified users** (Farmers, Merchants, Transporters, Input Sellers)\n"
            f"• 🌾 Total Harvest Lots: **{listing_count} listings**\n"
            f"• ⚡ Real-Time Bids Submitted: **{bid_count} bids**\n"
            f"• 📦 Escrow Deals Finalized: **{order_count} orders**\n"
            f"• 🛡️ Platform Middleman Commission: **0% (100% Direct APMC Trade)**"
        )
        return {"answer": answer, "language": language, "suggested_actions": ["Admin Dashboard", "Live Bidding Room"], "grounded_data": grounded_data}

    # ── 9. SEMANTIC KNOWLEDGE BASE MATCHING ──────────────────────────────────
    matched_intent = _find_best_intent(q)
    if matched_intent:
        return _kb_response(matched_intent, language)

    # ── 10. INTELLIGENT CONTEXT-AWARE SYNTHESIS (NO GENERIC DUMP) ───────────
    # If the user asked something open-ended or unique, dynamically assemble an accurate answer
    # by parsing any matched tokens across crops, diseases, roles, or platform features.
    
    # Try fuzzy crop extraction
    matched_crop_name = None
    for kw, cname in CROP_KEYWORDS.items():
        if kw in q:
            matched_crop_name = cname
            break
            
    if matched_crop_name:
        p = db.query(MandiPrice).filter(MandiPrice.crop_name.ilike(f"%{matched_crop_name}%")).first()
        if p:
            if language == "mr":
                ans = f"🌾 **{matched_crop_name} संबंधी माहिती:**\nचालू APMC भाव: ₹{int(p.modal_price)}/क्विंटल ({p.mandi_name}). FarmChain वर तुम्ही थेट व्यापारी बोली मिळवू शकता आणि वाहतूक खर्च वजा करून निव्वळ नफा मोजू शकता."
            elif language == "hi":
                ans = f"🌾 **{matched_crop_name} संबंधित जानकारी:**\nताज़ा APMC भाव: ₹{int(p.modal_price)}/क्विंटल ({p.mandi_name})। FarmChain पर आप सीधे व्यापारियों से बोली प्राप्त कर सकते हैं और ढुलाई भाड़ा घटाकर शुद्ध मुनाफा देख सकते हैं।"
            else:
                ans = f"🌾 **Information for {matched_crop_name}:**\nLive APMC Modal Rate is ₹{int(p.modal_price)}/Qtl at {p.mandi_name}. On FarmChain, you can receive live merchant bids with Cost-of-Production margin protection and smart freight matching."
            return {"answer": ans, "language": language, "suggested_actions": ["View Mandi Intelligence", "Live Bidding Room"], "grounded_data": {"crop": matched_crop_name}}

    # Fallback to rich comprehensive project overview
    if language == "mr":
        answer = (
            f"🌾 **FarmChain (Smart Krishi Connect) AI सहाय्यक:**\n\n"
            f"FarmChain हे भारतीय कृषी व्यापारातील दलालांना हटवून शेतकऱ्यांना थेट व्यापाऱ्यांशी जोडणारे डिजिटल व्यासपीठ आहे.\n\n"
            f"**तुम्ही मला खालीलपैकी कोणताही प्रश्न विचारू शकता:**\n"
            f"1. 📊 **मंडी भाव:** 'सोयाबीनचा आजचा दर काय?', 'पुणे APMC मध्ये काय भाव चालू आहे?'\n"
            f"2. 🚚 **वाहतूक भाडे:** '५० किमीसाठी ३० क्विंटलचे भाडे किती होईल?', 'छोटा हत्तीचे दर काय आहेत?'\n"
            f"3. 🌿 **पीक रोग व उपचार:** 'टोमॅटो करपा रोगावर काय फवारावे?', 'कवच बुरशीनाशकाची किंमत काय?'\n"
            f"4. ⚡ **थेट लिलाव व नफा:** 'बोली कशी लावायची?', 'नफ्याचे सूत्र काय आहे?'\n"
            f"5. 👤 **वापरकर्ते व माहिती:** 'रमेश पाटील कोण आहे?', 'डेमो खात्यांचे पासवर्ड काय आहेत?'"
        )
    elif language == "hi":
        answer = (
            f"🌾 **FarmChain (Smart Krishi Connect) AI सहायक:**\n\n"
            f"FarmChain एक संपूर्ण डिजिटल कृषि प्लेटफ़ॉर्म है जो बिचौलियों को हटाकर किसानों को सीधे थोक व्यापारियों, "
            f"ट्रांसपोर्टरों और AI फसल रोग निदान से जोड़ता है।\n\n"
            f"**आप मुझसे कोई भी प्रश्न पूछ सकते हैं:**\n"
            f"1. 📊 **मंडी भाव:** 'सोयाबीन का ताज़ा भाव क्या है?', 'नाशिक मंडी के रेट क्या हैं?'\n"
            f"2. 🚚 **किराया गणना:** '40 किमी के लिए 25 क्विंटल माल का भाड़ा कितना होगा?'\n"
            f"3. 🌿 **फसल रोग व दवा:** 'आलू की पछेती झुलसा का इलाज क्या है?', 'रिडोमिल गोल्ड की कीमत क्या है?'\n"
            f"4. ⚡ **लाइव नीलामी:** 'बोली कैसे स्वीकार करें?', 'लागत सुरक्षा सूत्र क्या है?'\n"
            f"5. 👤 **डेमो लॉगिन:** 'डेमो पासवर्ड क्या है?', 'सुरेश ट्रेडर्स कौन हैं?'"
        )
    else:
        answer = (
            f"🌾 **FarmChain (Smart Krishi Connect) AI Assistant:**\n\n"
            f"FarmChain is India's transparent farm-to-fork agricultural commerce platform empowering farmers with "
            f"live APMC bidding, transport freight deductor, neural leaf pathology scanning, and guaranteed escrow settlements.\n\n"
            f"**You can ask me questions about:**\n"
            f"• 📊 **Live Mandi Rates:** *'What is today\'s Soybean rate in Nashik?'* or *'Show Wheat prices in Punjab'*\n"
            f"• 🚚 **Logistics & Freight:** *'How much freight for 40 Qtl over 50 km?'* or *'Tata Ace payload and base rate'*\n"
            f"• 🌿 **Crop Pathology:** *'How to cure Tomato Early Blight?'* or *'Price of Kavach Bio-Fungicide'*\n"
            f"• ⚡ **Live Auctions & Bidding:** *'How does live bidding work?'* or *'What is the formula for net profit margin?'*\n"
            f"• 👤 **Demo Accounts & Roles:** *'Who is Ramesh Patil?'* or *'What is the demo password and phone numbers?'*\n"
            f"• ⚙️ **Architecture & Design:** *'What is the tech stack and Calm Luxury color palette?'*"
        )

    suggested_actions = ["Mandi Prices", "Live Bidding", "Plant Doctor", "Transport Cost", "About FarmChain"]
    return {"answer": answer, "language": language, "suggested_actions": suggested_actions, "grounded_data": grounded_data}
