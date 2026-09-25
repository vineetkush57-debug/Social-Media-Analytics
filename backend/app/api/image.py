import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.services.ocr_service import perform_ocr
from backend.app.services.image_analysis import analyze_screenshot_text
from backend.app.services.entity_service import generate_entity_intelligence

router = APIRouter(prefix="/api/image", tags=["Image Intelligence"])

MAX_IMAGE_SIZE_MB = int(os.getenv("MAX_IMAGE_SIZE_MB", "10"))
ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]

# Temporary in-memory status store
JOB_STATUS_STORE = {}

@router.post("/upload")
async def upload_single_image(file: UploadFile = File(...)):
    """
    Accepts a single screenshot file, validates format and size, executes OCR,
    extracts text & entities, and returns structured OCR payload.
    """
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="Empty upload. Please select an image file.")

    filename = file.filename
    ext = os.path.splitext(filename.lower())[1]

    if ext not in ALLOWED_EXTENSIONS and file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image format ({ext or file.content_type}). Allowed formats: JPG, PNG, WEBP."
        )

    contents = await file.read()
    file_size_mb = len(contents) / (1024 * 1024)

    if file_size_mb > MAX_IMAGE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"Image size ({file_size_mb:.1f} MB) exceeds maximum allowed size ({MAX_IMAGE_SIZE_MB} MB)."
        )

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")

    job_id = str(uuid.uuid4())[:8]
    JOB_STATUS_STORE[job_id] = "OCR Processing..."

    # 1. Run OCR
    ocr_res = perform_ocr(contents)

    if not ocr_res.get("success"):
        JOB_STATUS_STORE[job_id] = "OCR Error"
        raise HTTPException(status_code=500, detail=f"OCR Processing failed: {ocr_res.get('error')}")

    ocr_text = ocr_res.get("text", "").strip()

    # 2. Extract Entities, Hashtags, Usernames, Keywords, Platform, Timestamp, Sentiment
    JOB_STATUS_STORE[job_id] = "Extracting Entities..."
    analysis = analyze_screenshot_text(ocr_text, filename=filename)
    analysis["job_id"] = job_id
    analysis["file_size_mb"] = round(file_size_mb, 2)
    analysis["engine"] = ocr_res.get("engine", "Tesseract OCR")

    JOB_STATUS_STORE[job_id] = "Complete"
    return analysis

@router.post("/analyze")
async def analyze_image_with_entity_engine(
    query: str,
    ocr_text: Optional[str] = "",
    platform: Optional[str] = "Unknown",
    db: Session = Depends(get_db)
):
    """
    Connects the OCR image result to the Entity Intelligence Engine.
    Separates SCREENSHOT ANALYSIS from SOCIAL MEDIA INTELLIGENCE.
    """
    if not query or not query.strip():
        raise HTTPException(status_code=400, detail="Entity query string cannot be empty.")

    clean_q = query.strip()
    # Execute full entity intelligence query
    entity_intel = generate_entity_intelligence(clean_q, db)

    # Label source mode explicitly
    has_db_records = not entity_intel.get("is_demo_mode", True)
    if has_db_records:
        source_label = "IMAGE + UPLOADED DATASET"
    else:
        source_label = "IMAGE + DEMO DATA"

    return {
        "success": True,
        "query": clean_q,
        "source_label": source_label,
        "screenshot_analysis": {
            "query_detected": clean_q,
            "ocr_text": ocr_text,
            "platform": platform
        },
        "social_media_intelligence": entity_intel
    }

@router.post("/upload-multiple")
async def upload_multiple_images(files: List[UploadFile] = File(...)):
    """
    Accepts multiple screenshot files, processes each independently, deduplicates OCR text,
    combines context, and detects common entities and hashtags.
    """
    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="No image files provided.")

    results = []
    all_texts = []
    all_entities = []
    all_hashtags = []
    errors = []

    for f in files:
        try:
            filename = f.filename or "image.png"
            contents = await f.read()
            if len(contents) == 0:
                errors.append({"filename": filename, "error": "Empty file (0 bytes)"})
                continue

            ocr_res = perform_ocr(contents)
            text = ocr_res.get("text", "").strip()
            analysis = analyze_screenshot_text(text, filename=filename)
            results.append(analysis)

            if text:
                all_texts.append(text)
            all_entities.extend(analysis.get("entities", []))
            all_hashtags.extend(analysis.get("hashtags", []))

        except Exception as ex:
            errors.append({"filename": getattr(f, "filename", "unknown"), "error": str(ex)})

    # Deduplicate common entities and hashtags
    common_entities = list(set(all_entities))
    common_hashtags = list(set(all_hashtags))
    combined_text = "\n---\n".join(all_texts)

    return {
        "images_analyzed": len(results),
        "results": results,
        "combined_text": combined_text,
        "common_entities": common_entities,
        "common_hashtags": common_hashtags,
        "errors": errors
    }

@router.get("/status/{job_id}")
def get_image_job_status(job_id: str):
    status = JOB_STATUS_STORE.get(job_id, "Complete")
    return {"job_id": job_id, "status": status}
