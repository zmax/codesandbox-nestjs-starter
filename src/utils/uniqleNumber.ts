export class UniqleIndex {
  static _index = 0;

  static get index(): number {
    return ++UniqleIndex._index;
  }
}