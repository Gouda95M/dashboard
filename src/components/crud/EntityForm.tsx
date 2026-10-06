"use client";

import { useState, type FormEvent } from "react";
import { Button, Field, Input, Select } from "@/components/customizeComponents";
import type { FieldConfig } from "./types";

type Values = Record<string, string>;

function validate<T>(fields: FieldConfig<T>[], values: Values) {
  const errors: Values = {};
  for (const f of fields) {
    const value = values[f.name].trim();
    if (!value) errors[f.name] = `${f.label} is required`;
    else if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[f.name] = "Enter a valid email";
    else if (f.type === "number") {
      if (Number.isNaN(Number(value))) errors[f.name] = "Enter a valid number";
      else if (f.min !== undefined && Number(value) < f.min) errors[f.name] = `Must be at least ${f.min}`;
    }
  }
  return errors;
}

type EntityFormProps<T> = {
  fields: FieldConfig<T>[];
  initialValues: Values;
  submitLabel: string;
  onSubmit: (values: Values) => void | Promise<void>;
  onCancel: () => void;
};

export function EntityForm<T>({ fields, initialValues, submitLabel, onSubmit, onCancel }: EntityFormProps<T>) {
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Values>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(fields, values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {fields.map((f) => {
        const common = {
          id: f.name,
          value: values[f.name],
          "aria-invalid": Boolean(errors[f.name]),
          onChange: (e: { target: { value: string } }) => setValues((v) => ({ ...v, [f.name]: e.target.value })),
        };
        return (
          <Field key={f.name} label={f.label} htmlFor={f.name} error={errors[f.name]}>
            {f.type === "select" ? (
              <Select options={f.options ?? []} {...common} />
            ) : (
              <Input type={f.type} placeholder={f.placeholder} {...common} />
            )}
          </Field>
        );
      })}
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
