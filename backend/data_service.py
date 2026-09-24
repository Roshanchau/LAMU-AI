"""Data Service for LAMU-AI antimicrobial records.

Provides access to the antimicrobial usage database with
filtering, aggregation, and statistics.

In production, this would connect to PostgreSQL/MongoDB.
"""

from models import AntimicrobialRecord, SpeciesCategory, DrugStatus


# In-memory database (in production: PostgreSQL/MongoDB)
RECORDS: list[AntimicrobialRecord] = [
    AntimicrobialRecord(id="AMR-001", drug_name="Ceftiofur", drug_class="Cephalosporins", species="Cattle", species_category=SpeciesCategory.MAJOR_LIVESTOCK, route="Intramuscular", indication="Bovine Respiratory Disease", dosage_mg_kg=2.2, duration_days=5, withdrawal_period_days=13, year=2024, quarter=1, region="Midwest", source="FARAD", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-002", drug_name="Enrofloxacin", drug_class="Fluoroquinolones", species="Cattle", species_category=SpeciesCategory.MAJOR_LIVESTOCK, route="Subcutaneous", indication="Bovine Respiratory Disease", dosage_mg_kg=7.5, duration_days=3, withdrawal_period_days=28, year=2024, quarter=1, region="Southeast", source="FARAD", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-003", drug_name="Oxytetracycline", drug_class="Tetracyclines", species="Cattle", species_category=SpeciesCategory.MAJOR_LIVESTOCK, route="Intravenous", indication="Anaplasmosis", dosage_mg_kg=11.0, duration_days=5, withdrawal_period_days=28, year=2024, quarter=2, region="Southwest", source="VMTH", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-004", drug_name="Tulathromycin", drug_class="Macrolides", species="Cattle", species_category=SpeciesCategory.MAJOR_LIVESTOCK, route="Subcutaneous", indication="Bovine Respiratory Disease", dosage_mg_kg=2.5, duration_days=1, withdrawal_period_days=18, year=2024, quarter=2, region="Midwest", source="FARAD", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-005", drug_name="Tylosin", drug_class="Macrolides", species="Swine", species_category=SpeciesCategory.MAJOR_LIVESTOCK, route="Oral (Water)", indication="Swine Dysentery", dosage_mg_kg=4.4, duration_days=5, withdrawal_period_days=2, year=2024, quarter=1, region="Midwest", source="FARAD", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-006", drug_name="Chlortetracycline", drug_class="Tetracyclines", species="Broiler Chickens", species_category=SpeciesCategory.POULTRY, route="Oral (Feed)", indication="Chronic Respiratory Disease", dosage_mg_kg=22.0, duration_days=7, withdrawal_period_days=1, year=2024, quarter=1, region="Southeast", source="FARAD", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-007", drug_name="Penicillin G", drug_class="Penicillins", species="Sheep", species_category=SpeciesCategory.MINOR_SPECIES, route="Intramuscular", indication="Foot Rot", dosage_mg_kg=22.0, duration_days=5, withdrawal_period_days=9, year=2024, quarter=1, region="West", source="FARAD", status=DrugStatus.EXTRA_LABEL),
    AntimicrobialRecord(id="AMR-008", drug_name="Oxytetracycline", drug_class="Tetracyclines", species="Goats", species_category=SpeciesCategory.MINOR_SPECIES, route="Intramuscular", indication="Caseous Lymphadenitis", dosage_mg_kg=10.0, duration_days=3, withdrawal_period_days=35, year=2024, quarter=2, region="Southeast", source="VMTH", status=DrugStatus.EXTRA_LABEL),
    AntimicrobialRecord(id="AMR-009", drug_name="Amoxicillin-Clavulanate", drug_class="Penicillins", species="Dogs", species_category=SpeciesCategory.COMPANION_ANIMALS, route="Oral", indication="Urinary Tract Infection", dosage_mg_kg=13.75, duration_days=14, withdrawal_period_days=0, year=2024, quarter=1, region="Midwest", source="VMTH", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-010", drug_name="Cephalexin", drug_class="Cephalosporins", species="Dogs", species_category=SpeciesCategory.COMPANION_ANIMALS, route="Oral", indication="Pyoderma", dosage_mg_kg=22.0, duration_days=21, withdrawal_period_days=0, year=2024, quarter=2, region="Northeast", source="VMTH", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-011", drug_name="Amoxicillin", drug_class="Penicillins", species="Cats", species_category=SpeciesCategory.COMPANION_ANIMALS, route="Oral", indication="Upper Respiratory Infection", dosage_mg_kg=11.0, duration_days=10, withdrawal_period_days=0, year=2024, quarter=1, region="West", source="VMTH", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-012", drug_name="Trimethoprim-Sulfa", drug_class="Sulfonamides", species="Horses", species_category=SpeciesCategory.COMPANION_ANIMALS, route="Oral", indication="Skin Infections", dosage_mg_kg=30.0, duration_days=10, withdrawal_period_days=0, year=2024, quarter=1, region="Northeast", source="VMTH", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-013", drug_name="Florfenicol", drug_class="Amphenicols", species="Cattle", species_category=SpeciesCategory.MAJOR_LIVESTOCK, route="Intramuscular", indication="Bovine Respiratory Disease", dosage_mg_kg=20.0, duration_days=2, withdrawal_period_days=38, year=2024, quarter=3, region="Northeast", source="FARAD", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-014", drug_name="Doxycycline", drug_class="Tetracyclines", species="Dogs", species_category=SpeciesCategory.COMPANION_ANIMALS, route="Oral", indication="Lyme Disease", dosage_mg_kg=5.0, duration_days=28, withdrawal_period_days=0, year=2024, quarter=2, region="Northeast", source="VMTH", status=DrugStatus.APPROVED),
    AntimicrobialRecord(id="AMR-015", drug_name="Gentamicin", drug_class="Aminoglycosides", species="Cattle", species_category=SpeciesCategory.MAJOR_LIVESTOCK, route="Intrauterine", indication="Metritis", dosage_mg_kg=5.0, duration_days=3, withdrawal_period_days=60, year=2023, quarter=3, region="West", source="VMTH", status=DrugStatus.EXTRA_LABEL),
]


def query_records(
    species: str | None = None,
    drug_class: str | None = None,
    status: str | None = None,
    year: int | None = None,
    region: str | None = None,
    limit: int = 50,
) -> list[AntimicrobialRecord]:
    """Query antimicrobial records with filters."""
    results = RECORDS

    if species:
        results = [r for r in results if r.species.lower() == species.lower()]
    if drug_class:
        results = [r for r in results if r.drug_class.lower() == drug_class.lower()]
    if status:
        results = [r for r in results if r.status.value.lower() == status.lower()]
    if year:
        results = [r for r in results if r.year == year]
    if region:
        results = [r for r in results if r.region.lower() == region.lower()]

    return results[:limit]


def get_statistics() -> dict:
    """Get aggregate statistics from the database."""
    unique_drugs = len(set(r.drug_name for r in RECORDS))
    unique_species = len(set(r.species for r in RECORDS))
    drug_classes = {}
    for r in RECORDS:
        drug_classes[r.drug_class] = drug_classes.get(r.drug_class, 0) + 1

    extra_label_count = sum(1 for r in RECORDS if r.status == DrugStatus.EXTRA_LABEL)
    avg_withdrawal = sum(r.withdrawal_period_days for r in RECORDS) / len(RECORDS) if RECORDS else 0

    return {
        "total_records": len(RECORDS),
        "unique_drugs": unique_drugs,
        "unique_species": unique_species,
        "drug_class_distribution": drug_classes,
        "extra_label_percentage": round(extra_label_count / len(RECORDS) * 100, 1) if RECORDS else 0,
        "avg_withdrawal_days": round(avg_withdrawal, 1),
    }
