# LegalLink

LegalLink is a web application that assists users in managing legal cases and documents. It provides an easy-to-use interface for uploading, reading, and writing documents, as well as managing case-related information. The AI component takes case descriptions and grades them, identifying green and red flags for the case.

## Getting Started

These instructions will guide you through the process of setting up and running LegalLink locally on your machine for development and testing purposes.

### Prerequisites

Before getting started, make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/en/) (v14.x or later)

### Installation

Follow these steps to set up LegalLink on your local machine:

1. Clone the repository:

`git clone https://github.com/timanese/LegalLink.git`

2. Navigate to the `backend` directory and install the required dependencies:

```
cd LegalLink/backend
npm install
```

3. Start the backend server:

`npm start`

This will start the backend server on `http://localhost:3001` (or another port, if 3001 is occupied).

4. Open a new terminal window or tab, and navigate to the `legal-link-ui` directory:

```
cd ../legal-link-ui
```

5. Install the required dependencies:

```
npm install
```

6. Start the frontend development server:
   `npm start`

This will start the frontend development server on `http://localhost:3000` (or another port, if 3000 is occupied).

7. Open your web browser and navigate to `http://localhost:3000` to access the LegalLink application.

## Usage

With LegalLink running locally, you can now:

- Create and manage legal cases
- Upload, read, and write documents in various formats (e.g., DOCX, PDF)
- Fill out forms and validate required fields to ensure accuracy and completeness
- Use the AI component to analyze case descriptions, grade them, and identify green and red flags for the case

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
