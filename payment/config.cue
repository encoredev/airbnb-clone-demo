package payment

#baseURL: [
    if #Meta.Environment.Cloud == "local" { "http://localhost:3000" },
    "https://example.org"
][0]

Checkout: {
    SuccessURL: #baseURL + "/success"
    CancelURL: #baseURL + "/cancel"
}

if #Meta.Environment.Cloud == "local" {}