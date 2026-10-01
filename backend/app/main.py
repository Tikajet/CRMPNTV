from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from .database import get_db, init_db
from .models import Usuario, UserRole, Lead, LeadStatus, Plano
from .auth import verify_password, get_password_hash, create_access_token
from .schemas import LeadCreate, LeadOut, UsuarioCreate, UsuarioOut

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
    try:
        init_db()
    except Exception as e:
        print(f"Erro ao inicializar DB: {e}")

@app.get("/")
def read_root():
    return {
        "sistema": "PINHAISNET CRM",
        "status": "Online",
        "slogan": "Gestão inteligente, vendas eficientes."
    }

@app.post("/seed")
def seed_initial_data(db: Session = Depends(get_db)):
    try:
        init_db()
        
        # Procura Admin
        admin = db.query(Usuario).filter(Usuario.email == "admin@pinhaisnet.com.br").first()
        if not admin:
            senha_hash = get_password_hash("admin123")
            admin = Usuario(
                nome="Administrador PinhaisNet",
                cpf="000.000.000-00",
                email="admin@pinhaisnet.com.br",
                senha_hash=senha_hash,
                cargo=UserRole.ADMIN,
                telefone="(41) 99999-9999"
            )
            db.add(admin)

        # Procura Planos
        if db.query(Plano).count() == 0:
            planos = [
                Plano(nome="PinhaisNet 300 Mega", download_mbps=300, upload_mbps=150, valor_mensal=89.90, taxa_instalacao=0.00, descricao="Fibra Óptica Ultra Rápida"),
                Plano(nome="PinhaisNet 600 Mega", download_mbps=600, upload_mbps=300, valor_mensal=119.90, taxa_instalacao=0.00, descricao="Ideal para Gamers e Home Office"),
                Plano(nome="PinhaisNet 1 Giga", download_mbps=1000, upload_mbps=500, valor_mensal=169.90, taxa_instalacao=0.00, descricao="Velocidade máxima para toda a família")
            ]
            db.add_all(planos)

        db.commit()
        return {"status": "sucesso", "message": "Dados inicializados com sucesso! Login: admin@pinhaisnet.com.br / Senha: admin123"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

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

@app.get("/leads", response_model=List[LeadOut])
def listar_leads(db: Session = Depends(get_db)):
    return db.query(Lead).all()

@app.post("/leads", response_model=LeadOut)
def criar_lead(lead_in: LeadCreate, db: Session = Depends(get_db)):
    novo_lead = Lead(**lead_in.model_dump())
    db.add(novo_lead)
    db.commit()
    db.refresh(novo_lead)
    return novo_lead
