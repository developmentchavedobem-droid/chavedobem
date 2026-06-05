"use client";

type AdPageVisitTrackerProps = {
  slug: string;
  page: "campaign" | "description" | "instructions" | "tutorial";
  refCode?: string;
};

export default function AdPageVisitTracker(_props: AdPageVisitTrackerProps) {
  void _props;

  /*
   * Captacao de visitas monetizadas pausada durante a revisao do Google AdSense.
   *
   * Logica anterior:
   * - lia o codigo de divulgacao via query string ou cookie `chave_ref`;
   * - enviava slug, pagina e referencia para `/api/campaigns/track-visit`;
   * - registrava a visita como base para calculos internos de monetizacao.
   *
   * Mantido comentado para preservar o historico da implementacao sem executar
   * nenhuma chamada de tracking no navegador.
   */

  return null;
}
