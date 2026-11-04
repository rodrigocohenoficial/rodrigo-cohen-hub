# Arquétipos: carrossel-imagens-b3

Todos têm o cabeçalho tweet-mock (avatar 118px + "Rodrigo Cohen" + selo azul + @rodrigocohenoficial) e o contador `N/total` no canto superior direito. Texto em cima, imagem embaixo, fonte (quando houver) no rodapé em 24px.

| Arquétipo | Fonte máx → mín | Imagem inicial | Prioridade | Quando usar |
|---|---|---|---|---|
| `capa` | 68 → 52px | 560px | texto | Slide 1. Dissonância cognitiva, sem apresentação, sem jargão. Normalmente foto real do Rodrigo. |
| `conteudo` | 54 → 44px | 480px | texto | Miolo. 2 a 4 frases. Foto ou print. |
| `conteudo-grafico` | 48 → 40px | 640px | imagem | Quando o dado é o argumento. Gráfico ou diagrama grande, `imagem_fit: contain`, `fonte:` obrigatória. |
| `virada` | 60 → 46px | 420px | texto | Exatamente um por carrossel, no ponto de virada. Fundo `#0D0D0D`. Frase mais forte do post. |
| `cta` | 54 → 44px | 520px | texto | Último slide. CTA de salvar/comentar/compartilhar com substância (nada de "segue pra mais"). `assinatura:` opcional, ex.: "Rodrigo Cohen, Analista CNPI". |

**Prioridade texto:** se não cabe, a imagem encolhe até o mínimo (foto 420px, demais 360px) antes de a fonte diminuir.
**Mínimo da imagem é piso duro:** se mesmo com fonte mínima não couber, o export falha e pede corte de texto.
**Prioridade imagem:** a fonte diminui antes, porque o gráfico precisa ser legível no celular.
Sobrou espaço (ocupação < 84%)? A imagem cresce até 760px.

`tamanho:` no roteiro sobrescreve a fonte máxima de um slide específico. Nunca abaixo de 36px.

## Arco padrão (7 slides)
1. `capa`: afirmação que contraria o senso comum.
2. `conteudo`: o contexto, com foto ou print oficial.
3. `conteudo-grafico`: o dado conferido.
4. `conteudo`: o que isso muda na prática.
5. `virada`: a frase de posicionamento.
6. `conteudo`: o processo / o passo prático (B3 como aliada: Área do Investidor, Bora Investir, transparência).
7. `cta`: ação concreta + métrica-alvo (salvar, compartilhar ou comentar).
