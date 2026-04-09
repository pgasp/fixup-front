import { PurchaseOrder, Quote } from '../types';

/** Indicateur pour devis approuvés avec pièces sur commande liées à un bon fournisseur. */
export type ApprovedQuotePreOrderIndicator = 'none' | 'waiting' | 'fulfilled';

export function approvedQuotePreOrderIndicator(quote: Quote): ApprovedQuotePreOrderIndicator {
  if (quote.status !== 'approved') {
    return 'none';
  }
  const preOrderParts = quote.laborItems.flatMap((l) => l.partItems).filter((p) => p.isPreOrder);
  if (preOrderParts.length === 0) {
    return 'none';
  }
  const touchedBySupplierOrder = preOrderParts.some(
    (p) => p.preOrderStatus === 'ordered' || p.preOrderStatus === 'received',
  );
  if (!touchedBySupplierOrder) {
    return 'none';
  }
  if (preOrderParts.some((p) => p.preOrderStatus === 'ordered')) {
    return 'waiting';
  }
  return 'fulfilled';
}

/** Met à jour les lignes de devis dont les pièces étaient « commandées » lorsque le BC est réceptionné. */
export function patchQuoteForReceivedPurchaseOrder(quote: Quote, order: PurchaseOrder): Quote {
  let modified = false;
  const nextLabor = quote.laborItems.map((labor) => {
    const nextParts = labor.partItems.map((part) => {
      if (!part.isPreOrder || part.preOrderStatus !== 'ordered') {
        return part;
      }
      const matched = order.items.some((oi) => {
        if (oi.sourceQuotePartItemId) {
          return oi.sourceQuotePartItemId === part.id;
        }
        return (
          oi.partId === part.partId &&
          oi.quantity === part.quantity &&
          part.supplier === order.supplier
        );
      });
      if (matched) {
        modified = true;
        return { ...part, preOrderStatus: 'received' as const };
      }
      return part;
    });
    return { ...labor, partItems: nextParts };
  });
  if (!modified) {
    return quote;
  }
  return { ...quote, laborItems: nextLabor };
}
