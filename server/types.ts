export type ClaraMessage = {
  to: string;                  // agent handle
  subject: string;
  priority?: "low" | "normal" | "high";
  payload?: Record<string, any>;
  mallId?: string;
};

export type ClaraAck = {
  ok: true;
  ticketId: string;
  routedTo: string;
};