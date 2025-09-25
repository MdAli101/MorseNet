import os, sys, mysql.connector
from mysql.connector import Error
from datetime import datetime

# -------------------------
# Config
# -------------------------
MYSQL_HOST = "localhost"
MYSQL_USER = "root"
MYSQL_PASSWORD = "2324"

ALLOWED_TAGS = {
    "water": "water_db",
    "drainage": "drainage_db",
    "electricity": "electricity_db",
    "roads": "roads_db",
    "garbage": "garbage_db"
}

# -------------------------
# DB Helper
# -------------------------
def get_connection(db_name=None):
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=db_name if db_name else None
    )

# -------------------------
# DB Setup
# -------------------------
def create_core_sosueme():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS sosueme")
        cursor.execute("USE sosueme")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS userdetails (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            user_name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            last_login DATETIME DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )""")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS report (
            report_id INT AUTO_INCREMENT PRIMARY KEY,
            file_name VARCHAR(255) NOT NULL,
            file_path TEXT,
            tag VARCHAR(30) NOT NULL,
            user_id INT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES userdetails(user_id)
        )""")
        conn.commit()
        print("✅ Core DB (sosueme) ready!")
    except Error as e:
        print(f"❌ Error: {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals() and conn.is_connected(): conn.close()

def create_municipality_and_departments():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS municipality")
        cursor.execute("USE municipality")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS pending_reports (
            report_id INT PRIMARY KEY,
            file_name VARCHAR(255),
            file_path TEXT,
            tag VARCHAR(30),
            user_id INT,
            status ENUM('pending','approved','rejected') DEFAULT 'pending',
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )""")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS status_log (
            log_id INT AUTO_INCREMENT PRIMARY KEY,
            report_id INT,
            old_status ENUM('pending','approved','rejected'),
            new_status ENUM('pending','approved','rejected'),
            changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (report_id) REFERENCES pending_reports(report_id)
        )""")
        conn.commit()
        print("✅ Municipality DB ready!")
        for tag, db in ALLOWED_TAGS.items():
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db}")
            cursor.execute(f"USE {db}")
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS resolved_reports (
                report_id INT PRIMARY KEY,
                file_name VARCHAR(255),
                file_path TEXT,
                tag VARCHAR(30),
                user_id INT,
          received_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )""")
            conn.commit()
            print(f"🏛️ Department DB '{db}' ready")
    except Error as e:
        print(f"❌ Error: {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals() and conn.is_connected(): conn.close()

def setup_all_databases():
    create_core_sosueme()
    create_municipality_and_departments()

# -------------------------
# User & Reports CRUD
# -------------------------
def register_user():
    print("\n📋 Register New User")
    name = input("Name: ").strip()
    email = input("Email: ").strip()
    password = input("Password: ").strip()
    confirm = input("Confirm Password: ").strip()
    if password != confirm:
        print("❌ Passwords do not match")
        return
    try:
        conn = get_connection("sosueme")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO userdetails (user_name,password,email) VALUES (%s,%s,%s)",(name,password,email))
        conn.commit()
        print(f"✅ User '{name}' registered successfully!")
    except Error as e:
        print(f"❌ Error: {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals() and conn.is_connected(): conn.close()

def login_user():
    print("\n🔐 User Login")
    email = input("Email: ").strip()
    password = input("Password: ").strip()
    try:
        conn = get_connection("sosueme")
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM userdetails WHERE email=%s AND password=%s",(email,password))
        user = cursor.fetchone()
        if not user:
            print("❌ Invalid credentials")
            return None
        cursor.execute("UPDATE userdetails SET last_login=%s WHERE user_id=%s",(datetime.now(),user['user_id']))
        conn.commit()
        print(f"✅ Welcome {user['user_name']}!")
        return user
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals() and conn.is_connected(): conn.close()

def submit_report(user):
    print("\n📝 Submit New Report")
    file_name = input("File Name: ").strip()
    file_path = input("File Path / Description: ").strip()
    print("Available Tags:", ", ".join(ALLOWED_TAGS.keys()))
    tag = input("Tag: ").strip().lower()
    if tag not in ALLOWED_TAGS:
        print(f"❌ Invalid tag '{tag}'")
        return
    try:
        conn = get_connection("sosueme")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO report (file_name,file_path,tag,user_id) VALUES (%s,%s,%s,%s)",(file_name,file_path,tag,user['user_id']))
        report_id = cursor.lastrowid
        conn.commit()
        muni_conn = get_connection("municipality")
        muni_cursor = muni_conn.cursor()
        muni_cursor.execute("INSERT INTO pending_reports (report_id,file_name,file_path,tag,user_id,status) VALUES (%s,%s,%s,%s,%s,'pending')",(report_id,file_name,file_path,tag,user['user_id']))
        muni_cursor.execute("INSERT INTO status_log (report_id,old_status,new_status) VALUES (%s,%s,%s)",(report_id,None,'pending'))
        muni_conn.commit()
        print(f"📄 Report '{file_name}' submitted successfully with ID {report_id}!")
    finally:
        for x in ['cursor','conn','muni_cursor','muni_conn']:
            if x in locals() and locals()[x]: locals()[x].close() if hasattr(locals()[x],'close') else None

def view_my_reports(user):
    print("\n📂 My Reports")
    tag_filter = input("Filter by tag (or 'all'): ").strip().lower()
    try:
        conn = get_connection("sosueme")
        cursor = conn.cursor(dictionary=True)
        if tag_filter=='all':
            cursor.execute("SELECT * FROM report WHERE user_id=%s ORDER BY created_at DESC",(user['user_id'],))
        else:
          cursor.execute("SELECT * FROM report WHERE user_id=%s AND tag=%s ORDER BY created_at DESC",(user['user_id'],tag_filter))
        reports = cursor.fetchall()
        for r in reports:
            status_icon = "🕒 Pending"
            try:
                muni_conn = get_connection("municipality")
                muni_cursor = muni_conn.cursor(dictionary=True)
                muni_cursor.execute("SELECT status FROM pending_reports WHERE report_id=%s",(r['report_id'],))
                s = muni_cursor.fetchone()
                if s:
                    status_icon = "✅ Approved" if s['status']=='approved' else "❌ Rejected" if s['status']=='rejected' else "🕒 Pending"
            finally:
                if 'muni_cursor' in locals() and muni_cursor: muni_cursor.close()
                if 'muni_conn' in locals() and muni_conn and muni_conn.is_connected(): muni_conn.close()
            print(f"ID:{r['report_id']} | 📄 {r['file_name']} | 🏷️ {r['tag']} | {status_icon} | {r['created_at']}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals() and conn.is_connected(): conn.close()

# -------------------------
# Admin Functions
# -------------------------
def list_pending_reports():
    print("\n📝 Pending Reports")
    try:
        conn = get_connection("municipality")
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM pending_reports WHERE status='pending' ORDER BY submitted_at ASC")
        rows = cursor.fetchall()
        for r in rows:
            print(f"ID:{r['report_id']} | 📄 {r['file_name']} | 🏷️ {r['tag']} | User:{r['user_id']} | 🕒 {r['submitted_at']}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals() and conn.is_connected(): conn.close()

def approve_report():
    rid = int(input("Enter Report ID to Approve: "))
    try:
        conn = get_connection("municipality")
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM pending_reports WHERE report_id=%s",(rid,))
        r = cursor.fetchone()
        if not r or r['status']!='pending':
            print("❌ Not found or already processed"); return
        old_status = r['status']
        cursor.execute("UPDATE pending_reports SET status='approved' WHERE report_id=%s",(rid,))
        cursor.execute("INSERT INTO status_log (report_id,old_status,new_status) VALUES (%s,%s,%s)",(rid,old_status,'approved'))
        conn.commit()
        dept_conn = get_connection(ALLOWED_TAGS[r['tag']])
        dept_cursor = dept_conn.cursor()
        dept_cursor.execute("INSERT INTO resolved_reports (report_id,file_name,file_path,tag,user_id) VALUES (%s,%s,%s,%s,%s)",(rid,r['file_name'],r['file_path'],r['tag'],r['user_id']))
        dept_conn.commit()
        print(f"✅ Report {rid} approved and sent to department!")
    finally:
        for x in ['cursor','conn','dept_cursor','dept_conn']:
            if x in locals() and locals()[x]: locals()[x].close() if hasattr(locals()[x],'close') else None

def reject_report():
    rid = int(input("Enter Report ID to Reject: "))
    reason = input("Optional reason: ").strip()
    try:
        conn = get_connection("municipality")
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM pending_reports WHERE report_id=%s",(rid,))
        r = cursor.fetchone()
        if not r or r['status']!='pending':
            print("❌ Not found or already processed"); return
        old_status = r['status']
        cursor.execute("UPDATE pending_reports SET status='rejected' WHERE report_id=%s",(rid,))
        cursor.execute("INSERT INTO status_log (report_id,old_status,new_status) VALUES (%s,%s,%s)",(rid,old_status,'rejected'))
        conn.commit()
        print(f"❌ Report {rid} rejected! Reason: {reason}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals() and conn.is_connected(): conn.close()
# -------------------------
# Department View
# -------------------------
def department_view():
    tag = input(f"Enter department tag ({', '.join(ALLOWED_TAGS.keys())}): ").strip()
    if tag not in ALLOWED_TAGS:
        print("❌ Invalid tag"); return
    db = ALLOWED_TAGS[tag]
    try:
        conn = get_connection(db)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM resolved_reports ORDER BY received_at DESC")
        rows = cursor.fetchall()
        print(f"\n🏛️ Resolved Reports ({tag})")
        for r in rows:
            print(f"ID:{r['report_id']} | 📄 {r['file_name']} | User:{r['user_id']} | ✅ {r['received_at']}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals() and conn.is_connected(): conn.close()

# -------------------------
# Menus
# -------------------------
def user_menu(user):
    while True:
        print("\n" + "="*40)
        print(f"👤 User Menu - {user['user_name']}")
        print("1️⃣  Submit Report")
        print("2️⃣  My Reports")
        print("3️⃣  Logout")
        print("="*40)
        choice = input("Select option: ").strip()
        if choice=='1': submit_report(user)
        elif choice=='2': view_my_reports(user)
        elif choice=='3': break

def admin_menu():
    while True:
        print("\n" + "="*40)
        print("🛠️ Admin Menu")
        print("1️⃣  List Pending Reports")
        print("2️⃣  Approve Report")
        print("3️⃣  Reject Report")
        print("4️⃣  Back")
        print("="*40)
        choice = input("Select option: ").strip()
        if choice=='1': list_pending_reports()
        elif choice=='2': approve_report()
        elif choice=='3': reject_report()
        elif choice=='4': break

def main_menu():
    while True:
        print("\n" + "="*50)
        print("🏛️  Municipality Portal CLI")
        print("1️⃣  Register")
        print("2️⃣  Login")
        print("3️⃣  Admin")
        print("4️⃣  Department")
        print("5️⃣  Setup Databases")
        print("6️⃣  Exit")
        print("="*50)
        choice = input("Select option: ").strip()
        if choice=='1': register_user()
        elif choice=='2':
            user = login_user()
            if user: user_menu(user)
        elif choice=='3': admin_menu()
        elif choice=='4': department_view()
        elif choice=='5': setup_all_databases()
        elif choice=='6': print("👋 Goodbye!"); break

if name=="main":
    try:
        test_conn = get_connection()
        test_conn.close()
    except Exception as e:
        print(f"❌ Cannot connect to MySQL: {e}")
        sys.exit(1)
    main_menu()
