from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models.mandi import MandiPrice
from backend.app.schemas.mandi import MandiPriceOut, MandiAnalysisResponse
from backend.app.services.transport_engine import calculate_transport_options
from backend.app.services.seed_data import seed_mandi_prices_only

router = APIRouter()

def normalize_crop_name(raw_name: str) -> str:
    c = raw_name.strip().lower()
    if any(w in c for w in ["wheat", "gehun", "gehu", "gahu", "sharbati wheat"]):
        return "Wheat"
    if any(w in c for w in ["soy", "soya"]):
        return "Soybean"
    if any(w in c for w in ["cotton", "kapas", "bt-cotton", "bt cotton"]):
        return "Cotton"
    if any(w in c for w in ["tomato", "tamatar", "tomat"]):
        return "Tomato"
    if any(w in c for w in ["onion", "kanda", "pyaz"]):
        return "Red Onion"
    if any(w in c for w in ["rice", "paddy", "dhan", "basmati", "chawal"]):
        return "Basmati Rice"
    if any(w in c for w in ["potato", "aloo", "batata"]):
        return "Potato"
    if any(w in c for w in ["chilli", "chili", "mirch", "mirchi", "pepper"]):
        return "Chilli / Pepper"
    if any(w in c for w in ["sugar", "ganna", "oos"]):
        return "Sugarcane"
    if any(w in c for w in ["maize", "corn", "maka", "bhutta"]):
        return "Maize / Corn"
    if any(w in c for w in ["groundnut", "peanut", "moongfali", "bhuimug"]):
        return "Groundnut / Peanut"
    if any(w in c for w in ["mustard", "sarson", "rai", "mohari"]):
        return "Mustard"
    if any(w in c for w in ["banana", "kela", "keli"]):
        return "Banana"
    if any(w in c for w in ["grape", "angoor", "draksh"]):
        return "Grapes"
    if any(w in c for w in ["citrus", "orange", "lemon", "lime", "santra", "mosambi", "nimbu", "limbu"]):
        return "Citrus / Lemon"
    if any(w in c for w in ["tur", "arhar", "tuvar", "pigeon pea"]):
        return "Tur / Arhar Dal"
    if any(w in c for w in ["chana", "gram", "harbhara", "bengal gram"]):
        return "Chana / Gram"
    return raw_name.strip()

@router.get("/prices", response_model=MandiAnalysisResponse)
def get_mandi_prices(
    crop: str = Query("Wheat", description="Crop name to analyze"),
    farmer_location: str = Query("Nashik, Maharashtra", description="Farmer location"),
    quantity_quintals: float = Query(10.0, description="Estimated batch quantity"),
    db: Session = Depends(get_db)
):
    # Auto-seed if database doesn't have complete real mandi prices
    if db.query(MandiPrice).count() < 40:
        db.query(MandiPrice).delete()
        db.commit()
        seed_mandi_prices_only(db)

    canonical_crop = normalize_crop_name(crop)

    # Strictly query mandis matching the canonical crop name
    query = db.query(MandiPrice).filter(MandiPrice.crop_name == canonical_crop).all()

    if not query:
        # Fallback to case-insensitive partial match
        query = db.query(MandiPrice).filter(MandiPrice.crop_name.ilike(f"%{canonical_crop}%")).all()
        if not query:
            query = db.query(MandiPrice).limit(6).all()

    processed_mandis: List[MandiPriceOut] = []
    best_mandi = None
    max_net_price = -1.0

    for m in query:
        # Calculate realistic freight cost to this mandi
        dist = m.distance_km or 25.0
        t_res = calculate_transport_options(load_quintals=quantity_quintals, distance_km=dist)
        freight_total = t_res["recommended_cost"]
        freight_per_qtl = round(freight_total / max(1.0, quantity_quintals), 2)
        
        # Net Realized Price = Mandi Gross Rate - Freight per Quintal
        net_price = round(m.modal_price - freight_per_qtl, 2)

        m_out = MandiPriceOut(
            id=m.id,
            crop_name=m.crop_name,
            variety=m.variety,
            mandi_name=m.mandi_name,
            district=m.district,
            state=m.state,
            modal_price=m.modal_price,
            min_price=m.min_price,
            max_price=m.max_price,
            distance_km=m.distance_km,
            arrivals_tonnes=m.arrivals_tonnes or 120.0,
            price_trend=m.price_trend,
            trend_pct=m.trend_pct,
            market_status=m.market_status or "Open & Trading",
            updated_at=m.updated_at,
            estimated_transport_cost=freight_per_qtl,
            net_realized_price=net_price,
            is_best_mandi=False
        )

        if net_price > max_net_price:
            max_net_price = net_price
            best_mandi = m_out

        processed_mandis.append(m_out)

    if best_mandi:
        best_mandi.is_best_mandi = True
        # Sort processed mandis by net realized price descending
        processed_mandis.sort(key=lambda x: x.net_realized_price or 0, reverse=True)

    return MandiAnalysisResponse(
        crop_name=canonical_crop,
        farmer_location=farmer_location,
        total_quantity_quintals=quantity_quintals,
        best_mandi=best_mandi,
        all_mandis=processed_mandis
    )

@router.get("/all", response_model=List[MandiPriceOut])
def get_all_mandi_feeds(
    state: Optional[str] = None,
    crop: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if db.query(MandiPrice).count() < 40:
        db.query(MandiPrice).delete()
        db.commit()
        seed_mandi_prices_only(db)

    q = db.query(MandiPrice)
    if state and state.strip() and state.lower() != "all":
        q = q.filter(MandiPrice.state.ilike(f"%{state.strip()}%"))
    if crop and crop.strip() and crop.lower() != "all":
        canon = normalize_crop_name(crop)
        q = q.filter(MandiPrice.crop_name == canon)
    if search and search.strip():
        s = f"%{search.strip()}%"
        q = q.filter(
            or_(
                MandiPrice.mandi_name.ilike(s),
                MandiPrice.district.ilike(s),
                MandiPrice.state.ilike(s),
                MandiPrice.crop_name.ilike(s),
                MandiPrice.variety.ilike(s)
            )
        )

    mandis = q.all()
    return [
        MandiPriceOut(
            id=m.id,
            crop_name=m.crop_name,
            variety=m.variety,
            mandi_name=m.mandi_name,
            district=m.district,
            state=m.state,
            modal_price=m.modal_price,
            min_price=m.min_price,
            max_price=m.max_price,
            distance_km=m.distance_km,
            arrivals_tonnes=m.arrivals_tonnes or 120.0,
            price_trend=m.price_trend,
            trend_pct=m.trend_pct,
            market_status=m.market_status or "Open & Trading",
            updated_at=m.updated_at,
            estimated_transport_cost=0.0,
            net_realized_price=m.modal_price,
            is_best_mandi=False
        )
        for m in mandis
    ]

