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
