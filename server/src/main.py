import decimal

from mpmath import mp  # type: ignore

from config import PRECISION

decimal.setcontext(decimal.Context(prec=PRECISION))
mp.dps = PRECISION

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from modules.interpolation.router import interpolation_router

api_router = APIRouter(prefix="/api")
api_router.include_router(interpolation_router)

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
