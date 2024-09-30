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


-----


# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.