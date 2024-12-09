# Kit Ledger
## Open Source Framework for Transactional Systems

**Kit Ledger** is an open-source framework designed to simplify the development of transactional systems using the double-entry accounting principles. 

### License

This project is licensed under the terms of the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

### Installation

(Instructions to be added soon)

### Warning

While Kit Ledger discourages direct database access, it technically cannot be prevented. Keep in mind that:

* **Manual database interaction should be done with extreme caution** and only by users who understand how to operate a Postgres database.
* **Manually altering the database schema or directly modifying/adding data** can lead to inconsistencies and errors. These issues are not covered under any warranty provided by this project (refer back to the License).

### Open Source Guidelines

We appreciate your contribution to Kit Ledger! To ensure a smooth development process, please consider the following guidelines:

* **Use the authorized issue templates:**  Clearly describe your issue by using one of the provided templates. This helps us categorize and address your concern efficiently.
* **Reproducibility:** If you are reporting a bug, please provide steps to reproduce the issue consistently. 
* **Support:**  This project is offered as open-source software. There is no obligation to provide support services or comply with a service level agreement (SLA) when addressing issues.

**For paid support options governed by an SLA, please contact abarreraaponte@icloud.com**


## Style Guide
# TypeScript Style Guide

## File Organization

Files must be named using `snake_case`:
```typescript
// ✅ Good
user_service.ts
authentication_helper.ts

// ❌ Bad
userService.ts
AuthenticationHelper.ts
```

## Naming Conventions

### Variables and Constants
Use `camelCase`:
```typescript
// ✅ Good
const userId = 1;
let userCount = 0;

// ❌ Bad
const user_id = 1;
let User_Count = 0;
```
[!IMPORTANT]
Exempt from this rule are constans or variables that refer directly to SQL tables, such as the ones found in the schema.ts file.

### Properties
Use `snake_case`:
```typescript
// ✅ Good
interface User {
    user_id: number;
    first_name: string;
}

// ❌ Bad
interface User {
    userId: number;
    firstName: string;
}
```

### Classes, Types, and Interfaces
Use `PascalCase`:
```typescript
// ✅ Good
class UserService {}
type UserData = string;
interface UserInterface {}

// ❌ Bad
class user_service {}
type userData = string;
interface userInterface {}
```

### Functions
Use `camelCase`:
```typescript
// ✅ Good
function getData() {}
const processUser = () => {};

// ❌ Bad
function GetData() {}
const Process_User = () => {};
```

## Formatting

- Use tabs for indentation
- Maximum line length: 120 characters
- Use semicolons
- Use single quotes for strings
- Indentation width: 4 spaces

Note: These formatting rules are configured with the built-in Deno formatter. In order to apply them, run:
```bash
deno task format
```