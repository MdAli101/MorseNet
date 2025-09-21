import mysql.connector
from mysql.connector import Error

# --- IMPORTANT: Configure your MySQL connection details below ---
# Replace 'localhost' with your server IP if it's not local.
# Replace 'your_username' and 'your_password' with your MySQL credentials.
MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = '2324'

def create_database_and_tables():
    """
    Connects to MySQL, creates the 'sosueme' database, and defines the 'report'
    and 'userdetails' tables with the specified schema.
    """
    try:
        # Establish a connection to the MySQL server
        # We don't specify a database initially because we need to create it first.
        connection = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD
        )

        if connection.is_connected():
            cursor = connection.cursor()

            # 1. Create the database
            db_name = "sosueme"
            print(f"Attempting to create database '{db_name}'...")
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}`")
            print(f"Database '{db_name}' created or already exists.")

            # 2. Switch to using the new database
            cursor.execute(f"USE `{db_name}`")

            # 3. Define the SQL command to create the 'report' table
            # This table has an auto-incrementing primary key.
            report_table_sql = """
            CREATE TABLE IF NOT EXISTS report (
                id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                file_name VARCHAR(255) NOT NULL,
                file_path TEXT NOT NULL,
                tag VARCHAR(30) NOT NULL
            )
            """
            # Execute the SQL command to create the report table
            print("Attempting to create 'report' table...")
            cursor.execute(report_table_sql)
            print("Table 'report' created or already exists.")

            # 4. Define the SQL command to create the 'userdetails' table
            # This table has a foreign key 'id' that links to the 'report' table.
            # A foreign key constraint ensures data integrity between the tables.
            # NOTE ON SECURITY: Storing passwords in plain text is not recommended.
            # In a real-world application, you should use hashing functions (e.g., bcrypt)
            # to securely store user passwords.
            userdetails_table_sql = """
            CREATE TABLE IF NOT EXISTS userdetails (
                id INT,
                user_name VARCHAR(255),
                password VARCHAR(255),
                email VARCHAR(255),
                date_time_entry DATETIME,
                FOREIGN KEY (id) REFERENCES report(id)
            )
            """
            # Execute the SQL command to create the userdetails table
            print("Attempting to create 'userdetails' table...")
            cursor.execute(userdetails_table_sql)
            print("Table 'userdetails' created or already exists.")

            print("\nDatabase and tables created successfully!")

    except Error as e:
        print(f"Error while connecting to MySQL or creating tables: {e}")

    finally:
        # Close the cursor and connection to free up resources
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed.")

# Main part of the script
if __name__ == "__main__":
    create_database_and_tables()
