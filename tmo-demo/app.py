import os
import uuid
from pathlib import Path

# OpenCV needs this flag before import on builds that support OpenEXR.
os.environ.setdefault("OPENCV_IO_ENABLE_OPENEXR", "1")

import cv2
import numpy as np
from flask import Flask, render_template, request, send_from_directory
from werkzeug.utils import secure_filename

from tmo.algorithms import reinhard_global, simple_preview


BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
ALLOWED_EXTENSIONS = {".hdr", ".exr", ".png", ".jpg", ".jpeg", ".tif", ".tiff"}

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024


def is_allowed_file(filename):
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


def read_image_as_rgb_float(path):
    image = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
    if image is None:
        raise ValueError("OpenCV could not read this file. Try a .hdr file first, or check EXR support.")

    if image.ndim == 2:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    elif image.shape[2] == 4:
        image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
    else:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    original_dtype = image.dtype
    image = image.astype(np.float32)
    if np.issubdtype(original_dtype, np.integer):
        image /= np.iinfo(original_dtype).max

    image = np.nan_to_num(image, nan=0.0, posinf=0.0, neginf=0.0)
    image = np.maximum(image, 0.0)
    return image


def save_rgb_png(image, path):
    image_8bit = np.clip(image * 255.0, 0, 255).astype(np.uint8)
    image_bgr = cv2.cvtColor(image_8bit, cv2.COLOR_RGB2BGR)
    cv2.imwrite(str(path), image_bgr)


@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    error = None

    if request.method == "POST":
        uploaded_file = request.files.get("hdr_file")
        exposure_key = float(request.form.get("key", 0.18))
        gamma = float(request.form.get("gamma", 2.2))

        if not uploaded_file or uploaded_file.filename == "":
            error = "Please choose an HDR image first."
        elif not is_allowed_file(uploaded_file.filename):
            error = "Unsupported file type. Please upload .hdr, .exr, .png, .jpg, .jpeg, .tif, or .tiff."
        else:
            try:
                job_id = uuid.uuid4().hex[:12]
                safe_name = secure_filename(uploaded_file.filename)
                upload_path = UPLOAD_DIR / f"{job_id}_{safe_name}"
                preview_path = OUTPUT_DIR / f"{job_id}_preview.png"
                reinhard_path = OUTPUT_DIR / f"{job_id}_reinhard.png"

                uploaded_file.save(upload_path)
                hdr_rgb = read_image_as_rgb_float(upload_path)

                preview = simple_preview(hdr_rgb, gamma=gamma)
                reinhard = reinhard_global(hdr_rgb, key=exposure_key, gamma=gamma)

                save_rgb_png(preview, preview_path)
                save_rgb_png(reinhard, reinhard_path)

                result = {
                    "filename": safe_name,
                    "preview_url": f"/outputs/{preview_path.name}",
                    "reinhard_url": f"/outputs/{reinhard_path.name}",
                    "key": exposure_key,
                    "gamma": gamma,
                }
            except Exception as exc:
                error = str(exc)

    return render_template("index.html", result=result, error=error)


@app.route("/outputs/<path:filename>")
def outputs(filename):
    return send_from_directory(OUTPUT_DIR, filename)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

