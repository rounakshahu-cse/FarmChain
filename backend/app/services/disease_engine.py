import random
from typing import Dict, Any

DISEASE_KNOWLEDGE_BASE = [
    {
        "crop_name": "Tomato",
        "detected_disease": "Early Blight (Alternaria solani)",
        "confidence_range": (94.0, 98.8),
        "severity": "Moderate to High",
        "symptoms": "Dark brown circular spots with concentric rings ('target board' pattern) on lower leaves, yellow halo around lesions, premature leaf drop.",
        "organic_remedy": "Spray Trichoderma viride bio-fungicide (5g/L water) or 2% cold-pressed Neem Oil with soap emulsifier every 7 days. Remove affected lower leaves.",
        "chemical_treatment": "Mancozeb 75% WP @ 2.5g/L or Chlorothalonil 75% WP @ 2g/L of water at first symptom appearance.",
        "recommended_product_name": "Kavach Chlorothalonil 75% WP (500g)",
        "recommended_product_category": "Bio-Fungicide",
        "keywords": ["tomato", "leaf", "spot", "yellow", "early", "blight"]
    },
    {
        "crop_name": "Potato",
        "detected_disease": "Late Blight (Phytophthora infestans)",
        "confidence_range": (93.5, 97.9),
        "severity": "Critical",
        "symptoms": "Water-soaked dark lesions appearing at leaf margins and tips during cool wet weather, white fluffy mildew on leaf undersides, rapid vine collapse.",
        "organic_remedy": "Copper hydroxide spray or Bordeaux mixture (1%). Ensure wide ridge earthing up to protect tubers.",
        "chemical_treatment": "Dimethomorph 50% WP (1g/L) mixed with Mancozeb (2g/L) or Metalaxyl-M + Mancozeb (Ridomil Gold) @ 2.5g/L.",
        "recommended_product_name": "Ridomil Gold Metalaxyl Bio-Fungicide (1kg)",
        "recommended_product_category": "Bio-Fungicide",
        "keywords": ["potato", "late", "blight", "rot", "mildew"]
    },
    {
        "crop_name": "Cotton",
        "detected_disease": "Leaf Spot & Bollworm Infestation",
        "confidence_range": (91.0, 96.5),
        "severity": "High",
        "symptoms": "Irregular necrotic spots on foliage accompanied by flared squares and caterpillar boring holes in fruiting bolls.",
        "organic_remedy": "Install pheromone traps (5 traps/acre), release Trichogramma egg parasitoids, and apply Beauveria bassiana bio-pesticide (4g/L).",
        "chemical_treatment": "Emamectin Benzoate 5% SG @ 0.5g/L or Chlorantraniliprole 18.5% SC @ 0.3ml/L.",
        "recommended_product_name": "Proclaim Emamectin Benzoate 5% SG (250g)",
        "recommended_product_category": "Bio-Pesticide",
        "keywords": ["cotton", "bollworm", "leaf", "caterpillar", "hole"]
    },
    {
        "crop_name": "Rice / Paddy",
        "detected_disease": "Rice Blast (Magnaporthe oryzae)",
        "confidence_range": (95.0, 99.1),
        "severity": "Critical",
        "symptoms": "Spindle-shaped elliptical lesions with greyish center and brownish borders on leaf blades; dark rot around neck nodes causing empty white panicles.",
        "organic_remedy": "Pseudomonas fluorescens seed treatment (10g/kg) and foliar spray (2.5g/L). Avoid excessive nitrogen fertilizer.",
        "chemical_treatment": "Tricyclazole 75% WP (Baan) @ 0.6g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L.",
        "recommended_product_name": "Amistar Top Azoxystrobin Broad Fungicide (200ml)",
        "recommended_product_category": "Bio-Fungicide",
        "keywords": ["rice", "paddy", "blast", "spindle", "leaf"]
    },
    {
        "crop_name": "Soybean",
        "detected_disease": "Soybean Rust (Phakopsora pachyrhizi)",
        "confidence_range": (92.0, 97.4),
        "severity": "Moderate",
        "symptoms": "Tiny tan to dark brown pustules on the lower leaf surface, yellowing foliage, early defoliation causing reduced pod filling.",
        "organic_remedy": "Spray bio-control agent Bacillus subtilis @ 5g/L. Crop rotation with non-host cereals.",
        "chemical_treatment": "Hexaconazole 5% EC @ 2ml/L or Tebuconazole 25.9% EC @ 1.25ml/L.",
        "recommended_product_name": "Folicur Tebuconazole 25.9% EC (250ml)",
        "recommended_product_category": "Bio-Fungicide",
        "keywords": ["soybean", "rust", "pustule", "yellow"]
    },
    {
        "crop_name": "General Crop",
        "detected_disease": "Aphids & Whitefly Sucking Pest Attack",
        "confidence_range": (93.0, 98.0),
        "severity": "Moderate",
        "symptoms": "Curled, distorted new leaves with sticky honeydew secretions, sooty black mold growth, stunted vegetative growth.",
        "organic_remedy": "Yellow sticky traps (10/acre) + 10,000 PPM Neem Oil (Azadirachtin) spray @ 3ml/L water.",
        "chemical_treatment": "Acetamiprid 20% SP @ 0.5g/L or Thiamethoxam 25% WG @ 0.3g/L.",
        "recommended_product_name": "Pure Cold-Pressed Neem Oil 10,000 PPM (1L)",
        "recommended_product_category": "Organic Neem Oil",
        "keywords": ["aphid", "whitefly", "curl", "sticky", "pest"]
    },
    {
        "crop_name": "All Crops",
        "detected_disease": "Healthy Crop Leaf (No Disease Detected)",
        "confidence_range": (98.0, 99.9),
        "severity": "None (Healthy)",
        "symptoms": "Vibrant green pigmentation, intact cell walls, optimal chlorophyll density, no chlorosis or fungal pustules.",
        "organic_remedy": "Maintain regular drip fertigation, balanced NPK nutrition, and periodic seaweed bio-stimulant foliar nutrition.",
        "chemical_treatment": "No chemical treatment required. Continue preventive organic care.",
        "recommended_product_name": "Bio-zyme Organic Seaweed Growth Stimulant (500ml)",
        "recommended_product_category": "Nutrient / Fertilizer",
        "keywords": ["healthy", "green", "clean", "good"]
    }
]

def analyze_crop_image(image_filename: str, crop_hint: str = "") -> Dict[str, Any]:
    """
    Simulates high-precision AI vision disease diagnostics by matching crop features,
    returning detailed symptoms, severity, and dual chemical + organic remedies.
    """
    image_lower = (image_filename + " " + crop_hint).lower()
    
    matched_entry = None
    for entry in DISEASE_KNOWLEDGE_BASE:
        for kw in entry["keywords"]:
            if kw in image_lower:
                matched_entry = entry
                break
        if matched_entry:
            break

    if not matched_entry:
        # Default to high-frequency Tomato Early Blight or healthy if random
        matched_entry = random.choice(DISEASE_KNOWLEDGE_BASE[:-1])

    confidence = round(random.uniform(*matched_entry["confidence_range"]), 1)

    return {
        "crop_name": matched_entry["crop_name"],
        "detected_disease": matched_entry["detected_disease"],
        "confidence": confidence,
        "severity": matched_entry["severity"],
        "symptoms": matched_entry["symptoms"],
        "organic_remedy": matched_entry["organic_remedy"],
        "chemical_treatment": matched_entry["chemical_treatment"],
        "recommended_product_name": matched_entry["recommended_product_name"],
        "recommended_product_category": matched_entry["recommended_product_category"],
    }
