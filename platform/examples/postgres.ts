import * as k8s from "@pulumi/kubernetes";

new k8s.helm.v3.Release("postgres", {
    chart: "postgresql",
    version: "12.2.3",
    namespace: "examples",
    name: 'postgres',
    createNamespace: true,
    repositoryOpts: {
        repo: "https://charts.bitnami.com/bitnami",
    },
    values: {
        auth: {
            postgresPassword: 'postgres'
        },
        primary: {
            service: {
                type: 'LoadBalancer'
            }
        }
    }
});