# pyrefly: ignore [missing-import
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timezone
import base64
from urllib.parse import urlparse
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
from backend.app.models.user import User
from backend.app.models.disease import DiseaseReport
from backend.app.models.pesticide import PesticideProduct
from backend.app.schemas.disease import DiseaseDetectResponse, DiseaseReportOut
from backend.app.services.disease_engine import analyze_crop_image

router = APIRouter()

MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5 MB
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

def _is_valid_image(content_type: Optional[str], data: bytes) -> bool:
    if not content_type or content_type.lower() not in ALLOWED_IMAGE_TYPES:
        return False
    # Verify magic bytes instead of trusting the client-supplied content type
    if data[:3] == b"\xff\xd8\xff":  # JPEG
        return True
    if data[:8] == b"\x89PNG\r\n\x1a\n":  # PNG
        return True
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":  # WEBP
        return True
    if data[:6] in (b"GIF87a", b"GIF89a"):  # GIF
        return True
    return False

def _is_safe_http_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except ValueError:
        return False

@router.post("/detect", response_model=DiseaseDetectResponse)
async def detect_crop_disease(
    crop_name: Optional[str] = Form("Tomato"),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    AI Plant Doctor & Crop Health Diagnostic Engine:
    Step 1: Botanical Crop Identification
    Step 2: Crop-Specific Leaf Vision Pathology & Targeted Agronomic Protocols
    """
    file_bytes: Optional[bytes] = None
    final_image = image_url or "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400"
    filename = "sample_leaf.jpg"

    if image_url and not _is_safe_http_url(image_url):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="image_url must be a valid http(s) URL",
        )

    if file:
        filename = file.filename or "uploaded_crop_leaf.jpg"
        file_bytes = await file.read()
        if file_bytes and len(file_bytes) > 0:
            if len(file_bytes) > MAX_UPLOAD_BYTES:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="Image too large. Maximum allowed size is 5 MB.",
                )
            if not _is_valid_image(file.content_type, file_bytes):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid file type. Please upload a JPEG, PNG, WebP or GIF image.",
                )
            # Base64 is returned to the client for instant rendering, but is
            # never persisted to the database (keeps DB small / low egress).
            b64 = base64.b64encode(file_bytes).decode("utf-8")
            final_image = f"data:{file.content_type};base64,{b64}"
    elif image_url:
        filename = image_url.split("/")[-1].split("?")[0] or "sample_leaf.jpg"

    # Run Two-Stage AI Diagnostics
    diag = analyze_crop_image(filename, crop_hint=crop_name or "", file_bytes=file_bytes)

    # Match with verified product in database
    product = None
    if diag.get("recommended_product_name"):
        first_token = diag["recommended_product_name"].split()[0]
        product = db.query(PesticideProduct).filter(
            (PesticideProduct.name.ilike(f"%{first_token}%")) |
            (PesticideProduct.category == diag.get("recommended_product_category", ""))
        ).first()

    # Persist only a lightweight reference to the DB (never base64 blobs):
    # keeps the database small and avoids leaking large payloads on egress.
    db_image_url = image_url if image_url and _is_safe_http_url(image_url) else "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400"

    report = DiseaseReport(
        farmer_id=current_user.id,
        image_url=db_image_url,
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
        is_valid_plant=diag.get("is_valid_plant", True),
        crop_name=diag["crop_name"],
        botanical_name=diag.get("botanical_name"),
        crop_confidence=diag.get("crop_confidence", 98.5),
        detected_disease=diag["detected_disease"],
        pathogen_type=diag.get("pathogen_type"),
        causal_organism=diag.get("causal_organism"),
        confidence=diag["confidence"],
        severity=diag["severity"],
        infection_stage=diag.get("infection_stage"),
        yield_risk=diag.get("yield_risk"),
        symptoms=diag["symptoms"],
        diagnostic_markers=diag.get("diagnostic_markers", []),
        organic_remedy=diag["organic_remedy"],
        chemical_treatment=diag["chemical_treatment"],
        spray_dosage=diag.get("spray_dosage"),
        preventive_measures=diag.get("preventive_measures"),
        recommended_product_id=product.id if product else None,
        recommended_product_name=product.name if product else diag["recommended_product_name"],
        recommended_product_price=product.price if product else diag.get("recommended_product_price", 680.0),
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
