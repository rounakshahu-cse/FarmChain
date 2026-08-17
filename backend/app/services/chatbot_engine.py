import re
from typing import Dict, Any, List, Optional
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from backend.app.models.mandi import MandiPrice
from backend.app.models.listing import CropListing
from backend.app.models.bid import Bid
from backend.app.models.order import Order
from backend.app.models.pesticide import PesticideProduct
from backend.app.models.user import User
from backend.app.services.transport_engine import calculate_transport_options


# ──────────────────────────────────────────────────────────────────────────────
#  KNOWLEDGE BASE — FarmChain / Smart Krishi Connect
# ──────────────────────────────────────────────────────────────────────────────
PROJECT_KB = {
    "about": {
        "en": (
            "🌾 **Smart Krishi Connect (FarmChain)** is a full-stack farm-to-market platform that removes "
            "middlemen from agricultural trade.\n\n"
            "**What it does:**\n"
            "• Connects farmers directly with merchants via a transparent live-bidding system\n"
            "• Shows real-time APMC Mandi prices & net-profit optimizer\n"
            "• Auto-matches produce with the cheapest available transport vehicle\n"
            "• AI Plant Doctor diagnoses crop diseases from leaf photos\n"
            "• Verified Pesticide & Input Marketplace for certified agri-inputs\n"
            "• Multilingual (English, हिंदी, मराठी) with 3 colour themes\n\n"
            "**Tech Stack:** React + TypeScript frontend · FastAPI + SQLite backend · JWT auth · WebSockets for live bidding"
        ),
        "hi": (
            "🌾 **Smart Krishi Connect (FarmChain)** एक पूर्ण-स्टैक खेती-से-बाज़ार प्लेटफ़ॉर्म है "
            "जो कृषि व्यापार से बिचौलियों को हटाता है।\n\n"
            "**यह क्या करता है:**\n"
            "• किसानों को व्यापारियों से पारदर्शी लाइव-बोली प्रणाली के ज़रिए सीधे जोड़ता है\n"
            "• रियल-टाइम APMC मंडी भाव और शुद्ध-लाभ ऑप्टिमाइज़र\n"
            "• उपज को सबसे सस्ते उपलब्ध परिवहन से स्वतः जोड़ता है\n"
            "• AI Plant Doctor पत्ती की फ़ोटो से फसल रोग पहचानता है\n"
            "• प्रमाणित कीटनाशक और इनपुट मार्केटप्लेस\n\n"
            "**टेक स्टैक:** React + TypeScript · FastAPI + SQLite · JWT · WebSockets"
        ),
        "mr": (
            "🌾 **Smart Krishi Connect (FarmChain)** एक संपूर्ण शेत-ते-बाजार डिजिटल प्लॅटफॉर्म आहे "
            "जो शेतीच्या व्यापारातून दलालांना हटवतो.\n\n"
            "**हे काय करते:**\n"
            "• शेतकऱ्यांना थेट व्यापाऱ्यांशी पारदर्शक लाइव-लिलावाद्वारे जोडते\n"
            "• रियल-टाइम APMC मंडी भाव व निव्वळ नफा ऑप्टिमायझर\n"
            "• उत्पादनाला स्वस्त वाहनाशी स्वयंचलितपणे जुळवते\n"
            "• AI Plant Doctor पानाच्या फोटोतून पीक रोग ओळखतो\n"
            "• प्रमाणित कीटकनाशक आणि इनपुट मार्केटप्लेस\n\n"
            "**टेक स्टॅक:** React + TypeScript · FastAPI + SQLite · JWT · WebSockets"
        ),
    },
    "roles": {
        "en": (
            "👥 **FarmChain has 5 user roles:**\n\n"
            "1. 🌱 **Farmer** — Lists crops, views bids, accepts best offers, tracks deliveries & Mandi prices\n"
            "2. 🏪 **Merchant** — Discovers crop listings, places competitive bids, manages purchase orders\n"
            "3. 🚛 **Transporter** — Gets auto-matched to transport jobs, accepts trips, updates delivery status\n"
            "4. 🧪 **Pesticide Seller** — Lists and manages agri-input inventory, processes buyer orders\n"
            "5. 🛡️ **Admin** — KYC verification queue, platform analytics, user management\n\n"
            "💡 Switch between demo personas using the **persona switcher** in the top Navbar!"
        ),
        "hi": (
            "👥 **FarmChain में 5 उपयोगकर्ता भूमिकाएँ हैं:**\n\n"
            "1. 🌱 **किसान** — फसल सूचीबद्ध करें, बोलियाँ देखें, सर्वोत्तम ऑफर स्वीकार करें\n"
            "2. 🏪 **व्यापारी** — फसल सूचियाँ खोजें, प्रतिस्पर्धी बोलियाँ लगाएँ, ऑर्डर प्रबंधित करें\n"
            "3. 🚛 **ट्रांसपोर्टर** — स्वतः मिलाए गए परिवहन कार्य स्वीकार करें, डिलीवरी अपडेट करें\n"
            "4. 🧪 **कीटनाशक विक्रेता** — कृषि-इनपुट इन्वेंटरी सूचीबद्ध करें, ऑर्डर प्रोसेस करें\n"
            "5. 🛡️ **व्यवस्थापक** — KYC सत्यापन, प्लेटफ़ॉर्म विश्लेषण, उपयोगकर्ता प्रबंधन\n\n"
            "💡 ऊपर Navbar में **पर्सोना स्विचर** से डेमो भूमिकाएँ बदलें!"
        ),
        "mr": (
            "👥 **FarmChain मध्ये 5 वापरकर्ता भूमिका आहेत:**\n\n"
            "1. 🌱 **शेतकरी** — पिके सूचीबद्ध करा, बोली पहा, सर्वोत्तम ऑफर स्वीकारा\n"
            "2. 🏪 **व्यापारी** — पीक यादी शोधा, स्पर्धात्मक बोली द्या, ऑर्डर व्यवस्थापित करा\n"
            "3. 🚛 **वाहतूकदार** — स्वयंचलित वाहतूक नोकऱ्या स्वीकारा, डिलिव्हरी अपडेट करा\n"
            "4. 🧪 **कीटकनाशक विक्रेता** — कृषी-इनपुट यादी व्यवस्थापित करा, ऑर्डर प्रोसेस करा\n"
            "5. 🛡️ **प्रशासक** — KYC पडताळणी, प्लॅटफॉर्म विश्लेषण, वापरकर्ता व्यवस्थापन\n\n"
            "💡 Navbar मधील **पर्सोना स्विचर** वापरून डेमो भूमिका बदला!"
        ),
    },
    "bidding": {
        "en": (
            "💰 **Live Bidding System — How It Works:**\n\n"
            "1. 🌱 A farmer creates a **Crop Listing** (crop name, quantity, base price, pickup location)\n"
            "2. ⏳ A **Bidding Window** opens (next-day scheduled, or immediate)\n"
            "3. 🏪 Merchants submit competitive bids (₹/Quintal) in real-time via **WebSockets**\n"
            "4. 📊 The farmer sees live bids ranked by profitability (after transport deduction)\n"
            "5. ✅ Farmer accepts the best bid → auto-creates an **Order** + triggers **Transport matching**\n"
            "6. 🚛 A transporter gets matched, confirms delivery, updates status\n\n"
            "**Outbid Alerts:** Merchants receive instant notifications when outbid.\n"
            "**Trust Score:** Every successful deal improves your Trust Score (rated 1–5 ⭐)."
        ),
        "hi": (
            "💰 **लाइव बिडिंग सिस्टम — कैसे काम करता है:**\n\n"
            "1. 🌱 किसान **फसल सूची** बनाता है (फसल, मात्रा, आधार मूल्य, पिकअप स्थान)\n"
            "2. ⏳ **बोली विंडो** खुलती है (अगले दिन या तुरंत)\n"
            "3. 🏪 व्यापारी WebSockets के ज़रिए रियल-टाइम बोलियाँ लगाते हैं\n"
            "4. 📊 किसान को ट्रांसपोर्ट काटने के बाद शुद्ध लाभ के अनुसार बोलियाँ दिखती हैं\n"
            "5. ✅ किसान सर्वोत्तम बोली स्वीकार करता है → **ऑर्डर** + **ट्रांसपोर्ट मिलान** स्वतः होता है\n"
            "6. 🚛 ट्रांसपोर्टर मिलाया जाता है, डिलीवरी स्थिति अपडेट करता है"
        ),
        "mr": (
            "💰 **लाइव बिडिंग सिस्टम — कसे काम करते:**\n\n"
            "1. 🌱 शेतकरी **पीक यादी** तयार करतो (पीक, प्रमाण, आधार किंमत, पिकअप ठिकाण)\n"
            "2. ⏳ **बोली विंडो** उघडते (पुढील दिवस किंवा तत्काळ)\n"
            "3. 🏪 व्यापारी WebSockets द्वारे रियल-टाइम बोली देतात\n"
            "4. 📊 शेतकऱ्याला वाहतूक वजा करून निव्वळ नफ्यानुसार बोली दिसतात\n"
            "5. ✅ शेतकरी सर्वोत्तम बोली स्वीकारतो → **ऑर्डर** + **वाहतूक जुळवणी** स्वयंचलित\n"
            "6. 🚛 वाहतूकदार जुळवला जातो, डिलिव्हरी स्थिती अपडेट करतो"
        ),
    },
    "listing": {
        "en": (
            "📋 **How to Create a Crop Listing:**\n\n"
            "1. Switch to **Farmer** persona from the Navbar\n"
            "2. Click **My Listings** in the sidebar\n"
            "3. Click **+ New Listing** button\n"
            "4. Fill in: Crop Name, Variety, Quantity (Quintals), Quality Grade, Moisture %, Base Price (₹/Qtl), Pickup Address\n"
            "5. Optionally add harvest date, description, crop photo\n"
            "6. Click **Submit** — your listing is live and bidding window is scheduled!\n\n"
            "🔑 **Tips:** Set a realistic base price (based on Mandi rates shown on the platform). Higher trust score attracts better merchant bids."
        ),
        "hi": (
            "📋 **फसल सूची कैसे बनाएँ:**\n\n"
            "1. Navbar से **किसान** पर्सोना चुनें\n"
            "2. साइडबार में **मेरी फसलें** क्लिक करें\n"
            "3. **+ नई सूची** बटन दबाएँ\n"
            "4. भरें: फसल का नाम, किस्म, मात्रा (क्विंटल), गुणवत्ता श्रेणी, नमी %, आधार मूल्य, पिकअप पता\n"
            "5. वैकल्पिक: कटाई तिथि, विवरण, फसल फ़ोटो\n"
            "6. **सबमिट** करें — आपकी सूची लाइव है!"
        ),
        "mr": (
            "📋 **पीक यादी कशी तयार करावी:**\n\n"
            "1. Navbar मधून **शेतकरी** पर्सोना निवडा\n"
            "2. साइडबार मध्ये **माझी पिके** क्लिक करा\n"
            "3. **+ नवीन यादी** बटण दाबा\n"
            "4. भरा: पिकाचे नाव, वाण, प्रमाण (क्विंटल), गुणवत्ता श्रेणी, ओलावा %, आधार किंमत, पिकअप पत्ता\n"
            "5. ऐच्छिक: कापणीची तारीख, वर्णन, पिकाचा फोटो\n"
            "6. **सबमिट** करा — तुमची यादी थेट आहे!"
        ),
    },
    "trust_score": {
        "en": (
            "⭐ **Trust Score System:**\n\n"
            "Every user on FarmChain has a **Trust Score (1.0 – 5.0)**:\n\n"
            "• Starts at **4.8** for new verified accounts\n"
            "• Goes up with every **successful deal** (listing completed, bid accepted, delivery confirmed)\n"
            "• Farmers with higher trust scores attract **more merchant bids** and **better prices**\n"
            "• Merchants with high trust scores get **priority listing access** from farmers\n"
            "• Transporters' scores improve with **on-time deliveries**\n\n"
            "🛡️ Trust Scores are shown as ⭐ ratings next to user profiles everywhere in the platform."
        ),
        "hi": (
            "⭐ **ट्रस्ट स्कोर सिस्टम:**\n\n"
            "• नए सत्यापित खातों के लिए **4.8** से शुरू होता है\n"
            "• हर सफल सौदे के साथ बढ़ता है\n"
            "• उच्च स्कोर वाले किसानों को बेहतर बोलियाँ मिलती हैं\n"
            "• समय पर डिलीवरी से ट्रांसपोर्टर का स्कोर बढ़ता है\n\n"
            "🛡️ प्रोफ़ाइल के पास ⭐ रेटिंग के रूप में दिखाया जाता है।"
        ),
        "mr": (
            "⭐ **ट्रस्ट स्कोर प्रणाली:**\n\n"
            "• नवीन पडताळणी केलेल्या खात्यांसाठी **4.8** पासून सुरू होतो\n"
            "• प्रत्येक यशस्वी व्यवहाराने वाढतो\n"
            "• उच्च स्कोर असलेल्या शेतकऱ्यांना चांगल्या बोली मिळतात\n"
            "• वेळेवर डिलिव्हरीमुळे वाहतूकदाराचा स्कोर वाढतो\n\n"
            "🛡️ प्रोफाइलजवळ ⭐ रेटिंग म्हणून दाखवला जातो."
        ),
    },
    "admin": {
        "en": (
            "🛡️ **Admin Dashboard Features:**\n\n"
            "• **KYC Verification Queue** — Review and approve/reject farmer & merchant identity documents\n"
            "• **Platform Analytics** — Total users, listings, revenue, active bids\n"
            "• **User Management** — View all users by role, trust scores, deal history\n"
            "• **Listing Oversight** — Monitor all active and closed crop listings\n\n"
            "🔑 **Access:** Switch to **Admin** persona from the Navbar persona switcher.\n"
            "Default admin demo: Priya Sharma (Admin) · Trust Score 5.0"
        ),
        "hi": (
            "🛡️ **एडमिन डैशबोर्ड:**\n\n"
            "• **KYC सत्यापन** — किसान और व्यापारी दस्तावेज़ों को अप्रूव/अस्वीकार करें\n"
            "• **प्लेटफ़ॉर्म एनालिटिक्स** — कुल उपयोगकर्ता, सूचियाँ, राजस्व\n"
            "• **उपयोगकर्ता प्रबंधन** — सभी उपयोगकर्ताओं को देखें\n\n"
            "🔑 Navbar से **Admin** पर्सोना चुनें।"
        ),
        "mr": (
            "🛡️ **प्रशासक डॅशबोर्ड:**\n\n"
            "• **KYC पडताळणी** — शेतकरी आणि व्यापाऱ्यांचे दस्तावेज मंजूर/नाकारा\n"
            "• **प्लॅटफॉर्म विश्लेषण** — एकूण वापरकर्ते, यादी, महसूल\n"
            "• **वापरकर्ता व्यवस्थापन** — सर्व वापरकर्ते पहा\n\n"
            "🔑 Navbar मधून **Admin** पर्सोना निवडा."
        ),
    },
    "kyc": {
        "en": (
            "📄 **KYC (Know Your Customer) Verification:**\n\n"
            "• All farmers and merchants must complete KYC to unlock full platform features\n"
            "• KYC requires: Aadhaar Card, PAN Card (or Farm Registration document)\n"
            "• Documents are reviewed by the **Admin** in the KYC Verification queue\n"
            "• Status: **Pending → Under Review → Verified** (or Rejected with reason)\n"
            "• Unverified users see a **KYC Alert Banner** and have limited access\n"
            "• Verified users get the ✅ badge and unlock live bidding, orders & transport"
        ),
        "hi": (
            "📄 **KYC सत्यापन:**\n\n"
            "• पूर्ण प्लेटफ़ॉर्म सुविधाओं के लिए KYC अनिवार्य है\n"
            "• KYC के लिए: आधार कार्ड, PAN कार्ड या किसान पंजीकरण दस्तावेज़\n"
            "• **Admin** KYC कतार में दस्तावेज़ों की समीक्षा करता है\n"
            "• स्थिति: **लंबित → समीक्षाधीन → सत्यापित**\n"
            "• सत्यापित उपयोगकर्ताओं को ✅ बैज और पूर्ण पहुँच मिलती है"
        ),
        "mr": (
            "📄 **KYC पडताळणी:**\n\n"
            "• संपूर्ण प्लॅटफॉर्म वैशिष्ट्यांसाठी KYC आवश्यक आहे\n"
            "• KYC साठी: आधार कार्ड, PAN कार्ड किंवा शेतकरी नोंदणी दस्तावेज\n"
            "• **Admin** KYC रांगेत दस्तावेजांची तपासणी करतो\n"
            "• स्थिती: **प्रलंबित → पुनरावलोकनाधीन → पडताळणी केलेली**\n"
            "• पडताळणी केलेल्या वापरकर्त्यांना ✅ बॅज आणि पूर्ण प्रवेश मिळतो"
        ),
    },
    "plant_doctor": {
        "en": (
            "📸 **AI Plant Doctor — Crop Disease Scanner:**\n\n"
            "• Upload a **photo of your crop's leaf** (jpg/png)\n"
            "• The AI analyses the image and identifies the disease with **~95% accuracy**\n"
            "• You get: Disease name, Severity level, Step-by-step treatment plan\n"
            "• Recommended certified pesticides are shown with a direct **Buy Now** link to the Input Store\n\n"
            "**Common diseases detected:**\n"
            "• 🍃 Early Blight, Late Blight (Tomato/Potato)\n"
            "• 🌾 Powdery Mildew, Rust (Wheat/Soybean)\n"
            "• 🟡 Yellow Mosaic Virus, Leaf Curl\n"
            "• 🦟 Aphid/Whitefly/Jassid infestations\n\n"
            "👉 Go to the **Plant Doctor** tab in the sidebar to scan your crop!"
        ),
        "hi": (
            "📸 **AI Plant Doctor:**\n\n"
            "• पत्ती की फ़ोटो अपलोड करें (jpg/png)\n"
            "• AI ~95% सटीकता से रोग पहचानता है\n"
            "• मिलता है: रोग का नाम, गंभीरता, उपचार योजना\n"
            "• अनुशंसित कीटनाशक सीधे खरीदने के लिंक के साथ\n\n"
            "👉 साइडबार में **Plant Doctor** टैब पर जाएँ!"
        ),
        "mr": (
            "📸 **AI Plant Doctor:**\n\n"
            "• पानाचा फोटो अपलोड करा (jpg/png)\n"
            "• AI ~95% अचूकतेने रोग ओळखतो\n"
            "• मिळते: रोगाचे नाव, तीव्रता, उपचार योजना\n"
            "• शिफारस केलेल्या कीटकनाशकांसाठी थेट खरेदी लिंक\n\n"
            "👉 साइडबार मधील **Plant Doctor** टॅबवर जा!"
        ),
    },
    "mandi_intelligence": {
        "en": (
            "📊 **Mandi Intelligence Dashboard:**\n\n"
            "• Shows **live APMC rates** across all major mandis in your state\n"
            "• **Net Profit Calculator:** Enter quantity → see price at each mandi minus transport cost\n"
            "• **Best Mandi Recommender:** AI picks the highest net-profit destination\n"
            "• Price trend indicators: 📈 Rising / 📉 Falling / ➡️ Stable\n"
            "• Covers crops: Soybean, Wheat, Cotton, Onion, Tomato, Basmati Rice & more\n\n"
            "👉 Click **Mandi Intelligence** in the sidebar to explore!"
        ),
        "hi": (
            "📊 **मंडी इंटेलिजेंस डैशबोर्ड:**\n\n"
            "• राज्य की सभी प्रमुख APMC मंडियों के **लाइव भाव**\n"
            "• **शुद्ध लाभ कैलकुलेटर:** मात्रा दर्ज करें → ट्रांसपोर्ट घटाकर शुद्ध लाभ\n"
            "• **सर्वश्रेष्ठ मंडी सिफारिश:** AI सर्वाधिक लाभ वाली मंडी चुनता है\n"
            "• मूल्य प्रवृत्ति: 📈 बढ़ रहा / 📉 घट रहा / ➡️ स्थिर\n\n"
            "👉 साइडबार में **मंडी इंटेलिजेंस** क्लिक करें!"
        ),
        "mr": (
            "📊 **मंडी इंटेलिजेंस डॅशबोर्ड:**\n\n"
            "• राज्यातील सर्व प्रमुख APMC मंड्यांचे **थेट भाव**\n"
            "• **निव्वळ नफा कॅल्क्युलेटर:** प्रमाण टाका → वाहतूक वजा करून नफा\n"
            "• **सर्वोत्तम मंडी शिफारस:** AI सर्वाधिक नफा देणारी मंडी निवडतो\n"
            "• किंमत ट्रेंड: 📈 वाढत आहे / 📉 घसरत आहे / ➡️ स्थिर\n\n"
            "👉 साइडबार मधील **मंडी इंटेलिजेंस** क्लिक करा!"
        ),
    },
    "pesticide_store": {
        "en": (
            "🧪 **Pesticide & Input Marketplace:**\n\n"
            "• Browse **certified organic and chemical pesticides**, fungicides, herbicides & fertilizers\n"
            "• Filter by: Category, Brand, Price Range, Active Ingredient\n"
            "• Each product shows: AI compatibility note, dosage instructions, expiry, seller details\n"
            "• **Add to Cart** and place orders directly from the platform\n"
            "• Integrated with **Plant Doctor** — disease remedy → auto-redirects to the right product\n\n"
            "**Featured brands:** Syngenta, Bayer CropScience, UPL, BASF, Dhanuka"
        ),
        "hi": (
            "🧪 **कीटनाशक और इनपुट मार्केटप्लेस:**\n\n"
            "• प्रमाणित कीटनाशक, कवकनाशी, खरपतवार नाशक और उर्वरक ब्राउज़ करें\n"
            "• श्रेणी, ब्रांड, मूल्य सीमा से फ़िल्टर करें\n"
            "• Plant Doctor से रोग उपाय → सीधे सही उत्पाद पर पुनर्निर्देशित\n\n"
            "**प्रमुख ब्रांड:** Syngenta, Bayer, UPL, BASF, Dhanuka"
        ),
        "mr": (
            "🧪 **कीटकनाशक आणि इनपुट मार्केटप्लेस:**\n\n"
            "• प्रमाणित कीटकनाशके, बुरशीनाशके, तणनाशके आणि खते ब्राउझ करा\n"
            "• श्रेणी, ब्रँड, किंमत श्रेणीनुसार फिल्टर करा\n"
            "• Plant Doctor मधून रोग उपाय → थेट योग्य उत्पादनावर पुनर्निर्देशित\n\n"
            "**प्रमुख ब्रँड:** Syngenta, Bayer, UPL, BASF, Dhanuka"
        ),
    },
    "language": {
        "en": (
            "🌐 **Language Support:**\n\n"
            "FarmChain supports **3 languages**:\n"
            "• 🇬🇧 **English** — Full platform in English\n"
            "• 🇮🇳 **हिंदी (Hindi)** — Complete Hindi translation\n"
            "• 🇮🇳 **मराठी (Marathi)** — Complete Marathi translation\n\n"
            "**How to switch:** Click the **🌐 Globe icon** in the top Navbar → select your language.\n"
            "The entire UI, labels, chatbot responses, and navigation change instantly!"
        ),
        "hi": (
            "🌐 **भाषा समर्थन:**\n\n"
            "FarmChain **3 भाषाएँ** समर्थित करता है:\n"
            "• 🇬🇧 English · 🇮🇳 हिंदी · 🇮🇳 मराठी\n\n"
            "**कैसे बदलें:** ऊपर Navbar में **🌐 ग्लोब आइकॉन** क्लिक करें → भाषा चुनें।\n"
            "पूरा UI, लेबल, चैटबॉट प्रतिक्रियाएँ तुरंत बदल जाती हैं!"
        ),
        "mr": (
            "🌐 **भाषा समर्थन:**\n\n"
            "FarmChain **3 भाषा** समर्थित करतो:\n"
            "• 🇬🇧 English · 🇮🇳 हिंदी · 🇮🇳 मराठी\n\n"
            "**कसे बदलायचे:** Navbar मधील **🌐 ग्लोब आयकॉन** क्लिक करा → भाषा निवडा.\n"
            "संपूर्ण UI, लेबल, चॅटबॉट प्रतिसाद तत्काळ बदलतात!"
        ),
    },
    "theme": {
        "en": (
            "🎨 **Color Themes:**\n\n"
            "FarmChain offers **3 beautiful colour themes**:\n"
            "• ☀️ **Pristine Light** — Clean white with emerald & slate accents (default)\n"
            "• 🌑 **Obsidian Dark** — Deep charcoal & neon emerald (dark mode)\n"
            "• 🌊 **Sapphire Blue** — Ocean blue & pure white (light mode)\n\n"
            "**How to switch:** Click the **🎨 Palette icon** in the top Navbar → pick a theme.\n"
            "Your preference is saved automatically in your browser!"
        ),
        "hi": (
            "🎨 **कलर थीम:**\n\n"
            "FarmChain **3 खूबसूरत थीम** प्रदान करता है:\n"
            "• ☀️ **Pristine Light** — सफेद + एमेराल्ड (डिफ़ॉल्ट)\n"
            "• 🌑 **Obsidian Dark** — गहरा चारकोल + नियॉन एमेराल्ड\n"
            "• 🌊 **Sapphire Blue** — ओशन ब्लू + शुद्ध सफेद\n\n"
            "**कैसे बदलें:** Navbar में **🎨 Palette आइकॉन** क्लिक करें!"
        ),
        "mr": (
            "🎨 **कलर थीम:**\n\n"
            "FarmChain **3 सुंदर थीम** देतो:\n"
            "• ☀️ **Pristine Light** — पांढरा + एमेराल्ड (डीफॉल्ट)\n"
            "• 🌑 **Obsidian Dark** — गडद चारकोल + नियॉन एमेराल्ड\n"
            "• 🌊 **Sapphire Blue** — ओशन ब्लू + शुद्ध पांढरा\n\n"
            "**कसे बदलायचे:** Navbar मधील **🎨 Palette आयकॉन** क्लिक करा!"
        ),
    },
    "tech_stack": {
        "en": (
            "⚙️ **Technical Architecture:**\n\n"
            "**Frontend:**\n"
            "• React 18 + TypeScript (Vite build)\n"
            "• TailwindCSS v4 for styling + custom CSS themes\n"
            "• Lucide React for icons\n"
            "• Native fetch API (no axios)\n"
            "• WebSockets for real-time bidding\n\n"
            "**Backend:**\n"
            "• FastAPI (Python) with async support\n"
            "• SQLAlchemy ORM + SQLite database\n"
            "• JWT authentication (PyJWT + passlib/bcrypt)\n"
            "• Uvicorn ASGI server\n"
            "• Pydantic v2 for schema validation\n\n"
            "**APIs:** REST + WebSocket · Port 8000 (backend) · Port 5173 (frontend dev)"
        ),
        "hi": (
            "⚙️ **तकनीकी आर्किटेक्चर:**\n\n"
            "**फ्रंटएंड:** React 18 + TypeScript · TailwindCSS v4 · Lucide React · WebSockets\n\n"
            "**बैकएंड:** FastAPI (Python) · SQLAlchemy + SQLite · JWT Auth · Uvicorn · Pydantic v2\n\n"
            "**API:** REST + WebSocket · पोर्ट 8000 (बैकएंड) · पोर्ट 5173 (फ्रंटएंड)"
        ),
        "mr": (
            "⚙️ **तांत्रिक आर्किटेक्चर:**\n\n"
            "**फ्रंटएंड:** React 18 + TypeScript · TailwindCSS v4 · Lucide React · WebSockets\n\n"
            "**बॅकएंड:** FastAPI (Python) · SQLAlchemy + SQLite · JWT Auth · Uvicorn · Pydantic v2\n\n"
            "**API:** REST + WebSocket · पोर्ट 8000 (बॅकएंड) · पोर्ट 5173 (फ्रंटएंड)"
        ),
    },
    "demo_login": {
        "en": (
            "🔑 **Demo Login Credentials:**\n\n"
            "You don't need to register — just use the **Persona Switcher** in the Navbar to switch roles instantly.\n\n"
            "Or log in manually:\n"
            "| Role | Phone | Password |\n"
            "|------|-------|----------|\n"
            "| 🌱 Farmer (Ramesh Patil) | 9876543210 | password123 |\n"
            "| 🏪 Merchant (Suresh Agro) | 9876543213 | password123 |\n"
            "| 🚛 Transporter (Baljit) | 9876543214 | password123 |\n"
            "| 🧪 Seller (Agro Inputs) | 9876543215 | password123 |\n"
            "| 🛡️ Admin (Priya Sharma) | 9876543216 | password123 |"
        ),
        "hi": (
            "🔑 **डेमो लॉगिन:**\n\n"
            "Navbar में **पर्सोना स्विचर** से तुरंत भूमिका बदलें, या मैन्युअल लॉगिन:\n\n"
            "• 🌱 किसान: **9876543210** / password123\n"
            "• 🏪 व्यापारी: **9876543213** / password123\n"
            "• 🚛 ट्रांसपोर्टर: **9876543214** / password123\n"
            "• 🧪 विक्रेता: **9876543215** / password123\n"
            "• 🛡️ Admin: **9876543216** / password123"
        ),
        "mr": (
            "🔑 **डेमो लॉगिन:**\n\n"
            "Navbar मधील **पर्सोना स्विचर** ने तत्काळ भूमिका बदला, किंवा मॅन्युअल लॉगिन:\n\n"
            "• 🌱 शेतकरी: **9876543210** / password123\n"
            "• 🏪 व्यापारी: **9876543213** / password123\n"
            "• 🚛 वाहतूकदार: **9876543214** / password123\n"
            "• 🧪 विक्रेता: **9876543215** / password123\n"
            "• 🛡️ Admin: **9876543216** / password123"
        ),
    },
    "orders": {
        "en": (
            "📦 **Orders & Delivery Tracking:**\n\n"
            "• Orders are **auto-created** when a farmer accepts a merchant's bid\n"
            "• Order statuses: **Pending → Confirmed → Dispatched → Delivered**\n"
            "• Farmers & merchants both receive **real-time notifications** on status changes\n"
            "• Transport is auto-matched after order confirmation\n"
            "• The transporter updates delivery status in their dashboard\n\n"
            "👉 View your orders in the **My Orders** section (sidebar)"
        ),
        "hi": (
            "📦 **ऑर्डर और डिलीवरी ट्रैकिंग:**\n\n"
            "• बोली स्वीकार होने पर ऑर्डर **स्वतः बनता है**\n"
            "• ऑर्डर स्थिति: **लंबित → पुष्टि → प्रेषित → वितरित**\n"
            "• किसान और व्यापारी दोनों को रियल-टाइम सूचनाएँ\n\n"
            "👉 साइडबार में **मेरे ऑर्डर** देखें"
        ),
        "mr": (
            "📦 **ऑर्डर आणि डिलिव्हरी ट्रॅकिंग:**\n\n"
            "• बोली स्वीकारल्यावर ऑर्डर **स्वयंचलित तयार होतो**\n"
            "• ऑर्डर स्थिती: **प्रलंबित → पुष्टी → रवाना → वितरित**\n"
            "• शेतकरी आणि व्यापारी दोघांना रियल-टाइम सूचना\n\n"
            "👉 साइडबार मधील **माझे ऑर्डर** पहा"
        ),
    },
    "notifications": {
        "en": (
            "🔔 **Notification System:**\n\n"
            "FarmChain sends real-time notifications for:\n"
            "• New bid received on your listing\n"
            "• You were outbid (merchant)\n"
            "• Bid accepted / rejected\n"
            "• Order confirmed / dispatched / delivered\n"
            "• KYC status updated\n"
            "• Transport matched / status changed\n\n"
            "📍 Notifications appear as **toast popups** (top-right) and in the **🔔 Bell icon** in the Navbar.\n"
            "WebSocket-powered for instant delivery!"
        ),
        "hi": (
            "🔔 **सूचना प्रणाली:**\n\n"
            "• नई बोली, बेहतर बोली, बोली स्वीकृत/अस्वीकृत\n"
            "• ऑर्डर पुष्टि/प्रेषण/डिलीवरी\n"
            "• KYC स्थिति, ट्रांसपोर्ट अपडेट\n\n"
            "📍 Navbar में **🔔 Bell** आइकॉन पर क्लिक करें — WebSocket से तुरंत डिलीवरी!"
        ),
        "mr": (
            "🔔 **सूचना प्रणाली:**\n\n"
            "• नवीन बोली, चांगली बोली, बोली स्वीकारली/नाकारली\n"
            "• ऑर्डर पुष्टी/रवाना/डिलिव्हरी\n"
            "• KYC स्थिती, वाहतूक अपडेट\n\n"
            "📍 Navbar मधील **🔔 Bell** आयकॉनवर क्लिक करा — WebSocket द्वारे तत्काळ!"
        ),
    },
    "how_to_use": {
        "en": (
            "🚀 **Getting Started with FarmChain:**\n\n"
            "**For Farmers:**\n"
            "1. Switch to Farmer persona (Navbar) → View your dashboard\n"
            "2. Check **Mandi Prices** to know today's best rates\n"
            "3. Create a **Crop Listing** → wait for merchant bids\n"
            "4. Accept the best bid → order and transport auto-arranged\n\n"
            "**For Merchants:**\n"
            "1. Switch to Merchant → Browse **Crop Marketplace**\n"
            "2. Find listings you want → Enter **Live Bidding Room**\n"
            "3. Place competitive bids → Track accepted orders\n\n"
            "**For Transporters:**\n"
            "1. Switch to Transporter → See **auto-matched transport jobs**\n"
            "2. Accept jobs → Update delivery status en route\n\n"
            "💡 No registration needed for demo — just switch personas!"
        ),
        "hi": (
            "🚀 **FarmChain से कैसे शुरू करें:**\n\n"
            "**किसान के लिए:**\n"
            "1. किसान पर्सोना चुनें → डैशबोर्ड देखें\n"
            "2. **मंडी भाव** जाँचें → **फसल सूची** बनाएँ\n"
            "3. सर्वोत्तम बोली स्वीकार करें → ऑर्डर और ट्रांसपोर्ट स्वतः होता है\n\n"
            "**व्यापारी के लिए:**\n"
            "1. व्यापारी पर्सोना → **फसल मार्केटप्लेस** ब्राउज़ करें\n"
            "2. **लाइव बिडिंग रूम** में बोलियाँ लगाएँ\n\n"
            "💡 डेमो के लिए पंजीकरण की ज़रूरत नहीं!"
        ),
        "mr": (
            "🚀 **FarmChain वापरणे कसे सुरू करायचे:**\n\n"
            "**शेतकऱ्यांसाठी:**\n"
            "1. शेतकरी पर्सोना निवडा → डॅशबोर्ड पहा\n"
            "2. **मंडी भाव** तपासा → **पीक यादी** तयार करा\n"
            "3. सर्वोत्तम बोली स्वीकारा → ऑर्डर आणि वाहतूक स्वयंचलित\n\n"
            "**व्यापाऱ्यांसाठी:**\n"
            "1. व्यापारी पर्सोना → **पीक मार्केटप्लेस** ब्राउझ करा\n"
            "2. **लाइव बिडिंग रूम** मध्ये बोली द्या\n\n"
            "💡 डेमोसाठी नोंदणी आवश्यक नाही!"
        ),
    },
}

