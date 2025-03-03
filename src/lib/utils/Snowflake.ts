type SnowflakeType = string & { length: 6 };
import Base62 from './Base62';
class Snowflake {
  private static lastTimestamp = 0;
  private static sequence = 0;
  private static CUSTOM_EPOCH = new Date('2025-02-22T00:00:00Z').getTime();

  private static isValid(id: string): id is SnowflakeType {
    return /^[0-9a-zA-Z]{6}$/.test(id);
  }

  public static generate(date: Date): SnowflakeType {
    const timestamp = date.getTime() - this.CUSTOM_EPOCH;

    if (timestamp === this.lastTimestamp) {
      this.sequence++;
    } else {
      this.sequence = 0;
      this.lastTimestamp = timestamp;
    }

    const snowflake = Base62.encode(timestamp) + Base62.encode(this.sequence);

    if (!this.isValid(snowflake)) {
      throw new Error('Generated ID is not a valid Snowflake');
    }

    return snowflake;
  }

  public static recoverTimestamp(userId: string): Date {
    let timestampEncoded = '';
    for (const char of userId) {
      if (!isNaN(parseInt(char))) {
        timestampEncoded += char;
      } else {
        break;
      }
    }

    const timestamp = Base62.decode(timestampEncoded) + this.CUSTOM_EPOCH;
    return new Date(timestamp);
  }
}

export default Snowflake;
