// QuoteParams structure:
// {
//   destinationZip: string,
//   weightOz: number,
//   dimensionsIn?: { l: number, w: number, h: number },
//   speed: 'economy'|'standard'|'expedited',
//   mode: 'outbound'|'inbound'
// }

// CarrierQuote structure:
// {
//   carrier: string,
//   service: string,
//   cost: number,
//   estDays?: number,
//   lastMile?: boolean
// }

// CarrierAdapter interface:
// - name: string
// - quote(params): Promise<CarrierQuote | null> // null if not applicable