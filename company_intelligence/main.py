from fastapi import FastAPI, HTTPException

from public_intelligence import get_company_intelligence

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/company/{company_name}/intelligence")
def company_intelligence(company_name: str):
    try:
        return get_company_intelligence(company_name)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve company intelligence"
        )