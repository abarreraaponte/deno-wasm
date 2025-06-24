# Kitledger: Project Blueprint

This document outlines the vision, architecture, and proposed file structure for the **Kitledger** project, a programmable ledger framework.

## 1. Project Vision

**Kitledger** is a high-performance, developer-first framework for building reliable, transaction-based business applications. Its core mission is to abstract away the complexities of double-entry accounting, providing developers with a robust, auditable, and easy-to-use API.

The platform will enable developers to rapidly build custom applications like inventory management systems, complex billing engines, and asset trackers on top of a secure and scalable ledgering foundation.

A key feature will be the ability to **securely execute user-submitted code** via a sandboxed WebAssembly (WASM) runtime, allowing for powerful, custom business logic.

## 2. Core Philosophy & Architecture

The project will be built using a **hyper-integrated, single-binary deployment model**. The entire application—backend API, frontend dashboard, and all static assets—will be compiled into a single, self-contained executable.

This approach offers several key advantages:

* **Simplified Deployment:** The entire application is a single file, making deployments atomic and trivial.
* **No CORS/Auth Complexity:** By serving the frontend and backend from the same origin, Cross-Origin Resource Sharing (CORS) issues are eliminated. Authentication can be handled with secure, server-side `httpOnly` cookies instead of client-side JWT management.
* **Transactional Consistency:** It is impossible to deploy a version of the backend that is out of sync with its frontend assets, as they are part of the same binary.
* **Performance:** Critical pages and email templates can be rendered server-side for maximum speed and SEO compatibility.

The backend infrastructure will be defined as code and designed to be "all-in" on **AWS** for scalability and reliability, with a "self-hosted" model that allows users to deploy the entire stack into their own AWS accounts via an IaC template.

## 3. Technology Stack

* **Backend Language:** **Rust** for its performance, memory safety, and top-tier WebAssembly support.
* **Web Framework:** **Axum** for its robustness, performance, and deep integration with the Tokio ecosystem.
* **Frontend Framework:** **React** (with **Vite**) for building a modern, responsive user dashboard.
* **Server-Side Templates:** **Askama** for compile-time checked HTML templates (e.g., for email).
* **Asset Bundling:** **`rust-embed`** to embed the compiled frontend assets directly into the final Rust binary.
* **Infrastructure-as-Code (IaC):** **OpenTofu** for its open-source, future-proof nature, defining all AWS resources.
* **Cloud Platform:** **AWS**, leveraging services like Fargate (for containers) and DynamoDB (for data).
* **Sandboxed Code Execution:** **Wasmtime** (or a similar runtime) to securely run user-submitted WASM modules within the Rust application.

## 4. Proposed File Structure

The project will be structured as a unified Cargo project that contains the frontend code and infrastructure definitions.

```plaintext
kitledger/
├── .gitignore              # Standard gitignore for Rust, Node, and OpenTofu.
├── Cargo.toml              # The root Cargo manifest for the entire Rust backend.
├── build.rs                # Build script to trigger the Vite build for release.
├── README.md               # Project overview, setup, and usage instructions.

├── src/                    # All Rust source code.
│   ├── api/                # Handlers for the JSON data API (/api/v1/...).
│   ├── core/               # Core ledger logic, data structures, and rules.
│   ├── web/                # Handlers for server-side rendered pages & frontend assets.
│   ├── wasm_runner/        # Logic for securely executing user WASM modules.
│   ├── templates/          # Askama HTML templates for emails, etc.
│   └── main.rs             # Main application entry point. Configures Axum router.

├── frontend/               # The self-contained React/Vite project.
│   ├── public/             # Static assets for Vite.
│   ├── src/                # React components, pages, hooks, etc.
│   ├── index.html          # The root HTML file for the SPA.
│   ├── package.json        # Frontend dependencies and build scripts.
│   └── vite.config.js      # Vite configuration, including dev proxy to the Rust backend.

└── infra/                  # OpenTofu Infrastructure-as-Code.
    ├── modules/            # Reusable infrastructure components (e.g., Fargate service).
    │   ├── fargate_service/
    │   │   ├── main.tf
    │   │   ├── variables.tf
    │   │   └── outputs.tf
    │   └── dynamodb_ledger_table/
    │       └── ...
    └── environments/       # Environment-specific configurations (dev, prod).
        ├── dev/
        │   ├── main.tf
        │   ├── terraform.tfvars
        │   └── backend.tf
        └── prod/
            └── ...
