import math

def computeDiscount(age, income, student_flag, nominal_consumer_spending_growth):
    rp_death = .00130 #Default, age under 25
    if age > 25:
        rp_death = 0.00132
        if age > 30:
            rp_death = 0.00134
            if age > 35:
                rp_death = 0.00144
                if age > 40:
                    rp_death = 0.00173
                    if age > 45:
                        rp_death = 0.00248
                        if age > 50:
                            rp_death = 0.00367
                            
    # Without a secondary market, these assets are entirely illiquid
    rp_liquidity = 0.04

    rp_counterparty = 0.05 #Default, income under 25,000
    if income > 25000:
        rp_counterparty = 0.04
        if income > 50000:
            rp_counterparty = 0.03
            if income > 75000:
                rp_counterparty = 0.02
                if income > 100000:
                    rp_counterparty = 0.01
                    if income > 150000:
                        rp_counterparty = 0.05
    # Students get a 0.01 discount reduction
    if student_flag:
        rp_counterparty = max(rp_counterparty - 0.01, 0)

    discount_rate = nominal_consumer_spending_growth + rp_death + rp_liquidity + rp_counterparty
    return discount_rate

def blackScholesCall(sigma, T, K, r, S):
    sigma_sq = math.pow(sigma, 2)
    T_sqrt = math.sqrt(T)
    d1 = (math.log(S/K) + r*T + 0.5*sigma_sq*T)/(sigma*T_sqrt)
    d2 = d1 - sigma*T_sqrt
    Nd1 = norm.cdf(d1)
    Nd2 = norm.cdf(d2)
    C = S*math.exp(-d*T)*Nd1 - K*math.exp(-r*T)*Nd2
    return C

def blackScholesPut(sigma, T, K, r, S):
    sigma_sq = math.pow(sigma, 2)
    T_sqrt = math.sqrt(T)
    d1 = (math.log(S/math.sqrt(E)) + r*T + 1.5*sigma_sq*T)/(sigma*T_sqrt)
    d2 = d1 - 2*sigma*T_sqrt
    Nd1 = norm.cdf(-d1)
    Nd2 = norm.cdf(-d2)
    P = -S*math.exp(-d*T)*Nd1 + K*math.exp(-r*T)*Nd2
    return P
