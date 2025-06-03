# Supabase Database Schema for Barbershop Management System

This document outlines the proposed database schema for the Barbershop Management System, intended for use with Supabase (PostgreSQL).

## Tables

### 1. `clients`

Stores information about the barbershop's clients.

| Column         | Data Type                 | Constraints                                  | Description                                  |
|----------------|---------------------------|----------------------------------------------|----------------------------------------------|
| `id`           | `uuid`                    | `PRIMARY KEY`, `default uuid_generate_v4()`  | Unique identifier for the client.            |
| `name`         | `text`                    | `NOT NULL`                                   | Full name of the client.                     |
| `phone`        | `text`                    |                                              | Phone number of the client.                  |
| `email`        | `text`                    | `UNIQUE`                                     | Email address of the client.                 |
| `notes`        | `text`                    |                                              | Additional notes about the client.           |
| `created_at`   | `timestamp with time zone` | `default now()`                              | Timestamp of when the client was created.    |
| `updated_at`   | `timestamp with time zone` | `default now()`                              | Timestamp of when the client was last updated. |

### 2. `employees`

Stores information about the barbershop's employees (barbers, stylists, etc.).

| Column         | Data Type                 | Constraints                                  | Description                                     |
|----------------|---------------------------|----------------------------------------------|-------------------------------------------------|
| `id`           | `uuid`                    | `PRIMARY KEY`, `default uuid_generate_v4()`  | Unique identifier for the employee.             |
| `name`         | `text`                    | `NOT NULL`                                   | Full name of the employee.                      |
| `phone`        | `text`                    |                                              | Phone number of the employee.                   |
| `email`        | `text`                    | `UNIQUE`                                     | Email address of the employee.                  |
| `job_title`    | `text`                    |                                              | Job title (e.g., 'Barber', 'Stylist').          |
| `specialties`  | `jsonb`                   | `NULLABLE`                                   | List of specialties (e.g., `["Corte Degradê", "Barba"]`). |
| `availability` | `jsonb`                   |                                              | Stores working hours (e.g., `{"monday": "09:00-17:00"}`). |
| `created_at`   | `timestamp with time zone` | `default now()`                              | Timestamp of when the employee was created.     |
| `updated_at`   | `timestamp with time zone` | `default now()`                              | Timestamp of when the employee was last updated. |

### 3. `services`

Stores information about the services offered by the barbershop.

| Column           | Data Type                 | Constraints                                  | Description                                       |
|------------------|---------------------------|----------------------------------------------|---------------------------------------------------|
| `id`             | `uuid`                    | `PRIMARY KEY`, `default uuid_generate_v4()`  | Unique identifier for the service.                |
| `name`           | `text`                    | `NOT NULL`                                   | Name of the service.                              |
| `description`    | `text`                    |                                              | Detailed description of the service.              |
| `duration_minutes` | `integer`                 | `NOT NULL`                                   | Duration of the service in minutes.               |
| `price`          | `decimal`                 | `NOT NULL`                                   | Price of the service.                             |
| `is_active`      | `boolean`                 | `default true`                               | Whether the service is currently offered.         |
| `created_at`     | `timestamp with time zone` | `default now()`                              | Timestamp of when the service was created.        |
| `updated_at`     | `timestamp with time zone` | `default now()`                              | Timestamp of when the service was last updated.   |

### 4. `appointments`

Stores information about scheduled, completed, or cancelled appointments.

| Column           | Data Type                 | Constraints                                  | Description                                       |
|------------------|---------------------------|----------------------------------------------|---------------------------------------------------|
| `id`             | `uuid`                    | `PRIMARY KEY`, `default uuid_generate_v4()`  | Unique identifier for the appointment.            |
| `client_id`      | `uuid`                    | `NOT NULL`, `REFERENCES clients(id)`         | Foreign key referencing the `clients` table.      |
| `employee_id`    | `uuid`                    | `NOT NULL`, `REFERENCES employees(id)`       | Foreign key referencing the `employees` table.    |
| `service_id`     | `uuid`                    | `NOT NULL`, `REFERENCES services(id)`        | Foreign key referencing the `services` table.     |
| `appointment_time` | `timestamp with time zone` | `NOT NULL`                                   | Start date and time of the appointment.           |
| `status`         | `text`                    | `default 'scheduled'`                        | Status of the appointment (e.g., 'scheduled', 'completed', 'cancelled', 'no-show'). |
| `payment_status` | `text`                    | `NULLABLE`, `default 'pending'`              | Payment status (e.g., 'pending', 'paid').         |
| `notes`          | `text`                    |                                              | Any specific notes for this appointment.          |
| `created_at`     | `timestamp with time zone` | `default now()`                              | Timestamp of when the appointment was created.    |
| `updated_at`     | `timestamp with time zone` | `default now()`                              | Timestamp of when the appointment was last updated. |

### 5. `settings`

A key-value store for application-wide settings.

| Column          | Data Type                 | Constraints                                  | Description                                       |
|-----------------|---------------------------|----------------------------------------------|---------------------------------------------------|
| `id`            | `uuid`                    | `PRIMARY KEY`, `default uuid_generate_v4()`  | Unique identifier for the setting entry.          |
| `setting_key`   | `text`                    | `NOT NULL`, `UNIQUE`                         | The unique key for the setting (e.g., 'shop_name'). |
| `setting_value` | `text`                    |                                              | The value of the setting.                         |
| `description`   | `text`                    |                                              | Optional description of what the setting is for.  |
| `created_at`    | `timestamp with time zone` | `default now()`                              | Timestamp of when the setting was created.        |
| `updated_at`    | `timestamp with time zone` | `default now()`                              | Timestamp of when the setting was last updated.   |

## Relationships Summary

-   **`appointments` to `clients`**: Many-to-One
    -   An appointment must have one client.
    -   A client can have many appointments.
-   **`appointments` to `employees`**: Many-to-One
    -   An appointment must be assigned to one employee.
    -   An employee can have many appointments.
-   **`appointments` to `services`**: Many-to-One
    -   An appointment is for one specific service.
    -   A service can be part of many appointments.

## Notes

-   The `uuid_generate_v4()` function needs to be available in PostgreSQL. Supabase enables the `uuid-ossp` extension by default, which provides this.
-   `updated_at` columns can be automatically updated using database triggers, for example:
    ```sql
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Example for the 'clients' table
    CREATE TRIGGER set_timestamp_clients
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
    ```
    This trigger would need to be created for each table with an `updated_at` column.
-   "Reports" and "Dashboard" functionalities will be primarily served by querying and aggregating data from these tables, not by dedicated tables.
