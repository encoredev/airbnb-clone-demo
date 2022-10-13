package payment

if #Meta.Environment.Cloud == "local" {
    LocalWebhookSecret: "foo"
}