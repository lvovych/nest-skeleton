import * as dotenv from 'dotenv'
import * as Joi from '@hapi/joi'
import { Injectable } from '@nestjs/common'
import * as path from "path"

export type EnvConfig = Record<string, string>

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig

  constructor() {
    dotenv.config({ path: path.join(process.cwd(), `.env`) })

    this.envConfig = process.env
    this.envConfig = ConfigService.validateInput(this.envConfig)
  }

  get(key: string) {
    return this.envConfig[key]
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private static validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      APP_PORT: Joi.number().default(3000),

      TYPEORM_CONNECTION: Joi.string().required(),
      TYPEORM_HOST: Joi.string().required(),
      TYPEORM_PORT: Joi.number().required().default(3306),
      TYPEORM_USERNAME: Joi.string().required(),
      TYPEORM_PASSWORD: Joi.string().required(),
      TYPEORM_DATABASE: Joi.string().required(),
      TYPEORM_SYNCHRONIZE: Joi.boolean().required().default(false),
      TYPEORM_LOGGING: Joi.string().valid('false', 'true', 'query', 'error', 'schema', 'log', 'info', 'all').required().default(true),
      TYPEORM_LOGGER: Joi.string().valid('advanced-console', 'simple-console', 'file').required(),
      TYPEORM_ENTITIES: Joi.string().required(),
      TYPEORM_MIGRATIONS: Joi.string().required(),
      TYPEORM_MIGRATIONS_DIR: Joi.string().required(),
    })

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig, {
        allowUnknown: true,
      },
    )
    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }
    return validatedEnvConfig

  }

  get dbType(): string {
    return this.get('TYPEORM_CONNECTION')
  }

  get dbHost(): string {
    return this.get('TYPEORM_HOST')
  }

  get dbPort(): number {
    return Number(this.get('TYPEORM_PORT'))
  }

  get dbName(): string {
    return this.get('TYPEORM_DATABASE')
  }

  get dbUser(): string {
    return this.get('TYPEORM_USERNAME')
  }

  get dbPass(): string {
    return this.get('TYPEORM_PASSWORD')
  }

  get dbSync(): boolean {
    return this.get('TYPEORM_SYNCHRONIZE') === 'true'
  }

  get dbLogging(): boolean | string {
    const val = this.get('TYPEORM_LOGGING')
    switch (this.get('TYPEORM_LOGGING')) {
      case 'true':
        return true
      case 'false':
        return false
      default:
        return val
    }
  }

}
