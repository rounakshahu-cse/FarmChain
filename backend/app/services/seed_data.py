from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from backend.app.core.security import get_password_hash
from backend.app.models.user import User
from backend.app.models.listing import CropListing
from backend.app.models.bid import Bid
from backend.app.models.order import Order
from backend.app.models.transport import TransportJob
from backend.app.models.mandi import MandiPrice
from backend.app.models.pesticide import PesticideProduct
from backend.app.models.notification import Notification

def seed_database(db: Session):
    """
    Populates rich, realistic Indian agricultural data for Smart Krishi Connect.
    """
    # Check if already seeded
    if db.query(User).first():
        return

    now = datetime.now(timezone.utc)

    # 1. Users
    users_data = [
        # Farmers
        User(
            id=1,
            name="Ramesh Patil",
            phone="9876543210",
            email="ramesh.patil@farmchain.org",
            hashed_password=get_password_hash("password123"),
            role="farmer",
            location="Dindori, Nashik",
            district="Nashik",
            state="Maharashtra",
            trust_score=4.9,
            total_deals=18,
            verified=True,
            avatar_url="https://images.unsplash.com/photo-1544717305-2782549b5136?w=150"
        ),
        User(
            id=2,
            name="Gurpreet Singh",
            phone="9876543211",
            email="gurpreet.singh@farmchain.org",
            hashed_password=get_password_hash("password123"),
            role="farmer",
            location="Khanna, Ludhiana",
            district="Ludhiana",
            state="Punjab",
            trust_score=4.8,
            total_deals=14,
            verified=True,
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        ),
        User(
            id=3,
            name="Shivraj Chouhan",
            phone="9876543212",
            email="shivraj.chouhan@farmchain.org",
            hashed_password=get_password_hash("password123"),
            role="farmer",
            location="Sanwer, Indore",
            district="Indore",
            state="Madhya Pradesh",
            trust_score=4.7,
            total_deals=11,
            verified=True,
            avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
        ),
        # Merchants
        User(
            id=4,
            name="Suresh Agrawal (Suresh Agro Traders)",
            phone="9876543220",
            email="suresh.traders@farmchain.org",
            hashed_password=get_password_hash("password123"),
            role="merchant",
            location="Vashi APMC Market, Navi Mumbai",
            district="Thane",
            state="Maharashtra",
            trust_score=4.9,
            total_deals=42,
            verified=True,
            avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
        ),
        User(
            id=5,
            name="Rajesh Kothari (Kothari Grain Hub)",
            phone="9876543221",
            email="rajesh.kothari@farmchain.org",
            hashed_password=get_password_hash("password123"),
            role="merchant",
            location="Choithram Mandi, Indore",
            district="Indore",
            state="Madhya Pradesh",
            trust_score=4.8,
            total_deals=36,
            verified=True,
            avatar_url="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
        ),
        User(
            id=6,
            name="Vijay Mehra (Mehra Wholesale Produce)",
            phone="9876543222",
            email="vijay.mehra@farmchain.org",
            hashed_password=get_password_hash("password123"),
            role="merchant",
            location="Azadpur Mandi, Delhi",
            district="North Delhi",
            state="Delhi",
            trust_score=4.75,
            total_deals=51,
            verified=True,
            avatar_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
        ),
        # Transporters
        User(
            id=7,
            name="Balwinder Singh Logistics",
            phone="9876543230",
            email="balwinder.transport@farmchain.org",
            hashed_password=get_password_hash("password123"),
            role="transporter",
            location="Nashik-Pune Highway Transport Hub",
            district="Nashik",
            state="Maharashtra",
            trust_score=4.95,
            total_deals=68,
            verified=True,
            avatar_url="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150"
        ),
        User(
            id=8,
            name="Mahendra Shinde Rural Transport",
            phone="9876543231",
            email="shinde.tempo@farmchain.org",
            hashed_password=get_password_hash("password123"),
            role="transporter",
            location="Lasalgaon APMC Transport Yard",
            district="Nashik",
            state="Maharashtra",
            trust_score=4.85,
            total_deals=39,
            verified=True,
            avatar_url="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150"
        ),
        # Input Seller
        User(
            id=9,
            name="Dr. Aniruddha Joshi (Maha Krishi Seva Kendra)",
            phone="9876543240",
            email="joshi.krishi@farmchain.org",
            hashed_password=get_password_hash("password123"),
            role="seller",
            location="Panchavati, Nashik",
            district="Nashik",
            state="Maharashtra",
            trust_score=4.9,
            total_deals=120,
            verified=True,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        ),
        # Admin
        User(
            id=10,
            name="Krishi Connect Platform Admin",
            phone="9999999999",
            email="admin@farmchain.org",
            hashed_password=get_password_hash("password123"),
            role="admin",
            location="National Agri-Tech Operations Center",
            district="Pune",
            state="Maharashtra",
            trust_score=5.0,
            total_deals=0,
            verified=True,
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
        )
    ]
    for u in users_data:
        db.add(u)
    db.commit()

    # 2. Crop Listings
    listings_data = [
        CropListing(
            id=1,
            farmer_id=1,  # Ramesh Patil
            crop_name="Soybean",
            variety="JS-335 (High Oil Content)",
            quantity_quintals=60.0,
            quality_grade="Grade A - Premium",
            base_price=4800.0,
            cost_of_production=3800.0,
            farm_location="Dindori Farm, Nashik",
            district="Nashik",
            state="Maharashtra",
            status="bidding_open",
            bidding_opens_at=now - timedelta(hours=3),
            bidding_closes_at=now + timedelta(hours=21),
            previous_closing_price=4950.0,
            image_url="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400",
            notes="Direct harvest, moisture < 10%, cleaned and pre-graded in 50kg jute bags."
        ),
        CropListing(
            id=2,
            farmer_id=2,  # Gurpreet Singh
            crop_name="Wheat",
            variety="Sharbati Premium Gold",
            quantity_quintals=120.0,
            quality_grade="Grade A - Golden",
            base_price=2600.0,
            cost_of_production=2050.0,
            farm_location="Khanna Village, Ludhiana",
            district="Ludhiana",
            state="Punjab",
            status="bidding_open",
            bidding_opens_at=now - timedelta(hours=5),
            bidding_closes_at=now + timedelta(hours=19),
            previous_closing_price=2720.0,
            image_url="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
            notes="Lustrous large golden grains, zero pesticide residue, lab tested protein 13.5%."
        ),
        CropListing(
            id=3,
            farmer_id=3,  # Shivraj Chouhan
            crop_name="Cotton",
            variety="BT Cotton (Bollgard II Long Staple)",
            quantity_quintals=45.0,
            quality_grade="Grade A - Long Staple",
            base_price=7200.0,
            cost_of_production=5800.0,
            farm_location="Sanwer Road, Indore",
            district="Indore",
            state="Madhya Pradesh",
            status="scheduled_tomorrow",
            bidding_opens_at=now + timedelta(hours=14),
            bidding_closes_at=now + timedelta(hours=38),
            previous_closing_price=7450.0,
            image_url="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400",
            notes="First picking staple length 29.5mm, micronaire 3.8-4.2, trash < 3%."
        ),
        CropListing(
            id=4,
            farmer_id=1,  # Ramesh Patil
            crop_name="Tomato",
            variety="Abhinav Hybrid Red",
            quantity_quintals=35.0,
            quality_grade="Grade A - Firm Round",
            base_price=1400.0,
            cost_of_production=950.0,
            farm_location="Dindori Farm, Nashik",
            district="Nashik",
            state="Maharashtra",
            status="bidding_open",
            bidding_opens_at=now - timedelta(hours=2),
            bidding_closes_at=now + timedelta(hours=22),
            previous_closing_price=1520.0,
            image_url="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
            notes="Firm ripe red tomatoes, uniform size, graded in plastic crates ready for dispatch."
        ),
        CropListing(
            id=5,
            farmer_id=1,  # Ramesh Patil
            crop_name="Red Onion",
            variety="Garwa Red Onion",
            quantity_quintals=85.0,
            quality_grade="Grade B - Medium (45-55mm)",
            base_price=2100.0,
            cost_of_production=1550.0,
            farm_location="Lasalgaon Area, Nashik",
            district="Nashik",
            state="Maharashtra",
            status="bidding_open",
            bidding_opens_at=now - timedelta(hours=6),
            bidding_closes_at=now + timedelta(hours=18),
            previous_closing_price=2280.0,
            image_url="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400",
            notes="Well-cured storage onion, deep reddish-pink skin, low neck thickness."
        ),
        CropListing(
            id=6,
            farmer_id=2,  # Gurpreet Singh
            crop_name="Basmati Rice",
            variety="Pusa 1121 Raw Basmati",
            quantity_quintals=100.0,
            quality_grade="Grade A - Extra Long",
            base_price=3900.0,
            cost_of_production=2950.0,
            farm_location="Khanna Village, Ludhiana",
            district="Ludhiana",
            state="Punjab",
            status="finalized",
            bidding_opens_at=now - timedelta(days=1, hours=8),
            bidding_closes_at=now - timedelta(hours=8),
            previous_closing_price=4100.0,
            image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
            notes="Average grain length 8.35mm, elongation ratio 2.0x, moisture 11.8%."
        )
    ]
    for l in listings_data:
        db.add(l)
    db.commit()

    # 3. Bids
    bids_data = [
        # Bids on Soybean (Listing 1)
        Bid(id=1, listing_id=1, merchant_id=5, amount_per_quintal=5100.0, total_amount=306000.0, note="Payment via RTGS upon loading confirmation", status="active", created_at=now - timedelta(hours=2, minutes=40)),
        Bid(id=2, listing_id=1, merchant_id=4, amount_per_quintal=5250.0, total_amount=315000.0, note="Immediate dispatch needed for Vashi APMC depot", status="active", created_at=now - timedelta(hours=1, minutes=15)),
        Bid(id=3, listing_id=1, merchant_id=6, amount_per_quintal=5320.0, total_amount=319200.0, note="Top export grade price, self arrange logistics", status="active", created_at=now - timedelta(minutes=30)),
        
        # Bids on Wheat (Listing 2)
        Bid(id=4, listing_id=2, merchant_id=5, amount_per_quintal=2750.0, total_amount=330000.0, note="Bulk procurement for MP flour mills", status="active", created_at=now - timedelta(hours=4)),
        Bid(id=5, listing_id=2, merchant_id=6, amount_per_quintal=2840.0, total_amount=340800.0, note="Ready with truck fleet in Ludhiana", status="active", created_at=now - timedelta(hours=2)),

        # Bids on Tomato (Listing 4)
        Bid(id=6, listing_id=4, merchant_id=4, amount_per_quintal=1580.0, total_amount=55300.0, note="Direct delivery to Mumbai wholesale", status="active", created_at=now - timedelta(hours=1)),

        # Bids on Red Onion (Listing 5)
        Bid(id=7, listing_id=5, merchant_id=4, amount_per_quintal=2320.0, total_amount=197200.0, note="Taking entire 85 quintal batch", status="active", created_at=now - timedelta(hours=3)),
        Bid(id=8, listing_id=5, merchant_id=6, amount_per_quintal=2380.0, total_amount=202300.0, note="Dispatch to Delhi Azadpur", status="active", created_at=now - timedelta(hours=1, minutes=45)),

        # Finalized Bid on Basmati (Listing 6)
        Bid(id=9, listing_id=6, merchant_id=6, amount_per_quintal=4250.0, total_amount=425000.0, note="Winning export bid", status="accepted", created_at=now - timedelta(hours=10))
    ]
    for b in bids_data:
        db.add(b)
    db.commit()

    # 4. Finalized Order for Basmati
    order1 = Order(
        id=1,
        listing_id=6,
        winning_bid_id=9,
        farmer_id=2,
        merchant_id=6,
        agreed_price_per_quintal=4250.0,
        quantity_quintals=100.0,
        total_amount=425000.0,
        is_profitable_flag=True,
        profit_margin_pct=44.07,
        net_profit_amount=130000.0,
        status="in_transit",
        payment_status="escrow_held",
        created_at=now - timedelta(hours=8)
    )
    db.add(order1)
    db.commit()

    # 5. Transport Jobs
    jobs_data = [
        TransportJob(
            id=1,
            order_id=1,
            farmer_id=2,
            transporter_id=7,
            crop_name="Basmati Rice (100 Qtl)",
            load_quintals=100.0,
            vehicle_type="10-Ton Heavy Truck (Eicher / Ashok Leyland)",
            pickup_location="Khanna Village, Ludhiana, Punjab",
            drop_location="Azadpur APMC Warehouse, Delhi",
            distance_km=310.0,
            base_rate=1800.0,
            rate_per_km=30.0,
            calculated_price=11100.0,
            status="in_transit",
            tracking_lat=29.3909,
            tracking_lng=76.9635,
            created_at=now - timedelta(hours=7)
        ),
        TransportJob(
            id=2,
            order_id=None,
            farmer_id=1,
            transporter_id=8,
            crop_name="Tomato Crates (35 Qtl)",
            load_quintals=35.0,
            vehicle_type="Pickup Truck (Mahindra Bolero Maxi)",
            pickup_location="Dindori Farm, Nashik",
            drop_location="Vashi APMC Market, Navi Mumbai",
            distance_km=175.0,
            base_rate=600.0,
            rate_per_km=18.0,
            calculated_price=3750.0,
            status="available",
            tracking_lat=19.9975,
            tracking_lng=73.7898,
            created_at=now - timedelta(hours=1)
        )
    ]
    for j in jobs_data:
        db.add(j)
    db.commit()

    # 6. Mandi Prices
    mandi_data = [
        # Soybean
        MandiPrice(crop_name="Soybean", variety="Yellow", mandi_name="Nashik Mandi", district="Nashik", state="Maharashtra", modal_price=5150.0, min_price=4900.0, max_price=5350.0, distance_km=22.0, price_trend="up", trend_pct=3.2),
        MandiPrice(crop_name="Soybean", variety="Yellow", mandi_name="Pune APMC Market", district="Pune", state="Maharashtra", modal_price=5380.0, min_price=5050.0, max_price=5550.0, distance_km=180.0, price_trend="up", trend_pct=4.1),
        MandiPrice(crop_name="Soybean", variety="Yellow", mandi_name="Choithram Mandi", district="Indore", state="Madhya Pradesh", modal_price=5290.0, min_price=5000.0, max_price=5420.0, distance_km=390.0, price_trend="stable", trend_pct=0.5),
        MandiPrice(crop_name="Soybean", variety="Yellow", mandi_name="Lasalgaon Mandi", district="Nashik", state="Maharashtra", modal_price=5080.0, min_price=4800.0, max_price=5200.0, distance_km=45.0, price_trend="down", trend_pct=-1.2),

        # Wheat
        MandiPrice(crop_name="Wheat", variety="Sharbati", mandi_name="Choithram Mandi", district="Indore", state="Madhya Pradesh", modal_price=2880.0, min_price=2600.0, max_price=3050.0, distance_km=25.0, price_trend="up", trend_pct=2.8),
        MandiPrice(crop_name="Wheat", variety="Kalyan", mandi_name="Khanna Grain Mandi", district="Ludhiana", state="Punjab", modal_price=2780.0, min_price=2550.0, max_price=2900.0, distance_km=15.0, price_trend="up", trend_pct=1.9),
        MandiPrice(crop_name="Wheat", variety="Mill Quality", mandi_name="Azadpur Mandi", district="Delhi", state="Delhi", modal_price=2920.0, min_price=2700.0, max_price=3100.0, distance_km=315.0, price_trend="up", trend_pct=2.4),
        MandiPrice(crop_name="Wheat", variety="Lokwan", mandi_name="Pune APMC Market", district="Pune", state="Maharashtra", modal_price=2840.0, min_price=2650.0, max_price=3000.0, distance_km=210.0, price_trend="stable", trend_pct=0.2),

        # Cotton
        MandiPrice(crop_name="Cotton", variety="Medium Staple", mandi_name="Akola Cotton Yard", district="Akola", state="Maharashtra", modal_price=7550.0, min_price=7100.0, max_price=7800.0, distance_km=60.0, price_trend="up", trend_pct=3.5),
        MandiPrice(crop_name="Cotton", variety="Shankar-6", mandi_name="Rajkot APMC Yard", district="Rajkot", state="Gujarat", modal_price=7720.0, min_price=7300.0, max_price=8000.0, distance_km=420.0, price_trend="up", trend_pct=2.7),
        MandiPrice(crop_name="Cotton", variety="Long Staple", mandi_name="Indore Mandi", district="Indore", state="Madhya Pradesh", modal_price=7480.0, min_price=7050.0, max_price=7750.0, distance_km=30.0, price_trend="stable", trend_pct=0.8),

        # Tomato
        MandiPrice(crop_name="Tomato", variety="Hybrid", mandi_name="Narayangaon Tomato Hub", district="Pune", state="Maharashtra", modal_price=1650.0, min_price=1350.0, max_price=1850.0, distance_km=110.0, price_trend="up", trend_pct=5.5),
        MandiPrice(crop_name="Tomato", variety="Desi", mandi_name="Nashik Mandi", district="Nashik", state="Maharashtra", modal_price=1520.0, min_price=1200.0, max_price=1700.0, distance_km=22.0, price_trend="up", trend_pct=3.1),
        MandiPrice(crop_name="Tomato", variety="Hybrid", mandi_name="Vashi APMC Mumbai", district="Thane", state="Maharashtra", modal_price=1820.0, min_price=1500.0, max_price=2100.0, distance_km=175.0, price_trend="up", trend_pct=6.2),

        # Red Onion
        MandiPrice(crop_name="Red Onion", variety="Garwa", mandi_name="Lasalgaon Onion Mandi", district="Nashik", state="Maharashtra", modal_price=2350.0, min_price=2000.0, max_price=2600.0, distance_km=45.0, price_trend="up", trend_pct=4.8),
        MandiPrice(crop_name="Red Onion", variety="Peeled Red", mandi_name="Azadpur Mandi", district="Delhi", state="Delhi", modal_price=2750.0, min_price=2400.0, max_price=3050.0, distance_km=1150.0, price_trend="up", trend_pct=3.9),
        MandiPrice(crop_name="Red Onion", variety="Garwa", mandi_name="Pune APMC Market", district="Pune", state="Maharashtra", modal_price=2420.0, min_price=2150.0, max_price=2680.0, distance_km=190.0, price_trend="stable", trend_pct=1.1),

        # Basmati Rice
        MandiPrice(crop_name="Basmati Rice", variety="Pusa 1121", mandi_name="Khanna Grain Mandi", district="Ludhiana", state="Punjab", modal_price=4180.0, min_price=3800.0, max_price=4450.0, distance_km=15.0, price_trend="up", trend_pct=2.1),
        MandiPrice(crop_name="Basmati Rice", variety="1121 Export", mandi_name="Karnal Mandi", district="Karnal", state="Haryana", modal_price=4320.0, min_price=3950.0, max_price=4600.0, distance_km=145.0, price_trend="up", trend_pct=3.4)
    ]
    for m in mandi_data:
        db.add(m)
    db.commit()

    # 7. Pesticides & Farm Inputs
    pesticide_products = [
        PesticideProduct(
            id=1,
            seller_id=9,  # Dr. Joshi
            name="Kavach Chlorothalonil 75% WP Broad Spectrum Fungicide",
            brand="Syngenta Agriculture",
            category="Bio-Fungicide",
            target_crops="Tomato, Potato, Chilli, Groundnut",
            target_pests="Early Blight, Late Blight, Anthracnose, Leaf Spot",
            price=680.0,
            unit="500 gm Pack",
            stock=45,
            is_verified_seller=True,
            rating=4.9,
            image_url="https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300",
            description="Contact fungicide with multi-site action. Prevents spore germination and mycelial fungal spread with superior rain-fastness.",
            usage_instructions="Dissolve 2g per Litre of clean water. Spray thoroughly on foliage upon first detection of blight spots."
        ),
        PesticideProduct(
            id=2,
            seller_id=9,
            name="Ridomil Gold MZ Metalaxyl-M Bio-Fungicide",
            brand="Syngenta Crop Protection",
            category="Bio-Fungicide",
            target_crops="Potato, Tomato, Grapes, Mustard",
            target_pests="Late Blight, Downy Mildew, White Rust",
            price=1450.0,
            unit="1 kg Pack",
            stock=30,
            is_verified_seller=True,
            rating=4.95,
            image_url="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300",
            description="Systemic and contact fungicide offering unmatched curative and protective control against devastating oomycete late blights.",
            usage_instructions="Apply 2.5g/L of water at 10-day intervals during humid, rainy disease-conducive weather."
        ),
        PesticideProduct(
            id=3,
            seller_id=9,
            name="Proclaim Emamectin Benzoate 5% SG Bio-Larvicide",
            brand="Crystal Crop Protection",
            category="Bio-Pesticide",
            target_crops="Cotton, Soybean, Cabbage, Chilli",
            target_pests="Bollworm, Spodoptera Litura, Diamond Back Moth, Fruit Borer",
            price=540.0,
            unit="250 gm Pack",
            stock=60,
            is_verified_seller=True,
            rating=4.85,
            image_url="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=300",
            description="Modern naturally derived translaminar insecticide that halts caterpillar muscle contraction within 2 hours.",
            usage_instructions="Mix 0.5g/L of water. Spray in early morning or late evening for maximum leaf penetration."
        ),
        PesticideProduct(
            id=4,
            seller_id=9,
            name="Cold-Pressed Pure Organic Neem Oil (10,000 PPM Azadirachtin)",
            brand="Maha Bio-Agri Organics",
            category="Organic Neem Oil",
            target_crops="All Vegetables, Pulses, Fruits & Cotton",
            target_pests="Aphids, Whiteflies, Thrips, Mites & Leaf Miners",
            price=420.0,
            unit="1 Litre Bottle",
            stock=85,
            is_verified_seller=True,
            rating=4.9,
            image_url="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300",
            description="100% pure organic bio-pesticide with antifeedant, repellent, and insect growth regulator (IGR) properties.",
            usage_instructions="Emulsify 3ml to 5ml Neem Oil per 1 Litre of water with 1ml liquid soap. Spray weekly as preventive shield."
        ),
        PesticideProduct(
            id=5,
            seller_id=9,
            name="Trichoderma Viride Organic Bio-Fungicide Culture",
            brand="National Bio-Fertilizers",
            category="Bio-Fungicide",
            target_crops="Soybean, Cotton, Tomato, Ginger, Turmeric",
            target_pests="Root Rot, Collar Rot, Fusarium Wilt, Damping-off",
            price=280.0,
            unit="1 kg Pack",
            stock=50,
            is_verified_seller=True,
            rating=4.8,
            image_url="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=300",
            description="Beneficial fungal antagonist that colonizes root zones, secretes enzymes that dissolve pathogenic fungal cell walls.",
            usage_instructions="Use 10g/kg for seed treatment, or mix 2.5 kg with 50 kg well-decomposed FYM/compost per acre."
        ),
        PesticideProduct(
            id=6,
            seller_id=9,
            name="Certified High-Yielding JS-335 Soybean Foundation Seeds",
            brand="Mahabeej Certified Seeds",
            category="Certified Seeds",
            target_crops="Soybean",
            target_pests="Resistant to Pod Shattering & Collar Rot",
            price=2850.0,
            unit="30 kg Bag",
            stock=35,
            is_verified_seller=True,
            rating=4.9,
            image_url="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=300",
            description="Govt certified 98% purity foundation seeds with 85%+ germination rate. High branch density and oil percentage.",
            usage_instructions="Sow @ 30kg/acre with 45cm row-to-row spacing after receiving 75mm monsoon rainfall."
        ),
        PesticideProduct(
            id=7,
            seller_id=9,
            name="Bio-Zyme Ascophyllum Nodosum Seaweed Bio-Stimulant",
            brand="Biostadt Agri Sciences",
            category="Nutrient / Fertilizer",
            target_crops="All Horticultural & Cereal Crops",
            target_pests="Relieves abiotic drought & heat stress",
            price=490.0,
            unit="500 ml Bottle",
            stock=40,
            is_verified_seller=True,
            rating=4.85,
            image_url="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
            description="Rich in natural cytokinins, auxins, betaines and micro-nutrients. Boosts chlorophyll synthesis and flower retention.",
            usage_instructions="Apply 1.5ml to 2ml per Litre of water at pre-flowering and fruit-set stages."
        ),
        PesticideProduct(
            id=8,
            seller_id=9,
            name="16L Dual-Motor Rechargeable Knapsack Battery Sprayer",
            brand="Kisan Kraft Pro",
            category="Sprayer Equipment",
            target_crops="All Agricultural Fields",
            target_pests="Uniform 4-Nozzle Spray Distribution",
            price=3200.0,
            unit="1 Unit (Full Kit)",
            stock=18,
            is_verified_seller=True,
            rating=4.95,
            image_url="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=300",
            description="High-pressure 12V 12Ah lithium battery sprayer. Delivers up to 6 hours continuous spraying on a single charge with telescopic brass lance.",
            usage_instructions="Charge fully before first use. Flush tank with clean water after spraying pesticides or bio-fertilizers."
        )
    ]
    for p in pesticide_products:
        db.add(p)
    db.commit()

    # 8. Notifications
    notifications_data = [
        Notification(
            id=1,
            user_id=1,  # Ramesh Patil
            title="🔥 New High Bid on your Soybean Listing!",
            message="Vijay Mehra (Delhi) just placed a top bid of ₹5,320/Quintal for your 60 Qtl Soybean. Net Profit Margin: +40.0%!",
            type="new_bid",
            is_read=False,
            link="/farmer/listings",
            created_at=now - timedelta(minutes=30)
        ),
        Notification(
            id=2,
            user_id=4,  # Suresh Traders
            title="⏰ Scheduled Bidding Alert for Tomorrow",
            message="Bidding for BT Cotton (45 Quintals, Long Staple) by Shivraj Chouhan opens tomorrow at 06:00 AM. Last market close: ₹7,450/Qtl.",
            type="bidding_reminder",
            is_read=False,
            link="/merchant/marketplace",
            created_at=now - timedelta(hours=3)
        ),
        Notification(
            id=3,
            user_id=7,  # Balwinder Transporter
            title="🚚 New Transport Assignment",
            message="You have been assigned to transport 100 Qtl Basmati Rice from Khanna, Ludhiana to Azadpur, Delhi. Payout: ₹11,100.",
            type="transport_assigned",
            is_read=False,
            link="/transporter/jobs",
            created_at=now - timedelta(hours=7)
        )
    ]
    for n in notifications_data:
        db.add(n)
    db.commit()

    print("Successfully seeded Smart Krishi Connect database!")
