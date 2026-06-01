from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.dependencies import get_current_active_user, require_parent_or_admin
from app.models.user import User
from app.services.certificate_service import generate_certificate_pdf

router = APIRouter(prefix="/certificates", tags=["certificates"])


@router.get("/me")
def get_my_certificate(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    pdf_bytes = generate_certificate_pdf(db, current_user)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=certificate_{current_user.username}.pdf"},
    )


@router.get("/{user_id}")
def get_user_certificate(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent_or_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    pdf_bytes = generate_certificate_pdf(db, user)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=certificate_{user.username}.pdf"},
    )
