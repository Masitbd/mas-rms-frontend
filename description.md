# Project Description

This project is a restaurant management system built with Next.js. Below are the identified routes in the application.

## Application Routes

### Public Routes
- `/` - Root Page
- `/login` - Login Page
- `/signup` - Signup Page
- `/reset-password/[token]` - Password Reset Page
- `/unauthorized` - Unauthorized Access Page

### Indoor Layout Routes (Management/Staff)
- `/home` - Management Dashboard
- `/branch` - Branch Management
- `/cancellation` - Order Cancellations
- `/cancellation/[id]` - Specific Cancellation Details
- `/consumption` - Consumption Management
- `/consumption/new` - New Consumption Entry
- `/customers` - Customer Management
- `/items` - Item Management
- `/menu-group` - Menu Group Setup
- `/order` - Order Management
- `/order/new` - Create New Order
- `/profile` - User Profile
- `/raw-material-setup` - Raw Material Configuration
- `/setting` - General Settings
- `/table` - Table Management
- `/users` - User Management
- `/users/new` - Add New User
- `/waiter` - Waiter Management
- `/welcome-page` - Welcome Screen

#### Reports
- `/reports/daily-sales-report` - Daily Sales Report
- `/reports/daily-sales-report-v2` - Daily Sales Report V2
- `/reports/daily-sales-summery` - Daily Sales Summary
- `/reports/daily-sales-summery-v2` - Daily Sales Summary V2
- `/reports/due-sales-statement` - Due Sales Statement
- `/reports/item-wise-raw-material-consumption` - Item-wise Raw Material Consumption
- `/reports/item-wise-sales` - Item-wise Sales
- `/reports/item-wise-sales-v2` - Item-wise Sales V2
- `/reports/menu-item-consumption` - Menu Item Consumption
- `/reports/menu-item-costing` - Menu Item Costing
- `/reports/menu-items` - Menu Items List
- `/reports/raw-material-consumption` - Raw Material Consumption
- `/reports/waiter-wise-sales` - Waiter-wise Sales
- `/reports/waiter-wise-sales-details` - Waiter-wise Sales Details

### Consumer Routes
- `/consumer/home` - Consumer Landing Page
- `/consumer/category` - Item Categories
- `/consumer/checkout` - Checkout Process
- `/consumer/delivery-addresses` - Manage Delivery Addresses
- `/consumer/orders` - Consumer Order History
- `/consumer/orders/[id]` - Order Details
- `/consumer/orders/cancellation/[id]` - Consumer Order Cancellation
- `/consumer/profile` - Consumer Profile

### API Routes
- `/api/auth/[...nextauth]` - NextAuth authentication routes
