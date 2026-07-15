#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de teste para verificar a biblioteca redecanais
"""

import sys

print("Testando importação do redecanais...")

try:
    from redecanais import RedeCanais
    print("✓ Biblioteca importada com sucesso!")

    rc = RedeCanais()
    print("✓ Instância criada com sucesso!")

    # Lista os métodos disponíveis
    print("\nMétodos disponíveis:")
    for metodo in dir(rc):
        if not metodo.startswith('_'):
            print(f"  - {metodo}")

    print("\n✓ Teste concluído com sucesso!")

except ImportError as e:
    print(f"✗ Erro: biblioteca redecanais não instalada")
    print(f"  Execute: pip install git+https://github.com/cleitonleonel/redecanais.git")
    sys.exit(1)

except Exception as e:
    print(f"✗ Erro ao testar: {e}")
    sys.exit(1)
