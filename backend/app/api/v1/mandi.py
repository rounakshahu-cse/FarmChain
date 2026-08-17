from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models.mandi import MandiPrice
from backend.app.schemas.mandi import MandiPriceOut, MandiAnalysisResponse
from backend.app.services.transport_engine import calculate_transport_options

router = APIRouter()

@router.get("/prices", response_model=MandiAnalysisResponse)
def get_mandi_prices(
    crop: str = Query("Soybean", description="Crop name to analyze"),
    farmer_location: str = Query("Nashik, Maharashtra", description="Farmer location"),
    quantity_quintals: float = Query(50.0, description="Estimated batch quantity"),
    db: Session = Depends(get_db)
):
    query = db.query(MandiPrice).filter(MandiPrice.crop_name.ilike(f"%{crop}%")).all()
    if not query:
        # Fallback to all prices if crop not found
        query = db.query(MandiPrice).limit(6).all()

    processed_mandis: List[MandiPriceOut] = []
    best_mandi = None
    max_net_price = -1.0

    for m in query:
        # Calculate freight cost to this mandi
        dist = m.distance_km or 25.0
        t_res = calculate_transport_options(load_quintals=quantity_quintals, distance_km=dist)
        freight_total = t_res["recommended_cost"]
        freight_per_qtl = round(freight_total / max(1.0, quantity_quintals), 2)
        
        # Net Realized Price = Mandi Price - Freight per Quintal
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
            price_trend=m.price_trend,
            trend_pct=m.trend_pct,
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
        crop_name=crop,
        farmer_location=farmer_location,
        total_quantity_quintals=quantity_quintals,
        best_mandi=best_mandi,
        all_mandis=processed_mandis
    )

@router.get("/all", response_model=List[MandiPriceOut])
def get_all_mandi_feeds(db: Session = Depends(get_db)):
    mandis = db.query(MandiPrice).all()
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
            price_trend=m.price_trend,
            trend_pct=m.trend_pct,
            updated_at=m.updated_at,
            estimated_transport_cost=0.0,
            net_realized_price=m.modal_price,
            is_best_mandi=False
        )
        for m in mandis
    ]
