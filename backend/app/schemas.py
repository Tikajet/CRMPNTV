from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class UsuarioBase(BaseModel):
    nome: str
    cpf: str
    email: EmailStr
    cargo: str
    telefone: Optional[str] = None
    meta_mensal: Optional[int] = 0

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioOut(UsuarioBase):
    id: UUID
    ativo: bool
    created_at: datetime
    class Config:
        from_attributes = True

class LeadBase(BaseModel):
    nome_completo: str
    cpf: Optional[str] = None
    telefone_principal: str
    whatsapp: Optional[str] = None
    email: Optional[EmailStr] = None
    bairro: str
    origem: str
    status: Optional[str] = "NOVO"

class LeadCreate(LeadBase):
    plano_interesse_id: Optional[UUID] = None

class LeadOut(LeadBase):
    id: UUID
    cidade: str
    vendedor_id: Optional[UUID] = None
    created_at: datetime
    class Config:
        from_attributes = True
