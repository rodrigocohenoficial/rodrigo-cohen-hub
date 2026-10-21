"""Transcreve o áudio com o tempo exato de cada palavra (faster-whisper).

Uso: python3 scripts/transcribe.py <audio.wav> <saida.json> <saida.txt> <duracao_s>
Modelo: variável WHISPER_MODEL (padrão "large-v3-turbo"; "small" é mais rápido e erra mais).
"""
import json
import os
import sys
import wave

import numpy as np
from faster_whisper import WhisperModel

# Vocabulário da Dra. Flávia: ajuda o Whisper a escrever certo os termos de saúde.
VOCAB = (
    "Dra. Flávia Cohen, menopausa, perimenopausa, reposição hormonal, testosterona, progesterona, estrogênio, "
    "suplementação, creatina, whey, colágeno, ômega 3, vitamina D, vitamina E, magnésio, lipedema, emagrecimento, "
    "tirzepatida, semaglutida, biohacking, câmara hiperbárica, infectologista, Always Fit, ácido gama-linolênico."
)


def read_wav(path: str) -> np.ndarray:
    """Lê o WAV mono 16 kHz gerado pelo ffmpeg (evita depender da versão do PyAV)."""
    with wave.open(path, "rb") as f:
        pcm = f.readframes(f.getnframes())
    return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0


def main() -> None:
    audio, out_json, out_txt, duration = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
    model = WhisperModel(os.environ.get("WHISPER_MODEL", "large-v3-turbo"), device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        read_wav(audio),
        language="pt",
        word_timestamps=True,
        vad_filter=True,
        initial_prompt=VOCAB,
    )

    words, lines = [], []
    for seg in segments:
        lines.append(f"[{seg.start:6.2f} → {seg.end:6.2f}] {seg.text.strip()}")
        for w in seg.words or []:
            words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})

    with open(out_json, "w", encoding="utf-8") as f:
        json.dump({"duration": round(duration, 3), "language": info.language, "words": words}, f, ensure_ascii=False, indent=1)

    # Versão de leitura: cada palavra com o seu segundo, para montar o plano de cenas.
    with open(out_txt, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
        f.write("\n\n--- palavra por palavra ---\n")
        f.write("\n".join(f"{w['start']:6.2f}  {w['word']}" for w in words))

    print(f"{len(words)} palavras · {duration:.1f}s")


if __name__ == "__main__":
    main()
