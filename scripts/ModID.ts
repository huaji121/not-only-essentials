export class ModId {
  readonly id: string;
  constructor(id: string) {
    this.id = id;
  }
  public of(name: string) {
    return `${this.id}:${name}`;
  }
}

export const MOD_ID = new ModId("noe");
