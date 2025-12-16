-- ============================================================================
-- ENCODING / GLOBAL SETTINGS
-- ============================================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET collation_connection = utf8mb4_unicode_ci;
SET time_zone = '+00:00';

-- ============================================================================
-- TABLES: USERS / ROLES / TOKENS / PROFILES
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id                CHAR(36)       NOT NULL,
  email             VARCHAR(255)   NOT NULL,
  password_hash     VARCHAR(255)   NOT NULL,
  full_name         VARCHAR(255)   DEFAULT NULL,
  phone             VARCHAR(50)    DEFAULT NULL,
  wallet_balance    DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  is_active         TINYINT(1)     NOT NULL DEFAULT 1,
  email_verified    TINYINT(1)     NOT NULL DEFAULT 0,
  reset_token             VARCHAR(255)  DEFAULT NULL,
  reset_token_expires     DATETIME(3)   DEFAULT NULL,
  created_at        DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at        DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  last_sign_in_at   DATETIME(3)    DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
  id          CHAR(36)     NOT NULL,
  user_id     CHAR(36)     NOT NULL,
  role        ENUM('admin','moderator','user') NOT NULL DEFAULT 'user',
  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY user_roles_user_id_role_unique (user_id, role),
  KEY user_roles_user_id_idx (user_id),
  CONSTRAINT fk_user_roles_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id           CHAR(36)     NOT NULL,
  user_id      CHAR(36)     NOT NULL,
  token_hash   VARCHAR(255) NOT NULL,
  created_at   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at   DATETIME(3)  NOT NULL,
  revoked_at   DATETIME(3)  DEFAULT NULL,
  replaced_by  CHAR(36)     DEFAULT NULL,
  PRIMARY KEY (id),
  KEY refresh_tokens_user_id_idx (user_id),
  KEY refresh_tokens_expires_at_idx (expires_at),
  CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profiles (
  id             CHAR(36)      NOT NULL,
  full_name      TEXT          DEFAULT NULL,
  phone          VARCHAR(64)   DEFAULT NULL,
  avatar_url     TEXT          DEFAULT NULL,
  address_line1  VARCHAR(255)  DEFAULT NULL,
  address_line2  VARCHAR(255)  DEFAULT NULL,
  city           VARCHAR(128)  DEFAULT NULL,
  country        VARCHAR(128)  DEFAULT NULL,
  postal_code    VARCHAR(32)   DEFAULT NULL,
  created_at     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT fk_profiles_id_users_id
    FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DEFAULT ADMIN USERS
-- NOT: {{ADMIN_PASSWORD_HASH}} => "admin123" hash'i (runner tarafından üretiliyor)
-- ============================================================================

-- 1) ENV tabanlı ana admin (placeholder)
INSERT INTO users (
  id, email, password_hash, full_name, phone,
  wallet_balance, is_active, email_verified, created_at, updated_at
) VALUES (
  '{{ADMIN_ID}}',
  '{{ADMIN_EMAIL}}',
  '{{ADMIN_PASSWORD_HASH}}',
  'Orhan Güzel',
  '+905551112233',
  0.00, 1, 1,
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  password_hash  = VALUES(password_hash),
  full_name      = VALUES(full_name),
  phone          = VALUES(phone),
  is_active      = 1,
  email_verified = 1,
  updated_at     = CURRENT_TIMESTAMP(3);

-- ENV admin profile
INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES ('{{ADMIN_ID}}', 'Orhan Güzel', '+905551112233', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone     = VALUES(phone),
  updated_at= CURRENT_TIMESTAMP(3);

-- 2.2) admin@mezarizm.com
INSERT INTO users (
  id, email, password_hash, full_name, phone,
  wallet_balance, is_active, email_verified, created_at, updated_at
) VALUES (
  UUID(),
  'admin@mezarizm.com',
  '{{ADMIN_PASSWORD_HASH}}',
  'Mezarizm Admin',
  '+905551112233',
  0.00, 1, 1,
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  password_hash  = VALUES(password_hash),
  full_name      = VALUES(full_name),
  phone          = VALUES(phone),
  is_active      = 1,
  email_verified = 1,
  updated_at     = CURRENT_TIMESTAMP(3);

-- 2.3) support@mezarizm.com
INSERT INTO users (
  id, email, password_hash, full_name, phone,
  wallet_balance, is_active, email_verified, created_at, updated_at
) VALUES (
  UUID(),
  'support@mezarizm.com',
  '{{ADMIN_PASSWORD_HASH}}',
  'Support Admin',
  '+905500000000',
  0.00, 1, 1,
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  password_hash  = VALUES(password_hash),
  full_name      = VALUES(full_name),
  phone          = VALUES(phone),
  is_active      = 1,
  email_verified = 1,
  updated_at     = CURRENT_TIMESTAMP(3);

-- 2.4) info@mezarizm.com
INSERT INTO users (
  id, email, password_hash, full_name, phone,
  wallet_balance, is_active, email_verified, created_at, updated_at
) VALUES (
  UUID(),
  'info@mezarizm.com',
  '{{ADMIN_PASSWORD_HASH}}',
  'Info Admin',
  '+905500000001',
  0.00, 1, 1,
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  password_hash  = VALUES(password_hash),
  full_name      = VALUES(full_name),
  phone          = VALUES(phone),
  is_active      = 1,
  email_verified = 1,
  updated_at     = CURRENT_TIMESTAMP(3);

-- Optional: sabit adminler için profile kayıtları (id'yi users'tan çekiyoruz)

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
SELECT u.id, 'Orhan Güzel', '+905551112233', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
FROM users u
WHERE u.email = 'orhanguzel@gmail.com'
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone     = VALUES(phone),
  updated_at= CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
SELECT u.id, 'Mezarizm Admin', '+905551112233', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
FROM users u
WHERE u.email = 'admin@mezarizm.com'
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone     = VALUES(phone),
  updated_at= CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
SELECT u.id, 'Support Admin', '+905500000000', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
FROM users u
WHERE u.email = 'support@mezarizm.com'
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone     = VALUES(phone),
  updated_at= CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
SELECT u.id, 'Info Admin', '+905500000001', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
FROM users u
WHERE u.email = 'info@mezarizm.com'
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone     = VALUES(phone),
  updated_at= CURRENT_TIMESTAMP(3);

-- ============================================================================
-- ADMIN ROLES: Tüm bu emailler için admin rolü
-- ============================================================================

INSERT IGNORE INTO user_roles (id, user_id, role, created_at)
SELECT
  UUID(),
  u.id,
  'admin',
  CURRENT_TIMESTAMP(3)
FROM users u
WHERE u.email IN (
  '{{ADMIN_EMAIL}}',
  'orhanguzel@gmail.com',
  'admin@mezarizm.com',
  'support@mezarizm.com',
  'info@mezarizm.com'
);
