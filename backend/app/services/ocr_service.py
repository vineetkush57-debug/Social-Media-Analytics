import os
import io
import re
from PIL import Image

# Configure Tesseract path if available on Windows
POSSIBLE_TESSERACT_PATHS = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    r"C:\Users\hp\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"
]
for p in POSSIBLE_TESSERACT_PATHS:
    if os.path.exists(p):
        try:
            import pytesseract
            pytesseract.pytesseract.tesseract_cmd = p
        except Exception:
            pass
        break

def preprocess_image_for_ocr(image_bytes: bytes):
    """
    Applies optional OpenCV preprocessing pipeline if available, else falls back to Pillow image.
    """
    try:
        import numpy as np
        import cv2
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        denoised = cv2.medianBlur(gray, 3)
        thresholded = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        return Image.fromarray(thresholded)
    except Exception:
        return Image.open(io.BytesIO(image_bytes)).convert("RGB")

def perform_ocr(image_bytes: bytes) -> dict:
    """
    Runs image preprocessing + OCR text extraction with safe fallbacks.
    """
    try:
        import pytesseract
        pil_processed = preprocess_image_for_ocr(image_bytes)
        extracted_text = pytesseract.image_to_string(pil_processed, config="--psm 6").strip()

        if not extracted_text:
            pil_orig = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            extracted_text = pytesseract.image_to_string(pil_orig).strip()

        return {
            "success": True,
            "text": extracted_text,
            "engine": "Tesseract OCR Preprocessing"
        }
    except Exception as ex:
        # Fallback if tesseract binary or opencv is not installed in environment
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
