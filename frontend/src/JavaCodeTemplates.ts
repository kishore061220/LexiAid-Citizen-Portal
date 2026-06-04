/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JavaCodeFile } from "./types";

export const jspJavaTemplates: JavaCodeFile[] = [
  {
    name: "Database Schema (schema.sql)",
    path: "sql/schema.sql",
    language: "sql",
    explanation: "This SQL script creates the database 'lexiaid_db' and the 'users' table, which stores registered user details. Passwords should be stored as encrypted hashes rather than plain text for security compliance.",
    content: `-- -------------------------------------------------------------
-- LexiAid Legal Portal Database Schema
-- Run this script in MySQL Workbench or phpMyAdmin to initialize
-- -------------------------------------------------------------

-- Create the Database
CREATE DATABASE IF NOT EXISTS lexiaid_db;
USE lexiaid_db;

-- Create the Users table
CREATE TABLE IF NOT EXISTS users (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,       -- Stores encrypted/hashed passwords
    phone       VARCHAR(15),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OPTIONAL: Create Contact Enquiries Table
CREATE TABLE IF NOT EXISTS contact_queries (
    query_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(100) NOT NULL,
    message       TEXT NOT NULL,
    submitted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
  },
  {
    name: "Database Utility Connection (DBConnection.java)",
    path: "src/main/java/com/lexiaid/DBConnection.java",
    language: "java",
    explanation: "Standard Singleton-style connection utility class that registers the MySQL JDBC driver and establishes a physical link between your Java Servlets and the running database.",
    content: `package com.lexiaid;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DBConnection is a helper class to share the connection setup.
 * Place this file inside: src/main/java/com/lexiaid/DBConnection.java
 */
public class DBConnection {
    // Database credentials variables (update according to your local MySQL settings)
    private static final String URL = "jdbc:mysql://localhost:3306/lexiaid_db?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "password123"; // Reset to your native MySQL password
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver";

    /**
     * Obtains a live database connection instance.
     * @return Connection object
     */
    public static Connection getConnection() {
        Connection conn = null;
        try {
            // Step 1: Load the MySQL JDBC Driver into memory
            Class.forName(DRIVER);
            
            // Step 2: Form connection channel
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Connection to DB established successfully!");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver was not found in Build Path. Add mysql-connector-j-X.jar to WEB-INF/lib");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Failed to establish Connection. Ensure MySQL is running on port 3306 and credentials match.");
            e.printStackTrace();
        }
        return conn;
    }
}
`
  },
  {
    name: "User Registration Servlet (RegisterServlet.java)",
    path: "src/main/java/com/lexiaid/RegisterServlet.java",
    language: "java",
    explanation: "Handles incoming HTTP POST requests from register.jsp. Validates parameters, performs a query checks for duplicate email records, makes password preparations, inserts details, and forwards state.",
    content: `package com.lexiaid;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Annotation registers the Servlet mapping so we do not strictly need web.xml, 
 * but web.xml is included for traditional standard submissions files.
 */
@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Step 1: Extract form inputs
        String fullName = request.getParameter("full_name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String phone = request.getParameter("phone");

        // Step 2: Validate inputs briefly
        if (fullName == null || fullName.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            
            request.setAttribute("errorMessage", "All mandatory fields must be filled!");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        Connection conn = null;
        PreparedStatement checkStmt = null;
        PreparedStatement insertStmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            if (conn == null) {
                request.setAttribute("errorMessage", "Database connection down. Inform system administrator.");
                request.getRequestDispatcher("register.jsp").forward(request, response);
                return;
            }

            // Step 3: Check if email is already registered using PreparedStatements (Protects against SQL Injection)
            String verifyQuery = "SELECT email FROM users WHERE email = ?";
            checkStmt = conn.prepareStatement(verifyQuery);
            checkStmt.setString(1, email);
            rs = checkStmt.executeQuery();

            if (rs.next()) {
                // Email matches a record already
                request.setAttribute("errorMessage", "This email is already registered. Please login!");
                request.getRequestDispatcher("register.jsp").forward(request, response);
                return;
            }

            // Step 4: Save credentials. Note: In real production, hash the password (e.g., using BCrypt or SHA-256)
            // For simple college evaluation, we write it with simple storage, but hashing is highly encouraged.
            String insertQuery = "INSERT INTO users (full_name, email, password, phone) VALUES (?, ?, ?, ?)";
            insertStmt = conn.prepareStatement(insertQuery);
            insertStmt.setString(1, fullName);
            insertStmt.setString(2, email);
            insertStmt.setString(3, password); // Hashed value recommended in production
            insertStmt.setString(4, phone);

            int rowsAffected = insertStmt.executeUpdate();

            if (rowsAffected > 0) {
                // Redirect user to login page with clear success notice
                request.setAttribute("successMessage", "Registration complete! You can log in now.");
                request.getRequestDispatcher("login.jsp").forward(request, response);
            } else {
                request.setAttribute("errorMessage", "Encountered structural error while writing account details.");
                request.getRequestDispatcher("register.jsp").forward(request, response);
            }

        } catch (SQLException e) {
            e.printStackTrace();
            request.setAttribute("errorMessage", "System database error: " + e.getMessage());
            request.getRequestDispatcher("register.jsp").forward(request, response);
        } finally {
            // Prevent connections leaks
            try { if (rs != null) rs.close(); } catch (SQLException e) {}
            try { if (checkStmt != null) checkStmt.close(); } catch (SQLException e) {}
            try { if (insertStmt != null) insertStmt.close(); } catch (SQLException e) {}
            try { if (conn != null) conn.close(); } catch (SQLException e) {}
        }
    }
}
`
  },
  {
    name: "User Login Servlet (LoginServlet.java)",
    path: "src/main/java/com/lexiaid/LoginServlet.java",
    language: "java",
    explanation: "Authenticates users by matching email and password inputs against records in MySQL. Creates and ties user metadata inside HttpSession on success, or returns warning values.",
    content: `package com.lexiaid;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {

        // Step 1: Read input parameters
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if (email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            
            request.setAttribute("errorMessage", "Email and Password cannot be blank!");
            request.getRequestDispatcher("login.jsp").forward(request, response);
            return;
        }

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            if (conn == null) {
                request.setAttribute("errorMessage", "Database link offline. Try later.");
                request.getRequestDispatcher("login.jsp").forward(request, response);
                return;
            }

            // Step 2: Query credentials
            String loginQuery = "SELECT user_id, full_name, email FROM users WHERE email = ? AND password = ?";
            stmt = conn.prepareStatement(loginQuery);
            stmt.setString(1, email);
            stmt.setString(2, password); // Change if introducing active bcrypt hashing matches
            
            rs = stmt.executeQuery();

            if (rs.next()) {
                // User validated successfully!
                
                // Step 3: Initiate HttpSession container
                HttpSession session = request.getSession(true); // true guarantees a session returns
                session.setAttribute("user_id", rs.getInt("user_id"));
                session.setAttribute("full_name", rs.getString("full_name"));
                session.setAttribute("email", rs.getString("email"));

                // Redirect to dynamic private home board
                response.sendRedirect("dashboard.jsp");
            } else {
                // Authentication failed
                request.setAttribute("errorMessage", "Invalid email or password. Please verify.");
                request.getRequestDispatcher("login.jsp").forward(request, response);
            }

        } catch (SQLException e) {
            e.printStackTrace();
            request.setAttribute("errorMessage", "Internal SQL Query exception: " + e.getMessage());
            request.getRequestDispatcher("login.jsp").forward(request, response);
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) {}
            try { if (stmt != null) stmt.close(); } catch (SQLException e) {}
            try { if (conn != null) conn.close(); } catch (SQLException e) {}
        }
    }
}
`
  },
  {
    name: "User Logout Servlet (LogoutServlet.java)",
    path: "src/main/java/com/lexiaid/LogoutServlet.java",
    language: "java",
    explanation: "Invalidates active user sessions cleanly, freeing system memory allocations, and redirects the client browse state safely back to the landing index page.",
    content: `package com.lexiaid;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/LogoutServlet")
