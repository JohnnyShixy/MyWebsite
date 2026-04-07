# TMO Demo Backend

Minimal Flask backend for uploading an HDR image and running a global Reinhard
tone mapping operator.

## Local run

```powershell
cd "D:\CEL-Johnny\research\8-Website\tmo-demo"
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## Deploy idea

Deploy this folder as a separate backend project on Railway, Render, or a VPS.
After deployment, copy the public backend URL into the main website's Demo link.

## Add more TMO algorithms

Add functions in `tmo/algorithms.py`, call them from `app.py`, save each result
as a PNG, and add the URLs to the `result` object for display in the template.

For Render Web Service:

- Root Directory: `tmo-demo`
- Runtime: `Python 3`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`
