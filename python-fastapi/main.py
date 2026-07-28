import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from reloop_email import Reloop

# Load environment variables from .env
load_dotenv()

app = FastAPI(title="Alex's Python Reloop App")

# Initialize the official Reloop Python SDK
api_key = os.getenv("RELOOP_API_KEY")
if not api_key:
    raise RuntimeError("RELOOP_API_KEY environment variable is missing!")

reloop = Reloop(api_key=api_key)


# Pydantic model for request validation
class CreateKeyRequest(BaseModel):
    name: str


class UpdateKeyRequest(BaseModel):
    name: str


@app.get("/")
def read_root():
    return {"message": "Alex Python FastAPI App is online!"}


# ----------------------------------------------------
# 1. POST /api/api-keys - Create API Key
# ----------------------------------------------------
@app.post("/api/api-keys")
def create_api_key(req: CreateKeyRequest):
    try:
        # Call Reloop Python SDK: reloop.api_keys.create(...)
        result = reloop.api_keys.create(name=req.name)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ----------------------------------------------------
# 2. GET /api/api-keys - List API Keys
# ----------------------------------------------------
@app.get("/api/api-keys")
def list_api_keys(limit: int = Query(10), page: int = Query(1)):
    try:
        # Call Reloop Python SDK: reloop.api_keys.list(...)
        result = reloop.api_keys.list(limit=limit, page=page)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ----------------------------------------------------
# 3. GET /api/api-keys/{key_id} - Get API Key Details
# ----------------------------------------------------
@app.get("/api/api-keys/{key_id}")
def get_api_key(key_id: str):
    try:
        # Call Reloop Python SDK: reloop.api_keys.get(...)
        result = reloop.api_keys.get(key_id)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


# ----------------------------------------------------
# 4. PATCH /api/api-keys/{key_id} - Update / Rename API Key
# ----------------------------------------------------
@app.patch("/api/api-keys/{key_id}")
def update_api_key(key_id: str, req: UpdateKeyRequest):
    try:
        # Call Reloop Python SDK: reloop.api_keys.update(...)
        result = reloop.api_keys.update(key_id, name=req.name)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ----------------------------------------------------
# 5. POST /api/api-keys/{key_id}/disable - Disable API Key
# ----------------------------------------------------
@app.post("/api/api-keys/{key_id}/disable")
def disable_api_key(key_id: str):
    try:
        # Call Reloop Python SDK: reloop.api_keys.disable(...)
        result = reloop.api_keys.disable(key_id)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ----------------------------------------------------
# 6. POST /api/api-keys/{key_id}/enable - Enable API Key
# ----------------------------------------------------
@app.post("/api/api-keys/{key_id}/enable")
def enable_api_key(key_id: str):
    try:
        # Call Reloop Python SDK: reloop.api_keys.enable(...)
        result = reloop.api_keys.enable(key_id)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ----------------------------------------------------
# 7. POST /api/api-keys/{key_id}/rotate - Rotate API Key Secret
# ----------------------------------------------------
@app.post("/api/api-keys/{key_id}/rotate")
def rotate_api_key(key_id: str):
    try:
        # Call Reloop Python SDK: reloop.api_keys.rotate(...)
        result = reloop.api_keys.rotate(key_id)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ----------------------------------------------------
# 8. DELETE /api/api-keys/{key_id} - Delete API Key
# ----------------------------------------------------
@app.delete("/api/api-keys/{key_id}")
def delete_api_key(key_id: str):
    try:
        # Call Reloop Python SDK: reloop.api_keys.delete(...)
        result = reloop.api_keys.delete(key_id)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
