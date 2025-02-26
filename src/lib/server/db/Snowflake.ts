type SnowflakeType = string & { length: 6 };

class Snowflake {
    private static lastTimestamp = 0;
    private static sequence = 0;
    private static CUSTOM_EPOCH = new Date('2025-02-22T00:00:00Z').getTime(); // 2025-02-27 00:00:00 UTC
    /**
     * Encodes a given number to a Base62-encoded string.
     * @param num The number to encode.
     * @returns The Base62-encoded string representation of the number.
     */
     static base62Encode(num: number): string {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      while (num > 0) {
        result = chars[num % 62] + result;
        num = Math.floor(num / 62);
      }
      return result || '0';
    }
  
    /**
     * Decodes a given Base62-encoded string to its original number.
     * @param str The Base62-encoded string to decode.
     * @returns The original number.
     */
     static base62Decode(str: string): number {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let num = 0;
      for (const char of str) {
        num = num * 62 + chars.indexOf(char);
      }
      return num;
    }
  
    /**
     * Checks if the given string is a valid Snowflake ID.
     * A valid Snowflake ID is a 6-character string consisting only of Base62 characters.
     * @param id The string to be validated as a Snowflake ID.
     * @returns Returns `true` if the string is a valid Snowflake ID, otherwise `false`.
     */
    private static isValid(id: string): id is SnowflakeType {
      return /^[0-9a-zA-Z]{6}$/.test(id); // Solo caracteres Base62
    }
  
    /**
     * Generates a unique Snowflake ID based on the given `date` by combining
     * the timestamp of the date with a sequence number.
     * @param date The date to generate the Snowflake for.
     * @returns A unique Snowflake ID as a 6-character string.
     * @throws {Error} If the generated ID is not a valid Snowflake.
     */
    public static generate(date: Date): SnowflakeType {
      const timestamp = date.getTime() - this.CUSTOM_EPOCH;
  
      if (timestamp === this.lastTimestamp) {
        this.sequence++;
      } else {
        this.sequence = 0;
        this.lastTimestamp = timestamp;
      }
  
      const snowflake = this.base62Encode(timestamp) + this.base62Encode(this.sequence);
  
      if (!this.isValid(snowflake)) {
        throw new Error('Generated ID is not a valid Snowflake');
      }
  
      return snowflake;
    }
  
    /**
     * Recovers the timestamp that was used to generate the given `userId`.
     * This timestamp is the number of milliseconds since the `CUSTOM_EPOCH`.
     * @param userId The `Snowflake` to recover the timestamp from.
     * @returns The timestamp as a `Date`.
     */
    public static recoverTimestamp(userId: string): Date {
      let timestampEncoded = '';
      for (const char of userId) {
        if (!isNaN(parseInt(char))) {
          timestampEncoded += char;
        } else {
          break;
        }
      }
  
      const timestamp = this.base62Decode(timestampEncoded) + this.CUSTOM_EPOCH;
      return new Date(timestamp);
    }
  }
  export default Snowflake;