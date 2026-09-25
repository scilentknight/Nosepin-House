import { z } from "zod";

export const attributeSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  type: z.enum(["TEXT", "COLOR"]).default("TEXT"),
  sortOrder: z.number().int().default(0),
});

export type AttributeInput = z.infer<typeof attributeSchema>;

export const attributeValueSchema = z.object({
  value: z.string().min(1, "Value is required").max(80),
  colorHex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex color like #ff0000")
    .nullable()
    .optional(),
  sortOrder: z.number().int().default(0),
});

export type AttributeValueInput = z.infer<typeof attributeValueSchema>;
