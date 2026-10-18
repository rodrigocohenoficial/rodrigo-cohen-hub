import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Como Rodrigo Cohen guarda e usa os dados que você deixa nos formulários do site.",
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-[720px] mx-auto px-7 py-14">
      <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
        Privacidade
      </span>
      <h1 className="font-serif font-semibold text-evergreen text-[clamp(30px,4.4vw,46px)] leading-[1.08] tracking-[-0.015em] mt-3 mb-8">
        Política de privacidade
      </h1>

      <div className="art-body">
        <h2>Quais dados eu guardo</h2>
        <p>
          Nome e WhatsApp que você escreve nos formulários deste site. Também
          guardo de qual link você chegou (por exemplo, um post no Instagram),
          a data e a hora do cadastro.
        </p>

        <h2>Pra que uso</h2>
        <p>
          Pra falar com você sobre o assunto do formulário que você preencheu,
          como a abertura de conta na ITERA, e pra mandar conteúdo sobre
          investimentos. Saber de onde você veio me mostra quais conteúdos
          funcionam melhor.
        </p>

        <h2>Com quem compartilho</h2>
        <p>
          Com ninguém. Seus dados ficam guardados no Google, com acesso só da
          minha equipe. Eu não vendo nem repasso seus dados. O cadastro que
          você faz no site da ITERA segue a política de privacidade da ITERA.
        </p>

        <h2>Seus direitos</h2>
        <p>
          Você pode pedir a qualquer momento pra ver, corrigir ou apagar seus
          dados, ou pra parar de receber mensagens. É só escrever para{" "}
          <a href="mailto:cohen@rodrigocohen.com.br">cohen@rodrigocohen.com.br</a>.
        </p>
      </div>
    </div>
  );
}
