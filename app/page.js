import { Suspense } from "react";
import { prefetchDNS } from "react-dom";
import Confetti from "./confetti";

const TABNEWS_URL = "https://www.tabnews.com.br";

// Cache entre requisições: a página é pré-gerada e revalidada no máximo
// a cada 60 segundos, em vez de consultar a API do TabNews a cada acesso.
export const revalidate = 60;

async function fetchTotalContents() {
  try {
    const response = await fetch(
      `${TABNEWS_URL}/api/v1/contents?per_page=1&strategy=new`,
      {
        next: { revalidate },
        // Evita que uma API lenta segure a renderização indefinidamente.
        signal: AbortSignal.timeout(3000),
      },
    );

    if (!response.ok) return null;

    const total = Number(response.headers.get("x-pagination-total-rows"));
    return Number.isFinite(total) ? total : null;
  } catch {
    return null;
  }
}

// Só este trecho depende da API; o restante da página não espera por ele.
async function TotalContents() {
  const totalContents = await fetchTotalContents();

  return (
    <p>
      {totalContents !== null
        ? `Total de conteúdos publicados no TabNews: ${totalContents.toLocaleString("pt-BR")}`
        : "Não foi possível carregar o total de conteúdos publicados no TabNews."}
    </p>
  );
}

export default function Home() {
  // Resolve o DNS do TabNews antecipadamente, antes do clique no link.
  prefetchDNS(TABNEWS_URL);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "1rem",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Confetti />
      <h1>🚧 Em Construção 🚧</h1>
      <p style={{ maxWidth: "40rem", fontSize: "1.25rem", lineHeight: 1.5 }}>
        Estamos neste exato momento reconstruindo o TabNews, um lugar na
        internet para quem trabalha com tecnologia e precisa consumir conteúdos
        com valor concreto
      </p>
      <Suspense fallback={<p>Carregando total de conteúdos publicados…</p>}>
        <TotalContents />
      </Suspense>
      <a href={TABNEWS_URL} target="_blank" rel="noopener noreferrer">
        Acesse o TabNews oficial
      </a>
    </main>
  );
}
