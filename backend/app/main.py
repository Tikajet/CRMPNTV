from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .database import get_db, init_db
from .models import Usuario, UserRole
from .auth import verify_password, get_password_hash, create_access_token

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

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def read_root():
    return {
        "sistema": "PINHAISNET CRM",
        "status": "Online",
        "slogan": "Gestão inteligente, vendas eficientes."
    }

@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.ativo:
        raise HTTPException(status_code=400, detail="Usuário inativo")

    access_token = create_access_token(data={"sub": str(user.id), "cargo": user.cargo})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario": {
            "id": str(user.id),
            "nome": user.nome,
            "email": user.email,
            "cargo": user.cargo
        }
    }
