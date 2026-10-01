from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PINHAISNET CRM API",
    description="Backend oficial do PINHAISNET CRM - Gestão inteligente, vendas eficientes.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "sistema": "PINHAISNET CRM",
        "status": "Online",
        "slogan": "Gestão inteligente, vendas eficientes."
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
