import sys
from pathlib import Path

# Add project root directory to sys.path so 'backend.app...' imports resolve cleanly on Vercel
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.main import app
