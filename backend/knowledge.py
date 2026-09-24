"""Curated veterinary antimicrobial knowledge used by in-memory RAG.

Passages are short, citable, and written for a professor demo of LAMU-AI
(FARAD + 1DATA style surveillance). This is not a production FARAD dump.
"""

CORPUS: list[dict] = [
    {
        "id": "DOC-001",
        "title": "FARAD Digest: Cephalosporin Withdrawal Intervals",
        "source": "FARAD",
        "chunks": [
            "Ceftiofur crystalline free acid (CCFA) administered subcutaneously at the base of the ear in cattle has a withdrawal period of 13 days for slaughter. For intramuscular ceftiofur sodium, the meat withdrawal is 4 days.",
            "Extended withdrawal intervals are recommended for extra-label use of cephalosporins. Third-generation cephalosporins are classified as critically important antimicrobials by WHO.",
            "FARAD recommends a minimum 28-day withdrawal for extra-label ceftiofur use in sheep and goats due to limited pharmacokinetic data in minor ruminants.",
        ],
    },
    {
        "id": "DOC-002",
        "title": "FDA CVM Guidance #263: Duration of Antimicrobial Use",
        "source": "FDA",
        "chunks": [
            "FDA guidance recommends limiting duration of medically important antimicrobial use in food-producing animals. Veterinary oversight is required for all medically important antimicrobials.",
            "Extra-label drug use (ELDU) is regulated under AMDUCA. Only licensed veterinarians may prescribe ELDU within a valid veterinarian-client-patient relationship (VCPR).",
        ],
    },
    {
        "id": "DOC-003",
        "title": "NARMS 2023: Antimicrobial Resistance Trends",
        "source": "USDA",
        "chunks": [
            "Tetracycline resistance in E. coli isolates from cattle has increased to 34% in 2023. Cephalosporin resistance remains below 3% due to restricted extra-label prohibitions.",
            "Macrolide resistance in Enterococcus from poultry reached 28%. Fluoroquinolone resistance in food animal isolates remains low at 2.1% following the 2005 enrofloxacin ban in poultry.",
            "NARMS data indicates increasing multi-drug resistance (MDR) phenotypes in Salmonella from swine, with 18% of isolates resistant to 3 or more drug classes.",
        ],
    },
    {
        "id": "DOC-004",
        "title": "Extra-Label Drug Use in Minor Species",
        "source": "FARAD",
        "chunks": [
            "Minor species (sheep, goats, llamas, rabbits) have limited FDA-approved antimicrobials. FARAD provides evidence-based withdrawal recommendations based on available PK data and tissue residue studies.",
            "For goats, oxytetracycline administered IM at 10 mg/kg has a recommended meat withdrawal of 35 days. Limited milk withdrawal data is available for lactating goats.",
        ],
    },
    {
        "id": "DOC-005",
        "title": "BRD Treatment Protocols",
        "source": "VMTH",
        "chunks": [
            "Bovine Respiratory Disease Complex (BRDC), also called shipping fever, is the leading cause of morbidity and mortality in feedlot cattle. First-line treatment typically includes macrolides (tulathromycin, tilmicosin) or cephalosporins (ceftiofur).",
            "Tulathromycin (Draxxin) at 2.5 mg/kg SC provides extended tissue concentrations for 10 or more days. Single-dose therapy improves compliance and reduces labor costs.",
            "Treatment failure rates for BRD have increased from 15% to 22% over 2018-2023, potentially indicating emerging antimicrobial resistance in key pathogens such as Mannheimia haemolytica.",
        ],
    },
    {
        "id": "DOC-006",
        "title": "Companion Animal Antimicrobial Stewardship",
        "source": "Academic",
        "chunks": [
            "ISCAID guidelines recommend narrow-spectrum first-line antimicrobials for common companion animal infections. Amoxicillin-clavulanate is preferred for uncomplicated UTIs in dogs.",
            "Fluoroquinolone use in companion animals should be reserved for documented resistant infections. Culture and sensitivity testing is recommended before prescribing fluoroquinolones.",
            "Methicillin-resistant Staphylococcus (MRSP) prevalence in dogs has increased from 5% to 12% over the past decade, highlighting the need for antimicrobial stewardship.",
        ],
    },
    {
        "id": "DOC-007",
        "title": "PK of Tetracyclines in Food Animals",
        "source": "PubMed",
        "chunks": [
            "Oxytetracycline pharmacokinetics vary significantly between species. In cattle, IM administration at 11 mg/kg provides therapeutic concentrations for 48-72 hours with a half-life of 6-8 hours.",
            "Chlortetracycline administered in feed at therapeutic concentrations has been shown to reduce shedding of susceptible E. coli. Sub-therapeutic use promotes resistance gene selection.",
        ],
    },
    {
        "id": "DOC-008",
        "title": "WHO Critically Important Antimicrobials 2024",
        "source": "WHO",
        "chunks": [
            "The WHO classifies fluoroquinolones, 3rd/4th generation cephalosporins, macrolides, and glycopeptides as Highest Priority Critically Important Antimicrobials (HP-CIA) for human medicine.",
            "Use of HP-CIA in food-producing animals should be limited to individual animal treatment under veterinary supervision, not for prophylaxis or growth promotion.",
        ],
    },
    {
        "id": "DOC-009",
        "title": "Cattle Antimicrobial Use Patterns",
        "source": "FARAD",
        "chunks": [
            "Cattle represent the largest segment in the LAMU-AI demonstration corpus. The most commonly used drug classes are cephalosporins (primarily ceftiofur for BRD), macrolides (tulathromycin, tilmicosin), and tetracyclines (oxytetracycline).",
            "Bovine respiratory disease accounts for approximately 45% of antimicrobial treatments in feedlot cattle. Usage peaks in Q2-Q3 coinciding with feedlot placement and respiratory disease season.",
            "The Midwest region accounts for about 42% of cattle antimicrobial records in this demonstration set, reflecting the concentration of feedlot operations.",
        ],
    },
    {
        "id": "DOC-010",
        "title": "Companion Species Usage Snapshot",
        "source": "VMTH",
        "chunks": [
            "In the demonstration corpus, dogs commonly receive amoxicillin-clavulanate for urinary tract infections and cephalexin for skin infections. Cats commonly receive amoxicillin for upper respiratory infections and clindamycin for dental disease.",
            "Horses frequently receive trimethoprim-sulfa for skin infections. Withdrawal periods are not applicable for companion species. Extra-label use is more common in companion animals because fewer FDA-approved veterinary products exist for some indications.",
        ],
    },
    {
        "id": "DOC-011",
        "title": "Extra-Label Usage Rates",
        "source": "FDA",
        "chunks": [
            "Across the demonstration surveillance set, extra-label use accounts for approximately 23.4% of prescriptions, particularly in minor species with few labeled products.",
            "Fluoroquinolone extra-label use in food-producing animals is prohibited. Extra-label cephalosporin use in major food animal species is restricted by FDA order.",
        ],
    },
    {
        "id": "DOC-012",
        "title": "Regional Antimicrobial Utilization",
        "source": "USDA",
        "chunks": [
            "The Midwest has the highest antimicrobial utilization rate in this demonstration dataset, driven by cattle and swine density. The Southeast reports high poultry-associated macrolide and tetracycline use.",
            "West Coast records include a higher share of companion-animal prescriptions from veterinary teaching hospitals, with comparatively lower food-animal volume.",
        ],
    },
    {
        "id": "DOC-013",
        "title": "Milk Withdrawal for Dairy Cattle",
        "source": "FARAD",
        "chunks": [
            "For labeled ceftiofur products in lactating dairy cattle, milk discard times are typically 0 hours when used according to the label, but extra-label dose, route, or duration requires a FARAD-estimated milk withdrawal.",
            "Oxytetracycline extra-label use in dairy cattle often requires an extended milk discard interval compared with meat withdrawal because milk residue depletion can lag tissue depletion.",
        ],
    },
    {
        "id": "DOC-014",
        "title": "Swine Antimicrobial Notes",
        "source": "FDA",
        "chunks": [
            "Approved swine antimicrobials commonly include tylosin, lincomycin, tiamulin, and chlortetracycline depending on indication. Most labeled swine products have relatively short meat withdrawal periods, often 1 to 14 days.",
            "Water-soluble and in-feed administration is common in swine production. Medically important in-feed antimicrobials require veterinary oversight under GFI #263.",
        ],
    },
    {
        "id": "DOC-015",
        "title": "Poultry Fluoroquinolone Restriction",
        "source": "FDA",
        "chunks": [
            "Enrofloxacin extra-label use in poultry is prohibited. The 2005 withdrawal of enrofloxacin for poultry was associated with subsequent low fluoroquinolone resistance in many food-animal NARMS isolates.",
            "Poultry production more often uses tetracyclines and macrolides under veterinary feed directives than fluoroquinolones.",
        ],
    },
    {
        "id": "DOC-016",
        "title": "Cat and Dog First-Line Therapy",
        "source": "Academic",
        "chunks": [
            "For feline upper respiratory disease of suspected bacterial origin, amoxicillin or doxycycline is commonly used. For canine pyoderma, cephalexin is a typical first-line choice when culture is not yet available.",
            "Metronidazole is used for some gastrointestinal and anaerobic infections in dogs; it is not a first-line drug for routine urinary tract infection.",
        ],
    },
    {
        "id": "DOC-017",
        "title": "Aminoglycoside Residue Caution",
        "source": "FARAD",
        "chunks": [
            "Gentamicin used extra-label, including intrauterine use in cattle, can require prolonged slaughter withdrawals, in some FARAD estimates approaching 60 days or more, because of renal tissue residues.",
            "Aminoglycosides are generally avoided in food animals when labeled alternatives exist because of residue persistence.",
        ],
    },
    {
        "id": "DOC-018",
        "title": "Year-over-Year Usage Trend (Demo)",
        "source": "1DATA",
        "chunks": [
            "In this demonstration dataset, overall recorded antimicrobial events increased about 12% from 2022 to 2024. Tetracyclines remain the most widely represented class at about 26.3% of records.",
            "The demonstration knowledge base contains on the order of several thousand illustrative records spanning livestock, poultry, minor species, and companion animals for dashboard context; retrieval uses the curated passages in this corpus.",
        ],
    },
]


def flatten_chunks() -> list[dict]:
    """Return one record per chunk with document metadata."""
    rows = []
    for doc in CORPUS:
        for i, text in enumerate(doc["chunks"]):
            rows.append(
                {
                    "chunk_id": f"{doc['id']}-C{i + 1}",
                    "document_title": doc["title"],
                    "source": doc["source"],
                    "content": text,
                }
            )
    return rows
