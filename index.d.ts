type Message = string | number[] | ArrayBuffer | ArrayBufferView;

interface Hasher {
  /**
   * Update hash
   *
   * @param message The message you want to hash.
   */
  update(message: Message): Hasher;

  /**
   * Return hash in hex string.
   */
  hex(): string;

  /**
   * Return hash in hex string.
   */
  toString(): string;

  /**
   * Return hash in ArrayBuffer.
   */
  arrayBuffer(): ArrayBuffer;

  /**
   * Return hash in ArrayBuffer.
   *
   * @deprecated Use `arrayBuffer` instead.
   */
  buffer(): ArrayBuffer;

  /**
   * Return hash in integer array.
   */
  digest(): number[];

  /**
   * Return hash in integer array.
   */
  array(): number[];
}

interface Hash {
  /**
   * Hash and return hex string.
   *
   * @param message The message you want to hash.
   */
  (message: Message): string;

  /**
   * Create a hash object.
   */
  create(): Hasher;

  /**
   * Create a hash object and hash message.
   *
   * @param message The message you want to hash.
   */
  update(message: Message): Hasher;

  /**
   * Return hash in hex string.
   *
   * @param message The message you want to hash.
   */
  hex(message: Message): string;

  /**
   * Return hash in ArrayBuffer.
   *
   * @param message The message you want to hash.
   */
  arrayBuffer(message: Message): ArrayBuffer;

  /**
   * Return hash in ArrayBuffer.
   *
   * @deprecated Use `arrayBuffer` instead.
   * @param message The message you want to hash.
   */
  buffer(message: Message): ArrayBuffer;

  /**
   * Return hash in integer array.
   *
   * @param message The message you want to hash.
   */
  digest(message: Message): number[];

  /**
   * Return hash in integer array.
   *
   * @param message The message you want to hash.
   */
  array(message: Message): number[];
}

export var md4: Hash;
