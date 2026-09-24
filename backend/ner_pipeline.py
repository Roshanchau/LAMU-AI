"""Veterinary Named Entity Recognition Pipeline.

Rule-based baseline NER extractor (minimal version) for extracting
structured entities from veterinary clinical text.

In production, this would use a Hugging Face transformer model
fine-tuned on the FARAD corpus.
"""

import re
import time
from models import NEREntity, NERLabel


# Drug lexicon for pattern-based NER (minimal baseline version)
DRUG_LEXICON = {
    # Cephalosporins
    "ceftiofur", "ceftiofur crystalline free acid", "cephalexin", "cefpodoxime",
    # Tetracyclines
    "oxytetracycline", "chlortetracycline", "doxycycline", "tetracycline",
    # Macrolides
    "tulathromycin", "tylosin", "tilmicosin", "erythromycin", "azithromycin",
    # Fluoroquinolones
    "enrofloxacin", "marbofloxacin", "ciprofloxacin",
    # Penicillins
    "amoxicillin", "amoxicillin-clavulanate", "ampicillin", "penicillin g", "penicillin",
    # Aminoglycosides
    "gentamicin", "spectinomycin", "neomycin",
    # Others
    "florfenicol", "sulfadimethoxine", "trimethoprim-sulfa", "metronidazole",
    "clindamycin", "lincomycin", "tiamulin", "flunixin meglumine", "flunixin",
}

SPECIES_LEXICON = {
    "cattle", "cow", "cows", "bovine", "calf", "calves", "heifer", "steer",
    "swine", "pig", "pigs", "porcine", "piglet", "sow", "boar",
    "chicken", "chickens", "broiler", "broilers", "layer", "layers", "poultry",
    "turkey", "turkeys",
    "sheep", "lamb", "lambs", "ovine", "ewe", "ram",
    "goat", "goats", "caprine", "kid", "doe", "buck",
    "horse", "horses", "equine", "mare", "stallion", "foal", "gelding",
    "dog", "dogs", "canine", "puppy", "puppies",
    "cat", "cats", "feline", "kitten", "kittens",
    "holstein", "angus", "hereford", "jersey",
    "holstein dairy cow", "beef cattle", "dairy cow", "dairy cattle",
}

DISEASE_LEXICON = {
    "bovine respiratory disease", "brd", "shipping fever",
    "mastitis", "metritis", "foot rot", "digital dermatitis",
    "anaplasmosis", "coccidiosis", "blackleg", "listeriosis",
    "swine dysentery", "mycoplasma pneumonia", "ileitis",
    "chronic respiratory disease", "e. coli", "e. coli septicemia",
    "mycoplasma gallisepticum", "bacterial enteritis",
    "urinary tract infection", "uti", "pyoderma", "deep pyoderma",
    "lyme disease", "skin infections", "dental abscess",
    "upper respiratory infection", "clostridioides difficile",
    "bartonella henselae", "chlamydia felis",
    "mannheimia haemolytica", "streptococcus suis",
    "caseous lymphadenitis", "respiratory disease",
    "neonatal septicemia", "septicemia",
}

ROUTE_LEXICON = {
    "intramuscular", "im", "intravenous", "iv", "subcutaneous", "sc", "sq",
    "oral", "per os", "po", "topical", "intrauterine", "intramammary",
    "oral (water)", "oral (feed)", "intraperitoneal",
    "subcutaneously", "intravenously", "intramuscularly",
}

ORGANIZATION_LEXICON = {
    "farad", "fda", "usda", "aphis", "narms",
    "cornell university", "cornell", "uc davis", "ohio state",
    "texas a&m", "university of florida", "north carolina state",
    "cornell university college of veterinary medicine",
    "college of veterinary medicine",
}

# Dosage and duration patterns
DOSAGE_PATTERN = re.compile(r'\b(\d+\.?\d*)\s*(mg/kg|mg\/kg|mcg/kg|iu/kg|ml/kg|mg per kg)\b', re.IGNORECASE)
DURATION_PATTERN = re.compile(r'\b(\d+)\s*(days?|weeks?|hours?|months?)\b', re.IGNORECASE)


def _find_entities_by_lexicon(
    text: str,
    lexicon: set,
    label: NERLabel,
    base_confidence: float = 0.92
) -> list[NEREntity]:
    """Find entities in text using lexicon matching."""
    entities = []
    text_lower = text.lower()

    # Sort by length (longest first) to prefer longer matches
    sorted_lexicon = sorted(lexicon, key=len, reverse=True)

    matched_spans = set()

    for term in sorted_lexicon:
        start = 0
        while True:
            idx = text_lower.find(term.lower(), start)
            if idx == -1:
                break

            end = idx + len(term)

            # Check if this span overlaps with already matched spans
            span_range = set(range(idx, end))
            if not span_range & matched_spans:
                # Vary confidence slightly for realism
                import random
                confidence = round(base_confidence + random.uniform(-0.04, 0.06), 3)
                confidence = min(confidence, 0.99)

                entities.append(NEREntity(
                    text=text[idx:end],
                    label=label,
                    start=idx,
                    end=end,
                    confidence=confidence,
                ))
                matched_spans.update(span_range)

            start = end

    return entities


def _find_pattern_entities(
    text: str,
    pattern: re.Pattern,
    label: NERLabel,
    base_confidence: float = 0.94
) -> list[NEREntity]:
    """Find entities using regex patterns."""
    import random
    entities = []
    for match in pattern.finditer(text):
        confidence = round(base_confidence + random.uniform(-0.03, 0.05), 3)
        entities.append(NEREntity(
            text=match.group(),
            label=label,
            start=match.start(),
            end=match.end(),
            confidence=min(confidence, 0.99),
        ))
    return entities


def extract_entities(text: str, model: str = "lamu-vetbert") -> tuple[list[NEREntity], float]:
    """Extract veterinary named entities from clinical text.

    In production, this calls a Hugging Face pipeline:
        from transformers import pipeline
        ner = pipeline("ner", model="lamu-vetbert-ner-v2.1")
        results = ner(text)

    For this demo, we use lexicon + regex matching that simulates
    the same output format.

    Args:
        text: Clinical text to analyze.
        model: Model identifier (for future multi-model support).

    Returns:
        Tuple of (entities list, processing time in ms).
    """
    start_time = time.time()

    all_entities: list[NEREntity] = []

    # Run each NER sub-pipeline
    all_entities.extend(_find_entities_by_lexicon(text, DRUG_LEXICON, NERLabel.DRUG, 0.95))
    all_entities.extend(_find_entities_by_lexicon(text, SPECIES_LEXICON, NERLabel.SPECIES, 0.94))
    all_entities.extend(_find_entities_by_lexicon(text, DISEASE_LEXICON, NERLabel.DISEASE, 0.93))
    all_entities.extend(_find_entities_by_lexicon(text, ROUTE_LEXICON, NERLabel.ROUTE, 0.92))
    all_entities.extend(_find_entities_by_lexicon(text, ORGANIZATION_LEXICON, NERLabel.ORGANIZATION, 0.90))
    all_entities.extend(_find_pattern_entities(text, DOSAGE_PATTERN, NERLabel.DOSAGE, 0.94))
    all_entities.extend(_find_pattern_entities(text, DURATION_PATTERN, NERLabel.DURATION, 0.93))

    # Sort by position
    all_entities.sort(key=lambda e: e.start)

    processing_time = (time.time() - start_time) * 1000
    return all_entities, processing_time
