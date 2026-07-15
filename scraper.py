#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scraper para RedeCanais - Busca filmes, séries e canais ao vivo
NOTA: Ajustar métodos conforme API real da biblioteca redecanais
"""

import json
import sys
import os

def buscar_canais():
    """Busca canais ao vivo do RedeCanais"""
    try:
        from redecanais import RedeCanais
        rc = RedeCanais()

        # Ajustar método conforme API da biblioteca
        # Métodos possíveis: get_live_channels(), list_channels(), channels(), etc
        canais = []

        # Tenta diferentes métodos
        if hasattr(rc, 'get_live_channels'):
            canais = rc.get_live_channels()
        elif hasattr(rc, 'list_channels'):
            canais = rc.list_channels()
        elif hasattr(rc, 'channels'):
            canais = rc.channels()
        else:
            print("AVISO: Método para buscar canais não encontrado", file=sys.stderr)
            return []

        resultado = []
        for canal in canais[:50]:  # Limita a 50 canais
            try:
                resultado.append({
                    "id": f"rc_channel_{canal.get('id', canal.get('slug', len(resultado)))}",
                    "type": "tv",
                    "name": canal.get('name', canal.get('title', 'Canal sem nome')),
                    "poster": canal.get('poster', canal.get('image', canal.get('thumbnail', ''))),
                    "description": canal.get('description', canal.get('desc', 'Transmissão ao vivo')),
                    "streamUrl": canal.get('url', canal.get('stream_url', canal.get('link', '')))
                })
            except Exception as e:
                print(f"Erro ao processar canal: {e}", file=sys.stderr)
                continue

        print(f"Encontrados {len(resultado)} canais", file=sys.stderr)
        return resultado

    except ImportError:
        print("ERRO: biblioteca redecanais não instalada", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Erro ao buscar canais: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return []

def buscar_filmes(limite=100):
    """Busca filmes do RedeCanais"""
    try:
        from redecanais import RedeCanais
        rc = RedeCanais()

        filmes = []

        # Tenta diferentes métodos
        if hasattr(rc, 'get_movies'):
            filmes = rc.get_movies(limit=limite)
        elif hasattr(rc, 'list_movies'):
            filmes = rc.list_movies(limit=limite)
        elif hasattr(rc, 'movies'):
            filmes = rc.movies()
        else:
            print("AVISO: Método para buscar filmes não encontrado", file=sys.stderr)
            return []

        resultado = []
        for filme in filmes[:limite]:
            try:
                resultado.append({
                    "id": f"rc_movie_{filme.get('id', filme.get('slug', len(resultado)))}",
                    "type": "movie",
                    "name": filme.get('title', filme.get('name', 'Filme sem título')),
                    "poster": filme.get('poster', filme.get('image', filme.get('thumbnail', ''))),
                    "description": filme.get('description', filme.get('desc', filme.get('synopsis', ''))),
                    "streamUrl": filme.get('url', filme.get('stream_url', filme.get('link', '')))
                })
            except Exception as e:
                print(f"Erro ao processar filme: {e}", file=sys.stderr)
                continue

        print(f"Encontrados {len(resultado)} filmes", file=sys.stderr)
        return resultado

    except ImportError:
        print("ERRO: biblioteca redecanais não instalada", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Erro ao buscar filmes: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return []

def buscar_series(limite=100):
    """Busca séries do RedeCanais"""
    try:
        from redecanais import RedeCanais
        rc = RedeCanais()

        series = []

        # Tenta diferentes métodos
        if hasattr(rc, 'get_series'):
            series = rc.get_series(limit=limite)
        elif hasattr(rc, 'list_series'):
            series = rc.list_series(limit=limite)
        elif hasattr(rc, 'series'):
            series = rc.series()
        else:
            print("AVISO: Método para buscar séries não encontrado", file=sys.stderr)
            return []

        resultado = []
        for serie in series[:limite]:
            try:
                resultado.append({
                    "id": f"rc_series_{serie.get('id', serie.get('slug', len(resultado)))}",
                    "type": "series",
                    "name": serie.get('title', serie.get('name', 'Série sem título')),
                    "poster": serie.get('poster', serie.get('image', serie.get('thumbnail', ''))),
                    "description": serie.get('description', serie.get('desc', serie.get('synopsis', ''))),
                    "streamUrl": serie.get('url', serie.get('stream_url', serie.get('link', '')))
                })
            except Exception as e:
                print(f"Erro ao processar série: {e}", file=sys.stderr)
                continue

        print(f"Encontradas {len(resultado)} séries", file=sys.stderr)
        return resultado

    except ImportError:
        print("ERRO: biblioteca redecanais não instalada", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Erro ao buscar séries: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return []

def main():
    """Função principal - retorna JSON com todo o catálogo"""
    print("="*60, file=sys.stderr)
    print("RedeCanais Scraper v2.0", file=sys.stderr)
    print("="*60, file=sys.stderr)

    catalogo = {
        "CHANNELS": buscar_canais(),
        "MOVIES": buscar_filmes(100),
        "SERIES": buscar_series(100)
    }

    # Salvar em data.json
    try:
        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(catalogo, f, ensure_ascii=False, indent=2)
        print(f"\n✓ Salvo em data.json", file=sys.stderr)
    except Exception as e:
        print(f"\n✗ Erro ao salvar data.json: {e}", file=sys.stderr)

    # Estatísticas
    print("="*60, file=sys.stderr)
    print(f"Total: {len(catalogo['CHANNELS'])} canais, {len(catalogo['MOVIES'])} filmes, {len(catalogo['SERIES'])} séries", file=sys.stderr)
    print("="*60, file=sys.stderr)

    # Retorna JSON para stdout (usado pelo Node.js)
    print(json.dumps(catalogo, ensure_ascii=False))

if __name__ == "__main__":
    main()
