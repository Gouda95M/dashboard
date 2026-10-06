export type FieldConfig<T> = {
  name: keyof T & string;
  label: string;
  type: "text" | "email" | "number" | "date" | "select";
  options?: string[];
  placeholder?: string;
  min?: number;
};
