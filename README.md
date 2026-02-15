# 📦 Inventory Manager
 
A comprehensive full-stack inventory management system built with React, TypeScript, Spring Boot, and PostgreSQL. This application provides efficient management of products, raw materials, and production planning with a modern, responsive interface.
 
## 🚀 Features
 
### Core Functionality
- **Product Management**: Create, read, update, and delete products with pricing and material requirements
- **Raw Material Management**: Track inventory levels, costs, and manage stock quantities
- **Production Planning**: Smart production suggestions based on available raw materials
- **Material Relationships**: Define which raw materials are required for each product
- **Real-time Updates**: Instant synchronization between frontend and backend
 
### Technical Features
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Type Safety**: Full TypeScript implementation in frontend
- **RESTful API**: Clean and well-documented backend endpoints
- **Database Integration**: PostgreSQL with JPA/Hibernate ORM
- **CORS Support**: Proper cross-origin resource sharing configuration
- **Modern UI**: Clean, intuitive interface with smooth interactions
 
## 🛠️ Tech Stack
 
### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing
- **Vitest** - Testing framework
 
### Backend
- **Spring Boot 3.2.5** - Java application framework
- **Spring Data JPA** - Database abstraction layer
- **PostgreSQL** - Relational database
- **Maven** - Dependency management and build tool
- **Jackson** - JSON processing
- **Spring Web** - REST API framework
 
## 📋 Prerequisites
 
Before running this application, ensure you have the following installed:
 
- **Node.js** (v18 or higher)
- **Java 17** or higher
- **PostgreSQL** (v12 or higher)
- **Maven** (3.6 or higher) - or use the included Maven wrapper
 
## 🗄️ Database Setup
 
1. **Install PostgreSQL** on your system
2. **Create a database**:
   ```sql
   CREATE DATABASE inventory_db;
   ```
3. **Create a user** (optional, if not using default postgres user):
   ```sql
   CREATE USER postgres WITH PASSWORD '123';
   GRANT ALL PRIVILEGES ON DATABASE inventory_db TO postgres;
   ```
 
## 🚀 Quick Start
 
### 1. Clone the Repository
```bash
git clone <repository-url>
cd Inventory_Project
```
 
### 2. Backend Setup
 
Navigate to the backend directory:
```bash
cd back-end
```
 
Configure the database connection in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/inventory_db
spring.datasource.username=postgres
spring.datasource.password=123
```
 
Run the Spring Boot application:
```bash
# Using Maven wrapper (recommended)
./mvnw spring-boot:run
 
# Or using system Maven
mvn spring-boot:run
```
 
The backend will start on `http://localhost:8081`
 
### 3. Frontend Setup
 
Navigate to the frontend directory:
```bash
cd ../Front-end
```
 
Install dependencies:
```bash
npm install
```
 
Start the development server:
```bash
npm run dev
```
 
The frontend will start on `http://localhost:5173`
 
### 4. Access the Application
 
Open your browser and navigate to `http://localhost:5173`
 
## 📁 Project Structure
 
```
Inventory_Project/
├── back-end/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/projedata/inventory/
│   │       │   ├── config/          # Configuration classes
│   │       │   ├── controller/       # REST API controllers
│   │       │   ├── model/           # JPA entities
│   │       │   ├── repository/       # Data access layer
│   │       │   ├── service/         # Business logic
│   │       │   └── InventoryApplication.java
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── mvnw, mvnw.cmd               # Maven wrapper
│
└── Front-end/
    ├── src/
    │   ├── components/               # Reusable UI components
    │   ├── pages/                   # Page components
    │   ├── services/                # API service layer
    │   ├── types/                   # TypeScript type definitions
    │   └── tests/                   # Test files
    ├── public/
    ├── package.json
    └── vite.config.ts
```
 
## 🔌 API Endpoints
 
### Products
- `GET /products` - Get all products
- `POST /products` - Create a new product
- `GET /products/{id}` - Get product by ID
- `PUT /products/{id}` - Update a product
- `DELETE /products/{id}` - Delete a product
 
### Raw Materials
- `GET /raw-materials` - Get all raw materials
- `POST /raw-materials` - Create a new raw material
- `GET /raw-materials/{id}` - Get raw material by ID
- `PUT /raw-materials/{id}` - Update a raw material
- `DELETE /raw-materials/{id}` - Delete a raw material
 
### Production
- `GET /production/suggestions` - Get production suggestions based on available materials
 
### Product Materials
- `GET /product-materials` - Get all product-material relationships
- `POST /product-materials` - Create a new product-material relationship
- `GET /product-materials/{id}` - Get relationship by ID
- `PUT /product-materials/{id}` - Update relationship
- `DELETE /product-materials/{id}` - Delete relationship
- `GET /product-materials/product/{productId}` - Get materials for a specific product
 
## 🧪 Testing
 
### Frontend Tests
```bash
cd Front-end
npm test
```
 
### Backend Tests
```bash
cd back-end
./mvnw test
```
 
## 🔧 Configuration
 
### Environment Variables
 
Backend configuration is handled through `application.properties`:
 
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/inventory_db
spring.datasource.username=postgres
spring.datasource.password=123
 
# Server Configuration
server.port=8081
 
# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```
 
### CORS Configuration
 
The application is configured to allow requests from `http://localhost:5173` (the default frontend development server). This can be modified in `CorsConfig.java`.
 
## 📊 Database Schema
 
### Products Table
- `id` (Long, Primary Key)
- `code` (String, Unique)
- `name` (String)
- `price` (BigDecimal)
 
### Raw Materials Table
- `id` (Long, Primary Key)
- `code` (String, Unique)
- `name` (String)
- `stockQuantity` (Integer)
- `unit` (String)
- `costPerUnit` (BigDecimal)
 
### Product Materials Table (Join Table)
- `id` (Long, Primary Key)
- `product_id` (Long, Foreign Key)
- `raw_material_id` (Long, Foreign Key)
- `quantityRequired` (BigDecimal)
 
## 🐛 Troubleshooting
 
### Common Issues
 
1. **Port Already in Use**
   - Change the server port in `application.properties`
   - Or kill the process using the port:
     ```bash
     # On Windows
     netstat -ano | findstr :8081
     taskkill /PID <PID> /F
     ```
 
2. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Verify database credentials in `application.properties`
   - Check if the database exists
 
3. **CORS Errors**
   - Verify the frontend URL in `CorsConfig.java`
   - Ensure the backend is running before accessing the frontend
 
4. **Maven Build Issues**
   - Try cleaning and rebuilding:
     ```bash
     ./mvnw clean install
     ```
 
## 🤝 Contributing
 
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
 
## 📝 License
 
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 
## 📞 Support
 
If you encounter any issues or have questions, please:
 
1. Check the troubleshooting section above
2. Search existing issues (if available)
3. Create a new issue with detailed information about your problem
 
## 🚀 Future Enhancements
 
- [ ] User authentication and authorization
- [ ] Advanced reporting and analytics
- [ ] Barcode/QR code scanning
- [ ] Email notifications for low stock
- [ ] Mobile app version
- [ ] Multi-warehouse support
- [ ] Supplier management
- [ ] Purchase order management
- [ ] Audit logging
- [ ] Data export/import functionality
 
---
 
**Built with ❤️ using modern web technologies**
 

Perfect! I've created a comprehensive README.md file for your
