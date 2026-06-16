"""Données de démonstration : 1 école, 1 directeur, 2 enseignants.

Usage :  python seed.py
"""
from db.session import Base, SessionLocal, engine
from core.security import hash_password
from models import Role, School, User

Base.metadata.create_all(bind=engine)

DEMO = [
    ("directeur@ecole.fr", "directeur123", "Mme Directrice", Role.director),
    ("prof1@ecole.fr", "prof123", "M. Dupont", Role.teacher),
    ("prof2@ecole.fr", "prof123", "Mme Martin", Role.teacher),
]


def run():
    db = SessionLocal()
    try:
        school = db.query(School).filter(School.name == "École des Glaisières").first()
        if not school:
            school = School(name="École des Glaisières")
            db.add(school)
            db.commit()
            db.refresh(school)

        for email, pwd, name, role in DEMO:
            if db.query(User).filter(User.email == email).first():
                print(f"= {email} existe déjà, ignoré")
                continue
            db.add(
                User(
                    email=email,
                    password_hash=hash_password(pwd),
                    full_name=name,
                    role=role,
                    school_id=school.id,
                )
            )
            print(f"+ {email} ({role.value}) / mot de passe : {pwd}")
        db.commit()
        print("\nSeed terminé. École :", school.name, f"(id={school.id})")
    finally:
        db.close()


if __name__ == "__main__":
    run()
