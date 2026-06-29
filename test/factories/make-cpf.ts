import { generate } from "gerador-validador-cpf";

export function makeValidCpf(format = false): string {
  return generate({ format });
}

export function makeInvalidCpf(format = false): string {
  const cpf = generate({ format: false });

  const invalidCpf = cpf.slice(0, 10) + (cpf[10] === "9" ? "0" : "9");

  if (!format) {
    return invalidCpf;
  }

  return invalidCpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}
