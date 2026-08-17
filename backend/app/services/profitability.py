from typing import Dict, Any

def calculate_profitability(
    bid_price_per_quintal: float,
    cost_of_production_per_quintal: float,
    mandi_benchmark_price: float,
    quantity_quintals: float
) -> Dict[str, Any]:
    """
    Computes multi-dimensional profitability metrics comparing bid price against
    both farmer's stated cost of production and APMC mandi benchmarks.
    """
    cost_total = cost_of_production_per_quintal * quantity_quintals
    revenue_total = bid_price_per_quintal * quantity_quintals
    net_profit_amount = revenue_total - cost_total
    
    if cost_of_production_per_quintal > 0:
        margin_pct = ((bid_price_per_quintal - cost_of_production_per_quintal) / cost_of_production_per_quintal) * 100.0
    else:
        margin_pct = 0.0

    is_profitable = bid_price_per_quintal >= cost_of_production_per_quintal

    # Comparison vs Mandi Benchmark
    mandi_diff = bid_price_per_quintal - mandi_benchmark_price
    mandi_diff_pct = ((mandi_diff) / mandi_benchmark_price * 100.0) if mandi_benchmark_price > 0 else 0.0

    if margin_pct >= 25:
        verdict = "Highly Profitable Deal (Top Margin)"
        status_color = "emerald"
    elif margin_pct >= 10:
        verdict = "Good Profitable Deal"
        status_color = "green"
    elif margin_pct >= 0:
        verdict = "Marginally Profitable (Break-Even+)"
        status_color = "amber"
    else:
        verdict = "Loss / Below Cost of Production"
        status_color = "red"

    return {
        "is_profitable_flag": is_profitable,
        "profit_margin_pct": round(margin_pct, 2),
        "net_profit_amount": round(net_profit_amount, 2),
        "revenue_total": round(revenue_total, 2),
        "cost_total": round(cost_total, 2),
        "bid_vs_mandi_diff": round(mandi_diff, 2),
        "bid_vs_mandi_pct": round(mandi_diff_pct, 2),
        "verdict": verdict,
        "status_color": status_color,
    }
