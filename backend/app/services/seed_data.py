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

def get_all_mandi_seed_records():
    return [
        # ── WHEAT ──
        MandiPrice(crop_name="Wheat", variety="Sharbati Premium", mandi_name="Choithram Mandi", district="Indore", state="Madhya Pradesh", modal_price=2980.0, min_price=2750.0, max_price=3200.0, distance_km=390.0, arrivals_tonnes=480.0, price_trend="up", trend_pct=3.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Wheat", variety="Mill Quality (HD-2967)", mandi_name="Azadpur Mandi", district="Delhi", state="Delhi", modal_price=2920.0, min_price=2700.0, max_price=3100.0, distance_km=1150.0, arrivals_tonnes=850.0, price_trend="up", trend_pct=2.4, market_status="Open & Trading"),
        MandiPrice(crop_name="Wheat", variety="Lokwan Golden", mandi_name="Pune APMC Market", district="Pune", state="Maharashtra", modal_price=2840.0, min_price=2650.0, max_price=3050.0, distance_km=190.0, arrivals_tonnes=320.0, price_trend="stable", trend_pct=0.5, market_status="Open & Trading"),
        MandiPrice(crop_name="Wheat", variety="Lokwan Medium", mandi_name="Nashik Mandi", district="Nashik", state="Maharashtra", modal_price=2790.0, min_price=2600.0, max_price=2950.0, distance_km=22.0, arrivals_tonnes=210.0, price_trend="up", trend_pct=1.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Wheat", variety="Kalyan / PBW-343", mandi_name="Khanna Grain Mandi", district="Ludhiana", state="Punjab", modal_price=2780.0, min_price=2550.0, max_price=2900.0, distance_km=1350.0, arrivals_tonnes=920.0, price_trend="up", trend_pct=1.9, market_status="Open & Trading"),
        MandiPrice(crop_name="Wheat", variety="GW-322", mandi_name="Kota Mandi", district="Kota", state="Rajasthan", modal_price=2740.0, min_price=2520.0, max_price=2880.0, distance_km=680.0, arrivals_tonnes=360.0, price_trend="up", trend_pct=1.4, market_status="Open & Trading"),

        # ── SOYBEAN ──
        MandiPrice(crop_name="Soybean", variety="Yellow Hybrid (JS-335)", mandi_name="Pune APMC Market", district="Pune", state="Maharashtra", modal_price=5380.0, min_price=5050.0, max_price=5550.0, distance_km=190.0, arrivals_tonnes=410.0, price_trend="up", trend_pct=4.1, market_status="Open & Trading"),
        MandiPrice(crop_name="Soybean", variety="Yellow Oil-Grade", mandi_name="Latur APMC Pulse & Oil Yard", district="Latur", state="Maharashtra", modal_price=5340.0, min_price=5100.0, max_price=5480.0, distance_km=320.0, arrivals_tonnes=680.0, price_trend="up", trend_pct=3.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Soybean", variety="Yellow (JS-9560)", mandi_name="Choithram Mandi", district="Indore", state="Madhya Pradesh", modal_price=5290.0, min_price=5000.0, max_price=5420.0, distance_km=390.0, arrivals_tonnes=540.0, price_trend="up", trend_pct=2.5, market_status="Open & Trading"),
        MandiPrice(crop_name="Soybean", variety="Yellow Hybrid", mandi_name="Kota Bhamashah Mandi", district="Kota", state="Rajasthan", modal_price=5210.0, min_price=4950.0, max_price=5360.0, distance_km=680.0, arrivals_tonnes=380.0, price_trend="stable", trend_pct=0.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Soybean", variety="Yellow Desi", mandi_name="Nashik Mandi", district="Nashik", state="Maharashtra", modal_price=5150.0, min_price=4900.0, max_price=5350.0, distance_km=22.0, arrivals_tonnes=240.0, price_trend="up", trend_pct=3.2, market_status="Open & Trading"),
        MandiPrice(crop_name="Soybean", variety="Yellow Standard", mandi_name="Lasalgaon Mandi", district="Nashik", state="Maharashtra", modal_price=5080.0, min_price=4800.0, max_price=5200.0, distance_km=45.0, arrivals_tonnes=190.0, price_trend="down", trend_pct=-1.2, market_status="Open & Trading"),

        # ── COTTON ──
        MandiPrice(crop_name="Cotton", variety="Shankar-6 Hybrid", mandi_name="Rajkot APMC Yard", district="Rajkot", state="Gujarat", modal_price=7820.0, min_price=7400.0, max_price=8150.0, distance_km=420.0, arrivals_tonnes=750.0, price_trend="up", trend_pct=3.7, market_status="Open & Trading"),
        MandiPrice(crop_name="Cotton", variety="Bt Cotton (Bollgard II)", mandi_name="Adilabad Cotton Market", district="Adilabad", state="Telangana", modal_price=7740.0, min_price=7350.0, max_price=8020.0, distance_km=380.0, arrivals_tonnes=520.0, price_trend="up", trend_pct=4.1, market_status="Open & Trading"),
        MandiPrice(crop_name="Cotton", variety="Long Staple Bt", mandi_name="Akola Cotton Yard", district="Akola", state="Maharashtra", modal_price=7650.0, min_price=7200.0, max_price=7900.0, distance_km=60.0, arrivals_tonnes=610.0, price_trend="up", trend_pct=2.9, market_status="Open & Trading"),
        MandiPrice(crop_name="Cotton", variety="Medium Staple", mandi_name="Indore Mandi", district="Indore", state="Madhya Pradesh", modal_price=7480.0, min_price=7050.0, max_price=7750.0, distance_km=390.0, arrivals_tonnes=380.0, price_trend="stable", trend_pct=0.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Cotton", variety="RCH-659", mandi_name="Bathinda Cotton Hub", district="Bathinda", state="Punjab", modal_price=7380.0, min_price=6950.0, max_price=7650.0, distance_km=1250.0, arrivals_tonnes=440.0, price_trend="down", trend_pct=-1.1, market_status="Open & Trading"),

        # ── TOMATO ──
        MandiPrice(crop_name="Tomato", variety="Pusa Ruby", mandi_name="Azadpur Mandi", district="Delhi", state="Delhi", modal_price=1950.0, min_price=1600.0, max_price=2250.0, distance_km=1150.0, arrivals_tonnes=980.0, price_trend="up", trend_pct=7.1, market_status="Open & Trading"),
        MandiPrice(crop_name="Tomato", variety="Hybrid Abhinav", mandi_name="Vashi APMC Mumbai", district="Thane", state="Maharashtra", modal_price=1850.0, min_price=1550.0, max_price=2150.0, distance_km=175.0, arrivals_tonnes=620.0, price_trend="up", trend_pct=6.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Tomato", variety="US-440", mandi_name="Kolar APMC Market", district="Kolar", state="Karnataka", modal_price=1740.0, min_price=1450.0, max_price=2050.0, distance_km=850.0, arrivals_tonnes=740.0, price_trend="up", trend_pct=4.4, market_status="Open & Trading"),
        MandiPrice(crop_name="Tomato", variety="Hybrid (Heemsohna)", mandi_name="Narayangaon Tomato Hub", district="Pune", state="Maharashtra", modal_price=1680.0, min_price=1380.0, max_price=1920.0, distance_km=110.0, arrivals_tonnes=490.0, price_trend="up", trend_pct=5.2, market_status="Open & Trading"),
        MandiPrice(crop_name="Tomato", variety="Desi Pink", mandi_name="Nashik Mandi", district="Nashik", state="Maharashtra", modal_price=1520.0, min_price=1200.0, max_price=1700.0, distance_km=22.0, arrivals_tonnes=380.0, price_trend="up", trend_pct=3.1, market_status="Open & Trading"),

        # ── RED ONION ──
        MandiPrice(crop_name="Red Onion", variety="Garwa / Nashik Red", mandi_name="Azadpur Mandi", district="Delhi", state="Delhi", modal_price=2780.0, min_price=2450.0, max_price=3100.0, distance_km=1150.0, arrivals_tonnes=1200.0, price_trend="up", trend_pct=4.5, market_status="Open & Trading"),
        MandiPrice(crop_name="Red Onion", variety="Garwa Quality", mandi_name="Vashi APMC Mumbai", district="Thane", state="Maharashtra", modal_price=2620.0, min_price=2300.0, max_price=2850.0, distance_km=175.0, arrivals_tonnes=850.0, price_trend="up", trend_pct=3.6, market_status="Open & Trading"),
        MandiPrice(crop_name="Red Onion", variety="Garwa Storage Red", mandi_name="Pune APMC Market", district="Pune", state="Maharashtra", modal_price=2450.0, min_price=2180.0, max_price=2720.0, distance_km=190.0, arrivals_tonnes=540.0, price_trend="up", trend_pct=2.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Red Onion", variety="Garwa Export Grade", mandi_name="Lasalgaon Onion Mandi", district="Nashik", state="Maharashtra", modal_price=2380.0, min_price=2050.0, max_price=2650.0, distance_km=45.0, arrivals_tonnes=1600.0, price_trend="up", trend_pct=3.9, market_status="Open & Trading"),
        MandiPrice(crop_name="Red Onion", variety="Red Medium", mandi_name="Solapur APMC Market", district="Solapur", state="Maharashtra", modal_price=2280.0, min_price=1950.0, max_price=2500.0, distance_km=360.0, arrivals_tonnes=480.0, price_trend="stable", trend_pct=0.4, market_status="Open & Trading"),

        # ── BASMATI RICE / PADDY ──
        MandiPrice(crop_name="Basmati Rice", variety="Pusa 1121 Export Grade", mandi_name="Karnal Mandi", district="Karnal", state="Haryana", modal_price=4380.0, min_price=4000.0, max_price=4700.0, distance_km=1250.0, arrivals_tonnes=890.0, price_trend="up", trend_pct=3.9, market_status="Open & Trading"),
        MandiPrice(crop_name="Basmati Rice", variety="Pusa 1509 Paddy", mandi_name="Narela Grain Mandi", district="Delhi", state="Delhi", modal_price=4280.0, min_price=3920.0, max_price=4550.0, distance_km=1160.0, arrivals_tonnes=720.0, price_trend="up", trend_pct=2.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Basmati Rice", variety="1121 Basmati", mandi_name="Khanna Grain Mandi", district="Ludhiana", state="Punjab", modal_price=4180.0, min_price=3800.0, max_price=4450.0, distance_km=1350.0, arrivals_tonnes=950.0, price_trend="up", trend_pct=2.1, market_status="Open & Trading"),
        MandiPrice(crop_name="Basmati Rice", variety="Pusa Basmati 1401", mandi_name="Kaithal Mandi", district="Kaithal", state="Haryana", modal_price=4150.0, min_price=3850.0, max_price=4380.0, distance_km=1280.0, arrivals_tonnes=640.0, price_trend="stable", trend_pct=0.6, market_status="Open & Trading"),

        # ── POTATO ──
        MandiPrice(crop_name="Potato", variety="Kufri Chipsona / Jyoti", mandi_name="Vashi APMC Mumbai", district="Thane", state="Maharashtra", modal_price=1680.0, min_price=1400.0, max_price=1920.0, distance_km=175.0, arrivals_tonnes=880.0, price_trend="up", trend_pct=4.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Potato", variety="Kufri Pukhraj", mandi_name="Azadpur Mandi", district="Delhi", state="Delhi", modal_price=1620.0, min_price=1350.0, max_price=1850.0, distance_km=1150.0, arrivals_tonnes=1400.0, price_trend="up", trend_pct=3.2, market_status="Open & Trading"),
        MandiPrice(crop_name="Potato", variety="Kufri Jyoti", mandi_name="Choithram Mandi", district="Indore", state="Madhya Pradesh", modal_price=1520.0, min_price=1280.0, max_price=1720.0, distance_km=390.0, arrivals_tonnes=620.0, price_trend="stable", trend_pct=0.5, market_status="Open & Trading"),
        MandiPrice(crop_name="Potato", variety="Kufri Bahar", mandi_name="Agra APMC Potato Market", district="Agra", state="Uttar Pradesh", modal_price=1450.0, min_price=1200.0, max_price=1650.0, distance_km=920.0, arrivals_tonnes=1850.0, price_trend="up", trend_pct=2.7, market_status="Open & Trading"),
        MandiPrice(crop_name="Potato", variety="Lady Rosetta", mandi_name="Jalandhar Potato Hub", district="Jalandhar", state="Punjab", modal_price=1380.0, min_price=1150.0, max_price=1580.0, distance_km=1380.0, arrivals_tonnes=920.0, price_trend="down", trend_pct=-1.5, market_status="Open & Trading"),

        # ── CHILLI / PEPPER ──
        MandiPrice(crop_name="Chilli / Pepper", variety="Byadgi Kaddi", mandi_name="Byadgi APMC Mirchi Market", district="Haveri", state="Karnataka", modal_price=19400.0, min_price=17500.0, max_price=22500.0, distance_km=520.0, arrivals_tonnes=380.0, price_trend="up", trend_pct=5.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Chilli / Pepper", variety="Guntur Teja (S17)", mandi_name="Guntur Mirchi Yard", district="Guntur", state="Andhra Pradesh", modal_price=18600.0, min_price=16800.0, max_price=21000.0, distance_km=780.0, arrivals_tonnes=650.0, price_trend="up", trend_pct=4.2, market_status="Open & Trading"),
        MandiPrice(crop_name="Chilli / Pepper", variety="Guntur Sannam", mandi_name="Khammam APMC Yard", district="Khammam", state="Telangana", modal_price=17800.0, min_price=16000.0, max_price=19800.0, distance_km=690.0, arrivals_tonnes=420.0, price_trend="up", trend_pct=3.1, market_status="Open & Trading"),
        MandiPrice(crop_name="Chilli / Pepper", variety="Jwala Green / Red", mandi_name="Nagpur Mandi", district="Nagpur", state="Maharashtra", modal_price=16900.0, min_price=15200.0, max_price=18600.0, distance_km=480.0, arrivals_tonnes=260.0, price_trend="stable", trend_pct=0.9, market_status="Open & Trading"),

        # ── SUGARCANE ──
        MandiPrice(crop_name="Sugarcane", variety="Co-86032 High Recovery", mandi_name="Kolhapur Sugar Belt Mandi", district="Kolhapur", state="Maharashtra", modal_price=388.0, min_price=350.0, max_price=420.0, distance_km=310.0, arrivals_tonnes=2400.0, price_trend="up", trend_pct=3.4, market_status="Open & Trading"),
        MandiPrice(crop_name="Sugarcane", variety="CoM-0265", mandi_name="Belgaum APMC Yard", district="Belgaum", state="Karnataka", modal_price=382.0, min_price=345.0, max_price=415.0, distance_km=380.0, arrivals_tonnes=1950.0, price_trend="stable", trend_pct=0.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Sugarcane", variety="Co-0238", mandi_name="Muzaffarnagar Cane Market", district="Muzaffarnagar", state="Uttar Pradesh", modal_price=375.0, min_price=340.0, max_price=405.0, distance_km=1250.0, arrivals_tonnes=3100.0, price_trend="up", trend_pct=2.1, market_status="Open & Trading"),
        MandiPrice(crop_name="Sugarcane", variety="Co-11015", mandi_name="Meerut Sugar Mandi", district="Meerut", state="Uttar Pradesh", modal_price=368.0, min_price=335.0, max_price=398.0, distance_km=1200.0, arrivals_tonnes=2600.0, price_trend="up", trend_pct=1.6, market_status="Open & Trading"),

        # ── MAIZE / CORN ──
        MandiPrice(crop_name="Maize / Corn", variety="Yellow Hybrid (NK-6240)", mandi_name="Gulabbagh Maize Hub", district="Purnea", state="Bihar", modal_price=2420.0, min_price=2200.0, max_price=2620.0, distance_km=1450.0, arrivals_tonnes=1200.0, price_trend="up", trend_pct=4.6, market_status="Open & Trading"),
        MandiPrice(crop_name="Maize / Corn", variety="Feed Grade Yellow", mandi_name="Davangere APMC Market", district="Davangere", state="Karnataka", modal_price=2380.0, min_price=2180.0, max_price=2550.0, distance_km=620.0, arrivals_tonnes=780.0, price_trend="up", trend_pct=3.2, market_status="Open & Trading"),
        MandiPrice(crop_name="Maize / Corn", variety="Pioneer P3396", mandi_name="Sangli APMC Market", district="Sangli", state="Maharashtra", modal_price=2340.0, min_price=2120.0, max_price=2500.0, distance_km=340.0, arrivals_tonnes=560.0, price_trend="stable", trend_pct=0.7, market_status="Open & Trading"),
        MandiPrice(crop_name="Maize / Corn", variety="Yellow Maize", mandi_name="Chhindwara Mandi", district="Chhindwara", state="Madhya Pradesh", modal_price=2290.0, min_price=2050.0, max_price=2450.0, distance_km=520.0, arrivals_tonnes=640.0, price_trend="up", trend_pct=2.2, market_status="Open & Trading"),

        # ── GROUNDNUT / PEANUT ──
        MandiPrice(crop_name="Groundnut / Peanut", variety="TAG-24 Bold", mandi_name="Gondal APMC Market", district="Rajkot", state="Gujarat", modal_price=6880.0, min_price=6400.0, max_price=7350.0, distance_km=460.0, arrivals_tonnes=540.0, price_trend="up", trend_pct=4.1, market_status="Open & Trading"),
        MandiPrice(crop_name="Groundnut / Peanut", variety="GG-20", mandi_name="Rajkot APMC Yard", district="Rajkot", state="Gujarat", modal_price=6750.0, min_price=6300.0, max_price=7180.0, distance_km=420.0, arrivals_tonnes=680.0, price_trend="up", trend_pct=3.3, market_status="Open & Trading"),
        MandiPrice(crop_name="Groundnut / Peanut", variety="JL-24", mandi_name="Junagadh Mandi", district="Junagadh", state="Gujarat", modal_price=6620.0, min_price=6200.0, max_price=7050.0, distance_km=490.0, arrivals_tonnes=490.0, price_trend="stable", trend_pct=0.9, market_status="Open & Trading"),
        MandiPrice(crop_name="Groundnut / Peanut", variety="Bikaner Bold", mandi_name="Bikaner Grain Mandi", district="Bikaner", state="Rajasthan", modal_price=6450.0, min_price=6050.0, max_price=6850.0, distance_km=890.0, arrivals_tonnes=380.0, price_trend="down", trend_pct=-1.2, market_status="Open & Trading"),

        # ── MUSTARD ──
        MandiPrice(crop_name="Mustard", variety="Varuna T-59 (High Oil)", mandi_name="Jaipur APMC Market", district="Jaipur", state="Rajasthan", modal_price=5880.0, min_price=5500.0, max_price=6250.0, distance_km=720.0, arrivals_tonnes=650.0, price_trend="up", trend_pct=3.9, market_status="Open & Trading"),
        MandiPrice(crop_name="Mustard", variety="Giriraj", mandi_name="Morena Oilseed Yard", district="Morena", state="Madhya Pradesh", modal_price=5780.0, min_price=5450.0, max_price=6120.0, distance_km=760.0, arrivals_tonnes=580.0, price_trend="up", trend_pct=3.1, market_status="Open & Trading"),
        MandiPrice(crop_name="Mustard", variety="Pusa Mustard (Coral)", mandi_name="Bharatpur Mandi", district="Bharatpur", state="Rajasthan", modal_price=5750.0, min_price=5400.0, max_price=6100.0, distance_km=820.0, arrivals_tonnes=490.0, price_trend="up", trend_pct=2.7, market_status="Open & Trading"),
        MandiPrice(crop_name="Mustard", variety="Black Mustard / Rai", mandi_name="Alwar Mandi", district="Alwar", state="Rajasthan", modal_price=5680.0, min_price=5350.0, max_price=6000.0, distance_km=780.0, arrivals_tonnes=430.0, price_trend="stable", trend_pct=0.4, market_status="Open & Trading"),

        # ── BANANA ──
        MandiPrice(crop_name="Banana", variety="Grand Naine (G9 Export)", mandi_name="Vashi APMC Mumbai", district="Thane", state="Maharashtra", modal_price=2150.0, min_price=1800.0, max_price=2500.0, distance_km=175.0, arrivals_tonnes=740.0, price_trend="up", trend_pct=5.5, market_status="Open & Trading"),
        MandiPrice(crop_name="Banana", variety="Robusta", mandi_name="Theni Banana APMC", district="Theni", state="Tamil Nadu", modal_price=1860.0, min_price=1580.0, max_price=2180.0, distance_km=1250.0, arrivals_tonnes=580.0, price_trend="up", trend_pct=3.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Banana", variety="Grand Naine (G9)", mandi_name="Jalgaon Banana Hub", district="Jalgaon", state="Maharashtra", modal_price=1780.0, min_price=1500.0, max_price=2050.0, distance_km=210.0, arrivals_tonnes=1100.0, price_trend="up", trend_pct=4.2, market_status="Open & Trading"),
        MandiPrice(crop_name="Banana", variety="Dwarf Cavendish", mandi_name="Hajipur Banana Yard", district="Vaishali", state="Bihar", modal_price=1690.0, min_price=1420.0, max_price=1950.0, distance_km=1380.0, arrivals_tonnes=480.0, price_trend="stable", trend_pct=0.9, market_status="Open & Trading"),

        # ── GRAPES ──
        MandiPrice(crop_name="Grapes", variety="Thompson Seedless (Export Grade)", mandi_name="Azadpur Mandi", district="Delhi", state="Delhi", modal_price=8800.0, min_price=7600.0, max_price=10200.0, distance_km=1150.0, arrivals_tonnes=420.0, price_trend="up", trend_pct=7.2, market_status="Open & Trading"),
        MandiPrice(crop_name="Grapes", variety="Sharad Seedless (Black)", mandi_name="Vashi APMC Mumbai", district="Thane", state="Maharashtra", modal_price=8400.0, min_price=7200.0, max_price=9800.0, distance_km=175.0, arrivals_tonnes=380.0, price_trend="up", trend_pct=6.1, market_status="Open & Trading"),
        MandiPrice(crop_name="Grapes", variety="Thompson Seedless", mandi_name="Nashik Grape Yard", district="Nashik", state="Maharashtra", modal_price=7850.0, min_price=6800.0, max_price=9100.0, distance_km=18.0, arrivals_tonnes=890.0, price_trend="up", trend_pct=5.4, market_status="Open & Trading"),
        MandiPrice(crop_name="Grapes", variety="Tas-A-Ganesh", mandi_name="Tasgaon Grape APMC", district="Sangli", state="Maharashtra", modal_price=7450.0, min_price=6500.0, max_price=8600.0, distance_km=360.0, arrivals_tonnes=540.0, price_trend="up", trend_pct=4.1, market_status="Open & Trading"),

        # ── CITRUS / LEMON / ORANGE ──
        MandiPrice(crop_name="Citrus / Lemon", variety="Nagpur Orange (Grade A)", mandi_name="Vashi APMC Mumbai", district="Thane", state="Maharashtra", modal_price=5350.0, min_price=4600.0, max_price=6200.0, distance_km=175.0, arrivals_tonnes=360.0, price_trend="up", trend_pct=6.3, market_status="Open & Trading"),
        MandiPrice(crop_name="Citrus / Lemon", variety="Nagpur Mandarin Orange", mandi_name="Nagpur Orange APMC Yard", district="Nagpur", state="Maharashtra", modal_price=4850.0, min_price=4100.0, max_price=5650.0, distance_km=480.0, arrivals_tonnes=820.0, price_trend="up", trend_pct=4.9, market_status="Open & Trading"),
        MandiPrice(crop_name="Citrus / Lemon", variety="Mosambi (Sweet Lime)", mandi_name="Pune APMC Market", district="Pune", state="Maharashtra", modal_price=4680.0, min_price=4050.0, max_price=5400.0, distance_km=190.0, arrivals_tonnes=440.0, price_trend="stable", trend_pct=0.7, market_status="Open & Trading"),
        MandiPrice(crop_name="Citrus / Lemon", variety="Kagzi Lime / Lemon", mandi_name="Amravati APMC Market", district="Amravati", state="Maharashtra", modal_price=4420.0, min_price=3800.0, max_price=5100.0, distance_km=410.0, arrivals_tonnes=290.0, price_trend="up", trend_pct=3.2, market_status="Open & Trading"),

        # ── TUR / ARHAR DAL ──
        MandiPrice(crop_name="Tur / Arhar Dal", variety="White Maruti Tur", mandi_name="Latur Pulse Mandi", district="Latur", state="Maharashtra", modal_price=9650.0, min_price=9000.0, max_price=10400.0, distance_km=320.0, arrivals_tonnes=780.0, price_trend="up", trend_pct=4.8, market_status="Open & Trading"),
        MandiPrice(crop_name="Tur / Arhar Dal", variety="Gulbarga Red Tur", mandi_name="Kalaburagi / Gulbarga APMC", district="Kalaburagi", state="Karnataka", modal_price=9480.0, min_price=8800.0, max_price=10200.0, distance_km=410.0, arrivals_tonnes=620.0, price_trend="up", trend_pct=3.7, market_status="Open & Trading"),
        MandiPrice(crop_name="Tur / Arhar Dal", variety="Desi Tur", mandi_name="Akola Pulse Yard", district="Akola", state="Maharashtra", modal_price=9380.0, min_price=8750.0, max_price=10050.0, distance_km=60.0, arrivals_tonnes=540.0, price_trend="up", trend_pct=2.9, market_status="Open & Trading"),

        # ── CHANA / BENGAL GRAM ──
        MandiPrice(crop_name="Chana / Gram", variety="Desi Chana (JG-11)", mandi_name="Indore Grain Mandi", district="Indore", state="Madhya Pradesh", modal_price=5980.0, min_price=5600.0, max_price=6400.0, distance_km=390.0, arrivals_tonnes=680.0, price_trend="up", trend_pct=3.4, market_status="Open & Trading"),
        MandiPrice(crop_name="Chana / Gram", variety="Bikaner Desi Chana", mandi_name="Bikaner Grain Mandi", district="Bikaner", state="Rajasthan", modal_price=5890.0, min_price=5500.0, max_price=6320.0, distance_km=890.0, arrivals_tonnes=510.0, price_trend="up", trend_pct=2.6, market_status="Open & Trading"),
        MandiPrice(crop_name="Chana / Gram", variety="Vishal Chana", mandi_name="Latur APMC Market", district="Latur", state="Maharashtra", modal_price=5820.0, min_price=5450.0, max_price=6250.0, distance_km=320.0, arrivals_tonnes=440.0, price_trend="stable", trend_pct=0.6, market_status="Open & Trading")
    ]

def seed_mandi_prices_only(db: Session):
    mandi_records = get_all_mandi_seed_records()
    for m in mandi_records:
        db.add(m)
    db.commit()

def seed_database(db: Session):
    """
    Populates rich, realistic Indian agricultural data for Smart Krishi Connect.
    """
    now = datetime.now(timezone.utc)

    # Check if users already seeded
    if db.query(User).first():
        # Ensure complete mandi prices are always populated
        if db.query(MandiPrice).count() < 40:
            db.query(MandiPrice).delete()
            db.commit()
            # Seed updated mandi prices
            seed_mandi_prices_only(db)
        return

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
            transporter_id=None,
            crop_name="Tomato Crates (35 Qtl)",
            load_quintals=35.0,
            vehicle_type="Pickup Truck (Mahindra Bolero Maxi)",
            pickup_location="Dindori Farm, Nashik",
            drop_location="Vashi APMC Market, Navi Mumbai",
            distance_km=175.0,
            base_rate=650.0,
            rate_per_km=16.0,
            calculated_price=3450.0,
            status="available",
            tracking_lat=19.9975,
            tracking_lng=73.7898,
            created_at=now - timedelta(hours=1)
        ),
        TransportJob(
            id=3,
            order_id=None,
            farmer_id=1,
            transporter_id=None,
            crop_name="Sharbati Wheat (45 Qtl)",
            load_quintals=45.0,
            vehicle_type="Tractor-Trolley / 6-Wheeler",
            pickup_location="Pimpalgaon Farm, Nashik",
            drop_location="Choithram Mandi, Indore, MP",
            distance_km=390.0,
            base_rate=850.0,
            rate_per_km=15.0,
            calculated_price=6700.0,
            status="available",
            tracking_lat=20.1700,
            tracking_lng=73.9800,
            created_at=now - timedelta(hours=2)
        ),
        TransportJob(
            id=4,
            order_id=None,
            farmer_id=1,
            transporter_id=None,
            crop_name="Yellow Soybean (60 Qtl)",
            load_quintals=60.0,
            vehicle_type="Eicher 6-Wheeler Medium Duty",
            pickup_location="Niphad Farm Yard, Nashik",
            drop_location="Pune APMC Market, Gultekdi",
            distance_km=190.0,
            base_rate=1200.0,
            rate_per_km=20.0,
            calculated_price=5000.0,
            status="available",
            tracking_lat=20.0800,
            tracking_lng=74.1100,
            created_at=now - timedelta(hours=3)
        ),
        TransportJob(
            id=5,
            order_id=None,
            farmer_id=1,
            transporter_id=7,
            crop_name="Export Quality Grapes (50 Qtl)",
            load_quintals=50.0,
            vehicle_type="Refrigerated Reefer Van (Cold Chain)",
            pickup_location="Dindori Vineyard, Nashik",
            drop_location="Nhava Sheva Port Cold Terminal, JNPT",
            distance_km=210.0,
            base_rate=1500.0,
            rate_per_km=26.0,
            calculated_price=6960.0,
            status="in_transit",
            tracking_lat=19.2183,
            tracking_lng=72.9781,
            created_at=now - timedelta(hours=5)
        ),
        TransportJob(
            id=6,
            order_id=None,
            farmer_id=1,
            transporter_id=7,
            crop_name="Garwa Red Onion (85 Qtl)",
            load_quintals=85.0,
            vehicle_type="10-Ton Multi-Axle Truck",
            pickup_location="Lasalgaon Mandi Yard, Nashik",
            drop_location="Pune Market Yard, Swargate",
            distance_km=195.0,
            base_rate=1800.0,
            rate_per_km=24.0,
            calculated_price=6480.0,
            status="delivered",
            tracking_lat=18.5204,
            tracking_lng=73.8567,
            created_at=now - timedelta(days=1)
        )
    ]
    for j in jobs_data:
        db.add(j)
    db.commit()

    # 6. Real-Time APMC Mandi Prices
    seed_mandi_prices_only(db)

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
