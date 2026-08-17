from typing import List, Dict, Any

VEHICLE_FLEET = [
    {
        "vehicle_type": "Mini Truck (Tata Ace / Chota Hathi)",
        "capacity_quintals": 12.0,  # 1.2 Ton
        "base_rate": 350.0,
        "rate_per_km": 14.0,
        "max_distance_km": 150.0,
        "description": "Ideal for small harvest, rapid village transport & perishable batches (Up to 12 Qtl)"
    },
    {
        "vehicle_type": "Pickup Truck (Mahindra Bolero Maxi)",
        "capacity_quintals": 30.0,  # 3.0 Ton
        "base_rate": 600.0,
        "rate_per_km": 18.0,
        "max_distance_km": 600.0,
        "description": "Best for medium farm loads & direct APMC mandi dispatch across cities (Up to 30 Qtl)"
    },
    {
        "vehicle_type": "Tractor-Trolley (Rural Farm-to-Mandi)",
        "capacity_quintals": 50.0,  # 5.0 Ton
        "base_rate": 750.0,
        "rate_per_km": 16.0,
        "max_distance_km": 60.0,  # Tractor is only for local short-haul
        "description": "Economical for local unpaved farm roads within 60 km (Up to 50 Qtl)"
    },
    {
        "vehicle_type": "10-Ton Heavy Truck (Eicher / Ashok Leyland)",
        "capacity_quintals": 120.0,  # 12 Ton
        "base_rate": 1800.0,
        "rate_per_km": 30.0,
        "max_distance_km": 2000.0,
        "description": "Cost-efficient bulk interstate or wholesale merchant transport (Up to 120 Qtl)"
    },
    {
        "vehicle_type": "Refrigerated Reefer Van",
        "capacity_quintals": 35.0,  # 3.5 Ton
        "base_rate": 1200.0,
        "rate_per_km": 26.0,
        "max_distance_km": 1000.0,
        "description": "Temperature controlled cold chain for exotic vegetables, fruits & berries"
    }
]

def calculate_transport_options(load_quintals: float, distance_km: float) -> Dict[str, Any]:
    """
    Computes available vehicle options and auto-recommends the most cost-efficient
    suitably sized vehicle avoiding over/under-provisioning and inappropriate vehicle distance.
    """
    options = []
    recommended_option = None
    min_cost = float("inf")

    for v in VEHICLE_FLEET:
        can_carry = load_quintals <= v["capacity_quintals"]
        distance_suitable = distance_km <= v.get("max_distance_km", 1000.0)
        
        cost = v["base_rate"] + (distance_km * v["rate_per_km"])
        load_factor = min(1.0, load_quintals / v["capacity_quintals"])
        adjusted_cost = round(cost * (0.9 + 0.15 * load_factor), 2)
        
        option_data = {
            "vehicle_type": v["vehicle_type"],
            "capacity_quintals": v["capacity_quintals"],
            "base_rate": v["base_rate"],
            "rate_per_km": v["rate_per_km"],
            "estimated_cost": adjusted_cost,
            "can_carry": can_carry,
            "is_recommended": False,
            "description": v["description"]
        }

        # Recommendation logic: Must be able to carry load and suitable for highway/local distance
        if can_carry and distance_suitable and adjusted_cost < min_cost:
            min_cost = adjusted_cost
            recommended_option = option_data
        
        options.append(option_data)

    if not recommended_option:
        # Fallback to pickup or 10-ton based on load
        if load_quintals <= 30.0:
            recommended_option = options[1]
        else:
            recommended_option = options[3]
            if load_quintals > 120.0:
                recommended_option["estimated_cost"] = round(recommended_option["estimated_cost"] * (load_quintals / 120.0), 2)

    for opt in options:
        if opt["vehicle_type"] == recommended_option["vehicle_type"]:
            opt["is_recommended"] = True
            break

    return {
        "load_quintals": load_quintals,
        "distance_km": distance_km,
        "recommended_vehicle": recommended_option["vehicle_type"],
        "recommended_cost": recommended_option["estimated_cost"],
        "options": options
    }
