from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user, require_roles
from backend.app.models.user import User
from backend.app.models.pesticide import PesticideProduct, PesticideOrder
from backend.app.models.notification import Notification
from backend.app.schemas.pesticide import (
    PesticideProductCreate, PesticideProductOut,
    PesticideOrderCreate, PesticideOrderOut
)

router = APIRouter()

def format_product_out(p: PesticideProduct, db: Session) -> PesticideProductOut:
    seller = db.query(User).filter(User.id == p.seller_id).first()
    return PesticideProductOut(
        id=p.id,
        seller_id=p.seller_id,
        seller_name=seller.name if seller else "Verified Agri Center",
        seller_location=seller.location if seller else "Nashik, Maharashtra",
        name=p.name,
        brand=p.brand,
        category=p.category,
        target_crops=p.target_crops,
        target_pests=p.target_pests,
        price=p.price,
        unit=p.unit,
        stock=p.stock,
        is_verified_seller=p.is_verified_seller,
        rating=p.rating,
        image_url=p.image_url,
        description=p.description,
        usage_instructions=p.usage_instructions,
        created_at=p.created_at
    )

@router.get("/", response_model=List[PesticideProductOut])
def get_pesticides(
    category: Optional[str] = None,
    query: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(PesticideProduct)
    if category and category != "all":
        q = q.filter(PesticideProduct.category == category)
    if query:
        q = q.filter(
            (PesticideProduct.name.ilike(f"%{query}%")) |
            (PesticideProduct.target_crops.ilike(f"%{query}%")) |
            (PesticideProduct.target_pests.ilike(f"%{query}%")) |
            (PesticideProduct.brand.ilike(f"%{query}%"))
        )
    products = q.order_by(PesticideProduct.rating.desc()).all()
    return [format_product_out(p, db) for p in products]

@router.get("/{product_id}", response_model=PesticideProductOut)
def get_pesticide_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(PesticideProduct).filter(PesticideProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return format_product_out(product, db)

@router.post("/", response_model=PesticideProductOut)
def create_pesticide_product(
    product_in: PesticideProductCreate,
    current_user: User = Depends(require_roles("seller")),
    db: Session = Depends(get_db)
):
    new_product = PesticideProduct(
        seller_id=current_user.id,
        name=product_in.name,
        brand=product_in.brand,
        category=product_in.category,
        target_crops=product_in.target_crops,
        target_pests=product_in.target_pests,
        price=product_in.price,
        unit=product_in.unit,
        stock=product_in.stock,
        is_verified_seller=True,
        rating=4.9,
        image_url=product_in.image_url or "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300",
        description=product_in.description,
        usage_instructions=product_in.usage_instructions
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return format_product_out(new_product, db)

@router.post("/order", response_model=PesticideOrderOut)
def order_pesticide(
    order_in: PesticideOrderCreate,
    current_user: User = Depends(require_roles("farmer")),
    db: Session = Depends(get_db)
):
    product = db.query(PesticideProduct).filter(PesticideProduct.id == order_in.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    total_price = round(product.price * order_in.quantity, 2)

    new_order = PesticideOrder(
        farmer_id=current_user.id,
        product_id=product.id,
        quantity=order_in.quantity,
        total_price=total_price,
        delivery_address=order_in.delivery_address,
        status="ordered"
    )
    db.add(new_order)

    # Notify Seller
    notif_seller = Notification(
        user_id=product.seller_id,
        title="🛍️ New Input Order Placed!",
        message=f"{current_user.name} ordered {order_in.quantity}x {product.name}. Delivery Address: {order_in.delivery_address}. Total: ₹{int(total_price)}.",
        type="pesticide_order",
        is_read=False,
        link="/seller/orders"
    )
    db.add(notif_seller)
    db.commit()
    db.refresh(new_order)

    return PesticideOrderOut(
        id=new_order.id,
        farmer_id=new_order.farmer_id,
        product_id=new_order.product_id,
        product_name=product.name,
        quantity=new_order.quantity,
        total_price=new_order.total_price,
        delivery_address=new_order.delivery_address,
        status=new_order.status,
        created_at=new_order.created_at
    )