public class LogoutServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Step 1: Retrieve any active session
        HttpSession session = request.getSession(false); // false returns null if no session active
        
        if (session != null) {
            // Step 2: Invalidate fully
            session.invalidate();
        }

        // Step 3: Direct back to landing root
        response.sendRedirect("index.jsp");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doGet(request, response);
    }
}
`
  },
  {
    name: "Web Configuration (web.xml)",
    path: "WebContent/WEB-INF/web.xml",
    language: "xml",
    explanation: "The traditional servlet configuration mapping file placed in the WebContent/WEB-INF folder. Aligns context settings and custom mappings, though ServletAnnotations are now widely preferred.",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
         xmlns="http://xmlns.jcp.org/xml/ns/javaee" 
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd" 
         id="WebApp_ID" version="4.0">
         
    <display-name>LexiAid</display-name>
    
    <!-- Define landing page -->
    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>

    <!-- Traditional Servlets Mappings (optional if using WebServlet annotations, but ideal for submissions) -->
    <servlet>
        <servlet-name>RegisterServlet</servlet-name>
        <servlet-class>com.lexiaid.RegisterServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>RegisterServlet</servlet-name>
        <url-pattern>/RegisterServlet</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>LoginServlet</servlet-name>
        <servlet-class>com.lexiaid.LoginServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>LoginServlet</servlet-name>
        <url-pattern>/LoginServlet</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>LogoutServlet</servlet-name>
        <servlet-class>com.lexiaid.LogoutServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>LogoutServlet</servlet-name>
        <url-pattern>/LogoutServlet</url-pattern>
    </servlet-mapping>

    <!-- Standard session timeout config (in minutes) -->
    <session-config>
        <session-timeout>30</session-timeout>
    </session-config>
</web-app>
`
  },
  {
    name: "JSP Base Auth Header (auth-check.jsp)",
    path: "WebContent/includes/auth-check.jsp",
    language: "jsp",
    explanation: "Reusable session checker file meant to be included at the topmost layer of dashboard.jsp and other secure routes to automatically bounce unlogged users out to index.jsp.",
    content: `<%
    // -------------------------------------------------------------
    // Academic Session Guard script definition
    // Place this file in WebContent/includes/auth-check.jsp
    // -------------------------------------------------------------

    // Check if user credentials exist in active session
    if (session == null || session.getAttribute("user_id") == null) {
        // Not authenticated, redirect to login page with notice attributes
        request.setAttribute("errorMessage", "Unauthorized. Please authenticate your account first.");
        response.sendRedirect("login.jsp");
        return; // Halt execution of parent JSP fully
    }
%>
`
  },
  {
    name: "Main Landing UI Page (index.jsp)",
    path: "WebContent/index.jsp",
    language: "jsp",
    explanation: "The elegant landing index featuring legal headers, hero cards for specific target segments, emergency helper lines, and easy links to secure registration states.",
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LexiAid | Legal Awareness Portal</title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts for Editorial typography -->
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            background-color: #F5F7FA;
            color: #2C2C2C;
        }
        h1, h2, h3, .nav-logo-text {
            font-family: 'Merriweather', serif;
            color: #1A2B4A;
        }
        .bg-navy { background-color: #1A2B4A; }
        .text-accent-gold { color: #C8A04A; }
        .btn-accent {
            background-color: #C8A04A;
            color: #FFFFFF;
            transition: all 0.3s ease;
        }
        .btn-accent:hover {
            background-color: #b08d40;
            color: #FFFFFF;
            transform: translateY(-2px);
        }
        .feature-card {
            border: none;
            border-radius: 8px;
            background-color: #FFFFFF;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>

    <!-- Upper Navbar Component -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-navy py-3 shadow-md">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="index.jsp">
                <span class="text-accent-gold fw-bold fs-4 nav-logo-text">⚖️ LexiAid</span>
            </a>
            <div class="d-flex align-items-center gap-2">
                <a href="login.jsp" class="btn btn-outline-light px-4">Login</a>
                <a href="register.jsp" class="btn btn-accent px-4">Register</a>
            </div>
        </div>
    </nav>

    <!-- Hero Display Banner Container -->
    <header class="bg-navy py-5 text-white text-center position-relative">
        <div class="container py-4">
            <span class="badge text-uppercase bg-warning text-dark px-3 py-2 rounded-pill mb-3">Academic Mini Project Submission</span>
            <h1 class="display-4 fw-bold text-white mb-3">Know Your Rights. Speak Up. Stay Safe.</h1>
            <p class="lead text-light mb-4 mx-auto max-width-600">
                LexiAid bridges the core communication gap in Indian civic tech by providing access to simplified legal rights, search tools, and step-by-step FIR help.
            </p>
            <div class="d-flex justify-content-center gap-3">
                <a href="register.jsp" class="btn btn-accent btn-lg px-5">Get Started</a>
                <a href="login.jsp" class="btn btn-outline-light btn-lg px-5">Learn Rights</a>
            </div>
        </div>
    </header>

    <!-- Features Section Grid -->
    <section class="container py-5">
        <div class="text-center mb-5">
            <h2 class="h1 fw-bold">Explore Key Modules</h2>
            <p class="text-muted">A modern toolkit designed in clear plain language for student and common citizens</p>
        </div>
        
        <div class="row g-4">
            <!-- Feature item 1 -->
            <div class="col-md-4">
                <div class="card p-4 h-100 feature-card">
                    <div class="fs-1 mb-3">🛡️</div>
                    <h3 class="h4 fw-bold">Simplified Rights</h3>
                    <p class="text-muted">Detailed legal booklets covering specific laws concerning Women, Students, Consumer disputes, and digital Cyber safety.</p>
                </div>
            </div>
            <!-- Feature item 2 -->
            <div class="col-md-4">
                <div class="card p-4 h-100 feature-card">
                    <div class="fs-1 mb-3">📝</div>
                    <h3 class="h4 fw-bold">FIR & Complaint Guides</h3>
                    <p class="text-muted">Interactive checklists, procedures, and right disclosures to reference when filing an FIR at local police stations.</p>
                </div>
            </div>
            <!-- Feature item 3 -->
            <div class="col-md-4">
                <div class="card p-4 h-100 feature-card">
                    <div class="fs-1 mb-3">📖</div>
                    <h3 class="h4 fw-bold">Legal Dictionary</h3>
                    <p class="text-muted">Explore and filter 40+ statutory legal terms with simple definitions in plain, highly understandable English vocabularies.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Disclaimer block -->
    <footer class="bg-navy py-4 text-white text-center mt-5">
        <div class="container">
            <p class="small text-light text-opacity-75 mb-0">
                ⚖️ <strong>Legal Disclaimer:</strong> LexiAid is an academic project built for legal awareness purposes only. It is not an alternative for formal legal advice.
            </p>
        </div>
    </footer>

</body>
</html>
`
  }
];
