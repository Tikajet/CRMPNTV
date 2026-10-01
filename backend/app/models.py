from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    GERENTE = "GERENTE"
    SUPERVISOR = "SUPERVISOR"
    VENDEDOR = "VENDEDOR"
    FINANCEIRO = "FINANCEIRO"

class LeadStatus(str, enum.Enum):
    NOVO = "NOVO"
    AGUARDANDO_ATENDIMENTO = "AGUARDANDO_ATENDIMENTO"
    PRIMEIRO_CONTATO = "PRIMEIRO_CONTATO"
    SEM_RESPOSTA = "SEM_RESPOSTA"
    EM_NEGOCIACAO = "EM_NEGOCIACAO"
    PROPOSTA_ENVIADA = "PROPOSTA_ENVIADA"
    AGUARDANDO_RETORNO = "AGUARDANDO_RETORNO"
    VENDA_CONCLUIDA = "VENDA_CONCLUIDA"
    VENDA_PERDIDA = "VENDA_PERDIDA"
    SEM_COBERTURA = "SEM_COBERTURA"
    INVALIDO = "INVALIDO"

class SaleStatus(str, enum.Enum):
    EM_PREENCHIMENTO = "EM_PREENCHIMENTO"
    AGUARDANDO_DOC = "AGUARDANDO_DOC"
    AGUARDANDO_ANALISE = "AGUARDANDO_ANALISE"
    APROVADA = "APROVADA"
    REPROVADA = "REPROVADA"
    AGUARDANDO_INSTALACAO = "AGUARDANDO_INSTALACAO"
    INSTALADA = "INSTALADA"
    CANCELADA = "CANCELADA"

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(150), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    cargo = Column(Enum(UserRole), default=UserRole.VENDEDOR)
    equipe_id = Column(UUID(as_uuid=True), nullable=True)
    supervisor_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=True)
    telefone = Column(String(20), nullable=True)
    meta_diaria = Column(Integer, default=0)
    meta_semanal = Column(Integer, default=0)
    meta_mensal = Column(Integer, default=0)
    comissao_padrao = Column(Numeric(5, 2), default=0.00)
    ativo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Plano(Base):
    __tablename__ = "planos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(100), nullable=False)
    download_mbps = Column(Integer, nullable=False)
    upload_mbps = Column(Integer, nullable=False)
    valor_mensal = Column(Numeric(10, 2), nullable=False)
    taxa_instalacao = Column(Numeric(10, 2), default=0.00)
    descricao = Column(String, nullable=True)
    regioes_disponiveis = Column(JSON, nullable=True)
    ativo = Column(Boolean, default=True)

class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome_completo = Column(String(150), nullable=False)
    cpf = Column(String(14), nullable=True)
    telefone_principal = Column(String(20), nullable=False)
    whatsapp = Column(String(20), nullable=True)
    email = Column(String(150), nullable=True)
    cep = Column(String(10), nullable=True)
    endereco = Column(String, nullable=True)
    bairro = Column(String(100), nullable=False)
    cidade = Column(String(100), default="Pinhais")
    plano_interesse_id = Column(UUID(as_uuid=True), ForeignKey("planos.id"), nullable=True)
    origem = Column(String(50), nullable=False)
    status = Column(Enum(LeadStatus), default=LeadStatus.NOVO)
    vendedor_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Venda(Base):
    __tablename__ = "vendas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    numero_pedido = Column(Integer, autoincrement=True, unique=True)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"))
    vendedor_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False)
    plano_id = Column(UUID(as_uuid=True), ForeignKey("planos.id"), nullable=False)
    valor_mensal = Column(Numeric(10, 2), nullable=False)
    taxa_instalacao = Column(Numeric(10, 2), default=0.00)
    status = Column(Enum(SaleStatus), default=SaleStatus.EM_PREENCHIMENTO)
    comissao_calculada = Column(Numeric(10, 2), default=0.00)
    data_venda = Column(DateTime, default=datetime.utcnow)