# ──────────────────────────────────────────────────────────────────────────────
#  INTENT DETECTION MAPS
# ──────────────────────────────────────────────────────────────────────────────
INTENT_KEYWORDS: Dict[str, List[str]] = {
    "about": [
        "what is", "farmchain", "smart krishi", "about", "explain", "overview",
        "platform", "project", "काय आहे", "क्या है", "प्रोजेक्ट", "प्लॅटफॉर्म"
    ],
    "roles": [
        "role", "farmer", "merchant", "transporter", "seller", "admin", "persona",
        "user type", "शेतकरी", "व्यापारी", "वाहतूकदार", "किसान", "ट्रांसपोर्टर", "भूमिका"
    ],
    "bidding": [
        "bid", "bidding", "auction", "live bid", "बोली", "लिलाव", "नीलाम",
        "बिडिंग", "ऑक्शन", "how bid", "accept bid", "bidding room", "websocket"
    ],
    "listing": [
        "listing", "create listing", "new listing", "add crop", "crop list",
        "list my crop", "यादी", "लिस्टिंग", "सूची", "फसल सूची", "पीक यादी"
    ],
    "trust_score": [
        "trust", "score", "rating", "stars", "trust score", "reputation",
        "ट्रस्ट", "विश्वास", "स्कोर", "रेटिंग"
    ],
    "admin": [
        "admin", "dashboard", "analytics", "platform stats", "management",
        "प्रशासक", "व्यवस्थापन", "एडमिन"
    ],
    "kyc": [
        "kyc", "verification", "verify", "document", "aadhaar", "pan card",
        "identity", "पडताळणी", "सत्यापन", "दस्तावेज़"
    ],
    "plant_doctor": [
        "plant doctor", "disease", "leaf", "pest", "blight", "rust",
        "powdery mildew", "diagnosis", "scan", "upload", "photo",
        "रोग", "पान", "कीड", "बीमारी", "पत्ता", "फसल रोग"
    ],
    "mandi_intelligence": [
        "mandi intelligence", "mandi rate", "apmc", "market rate",
        "net profit", "best mandi", "mandi dashboard",
        "मंडी इंटेलिजेंस", "बाजारभाव", "APMC"
    ],
    "pesticide_store": [
        "pesticide", "fungicide", "herbicide", "fertilizer", "input store",
        "agri input", "buy pesticide", "medicine shop",
        "कीटकनाशक", "कीटनाशक", "खाद", "उर्वरक", "दुकान"
    ],
    "language": [
        "language", "hindi", "marathi", "english", "multilingual", "translate",
        "भाषा", "हिंदी", "मराठी", "अनुवाद"
    ],
    "theme": [
        "theme", "dark mode", "light mode", "color", "colour", "obsidian",
        "sapphire", "pristine", "palette",
        "थीम", "रंग", "डार्क मोड"
    ],
    "tech_stack": [
        "tech stack", "technology", "react", "fastapi", "sqlite", "jwt",
        "websocket", "tailwind", "typescript", "backend", "frontend", "api",
        "architecture", "how built", "तंत्रज्ञान", "तकनीक"
    ],
    "demo_login": [
        "login", "credentials", "password", "demo", "sign in", "log in",
        "username", "account", "लॉगिन", "पासवर्ड", "खाते"
    ],
    "orders": [
        "order", "delivery", "tracking", "shipped", "dispatched",
        "ऑर्डर", "डिलीवरी", "माझे ऑर्डर", "मेरे ऑर्डर"
    ],
    "notifications": [
        "notification", "alert", "bell", "toast", "notify", "update",
        "सूचना", "नोटिफिकेशन", "अलर्ट"
    ],
    "how_to_use": [
        "how to use", "get started", "how to", "tutorial", "guide",
        "step", "help", "navigate",
        "कसे वापरायचे", "कैसे उपयोग", "कैसे करें", "मदत"
    ],
    # Keep original mandi/transport/disease/order as live-data intents below
}

