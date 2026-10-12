#!/usr/bin/env python3
"""Janela do Shabbat para a TN (sem dependências).

Uso:
  python3 shabbat.py                 -> status agora
  python3 shabbat.py 2026-10-16T19:00 -> status nesse horário (hora local de São Paulo)
Saída JSON: {"pausado": bool, "inicio": "...", "fim": "...", "motivo": "..."}

Regra: pausa da sexta (pôr do sol - 18 min) até o sábado (pôr do sol + 42 min).
Sábado inteiro sem post por padrão (config.yaml: shabbat.sabado_sem_posts).
Local padrão: São Paulo (-23.55, -46.63), fuso -03:00 (Brasil sem horário de verão).
"""
import json, math, sys
from datetime import datetime, timedelta, timezone

LAT, LON, TZ = -23.55, -46.63, timezone(timedelta(hours=-3))

def sunset(d):
    # Algoritmo NOAA simplificado (erro de ~1-2 min)
    n = d.timetuple().tm_yday
    g = 2 * math.pi / 365 * (n - 1)
    eqt = 229.18 * (0.000075 + 0.001868 * math.cos(g) - 0.032077 * math.sin(g)
                    - 0.014615 * math.cos(2 * g) - 0.040849 * math.sin(2 * g))
    decl = (0.006918 - 0.399912 * math.cos(g) + 0.070257 * math.sin(g) - 0.006758 * math.cos(2 * g)
            + 0.000907 * math.sin(2 * g) - 0.002697 * math.cos(3 * g) + 0.00148 * math.sin(3 * g))
    lat = math.radians(LAT)
    ha = math.degrees(math.acos(math.cos(math.radians(90.833)) / (math.cos(lat) * math.cos(decl))
                                - math.tan(lat) * math.tan(decl)))
    minutes_utc = 720 - 4 * (LON - ha) - eqt
    base = datetime(d.year, d.month, d.day, tzinfo=timezone.utc)
    return (base + timedelta(minutes=minutes_utc)).astimezone(TZ)

def janela(agora):
    # sexta desta semana (ou a última sexta, se hoje é sábado)
    dias_ate_sexta = (4 - agora.weekday()) % 7
    sexta = (agora + timedelta(days=dias_ate_sexta)).date()
    if agora.weekday() == 5:
        sexta = (agora - timedelta(days=1)).date()
    sabado = sexta + timedelta(days=1)
    ini = sunset(datetime(sexta.year, sexta.month, sexta.day)) - timedelta(minutes=18)
    fim = sunset(datetime(sabado.year, sabado.month, sabado.day)) + timedelta(minutes=42)
    return ini, fim

def main():
    agora = datetime.fromisoformat(sys.argv[1]).replace(tzinfo=TZ) if len(sys.argv) > 1 else datetime.now(TZ)
    ini, fim = janela(agora)
    pausado = ini <= agora <= fim or agora.weekday() == 5
    print(json.dumps({
        "agora": agora.isoformat(timespec="minutes"),
        "pausado": pausado,
        "inicio": ini.isoformat(timespec="minutes"),
        "fim": fim.isoformat(timespec="minutes"),
        "resumo": f"sexta {ini:%d/%m %H:%M} até sábado {fim:%d/%m %H:%M}",
        "motivo": "Shabbat" if pausado else "",
    }, ensure_ascii=False))

if __name__ == "__main__":
    main()
