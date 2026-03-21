/**
 * Utilitários de formatação para a loja Raízes
 */

/**
 * Formata um valor numérico em Real Brasileiro (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata uma data em pt-BR
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("pt-BR", options ?? defaultOptions).format(
    new Date(dateString)
  );
}

/**
 * Gera um slug a partir de um texto
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Trunca um texto com reticências
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Retorna a primeira imagem de um produto ou um placeholder
 */
export function getProductMainImage(
  imagesUrls: string[] | null | undefined
): string {
  if (!imagesUrls || imagesUrls.length === 0) {
    return "/placeholder-product.jpg";
  }
  return imagesUrls[0];
}

/**
 * Mapeia status do pedido para texto em português
 */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  confirmed: "Pagamento confirmado",
  processing: "Em preparação",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}