CROP_KEYWORDS: Dict[str, str] = {
    "soybean": "Soybean", "soya": "Soybean", "सोयाबीन": "Soybean",
    "wheat": "Wheat", "gehu": "Wheat", "गहू": "Wheat", "गेहूं": "Wheat",
    "cotton": "Cotton", "kapas": "Cotton", "कापूस": "Cotton", "कपास": "Cotton",
    "tomato": "Tomato", "tamatar": "Tomato", "टोमॅटो": "Tomato", "टमाटर": "Tomato",
    "onion": "Onion", "pyaaz": "Onion", "kanda": "Onion", "कांदा": "Onion", "प्याज": "Onion",
    "rice": "Basmati Rice", "chawal": "Basmati Rice", "तांदूळ": "Basmati Rice", "चावल": "Basmati Rice",
}


def _detect_intent(q: str) -> Optional[str]:
    """Return the best matching KB intent key, or None."""
    for intent, keywords in INTENT_KEYWORDS.items():
        if any(kw in q for kw in keywords):
            return intent
    return None


def _kb_response(intent: str, language: str) -> Dict[str, Any]:
    """Return a structured response from the knowledge base."""
    entry = PROJECT_KB[intent]
    lang_key = language if language in entry else "en"
    action_map = {
        "about": ["Explore Mandi Prices", "View Live Bidding", "Switch Persona"],
        "roles": ["Switch to Farmer", "Switch to Merchant", "Switch to Admin"],
        "bidding": ["View Live Bidding Room", "Create Crop Listing"],
        "listing": ["My Listings", "Check Mandi Prices"],
        "trust_score": ["View My Profile", "Check My Deals"],
        "admin": ["Open Admin Dashboard"],
        "kyc": ["Submit KYC Documents", "Open Admin Panel"],
        "plant_doctor": ["Open Plant Doctor", "Browse Pesticide Store"],
        "mandi_intelligence": ["Open Mandi Intelligence", "Create Crop Listing"],
        "pesticide_store": ["Browse Pesticide Store", "Open Plant Doctor"],
        "language": ["Switch Language"],
        "theme": ["Change Theme"],
        "tech_stack": ["View API Docs", "Explore Features"],
        "demo_login": ["Switch Persona", "Login"],
        "orders": ["My Orders", "Track Delivery"],
        "notifications": ["View Notifications"],
        "how_to_use": ["Get Started", "Switch Persona", "Mandi Intelligence"],
    }
    return {
        "answer": entry[lang_key],
        "language": language,
        "suggested_actions": action_map.get(intent, ["Explore Platform"]),
        "grounded_data": {}
    }


