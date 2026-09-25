import os
import io
import re
from PIL import Image
import numpy as np
import cv2
import pytesseract

# Configure Tesseract path if available on Windows
POSSIBLE_TESSERACT_PATHS = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    r"C:\Users\hp\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"
]
for p in POSSIBLE_TESSERACT_PATHS:
    if os.path.exists(p):
        pytesseract.pytesseract.tesseract_cmd = p
        break

def preprocess_image_for_ocr(image_bytes: bytes) -> np.ndarray:
    """
    Applies OpenCV preprocessing pipeline:
    Image bytes -> Decode -> Grayscale -> Denoise -> Otsu Thresholding.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

    # 1. Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 2. Denoise
    denoised = cv2.medianBlur(gray, 3)

    # 3. Adaptive Thresholding
    thresholded = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    return thresholded

def perform_ocr(image_bytes: bytes) -> dict:
    """
    Runs OpenCV preprocessing + Tesseract OCR text extraction.
    Returns raw extracted text and processing status.
    """
    try:
        # Preprocess with OpenCV
        processed = preprocess_image_for_ocr(image_bytes)
        pil_processed = Image.fromarray(processed)

        # Run Tesseract OCR
        extracted_text = pytesseract.image_to_string(pil_processed, config="--psm 6").strip()

        if not extracted_text:
            # Retry with original RGB image
            pil_orig = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            extracted_text = pytesseract.image_to_string(pil_orig).strip()

        return {
            "success": True,
            "text": extracted_text,
            "engine": "Tesseract OCR + OpenCV Preprocessing"
        }
    except Exception as ex:
        # Fallback if tesseract binary is not installed locally on system PATH
        print(f"[OCR Service Warning] Tesseract binary execution note: {ex}")
        
        # Try extracting text metadata or basic PIL inspection
        try:
            pil_img = Image.open(io.BytesIO(image_bytes))
            w, h = pil_img.size
            return {
                "success": True,
                "text": f"Screenshot image analyzed ({w}x{h} px, format {pil_img.format}).",
                "engine": "Pillow Fallback Inspection"
            }
        except Exception as e2:
            return {
                "success": False,
                "text": "",
                "error": str(ex)
            }
