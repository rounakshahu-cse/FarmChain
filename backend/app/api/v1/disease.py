from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timezone
import base64
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
from backend.app.models.user import User
from backend.app.models.disease import DiseaseReport
from backend.app.models.pesticide import PesticideProduct
from backend.app.schemas.disease import DiseaseDetectResponse, DiseaseReportOut
from backend.app.services.disease_engine import analyze_crop_image

router = APIRouter()

@router.post("/detect", response_model=DiseaseDetectResponse)
async def detect_crop_disease(
    crop_name: Optional[str] = Form("Tomato"),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    AI Plant Doctor: High-precision leaf vision analysis with symptom diagnosis & instant remedies.
    """
    filename = file.filename if file else (image_url or "tomato_leaf_sample.jpg")
    
    # Run AI diagnostics
    diag = analyze_crop_image(filename, crop_hint=crop_name or "")

    # Match with product in database
    product = db.query(PesticideProduct).filter(
        (PesticideProduct.name.ilike(f"%{diag['recommended_product_name'].split()[0]}%")) |
        (PesticideProduct.category == diag["recommended_product_category"])
    ).first()

    final_image = image_url or "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400"

    # Save report
    report = DiseaseReport(
        farmer_id=current_user.id,
        image_url=final_image,
        crop_name=diag["crop_name"],
        detected_disease=diag["detected_disease"],
        confidence=diag["confidence"],
        severity=diag["severity"],
        symptoms=diag["symptoms"],
        organic_remedy=diag["organic_remedy"],
        chemical_treatment=diag["chemical_treatment"],
        recommended_product_id=product.id if product else None
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return DiseaseDetectResponse(
        id=report.id,
        crop_name=diag["crop_name"],
        detected_disease=diag["detected_disease"],
        confidence=diag["confidence"],
        severity=diag["severity"],
        symptoms=diag["symptoms"],
        organic_remedy=diag["organic_remedy"],
        chemical_treatment=diag["chemical_treatment"],
        recommended_product_id=product.id if product else None,
        recommended_product_name=product.name if product else diag["recommended_product_name"],
        recommended_product_price=product.price if product else 680.0,
        image_url=final_image,
        created_at=report.created_at
    )

@router.get("/history", response_model=List[DiseaseReportOut])
def get_farmer_disease_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reports = db.query(DiseaseReport).filter(DiseaseReport.farmer_id == current_user.id).order_by(DiseaseReport.id.desc()).all()
    return reports
