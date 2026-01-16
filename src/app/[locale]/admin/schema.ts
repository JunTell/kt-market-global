
import { z } from 'zod';

export const OrderSchema = z.object({
  openingDate: z.string().min(1, 'Opening date is required'),
  deposit: z.coerce.number().min(0, 'Deposit must be 0 or greater'),
  collection: z.coerce.number().min(0, 'Collection must be 0 or greater'),
  accessories: z.string().optional(),
  termination: z.boolean().default(false),
  planChange: z.string().optional(),
  combination: z.string().optional(),
  memo: z.string().max(1000, 'Memo must be less than 1000 characters').optional(),
});