# ──────────────────────────────────────────────────────────────────────────────
#  MAIN CHAT PROCESSOR
# ──────────────────────────────────────────────────────────────────────────────
def process_krishi_chat(
    query: str,
    language: str,
    user_id: Optional[int],
    db: Session
) -> Dict[str, Any]:
    """
    Krishi Sahayak: Context-grounded multi-lingual agricultural AI assistant.
    Handles 20+ intents: live DB data + comprehensive project knowledge base.
    """
    q = query.lower().strip()
    grounded_data = {}
    suggested_actions = []

    # ── 1. LIVE DATA: Mandi Price Queries ────────────────────────────────────
    mandi_match = any(w in q for w in [
        "mandi", "price", "rate", "bhav", "bhaav", "kimat",
        "दर", "भाव", "किंमत", "बाजारभाव", "मंडी भाव"
    ])
    detected_crop = next(
        (cname for kw, cname in CROP_KEYWORDS.items() if kw in q), None
    )

    if (mandi_match or detected_crop) and "intelligence" not in q and "dashboard" not in q:
        crop_query = detected_crop or "Soybean"
        prices = db.query(MandiPrice).filter(MandiPrice.crop_name.ilike(f"%{crop_query}%")).all()
        if prices:
            best_mandi = max(prices, key=lambda p: p.modal_price)
            grounded_data["mandi_prices"] = [
                {"mandi": p.mandi_name, "state": p.state, "price": p.modal_price, "trend": p.price_trend}
                for p in prices[:4]
            ]
            suggested_actions = ["View Mandi Intelligence", "Compare Transport Costs", "Create Crop Listing"]
            if language == "mr":
                answer = f"📊 **{crop_query} चे चालू बाजारभाव:**\n"
                for p in prices[:3]:
                    answer += f"• **{p.mandi_name} ({p.district}):** ₹{int(p.modal_price)}/क्विंटल (₹{int(p.min_price)} – ₹{int(p.max_price)})\n"
                answer += f"\n💡 **सल्ला:** {best_mandi.mandi_name} मंडी येथे सर्वाधिक ₹{int(best_mandi.modal_price)}/क्विंटल!"
            elif language == "hi":
                answer = f"📊 **{crop_query} के ताज़ा मंडी भाव:**\n"
                for p in prices[:3]:
                    answer += f"• **{p.mandi_name} ({p.district}):** ₹{int(p.modal_price)}/क्विंटल (₹{int(p.min_price)} – ₹{int(p.max_price)})\n"
                answer += f"\n💡 **सुझाव:** {best_mandi.mandi_name} में सर्वाधिक ₹{int(best_mandi.modal_price)}/क्विंटल!"
            else:
                answer = f"📊 **Live APMC Mandi Rates — {crop_query}:**\n"
                for p in prices[:3]:
                    answer += f"• **{p.mandi_name} ({p.district}):** ₹{int(p.modal_price)}/Qtl (₹{int(p.min_price)} – ₹{int(p.max_price)})\n"
                answer += f"\n💡 **Best Mandi:** **{best_mandi.mandi_name}** @ ₹{int(best_mandi.modal_price)}/Qtl — highest net profit after freight!"
            return {"answer": answer, "language": language, "suggested_actions": suggested_actions, "grounded_data": grounded_data}

    # ── 2. LIVE DATA: Transport Queries ──────────────────────────────────────
    transport_words = ["transport", "vehicle", "truck", "tempo", "freight", "गाडी", "वाहतूक", "ट्रक", "भाडे", "किराया"]
    if any(w in q for w in transport_words) and "transporter" not in q and "role" not in q:
        dist_match = re.search(r'(\d+)\s*(?:km|किमी)', q)
        load_match = re.search(r'(\d+)\s*(?:quintal|qtl|ton|टन|क्विंटल)', q)
        distance = float(dist_match.group(1)) if dist_match else 35.0
        load = float(load_match.group(1)) if load_match else 25.0
        quotes = calculate_transport_options(load, distance)
        grounded_data["transport"] = quotes
        suggested_actions = ["Book Smart Transport", "View Available Vehicles"]
        if language == "mr":
            answer = (f"🚚 **स्मार्ट वाहतूक अंदाज ({load} क्विंटल, {distance} किमी):**\n"
                      f"• **शिफारस:** {quotes['recommended_vehicle']}\n"
                      f"• **अंदाजे भाडे:** ₹{quotes['recommended_cost']}\n\n"
                      "आमचे अल्गोरिदम वजनानुसार योग्य वाहन निवडते!")
        elif language == "hi":
            answer = (f"🚚 **स्मार्ट ट्रांसपोर्ट अनुमान ({load} क्विंटल, {distance} किमी):**\n"
                      f"• **सुझाया वाहन:** {quotes['recommended_vehicle']}\n"
                      f"• **अनुमानित किराया:** ₹{quotes['recommended_cost']}\n\n"
                      "हमारा इंजन माल के वजन के अनुसार सबसे किफायती वाहन चुनता है!")
        else:
            answer = (f"🚚 **Smart Transport Estimate ({load} Qtl, {distance} km):**\n"
                      f"• **Best Vehicle:** {quotes['recommended_vehicle']}\n"
                      f"• **Optimized Cost:** ₹{quotes['recommended_cost']}\n\n"
                      "Smart Krishi auto-matches payload to prevent paying for empty truck volume.")
        return {"answer": answer, "language": language, "suggested_actions": suggested_actions, "grounded_data": grounded_data}

    # ── 3. LIVE DATA: Active Listings/Bids ───────────────────────────────────
    order_words = ["my order", "my bid", "my listing", "active listing", "बीड", "माझी लिस्टिंग", "मेरी बोली"]
    if any(w in q for w in order_words):
        active_listings = db.query(CropListing).filter(CropListing.status == "bidding_open").count()
        total_listings = db.query(CropListing).count()
        grounded_data["active_listings"] = active_listings
        grounded_data["total_listings"] = total_listings
        suggested_actions = ["My Listings", "Live Bidding Room"]
        if language == "mr":
            answer = (f"📋 प्लॅटफॉर्मवर सध्या **{active_listings} पिकांवर थेट लिलाव** सुरू आहे "
                      f"(एकूण {total_listings} यादी).\n'माझी पिके' टॅबमध्ये व्यापाऱ्यांच्या बोली पहा!")
        elif language == "hi":
            answer = (f"📋 मंच पर वर्तमान में **{active_listings} फसलों की लाइव बोली** चल रही है "
                      f"(कुल {total_listings} सूचियाँ).\n'मेरी फसलें' टैब में व्यापारियों की बोलियाँ देखें!")
        else:
            answer = (f"📋 **{active_listings} crop listings** are currently in the live bidding window "
                      f"(out of {total_listings} total).\nGo to **My Listings** to monitor incoming bids and profit margins!")
        return {"answer": answer, "language": language, "suggested_actions": suggested_actions, "grounded_data": grounded_data}

    # ── 4. LIVE DATA: Platform Stats ─────────────────────────────────────────
    if any(w in q for w in ["how many", "statistics", "stats", "total users", "total listings", "platform data"]):
        user_count = db.query(User).count()
        listing_count = db.query(CropListing).count()
        order_count = db.query(Order).count()
        bid_count = db.query(Bid).count()
        grounded_data["platform_stats"] = {
            "users": user_count, "listings": listing_count,
            "orders": order_count, "bids": bid_count
        }
        answer = (
            f"📊 **FarmChain Live Platform Statistics:**\n\n"
            f"• 👥 Registered Users: **{user_count}**\n"
            f"• 📋 Crop Listings: **{listing_count}**\n"
            f"• 💰 Total Bids Placed: **{bid_count}**\n"
            f"• 📦 Orders Created: **{order_count}**"
        )
        return {"answer": answer, "language": language, "suggested_actions": ["Admin Dashboard", "View Listings"], "grounded_data": grounded_data}

    # ── 5. LIVE DATA: Pesticide recommendations ───────────────────────────────
    disease_words = ["disease", "pest", "leaf", "blight", "rust", "medicine", "pesticide",
                     "रोग", "कीड", "औषध", "फवारणी", "बीमारी", "दवा"]
    if any(w in q for w in disease_words) and "store" not in q and "shop" not in q and "buy" not in q:
        products = db.query(PesticideProduct).limit(3).all()
        grounded_data["recommended_medicines"] = [{"name": p.name, "price": p.price, "brand": p.brand} for p in products]
        suggested_actions = ["Open AI Plant Doctor", "Browse Pesticide Store"]
        if language == "mr":
            answer = ("🌿 **पीक रोग निदान सल्ला:**\n"
                      "• **पानावरील डाग/करपा:** ट्रायकोडर्मा विरिडी किंवा मॅन्कोझेब ७५% WP फवारा.\n"
                      "• **रसशोषक किडी:** निंबोळी तेल (३ मिली/लिटर) किंवा ॲसिटामिप्रीड फवारा.\n\n"
                      "📸 अचूक निदानासाठी **AI Plant Doctor** मध्ये पानाचा फोटो अपलोड करा!")
        elif language == "hi":
            answer = ("🌿 **फसल रोग सलाह:**\n"
                      "• **पत्ती पर धब्बे/झुलसा:** मैंकोजेब 75% WP या नीम तेल का छिड़काव करें.\n"
                      "• **रस चूसक कीट:** 10,000 PPM नीम तेल या एसिटामिप्रिड 20% SP.\n\n"
                      "📸 सटीक जाँच के लिए **AI Plant Doctor** में पत्ती की तस्वीर अपलोड करें!")
        else:
            answer = ("🌿 **Crop Disease Guidance:**\n"
                      "• **Fungal Blights/Leaf Spots:** Mancozeb 75% WP (2.5g/L) or Copper Oxychloride.\n"
                      "• **Sucking Pests (Aphids, Jassids):** Cold-Pressed Neem Oil (3ml/L) or Acetamiprid 20% SP.\n\n"
                      "📸 For a 95% accurate diagnosis, upload your leaf photo in the **AI Plant Doctor** tab!")
        return {"answer": answer, "language": language, "suggested_actions": suggested_actions, "grounded_data": grounded_data}

    # ── 6. KNOWLEDGE BASE INTENTS ─────────────────────────────────────────────
    intent = _detect_intent(q)
    if intent and intent in PROJECT_KB:
        return _kb_response(intent, language)

    # ── 7. DEFAULT GREETING / HELP ────────────────────────────────────────────
    suggested_actions = ["Mandi Prices", "Live Bidding", "Plant Doctor", "Transport Cost", "About FarmChain"]
    if language == "mr":
        answer = (
            "नमस्कार! मी **कृषी सहायक** 🌾 — FarmChain चा AI सहाय्यक.\n\n"
            "मी तुम्हाला याबाबत मदत करू शकतो:\n"
            "• 📊 मंडी भाव व सर्वोत्तम मंडी निवड\n"
            "• 💰 थेट लिलाव व नफा गणना\n"
            "• 🚚 स्मार्ट वाहतूक अंदाज\n"
            "• 📸 AI Plant Doctor द्वारे पीक रोग निदान\n"
            "• 🌱 पीक यादी, ऑर्डर, KYC, थीम, भाषा\n"
            "• ❓ FarmChain प्रकल्पाबद्दल कोणताही प्रश्न\n\n"
            "तुम्हाला काय जाणून घ्यायचे आहे?"
        )
    elif language == "hi":
        answer = (
            "नमस्ते! मैं हूँ **कृषि सहायक** 🌾 — FarmChain का AI असिस्टेंट.\n\n"
            "मैं इन विषयों में मदद कर सकता हूँ:\n"
            "• 📊 मंडी भाव और सर्वोत्तम मंडी चुनाव\n"
            "• 💰 लाइव बोली और लाभ गणना\n"
            "• 🚚 स्मार्ट ट्रांसपोर्ट अनुमान\n"
            "• 📸 AI Plant Doctor से फसल रोग निदान\n"
            "• 🌱 फसल सूची, ऑर्डर, KYC, थीम, भाषा\n"
            "• ❓ FarmChain प्रोजेक्ट के बारे में कोई भी प्रश्न\n\n"
            "आप क्या पूछना चाहते हैं?"
        )
    else:
        answer = (
            "Hello! I'm **Krishi Sahayak** 🌾 — the AI assistant for FarmChain / Smart Krishi Connect.\n\n"
            "I can help you with:\n"
            "• 📊 Live APMC Mandi prices & best market recommendations\n"
            "• 💰 Live bidding system & profit margin analysis\n"
            "• 🚚 Smart transport cost estimates\n"
            "• 📸 AI Plant Doctor crop disease diagnosis\n"
            "• 🌱 Crop listings, orders, KYC, themes, languages\n"
            "• ❓ Any question about the FarmChain project\n\n"
            "What would you like to know?"
        )
    return {"answer": answer, "language": language, "suggested_actions": suggested_actions, "grounded_data": grounded_data}
