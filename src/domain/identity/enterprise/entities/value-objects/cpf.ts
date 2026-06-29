import { ValueObject } from "@/core/entities/value-object";

interface CPFProps {
  value: string;
}

export class CPF extends ValueObject<CPFProps> {
  private constructor(props: CPFProps) {
    super(props);
  }

  public static create(value: string): CPF {
    const normalized = value.replace(/\D/g, "");

    if (!this.isValid(normalized)) {
      throw new Error("Invalid CPF.");
    }

    return new CPF({
      value: normalized,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get formatted(): string {
    return this.props.value.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      "$1.$2.$3-$4",
    );
  }

  public toString(): string {
    return this.props.value;
  }

  private static isValid(cpf: string): boolean {
    if (!/^\d{11}$/.test(cpf)) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += Number(cpf[i]) * (10 - i);
    }

    let digit = (sum * 10) % 11;

    if (digit === 10) {
      digit = 0;
    }

    if (digit !== Number(cpf[9])) {
      return false;
    }

    sum = 0;

    for (let i = 0; i < 10; i++) {
      sum += Number(cpf[i]) * (11 - i);
    }

    digit = (sum * 10) % 11;

    if (digit === 10) {
      digit = 0;
    }

    return digit === Number(cpf[10]);
  }
}
