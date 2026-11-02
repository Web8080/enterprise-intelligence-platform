from dataclasses import dataclass
import os


@dataclass
class Settings:
    environment: str = os.getenv("ENVIRONMENT", "development")
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    api_base_url: str = os.getenv("API_BASE_URL", "http://localhost:8000")

    snowflake_account: str | None = os.getenv("SNOWFLAKE_ACCOUNT")
    snowflake_user: str | None = os.getenv("SNOWFLAKE_USER")
    snowflake_password: str | None = os.getenv("SNOWFLAKE_PASSWORD")
    snowflake_role: str | None = os.getenv("SNOWFLAKE_ROLE", "ACCOUNTADMIN")
    snowflake_warehouse: str | None = os.getenv("SNOWFLAKE_WAREHOUSE")
    snowflake_database: str | None = os.getenv("SNOWFLAKE_DATABASE")
    snowflake_schema: str | None = os.getenv("SNOWFLAKE_SCHEMA")
    snowflake_region: str | None = os.getenv("SNOWFLAKE_REGION")
    snowflake_host: str | None = os.getenv("SNOWFLAKE_HOST")
    snowflake_private_key_path: str | None = os.getenv("SNOWFLAKE_PRIVATE_KEY_PATH")
    snowflake_private_key_passphrase: str | None = os.getenv("SNOWFLAKE_PRIVATE_KEY_PASSPHRASE")

    @property
    def snowflake_ready(self) -> bool:
        has_credentials = bool(
            self.snowflake_account
            and self.snowflake_user
            and self.snowflake_warehouse
            and self.snowflake_database
            and self.snowflake_schema
            and (
                self.snowflake_password
                or self.snowflake_private_key_path
            )
        )
        return has_credentials


settings = Settings()
