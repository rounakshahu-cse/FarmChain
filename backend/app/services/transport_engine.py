from typing import List, Dict, Any

VEHICLE_FLEET = [
    {
        "vehicle_type": "3-Wheeler Auto Cargo (Piaggio Ape / Mahindra Alfa)",
        "capacity_quintals": 5.0,  # 0.5 Ton
        "base_rate": 150.0,
        "rate_per_km": 8.0,
        "max_distance_km": 40.0,
        "category": "Micro Transport",
        "description": "Ultra low-cost local transport for small harvests, vegetable crates & seed sacks (Up to 5 Qtl)"
    },
    {
        "vehicle_type": "Mini Truck (Tata Ace / Chota Hathi)",
        "capacity_quintals": 15.0,  # 1.5 Ton
        "base_rate": 350.0,
        "rate_per_km": 12.0,
        "max_distance_km": 150.0,
        "category": "Small Commercial",
        "description": "Budget-friendly village-to-mandi rapid dispatch for perishable lots (Up to 15 Qtl)"
    },
    {
        "vehicle_type": "Pickup Truck (Mahindra Bolero Maxi Truck)",
        "capacity_quintals": 30.0,  # 3.0 Ton
        "base_rate": 650.0,
        "rate_per_km": 16.0,
        "max_distance_km": 500.0,
        "category": "Medium Commercial",
        "description": "Popular workhorse for medium farm loads & direct inter-city APMC mandi transport (Up to 30 Qtl)"
    },
    {
        "vehicle_type": "Tractor-Trolley (Rural Farm-to-Mandi)",
        "capacity_quintals": 60.0,  # 6.0 Ton
        "base_rate": 850.0,
        "rate_per_km": 15.0,
        "max_distance_km": 75.0,  # Local unpaved haul
        "category": "Agricultural Haulage",
        "description": "Heavy-duty farm haulage on unpaved village roads, grain bags & raw harvest (Up to 60 Qtl)"
    },
    {
        "vehicle_type": "Medium 6-Wheeler (Eicher Pro 6-Ton)",
        "capacity_quintals": 65.0,  # 6.5 Ton
        "base_rate": 1400.0,
        "rate_per_km": 22.0,
        "max_distance_km": 1200.0,
        "category": "Regional Commercial",
        "description": "High-speed regional highway distribution between district APMC hubs (Up to 65 Qtl)"
    },
    {
        "vehicle_type": "Refrigerated Reefer Van (Cold Chain)",
        "capacity_quintals": 40.0,  # 4.0 Ton
        "base_rate": 1500.0,
        "rate_per_km": 26.0,
        "max_distance_km": 1500.0,
        "category": "Cold Chain Reefer",
        "description": "Temperature-controlled refrigerated transit for grapes, tomatoes, bananas & export produce (Up to 40 Qtl)"
    },
    {
        "vehicle_type": "10-Ton Heavy Multi-Axle Truck (Ashok Leyland / Tata)",
        "capacity_quintals": 120.0,  # 12.0 Ton
        "base_rate": 2200.0,
        "rate_per_km": 28.0,
        "max_distance_km": 2500.0,
        "category": "Heavy Long-Haul",
        "description": "Bulk wholesale interstate merchant shipment & high-volume commercial transport (Up to 120 Qtl)"
    },
    {
        "vehicle_type": "16-Wheeler National Trailer (25-Ton Mega Freight)",
        "capacity_quintals": 250.0,  # 25.0 Ton
        "base_rate": 4500.0,
        "rate_per_km": 38.0,
        "max_distance_km": 3500.0,
        "category": "Mega Freight",
        "description": "Heavy interstate freight for massive bulk harvests, grain silos & national mill supply (Up to 250 Qtl)"
    }
]

def calculate_transport_options(load_quintals: float, distance_km: float) -> Dict[str, Any]:
    """
    Computes transport quotes across all vehicle classes, starting from the lowest entry price
    up to heavy multi-axle freight, and auto-recommends the most cost-efficient suitably sized vehicle.
    """
    options = []
    recommended_option = None
    min_cost = float("inf")

    for v in VEHICLE_FLEET:
        can_carry = load_quintals <= v["capacity_quintals"]
        distance_suitable = distance_km <= v.get("max_distance_km", 2000.0)
        
        # Base price calculation
        cost = v["base_rate"] + (distance_km * v["rate_per_km"])
        load_factor = min(1.0, load_quintals / v["capacity_quintals"])
        adjusted_cost = round(cost * (0.92 + 0.12 * load_factor), 2)
        
        option_data = {
            "vehicle_type": v["vehicle_type"],
            "capacity_quintals": v["capacity_quintals"],
            "base_rate": v["base_rate"],
            "rate_per_km": v["rate_per_km"],
            "estimated_cost": adjusted_cost,
            "can_carry": can_carry,
            "is_recommended": False,
            "category": v.get("category", "Commercial"),
            "description": v["description"]
        }

        # Recommendation logic: Must be capable of carrying the load & distance-suitable
        if can_carry and distance_suitable and adjusted_cost < min_cost:
            min_cost = adjusted_cost
            recommended_option = option_data
        
        options.append(option_data)

    if not recommended_option:
        # Fallback to the largest available or scaled truck
        capable_options = [o for o in options if o["can_carry"]]
        if capable_options:
            recommended_option = min(capable_options, key=lambda x: x["estimated_cost"])
        else:
            # Scale the largest trailer
            recommended_option = options[-1]
            scale_factor = load_quintals / recommended_option["capacity_quintals"]
            recommended_option["estimated_cost"] = round(recommended_option["estimated_cost"] * scale_factor, 2)

    for opt in options:
        if opt["vehicle_type"] == recommended_option["vehicle_type"]:
            opt["is_recommended"] = True
            break

    # Sort options strictly by estimated_cost ascending (low amount to high amount)
    options.sort(key=lambda x: x["estimated_cost"])

    return {
        "load_quintals": load_quintals,
        "distance_km": distance_km,
        "recommended_vehicle": recommended_option["vehicle_type"],
        "recommended_cost": recommended_option["estimated_cost"],
        "options": options
    }
