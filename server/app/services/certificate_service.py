import io
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.statistics import Statistics


def generate_certificate_pdf(db: Session, user: User) -> bytes:
    try:
        from reportlab.lib.pagesizes import A4, landscape
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch, cm
        from reportlab.lib.enums import TA_CENTER

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=landscape(A4), topMargin=1*cm, bottomMargin=1*cm)
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "Title", parent=styles["Title"],
            fontSize=36, textColor=colors.HexColor("#6366f1"),
            alignment=TA_CENTER, spaceAfter=10,
        )
        subtitle_style = ParagraphStyle(
            "Subtitle", parent=styles["Normal"],
            fontSize=18, textColor=colors.HexColor("#8b5cf6"),
            alignment=TA_CENTER, spaceAfter=6,
        )
        body_style = ParagraphStyle(
            "Body", parent=styles["Normal"],
            fontSize=14, alignment=TA_CENTER, spaceAfter=6,
        )

        stat = db.query(Statistics).filter(Statistics.user_id == user.id, Statistics.subject_id == None).first()
        games = stat.games_played if stat else 0
        total_xp = user.xp

        story_elements = [
            Spacer(1, 0.5 * inch),
            Paragraph("🏆 Certificate of Achievement 🏆", title_style),
            Spacer(1, 0.3 * inch),
            Paragraph("This is to certify that", subtitle_style),
            Paragraph(f"<b>{user.display_name or user.username}</b>", title_style),
            Spacer(1, 0.2 * inch),
            Paragraph("has successfully completed an amazing learning journey on", body_style),
            Paragraph("<b>Kids Learning Adventure</b>", subtitle_style),
            Spacer(1, 0.3 * inch),
            Paragraph(f"Total XP Earned: <b>{total_xp}</b>  |  Level Reached: <b>{user.level}</b>  |  Games Played: <b>{games}</b>", body_style),
            Spacer(1, 0.3 * inch),
            Paragraph(f"Date: {datetime.utcnow().strftime('%B %d, %Y')}", body_style),
        ]
        doc.build(story_elements)
        return buffer.getvalue()
    except ImportError:
        return b"ReportLab not installed. Install it with: pip install reportlab"
